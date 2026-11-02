import { createHash, createHmac, createDecipheriv, timingSafeEqual } from 'node:crypto';
import asset from '../private/lumos-proposal.json' with { type: 'json' };

// Temporary, password-protected proposal for Lumos Dental Studio.
// Shuts itself off after EXPIRES; delete this file and ../private/lumos-proposal.json to remove it fully.
const EXPIRES = Date.parse('2026-12-16T05:00:00Z'); // end of Dec 15, Eastern
const COOKIE = 'lumos_access';

const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Vary': 'Cookie',
};

const shell = (title, inner) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${title}</title>
<style>
:root{--bg:#f3f6f9;--card:#fff;--ink:#1b2638;--muted:#5b6778;--rule:#d9e0e8;--accent:#2c7fb8;--err:#b4402a}
@media (prefers-color-scheme:dark){:root{--bg:#0e1622;--card:#162131;--ink:#e7edf5;--muted:#9aa8ba;--rule:#26354a;--accent:#5fb0e6;--err:#f08a73}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:400 16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}
.card{width:min(400px,100%);background:var(--card);border:1px solid var(--rule);border-radius:16px;padding:32px 28px;display:grid;gap:14px;box-shadow:0 30px 60px -40px rgba(0,0,0,.4)}
.k{font:600 11px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
h1{margin:0;font:400 28px/1.15 Georgia,serif}p{margin:0;color:var(--muted)}
label{font-size:14px;font-weight:600}input{width:100%;font:inherit;padding:12px 14px;border-radius:10px;border:1px solid var(--rule);background:transparent;color:inherit}
input:focus{outline:2px solid var(--accent);outline-offset:1px}
button{font:600 15px system-ui,sans-serif;padding:13px;border:0;border-radius:999px;background:var(--accent);color:#fff;cursor:pointer}
.err{color:var(--err);font-size:14px}a{color:var(--accent)}
.tooth{color:var(--accent)}.top{display:flex;align-items:center;gap:10px}
.chart{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-block:1px solid var(--rule);font:500 12px ui-monospace,monospace;color:var(--muted)}.chart b{display:block;color:var(--ink);font:600 13px system-ui,sans-serif}
</style></head><body>${inner}</body></html>`;

const loginPage = (error) => shell('Lumos Dental Studio · Treatment plan', `<form class="card" method="post" action="/lumos/">
<div class="top"><svg class="tooth" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M7.5 3C5 3 3.5 5 3.5 7.6c0 2.2.8 3.6 1.4 5.3.6 1.8.7 4 1.2 5.9.4 1.5 1 2.2 1.8 2.2 1.1 0 1.5-1.3 1.8-3 .3-1.6.6-3.5 2.3-3.5s2 1.9 2.3 3.5c.3 1.7.7 3 1.8 3 .8 0 1.4-.7 1.8-2.2.5-1.9.6-4.1 1.2-5.9.6-1.7 1.4-3.1 1.4-5.3C20.5 5 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="k">Lumos Dental Studio</span></div><h1>Your website and advertising treatment plan</h1>
<div class="chart"><span>Patient<b>Lumos Dental Studio</b></span><span>Prepared by<b>Robbie Hodge</b></span></div>
<p>Enter the password from my email to open your chart.</p>
<label for="pw">Password</label><input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
${error ? '<span class="err" role="alert">That password didn\'t match our records. Check the email and try again.</span>' : ''}
<button type="submit">Open my treatment plan</button>
<p style="font-size:13px">Trouble getting in? Email <a href="mailto:me@robbiehodge.com">me@robbiehodge.com</a>.</p></form>`);

const expiredPage = () => shell('Treatment plan expired', `<div class="card"><div class="top"><svg class="tooth" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M7.5 3C5 3 3.5 5 3.5 7.6c0 2.2.8 3.6 1.4 5.3.6 1.8.7 4 1.2 5.9.4 1.5 1 2.2 1.8 2.2 1.1 0 1.5-1.3 1.8-3 .3-1.6.6-3.5 2.3-3.5s2 1.9 2.3 3.5c.3 1.7.7 3 1.8 3 .8 0 1.4-.7 1.8-2.2.5-1.9.6-4.1 1.2-5.9.6-1.7 1.4-3.1 1.4-5.3C20.5 5 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="k">Lumos Dental Studio</span></div><h1>Time for a follow-up visit</h1>
<p>This treatment plan has expired. Reach out and I'll send a current one: <a href="mailto:me@robbiehodge.com">me@robbiehodge.com</a> or <a href="https://calendly.com/me-robbiehodge/30min">book a call</a>.</p></div>`);

const html = (body, status = 200, extra = {}) =>
  new Response(body, { status, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8', ...extra } });

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}
const safeEq = (a, b) => a.length === b.length && timingSafeEqual(a, b);

export default async function handler(request) {
  const url = new URL(request.url);
  if (url.pathname === '/lumos') return new Response(null, { status: 302, headers: { ...headers, Location: '/lumos/' } });
  if (url.pathname !== '/lumos/') return new Response('Not found', { status: 404, headers });
  if (Date.now() > EXPIRES) return html(expiredPage(), 410);

  const expectedHash = process.env.LUMOS_PASSWORD_SHA256;
  const contentKey = process.env.LUMOS_CONTENT_KEY;
  if (!/^[a-f0-9]{64}$/.test(expectedHash || '') || !contentKey) {
    return new Response('Private page temporarily unavailable.', { status: 503, headers });
  }
  const token = createHmac('sha256', contentKey).update('lumos-access:' + expectedHash).digest('hex');

  if (request.method === 'POST') {
    let password = '';
    try { const form = await request.formData(); password = String(form.get('password') || '').slice(0, 256); } catch {}
    const ok = safeEq(createHash('sha256').update(password.trim().toLowerCase()).digest(), Buffer.from(expectedHash, 'hex'));
    if (!ok) return html(loginPage(true), 401);
    return new Response(null, { status: 303, headers: { ...headers, Location: '/lumos/',
      'Set-Cookie': `${COOKIE}=${token}; Path=/lumos; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax` } });
  }
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, HEAD, POST' } });

  if (!safeEq(Buffer.from(readCookie(request, COOKIE)), Buffer.from(token))) return html(loginPage(false), 401);

  try {
    const d = createDecipheriv('aes-256-gcm', Buffer.from(contentKey, 'base64'), Buffer.from(asset.iv, 'base64'));
    d.setAuthTag(Buffer.from(asset.tag, 'base64'));
    const body = Buffer.concat([d.update(Buffer.from(asset.data, 'base64')), d.final()]);
    return html(request.method === 'HEAD' ? null : body);
  } catch {
    return new Response('Private page temporarily unavailable.', { status: 503, headers });
  }
}

export const config = { path: ['/lumos', '/lumos/'] };
