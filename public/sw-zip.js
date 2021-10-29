// importScripts('./lib/zip.js');
// importScripts('./lib/ArrayBufferReader.js');
// importScripts('./lib/deflate.js');
// importScripts('./lib/inflate.js');
importScripts('https://unpkg.com/@zip.js/zip.js@2.3.18/dist/zip-no-worker.min.js');
importScripts('./brotli-browser.js');

var ZIP_URL = './package.zip.br';
zip.configure({
  useWebWorkers: false,
});

self.addEventListener('install', (event) => {
  performance.mark('install-start');
  event.waitUntil(
    fetch(ZIP_URL)
      .then((res) => res.arrayBuffer())
      .then((data) => {
        performance.mark('install-download-complete');
        return data;
      })
      .then((buffer) => decompress(Buffer.from(buffer)))
      .then((array) => new zip.ZipReader(new zip.Uint8ArrayReader(array)).getEntries())
      .then(cacheContents)
      .then(async () => {
        performance.mark('install-end');
        performance.measure('download-measure', 'install-start', 'install-download-complete');
        performance.measure('install-measure', 'install-start', 'install-end');
        let total = performance.getEntriesByName('install-measure')[0].duration;
        let download = performance.getEntriesByName('download-measure')[0].duration;
        console.log({ download, total });

        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({ total });
      })
      .catch(console.error)
  );
});

function cacheContents(entries) {
  return new Promise(async function (fulfill, reject) {
    let i = entries.findIndex((entry) => entry.filename === 'meta.json');
    let meta = entries[i];
    entries.splice(i, 1);

    meta = JSON.parse(await meta.getData(new zip.TextWriter()));
    // console.log('Installing', entries.length, 'files from zip');
    Promise.all(
      entries.map((entry) => {
        let fromMeta = meta[entry.filename];
        if (!fromMeta || fromMeta.length !== 2) {
          return console.log(`${entry.filename} is not in meta.json (or broken), ignoring it.`);
        }
        return cacheEntry(entry, fromMeta[0], fromMeta[1]);
      })
    ).then(fulfill, reject);
  });
}

function cacheEntry(entry, location, contentType) {
  if (entry.directory) {
    return Promise.resolve();
  }

  return new Promise(async function (fulfill, reject) {
    let data = await entry.getData(new zip.BlobWriter());
    openCache()
      .then(function (cache) {
        var response = new Response(data, {
          headers: {
            'Content-Type': contentType,
          },
        });

        // console.log(
        //   '-> Caching',
        //   location,
        //   '(size:',
        //   entry.uncompressedSize,
        //   'bytes)'
        // );

        return cache.put(location, response);
      })
      .then(fulfill, reject);
  });
}

var cachePromise;
function openCache() {
  if (!cachePromise) {
    cachePromise = caches.open('cache-from-zip');
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
