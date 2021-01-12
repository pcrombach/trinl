/* eslint-disable no-unused-vars */

const cacheVersion = '7620';
const staticCacheName = 'site-static-' + cacheVersion;
const dataCacheName = 'site-data-' + cacheVersion;
const dataCacheSizeLimit = 3000;

const assets_trinl = [

  './',
  './index.html',
  './cordova.js',
  './web-push-notifications.js',
  './webpush.json',
  './config.json',
  './favicon.ico',

  'css/ionic.app.css',
  'css/trinl-style.css',

  'lib/axios/axios.js',
  'lib/ionic/js/ionic.bundle.js',
  'lib/ionic/fonts/ionicons.ttf?v=2.0.1',
  'lib/ngCordova/dist/ng-cordova.js',
  'lib/leaflet/leaflet.css',
  'lib/leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css',
  'lib/L.GeoSearch/src/css/l.geosearch.css',
  'lib/Leaflet.markercluster/dist/MarkerCluster.css',
  'lib/Leaflet.markercluster/dist/MarkerCluster.Default.css',
  'lib/leaflet-pulse-icon/dist/L.Icon.Pulse.css',
  'lib/leaflet/leaflet.js',
  'lib/leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js',
  'lib/L.GeoSearch/src/js/L.Control.GeoSearch.js',
  'lib/L.GeoSearch/src/js/L.GeoSearch.Provider.OpenstreetMap.js',
  'lib/L.GeoSearch/src/img/geosearch.png',
  'lib/L.GeoSearch/src/img/spinner.gif',
  'lib/leaflet.bouncemarker/bouncemarker.js',
  'lib/Leaflet.EdgeBuffer/src/leaflet.edgebuffer.js',
  'lib/Leaflet.markercluster/dist/leaflet.markercluster-src.js',
  'lib/leaflet-pulse-icon/dist/L.Icon.Pulse.js',
  'lib/leaflet-gridlayer-fadeout/src/leaflet.gridlayout.fadeout.js',
  'lib/leaflet.rotatedMarker/leaflet.rotatedMarker.js',
  'lib/leaflet/images/marker-icon.png',
  'lib/leaflet/images/marker-shadow.png',
  'lib/exif/exif.js',
  'lib/lodash.custom.min.js',
  'lib/moment/moment.js',
  'lib/moment/locale/nl.js',
  'lib/angular-momentjs.js',
  'lib/angular-moment/angular-moment.js',
  'lib/sha512.js',
  'lib/progressbar/dist/progressbar.js',
  'lib/angular-elastic/elastic.js',
  'lib/howler/dist/howler.core.min.js',
  'lib/togeojson/togeojson.js',
  'lib/togpx/togpx.js',

  'templateCache/templates.js',

  'js/initDb.js',
  'js/initSw.js',
  'js/app.js',
  'js/run/run.js',
  'js/config/Provider.js',
  'js/constant/constant.js',

  'js/directives/clickForOptions.js',
  'js/directives/clickForOptionsWrapper.js',
  'js/directives/closeOption.js',
  'js/directives/closePopupService.js',
  'js/directives/detectFocus.js',
  'js/directives/fakestatusbar.js',
  'js/directives/imageonload.js',
  'js/directives/isFocused.js',
  'js/directives/myRadio.js',
  'js/directives/optimizeSlides.js',
  'js/directives/stopEvent.js',

  'js/factories/files/dataFactoryFotos.js',
  'js/factories/files/dataFactoryPois.js',
  'js/factories/files/dataFactoryTracks.js',

  'js/factories/map/dataFactoryGeom.js',
  'js/factories/map/dataFactoryMap.js',
  'js/factories/map/dataFactoryOverlay.js',

  'js/factories/store/dataFactoryAnalytics.js',
  'js/factories/store/dataFactoryAvatar.js',
  'js/factories/store/dataFactoryBericht.js',
  'js/factories/store/dataFactoryBerichtReactie.js',
  'js/factories/store/dataFactoryBerichtReactieSup.js',
  'js/factories/store/dataFactoryBerichtSup.js',
  'js/factories/store/dataFactoryBerichtTag.js',
  'js/factories/store/dataFactoryBlacklist.js',
  'js/factories/store/dataFactoryCategorie.js',
  'js/factories/store/dataFactoryCeo.js',
  'js/factories/store/dataFactoryConfig.js',
  'js/factories/store/dataFactoryConfigKaart.js',
  'js/factories/store/dataFactoryConfigLaag.js',
  'js/factories/store/dataFactoryConfigX.js',
  'js/factories/store/dataFactoryFoto.js',
  'js/factories/store/dataFactoryFotoReactie.js',
  'js/factories/store/dataFactoryFotoReactieSup.js',
  'js/factories/store/dataFactoryFotoSup.js',
  'js/factories/store/dataFactoryFotoTag.js',
  'js/factories/store/dataFactoryGebruiker.js',
  'js/factories/store/dataFactoryGeo.js',
  'js/factories/store/dataFactoryGroepdeelnemers.js',
  'js/factories/store/dataFactoryGroepen.js',
  'js/factories/store/dataFactoryHelp.js',
  'js/factories/store/dataFactoryHistorie.js',
  'js/factories/store/dataFactoryPersoon.js',
  'js/factories/store/dataFactoryPoi.js',
  'js/factories/store/dataFactoryPoiReactie.js',
  'js/factories/store/dataFactoryPoiReactieSup.js',
  'js/factories/store/dataFactoryPoiSup.js',
  'js/factories/store/dataFactoryPoiTag.js',
  'js/factories/store/dataFactoryProfiel.js',
  'js/factories/store/dataFactoryPushToken.js',
  'js/factories/store/dataFactoryTag.js',
  'js/factories/store/dataFactoryTrack.js',
  'js/factories/store/dataFactoryTrackPoisFotos.js',
  'js/factories/store/dataFactoryTrackReactie.js',
  'js/factories/store/dataFactoryTrackReactieSup.js',
  'js/factories/store/dataFactoryTrackSup.js',
  'js/factories/store/dataFactoryTrackTag.js',
  'js/factories/store/SysLogStore.js',

  'js/factories/system/dataFactoryAlive.js',
  'js/factories/system/dataFactoryClean.js',
  'js/factories/system/dataFactoryClock.js',
  'js/factories/system/dataFactoryCodePush.js',
  'js/factories/system/dataFactoryDropbox.js',
  'js/factories/system/dataFactoryHelper.js',
  'js/factories/system/dataFactoryExportFotos.js',
  'js/factories/system/dataFactoryExportPois.js',
  'js/factories/system/dataFactoryExportTracks.js',
  'js/factories/system/dataFactoryImportFotos.js',
  'js/factories/system/dataFactoryImportPois.js',
  'js/factories/system/dataFactoryImportTracks.js',
  'js/factories/system/dataFactoryInstellingen.js',
  'js/factories/system/dataFactoryLoDash.js',
  'js/factories/system/dataFactoryObjectId.js',
  'js/factories/system/dataFactoryProxy.js',
  'js/factories/system/dataFactoryStore.js',
  'js/factories/system/dataFactoryNotification.js',
  'js/factories/system/dataFactorySync.js',
  'js/factories/system/dataFactorySyncFS.js',

  'js/controllers/AppSideMenuCtrl.js',
  'js/controllers/BerichtCardCtrl.js',
  'js/controllers/BerichtenCtrl.js',
  'js/controllers/BerichtenSideMenuCtrl.js',
  'js/controllers/BerichtFormCtrl.js',
  'js/controllers/DashCtrl.js',
  'js/controllers/FotoCardCtrl.js',
  'js/controllers/FotoDropboxCtrl.js',
  'js/controllers/FotoPopupCardCtrl.js',
  'js/controllers/FotosCtrl.js',
  'js/controllers/FotosSideMenuCtrl.js',
  'js/controllers/InstellingenCtrl.js',
  'js/controllers/KaartCtrl.js',
  'js/controllers/PersoonCtrl.js',
  'js/controllers/PoiCardCtrl.js',
  'js/controllers/PoiDropboxCtrl.js',
  'js/controllers/PoiPopupCardCtrl.js',
  'js/controllers/PoisCtrl.js',
  'js/controllers/PoisSideMenuCtrl.js',
  'js/controllers/ProfielCtrl.js',
  'js/controllers/TagCtrl.js',
  'js/controllers/TrackCardCtrl.js',
  'js/controllers/TrackDropboxCtrl.js',
  'js/controllers/TrackPopupCardCtrl.js',
  'js/controllers/TracksCtrl.js',
  'js/controllers/TracksSideMenuCtrl.js',

  'js/controllers/login/DisclaimerCtrl.js',
  'js/controllers/login/EntryCtrl.js',
  'js/controllers/login/InloggenCtrl.js',
  'js/controllers/login/PrivacyCtrl.js',
  'js/controllers/login/RegistreerCtrl.js',
  'js/controllers/login/SignInCtrl.js',
  'js/controllers/login/WachtwoordCtrl.js',

  'sound/data-notify.mp3',
  'sound/push-notify.mp3',

  'assets/icons/apple-icon-72.png',
  'assets/icons/apple-icon-144.png',
  'assets/icons/apple-icon-192.png',
  'assets/icons/apple-icon-512.png',
  'assets/screenshots/screenshot.png',

  'images/5485.png',
  'images/NMFL.png',
  'images/OverTrinl.png',
  'images/kroontje80.png',
  'images/kbr.png',
  'images/Steden1600.png',
  'images/bvb_ori.png',
  'images/bvb.png',
  'images/camera-marker.png',
  'images/green_square.png',
  'images/ic_notification_small.png',
  'images/ic_notification.png',
  'images/pico_red_square.png',
  'images/poi2-marker.png',
  'images/track-marker.png',
  'images/windmolen_small.png',
  'images/windmolenx.png',
  'images/windmolen.png',
  'images/mycrosshair_02.png',
  'images/small_non_existing_id.png',

  'http://localhost/trinl/Backends/backendTrinl/configkaart/load/1/5880b267572bd886ad30cbb8/5?pageLimit=500&pageStart=0&xprive=0',
  'http://localhost/trinl/Backends/backendTrinl/configlaag/load/1/5880b267572bd886ad30cbb8/5?pageLimit=500&pageStart=0&xprive=0',
  'http://localhost/trinl/geobuf/TBO3FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen8FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen9FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen10FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen11FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen12FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/Plaatsnamen13FromGeobuf.geojson',
  'http://localhost/trinl/geobuf/ProvinciegrensFromGeobuf.geojson',
  'http://localhost/trinl/geobuf/GemeentegrenzenFromGeobuf.geojson',
  'http://localhost/trinl/geobuf/OppwaterFromGeobuf.geojson',
  'http://localhost/trinl/geobuf/ElectriciteitsnetwerkFromGeobuf.geojson',
  'http://localhost/trinl/geobuf/AchterbanFromGeobuf.geojson',
  'http://localhost/trinl/geobuf/HoogtelijnenFromGeobuf.geojson'

];

