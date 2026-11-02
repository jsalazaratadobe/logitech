/**
 * category-cards — "Shop by product category": section title + a two-row horizontal grid of
 * product-category tiles (image on a grey tile, centred label), 6 columns from 1240px.
 * Decode tier: RECONSTRUCTIVE (repeat group) — one tile per row carrying an image or a link.
 *
 * Authoring:
 *   section head — the <h2> before the block as DEFAULT CONTENT (reabsorbed, EW8);
 *     a leading image-less heading row inside the block is accepted as a fallback
 *   one row per tile — cell 1: image; cell 2: <p><a href>label</a></p> (the tile link, EW6)
 */

const PREV = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="M21 5 10 16l11 11"></path></svg>';
const NEXT = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" d="m11 5 11 11-11 11"></path></svg>';

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
    const cols = Math.ceil(items.length / 2);
    const visible = Math.max(1, Math.floor((grid.parentElement.clientWidth + gap) / w));
    const max = Math.max(0, cols - visible);
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

function takeHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const kids = [...prev.children];
  prev.remove();
  return kids;
}

export default function decorate(block) {
  const head = takeHead(block);
  const grid = el('div', 'categories-grid');
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    const link = row.querySelector('a[href]');
    if (!media && !link) {
      if (!grid.children.length) head.push(...row.querySelectorAll(':scope > div > *'));
      return;
    }
    const card = el(link ? 'a' : 'div', 'cat-card');
    const box = el('div', 'cat-card-media');
    if (media) box.append(wrapNode(media, 'cat-card-img'));
    const label = el('div', 'cat-card-label');
    row.querySelectorAll(':scope > div > :is(p, h2, h3, h4)').forEach((n) => {
      if (n.textContent.trim()) label.append(n);
    });
    if (link) {
      card.href = link.href;
      link.replaceWith(...link.childNodes); // EW6 card-as-link
    }
    box.append(label);
    card.append(box);
    grid.append(card);
  });

  const wrap = el('div', 'wrap categories-wrap');
  if (head.length) {
    const header = el('div', 'categories-header'); // not <header>: the foundation sizes every header to --nav-height
    header.append(wrapNode(head.shift(), 'h4 categories-title'));
    head.forEach((n) => header.append(n));
    wrap.append(header);
  }
  const track = el('div', 'categories-track');
  track.append(grid, buildArrows(grid));
  wrap.append(track);
  block.replaceChildren(wrap);
}
