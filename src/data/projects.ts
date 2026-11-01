import type { Photo, Project, MediaBlock } from '../types';

const photo = (slug:string, name:string, alt:string, width=1600, height=900):Photo => ({
  src:`media/projects/${slug}/${name}.jpg`,alt,width,height,
});
const polaroidSizes = [[805,1006],[1000,724],[1000,913],[1000,1046]] as const;
const polaroid = (i:number) => photo('ase-me-mono',`polaroid-${i}`,`Ase Me Mono — polaroid ${i}`,polaroidSizes[i-1]![0],polaroidSizes[i-1]![1]);
// Add direct YouTube watch URLs here as they become available, keyed by project slug.
const youtubeUrls:Record<string,string> = {
  'gia-panta': 'https://www.youtube.com/watch?v=33ROuT2lo4E',
  'longpress': 'https://www.youtube.com/watch?v=rx27jOGNGq0',
  'ase-me-mono': 'https://www.youtube.com/watch?v=X2Kp8aB2Zh0',
  'mona-lisa': 'https://www.youtube.com/watch?v=EkEypDsakKY',
  'cypher': 'https://www.youtube.com/watch?v=QBl10fkJrAE',
  'ftera': 'https://www.youtube.com/watch?v=E5JrhNI_lOk',
  'streetverse131': 'https://www.youtube.com/watch?v=qXZX1YpSxbs',
  'euro-zese': 'https://www.youtube.com/watch?v=3B1DekedsNQ',
};
const entries = [
  {slug:'ase-me-mono',artist:'Karnalh',title:'Ase Me Mono',year:'2024',hasMedia:true},
  {slug:'gia-panta',artist:'Karnalh',title:'Gia Panta',year:'2024',hasMedia:true},
  {slug:'cypher',artist:'StreetVerse',title:'Cypher',year:'2025',hasMedia:true},
  {slug:'streetverse131',artist:'StreetVerse',title:'StreetVerse131',year:'2026',hasMedia:true},
  {slug:'mona-lisa',artist:'Karnalh',title:'Mona Lisa',year:'2025',hasMedia:true},
  {slug:'euro-zese',artist:'Zese',title:'Euro',year:'2025',hasMedia:true},
  {slug:'ftera',artist:'Lynux',title:'Ftera',year:'2025',hasMedia:true},
  {slug:'longpress',artist:'Zese',title:'LongPress',year:'2026',hasMedia:true},
];
export const projects:Project[] = entries.map(entry=>{
  const {slug,artist,title,year,hasMedia}=entry;
  const cover=(hasMedia||slug==='mona-lisa')?photo(slug,'cover',`${artist} — ${title}`,...((slug==='ftera'||slug==='gia-panta'||slug==='euro-zese'||slug==='mona-lisa'||slug==='longpress')?[1280,720] as const:[1920,1080] as const)):{
    src:'media/projects/pending.svg',alt:`${artist} — ${title}: media coming soon`,width:1600,height:900,
  };
  const blocks:MediaBlock[]=hasMedia?[{
    type:'video',provider:'file',source:`media/projects/${slug}/film.mp4`,poster:cover,
    title:`${artist} — ${title}`,aspectRatio:'9 / 16',
  }]:slug==='mona-lisa'?[]:[{type:'caption',text:'Project media coming soon.'}];
  if(slug==='euro-zese'){
    blocks.splice(0,blocks.length,...Array.from({length:8},(_,i):MediaBlock=>({
      type:'video',provider:'file',source:`media/projects/${slug}/vfx-${i+1}.mp4`,
      poster:cover,title:`Zese — Euro — ${i===7?'Smoke text':`VFX ${i+1}`}`,aspectRatio:'16 / 9',
    })));
  }
  if(slug==='ftera'){
    blocks.push({type:'image',image:photo(slug,'still-1','Lynux — Ftera — still 1',1106,1383)},
      {type:'row',images:[photo(slug,'still-2','Lynux — Ftera — still 2',1080,1350),
      photo(slug,'still-3','Lynux — Ftera — still 3',1080,1920)]});
  }
  if(slug==='gia-panta'){
    for(let i=1;i<=8;i+=2)blocks.push({type:'row',images:[i,i+1].map(n=>
      photo(slug,`still-${n}`,`Gia Panta — film still ${n}`,1920,1080))});
  }
  if(slug==='ase-me-mono'){
    blocks.push({type:'row',images:[1,2].map(polaroid)},
      {type:'row',images:[3,4].map(polaroid)});
  }
  return {id:slug,slug,artist,title,year,youtubeUrl:youtubeUrls[slug],category:'Music Video Clip',cover,blocks,published:true,
    relatedIds:entries.filter(p=>p.slug!==slug&&p.artist===artist).map(p=>p.slug)};
});


const shishaCover=photo('shisha-nomads','cover','The Shisha Nomads — flavour product photography',2667,4000);
const shishaBlocks:MediaBlock[]=[1,3].map(n=>({
  type:'video',provider:'file',source:`media/projects/shisha-nomads/video-${n}.mp4`,
  poster:shishaCover,title:`The Shisha Nomads — film ${n}`,aspectRatio:'9 / 16',
}));
for(let i=2;i<=8;i++)shishaBlocks.push({type:'image',image:
  photo('shisha-nomads',`flavour-${i}`,`The Shisha Nomads — flavour photograph ${i}`,2667,4000)});
const extraShishaPhotos=[
  photo('shisha-nomads','product-1','The Shisha Nomads — product photograph 1',1600,2000),
  photo('shisha-nomads','product-3','The Shisha Nomads — product photograph 3',1500,2000),
  photo('shisha-nomads','giozis-1','The Shisha Nomads — Giozis photograph 1',1333,2000),
  photo('shisha-nomads','giozis-2','The Shisha Nomads — Giozis photograph 2',1333,2000),
];
extraShishaPhotos.forEach(image=>shishaBlocks.push({type:'image',image}));
projects.push({id:'shisha-nomads',slug:'shisha-nomads',title:'The Shisha Nomads',year:'2025',
  category:'Product Photography',cover:shishaCover,blocks:shishaBlocks,published:true});