//  8_10_2020
const fetchEnabled = true;
const syncEnabled = true;
const gebruikersDataEnabled = true;
//console.warn('[ServiceWorker] Fetch (caching) enabled: ', fetchEnabled);
//console.warn('[ServiceWorker] Sync (syncing) enabled: ', syncEnabled);

// cache size limit
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        //console.warn('[ServiceWorker] cache size limit');
        cache.delete([0]).then(limitCacheSize(name, size));
      }
    });
  });
};
// install listener
self.addEventListener('install', evt => {

  //console.warn('[ServiceWorker] is geinstalleerd');
  //console.warn(self.registration.active);

  if (self.registration.active) {
    //console.warn(self.registration.active.state);

    if (self.registration.active.state === 'activated') {
      //console.warn('[ServiceWorker] YEAAAAAAAAAAAA!!?!?!?!?!?!:    ', self.registration.active.state === 'activated');
    } else {
      //console.warn('[ServiceWorker] active.state: ', self.registration.active.state);
    }
  }

  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      //console.log('[ServiceWorker] caching assets: ', assets_trinl, staticCacheName);
      return cache.addAll(assets_trinl);
    }).then(() => {
      self.skipWaiting();
    }).catch(err => {
      //console.error('[ServiceWorker] caching failed: ', err);
    })
  );
});

