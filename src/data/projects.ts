import {koziakasProject} from './koziakas';
import {daliDropsProject} from './dali-drops';
import {drivioProject} from './drivio';
import {fikaProject} from './fika';
import {kaveiraProject} from './kaveira';
import {additionalProjects} from './new-projects';
import {honeyPhotos} from './honey';
import {healinPhotos} from './healin';
import {skincarePhotos} from './skincare';
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
    title:`${artist} — ${title}`,aspectRatio:['mona-lisa','ftera'].includes(slug)?'16 / 9':'9 / 16',
  }]:slug==='mona-lisa'?[]:[{type:'caption',text:'Project media coming soon.'}];
  if(slug==='euro-zese'){
    blocks.splice(0,blocks.length,...Array.from({length:8},(_,i):MediaBlock=>({
      type:'video',provider:'file',source:`media/projects/${slug}/web-1080p/vfx-${i+1}.mp4`,
      poster:cover,title:`Zese — Euro — ${i===7?'Smoke text':`VFX ${i+1}`}`,aspectRatio:'16 / 9',hasAudio:i!==7,
    })));
  }
  if(slug==='mona-lisa'){
    const scenes=['Artist beside a painting on an easel','Close-up of a horse in warm light',
      'Artist beside a beach bonfire at dusk','Silhouette against the setting sun',
      'Artist seated by the sea and fire','Car on a coastal road at sunset',
      'Artist leading a horse beside the sea','Horseback scene on the beach',
      'Soft-focus coastal portrait','Artist riding a horse at the shoreline',
      'Close-up of flames','Wide beach scene at dusk','Artist on the beach at sunset',
      'Artist framed by flaming letters at night','Fire-lit collage',
      'Figures under a spotlight at night','Artist beneath a pink evening sky',
      'Painting beside the sea','Third Eye Vzn fire title'];
    scenes.forEach((scene,i)=>blocks.push({type:'image',image:photo(slug,`still-${i+2}`,
      `Mona Lisa — ${scene}`,1800,1013)}));
  }
  if(slug==='streetverse131'){
    for(let n=49;n<=79;n++)blocks.push({type:'image',image:photo(slug,`still-${n}`,`StreetVerse131 — film still ${n-48}`,1800,1013)});
  }
  if(slug==='cypher'){
    for(let n=36;n<=43;n++)blocks.push({type:'image',image:photo(slug,`still-${n}`,`StreetVerse — Cypher — film still ${n-35}`,1800,1013)});
  }
  if(slug==='longpress'){
    for(let n=80;n<=94;n++)blocks.push({type:'image',image:photo(slug,`still-${n}`,`Zese — LongPress — film still ${n-79}`,1800,1013)});
  }
  if(slug==='ftera'){
    for(let n=95;n<=110;n++)blocks.push({type:'image',image:photo(slug,`still-${n}`,`Lynux — Ftera — film still ${n-94}`,1800,1013)});
    blocks.push({type:'row',images:[photo(slug,'still-1','Lynux — Ftera — still 1',1106,1383),photo(slug,'still-2','Lynux — Ftera — still 2',1080,1350),
      photo(slug,'still-3','Lynux — Ftera — still 3',1080,1920)]});
  }
  if(slug==='gia-panta'){
    for(let n=1;n<=8;n++)blocks.push({type:'image',image:
      photo(slug,`still-${n}`,`Gia Panta — film still ${n}`,1920,1080)});
  }
  if(slug==='ase-me-mono'){
    for(let n=21;n<=34;n++)blocks.push({type:'image',image:photo(slug,`still-${n}`,`Ase Me Mono — film still ${n-20}`,1800,1013)});
    blocks.push({type:'row',images:[1,2].map(polaroid)},
      {type:'row',images:[3,4].map(polaroid)});
  }
  return {id:slug,slug,artist,title,year,youtubeUrl:youtubeUrls[slug],category:'Music Video Clip',cover,blocks,published:true,
    relatedIds:entries.filter(p=>p.slug!==slug&&p.artist===artist).map(p=>p.slug)};
});


const shishaCover=photo('shisha-nomads','cover','The Shisha Nomads — preparing a shisha bowl in warm sunlight',1200,1600);
const shishaBlocks:MediaBlock[]=[1,3].map(n=>({
  type:'video',provider:'file',source:`media/projects/shisha-nomads/video-${n}.mp4`,
  poster:shishaCover,title:`The Shisha Nomads — film ${n}`,aspectRatio:'9 / 16',
}));
for(let i=1;i<=8;i++)shishaBlocks.push({type:'image',image:
  photo('shisha-nomads',`flavour-${i}`,`The Shisha Nomads — flavour photograph ${i}`,2667,4000)});
