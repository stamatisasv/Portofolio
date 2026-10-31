# Photography & video portfolio

Vite + TypeScript + plain CSS. This is a local implementation; no remote or hosting has been created.

## Develop

Run `npm install`, then `npm run dev`. Open the printed URL at `/Portofolio/`.
Run `npm run build` and `npm run preview` for the production preview.

## Add your work

- Edit `src/data/site.ts` to confirm your public name and provide email and Instagram. Missing contact actions are omitted.
- Add optimized media to `public/media/projects/` and define projects in `src/data/projects.ts`. Array order defines the index order.
- Each project supports images, editorial rows, captions, and on-demand video. YouTube sources are video IDs; Vimeo sources are numeric IDs; file sources are public-relative paths. Configure a poster and aspect ratio for every video.
- Images declare natural width/height, descriptive alt text, and optional `{src, width}` variants. All variants use the configured base prefix.
- Demo assets are original SVG visual studies, not portfolio photography. Replace demo records or set `showDemos: false` before final launch.
- No categories, client credits, dates, or contact values have been assumed.

## Publish later

The proposed repository prefix is `/Portofolio/` in `vite.config.ts`. Confirm its exact spelling before creating a new independent repository. The provided Pages workflow runs on `main`; select GitHub Actions as the new repository's Pages source. Do not modify the existing developer portfolio repository.

Hash routes support direct refresh under the repository prefix. Independent project social previews require a later prerendering implementation.

## Verification

Production TypeScript and Vite build passes. Browser interaction and responsive visual QA could not run because no browser is connected to this session. Physical iPhone/Android checks, final media performance measurements, public name/contact review, and deployment verification remain required before launch.
