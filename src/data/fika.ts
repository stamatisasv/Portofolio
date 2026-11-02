import type {Photo, Project, MediaBlock} from '../types';

const photos:Photo[] = [
  {
    "src": "media/projects/fika/cover-1200.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 1",
    "width": 1200,
    "height": 2133,
    "variants": [
      {
        "src": "media/projects/fika/cover-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/cover-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-2-1080.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 2",
    "width": 1080,
    "height": 1920,
    "variants": [
      {
        "src": "media/projects/fika/drone-2-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-2-1080.webp",
        "width": 1080
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-3-1080.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 3",
    "width": 1080,
    "height": 1920,
    "variants": [
      {
        "src": "media/projects/fika/drone-3-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-3-1080.webp",
        "width": 1080
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-5-1080.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 5",
    "width": 1080,
    "height": 1920,
    "variants": [
      {
        "src": "media/projects/fika/drone-5-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-5-1080.webp",
        "width": 1080
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-6-1080.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 6",
    "width": 1080,
    "height": 1920,
    "variants": [
      {
        "src": "media/projects/fika/drone-6-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-6-1080.webp",
        "width": 1080
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-7-1058.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 7",
    "width": 1058,
    "height": 1880,
    "variants": [
      {
        "src": "media/projects/fika/drone-7-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-7-1058.webp",
        "width": 1058
      }
    ]
  },
  {
    "src": "media/projects/fika/drone-4-1080.webp",
    "alt": "Fika Beach Bar \u2014 aerial photograph 4",
    "width": 1080,
    "height": 1920,
    "variants": [
      {
        "src": "media/projects/fika/drone-4-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/drone-4-1080.webp",
        "width": 1080
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-1-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 1",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-1-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-1-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-2-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 2",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-2-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-2-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-3-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 3",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-3-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-3-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-4-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 4",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-4-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-4-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-5-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 5",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-5-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-5-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-6-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 6",
    "width": 1200,
    "height": 1500,
    "variants": [
      {
        "src": "media/projects/fika/photo-6-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-6-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-7-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 7",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-7-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-7-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-8-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 8",
    "width": 1200,
    "height": 1500,
    "variants": [
      {
        "src": "media/projects/fika/photo-8-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-8-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-9-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 9",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-9-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-9-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-10-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 10",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-10-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-10-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-11-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 11",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-11-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-11-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-12-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 12",
    "width": 1200,
    "height": 1753,
    "variants": [
      {
        "src": "media/projects/fika/photo-12-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-12-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-13-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 13",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-13-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-13-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-14-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 14",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-14-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-14-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-15-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 15",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-15-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-15-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-16-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 16",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-16-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-16-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-17-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 17",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-17-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-17-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-18-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 18",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-18-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-18-1200.webp",
        "width": 1200
      }
    ]
  },
  {
    "src": "media/projects/fika/photo-19-1200.webp",
    "alt": "Fika Beach Bar \u2014 beach bar photograph 19",
    "width": 1200,
    "height": 1800,
    "variants": [
      {
        "src": "media/projects/fika/photo-19-600.webp",
        "width": 600
      },
      {
        "src": "media/projects/fika/photo-19-1200.webp",
        "width": 1200
      }
    ]
  }
];

const film=(name:string,title:string):MediaBlock=>({
  type:'video',provider:'file',source:`media/projects/fika/${name}.mp4`,
  poster:{src:`media/projects/fika/${name}-poster.webp`,alt:`Fika — ${title}`,width:600,height:1066},
  title:`Fika — ${title}`,aspectRatio:'9 / 16',
});
const still=(index:number):MediaBlock=>({type:'image',image:photos[index]!});
// Mix beach atmosphere, aerials, food photographs, and the three short films.
const blocks:MediaBlock[]=[still(0),film('beach-film','Beach bar film'),still(7),still(1),
  ...[8,9,10,2,11,12].map(still),film('club-sandwich','Club sandwich'),
  ...[13,14,3,15,16,17,4].map(still),film('sando','Sando'),
  ...[18,19,20,5,21,22,23,6,24,25].map(still)];
export const fikaProject:Project={
  id:'fika',slug:'fika',title:'Fika',category:'Social Media Content',
  cover:photos[0]!,galleryLayout:'mixed',blocks,published:true,
};
