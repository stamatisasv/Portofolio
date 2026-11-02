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
let audioContext:AudioContext|undefined;
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
 if(block.type==='image'){
  const img=image(block.image,false,'(max-width: 767px) 100vw, min(92vw, 1400px)');
  if(!block.image.rotation)return img;
  const frame=element('div','rotated-still');frame.style.aspectRatio=`${block.image.height} / ${block.image.width}`;
  img.style.width=`${block.image.width/block.image.height*100}%`;
  img.style.height=`${block.image.height/block.image.width*100}%`;
  img.style.transform=`translate(-50%, -50%) rotate(${block.image.rotation}deg)`;
  frame.append(img);return frame;
 }
 if(block.type==='row'){const row=element('div','image-row');block.images.forEach(p=>{const cell=element('div');cell.style.flex=`${p.width/p.height} 1 0`;cell.append(image(p));row.append(cell)});return row}
 const wrapper=element('div','video');wrapper.style.aspectRatio=block.aspectRatio;
 if(block.provider==='file'){
  if(block.rotation){wrapper.classList.add('rotated-video');wrapper.style.setProperty('--video-rotation',`${block.rotation}deg`)}
  const video=element('video');video.controls=false;video.playsInline=true;video.autoplay=true;
  video.muted=true;video.defaultMuted=true;
  video.preload='none';video.volume=1;video.loop=true;video.poster=asset(block.poster.src);video.dataset.source=asset(block.source);
  video.setAttribute('aria-label',block.title);wrapper.append(video);
  const videoTitle=block.title;
  const audioControls=element('div','video-audio');
  let pointerFocus=false;
  audioControls.addEventListener('pointerdown',()=>{pointerFocus=true;audioControls.classList.remove('keyboard-focus')});
  audioControls.addEventListener('keydown',()=>{pointerFocus=false;audioControls.classList.add('keyboard-focus')});
  audioControls.addEventListener('focusin',()=>{if(!pointerFocus)audioControls.classList.add('keyboard-focus')});
  audioControls.addEventListener('focusout',event=>{
   if(!(event.relatedTarget instanceof Node)||!audioControls.contains(event.relatedTarget)){
    audioControls.classList.remove('keyboard-focus');pointerFocus=false;
   }
  });
  const mute=element('button','video-mute');mute.type='button';
  const volume=element('input','video-volume');volume.type='range';volume.min='0';volume.max='1';volume.step='.01';volume.value='1';
  volume.setAttribute('aria-label',`Volume for ${videoTitle}`);
  let lastVolume=1;
  let gain:GainNode|undefined;
  let collapseTimer:ReturnType<typeof setTimeout>|undefined;
  let adjusting=false;
  const touchControls=()=>window.matchMedia('(hover: none), (pointer: coarse)').matches;
  function revealVolume(){
   clearTimeout(collapseTimer);
   audioControls.classList.add('is-expanded');
   if(!adjusting)collapseTimer=setTimeout(()=>audioControls.classList.remove('is-expanded'),2000);
  }
  volume.addEventListener('pointerdown',()=>{adjusting=true;revealVolume()});
  const finishAdjustment=()=>{adjusting=false;revealVolume()};
  volume.addEventListener('pointerup',finishAdjustment);
  volume.addEventListener('pointercancel',finishAdjustment);
  volume.addEventListener('change',finishAdjustment);

  function updateMute(){
   const muted=video.muted||(gain?gain.gain.value:video.volume)===0;
   mute.innerHTML=`<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>${muted?'<path d="m16 9 6 6m0-6-6 6"/>':'<path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>'}</svg>`;
   audioControls.classList.toggle('is-unmuted',!video.muted);
   volume.disabled=video.muted;
   const level=gain?gain.gain.value:video.volume;
   volume.value=String(level);
   volume.setAttribute('aria-valuetext',`${Math.round(level*100)}%`);
   mute.title=muted?'Unmute':'Mute';
   mute.setAttribute('aria-label',`${muted?'Unmute':'Mute'} ${videoTitle}`);
  }
  refreshMute.set(video,updateMute);
  video.addEventListener('volumechange',updateMute);
  mute.addEventListener('click',()=>{
   if(touchControls()&&!video.muted&&!audioControls.classList.contains('is-expanded')){revealVolume();return}
   const muted=!(video.muted||(gain?gain.gain.value:video.volume)===0);
   if(!muted){
    document.querySelectorAll<HTMLVideoElement>('.video > video').forEach(other=>{
     if(other===video)return;
     playbackAttempts.set(other,(playbackAttempts.get(other)||0)+1);
     other.muted=true;refreshMute.get(other)?.();
    });
    audibleVideo=video;
   }else if(audibleVideo===video)audibleVideo=null;
   playbackAttempts.set(video,(playbackAttempts.get(video)||0)+1);
   video.muted=muted;if(!muted){if(gain){if(gain.gain.value===0)gain.gain.value=lastVolume;void audioContext?.resume().catch(()=>{})}else if(video.volume===0)video.volume=lastVolume;}
   if(!muted)startVideo(video);
   if(!muted)revealVolume();
   else {clearTimeout(collapseTimer);audioControls.classList.remove('is-expanded')}
   updateMute();
  });
  volume.addEventListener('input',()=>{
   const level=Number(volume.value);
   video.volume=level;
   // Some mobile browsers ignore HTMLMediaElement.volume; use an audio gain instead.
   if(!gain&&Math.abs(video.volume-level)>.001&&typeof AudioContext!=='undefined'){
    audioContext??=new AudioContext();
    gain=audioContext.createGain();
    audioContext.createMediaElementSource(video).connect(gain);
    gain.connect(audioContext.destination);
    video.volume=1;
   }
   if(gain){gain.gain.value=level;void audioContext?.resume().catch(()=>{})}
   if(level>0)lastVolume=level;
   revealVolume();
   updateMute();
  });
  audioControls.append(volume,mute);
  updateMute();wrapper.append(audioControls);
  video.autoplay=false;
  videoObserver.observe(video);
  return wrapper;
 }
 const play=element('button','video-play');play.type='button';play.append(image(block.poster),element('span','',`Play ${block.title}`));
 play.addEventListener('click',()=>{
  const valid=block.provider==='youtube'?/^[a-zA-Z0-9_-]{11}$/:/^\d+$/;
  if(!valid.test(block.source)){play.replaceChildren(element('span','','Video unavailable'));return}
  const iframe=element('iframe');iframe.title=block.title;iframe.src=block.provider==='youtube'?`https://www.youtube-nocookie.com/embed/${block.source}?autoplay=1`:`https://player.vimeo.com/video/${block.source}?autoplay=1`;iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;wrapper.replaceChildren(iframe);
 });wrapper.append(play);return wrapper;
}
