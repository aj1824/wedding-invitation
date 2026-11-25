/* Save-the-date card that flips in 3D on tap, then reveals the countdown.  Markup: #flipCard, #flipNote, #after */
(function () {
  const I = window.Invite;
  I.components.flipcard = card => {
    if (!card) return;
    function flip() {
      if (card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      const note = I.$('#flipNote'); if (note) note.style.opacity = 0;
      setTimeout(() => {
        const after = I.$('#after'); if (after) after.classList.add('show');
        const r = card.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
        I.fx.burst(x, y, 110); I.fx.glints(x, y, 40, 2.5); I.fx.shower(14);
      }, 700);
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  };
})();
