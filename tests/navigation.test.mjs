import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {Window} from 'happy-dom';

const files=await readdir(new URL('../dist/assets/',import.meta.url));
const script=await readFile(new URL(`../dist/assets/${files.find(f=>f.endsWith('.js'))}`,import.meta.url),'utf8');
async function setup(hash='',width=1024){
 const window=new Window({url:`https://example.com/Portofolio/${hash}`});
 window.happyDOM.setWindowSize({width,height:800});
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
  assert.equal(routes.length,25);
  for(const route of routes){
   c.window.location.hash=route;await c.settle();
   const gallery=c.doc.querySelector('main .gallery');
   const section=c.doc.querySelector('main .related');
   assert.ok(gallery,route);
   if(!['#/project/skin-care-lab','#/project/reborn','#/project/athens'].includes(route)){
    assert.equal(gallery.lastElementChild.tagName,'IMG',route);
    assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.(jpg|webp)$|pending\.svg$|upcoming\.svg$/,route);
   }else{
    assert.equal(gallery.querySelector(':scope > img'),null);
    assert.ok([...gallery.querySelectorAll('.postcard-grid img')].every(img=>!/giveaway/i.test(img.alt)));
   }
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
  assert.equal(carousel.querySelectorAll('.project-card:not([aria-hidden])').length,25);
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
  assert.equal(c.doc.querySelectorAll('.gallery > img, .gallery .image-row img').length,21);
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
  assert.ok(buttons.every(b=>b.title==='Unmute'));
  buttons[0].click();await c.settle();
  assert.equal(videos[0].muted,false);assert.equal(videos[1].muted,true);
  assert.equal(buttons[0].title,'Mute');
  buttons[1].click();await c.settle();
  assert.equal(videos[0].muted,true);assert.equal(videos[1].muted,false);
  assert.equal(buttons[0].title,'Unmute');assert.equal(buttons[1].title,'Mute');
  buttons[1].click();await c.settle();
  assert.ok(videos.every(v=>v.muted));
  c.doc.querySelector('main').click();await c.settle();
  assert.ok(videos.every(v=>v.muted));
  buttons[0].click();await c.settle();
  c.window.location.hash='#/project/euro-zese';await c.settle();
  assert.ok([...c.doc.querySelectorAll('.gallery video')].every(v=>v.muted));
 }finally{await c.window.happyDOM.close()}
});

test('Mona Lisa shows a landscape video, editorial stills, then its thumbnail',async()=>{
 const c=await setup('#/project/mona-lisa');
 try{
  const gallery=c.doc.querySelector('.gallery');
  assert.ok(gallery.firstElementChild.classList.contains('video'));
  assert.equal(gallery.firstElementChild.style.aspectRatio,'16 / 9');
  const stills=gallery.querySelectorAll('.editorial-grid > img');
  assert.equal(stills.length,19);
  assert.ok([...stills].every(img=>img.loading==='lazy'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const img of stills){await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));}
 }finally{await c.window.happyDOM.close()}
});

test('Ase Me Mono includes fourteen editorial stills and preserves its polaroids',async()=>{
 const c=await setup('#/project/ase-me-mono');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const stills=gallery.querySelectorAll('.editorial-grid > img');
  assert.equal(stills.length,14);
  assert.equal(gallery.querySelectorAll('.image-row img').length,4);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const img of stills)await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
 }finally{await c.window.happyDOM.close()}
});

test('Cypher displays all eight stills in its uncropped grid before the thumbnail',async()=>{
 const c=await setup('#/project/cypher');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const stills=gallery.querySelectorAll('.uncropped-grid > img');
  assert.equal(stills.length,8);
  assert.equal(gallery.querySelector('.editorial-grid'),null);
  assert.ok(gallery.firstElementChild.classList.contains('video'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const img of stills)await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
 }finally{await c.window.happyDOM.close()}
});