// activate listener
self.addEventListener('activate', evt => {
  //console.warn('[ServiceWorker] is geactiveerd');
  self.clients.matchAll({
    includeUncontrolled: true
  }).then(function (clientList) {
    var urls = clientList.map(function (client) {
      return client.url;
    });
    //console.warn('[ServiceWorker] Matching clients:', urls.join(', '));
  });

  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList
        .filter(key => key !== staticCacheName && key !== dataCacheName)
        .map(key => caches.delete(key))
      );
    }).then(function () {
      //console.warn('[ServiceWorker] Claiming clients for version');
      return self.clients.claim();
    })
  );
});

function syncStore(store) {

  var db;

  var request = indexedDB.open('trinlSyncDB');
  request.onsuccess = function (event) {

    //console.warn('[ServiceWorker] syncSTore event: ', event, event.target, event.target.result);

    db = event.target.result;
    var transaction = db.transaction([store], 'readonly');
    var objectStore = transaction.objectStore(store);
    var requestAll = objectStore.getAll();
    requestAll.onsuccess = function (event) {
      let results = event.target.result;
      //console.warn('[ServiceWorker] Here is what we have in store ', store, results + ' (' + results.length + ' items in total)');
      return Promise.all(results.map(result => {
        //console.warn('[ServiceWorker] store getAll result ', store, result.record);
        var queryString = Object.keys(result.record).map(function (key) {
          return key + '=' + result.record[key];
        }).join('&');
        var operation;
        if (result.meta.method == 'POST' || result.meta.method == 'PUT') {
          operation = 'save';
        }
        if (result.meta.method == 'DELETE') {
          operation = 'remove';
        }
        var url = result.meta.url + store + '/' + operation + '/1/' + result.meta.gebruikerId + '/' + result.meta.profielId + '/?' + queryString;
        //console.warn('[ServiceWorker] fetch url => ', url);
        //console.warn('[ServiceWorker] fetch method => ', result.meta.method);
        //console.warn('[ServiceWorker] fetch token => ', result.meta.token);
        return fetch(url, {
          method: result.meta.method,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + result.meta.token
          },
          params: result.record
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          //console.warn('[ServiceWorker] store fetch deleting indexedDb' + result.meta.method + ' data: ', store, data);
          //console.warn('[ServiceWorker] store fetch delete with store, result.Id: ', store, result.Id);
          var transaction = db.transaction([store], 'readwrite');
          var objectStore = transaction.objectStore(store);
          var requestDelete = objectStore.delete(result.Id);
          requestDelete.onsuccess = function (event) {
            var resultDelete = event.target.result;
            //console.warn('[ServiceWorker] store delete SUCCESS ', store, resultDelete, result.Id);
          };
          requestDelete.onerror = function (event) {
            //console.warn('[ServiceWorker] store delete ERROR: ', event, store, result.Id);
          };
        }).catch(err => {
          //console.warn('[ServiceWorker] store fetch ERROR: ', store);
        });
      }));
    };
  };
}

