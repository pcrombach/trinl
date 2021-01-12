/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactorySync', [
  'loDash',
  'BASE',
  '$rootScope',
  '$location',
  '$state',
  '$q',
  '$ionicPlatform',
  '$timeout',
  '$interval',
  'dataFactoryInstellingen',
  'dataFactoryCodePush',
  'dataFactoryBlacklist',
  'dataFactoryGroepen',
  'dataFactoryGroepdeelnemers',
  'dataFactoryHistorie',
  'dataFactoryHelp',
  'dataFactoryPersoon',
  'dataFactoryCeo',
  'dataFactoryConfig',
  'dataFactoryBerichtReactie',
  'dataFactoryBerichtReactieSup',
  'dataFactoryBericht',
  'dataFactoryBerichtSup',
  'dataFactoryBerichtTag',
  'dataFactoryPoiReactie',
  'dataFactoryPoiReactieSup',
  'dataFactoryPoi',
  'dataFactoryPoiTag',
  'dataFactoryPoiSup',
  'dataFactoryFotoReactie',
  'dataFactoryFotoReactieSup',
  'dataFactoryFoto',
  'dataFactoryFotoTag',
  'dataFactoryFotoSup',
  'dataFactoryTrackReactie',
  'dataFactoryTrackReactieSup',
  'dataFactoryTrack',
  'dataFactoryTrackTag',
  'dataFactoryTrackSup',
  'dataFactoryTag',
  'dataFactoryConfigKaart',
  'dataFactoryConfigLaag',
  'dataFactoryTrackPoisFotos',
  'dataFactorySyncFS',
  '$cordovaLocalNotifications',
  '$cordovaNetwork',
  function (loDash, BASE, $rootScope, $location, $state, $q, $ionicPlatform, $timeout, $interval, dataFactoryInstellingen, dataFactoryCodePush, dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryHistorie, dataFactoryHelp, dataFactoryPersoon, dataFactoryCeo, dataFactoryConfig, dataFactoryBerichtReactie, dataFactoryBerichtReactieSup, dataFactoryBericht, dataFactoryBerichtSup, dataFactoryBerichtTag, dataFactoryPoiReactie, dataFactoryPoiReactieSup, dataFactoryPoi, dataFactoryPoiTag, dataFactoryPoiSup, dataFactoryFotoReactie, dataFactoryFotoReactieSup, dataFactoryFoto, dataFactoryFotoTag, dataFactoryFotoSup, dataFactoryTrackReactie, dataFactoryTrackReactieSup, dataFactoryTrack, dataFactoryTrackTag, dataFactoryTrackSup, dataFactoryTag, dataFactoryConfigKaart, dataFactoryConfigLaag, dataFactoryTrackPoisFotos, dataFactorySyncFS, $cordovaLocalNotifications, $cordovaNetwork) {
    //console.warn('dataFactorySync');

    var dataFactorySync = {};

    dataFactorySync.enableSyncOnResume = true;

    dataFactorySync.alleNieuwe = 0;

    var urlBase = 'https://www.pcmatic.nl/trinl/';

    if ($location.$$host === '') {
      urlBase = BASE.URL;
    }
    if ($location.$$host === 'localhost') {
      urlBase = 'http://localhost/trinl/';
    }
    if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
      urlBase = 'https://www.trinl.nl/';
    }
    if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
      urlBase = 'https://www.pcmatic.nl/';
    }

    //console.error('dataFactoryyncS urlBase: ', urlBase);

    //console.log('Sync: ', urlBase);
    var trinlFileDir;
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.dataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.dataDirectory;
      }
    });

    var sound, soundFile;

    if (+localStorage.getItem('profielId') === 5) {
      soundFile = 'sound/push-notify.mp3';
    } else {
      soundFile = 'sound/data-notify.mp3';
    }
    sound = new Howl({
      src: [soundFile],
      volume: dataFactoryInstellingen.notifyVolume / 100
    });

    dataFactorySync.initStores = function () {
      //console.warn('dataFactorySync.initStores');
      dataFactoryTag.init();

      dataFactoryPersoon.init();

      dataFactoryBlacklist.init();
      dataFactoryGroepen.init();
      dataFactoryGroepdeelnemers.init();
      dataFactoryHistorie.init();
      dataFactoryHelp.init();

      dataFactoryBerichtSup.init();
      dataFactoryBerichtTag.init();
      dataFactoryBerichtReactieSup.init();
      dataFactoryBerichtReactie.init();
      dataFactoryBericht.init();

      dataFactoryPoiSup.init();
      dataFactoryPoiTag.init();
      dataFactoryPoiReactieSup.init();
      dataFactoryPoiReactie.init();
      dataFactoryPoi.init();

      dataFactoryTrackSup.init();
      dataFactoryTrackTag.init();
      dataFactoryTrackReactieSup.init();
      dataFactoryTrackReactie.init();
      dataFactoryTrack.init();

      dataFactoryFotoSup.init();
      dataFactoryFotoTag.init();
      dataFactoryFotoReactieSup.init();
      dataFactoryFotoReactie.init();
      dataFactoryFoto.init();
    };
    //
    //  Synchroniseer store met Backend
    //
    dataFactorySync.loadStore = function (store, Id) {
      //console.warn(store.storeId + ' loadStore Id: ', Id);
      var aantalInit = 0;
      var aantalSyncDown = 0;

      var q = $q.defer();
      //
      //  StoreInit
      //  Sync store from Backend with storeInit && Sync cache from Backend with syncDown
      //
      store.storeInit(Id).then(
        function (result) {
          //console.warn(store.storeId + ' loadStore storeInit: ', store.store, store.store.length);
          aantalInit = result;
          //
          //  Dit is van belang indien de cache nog niet is gesynchorniseerd from Backend (bv na installatie)
          //  Hierna moet in cache/sync en in store lastSyncdate geupdate zijn.
          //  Nogmaals syncdown moet dan niets opleveren
          //
          //console.log(store.storeId + ' loadStore storeInit: ', store.store, store.store.length);
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            dataFactorySyncFS.initLastSyncDateFS().then(
              function () {
                //console.log(store.storeId + ' loadStore initLastSyncDateFS: ', store.store, store.store.length);
                dataFactorySyncFS.syncStoreLastSyncDate(store).then(
                  function () {
                    //console.log(store.storeId + ' syncStoreLastSyncDate: ', store.store, store.store.length);
                    //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                    //console.log('+');
                    //console.log(store.storeId + ' loadStore lastSyncData => store: ', store.lastSyncDate);
                    //console.log('+');
                    //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                    store.syncDown(false).then(
                      function (aantal) {
                        aantalSyncDown = aantal;
                        //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        //console.log('+');
                        //console.log(store.storeId + ' loadStore storeInit && syncDown ready MOBIEL ....................: ', store.store, store.store.length);
                        //console.log('+');
                        //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        q.resolve(aantalSyncDown + aantalInit);
                      },
                      function (err) {
                        //console.error(store.storeId + ' loadStore syncDown ERROR: ', err);
                        q.reject(0);
                      }
                    );
                  },
                  function (err) {
                    //console.error(store.storeId + ' loadStore syncStoreLastSyncDate ERROR: ', err);
                    q.reject(0);
                  }
                );
              },
              function (err) {
                //console.error(store.storeId + ' loadStore initLastSyncDate ERROR: ', err);
                q.reject(aantalSyncDown + aantalInit);
              }
            );
          } else {
            //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            //console.log('+');
            //console.log(store.storeId + ' loadStore storeInit && syncDown ready DESKTOP ....................: ', store.store, store.store.length);
            //console.log('+');
            //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            q.resolve(aantalSyncDown + aantalInit);
          }
        },
        function (err) {
          //console.error(store.storeId + ' loadStore storeInit ERROR: ', err);
          q.reject(0);
        }
      );
      return q.promise;
    };
    //
    //  loadStoreFS
    //  Sync store from cache
    //
    dataFactorySync.loadStoreFS = function (store) {
      //console.warn(store.storeId + ' dataFactorySync loadStoreFS');

      //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      //console.log('+');
      //console.log(store.storeId + ' loadStoreFS start............................');
      //console.log('+');
      //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

      var q = $q.defer();

      dataFactorySyncFS.initFS().then(
        function () {
          dataFactorySyncFS.initStore(store).then(
            function (reden) {
              dataFactorySyncFS.initLastSyncDateFS().then(
                function () {
                  dataFactorySyncFS.syncStoreLastSyncDate(store).then(
                    function () {
                      //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                      //console.log('+');
                      //console.log(store.storeId + ' loadStoreFS LastSyncDate restored ....................');
                      //console.log('+');
                      //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                      //
                      //  Indien initStore meldt 'initieel store' dan was de FS-structuur nog niet geinitialiseerd, dus ook nog geen data
                      //  FS wordt dan gesynched mbv storeInit met backend
                      //
                      if (reden === 'initieel store') {
                        //console.log(store.storeId + ' dataFactorySync.loadStoreFS initFS: ', reden);
                        //
                        // Eerste keer dat cache-Map is aangemaakt
                        // Sync store met Backend with storeInit && Sync cache met Backend with syncDown
                        //
                        //store.storeInit().then(function (aantal) {
                        store.storeInit().then(function () {
                          dataFactorySyncFS.syncFS(store).then(
                            function (aantal) {
                              console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                              console.log('+');
                              console.log(store.storeId + ' loadStoreFS syncFS ready ....................', store.store, aantal);
                              console.log('+');
                              console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                              store.loaded = true;
                              q.resolve(aantal);
                            },
                            function (err) {
                              //console.error(store.storeId + ' loadStoreFS syncFS ERROR: ', err);
                              q.resolve(0);
                            }
                          );
                        });
                      } else {
                        //
                        //  Indien FS-structuur reeds aanweizg wordt store gesynced met de data van FS
                        //
                        //console.log(store.storeId + ' dataFactorySync.loadStoreFS isLoaded ==> sync store met FS: ', store.isLoaded());
                        //
                        //  Indien store nog geen data heeft wordt de store gesynced met FS
                        //  Dit wordt alleen gedaan als er geen internetverbinding is.
                        //
                        dataFactorySyncFS.syncFS(store).then(
                          function (aantal) {
                            //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                            //console.log('+');
                            //console.log(store.storeId + ' loadStoreFS syncFS ready ....................');
                            //console.log('+');
                            //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                            q.resolve(aantal);
                          },
                          function (err) {
                            //console.error(store.storeId + ' loadStoreFS syncFS ERROR: ', err);
                            q.reject(0);
                          }
                        );
                      }
                    },
                    function (err) {
                      //console.error(store.storeId + ' loadStoreFS syncStoreLastSyncDate ERROR: ', err);
                      q.reject();
                    }
                  );
                },
                function (err) {
                  //console.error(store.storeId + ' loadStoreFS initLastSyncDateFS ERROR: ', err);
                  q.reject();
                }
              );
            },
            function (err) {
              //console.error(store.storeId + ' loadStoreFS initStore ERROR: ', err);
              q.reject(0);
            }
          );
        },
        function (err) {
          //console.error(store.storeId + ' loadStoreFS initFS ERROR: ', err);
          q.reject();
        }
      );

      return q.promise;
    };
    //
    //  Indien mobiel loadStoreFS
    //  Desktop loadStore
    //
    dataFactorySync.updateStore = function (store) {
      //console.warn('dataFactorySync updateStore ' + store.storeId);

      var q = $q.defer();
      var isMobile = false;
      var isOnline = true;

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        isMobile = true;
        //if ($cordovaNetwork.isOnline()) {
        //isOnline = true;
        //}
        //} else {
        //isOnline = true;
      }

      if (isMobile && !isOnline) {
        //
        //  Indien mobiel en geen internetverbinding
        //  Sync store from FS
        //
        dataFactorySync.loadStoreFS(store).then(
          function (aantal) {
            //console.error('dataFactorySync updateStore ' + store.storeId + ' loadStoreFS Mobiel SUCCESS');
            q.resolve(aantal);
          },
          function (err) {
            //console.error('dataFactorySync updateStore loadStoreFS Mobiel ERROR ' + store.storeId, err);
            q.reject(0);
          }
        );
      } else {
        //
        // Indien desktop of mobiel met internetverbinding sync store from backend
        //console.log(store.storeId + ' dataFactorySync.updateStore storeInit START');
        // Desktop syncDown of initieel loadStore en syncDown
        //
        dataFactorySync.loadStore(store).then(
          function (aantal) {
            //console.log(store.storeId + ' dataFactorySync.updateStore loadStore SUCCESS aantal: ', aantal);
            //console.log(store.storeId + ' dataFactorySync.updateStore loadStore SUCCESS aantal in store: ', store.store.length);
            q.resolve(aantal);
          },
          function (err) {
            //console.error(store.storeId + ' dataFactorySync.updateStore loadStore ERROR: ', err);
            q.reject(0);
          }
        );
      }
      return q.promise;
    };

    dataFactorySync.syncUpAll = function () {
      //console.warn('dataFactorySync syncUpAll');

      var q = $q.defer();

      $q.all([dataFactoryTag.syncUp(), dataFactoryReactieSup.syncUp(), dataFactoryBerichtSup.syncUp(), dataFactoryReactie.syncUp(), dataFactoryPoiSup.syncUp(), dataFactoryFotoSup.syncUp(), dataFactoryTrackSup.syncUp(), dataFactoryPoiTag.syncUp(), dataFactoryFotoTag.syncUp(), dataFactoryTrackTag.syncUp(), dataFactoryPersoon.syncUp(), dataFactoryBericht.syncUp(), dataFactoryFoto.syncUp(), dataFactoryTrack.syncUp(), dataFactoryPoi.syncUp(), dataFactoryBlacklist.syncUp(), dataFactoryHistorie.syncUp()]).then(
        function () {
          //console.warn('afterSyncAllUp: Promises ', dataFactoryBericht, dataFactoryBerichtSup, dataFactoryReactie, dataFactoryReactieSup, dataFactoryPersoon, dataFactoryPoi, dataFactoryFotoTag, dataFactoryTag);
          //console.warn('afterSyncAllUp: Promis ', dataFactoryFoto.store, dataFactoryFotoSup.store);
          q.resolve();
        },
        function (err) {
          //console.error('dataFactorySync syncUpAll ERROR: ', err);
          q.reject();
        }
      );
      return q.promise;
    };

    dataFactorySync.syncDownAll = function () {
      //console.warn('dataFactorySync syncDownAll start');

      var q = $q.defer();

      $q.all([dataFactoryConfigKaart.syncDown(), dataFactoryConfigLaag.syncDown(), dataFactoryTag.syncDown(), dataFactoryReactieSup.syncDown(), dataFactoryBerichtSup.syncDown(), dataFactoryReactie.syncDown(), dataFactoryPoiSup.syncDown(), dataFactoryFotoSup.syncDown(), dataFactoryTrackSup.syncDown(), dataFactoryPoiTag.syncDown(), dataFactoryFotoTag.syncDown(), dataFactoryTrackTag.syncDown(), dataFactoryPersoon.syncDown(), dataFactoryBericht.syncDown(), dataFactoryFoto.syncDown(), dataFactoryTrack.syncDown(), dataFactoryPoi.syncDown(), dataFactoryBlacklist.syncDown(), dataFactoryHistorie.syncDown()]).then(
        function () {
          //
          //console.log('dataFactorySync afterSyncAllDown: Promises ', dataFactoryBericht, dataFactoryBerichtSup, dataFactoryReactie, dataFactoryReactieSup, dataFactoryPersoon, dataFactoryPoi, dataFactoryFotoTag, dataFactoryTag);
          //console.log('dataFactorySync afterSyncAllDown: Promises ', dataFactoryConfigKaart.data[8]);
          // Waarchijnlijk moet hier een event gestuurd worden dat alle stores ge-syncDown zijn.
          //
          q.resolve();
        },
        function (err) {
          //console.error('dataFactorySync afterSyncAllDown: Promises ERRORS: ', err);
          q.resolve();
        }
      );

      return q.promise;
    };

    dataFactorySync.sync = function () {
      //console.warn('dataFactorySync sync');

      dataFactoryConfigKaart.sync().then(
        function () {
          $rootScope.$emit('syncConfigKaart', {
            message: 'configkaart sync SUCCESS',
          });
          //console.log('app emit syncConfigKaart');
        },
        function () {
          $rootScope.$emit('syncConfigKaart', {
            message: 'configkaart sync ERROR',
          });
          //console.log('app emit syncConfigKaart ERROR');
        }
      );
      dataFactoryConfigLaag.sync().then(
        function () {
          $rootScope.$emit('syncConfigLaag', {
            message: 'configlaag sync SUCCESS',
          });
          //console.log('app emit syncConfigLaag');
        },
        function () {
          $rootScope.$emit('syncConfigLaag', {
            message: 'configlaag sync ERROR',
          });
          //console.log('app emit syncConfigLaag ERROR');
        }
      );
      dataFactoryPersoon.sync().then(
        function () {
          $rootScope.$emit('syncPersoon', {
            message: 'persoon sync SUCCESS',
          });
          //console.log('app emit syncPersoon');
        },
        function () {
          $rootScope.$emit('syncPersoon', {
            message: 'persoon sync ERROR',
          });
          //console.log('app emit syncGebruiker ERROR');
        }
      );
      dataFactoryPoi.sync().then(
        function () {
          dataFactoryPoi.enableSyncUp = true;
          $rootScope.$emit('syncPoi', {
            message: 'poi sync SUCCESS',
          });
          //console.log('app emit syncPoi');
        },
        function () {
          $rootScope.$emit('syncPoi', {
            message: 'poi sync ERROR',
          });
          //console.log('app emit syncPoi ERROR');
        }
      );
      dataFactoryPoiTag.sync().then(
        function () {
          dataFactoryPoiTag.enableSyncUp = true;
          $rootScope.$emit('syncPoiTag', {
            message: 'poitag sync SUCCESS',
          });
          //console.log('app emit syncPoiTag');
        },
        function () {
          $rootScope.$emit('syncPoiTag', {
            message: 'poitag sync ERROR',
          });
          //console.log('app emit syncPoiTag ERROR');
        }
      );

      dataFactoryBlacklist.sync().then(
        function () {
          dataFactoryBlacklist.enableSyncUp = true;
          $rootScope.$emit('syncBlacklist', {
            message: 'blacklist sync SUCCESS',
          });
          //console.log('app emit syncBlacklsit');
        },
        function () {
          $rootScope.$emit('syncBlacklist', {
            message: 'blacklist sync ERROR',
          });
          //console.log('app emit syncBlacklistgroep ERROR');
        }
      );

      dataFactoryHistorie.sync().then(
        function () {
          dataFactoryHistorie.enableSyncUp = true;
          $rootScope.$emit('syncHistorie', {
            message: 'historie sync SUCCESS',
          });
          //console.log('app emit syncHistorie');
        },
        function () {
          $rootScope.$emit('syncHistorie', {
            message: 'historie sync ERROR',
          });
          //console.log('app emit syncHistorie ERROR');
        }
      );

      dataFactoryFoto.sync().then(
        function () {
          dataFactoryFoto.enableSyncUp = true;
          $rootScope.$emit('syncFoto', {
            message: 'foto sync SUCCESS',
          });
          //console.log('app emit syncFoto');
        },
        function () {
          $rootScope.$emit('syncFoto', {
            message: 'Foto sync ERROR',
          });
          //console.log('app emit syncFoto ERROR');
        }
      );
      dataFactoryFotoTag.sync().then(
        function () {
          dataFactoryFotoTag.enableSyncUp = true;
          $rootScope.$emit('syncFotoTag', {
            message: 'fototag sync SUCCESS',
          });
          //console.log('app emit syncFotoTag');
        },
        function () {
          $rootScope.$emit('syncFotoTag', {
            message: 'FotoTag sync ERROR',
          });
          //console.log('app emit syncFotoTag ERROR');
        }
      );

      dataFactoryBerichtReactie.sync().then(
        function () {
          dataFactoryBerichtReactie.enableSyncUp = true;
          $rootScope.$emit('syncBerichtReactie', {
            message: 'berichtreactie sync SUCCESS',
          });
          //console.log('app emit syncBerichtReactie');
        },
        function () {
          $rootScope.$emit('syncBerichtReactie', {
            message: 'berichtreactie sync ERROR',
          });
          //console.log('app emit syncBerichtReactie ERROR');
        }
      );

      dataFactoryFotoReactie.sync().then(
        function () {
          dataFactoryPoiReactie.enableSyncUp = true;
          $rootScope.$emit('syncPoiReactie', {
            message: 'Poireactie sync SUCCESS',
          });
          //console.log('app emit syncPoiReactie');
        },
        function () {
          $rootScope.$emit('syncPoiReactie', {
            message: 'Poireactie sync ERROR',
          });
          //console.log('app emit syncPoiReactie ERROR');
        }
      );

      dataFactoryPoiReactie.sync().then(
        function () {
          dataFactoryPoiReactie.enableSyncUp = true;
          $rootScope.$emit('syncPoiReactie', {
            message: 'Poireactie sync SUCCESS',
          });
          //console.log('app emit syncPoiReactie');
        },
        function () {
          $rootScope.$emit('syncPoiReactie', {
            message: 'Poireactie sync ERROR',
          });
          //console.log('app emit syncPoiReactie ERROR');
        }
      );

      dataFactoryTrackReactie.sync().then(
        function () {
          dataFactoryTrackReactie.enableSyncUp = true;
          $rootScope.$emit('syncTRackReactie', {
            message: 'trackreactie sync SUCCESS',
          });
          //console.log('app emit syncTrackReactie');
        },
        function () {
          $rootScope.$emit('syncTrackReactie', {
            message: 'trackreactie sync ERROR',
          });
          //console.log('app emit syncTrackReactie ERROR');
        }
      );

      dataFactoryBerichtReactieSup.sync().then(
        function () {
          dataFactoryBerichtReactieSup.enableSyncUp = true;
          $rootScope.$emit('syncBerichtReactieSup', {
            message: 'berichtreactiesup sync SUCCESS',
          });
          //console.log('app emit syncBerichtReactieSup');
        },
        function () {
          $rootScope.$emit('syncBerichtReactieSup', {
            message: 'berichtreactiesup sync ERROR',
          });
          //console.log('app emit syncBerichtReactieSup ERROR');
        }
      );

      dataFactoryFotoReactieSup.sync().then(
        function () {
          dataFactoryFotoReactieSup.enableSyncUp = true;
          $rootScope.$emit('syncFotoReactieSup', {
            message: 'FotoReactiesup sync SUCCESS',
          });
          //console.log('app emit syncFotoReactieSup');
        },
        function () {
          $rootScope.$emit('syncFotoReactieSup', {
            message: 'FotoReactiesup sync ERROR',
          });
          //console.log('app emit syncFotoReactieSup ERROR');
        }
      );

      dataFactoryPoiReactieSup.sync().then(
        function () {
          dataFactoryPoiReactieSup.enableSyncUp = true;
          $rootScope.$emit('syncPoiReactieSup', {
            message: 'PoiReactiesup sync SUCCESS',
          });
          //console.log('app emit syncPoiReactieSup');
        },
        function () {
          $rootScope.$emit('syncPoiReactieSup', {
            message: 'PoiReactiesup sync ERROR',
          });
          //console.log('app emit syncPoiReactieSup ERROR');
        }
      );

      dataFactoryTrackReactieSup.sync().then(
        function () {
          dataFactoryTrackReactieSup.enableSyncUp = true;
          $rootScope.$emit('syncTrackReactieSup', {
            message: 'TrackReactiesup sync SUCCESS',
          });
          //console.log('app emit syncTrackReactieSup');
        },
        function () {
          $rootScope.$emit('syncTrackReactieSup', {
            message: 'TrackReactiesup sync ERROR',
          });
          //console.log('app emit syncTrackReactieSup ERROR');
        }
      );

      dataFactoryBericht.sync().then(
        function () {
          dataFactoryBericht.enableSyncUp = true;
          $rootScope.$emit('syncBericht', {
            message: 'bericht sync SUCCESS',
          });
          //console.log('app emit syncBericht');
        },
        function () {
          $rootScope.$emit('syncBericht', {
            message: 'bericht sync ERROR',
          });
          //console.log('app emit syncBericht ERROR');
        }
      );
      dataFactoryBerichtSup.sync().then(
        function () {
          dataFactoryBerichtSup.enableSyncUp = true;
          $rootScope.$emit('syncBerichtSup', {
            message: 'berichtsup sync SUCCESS',
          });
          //console.log('app emit syncBerichtSUp');
        },
        function () {
          $rootScope.$emit('syncBerichtSup', {
            message: 'berichtsup sync ERROR',
          });
          //console.log('app emit syncBerichtSup ERROR');
        }
      );

      dataFactoryTrack.sync().then(
        function () {
          dataFactoryTrack.enableSyncUp = true;
          $rootScope.$emit('syncTrack', {
            message: 'track sync SUCCESS',
          });
          //console.log('app emit syncTrack');
        },
        function () {
          $rootScope.$emit('syncTrack', {
            message: 'track sync ERROR',
          });
          //console.log('app emit syncTrack ERROR');
        }
      );
      dataFactoryTrackTag.sync().then(
        function () {
          dataFactoryTrackTag.enableSyncUp = true;
          $rootScope.$emit('syncTrackTag', {
            message: 'tracktag sync SUCCESS',
          });
          //console.log('app emit syncTrackTag');
        },
        function () {
          $rootScope.$emit('syncTrackTag', {
            message: 'tracktag sync ERROR',
          });
          //console.log('app emit syncTrackTag ERROR');
        }
      );

      dataFactoryTag.sync().then(
        function () {
          dataFactoryTag.enableSyncUp = true;
          $rootScope.$emit('syncTag', {
            message: 'tag sync SUCCESS',
          });
          //console.log('app emit syncTag');
        },
        function () {
          $rootScope.$emit('syncTag', {
            message: 'tag sync ERROR',
          });
          //console.log('app emit syncTag ERROR');
        }
      );
    };

    function localNotification(notifier) {
      console.log('dataFactorySync localNotification: ', notifier.store);

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          var text;
          if (notifier.store === 'berichtreactie') {
            text = 'Je hebt een nieuwe reactie ontvangen';
          }

          if (notifier.store === 'fotoreactie') {
            text = 'Je hebt een nieuwe reactie ontvangen';
          }

          if (notifier.store === 'poireactie') {
            text = 'Je hebt een nieuwe reactie ontvangen';
          }

          if (notifier.store === 'trackreactie') {
            text = 'Je hebt een nieuwe reactie ontvangen';
          }

          if (notifier.store === 'bericht') {
            text = 'Je hebt een nieuw bericht ontvangen';
          }

          if (notifier.store === 'poi' && notifier.xprive === '0') {
            text = 'Je hebt een nieuwe locatie ontvangen';
          }

          if (notifier.store === 'track' && notifier.xprive === '0') {
            text = 'Je hebt een nieuw spoor ontvangen';
          }

          if (notifier.store === 'foto' && notifier.xprive === '0') {
            text = 'Je hebt een nieuwe foto ontvangen';
          }

          var possible = '0123456789';

          var Id = possible.charAt(Math.floor(Math.random() * possible.length));
          for (var i = 0; i < 12; i++) {
            Id += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          console.error('Schedule Notification with ID: ', Id);

          if (ionic.Platform.isAndroid()) {
            $cordovaLocalNotifications
              .schedule({
                id: Id,
                data: notifier,
                title: 'TRINL heeft nieuws voor je!',
                text: text,
                led: '00ff00',
                sound: '/sound/push.mp3',
                icon: 'res://ic_notification.png',
                smallIcon: 'res://ic_notification_small.png',
                at: new Date(new Date().getTime() + 500)
              })
              .then(function () {
                //console.log('The notification has been set for Android');
              });
          }

          if (ionic.Platform.isIOS()) {
            $cordovaLocalNotifications
              .schedule({
                id: Id,
                data: notifier,
                title: 'TRINL heeft nieuws voor je!',
                text: text,
                sound: null,
                at: new Date(new Date().getTime() + 500)
              })
              .then(function () {
                //console.log('The notification has been set for IOS');
              });
          }
        }
      });
    }

    dataFactorySync.syncDownStore = function (msg) {
      var zend_params = JSON.parse(msg);

      //console.warn('dataFactorySync syncDownStore: ', zend_params.storeId);

      var hasNotified = false;

      var historieId, berichtId, reactieId, poiId, fotoId, trackId;
      var berichtSupModel, reactieSupModel, poiSupModel, fotoSupModel, trackSupModel;

      //var Id = zend_params.Id;
      var trinlMachineId = zend_params.trinlMachineId;
      //var gebruikerId = zend_params.gebruikerId;
      var store = zend_params.storeId;
      var operation = zend_params.operation;
      var xprive = zend_params.xprive;
      //var extra = zend_params.extra;
      var isCopy = zend_params.isCopy;

      //console.log(store + ' ZENDER trinlMachineId: ', trinlMachineId);
      //console.log(store + ' ZENDER store: ', store);
      //console.log(store + ' ZENDER operation: ', operation);
      //console.log(store + ' ZENDER Id: ', Id);
      //console.log(store + ' ZENDER gebruikerId: ', gebruikerId);
      //console.log(store + ' ZENDER xprive: ', xprive);
      //console.log(store + ' ZENDER extra: ', extra);
      //console.log(store + ' ZENDER isCopy: ', isCopy);

      switch (store) {
        case 'persoon':
          dataFactoryPersoon.syncDown().then(
            function () {
              $rootScope.$emit('syncDownPersoon', {
                Id: zend_params.Id,
                message: 'persoon syncdown SUCCESS',
              });
              //console.log('emit syncDownPersoon SUCCESS');
            },
            function () {
              $rootScope.$emit('syncDownPersoon', {
                Id: zend_params.Id,
                message: 'persoon syncdown ERROR',
              });
              //console.log('emit syncDownPersoon ERROR');
            }
          );
          break;

        case 'reactie':
          //console.log('dataFactorySync sync REACTIE');

          reactieId = zend_params.Id;

          //console.log('dataFactorySync sync REACTIE reactieId: ', operation, reactieId);

          $q.all([dataFactoryReactieSup.syncUp(), dataFactoryReactie.syncUp(), dataFactoryBericht.syncUp()]).then(function () {
            //console.log('dataFactorySync sync REACTIE syncUp SUCCESS');

            $q.all([dataFactoryReactieSup.syncDown(), dataFactoryReactie.syncDown(), dataFactoryBericht.syncDown()]).then(function () {
              //console.log('dataFactorySync sync REACTIE syncDown SUCCESS');

              var mijnGebruikerId = dataFactoryCeo.currentModel.get('Id');
              var mijnProfielId = +dataFactoryCeo.currentModel.get('profielId');
              if (mijnProfielId === 4 || mijnProfielId === 5 || zend_params.extra === mijnGebruikerId) {
                var berichtId;
                var berichtModel;
                var reactieModel;
                if (operation === 'POST') {
                  if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                      if (dataFactoryInstellingen.notifyVibrate) {
                        navigator.vibrate(300);
                      }
                      if (dataFactoryInstellingen.notifySound) {
                        //console.log('dataFactorySync sync Reactie mobile Sound');
                        navigator.play('data-notify');
                      }
                    } else {
                      if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                        //console.error('dataFactorySync sync REACTIE native Sound!!!!!!');
                        sound.play();
                      }
                    }

                    hasNotified = true;

                    var naam;

                    reactieModel = loDash.find(dataFactoryReactie.store, function (reactieModel) {
                      return reactieModel.get('Id') === reactieId;
                    });
                    if (reactieModel) {
                      berichtModel = loDash.find(dataFactoryBericht.store, function (berichtModel) {
                        return berichtModel.get('Id') === reactieModel.get('berichtId');
                      });
                      if (berichtModel) {
                        naam = berichtModel.get('naam');
                        berichtId = berichtModel.get('Id');
                      } else {
                        //console.error('dataFactorySync sync REACTIE berichtModel ERROR');
                      }
                    } else {
                      //console.error('dataFactorySync sync REACTIE reactieModel ERROR');
                    }
                    if (reactieModel) {
                      var notifier = {
                        store: store,
                        operation: operation,
                        Id: berichtId,
                        naam: naam,
                      };

                      localNotification(notifier);
                    } else {
                      //
                      //console.error('dataFactorySync sync REACTIE reactieModel of berichtModel NOT FOUND!!!!!!');
                    }
                  } else {
                    //console.log('dataFactorySync sync REACTIE hetzelfde apparaat');
                  }
                } else {
                  //console.log('dataFactorySync sync REACTIE geen POST operation: ', operation);
                }

                var data = {
                  reactieId: reactieId,
                  berichtModel: berichtModel,
                  berichtId: berichtId,
                  reactieModel: reactieModel,
                  hasNotified: hasNotified,
                };
                $rootScope.$emit('syncDownReactie', data);

                //console.log('emit sync REACTIE syncDownReactie: ', data);
              } else {
                //console.error('emit sync REACTIE syncDownReactie niet ONTVANGER');
              }
            });
          });

          break;

        case 'reactiesup':
          //console.warn('dataFactorySync sync REACTIESUP');

          $q.all([dataFactoryReactieSup.syncUp()]).then(function () {
            $q.all([dataFactoryReactieSup.syncDown()]).then(function () {
              //console.log('dataFactorySync sync REACTIESUP syncDown SUCCESS');

              reactieSupModel = loDash.find(dataFactoryReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('Id') === zend_params.Id;
              });
              if (reactieSupModel) {
                reactieId = reactieSupModel.get('reactieId');

                //console.log('dataFactoryReactieSup.data: ', dataFactoryReactieSup.data);

                $rootScope.$emit('syncDownReactieSup', {
                  Id: zend_params.Id,
                  reactieId: reactieId,
                  reactieSupModel: reactieSupModel,
                });
              }

              //console.log('dataFactorySync sync REACTIESUP SUCCESS');
            });
          });

          break;

        case 'bericht':
          //console.log('dataFactorySync sync BERICHT');

          berichtId = zend_params.Id;

          //console.log('dataFactorySync sync Bericht operation, berichtId: ', operation, berichtId);

          $q.all([dataFactoryTag.syncUp(), dataFactoryReactieSup.syncUp(), dataFactoryReactie.syncUp(), dataFactoryBerichtSup.syncUp(), dataFactoryBerichtTag.syncUp(), dataFactoryBericht.syncUp()]).then(function () {
            //console.log('dataFactorySync sync BERICHT syncUp SUCCESS');

            $q.all([dataFactoryTag.syncDown(), dataFactoryReactieSup.syncDown(), dataFactoryReactie.syncDown(), dataFactoryBerichtSup.syncDown(), dataFactoryBerichtTag.syncDown(), dataFactoryBericht.syncDown()]).then(function () {
              dataFactorySync.alleNieuwe += dataFactoryBericht.nieuw.length;

              //console.log('dataFactorySync sync BERICHT syncDown SUCCESS nieuwe: ', dataFactoryBericht.nieuw.length, dataFactorySync.alleNieuwe);
              //console.log('dataFactorySync sync BERICHT syncDown SUCCESS');

              var mijnProfielId = parseInt(dataFactoryCeo.currentModel.get('profielId'), 10);

              //console.log('dataFactorySync sync BERICHT mijnProfielId: ', mijnProfielId);

              if (mijnProfielId === 4 || mijnProfielId === 5) {
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  if (operation === 'POST' || operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      //console.error('dataFactorySync sync BERICHT MOBILE NOTIFICATION geluid en trillen');

                      if (dataFactoryInstellingen.notifyVibrate) {
                        navigator.vibrate(300);
                      }
                      if (dataFactoryInstellingen.notifySound) {
                        navigator.play('data-notify');

                        //console.log('dataFactorySync sync BERICHT mobile sound!!!!!!');
                      }
                      hasNotified = true;

                      var berichtModel = loDash.find(dataFactoryBericht.store, function (berichtModel) {
                        return berichtModel.get('Id') === berichtId;
                      });

                      if (berichtModel) {
                        //console.log('dataFactorySync sync BERICHT MOBILE NOTIFICATION LOCAL NOTIFICATION');

                        var naam = berichtModel.get('naam');

                        var notifier = {
                          store: store,
                          operation: operation,
                          Id: berichtId,
                          naam: naam,
                        };

                        localNotification(notifier);

                        //console.log('dataFactorySync sync BERICHT MOBILE NOTIFICATION LOCAL NOTIFICATION READY');
                      } else {
                        //console.error('dataFactorySync sync BERICHT berichtModel NOT FOUND!!!!!!');
                      }
                    } else {
                      //console.error('dataFactorySync sync BERICHT hetzelfde apparaat');
                    }
                  } else {
                    //console.log('dataFactorySync sync geen POST of PUT');
                  }
                } else {
                  if (operation === 'POST' || operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      //console.error('dataFactorySync sync BERICHT native sound!!!!!!');

                      sound.play();
                    }
                    hasNotified = true;
                  } else {
                    //console.log('dataFactorySync sync geen POST of PUT');
                  }
                }

                $rootScope.$emit('syncDownBericht', {
                  Id: berichtId,
                  berichtId: berichtId,
                  operation: operation,
                  hasNotified: hasNotified,
                });

                //console.log('emit sync BERICHT syncDownBericht');
              } else {
                //console.error('dataFactorySync sync BERICHT geen TEAMLID!!!!!!');
              }
            });
          });

          break;

        case 'berichttag':
          //console.log('dataFactorySync sync BERICHTTAG');

          var berichtTagId = zend_params.Id;

          var tagId;

          var berichtTagModel = loDash.find(dataFactoryBerichtTag.store, function (berichtTagModel) {
            return berichtTagModel.get('Id') === berichtTagId;
          });
          if (berichtTagModel) {
            berichtId = berichtTagModel.get('berichtId');
            tagId = berichtTagModel.get('tagId');
          }
          dataFactoryBerichtTag.syncDown().then(function () {
            $rootScope.$emit('syncDownBerichtTag', {
              Id: berichtTagId,
              berichtId: berichtId,
              tagId: tagId,
            });

            //console.log('dataFactorySync sync BERICHTTAG SUCCESS');
          });
          break;

        case 'berichtsup':
          //console.warn('dataFactorySync sync BERICHTSUP');

          $q.all([dataFactoryBerichtSup.syncUp()]).then(function () {
            $q.all([dataFactoryBerichtSup.syncDown()]).then(function () {
              berichtSupModel = loDash.find(dataFactoryBerichtSup.store, function (berichtSupModel) {
                return berichtSupModel.get('Id') === zend_params.Id;
              });
              if (berichtSupModel) {
                berichtId = berichtSupModel.get('berichtId');

                //console.log('dataFactoryBerichtSup.data: ', dataFactoryBerichtSup.data);
                $rootScope.$emit('syncDownBerichtSup', {
                  berichtId: zend_params.berichtId,
                  berichtSupModel: berichtSupModel,
                });
              } else {
                $rootScope.$emit('syncDownBerichtSup', {
                  berichtId: zend_params.extra,
                  berichtSupModel: berichtSupModel,
                });
                //console.log('dataFactorySync sync BERICHTSUP SUCCESS');
              }
            });
          });

          break;

        case 'blacklist':
          //console.log('dataFactorySync sync BLACKLIST');

          blacklistId = zend_params.Id;

          var blacklistbModel = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
            return blacklistModel.get('Id') === blacklistId;
          });
          dataFactoryBlacklist.syncDown().then(function () {
            $rootScope.$emit('syncDownBlacklist', {
              Id: blacklistId,
              blacklistModel: blacklistModel,
            });

            //console.log('dataFactorySync sync BLACKLIST SUCCESS');
          });
          break;

        case 'historie':
          //console.log('dataFactorySync sync HISTORIE');

          historieId = zend_params.Id;

          var historieModel = loDash.find(dataFactoryHistorie.store, function (historieModel) {
            return historieModel.get('Id') === historieId;
          });
          dataFactoryHistorie.syncDown().then(function () {
            $rootScope.$emit('syncDownHistorie', {
              Id: historiId,
              historieModel: historieModel,
            });

            //console.log('dataFactorySync sync HISTORIE SUCCESS');
          });
          break;

        case 'help':
          //console.log('dataFactorySync sync HELP');

          helpId = zend_params.Id;

          var helpModel = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('Id') === helpId;
          });
          dataFactoryHelp.syncDown().then(function () {
            $rootScope.$emit('syncDownHelp', {
              Id: helpId,
              helpModel: helpModel,
            });

            //console.log('dataFactorySync sync HELP SUCCESS');
          });
          break;

        case 'foto':
          //console.warn('dataFactorySync sync FOTO');

          fotoId = zend_params.Id;

          //console.log('dataFactorySync sync FOTO operation, fotoId: ', operation, fotoId);

          $q.all([dataFactoryTag.syncUp(), dataFactoryFotoSup.syncUp(), dataFactoryFotoTag.syncUp(), dataFactoryFoto.syncUp()]).then(function () {
            $q.all([dataFactoryTag.syncDown(), dataFactoryFotoSup.syncDown(), dataFactoryFotoTag.syncDown(), dataFactoryFoto.syncDown()]).then(function () {
              dataFactorySync.alleNieuwe += dataFactoryFoto.nieuw.length;

              //console.log('dataFactorySync sync FOTO syncDown SUCCESS nieuwe: ', dataFactoryFoto.nieuw.length, dataFactorySync.alleNieuwe);
              //console.log('dataFactorySync sync FOTO syncDown SUCCESS');

              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (xprive === '0') {
                  if (operation === 'POST' || operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      if (isCopy === '0') {
                        //console.error('dataFactorySync sync FOTO native sound!!!!!!');

                        if (dataFactoryInstellingen.notifyVibrate) {
                          navigator.vibrate(300);
                        }
                        if (dataFactoryInstellingen.notifySound) {
                          sound.play();
                        }

                        var fotoModel = loDash.find(dataFactoryFoto.store, function (fotoModel) {
                          return fotoModel.get('Id') === fotoId;
                        });
                        if (fotoModel) {
                          var naam = fotoModel.get('naam');

                          var notifier = {
                            store: store,
                            operation: operation,
                            Id: fotoId,
                            naam: naam,
                          };

                          localNotification(notifier);
                        } else {
                          //console.error('dataFactorySync sync FOTO fotoModel NOT FOUND!!!!!!');
                        }
                      }
                      hasNotified = true;
                    } else {
                      //console.error('dataFactorySync sync FOTO fotoModel van hetzelfde apparaat. GEEN SOUND');
                    }
                  } else {
                    //console.error('dataFactorySync sync FOTO niet POST of PUT');
                  }
                } else {
                  //console.error('dataFactorySync sync FOTO niet public');
                }
              } else {
                if (xprive === '0') {
                  if (operation === 'POST' || operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      //console.error('dataFactorySync sync FOTO native sound!!!!!!');

                      if (isCopy === '0') {
                        sound.play();
                      }
                    } else {
                      //console.error('dataFactorySync sync FOTO fotoModel van hetzelfde apparaat. GEEN SOUND');
                    }
                    hasNotified = true;
                  } else {
                    //console.error('dataFactorySync sync FOTO niet POST of PUT');
                  }
                } else {
                  //console.error('dataFactorySync sync FOTO niet public');
                }
              }

              $rootScope.$emit('syncDownFoto', {
                fotoId: fotoId,
                hasNotified: hasNotified,
              });
              //console.log('dataFactorySync sync FOTO SUCCESS');
            });
          });

          break;

        case 'fototag':
          $q.all([dataFactoryFotoTag.syncUp()]).then(function () {
            $q.all([dataFactoryFotoTag.syncDown()]).then(function () {
              var fotoTagId = zend_params.Id;

              var fotoTagModel = loDash.find(dataFactoryFotoTag.store, function (fotoTagModel) {
                return fotoTagModel.get('Id') === fotoTagId;
              });
              if (fotoTagModel) {
                fotoId = fotoTagModel.get('fotoId');
                tagId = fotoTagModel.get('tagId');
              }
              $rootScope.$emit('syncDownFotoTag', {
                Id: fotoTagId,
                fotoId: fotoId,
                tagId: tagId,
              });

              //console.log('emit sync FotoTag syncDown SUCCESS');
            });
          });

          break;

        case 'fotosup':
          //
          //console.clear();
          //console.warn('dataFactorySync sync FOTOSUP');
          $q.all([dataFactoryFotoSup.syncUp()]).then(function () {
            $q.all([dataFactoryFotoSup.syncDown()]).then(function () {
              fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotoSupModel) {
                return fotoSupModel.get('Id') === zend_params.Id;
              });
              if (fotoSupModel) {
                fotoId = fotoSupModel.get('fotoId');

                //console.log('dataFactoryFotoSup.data: ', dataFactoryFotoSup.data);
                $rootScope.$emit('syncDownFotoSup', {
                  fotoId: zend_params.fotoId,
                  fotoSupModel: fotoSupModel,
                });
              } else {
                $rootScope.$emit('syncDownFotoSup', {
                  fotoId: zend_params.extra,
                  fotoSupModel: fotoSupModel,
                });
                //console.log('dataFactorySync sync FOTOSUP SUCCESS');
              }
            });
          });

          break;

        case 'poi':
          //console.warn('dataFactorySync sync POI');

          poiId = zend_params.Id;
          xprive = zend_params.xprive;

          //console.log('dataFactorySync sync POI operation, poiId: ', operation, poiId, xprive);

          $q.all([dataFactoryTag.syncUp(), dataFactoryPoiSup.syncUp(), dataFactoryPoiTag.syncUp(), dataFactoryPoi.syncUp()]).then(function () {
            $q.all([dataFactoryTag.syncDown(), dataFactoryPoiSup.syncDown(), dataFactoryPoiTag.syncDown(), dataFactoryPoi.syncDown()]).then(function () {
              dataFactorySync.alleNieuwe += dataFactoryPoi.nieuw.length;

              //console.log('dataFactorySync sync POI syncDown SUCCESS nieuwe: ', dataFactoryPoi.nieuw.length, dataFactorySync.alleNieuwe);
              //console.log('dataFactorySync sync POI syncDown SUCCESS xprive, isCopy: ', xprive, isCopy);

              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (xprive === '0') {
                  if (operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      if (isCopy === '0') {
                        if (dataFactoryInstellingen.notifyVibrate) {
                          navigator.vibrate(300);
                        }
                        if (dataFactoryInstellingen.notifySound) {
                          sound.play();
                        }

                        //console.log('dataFactorySync sync sound and vibration made');
                      }
                      hasNotified = true;
                    }

                    var poiModel = loDash.find(dataFactoryPoi.store, function (poiModel) {
                      return poiModel.get('Id') === poiId;
                    });
                    if (poiModel) {
                      var naam = poiModel.get('naam');

                      var notifier = {
                        xprive: xprive,
                        store: store,
                        operation: operation,
                        Id: poiId,
                        naam: naam,
                      };

                      localNotification(notifier);
                    } else {
                      //console.error('dataFactorySync sync POI poiModel NOT FOUND!!!!!!');
                    }
                  }
                }
              } else {
                if (xprive === '0') {
                  if (operation === 'POST' || operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      if (isCopy === '0') {
                        //console.error('dataFactorySync sync POI native sound!!!!!!');
                        sound.play();
                      } else {
                        //console.error('dataFactorySync sync POI ISCOPY NOT native sound!!!!!!');
                      }
                    }
                    hasNotified = true;
                  }
                }
              }

              $rootScope.$emit('syncDownPoi', {
                poiId: poiId,
                hasNotified: hasNotified,
              });
              //console.log('dataFactorySync sync POI SUCCESS');
            });
          });

          break;

        case 'poitag':
          $q.all([dataFactoryPoiTag.syncUp()]).then(function () {
            $q.all([dataFactoryPoiTag.syncDown()]).then(function () {
              var poiTagId = zend_params.Id;

              var poiTagModel = loDash.find(dataFactoryPoiTag.store, function (poiTagModel) {
                return poiTagModel.get('Id') === poiTagId;
              });
              if (poiTagModel) {
                poiId = poiTagModel.get('poiId');
                tagId = poiTagModel.get('tagId');
              }

              $rootScope.$emit('syncDownPoiTag', {
                Id: poiTagId,
                poiId: poiId,
                tagId: tagId,
              });

              //console.log('dataFactorySync sync POITAG syncDown SUCCESS');
            });
          });

          break;

        case 'poisup':
          //
          //console.clear();
          //console.warn('dataFactorySync sync POISUP');
          $q.all([dataFactoryPoiSup.syncUp()]).then(function () {
            $q.all([dataFactoryPoiSup.syncDown()]).then(function () {
              poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSupModel) {
                return poiSupModel.get('Id') === zend_params.Id && poiSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });
              if (poiSupModel) {
                poiId = poiSupModel.get('poiId');

                //console.log('dataFactoryPoiSup.data: ', dataFactoryPoiSup.data);

                $rootScope.$emit('syncDownPoiSup', {
                  poiId: zend_params.poiId,
                  poiSupModel: poiSupModel,
                });
                //console.log('dataFactorySync sync POISUP SUCCESS');
              } else {
                $rootScope.$emit('syncDownPoiSup', {
                  poiId: zend_params.extra,
                  poiSupModel: poiSupModel,
                });
                //console.log('dataFactorySync sync POISUP SUCCESS');
              }
            });
          });

          break;

        case 'tag':
          tagId = zend_params.Id;

          //console.log('dataFactorySync sync TAG');

          dataFactoryTag.syncUp().then(function () {
            dataFactoryTag.syncDown().then(function () {
              $rootScope.$emit('syncDownTag', {
                Id: tagId,
                message: 'tag syncdown SUCCESS',
              });
              //console.log('dataFactorySync sync TAG SUCCESS');
            });
          });

          break;

        case 'track':
          //console.warn('dataFactorySync sync TRACK');

          trackId = zend_params.Id;

          //console.log('dataFactorySync sync TRACK operation, trackId: ', operation, trackId);

          $q.all([dataFactoryTag.syncUp(), dataFactoryTrackSup.syncUp(), dataFactoryTrackTag.syncUp(), dataFactoryTrack.syncUp()]).then(function () {
            $q.all([dataFactoryTag.syncDown(), dataFactoryTrackSup.syncDown(), dataFactoryTrackTag.syncDown(), dataFactoryTrack.syncDown()]).then(function () {
              dataFactorySync.alleNieuwe += dataFactoryTrack.nieuw.length;
              //console.log('dataFactorySync sync TRACK syncDown SUCCESS nieuwe: ', dataFactoryTrack.nieuw.length, dataFactorySync.alleNieuwe);
              //console.log('dataFactorySync sync TRACK syncDown SUCCESS');

              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (xprive === '0') {
                  if (operation === 'PUT') {
                    if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                      if (dataFactoryInstellingen.notifyVibrate) {
                        $ionicPlatform.ready(function () {
                          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                            navigator.vibrate(300);
                          }
                        });
                      }
                      if (dataFactoryInstellingen.notifySound) {
                        $ionicPlatform.ready(function () {
                          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                            sound.play();
                          }
                        });
                      }
                      hasNotified = true;
                    }

                    var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
                      return trackModel.get('Id') === trackId;
                    });
                    if (trackModel) {
                      var naam = trackModel.get('naam');

                      var notifier = {
                        store: store,
                        operation: operation,
                        Id: trackId,
                        naam: naam,
                      };

                      localNotification(notifier);
                    } else {
                      //console.error('dataFactorySync sync TRACK trackModel NOT FOUND!!!!!!');
                    }
                  }
                }
              } else {
                if (operation === 'POST' || operation === 'PUT') {
                  if (trinlMachineId !== localStorage.getItem('trinlMachineId')) {
                    //console.error('dataFactorySync sync TRACK native sound!!!!!!');
                    sound.play();
                  }
                  hasNotified = true;
                }
              }

              $rootScope.$emit('syncDownTrack', {
                trackId: trackId,
                hasNotified: hasNotified,
              });
              //console.log('dataFactorySync sync TRACK SUCCESS');
            });
          });

          break;

        case 'tracktag':
          $q.all([dataFactoryTrackTag.syncUp()]).then(function () {
            $q.all([dataFactoryTrackTag.syncDown()]).then(function () {
              var trackTagId = zend_params.Id;

              var trackTagModel = loDash.find(dataFactoryTrackTag.store, function (trackTagModel) {
                return trackTagModel.get('Id') === trackTagId;
              });
              if (trackTagModel) {
                trackId = trackTagModel.get('trackId');
                tagId = trackTagModel.get('tagId');
              }
              dataFactoryTrackTag.syncDown().then(
                function () {
                  $rootScope.$emit('syncDownTrackTag', {
                    Id: trackTagId,
                    trackId: trackId,
                    tagId: tagId,
                  });
                  //console.log('emit sync TrackTag SUCCESS');
                },
                function () {
                  $rootScope.$emit('syncDownTrackTag', {
                    Id: trackTagId,
                    trackId: trackId,
                    tagId: tagId,
                  });
                  //console.error('emit sync TrackTag ERROR');
                }
              );
              //console.log('dataFactorySync sync TRACKSUP SUCCESS');
            });
          });

          break;

        case 'tracksup':
          //
          //console.clear();
          //console.warn('dataFactorySync sync TRACKSUP');
          $q.all([dataFactoryTrackSup.syncUp()]).then(function () {
            $q.all([dataFactoryTrackSup.syncDown()]).then(function () {
              trackSupModel = loDash.find(dataFactoryTrackSup.store, function (trackSupModel) {
                return trackSupModel.get('Id') === zend_params.Id;
              });
              if (trackSupModel) {
                trackId = trackSupModel.get('trackId');

                //console.log('dataFactoryTrackSup.data: ', dataFactoryTrackSup.data);
                $rootScope.$emit('syncDownTrackSup', {
                  trackId: zend_params.trackId,
                  trackSupModel: trackSupModel,
                });
              } else {
                $rootScope.$emit('syncDownTrackSup', {
                  trackId: zend_params.extra,
                  trackSupModel: trackSupModel,
                });
                //console.log('dataFactorySync sync TRACKSUP SUCCESS');
              }
            });
          });

          break;
      }
    };

    $rootScope.$on('sync', function (event, args) {
      //console.warn('dataFactorySync RECIEVED event sync: ', args.data);
      if (args.data.substr(0, 1) === '{') {
        dataFactorySync.syncDownStore(args.data);
      }
    });

    document.addEventListener('resume', function () {
      $ionicPlatform.ready(function () {

        codePush.notifyApplicationReady();

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //cordova.plugins.notification.local.cancelAll('0');

          var interval = $interval(function () {
            //console.count('RUN waiting for config....');
            if (!angular.equals(dataFactoryConfig.currentModel, {})) {
              $interval.cancel(interval);
              //console.error('Rub xupdate: ', dataFactoryConfig.currentModel.get('xupdate'));
              if (dataFactoryConfig.currentModel.get('xupdate')) {
                dataFactoryCodePush.doUpdate();
              }
            }
          }, 100, 200);
        }
      });
    });
    
    return dataFactorySync;
  }
]);
