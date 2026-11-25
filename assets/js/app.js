/* Wires all components together for the envelope invitation. */
(function () {
  const I = window.Invite;

  /* small illustrations on the event cards */
  const ART = {
    mosque: `<svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <use href="#crescent" x="170" y="14" width="26" height="26"/>
      <path d="M0 140 V118 Q60 100 120 112 Q180 100 240 118 V140Z" fill="#e9dde6"/>
      <ellipse cx="120" cy="133" rx="70" ry="5" fill="rgba(91,74,93,.2)"/>
      <g fill="url(#silverV)" stroke="#a79fa9" stroke-width=".6">
        <rect x="44" y="52" width="12" height="80"/><path d="M41 54 Q50 28 59 54Z"/><rect x="40" y="76" width="20" height="4"/>
        <rect x="184" y="52" width="12" height="80"/><path d="M181 54 Q190 28 199 54Z"/><rect x="180" y="76" width="20" height="4"/>
        <rect x="70" y="86" width="100" height="46"/><path d="M76 88 C76 56 120 50 120 32 C120 50 164 56 164 88Z"/><rect x="118" y="18" width="4" height="16"/>
      </g>
      <path d="M120 34 C120 50 164 56 164 88 H140 C140 60 124 50 120 34Z" fill="#5b4a5d" opacity=".12"/>
      <circle cx="120" cy="16" r="4" fill="#cfc7d1"/>
      <path d="M110 132 V110 Q120 94 130 110 V132Z" fill="#8a6f8c"/>
      <g fill="#8a6f8c" opacity=".7"><path d="M84 118 V106 Q90 98 96 106 V118Z"/><path d="M144 118 V106 Q150 98 156 106 V118Z"/></g>
      <use href="#rose" x="-6" y="96" width="46" height="46"/><use href="#rose" x="200" y="96" width="46" height="46"/>
    </svg>`,
    reception: `<svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g fill="none" stroke="#b9a6bd" stroke-width="1"><path d="M0 14 Q60 54 120 14 Q180 54 240 14"/></g>
      <g fill="#fff3d6">${[...Array(11)].map((_, i) => { const x = i * 24, y = 14 + 30 * Math.sin(Math.PI * ((x % 120) / 120)); return `<circle cx="${x}" cy="${y.toFixed(1)}" r="2.6"/>`; }).join('')}</g>
      <line x1="120" y1="0" x2="120" y2="40" stroke="#b9a6bd" stroke-width="1.5"/>
      <g fill="url(#silverV)" stroke="#a79fa9" stroke-width=".5"><ellipse cx="120" cy="46" rx="8" ry="6"/><path d="M80 62 Q120 82 160 62 L156 68 Q120 88 84 68Z"/><path d="M92 76 Q120 92 148 76 L145 81 Q120 96 95 81Z"/></g>
      <g stroke="#b9a6bd" stroke-width="1.5" fill="none"><path d="M120 52 L84 64 M120 52 L156 64 M120 52 L96 78 M120 52 L144 78 M120 52 V90"/></g>
      <g fill="#fff">${[80, 100, 120, 140, 160].map(x => `<path d="M${x} ${x === 120 ? 90 : 68} l3 7 -3 5 -3 -5z"/>`).join('')}</g>
      <path d="M0 140 V122 Q60 108 120 118 Q180 108 240 122 V140Z" fill="#e9dde6"/>
      <use href="#rose" x="-6" y="94" width="50" height="50"/><use href="#rose" x="196" y="94" width="50" height="50"/>
      <use href="#rz" x="64" y="104" width="34" height="34"/><use href="#rz" x="142" y="104" width="34" height="34"/>
    </svg>`
  };

  const C = I.components;

  /* build content */
  I.grain();
  C.emboss();
  I.bindText();
  C.wax(I.$$('[data-wax]'));
  C.monogram(I.$$('[data-mono]'));
  C.ribbon(I.$('#ribbon'));
  I.$$('[data-sky]').forEach(el => C.sky(el));
  C.lights(I.$('[data-lights]'));
  C.sparkles(I.$('#sparkles'), 20);
  C.motes();
  C.carousel(I.$('#events'), { art: ART });
  C.venues(I.$('[data-venues]'));
  C.countdown(I.$('[data-countdown]'));
  C.flipcard(I.$('#flipCard'));
  I.$$('#invite .hero > *').forEach((el, i) => el.style.setProperty('--i', i));

  /* personal links: …/?to=Khan%20Family  →  "To, Khan Family" on the envelope */
  const guest = (new URLSearchParams(location.search).get('to') || '').trim().slice(0, 60);
  const guestEl = I.$('[data-guest]');
  if (guest && guestEl) { guestEl.querySelector('span').textContent = guest; guestEl.hidden = false; }

  /* behaviour */
  I.watchSections();
  I.reveal();
  I.progress();
  I.motion.init();
  I.once(I.$('#closing'), () => {
    I.fx.shower(28);
    setTimeout(() => I.fx.glints(innerWidth / 2, innerHeight * 0.5, 40, 2), 1200);
  }, 0.4);
  I.intro({
    onDone() {
      I.$('#invite').classList.add('go');
      I.fx.glints(innerWidth / 2, innerHeight * 0.3, 40, 2.4);
    }
  });
})();
