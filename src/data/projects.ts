import type { Photo, Project } from '../types';
const photo = (name:string, alt:string):Photo => ({src:`media/demo/${name}.svg`,alt,width:1600,height:1000});
const studies = [
  photo('ridge','Demo illustration: layered mountain ridges beneath a pale sky'),
  photo('shore','Demo illustration: a quiet shoreline and distant island'),
  photo('structure','Demo illustration: sunlit architectural planes and a dark doorway'),
  photo('dusk','Demo illustration: a low sun over a dark sea'),
];
export const projects:Project[] = studies.map((cover,i)=>({
  id:`study-${i+1}`,slug:`visual-study-${i+1}`,title:['Ridge study','Shore study','Space study','Dusk study'][i]!,
  cover,published:true,demo:true,
  blocks:[{type:'image',image:cover},{type:'caption',text:'Demo visual study — replace with your own photographs or film.'},{type:'row',images:[studies[(i+1)%4]!,studies[(i+2)%4]!]},{type:'image',image:studies[(i+3)%4]!}],
  relatedIds:[`study-${(i+1)%4+1}`,`study-${(i+2)%4+1}`],
}));
