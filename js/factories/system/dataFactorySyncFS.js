/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactorySyncFS', ['loDash', 'BASE', '$location', '$q', '$ionicPlatform', '$cordovaFile', '$cordovaFileTransfer', 'dataFactoryHelper',
  function (loDash, BASE, $location, $q, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, dataFactoryHelper) {

    //console.warn('dataFactorySyncFS');

    var dataFactorySyncFS = {};

    dataFactorySyncFS.todo = 0;
    dataFactorySyncFS.done = 0;

    dataFactorySyncFS.watchSyncs = [];

    dataFactorySyncFS.ready = false;

    dataFactorySyncFS.initial = false;

    var container;

    dataFactorySyncFS.lastSyncDateItems = [];

    var urlBaseBackend = 'https://www.pcmatic.nl/Backends/backendTrinl/';

    if ($location.$$host === '') {
      urlBaseBackend = BASE.URL + 'Backends/backendTrinl/';
    }
    if ($location.$$host === 'localhost') {
      urlBaseBackend = 'http://localhost/trinl/Backends/backendTrinl/';
    }
    if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
      urlBaseBackend = 'https://www.trinl.nl/Backends/backendTrinl/';
    }
    if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
      urlBaseBackend = 'https://www.pcmatic.nl/Backends/backendTrinl/';
    }

    //console.log('dalogtaFactorySyncFS urlBaseBackend: ', urlBaseBackend);

    var trinlFileDir;
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }
    });

    dataFactorySyncFS.getFreeDiskSpace = function () {

      //console.warn('getFreeDiskSpace');

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid()) {
          $cordovaFile.getFreeDiskSpace().then(function (success) {
            if (success > 1024 * 1024) {
              //console.log('Run getFreeDiskSpace: ' + success / (1024 * 1024) + ' Gb');
            } else {
              if (success > 1024) {
                //console.log('Run getFreeDiskSpace: ' + success / 1024 + ' Mb');
              } else {
                //console.log('Run getFreeDiskSpace: ' + success + ' Kb');
              }
            }
            q.resolve(success);
          }, function (error) {
            //console.error('Run getFreeDiskSpace ERROR: ', error);
            q.reject(error);
          });
        }
      });

      return q.promise;
    };
    /*
    dataFactorySyncFS.getFreeDiskSpace().then(function(result) {
      //console.log('GetFreeDiskSpace SUCCESS: ', result);
    }).catch(function(err) {
      //console.log('GetFreeDiskSpace ERROR: ', err);
    });
    */
    /**
     * Promise altijd resolve
     * Indien nog niet bezocht dan wordt FS geinitialiseerd
     */
    dataFactorySyncFS.initFS = function () {

      //console.warn('initFS');

      var reden = '';

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log('initFS container: ', localStorage.getItem('authentication_id'));

          if (localStorage.getItem('authentication_id') !== null && localStorage.getItem('authentication_id') !== '') {

            if (!dataFactorySyncFS.ready) {

              container = localStorage.getItem('authentication_id');

              $cordovaFile.checkDir(trinlFileDir, container).then(function () {

                //console.warn('initFS container bestaat reeds: ', trinlFileDir + container);
                q.resolve('');
              }, function () {

                //console.log('==========================================================================');
                //console.log('Aanmaken container voor Id: ', container);
                //console.log('Aanmaken mappen voor fotos en tracks');
                //console.log('Aanmaken lastSyncDateFS (leeg)');
                //console.log('==========================================================================');

                $cordovaFile.createDir(trinlFileDir, container).then(function () {
                  //console.log('initFS container map aangemaakt: ', container);
                  dataFactorySyncFS.initial = true;

                  $q.all([
                    $cordovaFile.createDir(trinlFileDir, container + '/data', true),
                    $cordovaFile.createDir(trinlFileDir, container + '/sync', true),
                    $cordovaFile.createDir(trinlFileDir, container + '/tracks', true),
                    $cordovaFile.createDir(trinlFileDir, container + '/fotos', true),
                    $cordovaFile.createDir(trinlFileDir, container + '/fotos/kaart', true)
                  ]).then(function () {
                    reden = 'initieel FS';
                    dataFactorySyncFS.ready = true;
                    //console.log('initFS container aangemaakt SUCCESS');
                    // eslint-disable-next-line no-unused-vars
                    dataFactorySyncFS.initLastSyncDateFS().then(function (item) {
                      //console.error('initFS initLastSyncDateFS SUCCESS: ', item);
                      //console.log('initFS FS SUCCESS incl LastSyncDateFS gereed container: ', container);

                      q.resolve(reden);
                    }, function () {
                      //console.error('initFS FS SUCCESS ZONDER LastSyncDateFS gereed');
                      q.resolve('');
                    });
                  }, function () {
                    dataFactorySyncFS.ready = false;
                    q.resolve('');
                  });
                  // eslint-disable-next-line no-unused-vars
                }, function (err) {
                  //console.error('initFS createDir container ERROR: ', err);
                  q.resolve('container bestaat reeds');
                });
              });
            } else {
              //console.log('initFS container bestaat reeds');
              q.resolve('FS bestond reeds');
            }
          } else {
            //console.error('initFS geen authentication_id');
            q.resolve('geen authentication_id');
          }
        } else {
          //console.log('initFS NOT mobile');
          q.resolve('NOT mobile');
        }
      });

      return q.promise;
    };
    /**
     * Promise altijd resolve
     * Indien de FS structuur een store nog niet heeft aangemaakt eerst aanmaken.
     */
    dataFactorySyncFS.initStore = function (store) {

      var q = $q.defer();

      if (store.storeId !== '') {
        if (store.fsEnable) {

          //console.warn(store.storeId + ' dataFactorySyncFS.initStore');

          $ionicPlatform.ready(function () {
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              $cordovaFile.checkDir(trinlFileDir, container + '/data/' + store.storeId).then(function () {

                //console.warn(store.storeId + ' dataFactorySyncFS initStore store: data map aanwezig!!!', container + '/data/' + store.storeId);

                store.fsReady = true;
                q.resolve();

              }, function () {

                dataFactorySyncFS.initFS().then(function () {

                  $q.all([
                    $cordovaFile.createDir(trinlFileDir, container + '/data/' + store.storeId, true),
                    $cordovaFile.createDir(trinlFileDir, container + '/sync/' + store.storeId, true)
                  ]).then(function () {
                    /*
                    Indien de store nog niet in lastSyncDate tabel staat dan toevoegen met datum 000-00-00 00:00:00
                    */
                    //console.log(store.storeId + ' dataFactorySyncFS initStore: data en sync mappen gereed');

                    var found = loDash.find(dataFactorySyncFS.lastSyncDateItems, function (item) {
                      return item.store === store.storeId;
                    });
                    //
                    // Indien store nog niet in Object lastSyncDateItems dan aanmaken
                    //
                    if (!found) {
                      var lastSyncDateItem = {
                        'store': store.storeId,
                        'datum': '1970-01-02 00:00:00'
                      };
                      dataFactorySyncFS.lastSyncDateItems.push(lastSyncDateItem);
                      dataFactorySyncFS.writeFSLastSyncDate().then(function () {

                        //console.log(store.storeId + ' initStore lastSyncDateItem writeFS SUCCESS: ', dataFactorySyncFS.lastSyncDateItems);

                        // eslint-disable-next-line no-unused-vars
                      }, function (err) {

                        //console.error(store.storeId + ' initStore lastSyncDateItem writeFS ERROR: ', err);

                      });

                    }
                    store.fsReady = true;

                    //console.log(store.storeId + ' initStore data en sync mappen aangemaakt, fsReady SUCCESS');
                    //
                    // Store updaten met lastSyncDate in FS
                    //
                    dataFactorySyncFS.syncStoreLastSyncDate(store).then(function () {

                      //console.log(store.storeId + ' initStore syncStorelastSyncdate store update SUCCESS');

                      q.resolve('initieel store');
                      // eslint-disable-next-line no-unused-vars
                    }, function (err) {

                      //console.error(store.storeId + ' initStore syncStoreLastSyncdate ERROR: ', err);

                      q.resolve('initieel store');
                    });

                    // eslint-disable-next-line no-unused-vars
                  }, function (err) {

                    //console.error(store.storeId + ' initStore data en sync voor ' + store.storeId + ' NIET aangemaakt ERROR: ', err);

                    q.resolve();
                  });

                  // eslint-disable-next-line no-unused-vars
                }, function (err) {

                  //console.error(store.storeId + ' initStore ERROR NO FS mappen mogelijk: ',err);

                  q.resolve();
                });
              });
            }
          });

        } else {

          //console.log(store.storeId + ' initStore store not enabled for FS');

          q.reject('Store not enabled for FS');
        }
      } else {
        q.resolve();
      }
      return q.promise;
    };
    /**
     * Eenmalige taak om de tabel/objecten dataFactorySyncFS.lastSyncDateItems te vullen met de storeObjecten die in FS zijn opgeslagen
     * Bestaat de file met objecten dan is resultaat tabel/objecten dataFactorySyncFS.lastSyncDateItems.
     * Bestaat de file met objecten nog niet dan wordt de file aangemaakt met een lege tabel
     * Dit moet uitgevoerd worden bij iedere start
     */
    dataFactorySyncFS.initLastSyncDateFS = function () {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          if (dataFactorySyncFS.lastSyncDateItems.length === 0) {
            //console.warn('initLastSyncDateFS');
            dataFactorySyncFS.initFS().then(function () {
              $cordovaFile.checkFile(trinlFileDir, container + '/sync/lastSyncDate.txt').then(function () {
                //console.log('initLastSyncDateFS sync/lastSyncDate.txt GEVONDEN: ' + container + 'sync/lastSyncDate.txt');

                dataFactorySyncFS.readFSLastSyncDate().then(function (items) {
                  dataFactorySyncFS.lastSyncDateItems = items;
                  //console.log('initLastSyncDateFS writeFSLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
                  q.resolve(dataFactorySyncFS.lastSyncDateItems);
                  // eslint-disable-next-line no-unused-vars
                }, function (err) {
                  //console.error('initLastSyncDateFS dataFactorySyncFS.lastSyncDateItems lezen ERROR: ', err);
                  q.resolve();
                });
              }, function () {

                //console.log('initLastSyncDateFS sync/lastSyncDate.txt NIET GEVONDEN: ' + container + 'sync/lastSyncDate.txt');
                $cordovaFile.createFile(trinlFileDir, container + '/sync/lastSyncDate.txt', true).then(function () {
                  //console.log('initLastSyncDateFS sync/lastSyncDate.txt aangemaakt: ' + container + 'sync/lastSyncDate.txt');

                  dataFactorySyncFS.writeFSLastSyncDate().then(function () {
                    //console.log('initLastSyncDateFS object (leeg) geschreven in  SUCCESS: ', dataFactorySyncFS.lastSyncDateItems);
                    q.resolve(dataFactorySyncFS.lastSyncDateItems);
                    // eslint-disable-next-line no-unused-vars
                  }, function (err) {
                    //console.error('initLastSyncDateFS Write lastSyncDate.txt ERROR: ', err);
                    q.resolve();
                  });
                  // eslint-disable-next-line no-unused-vars
                }, function (err) {
                  //console.error('initLastSyncDateFS CreateFile lastSyncDate.txt ERROR: ', err);
                  q.resolve();
                });
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error('initLastSyncDateFS ERROR initFS: ', err);
              q.resolve();
            });
          } else {
            q.resolve();
          }
        } else {
          //console.log('initLastSyncDateFS ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    /*
     * Lees inhoud van bestand in Filesystem
     * Input:   Object: store
     *          String: name
     * Output:  Object: item (meta + record)
     */
    dataFactorySyncFS.readFSLastSyncDate = function () {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.warn('readFSLastSyncDate');
          var item = [];
          var name = container + '/sync/lastSyncDate.txt';
          $cordovaFile.readAsText(trinlFileDir, name).then(function (result) {
            //console.log('readFSLastSyncDate SUCCESS name, result:', name, result);
            if (result) {
              dataFactorySyncFS.lastSyncDateItems = JSON.parse(result);
            } else {
              dataFactorySyncFS.initLastSyncDateFS();
            }
            //console.log('readFSLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
            q.resolve(dataFactorySyncFS.lastSyncDateItems);
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('readFSlastSyncDate readAsText  ERROR: ', err);
            q.resolve(item);
          });
        } else {
          //console.log('readFSlastSyncDate ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    /*
     * Wijzig lastSyncDate in FS
     * Input: Object lastSyncDate
     * Output: Object lastSyncDate
     */
    dataFactorySyncFS.writeFSLastSyncDate = function () {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.warn('writeFSLastSyncDate');
          container = localStorage.getItem('authentication_id');
          var name = container + '/sync/lastSyncDate.txt';
          var result = JSON.stringify(dataFactorySyncFS.lastSyncDateItems);
          //console.warn('writeFSLastSyncDate  trinlFileDir, name, result: ', trinlFileDir, name, result);

          $cordovaFile.writeFile(trinlFileDir, name, result, true).then(function () {
            //console.log('writeFSLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
            q.resolve(dataFactorySyncFS.lastSyncDateItems);
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('writeFSLastSyncDate writeFile ERROR: ', err);
            q.resolve();
          });
        } else {
          //console.log('writeFSLastSyncDate ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    /*
     * Actualiseer lastSyncDate van een store met FS
     * Input:   Object changeLastSyncDate (inner)
     *          Object: store
     *
     */
    dataFactorySyncFS.syncStoreLastSyncDate = function (store) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.warn(store.storeId + ' syncStoreLastSyncDate start');

          var found = loDash.find(dataFactorySyncFS.lastSyncDateItems, function (item) {
            return item.store === store.storeId;
          });

          if (found) {
            store.lastSyncDate = found.datum;
            //console.log(store.storeId + ' syncStoreLastSyncDate naar store SUCCESS: ', store.lastSyncDate);
            //console.log(store.storeId + ' syncStoreLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
          } else {
            store.lastSyncDate = '1970-01-02 00:00:00';
            //console.log(store.storeId + ' syncStoreLastSyncDate naar store WARN, datum gereset: ', store.lastSyncDate);
            //console.log(store.storeId + ' syncStoreLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
          }
          q.resolve(store.lastSyncDate);
        } else {
          //console.log(store.storeId + ' syncStoreLastSyncDate ERROR not mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    /*
     * Wordt gebruikt in store.syncDown en store.initStore
     * Wijzig lastSyncDate van een store
     * Input: Object store
     *        String: lastSyncDate
     */
    dataFactorySyncFS.updateLastSyncDate = function (store, lastSyncDate) {

      if (lastSyncDate === false) {
        //lastSyncDate = '1970-01-02 00:00:00';
      }
      //console.log(store.storeId + ' updateLastSyncDate: ' + lastSyncDate);

      var found = loDash.find(dataFactorySyncFS.lastSyncDateItems, function (item) {
        return item.store === store.storeId;
      });
      if (found) {
        found.datum = lastSyncDate;
      } else {
        var lastSyncDateItem = {
          'store': store.storeId,
          'datum': lastSyncDate
        };
        dataFactorySyncFS.lastSyncDateItems.push(lastSyncDateItem);
      }
      dataFactorySyncFS.writeFSLastSyncDate().then(function () {
        //console.log(store.storeId + ' updateLastSyncDate SUCCESS lastSyncDateItems:', JSON.stringify(dataFactorySyncFS.lastSyncDateItems));
        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        //console.error(store.storeId + ' updateLastSyncDate ERROR: ', err);
      });

    };
    /*
     * Wordt gebruikt in store.syncUp
     * Verwijder sync (phantom)
     * Input: Object item (name)
     * Output: Object name
     */
    dataFactorySyncFS.cleanFS = function (store, name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log(store.storeId + ' cleanFS: ', name);
          if (store.storeId !== 'ceo' && store.storeId !== 'config') {
            dataFactorySyncFS.initStore(store).then(function () {
              dataFactorySyncFS.checkFSsync(store, name).then(function (sync) {
                if (sync.bool) {
                  dataFactorySyncFS.removeFSsync(store, name).then(function () {
                    //console.log(store.storeId + ' cleanFS SUCCESS: ', name);
                    q.resolve(name);
                  }, function (err) {
                    //console.error(store.storeId + ' cleanFS removeFSsync RROR: ', name, err);
                    q.resolve(err);
                  });
                } else {
                  //console.log(store.storeId + ' cleanFS ERROR geen FSSync');
                  q.resolve(name);
                }
                // eslint-disable-next-line no-unused-vars
              }, function (err) {
                //console.error(store.storeId + ' cleanFS checkFSSync ERROR: ',err);
                q.resolve();
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' cleanFS checkFSSync ERROR: ',err);
              q.resolve(store.storeId + ' cleanFS checkFSSync ERROR');
            });
          } else {
            //console.warn(store.storeId + ' cleanFS not for ceo OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' cleanFS ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;

    };
    /*
     * Check sync (phantom)
     * Input:  Object store
     *         String: name
     * Output: promise.resolve timestamp
     */
    dataFactorySyncFS.checkFSsync = function (store, name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.warn(store.storeId + ' checkFSsync: ', name);

          if (store.storeId !== 'ceo' && store.storeId !== 'config') {

            dataFactorySyncFS.initStore(store).then(function () {
              var map = container + '/sync/' + store.storeId + '/';

              $cordovaFile.readAsText(trinlFileDir, map + name).then(function (timestamp) {
                var sync = {
                  bool: true,
                  timestamp: timestamp
                };
                //console.log(store.storeId + ' checkFSsync BESTAAT: ' + name + ' ' + JSON.stringify(sync));
                q.resolve(sync);
                // eslint-disable-next-line no-unused-vars
              }, function (err) {
                //console.error(store.storeId + ' checkFSsync BESTAAT NIET: ' + name + ' ' + JSON.stringify(err));
                var sync = {
                  bool: false,
                  timestamp: '1970-01-02 00:00:00'
                };
                q.resolve(sync);
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' checkFSSync initStore ERROR: ',err);
              q.reject(store.storeId + ' checkFSSync initFS ERROR');
            });
          } else {
            //console.log(store.storeId + ' checkFSSync not for ceo OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' checkFSSync checkFSSync ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    /*
     * Lees inhoud van bestand in Filesystem
     * Input:   Object: store
     *          String: name (Id + '.txt')
     * Output:  Boolean:
     */
    dataFactorySyncFS.readFS = function (store, name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log(store.storeId + ' readFS: ', name);

          if (store.storeId !== 'ceo' && store.storeId !== 'config') {
            dataFactorySyncFS.initStore(store).then(function () {
              var map = container + '/data/' + store.storeId + '/';
              $cordovaFile.readAsText(trinlFileDir, map + name).then(function (record) {
                if (record !== '') {
                  //console.log(store.storeId + ' readFS SUCCESS: ' + trinlFileDir + map + name);
                  var model = dataFactoryHelper.StringToModel(store, record);
                  q.resolve(model);
                } else {
                  //console.error(store.storeId + ' readFS ERROR: ' + trinlFileDir + map + name);
                  q.reject('readFS record not found');
                }
              }, function (err) {
                //console.error(store.storeId + ' readFS readAsText ERROR: ' + trinlFileDir + map + name, JSON.stringify(err));
                q.resolve(err);
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' readFS initStore ERROR: ',err);
              q.resolve(store.storeId + ' readFS initStore ERROR');
            });
          } else {
            //console.log(store.storeId + ' readFS ERROR NOT for ceo OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' readFS ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    /*
     * Schrijf record in FS
     * Input: Object record
     * Output: Object record
     */
    dataFactorySyncFS.writeFS = function (store, model, replace) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          if (store.storeId !== 'ceo' && store.storeId !== 'config') {

            //console.log(store.storeId + ' writeFS: ', model.get('Id'), replace);

            dataFactorySyncFS.initStore(store).then(function () {
              var name = model.get('Id') + '.txt';
              var map = container + '/data/' + store.storeId + '/';

              var result = dataFactoryHelper.ModelToString(store, model);
              dataFactorySyncFS.checkFSsync(store, name).then(function (sync) {
                if ((sync.bool === true && (model.get('changedOn') > sync.timestamp)) || sync.bool === false) {
                  $cordovaFile.writeFile(trinlFileDir, map + name, result, replace).then(function () {
                    //console.log(store.storeId + ' writeFS SUCCESS: ', name);
                    q.resolve(model);
                    // eslint-disable-next-line no-unused-vars
                  }, function (err) {
                    //console.error(store.storeId + ' writeFS ERROR: ', err, map + name, result, replace);
                    q.resolve('writeFS ERROR');
                  });
                } else {
                  //console.warn(store.storeId + ' writeFS not newer ERROR: ', map + name, replace);
                  q.resolve('writeFS not newer ERROR');
                }
              }, function () {
                $cordovaFile.writeFile(trinlFileDir, map + name, result, replace).then(function () {
                  //console.log(store.storeId + ' writeFS SUCCESS not phantom: ', name);
                  q.resolve(model);
                  // eslint-disable-next-line no-unused-vars
                }, function (err) {
                  //console.error(store.storeId + ' writeFS ERROR not phantom: ', err, name, result, replace);
                  q.resolve(store.storeId + ' writeFS ERROR not phantom');
                });
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' initFS ERROR: ',err);
              q.resolve(store.storeId + ' initFS ERROR');
            });
          } else {
            /*//console.warn(store.storeId + ' writeFS ERROR ceo OR config'); */
            q.resolve(store.storeId + ' writeFS ERROR ceo OR config');
          }
        } else {
          //console.log(store.storeId + ' writeFS ERROR NOT mobile device');
          q.resolve(store.storeId + ' writeFS NOT mobile device');
        }
      });

      return q.promise;
    };
    /*
     * Schrijf item in FS
     * Input: Object item (meta)
     * Output: String name
     */

    dataFactorySyncFS.writeFSsync = function (store, model, replace) {
      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          if (store.storeId !== 'ceo' && store.storeId !== 'config') {

            //console.log(store.storeId + ' writeFSsync: ', model.get('Id'), replace);

            dataFactorySyncFS.initStore(store).then(function () {
              var name = model.get('Id') + '.txt';
              var map = container + '/sync/' + store.storeId + '/';
              var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

              $cordovaFile.writeFile(trinlFileDir, map + name, timestamp, replace).then(function () {
                //console.log(store.storeId + ' writeFSsync SUCCESS: ' + name);
                q.resolve(name);
                // eslint-disable-next-line no-unused-vars
              }, function (err) {
                //console.error(store.storeId + ' writeFSsync writeFile ERROR: ', map + name, err);
                q.resolve();
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' writeFSSync initStore ERROR: ',err);
            });
          } else {
            //console.log(store.storeId + ' writeFSsync NIET voor ceo en config');
            q.resolve(store.storeId + ' writeFS NIET voor ceo en config');
          }
        } else {
          //console.log(store.storeId + ' initFS writeFSsync ERROR NOT mobile');
          q.resolve('NIET voor mobiel device');
        }
      });

      return q.promise;
    };

    /*
     * Schrijf item in FS
     * Input: Object item (meta + record)
     * Output: Object item
     */
    dataFactorySyncFS.removeFS = function (store, model, phantom) {

      var q = $q.defer();

      if (model) {

        $ionicPlatform.ready(function () {
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

            //console.log(store.storeId + ' removeFS: ', store, model);

            if (store.storeId !== 'ceo' && store.storeId !== 'config') {
              var map = container + '/data/' + store.storeId + '/';
              var name = model.get('Id') + '.txt';

              $cordovaFile.removeFile(trinlFileDir, map + name).then(function () {
                if (phantom) {
                  dataFactorySyncFS.removeFSsync(store, name);
                }
                //console.log(store.storeId + ' removeFS SUCCESS: ' + name);
                q.resolve(model);
              }, function (err) {
                //console.error(store.storeId + ' removeFS ERROR: ', name, err);
                q.resolve(err);
              });
            } else {
              //console.log(store.storeId + ' removeFS ERROR not for ceo OR config');
              q.resolve();
            }
          } else {
            //console.log(store.storeId + ' removeFS ERROR NOT mobile');
            q.resolve();
          }
        });
      } else {
        //console.log(store.storeId + ' removeFS ERROR NO model');
        q.resolve();
      }
      return q.promise;
    };
    /*
     * Schrijf item in FSSync
     * Input: Object item (meta)
     * Output: Object item
     */
    dataFactorySyncFS.removeFSsync = function (store, name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log(store.storeId + ' removeFSsync');

          if (store.storeId !== 'ceo' && store.storeId !== 'config') {
            var map = container + '/sync/' + store.storeId + '/';

            dataFactorySyncFS.checkFSsync(store, name).then(function (sync) {
              if (sync.bool) {
                $cordovaFile.removeFile(trinlFileDir, map + name).then(function () {
                  //console.log(store.storeId + ' removeFSsync SUCCESS: ' + name);
                  q.resolve(name);
                }, function (err) {
                  //console.error(store.storeId + ' removeFSsync ERROR: ', name, err);
                  q.resolve(err);
                });
              } else {
                //console.warn(store.storeId + ' removeFSsync ERROR checkFSSync');
                q.resolve(name);
              }
            }, function () {
              //console.error(store.storeId + ' removeFSsync ERROR checkFSSync');
              q.resolve();
            });
          } else {
            //console.log(store.storeId + ' removeFSsync ERROR NOT for cep OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' removeFSsync ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.syncFSPrepare = function (store) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          if (store.storeId !== 'ceo' && store.storeId !== 'config') {

            dataFactorySyncFS.initStore(store).then(function () {
              //console.warn(store.storeId + ' syncFSPrepare');

              $cordovaFile.listDir(trinlFileDir, container + '/data/' + store.storeId + '/').then(function (entries) {
                //console.log('=================================================================================');
                //console.log(store.storeId + ' syncFSPrepare Aantal entries in FS: ' + entries.length);
                //console.log('=================================================================================');
                var todo = {
                  storeId: store.storeId,
                  aantal: entries.length
                };
                dataFactorySyncFS.todo.push(todo);
                q.resolve();
                // eslint-disable-next-line no-unused-vars
              }, function (err) {
                //console.error('=================================================================================');
                //console.error(store.storeId + ' syncFSPrepare ListDir ERROR: ', err);
                //console.error('=================================================================================');
                q.resolve();
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' syncFSPrepare initStore ERROR: ', err);
              q.resolve();
            });
          } else {
            //console.log(store.storeId + ' syncFSPrepare NOT for ceo OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' syncFSPrepare NOT for mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    function watchSyncFS(store) {
      var found = loDash.find(dataFactorySyncFS.watchSyncs, function (watch) {
        return watch.store === store;
      });
      //console.log(store.storeId + ' syncFS watchSyncFS: ', found.todo, found.done);
      found.done = found.done + 1;
      if (found.done === found.todo) {

        //console.log('==================================================================');
        //console.log(store.storeId + ' syncFS watchSyncFS FINISHED: ', found.todo, found.done);
        //console.log('==================================================================');

        return true;

      } else {
        return false;
      }
    }
    /*
     * Vul store met modellen gemaakt van alle records in cache
     * Input:  Object store
     *         Function dataFactorySyncFS.readFS (lees FileSystem bestand)
     * Output: Object store (data copied into store)
     */
    dataFactorySyncFS.syncFS = function (store) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          if (store.storeId !== 'ceo' && store.storeId !== 'config') {

            //console.warn(store.storeId + ' syncFS');

            dataFactorySyncFS.initStore(store).then(function () {

              $cordovaFile.listDir(trinlFileDir, container + '/data/' + store.storeId + '/').then(function (entries) {
                if (entries.length > 0) {

                  var watchSync = loDash.find(dataFactorySyncFS.watchSyncs, function (watch) {
                    return watch.store === store;
                  });

                  watchSync = {
                    store: store,
                    todo: entries.length,
                    done: 0
                  };
                  dataFactorySyncFS.watchSyncs.push(watchSync);

                  //console.warn('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                  //console.warn('+');
                  //console.warn('+ ' + store.storeId + ' syncFS TODO (' + entries.length + ')');
                  //console.warn('+');
                  //console.warn('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

                  loDash.each(entries, function (entry) {
                    //entry.getMetadata(win, null);

                    //console.log(store.storeId + ' syncFS ' + ' each entry: ', entry.name);
                    if (entry) {
                      (function (store, entry) {

                        //console.log(store.storeId + ' syncFS closure entry: ', entry.name);

                        var name = entry.name;

                        dataFactorySyncFS.readFS(store, name).then(function (model) {

                          //console.log(store.storeId + ' syncFS ' + ' readFS model SUCCESS: ', model);

                          dataFactorySyncFS.checkFSsync(store, name).then(function (sync) {
                            if (sync.bool) {
                              store.save(model).then(function () {
                                //console.log(store.storeId + ' syncFS SAVE SUCCESS: ', model);
                                if (watchSyncFS(store)) {
                                  q.resolve();
                                }
                              }, function () {
                                //console.error(store.storeId + ' syncFS ERROR');
                                if (watchSyncFS(store)) {
                                  q.resolve();
                                }
                              });
                            } else {

                              store.addData(model).then(function () {
                                //console.log(store.storeId + ' syncFS addData SUCCESS store: ', store.store);
                                if (watchSyncFS(store)) {
                                  q.resolve();
                                }
                              }, function () {
                                //console.error(store.storeId + ' syncFS addData ERROR');
                                if (watchSyncFS(store)) {
                                  q.resolve();
                                }
                              });
                            }
                            // eslint-disable-next-line no-unused-vars
                          }, function (err) {
                            //console.error(store.storeId + ' syncFS checkFSSync ERROR: ', err);
                            if (watchSyncFS(store)) {
                              q.resolve();
                            }
                          });
                          // eslint-disable-next-line no-unused-vars
                        }, function (err) {
                          //console.error(store.storeId + ' syncFS readFS ERROR: ', err);
                          if (watchSyncFS(store)) {
                            q.resolve();
                          }
                        });
                      })(store, entry);
                    } else {
                      if (watchSyncFS(store)) {
                        q.resolve();
                      }
                    }
                  });
                  store.loaded = true;
                } else {
                  //console.log(store.storeId + ' syncFS empty store');
                  q.resolve('empty');
                }
              }, function (err) {
                //console.error(store.storeId + ' syncFS data/ directory not found in FS ERROR: ', err, container + '/data/' + store.storeId + '/');
                q.resolve(err);
              });
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error(store.storeId + ' syncFS ERROR initStore: ', err);
              q.resolve();
            });
          } else {
            //console.log(store.storeId + ' syncFS ERROR NOT for ceo OR config');
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' syncFS ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.writeFSCeo = function (store, model, replace) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log(store.storeId + ' dataFactorySyncFS.writeFSCeo');

          var result = dataFactoryHelper.ModelToString(store, model);
          if (result.indexOf('}{')) {
            result = result.substr(result.indexOf('}{') + 1);
          }

          $cordovaFile.writeFile(trinlFileDir, 'ceo.txt', result, replace).then(function () {
            //console.log(store.storeId + ' dataFactorySyncFS.writeFSCeo SUCCESS');
            q.resolve();
          }, function (err) {
            //console.error(store.storeId + ' dataFactorySyncFS.writeFSCeo ERROR: ', err, model);
            q.resolve(err);
          });
        } else {
          //console.log(store.storeId + ' dataFactorySyncFS.writeFSCeo ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.readFSCeo = function (store) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log(store.storeId + ' dataFactorySyncFS.readFSCeo');
          $cordovaFile.readAsText(trinlFileDir, 'ceo.txt').then(function (ceoStr) {

            if (ceoStr.indexOf('}{')) {
              ceoStr = ceoStr.substr(ceoStr.indexOf('}{') + 1);
            }

            var model = dataFactoryHelper.StringToModel(store, ceoStr);

            //console.log(store.storeId + ' dataFactorySyncFS.readFSCeo SUCCESS');
            q.resolve(model);
          }, function (err) {
            //console.error(store.storeId + ' dataFactorySyncFS.readFSCeo ERROR: ' + trinlFileDir + 'ceo.txt', JSON.stringify(err));
            q.reject(err);
          });
        } else {
          //console.log(store.storeId + ' dataFactorySyncFS.readFSCeo ERROR NOT mobile');
          q.reject();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.removeFSCeo = function () {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactorySyncFS.removeFSCeo');
          $cordovaFile.removeFile(trinlFileDir, 'ceo.txt').then(function () {
            //console.log('dataFactorySyncFS.removeFSCeo SUCCESS');
            q.resolve();
          }, function (err) {
            //console.error('dataFactorySyncFS.removeFSCeo ERROR: ', err);
            q.resolve(err);
          });
        } else {
          //console.log('dataFactorySyncFS.removeFSCeo ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.writeFSConfig = function (store, model, replace) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log(store.storeId + ' dataFactorySyncFS.writeFSConfig');

          var result = dataFactoryHelper.ModelToString(store, model);

          result = result.replace(/\\"/g, '');

          if (result.indexOf('}{')) {
            result = result.substr(result.indexOf('}{') + 1);
          }

          if (result !== '{}') {

            $cordovaFile.writeFile(trinlFileDir, 'config.txt', result, replace).then(function () {
              //console.log(store.storeId + ' dataFactorySyncFS.writeFSConfig SUCCESS');
              q.resolve();
            }, function (err) {
              //console.error(store.storeId + ' dataFactorySyncFS.writeFSConfig ERROR: ', err);
              q.resolve(err);
            });
          } else {
            //console.error(store.storeId + ' dataFactorySyncFS.writeFSConfig ERROR NO object', result);
            q.resolve();
          }
        } else {
          //console.log(store.storeId + ' dataFactorySyncFS.writeFSConfig ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.readFSConfig = function (store) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.warn(store.storeId + ' dataFactorySyncFS.readFSConfig');

          $cordovaFile.readAsText(trinlFileDir, 'config.txt').then(function (configStr) {

            //console.log(store.storeId + ' dataFactorySyncFS.readFSConfig SUCCESS: ', configStr);

            if (configStr.indexOf('}{')) {
              configStr = configStr.substr(configStr.indexOf('}{') + 1);
            }

            configStr = configStr.replace(/"{/g, '{');
            configStr = configStr.replace(/\}"/g, '}');

            //console.warn(store.storeId + ' dataFactorySyncFS.readFSConfig SUCCESS: ', configStr);

            var model = dataFactoryHelper.StringToModel(store, configStr);
            //console.log(store.storeId + ' dataFactorySyncFS.readFSConfig model: ', model);

            if (configStr.indexOf('configOfflineBestanden') !== -1) {
              //console.log(store.storeId + ' dataFactorySyncFS.readFSConfig bevat oude properties ERROR');
              q.resolve(model);
            } else {

              //console.log(store.storeId + ' dataFactorySyncFS.readFSConfig SUCCESS: ', model);

              q.resolve(model);
            }
          }, function (err) {
            //console.error(store.storeId + ' dataFactorySyncFS.readFSConfig ERROR: ' + trinlFileDir + 'config.txt', JSON.stringify(err));
            q.resolve(err);
          });
        } else {
          //console.log(store.storeId + ' dataFactorySyncFS.readFSConfig ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.removeFSConfig = function () {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactorySyncFS.removeFSConfig');
          $cordovaFile.removeFile(trinlFileDir, 'config.txt').then(function () {
            //console.log('dataFactorySyncFS.removeFSConfig SUCCESS');
            q.resolve();
          }, function (err) {
            //console.error('dataFactorySyncFS.removeFSConfig ERROR: ', err);
            q.resolve(err);
          });
        } else {
          //console.log('dataFactorySyncFS.removeFSConfig ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    /**
     * Indien een anonieme gebruiker inlogt of een geregistreerde gebruiker wordt
     * de dataContainer in het FS van de anonieme gebruiker verwijderd.
     * Geregistreerde gebruikers worden nooit gewist.
     * Indien tussen tussen geregistreerde gebruikes wordt geswitched wordt ook de dataContainer geswitched
     */
    dataFactorySyncFS.removeFSId = function (Id) {

      var q = $q.defer();


      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactorySyncFS.removeFSId');
          $cordovaFile.removeRecursively(trinlFileDir, Id).then(function () {
            q.resolve();
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('dataFactorySyncFS.removeFSId removeRecursively ERROR: ', err);
            q.resolve();
          });
        } else {
          //console.log('dataFactorySyncFS.removeFSId ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };
    dataFactorySyncFS.writeFSVersion = function (version) {

      var q = $q.defer();

      $cordovaFile.writeFile(trinlFileDir, 'version.txt', version, true).then(function () {
        //console.log('SyncFS writeFSVersion SUCCESS version: ', version);
        q.resolve();
      }, function (err) {
        //console.error('SyncFS.writeFSVersion ERROR: ', err);
        q.resolve(err);
      });

      return q.promise;
    };

    dataFactorySyncFS.readFSVersion = function () {

      var q = $q.defer();

      $cordovaFile.readAsText(trinlFileDir, 'version.txt').then(function (version) {
        if (version === null || version === 'null') {
          version = '0';
        }
        //console.log('SyncFS readFSVersion SUCCESS version: ', version);
        q.resolve(version);

        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        //console.error('SyncFS readFSVersion ERROR: ', err);
        q.resolve('0');
      });

      return q.promise;
    };
    /**
     * [removeFSId description]
     * @param  {[type]} Id [description]
     * @return {[type]}    [description]
     */
    dataFactorySyncFS.removeCache = function (newVersion) {

      //console.warn('SyncFS removeCache: ', newVersion);

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //
          // Eerst kijken of dit een andere (oude) client version is
          //
          //console.log('SyncFS removeCache get oldVersion');
          dataFactorySyncFS.readFSVersion().then(function (oldVersion) {
            //console.log('SyncFS removeCache oldversion found: ', oldVersion);
            //
            // Plaats nieuwe version in cache
            //
            dataFactorySyncFS.writeFSVersion(newVersion);

            if (oldVersion !== newVersion) {
              // list dir
              // alle mappen met een lange naam verwijderen
              //
              $cordovaFile.listDir(trinlFileDir, '').then(function (entries) {
                //console.log('=================================================================================');
                //console.log('syncFS removeCache Aantal entries in FS: ' + entries.length);
                //console.log('=================================================================================');
                loDash.each(entries, function (entry) {

                  //console.warn('SyncFS removeCache entry: ', entry.name );

                  if (entry.name.length > 23) {
                    (function (entry) {
                      dataFactorySyncFS.removeFSId(entry.name);
                    })(entry);
                  }
                  /*
                                                      $cordovaFile.removeRecursively(trinlFileDir, entry.name).then( function() {
                  //console.error('SyncFS removeCache remove gebruiker id: ', entry.name );
                                                      }, function(err) {
                  //console.error('SyncFS removeCache remove gebruiker ERROR: ', id, err);
                                                      });
                  */
                });

                q.resolve();
                //
                // Huidige version in cache plaatsten
                //
                // eslint-disable-next-line no-unused-vars
              }, function (err) {
                //console.error('=================================================================================');
                //console.error('syncFS removeCache ListDir ERROR: ', err);
                //console.error('=================================================================================');
                q.resolve();
              });

            } else {
              q.resolve();
            }
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('syncFS removeCache ReadFSVersion ERROR: ', err);
          });
        } else {
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.writeFSTrack = function (name, geoData, replace) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log('dataFactorySyncFS.writeFSTrack: ', name, replace);
          //console.log('dataFactorySyncFS.writeFSTrack: ', trinlFileDir);
          //console.log('dataFactorySyncFS.writeFSTrack: ', container);
          //console.log('dataFactorySyncFS.writeFSTrack: ', '/tracks/' + name);

          $cordovaFile.writeFile(trinlFileDir, container + '/tracks/' + name, geoData, replace).then(function () {
            //console.log('dataFactorySyncFS.writeFSTrack SUCCESS: ', trinlFileDir + container + '/tracks/' + name);
            q.resolve();
          }, function (err) {
            //console.error('dataFactorySyncFS.writeFSTrack ERROR: ', err, trinlFileDir + container + '/tracks/' + name);
            q.resolve(err);
          });
        } else {
          q.resolve();
        }
      });
    };

    dataFactorySyncFS.writeFSTile = function (name, blob) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log('dataFactorySyncFS.writeFSTile: ', name, blob);

          $cordovaFile.writeFile(trinlFileDir, name, blob, true).then(function () {
            //console.log('dataFactorySyncFS.writeFSTile SUCCESS: ', trinlFileDir + 'tiles/' + name);
            q.resolve();
          }, function (err) {
            //console.error('dataFactorySyncFS.writeFSTile ERROR: ', err, trinlFileDir, name);
            q.resolve(err);
          });
        } else {
          //console.log('dataFactorySyncFS.writeFSTile ERROR NOT mobile: ', name);
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.readFSTrack = function (name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactorySyncFS.readFSTrackrack');
          $cordovaFile.readAsText(trinlFileDir, container + '/tracks/' + name).then(function (geoData) {

            //console.log('dataFactorySyncFS.readFSTrack SUCCESS');
            q.resolve(geoData);
          }, function (err) {
            //console.error('dataFactorySyncFS.readFSTrack ERROR: ' + trinlFileDir + 'tracks/' + name, JSON.stringify(err));
            q.resolve(err);
          });
        } else {
          //console.log('dataFactorySyncFS.readFSTrack ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.removeFSTrack = function (name) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactorySyncFS.removeFSTrack');
          $cordovaFile.removeFile(trinlFileDir, container + '/tracks/' + name).then(function () {
            //console.log('dataFactorySyncFS.removeFSTrack SUCCESS');
            q.resolve();
          }, function (err) {
            //console.error('dataFactorySyncFS.removeFSTrack ERROR: ', err);
            q.resolve(err);
          });
        } else {
          //console.log('dataFactorySyncFS.removeFSTrack ERROR NOT mobile');
          q.resolve();
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.upLoadFotoCamera = function (imageDataUrl) {

      //console.log('dataFactoryFotos.upload imageDataUrl: ', imageDataUrl);

      var q = $q.defer();

      var headers, jwt, options, params, ft, host;

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

          //console.log('dataFactoryFotos.uploadCamera imageDataUrl from Mobiel: ', imageDataUrl);

          headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('authentication_token')
          };

          options = new FileUploadOptions();
          options.fileKey = 'file';
          options.fileName = imageDataUrl.substr(imageDataUrl.lastIndexOf('/') + 1);
          options.httpMethod = 'POST';
          options.mimeType = 'image/jpeg';
          options.chunkedMode = false;
          options.headers = headers;

          jwt = localStorage.getItem('authentication_token');
          params = {
            id: localStorage.getItem('authentication_id'),
            profielId: localStorage.getItem('authentication_profielId'),
            token: jwt,
            fileName: imageDataUrl.substr(imageDataUrl.lastIndexOf('/') + 1),
            directory: 'fotos',
            gebruikerId: localStorage.getItem('authentication_id')
          };
          options.params = params;

          ft = new FileTransfer();
          host = urlBaseBackend + 'upload/foto';
          var message = '';
          ft.upload(trinlFileDir + imageDataUrl, encodeURI(host), function (result) {
            //console.log('dataFactoryFotos.uploadCamera FileTransfer() imageDataUrl Mobiel result SUCCES: ', result);
            //var response = JSON.parse(result.response);
            var tmp = result.response.indexOf('{"success');
            var tmp2 = result.response.substr(tmp); 
            //console.log('dataFactoryFotos.uploadCamera FileTransfer() imageDataUrl Mobiel object str SUCCES: ', tmp2);
            message = JSON.parse(tmp2);
            //console.log('dataFactoryFotos.uploadCamera FileTransfer() imageDataUrl Mobiel SUCCES object: ', message);
            //console.log('dataFactoryFotos.uploadCamera FileTransfer() imageDataUrl Mobiel SUCCES success: ', message.success);
            //console.log('dataFactoryFotos.uploadCamera FileTransfer() imageDataUrl Mobiel SUCCES message: ', message.message);
            q.resolve(message);
          }, function (error) {
            //console.log('dataFactoryFotos.uploadCamera FilTransfer() imageDataUrl Mobiel ERROR: ', error);
            q.reject(error);
          }, options);
        }
      });

      return q.promise;
    };

    dataFactorySyncFS.upLoadFotoDesktop = function (fileName, foto) {

      var q = $q.defer();

      //console.warn('dataFactoryFS uploadFotoDesktop DESKTOP');
      //console.log('dataFactorySyncFS.upLoadFotoDesktop fileName: ', fileName);

      var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('authentication_token')
      };

      var jwt = localStorage.getItem('authentication_token');

      var formData = new FormData();

      formData.append('mimeType', 'image/jpeg');
      formData.append('enctype', 'multipart/form-data');
      formData.append('chunkedMode', false);
      formData.append('headers', headers);
      formData.append('fileKey', 'file');
      formData.append('id', localStorage.getItem('authentication_id'));
      formData.append('profielId', localStorage.getItem('authentication_profielId'));
      formData.append('token', jwt);
      formData.append('fileName', fileName);
      formData.append('directory', 'fotos');
      formData.append('gebruikerId', localStorage.getItem('authentication_id'));
      var blob = new Blob([foto], {
        type: 'image/jpeg'
      });
      formData.append('file', blob);

      axios.post(urlBaseBackend + 'upload/foto',
        formData
      ).then(function (result) {
        //console.log('dataFactorySyncFS uploadTrackDesktop Axios SUCCESS url: ', urlBaseBackend + 'upload/foto');
        q.resolve('axios uploadfoto SUCCES: ', result);
      }).catch(function (err) {
        //console.log('dataFactorySyncFS uploadTrackDesktop Axios ERROR: ', err);
        q.reject('axios upload ERROR: ', err);
      });

      return q.promise;
    };

    dataFactorySyncFS.upLoadTrackMobile = function (trackDataUrl) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {

        //console.warn('dataFactorySyncFS.upLoadTrackMobile trackData: ', trackDataUrl);
        //console.log('dataFactoryFS uploadTrackMobile');

        var headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('authentication_token')
        };

        var jwt = localStorage.getItem('authentication_token');
        var fileName = trackDataUrl.substr(trackDataUrl.lastIndexOf('/') + 1);

        var formData = new FormData();

        formData.append('mimeType', 'text/plain');
        formData.append('chunkedMode', false);
        formData.append('headers', headers);
        formData.append('fileKey', 'file');
        formData.append('id', localStorage.getItem('authentication_id'));
        formData.append('profielId', localStorage.getItem('authentication_profielId'));
        formData.append('token', jwt);
        formData.append('fileName', fileName);
        formData.append('directory', 'tracks');
        formData.append('gebruikerId', localStorage.getItem('authentication_id'));
        var blob = new Blob([trinlFileDir + trackDataUrl], {
          type: 'text/plain'
        });
        formData.append('fileNaam', blob);

        //console.log('dataFactorySyncFS upLoadTrackMobile content: ', content);

        axios.post(urlBaseBackend + 'upload/track',
          formData
        ).then(function () {
          //console.log('dataFactorySyncFS uploadTrackDesktop Axios SUCCESS');
          q.resolve();
        }).catch(function (err) {
          //console.log('dataFactorySyncFS uploadTrackDesktop Axios ERROR: ', err);
          q.reject('axios upload ERROR: ', err);
        });

      });

      return q.promise;
    };

    dataFactorySyncFS.upLoadTrackDesktop = function (fileName, spoor) {

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        //console.log('dataFactoryFS uploadTrackDesktop DESKTOP');
        //console.warn('dataFactorySyncFS.upLoadTrackDesktop fileName: ', fileName + '.txt');
        //console.warn('dataFactorySyncFS.upLoadTrackDesktop spoor: ', JSON.stringify(spoor));

        var jwt = localStorage.getItem('authentication_token');
        var headers = {
          'Authorization': 'Bearer ' + jwt
        };


        var formData = new FormData();

        formData.append('mimeType', 'text/plain');
        formData.append('chunkedMode', false);
        formData.append('headers', headers);
        formData.append('fileKey', 'file');
        formData.append('id', localStorage.getItem('authentication_id'));
        formData.append('profielId', localStorage.getItem('authentication_profielId'));
        formData.append('token', jwt);
        formData.append('fileName', fileName + '.txt');
        formData.append('directory', 'tracks');
        formData.append('gebruikerId', localStorage.getItem('authentication_id'));
        var blob = new Blob([JSON.stringify(spoor)], {
          type: 'text/plain'
        });
        formData.append('fileNaam', blob);

        axios.post(urlBaseBackend + 'upload/track',
          formData
        ).then(function () {
          //console.log('dataFactorySyncFS uploadTrackDesktop Axios SUCCESS');
          q.resolve();
        }).catch(function (err) {
          //console.log('dataFactorySyncFS uploadTrackDesktop Axios ERROR: ', err);
          q.reject('axios upload ERROR: ', err);
        });
      });
    };

    return dataFactorySyncFS;

  }
]);
