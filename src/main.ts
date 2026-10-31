import './style.css';
import {site} from './data/site';
import {projects} from './data/projects';
import type {Project} from './types';
import {element as el,image,media} from './components/media';
const app=document.querySelector<HTMLDivElement>('#app')!;
const available=projects.filter(p=>p.published&&(!p.demo||site.showDemos));
function link(text:string,href:string,cls=''){const a=el('a',cls,text);a.href=href;return a}
function contacts(){
 const box=el('div','social-links');
 const icons:Record<string,string>={
  Instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
  Email:'<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/>',
  LinkedIn:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7M11 17v-7m0 3a3 3 0 0 1 6 0v4"/><circle cx="7.5" cy="7" r=".8" fill="currentColor" stroke="none"/>',
 };
 const entries=[['Instagram',site.instagram],['Email',site.email?`mailto:${site.email}`:undefined],['LinkedIn',site.linkedin]];
 for(const [label,url] of entries){
  if(!url||!label)continue;
  const a=link('',url);a.setAttribute('aria-label',label==='Email'?`Email ${site.email}`:label);a.title=label;
  if(label!=='Email'){a.target='_blank';a.rel='noopener noreferrer'}
  a.innerHTML=`<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[label]}</svg>`;
  box.append(a);
 }
 return box;
}
const skip=link('Skip to content','#main','skip');skip.onclick=e=>{e.preventDefault();main.focus()};
const header=el('header','header');const nav=el('nav','desktop-nav');nav.setAttribute('aria-label','Main');nav.append(link('My work','#/'),link('Contact','#/contact'));
const brand=link(site.name,'#/','brand');const toggle=el('button','menu-toggle','☰');toggle.type='button';toggle.setAttribute('aria-controls','mobile-menu');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');
header.append(nav,brand,contacts(),toggle);
const main=el('main');main.id='main';main.tabIndex=-1;
const footer=el('footer');footer.append(el('span','',`© ${new Date().getFullYear()} ${site.name}`),link('Back to top ↑','#top'));footer.querySelector('a')!.onclick=e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};
const dialog=el('dialog','mobile-menu');dialog.id='mobile-menu';dialog.setAttribute('aria-label','Navigation');const close=el('button','menu-close','×');close.setAttribute('aria-label','Close menu');const mobileNav=el('nav');mobileNav.append(link('My work','#/'),link('Contact','#/contact'));dialog.append(close,mobileNav,contacts());
const toTop=el('button','scroll-top','↑');
toTop.type='button';toTop.setAttribute('aria-label','Scroll to top');toTop.tabIndex=-1;toTop.setAttribute('aria-hidden','true');
toTop.onclick=()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});main.focus({preventScroll:true})};
app.append(skip,header,main,footer,dialog,toTop);
const topObserver=new IntersectionObserver(([entry])=>{
 const visible=!!entry&&!entry.isIntersecting;
 toTop.classList.toggle('is-visible',visible);toTop.tabIndex=visible?0:-1;toTop.setAttribute('aria-hidden',String(!visible));
},{rootMargin:'200px 0px 0px 0px'});
topObserver.observe(header);
let lockedY=0;
function closeMenu(){if(!dialog.open)return;dialog.close();document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo(0,lockedY);toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.onclick=()=>{lockedY=scrollY;dialog.showModal();document.body.style.position='fixed';document.body.style.top=`-${lockedY}px`;document.body.style.width='100%';toggle.setAttribute('aria-expanded','true');close.focus()};close.onclick=closeMenu;dialog.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));matchMedia('(min-width: 768px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
function card(p:Project,i=2){const a=link('',`#/project/${p.slug}`,'project-card');a.append(image(p.cover,i<2));a.style.setProperty('--position',p.coverPosition||'center');const label=el('span','card-label');label.append(el('span','card-title',p.title),el('span','card-meta',[p.year,p.demo?'Demo study':null].filter(Boolean).join(' · ')));a.append(label);a.setAttribute('aria-label',`${p.title}${p.demo?' — demo study':''}`);return a}
function grid(list:Project[]){const box=el('div','work-grid');list.forEach((p,i)=>box.append(card(p,i)));return box}
let previous='';let homeY=0;
history.scrollRestoration='manual';
function render(){
 if(previous==='#/')homeY=scrollY;
 closeMenu();const route=location.hash||'#/';main.replaceChildren();let title='My work';
 header.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===(route==='#/contact'?'#/contact':'#/'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(route==='#/') {const heading=el('h1','sr-only','Photography and video');main.append(heading,grid(available));if(!available.length)main.append(el('p','empty','New work will be shared here soon.'));if(available.some(p=>p.demo))main.append(el('p','demo-note','Demo visual studies · Original photography and films coming soon.'))}
 else if(route==='#/contact'){title='Contact';const section=el('section','contact');section.append(el('h1','','Contact'));if(site.bio)section.append(el('p','',site.bio));section.append(contacts());if(!site.email&&!site.instagram&&!site.linkedin)section.append(el('p','','Contact details will be added soon.'));main.append(section)}
 else {const p=available.find(p=>route===`#/project/${p.slug}`);if(p){title=p.title;const intro=el('div','project-intro');intro.append(el('h1','',p.title));if(p.demo)intro.append(el('p','eyebrow','Demo visual study'));const gallery=el('section','gallery');gallery.setAttribute('aria-label',`${p.title} gallery`);p.blocks.forEach(b=>gallery.append(media(b)));main.append(intro,gallery);const related=(p.relatedIds?.map(id=>available.find(q=>q.id===id)).filter((q):q is Project=>!!q&&q.id!==p.id)||[]);const recommendations=related.length?related:available.filter(q=>q.id!==p.id).slice(0,2);if(recommendations.length){const section=el('section','related');section.append(el('h2','','You may also like'),grid(recommendations));main.append(section)}main.append(link('← Back to work','#/','back-link'))}else{title='Page not found';const section=el('section','contact');section.append(el('h1','','Page not found'),link('Return to work','#/'));main.append(section)}}
 document.title=`${title} — ${site.name}`;if(previous)main.focus({preventScroll:true});window.scrollTo(0,route==='#/'?homeY:0);previous=route;
}
window.addEventListener('hashchange',render);render();
