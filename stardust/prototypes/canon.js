/* canon.js — header scroll state machine, mirrored from live (stardust/replica/motion/en-us.json headerTimeline +
 * transitions): the sticky header wrapper hides (top: -header height) while scrolling down past the header and
 * returns on scroll-up; the header carries shadow-lg while revealed mid-page, dropped at scrollY <= 30. */
(() => {
  const wrap = document.querySelector('.header-sticky');
  const header = wrap && wrap.querySelector('.site-header');
  if (!header) return;
  let lastY = window.scrollY;
  const setH = () => wrap.style.setProperty('--header-height', `${header.offsetHeight}px`);
  const onScroll = () => {
    const y = window.scrollY; const h = header.offsetHeight;
    if (y > lastY && y > h) { wrap.classList.add('is-hidden'); header.classList.remove('shadow-lg'); }
    else if (y < lastY) { wrap.classList.remove('is-hidden'); header.classList.toggle('shadow-lg', y > 30); }
    if (y <= 30) header.classList.remove('shadow-lg');
    lastY = y;
  };
  setH(); window.addEventListener('resize', setH); window.addEventListener('scroll', onScroll, { passive: true });
})();

/* promo toaster rotation — live (stardust/.work/lift/toaster.txt): 4 messages, first on load, next every ~5 s,
 * 0.5 s cross-fade between two stacked layers. */
(() => {
  const box = document.querySelector('.toaster__text[data-messages]');
  if (!box) return;
  const msgs = box.dataset.messages.split('||'); let i = 0;
  setInterval(() => {
    i = (i + 1) % msgs.length;
    const old = box.firstElementChild; const next = old.cloneNode(true);
    next.firstElementChild.textContent = msgs[i]; next.style.opacity = '0'; box.appendChild(next);
    requestAnimationFrame(() => requestAnimationFrame(() => { next.style.opacity = '1'; old.style.opacity = '0'; }));
    setTimeout(() => old.remove(), 550);
  }, 5000);
})();
