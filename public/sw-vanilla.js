self.addEventListener('install', (event) => {
  performance.mark('install-start');
  event.waitUntil(
    openCache().then((cache) => {
      cache
        .addAll([
          '/dummy-assets/arrow-up-svgrepo-com.svg',
          '/dummy-assets/attachment-svgrepo-com.svg',
          '/dummy-assets/backspace-svgrepo-com.svg',
          '/dummy-assets/ban-svgrepo-com.svg',
          '/dummy-assets/bar-chart-alt-svgrepo-com.svg',
          '/dummy-assets/bar-chart-svgrepo-com.svg',
          '/dummy-assets/board-svgrepo-com.svg',
          '/dummy-assets/react-dom.production.min.js',
          '/dummy-assets/react.production.min.js',
          '/dummy-assets/roboto-v29-latin-700.woff2',
          '/dummy-assets/roboto-v29-latin-regular.woff2',
          '/dummy-assets/tailwind.min.css',
          '/offline.html',
        ])
        .then(() => {
          performance.mark('install-end');
          performance.measure('install-measure', 'install-start', 'install-end');
          let total = performance.getEntriesByName('install-measure')[0].duration;

          const channel = new BroadcastChannel('sw-messages');
          channel.postMessage({ total });
          console.log({ total });
        });
    })
  );
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
          return cache.match('/offline.html');
        }
        return cache.match(event.request);
      })
    );
  }
});