test('Gia Panta uses the uncropped grid for its eight stills',async()=>{
 const c=await setup('#/project/gia-panta');
 try{
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('.uncropped-grid > img').length,8);
  assert.equal(gallery.querySelectorAll('.image-row').length,0);
  assert.ok(gallery.firstElementChild.classList.contains('video'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
 }finally{await c.window.happyDOM.close()}
});

test('StreetVerse131 includes all thirty-one editorial stills between video and thumbnail',async()=>{
 const c=await setup('#/project/streetverse131');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const stills=gallery.querySelectorAll('.editorial-streetverse131 > img');
  assert.equal(stills.length,31);
  assert.ok(gallery.firstElementChild.classList.contains('video'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  assert.ok([...stills].every(img=>img.loading==='lazy'));
  for(const img of stills)await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
 }finally{await c.window.happyDOM.close()}
});

test('Euro displays all eight landscape clips in a video grid before its thumbnail',async()=>{
 const c=await setup('#/project/euro-zese');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const grid=gallery.querySelector('.euro-video-grid');
  assert.equal(gallery.firstElementChild,grid);
  const clips=[...grid.querySelectorAll('.video')];
  assert.equal(clips.length,8);
  assert.ok(clips.every(clip=>clip.style.aspectRatio==='16 / 9'));
  assert.ok([...grid.querySelectorAll('video')].every(video=>video.muted&&!video.controls));
  assert.equal(grid.querySelectorAll('.video-mute').length,7);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
 }finally{await c.window.happyDOM.close()}
});

for(const [slug,count] of [['longpress',15],['ftera',16]]){
 test(`${slug} includes its new editorial stills with video first and thumbnail last`,async()=>{
  const c=await setup(`#/project/${slug}`);
  try{
   const gallery=c.doc.querySelector('.gallery');
   const stills=gallery.querySelectorAll('.editorial-grid > img');
   assert.equal(stills.length,count);
   assert.ok(gallery.firstElementChild.classList.contains('video'));
   assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
   if(slug==='ftera')assert.equal(gallery.querySelectorAll('.image-row img').length,3);
   for(const img of stills)await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
  }finally{await c.window.happyDOM.close()}
 });
}

test('home projects and carousel are ordered newest year first',async()=>{
 const c=await setup();
 try{
  for(const selector of ['.work-grid > .project-card','.recommendation-track > .project-card:not([aria-hidden])']){
   const years=[...c.doc.querySelectorAll(`main ${selector} .card-meta`)].map(el=>Number(el.textContent));
   assert.equal(years.length,25);
   assert.deepEqual(years,[...years].sort((a,b)=>b-a));
   assert.equal(years[0],2026);assert.equal(years.at(-1),2023);
  }
 }finally{await c.window.happyDOM.close()}
});

test('Drakolimni 2024 includes three correctly sized videos and all six photographs',async()=>{
 const c=await setup('#/project/drakolimni');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Tymfi');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2024');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('.drakolimni-video-grid video').length,3);
  assert.equal(gallery.querySelectorAll('.uncropped-grid img').length,5);
  assert.ok([...gallery.querySelectorAll('.video')].every(v=>v.style.aspectRatio==='3 / 2'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  assert.equal(c.doc.querySelector('.youtube-link'),null);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Dolomites includes all thirteen clips and twenty uncropped postcards',async()=>{
 const c=await setup('#/project/dolomites');
 try{
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(c.doc.querySelector('main h1').textContent,'Dolomites');
  assert.equal(gallery.querySelectorAll('.euro-video-grid video').length,13);
  assert.equal(gallery.querySelectorAll('.postcard-grid img').length,20);
  assert.equal(gallery.querySelectorAll('.editorial-grid').length,0);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Film Lenses 2024 includes both lens studies and all five photographs',async()=>{
 const c=await setup('#/project/film-lenses');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Film Lenses');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2024');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('.lenses-video-pair video').length,2);
  assert.equal(gallery.querySelectorAll('.lenses-photo-grid img').length,4);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Dumbos 2026 displays the programme, both promotional posts, and brand thumbnail',async()=>{
 const c=await setup('#/project/dumbos');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Dumbos');
  assert.equal(c.doc.querySelector('.project-subtitle').textContent,'Graphic Design');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2026');
  const gallery=c.doc.querySelector('.dumbos-gallery');
  assert.equal(gallery.querySelectorAll('img').length,5);
  assert.equal(gallery.querySelectorAll('.image-row img').length,3);
  assert.equal(gallery.querySelectorAll('video').length,0);
  assert.equal(c.doc.querySelector('.youtube-link'),null);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const img of gallery.querySelectorAll('img'))await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
 }finally{await c.window.happyDOM.close()}
});

