import {initCursor} from './components/cursor';
import './style.css';
import {site} from './data/site';
import {projects} from './data/projects';
import type {Project} from './types';
import {element as el,image,media,resetVideoVisibility} from './components/media';
const app=document.querySelector<HTMLDivElement>('#app')!;
const available=projects.filter(p=>p.published&&(!p.demo||site.showDemos));
function link(text:string,href:string,cls=''){const a=el('a',cls,text);a.href=href;return a}
function contacts(showDetails=false){
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
  if(showDetails){
   a.classList.add('contact-detail');
   const text=el('span','contact-detail-text');
   text.append(el('span','contact-detail-label',label),el('span','contact-detail-value',label==='Email'?site.email!:url));
   a.append(text);
  }
  box.append(a);
 }
 return box;
}
const skip=link('Skip to content','#main','skip');skip.onclick=e=>{e.preventDefault();main.focus()};
const header=el('header','header');const nav=el('nav','desktop-nav');nav.setAttribute('aria-label','Main');nav.append(link('My work','#/'),link('Contact','#/contact'));
const brand=link(site.name,'#/','brand');const toggle=el('button','menu-toggle');toggle.type='button';toggle.setAttribute('aria-controls','mobile-menu');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');
for(let i=0;i<3;i++){const line=el('span');line.setAttribute('aria-hidden','true');toggle.append(line)}
header.append(nav,brand,contacts(),toggle);
const main=el('main');main.id='main';main.tabIndex=-1;
const footer=el('footer');footer.append(el('span','',`© ${new Date().getFullYear()} ${site.name}`));
const dialog=el('div','mobile-menu');dialog.id='mobile-menu';dialog.inert=true;
const mobileNav=el('nav');mobileNav.setAttribute('aria-label','Mobile navigation');mobileNav.append(link('My work','#/'),link('Contact','#/contact'));dialog.append(mobileNav,contacts());
if(site.email){const gmail=link('Write using Gmail ↗',`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`,'gmail-link');gmail.target='_blank';gmail.rel='noopener noreferrer';dialog.append(gmail)}
header.append(dialog);
const toTop=el('button','scroll-top');
const topChevron=el('span','top-chevron');topChevron.setAttribute('aria-hidden','true');toTop.append(topChevron);
toTop.type='button';toTop.setAttribute('aria-label','Scroll to top');
function updateScrollTop(){
 const visible=window.scrollY>300&&location.hash!=='#/contact';
 toTop.classList.toggle('is-visible',visible);toTop.tabIndex=visible?0:-1;
 toTop.setAttribute('aria-hidden',String(!visible));
}
toTop.onclick=()=>{
 window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 main.focus({preventScroll:true});
};
window.addEventListener('scroll',updateScrollTop,{passive:true});
window.addEventListener('hashchange',updateScrollTop);
app.append(skip,header,main,footer,toTop);
updateScrollTop();
let menuOpen=false;
function closeMenu(restoreFocus=true){
 if(!menuOpen)return;
 const focusInMenu=dialog.contains(document.activeElement);
 menuOpen=false;dialog.classList.remove('is-open');dialog.inert=true;
 toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');
 if(restoreFocus&&focusInMenu)toggle.focus();
}
toggle.onclick=()=>{
 if(menuOpen){closeMenu();return}
 menuOpen=true;dialog.inert=false;dialog.classList.add('is-open');
 toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close menu');
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen){e.preventDefault();closeMenu();toggle.focus()}});
document.addEventListener('click',e=>{if(e.target instanceof Node&&!header.contains(e.target))closeMenu(false)});
// Touch browsers may blur the trigger before dispatching a link's click.
// Close on outside pointer activation or Escape, never on a transient blur.
header.addEventListener('keydown',event=>{
 if(event.key==='Tab')setTimeout(()=>{if(!header.contains(document.activeElement))closeMenu(false)},0);
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',event=>{
 event.preventDefault();
 const route=a.getAttribute('href')!;
 closeMenu(false);
 if(location.hash===route)render();else location.hash=route;
}));
// Keep external links native: hiding their parent can interrupt app handoff on mobile.
matchMedia('(min-width: 768px)').addEventListener('change',e=>{if(e.matches)closeMenu(false)});
function card(p:Project,i=2){const a=link('',`#/project/${p.slug}`,p.id==='dumbos'?'project-card dumbos-card':p.id==='skin-care-lab'?'project-card dumbos-card skincare-card':'project-card');a.append(image(p.cover,i<2));a.style.setProperty('--position',p.coverPosition||'center');const label=el('span','card-label');label.append(el('span','card-title',p.artist||p.title),el('span','card-subtitle',p.category?(p.artist?`${p.title} - ${p.category}`:p.category):''),el('span','card-meta',p.year||''));a.append(label);a.setAttribute('aria-label',[p.artist,p.title,p.category,p.year].filter(Boolean).join(' — '));return a}
function grid(list:Project[]){const box=el('div','work-grid');list.forEach((p,i)=>box.append(card(p,i)));return box}
let disposeCarousel=()=>{};
function recommendationsCarousel(list:Project[],headingText='You may also like') {
 const section=el('section','related');
 section.setAttribute('aria-label','Recommended projects');
 section.setAttribute('aria-roledescription','carousel');
 const heading=el('div','related-heading');heading.append(el('h2','',headingText));
 const track=el('div','recommendation-track');
 list.forEach(p=>track.append(card(p)));
 // A second copy makes the wrap visually seamless; only originals appear in keyboard navigation.
 list.forEach(p=>{const copy=card(p);copy.tabIndex=-1;copy.setAttribute('aria-hidden','true');track.append(copy)});
 section.append(heading,track);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 let lastTime=0;
 let offset=0;
 let resumeAt=0;
 let pointerId:number|undefined;
 let lastX=0;
 let startX=0;
 let dragged=false;
 let suppressClick=false;
 const pauseRotation=()=>{resumeAt=performance.now()+1800};
 track.addEventListener('wheel',pauseRotation,{passive:true});
 track.addEventListener('scroll',()=>{
  if(pointerId!==undefined||performance.now()<resumeAt){offset=track.scrollLeft;pauseRotation()}
 },{passive:true});
 track.addEventListener('dragstart',event=>event.preventDefault());
 track.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  pointerId=event.pointerId;startX=lastX=event.clientX;dragged=false;suppressClick=false;pauseRotation();
 });
 track.addEventListener('pointermove',event=>{
  if(event.pointerId!==pointerId||event.pointerType!=='mouse')return;
  if(!dragged&&Math.abs(event.clientX-startX)>5){
   dragged=true;track.setPointerCapture(event.pointerId);track.classList.add('is-dragging');
  }
  if(dragged){event.preventDefault();track.scrollLeft-=event.clientX-lastX;offset=track.scrollLeft;pauseRotation()}
  lastX=event.clientX;
 });
 const finishDrag=(event:PointerEvent)=>{
  if(event.pointerId!==pointerId)return;
  if(track.hasPointerCapture(event.pointerId))track.releasePointerCapture(event.pointerId);
  suppressClick=dragged;pointerId=undefined;track.classList.remove('is-dragging');offset=track.scrollLeft;pauseRotation();
 };
 window.addEventListener('pointerup',finishDrag);
 window.addEventListener('pointercancel',finishDrag);
 track.addEventListener('click',event=>{
  if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false}
 },{capture:true});
 function tick(time:number) {
  if(lastTime&&!document.hidden&&!motion.matches&&pointerId===undefined&&time>=resumeAt&&!section.querySelector(':focus-visible')) {
   const first=track.children[0] as HTMLElement;
   const duplicate=track.children[list.length] as HTMLElement;
   const cycle=duplicate.offsetLeft-first.offsetLeft;
   if(cycle>0){offset=(offset+Math.min(time-lastTime,50)*.028)%cycle;track.scrollLeft=offset;}
  }
  lastTime=time;
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
 disposeCarousel=()=>{cancelAnimationFrame(frame);window.removeEventListener('pointerup',finishDrag);window.removeEventListener('pointercancel',finishDrag)};
 return section;
}
let previous='';let homeY=0;
history.scrollRestoration='manual';
function render(){
 resetVideoVisibility();
 disposeCarousel();
 if(previous==='#/')homeY=scrollY;
 main.querySelectorAll('video').forEach(video=>{video.pause();video.removeAttribute('src');video.load()});
 closeMenu();const route=location.hash||'#/';app.classList.toggle('contact-page',route==='#/contact');main.replaceChildren();let title='My work';
 header.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===(route==='#/contact'?'#/contact':'#/'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(route==='#/') {const heading=el('h1','sr-only','Photography and video');main.append(heading,grid(available));if(available.length)main.append(recommendationsCarousel(available,'Explore projects'));if(!available.length)main.append(el('p','empty','New work will be shared here soon.'));if(available.some(p=>p.demo))main.append(el('p','demo-note','Demo visual studies · Original photography and films coming soon.'))}
 else if(route==='#/contact'){title='Contact';const section=el('section','contact');section.append(el('h1','','Contact'));if(site.bio)section.append(el('p','',site.bio));section.append(contacts(true));if(!site.email&&!site.instagram&&!site.linkedin)section.append(el('p','','Contact details will be added soon.'));main.append(section)}
 else {const p=available.find(p=>route===`#/project/${p.slug}`);if(p){title=p.title;const intro=el('div','project-intro');intro.append(el('h1','',p.artist||p.title));if(p.category)intro.append(el('p','project-subtitle',p.artist?`${p.title} - ${p.category}`:p.category));if(p.year)intro.append(el('p','eyebrow',p.year));if(p.youtubeUrl||p.category==='Music Video Clip'){const youtube=link('Watch on YouTube ↗',p.youtubeUrl||`https://www.youtube.com/results?search_query=${encodeURIComponent([p.artist,p.title,'official music video'].filter(Boolean).join(' '))}`,'youtube-link');youtube.target='_blank';youtube.rel='noopener noreferrer';if(!p.youtubeUrl)youtube.title=`Search YouTube for ${p.artist||''} ${p.title}`;intro.append(youtube);}if(p.websiteUrl){const website=link('Visit website ↗',p.websiteUrl,'website-link');website.target='_blank';website.rel='noopener noreferrer';intro.append(website)}if(p.instagramUrl){const instagram=link('View on Instagram ↗',p.instagramUrl,'instagram-link');instagram.target='_blank';instagram.rel='noopener noreferrer';intro.append(instagram)}if(p.demo)intro.append(el('p','eyebrow','Demo visual study'));const gallery=el('section',p.id==='shisha-nomads'?'gallery product-gallery':p.id==='ftera'?'gallery ftera-gallery':p.id==='dumbos'?'gallery dumbos-gallery':p.id==='kompi'?'gallery kompi-gallery':'gallery');gallery.setAttribute('aria-label',`${p.title} gallery`);if(p.galleryLayout==='mixed'){
 const mixed=el('div','mixed-media-sections');
 let group:HTMLDivElement|undefined;
 let wideGroup=false;
 p.blocks.forEach(block=>{
  const wide=block.type==='video'&&block.aspectRatio==='16 / 9';
  if(!group||wide!==wideGroup){group=el('div',wide?'mixed-wide-videos':'mixed-media-grid');mixed.append(group);wideGroup=wide}
  group.append(media(block));
 });
 gallery.append(mixed);
}else{const videos=p.blocks.filter(b=>b.type==='video');if(['shisha-nomads','film-lenses'].includes(p.id)){const pair=el('div',p.id==='film-lenses'?'lenses-video-pair':'video-pair');videos.forEach(b=>pair.append(media(b)));gallery.append(pair)}else if(['euro-zese','drakolimni','dolomites','skin-care-lab','reborn','healin-physio','athens','lemnian-honey','samotrace'].includes(p.id)){const videoGrid=el('div',p.id==='healin-physio'?'healin-video-grid':p.id==='athens'?'reborn-video-grid aerial-video-grid':['reborn','lemnian-honey'].includes(p.id)?'reborn-video-grid':p.id==='skin-care-lab'?'skincare-video-grid':p.id==='drakolimni'?'drakolimni-video-grid':'euro-video-grid');videos.forEach(b=>videoGrid.append(media(b)));gallery.append(videoGrid)}else videos.forEach(b=>gallery.append(media(b)));const stills=p.blocks.filter(b=>b.type!=='video');if(['mona-lisa','ase-me-mono','streetverse131','longpress','ftera','cypher','gia-panta','drakolimni','dolomites','film-lenses','skin-care-lab','healin-physio','wedding-in-lemnos','kompi','lemnian-honey','samotrace','psomi-alati','pappoudes'].includes(p.id)){const editorial=el('div',['samotrace','psomi-alati','pappoudes'].includes(p.id)?'new-photo-grid':p.id==='lemnian-honey'?'honey-photo-grid':p.id==='kompi'?'kompi-photo-grid':p.id==='healin-physio'?'healin-photo-grid':p.id==='skin-care-lab'?'postcard-grid':p.id==='film-lenses'?'lenses-photo-grid':p.id==='dolomites'?'postcard-grid':['cypher','gia-panta','drakolimni','dolomites'].includes(p.id)?'uncropped-grid':`editorial-grid editorial-${p.id}`);stills.filter(b=>b.type==='image').forEach(b=>{const frame=media(b);if(p.id==='lemnian-honey'&&frame instanceof HTMLImageElement)frame.sizes='(max-width: 767px) 50vw, (max-width: 1023px) 30vw, 23vw';if(p.id==='wedding-in-lemnos'&&b.type==='image'&&/still-(111|112|113|114|115|125|128|132)\.jpg$/.test(b.image.src))frame.classList.add('complete-frame');editorial.append(frame)});gallery.append(editorial);stills.filter(b=>b.type!=='image').forEach(b=>gallery.append(media(b)))}else stills.forEach(b=>gallery.append(media(b)));}if(!['skin-care-lab','reborn'].includes(p.id))gallery.append(image(p.cover,false,'(max-width: 767px) 100vw, min(92vw, 1400px)'));main.append(intro,gallery);const related=(p.relatedIds?.map(id=>available.find(q=>q.id===id)).filter((q):q is Project=>!!q&&q.id!==p.id)||[]);const recommendations=[...related,...available.filter(q=>q.id!==p.id&&!related.some(r=>r.id===q.id))];if(recommendations.length)main.append(recommendationsCarousel(recommendations));}else{title='Page not found';const section=el('section','contact');section.append(el('h1','','Page not found'),link('Return to work','#/'));main.append(section)}}
 document.title=`${title} — ${site.name}`;if(previous)main.focus({preventScroll:true});window.scrollTo(0,route==='#/'?homeY:0);previous=route;
}
window.addEventListener('hashchange',render);render();

initCursor();