const extraShishaPhotos=[
  photo('shisha-nomads','product-1','The Shisha Nomads — product photograph 1',1600,2000),
  photo('shisha-nomads','product-3','The Shisha Nomads — product photograph 3',1500,2000),
  photo('shisha-nomads','giozis-1','The Shisha Nomads — Giozis photograph 1',1333,2000),
  photo('shisha-nomads','giozis-2','The Shisha Nomads — Giozis photograph 2',1333,2000),
];
extraShishaPhotos.forEach(image=>shishaBlocks.push({type:'image',image}));
const stories=['bounty','africa','bounty-2','cactus','limeginger','peach','watermellon'];
stories.forEach(name=>shishaBlocks.push({type:'image',image:photo('shisha-nomads',`story-${name}`,
  `The Shisha Nomads — ${name.replace('-2','')} story`,name==='cactus'?1067:900,1600)}));
shishaBlocks.push({type:'image',image:photo('shisha-nomads','menu','The Shisha Nomads menu and price list',1754,2480)});
projects.push({id:'shisha-nomads',slug:'shisha-nomads',title:'The Shisha Nomads',year:'2025',
  category:'Product Photography',cover:shishaCover,coverPosition:'center 52%',blocks:shishaBlocks,published:true});

const drakolimniCover=photo('drakolimni','cover','Horses beneath the mountains at Drakolimni',1800,1356);
const drakolimniBlocks:MediaBlock[]=[1,4,7].map(n=>({
  type:'video',provider:'file',source:`media/projects/drakolimni/video-${n}.mp4`,
  poster:drakolimniCover,title:`Drakolimni — film ${n}`,aspectRatio:'3 / 2',
}));
[3,5,6,8,9].forEach(n=>drakolimniBlocks.push({type:'image',image:
  photo('drakolimni',`photo-${n}`,`Drakolimni — landscape photograph ${n}`,n===3?1350:1800,n===3?1800:1350)}));
projects.push({id:'drakolimni',slug:'drakolimni',title:'Tymfi',year:'2024',
  cover:drakolimniCover,coverPosition:'center 68%',blocks:drakolimniBlocks,published:true});

const dolomitesCover=photo('dolomites','cover','Dolomites — opening frame of film 1',1920,1080);
const dolomitesVideoNames=['1','1_01517917','2','3','4','5','6','7','8','9','10','11','13'];
const dolomitesBlocks:MediaBlock[]=dolomitesVideoNames.map((name,i)=>({
  type:'video',provider:'file',source:`media/projects/dolomites/web-1080p/video-${name}.mp4`,
  poster:dolomitesCover,title:`Dolomites — film ${i+1}`,aspectRatio:'16 / 9',
}));
[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21].forEach(n=>dolomitesBlocks.push({type:'image',image:
  photo('dolomites',`photo-${n}`,`Dolomites — travel postcard ${n}`,638,1016)}));
projects.push({id:'dolomites',slug:'dolomites',title:'Dolomites',year:'2025',cover:dolomitesCover,coverPosition:'center',
  blocks:dolomitesBlocks,published:true});

const lensesCover=photo('film-lenses','cover','Film Lenses — dog in the evening light',1200,1800);
const lensesBlocks:MediaBlock[]=['agiooroskasro','kastrokymata'].map((name,i)=>({
  type:'video',provider:'file',source:`media/projects/film-lenses/${name}.mp4`,poster:lensesCover,
  title:`Film Lenses — Jupiter and Helios study ${i+1}`,aspectRatio:'9 / 16',
}));
const lensPhotos=[['asv05051','Dog beside the sea'],['asv05180','Waves against coastal rocks'],
  ['asv05659','Lighthouse at dusk'],['asv05436','Sunset over the sea']];
lensPhotos.forEach(([name,scene])=>lensesBlocks.push({type:'image',image:
  photo('film-lenses',name!,`Film Lenses — ${scene}`,1200,1800)}));
projects.push({id:'film-lenses',slug:'film-lenses',title:'Film Lenses',year:'2024',cover:lensesCover,
  coverPosition:'center 45%',blocks:lensesBlocks,published:true});

