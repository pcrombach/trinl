/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var swRegistration, newWorker, refreshing, pushManager, syncManager;

if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

  // The event listener that is fired when the service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    //console.log('[initSW] Reload the page');
    //window.location.reload();
    window.document.location.href = 'index.html';
    refreshing = true;
  });
  if ('PushManager' in window) {
    pushManager = true;
    console.log('[initSW] PushManager supported');
  }
  if ('SyncManager' in window) {
    syncManager = true;
    console.log('[initSW] SyncManager supported');
  }
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    //console.log('[initSW] ServiceWorker supported');
    //var sw = 'sw.js';
    //if (location.hostname === 'www.pcmatic.nl') {
      //sw = 'sw_pcmatic.js';
    //}
    //if (location.hostname === 'www.trinl.nl') {
      //sw = 'sw_trinl.js';
    //}
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', {
        useCache: true
      }).then(function (reg) {

        reg.addEventListener('updateFound', () => {
          //console.log('[initSW] An updated service worker has appeared in reg.installing!');
          newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            //console.log('[initSW] Has service worker state changed?');
            switch (newWorker.state) {
              case 'installed':
                //console.log('[initSW] There is a new service worker available, show the notification');
                if (navigator.serviceWorker.controller) {
                  console.error('[initSW] TRINL wordt nu een geupdate!!!!');
                  newWorker.postMessage({
                    action: 'skipWaiting'
                  });
                }
                break;
            }
          });
        });

        //console.log('[initSW] Service Worker registration successful with scope: ', reg.scope);
        swRegistration = reg;
        return reg.sync.getTags();

      }).then(function (tags) {
        if (syncManager && tags.includes('syncTest')) {
          swRegistration.sync.getTags().then(tags => {
            //console.log('[initSW] Sync all tags: ', tags);
          });
          //console.error('[initSW] Sync registratie: Reeds geregistreerd');
        } else {

          if (tags.includes('syncTest')) {
            swRegistration.sync.register('syncTest').then(() => {
              swRegistration.sync.getTags().then(tags => {
                //console.log('[initSW] Sync all tags: ', tags);
              });
            });
          }
        }
      }).catch(function (err) {
        //console.log('[initSW] ServiceWorker registration ERROR: ', err);
      });
    });
  } else {
    //console.warn('[initSW] Push Worker is not supported');
    //pushButton.textContext = 'Push Not Supported'
  }

  // make the whole serviceworker process into a promise so later on we can
  // listen to it and in case new content is available a toast will be shown
  window.isUpdateAvailable = new Promise(function (resolve, reject) {
    // lazy way of disabling service workers while developing
    console.log('[initSW] location: ', location.hostname);
    if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
      // register service worker file
      //var sw = 'sw.js';
      //if (location.hostname === 'www.pcmatic.nl') {
        //sw = 'sw_pcmatic.js';
      //}
      //if (location.hostname === 'www.trinl.nl') {
        //sw = 'sw_trinl.js';
      //}
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.error('[initSW]new update available');
                  resolve(true);
                } else {
                  console.log('[initSW]no update available');
                  // no update available
                  resolve(false);
                }
                break;
            }
          };
        };
      }).catch(err => console.error('[initSW] ERROR', err));
    }
  });

  // Update:
  // this also can be incorporated right into e.g. your run() function in angular,
  // to avoid using the global namespace for such a thing.
  // because the registering of a service worker doesn't need to be executed on the first load of the page.

  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(function (estimate) {
      //console.log(`[initSW] Using ${estimate.usage / (estimate.quota / 100)} out of ${estimate.quota} bytes.`);
      //console.log(`[initSW] Using ${estimate.usage} out of ${estimate.quota} bytes (${estimate.usage / (estimate.quota / 100)} %)`);
    });
  }
}
