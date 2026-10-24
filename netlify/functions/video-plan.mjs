import { createHash, createDecipheriv, timingSafeEqual } from 'node:crypto';
import assets from '../private/video-plan-data.json' with { type: 'json' };

const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Vary': 'Authorization',
};

export default async function handler(request) {
  const expectedHash = process.env.VIDEO_PLAN_PASSWORD_SHA256;
  const encryptionKey = process.env.VIDEO_PLAN_CONTENT_KEY;
  if (!/^[a-f0-9]{64}$/.test(expectedHash || '') || !encryptionKey) {
    return new Response('Private page temporarily unavailable.', { status: 503, headers });
  }
  let credentials = '';
  const auth = request.headers.get('authorization') || '';
  if (/^Basic /i.test(auth) && auth.length < 2048) {
    try { credentials = Buffer.from(auth.slice(6), 'base64').toString('utf8'); } catch {}
  }
  const separator = credentials.indexOf(':');
  const user = credentials.slice(0, separator);
  const password = separator >= 0 ? credentials.slice(separator + 1) : '';
  const actualHash = createHash('sha256').update(password).digest();
  if (user !== 'robbie' || !timingSafeEqual(actualHash, Buffer.from(expectedHash, 'hex'))) {
    return new Response('Sign in to view your video plan.', {
      status: 401,
      headers: { ...headers, 'WWW-Authenticate': 'Basic realm="Private video plan", charset="UTF-8"' },
    });
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
  }
  const pathname = new URL(request.url).pathname;
  if (pathname === '/video-plan') {
    return new Response(null, { status: 302, headers: { ...headers, Location: '/video-plan/' } });
  }
  const asset = assets[pathname];
  if (!asset || !Object.hasOwn(assets, pathname)) return new Response('Not found', { status: 404, headers });
  try {
    const decipher = createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'base64'), Buffer.from(asset.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(asset.tag, 'base64'));
    const body = Buffer.concat([decipher.update(Buffer.from(asset.data, 'base64')), decipher.final()]);
    return new Response(request.method === 'HEAD' ? null : body, {
      headers: { ...headers, 'Content-Type': asset.type },
    });
  } catch {
    return new Response('Private page temporarily unavailable.', { status: 503, headers });
  }
}

export const config = { path: ['/video-plan', '/video-plan/*'] };