// sync listener
self.addEventListener('sync', evt => {

  //console.warn('service worker Sync fired: ', evt);

  if (syncEnabled) {

    //console.warn('service worker Sync: ', evt.tag);

    if (evt.tag !== 'syncTest') {
      evt.waitUntil(
        syncStore(evt.tag)
      );
    }

  }
});

let getVersionPort;
self.addEventListener('message', event => {
  //console.error('[ServiceWorker] messageChannel onmessage event: ', event);

  if (event.data && event.data.type === 'INIT_PORT') {
    getVersionPort = event.ports[0];
  }

  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// click notification
self.addEventListener('notificationclick', function (event) {
  //console.warn('[ServiceWorker] notificationclick Very important having the last forward slash on "new URL("./", location)..."', event);
  const rootUrl = new URL('./', location).href;
  //console.warn('[ServiceWorker] rootUrl: ', rootUrl);
  event.notification.close();
  getVersionPort.postMessage({ payload: event.notification.data });
  //console.warn('[ServiceWorker] notificationclick posted message with payload: ', { payload: 'pois.pois' });
  event.waitUntil(
    // eslint-disable-next-line no-undef
    clients.matchAll().then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url.indexOf(rootUrl) >= 0) {
          return client.focus();
        }
      }
      // eslint-disable-next-line no-undef
      return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
    })
  );
});
// push listener

