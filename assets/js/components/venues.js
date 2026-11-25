/*
  Venue cards: illustrated map preview → "View live map" loads the real Google map at the exact pin (only on tap,
  so the page stays light), plus Directions and Copy Address.
  Locations come from config.js: lat/lng (+ optional Google placeId). Without coordinates it falls back to the venue name.
  Markup: [data-venues]
*/
(function () {
  const I = window.Invite;
  const enc = encodeURIComponent;
  const hasPin = ev => typeof ev.lat === 'number' && typeof ev.lng === 'number';

  I.venueLinks = ev => {
    const name = `${ev.venue}, ${ev.address}`;
    const open = ev.placeId ? `https://www.google.com/maps/search/?api=1&query=${enc(ev.venue)}&query_place_id=${ev.placeId}`
      : hasPin(ev) ? `https://www.google.com/maps/search/?api=1&query=${ev.lat},${ev.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${enc(name)}`;
    const directions = hasPin(ev)
      ? `https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}${ev.placeId ? `&destination_place_id=${ev.placeId}` : ''}`
      : `https://www.google.com/maps/dir/?api=1&destination=${enc(name)}`;
    const embed = hasPin(ev) ? `https://maps.google.com/maps?q=${ev.lat},${ev.lng}&z=17&output=embed`
      : `https://maps.google.com/maps?q=${enc(name)}&z=16&output=embed`;
    return { open, directions, embed };
  };

  const mapSVG = seed => {
    const px = 150 + seed * 40;
    return `<svg viewBox="0 0 300 150" aria-hidden="true">
      <rect width="300" height="150" fill="#f6f0f3"/>
      <path d="M0 ${110 - seed * 10} C70 ${90 + seed * 8} 120 140 210 120 S290 ${80 + seed * 6} 300 90 V150 H0Z" fill="#cfdcea"/>
      <rect x="${20 + seed * 150}" y="18" width="80" height="46" rx="10" fill="#dfe5d5"/>
      <circle cx="${46 + seed * 150}" cy="40" r="7" fill="#bccaae"/><circle cx="${70 + seed * 150}" cy="34" r="9" fill="#bccaae"/>
      <g fill="#ece2e8" stroke="#dacbd4"><rect x="${230 - seed * 200}" y="22" width="22" height="16" rx="2"/><rect x="${258 - seed * 200}" y="26" width="16" height="12" rx="2"/><rect x="${236 - seed * 200}" y="98" width="20" height="14" rx="2"/></g>
      <g stroke="#e6d9e0" stroke-width="14" fill="none" stroke-linecap="round"><path d="M-10 78 H310"/><path d="M${px} -10 V160"/><path d="M30 160 L${120 - seed * 20} 0"/></g>
      <g stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M-10 78 H310"/><path d="M${px} -10 V160"/><path d="M30 160 L${120 - seed * 20} 0"/></g>
      <path class="route" d="M10 140 L50 78 H${px} V80" fill="none" stroke="#8a6f8c" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
      <ellipse class="pulse" cx="${px}" cy="80" rx="12" ry="5" fill="none" stroke="#8a6f8c" stroke-width="2"/>
      <ellipse cx="${px}" cy="80" rx="10" ry="3.5" fill="rgba(91,74,93,.3)"/>
      <g class="pin"><path d="M${px} 80 c-4 -10 -16 -20 -16 -32 a16 16 0 0 1 32 0 c0 12 -12 22 -16 32z" fill="#8a6f8c" stroke="#fff" stroke-width="2"/><circle cx="${px}" cy="47" r="6.5" fill="#fff"/></g>
    </svg>`;
  };

  I.components.venues = list => {
    if (!list) return;
    const esc = I.esc;
    list.innerHTML = I.cfg.events.map((ev, i) => {
      const L = I.venueLinks(ev);
      return `<div class="loc-card reveal ${i ? 'd1' : ''}">
        <span class="loc-tag">${esc(ev.name)} · ${esc(ev.day)}</span>
        <div class="loc-name">${esc(ev.venue)}</div>
        <div class="loc-addr">${esc(ev.address)}</div>
        <div class="map" data-embed="${esc(L.embed)}" data-title="${esc(ev.venue)}">
          ${mapSVG(i % 2)}
          <button class="map-tip" type="button">View live map</button>
        </div>
        <div class="loc-btns">
          <a class="btn btn-main" href="${esc(L.directions)}" target="_blank" rel="noopener"><svg><use href="#nav-ic"/></svg>Directions</a>
          <button class="btn btn-line" data-copy="${i}"><svg><use href="#copy-ic"/></svg>Copy Address</button>
        </div>
        <a class="loc-open" href="${esc(L.open)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>
      </div>`;
    }).join('');

    list.addEventListener('click', async e => {
      const map = e.target.closest('.map[data-embed]');
      if (map && !map.classList.contains('live')) {
        // swap the illustration for the real map — loaded only when a guest asks for it
        map.classList.add('live');
        map.innerHTML = `<iframe src="${map.dataset.embed}" title="Map of ${map.dataset.title}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
        return;
      }
      const b = e.target.closest('[data-copy]'); if (!b) return;
      const ev = I.cfg.events[+b.dataset.copy];
      I.toast((await I.copyText(`${ev.venue}, ${ev.address}`)) ? 'Address copied ✓' : 'Could not copy — please copy manually');
    });
  };
})();
