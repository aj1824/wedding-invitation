/*
  Cheap ambient decoration. Everything here animates only transform/opacity on plain HTML
  elements (GPU-composited) instead of animating shapes inside SVGs, which forces repaints.
*/
(function () {
  const I = window.Invite;

  /* rising light motes:  <div class="motes" data-motes="10"> */
  I.components.motes = (root = document) => {
    if (I.lite || I.reduceMotion) return;
    I.$$('[data-motes]', root).forEach(box => {
      const n = Math.min(+box.dataset.motes || 8, 10), frag = document.createDocumentFragment();
      for (let i = 0; i < n; i++) {
        const m = document.createElement('span'); m.className = 'mote'; const s = I.rand(4, 10);
        m.style.cssText = `left:${I.rand(0, 100).toFixed(1)}%;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;--x:${I.rand(-60, 60).toFixed(0)}px;animation-duration:${I.rand(10, 18).toFixed(1)}s;animation-delay:${(-I.rand(0, 18)).toFixed(1)}s`;
        frag.appendChild(m);
      }
      box.appendChild(frag);
    });
  };

  /* twinkling sparkles */
  I.components.sparkles = (box, n = 20) => {
    if (!box || I.lite) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span'); s.className = 'sparkle';
      s.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(2)}s;animation-duration:${(2 + Math.random() * 2.5).toFixed(2)}s`;
      frag.appendChild(s);
    }
    box.appendChild(frag);
  };

  /* string lights: static SVG wires + HTML bulbs (glow is a static box-shadow; only opacity animates) */
  I.components.lights = box => {
    if (!box) return;
    const pts = [];
    let wires = '';
    [[0, 4, 200, 58, 400, 4], [0, 18, 200, 44, 400, 18]].forEach(([x0, y0, cx, cy, x1, y1], row) => {
      wires += `<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}"/>`;
      for (let i = 1; i < 16; i++) {
        const t = i / 16, x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        pts.push([x, y, row]);
      }
    });
    box.innerHTML = `<svg viewBox="0 0 400 70" aria-hidden="true"><g fill="none" stroke="#2f2537" stroke-width="1.2">${wires}</g>
      <g stroke="#2f2537">${pts.map(([x, y]) => `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 4).toFixed(1)}"/>`).join('')}</g></svg>` +
      pts.map(([x, y, r], i) => `<i class="bulb${r ? ' sm' : ''}" style="left:${(x / 4).toFixed(2)}%;top:${((y + 7) / 0.7).toFixed(2)}%;animation-delay:${(i * 0.27 % 2.2).toFixed(2)}s"></i>`).join('');
  };

  /* drifting cloud wisps + sea glints over a pre-rendered sky image.
     Coordinates are in the 400×800 artwork space, placed as percentages of the .cover-box. */
  I.components.sky = box => {
    if (!box || I.lite) return;
    const clouds = [[30, 205, 120, 26, 40], [230, 300, 140, 22, 55], [40, 430, 110, 18, 48]];
    const glints = [[60, 566], [150, 574], [260, 568], [330, 580], [110, 590], [220, 596], [300, 604]];
    box.insertAdjacentHTML('beforeend',
      clouds.map(([x, y, w, h, d], i) => `<i class="wisp" style="left:${x / 4}%;top:${y / 8}%;width:${w / 4}%;height:${h / 8}%;animation-duration:${d}s;animation-delay:${-i * 9}s"></i>`).join('') +
      glints.map(([x, y], i) => `<i class="glint" style="left:${x / 4}%;top:${y / 8}%;animation-delay:${(i * 0.4).toFixed(1)}s"></i>`).join(''));
  };
})();
