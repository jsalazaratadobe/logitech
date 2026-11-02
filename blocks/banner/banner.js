/**
 * banner — background-video banner (logitech "background banner"): eyebrow, headline,
 * rich-text body and CTAs over an autoplaying muted video; below 840px the copy stacks
 * around the 16:9 video. Decode tier: TEMPLATE-SLOTTED (fixed composition).
 *
 * Authoring (classified by content, never by row index):
 *   - video source links (.mp4), in order: from 1240px, from 840px, below 840px
 *     (one link = every width; two = from 840px / below)
 *   - poster images, same order as the videos (shown behind the video until it paints)
 *   - copy: eyebrow <p> BEFORE the heading, the heading (h1 on the lead banner, h2 otherwise),
 *     body paragraphs, CTA paragraphs (<strong><a> solid, <em><a> outline)
 *
 * @variants block: lead (default none) — lead = the page-top banner: headline above the video
 *   below 840px and a 625px height cap (600px otherwise)
 * The < 840px copy (text above/below the video) is a presentational clone of the authored copy,
 * stripped of editor indices (EW4); the authored nodes live in the >= 840px overlay.
 * @ew-exempt video source links — text-as-metadata (the URL is the value, never displayed)
 */

const PAUSE = '<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="6" d="M9 0v32M23 0v32"></path></svg>';
const PLAY = '<svg class="is-play" width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M5 0v32l23-16z"></path></svg>';
const VIDEO_MEDIA = {
  1: [''],
  2: ['(min-width: 840px)', ''],
  3: ['(min-width: 1240px)', '(min-width: 840px)', ''],
};
const POSTER_CLASS = {
  1: ['poster-all'],
  2: ['poster-md', 'poster-m'],
  3: ['poster-xl', 'poster-md', 'poster-m'],
};

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// presentational clones must not keep the editor's indices (EW4)
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

const isVideoLink = (a) => /\.(mp4|webm)(\?|#|$)/i.test(a.getAttribute('href') || '');

// a <p> that only carries a link (optionally inside strong/em) = CTA paragraph
function isCta(node) {
  if (node.tagName !== 'P') return false;
  const a = node.querySelector('a[href]');
  if (!a || node.querySelector('picture, img')) return false;
  if (node.classList.contains('button-wrapper')) return true;
  return node.textContent.trim() === a.textContent.trim() && !!a.closest('strong, em');
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((child) => {
      // pipeline wraps media in <p>: lift each picture out as its own node
      if (child.tagName === 'P' && child.querySelector('picture, img') && !child.textContent.trim()) {
        out.push(...child.querySelectorAll('picture, img:not(picture img)'));
      } else out.push(child);
    });
  });
  return out;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const videos = [];
  const posters = [];
  const copy = [];
  nodes.forEach((n) => {
    const a = n.matches('a') ? n : n.querySelector('a[href]');
    if (a && isVideoLink(a) && n.textContent.trim() === a.textContent.trim()) {
      videos.push(a.href);
    } else if (n.matches('picture, img')) {
      posters.push(n);
    } else copy.push(n);
  });

  const heading = copy.find((n) => /^H[1-6]$/.test(n.tagName));
  const hIdx = heading ? copy.indexOf(heading) : -1;
  const eyebrows = hIdx > 0 ? copy.slice(0, hIdx) : [];
  const after = copy.slice(hIdx + 1);
  const ctas = after.filter(isCta);
  const body = after.filter((n) => !ctas.includes(n));

  // ----- media: video + posters + play toggle
  const media = el('div', 'banner-media');
  const videoBox = el('div', 'banner-video');
  if (posters.length) {
    const box = el('div', 'banner-posters');
    const classes = POSTER_CLASS[Math.min(posters.length, 3)];
    posters.slice(0, 3).forEach((p, i) => {
      const img = p.matches('img') ? p : p.querySelector('img');
      if (img && block.classList.contains('lead')) img.loading = 'eager';
      box.append(wrapNode(p, classes[i]));
    });
    posters.slice(3).forEach((p) => box.append(p));
    videoBox.append(box);
  }
  let video;
  if (videos.length) {
    video = el('video');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('preload', 'auto');
    const queries = VIDEO_MEDIA[Math.min(videos.length, 3)];
    videos.slice(0, 3).forEach((href, i) => {
      const source = el('source');
      const url = new URL(href, window.location.href);
      source.src = url.pathname;
      if (queries[i]) source.media = queries[i];
      source.type = 'video/mp4';
      video.append(source);
    });
    videoBox.append(video);

    const btn = el('button', 'banner-play');
    btn.type = 'button';
    const dot = el('span', 'animate-pulse');
    dot.innerHTML = PAUSE;
    btn.append(dot);
    btn.setAttribute('aria-label', 'Pause video');
    videoBox.append(btn);

    const sync = () => {
      const playing = !video.paused && !video.ended;
      btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      dot.innerHTML = playing ? PAUSE : PLAY;
    };
    video.addEventListener('playing', () => {
      dot.classList.remove('animate-pulse');
      sync();
    });
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    btn.addEventListener('click', () => {
      if (video.paused || video.ended) video.play().catch(() => sync());
      else video.pause();
      sync();
    });
    const start = () => video.play().catch(() => sync());
    if (video.readyState >= 2) start();
    else video.addEventListener('canplay', start, { once: true });
  }
  media.append(videoBox);

  // ----- copy: authored nodes MOVE into the >= 840px overlay; the < 840px layout (text above /
  // below the video, as the source and prototype render it) gets presentational clones (EW4)
  const overlay = el('div', 'wrap banner-overlay');
  const row = el('div', 'banner-row');
  const content = el('div', 'banner-content');
  const head = el('div', 'banner-heading');
  eyebrows.forEach((n) => head.append(wrapNode(n, 'h5 banner-eyebrow')));
  if (heading) head.append(wrapNode(heading, heading.tagName === 'H1' ? 'h1 banner-title' : 'h2 banner-title'));
  content.append(head);
  let bodyBox;
  let ctaBox;
  if (body.length) {
    bodyBox = el('div', 'rich-text banner-body');
    bodyBox.append(...body);
    content.append(bodyBox);
  }
  if (ctas.length) {
    ctaBox = el('div', 'banner-ctas');
    ctaBox.append(...ctas);
    content.append(ctaBox);
  }
  row.append(content, el('div', 'banner-play-col'));
  overlay.append(row);
  media.append(overlay);

  const lead = block.classList.contains('lead');
  const clone = (n) => stripInstrumentation(n.cloneNode(true));
  const top = el('div', 'wrap banner-top');
  const bottom = el('div', 'wrap banner-bottom');
  const bottomContent = el('div', 'banner-content');
  if (lead) top.append(...[...head.children].map(clone));
  else bottomContent.append(clone(head));
  if (bodyBox) bottomContent.append(clone(bodyBox));
  if (ctaBox) bottomContent.append(clone(ctaBox));
  bottom.append(bottomContent);
  [top, bottom].forEach((part) => part.setAttribute('data-presentational', ''));

  const inner = el('div', 'banner-inner');
  if (lead) inner.append(top);
  inner.append(media, bottom);
  block.replaceChildren(inner);
}