const dumbosCover=photo('dumbos','cover','Dumbos — elephant brand artwork',1800,1800);
projects.push({id:'dumbos',slug:'dumbos',title:'Dumbos',year:'2026',category:'Graphic Design',
  cover:dumbosCover,coverPosition:'center 62%',published:true,blocks:[
    {type:'image',image:photo('dumbos','programme','Dumbos — weekly activities programme design',1440,1080)},
    {type:'row',images:[photo('dumbos','post-2','Dumbos — promotional graphic design, post 2',1080,1350),
      photo('dumbos','post-3','Dumbos — promotional graphic design, post 3',1080,1350),
      photo('dumbos','poster-a5','Dumbos — A5 activities and registration poster',1410,2000)]},
  ]});

const skincareCover=photo('skin-care-lab','cover','Skin Care Lab — laser and beauty clinic logo',1000,1000);
const skincareBlocks:MediaBlock[]=Array.from({length:6},(_,i)=>({
  type:'video',provider:'file',source:`media/projects/skin-care-lab/video-${i===1?'2-web':i+1}.mp4`,
  poster:skincareCover,title:`Skin Care Lab — film ${i+1}`,aspectRatio:'9 / 16',
}));
skincarePhotos.forEach(image=>skincareBlocks.push({type:'image',image}));
projects.push({id:'skin-care-lab',slug:'skin-care-lab',title:'Skin Care Lab',year:'2026',
  category:'Social Media Content',instagramUrl:'https://www.instagram.com/skincarelab.limnos/',
  cover:skincareCover,blocks:skincareBlocks,published:true});
const rebornCover=photo('reborn','cover','Reborn — Lemnos Island logo',1080,1080);
const rebornTitles=['August aftermovie','Event edit','Film 2','Film 1'];
projects.push({id:'reborn',slug:'reborn',title:'Reborn',year:'2026',category:'Social Media Content',
  instagramUrl:'https://www.instagram.com/reborn_music_lemnos/',cover:rebornCover,published:true,
  blocks:rebornTitles.map((title,i)=>({type:'video',provider:'file',source:`media/projects/reborn/video-${i+1}.mp4`,
    poster:rebornCover,title:`Reborn — ${title}`,aspectRatio:'9 / 16'}))});
const projectInstagrams:Record<string,string>={
  dumbos:'https://www.instagram.com/dumbos_kdap_lemnos/',
  'shisha-nomads':'https://www.instagram.com/theshishanomads/',
};
projects.forEach(project=>{if(projectInstagrams[project.id])project.instagramUrl=projectInstagrams[project.id]});

const healinCover=photo('healin-physio','cover','Healin Physio — hands-on physiotherapy, Photo 13',1800,1200);
const healinVideoNames=['edit','back-massage-card','suction-cups-card','exercise-card','exercise2-card',
  'electric-trapes-cards','head-massage-card','needling-cards','red-lamp-card'];
const healinBlocks:MediaBlock[]=healinVideoNames.map((name,i)=>({type:'video',provider:'file',
  source:`media/projects/healin-physio/${name}.mp4`,poster:healinCover,
  title:`Healin Physio — ${i===0?'showreel':name.replaceAll('-',' ')}`,aspectRatio:i===0?'16 / 9':'4 / 5',hasAudio:false}));
healinPhotos.forEach(image=>healinBlocks.push({type:'image',image}));
projects.push({id:'healin-physio',slug:'healin-physio',title:'Healin Physio',year:'2026',category:'Website Design & Content Production',
  websiteUrl:'https://healinphysio.com/',cover:healinCover,coverPosition:'center 25%',blocks:healinBlocks,published:true});

const weddingStills:MediaBlock[]=[111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137].map(n=>({type:'image',image:photo('wedding-in-lemnos',`still-${n}`,`Wedding in Lemnos — film still ${n-110}`,1800,1013)}));
const weddingCover=photo('wedding-in-lemnos','cover','Wedding in Lemnos — Regino and Margarita wedding title frame',1800,1013);
projects.push({id:'wedding-in-lemnos',slug:'wedding-in-lemnos',title:'Wedding in Lemnos',year:'2025',
  cover:weddingCover,published:true,blocks:[
    {type:'video',provider:'file',source:'media/projects/wedding-in-lemnos/film.mp4',poster:weddingCover,
      title:'Wedding in Lemnos — wedding trailer',aspectRatio:'16 / 9'},
    ...weddingStills,
    {type:'row',images:[1,2].map(n=>photo('wedding-in-lemnos',`portrait-${n}`,`Wedding in Lemnos — portrait ${n}`,1013,1800))},
    {type:'row',images:[4,5].map(n=>photo('wedding-in-lemnos',`still-${n}`,`Wedding in Lemnos — film still ${n}`,1800,1013))},
  ]});

