/**
 * Consent, ads and analytics loading.
 *
 * Google Consent Mode v2 defaults are set inline in <head> (everything denied)
 * before any Google tag can load. This module records the visitor's choice,
 * sends the consent update and only then loads AdSense and GA4.
 */

type Consent = { analytics: boolean; ads: boolean; at: string };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    adsbygoogle: unknown[];
    __seahub: { adsClient: string; consentMode: 'builtin' | 'external'; ga4: string; base: string };
  }
}

const KEY = 'seahub-consent';

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function write(c: Consent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* storage blocked: consent applies to this page view only */
  }
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  if (document.querySelector(`script[src^="${src.split('?')[0]}"]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function applyConsent(c: Consent) {
  window.gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.ads ? 'granted' : 'denied',
    ad_user_data: c.ads ? 'granted' : 'denied',
    ad_personalization: c.ads ? 'granted' : 'denied',
  });
  const { ga4 } = window.__seahub;
  if (c.analytics && ga4) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4}`);
    window.gtag('js', new Date());
    window.gtag('config', ga4, { anonymize_ip: true });
  }
  initAds(c.ads);
}

let adsStarted = false;
function initAds(allowed: boolean) {
  const { adsClient } = window.__seahub;
  const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-ad-slot-wrap][data-provider="adsense"]'));
  if (!adsClient || !slots.length) return;
  if (!allowed) {
    slots.forEach(showHouse);
    return;
  }
  if (adsStarted) return;
  adsStarted = true;
  loadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`, {
    crossorigin: 'anonymous',
  });
  window.adsbygoogle = window.adsbygoogle || [];

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const wrap = e.target as HTMLElement;
        const live = wrap.querySelector<HTMLElement>('[data-ad-live]');
        const house = wrap.querySelector<HTMLElement>('[data-ad-house]');
        const ins = wrap.querySelector<HTMLElement>('ins.adsbygoogle');
        if (!live || !ins) continue;
        live.hidden = false;
        if (house) house.hidden = true;
        try {
          window.adsbygoogle.push({});
        } catch {
          showHouse(wrap);
          continue;
        }
        // AdSense marks unfilled units; fall back to the house ad.
        new MutationObserver(() => {
          if (ins.getAttribute('data-ad-status') === 'unfilled') showHouse(wrap);
        }).observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
      }
    },
    { rootMargin: '300px 0px' },
  );
  slots.forEach((s) => io.observe(s));
}

function showHouse(wrap: HTMLElement) {
  const live = wrap.querySelector<HTMLElement>('[data-ad-live]');
  const house = wrap.querySelector<HTMLElement>('[data-ad-house]');
  const label = wrap.querySelector<HTMLElement>('[data-ad-label]');
  if (live) live.hidden = true;
  if (house) house.hidden = false;
  if (label) label.textContent = 'Promoted by SEA Audit';
}

export function initConsent() {
  const { consentMode } = window.__seahub;
  if (consentMode === 'external') {
    // A certified CMP handles the message and the consent update.
    initAds(true);
    return;
  }

  const banner = document.querySelector<HTMLElement>('[data-consent]');
  const stored = read();
  if (stored) applyConsent(stored);

  const show = () => {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(() => banner.setAttribute('data-show', 'true'));
  };
  const hide = () => {
    if (!banner) return;
    banner.setAttribute('data-show', 'false');
    setTimeout(() => (banner.hidden = true), 350);
  };
  const decide = (c: Omit<Consent, 'at'>) => {
    const full = { ...c, at: new Date().toISOString() };
    write(full);
    applyConsent(full);
    hide();
  };

  if (!stored) setTimeout(show, 900);

  banner?.querySelector('[data-consent-accept]')?.addEventListener('click', () => decide({ analytics: true, ads: true }));
  banner?.querySelector('[data-consent-reject]')?.addEventListener('click', () => decide({ analytics: false, ads: false }));
  banner?.querySelector('[data-consent-customise]')?.addEventListener('click', () => {
    const details = banner.querySelector<HTMLElement>('[data-consent-details]');
    const save = banner.querySelector<HTMLElement>('[data-consent-save]');
    if (details) details.hidden = false;
    if (save) save.hidden = false;
    const prev = read();
    const a = banner.querySelector<HTMLInputElement>('[data-consent-analytics]');
    const ad = banner.querySelector<HTMLInputElement>('[data-consent-ads]');
    if (a) a.checked = Boolean(prev?.analytics);
    if (ad) ad.checked = Boolean(prev?.ads);
  });
  banner?.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    const a = banner.querySelector<HTMLInputElement>('[data-consent-analytics]');
    const ad = banner.querySelector<HTMLInputElement>('[data-consent-ads]');
    decide({ analytics: Boolean(a?.checked), ads: Boolean(ad?.checked) });
  });
  document.querySelectorAll('[data-consent-open]').forEach((b) => b.addEventListener('click', show));

  if (!stored) initAds(false);
}
