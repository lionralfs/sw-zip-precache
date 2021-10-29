// importScripts('./lib/zip.js');
// importScripts('./lib/ArrayBufferReader.js');
// importScripts('./lib/deflate.js');
// importScripts('./lib/inflate.js');
importScripts(
  'https://unpkg.com/@zip.js/zip.js@2.3.18/dist/zip-no-worker.min.js'
);

var ZIP_URL = './package.zip';
zip.configure({
  useWebWorkers: false,
});

self.addEventListener('install', (event) => {
  performance.mark('install-start');
  event.waitUntil(
    new zip.ZipReader(new zip.HttpReader(ZIP_URL))
      .getEntries()
      // .then((data) => {
      //   performance.mark('install-download-complete');
      //   return data;
      // })
      // .then(getZipReader)
      .then(cacheContents)
      .then(async () => {
        performance.mark('install-end');
        // performance.measure(
        //   'download-measure',
        //   'install-start',
        //   'install-download-complete'
        // );
        performance.measure('install-measure', 'install-start', 'install-end');
        let total = performance.getEntriesByName('install-measure')[0].duration;
        // let download =
        //   performance.getEntriesByName('download-measure')[0].duration;
        console.log({ total });

        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({ total });
      })
      .catch(console.error)
  );
});

function getZipReader(data) {
  return new Promise(function (fulfill, reject) {
    zip.createReader(new zip.ArrayBufferReader(data), fulfill, reject);
  });
}

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
          return console.log(
            `${entry.filename} is not in meta.json (or broken), ignoring it.`
          );
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
