import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — decorates the authored /nav document into the logitech.com chrome
 * (promo toaster, utility bar, logo, primary nav with the Shop panel, header tools).
 *
 * /nav contract (one section each, in order; any may be omitted):
 *   1. promo    — <ul> of toaster messages (rotate every 5 s, 0.5 s cross-fade)
 *   2. utility  — <ul> of utility links, then <p> Support link, then <p> icon + locale link
 *   3. brand    — <p> home link (rendered as the logo sprite; text kept for a11y)
 *   4. nav      — <ul> of primary links (first item owns the Shop panel)
 *   5. panel    — default content of the Shop panel (h5 / image+link <p>s / link <ul>s)
 *   6. tools    — <ul>: icon + label items (search, ask-ai, wishlist, account) + cart link
 * Authored nodes are MOVED into the layout (EW1); text is never rebuilt.
 * @ew-exempt all — chrome document, edited as its own /nav page, not through this block
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

/** the source carries its tool glyphs as data URIs: same svg bytes, same encoding */
function svgDataUri(text) {
  const keep = {
    '3d': '=', '3a': ':', '2f': '/', '2c': ',', '3b': ';', '2b': '+', 40: '@', 24: '$', 26: '&', '3f': '?',
  };
  return `data:image/svg+xml,${encodeURIComponent(text)
    .replace(/%([0-9A-F]{2})/g, (m, x) => keep[x.toLowerCase()] || `%${x.toLowerCase()}`)}`;
}

async function dataUriIcon(img) {
  const name = img.closest('.icon')?.className.match(/icon-([\w-]+)/)?.[1];
  if (!name) return;
  if (!ICON_CACHE.has(name)) {
    ICON_CACHE.set(name, fetch(`${window.hlx.codeBasePath}/icons/${name}.svg`)
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => ''));
  }
  const text = await ICON_CACHE.get(name);
  if (text) img.src = svgDataUri(text);
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

function iconName(node) {
  const icon = node.querySelector('.icon');
  return icon ? [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5) : '';
}

