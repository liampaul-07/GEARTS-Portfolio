/* Becoming in Progress: renders the exhibit from js/data.js.
   You only edit data.js and the files in /assets. */
(() => {
  'use strict';

  const D = window.PORTFOLIO || { works: [], pieces: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  /* ---------- Media slots ----------
     Every slot starts as a dashed placeholder. A file that loads covers it (.has-media);
     a file that is missing is removed so the placeholder stays. */
  const markLoaded = el => el.closest('.media')?.classList.add('has-media');

  document.addEventListener('error', e => {
    const t = e.target;
    if (!(t instanceof Element) || !t.closest('.media')) return;
    if (t.tagName === 'IMG' && t.dataset.heic) convertHeic(t);
    else if (t.tagName === 'IMG' && t.dataset.fallback) { t.src = t.dataset.fallback; delete t.dataset.fallback; }
    else if (t.tagName === 'IMG') t.remove();
    else if (t.tagName === 'SOURCE') t.closest('video')?.remove();
  }, true);
  document.addEventListener('load', e => { if (e.target.tagName === 'IMG' || e.target.tagName === 'IFRAME') markLoaded(e.target); }, true);
  document.addEventListener('loadeddata', e => { if (e.target.tagName === 'VIDEO') markLoaded(e.target); }, true);

  /* HEIC (iPhone photos): Safari shows them natively. Other browsers get a converted copy, made in the page.
     This needs the site to be online (or on a local server); opened straight from a folder, it shows the placeholder. */
  const isHeic = s => /\.hei[cf]([?#]|$)/i.test(s);
  let heicLib;
  const loadHeic = () => heicLib ||= new Promise((ok, no) => {
    const el = document.createElement('script');
    el.src = 'js/vendor/heic2any.min.js'; el.onload = () => ok(window.heic2any); el.onerror = no;
    document.head.append(el);
  });
  const convertHeic = async img => {
    delete img.dataset.heic;
    try {
      const lib = await loadHeic();
      const blob = await (await fetch(img.src)).blob();
      const out = await lib({ blob, toType: 'image/jpeg', quality: 0.85 });
      img.src = URL.createObjectURL(Array.isArray(out) ? out[0] : out);
    } catch { img.remove(); }
  };

  const settle = root => {
    $$('.media img', root).forEach(img => {
      if (!img.complete || img.dataset.heic) return;
      if (img.naturalWidth) markLoaded(img); else img.remove();
    });
    $$('.media video', root).forEach(v => {
      if (v.networkState === 3) v.remove();
      else if (v.readyState >= 2) markLoaded(v);
    });
  };

  /* A src can be a file or a YouTube link (watch, youtu.be, shorts, embed). Add ?t=90 to start at 90 seconds. */
  const yt = src => {
    const m = String(src).match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (!m) return null;
    const t = String(src).match(/[?&](?:t|start)=(\d+)/);
    return { id: m[1], start: t ? t[1] : '' };
  };
  const ytEmbed = (y, title) => `<iframe src="https://www.youtube-nocookie.com/embed/${y.id}?rel=0&playsinline=1&enablejsapi=1${y.start ? '&start=' + y.start : ''}" title="${esc(title)}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  const pauseEmbeds = root => $$('iframe', root).forEach(f =>
    f.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'));

  const slot = ({ format = 'image', src, alt = '', controls = false, loop = false, thumb = false }) => {
    const y = format === 'video' || yt(src) ? yt(src) : null;
    const isVideo = format === 'video' || !!y;
    const label = y ? 'YouTube video' : isVideo ? 'Video' : 'Image';
    let el;
    if (y && thumb) {      // grid cards show the video's cover; the player opens in the viewer
      el = `<img src="https://i.ytimg.com/vi/${y.id}/maxresdefault.jpg" data-fallback="https://i.ytimg.com/vi/${y.id}/hqdefault.jpg" data-yt="${y.id}" data-start="${y.start}" alt="${esc(alt)}" loading="lazy"><span class="play" aria-hidden="true"></span>`;
    } else if (y) {
      el = ytEmbed(y, alt || 'YouTube video');
    } else if (isVideo) {
      el = `<video ${controls ? 'controls' : 'muted'} ${loop ? 'loop' : ''} playsinline preload="metadata"><source src="${esc(src)}" type="video/mp4"></video>`;
    } else {
      el = `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${isHeic(src) ? ' data-heic="1"' : ''}>`;
    }
    return `<span class="media${y ? ' is-yt' : ''}">${el}<span class="ph"><strong>${label}</strong>${esc(src)}</span></span>`;
  };

  /* A piece can show several pictures at once: give it an images list in data.js. */
  const art = p => p.images && p.images.length > 1
    ? `<div class="mosaic" data-n="${Math.min(p.images.length, 4)}">${p.images.map(im => slot({ format: 'image', src: im.src, alt: im.alt })).join('')}</div>`
    : slot({ format: p.format, src: p.src, alt: p.alt, controls: true });

  const factsList = f => `
    <dl class="facts">
      <div><dt>Materials and tools</dt><dd>${esc(f.materials)}</dd></div>
      <div><dt>Time spent</dt><dd>${esc(f.time)}</dd></div>
      <div><dt>Date finished</dt><dd>${esc(f.finished)}</dd></div>
    </dl>`;

  /* ---------- Click feedback: a ring spreads from the click, like the rings round the sun ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('.btn, .pill, .tab, .icon-btn');
    if (!el || el.disabled || reduce.matches) return;
    const r = el.getBoundingClientRect();
    const x = e.detail === 0 ? r.width / 2 : e.clientX - r.left;     // keyboard clicks start from the centre
    const y = e.detail === 0 ? r.height / 2 : e.clientY - r.top;
    const d = Math.max(r.width, r.height) * 2.2;
    const ring = document.createElement('span');
    ring.className = 'ring';
    ring.style.cssText = `left:${x}px;top:${y}px;width:${d}px;height:${d}px`;
    el.append(ring);
    setTimeout(() => ring.remove(), 800);
  });

  /* ---------- Dialogs close with a short exit animation ---------- */
  const closeDialog = dlg => {
    if (!dlg.open || dlg.classList.contains('closing')) return;
    if (reduce.matches) { dlg.close(); return; }
    dlg.classList.add('closing');
    setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); }, 240);
  };
  const wireDialog = dlg => {
    dlg.addEventListener('cancel', e => { e.preventDefault(); closeDialog(dlg); });   // Esc key
    dlg.addEventListener('click', e => { if (e.target === dlg) closeDialog(dlg); });  // backdrop
  };

  const typeOf = w => String(w.type || '').toLowerCase() === 'group' ? 'group' : 'individual';
  const typeLabel = w => typeOf(w) === 'group' ? 'Group' : 'Individual';

  /* ======================= Part I: tabs, bento, viewer ======================= */
  (function works() {
    const host = $('#works');
    if (!host) return;

    host.innerHTML = D.works.map((w, i) => `
      <article class="work" data-type="${typeOf(w)}" data-i="${i}" style="view-transition-name:work-${i}">
        <button class="open" type="button" aria-label="Open ${esc(w.artwork)} larger">
          ${slot({ format: w.format, src: w.src, alt: w.alt, loop: true, thumb: true })}
          <span class="plaque">
            <span class="l1"><span class="pa">${esc(w.artwork)}</span>${w.title ? `<span class="pt">${esc(w.title)}</span>` : ''}</span>
            <span class="l2"><span class="pm">${esc(w.medium)}, ${esc(w.date)}</span><span class="tag" data-t="${typeOf(w)}">Type: ${typeLabel(w)}</span></span>
          </span>
        </button>
      </article>`).join('');
    settle(host);

    const items = $$('.work', host);
    const tabs = $$('.tab');
    const thumb = $('.tab-thumb');
    const status = $('.status');

    // Slots: every four visible works make one block of bento tiles, so there are never gaps.
    const place = list => {
      const n = list.length, full = Math.floor(n / 4), rem = n - full * 4;
      list.forEach((el, i) => {
        const k = Math.floor(i / 4);
        let s;
        if (k < full) s = ['a', 'b', 'c', 'd'][i % 4] + (k % 2 ? 'm' : '');
        else s = rem === 1 ? 'solo' : rem === 2 ? 'half' + (i % 4) : 't' + (i % 4);
        el.dataset.slot = s;
        el.style.setProperty('--r', 2 * k + 1);
      });
    };

    const count = f => items.filter(w => f === 'all' || w.dataset.type === f).length;
    tabs.forEach(t => {
      const n = count(t.dataset.filter);
      const c = $('.count', t);
      if (c) c.textContent = n;
      if (n === 0) { t.disabled = true; t.title = 'Nothing here yet'; }
    });

    const moveThumb = () => {
      const sel = tabs.find(t => t.getAttribute('aria-selected') === 'true');
      if (!sel || !thumb) return;
      thumb.style.setProperty('--tx', sel.offsetLeft + 'px');
      thumb.style.setProperty('--tw', sel.offsetWidth + 'px');
    };

    const layout = f => {
      const shown = items.filter(w => f === 'all' || w.dataset.type === f);
      items.forEach(w => { w.hidden = !shown.includes(w); });
      place(shown);
      tabs.forEach(t => {
        const on = t.dataset.filter === f;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      host.setAttribute('aria-labelledby', 'tab-' + f);
      if (status) status.textContent = f === 'all' ? `Showing all ${items.length} works` : `Showing ${shown.length} of ${items.length} works`;
      moveThumb();
    };

    const apply = f => {
      if (document.startViewTransition && !reduce.matches) document.startViewTransition(() => layout(f));
      else layout(f);
    };

    const enabled = tabs.filter(t => !t.disabled);
    tabs.forEach(t => {
      t.addEventListener('click', () => apply(t.dataset.filter));
      t.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        const next = enabled[(enabled.indexOf(t) + d + enabled.length) % enabled.length];
        next.focus();
        apply(next.dataset.filter);
      });
    });
    layout('all');
    // The tab indicator slides between tabs; skip the slide on first placement.
    requestAnimationFrame(() => $('.tabs')?.classList.add('ready'));
    addEventListener('resize', moveThumb);
    document.fonts?.ready.then(moveThumb);

    // Viewer
    const lb = $('#lightbox');
    if (!lb) return;
    wireDialog(lb);
    const stage = $('.lb-stage', lb), counter = $('.count', lb);
    let list = [], idx = 0;

    const available = () => items.filter(w => !w.hidden && $('.media.has-media', w));
    const show = i => {
      idx = (i + list.length) % list.length;
      const w = list[idx], d = D.works[w.dataset.i];
      const src = $('.media video, .media img', w);
      stage.replaceChildren();
      let el;
      if (src.dataset.yt) {
        stage.innerHTML = ytEmbed({ id: src.dataset.yt, start: src.dataset.start }, d.artwork);
        el = stage.firstChild;
      } else if (src.tagName === 'VIDEO') {
        el = document.createElement('video');
        el.controls = true; el.playsInline = true;
        el.src = src.currentSrc || $('source', src)?.src || '';
      } else {
        el = new Image();
        el.src = src.currentSrc || src.src;
        el.alt = src.alt || '';
      }
      if (!el.parentNode) stage.append(el);
      stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
      $('h3', lb).textContent = d.artwork;
      const t = $('.lb-title', lb);
      t.textContent = d.title || '';
      t.hidden = !d.title;
      $('[data-f="medium"]', lb).textContent = d.medium;
      $('[data-f="date"]', lb).textContent = d.date;
      $('[data-f="type"]', lb).textContent = typeLabel(d);
      $('.lb-note', lb).textContent = d.description;
      counter.textContent = `${idx + 1} of ${list.length}`;
    };

    host.addEventListener('click', e => {
      const btn = e.target.closest('.open');
      if (!btn) return;
      const w = btn.closest('.work');
      list = available();
      if (!list.includes(w)) return;      // no file yet, nothing to enlarge
      show(list.indexOf(w));
      lb.showModal();
    });
    $('[data-lb="prev"]', lb).addEventListener('click', () => show(idx - 1));
    $('[data-lb="next"]', lb).addEventListener('click', () => show(idx + 1));
    $('[data-lb="close"]', lb).addEventListener('click', () => closeDialog(lb));
    lb.addEventListener('close', () => stage.replaceChildren());
    document.addEventListener('keydown', e => {
      if (!lb.open) return;
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* ======================= Part II: the walk-through ======================= */
  (function exhibit() {
    const host = $('#exhibit');
    if (!host) return;
    const n = D.pieces.length;

    host.innerHTML = `
      <section class="scrolly" style="--n:${n}; --lp:0" aria-label="The pieces">
        <div class="pin">
          <ol class="rail" aria-label="Pieces">
            ${D.pieces.map((p, i) => `<li><button class="pip" type="button" data-go="${i}" aria-label="Go to piece ${i + 1}: ${esc(p.artwork)}"></button></li>`).join('')}
          </ol>
          ${D.pieces.map((p, i) => `
          <article class="piece" id="${esc(p.id)}" data-i="${i}" style="--z:${i + 1}">
            <div class="art">${art(p)}</div>
            <div class="label">
              <p class="count">Piece ${i + 1} of ${n}</p>
              <p class="origin"><span class="tag" data-t="${/old/i.test(p.origin) ? 'group' : 'individual'}">${esc(p.origin)}</span></p>
              <h2>${esc(p.artwork)}</h2>
              ${p.title ? `<p class="wtitle">${esc(p.title)}</p>` : ''}
              <p class="mline">${esc(p.medium)}, ${esc(p.date)}</p>
              <dl class="story">
                ${p.notes.map(x => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.text)}</dd></div>`).join('')}
              </dl>
              <div class="actions">
                <button class="btn btn-ev" type="button" data-evidence="${esc(p.id)}">Evidence of originality <span class="n">${p.evidence.length}</span></button>
                <a class="textlink" href="appendices.html#${esc(p.id)}">Full record</a>
              </div>
            </div>
          </article>`).join('')}
        </div>
      </section>`;
    settle(host);

    const sc = $('.scrolly', host);
    const pieces = $$('.piece', sc);
    const pips = $$('.pip', sc);
    const pinned = matchMedia('(min-width: 861px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
    let cur = -1;

    const set = i => {
      cur = i;
      pieces.forEach((p, k) => {
        p.classList.toggle('is-active', k === i);
        p.classList.toggle('is-past', k < i);
        if (k !== i) { $$('video', p).forEach(v => v.pause()); pauseEmbeds(p); }
      });
      pips.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    };

    const update = () => {
      if (!pinned.matches) return;
      const total = sc.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -sc.getBoundingClientRect().top / total));
      const i = Math.min(n - 1, Math.floor(p * n));
      sc.style.setProperty('--lp', (p * n - i).toFixed(3));      // how far through the current piece
      if (i !== cur) set(i);
      const inside = sc.getBoundingClientRect().top <= innerHeight * .4 && sc.getBoundingClientRect().bottom >= innerHeight * .6;
      root.style.setProperty('--tint', inside ? `var(--tint-${i + 1}, var(--tint-0))` : 'var(--tint-0)');
    };

    let queued = false;
    addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; update(); });
    }, { passive: true });
    addEventListener('resize', update);
    pinned.addEventListener('change', () => { cur = -1; update(); });

    const goTo = i => {
      if (!pinned.matches) { pieces[i].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); return; }
      const top = sc.getBoundingClientRect().top + scrollY;
      const total = sc.offsetHeight - innerHeight;
      scrollTo({ top: top + total * (i + 0.5) / n, behavior: reduce.matches ? 'auto' : 'smooth' });
    };
    pips.forEach((b, i) => b.addEventListener('click', () => goTo(i)));

    set(0);
    update();

    const fromHash = () => {
      const i = D.pieces.findIndex(p => '#' + p.id === location.hash);
      if (i >= 0) setTimeout(() => goTo(i), 60);
    };
    fromHash();
    addEventListener('hashchange', fromHash);
  })();

  /* ======================= Part II: enlarge a photo ======================= */
  (function photos() {
    const items = $$('.mosaic .media');
    if (!items.length) return;
    const icon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML = `
      <div class="lb-bar"><p class="count" aria-live="polite"></p>
        <button class="icon-btn" type="button" data-p="close" aria-label="Close viewer">${icon('M6 6l12 12M18 6L6 18')}</button></div>
      <div class="lb-stage"></div>
      <div class="lb-foot"><div class="lb-cap"><h3></h3><p class="lb-note"></p></div>
        <div class="lb-nav">
          <button class="icon-btn" type="button" data-p="prev" aria-label="Previous photo">${icon('M15 5l-7 7 7 7')}</button>
          <button class="icon-btn" type="button" data-p="next" aria-label="Next photo">${icon('M9 5l7 7-7 7')}</button>
        </div></div>`;
    document.body.append(dlg);
    wireDialog(dlg);

    let group = [], cur = 0;
    const show = i => {
      cur = (i + group.length) % group.length;
      const img = $('img', group[cur]);
      const stage = $('.lb-stage', dlg);
      stage.classList.remove('swap');
      stage.replaceChildren(Object.assign(new Image(), { src: img.currentSrc || img.src, alt: img.alt }));
      void stage.offsetWidth; stage.classList.add('swap');
      $('.count', dlg).textContent = `${cur + 1} of ${group.length}`;
      $('h3', dlg).textContent = $('h2', group[cur].closest('.piece'))?.textContent || '';
      $('.lb-note', dlg).textContent = img.alt;
      $('[data-p="prev"]', dlg).hidden = $('[data-p="next"]', dlg).hidden = group.length < 2;
    };
    const open = media => {
      if (!media.classList.contains('has-media') || !$('img', media)) return;
      group = $$('.media.has-media', media.parentElement).filter(m => $('img', m));
      show(group.indexOf(media));
      dlg.showModal();
    };
    items.forEach((m, k) => {
      m.tabIndex = 0; m.setAttribute('role', 'button'); m.setAttribute('aria-label', `Enlarge photo ${k + 1}`);
      m.addEventListener('click', () => open(m));
      m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(m); } });
    });
    $('[data-p="close"]', dlg).addEventListener('click', () => closeDialog(dlg));
    $('[data-p="prev"]', dlg).addEventListener('click', () => show(cur - 1));
    $('[data-p="next"]', dlg).addEventListener('click', () => show(cur + 1));
    dlg.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    dlg.addEventListener('close', () => $('.lb-stage', dlg).replaceChildren());
  })();

  /* ======================= Evidence pop-up ======================= */
  (function evidence() {
    const dlg = $('#evidence');
    if (!dlg) return;
    wireDialog(dlg);
    const box = $('.ev-scroll', dlg), ttl = $('.ev-title', dlg), counter = $('.ev-count', dlg);
    let io;

    const open = id => {
      const p = D.pieces.find(x => x.id === id);
      if (!p) return;
      ttl.textContent = p.artwork;
      box.innerHTML = `
        <section class="ev ev-facts">
          <h3>How it was made</h3>
          <p class="intro">The record behind this piece: what went into it, and where the idea came from. Scroll for the pictures.</p>
          ${factsList(p.facts)}
          <p class="hint">Keep scrolling</p>
        </section>
        ${p.evidence.map(e => `
        <figure class="ev">
          <div class="ev-media">${slot({ format: e.format, src: e.src, alt: e.caption, controls: true })}</div>
          <figcaption><strong>${esc(e.kind)}</strong>${esc(e.caption)}</figcaption>
        </figure>`).join('')}`;
      settle(box);
      box.scrollTop = 0;

      const slides = $$('.ev', box);
      counter.textContent = `1 of ${slides.length}`;
      io?.disconnect();
      io = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');                                  // each slide settles in as it arrives
        if (en.intersectionRatio >= 0.6) counter.textContent = `${slides.indexOf(en.target) + 1} of ${slides.length}`;
      }), { root: box, threshold: [0.35, 0.6] });
      slides.forEach(s => io.observe(s));
      dlg.showModal();
      box.focus();
    };

    document.addEventListener('click', e => {
      const b = e.target.closest('[data-evidence]');
      if (b) open(b.dataset.evidence);
    });
    $('[data-close]', dlg).addEventListener('click', () => closeDialog(dlg));
    dlg.addEventListener('close', () => { io?.disconnect(); box.replaceChildren(); });
  })();

  /* ======================= Appendices: the full record ======================= */
  (function ledger() {
    const host = $('#ledger');
    if (!host) return;
    host.innerHTML = D.pieces.map(p => `
      <details class="proof" id="${esc(p.id)}">
        <summary>
          <span class="pt2">${esc(p.artwork)}</span>
          <span class="pm2">${esc(p.origin)}. ${esc(p.medium)}, ${esc(p.date)}</span>
          <span class="chev" aria-hidden="true"></span>
        </summary>
        <div class="proof-body">
          <div class="proof-grid">
            ${factsList(p.facts)}
            <div class="shots">
              ${p.evidence.map((e, i) => `
              <figure class="${e.format === 'video' ? 'wide' : ''}" style="--i:${i}">
                ${slot({ format: e.format, src: e.src, alt: e.caption, controls: true })}
                <figcaption><strong>${esc(e.kind)}</strong>${esc(e.caption)}</figcaption>
              </figure>`).join('')}
            </div>
          </div>
        </div>
      </details>`).join('');
    settle(host);

    // Open and close with a soft height animation (details normally snaps).
    $$('.proof', host).forEach(d => {
      const body = $('.proof-body', d);
      let closing = false;
      $('summary', d).addEventListener('click', e => {
        e.preventDefault();
        if (reduce.matches) { d.open = !d.open; return; }
        body.getAnimations().forEach(a => a.cancel());
        const opening = !d.open || closing;
        closing = false;
        if (opening) {
          d.open = true;
          const to = body.scrollHeight;
          body.animate({ height: ['0px', to + 'px'], opacity: [0, 1] }, { duration: 620, easing: EASE });
        } else {
          closing = true;
          const from = body.offsetHeight;
          const a = body.animate({ height: [from + 'px', '0px'], opacity: [1, 0] }, { duration: 420, easing: 'cubic-bezier(.5,0,.2,1)' });
          a.onfinish = () => { if (closing) { d.open = false; closing = false; pauseEmbeds(d); $$('video', d).forEach(v => v.pause()); } };
        }
      });
    });

    const openFromHash = () => {
      const el = location.hash && document.getElementById(location.hash.slice(1));
      if (el && el.matches('details')) { el.open = true; el.scrollIntoView(); }
    };
    openFromHash();
    addEventListener('hashchange', openFromHash);
  })();
})();
