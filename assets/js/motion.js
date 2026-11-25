/*
  3D tilt + parallax driven by touch, mouse, phone gyro (Android) and scrolling.
  When nothing moves for a few seconds it eases back to rest and the loop stops completely.

    data-tilt="7"            rotate the element in 3D by up to N degrees
    data-par="9" data-k=".1" shift a layer by N px with the tilt, plus k × scroll for depth
    data-glare               gets a --tx custom property for light-glare effects

  Performance rules: only elements currently on screen are updated (IntersectionObserver),
  a transform is written only when it actually changes, nothing is written to :root
  (which would restyle the whole page), and the loop stops completely when idle or on lite devices.
*/
(function () {
  const I = window.Invite;
  const items = [];
  const cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
  let lastInput = -1e9, lastScroll = -1e9, raf = 0, glare = [], io;

  function track(el, item) {
    items.push(item);
    io.observe(item.watch);
  }
  function scan(root) {
    io = io || new IntersectionObserver(es => {
      es.forEach(e => items.forEach(it => { if (it.watch === e.target) it.on = e.isIntersecting; }));
      kick();
    }, { rootMargin: '80px 0px' });
    I.$$('[data-tilt]', root).forEach(el => track(el, { el, kind: 'tilt', d: +el.dataset.tilt || 8, watch: el, on: false, last: '' }));
    I.$$('[data-par]', root).forEach(el => {
      const host = el.closest('section') || el;
      track(el, { el, kind: 'par', d: +el.dataset.par || 0, k: +el.dataset.k || 0, host, watch: host, on: false, last: '' });
    });
    glare = glare.concat(I.$$('[data-glare]', root).map(el => ({ el, last: '' })));
  }

  const clamp = v => Math.max(-1, Math.min(1, v));
  function input(x, y) { tgt.x = clamp(x); tgt.y = clamp(y); lastInput = performance.now(); kick(); }

  function loop(t) {
    raf = 0;
    if (document.hidden) return;
    // after a few seconds without touch/tilt, ease back to rest — then the loop stops (no idle work, no battery drain)
    if (t - lastInput > 4000) { tgt.x = 0; tgt.y = 0; }
    cur.x += (tgt.x - cur.x) * 0.07; cur.y += (tgt.y - cur.y) * 0.07;
    const settled = Math.abs(tgt.x - cur.x) < 0.002 && Math.abs(tgt.y - cur.y) < 0.002 && t - lastScroll > 200;
    let active = false;
    const vh = innerHeight;
    for (const it of items) {
      if (!it.on) continue;
      if (!it.el.isConnected) { it.on = false; io.unobserve(it.watch); continue; }   // e.g. the intro after it is removed
      active = true;
      let s;
      if (it.kind === 'tilt') {
        s = `perspective(1000px) rotateY(${(cur.x * it.d).toFixed(2)}deg) rotateX(${(-cur.y * it.d).toFixed(2)}deg)`;
      } else {
        let off = 0;
        if (it.k) { const top = it.host.getBoundingClientRect().top; off = Math.max(-300, Math.min(450, -top)) * it.k; }
        s = `translate3d(${(-cur.x * it.d).toFixed(1)}px,${(off - cur.y * it.d * 0.5).toFixed(1)}px,0)`;
      }
      if (s !== it.last) { it.el.style.transform = s; it.last = s; }
    }
    const gx = cur.x.toFixed(2);
    for (const g of glare) if (g.last !== gx) { g.el.style.setProperty('--tx', gx); g.last = gx; }
    if (active && !settled) raf = requestAnimationFrame(loop);
  }
  function onScroll() { lastScroll = performance.now(); kick(); }
  function kick() { if (!raf && !I.lite && !document.hidden) raf = requestAnimationFrame(loop); }

  I.motion = {
    init(root = document) {
      scan(root);
      if (I.lite) return;
      addEventListener('mousemove', e => input(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
      addEventListener('touchmove', e => { const p = e.touches[0]; if (p) input((p.clientX / innerWidth * 2 - 1) * 0.7, (p.clientY / innerHeight * 2 - 1) * 0.5); }, { passive: true });
      addEventListener('deviceorientation', e => { if (e.gamma != null) input(e.gamma / 25, (e.beta - 45) / 25); });
      addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', kick);
      kick();
    }
  };
})();