test('new client pages have 2026 metadata, content, and the supplied Instagram links',async()=>{
 const c=await setup();
 try{
  for(const [slug,account] of [['dumbos','dumbos_kdap_lemnos'],['shisha-nomads','theshishanomads'],['skin-care-lab','skincarelab.limnos'],['reborn','reborn_music_lemnos']]){
   c.window.location.hash=`#/project/${slug}`;await c.settle();
   const link=c.doc.querySelector(`.project-intro a[href="https://www.instagram.com/${account}/"]`);
   assert.ok(link);assert.equal(link.target,'_blank');
   if(slug==='skin-care-lab'){
    assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2026');
    assert.equal(c.doc.querySelectorAll('.skincare-video-grid video').length,6);
    assert.equal(c.doc.querySelectorAll('.postcard-grid img').length,14);
    for(const el of c.doc.querySelectorAll('.gallery img,.gallery video')){
     const url=el.dataset.source||el.src;
     await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
    }
   }
   if(slug==='reborn')assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2026');
  }
 }finally{await c.window.happyDOM.close()}
});

test('Reborn replaces its placeholder with four muted videos and the logo thumbnail',async()=>{
 const c=await setup('#/project/reborn');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const videos=[...gallery.querySelectorAll('.reborn-video-grid video')];
  assert.equal(videos.length,4);
  assert.ok(videos.every(v=>v.muted&&v.loop&&!v.controls&&v.preload==='none'));
  assert.equal(gallery.querySelectorAll('.video-mute').length,4);
  assert.equal(gallery.querySelector('.caption'),null);
  assert.equal(gallery.querySelector(':scope > img'),null);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Healin Physio includes its website link, nine clips and thirteen photos',async()=>{
 const c=await setup('#/project/healin-physio');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Healin Physio');
  const website=c.doc.querySelector('.website-link');
  assert.equal(website.href,'https://healinphysio.com/');assert.equal(website.target,'_blank');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('.healin-video-grid video').length,9);
  assert.equal(gallery.querySelectorAll('.healin-photo-grid img').length,13);
  const screenshots=[...gallery.querySelectorAll('.healin-website-grid img')];
  assert.equal(screenshots.length,15);
  assert.ok(screenshots.every(img=>img.alt.startsWith('Healin Physio website — ')&&img.srcset&&img.loading==='lazy'));
  assert.equal(gallery.querySelector('.healin-photo-grid').nextElementSibling.className,'healin-website');
  assert.equal(gallery.querySelector('.healin-video-grid .video').style.aspectRatio,'16 / 9');
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Healin Physio 2026 appears directly before LongPress',async()=>{
 const c=await setup();
 try{
  const routes=[...c.doc.querySelectorAll('main .work-grid > a')].map(a=>a.getAttribute('href'));
  const index=routes.indexOf('#/project/healin-physio');
  assert.ok(index>=0);assert.equal(routes[index+1],'#/project/longpress');
  c.window.location.hash='#/project/healin-physio';await c.settle();
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2026');
 }finally{await c.window.happyDOM.close()}
});

test('Wedding in Lemnos 2025 includes its landscape trailer and five images',async()=>{
 const c=await setup('#/project/wedding-in-lemnos');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Wedding in Lemnos');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2025');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelector('.video').style.aspectRatio,'16 / 9');
  assert.equal(gallery.querySelectorAll('video').length,1);
  assert.equal(gallery.querySelectorAll('.image-row img').length,4);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Wedding editorial grid includes twenty-six new stills and preserves title cards',async()=>{
 const c=await setup('#/project/wedding-in-lemnos');
 try{
  const gallery=c.doc.querySelector('.gallery');
  const stills=gallery.querySelectorAll('.editorial-wedding-in-lemnos > img');
  assert.equal(stills.length,26);
  assert.equal(gallery.querySelectorAll('.complete-frame').length,8);
  assert.equal(gallery.querySelectorAll('.image-row img').length,4);
  assert.ok(gallery.firstElementChild.classList.contains('video'));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const img of stills)await readFile(new URL(`../public/${new URL(img.src).pathname.replace('/Portofolio/','')}`,import.meta.url));
 }finally{await c.window.happyDOM.close()}
});

