import {healinWebsiteScreenshots} from './data/healin-website';
import {initMobileProjectFocus} from './components/mobile-project-focus';
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
const refreshMobileCards=initMobileProjectFocus(main);
const footer=el('footer');footer.append(el('span','',`© ${new Date().getFullYear()} ${site.name}`));
const dialog=el('div','mobile-menu');dialog.id='mobile-menu';dialog.inert=true;
const mobileNav=el('nav');mobileNav.setAttribute('aria-label','Mobile navigation');mobileNav.append(link('My work','#/'),link('Contact','#/contact'));dialog.append(mobileNav,contacts());
if(site.email){const gmail=link('Write using Gmail',`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`,'gmail-link');gmail.target='_blank';gmail.rel='noopener noreferrer';dialog.append(gmail)}
header.append(dialog);
const toTop=el('button','scroll-top');
toTop.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
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
 const mobile=matchMedia('(max-width: 767px)');
 section.append(heading);
 function createTrack(list:Project[],direction:number){
 const track=el('div','recommendation-track');
 list.forEach(p=>track.append(card(p)));
 // A second copy makes the wrap visually seamless; only originals appear in keyboard navigation.
 list.forEach(p=>{const copy=card(p);copy.tabIndex=-1;copy.setAttribute('aria-hidden','true');track.append(copy)});

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
 let centered:HTMLElement|undefined;
 function updateCenteredCard(){
  let next:HTMLElement|undefined;
  if(mobile.matches){
   const rect=track.getBoundingClientRect();
   if(rect.width>0&&rect.bottom>0&&rect.top<innerHeight){
    const center=rect.left+rect.width/2;
    let nearest=Infinity;
    for(const child of track.children){
     const card=child as HTMLElement;const bounds=card.getBoundingClientRect();
     const distance=Math.abs(bounds.left+bounds.width/2-center);
     if(distance<nearest){nearest=distance;next=card}
    }
   }
  }
  if(next!==centered){centered?.classList.remove('is-mobile-active');next?.classList.add('is-mobile-active');centered=next}
 }
 function tick(time:number) {
  if(lastTime&&!document.hidden&&!motion.matches&&pointerId===undefined&&time>=resumeAt&&!section.querySelector(':focus-visible')) {
   const first=track.children[0] as HTMLElement;
   const duplicate=track.children[list.length] as HTMLElement;
   const cycle=duplicate.offsetLeft-first.offsetLeft;
   if(cycle>0){offset=((offset+Math.min(time-lastTime,50)*.028*direction)%cycle+cycle)%cycle;track.scrollLeft=offset;}
  }
  updateCenteredCard();
  lastTime=time;
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
 return {track,dispose:()=>{cancelAnimationFrame(frame);window.removeEventListener('pointerup',finishDrag);window.removeEventListener('pointercancel',finishDrag);centered?.classList.remove('is-mobile-active')}};
 }
 const primary=createTrack(list,1);section.append(primary.track);
 let secondary:ReturnType<typeof createTrack>|undefined;
 let wasMobile:boolean|undefined;
 function syncRows(){
  if(wasMobile===mobile.matches)return;wasMobile=mobile.matches;
  secondary?.dispose();secondary?.track.remove();secondary=undefined;
  if(mobile.matches){
   const midpoint=Math.ceil(list.length/2);
   secondary=createTrack([...list.slice(midpoint),...list.slice(0,midpoint)],-1);
   secondary.track.classList.add('mobile-only-track');
   secondary.track.setAttribute('aria-label','More projects, reverse scrolling');
   section.append(secondary.track);
  }
 }
 mobile.addEventListener('change',syncRows);window.addEventListener('resize',syncRows);syncRows();
 disposeCarousel=()=>{primary.dispose();secondary?.dispose();mobile.removeEventListener('change',syncRows);window.removeEventListener('resize',syncRows)};
 return section;
}
let previous='';let homeY=0;
history.scrollRestoration='manual';
function render(){
 resetVideoVisibility();
 disposeCarousel();
 if(previous==='#/')homeY=scrollY;
 main.querySelectorAll('video').forEach(video=>{video.pause();video.removeAttribute('src');video.load()});
 closeMenu();const route=location.hash||'#/';app.classList.toggle('contact-page',route==='#/contact');main.replaceChildren();
 header.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===(route==='#/contact'?'#/contact':'#/'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(route==='#/') {const heading=el('h1','sr-only','Photography and video');main.append(heading,grid(available));if(available.length)main.append(recommendationsCarousel(available,'Explore projects'));if(!available.length)main.append(el('p','empty','New work will be shared here soon.'));if(available.some(p=>p.demo))main.append(el('p','demo-note','Demo visual studies · Original photography and films coming soon.'))}
 else if(route==='#/contact'){const section=el('section','contact');section.classList.add('contact-with-portrait');section.append(el('h1','','Contact'));const portrait=image({src:'media/contact/stamatis-asvestas.jpg',alt:'Portrait of Asvestas Stamatis',width:666,height:1000},false,'(max-width: 767px) 150px, 200px');portrait.classList.add('contact-portrait');section.append(portrait);if(site.bio)section.append(el('p','',site.bio));section.append(contacts(true));if(!site.email&&!site.instagram&&!site.linkedin)section.append(el('p','','Contact details will be added soon.'));main.append(section)}
 else {const p=available.find(p=>route===`#/project/${p.slug}`);if(p){const intro=el('div','project-intro');intro.append(el('h1','',p.artist||p.title));if(p.category)intro.append(el('p','project-subtitle',p.artist?`${p.title} - ${p.category}`:p.category));if(p.year)intro.append(el('p','eyebrow',p.year));if(p.youtubeUrl||p.category==='Music Video Clip'){const youtube=link('Watch on YouTube',p.youtubeUrl||`https://www.youtube.com/results?search_query=${encodeURIComponent([p.artist,p.title,'official music video'].filter(Boolean).join(' '))}`,'youtube-link');youtube.target='_blank';youtube.rel='noopener noreferrer';if(!p.youtubeUrl)youtube.title=`Search YouTube for ${p.artist||''} ${p.title}`;intro.append(youtube);}if(p.websiteUrl){const website=link('Visit website',p.websiteUrl,'website-link');website.target='_blank';website.rel='noopener noreferrer';intro.append(website)}if(p.instagramUrl){const instagram=link('View on Instagram',p.instagramUrl,'instagram-link');instagram.target='_blank';instagram.rel='noopener noreferrer';intro.append(instagram)}if(p.demo)intro.append(el('p','eyebrow','Demo visual study'));const gallery=el('section',p.id==='shisha-nomads'?'gallery product-gallery':p.id==='ftera'?'gallery ftera-gallery':p.id==='dumbos'?'gallery dumbos-gallery':p.id==='kompi'?'gallery kompi-gallery':'gallery');gallery.setAttribute('aria-label',`${p.title} gallery`);if(p.id==='karnalh-vlog-beyond'){
 p.blocks.filter(block=>block.type==='video').forEach(block=>gallery.append(media(block)));
 const editorial=el('div','editorial-grid editorial-vlog');
 p.blocks.filter(block=>block.type==='image').forEach(block=>{
  const frame=media(block);
  if(/still-(156|157|158|161|164|165|170)\.jpg$/.test(block.image.src))frame.classList.add('vlog-title-frame');
  editorial.append(frame);
 });
 gallery.append(editorial);
}else if(p.id==='kaveira-3d'){
 const description=p.blocks.filter(block=>block.type==='caption');
 description.forEach(block=>gallery.append(media(block)));
 const videos=p.blocks.filter(block=>block.type==='video').reverse();
 const photos=p.blocks.filter(block=>block.type==='image');
 const closing=photos.slice(0,3);
 const scenes=photos.slice(3);
 const editorial=el('div','kaveira-editorial');
 function photoGroup(blocks:typeof photos,closingGroup=false){
  const group=el('div',`kaveira-photo-grid${closingGroup?' kaveira-closing':''}`);
  blocks.forEach(block=>group.append(media(block)));
  return group;
 }
 editorial.append(media(videos[0]!),photoGroup(scenes.slice(0,3)),media(videos[1]!),
  photoGroup(scenes.slice(3,15)),media(videos[2]!),photoGroup(scenes.slice(15)),photoGroup(closing,true));
 gallery.append(editorial);
}else if(p.id==='drivio'){
 const editorial=el('div','drivio-editorial');
 p.blocks.forEach(block=>{
  if(block.type==='caption'){
   const heading=el('h2','drivio-print-title',block.text);editorial.append(heading);return;
  }
  const frame=media(block);
  if(block.type==='row')frame.classList.add('drivio-split');
  if(block.type==='image'&&block.image.src.includes('/print-'))frame.classList.add('drivio-print');
  editorial.append(frame);
 });
 gallery.append(editorial);
}else if(p.id==='koziakas'){
 const editorial=el('div','koziakas-editorial');
 p.blocks.forEach(block=>{
  const frame=media(block);
  frame.classList.add(block.type==='video'&&block.aspectRatio==='1 / 1'?'koziakas-square':'koziakas-wide');
  if(block.type==='image'&&block.image.src.includes('/photo-4-'))frame.classList.add('koziakas-feature');
  editorial.append(frame);
 });
 gallery.append(editorial);
}else if(p.id==='dali-drops'){
 const opening=el('div','dali-opening-grid');
 const photos=el('div','mixed-media-grid');
 p.blocks.forEach((block,index)=>(index<6?opening:photos).append(media(block)));
 gallery.append(opening,photos);
}else if(p.galleryLayout==='mixed'){
 const mixed=el('div',`mixed-media-sections${p.id==='fika'?' fika-editorial':''}`);
 let group:HTMLDivElement|undefined;
 let wideGroup=false;
 p.blocks.forEach(block=>{
  const wide=block.type==='video'&&block.aspectRatio==='16 / 9';
  if(!group||wide!==wideGroup){group=el('div',wide?'mixed-wide-videos':'mixed-media-grid');mixed.append(group);wideGroup=wide}
  group.append(media(block));
 });
 gallery.append(mixed);
}else{const videos=p.blocks.filter(b=>b.type==='video');if(['shisha-nomads','film-lenses'].includes(p.id)){const pair=el('div',p.id==='film-lenses'?'lenses-video-pair':'video-pair');videos.forEach(b=>pair.append(media(b)));gallery.append(pair)}else if(['euro-zese','drakolimni','dolomites','skin-care-lab','reborn','healin-physio','athens','lemnian-honey','samotrace'].includes(p.id)){const videoGrid=el('div',p.id==='healin-physio'?'healin-video-grid':p.id==='athens'?'reborn-video-grid aerial-video-grid':['reborn','lemnian-honey'].includes(p.id)?'reborn-video-grid':p.id==='skin-care-lab'?'skincare-video-grid':p.id==='drakolimni'?'drakolimni-video-grid':'euro-video-grid');videos.forEach(b=>videoGrid.append(media(b)));gallery.append(videoGrid)}else videos.forEach(b=>gallery.append(media(b)));const stills=p.blocks.filter(b=>b.type!=='video');if(['mona-lisa','ase-me-mono','streetverse131','longpress','ftera','cypher','gia-panta','drakolimni','dolomites','film-lenses','skin-care-lab','healin-physio','wedding-in-lemnos','kompi','lemnian-honey','samotrace','psomi-alati','pappoudes'].includes(p.id)){const editorial=el('div',['samotrace','psomi-alati','pappoudes'].includes(p.id)?'new-photo-grid':p.id==='lemnian-honey'?'honey-photo-grid':p.id==='kompi'?'kompi-photo-grid':p.id==='healin-physio'?'healin-photo-grid':p.id==='skin-care-lab'?'postcard-grid':p.id==='film-lenses'?'lenses-photo-grid':p.id==='dolomites'?'postcard-grid':['cypher','gia-panta','drakolimni','dolomites'].includes(p.id)?'uncropped-grid':`editorial-grid editorial-${p.id}`);stills.filter(b=>b.type==='image').forEach(b=>{const frame=media(b);if(p.id==='lemnian-honey'&&frame instanceof HTMLImageElement)frame.sizes='(max-width: 767px) 50vw, (max-width: 1023px) 30vw, 23vw';if(p.id==='wedding-in-lemnos'&&b.type==='image'&&/still-(111|112|113|114|115|125|128|132)\.jpg$/.test(b.image.src))frame.classList.add('complete-frame');editorial.append(frame)});gallery.append(editorial);stills.filter(b=>b.type!=='image').forEach(b=>gallery.append(media(b)))}else stills.forEach(b=>gallery.append(media(b)));}if(p.id==='healin-physio'){
 const website=el('section','healin-website');website.setAttribute('aria-label','Healin Physio website design');
 website.append(el('h2','','Website design'));
 const screenshots=el('div','editorial-grid healin-website-grid');
 healinWebsiteScreenshots.forEach(photo=>screenshots.append(image(photo,false,'(max-width: 767px) 100vw, (max-width: 1023px) 46vw, 700px')));
 website.append(screenshots);gallery.append(website);
}if(!['skin-care-lab','reborn','athens','kaveira-3d','fika','drivio','dali-drops','koziakas','karnalh-vlog-beyond'].includes(p.id))gallery.append(image(p.cover,false,'(max-width: 767px) 100vw, min(92vw, 1400px)'));main.append(intro,gallery);const related=(p.relatedIds?.map(id=>available.find(q=>q.id===id)).filter((q):q is Project=>!!q&&q.id!==p.id)||[]);const recommendations=[...related,...available.filter(q=>q.id!==p.id&&!related.some(r=>r.id===q.id))];if(recommendations.length)main.append(recommendationsCarousel(recommendations));}else{const section=el('section','contact');section.append(el('h1','','Page not found'),link('Return to work','#/'));main.append(section)}}
 refreshMobileCards();
 document.title='Asvestas Stamatis';if(previous)main.focus({preventScroll:true});window.scrollTo(0,route==='#/'?homeY:0);previous=route;
}
window.addEventListener('hashchange',render);render();

initCursor();
