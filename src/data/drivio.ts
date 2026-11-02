import type {Photo, Project} from '../types';

const photos:Record<string,Photo> = {
  "part-1": {
    "src": "media/projects/drivio/part-1-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler panorama, left half",
    "width": 1600,
    "height": 2000,
    "variants": [
      {
        "src": "media/projects/drivio/part-1-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/part-1-1600.webp",
        "width": 1600
      }
    ]
  },
  "part-2": {
    "src": "media/projects/drivio/part-2-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler panorama, right half",
    "width": 1600,
    "height": 2000,
    "variants": [
      {
        "src": "media/projects/drivio/part-2-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/part-2-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-2": {
    "src": "media/projects/drivio/photo-2-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 2",
    "width": 1600,
    "height": 2000,
    "variants": [
      {
        "src": "media/projects/drivio/photo-2-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-2-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-3": {
    "src": "media/projects/drivio/photo-3-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 3",
    "width": 1600,
    "height": 2000,
    "variants": [
      {
        "src": "media/projects/drivio/photo-3-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-3-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-4": {
    "src": "media/projects/drivio/photo-4-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 4",
    "width": 1600,
    "height": 1000,
    "variants": [
      {
        "src": "media/projects/drivio/photo-4-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-4-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-5": {
    "src": "media/projects/drivio/photo-5-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 5",
    "width": 1600,
    "height": 2000,
    "variants": [
      {
        "src": "media/projects/drivio/photo-5-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-5-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-6": {
    "src": "media/projects/drivio/photo-6-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 6",
    "width": 1600,
    "height": 2400,
    "variants": [
      {
        "src": "media/projects/drivio/photo-6-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-6-1600.webp",
        "width": 1600
      }
    ]
  },
  "photo-7": {
    "src": "media/projects/drivio/photo-7-1600.webp",
    "alt": "Drivio \u2014 Jeep Wrangler photograph 7",
    "width": 1600,
    "height": 2400,
    "variants": [
      {
        "src": "media/projects/drivio/photo-7-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/photo-7-1600.webp",
        "width": 1600
      }
    ]
  },
  "print": {
    "src": "media/projects/drivio/print-1600.webp",
    "alt": "Drivio \u2014 A5 print design",
    "width": 1600,
    "height": 1128,
    "variants": [
      {
        "src": "media/projects/drivio/print-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/drivio/print-1600.webp",
        "width": 1600
      }
    ]
  }
};

export const drivioProject:Project={
  id:'drivio',slug:'drivio',title:'Drivio',category:'Social Media Content & Print Design',
  cover:photos['photo-4']!,published:true,
  blocks:[
    {type:'row',images:[photos['part-1']!,photos['part-2']!]},
    {type:'image',image:photos['photo-2']!},
    {type:'video',provider:'file',source:'media/projects/drivio/wrangler.mp4',
      poster:{src:'media/projects/drivio/wrangler-poster.webp',alt:'Drivio — Wrangler film',width:600,height:1066},
      title:'Drivio — Jeep Wrangler',aspectRatio:'9 / 16'},
    ...[3,4,5,6,7].map(n=>({type:'image' as const,image:photos[`photo-${n}`]!})),
    {type:'caption',text:'Print Design — A5'},
    {type:'image',image:photos['print']!},
  ],
};
