import type {Photo,MediaBlock} from '../types';
export const asset = (path:string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export function element<K extends keyof HTMLElementTagNameMap>(tag:K,cls='',text='') {const el=document.createElement(tag);el.className=cls;el.textContent=text;return el}
export function image(photo:Photo,eager=false,sizes='(max-width: 767px) 100vw, 46vw') {
 const img=element('img');img.src=asset(photo.src);img.alt=photo.alt;img.width=photo.width;img.height=photo.height;img.loading=eager?'eager':'lazy';img.decoding='async';img.sizes=sizes;
 if(photo.variants) img.srcset=photo.variants.map(v=>`${asset(v.src)} ${v.width}w`).join(', ');
 return img;
}
// Keep retries from an earlier autoplay attempt from muting a later user gesture.
const visibleVideos=new Set<HTMLVideoElement>();
const videoObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  const video=entry.target as HTMLVideoElement;
  if(entry.isIntersecting){visibleVideos.add(video);startVideo(video)}
  else {visibleVideos.delete(video);playbackAttempts.set(video,(playbackAttempts.get(video)||0)+1);video.pause()}
 }
},{threshold:.3});
export function resetVideoVisibility(){videoObserver.disconnect();visibleVideos.clear()}
const playbackAttempts = new WeakMap<HTMLVideoElement, number>();
function startVideo(video:HTMLVideoElement) {
 const attempt=(playbackAttempts.get(video)||0)+1;
 playbackAttempts.set(video,attempt);
 video.muted=false;
 video.volume=1;
 void video.play().catch(()=>{
  if(!video.isConnected||playbackAttempts.get(video)!==attempt)return;
  video.muted=true;
  void video.play().catch(()=>{/* Retry on the next user interaction. */});
 });
}
function enableVideoSound(event:Event) {
 if(!event.isTrusted)return;
 if(event instanceof KeyboardEvent&&(event.repeat||['Shift','Control','Alt','Meta','Escape','Tab'].includes(event.key)))return;
 document.querySelectorAll<HTMLVideoElement>('.video > video').forEach(video=>{
  if(visibleVideos.has(video)&&(video.muted||video.paused))startVideo(video);
 });
}
// Run play() synchronously inside a user gesture so browsers can allow audio.
document.addEventListener('click',enableVideoSound,{capture:true});
document.addEventListener('keydown',enableVideoSound,{capture:true});

export function media(block:MediaBlock):HTMLElement {
 if(block.type==='caption')return element('p','caption',block.text);
 if(block.type==='image')return image(block.image,false,'(max-width: 767px) 100vw, min(92vw, 1400px)');
 if(block.type==='row'){const row=element('div','image-row');block.images.forEach(p=>{const cell=element('div');cell.style.flex=`${p.width/p.height} 1 0`;cell.append(image(p));row.append(cell)});return row}
 const wrapper=element('div','video');wrapper.style.aspectRatio=block.aspectRatio;
 if(block.provider==='file'){
  const video=element('video');video.controls=false;video.playsInline=true;video.autoplay=true;
  video.preload='auto';video.volume=1;video.loop=true;video.poster=asset(block.poster.src);video.src=asset(block.source);
  video.setAttribute('aria-label',block.title);wrapper.append(video);
  video.autoplay=false;
  videoObserver.observe(video);
  return wrapper;
 }
 const play=element('button','video-play');play.type='button';play.append(image(block.poster),element('span','',`Play ${block.title} ↗`));
 play.addEventListener('click',()=>{
  const valid=block.provider==='youtube'?/^[a-zA-Z0-9_-]{11}$/:/^\d+$/;
  if(!valid.test(block.source)){play.replaceChildren(element('span','','Video unavailable'));return}
  const iframe=element('iframe');iframe.title=block.title;iframe.src=block.provider==='youtube'?`https://www.youtube-nocookie.com/embed/${block.source}?autoplay=1`:`https://player.vimeo.com/video/${block.source}?autoplay=1`;iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;wrapper.replaceChildren(iframe);
 });wrapper.append(play);return wrapper;
}