self.addEventListener('push', evt => {

  //console.warn('[ServiceWorker] Push evt: ', evt);

  var notification = evt.data.json();
  notification.icon = './assets/icons/apple-icon-192.png';
  notification.requireInteraction = true;
  var title = 'TRINL';
  //console.warn('[ServiceWorker] Push event: ', title, notification);
  if (notification && notification.title) {
    title = notification.title;
  }
  //console.warn('[ServiceWorker] Push event notification: ', title, notification);

  evt.waitUntil(
    self.registration.showNotification(title, notification)
  );
});

// fetch listener
self.addEventListener('fetch', evt => {

  //console.warn('[ServiceWorker] fetch: ', evt.request.url);

  if (fetchEnabled) {

    const CacheUpdateRefresh = true;

    if (evt.request.url.includes('/gebruikers')) {
      if (gebruikersDataEnabled) {
        console.warn('[ServiceWorker] fetch gebruikers fotos tracks: ', evt.request.method, evt.request.url);
        stale_while_revalidate(evt);
      } else {
        //console.warn('[ServiceWorker] fetch caching: gebruikersData disabled PASSTHRU: ', evt.request.url);
      }
    } else {
      if (evt.request.url.includes('backendTrinl')) {
        //console.warn('[ServiceWorker] fetch backendTrinl: ', evt.request.method, evt.request.url);

        if (evt.request.url.includes('/syncDown') || evt.request.url.includes('/save/') || evt.request.url.includes('/remove/') || evt.request.url.includes('/fotos/') || evt.request.url.includes('/pois/') || evt.request.url.includes('/tracks/')) {
          network_only(evt);
        } else {
          //console.warn('[ServiceWorker] fetch backendTrinl: ', evt.request.method, evt.request.url);
          if (evt.request.url.includes('/loadPois') || evt.request.url.includes('/loadFotos')) {
            //console.warn('[ServiceWorker] fetch backend loadPois/Fotos => cacheDatabaseBackend: ', evt.request.method, evt.request.url);
            //stale_while_revalidate(evt);
            //cacheDataBackend(evt);
            //network_first(evt);
            network_or_cache(evt);
          } else {
            if (evt.request.url.includes('/load/') || evt.request.url.includes('/loadAll/') || evt.request.url.includes('/loadMe/')) {
              //console.warn('[ServiceWorker] fetch backend load => cacheDatabaseBackend: ', evt.request.method, evt.request.url);
              //stale_while_revalidate(evt);
              //cacheDataBackendLoad(evt);
              //network_first(evt);
              network_or_cache(evt);
            } else {
              //console.warn('[ServiceWorker] fetch backendTrinl: ', evt.request.method, evt.request.url);
              if (evt.request.url.includes('/generateJwtToken/')) {
                //console.warn('[ServiceWorker] fetch backend load jwtToken=> cacheDatabaseBackend: ', evt.request.method, evt.request.url);
                stale_while_revalidate(evt);
                //cacheDataBackend(evt);
                //network_first(evt);
                //network_or_cache(evt);
              }
            }
          }
        }
      } else {
        if (evt.request.url.includes('manifest.json') || evt.request.url.includes('quitteapp.nl') || evt.request.url.includes('.maptiler.') || evt.request.url.includes('/maps/') || evt.request.url.includes('/2/files/') || evt.request.url.includes('/fotos/') || evt.request.url.includes('/pois/') || evt.request.url.includes('/tracks/') || evt.request.url.includes('dropboxapi') || evt.request.url.includes('tiles') || evt.request.url.includes('.tile.') || evt.request.url.includes('.openstreetmap.')) {
          //console.error('[ServiceWorker] fetch caching: TILES SKIPPED: ', evt.request.url);
          network_only(evt);
        } else {
          //console.log('[ServiceWorker] fetch => CACHE: REST: ', evt.request.url);
          cacheData(evt);
        }
      }
    }
  } else {
    //console.warn('[ServiceWorker] fetch caching: backend disabled PASSTHRU: ', evt.request.url);
  }
});

