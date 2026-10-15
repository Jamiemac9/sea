/** Command-palette search over a small JSON index built at compile time. */

type Entry = { t: string; d: string; u: string; k: string; h: string };

let index: Entry[] | null = null;

async function load(base: string): Promise<Entry[]> {
  if (index) return index;
  const res = await fetch(`${base}search-index.json`);
  index = (await res.json()) as Entry[];
  return index;
}

function score(e: Entry, terms: string[]): number {
  const t = e.t.toLowerCase();
  const h = e.h.toLowerCase();
  const d = e.d.toLowerCase();
  let s = 0;
  for (const term of terms) {
    let hit = false;
    if (t.includes(term)) {
      s += t.startsWith(term) ? 8 : 5;
      hit = true;
    }
    if (h.includes(term)) {
      s += 2;
      hit = true;
    }
    if (d.includes(term)) {
      s += 1;
      hit = true;
    }
    if (!hit) return 0;
  }
  return s + (e.k === 'Guide' ? 0.5 : 0);
}

function escape(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
}

export function initSearch(base: string) {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search]');
  const input = dialog?.querySelector<HTMLInputElement>('input');
  const list = dialog?.querySelector<HTMLElement>('[data-search-results]');
  if (!dialog || !input || !list) return;

  let active = 0;
  let results: Entry[] = [];

  const render = () => {
    if (!input.value.trim()) {
      list.innerHTML = list.dataset.empty || '';
      return;
    }
    if (!results.length) {
      list.innerHTML = `<p class="px-5 py-8 text-center text-muted">No matches. Try "exempt", "licensing" or "service charges".</p>`;
      return;
    }
    list.innerHTML = results
      .map(
        (r, i) => `<a class="search-result" role="option" id="sr-${i}" aria-selected="${i === active}" href="${r.u}">
          <span class="flex items-center justify-between gap-3"><span class="font-semibold text-ink">${escape(r.t)}</span><span class="chip chip-ink">${r.k}</span></span>
          <span class="mt-1 block text-[14px] leading-snug text-muted">${escape(r.d)}</span></a>`,
      )
      .join('');
    input.setAttribute('aria-activedescendant', `sr-${active}`);
  };

  const run = async () => {
    const data = await load(base);
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    results = data
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.e);
    active = 0;
    render();
  };

  if (!list.dataset.empty) list.dataset.empty = list.innerHTML;

  const open = () => {
    if (!dialog.open) dialog.showModal();
    input.focus();
    input.select();
    load(base).catch(() => undefined);
  };

  document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', open));
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    }
    if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea, select')) {
      e.preventDefault();
      open();
    }
  });
  input.addEventListener('input', () => void run());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // A search input swallows the first Escape to clear itself. Close the palette instead.
      e.preventDefault();
      dialog.close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(results.length - 1, active + 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
      render();
    } else if (e.key === 'Enter' && results[active]) {
      window.location.href = results[active].u;
    }
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
}
