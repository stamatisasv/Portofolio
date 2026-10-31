# Photography & Video Portfolio — Implementation Brief

Reference: https://kostisaggelopoulos.com/  
Reviewed: 31 October 2026  
Owner: Stamatis Asvestas (confirm preferred public spelling before final launch)  
Local folder: `Portofolio`  
Hosting target: a NEW repository on GitHub Pages, independent of `stamatisasv.github.io`.

## 1. Start here: initialize the project through the terminal

These are instructions to execute on the owner's computer. This brief does not mean the local folder has already been initialized. Open the existing `Portofolio` folder in VS Code, then open its integrated terminal. The terminal must be inside that folder; do not create a second nested `Portofolio` folder.

Recommended foundation: **Vite + TypeScript + plain CSS**, using the `vanilla-ts` template. This is a small static gallery site; this stack provides a local server, typed content definitions, reusable rendering functions, and a production build without a large application framework. This is a recommendation, not an observed technology of the reference. The reference itself identifies Adobe Portfolio in its footer.

Run these commands first, while the folder is still empty:

```bash
pwd
node --version
npm --version
npm create vite@latest . -- --template vanilla-ts
```

If asked for a package name because the folder contains uppercase letters, enter `portofolio`. Keep the local folder name `Portofolio`. If offered automatic installation/startup, choose manual setup so the following commands remain explicit. Never accept a prompt to remove existing files if the folder unexpectedly contains work; inspect it first.

Then:

```bash
npm install
git init
git branch -M main
npm run dev
```

Open the local address printed by Vite. Stop the server with `Ctrl+C` when needed. Use a supported current Node LTS release; the checked Vite guide lists Node 20.19+ or 22.12+ as minimum supported branches, and the installed template's engine requirement remains authoritative.

After scaffolding, copy this Markdown file into the project root. Do not scaffold over a directory already populated with media or code. Vite's default demo screen is only the initial setup checkpoint; replace it during implementation.

Optional phone preview on a trusted local network:

```bash
npm run dev -- --host 0.0.0.0
```

Use the Network URL printed by Vite on a phone connected to the same Wi-Fi. This local development server is not the published portfolio.

## 2. Current scope and boundaries

Build the reusable visual structure and interactions first. The owner will add existing photos, videos, cover choices, categories, and final project order later.

- This portfolio is for photography and video, separate from software development work.
- Use the reference's visual language and browsing flow, with the owner's original identity and media.
- Do not copy the reference photographer's photographs, films, client credits, contact details, branding, Adobe-specific assets, or proprietary font files.
- Do not edit the existing developer portfolio repository.
- Do not finalize categories from assumptions. Earlier suggestions such as Films, Photography, Weddings & Events, and Music Videos are possibilities, not approved final information architecture.
- Do not invent clients, dates, awards, testimonials, or project descriptions.
- Use a few clearly labeled local demo assets to demonstrate layout if real media is not yet supplied. Keep demo records replaceable and mark them `demo: true`; exclude them from the final launch unless intentionally retained as examples.
- No CMS, accounts, database, upload dashboard, backend, or paid dependency is required for version 1.
- This request delivers an analysis and build brief. Publishing and repository creation are later implementation steps.

## 3. What was actually inspected

Direct browser inspection covered the work index, Greek mountains gallery, Manna Arcadia gallery, Contact page, and the mobile navigation overlay. Desktop observations were made at approximately 1728 × 907, and phone observations at 390 × 844 CSS pixels. The flow was sampled rather than every asset in every gallery exhaustively audited.

Separate facts below from proposed implementation changes. Mobile observations are responsive browser inspection, not measured performance on a physical iPhone or Android device. Contact submission was not sent, provider video playback was not exhaustively tested, and no reliable lightbox behavior was established. Do not claim those were verified.

### 3.1 Information architecture

The index is immediately visible: there is no introductory hero, long biography, services pitch, or filter toolbar before the work.