function buildToaster(section) {
  const toaster = el('div', 'toaster');
  const msg = el('div', 'toaster-msg', { role: 'button', 'aria-expanded': 'false', tabindex: '0' });
  const icon = el('div', 'toaster-icon');
  icon.append(iconSpan('chevron-down'));
  const text = el('div', 'toaster-text');
  msg.append(icon, text);
  toaster.append(msg);
  const list = section?.querySelector('ul');
  if (!list) return toaster;
  text.append(list);
  const items = [...list.children];
  items.forEach((li, i) => {
    const span = el('span');
    span.append(...li.childNodes);
    li.append(span);
    li.classList.toggle('is-active', i === 0);
  });
  if (items.length > 1) {
    let i = 0;
    setInterval(() => {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 5000);
  }
  return toaster;
}

function buildUtility(section) {
  const utility = el('div', 'utility');
  if (!section) return utility;
  const list = section.querySelector('ul');
  if (list) {
    list.classList.add('utility-links');
    [...list.children].forEach((li) => {
      if (li.querySelector('.icon')) li.classList.add('has-icon');
    });
    utility.append(list);
  }
  const aux = el('div', 'utility-aux');
  section.querySelectorAll(':scope p').forEach((p) => {
    const box = el('div', p.querySelector('.icon') ? 'locale' : 'utility-support');
    box.append(p);
    aux.append(box);
  });
  utility.append(aux);
  utility.querySelectorAll('a[href]').forEach((a) => {
    const { hostname } = new URL(a.href, window.location);
    if (hostname !== window.location.hostname && !hostname.endsWith('www.logitech.com')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
  return utility;
}

const DESKTOP = window.matchMedia('(width >= 1024px)');

/** opens/closes the Shop panel; the trigger carries aria-expanded, the nav item the active bar */
function setPanel(trigger, mega, open) {
  mega.hidden = !open;
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  trigger.closest('.nav-item')?.classList.toggle('is-open', open);
}

/**
 * groups the panel's flat default content by heading:
 * .mega-group > h5.mega-head + .mega-cards (image paragraphs) + ul.mega-links
 */
function groupPanel(nodes) {
  const groups = [];
  let group = null;
  let cards = null;
  const start = (head) => {
    group = el('div', 'mega-group');
    cards = el('div', 'mega-cards');
    if (head) {
      head.classList.add('mega-head');
      group.append(head);
    }
    group.append(cards);
    groups.push(group);
  };
  nodes.forEach((node) => {
    if (/^H\d$/.test(node.tagName)) { start(node); return; }
    if (!group) start(null);
    if (node.tagName === 'UL') {
      node.classList.add('mega-links');
      group.append(node);
      return;
    }
    const img = node.tagName === 'P' && node.querySelector('img');
    const link = node.tagName === 'P' && node.querySelector('a');
    if (!img || !link) { group.append(node); return; }
    // the "Shop your way" image + link paragraphs are whole-card links on the source
    // (aria-label "Explore <name>"); the category tiles stay image + link
    if (/your way/i.test(group.querySelector('.mega-head')?.textContent || '')) {
      group.classList.add('mega-group-ways');
      link.classList.add('mega-way');
      link.setAttribute('aria-label', `Explore ${link.textContent.trim()}`);
      wrapText(link, 'mega-way-label');
      link.prepend(img.closest('picture') || img);
      node.remove();
      cards.append(link);
      return;
    }
    node.classList.add('mega-tile');
    cards.append(node);
  });
  groups.forEach((g) => {
    const c = g.querySelector(':scope > .mega-cards');
    if (c && !c.children.length) c.remove();
  });
  return groups;
}

function buildPanel(section, trigger) {
  const mega = el('div', 'mega', { id: 'desktop-nav-panel-0' });
  mega.hidden = true;
  const wrap = el('div', 'wrap');
  const close = el('button', 'mega-close', { type: 'button', 'aria-label': 'Close menu' });
  close.append(iconSpan('close'));
  const grid = el('div', 'mega-grid');
  if (section) grid.append(...groupPanel([...section.children]));
  wrap.append(close, grid);
  mega.append(wrap);
  trigger.addEventListener('click', () => setPanel(trigger, mega, mega.hidden));
  close.addEventListener('click', () => { setPanel(trigger, mega, false); trigger.focus(); });
  return mega;
}

/** desktop: hover on Shop opens the panel; leaving header + panel, Escape or another item closes */
function bindPanel(siteHeader) {
  const trigger = siteHeader.querySelector('button[aria-controls="desktop-nav-panel-0"]');
  const mega = siteHeader.querySelector('#desktop-nav-panel-0');
  if (!trigger || !mega) return;
  const item = trigger.closest('.nav-item');
  const inDrawer = () => !!mega.closest('.drawer');
  item.querySelector(':scope > a')?.addEventListener('mouseenter', () => {
    if (DESKTOP.matches && !inDrawer()) setPanel(trigger, mega, true);
  });
  siteHeader.querySelectorAll('.nav-item').forEach((other) => {
    if (other === item) return;
    other.addEventListener('mouseenter', () => {
      if (!inDrawer()) setPanel(trigger, mega, false);
    });
  });
  siteHeader.addEventListener('mouseleave', () => {
    if (!inDrawer() && !mega.hidden) setPanel(trigger, mega, false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape' || mega.hidden || inDrawer()) return;
    setPanel(trigger, mega, false);
    trigger.focus();
  });
  DESKTOP.addEventListener('change', () => {
    if (!inDrawer()) setPanel(trigger, mega, false);
  });
}

function buildNav(navSection, panelSection) {
  const list = navSection?.querySelector('ul');
  if (!list) return null;
  list.classList.add('nav-items');
  [...list.children].forEach((li, i) => {
    li.classList.add('nav-item');
    // the pipeline wraps a list item's link in a <p> on live (#98): unwrap it
    const p = li.querySelector(':scope > p');
    if (p && p.querySelector('a')) p.replaceWith(...p.childNodes);
    const link = li.querySelector(':scope > a');
    if (i === 0 && link && panelSection) {
      const trigger = el('button', 'sr-only', {
        type: 'button', 'aria-expanded': 'false', 'aria-controls': 'desktop-nav-panel-0',
      });
      trigger.setAttribute('aria-label', link.textContent);
      li.prepend(trigger);
      li.append(buildPanel(panelSection, trigger));
    }
  });
  return list;
}

const TOOL_CLASSES = {
  search: ['icon-btn search-btn', 'sr-only'],
  wishlist: ['icon-btn', 'sr-only'],
  account: ['icon-btn', 'sr-only'],
};

function buildTools(section) {
  const tools = el('div', 'header-tools');
  const list = section?.querySelector('ul');
  if (list) {
    list.classList.add('tool-items');
    [...list.children].forEach((li) => {
      const name = iconName(li);
      li.classList.add('tool', `tool-${name || 'item'}`);
      const link = li.querySelector('a');
      if (link) {
        link.classList.add('icon-btn', name || 'link');
        wrapText(link, 'sr-only');
        return;
      }
      const button = el('button', '', { type: 'button' });
      if (name === 'ask-ai') {
        button.className = 'ask-ai';
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-expanded', 'false');
        const surface = el('span', 'ask-ai-surface');
        surface.append(...li.childNodes);
        wrapText(surface, 'ask-ai-label');
        button.append(
          el('span', 'ask-ai-ring', { 'aria-hidden': 'true' }),
          el('span', 'ask-ai-aurora', { 'aria-hidden': 'true' }),
          surface,
        );
      } else {
        const [cls, textCls] = TOOL_CLASSES[name] || ['icon-btn', 'sr-only'];
        button.className = cls;
        button.append(...li.childNodes);
        wrapText(button, textCls);
      }
      li.append(button);
    });
    tools.append(list);
  }
  const menu = el('button', 'icon-btn menu-btn', {
    type: 'button', 'aria-label': 'Open', 'aria-expanded': 'false',
  });
  menu.append(iconSpan('menu'));
  tools.append(menu);
  return tools;
}

/**
 * mobile drawer: the menu button opens a dialog; the primary nav (with the Shop panel as
 * sub-levels), utility links, locale and wishlist are MOVED in while open and back on close
 */
function bindDrawer(siteHeader) {
  const menu = siteHeader.querySelector('.menu-btn');
  if (!menu) return;
  const drawer = el('div', 'drawer', {
    id: 'nav-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Menu',
  });
  drawer.hidden = true;
  const backdrop = el('div', 'drawer-backdrop');
  const close = el('button', 'drawer-close', { type: 'button', 'aria-label': 'Close' });
  close.append(iconSpan('close'));
  const panel = el('div', 'drawer-panel');
  const navBox = el('div', 'drawer-nav');
  const utilBox = el('div', 'drawer-utility');
  const foot = el('div', 'drawer-foot');
  const localeBox = el('div', 'drawer-locale');
  const wishBox = el('div', 'drawer-wish');
  foot.append(localeBox, wishBox);
  panel.append(navBox, utilBox, foot);
  drawer.append(backdrop, close, panel);
  siteHeader.append(drawer);
  menu.setAttribute('aria-controls', 'nav-drawer');
  inlineIcon(close.querySelector('.icon'));

  const slots = [];
  const borrow = (node, target) => {
    if (!node) return;
    const mark = document.createComment('drawer-slot');
    node.before(mark);
    target.append(node);
    slots.push([mark, node]);
  };
  const mega = siteHeader.querySelector('#desktop-nav-panel-0');
  const heads = mega ? [...mega.querySelectorAll('.mega-group > .mega-head')] : [];

  const setSub = (group) => {
    drawer.classList.toggle('is-sub', !!group);
    heads.forEach((h) => {
      const open = h.parentElement === group;
      h.parentElement.classList.toggle('is-open', open);
      h.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.scrollTop = 0;
    if (group) group.querySelector('.mega-head')?.focus();
  };
  const onHead = (e) => {
    const head = e.currentTarget;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const group = head.parentElement;
    setSub(group.classList.contains('is-open') ? null : group);
  };

  let lastOverflow = '';
  const toggle = (open) => {
    if (open === !drawer.hidden) return;
    if (open) {
      borrow(siteHeader.querySelector('.nav-items'), navBox);
      borrow(siteHeader.querySelector('.utility-links'), utilBox);
      borrow(siteHeader.querySelector('.utility-support'), utilBox);
      borrow(siteHeader.querySelector('.locale'), localeBox);
      borrow(siteHeader.querySelector('.tool-wishlist'), wishBox);
      if (mega) mega.hidden = false;
      heads.forEach((h) => {
        h.setAttribute('role', 'button');
        h.setAttribute('tabindex', '0');
        h.setAttribute('aria-expanded', 'false');
        h.addEventListener('click', onHead);
        h.addEventListener('keydown', onHead);
      });
      lastOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      drawer.hidden = false;
      close.focus();
    } else {
      setSub(null);
      drawer.hidden = true;
      heads.forEach((h) => {
        ['role', 'tabindex', 'aria-expanded'].forEach((a) => h.removeAttribute(a));
        h.removeEventListener('click', onHead);
        h.removeEventListener('keydown', onHead);
      });
      if (mega) mega.hidden = true;
      slots.splice(0).forEach(([mark, node]) => mark.replaceWith(node));
      document.body.style.overflow = lastOverflow;
    }
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-label', open ? 'Close' : 'Open');
  };

  menu.addEventListener('click', () => toggle(drawer.hidden));
  close.addEventListener('click', () => { toggle(false); menu.focus(); });
  backdrop.addEventListener('click', () => { toggle(false); menu.focus(); });
  drawer.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    e.stopPropagation();
    toggle(false);
    menu.focus();
  });
  DESKTOP.addEventListener('change', () => { if (DESKTOP.matches) toggle(false); });
}

/** header scroll state machine (canon.js): hide on scroll-down, return with shadow on scroll-up */
function bindScroll(host, siteHeader) {
  let lastY = window.scrollY;
  const setH = () => host.style.setProperty('--header-height', `${siteHeader.offsetHeight}px`);
  const onScroll = () => {
    const y = window.scrollY;
    const h = siteHeader.offsetHeight;
    if (y > lastY && y > h) {
      host.classList.add('is-hidden');
      siteHeader.classList.remove('shadow-lg');
    } else if (y < lastY) {
      host.classList.remove('is-hidden');
      siteHeader.classList.toggle('shadow-lg', y > 30);
    }
    if (y <= 30) siteHeader.classList.remove('shadow-lg');
    lastY = y;
  };
  setH();
  window.addEventListener('resize', setH);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment
    ? [...fragment.querySelectorAll(':scope > .section')]
      .map((s) => s.querySelector('.default-content-wrapper') || s)
    : [];
  const [promo, utilitySection, brand, navSection, panel, toolsSection] = sections;

  const siteHeader = el('div', 'site-header');

  const top = el('div', 'header-top');
  const topGrid = el('div', 'wrap header-top-grid');
  topGrid.append(buildToaster(promo), buildUtility(utilitySection));
  top.append(topGrid);

  const navBg = el('div', 'primary-nav-bg');
  const primary = el('div', 'primary-nav');
  const navWrap = el('div', 'wrap');
  const nav = el('nav', '', { 'aria-label': 'Main', id: 'nav' });
  const left = el('div', 'primary-nav-left');
  const logoBox = el('div', 'logo-box');
  const home = brand?.querySelector('p');
  if (home) {
    home.querySelector('a')?.classList.add('logo');
    logoBox.append(home);
  }
  left.append(logoBox);
  const navList = buildNav(navSection, panel);
  if (navList) left.append(navList);
  const right = el('div', 'primary-nav-right');
  right.append(buildTools(toolsSection));
  nav.append(left, right);
  navWrap.append(nav);
  primary.append(navWrap);
  navBg.append(primary);

  siteHeader.append(top, navBg);
  await Promise.all([
    ...[...siteHeader.querySelectorAll('span.icon')]
      .filter((s) => !s.closest('.tool-items'))
      .map(inlineIcon),
    ...[...siteHeader.querySelectorAll('.tool-items .icon img')].map(dataUriIcon),
  ]);
  block.replaceChildren(siteHeader);
  bindPanel(siteHeader);
  bindDrawer(siteHeader);

  const host = block.closest('header');
  if (host) bindScroll(host, siteHeader);
}
