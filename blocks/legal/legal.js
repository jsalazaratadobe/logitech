/**
 * legal — legal trademark statement band above the footer (heading + statement with link).
 * Decode tier: TEMPLATE-SLOTTED — every authored element is MOVED into the band's .wrap.
 * Authored on the page (rollout plan: page block, not part of /footer); at decoration the
 * block's wrapper moves to the top of `body > footer`, where the source renders it (inside the
 * site footer, before the footer bar). The authored nodes move with it (EW1).
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    wrap.append(...[...cell.children].filter((n) => n.textContent.trim() || n.querySelector('picture, img')));
  });
  block.replaceChildren(wrap);

  const host = document.querySelector('body > footer');
  const unit = block.parentElement && block.parentElement.classList.contains('legal-wrapper')
    ? block.parentElement : block;
  if (host && !host.contains(unit)) {
    host.prepend(unit);
    const section = document.querySelector('main .section.legal-container');
    if (section && !section.querySelector('.block, .default-content-wrapper > *')) section.remove();
  }
}