| Surface | Observed route | Purpose |
| --- | --- | --- |
| Entry/index | `/` and work navigation to `/photography-1` | A curated collection of project covers |
| Brand/name link | `/photography-1` | Return to the work index |
| Contact | `/contact` | Name, email, message form |
| Example photo/video collection | `/outdoors` | Greek mountains gallery |
| Example commissioned collection | `/copy-of-hotels` | Manna Arcadia gallery |
| Example architecture collection | `/architecture` | MO Costa Navarino gallery |

Some route names on the reference are legacy labels. Preserve the concept of distinct collections, not these arbitrary slugs.

The index contained 12 cover links, ordered left-to-right and then top-to-bottom:

1. Manna Arcadia — 2024
2. MO Costa Navarino — 2024
3. Indonesia — 2026
4. Greek mountains — 2024
5. Underwater — 2024
6. People — 2024
7. Discover Greece — 2025
8. Cali Mykonos — 2025
9. Hotels — 2024
10. Food — 2024
11. Columbia — 2024
12. Automotive — 2024

This mixes places, client projects, and subject collections. The unifying element is a strong cover image rather than a rigid taxonomy. The new site should support this flexibility without inheriting these projects.

### 3.2 Desktop header and first impression

- Almost-black page background, approximately `#111111`; white primary text and muted gray secondary text.
- Left: `MY WORK` and `CONTACT`. Center: uppercase photographer name. Right: Instagram and email icons.
- Uppercase, tall condensed display typography. The inspected custom font-family identifier was `shzc`; this does not establish a licensable public font name. Use a separately licensed condensed alternative, such as a suitable open-font option, and tune its metrics visually.
- Desktop brand appears around 30–32px; navigation roughly 16–18px. Treat these as visual starting points rather than exact source tokens.
- At 1728px width, the work grid begins around x=69 and y=160. Side margins are approximately 4% of the viewport. Each cover occupies roughly 792 × 451px, including its thin separation: close to a 16:9 image.
- The header is in normal page flow rather than a persistent fixed bar in the inspected desktop state. Do not add a large sticky header by default.
- The first viewport is primarily imagery. Keep text minimal and do not insert a generic introduction above the grid.

### 3.3 Work index composition and interaction

- Two equally sized columns on desktop.
- Consistent landscape cover proportions with tight, dark gaps, approximately 4–6px.
- Edge-to-edge imagery within each tile; no rounded cards, shadows, badges, borders, or floating buttons on every cover.
- Project title and year exist in each tile's link content. They are visually hidden in the resting states inspected, leaving the image dominant. A title overlay on hover/focus is the intended adaptation; its exact reference transition timing was not measured.
- Each tile is one large link to a collection page, rather than a nested group of competing actions.
- The active navigation item is brighter than the inactive item.
- The bottom includes an Adobe Portfolio attribution and a return-to-top link/control. Our site should have a small original footer, not an Adobe attribution.

### 3.4 Project page rhythm

The Greek mountains page begins with the same global header, then a centered uppercase title, generous spacing, and a wide opening photograph. At the inspected desktop size its main gallery was approximately 1400px wide, centered within the page, narrower than the index grid.

The gallery is editorial rather than a uniform thumbnail matrix:

- Full-width landscape images establish a scene.
- Some rows contain a wide landscape beside a narrower portrait.
- Other rows contain two or three images with aligned row heights and different widths.
- Dark, thin gutters connect the images into a continuous visual essay.
- Photos and video embeds can coexist within one project.
- Greek mountains exposed two Adobe-hosted video embeds. Manna Arcadia exposed multiple embeds. These observations support mixed-media blocks, not a requirement to use Adobe's video service.
- A `You may also like` section follows the collection. On the sampled Greek mountains page, Food and Underwater were linked. On the sampled mobile Manna page, Food was exposed. Do not assume the related projects are chronological next/previous navigation.

Browsing loop: **work index → chosen project → scroll through media → related project or return to work → Contact when interested**. The brand link is an important consistent way home.

### 3.5 Contact page

