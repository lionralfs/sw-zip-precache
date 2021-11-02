importScripts('https://unpkg.com/@zip.js/zip.js@2.3.18/dist/zip-no-worker.min.js');

var ZIP_URL = './package-cookbook.zip';
zip.configure({
  useWebWorkers: false,
});

let result;
self.addEventListener('message', function (event) {
  event.ports[0].postMessage(result);
});

self.addEventListener('install', (event) => {
  self.skipWaiting();

  const preCache = async () => {
    performance.mark('install-start');
    await new zip.ZipReader(new zip.HttpReader(ZIP_URL))
      .getEntries()
      .then(cacheContents)
      .then(() => {
        performance.mark('install-end');
        performance.measure('install-measure', 'install-start', 'install-end');
        let total = performance.getEntriesByName('install-measure')[0].duration;
        result = { total };
      });
  };

  event.waitUntil(preCache().catch(console.error));
});

function getZipReader(data) {
  return new zip.ZipReader(new zip.Uint8ArrayReader(data));
}

function cacheContents(entries) {
  //   console.log('Installing', entries.length, 'files from zip');
  return Promise.all(entries.map(cacheEntry));
}

function cacheEntry(entry) {
  if (entry.directory) {
    return Promise.resolve();
  }

  return new Promise(async function (fulfill, reject) {
    let data = await entry.getData(new zip.BlobWriter());
    openCache()
      .then(function (cache) {
        var location = getLocation(entry.filename);
        var response = new Response(data, {
          headers: {
            'Content-Type': getContentType(entry.filename),
          },
        });

        return cache.put(location, response);
      })
      .then(fulfill, reject);
  });
}

var cachePromise;
function openCache() {
  if (!cachePromise) {
    cachePromise = caches.open('cache-from-zip-cookbook');
  }
  return cachePromise;
}

function getLocation(filename) {
  return location.href.replace(/sw-cookbook\.js$/, `precache/${filename}` || '');
}

function getContentType(filename) {
  var tokens = filename.split('.');
  var extension = tokens[tokens.length - 1];
  return contentTypesByExtension[extension] || 'text/plain';
}

var contentTypesByExtension = {
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  html: 'text/html',
  htm: 'text/html',
  svg: 'image/svg+xml',
};

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