test('Aerial Production 2025 combines Athens and FPV films',async()=>{
 const c=await setup('#/project/athens');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Aerial Production');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2025');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('.reborn-video-grid video').length,6);
  assert.equal(gallery.querySelector('.rotated-video').style.getPropertyValue('--video-rotation'),'-90deg');
  assert.equal([...gallery.querySelectorAll('.video')].filter(v=>v.style.aspectRatio==='9 / 16').length,4);
  assert.equal([...gallery.querySelectorAll('.video')].filter(v=>v.style.aspectRatio==='16 / 9').length,2);
  assert.equal(gallery.querySelector(':scope > img'),null);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('requested 2025 project ordering is preserved',async()=>{
 const c=await setup();
 try{
  const routes=[...c.doc.querySelectorAll('main .work-grid > a')].map(a=>a.getAttribute('href'));
  for(const [before,after] of [['shisha-nomads','athens'],['athens','cypher'],['euro-zese','dolomites']]){
   assert.equal(routes[routes.indexOf(`#/project/${before}`)+1],`#/project/${after}`);
  }
 }finally{await c.window.happyDOM.close()}
});

test('Kompi 2023 includes its film, eight stills, and four landscape rotations',async()=>{
 const c=await setup('#/project/kompi');
 try{
  assert.equal(c.doc.querySelector('main h1').textContent,'Kompi');
  assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2023');
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(gallery.querySelectorAll('video').length,1);
  assert.equal(gallery.querySelectorAll('.kompi-photo-grid img').length,8);
  const rotations=[...gallery.querySelectorAll('.rotated-still')];
  assert.equal(rotations.length,4);
  assert.ok(rotations.every(frame=>Number(frame.style.aspectRatio.split('/')[0])>Number(frame.style.aspectRatio.split('/')[1])));
  assert.ok(rotations.every(frame=>frame.querySelector('img').style.transform.includes('-90deg')));
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.jpg$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Lemnian Honey serves responsive WebP photos, four films, and two brochure pages',async()=>{
 const c=await setup('#/project/lemnian-honey');
 try{
  const gallery=c.doc.querySelector('.gallery');
  assert.equal(c.doc.querySelector('main h1').textContent,'Lemnian Honey');
  const photos=[...gallery.querySelectorAll('.honey-photo-grid > img')];
  assert.equal(photos.length,22);
  assert.ok(photos.every(img=>img.src.endsWith('.webp')&&img.srcset.includes('640w')&&img.loading==='lazy'));
  assert.equal(gallery.querySelectorAll('video').length,4);
  assert.equal(gallery.querySelectorAll('.image-row img').length,2);
  assert.match(gallery.lastElementChild.getAttribute('src'),/cover\.webp$/);
  for(const el of gallery.querySelectorAll('img,video')){
   const url=el.dataset.source||el.src;
   await readFile(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));
  }
 }finally{await c.window.happyDOM.close()}
});

test('Food Photography - Social is the last project dated 2026',async()=>{
 const c=await setup();
 try{
  const cards=[...c.doc.querySelectorAll('main .work-grid > .project-card')];
  const group=cards.filter(card=>card.querySelector('.card-meta').textContent==='2026');
  assert.equal(group.at(-1).getAttribute('href'),'#/project/psomi-alati');
 }finally{await c.window.happyDOM.close()}
});

test('volume slider adjusts and preserves volume while switching the active video',async()=>{
 const c=await setup('#/project/shisha-nomads');
 try{
  const wrappers=[...c.doc.querySelectorAll('.video-pair .video')];
  const first=wrappers[0].querySelector('video');
  const controls=wrappers[0].querySelector('.video-audio');
  const slider=controls.querySelector('input[type=range]');
  assert.equal(slider.disabled,true);
  controls.querySelector('button').click();await c.settle();
  assert.equal(slider.disabled,false);assert.ok(controls.classList.contains('is-unmuted'));
  slider.value='.35';slider.dispatchEvent(new c.window.Event('input'));await c.settle();
  assert.equal(first.volume,.35);assert.equal(slider.getAttribute('aria-valuetext'),'35%');
  wrappers[1].querySelector('button').click();await c.settle();
  assert.equal(first.muted,true);assert.equal(slider.disabled,true);
  controls.querySelector('button').click();await c.settle();
  assert.equal(first.volume,.35);assert.equal(first.muted,false);
  assert.equal(wrappers[1].querySelector('video').muted,true);
  slider.value='0';slider.dispatchEvent(new c.window.Event('input'));await c.settle();
  assert.equal(first.volume,0);assert.equal(slider.disabled,false);
  slider.value='.5';slider.dispatchEvent(new c.window.Event('input'));await c.settle();
  assert.equal(first.volume,.5);
 }finally{await c.window.happyDOM.close()}
});

