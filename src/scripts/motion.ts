/** Scroll reveals, counters, card spotlight, header state and timeline progress. */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('.reveal, .timeline-item');
  if (!('IntersectionObserver' in window) || reduced()) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

export function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length) return;
  const format = (n: number, decimals: number) =>
    n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    if (reduced()) {
      el.textContent = format(target, decimals);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = format(target * eased, decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

export function initSpotlight() {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as HTMLElement).closest?.('.card-link') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const update = () => header.setAttribute('data-scrolled', String(window.scrollY > 8));
  update();
  window.addEventListener('scroll', update, { passive: true });

  const nav = document.querySelector<HTMLElement>('[data-mobile-nav]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const setOpen = (open: boolean) => {
    if (!nav) return;
    nav.dataset.open = String(open);
    nav.setAttribute('aria-hidden', String(!open));
    openBtn?.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn?.focus();
  };
  openBtn?.addEventListener('click', () => setOpen(true));
  closeBtn?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.dataset.open === 'true') setOpen(false);
  });
}

export function initTheme() {
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const root = document.documentElement;
  const current = () =>
    root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const paint = () => {
    const dark = current() === 'dark';
    btn?.querySelector('.theme-icon-moon')?.classList.toggle('hidden', dark);
    btn?.querySelector('.theme-icon-sun')?.classList.toggle('hidden', !dark);
  };
  paint();
  btn?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('seahub-theme', next);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    paint();
  });
}

export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
    const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const indicator = wrap.querySelector<HTMLElement>('.tab-indicator');
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls') || ''));
    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = panels[j];
        if (panel) panel.hidden = !on;
      });
      const t = tabs[i];
      if (indicator && t) {
        indicator.style.left = `${t.offsetLeft}px`;
        indicator.style.width = `${t.offsetWidth}px`;
      }
      if (focus) t?.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
      });
    });
    select(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
    window.addEventListener('resize', () => select(tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
  });
}

export function initTimeline() {
  const tl = document.querySelector<HTMLElement>('[data-timeline]');
  if (!tl) return;
  const bar = tl.querySelector<HTMLElement>('.timeline-progress');
  const update = () => {
    const r = tl.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    bar?.style.setProperty('--progress', `${p * 100}%`);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

export function initReadingProgress() {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!bar || !article) return;
  const update = () => {
    const r = article.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    bar.style.setProperty('--p', String(p));
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc] a'));
  if (!links.length) return;
  const heads = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((h): h is HTMLElement => Boolean(h));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach((a) => a.setAttribute('data-active', String(a.hash === `#${e.target.id}`)));
        }
      }
    },
    { rootMargin: '-15% 0px -70% 0px' },
  );
  heads.forEach((h) => io.observe(h));
}

export function initCopyLinks() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || location.href;
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = prev), 1600);
      } catch {
        /* clipboard blocked */
      }
    });
  });
}