The reference uses a centered `CONTACT` heading and a narrow form, roughly 600px wide on desktop. Required fields are Name, Email Address, and Message. Inputs are dark gray with light text; the message box is taller. The submit button is a small white pill with dark text. The surrounding space remains dark and uncluttered.

GitHub Pages does not itself process form submissions. For the new site, make email and Instagram links the working version-1 contact method when actual values are provided. Do not display a fake-success form. Add a form only after choosing a real submission service and implementing pending, success, and failure states. No email/API secrets belong in frontend code.

### 3.6 Mobile observations and improvements

At 390px width:

- Header keeps a centered name and a hamburger icon at the right. The brand text was 23px in computed styling.
- Tapping the hamburger opens a full-screen dark menu. Work and Contact appear vertically near the middle; social/email icons are near the bottom; close control is at the top right.
- The index switches to one column with covers spanning the full viewport. Measured tile width was 390px and height about 224px, including the gap.
- The home and sampled project/contact pages did not show horizontal overflow in the observed state.
- Project titles were not visible on resting mobile cover images, despite being in the link's accessible text. The new site should keep titles visible on touch devices.
- Some project gallery rows preserve several columns on mobile. The sampled Manna gallery included images only about 91px wide in a four-image row. The new site should reflow these to one column, or occasionally two sufficiently large portraits.
- Manna showed a large dark region between its title and initial photos while media was loading/laid out. The exact cause was not established. Avoid unexplained blank areas in our site: reserve correct media ratios, provide poster images, and use compact spacing.
- Contact inputs reflow to nearly the phone width with roughly 20px side padding.

Do not reproduce these mobile weaknesses simply to match the reference. Device testing of our implementation is still required before describing it as smooth.

## 4. Target design specification

### 4.1 Global styles

Use these initial tokens and adjust after visual review:

```css
:root {
  color-scheme: dark;
  --bg: #111111;
  --text: #f7f7f5;
  --muted: #aaaaa7;
  --surface: #343434;
  --gap: 5px;
  --page-gutter: clamp(20px, 4vw, 80px);
  --gallery-max: 1400px;
}
```

Set `box-sizing: border-box` globally. Use an ordinary readable font for body copy and form inputs; reserve condensed uppercase lettering for brand, navigation, titles, and short labels. Avoid tiny body text merely to match the condensed aesthetic.

No gradients as page decoration, generic marketing sections, oversized welcome headline, glass effects, scroll hijacking, custom cursor, or intro loader. Let the media create the visual identity.

### 4.2 Responsive layout rules

These are proposed breakpoints, not recovered reference breakpoints:

| Width | Index | Header | Project gallery |
| --- | --- | --- | --- |
| Below 768px | One column, full-bleed covers | Name + menu button | Single-column default; no tiny multi-image rows |
| 768–1023px | Two columns if labels remain readable | Compact desktop or menu if needed | At most two images per row |
| 1024px and above | Two columns, around 4vw outer margins | Left navigation, centered name, right social links | Editorial rows within a centered 1400px maximum |

Use CSS Grid `minmax(0, 1fr)`. Do not mask layout errors with `overflow-x: hidden`. Images must shrink within containers. Use `100svh` with a `100dvh` enhancement for the mobile menu; include safe-area padding for devices with notches. Avoid fixed heights for headings and content areas.

### 4.3 Tile behavior

- Use `<a>` for the full tile, with accessible title text.
- Covers use `aspect-ratio: 16 / 9` and `object-fit: cover`; keep per-cover focal position configurable.
- Desktop fine-pointer hover and keyboard focus reveal a subtle dark overlay and readable title/year.
- On `(hover: none)` or `(pointer: coarse)`, title/year remain visible over a subtle contrast scrim. Tapping navigates immediately; no first-tap-to-reveal requirement.
- Use a small opacity transition around 180–240ms. A restrained scale change is optional; do not crop important content further.
- Focus must be visibly identifiable, including against light photographs.

### 4.4 Project navigation and gallery

