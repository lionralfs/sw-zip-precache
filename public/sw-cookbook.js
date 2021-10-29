// importScripts('./lib/zip.js');
// importScripts('./lib/ArrayBufferReader.js');
// importScripts('./lib/deflate.js');
// importScripts('./lib/inflate.js');
importScripts('https://unpkg.com/@zip.js/zip.js@2.3.18/dist/zip-no-worker.min.js');

var ZIP_URL = './package-no-meta.zip';
zip.configure({
  useWebWorkers: false,
});

self.addEventListener('install', (event) => {
  performance.mark('install-start');
  event.waitUntil(
    new zip.ZipReader(new zip.HttpReader(ZIP_URL))
      .getEntries()
      .then(cacheContents)
      .then(async () => {
        performance.mark('install-end');
        // performance.measure('download-measure', 'install-start', 'install-download-complete');
        performance.measure('install-measure', 'install-start', 'install-end');
        let total = performance.getEntriesByName('install-measure')[0].duration;
        // let download = performance.getEntriesByName('download-measure')[0].duration;
        console.log({ total });

        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({ total });
      })
      .catch(console.error)
  );
});

function getZipReader(data) {
  return new zip.ZipReader(new zip.Uint8ArrayReader(data));
}

function cacheContents(entries) {
  //   console.log('Installing', entries.length, 'files from zip');
  return Promise.all(entries.map(cacheEntry))
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
    cachePromise = caches.open('cache-from-zip-no-meta');
  }
  return cachePromise;
}

function getLocation(filename) {
  return location.href.replace(/sw-cookbook\.js$/, filename || '');
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
};

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