test('new content pages contain optimized images, expected clips, and mixed media',async()=>{
 const c=await setup();
 try{
  for(const [slug,photos,clips] of [['samotrace',11,2],['psomi-alati',18,1],['almyro-psomi',12,5],['pappoudes',8,2]]){
   c.window.location.hash=`#/project/${slug}`;await c.settle();
   const gallery=c.doc.querySelector('.gallery');
   assert.equal(gallery.querySelectorAll('video').length,clips,slug);
   assert.equal(gallery.querySelectorAll('.new-photo-grid img,.mixed-media-grid img').length,photos,slug);
   assert.ok([...gallery.querySelectorAll('img')].every(img=>img.src.endsWith('.webp')),slug);
   for(const el of gallery.querySelectorAll('img,video')){const url=el.dataset.source||el.src;await access(new URL(`../public/${new URL(url,'https://example.com').pathname.replace('/Portofolio/','')}`,import.meta.url));}
   if(slug==='samotrace'){
    assert.equal(c.doc.querySelector('.project-intro .eyebrow').textContent,'2026');
    assert.ok(gallery.querySelector('img[alt*=NightPhoto]'));
   }
   if(slug==='almyro-psomi'){
    const mixed=gallery.querySelector('.mixed-media-sections');
    assert.equal(mixed.querySelector('.mixed-media-grid').firstElementChild.tagName,'IMG');
    assert.equal(mixed.querySelectorAll('.mixed-wide-videos .video').length,3);
   }
  }
  c.window.location.hash='#/project/olympos';await c.settle();
  assert.equal(c.doc.querySelector('main h1').textContent,'Olympos');
  assert.match(c.doc.querySelector('.gallery .caption').textContent,/coming soon/i);
 }finally{await c.window.happyDOM.close()}
});

test('2026 client projects follow the requested new order',async()=>{
 const c=await setup();
 try{
  const routes=[...c.doc.querySelectorAll('main .work-grid > a')].map(a=>a.getAttribute('href'));
  for(const [before,after] of [['longpress','samotrace'],['samotrace','reborn'],['reborn','skin-care-lab'],['skin-care-lab','dumbos']]){
   assert.equal(routes[routes.indexOf(`#/project/${before}`)+1],`#/project/${after}`);
  }
 }finally{await c.window.happyDOM.close()}
});

test('mobile carousel has two rows with independently centered captions and returns to one on desktop',async()=>{
 const c=await setup('',390);
 try{
  const tracks=[...c.doc.querySelectorAll('.recommendation-track')];
  assert.equal(tracks.length,2);
  assert.ok(tracks[1].classList.contains('mobile-only-track'));
  for(const track of tracks){
   track.getBoundingClientRect=()=>({left:0,right:300,top:300,bottom:400,width:300,height:100});
   [...track.children].forEach((card,i)=>{card.getBoundingClientRect=()=>({left:i*100,right:(i+1)*100,top:300,bottom:400,width:100,height:100})});
  }
  await c.settle();await c.settle();
  for(const track of tracks){
   assert.equal(track.querySelectorAll('.is-mobile-active').length,1);
   assert.ok(track.children[1].classList.contains('is-mobile-active'));
  }
  c.window.happyDOM.setWindowSize({width:1280,height:800});c.window.dispatchEvent(new c.window.Event('resize'));await c.settle();await c.settle();
  assert.equal(c.doc.querySelectorAll('.recommendation-track').length,1);
  assert.equal(c.doc.querySelectorAll('.recommendation-track .is-mobile-active').length,0);
 }finally{await c.window.happyDOM.close()}
});

