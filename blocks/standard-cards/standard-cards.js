/**
 * standard-cards — "std-cards" shared module: section title + a row of image cards with the
 * label over the image (3-up from 1024px, peeking carousel below).
 * Decode tier: RECONSTRUCTIVE (repeat group) — one card per row that carries a heading or image.
 *
 * Authoring:
 *   section head — the <h2> before the block, authored as DEFAULT CONTENT (reabsorbed, EW8);
 *     a leading heading-only row inside the block is accepted as a fallback
 *   one row per card — cell 1: card image(s), first = below 1024px, second = from 1024px;
 *     cell 2: <h2> label, optionally linked (<h2><a href>…</a></h2>) = the card link
 *
 * @variants block: dark (default none) — white labels over dark photography
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

// presentation refinement inside the authored heading (EW2): the text moves into an inner label
// box, as the source renders it (h2 > div.label); textContent and the heading element are unchanged
function innerLabel(heading, className) {
  const box = el('div', className);
  box.append(...heading.childNodes);
  heading.append(box);
  return heading;
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

// section head authored as default content just before the block (EW8: MOVE the children)
function takeHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const kids = [...prev.children];
  prev.remove();
  return kids;
}

function buildCard(row) {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const media = mediaNodes(row);
  const link = heading ? heading.querySelector('a[href]') : row.querySelector('a[href]');
  const card = el(link ? 'a' : 'div', 'std-card');
  if (link) {
    card.href = link.href;
    card.setAttribute('aria-label', link.textContent.trim());
    link.replaceWith(...link.childNodes); // EW6 card-as-link: unwrap the inner anchor
  }
  const content = el('div', 'std-card-content');
  if (heading) content.append(wrapNode(innerLabel(heading, 'std-card-label'), 'std-card-heading'));
  card.append(content);
  if (media.length > 1) {
    card.append(wrapNode(media[0], 'media-m'), wrapNode(media[1], 'media-d'));
    media.slice(2).forEach((m) => card.append(m));
  } else if (media.length) card.append(wrapNode(media[0], 'media-all'));
  row.querySelectorAll(':scope > div > :is(p, ul, ol)').forEach((n) => {
    if (n.textContent.trim()) content.append(n);
  });
  return card;
}

export default function decorate(block) {
  const head = takeHead(block);
  const rows = [...block.children];
  const grid = el('div', 'std-cards-grid');
  rows.forEach((row) => {
    const hasMedia = mediaNodes(row).length > 0;
    if (!hasMedia && !grid.children.length && row.querySelector('h1, h2, h3, h4, h5, h6')) {
      head.push(...row.querySelectorAll(':scope > div > *')); // in-table head fallback
      return;
    }
    if (!hasMedia && !row.textContent.trim()) return;
    grid.append(buildCard(row));
  });

  const wrap = el('div', 'wrap');
  if (head.length) {
    const title = el('div', 'std-cards-title');
    head.forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) innerLabel(n, 'std-cards-title-text h4');
    });
    title.append(...head);
    wrap.append(title);
  }
  const track = el('div', 'std-cards-track');
  track.append(grid, buildArrows(grid));
  wrap.append(track);
  block.replaceChildren(wrap);
}
