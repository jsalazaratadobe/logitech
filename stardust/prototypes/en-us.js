/* en-us.js — editorial-cards scroll parallax, mechanism observed on live (stardust/.work/lift/parallax-1440.txt):
 * each card translates up by progress × max, progress = (scrollY − (cardTop − innerHeight)) / (innerHeight + cardHeight)
 * clamped 0..1; max per card (px) = 27.5 / 6.5 / 11.5 / 11.5 / 18.5 × --speed-factor (12). Desktop (≥1024px) only. */
(() => {
  const section = document.querySelector('.editorial');
  if (!section) return;
  const cards = [...section.querySelectorAll('.ed-card[data-parallax]')];
  const mq = window.matchMedia('(min-width: 1024px)');
  const speed = parseFloat(getComputedStyle(section).getPropertyValue('--speed-factor')) || 12;
  let tops = [];
  const measure = () => {
    tops = cards.map((c) => {
      const prev = c.style.transform; c.style.transform = 'none';
      const r = c.getBoundingClientRect(); c.style.transform = prev;
      return { top: r.top + window.scrollY, h: r.height };
    });
  };
  const update = () => {
    cards.forEach((c, i) => {
      if (!mq.matches) { c.style.transform = ''; return; }
      const { top, h } = tops[i]; const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY - (top - vh)) / (vh + h)));
      c.style.transform = `translate3d(0px, ${-p * parseFloat(c.dataset.parallax) * speed}px, 0px)`;
    });
  };
  const reflow = () => { measure(); update(); };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', reflow);
  window.addEventListener('load', reflow);
  reflow();
})();

/* background-banner video toggle — live: autoplaying muted video, button label/icon as captured on load
 * (both labelled "Play video" in the served DOM; banner 1 paints the two-bar icon as the live capture does); a click toggles playback and swaps label + icon. */
(() => {
  const PAUSE = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="6" d="M9 0v32M23 0v32"></path></svg>';
  const PLAY = '<svg class="is-play" width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M5 0v32l23-16z"></path></svg>';
  document.querySelectorAll('.banner__video').forEach((box) => {
    const video = box.querySelector('video'); const btn = box.querySelector('.banner__play');
    const sync = () => { const playing = !video.paused; btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video'); btn.firstElementChild.innerHTML = playing ? PAUSE : PLAY; };
    if (video.paused) { btn.firstElementChild.classList.add('animate-pulse'); video.addEventListener('playing', () => btn.firstElementChild.classList.remove('animate-pulse'), { once: true }); }
    btn.addEventListener('click', () => { if (video.paused) video.play(); else video.pause(); sync(); });
  });
})();
