/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryStore', ['loDash', '$ionicPlatform', 'dataFactoryHelper', 'dataFactoryProxy', 'dataFactoryAlive', '$q', '$timeout', '$moment', 'dataFactoryObjectId', 'dataFactorySyncFS', '$cordovaFile', '$cordovaNetwork',
  function (loDash, $ionicPlatform, dataFactoryHelper, dataFactoryProxy, dataFactoryAlive, $q, $timeout, $moment, dataFactoryObjectId, dataFactorySyncFS, $cordovaFile, $cordovaNetwork) {

    var dataFactoryStore = {};

    var trinlFileDir;
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }
    });

    dataFactoryStore.addAnalytics = function (analytics) {

      var store = {
        storeId: 'analytics'
      };

      //console.warn('dataFactoryStore.addAnalytics');

      var q = $q.defer();
      dataFactoryProxy.http(store, 'POST', 'save', analytics).then(function (result) {
        //console.warn('StoreAnalytics upload SUCCESS: ', result);
        q.resolve('StoreAnalytics upload SUCCESS: ', result);
      }).catch(function (error) {
        //console.error('StoreAnalytics upload ERROR: ', error);
        q.reject('StoreAnalytics upload ERROR: ', error);
      });

      return q.promise;
    };

    dataFactoryStore.addData = function (store, data) {

      //console.warn('dataFactoryStore.addData ' + store.storeId);
      //console.log('dataFactoryStore.addData ' + store.storeId +': ', data.get('Id'));
      //
      // Wordt gebruikt om de store te vullen met modellen die reeds geupsynced zijn
      // De data is 1 of meerdere modellen
      // Deze modellen moeten velden hebben met de juiste structuur
      // Deze modellen hoeven geen functies te hebben
      // Deze modellen worden niet geupsynced
      // Deze modellen worden niet toegevoegd indien model reeds aanwezig
      //
      var q = $q.defer();

      var newItem;
      //
      // Converteer 1 model naar een array met model
      //
      var tabel = [];
      if (angular.isArray(data)) {
        tabel = data;
      } else {
        tabel.push(data);
      }
      //
      // Verwerk tabel met modellen
      //
      loDash.each(tabel, function (model) {
        //console.log(store.storeId + ' dataFactoryStore.addData model from tabel: ', model);
        newItem = {
          phantom: false,
          record: model
        };
        //console.log(store.storeId + ' dataFactoryStore.addData new item with record from data: ', newItem);
        var found = loDash.find(store.data, function (dataItem) {
          return dataItem.record.get('Id') === newItem.record.get('Id');
        });

        if (found) {
          //console.log(store.storeId + ' dataFactoryStore addData Id FOUND: ', newItem.record.get('Id'));
          var oldChangedOn = found.record.get('changedOn');
          var newChangedOn = newItem.record.get('changedOn');
          //console.log('old ChangedOn, new ChangedOn: ', oldChangedOn, newChangedOn);

          if (oldChangedOn < newChangedOn) {
            found.dirty = false;

            loDash.each(newItem.record, function (field, prop) {
              if (field.value !== undefined) {
                //console.log('update field in newItem => found dirty, type, prop, value: ', field.dirty, field.type, prop, field.value);
                found.record.set(prop, field.value);
              }
            });

            //console.log(store.storeId + ' addData Id FOUND: UPDATED SUCCESS');
          } else {
            //console.log(store.storeId + ' addData Id FOUND NOT UPDATED: NOT NEWER');
          }
        } else {

          store.data.push(newItem);
          //console.log(store.storeId + ' dataFactoryStore addData new Id : ', newItem.record.get('Id'));
          //console.log(store.storeId + ' addData added SUCCESS');
        }
      });
      store.store = loDash.map(store.data, 'record');
      q.resolve(store.data);

      return q.promise;
    };

    dataFactoryStore.clear = function (store) {

      //console.warn('dataFactoryStore.clear ' + store.storeId);

      var q = $q.defer();

      store.data = [];
      store.store = [];
      store.removedRecords = [];

      store.selected = [];
      store.lastSyncDate = '1970-01-02 00:00:00';

      //console.warn(store.storeId + ' clear SUCCESS');

      q.resolve(store.store);

      return q.promise;
    };

    dataFactoryStore.findRecord = function (store, prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {

      //console.warn('dataFactoryStore.findRecord ' + store.storeId);

      //console.warn(store.storeId + ' findRecord: ', prop, value, startIndex, anyMatch, caseSensitive, exactMatch);

      if (startIndex === undefined || startIndex === null) {
        startIndex = 0;
      }
      if (anyMatch === undefined || anyMatch === null) {
        anyMatch = false;
      }
      if (caseSensitive === undefined || caseSensitive === null) {
        caseSensitive = true;
      }
      if (exactMatch === undefined || exactMatch === null) {
        exactMatch = true;
      }

      //console.log(store.storeId + ' => dataFactoryStore.findRecord starting with: startIndex, anyMatch, caseSensitive, exactMatch: ', prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
      var q = $q.defer();

      var foundItem = loDash.find(store.data, function (dataItem, index) {
        //console.log(store.storeId + ' dataFactoryStore.findRecord dataItem.record on store.data: ', dataItem.record, valueRegEx, index);

        if (index >= startIndex) {
          var valueStore = dataItem.record.get(prop);
          //console.log(store.storeId + ' dataFactoryStore.findRecord value in record: ', valueStore);

          if (value !== false && value !== true) {
            var valueRegEx;
            var valueReg = value;

            var regexFlags = '';
            if (exactMatch) {
              valueReg = '^' + value + '$';
            }
            if (anyMatch) {
              regexFlags += 'g';
            }
            if (caseSensitive === false) {
              regexFlags += 'i';
            }
            valueRegEx = new RegExp(valueReg, regexFlags);
            //console.log(store.storeId + ' dataFactoryStore.findRecord valueRegEx valueStore: ' + valueRegEx + ' ==> ' + valueStore);
            if (valueStore.match(valueRegEx)) {
              return true;
            }
          } else {
            //console.log(store.storeId + ' dataFactoryStore.findRecord value valueStore: ' + value + ' ==> ' + valueStore);
            if (valueStore === value) {
              return true;
            }
          }
        }
      });
      if (foundItem) {
        //console.warn(store.storeId + ' dataFactoryStore.findRecord record SUCCESS: ', foundItem.record);
        q.resolve(foundItem.record);
      } else {
        //console.error(store.storeId + ' dataFactoryStore.findRecord record ERROR: ' + prop + ' => ' + value);
        q.reject(store.storeId + ' record met ' + prop + ' => ' + value + ' niet gevonden!');
      }

      return q.promise;
    };

    dataFactoryStore.initialLoadAll = function (store) {

      //console.warn('dataFactoryStore.initialLoadAll ' + store.storeId);

      var q = $q.defer();

      var params = {};

      //console.warn(store.storeId + ' initialLoadAll START');

      dataFactoryProxy.http(store, 'GET', 'loadAll', params).then(function (data) {
        q.resolve(data);
      });

      return q.promise;
    };

    /**
     * Haal alle records op in backend
     * @requires store
     * @return {Array}       tabel met records
     */
    dataFactoryStore.initialLoad = function (store, Id) {

      //console.warn('dataFactoryStore.initialLoad ' + store.storeId);

      var q = $q.defer();

      var params = {
        Id: Id
      };

      //console.warn(store.storeId + ' initialLoad START');

      q.resolve(dataFactoryProxy.http(store, 'GET', 'load', params));

      return q.promise;
    };

    /**
     * Bepaal volgende paginanummer
     * @requires store
     * @return {Array}       promise.resolve: store.data
     */
    dataFactoryStore.nextPage = function (store) {

      //console.warn('dataFactoryStore.nextPage ' + store.storeId);

      var q = $q.defer();

      store.currentPage = store.currentPage + 1;
      dataFactoryStore.loadPage(store, store.currentPage);

      q.resolve(store.data);

      return q.promise;
    };
    /**
     * Haal records op basis van paginanummer
     * @requires store
     * @param  {Number} page  paginanummer
     */
    dataFactoryStore.loadPage = function (store, page) {

      //console.warn('dataFactoryStore.loadPage ' + store.storeId);

      store.currentPage = page;
      dataFactoryStore.initialLoad(store, Id);
    };
    /**
     * Bereken vorig epaginanummer ( paginanummer > 0)
     * @requires store
     * @return {Array}       promise.resolve store.data
     */
    dataFactoryStore.previousPage = function (store) {

      //console.warn('dataFactoryStore.previousPage ' + store.storeId);

      var q = $q.defer();

      if (store.currentPage > 1) {
        store.currentPage = store.currentPage - 1;
      }
      dataFactoryStore.loadPage(store, store.currentPage);

      q.resolve(store.data);

      return q.promise;
    };
    /**
     * Set de waarde van autosync
     * @param {Object} store store waarin de autosync waarde wordt geset
     */
    dataFactoryStore.setAutoSync = function (store, bool) {

      //console.warn('dataFactoryStore.setAutoSync ' + store.storeId);

      store.autoSync = bool;

    };
    /**
     * Verwijder record in store
     * Record wordt verplaats van store.store naar store.removedRecords
     * Records in store.removedRecords worden bij eerstvolgende sync verwijderd in backend
     * Store wordt opnieuw gefiltered en gesorteerd
     * @requires store
     * @requires item  item in store
     * @return {Object}         promise.resolve: store (gefilterde) Modellen
     */
    dataFactoryStore.remove = function (store, record) {

      //console.warn('dataFactoryStore.remove ' + store.storeId);
      //console.warn(store.storeId + ' remove: ', record);

      var q = $q.defer();
      //
      // Kopieer volledig record naar tabel removedRecords
      //
      store.removedRecords.push(record);
      //
      // Verwijder record in data en in store
      //

      loDash.remove(store.data, function (dataItem) {
        if (dataItem.record.get('Id') === record.get('Id')) {
          //console.log(store.storeId + ' remove item from data: ', store.data);
        }
        return dataItem.record.get('Id') === record.get('Id');
      });

      loDash.remove(store.store, function (model) {
        if (model.get('Id') === record.get('Id')) {
          //console.log(store.storeId + ' remove item from store: ', store.store);
        }
        return model.get('Id') === record.get('Id');
      });
      //
      // Uodate store met data
      // Dit is onzin omdat het record niet mer in data noch in store staat
      // Het resultaat van onderstaande map is nihil
      //
      //        store.store = loDash.map(store.data, 'record');
      //
      // De syncUp zorgt ervoor dat de backend en FS bijgewerkt worden met het model in removedRecords
      //
      if (store.autoSync) {
        dataFactoryStore.syncUp(store).then(function () {
          //console.error(store.storeId + ' store remove syncUp SUCCESS: ', record);
          q.resolve(record);
        }, function (err) {
          //console.error(store.storeId + ' store remove syncUp ERROR: ', record, err);
          q.resolve(record);
        });
      } else {
        //console.error(store.storeId + ' store remove no autosync: ', record);
        q.resolve(record);
      }

      return q.promise;
    };

    /**
     * Bepaal grootte van 1 pagina
     * @param {Object} store
     */
    dataFactoryStore.setPageSize = function (store, size) {

      //console.warn('dataFactoryStore.setPageSize ' + store.storeId);

      store.pageSize = size;
    };
    /**
     * Bepaal xprive
     * @param {Object} store
     */
    dataFactoryStore.setPrive = function (store, bool) {

      //console.warn('dataFactoryStore.setPrive ' + store.storeId);

      store.xprive = bool;
    };
    /**
     * Bepaal of store is geladen
     * @requires  store
     * @return {Boolean}       true: geladen
     */
    dataFactoryStore.isLoaded = function (store) {

      //console.warn('dataFactoryStore.isLoaded ' + store.storeId);

      return store.loaded;
    };
    /**
     * Save een record
     * Store.data wordt opnieuw gefiltered en gesorteerd
     * @requires store
     * @requires record
     * @return {Object} promise.resolve: record
     */
    dataFactoryStore.save = function (store, record) {

      //console.warn('dataFactoryStore.save ' + store.storeId);
      //console.warn('dataFactoryStore.save ' + store.storeId +': ', record.get('Id'));

      var q = $q.defer();

      var found;
      //
      // Hier komen ook record door syncen uit FS met Id
      // Deze mogen niet INSERTED worden maar UPDATE ondanks dat record niet bestaan in store
      //
      found = loDash.find(store.data, function (dataItem) {
        return dataItem.record.get('Id') === record.get('Id');
      });

      if (found === undefined) {

        //console.log('dataFactoryStore.save ' + store.storeId + ' save record NIET gevonden TOEVOEGEN: ', record.get('Id'));

        var item = {};
        item.record = record;
        item.phantom = true;
        item.record.set('createdOn', record.get('changedOn'));
        item.record.set('deletedOn', '1970-01-02 00:00:00');
        if (record.get('Id') === null || record.get('Id') === undefined || record.get('Id') === 0 || record.get('Id') === '0' || record.get('Id') === '') {
          item.record.set('Id', dataFactoryObjectId.create());
        }
        store.data.push(item);

        //console.log('dataFactoryStore.save ' + store.storeId + ' INSERT with new Id: ', item.record.get('Id'), item.record.get('Id').length);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.writeFSsync(store, item.record, true).then(function () {
            //console.log(store.storeId + ' INSERT writeFSsync SUCCESS ', item.record.get('Id'));
          }, function (err) {
            //console.error(store.storeId + ' INSERT writeFS: ', err, item);
          });
          dataFactorySyncFS.writeFS(store, item.record, true).then(function () {
            //console.log(store.storeId + ' INSERT writeFS SUCCESS ', item.record.get('Id'));
          }, function (err) {
            //console.error(store.storeId + ' INSERT writeFS ERROR: ', err, item);
          });
        }
        //console.log(store.storeId + ' INSERT record SUCCESS: ', item.record.get('Id'));

        //console.warn('dataFactoryStore save INSERTED new record SUCCESS ' + store.storeId, item.record.get('Id'));
      } else {

        //console.warn(store.storeId + ' record gevonden WIJZIGEN: ', record.get('Id'));

        if (found.record.get('changedOn') <= record.get('changedOn')) {

          //console.log('copy all dirty values from record into found record');

          found.dirty = false;

          loDash.each(record, function (field, prop) {
            if (field.dirty === true || prop === 'changedOn' || prop === 'deletedOn' || prop === 'Id') {
              if (field.value !== undefined) {

                //console.log(store.storeId + ' update field in record => found dirty, type, prop, value: ', field.dirty, field.type, prop, field.value);
                found.record.set(prop, field.value);
                found.record[prop].dirty = true;
                found.dirty = true;
              }
            }
          });

          //console.log(store.storeId + ' save updated model: ', found.record);

          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            dataFactorySyncFS.writeFSsync(store, found.record, true).then(function () {
              //console.log(store.storeId + ' UPDATE writeFSsync SUCCESS');
            }, function (err) {
              //console.error(store.storeId + ' UPDATE writeFSsync: ', err);
            });
            dataFactorySyncFS.writeFS(store, found.record, true).then(function () {
              //console.log(store.storeId + ' UPDATE writeFS SUCCESS');
            }, function (err) {
              //console.error(store.storeId + ' UPDATE writeFS ERROR: ', err);
            });
          }
          //console.log(store.storeId + ' UPDATED record SUCCESS: ', found.record.get('Id'));

        } else {
          //console.warn('dataFactoryStore UPDATE record not newer ERROR ' + store.storeId, found.record.changedOn.value, record.changedOn.value);
        }

      }

      store.store = loDash.map(store.data, 'record');

      if (store.autoSync) {

        dataFactoryStore.syncUp(store).then(function () {
          //console.log(store.storeId + ' syncUp SUCCESS');
          q.resolve(record);
        }, function (err) {
          //console.error(store.storeId + ' save syncUp ERROR: ', store, record, err);
          q.resolve(record);
        });
      } else {
        //console.error(store.storeId + ' save filteredSorted no autosync: ', record);
        q.resolve(record);
      }

      return q.promise;
    };

    function verwerkSyncDown(results, store, storeUpdate) {

      //console.error(store.storeId + ' verwerkSyncDown verwerken results, store: ', results, store);

      var q = $q.defer();

      loDash.each(results, function (result) {

        //console.error(store.storeId + ' verwerkSyncDown verwerken results => result: ', result);

        var item = {};
        item.dirty = false;
        item.phantom = false;
        item.record = dataFactoryHelper.RecordToModel(store, result);

        var found;
        var record = item.record;

        var changed = record.get('changedOn');
        var deleted = record.get('deletedOn');
        var xprive = record.get('xprive');
        var mine = false;

        if (xprive === null) {
          xprive = false;
        }

        if (record.get('gebruikerId') === localStorage.getItem('authentication_id')) {
          mine = true;
        }

        if (store.storeId === 'configlaag' || store.storeId === 'configkaart') {
          mine = true;
        }

        if (store.storeId === 'berichtreactie' || store.storeId === 'fotoreactie' || store.storeId === 'poireactie' || store.storeId === 'trackreactie' || store.storeId === 'tag') {
          xprive = false;
          mine = false;
        }
        if (store.storeId === 'berichtreactie') {
          //console.log(store.storeId + ' changed: ', changed);
          //console.log(store.storeId + ' deleted: ', deleted);
          //console.log(store.storeId + ' xprive: ', xprive);
          //console.log(store.storeId + ' mine: ', mine);
          //console.log(store.storeId + ' record: ', record);
          //console.log(store.storeId + ' storeUpdate: ', storeUpdate);
        }
        //
        //  Eerst kijken of we dit record moeten verwijderen
        //  Een deletedOn met datum of een xprive = true betekent verwijderen
        //  In dit geval betekent verwijderen dat het model niet verwijderd wordt met de functie remove()
        //  In dit geval moet de update niet opnieuw geupsynced worden
        //  Tevens wordt het record en syncrecord verwijderd uit FS
        //
        if (deleted > '1970-01-02 00:00:00') {
          //
          // VERWIJDEREN
          // WIjziging ivm SOFT DELETE
          // Wijziging ivm UI update met todos die hier worden geregistreerd
          //
          //console.log(store.storeId + ' API store HARD VERWIJDEREN naam, deleted, xprive, mine: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);
          if (storeUpdate) {
            found = loDash.find(store.data, function (dataItem) {
              return dataItem.record.get('Id') === record.get('Id');
            });

            if (found) {
              found.record.set('deletedOn', deleted);
              //loDash.remove(store.store, function (storeModel) {
              //return storeModel.get('Id') === record.get('Id');
              //});
              loDash.remove(store.data, function (dataItem) {
                return dataItem.record.get('Id') === record.get('Id');
              });
              //
              //  Als een poi record in  poiStore gewijzigd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
              //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
              //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
              //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
              //  found.record = het record in de poiSTore dat gewijzigd is
              //
              if (!mine) {
                if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                  if (store.storeId === 'tag') {
                    //console.log(store.storeId + ' record VERWIJDEREN in  STORE =>  TODO, xprive, Id, tag: ', record.get('xprive'), record.get('Id'), record.get('tag'));
                  } else {
                    //console.log(store.storeId + ' record VERWIJDEREN in  STORE =>  TODO, xprive, Id, naam: ', record.get('xprive'), record.get('Id'), record.get('naam'));
                  }
                  store.todo.push(record.get('Id'));
                }
                if (store.storeId === 'berichtsup' || store.storeId === 'berichttag' || store.storeId === 'berichtreactie') {
                  store.todo.push(record.get('berichtId'));
                  //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, berichtId: ', found.record.get('berichtId'));
                }
                if (store.storeId === 'fotosup' || store.storeId === 'fototag' || store.storeId === 'fotoreactie') {
                  store.todo.push(record.get('fotoId'));
                  //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, fotoId: ', found.record.get('fotoId'));
                }
                if (store.storeId === 'poisup' || store.storeId === 'poitag' || store.storeId === 'poireactie') {
                  store.todo.push(record.get('poiId'));
                  //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, poiId => itemId: ', found.record.get('poiId'));
                }
                if (store.storeId === 'tracksup' || store.storeId === 'tracktag' || store.storeId === 'trackreactie') {
                  store.todo.push(record.get('trackId'));
                  //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, trackId: ', found.record.get('trackId'));
                }
              }
            } else {
              //console.warn(store.storeId + ' VERWIJDEREN record niet gevonden: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);
            }

          } else {
            //console.error(store.storeId + ' verwerkSyncDown result item niet VERWIJDEREN (SOFT DELETE) in  STORE parameter storeUpdate: ', storeUpdate);
          }
        } else {
          //
          //  Zoek record met Id in store.data
          //  Wijziging ivm UI update met todos die hier worden geregistreerd
          //
          found = loDash.find(store.data, function (dataItem) {
            return dataItem.record.get('Id') === record.get('Id');
          });
          //
          //  Geen items toevoegen waarvan de xprive = true en !mine
          //  Wel wijzigen
          //
          if (!found) {
            //
            //  TOEVOEGEN
            //
            if (!xprive || mine) {
              var dataItem = {};
              dataItem.record = record;
              dataItem.phantom = false;
              dataItem.dirty = false;

              //console.log(store.storeId + ' API store TOEVOEGEN naam, deleted, xprive, mine: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);

              if (storeUpdate) {
                if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track') {
                  //console.error(store.storeId + ' verwerkSyncDown record TOEVOEGEN STORE: ', record.get('xprive'), record.get('Id'), record.get('naam'));
                } else {
                  //console.error(store.storeId + ' verwerkSyncDown record TOEVOEGEN STORE: ', record.get('xprive'), record.get('Id'));
                }
                store.data.push(dataItem);
                //console.error(store.storeId + ' verwerkSyncDown store aantal: ', store.data.length);
                //
                //  Als een poi record in  poiStore toegevoegdd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
                //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
                //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
                //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
                //  found.record = het record in de poiSTore dat gewijzigd is
                //
                if (!mine) {
                  if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                    if (store.storeId === 'tag') {
                      //console.log(store.storeId + ' record TOEVOEGEN in  STORE =>  TODO, xprive, Id, tag: ', dataItem.record.get('xprive'), dataItem.record.get('Id'), dataItem.record.get('tag'));
                    } else {
                      //console.log(store.storeId + ' record TOEVOEGEN in  STORE =>  TODO, xprive, Id, naam: ', dataItem.record.get('xprive'), dataItem.record.get('Id'), dataItem.record.get('naam'));
                    }
                    //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, Id, naam: ', dataItem.record.get('Id'), dataItem.record.get('naam'));
                    store.todo.push(dataItem.record.get('Id'));
                  }
                  if (store.storeId === 'berichtsup' || store.storeId === 'berichttag' || store.storeId === 'berichtreactie') {
                    store.todo.push(dataItem.record.get('berichtId'));
                    //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, berichtId: ', dataItem.record.get('berichtId'));
                  }
                  if (store.storeId === 'fotosup' || store.storeId === 'fototag' || store.storeId === 'fotoreactie') {
                    store.todo.push(dataItem.record.get('fotoId'));
                    //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, fotoId: ', dataItem.record.get('fotoId'));
                  }
                  if (store.storeId === 'poisup' || store.storeId === 'poitag' || store.storeId === 'poireactie') {
                    store.todo.push(dataItem.record.get('poiId'));
                    //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, poiId: ', dataItem.record.get('poiId'));
                  }
                  if (store.storeId === 'tracksup' || store.storeId === 'tracktag' || store.storeId === 'trackreactie') {
                    store.todo.push(dataItem.record.get('trackId'));
                    //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, trackId: ', dataItem.record.get('trackId'));
                  }
                }
              } else {
                //console.error(store.storeId + ' verwerkSyncDown result item niet TOEVOEGEN in  STORE parameter storeUpdate: ', storeUpdate);
              }
              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                //console.warn(store.storeId + ' verwerkSyncDown result TOEVOEGEN CACHE: ', record.get('Id'));
                dataFactorySyncFS.writeFS(store, dataItem.record, true).then(function () {
                  //console.log(store.storeId + ' verwerkSyncDown writeFS TOEVOEGEN SUCCESS');
                }, function (err) {
                  //console.error(store.storeId + ' verwerkSyncDown writeFS TOEVOEGEN ERROR: ', err);
                });
              }
            }
          } else {
            //
            // WIJZIGEN
            //
            //console.warn(store.storeId + ' verwerkSyncDown result Wijzigen controleer nieuwer oud, nieuw changed: ', found.record.get('changedOn'), changed);
            if (found.record.get('changedOn') <= changed) {
              //console.log('storeUpdate: ', storeUpdate);
              //console.log('+++++++++++++++++++++++++++++++++++++++++++++');

              //console.log(store.storeId + ' API store WIJZIGEN (tevens softDelete) naam, deleted, xprive, mine: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);

              if (storeUpdate) {
                //console.warn(store.storeId + ' verwerkSyncDown result WIJZIGEN STORE: ', record.get('xprive'), record.get('Id'), record.get('naam'));
                loDash.each(record, function (field, prop) {
                  if (field.value !== undefined) {
                    //console.log(store.storeId + ' update field in record => found dirty, type, prop, value: ', field.dirty, field.type, prop, field.value);
                    found.record.set(prop, field.value);
                    found.record[prop].dirty = false;
                    found.dirty = false;
                  }
                });
                //
                //  Als een poi record in  poiStore gewijzigd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
                //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
                //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
                //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
                //  found.record = het record in de poiSTore dat gewijzigd is
                //
                if (!mine) {
                  if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                    if (store.storeId === 'tag') {
                      //console.log(store.storeId + ' record WIJZIGEN in  STORE =>  TODO, xprive, Id, tag: ', found.record.get('xprive'), found.record.get('Id'), found.record.get('tag'));
                    } else {
                      //console.log(store.storeId + ' record WIJZIGEN in  STORE =>  TODO, xprive, Id, naam: ', found.record.get('xprive'), found.record.get('Id'), found.record.get('naam'));
                    }
                    store.todo.push(found.record.get('Id'));
                  }
                  if (store.storeId === 'berichtsup' || store.storeId === 'berichttag' || store.storeId === 'berichtreactie') {
                    store.todo.push(found.record.get('berichtId'));
                    //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, berichtId: ', found.record.get('berichtId'));
                  }
                  if (store.storeId === 'fotosup' || store.storeId === 'fototag' || store.storeId === 'fotoreactie') {
                    store.todo.push(found.record.get('fotoId'));
                    //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, fotoId: ', found.record.get('fotoId'));
                  }
                  if (store.storeId === 'poisup' || store.storeId === 'poitag' || store.storeId === 'poireactie') {
                    store.todo.push(found.record.get('poiId'));
                    //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, poiId: ', found.record.get('poiId'));
                  }
                  if (store.storeId === 'tracksup' || store.storeId === 'tracktag' || store.storeId === 'trackreactie') {
                    store.todo.push(found.record.get('trackId'));
                    //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, trackId: ', found.record.get('trackId'));
                  }
                }

                found.phantom = false;
                found.dirty = false;
              } else {
                //console.error(store.storeId + ' verwerkSyncDown result item niet Wijzigen in STORE parameter storeUpdate: ', storeUpdate);
              }
              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                //console.warn(store.storeId + ' verwerkSyncDown result WIJZIGEN CACHE: ', record.get('Id'));
                dataFactorySyncFS.writeFS(store, found.record, true).then(function () {
                  //console.info(store.storeId + ' verwerkSyncDown writeFS WIJZIGEN SUCCESS');
                }, function (err) {
                  //console.error(store.storeId + ' verwerkSyncDown writeFS WIJZIGEN ERROR: ', err);
                });
              }
            } else {
              //console.error(store.storeId + ' verwerkSyncDown result item niet gewijzigd changedOn niet nieuwer');
            }
          }
        }
        store.store = loDash.map(store.data, 'record');
        //console.warn(store.storeId + ' => data na verwerkSyncDown updates, resolved: ', store.data);
        q.resolve();
      });

      return q.promise;
    }

    dataFactoryStore.syncDownAll = function (store, storeSup, storeTag, tag, storeReactie, storeReactieSup, update) {

      if (store.storeId === 'bericht') {
        //console.warn(store.storeId + ' dataFactoryStore.syncDownAll stores: ', store, storeSup, storeTag, tag, storeReactie, storeReactieSup);
      }
      //console.warn(store.storeId + ' dataFactoryStore.syncDownAll lastSyncDate: ', store.lastSyncDate);

      var masterStore = store.storeId;

      var q = $q.defer();

      if (store.lastSyncDate === undefined || store.lastSyncDate === null || store.lastSyncDate <= '2020-01-02 00:00:00') {
        store.lastSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
        //console.error(store.storeId + ' dataFactoryStore.syncDownAll corrected lastSyncDate: ', store.lastSyncDate);
      }

      var params = {};
      params.lastSyncDate = store.lastSyncDate;

      var storeUpdate = true;
      if (update !== undefined) {
        storeUpdate = update;
      }

      //console.warn(store.storeId + ' dataFactoryStore.syncDownAll params: ', params);

      dataFactoryProxy.http(store, 'GET', 'syncDownAll', params).then(function (data) {

        //console.log(store.storeId + ' dataFactoryStore.syncDownAll GET newSyncDate: ', data.newSyncDate);

        var newSyncDate = data.newSyncDate;

        //console.error(store.storeId + ' dataFactoryStore.syncDownAll data: ', data);
        if (data && data.results && data.results.length > 0) {
          //console.error(store.storeId + ' dataFactoryStore.syncDownAll data: ', data, data.results);
        }

        var results;

        if (data && data.results.length > 0) {

          if (masterStore === 'bericht') {

            //console.log(store.storeId + ' dataFactoryStore.syncDownAll bericht records');

            loDash.each(data.results, function (result) {

              //console.log(store.storeId + ' dataFactoryStore.syncDownAll result: ', result);

              if (result.bericht && result.bericht.length > 0) {
                results = result.bericht;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.berichtsup && result.berichtsup.length > 0) {
                store = storeSup;
                results = result.berichtsup;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.berichttag && result.berichttag.length > 0) {
                store = storeTag;
                results = result.berichttag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tag && result.tag.length > 0) {
                store = tag;
                results = result.tag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.berichtreactie && result.berichtreactie.length > 0) {
                //console.log(store.storeId + ' dataFactoryStore.syncDownAll naar verwerkSyncDown result: ', result);
                store = storeReactie;
                results = result.berichtreactie;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.fotoreactiesup && result.berichtreactiesup.length > 0) {
                //console.log(store.storeId + ' dataFactoryStore.syncDownAll naar verwerkSyncDown result: ', result);
                store = storeReactieSup;
                results = result.berichtreactiesup;
                verwerkSyncDown(results, store, storeUpdate);
              }
            });
            q.resolve(newSyncDate);
          }

          if (masterStore === 'foto') {

            //console.log(store.storeId + ' dataFactoryStore.syncDownAll foto records');

            loDash.each(data.results, function (result) {

              if (result.foto && result.foto.length > 0) {
                results = result.foto;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.fotosup && result.fotosup.length > 0) {
                store = storeSup;
                results = result.fotosup;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.fototag && result.fototag.length > 0) {
                store = storeTag;
                results = result.fototag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tag && result.tag.length > 0) {
                store = tag;
                results = result.tag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.fotoreactie && result.fotoreactie.length > 0) {
                store = storeReactie;
                results = result.fotoreactie;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.fotoreactiesup && result.fotoreactiesup.length > 0) {
                store = storeReactieSup;
                results = result.fotoreactiesup;
                verwerkSyncDown(results, store, storeUpdate);
              }
            });
            q.resolve(newSyncDate);
          }

          if (masterStore === 'poi') {

            //console.log(masterStore + ' dataFactoryStore.syncDownAll poi records');

            loDash.each(data.results, function (result) {

              //console.log(masterStore + ' dataFactoryStore.syncDownAll poi result: ', result);

              if (result.poi && result.poi.length > 0) {
                results = result.poi;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.poisup && result.poisup.length > 0) {
                store = storeSup;
                results = result.poisup;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.poitag && result.poitag.length > 0) {
                store = storeTag;
                results = result.poitag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tag && result.tag.length > 0) {
                store = tag;
                results = result.tag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.poireactie && result.poireactie.length > 0) {
                store = storeReactie;
                results = result.poireactie;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.poireactiesup && result.poireactiesup.length > 0) {
                store = storeReactieSup;
                results = result.poireactiesup;
                verwerkSyncDown(results, store, storeUpdate);
              }
            });
            q.resolve(newSyncDate);
          }

          if (masterStore === 'track') {

            //console.log(store.storeId + ' dataFactoryStore.syncDownAll track records');

            loDash.each(data.results, function (result) {

              //console.log(store.storeId + ' dataFactoryStore.syncDownAll track result: ', result);

              if (result.track && result.track.length > 0) {
                results = result.track;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tracksup && result.tracksup.length > 0) {
                store = storeSup;
                results = result.tracksup;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tracktag && result.tracktag.length > 0) {
                store = storeTag;
                results = result.tracktag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.tag && result.tag.length > 0) {
                store = tag;
                results = result.tag;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.trackreactie && result.trackreactie.length > 0) {
                store = storeReactie;
                results = result.trackreactie;
                verwerkSyncDown(results, store, storeUpdate);
              }
              if (result.trackreactiesup && result.trackreactiesup.length > 0) {
                store = storeReactieSup;
                results = result.trackreactiesup;
                verwerkSyncDown(results, store, storeUpdate);
              }
            });
            q.resolve(newSyncDate);
          }

          //console.log(masterStore + ' dataFactoryStore.syncDownAll verwerken results: ', results);

        } else {
          q.resolve(newSyncDate);
        }
      }).catch(function (err) {
        //console.error('syncDownAll GET ERROR: ', store.lastSyncDate);
        q.resolve();
      });

      return q.promise;
    };
    //
    //  Store wordt gesynchroniseerd met backend
    //  Geladen worden alle wijzigingen sinds de vorige syncDown
    //  Wordt gebruikt als Desktop of Mobiel && online
    //  Desktop: Store altijd bijwerken
    //  Mobiel update false: Store niet bijwerken.
    //  Mobile CACHE altijd bijwerken
    //
    dataFactoryStore.syncDown = function (store, Id, update) {

      //console.warn(store.storeId + ' dataFactoryStore.syncDown Id: ', Id);

      var aantal = 0;
      var storeUpdate = true;
      if (update !== undefined) {
        storeUpdate = update;
      }
      //console.warn(store.storeId + ' dataFactoryStore.syncDown update: ', storeUpdate);

      var q = $q.defer();
      /*
      //if ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) || $cordovaNetwork.isOnline()) {
      //if ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS())) {
      //console.warn(store.storeId + ' dataFactoryStore.syncDown ' + store.storeId, storeUpdate);
      if (store.lastSyncDate === undefined || store.lastSyncDate <= '1970-01-02 00:00:00') {
        //console.error(store.storeId + ' dataFactoryStore.syncDown lastSyncDate: ', store.lastSyncDate);
        store.lastSyncDate = '1970-01-02 00:00:00';
        store.lastSyncDate = $moment().subtract(25, 'seconds').format('YYYY-MM-DD HH:mm:ss');
        //console.error(store.storeId + ' dataFactoryStore.syncDown reset lastSyncDate: ', store.lastSyncDate);
      }
      //console.error(store.storeId + ' dataFactoryStore.syncDown do http with lastSyncDate: ', store.lastSyncDate);
      //console.log(store.storeId + ' dataFactoryStore.syncDown Id: ', Id);
      //console.log(store.storeId + ' dataFactoryStore.syncDown update: ', update);
      */
      var params = {};
      params.lastSyncDate = store.lastSyncDate;

      if (Id) {
        params.Id = Id;
      }
      //console.warn(store.storeId + ' dataFactoryStore.syncDown lastSyncDate: ', params.lastSyncDate);
      //console.warn(store.storeId + ' dataFactoryStore.syncDown Id: ', params.Id);
      dataFactoryProxy.http(store, 'GET', 'syncDown', params).then(function (data) {
        //console.log(store.storeId + ' syncDown: ', data.newSyncDate);
        if (data && data.results && data.results.length) {
          //console.log(store.storeId + ' syncDown data, params, aantal: ', data, params, data.results.length);
          aantal = data.results.length;
          if (aantal > 99) {
            //console.error(store.storeId + ' syncDown MEER DAN 100');
          }
          //console.error(store.storeId + ' syncDown -> newSyncDate: ', data.newSyncDate);
          if (data.newSyncDate !== undefined) {
            if (data.newSyncDate === false) {
              data.newSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
              if (store.storeId === 'poi') {
                //console.error(store.storeId + ' syncDown reste lastSyncDate: ', data.newSyncDate);
              }
            }

            store.lastSyncDate = data.newSyncDate;
            if (store.storeId === 'poi') {
              //console.log(store.storeId + ' syncDown new lastSyncDate: ', store.newSyncDate);
            }
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(store, data.newSyncDate);
            }

          } else {
            store.lastSyncDate = '1970-01-02 00:00:00';
            store.lastSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
            if (store.storeId === 'poi') {
              //console.error(store.storeId + ' syncDown reset lastSyncDate: 1970-01-02 00:00:00');
            }
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(store, store.lastSyncDate);
            }

          }

          var results = data.results;
          if (store.storeId === 'poi') {
            //console.log(store.storeId + ' syncDown RESULTS: ', results, results.length);
          }

          if (results.length !== 0) {

            loDash.each(results, function (result) {

              var item = {};
              item.dirty = false;
              item.phantom = false;
              item.record = dataFactoryHelper.RecordToModel(store, result);

              var found;
              var record = item.record;

              var changed = record.get('changedOn');
              var deleted = record.get('deletedOn');
              var xprive = record.get('xprive');

              if (xprive === null) {
                xprive = false;
              }

              if (store.storeId === 'bericht') {
                xprive = false;
              }

              var mine = false;
              if (record.get('gebruikerId') === localStorage.getItem('authentication_id')) {
                mine = true;
                //console.log(store.storeId + ' => SyncDown mine: ' + mine);
              }
              if (store.storeId === 'configlaag' || store.storeId === 'configkaart') {
                mine = true;
              }
              if (store.storeId === 'poi') {
                //console.log('+++++++++++++++++++++++++++++++++++++++++++++ INPUT from SyncDown');
                //console.log(store.storeId + ' store: ', store.store);
                //console.log(store.storeId + ' record: ', record);
                //console.log(store.storeId + ' naam: ', record.get('naam'));
                /*
                //console.log(store.storeId + ' changed: ', changed);
                //console.log(store.storeId + ' deleted: ', deleted);
                //console.log(store.storeId + ' xprive: ', xprive);
                //console.log(store.storeId + ' mine: ', mine);
                //console.log(store.storeId + ' record: ', record);
                //console.log(store.storeId + ' storeUpdate: ', storeUpdate);
                */
              }
              /**
                 * Eerst kijken of we dit record moeten verwijderen
                 * Een deletedOn met datum of een xprive = true betekent verwijderen
                 * In dit geval betekent verwijderen dat het model niet verwijderd wordt met de functie remove()
                 * In dit geval moet de update niet opnieuw geupsynced worden
                 * Tevens wordt het record en syncrecord verwijderd uit FS
                 */
              //if (deleted > '1970-01-02 00:00:00' || (xprive && !mine)) {
              if (deleted > '1970-01-02 00:00:00') {
                //
                // VERWIJDEREN
                // WIjziging ivm SOFT DELETE
                // Wijziging ivm UI update met todos die hier worden geregistreerd
                //
                //console.log(store.storeId + ' APIstore VERWIJDEREN naam, deleted, xprive, mine: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);
                if (storeUpdate) {
                  found = loDash.find(store.data, function (dataItem) {
                    return dataItem.record.get('Id') === record.get('Id');
                  });

                  if (found) {
                    found.record.set('deletedOn', deleted);

                    loDash.remove(store.store, function (storeModel) {
                      return storeModel.get('Id') === record.get('Id');
                    });
                    //
                    //  Als een poi record in  poiStore gewijzigd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
                    //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
                    //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
                    //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
                    //  found.record = het record in de poiSTore dat gewijzigd is
                    //
                    if (!mine) {
                      if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                        //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, Id, naam: ', record.get('Id'), record.get('naam'));
                        store.todo.push(record.get('Id'));
                      }
                      if (store.storeId === 'berichtsup' || store.storeId === 'berichtreactie' || store.storeId === 'berichtreactiesup' || store.storeId === 'berichttag') {
                        store.todo.push(record.get('berichtId'));
                        //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, berichtId: ', found.record.get('berichtId'));
                      }
                      if (store.storeId === 'fotosup' || store.storeId === 'fotoreactie' || store.storeId === 'fotoreactiesup' || store.storeId === 'fototag') {
                        store.todo.push(record.get('fotoId'));
                        //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, fotoId: ', found.record.get('fotoId'));
                      }
                      if (store.storeId === 'poisup' || store.storeId === 'poireactie' || store.storeId === 'poireactiesup' || store.storeId === 'poitag') {
                        store.todo.push(record.get('poiId'));
                        //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, poiId => itemId: ', found.record.get('poiId'));
                      }
                      if (store.storeId === 'tracksup' || store.storeId === 'trackreactie' || store.storeId === 'trackreactiesup' || store.storeId === 'tracktag') {
                        store.todo.push(record.get('trackId'));
                        //console.log(store.storeId + ' record VERWIJDEREN (SOFT DELETE) in  STORE =>  TODO, trackId: ', found.record.get('trackId'));
                      }
                    }
                  } else {
                    //console.log(store.storeId + ' VERWIJDEREN record niet gevonden: ', record.get('xprive'), record.get('naam'), record.get('Id'), deleted, mine);
                  }

                } else {
                  //console.error(store.storeId + ' syncDown result item niet VERWIJDEREN (SOFT DELETE) in  STORE parameter storeUpdate: ', storeUpdate);
                }

              } else {
                /**
                   * Zoek record met Id in store.data
                   * Wijziging ivm UI update met todos die hier worden geregistreerd
                   */
                found = loDash.find(store.data, function (dataItem) {
                  return dataItem.record.get('Id') === record.get('Id');
                });

                if (!found) {
                  //
                  //  TOEVOEGEN
                  //
                  var dataItem = {};
                  dataItem.record = record;
                  dataItem.phantom = false;
                  dataItem.dirty = false;
                  if (storeUpdate) {
                    //console.error(store.storeId + ' syncDown record TOEVOEGEN STORE: ', record.get('xprive'), record.get('Id'), record.get('naam'));
                    store.data.push(dataItem);
                    //
                    //  Als een poi record in  poiStore toegevoegdd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
                    //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
                    //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
                    //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
                    //  found.record = het record in de poiSTore dat gewijzigd is
                    //
                    if (!mine) {
                      if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                        //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, Id, naam: ', dataItem.record.get('Id'), dataItem.record.get('naam'));
                        store.todo.push(dataItem.record.get('Id'));
                      }
                      if (store.storeId === 'berichtsup' || store.storeId === 'berichtreactie' || store.storeId === 'berichtreactiesup' || store.storeId === 'berichttag') {
                        store.todo.push(dataItem.record.get('berichtId'));
                        //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, berichtId: ', dataItem.record.get('berichtId'));
                      }
                      if (store.storeId === 'fotosup' || store.storeId === 'fotoreactie' || store.storeId === 'fotoreactiesup' || store.storeId === 'fototag') {
                        store.todo.push(dataItem.record.get('fotoId'));
                        //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, fotoId: ', dataItem.record.get('fotoId'));
                      }
                      if (store.storeId === 'poisup' || store.storeId === 'poireactie' || store.storeId === 'poireactiesup' || store.storeId === 'poitag') {
                        store.todo.push(dataItem.record.get('poiId'));
                        //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, poiId: ', dataItem.record.get('poiId'));
                      }
                      if (store.storeId === 'tracksup' || store.storeId === 'trackreactie' || store.storeId === 'trackreactiesup' || store.storeId === 'tracktag') {
                        store.todo.push(dataItem.record.get('trackId'));
                        //console.log(store.storeId + ' record TOEVOEGEN =>  TODO, trackId: ', dataItem.record.get('trackId'));
                      }
                    }
                  } else {
                    //console.error(store.storeId + ' syncDown result item niet TOEVOEGEN in  STORE parameter storeUpdate: ', storeUpdate);
                  }
                  /*
                  if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                    //console.warn(store.storeId + ' syncDown result TOEVOEGEN CACHE: ', record.get('Id'));
                    //dataFactorySyncFS.writeFS(store, dataItem.record, true).then(function () {
                      //console.log(store.storeId + ' syncDown writeFS TOEVOEGEN SUCCESS');
                    //}, function (err) {
                      //console.error(store.storeId + ' syncDown writeFS TOEVOEGEN ERROR: ', err);
                    //});
                  }
                  */
                } else {
                  //
                  // WIJZIGEN
                  //
                  //console.warn(store.storeId + ' syncDown result Wijzigen controleer nieuwer oud, nieuw changed: ', found.record.get('changedOn'), changed);
                  if (found.record.get('changedOn') <= changed) {
                    //console.log('storeUpdate: ', storeUpdate);
                    //console.log('+++++++++++++++++++++++++++++++++++++++++++++');
                    if (storeUpdate) {
                      //console.warn(store.storeId + ' syncDown result WIJZIGEN STORE: ', record.get('xprive'), record.get('Id'), record.get('naam'));
                      loDash.each(record, function (field, prop) {
                        if (field.value !== undefined) {
                          //console.log(store.storeId + ' update field in record => found dirty, type, prop, value: ', field.dirty, field.type, prop, field.value);
                          found.record.set(prop, field.value);
                          found.record[prop].dirty = false;
                          found.dirty = false;
                        }
                      });
                      //
                      //  Als een poi record in  poiStore gewijzigd is wordt de Id van de gewijzigde poi toegevoegd aan poiTodo[]
                      //  ook als aan poi gerelateerde records gewijzigd zijn wordt ook de poiId teogevoegd aan poiTodo[]
                      //  De bedoeling is dat poiStore.todo een tabel is met Ids van gewijzigde pois
                      //  In de poiStore.todo worden geen Ids toegevoegd die er al in staan.
                      //  found.record = het record in de poiSTore dat gewijzigd is
                      //
                      //if (store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                      //if (store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track') {
                      if (!mine) {
                        if (store.storeId === 'bericht' || store.storeId === 'foto' || store.storeId === 'poi' || store.storeId === 'track' || store.storeId === 'tag') {
                          //console.log(store.storeId + ' record WIJZIGEN in  STORE =>  TODO, Id, naam: ', found.record.get('xprive'), found.record.get('Id'), found.record.get('naam'), found.record.get('tag'));
                          store.todo.push(found.record.get('Id'));
                        }
                        if (store.storeId === 'berichtsup' || store.storeId === 'berichtreactie' || store.storeId === 'berichtreactiesup' || store.storeId === 'berichttag') {
                          store.todo.push(found.record.get('berichtId'));
                          //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, berichtId: ', found.record.get('berichtId'));
                        }
                        if (store.storeId === 'fotosup' || store.storeId === 'fotoreactie' || store.storeId === 'fotoreactiesup' || store.storeId === 'fototag') {
                          store.todo.push(found.record.get('fotoId'));
                          //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, fotoId: ', found.record.get('fotoId'));
                        }
                        if (store.storeId === 'poisup' || store.storeId === 'poireactie' || store.storeId === 'poireactiesup' || store.storeId === 'poitag') {
                          store.todo.push(found.record.get('poiId'));
                          //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, poiId: ', found.record.get('poiId'));
                        }
                        if (store.storeId === 'tracksup' || store.storeId === 'trackreactie' || store.storeId === 'trackreactiesup' || store.storeId === 'tracktag') {
                          store.todo.push(found.record.get('trackId'));
                          //console.log(store.storeId + ' record WIJZIGEN in STORE =>  TODO, trackId: ', found.record.get('trackId'));
                        }
                      }

                      found.phantom = false;
                      found.dirty = false;
                    } else {
                      //console.error(store.storeId + ' syncDown result item niet Wijzigen in STORE parameter storeUpdate: ', storeUpdate);

                    }
                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

                      //console.warn(store.storeId + ' syncDown result WIJZIGEN CACHE: ', record.get('Id'));
                      dataFactorySyncFS.writeFS(store, found.record, true).then(function () {
                        //console.info(store.storeId + ' syncDown writeFS WIJZIGEN SUCCESS');

                      }, function (err) {
                        //console.error(store.storeId + ' syncDown writeFS WIJZIGEN ERROR: ', err);
                      });

                    }
                  } else {
                    //console.error(store.storeId + ' syncDown result item niet gewijzigd changedOn niet nieuwer');
                  }
                }
              }
            });
            store.store = loDash.map(store.data, 'record');

            //console.log(store.storeId + ' => data na syncDown updates, resolved: ', store.data);

            q.resolve(aantal);
          } else {
            store.lastSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
            //console.log(store.storeId + ' => syncDown lastSyncDate: ', store.lastSyncDate);
            //console.log(store.storeId + ' => store na syncDown updates RESULT EMPTY, resolved: ', store.store);
            q.resolve('Result empty');
          }
        } else {
          store.lastSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
          //console.log(store.storeId + ' => syncDown lastSyncDate: ', store.lastSyncDate);
          //console.log(store.storeId + ' => store na syncDown updates DATA EMPTY');
          q.resolve('Empty');
        }
      }, function (err) {

        store.lastSyncDate = $moment().format('YYYY-MM-DD HH:mm:ss');
        //console.log(store.storeId + ' => syncDown lastSyncDate: ', store.lastSyncDate);
        //console.log(store.storeId + ' => store na syncDown updates, SYNCDOWN ERROR, resolved: ', err);
        q.resolve(err);
      });
      //} else {
      //q.resolve(0);
      //}
      return q.promise;
    };
    /**
     * Store uitgestelde syncUp
     * Uitsluitend toepassing indien steeds hetzelfde record wordt gesaved
     * @requires store
     * @requires item  store.store.item
     */
    dataFactoryStore.delayedSyncUpUpdate = function (store, item, operation, phantomWas, dirtyWas) {


      function x(store, y) {
        if (y === false) {

          //console.warn('dataFactoryStore.delayedSyncUpUpdate ' + store.storeId);
          syncUpdate(store, item, operation, phantomWas, dirtyWas);
          //console.log(store.storeId + ' delayedSyncUpUpdate fired after 1 second:' + y);

        }

      }

      if (store.enableSyncUp) {
        if (store.lockTimeout) {
          clearTimeout(store.lockTimeout);
        }
        store.lockTimeout = setTimeout(function () {
          store.lock = false;
          x(store, store.lock);
        }, store.delaySyncUpTime);
      }
    };

    function syncUpdate(store, item, operation, phantomWas, dirtyWas) {

      //console.log(store.storeId + ' dataFactoryStore syncUpdate');

      loDash.each(item.record, function (field, prop) {
        //if (prop === 'Id' || prop === 'changedOn' || prop === 'deletedOn' || prop === 'poiId' || prop === 'fotoId' || prop === 'trackId' || prop === 'gebruikerId') {
        if (prop === 'Id') {
          item.record[prop].dirty = true;
        }

      });

      //item.record.setAll();

      var params = dataFactoryHelper.ModelToRecord(store, item.record, true);

      //console.log(store.storeId + ' dataFactoryStore syncUpdate params: ', params);
      //console.log(store.storeId + ' dataFactoryStore syncUpdate before record: ', item.record);

      item.phantom = false;
      item.dirty = false;

      dataFactoryProxy.http(store, operation, 'save', params).then(function () {

        //console.log(store.storeId + ' syncUp PHANTOM/DIRTY SUCCESS Id, changedOn: ', params.Id, params.changedOn, params.deletedOn);

        item.record.unsetAll();

        //console.log(store.storeId + ' syncUp PHANTOM/DIRTY RESET: ', item.record.get('Id'));


        //console.log(store.storeId + ' dataFactoryStore syncUp PHANTOM/DIRTY reponse PROXY http  unsetAll en PHANTOM/DIRTY reset with params:  item.record: ', item);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.cleanFS(store, item.record.get('Id') + '.txt').then(function () {
            //console.log(store.storeId + ' syncUp cleanFS SUCCESS: ', item);
          }, function (err) {
            //console.error(store.storeId + ' syncUp cleanFS ERROR: ', err);
          });
        }


        //var ids = ['xxx'];
        //
        // vul de tabel ids met volgers ids
        //
        /*
        if (store.remoteSync && store.storeId !== 'gebruiker' && store.storeId !== 'ceo' && ids.length !== 0) {
          //
          // xprive voor websocket
          //
          var xprive;
          if (item.record.get('xprive') !== undefined) {
            if (item.record.get('xprive')) {
              xprive = '1';
            } else {
              xprive = '0';
            }
          } else {
            xprive = '1';
          }
     
          var extra = '';
          if (store.storeId === 'berichtreactie') {
            extra = item.record.get('berichtGebruikerId');
          }
          if (store.storeId === 'berichtsup') {
            extra = item.record.get('berichtId');
          }
          if (store.storeId === 'fotosup') {
            extra = item.record.get('fotoId');
          }
          if (store.storeId === 'poisup') {
            extra = item.record.get('poiId');
          }
          if (store.storeId === 'tracksup') {
            extra = item.record.get('trackId');
          }
          //console.log(store.storeId + ' record: ', item.record, xprive, extra);
     
     
        }
        */
        //console.log(store.storeId + ' syncUp PHANTOM/DIRTY COMPLETED: ');

      }, function () {

        item.phantom = phantomWas;
        item.dirty = dirtyWas;

        //console.error(store.storeId + ' syncUp PHANTOM/DIRTY ERROR PHANTOM?DIRTY, reset PHANTOM/DIRTY  : ', item.record.get('Id'));

      });
    }
    /**
     * Syncup alle phantom records in store naar backend
     * Reset Phantom indien backend response Ok
     * @requires store
     * @return {Object}       promise.resolve: store (gefilterde) Modellen
     * @return {Object}       promise.reject: 'NOT ENABLED' || 'NOT ONLINE'
     */
    dataFactoryStore.syncUp = function (store) {

      //console.warn('dataFactoryStore.syncUp ' + store.storeId);

      var q = $q.defer();

      if ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) || $cordovaNetwork.isOnline()) {
        if (store.enableSyncUp) {

          if (store.removedRecords.length !== 0) {

            //console.log(store.storeId + ' syncUp removedRecords');

            loDash.each(store.removedRecords, function (record) {

              (function (store, record) {

                //console.log(store.storeId + ' dataFactoryStore syncUp remove record cleanup: ', record);

                var params = {};

                loDash.each(record, function (item, prop) {
                  params[prop] = item.value;
                });

                //console.log(store.storeId + ' dataFactoryStore syncUp remove record params: ', params);

                dataFactoryProxy.http(store, 'DELETE', 'remove', params).then(function () {
                  var item = {};
                  item.record = record;

                  if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                    dataFactorySyncFS.removeFS(store, item.record, true).then(function () {
                      //console.log(store.storeId + ' save removeFS SUCCESS');
                    }, function (err) {
                      //console.error(store.storeId + ' save removeFS ERROR: ', err, item);
                    });
                  }


                  //var ids = ['xxx'];
                  //
                  // vul de tabel ids met volgers ids
                  //
                  /*
                  if (store.remoteSync && store.storeId !== 'gebruiker' && store.storeId !== 'ceo' && ids.length !== 0) {
     
                    var xprive;
                    if (item.record.get('xprive') !== undefined) {
                      if (item.record.get('xprive')) {
                        xprive = '1';
                      } else {
                        xprive = '0';
                      }
                    } else {
                      xprive = '1';
                    }
     
                    var extra = '';
                    if (store.storeId === 'berichtreactie') {
                      extra = item.record.get('berichtGebruikerId');
                    }
                    //console.error('dataFactoryStore DeletedRecords ERROR: ', xprive, extra);
                  }
                  */
                }, function (err) {
                  //console.error('dataFactoryStore DeletedRecords ERROR: ', err);
                });
              }(store, record));
            });
            store.removedRecords = [];
          }


          loDash.each(store.data, function (item) {

            (function (store, item) {

              if (item.phantom) {

                (function (store, item) {
                  //
                  // Indien syncUp foto dan eerst controleren of foto een sync record heeft. Dus nog niet eerder geupSynced is.
                  // Indien nog niet eerder dan eerst de imageData uploaden.
                  //
                  // Indien foto of track PHANTOM ook de attachment uploaden
                  //
                  var dirtyWas = item.dirty;
                  var phantomWas = item.phantom;
                  var operation = 'POST';

                  item.phantom = false;
                  item.dirty = false;

                  if (store.storeId === 'foto') {
                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

                      //console.log('dataFactoryStore syncUp 1 fotoModel gebruikerId up: ', item.record.get('gebruikerId'), item.record.get('up'));

                      if (item.record.get('up') === false) {
                        //console.log('dataFactoryStore syncUp 1 fotoModel authenticationId, fotoId extension: ', localStorage.getItem('authentication_id')); 
                        //console.log('dataFactoryStore syncUp 1 fotoModel authenticationId, fotoId extension: ', item.record.get('Id')); 
                        //console.log('dataFactoryStore syncUp 1 fotoModel authenticationId, fotoId extension: /fotos/'); 
                        //console.log('dataFactoryStore syncUp 1 fotoModel authenticationId, fotoId extension: jpg'); 
                        var path = localStorage.getItem('authentication_id') + '/fotos/' + item.record.get('Id') + '.jpg';
                        //console.log('dataFactoryFotos foto check Foto in TRINL-cache: ', trinlFileDir + path);

                        $cordovaFile.checkFile(trinlFileDir, path).then(function () {
                          //console.log('dataFactoryFotos foto clientPath FOUND first download foto\'s: ', trinlFileDir + path);

                          dataFactorySyncFS.upLoadFotoCamera(path).then(function (result) {
                            //console.log('dataFactoryStore uploadCamera path, result: ', path, result.message);
                            item.record.set('up', true);
                            item.record.set('changedOn', dataFactoryAlive.getTimestamp());
                            //console.log('dataFactoryStore syncUp fotoModel: ', item.record);
                            syncUpdate(store, item, operation, phantomWas, dirtyWas);
                            //console.log('dataFactoryStore uploadCamera SUCCES');
                          }).catch(function (err) {
                            syncUpdate(store, item, operation, phantomWas, dirtyWas);
                            //console.log('dataFactoryStore uploadCamera ERROR: ', err);
                          });
                        }).catch(function (err) {
                          //console.log('dataFactoryStore uploadCamera checkFile ERROR: ', err, trinlFileDir, path);
                        });
                      } else {
                        syncUpdate(store, item, operation, phantomWas, dirtyWas);
                      }
                    }
                  } else {
                    if (store.storeId === 'track') {

                      //console.error('dataFactoryStore syncUp 1 trackModel gebruikerId up, xData: ', item.record.get('gebruikerId'), item.record.get('up'), item.record.xData);

                      if (item.record.get('up') === false) {
                        $timeout(function () {

                          dataFactorySyncFS.upLoadTrackMobile(localStorage.getItem('authentication_id') + '/tracks/' + item.record.get('Id') + '.txt').then(function () {
                            item.record.set('up', true);
                            item.record.set('changedOn', dataFactoryAlive.getTimestamp());
                            syncUpdate(store, item, operation, phantomWas, dirtyWas);
                          }, function () {
                            syncUpdate(store, item, operation, phantomWas, dirtyWas);
                          });
                        }, 500);
                      } else {
                        syncUpdate(store, item, operation, phantomWas, dirtyWas);
                      }
                    } else {
                      syncUpdate(store, item, operation, phantomWas, dirtyWas);
                    }
                  }

                })(store, item);
              } else {

                if (item.dirty === true) {

                  if (item.record.Id !== null && item.record.Id !== '' && item.record.Id !== '0') {

                    (function (store, item) {

                      //console.log(store.storeId + ' dataFactoryStore syncUp DIRTY saving item.record: ', item.record.get('Id'));
                      //
                      // Indien bij dit model een attachment hoort dan eerst uploaden.
                      // Indien niet corrrect uploaden dan dit model niet upsyncen.
                      //
                      var dirtyWas = item.dirty;
                      var phantomWas = item.phantom;
                      var operation = 'POST';

                      item.phantom = false;
                      item.dirty = false;
                      if (store.delaySyncUpTime !== 0) {
                        dataFactoryStore.delayedSyncUpUpdate(store, item, operation, phantomWas, dirtyWas);
                      } else {
                        syncUpdate(store, item, operation, phantomWas, dirtyWas);
                      }
                    })(store, item);
                  } else {

                    //console.error(store.storeId + ' syncUp DIRTY update ERROR Id onbekend');
                  }
                }
              }
            })(store, item);
          });
          q.resolve();
        } else {
          q.resolve();
        }

        //console.log(store.storeId + ' aantal removedRecords: ' + store.removedRecords.length);
      } else {

        //console.error(store.storeId + ' storeSyncUp ERROR NOT ENABLED');

        q.resolve('NOT ENABLED');
      }

      return q.promise;
    };
    var done, todo;

    function watchStoreInit(store) {
      done += 1;
      //console.error(store.storeId + ' dataFactoryStore watchInitStore done, todo: ', done, todo);
      if (done >= todo) {
        //console.warn(store.storeId + ' dataFactoryStore watchStoreInit done');
        //console.log('===============================================================================================================');
        //console.log(store.storeId + ' dataFactoryStore watchStoreInit READY done, todo: ', done, todo);
        //console.log('===============================================================================================================');
      }
    }

    function loadStore(store, results) {

      var q = $q.defer();

      var masterStore = store.storeId;

      //console.log('loadStore loading ' + store.storeId + ': ', results.length);
      dataFactoryStore.clear(store).then(function () {


        loDash.each(results, function (result) {

          var item = {};
          item.phantom = false;
          item.dirty = false;

          item.record = dataFactoryHelper.RecordToModel(store, result);
          //console.log(store.storeId + ' loadStore item: ', item.record.get('Id'));

          var found = loDash.find(store.data, function (dataItem) {
            return dataItem.record.get('Id') === item.record.get('Id');
          });

          if (!found) {
            store.data.push(item);
          }
        });
        //console.warn('loadStore ' + masterStore + ' store.data: ', store.data);
        store.loaded = true;
        store.store = loDash.map(store.data, 'record');
        //console.warn('loadStore ' + store.storeId + ' SUCCESS store.store: ', store.store);

        q.resolve();
      });

      return q.promise;
    }

    dataFactoryStore.storeInitAll = function (store, storeSup, storeTag, Tag, storeReactie, storeReactieSup) {

      var q = $q.defer();

      var masterStore = store.storeId;

      //console.warn('dataFactoryStore.storeInitAll ' + masterStore);

      dataFactoryStore.initialLoadAll(store).then(function (data) {

        //console.log(masterStore + ' initialLoadAll newSyncDate: ', data.newSyncDate);
        //console.log(masterStore + ' dataFactoryStore.initialLoadAll data: ', data);

        var newSyncDate = data.newSyncDate;

        //console.log(masterStore + ' after initialLoadAll update newSyncDate: ', newSyncDate);

        if (data && data.results && data.results.length > 0) {
          //console.log(store.storeId + ' dataFactoryStore.syncDownAll data: ', data.results.length, data, data.results);
        }

        if (data && data.results && data.results.length > 0) {

          var promises = [];

          //console.log('initialLoadAll loop over ' + masterStore);

          if (masterStore === 'bericht') {

            loDash.each(data.results, function (result) {

              var results;

              if (result.bericht && result.bericht.length > 0) {
                results = result.bericht;
              }
              if (result.berichtsup && result.berichtsup.length > 0) {
                store = storeSup;
                results = result.berichtsup;
              }
              if (result.berichttag && result.berichttag.length > 0) {
                store = storeTag;
                results = result.berichttag;
              }
              if (result.tag && result.tag.length > 0) {
                store = Tag;
                results = result.tag;
              }
              if (result.berichtreactie && result.berichtreactie.length > 0) {
                store = storeReactie;
                results = result.berichtreactie;
              }
              if (result.berichtreactiesup && result.berichtreactiesup.length > 0) {
                store = storeReactieSup;
                results = result.berichtreactiesup;
              }

              if (store) {
                promises.push(loadStore(store, results));
              }
            });
          }

          if (masterStore === 'poi') {

            loDash.each(data.results, function (result) {

              var results;

              if (result.poi && result.poi.length > 0) {
                results = result.poi;
              }
              if (result.poisup && result.poisup.length > 0) {
                store = storeSup;
                results = result.poisup;
              }
              if (result.poitag && result.poitag.length > 0) {
                store = storeTag;
                results = result.poitag;
              }
              if (result.tag && result.tag.length > 0) {
                store = Tag;
                results = result.tag;
              }
              if (result.poireactie && result.poireactie.length > 0) {
                store = storeReactie;
                results = result.poireactie;
              }
              if (result.poireactiesup && result.poireactiesup.length > 0) {
                store = storeReactieSup;
                results = result.poireactiesup;
              }

              if (store) {
                promises.push(loadStore(store, results));
              }
            });
          }

          if (masterStore === 'foto') {

            loDash.each(data.results, function (result) {

              var results;
              if (result.foto && result.foto.length > 0) {
                results = result.foto;
              }
              if (result.fotosup && result.fotosup.length > 0) {
                store = storeSup;
                results = result.fotosup;
              }
              if (result.fototag && result.fototag.length > 0) {
                store = storeTag;
                results = result.fototag;
              }
              if (result.tag && result.tag.length > 0) {
                store = Tag;
                results = result.tag;
              }
              if (result.fotoreactie && result.fotoreactie.length > 0) {
                store = storeReactie;
                results = result.fotoreactie;
              }
              if (result.fotoreactiesup && result.fotoreactiesup.length > 0) {
                store = storeReactieSup;
                results = result.fotoreactiesup;
              }

              if (store) {
                promises.push(loadStore(store, results));
              }
            });
          }

          if (masterStore === 'track') {

            loDash.each(data.results, function (result) {

              var results;

              if (result.track && result.track.length > 0) {
                results = result.track;
              }
              if (result.tracksup && result.tracksup.length > 0) {
                store = storeSup;
                results = result.tracksup;
              }
              if (result.tracktag && result.tracktag.length > 0) {
                store = storeTag;
                results = result.tracktag;
              }
              if (result.tag && result.tag.length > 0) {
                store = Tag;
                results = result.tag;
              }
              if (result.trackreactie && result.trackreactie.length > 0) {
                store = storeReactie;
                results = result.trackreactie;
              }
              if (result.trackreactiesup && result.trackreactiesup.length > 0) {
                store = storeReactieSup;
                results = result.trackreactiesup;
              }

              if (store) {
                promises.push(loadStore(store, results));
              }
            });
          }

          $q.all(promises).then(function () {
            //console.log(masterStore + ' initialLoadAll SUCCESS');
            q.resolve(newSyncDate);
          });
        } else {
          q.resolve(newSyncDate);

        }

        //console.error('InitialLoaddAll finished with lastSyncDate en loaded: ', newSyncDate, store.lastSyncDate, store.loaded);
      }, function (err) {
        //console.error(masterStore + ' initialLoadAll GET ERROR: ', err);
        store.loaded = true;
        q.resolve();
      });

      return q.promise;
    };
    /**
     * Load store met alle records van backend
     * Set lastSyncDate
     * @requires store
     * @return {Object}       promise.resolve: store (gefilterde) Modellen
     */
    dataFactoryStore.storeInit = function (store, Id) {

      var q = $q.defer();

      var aantal = 0;
      done = 0;
      todo = 0;

      //console.warn('dataFactoryStore.storeInit ' + store.storeId);
      dataFactoryStore.clear(store).then(function () {

        dataFactoryStore.initialLoad(store).then(function (data) {

          //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad newSyncDate: ', data.newSyncDate);

          aantal = data.results.length;
          todo = data.results.length;

          var results = data.results;

          if (data.newSyncDate !== undefined) {
            if (data.newSyncDate === false) {
              data.newSyncDate = '1970-01-02 00:00:00';
            }
            store.lastSyncDate = data.newSyncDate;
            //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad result newSyncDate in store: ', store.lastSyncDate);

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(store, data.newSyncDate);
            }

          } else {
            store.lastSyncDate = '1970-01-02 00:00:00';
            //console.error(store.storeId + ' dataFactoryStore.storeInit initialLoad result newSyncDate in store: ', store.lastSyncDate);

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(store, '1970-01-02 00:00:00');
            }

          }

          loDash.each(results, function (result) {

            var item = {};
            item.phantom = false;
            item.dirty = false;

            item.record = dataFactoryHelper.RecordToModel(store, result);
            //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad item: ', item.record.get('Id'));

            var found = loDash.find(store.data, function (dataItem) {
              return dataItem.record.get('Id') === item.record.get('Id');
            });

            if (!found) {
              store.data.push(item);
              //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad item pushed in data aantal: ', store.data.length);
            }
          });

          store.loaded = true;
          //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad update loaded: ', store.loaded);
          store.store = loDash.map(store.data, 'record');

          //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad SUCCESS: ', store.store, store.store.length);

          q.resolve(store.store.length);

        }, function () {
          //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad no data ERROR');
          //store.loaded = true;
          q.resolve(0);
        });
      }, function () {
        q.resolve(0);
      });

      return q.promise;
    };

    dataFactoryStore.reStore = function (store) {

      var q = $q.defer();

      var aantal = 0;
      done = 0;
      todo = 0;

      //console.warn('dataFactoryStore.reStore ' + store.storeId);

      dataFactoryStore.initialLoad(store).then(function (data) {

        //console.warn(store.storeId + ' dataFactoryStore.reStore initialLoad newSyncDate: ', data.newSyncDate);

        aantal = data.results.length;
        todo = data.results.length;

        var results = data.results;

        if (data.newSyncDate !== undefined) {
          if (data.newSyncDate === false) {
            data.newSyncDate = '1970-01-02 00:00:00';
          }
          store.lastSyncDate = data.newSyncDate;
          //console.warn(store.storeId + ' dataFactoryStore.reStore initialLoad result newSyncDate in store: ', store.lastSyncDate);

          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            dataFactorySyncFS.updateLastSyncDate(store, data.newSyncDate);
          }

        } else {
          store.lastSyncDate = '1970-01-02 00:00:00';
          //console.error(store.storeId + ' dataFactoryStore.storeInit initialLoad result newSyncDate in store: ', store.lastSyncDate);

          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            dataFactorySyncFS.updateLastSyncDate(store, '1970-01-02 00:00:00');
          }

        }

        loDash.each(results, function (result) {

          var item = {};
          item.phantom = false;
          item.dirty = false;

          item.record = dataFactoryHelper.RecordToModel(store, result);
          //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad item: ', item.record.get('Id'));

          var found = loDash.find(store.data, function (dataItem) {
            return dataItem.record.get('Id') === item.record.get('Id');
          });

          if (!found) {
            store.data.push(item);
            //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad item pushed in data aantal: ', store.data.length);
          }
        });

        store.loaded = true;
        //console.log(store.storeId + ' dataFactoryStore.storeInit initialLoad update loaded: ', store.loaded);
        store.store = loDash.map(store.data, 'record');

        //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad SUCCESS: ', store.store, store.store.length);

        q.resolve(store.store.length);

      }, function () {
        //console.warn(store.storeId + ' dataFactoryStore.storeInit initialLoad no data ERROR');
        //store.loaded = true;
        q.resolve(0);
      });

      return q.promise;
    };

    return dataFactoryStore;
  }
]);