function cacheDataBackendLoad(evt) {

  //console.warn('[ServiceWorker] cacheDataBackendLoad from NETWORK with update in Cache, fallback CACHE');
  /*
  const options = {
    ignoreSearch: true
  };
  */
  evt.respondWith(

    caches.match(evt.request).then(cacheRes => {
      //if (cacheRes) {
        //console.warn('[ServiceWorker] cacheDataBackendLoad from CACHE: ', cacheRes);
        //return cacheRes;
      //}

      return fetch(evt.request).then(fetchRes => {
        //console.log('[ServiceWorker] cacheDataBackendLoad FROM BACKEND: ', fetchRes, evt.request.url);
        return caches.open(dataCacheName).then(cache => {
          //console.log('[ServiceWorker] cacheDataBackendLoad BACKEND CLONE into cache: ', dataCacheName, evt.request.url);
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dataCacheName, dataCacheSizeLimit);
          //console.log('[ServiceWorker] cacheDataBackendLoad FROM BACKEND: ', fetchRes);
          return fetchRes;
        });
      }).catch(function () {
        if (cacheRes) {
          //console.error('[ServiceWorker] cacheDataBackendLoad ERROR => fallback CACHE: ', cacheRes);
          return cacheRes;
        }
      });
    }).catch(() => {
      if (evt.request.url.includes('.html')) {
        return caches.match('/fallback.html');
      }
    })
  );
}

function cacheDataBackend(evt) {

  //console.warn('[ServiceWorker] cacheDataBackend from CACHE and refresh FROM NetWork');
  /*
  const options = {
    ignoreSearch: true
  };
  */
  evt.respondWith(

    caches.match(evt.request).then(cacheRes => {
      if (cacheRes) {
        //console.warn('[ServiceWorker] cacheDataBackend from CACHE: ', cacheRes);
        return cacheRes;
      }

      return cacheRes || fetch(evt.request).then(fetchRes => {
        //console.warn('[ServiceWorker] cacheDataBackend FROM BACKEND: ', fetchRes, evt.request.url);
        return caches.open(dataCacheName).then(cache => {
          //console.log('[ServiceWorker] cacheDataBackend BACKEND CLONE into cache: ', dataCacheName, evt.request.url);
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dataCacheName, dataCacheSizeLimit);
          //console.warn('[ServiceWorker] cacheDataBackend FROM BACKEND: ', fetchRes);
          return fetchRes;
        });
      }).catch(function () {
        if (cacheRes) {
          //console.warn('[ServiceWorker] cacheDataBackend ERROR => FROM CACHE: ', cacheRes);
          return cacheRes;
        }
      });
    }).catch(() => {
      if (evt.request.url.includes('.html')) {
        return caches.match('/fallback.html');
      }
    })
  );
}

