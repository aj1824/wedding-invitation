/*
  Falling petals, confetti and sparkle glints on one shared canvas.
  Performance: capped particle count, no canvas shadows, DPR capped at 1.5,
  ambient petals stop after a while, and the loop sleeps whenever there is nothing to draw
  or the tab is hidden.
*/
(function () {
  const I = window.Invite;
  const cv = I.$('#fx'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const MAX = I.lite ? 70 : 170;
  const pal = {
    fall: ['#ffffff', '#fbeef0', '#f3d6db', '#ead0e0', '#fff8fa', '#e7c3cb'],
    conf: ['#ffffff', '#d9cfe6', '#e9c6cd', '#b9a6bd', '#f6eef3'],
    halo: 'rgba(230,220,245,.45)', core: '#ffffff'
  };
  let W = 0, H = 0, parts = [], ambient = 0, ambientUntil = 0, running = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); addEventListener('resize', resize);

  const pick = a => a[(Math.random() * a.length) | 0];
  const add = p => { if (parts.length < MAX) parts.push(p); };
  const faller = top => ({
    k: 'p', x: Math.random() * W, y: top ? -20 - Math.random() * H * 0.6 : -20, r: 6 + Math.random() * 6,
    vy: 0.6 + Math.random(), vx: -0.3 + Math.random() * 0.6, rot: Math.random() * 6.28, vr: -0.03 + Math.random() * 0.06,
    sw: Math.random() * 6.28, flip: Math.random() * 6.28, c: pick(pal.fall)
  });

  function run() { if (!running && !document.hidden) { running = true; requestAnimationFrame(frame); } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && (parts.length || ambient)) run(); });

  function frame(t) {
    if (document.hidden) { running = false; return; }
    ctx.clearRect(0, 0, W, H);
    if (ambient && t > ambientUntil) ambient = 0;
    if (ambient && Math.random() < 0.03) { let n = 0; for (const p of parts) if (p.k === 'p') n++; if (n < ambient) add(faller(false)); }
    let w = 0;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]; let alive;
      if (p.k === 'p') {
        p.sw += 0.02; p.flip += 0.05; p.x += p.vx + Math.sin(p.sw) * 0.6; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.flip)));
        ctx.globalAlpha = 0.95; ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 0.5; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-p.r * 0.25, -p.r * 0.15, p.r * 0.45, p.r * 0.2, 0, 0, 6.2832); ctx.fill();
        ctx.restore(); alive = p.y < H + 30;
      } else if (p.k === 's') {
        p.life++; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy = p.vy * 0.96 - 0.02;
        ctx.save(); ctx.globalAlpha = Math.sin(Math.PI * p.life / p.max); ctx.translate(p.x, p.y);
        ctx.fillStyle = pal.halo; ctx.beginPath(); ctx.arc(0, 0, p.r * 3, 0, 6.2832); ctx.fill();
        ctx.fillStyle = pal.core; ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = pal.core; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-p.r * 4, 0); ctx.lineTo(p.r * 4, 0); ctx.moveTo(0, -p.r * 4); ctx.lineTo(0, p.r * 4); ctx.stroke();
        ctx.restore(); alive = p.life < p.max;
      } else {
        p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life / 40); ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)) + 1); ctx.restore();
        alive = p.life > 0 && p.y < H + 30;
      }
      if (alive) parts[w++] = p;
    }
    parts.length = w;
    if (parts.length || ambient) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  const off = () => I.reduceMotion;
  I.fx = {
    palette: p => Object.assign(pal, p),
    shower(n) { if (off()) return; n = I.lite ? Math.ceil(n / 3) : n; for (let i = 0; i < n; i++) add(faller(true)); run(); },
    burst(x, y, n) {
      if (off()) return; n = I.lite ? Math.ceil(n / 3) : n;
      for (let i = 0; i < n; i++) add({ k: 'c', x, y, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3, w: 5 + Math.random() * 4, h: 8 + Math.random() * 6, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, c: pick(pal.conf), life: 160 });
      run();
    },
    glints(x, y, n, spread = 1) {
      if (off()) return; n = I.lite ? Math.ceil(n / 3) : n;
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = Math.random() * 3 * spread; add({ k: 's', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, r: I.rand(1, 2.6), life: 0, max: I.rand(40, 90) }); }
      run();
    },
    // gentle petals for a limited time, then the canvas goes fully idle
    ambient(n, seconds) { if (off() || I.lite) return; ambient = n; ambientUntil = performance.now() + seconds * 1000; run(); }
  };
})();
