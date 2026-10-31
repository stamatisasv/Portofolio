import type {Photo,MediaBlock} from '../types';
export const asset = (path:string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export function element<K extends keyof HTMLElementTagNameMap>(tag:K,cls='',text='') {const el=document.createElement(tag);el.className=cls;el.textContent=text;return el}
export function image(photo:Photo,eager=false,sizes='(max-width: 767px) 100vw, 46vw') {
 const img=element('img');img.src=asset(photo.src);img.alt=photo.alt;img.width=photo.width;img.height=photo.height;img.loading=eager?'eager':'lazy';img.decoding='async';img.sizes=sizes;
 if(photo.variants) img.srcset=photo.variants.map(v=>`${asset(v.src)} ${v.width}w`).join(', ');
 return img;
}
export function media(block:MediaBlock):HTMLElement {
 if(block.type==='caption')return element('p','caption',block.text);
 if(block.type==='image')return image(block.image,false,'(max-width: 767px) 100vw, min(92vw, 1400px)');
 if(block.type==='row'){const row=element('div','image-row');block.images.forEach(p=>{const cell=element('div');cell.style.flex=`${p.width/p.height} 1 0`;cell.append(image(p));row.append(cell)});return row}
 const wrapper=element('div','video');wrapper.style.aspectRatio=block.aspectRatio;
 const play=element('button','video-play');play.type='button';play.append(image(block.poster),element('span','',`Play ${block.title} ↗`));
 play.addEventListener('click',()=>{
  if(block.provider==='file'){const video=element('video');video.controls=true;video.playsInline=true;video.preload='none';video.poster=asset(block.poster.src);video.src=asset(block.source);wrapper.replaceChildren(video);void video.play();return}
  const valid=block.provider==='youtube'?/^[a-zA-Z0-9_-]{11}$/:/^\d+$/;
  if(!valid.test(block.source)){play.replaceChildren(element('span','','Video unavailable'));return}
  const iframe=element('iframe');iframe.title=block.title;iframe.src=block.provider==='youtube'?`https://www.youtube-nocookie.com/embed/${block.source}?autoplay=1`:`https://player.vimeo.com/video/${block.source}?autoplay=1`;iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;wrapper.replaceChildren(iframe);
 });wrapper.append(play);return wrapper;
}