function cacheData(evt) {

  //console.warn('[ServiceWorker] cacheData: ', evt.request.url, evt.request.mode);

  evt.respondWith(

    caches.match(evt.request).then(cacheRes => {
      if (cacheRes) {
        //console.warn('[ServiceWorker] cacheData from CACHE: ', cacheRes);
      } else {
        /*
        if (evt.request.mode === 'navigate') {
          //console.error('[ServiceWorker] cacheData Fetch NAVIGATE: ', evt.request.mode);
          return caches.match('./index.html');
        }
        */
      }
      return cacheRes || fetch(evt.request).then(fetchRes => {
        //console.warn('[ServiceWorker] cacheData fetched response: ', fetchRes);
        return caches.open(dataCacheName).then(cache => {
          //console.log('[ServiceWorker] cacheData CLONE naar CACHE: ', dataCacheName, evt.request.url);
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dataCacheName, dataCacheSizeLimit);
          //console.warn('[ServiceWorker] cacheData FROM BACKEND: ', fetchRes);
          return fetchRes;
        });
      });
    }).catch(() => {
      if (evt.request.url.includes('.html')) {
        return caches.match('/fallback.html');
      }
    })
  );
}


function cache_only(evt) {

  //console.warn('[ServiceWorker] cache_only: ', evt.request.url, evt.request.mode);

  event.respondWith(caches.match(event.request));
  /*
  Probably the simplest one.
  The SW expects to find the requested assets already here.
  This strategy can be used for the static resources that constitute our "app shell".
  Usually those are fetched while the SW is installing, in order to be available in the cache after this phase.
  */
};

function network_only(evt) {

  //console.warn('[ServiceWorker] network_only: ', evt.request.url, evt.request.mode);
  /*
  This strategy is exactly the opposite of the previous one: we always access the network, without even querying the cache.
  This is best suited for logs or anything we do not need to make it available offline.
  */
  evt.respondWith(fetch(evt.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
  }

function stale_while_revalidate(evt) {

  //console.warn('[ServiceWorker] stale_while_revalidate: ', evt.request.url, evt.request.mode);

  evt.respondWith(
    caches.open(dataCacheName).then(function (cache) {
      return cache.match(evt.request).then(function (response) {
        var fetchPromise = fetch(evt.request).then(function (networkResponse) {
          cache.put(evt.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
  /*
  Similarly to the cache only strategy, the goal is to ensure a fast responses by delivering the data from the cache.
  However, while the client request is served, a separate request is triggered to the server to fetch a newer version,
  if available, and store it into the cache. This way, while we guarantee fast data delivery on one side,
  we also update the cached data on the other, so next requests will receive a more actual version.
  */
};

function fromNetwork(request, timeout) {

  //console.warn('[ServiceWorker] fromNetwork: ', request.url, request.mode);

  return new Promise(function (resolve, reject) {

    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (fetchRes) {
      clearTimeout(timeoutId);
      //console.warn('[ServiceWorker] fromNetwork fetched response: ', fetchRes);
      caches.open(dataCacheName).then(cache => {
        //console.error('[ServiceWorker] fromNetwork CLONE naar CACHE: ', dataCacheName, request.url);
        cache.put(request.url, fetchRes.clone());
        limitCacheSize(dataCacheName, dataCacheSizeLimit);
        //console.warn('[ServiceWorker] fromNetwork FROM BACKEND: ', fetchRes);
        resolve(fetchRes);
      });
    }, reject);
  });
}

function fromCache(request) {

  //console.warn('[ServiceWorker] fromCache: ', request.url, request.mode);

  return caches.open(dataCacheName).then(function (cache) {
    return cache.match(request).then(function (cacheRes) {
      return cacheRes || Promise.reject('no-match');
    });
  });
}

function network_or_cache(evt) {

  //console.warn('[ServiceWorker] network_or_cache: ', evt.request.url, evt.request.mode);

  evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
    return fromCache(evt.request);
  }));
}

function network_first(evt) {

  //console.warn('[ServiceWorker] network_first: ', evt.request.url, evt.request.mode);

   evt.respondWith(
    fetch(evt.request).catch(function() {
      return caches.open(dataCacheName).then(function (cache) {
        return cache.match(evt.request)
      });
    })
  )
}