Keep project page titles modest, centered, and separated from media by intentional spacing. Use smaller spacing on mobile. Gallery blocks should support a single image, image row, video, or short caption.

Render images with natural proportions; cropping belongs primarily to covers. Preserve explicit editorial order rather than CSS columns that reorder reading flow. Related projects come from configured project IDs, with a deterministic fallback to other published projects. Omit the section when none exist.

Provide a visible Back to work link near the end of each project. Preserve home scroll position when using browser Back. A full-screen image lightbox is an optional enhancement, not established reference behavior; defer it until the base flow works unless specifically requested.

### 4.5 Mobile menu accessibility

Use a real button with `aria-expanded`, `aria-controls`, and an accessible Open menu/Close menu name. Ensure a minimum 44 × 44px touch area. While open, prevent background interaction and scrolling, manage focus within the menu, close on Escape, and return focus to the trigger. Selecting a route closes the menu. Release locks and restore scrolling when crossing to a desktop layout.

### 4.6 Smoothness and motion

Use native document scrolling. Do not attach expensive animation work to every scroll event. Images must be visible even if animation code fails. Do not autoplay video on page load. Respect `prefers-reduced-motion`, disabling decorative motion and smooth-scroll behavior when requested.

A return-to-top button may appear after the visitor has scrolled meaningfully, using an IntersectionObserver sentinel. Keep it clear of phone safe areas and video controls. Use a real accessible label.

## 5. Static architecture and future media organization

Use one Vite HTML entry with hash-based view routes for this first build. This avoids GitHub Pages refresh failures without requiring server rewrites:

- `/#/` → Work
- `/#/project/example-project` → Project detail
- `/#/contact` → Contact

On the proposed repository URL these become `/Portofolio/#/project/example-project`. Never use root-relative `/project/...` navigation for this architecture. Handle invalid slugs with a useful not-found view and a Work link. Respond to both initial load and `hashchange`; update the page title and main-content focus when views change. Keep a skip-to-content link.

Hash routing is a deliberate simple hosting choice. Project-specific search metadata and rich link previews would be better served by pre-rendered HTML pages in a later version; do not claim hash routes provide independent social previews.

Suggested source organization:

```text
Portofolio/
  index.html
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  PORTFOLIO_IMPLEMENTATION_BRIEF.md
  src/
    main.ts
    router.ts
    types.ts
    styles.css
    data/
      site.ts
      projects.ts
    components/
      header.ts
      project-card.ts
      gallery.ts
      footer.ts
    pages/
      work.ts
      project.ts
      contact.ts
  public/
    media/
      demo/
      projects/
    fonts/
  .github/
    workflows/
      deploy.yml
```

### 5.1 Content definitions

Keep media and presentation separate. A future content pass should modify `src/data/` and add files under `public/media/projects/`, without rewriting layout functions.

```ts
export interface Photo {
  src: string; // relative to public/, e.g. media/projects/project-a/image-01.webp
  alt: string;
  width: number;
  height: number;
  srcSet?: string; // build from structured variants using the asset helper
}

export type MediaBlock =
  | { type: 'image'; image: Photo }
  | { type: 'row'; images: Photo[] }
  | {
      type: 'video';
      provider: 'youtube' | 'vimeo' | 'file';
      source: string;
      poster: Photo;
      title: string;
      aspectRatio: string;
    }
  | { type: 'caption'; text: string };

export interface Project {
  id: string;
  slug: string;
  title: string;
  year?: string;
  category?: string;
  cover: Photo;
  coverPosition?: string;
  blocks: MediaBlock[];
  relatedIds?: string[];
  published: boolean;
  demo?: boolean;
}
```

Array order defines display order. A project can mix photos and videos. Category is optional and does not automatically introduce a filter bar. Use actual descriptive alt text when real images arrive; do not leave every image alt blank as seen in the sampled reference galleries.

Site configuration holds public display name, optional email, optional Instagram URL, and short optional bio. Missing contact values should omit the corresponding action rather than use invented details or a broken `#` link.

