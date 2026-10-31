import {element as el} from './media';
import {site} from '../data/site';

type EmbedWindow = Window & {FormspaceEmbed?: {init:(root:HTMLElement)=>void}};
let embedScript:Promise<void>|undefined;
function loadEmbed(){
 if(!embedScript)embedScript=new Promise<void>((resolve,reject)=>{
  const script=document.createElement('script');
  script.src='https://formspace.com/embed.js';script.defer=true;script.crossOrigin='anonymous';
  script.onload=()=>resolve();
  script.onerror=()=>{script.remove();embedScript=undefined;reject(new Error('Form unavailable'))};
  document.head.append(script);
 });
 return embedScript;
}
export function contactForm(){
 const wrapper=el('div','contact-form');
 const embed=el('div','contact-embed');embed.dataset.formspace=site.contactFormUrl;
 const fallback=el('p','contact-fallback');
 const hosted=el('a','','Open the contact form separately');hosted.href=site.contactFormUrl;hosted.target='_blank';hosted.rel='noopener noreferrer';
 fallback.append(hosted);
 if(site.email){const email=el('a','','email me directly');email.href=`mailto:${site.email}`;fallback.append(document.createTextNode(' or '),email)}
 wrapper.append(embed,fallback);
 void loadEmbed().then(()=>{if(embed.isConnected)(window as EmbedWindow).FormspaceEmbed?.init(embed)}).catch(()=>{
  if(!embed.isConnected)return;
  const message=el('p','','The form could not load. Please use one of the links below.');message.setAttribute('role','status');embed.replaceChildren(message);
 });
 return wrapper;
}
