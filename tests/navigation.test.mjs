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
