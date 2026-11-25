/* Decorative pieces drawn from the couple's details: embossed paper, wax seal, monogram crest, satin ribbon. */
(function () {
  const I = window.Invite;
  const esc = I.esc;

  /* embossed floral paper tile (one small SVG tile, rasterised once by the browser) */
  I.components.emboss = () => {
    const petals = [0, 72, 144, 216, 288].map(a => `<ellipse cy="-10" rx="5.5" ry="8" transform="rotate(${a})"/>`).join('');
    const flor = `<g transform="translate(40 40)"><circle r="5"/>${petals}</g>
      <path d="M40 54 C38 72 30 86 16 98"/><path d="M30 76 q-13-2-17-13 q13 0 17 13z"/><path d="M35 64 q11-7 19-2 q-9 9-19 2z"/>
      <g transform="translate(105 95) scale(.6)"><circle r="5"/>${petals}</g>
      <path d="M105 104 C108 118 116 128 130 136"/><path d="M112 120 q10-4 16 2 q-10 5-16-2z"/>
      <path d="M128 30 q6 10 0 20 q-6-10 0-20z"/><circle cx="70" cy="125" r="2"/><circle cx="10" cy="20" r="2"/>`;
    document.documentElement.style.setProperty('--emboss', I.svgURL(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <g fill="rgba(150,90,95,.07)" stroke="rgba(150,90,95,.16)" stroke-width="1.2" stroke-linecap="round" transform="translate(1 1.4)">${flor}</g>
      <g fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.65)" stroke-width="1.1" stroke-linecap="round">${flor}</g></svg>`));
  };

  /* pearl wax seal with the couple's initials */
  function blob(r, n, amp, seed) {
    let s = seed; const R = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r + (R() - .5) * amp; pts.push([rr * Math.cos(a), rr * Math.sin(a)]); }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let m = mid(pts[n - 1], pts[0]), d = `M${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
    for (let i = 0; i < n; i++) { const p = pts[i], q = mid(p, pts[(i + 1) % n]); d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
    return d + 'Z';
  }
  I.components.wax = (els, { sheen = true } = {}) => {
    const g = esc(I.initial(I.cfg.groom.name)), b = esc(I.initial(I.cfg.bride.name));
    const body = blob(50, 22, 7, 11), rim = blob(52, 22, 8, 23);
    const inner = `
      <defs><radialGradient id="waxG" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fdfcf8"/><stop offset=".5" stop-color="#e6e1d8"/><stop offset="1" stop-color="#b9b2a6"/></radialGradient></defs>
      <path d="${rim}" fill="#a8a094" transform="translate(0 2.5)"/>
      <path d="${body}" fill="url(#waxG)"/>
      <circle r="33" fill="none" stroke="#b5ad9f" stroke-width="3"/><circle r="33" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1" transform="translate(-.8 -1)"/>
      <circle r="28" fill="#ddd7cc" opacity=".55"/>
      <g font-family="'Cormorant Garamond',serif" font-style="italic" font-weight="600" font-size="34" text-anchor="middle">
        <text x="-7" y="6" fill="#fff" opacity=".8" transform="translate(-.8 -1)">${g}</text><text x="-7" y="6" fill="#8f877b">${g}</text>
        <text x="8" y="15" fill="#fff" opacity=".8" transform="translate(-.8 -1)">${b}</text><text x="8" y="15" fill="#a59d90">${b}</text></g>
      <ellipse cx="-18" cy="-24" rx="14" ry="7" fill="#fff" opacity=".45" transform="rotate(-30 -18 -24)"/>`;
    els.forEach(el => {
      el.innerHTML = `<svg viewBox="-60 -60 120 120" aria-hidden="true">${inner}</svg>` + (sheen && !I.lite ? '<i class="wax-sheen"></i>' : '');
    });
  };

  /* monogram crest */
  I.components.monogram = els => {
    const g = esc(I.initial(I.cfg.groom.name)), b = esc(I.initial(I.cfg.bride.name));
    const ring = (from, dir) => [...Array(9)].map((_, i) => {
      const deg = from + dir * i * 14, a = deg * Math.PI / 180, x = 40 * Math.cos(a), y = 40 * Math.sin(a);
      return `<use href="#lf" x="${(x - 5).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="10" height="10" transform="rotate(${(deg + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join('');
    els.forEach(el => (el.innerHTML = `
      <circle r="36" fill="rgba(255,255,255,.55)" stroke="#b9a6bd" stroke-width="1"/><circle r="32" fill="none" stroke="#c9aeb3" stroke-width=".6" stroke-dasharray="1.5 2.5"/>
      ${ring(200, 1)}${ring(20, -1)}
      <use href="#bW" x="-6" y="34" width="12" height="12"/>
      <g font-family="'Cormorant Garamond',serif" font-style="italic" font-weight="600" text-anchor="middle">
        <text x="-8" y="4" font-size="34" fill="#8a6f8c">${g}</text><text x="9" y="16" font-size="34" fill="#5b4a5d">${b}</text></g>`));
  };

  /* satin ribbon with bow (three parts so they can fly apart separately) */
  I.components.ribbon = el => {
    if (!el) return;
    el.innerHTML = `
      <svg class="rb-l" viewBox="0 0 336 90" preserveAspectRatio="none"><path d="M-30 35 C40 30 110 40 168 36 L168 56 C110 59 40 50 -30 55Z" fill="url(#satin)"/><path d="M-30 41 C40 37 110 45 168 42" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" fill="none"/><path d="M-30 52 C40 47 110 55 168 53" stroke="#c99aa5" stroke-opacity=".5" fill="none"/></svg>
      <svg class="rb-r" viewBox="0 0 336 90" preserveAspectRatio="none"><path d="M168 36 C226 40 296 30 366 35 L366 55 C296 50 226 59 168 56Z" fill="url(#satin)"/><path d="M168 42 C226 45 296 37 366 41" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" fill="none"/><path d="M168 53 C226 55 296 47 366 52" stroke="#c99aa5" stroke-opacity=".5" fill="none"/></svg>
      <svg class="rb-bow" viewBox="0 0 336 90">
        <path d="M163 50 C154 68 142 84 124 98 L140 102 C152 88 162 72 170 54Z" fill="url(#satinD)"/>
        <path d="M173 50 C182 68 194 84 212 98 L196 102 C184 88 174 72 166 54Z" fill="url(#satinD)"/>
        <path d="M168 46 C138 14 104 18 110 42 C116 66 146 62 168 46Z" fill="url(#satin)" stroke="#d3a9b3" stroke-width=".6"/>
        <path d="M168 46 C198 14 232 18 226 42 C220 66 190 62 168 46Z" fill="url(#satin)" stroke="#d3a9b3" stroke-width=".6"/>
        <path d="M166 46 C148 30 126 30 126 42 C127 52 148 55 166 46Z" fill="#c99aa5" opacity=".35"/>
        <path d="M170 46 C188 30 210 30 210 42 C209 52 188 55 170 46Z" fill="#c99aa5" opacity=".35"/>
        <path d="M120 34 C130 26 146 26 158 36" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" fill="none"/>
        <path d="M216 34 C206 26 190 26 178 36" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" fill="none"/>
        <ellipse cx="168" cy="46" rx="10" ry="12" fill="url(#satin)" stroke="#c99aa5" stroke-width=".8"/>
        <path d="M163 40 q5 -3 10 0" stroke="#fff" stroke-width="1.2" fill="none"/>
      </svg>`;
  };
})();
