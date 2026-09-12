# Field & Fold — Full-Stack Deployment Capstone

A modular, client-side-routed e-commerce product catalog. No framework
dependency for the app logic — a small custom router and ES modules keep the
architecture explicit — with Vite handling bundling, minification, and asset
optimization for production.

## Architecture

```
full_project/
├── index.html              Single entry point / SPA shell
├── vite.config.js          Build + asset optimization config
├── vercel.json             SPA rewrite rule for Vercel
├── netlify.toml            Build command + SPA redirect for Netlify
├── package.json
└── src/
    ├── main.js             Registers routes, boots the router
    ├── router.js           Custom History API client-side router
    ├── style.css
    ├── data/
    │   └── products.js     Product catalog (swap for a real API later)
    ├── state/
    │   └── cart.js         Cart state + localStorage persistence, pub/sub
    ├── components/
    │   ├── Header.js       Nav + live cart badge
    │   ├── Footer.js
    │   └── ProductCard.js
    └── pages/
        ├── Home.js         Catalog grid with category filtering
        ├── ProductDetail.js
        ├── Cart.js
        └── NotFound.js
```

Each page and component is its own ES module — nothing reaches into another
module's internals, so pages can be added, removed, or reordered without
touching the router or the rest of the UI.

## Client-side routing

`router.js` intercepts clicks on any `<a data-link href="...">`, updates the
URL with `history.pushState`, and re-renders only the `#app` root — no full
page reload. It also handles the browser back/forward buttons via
`popstate`, and a `NotFoundPage` for unmatched routes.

Because this is a single-page app, a **static host must be told to serve
`index.html` for every path** so a direct visit or refresh on `/product/p01`
doesn't 404. That's what `vercel.json` and `netlify.toml` do — see below.

## Asset & code optimization

Running the production build (`npm run build`) hands optimization to Vite:

- JavaScript is minified and split by dynamic import boundaries
- CSS is minified and extracted into a hashed file
- Output filenames are content-hashed for long-term browser caching
- Product images use `loading="lazy"` so off-screen images don't block the
  initial page load

## Running locally

```bash
npm install
npm run dev
```

This starts a dev server (Vite will print the local URL, typically
`http://localhost:5173`) with hot reload.

## Building for production

```bash
npm run build
```

Outputs an optimized, minified build to `dist/`. Preview it locally with:

```bash
npm run preview
```

## Deploying

### Vercel
1. Push this folder to a GitHub repo (or run `vercel` from inside it with
   the Vercel CLI installed).
2. Import the repo at vercel.com — it auto-detects Vite (build command
   `npm run build`, output directory `dist`).
3. `vercel.json` is already set up to rewrite every path to `index.html` so
   client-side routes work on refresh.

### Netlify
1. Push this folder to a GitHub repo, or drag the built `dist/` folder into
   Netlify's manual deploy UI.
2. If deploying from Git, Netlify reads `netlify.toml` automatically
   (`npm run build`, publish directory `dist`, with the SPA redirect rule
   already included).

### Render
1. Create a new **Static Site** on Render, pointing at this repo.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add a rewrite rule in Render's dashboard: source `/*`, destination
   `/index.html`, action **Rewrite** — this plays the same role as
   `vercel.json` / `netlify.toml` on Render.

After deploying, you'll have a public URL serving the live catalog.

## Notes

- The catalog data in `src/data/products.js` is static so the whole app
  works with zero backend — swap the array for a `fetch()` call to a real
  API without changing any page or component code.
- Checkout has no payment processor; it simulates a confirmation and clears
  the cart, since this capstone's scope is the front-end architecture and
  deployment pipeline, not payments.
