import type { Photo, Project, MediaBlock } from '../types';

const photo = (slug:string, name:string, alt:string, width=1600, height=900):Photo => ({
  src:`media/projects/${slug}/${name}.jpg`,alt,width,height,
});
const polaroidSizes = [[805,1006],[1000,724],[1000,913],[1000,1046]] as const;
const polaroid = (i:number) => photo('ase-me-mono',`polaroid-${i}`,`Ase Me Mono — polaroid ${i}`,polaroidSizes[i-1]![0],polaroidSizes[i-1]![1]);
// Add direct YouTube watch URLs here as they become available, keyed by project slug.
const youtubeUrls:Record<string,string> = {
  'longpress': 'https://www.youtube.com/watch?v=rx27jOGNGq0',
  'ase-me-mono': 'https://www.youtube.com/watch?v=X2Kp8aB2Zh0',
  'mona-lisa': 'https://www.youtube.com/watch?v=EkEypDsakKY',
  'cypher': 'https://www.youtube.com/watch?v=QBl10fkJrAE',
  'ftera': 'https://www.youtube.com/watch?v=E5JrhNI_lOk',
  'streetverse131': 'https://www.youtube.com/watch?v=qXZX1YpSxbs',
  'euro-zese': 'https://www.youtube.com/watch?v=qXZX1YpSxbs',
};
const entries = [
  {slug:'ase-me-mono',artist:'Karnalh',title:'Ase Me Mono',year:'2024',hasMedia:true},
  {slug:'gia-panta',artist:'Karnalh',title:'Gia Panta',year:'2024',hasMedia:true},
  {slug:'cypher',artist:'StreetVerse',title:'Cypher',year:'2025',hasMedia:true},
  {slug:'streetverse131',artist:'StreetVerse',title:'StreetVerse131',year:'2026',hasMedia:false},
  {slug:'mona-lisa',artist:'Karnalh',title:'Mona Lisa',year:'2025',hasMedia:false},
  {slug:'longpress',artist:'Zese',title:'LongPress',year:'2026',hasMedia:true},
];
export const projects:Project[] = entries.map(entry=>{
  const {slug,artist,title,year,hasMedia}=entry;
  const cover=hasMedia?photo(slug,'cover',`${artist} — ${title}`,...(slug==='gia-panta'||slug==='longpress'?[899,1600] as const:[1920,1080] as const)):{
    src:'media/projects/pending.svg',alt:`${artist} — ${title}: media coming soon`,width:1600,height:900,
  };
  const blocks:MediaBlock[]=hasMedia?[{
    type:'video',provider:'file',source:`media/projects/${slug}/film.mp4`,poster:cover,
    title:`${artist} — ${title}`,aspectRatio:'9 / 16',
  }]:[{type:'caption',text:'Project media coming soon.'}];
  if(slug==='ase-me-mono'){
    blocks.push({type:'row',images:[1,2].map(polaroid)},
      {type:'row',images:[3,4].map(polaroid)});
  }
  return {id:slug,slug,artist,title,year,youtubeUrl:youtubeUrls[slug],category:'Music Video Clip',cover,blocks,published:true,
    relatedIds:entries.filter(p=>p.slug!==slug&&p.artist===artist).map(p=>p.slug)};
});
