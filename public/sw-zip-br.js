importScripts('https://unpkg.com/@zip.js/zip.js@2.3.18/dist/zip-no-worker.min.js');
importScripts('./brotli-browser.js');

var ZIP_URL = './package-of-br.zip';
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
    await new zip.ZipReader(new zip.HttpReader(ZIP_URL)).getEntries().then(cacheContents);

    performance.mark('install-end');
    performance.measure('install-measure', 'install-start', 'install-end');
    let total = performance.getEntriesByName('install-measure')[0].duration;
    result = { total };
  };

  event.waitUntil(preCache().catch(console.error));
});

function cacheContents(entries) {
  return new Promise(function (fulfill, reject) {
    let i = entries.findIndex((entry) => entry.filename === 'meta.json.br');
    let meta = entries[i];
    entries.splice(i, 1);

    meta
      .getData(new zip.Uint8ArrayWriter())
      .then((buffer) => decompress(Buffer.from(buffer)))
      .then((meta) => {
        return JSON.parse(new TextDecoder().decode(meta));
      })
      .then((meta) => {
        Promise.all(
          entries.map((entry) => {
            let filename = entry.filename.replace(/\.br$/, '');
            let fromMeta = meta[filename];
            if (!fromMeta || fromMeta.length !== 2) {
              return console.log(`${filename} is not in meta.json (or broken), ignoring it.`);
            }
            return cacheEntry(entry, fromMeta[0], fromMeta[1]);
          })
        ).then(fulfill, reject);
      });
  });
}

function cacheEntry(entry, location, contentType) {
  if (entry.directory) {
    return Promise.resolve();
  }

  return new Promise(async function (fulfill, reject) {
    let data = await entry.getData(new zip.Uint8ArrayWriter());
    if (contentType !== 'font/woff2') {
      data = decompress(Buffer.from(data));
    }

    openCache()
      .then(function (cache) {
        var response = new Response(data, {
          headers: {
            'Content-Type': contentType,
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
    cachePromise = caches.open('cache-from-zipped-br');
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