Use readable lowercase filenames without spaces. Keep original full-resolution source media outside the published site; add optimized web exports later. No media import or upload is required to write this structure now.

### 5.2 Base-path-safe media

Public assets must work under a project repository prefix:

```ts
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
```

Use this for covers, posters, full images, and each responsive image variant. Do not concatenate the base onto absolute external video links. Validate allowed external embed hosts when implementing video rendering. Prefer DOM text setters for titles/captions rather than injecting content as raw HTML.

## 6. Media performance requirements

- Produce responsive cover exports later, such as 480, 960, and 1600px widths where source dimensions allow.
- Use AVIF/WebP with a fallback when needed. Avoid publishing enormous originals as grid covers.
- Set image width and height, or a reliable aspect ratio, to reserve space and prevent content jumps.
- Load visible top-of-page covers eagerly; lazy-load below-the-fold images with async decoding. Do not assign high fetch priority to every image.
- Use `srcset` and `sizes` matching actual column widths and mobile full-width cards.
- Target roughly 100–250KB for typical covers where quality allows; larger detailed full-gallery exports may need 200–600KB. These are budgets, not guarantees.
- Render embedded videos as poster buttons initially. Load an iframe/player only when the visitor chooses to play. For local videos, use controls, `playsinline`, `preload="none"`, and an explicit poster.
- Preserve provider-appropriate video aspect ratios, including vertical clips. Do not force every film into 16:9.
- Avoid loading many provider iframes just because their project route opened. Pause/clean up players when leaving a view.
- Self-host a licensed WOFF2 display font if used, with `font-display: swap` and a narrow fallback. Include the license. Use a system font until the chosen font exists.
- Smoothness targets after real media is added: LCP around 2.5s or better, CLS at most 0.1, and INP around 200ms or better under an agreed representative test setup. These are acceptance targets, not measured outcomes from this audit.

## 7. GitHub Pages configuration

Proposed new repository name: **`Portofolio`**, matching the folder, unless the owner chooses another name. Folder and repository names may differ. The deployed prefix is determined by the exact repository name, including capitalization.

Expected URL only if this proposed repository name is used:

```text
https://stamatisasv.github.io/Portofolio/
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Portofolio/',
});
```

If the repo is later named `visual-portfolio`, change `base` to `/visual-portfolio/`. For a future custom domain at its root, use `/` and update canonical metadata accordingly. Do not add a CNAME before a domain is selected and configured.

Create `.github/workflows/deploy.yml` during implementation. The action revisions below are taken from Vite's deployment guide checked on the audit date; review official action updates when implementing later.

```yaml
name: Deploy portfolio to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d
      - uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9
        with:
          path: dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346
```

Commit `package-lock.json`; the workflow uses `npm ci`. Confirm `.gitignore` excludes `node_modules/` and `dist/`.

After implementation, create an empty new GitHub repository, without an initial README if pushing an existing local Git history. If using GitHub Free, use a public repository for Pages. Then, from the project terminal, after confirming the actual repository name:

```bash
npm run build
git add .
git commit -m "Create photography and video portfolio"
git remote add origin https://github.com/stamatisasv/Portofolio.git
git push -u origin main
```

The remote command above assumes `Portofolio` was actually created. If a remote already exists, inspect `git remote -v` rather than overwriting it blindly. In the NEW repository, select **Settings → Pages → Source: GitHub Actions**. Check the deployment result and returned URL. Do not change Pages settings on `stamatisasv.github.io`.

## 8. Implementation sequence

1. Scaffold and verify the default Vite project locally.
2. Replace starter demo; add dark layout tokens, semantic header/footer, and Work view.
3. Add typed site/project configuration and a few labeled demo projects using local media only.
4. Implement project routes, configurable mixed-media blocks, related links, and invalid-project handling.
5. Implement accessible mobile menu, keyboard focus, Back navigation, and mobile visible tile labels.
6. Implement contact links using supplied values. Defer submission service until selected.
7. Add optimized media behavior, posters, responsive images, and reduced-motion handling.
8. Configure the exact repository base and Pages workflow; validate the production build under that prefix.
9. Perform desktop, keyboard, responsive, and real-phone checks before publishing.
10. In a later content pass, replace demo data with the owner's selected files, titles, categories, order, contact details, and cover focal positions.

