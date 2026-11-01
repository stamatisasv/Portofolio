import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {Window} from 'happy-dom';

const files=await readdir(new URL('../dist/assets/',import.meta.url));
const script=await readFile(new URL(`../dist/assets/${files.find(f=>f.endsWith('.js'))}`,import.meta.url),'utf8');
async function setup(hash=''){
 const window=new Window({url:`https://example.com/Portofolio/${hash}`});
 window.document.body.innerHTML='<div id="app"></div>';
 window.IntersectionObserver=class {observe(){} disconnect(){}};
 window.scrollTo=()=>{};
 window.eval(script);
 const doc=window.document;
 const button=doc.querySelector('.menu-toggle');
 const menu=doc.querySelector('#mobile-menu');
 const contact=menu.querySelector('a[href="#/contact"]');
 const work=menu.querySelector('a[href="#/"]');
 const settle=()=>new Promise(resolve=>setTimeout(resolve,15));
 return {window,doc,button,menu,contact,work,settle};
}
test('mobile tap remains actionable after trigger blur, then Contact and Work navigate repeatedly',async()=>{
 const c=await setup();
 try{
  for(let i=0;i<3;i++){
   c.button.focus();c.button.click();assert.equal(c.menu.inert,false);
   // Reproduce the touch ordering: trigger loses focus before link click.
   c.button.blur();await c.settle();
   assert.equal(c.menu.inert,false,'Transient focus loss must not disable the link');
   assert.equal(c.button.getAttribute('aria-expanded'),'true');
   c.contact.click();await c.settle();
   assert.equal(c.window.location.hash,'#/contact');
   assert.equal(c.doc.querySelector('main h1').textContent,'Contact');
   assert.equal(c.doc.querySelectorAll('main .contact-detail').length,3);
   assert.equal(c.menu.inert,true);assert.equal(c.button.getAttribute('aria-expanded'),'false');
   assert.match(c.window.document.title,/Contact/);
   c.button.click();c.work.click();await c.settle();
   assert.equal(c.window.location.hash,'#/');assert.ok(c.doc.querySelector('main .work-grid'));
  }
 }finally{await c.window.happyDOM.close()}
});
test('same-route selection closes menu; Escape and outside activation close it',async()=>{
 const c=await setup('#/contact');
 try{
  c.button.click();c.contact.click();await c.settle();assert.equal(c.menu.inert,true);assert.ok(c.doc.querySelector('main .contact'));
  c.button.click();c.contact.focus();c.doc.dispatchEvent(new c.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(c.menu.inert,true);assert.equal(c.doc.activeElement,c.button);
  c.button.click();c.doc.querySelector('main').click();assert.equal(c.menu.inert,true);
  c.button.click();c.button.click();assert.equal(c.menu.inert,true);
 }finally{await c.window.happyDOM.close()}
});
test('direct Contact load and browser back preserve route rendering',async()=>{
 const c=await setup('#/contact');
 try{
  assert.ok(c.doc.querySelector('main .contact'));
  c.button.click();c.work.click();await c.settle();
  c.window.history.back();await c.settle();
  assert.equal(c.window.location.hash,'#/contact');assert.ok(c.doc.querySelector('main .contact'));
 }finally{await c.window.happyDOM.close()}
});
test('email links remain native and menu stays enabled during mail app handoff',async()=>{
 const c=await setup('#/contact');
 try{
  c.button.click();
  let intercepted=false;
  c.doc.addEventListener('click',event=>{if(event.target.closest?.('a[href^="mailto:"]')){intercepted=event.defaultPrevented;event.preventDefault()}});
  for(const email of c.doc.querySelectorAll('a[href^="mailto:"]')){
   assert.equal(email.getAttribute('href'),'mailto:asvestasstamatis@gmail.com');
   assert.equal(email.hasAttribute('target'),false);
   const event=new c.window.MouseEvent('click',{bubbles:true,cancelable:true});
   email.dispatchEvent(event);
   assert.equal(intercepted,false);
  }
  if(c.menu.inert)c.button.click();
  c.menu.querySelector('a[href^="mailto:"]').click();
  await c.settle();
  assert.equal(c.menu.inert,false,'External app launch must not disable the menu');
  const gmail=c.menu.querySelector('.gmail-link');
  assert.equal(new URL(gmail.href).searchParams.get('to'),'asvestasstamatis@gmail.com');
  assert.equal(c.doc.querySelector('main .gmail-link'),null);
  assert.equal(c.doc.querySelector('#app').classList.contains('contact-page'),true);
 }finally{await c.window.happyDOM.close()}
});

test('every project page includes a recommendations carousel after its gallery',async()=>{
 const c=await setup();
 try{
  const routes=[...c.doc.querySelectorAll('main .work-grid .project-card')].map(a=>a.getAttribute('href'));
  assert.equal(routes.length,9);
  for(const route of routes){
   c.window.location.hash=route;await c.settle();
   const gallery=c.doc.querySelector('main .gallery');
   const section=c.doc.querySelector('main .related');
   assert.ok(gallery,route);
   assert.equal(gallery.nextElementSibling,section,route);
   assert.equal(section.getAttribute('aria-roledescription'),'carousel');
   const cards=section.querySelectorAll('.recommendation-track > .project-card');
   assert.equal(cards.length,(routes.length-1)*2);
   assert.equal([...cards].filter(card=>!card.hasAttribute('aria-hidden')).length,routes.length-1);
   assert.ok([...cards].every(card=>card.getAttribute('href')!==route));
  }
 }finally{await c.window.happyDOM.close()}
});

test('home includes an automatically scrolling project carousel below the grid',async()=>{
 const c=await setup();
 try{
  const grid=c.doc.querySelector('main .work-grid');
  const carousel=c.doc.querySelector('main .related');
  assert.equal(grid.nextElementSibling,carousel);
  assert.equal(carousel.querySelector('h2').textContent,'Explore projects');
  assert.equal(carousel.querySelectorAll('.project-card:not([aria-hidden])').length,9);
  assert.equal(carousel.querySelectorAll('button').length,0);
  c.window.location.hash='#/project/shisha-nomads';await c.settle();
  assert.equal(c.doc.querySelector('main h1').textContent,'The Shisha Nomads');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2025');
  assert.equal(c.doc.querySelector('.youtube-link'),null);
  assert.equal(c.doc.querySelector('.project-subtitle').textContent,'Product Photography');
  assert.ok(c.doc.querySelector('.product-gallery'));
  assert.deepEqual([...c.doc.querySelectorAll('.gallery video')].map(v=>v.dataset.source.split('/').pop()),['video-1.mp4','video-3.mp4']);
  assert.equal(c.doc.querySelectorAll('.gallery video').length,2);
  assert.ok([...c.doc.querySelectorAll('.gallery video')].every(v=>v.preload==='none'&&!v.hasAttribute('src')));
  assert.equal(c.doc.querySelectorAll('.gallery img[src*="story-"]').length,7);
  assert.equal(c.doc.querySelector('.gallery img[src$="logo.png"]'),null);
  assert.ok(c.doc.querySelector('.gallery img[src$="menu.jpg"]'));
  assert.equal(c.doc.querySelectorAll('.gallery > img, .gallery .image-row img').length,20);
 }finally{await c.window.happyDOM.close()}
});

test('videos start muted and only one video can be unmuted on a page',async()=>{
 const c=await setup('#/project/shisha-nomads');
 try{
  const pair=c.doc.querySelector('.video-pair');
  const videos=[...pair.querySelectorAll('video')];
  const buttons=[...pair.querySelectorAll('.video-mute')];
  assert.equal(videos.length,2);
  assert.equal(buttons.length,2);
  assert.ok(videos.every(v=>v.muted&&!v.controls));
  assert.ok(buttons.every(b=>b.textContent==='Unmute'));
  buttons[0].click();await c.settle();
  assert.equal(videos[0].muted,false);assert.equal(videos[1].muted,true);
  assert.equal(buttons[0].textContent,'Mute');
  buttons[1].click();await c.settle();
  assert.equal(videos[0].muted,true);assert.equal(videos[1].muted,false);
  assert.equal(buttons[0].textContent,'Unmute');assert.equal(buttons[1].textContent,'Mute');
  buttons[1].click();await c.settle();
  assert.ok(videos.every(v=>v.muted));
  c.doc.querySelector('main').click();await c.settle();
  assert.ok(videos.every(v=>v.muted));
  buttons[0].click();await c.settle();
  c.window.location.hash='#/project/euro-zese';await c.settle();
  assert.ok([...c.doc.querySelectorAll('.gallery video')].every(v=>v.muted));
 }finally{await c.window.happyDOM.close()}
});
