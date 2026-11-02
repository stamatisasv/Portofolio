/** Reveal just the mobile project closest to the center of the viewport. */
export function initMobileProjectFocus(root:HTMLElement) {
 const mobile=matchMedia('(max-width: 767px)');
 let cards:HTMLElement[]=[];
 let active:HTMLElement|undefined;
 let frame=0;
 function update(){
  frame=0;
  let next:HTMLElement|undefined;
  let best=Infinity;
  if(mobile.matches){
   for(const card of cards){
    const rect=card.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0||rect.bottom<=0||rect.top>=innerHeight||rect.right<=0||rect.left>=innerWidth)continue;
    const distance=Math.hypot((rect.top+rect.bottom)/2-innerHeight/2,(rect.left+rect.right)/2-innerWidth/2);
    if(distance<best){best=distance;next=card}
   }
  }
  if(next===active)return;
  active?.classList.remove('is-mobile-active');
  next?.classList.add('is-mobile-active');active=next;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 const observer=new IntersectionObserver(schedule,{threshold:[0,.25,.5,.75,1]});
 window.addEventListener('scroll',schedule,{passive:true});
 // Capture horizontal carousel movement too.
 root.addEventListener('scroll',schedule,{capture:true,passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 mobile.addEventListener('change',schedule);
 return ()=>{
  observer.disconnect();active?.classList.remove('is-mobile-active');active=undefined;
  cards=[...root.querySelectorAll<HTMLElement>('.work-grid .project-card')];
  cards.forEach(card=>observer.observe(card));schedule();
 };
}
