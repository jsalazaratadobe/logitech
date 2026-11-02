/**
 * editorial-cards — five editorial cards on a staggered 12-column grid (>= 1024px) with the
 * logo mark behind and a scroll parallax; a horizontal row below 1024px.
 * Decode tier: RECONSTRUCTIVE (repeat group) — one card per heading, classified by content.
 *
 * Authoring, one row per card:
 *   cell 1 — card image(s): first = below 1024px, second = from 1024px (one image = both)
 *   cell 2 — <h2> title, <p> text, <p><a> CTA (plain link; its href is also the image link)
 * Grid placement (A–E) and parallax speeds follow card order (layout rhythm, not content).
 */

const MARK = '<svg class="editorial-mark" aria-hidden="true" width="2.68em" height="1em" viewBox="0 0 1201 449"><path fill="currentColor" d="M838.242 349.223c-65.247 0-116.999-50.899-116.999-116.996H617.805c0 122.564 97.084 216.502 220.437 216.502s220.438-93.938 220.438-216.502H955.241c0 66.031-51.752 116.996-116.999 116.996m216.368-471.937v-81.163H911.341c-23.059-7.927-47.756-12.709-73.239-12.709-123.354 0-220.438 93.938-220.438 216.502S714.748 216.42 838.102 216.42 1058.54 122.481 1058.54-.084c0-41.4-11.14-81.95-33.41-112.214l29.48-10.35zM838.102 117.634c-65.247 0-116.999-51.752-116.999-118.57s51.752-116.996 116.999-116.996S955.887-66.967 955.887-.149s-51.752 117.783-117.785 117.783M1201-203.859h-101.87v408.308H1201zM101.866-376.602H0v580.987h101.866zm260.306 160.016c-123.353 0-220.438 93.938-220.438 216.502S238.819 216.42 362.172 216.42 582.61 122.481 582.61-.084s-97.085-216.502-220.438-216.502m0 334.285c-65.247 0-116.999-51.75-116.999-118.569 0-66.817 51.752-116.996 116.999-116.996S479.957-66.901 479.957-.084c0 66.818-51.752 117.783-117.785 117.783"></path></svg>';
const PREV = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="M21 5 10 16l11 11"></path></svg>';
const NEXT = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="m11 5 11 11-11 11"></path></svg>';
const AREAS = ['a', 'b', 'c', 'd', 'e'];
const PARALLAX = [27.5, 6.5, 11.5, 11.5, 18.5];

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

function buildArrows(grid) {
  const arrows = el('div', 'carousel-arrows');
  let index = 0;
  const step = (dir) => {
    const items = [...grid.children];
    if (!items.length) return;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const w = items[0].getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((grid.parentElement.clientWidth + gap) / w));
    const max = Math.max(0, items.length - visible);
    index = Math.min(max, Math.max(0, index + dir));
    grid.style.transform = index ? `translateX(${-index * w}px)` : '';
  };
  [['prev', 'Previous', PREV, -1], ['next', 'Next', NEXT, 1]].forEach(([cls, label, svg, dir]) => {
    const b = el('button', cls);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = svg;
    b.addEventListener('click', () => step(dir));
    arrows.append(b);
  });
  return arrows;
}

function mediaNodes(scope) {
  const pics = [...scope.querySelectorAll('picture')];
  const bare = [...scope.querySelectorAll('img')].filter((i) => !i.closest('picture'));
  return [...pics, ...bare];
}

function initParallax(block, cards) {
  const mq = window.matchMedia('(min-width: 1024px)');
  const speed = parseFloat(getComputedStyle(block).getPropertyValue('--speed-factor')) || 12;
  let tops = [];
  const measure = () => {
    tops = cards.map((c) => {
      const prev = c.style.transform;
      c.style.transform = 'none';
      const r = c.getBoundingClientRect();
      c.style.transform = prev;
      return { top: r.top + window.scrollY, h: r.height };
    });
  };
  const update = () => {
    cards.forEach((c, i) => {
      if (!mq.matches || !tops[i]) {
        c.style.transform = '';
        return;
      }
      const { top, h } = tops[i];
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY - (top - vh)) / (vh + h)));
      c.style.transform = `translate3d(0px, ${-p * parseFloat(c.dataset.parallax) * speed}px, 0px)`;
    });
  };
  const reflow = () => {
    measure();
    update();
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', reflow);
  window.addEventListener('load', reflow);
  if (window.ResizeObserver) new ResizeObserver(reflow).observe(block);
  requestAnimationFrame(reflow);
}

export default function decorate(block) {
  const rows = [...block.children];
  const grid = el('div', 'editorial-grid');
  const cards = [];
  rows.forEach((row) => {
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const media = mediaNodes(row);
    if (!heading && !media.length) return;
    const i = cards.length;
    const card = el('div', `ed-card ed-card-${AREAS[i % AREAS.length]}`);
    card.dataset.parallax = PARALLAX[i % PARALLAX.length];

    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
    const ctaP = ps.find((p) => {
      const a = p.querySelector('a[href]');
      return a && p.textContent.trim() === a.textContent.trim();
    });
    const ctaLink = ctaP ? ctaP.querySelector('a[href]') : null;
    const text = ps.filter((p) => p !== ctaP);

    const mediaBox = el('div', 'ed-card-media');
    const holder = ctaLink ? el('a') : el('div');
    if (ctaLink) {
      holder.href = ctaLink.href;
      holder.tabIndex = -1;
    }
    if (media.length > 1) {
      holder.append(wrapNode(media[0], 'media-m'), wrapNode(media[1], 'media-d'));
      media.slice(2).forEach((m) => holder.append(m));
    } else if (media.length) holder.append(wrapNode(media[0], 'media-all'));
    mediaBox.append(holder);
    card.append(mediaBox);

    if (heading) card.append(wrapNode(heading, 'h3 ed-card-title'));
    if (text.length) {
      const t = el('div', 'rich-text body-18 ed-card-text');
      t.append(...text);
      card.append(t);
    }
    if (ctaP) card.append(wrapNode(ctaP, 'ed-card-cta'));
    // leftovers: any other authored element stays visible
    row.querySelectorAll(':scope > div > :is(ul, ol, blockquote, table)').forEach((n) => card.append(n));
    grid.append(card);
    cards.push(card);
  });

  const track = el('div', 'editorial-track');
  track.append(grid, buildArrows(grid));
  const inner = el('div', 'editorial-inner');
  inner.innerHTML = MARK;
  inner.append(track);
  const wrap = el('div', 'wrap');
  wrap.append(inner);
  block.replaceChildren(el('div', 'editorial-bg'), wrap);
  initParallax(block, cards);
}
