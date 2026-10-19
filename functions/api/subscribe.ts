/**
 * POST /api/subscribe (Cloudflare Pages Function).
 *
 * Receives template downloads, regulation alert sign-ups and readiness check
 * results from the site, adds the email to the right lists in Brevo or
 * MailerLite, and forwards the full submission to an optional webhook (a CRM,
 * Zapier, Make or a SEA Audit endpoint).
 *
 * Lists only get an email the visitor agreed to:
 * - downloads: everyone who downloads a template, for template update notices
 * - alerts: only when the visitor asked for regulation alerts
 * - audit: only when the visitor agreed to SEA Audit contacting them
 *
 * Environment variables (Pages > Settings > Variables and secrets):
 *   EMAIL_PROVIDER         brevo or mailerlite. Optional when only one key is set.
 *   EMAIL_API_KEY          Brevo API key or MailerLite API token. Store as a secret.
 *   EMAIL_LIST_DOWNLOADS   Brevo list id or MailerLite group id.
 *   EMAIL_LIST_ALERTS      Brevo list id or MailerLite group id.
 *   EMAIL_LIST_AUDIT       Brevo list id or MailerLite group id.
 *   BREVO_DOI_TEMPLATE_ID  Optional. Sends alert sign-ups a confirmation email first.
 *   BREVO_DOI_REDIRECT_URL Optional. Where the confirmation link lands.
 *   LEAD_WEBHOOK_URL       Optional. Receives every submission as JSON.
 *   LEAD_WEBHOOK_SECRET    Optional. Sent as the X-Webhook-Secret header.
 *   ALLOWED_ORIGINS        Optional. Extra origins allowed to post, comma separated.
 */

type Env = {
  EMAIL_PROVIDER?: string;
  EMAIL_API_KEY?: string;
  EMAIL_LIST_DOWNLOADS?: string;
  EMAIL_LIST_ALERTS?: string;
  EMAIL_LIST_AUDIT?: string;
  BREVO_DOI_TEMPLATE_ID?: string;
  BREVO_DOI_REDIRECT_URL?: string;
  LEAD_WEBHOOK_URL?: string;
  LEAD_WEBHOOK_SECRET?: string;
  ALLOWED_ORIGINS?: string;
};

type Context = {
  request: Request;
  env: Env;
  waitUntil?: (p: Promise<unknown>) => void;
};

type Kind = 'template' | 'alerts' | 'readiness';
type ListKey = 'downloads' | 'alerts' | 'audit';

export type Submission = {
  type: Kind;
  email: string;
  name: string;
  role: string;
  template: string;
  placement: string;
  page: string;
  consents: { alerts: boolean; audit: boolean };
  repeat: boolean;
  readiness?: Record<string, unknown>;
  submittedAt: string;
};

const MAX_BODY = 32_000;
// A person needs a few seconds to fill in a form. Faster than this is a bot.
const MIN_FILL_MS = 2_500;
const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[a-z0-9-]{2,}$/i;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Turns a raw request body into a clean submission, or an error code. */
export function parse(raw: Record<string, unknown>, now = Date.now()): Submission | { error: string; silent?: boolean } {
  // Spam traps: a hidden field only bots fill in, and forms sent too fast.
  // Reply as if it worked so bots learn nothing.
  if (text(raw.website, 200)) return { error: 'spam', silent: true };
  const ts = Number(raw.ts);
  if (!raw.repeat && Number.isFinite(ts) && ts > 0 && now - ts < MIN_FILL_MS) return { error: 'too-fast', silent: true };

  // Readiness check results arrive in the shape the readiness page already sends.
  const isReadiness = raw.source === 'sea-hub-readiness-check';
  const contact = (isReadiness && typeof raw.contact === 'object' && raw.contact ? raw.contact : raw) as Record<string, unknown>;
  const type: Kind | '' = isReadiness ? 'readiness' : raw.type === 'template' || raw.type === 'alerts' ? raw.type : '';
  if (!type) return { error: 'invalid-type' };

  const email = text(contact.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return { error: 'invalid-email' };

  const template = text(raw.template, 80);
  if (type === 'template' && !/^[a-z0-9-]+$/.test(template)) return { error: 'invalid-template' };

  const sub: Submission = {
    type,
    email,
    name: text(contact.name, 100),
    role: text(raw.role, 60),
    template,
    placement: text(raw.placement, 80),
    page: text(raw.page, 200),
    consents: {
      alerts: type === 'alerts' || raw.alerts === true,
      // The readiness form will not submit without its consent box ticked.
      audit: type === 'readiness' || raw.audit === true,
    },
    repeat: raw.repeat === true,
    submittedAt: new Date(now).toISOString(),
  };
  if (isReadiness) {
    sub.readiness = {
      organisation: text(contact.organisation, 120),
      schemes: text(contact.schemes, 40),
      score: raw.score,
      areas: raw.areas,
      priorityGaps: raw.priorityGaps,
      answers: raw.answers,
    };
  }
  return sub;
}

/** The lists a submission may join, based only on what the visitor agreed to. */
export function listsFor(sub: Submission): ListKey[] {
  const lists: ListKey[] = [];
  if (sub.type === 'template') lists.push('downloads');
  if (sub.consents.alerts) lists.push('alerts');
  if (sub.consents.audit) lists.push('audit');
  return lists;
}

function provider(env: Env): 'brevo' | 'mailerlite' | '' {
  if (!env.EMAIL_API_KEY) return '';
  const p = (env.EMAIL_PROVIDER || '').toLowerCase();
  if (p === 'brevo' || p === 'mailerlite') return p;
  // MailerLite tokens are JWTs. Brevo keys start with xkeysib-.
  return env.EMAIL_API_KEY.startsWith('xkeysib-') ? 'brevo' : env.EMAIL_API_KEY.split('.').length === 3 ? 'mailerlite' : '';
}

function listIds(env: Env, keys: ListKey[]): string[] {
  const map: Record<ListKey, string | undefined> = {
    downloads: env.EMAIL_LIST_DOWNLOADS,
    alerts: env.EMAIL_LIST_ALERTS,
    audit: env.EMAIL_LIST_AUDIT,
  };
  return keys.map((k) => (map[k] || '').trim()).filter(Boolean);
}

function splitName(name: string) {
  const [first = '', ...rest] = name.split(/\s+/).filter(Boolean);
  return { first, last: rest.join(' ') };
}

async function toBrevo(env: Env, sub: Submission, keys: ListKey[]): Promise<{ ok: boolean; confirm: boolean }> {
  const headers = { 'api-key': env.EMAIL_API_KEY!, 'Content-Type': 'application/json', Accept: 'application/json' };
  const { first, last } = splitName(sub.name);
  const attributes: Record<string, string> = {};
  if (first) attributes.FIRSTNAME = first;
  if (last) attributes.LASTNAME = last;

  // With double opt-in set up, alert sign-ups get a confirmation email and
  // join the alerts list only when they click it.
  const doi = Number(env.BREVO_DOI_TEMPLATE_ID) > 0 && Boolean(env.BREVO_DOI_REDIRECT_URL) && keys.includes('alerts');
  const direct = listIds(env, doi ? keys.filter((k) => k !== 'alerts') : keys).map(Number).filter((n) => n > 0);
  let ok = true;

  if (!doi || direct.length) {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: sub.email, attributes, listIds: direct, updateEnabled: true }),
    });
    ok = res.ok;
  }
  if (doi) {
    const alertsList = listIds(env, ['alerts']).map(Number).filter((n) => n > 0);
    const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: sub.email,
        attributes,
        includeListIds: alertsList,
        templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
        redirectionUrl: env.BREVO_DOI_REDIRECT_URL,
      }),
    });
    ok = ok && res.ok;
  }
  return { ok, confirm: doi };
}

