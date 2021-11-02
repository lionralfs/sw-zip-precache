let result;
self.addEventListener('message', function (event) {
  event.ports[0].postMessage(result);
});

self.addEventListener('install', (event) => {
  self.skipWaiting();

  const preCache = async () => {
    performance.mark('install-start');
    const cache = await openCache();
    await cache.addAll([
      '/precache/arrow-up-svgrepo-com.svg',
      '/precache/attachment-svgrepo-com.svg',
      '/precache/backspace-svgrepo-com.svg',
      '/precache/ban-svgrepo-com.svg',
      '/precache/bar-chart-alt-svgrepo-com.svg',
      '/precache/bar-chart-svgrepo-com.svg',
      '/precache/board-svgrepo-com.svg',
      '/precache/react-dom.production.min.js',
      '/precache/react.production.min.js',
      '/precache/roboto-v29-latin-700.woff2',
      '/precache/roboto-v29-latin-regular.woff2',
      '/precache/tailwind.min.css',
      '/precache/offline.html',
    ]);
    performance.mark('install-end');
    performance.measure('install-measure', 'install-start', 'install-end');
    let total = performance.getEntriesByName('install-measure')[0].duration;
    result = { total };
  };

  event.waitUntil(preCache().catch(console.error));
});

var cachePromise;
function openCache() {
  if (!cachePromise) {
    cachePromise = caches.open('cache-from-vanilla');
  }
  return cachePromise;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(async function () {
        const cache = await openCache();
        if (event.request.headers.get('accept').includes('text/html')) {
          return cache.match('/precache/offline.html');
        }
        return cache.match(event.request);
      })
    );
  }
});
