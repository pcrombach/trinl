/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryCeo', ['BASE', 'loDash', '$rootScope', '$q', '$ionicPlatform', 'dataFactoryGebruiker', 'dataFactoryHelper', 'dataFactoryStore', 'dataFactorySyncFS', 'dataFactoryProxy', 'dataFactoryAlive',
  function (BASE, loDash, $rootScope, $q, $ionicPlatform, dataFactoryGebruiker, dataFactoryHelper, dataFactoryStore, dataFactorySyncFS, dataFactoryProxy, dataFactoryAlive) {

    //console.warn('dataFactoryCeo');

    var dataFactoryCeo = {};
    var me = dataFactoryCeo;

    dataFactoryCeo.appVersion = '+++++';

    dataFactoryCeo.storeId = 'ceo';

    dataFactoryCeo.fsEnable = false;
    dataFactoryCeo.fsReady = false;

    dataFactoryCeo.idProperty = '';

    dataFactoryCeo.data = [];
    dataFactoryCeo.store = [];
    dataFactoryCeo.removedRecords = [];

    dataFactoryCeo.nieuw = [];
    dataFactoryCeo.star = [];

    dataFactoryCeo.current = '';
    dataFactoryCeo.currentModel = {};
    dataFactoryCeo.selected = [];
    dataFactoryCeo.filters = [];
    dataFactoryCeo.sorters = [];
    dataFactoryCeo.actualTime = '1970-01-02 00:00:00';

    dataFactoryCeo.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryCeo.loaded = false;
    dataFactoryCeo.autoSync = true;
    dataFactoryCeo.enableSyncUp = true;
    dataFactoryCeo.enableSyncDown = true;
    dataFactoryCeo.delaySyncUpTime = 0;

    dataFactoryCeo.remoteSync = true;

    dataFactoryCeo.currentPage = 1;
    dataFactoryCeo.pageSize = 100;

    dataFactoryCeo.xprive = '0';
    /**
     * Extra
     * @type {Object}
     */
    dataFactoryCeo.ceoXModel = {};

    dataFactoryCeo.Model = function (config) {

      if (config === undefined) {
        config = {};
      }

      this.Id = {
        value: config.Id || '',
        dirty: false,
        type: 'string'
      };
      this.createdOn = {
        value: config.createdOn || '1970-01-02 00:00:00',
        dirty: false,
        type: 'date'
      };
      this.changedOn = {
        value: config.changedOn || '1970-01-02 00:00:00',
        dirty: false,
        type: 'date'
      };
      this.deletedOn = {
        value: config.deletedOn || '1970-01-02 00:00:00',
        dirty: false,
        type: 'date'
      };
      this.avatar = {
        value: config.avatar || '',
        dirty: false,
        type: 'string'
      };
      this.emailadres = {
        value: config.emailadres || '',
        dirty: false,
        type: 'string'
      };
      this.geactiveerd = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.geactiveerd === true) {
        this.geactiveerd.value = true;
      }
      this.hash = {
        value: config.hash || '',
        dirty: false,
        type: 'string'
      };
      this.isRegistreer = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.isRegistreer === true) {
        this.isRegistreer.value = true;
      }
      this.persoonId = {
        value: config.persoonId || '',
        dirty: false,
        type: 'string'
      };
      this.gebruikerNaam = {
        value: config.gebruikerNaam || '',
        dirty: false,
        type: 'string'
      };
      this.profielId = {
        value: config.profielId || '1',
        dirty: false,
        type: 'string'
      };
      this.profiel = {
        value: config.profiel || 'anoniem',
        dirty: false,
        type: 'string'
      };
      this.admin = {
        value: config.admin || 0,
        dirty: false,
        type: 'int'
      };
      this.uitgelogd = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.uitgelogd === false) {
        this.uitgelogd.value = false;
      }
      this.tmp = {
        value: config.tmp || '',
        dirty: false,
        type: 'string'
      };
      this.randid = {
        value: config.randid || makeid(24),
        dirty: false,
        type: 'string'
      };

      return this;
    };

    dataFactoryCeo.Model.prototype = {
      get: function (prop) {
        var m = this;
        if (m[prop] !== undefined) {
          return m[prop].value;
        } else {
          return null;
        }
      },
      getId: function () {
        var m = this;
        return m.get('Id');
      },
      remove: function () {
        var m = this;
        m.unsetAll();
        m.set('deletedOn', dataFactoryAlive.getTimestamp());
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        m.set('profielId', m.get('profielId'));

        return dataFactoryCeo.remove(m);
      },
      save: function () {
        var m = this;

        m.set('changedOn', dataFactoryAlive.getTimestamp());
        return dataFactoryCeo.save(m);
      },
      setAll: function () {
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryCeo.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return true;
          }
        });
        return m;
      },
      unsetAll: function () {
        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          field.dirty = false;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryCeo.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = false;
            return false;
          }
        });
        return m;
      },
      set: function (prop, value) {
        var m = this;
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactoryCeo.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        return m;
      },
      unset: function (prop) {
        var m = this;
        m[prop].dirty = false;

        var tmp = false;
        loDash.each(m, function (field) {
          if (field.dirty === true) {
            tmp = true;
            return false;
          }
        });
        if (tmp === false) {
          var Id = m.get('Id');
          loDash.each(dataFactoryCeo.data, function (item) {
            if (item.record.get('Id') === Id) {
              item.dirty = false;
              return false;
            }
          });
        }

        return m;
      },
      setId: function (Id) {
        var m = this;
        m.set('Id', Id);
        loDash.each(dataFactoryCeo.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });

        return m;
      }
    };

    dataFactoryCeo.setIdProperty = function (idProperty) {
      return dataFactoryStore.setIdProperty(idProperty);
    };

    dataFactoryCeo.addFilter = function (params) {
      return dataFactoryStore.addFilter(me, params);
    };

    dataFactoryCeo.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactoryCeo.clearFilter = function () {
      return dataFactoryStore.clearFilter(me);
    };

    dataFactoryCeo.clearSorter = function () {
      return dataFactoryStore.clearSorter(me);
    };

    dataFactoryCeo.count = function () {
      return dataFactoryStore.count(me);
    };

    dataFactoryCeo.filter = function (prop, value) {
      return dataFactoryStore.filter(me, prop, value);
    };

    dataFactoryCeo.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactoryCeo.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactoryCeo.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryCeo.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactoryCeo.getAt = function (index) {
      return dataFactoryStore.getAt(me, index);
    };

    dataFactoryCeo.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactoryCeo.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactoryCeo.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactoryCeo.getRange = function (start, end) {
      return dataFactoryStore.getRange(me, start, end);
    };

    dataFactoryCeo.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactoryCeo.isFiltered = function () {
      return dataFactoryStore.isFiltered(me);
    };

    dataFactoryCeo.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactoryCeo.isSorted = function () {
      return dataFactoryStore.isSorted(me);
    };

    dataFactoryCeo.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactoryCeo.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactoryCeo.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactoryCeo.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactoryCeo.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactoryCeo.removeAll = function () {
      return dataFactoryStore.removeAll(me);
    };

    dataFactoryCeo.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactoryCeo.setFilter = function (params) {
      return dataFactoryStore.setFilter(me, params);
    };

    dataFactoryCeo.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactoryCeo.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactoryCeo.setSorter = function (params) {
      return dataFactoryStore.setSorter(me, params);
    };

    dataFactoryCeo.sort = function (prop, dir) {
      return dataFactoryStore.sort(me, prop, dir);
    };

    dataFactoryCeo.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactoryCeo.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactoryCeo.sync = function () {

      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactoryCeo.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactoryCeo.syncDown = function () {
      return dataFactoryStore.syncDown(me);
    };

    dataFactoryCeo.getCeoMobiel = function () {

      //console.warn('dataFactoryCeo getCeoMobiel');

      var q = $q.defer();

      dataFactoryCeo.getFileSystem().then(function () {

        //console.warn('dataFactoryCeo getCeoMobiel getFileSystem');

        q.resolve();
      }, function (err) {
        q.reject(err);

        //console.error('dataFactoryCeo getCeoMobiel getFileSystem ERROR: ', err);

      });

      return q.promise;
    };

    dataFactoryCeo.getFileSystem = function () {

      //console.warn('dataFactoryCeo getFilesystem');

      var q = $q.defer();

      dataFactorySyncFS.readFSCeo(dataFactoryCeo).then(function (ceoModel) {

        ceoModel.setAll();

        dataFactoryGebruiker.addData(ceoModel).then(function () {

          dataFactoryCeo.update(ceoModel).then(function () {

            //console.log('dataFactoryCeo getCeoDesktop getFileSystem, update SUCCESS: ', ceoModel);
            q.resolve();
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('dataFactoryCeo kan ceo niet wijzigen: ', err);
          });
        }, function () {
          dataFactoryCeo.update(ceoModel).then(function () {

            //console.log('dataFactoryCeo getCeoDesktop getFileSystem, update with addData error SUCCESS: ', ceoModel);
            q.resolve();
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('dataFactroyCeo kan ceo niet wijzigen: ', err);
          });
        });

      }, function (err) {

        //console.error('dataFactoryCeo getFilesystem readFSCeo ERROR: ', err);
        q.reject('dataFactoryCeo getFilesystem readFSCEo ERROR: ', err);
      });

      return q.promise;
    };

    dataFactoryCeo.getCeoDesktop = function () {

      //console.warn('dataFactoryCeo getCeoDesktop');

      var q = $q.defer();

      dataFactoryCeo.getLocalStorage().then(function (ceoModel) {

        dataFactoryGebruiker.addData(ceoModel).then(function () {
          dataFactoryCeo.currentModel = ceoModel;
          ceoModel.setAll();
          dataFactoryCeo.update(ceoModel).then(function () {

            //console.log('dataFactoryCeo getCeoDesktop getLocalStorage, update SUCCESS: ', ceoModel);
            q.resolve();
          });
        });

      }, function (err) {

        //console.error('dataFactoryCeo getCeoDesktop getLocalStorage ERROR: ', err);
        q.reject('dataFactoryCeo getCeoDesktop getLocalStorage ERROR: ', err);
      });

      return q.promise;
    };
    /**
     * [getConfig description]
     * @return {[type]} [description]
     */
    dataFactoryCeo.getLocalStorage = function () {

      var q = $q.defer();

      var ceo = localStorage.getItem('ceo');

      //console.log('dataFactoryCeo getLocalStorage ceo: ', ceo);

      if (ceo !== null) {

        var ceoModel = dataFactoryHelper.StringToModel(dataFactoryCeo, ceo);

        //console.log('dataFactoryCeo getLocalStorage SUCCESS: ', ceoModel);

        q.resolve(ceoModel);

      } else {

        //console.error('dataFactoryCeo getLocalStorage ERROR');

        q.reject('dataFactoryCeo getLocalStorage NOT FOUND');
      }

      return q.promise;
    };

    dataFactoryCeo.update = function (ceoModel) {

      //console.log('==================================================');
      //console.log('dataFactoryCeo.update ceoModel: ', ceoModel);
      //console.log('==================================================');

      var q = $q.defer();

      ceoModel.save().then(function () {

        //console.log('dataFactoryCeo update ceoModel save SUCCESS: ', ceoModel);

        dataFactoryCeo.currentModel = ceoModel;

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactoryCeo.updateFileSystem(ceoModel).then(function () {

            //console.log('dataFactoryCeo update updateFilesystem SUCCESS');
            q.resolve();
          }, function (err) {

            //console.log('dataFactoryCeo update updateFilesystem ERROR: ', err);
            q.resolve(err);
          });
        } else {
          dataFactoryCeo.updateLocalStorage(ceoModel);

          //console.log('dataFactoryCeo update updateLocalStorage SUCCESS');
          q.resolve();
        }
      }, function (err) {

        //console.error('dataFactoryCeo update ERROR: ', err);
        q.reject(err);
      });

      return q.promise;
    };
    /**
     * ceoModel oplsaan in FileSysteem root
     */
    dataFactoryCeo.updateFileSystem = function (ceoModel) {

      //console.warn('dataFactoryCeo updateFileSystem');

      var q = $q.defer();

      localStorage.setItem('authentication_id', ceoModel.get('Id'));
      //console.log('dataFactoryCeo updateFileSystem id: ', localStorage.getItem('authentication_id'));

      dataFactorySyncFS.writeFSCeo(dataFactoryCeo, ceoModel, true).then(function () {
        //console.log('FactoryCeo updateFileSystem writeFSCeo SUCCESS');
        //console.log('dataFactoryCeo updateCeo emit InitCeo');

        $rootScope.$emit('InitCeo', {
          message: 'Id set in Ceo'
        });

        q.resolve();
      }, function (err) {
        //console.error('dataFactoryCeo updateFileSystem writeFSCeo ERROR', err);
        //console.log('dataFactoryCeo updateCeo emit InitCeo');

        $rootScope.$emit('InitCeo', {
          message: 'Id set in Ceo'
        });

        q.reject(err);
      });

      return q.promise;
    };

    dataFactoryCeo.updateLocalStorage = function (ceoModel) {

      //console.warn('dataFactoryCeo updateLocalStorage');

      var ceo = dataFactoryHelper.ModelToString(dataFactoryCeo, ceoModel);

      localStorage.setItem('ceo', ceo);
      localStorage.setItem('authentication_hash', ceoModel.get('hash'));
      localStorage.setItem('authentication_id', ceoModel.get('Id'));
      localStorage.setItem('authentication_profielId', ceoModel.get('profielId'));
      if (ceoModel.get('randid') !== '') {
        localStorage.setItem('authentication_randid', ceoModel.get('randid'));
      }
      //console.log('dataFactoryCeo updateLocalStorage: ', localStorage);

      //console.log('dataFactoryCeo updateCeo emit InitCeo');

      $rootScope.$emit('InitCeo', {
        message: 'Id set in Ceo'
      });
    };
    /*
     * Get gebruiker speciale versie met hash
     * Output in dataFactoryCurrent en model in dataFactoryStore.data en store
     * Wordt niet geupdate in backend (phantom en dirty set false)
     * Promise item.record of null
     * ### beter is: promise model ipv item.record
     * LoadME wordt gebruikt in EntryCtrl en in RegistreerCtrl
     * Indien een parameter wordt meegegeven dan wordt ipv gebruikerid gezocht naar Id
     * EntryCtrl gaat tijdens het herinloggen uit van gebruikerId uit localStorage('authentication_id');
     * RegistreerCtrl gaat een nieuwe Ceo aanmaken. Deze nieuwe Id wordt als Id meegegeven aan LoadMe
     * om te wachten tot de nieuwe Ceo is geactiveerd.
     */
    dataFactoryCeo.loadMe = function (Id) {

      //console.warn('FactoryCeo.loadMe: ', Id);

      var ceoModel;

      var q = $q.defer();

      if (localStorage.getItem('authentication_id') !== null) {

        var params = {
          pageStart: 0,
          pageLimit: 1,
          gebruikerId: localStorage.getItem('authentication_id'),
          Id: null
        };
        if (Id !== undefined) {
          params.gebruikerId = null;
          params.Id = Id;
        }

        //console.warn('FactoryCeo.loadMe: ', params);

        dataFactoryProxy.http(dataFactoryCeo, 'GET', 'loadMe', params).then(function (data) {

          if (data.results[0] !== undefined) {

            ceoModel = dataFactoryHelper.RecordToModel(dataFactoryCeo, data.results[0]);
            //console.log('FactoryCeo loadMe ceoModel: ', ceoModel);
            //
            // Het ceoModel gegenereerd door loadMe is in de backend bekend maar niet in de store
            // Plaats het ceoModel gegenereerd door loadme mbv addData in de store
            // Indien de save geen model vind in de store wordt het model geinsert ipv geupdate
            //

            dataFactoryCeo.addData(ceoModel).then(function () {
              //console.log('FactoryCeo loadMe ceoModel added SUCCESS');
              q.resolve(ceoModel);
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error('FactoryCeo loadMe ceoModel added ERROR: ', err);
              q.resolve(ceoModel);
            });
          } else {
            //console.error('dataFactoryCeo loadMe ERROR');
            q.reject('Me not valid');
          }
        }, function (err) {
          //console.error('dataFactoryCeo loadMe: ', err);
          q.reject('no response from database: ', err);
        });
      } else {
        //console.error('dataFactoryCeo loadMe');
        q.reject('geen authentication_id in localStorage');
      }

      return q.promise;
    };
    /**
     * Registreer een nieuwe gebruiker
     */
    dataFactoryCeo.registreer = function (params) {

      //console.warn('FactoryCeo.registreer: ', params);

      var q = $q.defer();

      var store = {
        storeId: 'emailValidation'
      };

      dataFactoryProxy.http(store, 'POST', 'registreer_emailadres/', params).then(function (data) {
        //console.error('dataFactoryCeo.registreer in out: ', params, data);

        if (data.success) {

          q.resolve(data);
        } else {
          //console.error('dataFactoryCeo.registreer ERROR: ', data.message);
          q.reject(data.message);
        }
      }, function (err) {
        //console.error('dataFactoryCeo.registreer ERROR: ', err);
        q.reject('Registreer ERROR: ', err);
      });

      return q.promise;
    };
    /**
     * Login op reeds geregistreerde gebruiker
     */
    dataFactoryCeo.login = function (params) {

      //console.warn('FactoryCeo.login: ', params);

      var q = $q.defer();

      var store = {
        storeId: 'session'
      };

      dataFactoryProxy.http(store, 'PUT', 'login/', params).then(function (data) {

        if (data.success) {
          var ceoModel = dataFactoryHelper.RecordToModel(dataFactoryCeo, data);
          //
          // Het ceoModel gegenereerd door login is in de backend bekend maar niet in de store
          // Plaats het ceoModel gegenereerd door login mbv addData in de store
          // Indien de save het ceoModel niet in de store vindt wordt het model geinsert ipv geupdate
          //

          dataFactoryCeo.addData(ceoModel).then(function () {
            //console.log('FactoryCeo loadMe ceoModel added SUCCESS');
            q.resolve(ceoModel);
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('FactoryCeo loadMe ceoModel added ERROR: ', err);
            q.resolve(ceoModel);
          });

          //console.log('FactoryCeo login SUCCESS');

          q.resolve(ceoModel);
        } else {
          q.reject(data.message);

        }
      }, function (err) {

        //console.error('dataFactoryCeo login ERROR: ', err);
        q.reject('Login ERROR: ', err);
      });

      return q.promise;
    };

    dataFactoryCeo.setToken = function (ceoModel) {

      //console.warn('dataFactoryCeo setToken: ', ceoModel);

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        var params = {
          profielId: ceoModel.get('profielId'),
          id: ceoModel.get('Id')
        };

        var store = {
          storeId: 'session',
        };

        dataFactoryProxy.http(store, 'GET', 'generateJwtToken', params).then(function (data) {
          //console.log('dataFactoryCeo generateJwtToken: ', JSON.stringify(data));
          if (data.success) {
            localStorage.setItem('authentication_token', data.results.token);
            localStorage.setItem('authentication_hash', data.results.hash);

            //console.log('dataFactoryCeo generateJwtToken JWT in localstorage: ', localStorage.getItem('authentication_token'));
            //console.log('dataFactoryCeo generateJwtToken id in localstorage: ', localStorage.getItem('authentication_id'));
          }
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('dataFactoryCeo generateJwtToken ERROR: ', err);
          q.reject();
        });
      });

      return q.promise;

    };

    dataFactoryCeo.setTokenGebruiker = function (Id, profielId) {

      //console.warn('dataFactoryCeo setToken: ', Id, profielId);

      var q = $q.defer();

      $ionicPlatform.ready(function () {
        var params = {
          profielId: profielId,
          id: Id
        };

        var store = {
          storeId: 'session',
        };

        dataFactoryProxy.http(store, 'GET', 'generateJwtToken', params).then(function (data) {
          //console.log('dataFactoryCeo generateJwtToken: ', JSON.stringify(data));
          if (data.success) {
            localStorage.setItem('authentication_token', data.results.token);
            localStorage.setItem('authentication_hash', data.results.hash);

            //console.log('dataFactoryCeo generateJwtToken JWT in localstorage: ', localStorage.getItem('authentication_token'));
          }
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('dataFactoryCeo generateJwtToken ERROR: ', err);
          q.reject();
        });
      });

      return q.promise;

    };

    function makeid(num) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < num; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }

    dataFactoryCeo.hash = '';
    dataFactoryCeo.Id = '';
    dataFactoryCeo.randid = '';
    dataFactoryCeo.isRegistreer = '';
    dataFactoryCeo.geactiveerd = '';
    dataFactoryCeo.emailadres = '';
    dataFactoryCeo.persoonId = '';
    dataFactoryCeo.avatar = '';
    dataFactoryCeo.gebruikerNaam = '';
    dataFactoryCeo.profielId = '';
    dataFactoryCeo.uitgelogd = '';

    dataFactoryCeo.init = function () {

      //console.warn('dataFactoryCeo init');

      dataFactoryCeo.fsReady = false;
      dataFactoryCeo.loaded = false;
      dataFactoryCeo.star = [];
      dataFactoryCeo.nieuw = [];
      dataFactoryCeo.selected = [];
      dataFactoryCeo.data = [];
      dataFactoryCeo.store = [];
      dataFactoryCeo.removedRecords = [];
      dataFactoryCeo.current = '';
      dataFactoryCeo.filters = [];
      dataFactoryCeo.sorters = [];
      dataFactoryCeo.actualTime = '1970-01-02 00:00:00';
      dataFactoryCeo.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryCeo.tmpArray = [];
    };


    return me;

  }]);