const athensCover=photo('athens','cover','Athens — Acropolis aerial view',607,1080);
const athensFilms=[['akropolisnew1','Acropolis'],['DJI_0164','City aerial study'],
  ['pireausdust','Piraeus in the haze'],['towerofpireaus','Piraeus Tower'],
  ['anogfpvreel','FPV drone reel','16 / 9'],['karabi-sporrts','FPV boat and watersports','16 / 9']];
projects.push({id:'athens',slug:'athens',title:'Aerial Production',year:'2025',cover:athensCover,published:true,
  blocks:athensFilms.map(([name,title,ratio])=>({type:'video',provider:'file',source:`media/projects/athens/web-optimized/${name}.mp4`,
    poster:athensCover,title:`Aerial Production — ${title}`,aspectRatio:ratio||'9 / 16',hasAudio:name!=='DJI_0164',rotation:name==='anogfpvreel'?-90:undefined}))});

const kompiCover=photo('kompi','cover','Kompi — golden-hour landscape and travel collage',1013,1800);
const kompiBlocks:MediaBlock[]=[{type:'video',provider:'file',source:'media/projects/kompi/film.mp4',
  poster:kompiCover,title:'Kompi — travel film',aspectRatio:'9 / 16'}];
for(let n=138;n<=145;n++)kompiBlocks.push({type:'image',image:{
  ...photo('kompi',`still-${n}`,`Kompi — film still ${n}`,1013,1800),rotation:n<=141?-90:undefined}});
projects.push({id:'kompi',slug:'kompi',title:'Kompi',year:'2023',cover:kompiCover,blocks:kompiBlocks,published:true});

const honeyCover={...honeyPhotos.find(image=>image.src.endsWith('photo-21-1200.webp'))!,
  src:'media/projects/lemnian-honey/cover.webp',alt:'Lemnian Honey — honey jar among flowering thyme'};
const honeyBlocks:MediaBlock[]=Array.from({length:4},(_,i)=>({type:'video',provider:'file',
  source:`media/projects/lemnian-honey/video-${i+1}.mp4`,poster:honeyCover,
  title:`Lemnian Honey — product film ${i+1}`,aspectRatio:'9 / 16'}));
honeyPhotos.forEach(image=>honeyBlocks.push({type:'image',image}));
honeyBlocks.push({type:'row',images:[1,2].map(n=>({src:`media/projects/lemnian-honey/brochure-${n}.webp`,
  alt:`Lemnian Honey — Bontelas brochure, page ${n}`,width:1600,height:1131}))});
projects.push({id:'lemnian-honey',slug:'lemnian-honey',title:'Lemnian Honey',year:'2026',category:'Product Photography & Video',
  cover:honeyCover,coverPosition:'center 58%',blocks:honeyBlocks,published:true});

projects.push(fikaProject, drivioProject, daliDropsProject, koziakasProject, ...additionalProjects);

// Stable sorting preserves the curated order for projects from the same year.
projects.sort((a,b)=>Number(b.year||0)-Number(a.year||0));

const healinIndex=projects.findIndex(project=>project.id==='healin-physio');
const [healinProject]=projects.splice(healinIndex,1);
projects.splice(projects.findIndex(project=>project.id==='longpress'),0,healinProject!);

function moveProjectAfter(id:string,afterId:string){
  const index=projects.findIndex(project=>project.id===id);
  const [project]=projects.splice(index,1);
  projects.splice(projects.findIndex(item=>item.id===afterId)+1,0,project!);
}
moveProjectAfter('athens','shisha-nomads');
moveProjectAfter('cypher','athens');
moveProjectAfter('dolomites','euro-zese');

moveProjectAfter('samotrace','longpress');
moveProjectAfter('reborn','samotrace');
moveProjectAfter('skin-care-lab','reborn');
moveProjectAfter('dumbos','skin-care-lab');
const last2026=projects.filter(project=>project.year==='2026'&&project.id!=='psomi-alati').at(-1)!;
moveProjectAfter('psomi-alati',last2026.id);

projects.splice(projects.findIndex(project=>project.id==='mona-lisa'),0,kaveiraProject);
