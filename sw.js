// Offline support for Little Learners Games.
//
// Strategy: network first, cache as fallback. While the server is reachable
// every page comes fresh from it (so edits show up immediately — no stale
// copies while developing); each response is also saved, and when the
// network is gone the saved copy is served instead. On install the hub,
// the shared files and every game page are saved up front, so a game works
// offline even if it has never been opened.
self.window = self;                 // games.js assigns to window.*
importScripts('shared/games.js');

const CACHE = 'kids-v2';
const CORE = ['./', 'shared/styles.css', 'shared/common.js', 'shared/games.js', 'shared/kit.js', 'shared/kit.css', 'shared/tubes.js', 'shared/tubes.css',
  'icon.svg', 'manifest.webmanifest'].concat(self.KIDS_GAMES.map(g => 'games/' + g.slug + '/'));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      // One missing file must not stop the rest from being saved.
      .then(cache => Promise.allSettled(CORE.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || Response.error()))
  );
});
