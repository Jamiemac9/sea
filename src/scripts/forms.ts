/**
 * Template download gate and regulation alert sign-ups.
 * Both POST JSON to the subscribe endpoint (functions/api/subscribe.ts by
 * default). A download never depends on that request: the file is shown
 * whether or not the sign-up goes through.
 */

const KEY = 'seahub-subscriber';
const loadedAt = Date.now();

type Saved = { name: string; email: string; role: string };
type Result = { ok: boolean; confirm?: boolean; error?: string };

function readSaved(): Saved | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    return v && typeof v.email === 'string' ? v : null;
  } catch {
    return null;
  }
}

function save(v: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage blocked */
  }
}

function forget() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}

async function send(endpoint: string, body: Record<string, unknown>, keepalive = false): Promise<Result> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...body, page: location.pathname, ts: loadedAt }),
      keepalive,
    });
    const data = (await res.json().catch(() => ({}))) as Result;
    return { ok: res.ok && data.ok !== false, confirm: Boolean(data.confirm), error: data.error };
  } catch {
    return { ok: false, error: 'network' };
  }
}

// GA4 only receives events once analytics consent is granted.
function track(name: string, params: Record<string, string>) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', name, params);
}

const field = (f: FormData, name: string) => String(f.get(name) || '').trim();

export function initGates(endpoint: string) {
  document.querySelectorAll<HTMLElement>('[data-gate]').forEach((gate) => {
    const form = gate.querySelector<HTMLFormElement>('[data-gate-form]')!;
    const done = gate.querySelector<HTMLElement>('[data-gate-done]')!;
    const link = gate.querySelector<HTMLAnchorElement>('[data-gate-link]')!;
    const who = gate.querySelector<HTMLElement>('[data-gate-who]')!;
    const slug = gate.dataset.slug || '';
    let justSent = false;

    const reveal = (s: Saved, start: boolean) => {
      form.hidden = true;
      done.hidden = false;
      who.textContent = s.email;
      if (start) {
        justSent = true;
        link.click();
        justSent = false;
      }
    };

    const saved = readSaved();
    if (saved) reveal(saved, false);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      const s: Saved = { name: field(f, 'name'), email: field(f, 'email'), role: field(f, 'role') };
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      button.disabled = true;
      button.dataset.label ??= button.innerHTML;
      button.textContent = 'Getting your template...';
      // Give the sign-up a moment to land, but never hold the file back for it.
      await Promise.race([
        send(endpoint, {
          type: 'template',
          template: slug,
          ...s,
          alerts: f.get('alerts') === 'on',
          audit: f.get('audit') === 'on',
          website: field(f, 'website'),
        }),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
      save(s);
      track('file_download', { file_name: slug, link_url: link.href });
      button.disabled = false;
      button.innerHTML = button.dataset.label;
      reveal(s, true);
    });

    // A returning visitor downloads straight away. Log it so the list shows
    // which templates they took, without asking for their details again.
    link.addEventListener('click', () => {
      if (justSent) return;
      const s = readSaved();
      if (!s) return;
      send(endpoint, { type: 'template', template: slug, ...s, repeat: true }, true);
      track('file_download', { file_name: slug, link_url: link.href });
    });

    gate.querySelector('[data-gate-reset]')?.addEventListener('click', () => {
      forget();
      done.hidden = true;
      form.hidden = false;
      form.reset();
      form.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    });
  });
}

export function initAlerts(endpoint: string) {
  document.querySelectorAll<HTMLFormElement>('[data-alerts-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-alerts-status]')!;
    const email = form.querySelector<HTMLInputElement>('input[name="email"]')!;
    const saved = readSaved();
    if (saved && !email.value) email.value = saved.email;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      button.disabled = true;
      status.textContent = 'Signing you up...';
      const r = await send(endpoint, {
        type: 'alerts',
        placement: form.dataset.placement || '',
        email: field(f, 'email'),
        role: field(f, 'role'),
        website: field(f, 'website'),
      });
      button.disabled = false;
      if (r.ok) {
        form.dataset.state = 'done';
        status.textContent = r.confirm
          ? 'Nearly done. Check your inbox and click the link to confirm.'
          : 'You are signed up. The next alert will come to your inbox.';
        save({ name: saved?.name || '', role: field(f, 'role') || saved?.role || '', email: field(f, 'email') });
        track('sign_up', { method: 'regulation_alerts' });
        return;
      }
      status.textContent =
        r.error === 'invalid-email'
          ? 'That email address does not look right. Check it and try again.'
          : `That did not go through. Try again, or email ${form.dataset.contact} and we will add you.`;
    });
  });
}
