/*
  Opening sequence: sealed envelope → (tap seal) flap opens → card rises → bow unties by itself
  → garden gates swing open → camera moves through → invitation.
  Only one tap is needed (the seal). Stages are CSS classes on #intro: press, open, rise, ready, untie, gopen, zoom, leave.
*/
(function () {
  const I = window.Invite;
  const BOW_PAUSE = 500;    // how long the tied bow is shown before it unties on its own (ms)

  I.intro = ({ onDone } = {}) => {
    const intro = I.$('#intro'); if (!intro) { onDone && onDone(); return; }
    const W = () => innerWidth, H = () => innerHeight;
    let stage = 0, autoT = 0; // 0 sealed · 1 opening · 2 bow showing · 3 finishing

    function open(e) {
      stage = 1;
      intro.classList.add('press');
      I.fx.glints(e && e.clientX ? e.clientX : W() / 2, e && e.clientY ? e.clientY : H() * 0.52, 26, 1.4);
      I.music && I.music.start(true);
      setTimeout(() => intro.classList.add('open'), 250);
      setTimeout(() => intro.classList.add('rise'), 1100);
      setTimeout(() => {
        intro.classList.add('ready'); stage = 2;
        autoT = setTimeout(untie, BOW_PAUSE);      // no tap needed — the ribbon unties automatically
      }, 2500);
    }
    function untie() {
      if (stage !== 2) return;
      stage = 3; clearTimeout(autoT);
      intro.classList.add('untie');
      const rb = I.$('#ribbon').getBoundingClientRect();
      I.fx.glints(rb.left + rb.width / 2, rb.top + rb.height / 2, 30, 1.8);
      setTimeout(() => { intro.classList.add('gopen'); I.fx.shower(30); I.fx.ambient(9, 25); }, 650);
      setTimeout(() => intro.classList.add('zoom'), 1700);
      setTimeout(() => { intro.classList.add('leave'); document.body.classList.remove('locked'); window.scrollTo(0, 0); }, 2900);
      setTimeout(() => {
        intro.remove();                         // free the intro layers entirely once it's done
        onDone && onDone();
      }, 3800);
    }
    // the seal opens the envelope; a tap while the bow is showing just skips the short pause
    intro.addEventListener('click', e => { if (stage === 0) open(e); else if (stage === 2) untie(); });
    intro.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); if (stage === 0) open(); else if (stage === 2) untie();
    });
  };
})();
