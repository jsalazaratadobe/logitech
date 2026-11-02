import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — decorates the authored /footer document into the logitech.com footer
 * (newsletter bar, social + locale, link columns / mobile accordions, legal row, wordmark).
 * The legal trademark statement above it is a page block (`legal`), not part of /footer.
 *
 * /footer sections are classified by content (order-tolerant):
 *   newsletter — heading, no list: heading, <p> field placeholder, <p> consent (has link),
 *                <p>s after the consent = success message
 *   social     — list of icon links (+ <p> icon + locale link)
 *   column     — heading(s) + list(s): one footer column, one group per heading
 *   legal      — list without heading: <p> copyright + <ul> legal links
 *   support    — <p> without links (support id)
 *   wordmark   — <p> home link carrying the wordmark icon
 * Authored nodes are MOVED (EW1); social links and the locale move between their desktop
 * and mobile slots on the 840px breakpoint (one node, never cloned).
 * @ew-exempt <p> email field placeholder (newsletter) — text-as-metadata, read into attributes
 * @ew-exempt all — chrome document, edited as its own /footer page, not through this block
 */

const ICON_CACHE = new Map();

async function inlineIcon(span) {
  const name = [...span.classList].find((c) => c.startsWith('icon-'))?.substring(5);
  if (!name) return;
  if (!ICON_CACHE.has(name)) {
    ICON_CACHE.set(name, fetch(`${window.hlx.codeBasePath}/icons/${name}.svg`)
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => ''));
  }
  const text = await ICON_CACHE.get(name);
  if (!text) return;
  const svg = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
  if (svg && svg.nodeName === 'svg') {
    svg.setAttribute('aria-hidden', 'true');
    span.replaceChildren(document.importNode(svg, true));
  }
}

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function iconSpan(name) {
  return el('span', `icon icon-${name}`);
}

