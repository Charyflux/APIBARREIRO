// Service worker mínimo: permite instalar a StreetAlert como app (PWA).
// Não guarda nada em cache, para que a versão publicada chegue sempre logo a toda a gente.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(err => e.request.mode !== 'navigate' ? Promise.reject(err) : new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:system-ui;background:#1b2550;color:#fff;display:grid;place-items:center;height:100vh;margin:0;text-align:center"><div><h2>StreetAlert</h2><p>Sem ligação à internet.<br>No internet connection.</p></div>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
