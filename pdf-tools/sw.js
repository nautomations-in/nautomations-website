// N Automations - PDF Tools service worker.
// Caches the application shell and local conversion engines only.
// User documents are never read, stored or transmitted by this worker.
const CACHE = 'na-pdf-tools-vmu8l51oz';
const SHELL = ["/","/index.html","/assets/index-CbYPeLKl.js","/assets/jszip.min-BMmAup8j.js","/assets/engine.worker-Ca3pL-9K.js","/assets/index-jvwm160C.css"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.filter(Boolean))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok && /\.(js|css|wasm|png|svg|woff2?|ttf|traineddata\.gz|bcmap|pfb|icc)$/.test(new URL(req.url).pathname)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("/index.html")),
    ),
  );
});
