/*
  Core helpers shared by every component.
  Plain scripts (not ES modules) so the site also works when index.html is opened by double-click.
  Everything hangs off one global: window.Invite
*/
(function () {
  const I = (window.Invite = window.Invite || {});
  const cfg = (I.cfg = window.INVITE_CONFIG);
  I.components = I.components || {};

  I.$ = (s, r = document) => r.querySelector(s);
  I.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  I.get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  I.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  I.rand = (a, b) => a + Math.random() * (b - a);
  I.svgURL = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  I.wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---- device capability: phones that would struggle get a lighter version automatically ---- */
  const nav = navigator;
  I.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  I.isIOS = /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  I.lite = !!(I.reduceMotion || (nav.connection && nav.connection.saveData) ||
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 3));
  document.documentElement.classList.toggle('lite', I.lite);

  /* ---- dates & names ---- */
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  I.dateParts = ev => { const [y, m, d] = ev.start.slice(0, 10).split('-'); return { year: y, mon: MON[+m - 1], monLong: MONL[+m - 1], day: String(+d) }; };
  I.initial = n => (n.replace(/[\[\]]/g, '').trim()[0] || '').toUpperCase();
  I.couple = () => `${cfg.groom.name} & ${cfg.bride.name}`;

  /* ---- fill every [data-*] text hook from config.js ---- */
  I.bindText = (root = document) => {
    I.$$('[data-bind]', root).forEach(el => { const v = I.get(cfg, el.dataset.bind); if (v != null) el.textContent = v; });
    I.$$('[data-dp]', root).forEach(el => { const [i, k] = el.dataset.dp.split('.'); el.textContent = I.dateParts(cfg.events[+i])[k]; });
    I.$$('[data-couple]', root).forEach(el => (el.textContent = I.couple()));
    I.$$('[data-story]', root).forEach(el => (el.textContent = cfg.story.replace('{groom}', cfg.groom.name).replace('{bride}', cfg.bride.name)));
    const pill = I.$('[data-song-pill]', root);
    if (pill && cfg.music && cfg.music.youtube) { pill.href = cfg.music.youtube; pill.hidden = false; }
  };

  /* ---- paper grain: one tiny noise tile, used as a plain background layer (no blend modes) ---- */
  I.grain = () => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'), img = x.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const dark = Math.random() < 0.5;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = dark ? 70 : 255;
      img.data[i + 3] = (Math.random() * (dark ? 16 : 26)) | 0;
    }
    x.putImageData(img, 0, 0);
    document.documentElement.style.setProperty('--grain', `url(${c.toDataURL()})`);
  };

  /* ---- only animate what is on screen: sections get .is-on while visible ---- */
  I.watchSections = () => {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-on', e.isIntersecting)), { rootMargin: '150px 0px' });
    I.$$('.sec').forEach(s => io.observe(s));
  };

  /* ---- scroll reveal ---- */
  let revealIO;
  I.reveal = (root = document) => {
    revealIO = revealIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }), { threshold: 0.15 });
    I.$$('.reveal:not(.in)', root).forEach(el => revealIO.observe(el));
  };
  I.once = (el, fn, threshold = 0.5) => {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold });
    io.observe(el);
  };

  /* ---- scroll progress line ---- */
  I.progress = () => {
    const bar = I.$('#progress'); if (!bar) return;
    let queued = false;
    const update = () => { queued = false; const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  };

  /* ---- toast & clipboard ---- */
  let toastT;
  I.toast = msg => {
    const t = I.$('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 2200);
  };
  I.copyText = async text => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok;
    }
  };
})();
