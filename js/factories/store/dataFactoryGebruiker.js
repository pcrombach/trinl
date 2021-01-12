'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryGebruiker', ['loDash', 'dataFactoryStore', 'dataFactoryAlive',
  function (loDash, dataFactoryStore, dataFactoryAlive) {

    //console.warn('dataFactoryGebruiker');

    var dataFactoryGebruiker = {};
    var me = dataFactoryGebruiker;

    me.storeId = 'gebruiker';

    me.fsEnable = false;
    me.fsReady = false;

    me.idProperty = '';

    me.data = [];
    me.store = [];
    me.removedRecords = [];

    me.nieuw = [];
    me.star = [];

    me.current = '';
    me.selected = [];
    me.filters = [];
    me.sorters = [];
    me.actualTime = '1970-01-02 00:00:00';

    me.lastSyncDate = '1970-01-02 00:00:00';

    me.tmpArray = [];

    me.loaded = false;
    me.autoSync = true;
    me.enableSyncUp = true;
    me.enableSyncDown = true;
    me.delaySyncUpTime = 0;

    me.remoteSync = true;

    me.currentPage = 1;
    me.pageSize = 100;

    me.xprive = '0';

    me.Model = function (config) {

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
      this.isRegistreer = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.isRegistreer === true) {
        this.isRegistreer.value = true;
      }
      this.emailadres = {
        value: config.emailadres || '',
        dirty: false,
        type: 'string'
      };
      this.dbtoken = {
        value: config.dbtoken || '',
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
      this.profielId = {
        value: config.profielId || '',
        dirty: false,
        type: 'string'
      };
      this.profiel = {
        value: config.profiel || '',
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
      this.xprive = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.xprive === false) {
        this.xprive.value = false;
      }

      return this;
    };

    me.Model.prototype = {
      get: function (prop) {
        //console.log('get: ' + prop);
        var m = this;
        if (m[prop] !== undefined) {
          //console.log('get: ' + m[prop].value);
          return m[prop].value;
        } else {
          return null;
        }
      },
      getId: function () {
        var m = this;
        //console.log('getId: ' + m.get['Id']);
        return m.get('Id');
      },
      remove: function () {
        var m = this;
        //console.log('remove : ' + JSON.stringify(m));
        m.unsetAll();
        m.set('deletedOn', dataFactoryAlive.getTimestamp());
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        m.set('profielId', m.get('profielId'));
        return me.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        //console.log('save: ', m);
        return me.save(m);
      },
      setAll: function () {
        //console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        //            var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        //console.log('unsetAll');
        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          field.dirty = false;
        });
        //            var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        //console.log('unsetAll: ' + JSON.stringify(m));
        return m;
      },
      set: function (prop, value) {
        var m = this;
        //console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        //            var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('set: ' + JSON.stringify(m));
        return m;
      },
      unset: function (prop) {
        //console.log('setAll');
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
          //                var Id = m.get('Id');
          loDash.each(me.data, function (item) {
            if (item.record.get('Id') === m.Id) {
              item.dirty = false;
              return false;
            }
          });
        }
        //console.log('unset: ' + JSON.stringify(m));

        return m;
      },
      setId: function (Id) {
        var m = this;
        //console.log('setId record: ' + Id);
        m.set('Id', Id);
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    me.addFilter = function (params) {
      return dataFactoryStore.addFilter(me, params);
    };

    me.clear = function () {
      return dataFactoryStore.clear(me);
    };

    me.clearFilter = function () {
      return dataFactoryStore.clearFilter(me);
    };

    me.clearSorter = function () {
      return dataFactoryStore.clearSorter(me);
    };

    me.count = function () {
      return dataFactoryStore.count(me);
    };

    me.filter = function (prop, value) {
      return dataFactoryStore.filter(me, prop, value);
    };

    me.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    me.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    me.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    me.first = function () {
      return dataFactoryStore.first(me);
    };

    me.getAt = function (index) {
      return dataFactoryStore.getAt(me, index);
    };

    me.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    me.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    //    me.getTotalCount = function() {
    //        return dataFactoryStore.getTotalCount(me);
    //    };

    me.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    me.getRange = function (start, end) {
      return dataFactoryStore.getRange(me, start, end);
    };

    me.last = function () {
      return dataFactoryStore.last(me);
    };

    me.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    me.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    me.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    me.loadMe = function () {
      return dataFactoryStore.loadMe(me);
    };

    me.nextPage = function () {
      dataFactoryStore.nextPage(me);
    };

    me.previousPage = function () {
      dataFactoryStore.previousPage(me);
    };

    me.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    me.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    me.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    me.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    me.setFilter = function (params) {
      return dataFactoryStore.setFilter(me, params);
    };

    me.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    me.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    me.setSorter = function (params) {
      return dataFactoryStore.setSorter(me, params);
    };

    me.sort = function (prop, dir) {
      return dataFactoryStore.sort(me, prop, dir);
    };

    me.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    me.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    me.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    me.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    me.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    me.isFiltered = function () {
      return dataFactoryStore.isFiltered(me);
    };

    me.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    me.isSorted = function () {
      return dataFactoryStore.isSorted(me);
    };

    me.init = function () {
      //console.warn('dataFactoryGebruiker init');
      me.fsReady = false;
      me.loaded = false;
      me.star = [];
      me.nieuw = [];
      me.selected = [];
      me.data = [];
      me.store = [];
      me.removedRecords = [];
      me.current = '';
      me.filters = [];
      me.sorters = [];
      me.actualTime = '1970-01-02 00:00:00';
      me.lastSyncDate = '1970-01-02 00:00:00';
      me.tmpArray = [];
    };

    return dataFactoryGebruiker;

  }]);
