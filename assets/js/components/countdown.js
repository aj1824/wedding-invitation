/* Live countdown with a flip on each change.  Markup: [data-countdown] containing b[data-cd="d|h|m|s"] */
(function () {
  const I = window.Invite;
  I.components.countdown = root => {
    if (!root) return;
    const target = new Date(I.cfg.countdownTo).getTime();
    const pad = n => String(n).padStart(2, '0');
    const el = k => I.$(`[data-cd="${k}"]`, root);
    const els = { d: el('d'), h: el('h'), m: el('m'), s: el('s') };
    const sec = root.closest('.sec');
    function set(node, v) {
      if (node.textContent === v) return;
      node.textContent = v;
      // alternate two identical keyframes so the flip restarts without forcing a layout
      if (!I.reduceMotion && sec && sec.classList.contains('is-on')) {
        const a = node.classList.contains('fa');
        node.classList.toggle('fa', !a); node.classList.toggle('fb', a);
      }
    }
    function tick() {
      let d = target - Date.now();
      if (d <= 0) { root.innerHTML = '<div class="cd-done">Alhamdulillah — the Nikah day is here!</div>'; clearInterval(timer); return; }
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const h = Math.floor(d / 36e5); d -= h * 36e5;
      const m = Math.floor(d / 6e4); d -= m * 6e4;
      set(els.d, pad(days)); set(els.h, pad(h)); set(els.m, pad(m)); set(els.s, pad(Math.floor(d / 1000)));
    }
    const timer = setInterval(tick, 1000); tick();
  };
})();
