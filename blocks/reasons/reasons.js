/**
 * reasons — "Reasons to buy from Logitech.com": intro (title + lead) beside a grid of
 * reasons (icon, heading, text, optional dash CTA); 3-up from 1024px, 2-up below.
 * Decode tier: TEMPLATE-SLOTTED intro + RECONSTRUCTIVE reason items.
 *
 * Authoring:
 *   intro — DEFAULT CONTENT before the block: <h2> title, <p> lead (reabsorbed, EW8);
 *     leading image-less rows inside the block are accepted as a fallback
 *   one row per reason — cell 1: icon image (alt = the reason); cell 2: <h3>, <p> text,
 *     optional <p><a> CTA (plain link, rendered as the dash CTA)
 */

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

function takeHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const kids = [...prev.children];
  prev.remove();
  return kids;
}

const isCta = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && p.textContent.trim() === a.textContent.trim();
};

export default function decorate(block) {
  const head = takeHead(block);
  const items = el('div', 'reasons-items');
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    if (!media && !items.children.length) {
      head.push(...row.querySelectorAll(':scope > div > *'));
      return;
    }
    const item = el('div', 'reason');
    if (media) item.append(wrapNode(media, 'reason-icon'));
    const nodes = [...row.querySelectorAll(':scope > div > *')].filter((n) => n.textContent.trim());
    const text = el('div', 'rich-text reason-text');
    nodes.forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) item.append(wrapNode(n, 'reason-title'));
      else if (n.tagName === 'P' && isCta(n)) item.append(wrapNode(n, 'reason-cta'));
      else {
        text.append(n);
        if (!text.parentElement) item.append(text);
      }
    });
    // keep the source order: CTA after the text
    const cta = item.querySelector(':scope > .reason-cta');
    if (cta) item.append(cta);
    items.append(item);
  });

  const intro = el('div', 'reasons-intro');
  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  head.forEach((n) => {
    if (n === heading) intro.append(wrapNode(n, 'h2 reasons-title'));
    else intro.append(wrapNode(n, 'reasons-lead'));
  });
  const wrap = el('div', 'wrap reasons-grid');
  wrap.append(intro, items);
  block.replaceChildren(wrap);
}