test('touch volume collapses after adjustment and reopens without muting playback',async()=>{
 const c=await setup('#/project/shisha-nomads',390);
 try{
  c.window.matchMedia=()=>({matches:true});
  const controls=c.doc.querySelector('.video-audio');
  const video=controls.parentElement.querySelector('video');
  const slider=controls.querySelector('input');
  const button=controls.querySelector('button');
  button.click();await c.settle();
  slider.dispatchEvent(new c.window.Event('pointerdown'));
  slider.value='.4';slider.dispatchEvent(new c.window.Event('input'));
  await new Promise(resolve=>setTimeout(resolve,2100));
  assert.ok(controls.classList.contains('is-expanded'),'Keep the slider open during a drag');
  slider.dispatchEvent(new c.window.Event('pointerup'));
  await new Promise(resolve=>setTimeout(resolve,2100));
  assert.equal(controls.classList.contains('is-expanded'),false);
  assert.equal(video.volume,.4);
  button.click();
  assert.ok(controls.classList.contains('is-expanded'));
  assert.equal(video.muted,false);
 }finally{await c.window.happyDOM.close()}
});

test('volume uses audio gain when the browser ignores media volume',async()=>{
 const c=await setup('#/project/shisha-nomads',390);
 try{
  const controls=c.doc.querySelector('.video-audio');
  const video=controls.parentElement.querySelector('video');
  const slider=controls.querySelector('input');
  const gain={gain:{value:1},connect(){}};
  let connected=false;
  c.window.AudioContext=class {
   destination={};createGain(){return gain}
   createMediaElementSource(target){assert.equal(target,video);return {connect(){connected=true}}}
   resume(){return Promise.resolve()}
  };
  Object.defineProperty(video,'volume',{get:()=>1,set:()=>{}});
  controls.querySelector('button').click();await c.settle();
  slider.value='.3';slider.dispatchEvent(new c.window.Event('input'));
  assert.equal(connected,true);assert.equal(gain.gain.value,.3);
  assert.equal(slider.getAttribute('aria-valuetext'),'30%');
 }finally{await c.window.happyDOM.close()}
});

test('mobile first project reveals at page start, then follows the viewport center',async()=>{
 const c=await setup('',390);
 try{
  const cards=[...c.doc.querySelectorAll('.work-grid .project-card')];
  cards.forEach((card,i)=>{card.getBoundingClientRect=()=>({left:0,right:390,top:104+i*225,bottom:324+i*225,width:390,height:220})});
  c.window.dispatchEvent(new c.window.Event('resize'));
  await c.settle();await c.settle();
  assert.ok(cards[0].classList.contains('is-mobile-active'));
  assert.equal(cards[1].classList.contains('is-mobile-active'),false);
  Object.defineProperty(c.window,'scrollY',{configurable:true,value:100});
  c.window.dispatchEvent(new c.window.Event('scroll'));
  await c.settle();await c.settle();
  assert.equal(cards[0].classList.contains('is-mobile-active'),false);
  assert.ok(cards[1].classList.contains('is-mobile-active'));
  Object.defineProperty(c.window,'scrollY',{configurable:true,value:0});
  c.window.dispatchEvent(new c.window.Event('scroll'));
  await c.settle();await c.settle();
  assert.ok(cards[0].classList.contains('is-mobile-active'));
 }finally{await c.window.happyDOM.close()}
});

test('silent clips have no audio controls while audible clips keep them',async()=>{
 const c=await setup('#/project/healin-physio');
 try{
  assert.equal(c.doc.querySelectorAll('.gallery video').length,9);
  assert.equal(c.doc.querySelectorAll('.gallery .video-audio').length,0);
  c.window.location.hash='#/project/euro-zese';await c.settle();
  const euro=[...c.doc.querySelectorAll('.gallery .video')];
  assert.equal(euro.length,8);
  assert.equal(euro[7].querySelector('.video-audio'),null);
  assert.ok(euro.slice(0,7).every(wrapper=>wrapper.querySelector('.video-audio')));
  c.window.location.hash='#/project/athens';await c.settle();
  const aerial=[...c.doc.querySelectorAll('.gallery .video')];
  assert.equal(aerial.length,6);
  assert.equal(aerial[1].querySelector('.video-audio'),null);
  assert.equal(c.doc.querySelectorAll('.gallery .video-audio').length,5);
  assert.ok(aerial.every(wrapper=>wrapper.querySelector('video').dataset.source.includes('/web-optimized/')));
 }finally{await c.window.happyDOM.close()}
});
