importScripts('./lib/zip.js');
importScripts('./lib/ArrayBufferReader.js');
importScripts('./lib/deflate.js');
importScripts('./lib/inflate.js');

var ZIP_URL = './package.zip';
zip.useWebWorkers = false;

self.addEventListener('install', (event) => {
  performance.mark('install-start');
  event.waitUntil(
    fetch(ZIP_URL)
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then((data) => {
        performance.mark('install-download-complete');
        return data;
      })
      .then(getZipReader)
      .then(cacheContents)
      .then(async () => {
        performance.mark('install-end');
        performance.measure(
          'download-measure',
          'install-start',
          'install-download-complete'
        );
        performance.measure('install-measure', 'install-start', 'install-end');
        let total = performance.getEntriesByName('install-measure')[0].duration;
        let download =
          performance.getEntriesByName('download-measure')[0].duration;
        console.log({ download, total });

        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({ download, total });
      })
      .catch(console.error)
  );
});

function getZipReader(data) {
  return new Promise(function (fulfill, reject) {
    zip.createReader(new zip.ArrayBufferReader(data), fulfill, reject);
  });
}

function cacheContents(reader) {
  return new Promise(function (fulfill, reject) {
    reader.getEntries(function (entries) {
      let i = entries.findIndex((entry) => entry.filename === 'meta.json');
      let meta = entries[i];
      entries.splice(i, 1);
      meta.getData(new zip.TextWriter(), function (data) {
        meta = JSON.parse(data);
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
    });
  });
}

function cacheEntry(entry, location, contentType) {
  if (entry.directory) {
    return Promise.resolve();
  }

  return new Promise(function (fulfill, reject) {
    entry.getData(new zip.BlobWriter(), function (data) {
      return openCache()
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