/** wraps the bare text nodes of a container in a span (moves the nodes, never copies text) */
function wrapText(container, className) {
  const texts = [...container.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (!texts.length) return null;
  const span = el('span', className);
  texts[0].before(span);
  span.append(...texts);
  return span;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';

function classify(sections) {
  const out = {
    newsletter: null, social: null, columns: [], legal: null, support: null, wordmark: null,
  };
  sections.forEach((s) => {
    const hasHeading = !!s.querySelector(HEADING);
    const list = s.querySelector('ul, ol');
    if (hasHeading && list) out.columns.push(s);
    else if (hasHeading) out.newsletter = out.newsletter || s;
    else if (list && list.querySelector('.icon')) out.social = out.social || s;
    else if (list) out.legal = out.legal || s;
    else if (s.querySelector('a .icon')) out.wordmark = out.wordmark || s;
    else if (s.querySelector('p')) out.support = out.support || s;
  });
  return out;
}

function buildNewsletter(section) {
  const subscribe = el('div', 'footer-bar-subscribe');
  const body = el('div', 'footer-bar-body');
  subscribe.append(body);
  if (!section) return subscribe;

  const heading = section.querySelector(HEADING);
  if (heading) {
    const title = el('div', 'footer-bar-title');
    title.append(heading);
    body.append(title);
  }
  const paras = [...section.querySelectorAll('p')];
  const consentIdx = paras.findIndex((p) => p.querySelector('a'));
  const consent = consentIdx >= 0 ? paras[consentIdx] : null;
  const before = consentIdx >= 0 ? paras.slice(0, consentIdx) : paras.slice(0, 1);
  const after = consentIdx >= 0 ? paras.slice(consentIdx + 1) : paras.slice(1);
  const placeholder = before[0]?.textContent.trim() || '';
  before.forEach((p) => p.remove());

  const form = el('form', 'footer-bar-form', { id: 'footer-bar-email-subscription-form' });
  const field = el('div', 'footer-bar-field');
  const input = el('input', '', {
    type: 'email', name: 'emailId', 'aria-label': placeholder, placeholder,
  });
  const submit = el('button', 'footer-bar-submit', {
    type: 'submit', name: 'email-subscription-submit', 'aria-label': 'Subscribe',
  });
  submit.append(iconSpan('arrow-right'));
  field.append(input, submit);
  form.append(field);
  if (consent) {
    const wrap = el('div', 'footer-bar-consent-wrap');
    const row = el('div', 'footer-bar-consent');
    const box = el('input', 'sr-only', { type: 'checkbox', id: 'consent' });
    const check = el('span', 'footer-bar-check');
    check.append(iconSpan('check-small'));
    const label = el('label', '', { for: 'consent' });
    label.append(consent);
    row.append(box, check, label);
    wrap.append(row);
    form.append(wrap);
  }
  // the subscription endpoint is a dynamics decision; the form never posts to the page
  form.addEventListener('submit', (e) => e.preventDefault());
  body.append(form);

  if (after.length) {
    const success = el('div', 'footer-bar-success');
    success.hidden = true;
    const icon = el('div');
    icon.append(iconSpan('check'));
    const text = el('div');
    text.append(...after);
    success.append(icon, text);
    subscribe.append(success);
  }
  return subscribe;
}

function buildColumn(section) {
  const col = el('div', 'footer-col');
  let group = null;
  [...section.children].forEach((child) => {
    if (child.matches(HEADING)) {
      const g = el('div', 'footer-group');
      const head = el('div', 'accordion-head');
      const toggle = el('button', 'accordion-icon', {
        type: 'button', 'aria-expanded': 'false', 'aria-label': child.textContent.trim(),
      });
      toggle.append(iconSpan('plus'));
      toggle.addEventListener('click', () => {
        const open = g.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      head.append(child, toggle);
      g.append(head);
      col.append(g);
      group = g;
    } else if (group) {
      group.append(child);
    } else {
      col.append(child);
    }
  });
  return col;
}

function buildLegal(section, support) {
  const row = el('div', 'footer-legal-row');
  const localeSlot = el('div', 'locale locale-footer');
  const legalSupport = el('div', 'footer-legal-support');
  const legal = el('div', 'footer-legal');
  if (section) {
    const copy = section.querySelector('p');
    if (copy) {
      const copyBox = el('div', 'footer-legal-copy');
      copyBox.append(copy);
      legal.append(copyBox);
    }
    const list = section.querySelector('ul, ol');
    if (list) {
      const links = el('div', 'footer-legal-links');
      [...list.children].forEach((li) => li.append(iconSpan('divider')));
      links.append(list);
      legal.append(links);
    }
  }
  legalSupport.append(legal);
  const p = support?.querySelector('p');
  if (p) {
    const id = el('div', 'support-id');
    const info = el('div');
    const btn = el('button', '', { type: 'button', 'aria-label': 'info-support-id' });
    btn.append(iconSpan('info'));
    info.append(btn);
    id.append(p, info);
    legalSupport.append(id);
  }
  row.append(localeSlot, legalSupport);
  return { row, localeSlot };
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const sections = fragment
    ? [...fragment.querySelectorAll(':scope > .section')]
      .map((s) => s.querySelector('.default-content-wrapper') || s)
    : [];
  const parts = classify(sections);

  const siteFooter = el('div', 'site-footer', { id: 'footer' });
  const main = el('div', 'footer-main');

  // newsletter bar
  const bar = el('div', 'footer-bar');
  const barInner = el('div', 'wrap footer-bar-inner');
  const socials = el('div', 'footer-bar-socials');
  const barLocale = el('div', 'locale');
  const divider = el('span', 'footer-bar-divider');
  divider.append(iconSpan('divider'));
  socials.append(divider, barLocale);
  barInner.append(buildNewsletter(parts.newsletter), socials);
  bar.append(barInner);

  // social links + locale (moved between slots by breakpoint)
  const socialList = parts.social?.querySelector('ul, ol');
  if (socialList) {
    socialList.classList.add('social-links');
    socialList.querySelectorAll('a').forEach((a) => wrapText(a, 'sr-only'));
  }
  const localeP = parts.social?.querySelector('p');

  const content = el('div', 'wrap footer-content');
  const linksWrap = el('div', 'footer-links-wrap');
  const socialSlot = el('div', 'footer-social');
  const family = el('div', 'footer-family');
  const links = el('div', 'footer-links');
  parts.columns.forEach((s) => links.append(buildColumn(s)));
  const { row, localeSlot } = buildLegal(parts.legal, parts.support);
  family.append(links, row);
  linksWrap.append(socialSlot, family);
  content.append(linksWrap);

  const home = parts.wordmark?.querySelector('p');
  if (home) {
    const a = home.querySelector('a');
    if (a) {
      a.classList.add('footer-wordmark');
      wrapText(a, 'sr-only');
    }
    const wm = el('div', 'footer-wordmark-wrap');
    wm.append(home);
    content.append(wm);
  }

  main.append(bar, content);
  siteFooter.append(main);

  const desktop = window.matchMedia('(width >= 840px)');
  const place = () => {
    if (socialList) {
      if (desktop.matches) socials.prepend(socialList);
      else socialSlot.append(socialList);
    }
    if (localeP) (desktop.matches ? barLocale : localeSlot).append(localeP);
  };
  place();
  desktop.addEventListener('change', place);

  await Promise.all([...siteFooter.querySelectorAll('span.icon')].map(inlineIcon));
  block.replaceChildren(siteFooter);
}
