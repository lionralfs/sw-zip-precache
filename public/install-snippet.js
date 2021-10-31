function install(swPath) {
  const isBenchmark = location.search.includes('?benchmark');
  const channel = new BroadcastChannel('sw-messages');
  let swReg;
  channel.addEventListener('message', (event) => {
    let result = event.data.total || -1;
    if (result <= 0) {
      throw new Error('invalid measurement');
    }
    console.log({ result });

    if (isBenchmark) {
      caches
        .keys()
        .then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              return caches.delete(cacheName);
            })
          );
        })
        .then((successes) => {
          if (successes.includes(false)) {
            throw new Error('could not clear caches');
          }
        })
        .then(() => {
          swReg.unregister().then((success) => {
            if (!success) {
              throw new Error('could not uninstall sw');
            }
            console.log('cleanup done');
            window.tachometerResult = result;
          });
        });
    }
  });

  navigator.serviceWorker
    .register(swPath)
    .then(function (reg) {
      swReg = reg;
      console.log('Installing...');
    })
    .catch(function (error) {
      console.log('An error happened during installing the service worker:');
      console.log(error.message);
    });
}
