# Portfolio loading audit

Local production preview; warm server, three requests per resource. These timings measure local HTTP transfer, not browser rendering, decoding, or public-host performance.

| Resource | Transferred | Median response | Status |
|---|---:|---:|---:|
| Page HTML | 0.5 KiB | 0.4 ms | 200 |
| CSS | 14.8 KiB | 0.3 ms | 200 |
| JS | 17.2 KiB | 0.3 ms | 200 |
| Shisha cover | 693.3 KiB | 0.8 ms | 200 |
| Story image | 281.2 KiB | 0.5 ms | 200 |
| Menu image | 1272.2 KiB | 1.3 ms | 200 |
| Video 1 initial 256 KiB | 256.0 KiB | 0.4 ms | 206 |
| Video 3 initial 256 KiB | 256.0 KiB | 0.4 ms | 206 |

## Payload sizes

- All project photos: 26.5 MiB across 46 files.
- All videos: 610.6 MiB across 17 files. Videos are requested only when visible.
- Gzipped application HTML/CSS/JS: 10.7 KiB.

Largest photos:
- media/projects/gia-panta/still-5.jpg: 2.05 MiB
- media/projects/gia-panta/still-1.jpg: 1.89 MiB
- media/projects/gia-panta/still-6.jpg: 1.64 MiB
- media/projects/gia-panta/still-3.jpg: 1.57 MiB
- media/projects/gia-panta/still-2.jpg: 1.57 MiB

## Transfer estimates at 10 Mbps

Illustrative calculation only; excludes latency, competing requests, and decoding. Full-file video download time is not playback startup time.
- Shisha cover.jpg: 0.57 seconds for the complete file.
- Shisha story-bounty.jpg: 0.23 seconds for the complete file.
- Shisha menu.jpg: 1.04 seconds for the complete file.
- Shisha video-1.mp4: 52.59 seconds for the complete file.
- Shisha video-3.mp4: 38.04 seconds for the complete file.

## Verification and limitations

- Build and all seven automated tests passed.
- Verified byte-range responses for video startup (HTTP 206).
- Images below the fold are lazy loaded; video sources are deferred until visibility.
- No browser surface available: LCP, CLS, INP, image decode time, and real video startup remain unmeasured.
- No public deployment was tested or performed in this update.

## Optimization comparison

- Total project photo payload reduced from 80.2 MiB to 26.5 MiB (about 67%).
- Shisha cover reduced from 7463.5 KiB to 693.3 KiB (about 91%).
- Originals in Portofolio Content were preserved.
