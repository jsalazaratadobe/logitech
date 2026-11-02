/**
 * quick-links — round category shortcuts (image + caption) in a horizontal row; shown below
 * 1024px only (the source hides it on desktop).
 * Decode tier: RECONSTRUCTIVE (repeat group) — one item per row carrying an image or a link.
 *
 * Authoring, one row per item: cell 1 — image (alt = the category);
 * cell 2 — <p><a href>label</a></p> (the item link; the anchor is unwrapped into the item, EW6).
 */

const PREV = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="M21 5 10 16l11 11"></path></svg>';
const NEXT = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="m11 5 11 11-11 11"></path></svg>';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function buildArrows(rowEl) {
  const arrows = el('div', 'carousel-arrows');
  let index = 0;
  const step = (dir) => {
    const items = [...rowEl.children];
    if (!items.length) return;
    const gap = parseFloat(getComputedStyle(rowEl).columnGap) || 0;
    const w = items[0].getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((rowEl.parentElement.clientWidth + gap) / w));
    const max = Math.max(0, items.length - visible);
    index = Math.min(max, Math.max(0, index + dir));
    rowEl.style.transform = index ? `translateX(${-index * w}px)` : '';
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

export default function decorate(block) {
  const rowEl = el('div', 'quick-links-row');
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    const link = row.querySelector('a[href]');
    if (!media && !link) return;
    const item = el(link ? 'a' : 'div', 'quick-links-item');
    const figure = el('figure');
    const circle = el('div', 'circle');
    if (media) circle.append(media);
    const caption = el('figcaption');
    row.querySelectorAll(':scope > div > :is(p, h2, h3, h4)').forEach((n) => {
      if (n.textContent.trim()) caption.append(n);
    });
    if (link) {
      item.href = link.href;
      link.replaceWith(...link.childNodes); // EW6 card-as-link
    }
    figure.append(circle, caption);
    item.append(figure);
    rowEl.append(item);
  });
  const track = el('div', 'quick-links-track');
  track.append(rowEl, buildArrows(rowEl));
  const wrap = el('div', 'wrap');
  wrap.append(track);
  block.replaceChildren(wrap);
}
