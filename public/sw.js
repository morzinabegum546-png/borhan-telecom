// BORHAN TELECOM service worker: app shell works offline; live data (Firebase) is never cached here.
const V = 'borhan-v1', SHELL = ['/', '/manifest.webmanifest', '/logo.png']
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== location.origin) return
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { caches.open(V).then(c => c.put('/', res.clone())); return res }).catch(() => caches.match('/'))); return }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) caches.open(V).then(c => c.put(r, res.clone())); return res })))
})
