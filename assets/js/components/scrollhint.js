/*
  "Scroll for more" hint: a floating pill at the bottom of the screen.
  - appears shortly after the invitation opens
  - hides while the guest scrolls; comes back after a few idle seconds if there is still more below
  - never shows at the very end of the page
  - tapping it scrolls down
  Sections can set data-hint="Name" so the pill says "Next · Name".
*/
(function () {
  const I = window.Invite;
  I.components.scrollHint = () => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'scroll-hint';
    el.setAttribute('aria-label', 'Scroll down to see more');
    el.innerHTML = '<span class="sh-txt"><b>Scroll for more</b><small></small></span><span class="sh-arrow" aria-hidden="true"><i></i><i></i></span>';
    document.body.appendChild(el);
    const label = el.querySelector('small');
    const secs = I.$$('.sec');
    let enabled = false, idleT = 0, shownAt = 0;

    const nearBottom = () => scrollY + innerHeight >= document.documentElement.scrollHeight - 160;
    const nextSection = () => secs.find(s => s.getBoundingClientRect().top > innerHeight * 0.4);

    function show() {
      if (!enabled || nearBottom()) return;
      const n = nextSection();
      label.textContent = n && n.dataset.hint ? `Next · ${n.dataset.hint}` : '';
      shownAt = scrollY;
      el.classList.add('on');
    }
    const hide = () => el.classList.remove('on');
    const arm = ms => { clearTimeout(idleT); idleT = setTimeout(show, ms); };

    addEventListener('scroll', () => {
      if (el.classList.contains('on') && Math.abs(scrollY - shownAt) > 30) hide();
      if (enabled) arm(3500);
    }, { passive: true });

    el.addEventListener('click', () => {
      hide();
      window.scrollBy({ top: Math.round(innerHeight * 0.75), behavior: 'smooth' });
    });

    return { start(delay = 1600) { enabled = true; arm(delay); } };
  };
})();