async function toMailerLite(env: Env, sub: Submission, keys: ListKey[]): Promise<{ ok: boolean; confirm: boolean }> {
  const { first, last } = splitName(sub.name);
  const fields: Record<string, string> = {};
  if (first) fields.name = first;
  if (last) fields.last_name = last;
  // MailerLite adds groups without removing existing ones, so a repeat
  // sign-up never unsubscribes anyone.
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email: sub.email, fields, groups: listIds(env, keys) }),
  });
  return { ok: res.ok, confirm: false };
}

async function toWebhook(env: Env, sub: Submission): Promise<boolean> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.LEAD_WEBHOOK_SECRET) headers['X-Webhook-Secret'] = env.LEAD_WEBHOOK_SECRET;
  const res = await fetch(env.LEAD_WEBHOOK_URL!, { method: 'POST', headers, body: JSON.stringify({ source: 'exemptaccommodation.com', ...sub }) });
  return res.ok;
}

function originAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  const own = new URL(request.url).origin;
  const extra = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return origin === own || extra.includes(origin);
}

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;
  if (!originAllowed(request, env)) return json({ ok: false, error: 'origin' }, 403);
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json({ ok: false, error: 'content-type' }, 415);

  const body = await request.text();
  if (body.length > MAX_BODY) return json({ ok: false, error: 'too-large' }, 413);
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(body);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('not an object');
  } catch {
    return json({ ok: false, error: 'invalid-json' }, 400);
  }

  const sub = parse(raw);
  if ('error' in sub) return sub.silent ? json({ ok: true, confirm: false }) : json({ ok: false, error: sub.error }, 400);

  const p = provider(env);
  if (!p && !env.LEAD_WEBHOOK_URL) return json({ ok: false, error: 'not-configured' }, 503);

  const keys = listsFor(sub);
  const tasks: Promise<{ ok: boolean; confirm: boolean }>[] = [];
  // Repeat downloads only go to the webhook: the visitor is already on the lists.
  if (p && !sub.repeat) tasks.push(p === 'brevo' ? toBrevo(env, sub, keys) : toMailerLite(env, sub, keys));
  if (env.LEAD_WEBHOOK_URL) {
    const hook = toWebhook(env, sub).then((ok) => ({ ok, confirm: false }));
    // The visitor does not need to wait for the webhook when a list provider is set.
    if (p && context.waitUntil) context.waitUntil(hook.catch(() => undefined));
    else tasks.push(hook);
  }

  const results = await Promise.allSettled(tasks);
  const done = results.filter((r): r is PromiseFulfilledResult<{ ok: boolean; confirm: boolean }> => r.status === 'fulfilled' && r.value.ok);
  if (tasks.length && !done.length) return json({ ok: false, error: 'provider-error' }, 502);
  return json({ ok: true, confirm: done.some((r) => r.value.confirm) });
}
