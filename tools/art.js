/*
  Source artwork for the pre-rendered images in assets/img/.
  The flower canopy and sky scene are drawn here as SVG, then tools/render-art.js
  rasterises them to WebP. Shipping pictures instead of ~1,100 live SVG flowers
  is what keeps the site smooth on phones.

  Edit this file, then run:  node tools/render-art.js
*/
(function () {
  const DEFS = `<defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3c8ea"/><stop offset=".3" stop-color="#d6d4ef"/><stop offset=".58" stop-color="#ede3f1"/><stop offset=".7" stop-color="#f6e7ec"/><stop offset="1" stop-color="#f3e3e6"/></linearGradient>
    <radialGradient id="sunG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7bdd8"/><stop offset=".5" stop-color="#bccde2"/><stop offset="1" stop-color="#d7e0ec"/></linearGradient>
    <linearGradient id="floorP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e3e2"/><stop offset="1" stop-color="#dcc6c6"/></linearGradient>
    <linearGradient id="cyp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b4a34"/><stop offset=".45" stop-color="#6b7e5b"/><stop offset="1" stop-color="#3f4e37"/></linearGradient>
    <linearGradient id="stoneG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9dfdf"/><stop offset=".4" stop-color="#fbf7f7"/><stop offset="1" stop-color="#e2d6d6"/></linearGradient>
    <radialGradient id="petW" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#f6eaee"/><stop offset=".6" stop-color="#fffdfd"/><stop offset="1" stop-color="#f3e6ea"/></radialGradient>
    <radialGradient id="petP" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#e7bcc4"/><stop offset=".6" stop-color="#f7e1e5"/><stop offset="1" stop-color="#ebc8ce"/></radialGradient>
    <radialGradient id="puffG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ece1e7"/></radialGradient>
    <linearGradient id="leafS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a5b496"/><stop offset="1" stop-color="#5f7253"/></linearGradient>
    <radialGradient id="rg1" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#fffbfb"/><stop offset=".55" stop-color="#f5e1e3"/><stop offset="1" stop-color="#d9aeb4"/></radialGradient>
    <radialGradient id="rg2" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#fff7f8"/><stop offset=".6" stop-color="#eecfd4"/><stop offset="1" stop-color="#c99aa2"/></radialGradient>
    <radialGradient id="rgC" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#e8bcc3"/><stop offset="1" stop-color="#b47f88"/></radialGradient>
    <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#93a585"/><stop offset="1" stop-color="#4d5f45"/></linearGradient>
    <filter id="cloudBlur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
    <symbol id="rose" viewBox="0 0 120 120">
      <path d="M58 66 C30 70 12 92 4 114 C32 110 52 94 58 66Z" fill="url(#leafG)"/><path d="M62 66 C92 72 110 92 116 112 C88 110 68 94 62 66Z" fill="url(#leafG)"/>
      <g transform="translate(60 56)">
        <g fill="url(#rg1)" stroke="#c99aa2" stroke-opacity=".4"><ellipse rx="22" ry="26" cy="-20"/><ellipse rx="22" ry="26" cy="-20" transform="rotate(60)"/><ellipse rx="22" ry="26" cy="-20" transform="rotate(120)"/><ellipse rx="22" ry="26" cy="-20" transform="rotate(180)"/><ellipse rx="22" ry="26" cy="-20" transform="rotate(240)"/><ellipse rx="22" ry="26" cy="-20" transform="rotate(300)"/></g>
        <g fill="url(#rg2)" stroke="#b47f88" stroke-opacity=".35"><ellipse rx="16" ry="19" cy="-12" transform="rotate(30)"/><ellipse rx="16" ry="19" cy="-12" transform="rotate(102)"/><ellipse rx="16" ry="19" cy="-12" transform="rotate(174)"/><ellipse rx="16" ry="19" cy="-12" transform="rotate(246)"/><ellipse rx="16" ry="19" cy="-12" transform="rotate(318)"/></g>
        <circle r="13" fill="url(#rgC)"/><path d="M-6 -2 C-6 -10 8 -10 8 0 C8 8 -4 9 -5 2 C-5 -3 3 -4 3 1" fill="none" stroke="#fff3f5" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
      </g>
    </symbol>
    <symbol id="rz" viewBox="0 0 120 120"><g transform="translate(60 60)">
      <g fill="url(#rg1)" stroke="#c99aa2" stroke-opacity=".4"><ellipse rx="24" ry="28" cy="-20"/><ellipse rx="24" ry="28" cy="-20" transform="rotate(72)"/><ellipse rx="24" ry="28" cy="-20" transform="rotate(144)"/><ellipse rx="24" ry="28" cy="-20" transform="rotate(216)"/><ellipse rx="24" ry="28" cy="-20" transform="rotate(288)"/></g>
      <g fill="url(#rg2)" stroke="#b47f88" stroke-opacity=".3"><ellipse rx="16" ry="19" cy="-11" transform="rotate(36)"/><ellipse rx="16" ry="19" cy="-11" transform="rotate(156)"/><ellipse rx="16" ry="19" cy="-11" transform="rotate(276)"/></g>
      <circle r="12" fill="url(#rgC)"/><path d="M-5 -2 C-5 -9 7 -9 7 0 C7 7 -3 8 -4 2" fill="none" stroke="#fff3f5" stroke-opacity=".8" stroke-width="1.5"/></g></symbol>
    <symbol id="bW" viewBox="-12 -12 24 24"><g fill="url(#petW)" stroke="#e4d2d8" stroke-width=".4"><ellipse rx="4.4" ry="6.4" cy="-5"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(72)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(144)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(216)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(288)"/></g><circle r="2.4" fill="#efd6a6"/><circle r="1" fill="#d9b77a"/></symbol>
    <symbol id="bP" viewBox="-12 -12 24 24"><g fill="url(#petP)" stroke="#d5aab2" stroke-width=".4"><ellipse rx="4.4" ry="6.4" cy="-5"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(72)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(144)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(216)"/><ellipse rx="4.4" ry="6.4" cy="-5" transform="rotate(288)"/></g><circle r="2.2" fill="#f4e1c0"/></symbol>
    <symbol id="puff" viewBox="-12 -12 24 24"><g fill="url(#puffG)" stroke="#e3d6de" stroke-width=".5"><circle cx="0" cy="-6" r="3.6"/><circle cx="5.5" cy="-3" r="3.6"/><circle cx="5.5" cy="3.5" r="3.6"/><circle cx="0" cy="6.5" r="3.6"/><circle cx="-5.5" cy="3.5" r="3.6"/><circle cx="-5.5" cy="-3" r="3.6"/><circle r="3.8"/></g><g fill="#e9d3c0"><circle cx="0" cy="-6" r=".7"/><circle cx="5.5" cy="3.5" r=".7"/><circle cx="-5.5" cy="-3" r=".7"/><circle r=".8"/></g></symbol>
    <symbol id="lf" viewBox="-12 -12 24 24"><path d="M-11 0 Q0 -7 11 0 Q0 7 -11 0Z" fill="url(#leafS)"/><path d="M-11 0 H10" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/></symbol>
  </defs>`;

  const svg = (w, h, body, vb = '0 0 400 800') =>
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="none">${DEFS}${body}</svg>`;

  /* sky, sea and terrace (clouds baked in; drifting wisps and sea glints are added live in CSS) */
  const balusters = [...Array(30)].map((_, i) => { const x = i * 14 + 3; return `<path d="M${x} 612 h8 v3 q-3 4 -1 9 q3 5 0 10 h2 v3 h-12 v-3 h2 q-3 -5 0 -10 q2 -5 -1 -9 v-3z"/>`; }).join('');
  const persp = [-400, -200, -60, 60, 140, 200, 260, 340, 460, 600, 800].map(x => `<line x1="200" y1="560" x2="${x}" y2="820"/>`).join('');
  const cy = (x, h, base) => `<path d="M${x} ${base} C${x - 13} ${base - h * .3} ${x - 10} ${base - h * .8} ${x} ${base - h} C${x + 10} ${base - h * .8} ${x + 13} ${base - h * .3} ${x} ${base}Z" fill="url(#cyp)"/>`;
  const SKY = `
    <rect x="-200" y="-50" width="800" height="900" fill="url(#skyG)"/>
    <circle cx="200" cy="520" r="190" fill="url(#sunG)"/>
    <g fill="#fff" filter="url(#cloudBlur)">
      <ellipse cx="80" cy="250" rx="80" ry="18" opacity=".75"/><ellipse cx="130" cy="240" rx="50" ry="14" opacity=".7"/><ellipse cx="320" cy="330" rx="90" ry="16" opacity=".7"/>
      <ellipse cx="260" cy="200" rx="70" ry="14" opacity=".6"/><ellipse cx="60" cy="400" rx="70" ry="12" opacity=".6"/><ellipse cx="300" cy="450" rx="80" ry="12" opacity=".55"/><ellipse cx="160" cy="480" rx="60" ry="10" opacity=".5"/>
    </g>
    <path d="M-200 552 Q-100 530 0 546 Q60 532 120 546 T240 544 T400 548 Q500 540 600 550 V560 H-200Z" fill="#b7bcd5" opacity=".75"/>
    <rect x="-200" y="552" width="800" height="70" fill="url(#seaG)"/>
    ${cy(-10, 150, 612)}${cy(22, 120, 612)}${cy(378, 130, 612)}${cy(410, 150, 612)}
    <rect x="-200" y="606" width="800" height="8" fill="#f8f1f1" stroke="#e4d6d6" stroke-width=".8"/>
    <g fill="#f6eeee" stroke="#e2d3d3" stroke-width=".6">${balusters}</g>
    <rect x="-200" y="640" width="800" height="10" fill="#f8f1f1" stroke="#e4d6d6" stroke-width=".8"/>
    <rect x="-200" y="650" width="800" height="200" fill="url(#floorP)"/>
    <g stroke="#d9c4c4" stroke-width=".8">${persp}<line x1="-200" y1="672" x2="600" y2="672"/><line x1="-200" y1="702" x2="600" y2="702"/><line x1="-200" y1="745" x2="600" y2="745"/></g>
    <rect x="-200" y="650" width="800" height="14" fill="rgba(140,100,110,.08)"/>`;

  /* seeded flower placement — same seed, same arrangement every time */
  function florals(seed, regions, extra = '') {
    let s = seed; const R = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    const pick = () => { const v = R(); return v < .38 ? 'puff' : v < .62 ? 'bW' : v < .76 ? 'bP' : v < .9 ? 'rz' : 'rose'; };
    const items = [];
    regions.forEach(g => {
      for (let i = 0; i < g.n; i++) {
        let x, y;
        if (g.arc) { const a = (g.a0 + (g.a1 - g.a0) * R()) * Math.PI / 180, r = g.r0 + (g.r1 - g.r0) * R(); x = g.cx + r * Math.cos(a); y = g.cy + r * Math.sin(a); }
        else { x = g.x0 + (g.x1 - g.x0) * R(); y = g.y0 + (g.y1 - g.y0) * Math.pow(R(), g.pow || 1); }
        const k = pick(), base = k === 'rose' ? 46 : k === 'rz' ? 34 : k === 'puff' ? 26 : 20, sz = base * (g.sc || 1) * (.7 + R() * .6);
        items.push({ x, y, k, sz, rot: (R() * 360) | 0 });
        if (R() < .7) items.push({ x: x + (R() - .5) * 26, y: y + (R() - .5) * 20, k: 'lf', sz: 16 + R() * 12, rot: (R() * 360) | 0, leaf: 1 });
      }
    });
    items.sort((a, b) => (a.leaf ? -1 : 0) - (b.leaf ? -1 : 0) || a.y - b.y);
    return extra + items.map(o => `<use href="#${o.k}" xlink:href="#${o.k}" x="${(o.x - o.sz / 2).toFixed(1)}" y="${(o.y - o.sz / 2).toFixed(1)}" width="${o.sz.toFixed(1)}" height="${o.sz.toFixed(1)}" transform="rotate(${o.rot} ${o.x.toFixed(1)} ${o.y.toFixed(1)})"/>`).join('');
  }

  const PILLARS = `<g fill="url(#stoneG)" stroke="#e3d6d6" stroke-width="1"><rect x="56" y="330" width="38" height="500"/><rect x="306" y="330" width="38" height="500"/></g>
    <path d="M75 360 A125 125 0 0 1 325 360" fill="none" stroke="#f6efef" stroke-width="34"/>`;
  const ARCH = florals(7, [
    { x0: -30, x1: 430, y0: -20, y1: 170, n: 85, sc: 1.1 },
    { x0: -30, x1: 110, y0: 160, y1: 260, n: 16 }, { x0: 290, x1: 430, y0: 160, y1: 260, n: 16 },
    { arc: 1, cx: 200, cy: 360, r0: 112, r1: 152, a0: 180, a1: 360, n: 55 },
    { x0: 36, x1: 106, y0: 330, y1: 780, n: 46 }, { x0: 294, x1: 364, y0: 330, y1: 780, n: 46 },
    { x0: -20, x1: 120, y0: 740, y1: 820, n: 14, sc: 1.2 }, { x0: 280, x1: 420, y0: 740, y1: 820, n: 14, sc: 1.2 }
  ], PILLARS);
  const HERO_REGIONS = [
    { x0: -40, x1: 440, y0: -30, y1: 70, n: 56, sc: 1.1 },
    { x0: -40, x1: 95, y0: 60, y1: 260, n: 24, pow: 1.6 }, { x0: 305, x1: 440, y0: 60, y1: 260, n: 24, pow: 1.6 },
    { x0: -40, x1: 80, y0: 640, y1: 840, n: 20, sc: 1.2 }, { x0: 320, x1: 440, y0: 640, y1: 840, n: 20, sc: 1.2 }
  ];
  const REC_REGIONS = [{ x0: -40, x1: 80, y0: 620, y1: 840, n: 20, sc: 1.2 }, { x0: 320, x1: 440, y0: 620, y1: 840, n: 20, sc: 1.2 }];

  const W = 900, H = 1800, S = W / 400;
  const SHADOW = `drop-shadow(0 ${6 * S}px ${5 * S}px rgba(110,70,85,.25))`;
  window.Art = {
    jobs: () => [
      { name: 'sky.webp', svg: svg(W, H, SKY), w: W, h: H, quality: 0.8 },
      { name: 'arch-florals.webp', svg: svg(W, H, ARCH), w: W, h: H, shadow: SHADOW, quality: 0.8 },
      { name: 'hero-florals.webp', svg: svg(W, H, florals(19, HERO_REGIONS)), w: W, h: H, shadow: SHADOW, quality: 0.8 },
      { name: 'closing-florals.webp', svg: svg(W, H, florals(31, HERO_REGIONS)), w: W, h: H, shadow: SHADOW, quality: 0.8 },
      // reception only has flowers in the bottom corners, so render just that strip (y 560–800)
      { name: 'reception-florals.webp', svg: svg(W, Math.round(240 * S), florals(53, REC_REGIONS), '0 560 400 240'), w: W, h: Math.round(240 * S), shadow: `drop-shadow(0 ${6 * S}px ${6 * S}px rgba(20,10,30,.35))`, quality: 0.8 }
    ]
  };
})();
