/*
  3D swipeable event cards.
  Markup inside the section: [data-carousel], [data-dots], [data-prev], [data-next]
  Options: { art: { mosque: '<svg…>', reception: '<svg…>' } }
*/
(function () {
  const I = window.Invite;
  I.components.carousel = (section, { art = {} } = {}) => {
    const car = I.$('[data-carousel]', section), dotsEl = I.$('[data-dots]', section);
    if (!car) return;
    const esc = I.esc;
    car.innerHTML = I.cfg.events.map((ev, i) => {
      const sw = ev.colourHex ? `<span class="swatch" style="background:${esc(ev.colourHex)}"></span>` : '';
      const row = (k, v) => (v ? `<div class="ev-row"><div class="k">${k}</div><div class="v">${v}</div></div>` : '');
      return `<article class="ev-card" aria-label="${esc(ev.name)}">
        <div class="ev-art">${art[ev.art] || ''}</div>
        <div class="ev-name">${esc(ev.name)}</div>
        <div class="ev-rows">
          ${row('Date &amp; Day', `${esc(ev.day)}, ${esc(ev.date)}${ev.hijri ? `<span class="hj">${esc(ev.hijri)}</span>` : ''}`)}
          ${row('Time', esc(ev.time))}
          ${row('Venue', `${esc(ev.venue)}${ev.address ? `<span class="hj">${esc(ev.address)}</span>` : ''}`)}
          ${row('Dress Code', ev.dress && esc(ev.dress))}
          ${row('Theme Colour', ev.colour && sw + esc(ev.colour))}
        </div>
      </article>`;
    }).join('');
    dotsEl.innerHTML = I.cfg.events.map(ev => `<button class="dot" aria-label="Show ${esc(ev.name)}"></button>`).join('');

    const cards = I.$$('.ev-card', car), dots = I.$$('.dot', dotsEl);
    let idx = 0, touched = false;
    function layout() {
      cards.forEach((c, i) => {
        const o = i - idx, a = Math.abs(o);
        c.style.transform = `translateX(${o * 82}%) translateZ(${-a * 180}px) rotateY(${-o * 42}deg) scale(${1 - a * 0.08})`;
        c.style.opacity = a > 1 ? 0 : a ? 0.6 : 1;
        c.style.zIndex = 10 - a;
        c.style.pointerEvents = a ? 'none' : 'auto';
        c.setAttribute('aria-hidden', a ? 'true' : 'false');
      });
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    }
    const go = (n, auto) => { if (!auto) touched = true; idx = (n + cards.length) % cards.length; layout(); };
    I.$('[data-prev]', section).onclick = () => go(idx - 1);
    I.$('[data-next]', section).onclick = () => go(idx + 1);
    dots.forEach((d, i) => (d.onclick = () => go(i)));

    let sx = null, sy = null, mx = null;
    car.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    car.addEventListener('touchend', e => {
      if (sx == null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    car.addEventListener('mousedown', e => { mx = e.clientX; });
    addEventListener('mouseup', e => { if (mx == null) return; const dx = e.clientX - mx; mx = null; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); });
    layout();

    // nudge once so guests see the cards can be swiped
    I.once(car, () => {
      setTimeout(() => { if (!touched) go(1, true); }, 1400);
      setTimeout(() => { if (!touched) go(0, true); }, 3000);
    }, 0.6);
  };
})();
