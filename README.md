# Nikah Invitation

A static website: no build step, no framework, no dependencies. Open `index.html` locally, or deploy to Vercel.

## Deploying on Vercel

1. Push this folder to GitHub (the `aj1824/wedding-invitation` repo).
2. In Vercel, go to **Add New → Project** and import the repo.
3. Keep the defaults: **Framework Preset: Other**, no build command, root directory `./`. Then click **Deploy**.

After that, every push to `main` redeploys automatically.

`vercel.json` already sets up:
- clean URLs
- a permanent redirect from the old `/envelope.html` link to `/`
- long caching for the pictures

`.vercelignore` keeps `tools/` and this README off the live site.

## Changing the details

Edit **`config.js`**. It holds the names, parents, events, venues, map links, countdown time and music. Nothing else needs to change.

## Venue locations

Each event in `config.js` has `lat`, `lng` and an optional Google `placeId`. These drive the exact pin, the Directions button and the live map, which loads when a guest taps "View live map".

To get coordinates, open the place in Google Maps, long-press or right-click the pin, and copy the two numbers shown, e.g. `18.47299, 73.89273`. If `lat`/`lng` are `null`, the map searches by venue name instead.

## Personal links for each guest

Add `?to=` and the guest's name to the link, and the envelope will show "To, …" like the printed card:

```
https://your-site.vercel.app/?to=Khan%20Family
```

Use `%20` for spaces. WhatsApp usually handles plain spaces too.

## Music

- By default a soft built-in piece plays (`music.softSong` in `config.js`): an original, slow felt-piano and strings piece, mixed quietly and generated live in the browser. Its volume is `VOL` near the top of `assets/js/music.js`.
- To use your own song, add `song.mp3` next to `index.html` and set `music.file: "song.mp3"` in `config.js`.
- Browsers only allow sound after the first tap, so the music starts when the guest taps the wax seal.

## Project structure

```
index.html              page markup only
config.js               ← all wedding details
vercel.json             Vercel settings (redirect, caching)
assets/
  css/
    base.css            colours, layout, pausing off-screen animations, lite mode
    components.css      buttons, countdown, flip card, event cards, venue maps
    intro.css           envelope → ribbon → garden gates opening
    sections.css        invitation, reception, closing pages
    responsive.css      scroll hint, small-phone & short-screen sizing, desktop "centred card" layout
  js/
    core.js             shared helpers (window.Invite), section visibility, reveal
    fx.js               petals / confetti / sparkles canvas
    motion.js           3D tilt + parallax
    music.js            song.mp3 or the built-in piano piece
    intro.js            the opening sequence
    app.js              wires everything together
    components/         countdown, carousel, venues, flipcard, emblems, ambient, scrollhint
  img/                  pre-rendered flower and sky pictures (WebP)
tools/                  source artwork + script that renders assets/img (not deployed)
```

Scripts are plain `<script defer>` files rather than ES modules, so the site also works when `index.html` is opened by double-click.

## Updating after a change

The CSS and JS links in `index.html` end in `?v=9`. After changing any CSS, JS or image, increase that number (to `?v=10` and so on). Otherwise visitors' browsers may keep showing the cached old files.

## Changing the flower and sky artwork

The pictures in `assets/img/` are generated from `tools/art.js`. After editing that file, run:

```
node tools/render-art.js
```

This needs Node 22 or newer and Edge or Chrome installed.

## Why it's fast

- The roughly 1,100 SVG flowers are pre-rendered into a few WebP pictures instead of being drawn live.
- Animations only run in the section on screen. Sections further down aren't rendered until you scroll near them.
- The 3D tilt only updates visible elements and stops completely when nothing is moving.
- Effects animate only `transform` and `opacity`, with no blend modes or animated SVG filters.
- The Arabic font is subset to just the letters used.
- Low-end phones, data-saver mode and "reduce motion" automatically get a lighter version (`html.lite`).
