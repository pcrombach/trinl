'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryGroepen', ['loDash', '$interval', 'dataFactoryStore', 'dataFactoryAlive',
  function (loDash, $interval, dataFactoryStore, dataFactoryAlive) {

    //console.warn('dataFactoryGroepen');

    var dataFactoryGroepen = {};
    var me = dataFactoryGroepen;

    me.storeId = 'groepen';

    me.fsEnable = true;
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

    me.global = false;

    me.loaded = false;
    me.autoSync = true;
    me.enableSyncUp = true;
    me.enableSyncDown = true;
    me.delaySyncUpTime = 0;

    me.remoteSync = true;

    me.currentPage = 1;
    me.pageSize = 100;

    me.xprive = '';

    me.Model = function (config) {

      if (config === undefined) {
        config = {};
      }

      this.Id = {
        value: config.Id || '0',
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
      this.gebruikerId = {
        value: config.gebruikerId || '',
        dirty: false,
        type: 'string'
      };
      this.groep = {
        value: config.groep || '',
        dirty: false,
        type: 'string'
      };

      return this;
    };

    me.Model.prototype = {
      get: function (prop) {
        //console.log(me.storeId + ' get: ' + prop);
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
        return me.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        if (me.idProperty !== '') {
          m.set(me.idProperty, localStorage.getItem('authentication_id'));
        }
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
        var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === Id) {
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
          if (field !== true && field !== false) {
            console.log('groepen unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = false;
            return false;
          }
        });
        //console.log('unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        //console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(me.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('set: ', m);
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
          var Id = m.get('Id');
          loDash.each(me.data, function (item) {
            if (item.record.get('Id') === Id) {
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
      return dataFactoryStore.clear(dataFactoryGroepen);
    };

    me.clearFilter = function () {
      return dataFactoryStore.clearFilter(dataFactoryGroepen);
    };

    me.clearSorter = function () {
      return dataFactoryStore.clearSorter(dataFactoryGroepen);
    };

    me.count = function () {
      return dataFactoryStore.count(dataFactoryGroepen);
    };

    me.filter = function (prop, value) {
      return dataFactoryStore.filter(me, prop, value);
    };

    me.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    me.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    me.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    me.first = function () {
      return dataFactoryStore.first(dataFactoryGroepen);
    };

    me.getAt = function (index) {
      return dataFactoryStore.getAt(me, index);
    };

    me.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    me.getCount = function () {
      return dataFactoryStore.getCount(dataFactoryGroepen);
    };

    me.getStoreId = function () {
      return dataFactoryStore.getStoreId(dataFactoryGroepen);
    };

    me.getRange = function (start, end) {
      return dataFactoryStore.getRange(me, start, end);
    };

    me.initLoad = function () {
      return dataFactoryStore.initLoad(dataFactoryGroepen);
    };

    me.isFiltered = function () {
      return dataFactoryStore.isFiltered(dataFactoryGroepen);
    };

    me.isLoaded = function () {
      return dataFactoryStore.isLoaded(dataFactoryGroepen);
    };

    me.isSorted = function () {
      return dataFactoryStore.isSorted(dataFactoryGroepen);
    };

    me.last = function () {
      return dataFactoryStore.last(dataFactoryGroepen);
    };

    me.addData = function (record) {
      return dataFactoryStore.addData(me, record);
    };

    me.nextPage = function () {
      return dataFactoryStore.nextPage(dataFactoryGroepen);
    };

    me.previousPage = function () {
      return dataFactoryStore.previousPage(dataFactoryGroepen);
    };

    me.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    me.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
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
      return dataFactoryStore.storeInit(dataFactoryGroepen);
    };

    me.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    me.sync = function () {
      return dataFactoryStore.syncUp(dataFactoryGroepen)
        .then(dataFactoryStore.syncDown(dataFactoryGroepen));
    };

    me.syncUp = function () {
      return dataFactoryStore.syncUp(dataFactoryGroepen);
    };

    me.syncDown = function (update) {
      return dataFactoryStore.syncDown(dataFactoryGroepen, update);
    };

    me.init = function () {
      //console.warn('dataFactoryGroepen init');
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
      var interval = $interval(function () {
        if (localStorage.getItem('authentication_token') !== null) {
          $interval.cancel(interval);
          me.storeInit().then(function () {
            console.log('dataFactoryGroepen initieel loaded');
          });
        }
      }, 10, 200);
    };

    me.init();

    return dataFactoryGroepen;

  }]);
