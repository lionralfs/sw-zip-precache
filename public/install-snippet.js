function install(swPath) {
  caches
    .keys()
    .then((cacheNames) => {
      // delete caches
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
      // unregister all old service workers
      return navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          return Promise.all(registrations.map((registration) => registration.unregister()));
        })
        .then(() => log('uninstalled all'));
    })
    .then(() => {
      log('installing new sw');
      navigator.serviceWorker
        .register(swPath)
        .then(function (registration) {
          let serviceWorker;
          if (registration.installing) {
            serviceWorker = registration.installing;
          } else if (registration.waiting) {
            serviceWorker = registration.waiting;
          } else if (registration.active) {
            serviceWorker = registration.active;
          }

          let messageChannel = new MessageChannel();

          if (serviceWorker) {
            // console.log(serviceWorker.state);
            log('start state: ' + serviceWorker.state);
            if (serviceWorker.state !== 'installing') {
              return log('not a clean start');
            }
            serviceWorker.addEventListener('statechange', function (e) {
              log('new state: ' + e.target.state);
              // console.log(e.target.state);
              if (e.target.state === 'activated') {
                e.target.postMessage('yo', [messageChannel.port1]);
              }
            });
          }

          messageChannel.port2.onmessage = (event) => {
            // unregister all old service workers
            return navigator.serviceWorker
              .getRegistrations()
              .then((registrations) => {
                return Promise.all(registrations.map((registration) => registration.unregister()));
              })
              .then(() => {
                log('uninstalled all');
                log(JSON.stringify(event.data));
                window.tachometerResult = event.data.total;
              });
          };
        })
        .catch(function (error) {
          log('An error happened during installing the service worker:');
          log(error.message);
        });
    })
    .catch(console.error);
}

function log(str) {
  document.body.appendChild(document.createTextNode(str));
  document.body.appendChild(document.createElement('br'));
}