Do not stop at a screenshot of the index: Work, project detail, menu, Contact, related links, browser Back, and direct-link refresh must all function.

## 9. Acceptance and QA checklist

### Visual and navigation

- [ ] Desktop opens directly on the two-column work gallery.
- [ ] Name is centered; Work and Contact are easy to find.
- [ ] Tiles have consistent cover proportions, tight gutters, and no generic card decoration.
- [ ] Keyboard focus reveals labels and remains visible.
- [ ] Phone labels are readable without hovering; one tap opens the project.
- [ ] Project pages preserve media order and image proportions.
- [ ] Related links lead to valid configured projects.
- [ ] Browser Back returns naturally to the index and restores its scroll position.
- [ ] Direct project/contact URL refresh works on the deployed repository prefix.
- [ ] Invalid project URLs show a useful recovery view.

### Mobile and accessibility

Test 320, 375, 390, 430, 768, 1024, and 1440 CSS-pixel widths, portrait and landscape where relevant. Also test an actual iPhone/Safari and Android/Chrome when available. Record unavailable devices honestly.

- [ ] No horizontal overflow, overlapping name/menu, clipped text, or tiny four-column image rows.
- [ ] Menu opens/closes by touch and keyboard; Escape works and focus returns correctly.
- [ ] Background is inert while menu is open and normal scrolling returns after closing.
- [ ] Text remains usable at 200% zoom.
- [ ] Touch actions have at least 44 × 44px targets.
- [ ] Video posters and players fit both horizontal and vertical content.
- [ ] Back-to-top does not obscure media controls or phone safe areas.
- [ ] Reduced-motion preferences are respected.
- [ ] Page transitions update document title and focus without unexpected jumps.

### Build, content, and loading

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

Open the preview at the configured repository prefix (for example `/Portofolio/`), not only the server root.

- [ ] TypeScript/build succeeds; production preview has no console errors.
- [ ] All paths work with the exact GitHub repository prefix.
- [ ] Below-the-fold images lazy-load; first visible covers do not wait unnecessarily.
- [ ] Images reserve space; video iframes load on demand.
- [ ] Slow-network loading produces no prolonged empty intro or invisible content.
- [ ] No reference-site media or contact details remain in the new site.
- [ ] Demo content is clearly identified and final launch content has been reviewed.
- [ ] No broken links, invented email, fake submit success, or private source media is published.

## 10. Instructions for the coding assistant receiving this file

Read the existing repository and any AGENTS.md before making changes. If this is still an empty folder, follow section 1. If it is already scaffolded, inspect and continue rather than regenerating it. This file is the implementation brief; supplied user changes take priority.

Implement version 1 as an original static photography/video portfolio inspired by the reference. Prioritize its composition and browsing rhythm, then the explicit mobile improvements above. Keep real content configurable and leave final media curation for the owner. Report what was implemented, what was actually tested, and any remaining missing content. Do not claim a deployment or real-device verification without evidence.

## 11. Sources and evidence limits

- Reference index, inspected directly: https://kostisaggelopoulos.com/
- Work index: https://kostisaggelopoulos.com/photography-1
- Greek mountains collection: https://kostisaggelopoulos.com/outdoors
- Manna Arcadia collection: https://kostisaggelopoulos.com/copy-of-hotels
- Contact page: https://kostisaggelopoulos.com/contact
- Vite setup and runtime requirements: https://vite.dev/guide/
- Vite GitHub Pages configuration and deployment workflow: https://vite.dev/guide/static-deploy
- GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

Reference observations describe the sampled rendered pages on the audit date. Proposed architecture, breakpoints, accessibility behavior, performance budgets, and content schema are our implementation decisions. No source-code access to the reference or physical-device performance measurement is implied.
