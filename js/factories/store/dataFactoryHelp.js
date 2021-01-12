'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryHelp', ['loDash', '$interval', 'dataFactoryStore', 'dataFactoryAlive',
  function (loDash, $interval, dataFactoryStore, dataFactoryAlive) {

    //console.warn('dataFactoryHelp');

    var dataFactoryHelp = {};

    dataFactoryHelp.storeId = 'help';

    dataFactoryHelp.fsEnable = true;
    dataFactoryHelp.fsReady = false;

    dataFactoryHelp.idProperty = '';

    dataFactoryHelp.data = [];
    dataFactoryHelp.store = [];
    dataFactoryHelp.removedRecords = [];

    dataFactoryHelp.nieuw = [];
    dataFactoryHelp.star = [];

    dataFactoryHelp.current = '';
    dataFactoryHelp.selected = [];
    dataFactoryHelp.filters = [];
    dataFactoryHelp.sorters = [];
    dataFactoryHelp.actualTime = '1970-01-02 00:00:00';

    dataFactoryHelp.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryHelp.tmpArray = [];

    dataFactoryHelp.loaded = false;
    dataFactoryHelp.autoSync = true;
    dataFactoryHelp.enableSyncUp = true;
    dataFactoryHelp.enableSyncDown = true;
    dataFactoryHelp.delaySyncUpTime = 0;

    dataFactoryHelp.remoteSync = true;

    dataFactoryHelp.currentPage = 1;
    dataFactoryHelp.pageSize = 100;

    dataFactoryHelp.xprive = '';

    dataFactoryHelp.Model = function (config) {

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
      this.modal = {
        value: config.modal || '',
        dirty: false,
        type: 'string'
      };
      this.naam = {
        value: config.naam || '',
        dirty: false,
        type: 'string'
      };
      this.icon = {
        value: config.icon || '',
        dirty: false,
        type: 'string'
      };
      this.help = {
        value: config.help || '',
        dirty: false,
        type: 'string'
      };

      return this;
    };

    dataFactoryHelp.Model.prototype = {
      get: function (prop) {
        //console.log(dataFactoryHelp.storeId + ' get: ' + prop);
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
        return dataFactoryHelp.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        if (dataFactoryHelp.idProperty !== '') {
          m.set(dataFactoryHelp.idProperty, localStorage.getItem('authentication_id'));
        }
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        //console.log('save: ', m);
        return dataFactoryHelp.save(m);
      },
      setAll: function () {
        //console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryHelp.data, function (item) {
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
            console.log('help unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryHelp.data, function (item) {
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
        loDash.each(dataFactoryHelp.data, function (item) {
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
          loDash.each(dataFactoryHelp.data, function (item) {
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
        loDash.each(dataFactoryHelp.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactoryHelp.addFilter = function (params) {
      return dataFactoryStore.addFilter(dataFactoryHelp, params);
    };

    dataFactoryHelp.clear = function () {
      return dataFactoryStore.clear(dataFactoryHelp);
    };

    dataFactoryHelp.clearFilter = function () {
      return dataFactoryStore.clearFilter(dataFactoryHelp);
    };

    dataFactoryHelp.clearSorter = function () {
      return dataFactoryStore.clearSorter(dataFactoryHelp);
    };

    dataFactoryHelp.count = function () {
      return dataFactoryStore.count(dataFactoryHelp);
    };

    dataFactoryHelp.filter = function (prop, value) {
      return dataFactoryStore.filter(dataFactoryHelp, prop, value);
    };

    dataFactoryHelp.find = function (prop, value) {
      return dataFactoryStore.find(dataFactoryHelp, prop, value);
    };

    dataFactoryHelp.findBy = function (fn) {
      return dataFactoryStore.findBy(dataFactoryHelp, fn);
    };

    dataFactoryHelp.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(dataFactoryHelp, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryHelp.first = function () {
      return dataFactoryStore.first(dataFactoryHelp);
    };

    dataFactoryHelp.getAt = function (index) {
      return dataFactoryStore.getAt(dataFactoryHelp, index);
    };

    dataFactoryHelp.getById = function (Id) {
      return dataFactoryStore.getById(dataFactoryHelp, Id);
    };

    dataFactoryHelp.getCount = function () {
      return dataFactoryStore.getCount(dataFactoryHelp);
    };

    dataFactoryHelp.getStoreId = function () {
      return dataFactoryStore.getStoreId(dataFactoryHelp);
    };

    dataFactoryHelp.getRange = function (start, end) {
      return dataFactoryStore.getRange(dataFactoryHelp, start, end);
    };

    dataFactoryHelp.initLoad = function () {
      return dataFactoryStore.initLoad(dataFactoryHelp);
    };

    dataFactoryHelp.isFiltered = function () {
      return dataFactoryStore.isFiltered(dataFactoryHelp);
    };

    dataFactoryHelp.isLoaded = function () {
      return dataFactoryStore.isLoaded(dataFactoryHelp);
    };

    dataFactoryHelp.isSorted = function () {
      return dataFactoryStore.isSorted(dataFactoryHelp);
    };

    dataFactoryHelp.last = function () {
      return dataFactoryStore.last(dataFactoryHelp);
    };

    dataFactoryHelp.addData = function (record) {
      return dataFactoryStore.addData(dataFactoryHelp, record);
    };

    dataFactoryHelp.nextPage = function () {
      return dataFactoryStore.nextPage(dataFactoryHelp);
    };

    dataFactoryHelp.previousPage = function () {
      return dataFactoryStore.previousPage(dataFactoryHelp);
    };

    dataFactoryHelp.remove = function (record) {
      return dataFactoryStore.remove(dataFactoryHelp, record);
    };

    dataFactoryHelp.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactoryHelp.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(dataFactoryHelp, bool);
    };

    dataFactoryHelp.setFilter = function (params) {
      return dataFactoryStore.setFilter(dataFactoryHelp, params);
    };

    dataFactoryHelp.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(dataFactoryHelp, size);
    };

    dataFactoryHelp.setPrive = function (bool) {
      return dataFactoryStore.setPrive(dataFactoryHelp, bool);
    };

    dataFactoryHelp.setSorter = function (params) {
      return dataFactoryStore.setSorter(dataFactoryHelp, params);
    };

    dataFactoryHelp.sort = function (prop, dir) {
      return dataFactoryStore.sort(dataFactoryHelp, prop, dir);
    };

    dataFactoryHelp.storeInit = function () {
      return dataFactoryStore.storeInit(dataFactoryHelp);
    };

    dataFactoryHelp.save = function (model) {
      return dataFactoryStore.save(dataFactoryHelp, model);
    };

    dataFactoryHelp.sync = function () {
      return dataFactoryStore.syncUp(dataFactoryHelp)
        .then(dataFactoryStore.syncDown(dataFactoryHelp));
    };

    dataFactoryHelp.syncUp = function () {
      return dataFactoryStore.syncUp(dataFactoryHelp);
    };

    dataFactoryHelp.syncDown = function (update) {
      return dataFactoryStore.syncDown(dataFactoryHelp, update);
    };

    dataFactoryHelp.init = function () {
      //console.warn('dataFactoryHelp init');
      dataFactoryHelp.fsReady = false;
      dataFactoryHelp.loaded = false;
      dataFactoryHelp.star = [];
      dataFactoryHelp.nieuw = [];
      dataFactoryHelp.selected = [];
      dataFactoryHelp.data = [];
      dataFactoryHelp.store = [];
      dataFactoryHelp.removedRecords = [];
      dataFactoryHelp.current = '';
      dataFactoryHelp.filters = [];
      dataFactoryHelp.sorters = [];
      dataFactoryHelp.actualTime = '1970-01-02 00:00:00';
      dataFactoryHelp.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryHelp.tmpArray = [];
      var interval = $interval(function () {
        if (localStorage.getItem('authentication_token') !== null) {
          $interval.cancel(interval);
          dataFactoryHelp.storeInit();
        }
      }, 10, 200);
    };

    dataFactoryHelp.init();

    return dataFactoryHelp;

  }]);
