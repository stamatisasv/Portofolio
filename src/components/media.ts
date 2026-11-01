import type {Photo,MediaBlock} from '../types';
export const asset = (path:string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export function element<K extends keyof HTMLElementTagNameMap>(tag:K,cls='',text='') {const el=document.createElement(tag);el.className=cls;el.textContent=text;return el}
export function image(photo:Photo,eager=false,sizes='(max-width: 767px) 100vw, 46vw') {
 const img=element('img');img.src=asset(photo.src);img.alt=photo.alt;img.width=photo.width;img.height=photo.height;img.loading=eager?'eager':'lazy';img.decoding='async';img.sizes=sizes;
 if(photo.variants) img.srcset=photo.variants.map(v=>`${asset(v.src)} ${v.width}w`).join(', ');
 return img;
}
// Keep retries from an earlier autoplay attempt from muting a later user gesture.
const refreshMute=new WeakMap<HTMLVideoElement,()=>void>();
let audibleVideo:HTMLVideoElement|null=null;
const visibleVideos=new Set<HTMLVideoElement>();
const videoObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  const video=entry.target as HTMLVideoElement;
  if(entry.isIntersecting){visibleVideos.add(video);startVideo(video)}
  else {visibleVideos.delete(video);playbackAttempts.set(video,(playbackAttempts.get(video)||0)+1);video.pause()}
 }
},{threshold:.3});
export function resetVideoVisibility(){videoObserver.disconnect();visibleVideos.clear();if(audibleVideo)audibleVideo.muted=true;audibleVideo=null}
const playbackAttempts = new WeakMap<HTMLVideoElement, number>();
function startVideo(video:HTMLVideoElement) {
 const attempt=(playbackAttempts.get(video)||0)+1;
 playbackAttempts.set(video,attempt);
 if(!video.getAttribute('src')&&video.dataset.source)video.src=video.dataset.source;
 video.muted=video!==audibleVideo;
 video.volume=1;
 void video.play().catch(()=>{
  if(!video.isConnected||playbackAttempts.get(video)!==attempt)return;
  video.muted=true;
  if(audibleVideo===video)audibleVideo=null;
  refreshMute.get(video)?.();
  void video.play().catch(()=>{/* Retry on the next user interaction. */});
 });
}
export function media(block:MediaBlock):HTMLElement {
 if(block.type==='caption')return element('p','caption',block.text);
 if(block.type==='image')return image(block.image,false,'(max-width: 767px) 100vw, min(92vw, 1400px)');
 if(block.type==='row'){const row=element('div','image-row');block.images.forEach(p=>{const cell=element('div');cell.style.flex=`${p.width/p.height} 1 0`;cell.append(image(p));row.append(cell)});return row}
 const wrapper=element('div','video');wrapper.style.aspectRatio=block.aspectRatio;
 if(block.provider==='file'){
  const video=element('video');video.controls=false;video.playsInline=true;video.autoplay=true;
  video.muted=true;video.defaultMuted=true;
  video.preload='none';video.volume=1;video.loop=true;video.poster=asset(block.poster.src);video.dataset.source=asset(block.source);
  video.setAttribute('aria-label',block.title);wrapper.append(video);
  const videoTitle=block.title;
  const mute=element('button','video-mute');mute.type='button';
  function updateMute(){
   const muted=video.muted||video.volume===0;
   mute.textContent=muted?'Unmute':'Mute';
   mute.setAttribute('aria-label',`${muted?'Unmute':'Mute'} ${videoTitle}`);
  }
  refreshMute.set(video,updateMute);
  video.addEventListener('volumechange',updateMute);
  mute.addEventListener('click',()=>{
   const muted=!(video.muted||video.volume===0);
   if(!muted){
    document.querySelectorAll<HTMLVideoElement>('.video > video').forEach(other=>{
     if(other===video)return;
     playbackAttempts.set(other,(playbackAttempts.get(other)||0)+1);
     other.muted=true;refreshMute.get(other)?.();
    });
    audibleVideo=video;
   }else if(audibleVideo===video)audibleVideo=null;
   playbackAttempts.set(video,(playbackAttempts.get(video)||0)+1);
   video.muted=muted;video.volume=1;
   if(!muted)startVideo(video);
   updateMute();
  });
  updateMute();wrapper.append(mute);
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
