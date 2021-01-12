'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryConfig', ['loDash', 'dataFactoryStore', 'dataFactoryAlive',
  function (loDash, dataFactoryStore, dataFactoryAlive) {

    //console.warn('dataFactoryConfig');

    var dataFactoryConfig = {};
    var me = dataFactoryConfig;

    me.storeId = 'config';

    me.fsEnable = false;
    me.fsReady = false;

    me.idProperty = 'gebruikerId';

    me.data = [];
    me.store = [];
    me.removedRecords = [];

    me.nieuw = [];
    me.star = [];

    me.current = '';
    me.currentModel = {};
    me.selected = [];
    me.filters = [];
    me.sorters = [];
    me.actualTime = '1970-01-02';

    me.lastSyncDate = '1970-01-02';

    me.loaded = false;
    me.autoSync = true;
    me.enableSyncUp = true;
    me.enableSyncDown = true;
    me.delaySyncUpTime = 2000;

    me.remoteSync = false;

    me.currentPage = 1;
    me.pageSize = 100;

    me.xprive = '0';

    me.Model = function (config) {

      if (config === undefined) {
        config = {};
      }
      var tmp = JSON.parse('{"lat":51.1955847,"lng":5.9926069}');
      // eslint-disable-next-line no-undef
      var latLng = L.latLng(tmp.lat, tmp.lng);

      var filterGeen = JSON.parse('{"filter": "Geen"}');
      var filterAlle = JSON.parse('{"filter": "Alle"}');
      var sorter = JSON.parse('{"predicate": "createdOn.value", "reverse": false}');

      this.Id = {
        value: config.Id || '0',
        dirty: false,
        type: 'string'
      };
      this.activity = {
        value: config.activity || 0,
        dirty: false,
        type: 'int'
      };
      this.createdOn = {
        value: config.createdOn || '1970-01-02',
        dirty: false,
        type: 'date'
      };
      this.changedOn = {
        value: config.changedOn || '1970-01-02',
        dirty: false,
        type: 'date'
      };
      this.deletedOn = {
        value: config.deletedOn || '1970-01-02',
        dirty: false,
        type: 'date'
      };
      this.gebruikerId = {
        value: config.gebruikerId || localStorage.getItem('authentication_id'),
        dirty: false,
        type: 'string'
      };
      this.virginBerichten = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.virginBerichten === false) {
        this.virginBerichten.value = false;
      }
      this.virginFotos = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.virginFotos === false) {
        this.virginFotos.value = false;
      }
      this.virginPois = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.virginPois === false) {
        this.virginPois.value = false;
      }
      this.virginTracks = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.virginTracks === false) {
        this.virginTracks.value = false;
      }
      this.berichtFilter = {
        value: config.berichtFilter || filterAlle,
        dirty: false,
        type: 'object'
      };
      this.berichtSorter = {
        value: config.berichtSorter || sorter,
        dirty: false,
        type: 'object'
      };
      this.fotoFilter = {
        value: config.fotoFilter || filterGeen,
        dirty: false,
        type: 'object'
      };
      this.fotoSorter = {
        value: config.fotoSorter || sorter,
        dirty: false,
        type: 'object'
      };
      this.poiFilter = {
        value: config.poiFilter || filterGeen,
        dirty: false,
        type: 'object'
      };
      this.poiSorter = {
        value: config.poiSorter || sorter,
        dirty: false,
        type: 'object'
      };
      this.trackFilter = {
        value: config.trackFilter || filterGeen,
        dirty: false,
        type: 'object'
      };
      this.trackSorter = {
        value: config.trackSorter || sorter,
        dirty: false,
        type: 'object'
      };
      this.platform = {
        value: config.platform || '',
        dirty: false,
        type: 'string'
      };
      this.pushToken = {
        value: config.pushToken || '',
        dirty: false,
        type: 'string'
      };
      this.appVersion = {
        value: config.appVersion || '0.0.0',
        dirty: false,
        type: 'string'
      };
      this.snelMenuPos = {
        value: config.snelMenuPos || 'r',
        dirty: false,
        type: 'string'
      };
      this.stayOpenTime = {
        value: config.stayOpenTime || '10',
        dirty: false,
        type: 'string'
      };
      this.stayOpenTimeGeoSearch = {
        value: config.stayOpenTimeGeoSearch || '10',
        dirty: false,
        type: 'string'
      };
      this.cameraDebug = {
        value: +config.cameraDebug || 0,
        dirty: false,
        type: 'int'
      };
      this.quality = {
        value: config.quality || '50',
        dirty: false,
        type: 'string'
      };
      this.destinationType = {
        value: +config.destinationType || 1,
        dirty: false,
        type: 'int'
      };
      this.sourceType = {
        value: +config.sourceType || 1,
        dirty: false,
        type: 'int'
      };
      this.encodingType = {
        value: +config.encodingType || 1,
        dirty: false,
        type: 'int'
      };
      this.targetWidth = {
        value: config.targetWidth || '320',
        dirty: false,
        type: 'string'
      };
      this.targetHeight = {
        value: config.targetHeight || '320',
        dirty: false,
        type: 'string'
      };
      this.popoverOptions = {
        value: config.popoverOptions || 'CameraPopoverOptions',
        dirty: false,
        type: 'string'
      };
      this.saveToPhotoAlbum = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.saveToPhotoAlbum === true) {
        this.saveToPhotoAlbum.value = true;
      }
      this.disclaimerConfirmed = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.disclaimerConfirmed === true) {
        this.disclaimerConfirmed.value = true;
      }
      this.notifyVibrate = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.notifyVibrate === false) {
        this.notifyVibrate.value = false;
      }
      this.notifySound = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.notifySound === false) {
        this.notifySound.value = false;
      }
      this.notifyVolume = {
        value: +config.notifyVolume || 50,
        dirty: false,
        type: 'int'
      };
      this.badgeNumber = {
        value: +config.badgeNumer || 0,
        dirty: false,
        type: 'int'
      };
      this.minOpacity = {
        value: config.minOpacity || '0',
        dirty: false,
        type: 'string'
      };
      this.orientatieroosDefault = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.orientatieroosDefault === false) {
        this.orientatieroosDefault.value = false;
      }
      this.gpsDefault = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpsDefault === true) {
        this.gpsDefault.value = true;
      }
      this.provinciegrensDefault = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.provinciegrensDefault === false) {
        this.provinciegrensDefault.value = false;
      }
      this.gpsVolgen = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpsVolgen === false) {
        this.gpsVolgen.value = false;
      }
      this.notification = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.notification === false) {
        this.notification.value = false;
      }
      this.xupdate = {
        value: config.xupdate || '0',
        dirty: false,
        type: 'string'
      };
      this.cache = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.cache === false) {
        this.cache.value = false;
      }
      this.downloaden = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.downloaden === true) {
        this.downloaden.value = true;
      }
      this.syncstart = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.syncstart === false) {
        this.syncstart.value = false;
      }
      this.synclive = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.synclive === true) {
        this.synclive.value = true;
      }
      this.defaultLatLng = {
        value: config.defaultLatLng || latLng,
        dirty: false,
        type: 'object'
      };
      this.currentTrackId = {
        value: config.currentTrackId || '',
        dirty: false,
        type: 'string'
      };
      this.zoomLevel = {
        value: +config.zoomLevel || 8,
        dirty: false,
        type: 'int'
      };

      this.crossHair = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.crossHair === false) {
        this.crossHair.value = false;
      }
      this.gpsrecord = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpsrecord === true) {
        this.gpsrecord.value = true;
      }
      this.gpswatch = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpswatch === true) {
        this.gpswatch.value = true;
      }
      this.gpsFrequency = {
        value: config.gpsFrequency || '6000',
        dirty: false,
        type: 'string'
      };
      this.gpsEnableHighAccuracy = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpsEnableHighAccuracy === false) {
        this.gpsEnableHighAccuracy.value = false;
      }
      this.gpsDebug = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gpsDebug === true) {
        this.gpsDebug.value = true;
      }
      this.accuracy = {
        value: +config.accuracy || 10,
        dirty: false,
        type: 'int'
      };
      this.radius = {
        value: +config.radius || 10,
        dirty: false,
        type: 'int'
      };
      this.distanceFilter = {
        value: +config.distanceFilter || 10,
        dirty: false,
        type: 'int'
      };
      this.trackId = {
        value: config.trackId || '',
        dirty: false,
        type: 'string'
      };
      this.trackEigenaar = {
        value: config.trackEigenaar || '',
        dirty: false,
        type: 'string'
      };
      this.trackPrivate = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.trackPrivate === false) {
        this.trackPrivate.value = false;
      }
      this.trackNaam = {
        value: config.trackNaam || '',
        dirty: false,
        type: 'string'
      };
      this.opacity = {
        value: +config.opacity || 100,
        dirty: false,
        type: 'int'
      };
      this.kaart = {
        value: config.kaart || '2000, OpenStreetMap 2014',
        dirty: false,
        type: 'string'
      };
      this.kaartHeden = {
        value: +config.kaartHeden || 0,
        dirty: false,
        type: 'int'
      };
      this.kaartNietHeden = {
        value: +config.kaartNietHeden || -1,
        dirty: false,
        type: 'int'
      };
      this.provinciegrens = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.provinciegrens === false) {
        this.provinciegrens.value = false;
      }
      this.gemeentegrenzen2010 = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gemeentegrenzen2010 === true) {
        this.gemeentegrenzen2010.value = true;
      }
      this.gemeentegrenzen2019 = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gemeentegrenzen2019 === true) {
        this.gemeentegrenzen2019.value = true;
      }
      this.gemeentegrenzen = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.gemeentegrenzen === true) {
        this.gemeentegrenzen.value = true;
      }
      this.water = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.water === true) {
        this.water.value = true;
      }
      this.tbo = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.tbo === true) {
        this.tbo.value = true;
      }
      this.electriciteitsnetwerk = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.electriciteitsnetwerk === true) {
        this.electriciteitsnetwerk.value = true;
      }
      this.hoofdwegen = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.hoofdwegen === true) {
        this.hoofdwegen.value = true;
      }
      this.plaatsnamen = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.plaatsnamen === true) {
        this.plaatsnamen.value = true;
      }
      this.achterban = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.achterban === true) {
        this.achterban.value = true;
      }
      this.tracks = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.tracks === true) {
        this.tracks.value = true;
      }
      this.pois = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.pois === true) {
        this.pois.value = true;
      }
      this.fotos = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.fotos === true) {
        this.fotos.value = true;
      }
      this.hash = {
        value: config.hash || '',
        dirty: false,
        type: 'string'
      };
      this.xprive = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.xprive === false) {
        this.xprive.value = false;
      }
      this.dbtoken = {
        value: config.dbtoken || '',
        dirty: false,
        type: 'string'
      };

      this.dropbox = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.dropbox === true) {
        this.dropbox.value = true;
      }
      this.wrobeken = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.wrobeken === true) {
        this.wrobeken.value = true;
      }
      this.wpm3beken = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.wpm3beken === true) {
        this.wpm3weken.value = true;
      }
      this.wpmbeken = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.wpmbeken === true) {
        this.wpmbeken.value = true;
      }
      this.hoogtelijnen = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.hoogtelijnen === true) {
        this.hoogtelijnen.value = true;
      }
      this.oppervlaktewater = {
        value: null,
        dirty: false,
        type: 'boolean'
      };
      if (config.oppervlaktewater === true) {
        this.oppervlaktewater.value = true;
      }

      return this;
    };

    me.Model.prototype = {
      get: function (prop) {
        //console.log(me.storeId + ' get: ', prop);
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
          //console.log('unsetAll m, field: ', m, field);
          field.dirty = false;
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
        //console.log('unset prop:', prop, this);
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

    me.setIdProperty = function (idProperty) {
      return dataFactoryStore.setIdProperty(idProperty);
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

    me.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    me.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
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

    me.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    me.getRange = function (start, end) {
      return dataFactoryStore.getRange(me, start, end);
    };

    me.initLoad = function () {
      return dataFactoryStore.initLoad(me);
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
      return dataFactoryStore.storeInit(me);
    };

    me.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    me.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    me.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    me.delayedSyncUpUpdate = function () {
      return dataFactoryStore.delayedSyncUpUpdate(me);
    };

    me.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactoryConfig.init = function () {
      //console.warn('dataFactoryConfig init');
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
      me.actualTime = '1970-01-02';
      me.lastSyncDate = '1970-01-02';
      me.tmpArray = [];
    };

    return me;

  }
]);
