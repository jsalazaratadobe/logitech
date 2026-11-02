/**
 * sustainability — "Design for sustainability" band: centred intro (eyebrow heading, title,
 * text, accent CTA) over a peeking row of dark image cards (no links).
 * Decode tier: TEMPLATE-SLOTTED intro + RECONSTRUCTIVE card row.
 *
 * Authoring:
 *   intro — DEFAULT CONTENT before the block (reabsorbed, EW8): eyebrow <h2>, title <h2>,
 *     <p> text, <p><em><strong><a> CTA; leading image-less rows in the block are accepted too
 *   one row per card — cell 1: image(s), first = below 1024px, second = from 1024px;
 *     cell 2: <h2> label (optionally linked = card link)
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
  const link = heading ? heading.querySelector('a[href]') : null;
  const card = el(link ? 'a' : 'div', 'std-card');
  if (link) {
    card.href = link.href;
    link.replaceWith(...link.childNodes); // EW6
  }
  const content = el('div', 'std-card-content');
  if (heading) content.append(wrapNode(innerLabel(heading, 'std-card-label'), 'std-card-heading'));
  card.append(content);
  if (media.length > 1) {
    card.append(wrapNode(media[0], 'media-m'), wrapNode(media[1], 'media-d'));
    media.slice(2).forEach((m) => card.append(m));
  } else if (media.length) card.append(wrapNode(media[0], 'media-all'));
  return card;
}

function isCta(node) {
  if (node.tagName !== 'P') return false;
  const a = node.querySelector('a[href]');
  return !!a && node.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  const head = takeHead(block);
  const grid = el('div', 'std-cards-grid');
  [...block.children].forEach((row) => {
    if (!mediaNodes(row).length) {
      if (!grid.children.length) head.push(...row.querySelectorAll(':scope > div > *'));
      return;
    }
    grid.append(buildCard(row));
  });

  // intro slots: eyebrow (first heading), title (second heading), text, CTA
  const intro = el('div', 'sustain-intro');
  const headings = head.filter((n) => /^H[1-6]$/.test(n.tagName));
  head.forEach((n) => {
    if (n === headings[0] && headings.length > 1) intro.append(wrapNode(n, 'h4 sustain-eyebrow'));
    else if (/^H[1-6]$/.test(n.tagName)) intro.append(wrapNode(n, 'h2 sustain-title'));
    else if (isCta(n)) intro.append(wrapNode(n, 'sustain-cta'));
    else intro.append(wrapNode(n, 'body-16 sustain-text'));
  });

  const top = el('div', 'wrap sustain-grid');
  top.append(intro);
  const track = el('div', 'std-cards-track');
  track.append(grid, buildArrows(grid));
  const cardsWrap = el('div', 'wrap');
  cardsWrap.append(track);
  const cards = el('div', 'std-cards');
  cards.append(cardsWrap);
  block.replaceChildren(top, cards);
}
