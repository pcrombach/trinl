/* eslint-disable no-undef */
// eslint-disable-next-line no-undef

//removeIf(!pois)
trinl.factory('dataFactoryPoi', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryTag', 'dataFactoryHelp', 'dataFactory__DataItem__Sup', 'dataFactory__DataItem__Tag', 'dataFactory__DataItem__Reactie', 'dataFactory__DataItem__ReactieSup', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist, dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryTag, dataFactoryHelp, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, dataFactorySyncFS) {
    //endRemoveIf(!pois)
    /*  ###
//removeIf(!tracks)
trinl.factory('dataFactory__DataItem__', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryTag', 'dataFactoryHelp', 'dataFactory__DataItem__Sup', 'dataFactory__DataItem__Tag', 'dataFactory__DataItem__Reactie', 'dataFactory__DataItem__ReactieSup', 'dataFactory__DataItem__PoisFotos', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryTag, dataFactoryHelp, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, dataFactory__DataItem__PoisFotos, dataFactorySyncFS) {
    //endRemoveIf(!tracks)
    ###  */
    /*  ###
//removeIf(!fotos)
trinl.factory('dataFactory__DataItem__', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactory__DataItem__Sup', 'dataFactory__DataItem__Tag', 'dataFactory__DataItem__Reactie', 'dataFactory__DataItem__ReactieSup', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryHelp, dataFactoryTag, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, dataFactorySyncFS) {
    //endRemoveIf(!fotos)
    ###  */
    /*  ###
//removeIf(!berichten)
trinl.factory('dataFactory__DataItem__', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactory__DataItem__Sup', 'dataFactory__DataItem__Tag', 'dataFactory__DataItem__Reactie', 'dataFactory__DataItem__ReactieSup', 'dataFactorySyncFS',
function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryHelp, dataFactoryTag, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, dataFactorySyncFS) {
  //endRemoveIf(!berichten)
  ###  */

    //console.warn('dataFactory__DataItem__');

    var dataFactory__DataItem__ = {};
    var me = dataFactory__DataItem__;

    dataFactory__DataItem__.storeId = '__dataItem__';

    dataFactory__DataItem__.virgin = true;

    dataFactory__DataItem__.fsEnable = true;
    dataFactory__DataItem__.fsReady = false;

    dataFactory__DataItem__.idProperty = '';

    dataFactory__DataItem__.data = {};
    dataFactory__DataItem__.store = [];
    dataFactory__DataItem__.removedRecords = [];

    dataFactory__DataItem__.nieuw = [];
    dataFactory__DataItem__.star = [];

    dataFactory__DataItem__.current = '';
    dataFactory__DataItem__.selected = [];
    dataFactory__DataItem__.filters = [];
    dataFactory__DataItem__.sorters = [];
    dataFactory__DataItem__.actualTime = '1970-01-02 00:00:00';

    dataFactory__DataItem__.lastSyncDate = '1970-01-02 00:00:00';

    dataFactory__DataItem__.tmpArray = [];
    dataFactory__DataItem__.tmpArray2 = [];
    dataFactory__DataItem__.current__DataItem__Id = '';

    dataFactory__DataItem__.globalsLoadReady = false;
    dataFactory__DataItem__.card = false;
    dataFactory__DataItem__.verrijkt = false;
    dataFactory__DataItem__.loaded = false;
    dataFactory__DataItem__.autoSync = true;
    dataFactory__DataItem__.enableSyncUp = true;
    dataFactory__DataItem__.enableSyncDown = true;
    dataFactory__DataItem__.delaySyncUpTime = 0;
    dataFactory__DataItem__.todo = [];
    dataFactory__DataItem__Sup.todo = [];
    dataFactory__DataItem__Tag.todo = [];
    dataFactory__DataItem__Reactie.todo = [];
    dataFactory__DataItem__ReactieSup.todo = [];
    dataFactory__DataItem__.sideMenuTags = [];

    dataFactory__DataItem__.remoteSync = true;

    dataFactory__DataItem__.currentPage = 1;
    dataFactory__DataItem__.pageSize = 2500;

    dataFactory__DataItem__.xprive = '0';

    dataFactory__DataItem__.refreshDone = false;

    dataFactory__DataItem__.Model = function (config) {

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
        value: config.gebruikerId || localStorage.getItem('authentication_id'),
        dirty: false,
        type: 'string'
      };
      this.gebruikerNaam = {
        value: config.gebruikerNaam || '',
        dirty: false,
        type: 'string'
      };
      this.avatar = {
        value: config.avatar || '',
        dirty: false,
        type: 'string'
      };
      this.avatarLetter = {
        value: config.avatarLetter || '',
        dirty: false,
        type: 'string'
      };
      this.avatarColor = {
        value: config.avatarColor || '',
        dirty: false,
        type: 'string'
      };
      this.avatarInverse = {
        value: config.avatarInverse || '',
        dirty: false,
        type: 'string'
      };
      this.profiel = {
        value: config.profiel || '',
        dirty: false,
        type: 'string'
      };
      this.naam = {
        value: config.naam || '',
        dirty: false,
        type: 'string'
      };
      this.tekst = {
        value: config.tekst || '',
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
      this.yprive = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.yprive === false) {
        this.yprive.value = false;
      }
      this.gelezen = {
        value: config.gelezen || 0,
        dirty: false,
        type: 'int'
      };
      this.up = {
        value: false,
        dirty: false,
        type: 'boolean'
      };
      if (config.up === true) {
        this.up.value = true;
      }
      this.groepenId = {
        value: config.groepenId || '',
        dirty: false,
        type: 'string'
      };
      /*  ###
      //removeIf(!__dataItem__en)
      this.__dataItem__Id = {
        value: config.__dataItem__Id || '',
        dirty: false,
        type: 'string'
      };
      this.afzender = {
        value: config.afzender || '',
        dirty: false,
        type: 'string'
      };
      this.sendEmail = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.sendEmail === false) {
        this.sendEamil.value = false;
      }
      this.naarId = {
        value: config.naarId || '',
        dirty: false,
        type: 'string'
      };
      this.context = {
        value: config.context || '',
        dirty: false,
        type: 'string'
      };
      //endRemoveIf(!__dataItem__en)
      ###  */
      /*  ###
      //removeIf(__dataItem__en)
      this.fotoId = {
        value: config.fotoId || '',
        dirty: false,
        type: 'string'
      };
      this.poiId = {
        value: config.poiId || '',
        dirty: false,
        type: 'string'
      };
      this.trackId = {
        value: config.trackId || '',
        dirty: false,
        type: 'string'
      };
      this.folder = {
        value: config.folder || '',
        dirty: false,
        type: 'string'
      };
      this.extension = {
        value: config.extension || '',
        dirty: false,
        type: 'string'
      };
      this.lat = {
        value: config.lat || 0.0,
        dirty: false,
        type: 'string'
      };
      this.lng = {
        value: config.lng || 0.0,
        dirty: false,
        type: 'string'
      };
      //endRemoveIf(!__dataItem__en)
      ###  */
      /*  ###
      //removeIf(!fotos)
      this.orientation = {
        value: config.orientation || 0,
        dirty: false,
        type: 'int'
      };
      //endRemoveIf(!fotos)
      ###  */
      /*  ###
      //removeIf(!pois)
      this.soort = {
        value: config.soort || '',
        dirty: false,
        type: 'string'
      };
      //endRemoveIf(!pois)
      ###  */
      /*  ###
      //removeIf(!tracks)
      this.pois = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.pois === false) {
        this.pois.value = false;
      }
      this.fotos = {
        value: true,
        dirty: false,
        type: 'boolean'
      };
      if (config.fotos === false) {
        this.fotos.value = false;
      }
      //endRemoveIf(!tracks)
      ###  */

      dataFactoryObjectId.create();

      return this;
    };

    dataFactory__DataItem__.Model.prototype = {
      get: function (prop) {
        //console.log(dataFactory__DataItem__.storeId + ' get: ' + prop);
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
        return dataFactory__DataItem__.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        //console.error('save: ', m);
        return dataFactory__DataItem__.save(m);
      },
      setAll: function () {
        //console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactory__DataItem__.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        //console.log('__dataItem__ unsetAll');

        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          if (field !== true && field !== false) {
            //console.log('__dataItem__ unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        loDash.each(dataFactory__DataItem__.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        //console.log('__dataItem__ unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        //console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactory__DataItem__.data, function (item) {
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
          loDash.each(dataFactory__DataItem__.data, function (item) {
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
        loDash.each(dataFactory__DataItem__.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactory__DataItem__.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactory__DataItem__.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactory__DataItem__.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactory__DataItem__.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactory__DataItem__.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactory__DataItem__.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactory__DataItem__.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactory__DataItem__.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactory__DataItem__.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactory__DataItem__.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactory__DataItem__.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactory__DataItem__.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactory__DataItem__.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactory__DataItem__.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactory__DataItem__.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactory__DataItem__.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactory__DataItem__.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactory__DataItem__.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactory__DataItem__.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactory__DataItem__.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactory__DataItem__.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactory__DataItem__.loadAll = function () {
      return dataFactoryStore.loadAll(me);
    };

    dataFactory__DataItem__.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactory__DataItem__.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactory__DataItem__.syncUpAll = function () {
      return dataFactoryStore.syncUpAll(me);
    };

    dataFactory__DataItem__.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactory__DataItem__.syncDownAll = function (update) {
      return dataFactoryStore.syncDownAll(dataFactory__DataItem__, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactoryTag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, update);
    };

    dataFactory__DataItem__.init = function () {
      //console.warn('dataFactory__DataItem__ init');

      dataFactory__DataItem__.fsReady = false;
      dataFactory__DataItem__.loaded = false;
      dataFactory__DataItem__.star = [];
      dataFactory__DataItem__.nieuw = [];
      dataFactory__DataItem__.selected = [];
      dataFactory__DataItem__.data = [];
      dataFactory__DataItem__.store = [];
      dataFactory__DataItem__.removedRecords = [];
      dataFactory__DataItem__.current = '';
      dataFactory__DataItem__.filters = [];
      dataFactory__DataItem__.sorters = [];
      dataFactory__DataItem__.actualTime = '1970-01-02 00:00:00';
      dataFactory__DataItem__.lastSyncDate = '1970-01-02 00:00:00';
      dataFactory__DataItem__.tmpArray = [];
      dataFactory__DataItem__Sup.todo = [];
      dataFactory__DataItem__Tag.todo = [];
      dataFactory__DataItem__Reactie.todo = [];
      dataFactory__DataItem__ReactieSup.todo = [];
    };
    //
    dataFactory__DataItem__.init();
    //
    var watchSyncs = [];
    var todoTotal = 0;
    var notifications__DataItem__ = 0;
    var notifications__DataItem__Reactie = 0;
    var todostmp, uniqueSet;
    //
    var todos = [];
    //
    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    //
    var virgin = me.virgin;
    //
    //
    // Het gaat hier om een gepubliceerd __dataItem__Model die door de eigenaar is geprivatiseerd of defintief verwijderd heeft.
    // De volger hoeft alleen maar de dit __dataItem__Model/__dataItem__SupModel en __dataItem__TagModellen (incl updaten van de lables in SideMenu) 
    // uit zijn stores te verwijderen.
    // Dit __dataItem__Model is dan niet meer zichtbaar in zijn TRINL.
    // Hij laat zijn __DataItem__Sup __DataItem__ReactieModel __DataItem__ReactieSupModel en __DataItem__TagModellen in de database.
    // Als de eigenaar deze __DataItem__ opnieuw publiceerd worden de Sup en Reactie bestanden weer toegevoegd.
    // Deze POI blijft bij de volger weg als deze __DataItem__ geprivatiseerd blijft. De Als de __DataItem__ niet gesyncd wordt dan worden ook de andere Modellen niet gesynced.
    // !!!Attentie. De updates van dit __dataItem__Model, __dataItem__SupModel, Reacties en __dataItem__Tags gaan gewoon door. Nagaan of de volger hierdoor niet lastig gevallen wordt!!!
    // LoadAll gaat goed. Dit __dataItem__Model wordt niet meer geload.
    // SyncDownAll !!!!!!!!!!!!!! SyncDown haalt ook nieuwe modellen op. Alles moet gewoon door de FrontEndAPI in
    // stores worden bijgewerkt. De gelinkte bestanden zijn
    // jammer genoeg overbodig als er geen itemModel is. De volgende loadAll laadt deze overbodige modellen toch niet meer.
    // 
    function verwijder__DataItem__(__dataItem__Model, mode, watch) {

      var q = $q.defer();
      //console.warn('dataFactory__DataItem__ verwijder__DataItem__: ', __dataItem__Model.get('naam'));

      var __dataItem__Id = __dataItem__Model.get('Id');

      initxData(__dataItem__Model);
      //
      //  Clean up stores
      //
      loDash.remove(dataFactory__DataItem__.star, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.selected, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });
      //
      //  Verwijderen labels in sidemenu
      //
      loDash.each(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
        //console.log('dataFactory__DataItem__ updateLabels loop Tags: ', __dataItem__TagModel, __dataItem__TagModel.xData);
        tagsRemove(__dataItem__Model, __dataItem__TagModel.xData);
      });
      __dataItem__Model.xData.tags = [];
      //

      $rootScope.$emit('__dataItem__SideMenuUpdate');
      //
      loDash.remove(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
        return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__TagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactory__DataItem__Tag.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__Tags VERWIJDERD form __dataItem__TagStore/data');

      loDash.remove(dataFactory__DataItem__Reactie.store, function (__dataItem__ReactieModel) {
        return __dataItem__ReactieModel.get('__dataItem__Id') === __dataItem__Id;
      });
      loDash.remove(dataFactory__DataItem__Reactie.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id;
      });
      //console.warn('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__Reactie VERWIJDERD form __dataItem__ReactieStore/data');

      loDash.remove(dataFactory__DataItem__ReactieSup.store, function (__dataItem__ReactieSupModel) {
        return __dataItem__ReactieSupModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__ReactieSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactory__DataItem__ReactieSup.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__ReactieSups VERWIJDERD from store');

      loDash.remove(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
        return __dataItem__SupModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__SupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactory__DataItem__Sup.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__Sup VERWIJDERD from __dataItem__SupStore/data');

      //updateLabels(__dataItem__Model).then(function () {
      loDash.remove(dataFactory__DataItem__.store, function (__dataItem__Model) {
        //console.log('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__verijderen loDash remove: ', __dataItem__Model, __dataItem__Id, __dataItem__Model.get('Id'), __dataItem__Model.get('xprive'), __dataItem__Model.get('gebruikerId'), __dataItem__Model.get('naam'));
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });
      loDash.remove(dataFactory__DataItem__.data, function (dataItem) {
        return dataItem.record.get('Id') === __dataItem__Id;
      });
      //console.warn('dataFactory__DataItem__ verwijder__DataItem__ __dataItem__ VERWIJDERD from __dataItem__Store/data');
      //console.log('dataFactory__DataItem__ verwijder__DataItem__ aantal dataFactory__DataItem__.store STORE: ', dataFactory__DataItem__.store, dataFactory__DataItem__.store.length);
      //
      //  Waarschuwing als de gebruiker in deze Card zit
      //
      $rootScope.$emit('__dataItem__Verwijderd', {
        __dataItem__Model: __dataItem__Model
      });

      if (watch) {
        watchUpdate(mode, __dataItem__Model);
      }
      $timeout(function () {
        $rootScope.$emit('__dataItem__sFilter');
        $rootScope.$emit('__dataItem__sNieuweAantallen');
      }, 500);

      q.resolve();
      //});

      return q.promise;
    }
    //
    function tagsRemove(__dataItem__Model, tagModel) {

      var q = $q.defer();

      //console.warn('__DataItem__sSideMenuCtrl tagsRemove __dataItem__Model, tagModel: ', __dataItem__Model, tagModel);
      //console.log('__DataItem__sSideMenuCtrl tagsRemove naam tag', __dataItem__Model.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find(dataFactory__DataItem__.sideMenuTags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('__DataItem__sSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = __dataItem__Model.get('naam');
        //
        //  Verwijder het __dataItem__Model uit de itemss tabel
        //
        //console.log('__DataItem__sSideMenuCtrl tagsRemove removing __dataItem__ Id from xtag.items: ', __dataItem__Model.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (__dataItem__) {
          //return __dataItem__.Id === __dataItem__Model.get('Id') && __dataItem__.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return __dataItem__.get('Id') === __dataItem__Model.get('Id');
        });

        loDash.remove(dataFactory__DataItem__.sideMenuTags.__dataItem__s, function (__dataItem__) {
          return __dataItem__.get('Id') === __dataItem__Model.get('Id');
        });

        if (xtag.items.length === 0) {
          loDash.remove(dataFactory__DataItem__.sideMenuTags, function (xtag) {
            return xtag.items.length === 0;
          });

          loDash.remove(dataFactory__DataItem__.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });
          sorteerSideMenuTags();

          q.resolve();

        } else {

          tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
            return __dataItem__Model.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (__dataItem__Model) {
            return __dataItem__Model.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove(dataFactory__DataItem__.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('__DataItem__sSideMenuCtrl tagsAdd removed to update: ', xtag);
          dataFactory__DataItem__.sideMenuTags.push(xtag);

          sorteerSideMenuTags();
          q.resolve();
        }

        //console.log('__DataItem__sSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), dataFactory__DataItem__.sideMenuTags);
      } else {
        //console.log('__DataItem__sSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
        sorteerSideMenuTags();
        q.resolve();
      }

      return q.promise;
    }
    //    
    function tagsAdd(__dataItem__Model, tagModel) {

      var q = $q.defer();

      //console.log('__DataItem__sSideMenuCtrl tagsAdd __dataItem__Model, tagModel: ', __dataItem__Model, tagModel);
      //console.log('__DataItem__sSideMenuCtrl tagsAdd naam tag', __dataItem__Model.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find(dataFactory__DataItem__.sideMenuTags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten dataFactory__DataItem__.sideMenuTags hebben de volgende props:
      //  -    __dataItem__s: een tabel met alle __dataItem__Modellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde __dataItem__Modellen.
      //  -    aantal: het unieke aantal __dataItem__Modellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in __dataItem__TagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste __dataItem__Model.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(__dataItem__Model);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        dataFactory__DataItem__.sideMenuTags.push(xtag);
        sorteerSideMenuTags();
        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), dataFactory__DataItem__.sideMenuTags);
        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => dataFactory__DataItem__.sideMenuTags object naam, Id: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), dataFactory__DataItem__.sideMenuTags);

        q.resolve();
      } else {
        //
        //  Voeg het __dataItem__Model toe aan bestaand tag dataFactory__DataItem__.data.tag object
        //
        xtag.items.push(__dataItem__Model);
        //
        //  Update het __dataItem__TagModel
        //
        tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove(dataFactory__DataItem__.sideMenuTags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('__DataItem__sSideMenuCtrl tagsAdd removed to update: ', xtag);
        dataFactory__DataItem__.sideMenuTags.push(xtag);
        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-onbject __dataItem__Model REEDS AANWEZIG in tabel items naam, Id UPDATE: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), dataFactory__DataItem__.sideMenuTags);
        sorteerSideMenuTags();

        q.resolve();
      }

      return q.promise;
    }
    //
    function sorteerSideMenuTags() {

      //console.warn('__DataItem__sSideMenuCtrl sorteerSideMenuTags');
      loDash.remove(dataFactory__DataItem__.sideMenuTags, function (xtag) {
        return xtag.length === 0;
      });
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(dataFactory__DataItem__.sideMenuTags, function (xtag) {
        return xtag.length !== 0 && xtag.tagId.length <= 3 && xtag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter(dataFactory__DataItem__.sideMenuTags, function (xtag) {
        return xtag.tagId.length <= 3 && xtag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter(dataFactory__DataItem__.sideMenuTags, function (xtag) {
        return xtag.tagId.length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      dataFactory__DataItem__.sideMenuTags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function updateLabels(__dataItem__Model) {
      //
      // Idere keer als labels geupdate worden helemaal opnieuw beginnen met een situatie zonder labels
      // Daarna de labels filteren die voor dit __DataItem__Model bedoeld zijn.
      //

      var q = $q.defer();

      var __dataItem__Id = __dataItem__Model.get('Id');

      //if (__dataItem__Id === '5e3bfffadc6c26958502a5f5') {
      //console.log('================================================================================================');
      //console.log('dataFactory__DataItem__ updateLabels POI naam: ', __dataItem__Model.get('naam'));
      //console.log('dataFactory__DataItem__ updateLabels POI Id: ', __dataItem__Id);
      //console.log('dataFactory__DataItem__ updateLabels POI gebruikerId: ', __dataItem__Model.get('gebruikerId'));
      //console.log('================================================================================================');

      if (__dataItem__Model) {
        //console.log('dataFactory.__DataItem__ updatelabels __dataItem__Model: ', __dataItem__Model);
        //
        //  Eerst de oude labels verwijderen
        //  Deze staan in __dataItem__Model.xData.tags.xData
        //

        loDash.each(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
          //console.log('dataFactory__DataItem__ updateLabels loop Tags: ', __dataItem__TagModel, __dataItem__TagModel.xData);
          tagsRemove(__dataItem__Model, __dataItem__TagModel.xData);
        });
        //
        //  Verwijder __dataItem__Tags die verwijderd zijn of niet public zijn
        //
        loDash.remove(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
          return __dataItem__TagModel.get('deletedOn') > '1970-01-02 00:00:00' || (__dataItem__TagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('xprive'));
        });
        loDash.remove(dataFactory__DataItem__Tag.data, function (dataItem) {
          return dataItem.record.get('deletedOn') > '1970-01-02 00:00:00' || (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && dataItem.record.get('xprive'));
        });
        //
        //  Selecteer niet verwijderde __dataItem__Tags van deze __dataItem__
        //
        var my__DataItem__Tags = [];
        //if (+ceo.profielId === 4 || +ceo.profielId === 5) {
        //my__DataItem__Tags = loDash.filter(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
        //return (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id) || (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__TagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id && (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) || (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //});
        //} else {
        my__DataItem__Tags = loDash.filter(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
          //return (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id) || (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__TagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
          return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id;
        });
        //}
        //console.log('dataFactory__DataItem__ updateLabels dataFactory__DataItem__Tag.store: ', dataFactory__DataItem__Tag.store);
        //console.log('dataFactory__DataItem__ updateLabels my__DataItem__tags: ', my__DataItem__Tags);
        __dataItem__Model.xData.tags = [];
        //
        //  Toevoegen my__DataItem__Tags
        //
        //console.log('dataFactory__DataItem__ updateLabels my__DataItem__Tags TOEVOEGEN: ', my__DataItem__Tags);
        if (my__DataItem__Tags.length > 0) {
          loDash.each(my__DataItem__Tags, function (my__DataItem__TagModel) {
            var tagId = my__DataItem__TagModel.get('tagId');
            //console.log('dataFactory__DataItem__ updateLabels my__DataItem__Tag toevoegen tagId: ', tagId);

            if (tagId) {

              //console.log('dataFactory__DataItem__ updateLabels tagModel toevoegen tagId uit dataFactoryTag.store');

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });

              if (tagModel) {

                my__DataItem__TagModel.xData = tagModel;

                //console.log('dataFactory__DataItem__ updateLabels my__DataItem__Tag TOEVOEGEN in  SideMenu: ', __dataItem__Model.get('naam'), tagModel.get('tag'));
                //console.log('dataFactory__DataItem__ updateLabels my__DataItem__Tag TOEVOEGEN in  __dataItem__Model.xData.tags: ', __dataItem__Model.get('naam'), my__DataItem__TagModel);

                __dataItem__Model.xData.tags.push(my__DataItem__TagModel);
                tagsAdd(__dataItem__Model, tagModel);
                $rootScope.$emit('__dataItem__SideMenuUpdate');

                //console.log('dataFactory__DataItem__ updateLabels my__DataItem__Tag TOEGEVOEGD naam tag, xData.tags: ', __dataItem__Model.get('naam'), tagModel.get('tag'), __dataItem__Model.xData.tags);
              } else {
                //console.error('dataFactory__DataItem__ updateLabels __dataItem__tag toevoegen tagModel NOT FOUND: ', dataFactoryTag.store);
              }
            }
          });
          //console.log('dataFactory__DataItem__ reload updateLabels SUCCESS');
          /*
          var oud = '';
          loDash.each(__dataItem__Model.xData.tags, function (tag) {
            if (oud !== __dataItem__Model.get('naam')) {
              //console.log(' ');
            }
            //console.error('dataFcatory__DataItem__ updateLabels xdata.tags: ', __dataItem__Model.get('naam'), tag.xData.get('tag'));
            oud = __dataItem__Model.get('naam');
          });
          */
          q.resolve();

        } else {
          //$rootScope.$emit('labels__DataItem__Update', { __dataItem__Model: __dataItem__Model });
          //console.log('dataFactory__DataItem__ resultaat xData.tags: ', __dataItem__Model.xData.tags);

          //console.log('dataFactory__DataItem__ reload updateLabels SUCCESS');
          q.resolve();

        }

      } else {
        //console.log('dataFactory__DataItem__ reload updateLabels SUCCESS');
        q.resolve();
      }
      //} else {
      //console.log('dataFactory__DataItem__ updateLabels DEBUGGING');
      //q.resolve();
      //}

      return q.promise;
    }
    //
    //  Na de load van alle Sporen wordt in ieder __dataItem__ bepaald of er nieuwe reacties zijn toegveoegd.
    //
    function updateReacties(__dataItem__Model) {

      //console.warn('dataFactory__DataItem__ updateReacties naam: ', __dataItem__Model.get('naam'));

      var q = $q.defer();

      var __dataItem__Id = __dataItem__Model.get('Id');

      var __dataItem__Reacties = loDash.filter(dataFactory__DataItem__Reactie.store, function (__dataItem__ReactieModel) {
        return __dataItem__ReactieModel.get('__dataItem__Id') === __dataItem__Id;
      });
      //console.log('dataFactory__DataItem__ updateReacties __dataItem__Reacties: ', __dataItem__Reacties);
      if (__dataItem__Reacties.length > 0) {
        //console.log('dataFactory__DataItem__ updateReacties syncDown naam, __dataItem__Id, __dataItem__Reacties: ', __dataItem__Model.get('naam'), __dataItem__Id, __dataItem__Reacties);
        loDash.each(__dataItem__Reacties, function (__dataItem__ReactieModel) {
          //console.log('dataFactory__DataItem__ updateReacties __dataItem__Id, naam, reactie: ', __dataItem__Id, __dataItem__Model.get('naam'), __dataItem__ReactieModel.get('reactie'));
          var __dataItem__ReactieId = __dataItem__ReactieModel.get('Id');

          var __dataItem__ReactieSupModel = loDash.find(dataFactory__DataItem__ReactieSup.store, function (__dataItem__ReactieSupModel) {
            return __dataItem__ReactieSupModel.get('reactieId') === __dataItem__ReactieId;
          });

          if (__dataItem__ReactieSupModel) {

            __dataItem__ReactieModel.xData = {};
            __dataItem__ReactieModel.xData.tags = [];

            __dataItem__ReactieModel.xData.sup = __dataItem__ReactieSupModel;

            var xnew = __dataItem__ReactieSupModel.get('xnew');

            if (xnew) {
              if (!virgin) {
                notifications__DataItem__Reactie += 1;
              }
              var __dataItem__NieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
                return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
              });
              if (!__dataItem__NieuwModel) {
                dataFactory__DataItem__.nieuw.push(__dataItem__Model);
                //console.log('dataFactory__DataItem__ update__DataItem__xnew toegevoegd aan nieuw: ', dataFactory__DataItem__.nieuw);
              }
            } else {
              loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
                return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
              });
              //console.log('dataFactory__DataItem__ update__DataItem__ xnew verwijderd: ', dataFactory__DataItem__.nieuw);
            }
          } else {
            //console.log('dataFactory__DataItem__ update__DataItem__reacties heeft nog geen __dataItem__ReactieSupModel. Dus nieuw __dataItem__ReactieSupModel aanmaken!!');

            __dataItem__ReactieSupModel = new dataFactory__DataItem__ReactieSup.Model();
            __dataItem__ReactieSupModel.set('reactieId', __dataItem__ReactieId);
            __dataItem__ReactieSupModel.set('__dataItem__Id', __dataItem__Id);
            __dataItem__ReactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            __dataItem__ReactieSupModel.set('star', false);
            __dataItem__ReactieSupModel.set('xnew', true);
            if (virgin) {
              __dataItem__ReactieSupModel.set('xnew', false);
            }
            __dataItem__ReactieSupModel.save().then(function () {

              //console.log('dataFactory__DataItem__ updateReacties __dataItem__ReactieSupModel CREATED.');

              __dataItem__ReactieModel.xData = {};
              __dataItem__ReactieModel.xData.tags = [];
              __dataItem__ReactieModel.xData.sup = __dataItem__ReactieSupModel;

              //console.log('dataFactory__DataItem__ updateReacties __dataItem__ReactieSupModel toegevoegd aan Reactie.');

              var __dataItem__SupModel = loDash.find(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
                return __dataItem__SupModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__SupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });

              if (__dataItem__SupModel) {
                //console.log('dataFactory__DataItem__ updateReacties __dataItem__SupModel gevonden: ', __dataItem__Id, __dataItem__Model.get('naam'));
                __dataItem__Model.xData.sup = __dataItem__SupModel;

                var xnew = __dataItem__SupModel.get('xnew');
                var star = __dataItem__SupModel.get('star');
                //console.log('dataFactory__DataItem__ update__DataItem__ __dataItem__Model, __dataItem__Model.xData.sup UPDATE __dataItem__Id: ', __dataItem__Model, __dataItem__Model.xData.sup, __dataItem__Model.xData.sup.get('__dataItem__Id'));

                if (star) {
                  var __dataItem__StarModel = loDash.find(dataFactory__DataItem__.star, function (__dataItem__StarModel) {
                    return __dataItem__StarModel.get('Id') === __dataItem__Id;
                  });
                  if (!__dataItem__StarModel) {
                    dataFactory__DataItem__.star.push(__dataItem__Model);
                    //console.log('dataFactory__DataItem__ update__DataItem__ star toegevoegd: ', dataFactory__DataItem__.star);
                  }
                } else {
                  loDash.remove(dataFactory__DataItem__.star, function (__dataItem__StarModel) {
                    return __dataItem__StarModel.get('Id') === __dataItem__Id;
                  });
                  //console.log('dataFactory__DataItem__ update__DataItem__ star verwijderd: ', dataFactory__DataItem__.star);
                }

                //console.log('dataFactory__DataItem__ update__DataItem__ xnew: ', xnew);


                if (xnew) {
                  if (!virgin) {
                    notifications__DataItem__ += 1;
                  }
                  var __dataItem__NieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
                    return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
                  });
                  if (!__dataItem__NieuwModel) {
                    dataFactory__DataItem__.nieuw.push(__dataItem__Model);
                    //console.log('dataFactory__DataItem__ update__DataItem__xnew toegevoegd aan nieuw: ', dataFactory__DataItem__.nieuw);
                  }
                } else {
                  loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
                    return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
                  });
                  //console.log('dataFactory__DataItem__ update__DataItem__ xnew verwijderd: ', dataFactory__DataItem__.nieuw);
                }


                //console.log('dataFactory__DataItem__ reload updateSupModel SUCCESS');
                q.resolve();

                //console.log('dataFactory__DataItem__ update__DataItem__List heeft nog geen supModel. Dus nieuw!! Id, naam: ', __dataItem__Model.get('Id'), __dataItem__Model.get('naam'));

                __dataItem__SupModel = new dataFactory__DataItem__Sup.Model();
                __dataItem__SupModel.set('__dataItem__Id', __dataItem__Id);
                __dataItem__SupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                __dataItem__SupModel.set('star', false);
                __dataItem__SupModel.set('xnew', true);
                if (virgin) {
                  __dataItem__SupModel.set('xnew', false);
                  //console.log('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__enup niet als nieuw beschouwen. Gebruiker is maagd');
                }
                //console.log('dataFactory__DataItem__ update__DataItem__ nieuw __dataItem__SupModel: ', __dataItem__SupModel.get('__dataItem__Id'));

                __dataItem__SupModel.save().then(function () {

                  //console.log('dataFactory__DataItem__ update__DataItem__ nieuw __dataItem__SupModel: ', __dataItem__SupModel);

                  __dataItem__Model.xData.sup = __dataItem__SupModel;

                  if (!virgin) {
                    notifications__DataItem__ += 1;
                    var nieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (nieuwModel) {
                      return nieuwModel.get('Id') === __dataItem__Id;
                    });
                    if (!nieuwModel) {
                      dataFactory__DataItem__.nieuw.push(__dataItem__Model);
                    }
                  } else {
                    //console.error('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__enup notifications skipped. Gebruiker is maagd');
                  }
                  //console.log('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__enup voor __dataItem__Id NOT FOUND in __DataItem__Store.nieuw: ', __dataItem__Id, dataFactory__DataItem__.nieuw);

                  //console.log('dataFactory__DataItem__ reload updateSupModel nieuwe __dataItem__ SUCCESS');
                  q.resolve();

                });
              }
            });
          }
        });
        //console.log('dataFactory__DataItem__ reload updateReacties SUCCESS');
        q.resolve();
      } else {
        //console.log('dataFactory__DataItem__ reload updateReacties SUCCESS');
        q.resolve();
      }

      return q.promise;
    }

    function initxData(__dataItem__Model) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      //console.log('initxData START: ', __dataItem__Model);

      if (!__dataItem__Model.xData) {
        __dataItem__Model.xData = {};
        //console.log('dataFactory__DataItem__ update__DataItem__ xData: ', __dataItem__Model.xData);
      }
      if (!__dataItem__Model.xData.pois) {
        __dataItem__Model.xData.pois = [];
        //console.log('dataFactory__DataItem__ update__DataItem__ xData.pois: ', __dataItem__Model.xData.pois);
      }
      if (!__dataItem__Model.xData.fotos) {
        __dataItem__Model.xData.fotos = [];
        //console.log('dataFactory__DataItem__ update__DataItem__ xData.fotos: ', __dataItem__Model.xData.fotos);
      }
      if (!__dataItem__Model.xData.tags) {
        __dataItem__Model.xData.tags = [];
        //console.log('dataFactory__DataItem__ update__DataItem__ xData.tags: ', __dataItem__Model.xData.tags);
      }
      if (!__dataItem__Model.xData.groep) {
        __dataItem__Model.xData.groep = '';
        //console.log('dataFactory__DataItem__ update__DataItem__ xData.groep: ', __dataItem__Model.xData.groep);
      }
      //console.log('initxData READY: ', __dataItem__Model.xData);
    }
    //
    /*  ###
    //removeIf(!tracks)
    function getPois(__dataItem__Model, __dataItem__SupModel) {
 
      //console.log('dataFactory__DataItem__ getPois: ', __dataItem__Model.get('Id'), __dataItem__Model.get('naam'), __dataItem__Model.get('pois'));
      var q = $q.defer();
      var __dataItem__Id = __dataItem__Model.get('Id');
    
      if (__dataItem__Model.get('pois')) {
        dataFactoryTrackPoisFotos.getPois(__dataItem__Id).then(function (result) {
          //console.log('dataFactory__DataItem__ getPois naam result: ', __dataItem__Model.get('naam'), result);
          __dataItem__Model.xData.pois = result;
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('dataFactory__DataItem__ getPois ERROR: ', err);
          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function getFotos(__dataItem__Model, __dataItem__SupModel) {
    
      //console.log('dataFactory__DataItem__ getFotos: ', __dataItem__Model.get('Id'), __dataItem__Model.get('naam'), __dataItem__Model.get('fotos'));
      var q = $q.defer();
    
      if (__dataItem__Model.get('fotos')) {
        dataFactory__DataItem__PoisFotos.getFotos(__dataItem__Model.get('__dataItem__Id')).then(function (result) {
    
          //console.log('dataFactory__DataItem__ getFotos naam result: ', __dataItem__Model.get('naam'), result);
          __dataItem__Model.xData.fotos = result;
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('dataFactory__DataItem__ getFotos ERROR: ', err);
          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function getPoisFotos(__dataItem__Model, __dataItem__SupModel) {
    
      var q = $q.defer();
      getPois(__dataItem__Model, __dataItem__SupModel).then(function () {
        getFotos(__dataItem__Model, __dataItem__SupModel).then(function () {
          q.resolve();
        });
      });
    
      return q.promise;
    }

    dataFactory__DataItem__PoisFotos.start(dataFactory__DataItem__);
    //endRemoveIf(!tracks)
    ###  */
    function updateSupModel(__dataItem__Model) {

      //console.log('dataFactory__DataItem__ Update__DataItem__: ', __dataItem__Model.get('naam'));

      var q = $q.defer();

      var __dataItem__Id = __dataItem__Model.get('Id');
      var gebruikerId = dataFactoryCeo.currentModel.get('Id');

      var __dataItem__SupModel = loDash.find(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
        return __dataItem__SupModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__SupModel.get('gebruikerId') === gebruikerId;
      });

      //console.log('dataFactory__DataItem__ UpdateSupModel __dataItem__SupModel: ', __dataItem__SupModel);
      if (__dataItem__SupModel) {

        __dataItem__Model.xData.sup = __dataItem__SupModel;

        var xnew = __dataItem__SupModel.get('xnew');
        var star = __dataItem__SupModel.get('star');
        //console.log('dataFactory__DataItem__ update__DataItem__ __dataItem__Model, __dataItem__Model.xData.sup UPDATE __dataItem__Id: ', __dataItem__Model, __dataItem__Model.xData.sup, __dataItem__Model.xData.sup.get('__dataItem__Id'));

        if (star) {
          var __dataItem__StarModel = loDash.find(dataFactory__DataItem__.star, function (__dataItem__StarModel) {
            return __dataItem__StarModel.get('Id') === __dataItem__Id;
          });
          if (!__dataItem__StarModel) {
            dataFactory__DataItem__.star.push(__dataItem__Model);
            //console.log('dataFactory__DataItem__ update__DataItem__ star toegevoegd: ', dataFactory__DataItem__.star);
          }
        } else {
          loDash.remove(dataFactory__DataItem__.star, function (__dataItem__StarModel) {
            return __dataItem__StarModel.get('Id') === __dataItem__Id;
          });
          //console.log('dataFactory__DataItem__ update__DataItem__ star verwijderd: ', dataFactory__DataItem__.star);
        }

        //console.log('dataFactory__DataItem__ update__DataItem__ xnew: ', xnew);


        if (xnew) {
          if (!virgin) {
            notifications__DataItem__ += 1;
          }
          var __dataItem__NieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
            return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
          });
          if (!__dataItem__NieuwModel) {
            dataFactory__DataItem__.nieuw.push(__dataItem__Model);
            //console.log('dataFactory__DataItem__ update__DataItem__xnew toegevoegd aan nieuw: ', dataFactory__DataItem__.nieuw);
          }
        } else {
          loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
            return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
          });
          //console.log('dataFactory__DataItem__ update__DataItem__ xnew verwijderd: ', dataFactory__DataItem__.nieuw);
        }
        /*  ###
        //removeIf(!tracks)
        //
        //  xData pois en fotos toevoegen
        //
        var poisfotosinterval = $interval(function() {
          //console.log('dataFactory__DataItem__ waiting for dataFactory__DataItem__PoisFotos.loaded...: ', dataFactoryTrackPoisFotos.loaded);
          if (dataFactoryTrackPoisFotos.loaded) {
            $interval.cancel(poisfotosinterval);
            getPoisFotos(__dataItem__Model, __dataItem__SupModel).then(function () {
              //console.log('dataFactory__DataItem__ get__DataItem__sFotos SUCCES: ', __dataItem__Model.xData.pois, __dataItem__Model.xData.fotos);
            }).catch(function() {
              //console.error('dataFactory__DataItem__ get__DataItem__sFotos ERROR');
            });
          }
        }, 100, 500);
        //endRemoveIf(!tracks)
        ###  */
        //console.log('dataFactory__DataItem__ reload updateSupModel SUCCESS');
        q.resolve();
      } else {

        //console.log('dataFactory__DataItem__ update__DataItem__List heeft nog geen supModel. Dus nieuw!! Id, naam: ', __dataItem__Model.get('Id'), __dataItem__Model.get('naam'));

        __dataItem__SupModel = new dataFactory__DataItem__Sup.Model();
        __dataItem__SupModel.set('__dataItem__Id', __dataItem__Id);
        __dataItem__SupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        __dataItem__SupModel.set('star', false);
        __dataItem__SupModel.set('xnew', true);
        if (virgin) {
          __dataItem__SupModel.set('xnew', false);
          //console.log('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__sup niet als nieuw beschouwen. Gebruiker is maagd');
        }
        //console.log('dataFactory__DataItem__ update__DataItem__ nieuw __dataItem__SupModel: ', __dataItem__SupModel.get('__dataItem__Id'));

        __dataItem__SupModel.save().then(function () {

          //console.log('dataFactory__DataItem__ update__DataItem__ nieuw __dataItem__SupModel: ', __dataItem__SupModel);

          __dataItem__Model.xData.sup = __dataItem__SupModel;

          if (!virgin) {
            notifications__DataItem__ += 1;
            var nieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === __dataItem__Id;
            });
            if (!nieuwModel) {
              dataFactory__DataItem__.nieuw.push(__dataItem__Model);
            }
          } else {
            //console.error('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__sup notifications skipped. Gebruiker is maagd');
          }
          //console.log('dataFactory__DataItem__ update__DataItem__ nieuwe __dataItem__sup voor __dataItem__Id NOT FOUND in __DataItem__Store.nieuw: ', __dataItem__Id, dataFactory__DataItem__.nieuw);

          //console.log('dataFactory__DataItem__ reload updateSupModel nieuwe __dataItem__ SUCCESS');
          q.resolve();

        });

      }

      return q.promise;
    }

    //
    function update__DataItem__(__dataItem__Model, mode) {

      var q = $q.defer();

      //console.warn('dataFactory__DataItem__ update__DataItem__ __dataItem__ deletedOn, xprive, gebruikerId, naam : ', __dataItem__Model.get('deletedOn'), __dataItem__Model.get('xprive'), __dataItem__Model.get('gebruikerId'), __dataItem__Model.get('naam'));

      initxData(__dataItem__Model);

      var groepenId = __dataItem__Model.get('groepenId');
      //console.log('dataFactory__DataItem__ update__DataItem__ groepenId: ', groepenId);
      __dataItem__Model.xData.groep = '';
      if (groepenId !== '') {
        __dataItem__Model.xData.groep = 'Iedereen';

        var found = loDash.find(dataFactoryGroepen.store, function (groep) {
          return groep.get('Id') === groepenId;
        });
        if (found) {
          __dataItem__Model.xData.groep = found.get('groep');
          //console.log('dataFactory__DataItem__ update__DataItem__ xData.groep: ', __dataItem__Model.xData.groep);
        }
      }

      $q.all([
        updateLabels(__dataItem__Model),
        updateSupModel(__dataItem__Model),
        updateReacties(__dataItem__Model)
      ]).then(function () {
        //console.log('dataFactory__DataItem__ reload updates SUCCESS');
        //return updateReacties(__dataItem__Model)
        watchUpdate(mode, __dataItem__Model);
        q.resolve();
      });


      __dataItem__Model.xData.pois = [];
      __dataItem__Model.xData.fotos = [];

      return q.promise;
    }
    //
    function watchUpdate(store) {

      //console.warn('dataFactory__DataItem__ watchUpdate store: ', store);
      var reacties, nieuweReacties;

      var watch = loDash.find(watchSyncs, function (watch) {
        return watch.store === store;
      });
      if (watch) {
        watch.done = watch.done + 1;
      }
      if (store === '__dataItem__Reload') {
        //console.log('================================================================================================================');
        //console.log('dataFactory__DataItem__ watchUpdate__DataItem__sList RELOAD updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactory__DataItem__ watchUpdate done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactory__DataItem__ watchUpdate__DataItem__sList RELOAD READY store, done, todo, notifications__DataItem__, notifications__DataItem__Reactie: ', store, watch.done, watch.todo, notifications__DataItem__, notifications__DataItem__Reactie);
          //console.log('===============================================================================================================');
          //console.warn('dataFactory__DataItem__ watchUpdate SUCCESS');

          if (notifications__DataItem__ > 0 || notifications__DataItem__Reactie > 0) {

            var __dataItem__sNieuw = [];
            var __dataItem__ReactiesNieuw = [];

            __dataItem__sNieuw = loDash.filter(dataFactory__DataItem__Sup.store, function (__dataItem__Sup) {
              return __dataItem__Sup.get('xnew');
            });

            __dataItem__ReactiesNieuw = loDash.filter(dataFactory__DataItem__ReactieSup.store, function (__dataItem__ReactieSup) {
              return __dataItem__ReactieSup.get('xnew');
            });

            //console.error('dataFactory__DataItem__ watchUpdate__DataItem__sList naar composeNotification notifications__DataItem__, dataFactory__DataItem__.nieuw.length, notifications__DataItem__Reactie, reacties.length: ', store, notifications__DataItem__, dataFactory__DataItem__.nieuw.length, notifications__DataItem__Reactie, __dataItem__ReactiesNieuw.length);

            if (__dataItem__sNieuw.length > 0 || __dataItem__ReactiesNieuw.length > 0) {
              dataFactoryNotification.composeTitleBodyNotification(__dataItem__sNieuw.length, __dataItem__ReactiesNieuw.length, '__dataItem__');
            }

            $timeout(function () {
              $rootScope.$emit('__dataItem__sFilter');
              $rootScope.$emit('__dataItem__sNieuweAantallen');
            }, 500);
          }
        }
      }
      if (store === '__dataItem__Refresh') {
        //console.log('================================================================================================================');
        //console.log('dataFactory__DataItem__ watchUpdate__DataItem__sList REFRESH updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactory__DataItem__ watchUpdateRefresh done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactory__DataItem__ watchUpdate__DataItem__sList REFRESH READY store, done, todo: ', store, watch.done, watch.todo);
          //console.log('dataFactory__DataItem__ watchUpdate__DataItem__sList REFRESH READY store, notifications__DataItem__, notifications__DataItem__Reactie: ', store, notifications__DataItem__, notifications__DataItem__Reactie);
          //console.log('===============================================================================================================');

          if (notifications__DataItem__ > 0 || notifications__DataItem__Reactie > 0) {

            var __dataItem__sNieuw = [];
            var __dataItem__ReactiesNieuw = [];

            __dataItem__sNieuw = loDash.filter(dataFactory__DataItem__Sup.store, function (__dataItem__Sup) {
              return __dataItem__Sup.get('xnew');
            });

            __dataItem__ReactiesNieuw = loDash.filter(dataFactory__DataItem__ReactieSup.store, function (__dataItem__ReactieSup) {
              return __dataItem__ReactieSup.get('xnew');
            });

            //console.error('dataFactory__DataItem__ watchUpdate__DataItem__sList naar composeNotification notifications__DataItem__, dataFactory__DataItem__.nieuw.length, notifications__DataItem__Reactie, reacties.length: ', store, notifications__DataItem__, dataFactory__DataItem__.nieuw.length, notifications__DataItem__Reactie, nieuweReacties.length);
            dataFactoryNotification.composeTitleBodyNotification(__dataItem__sNieuw.length, __dataItem__ReactiesNieuw.length, '__dataItem__');
          }

          $rootScope.$emit('__dataItem__sFilter');
          $rootScope.$emit('__dataItem__sNieuweAantallen');
        }
      }
    }
    //
    function update__DataItem__sList() {

      //console.warn('dataFactory__DataItem__ update__DataItem__sList');

      dataFactory__DataItem__Sup.store = loDash.sortBy(dataFactory__DataItem__Sup.store, 'changedOn');
      dataFactory__DataItem__Sup.store = loDash.uniqBy(dataFactory__DataItem__Sup.store, '__dataItem__Id');

      notifications__DataItem__ = 0;
      notifications__DataItem__Reactie = 0;

      todoTotal = 0;
      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === '__dataItem__Reload';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === '__dataItem__Reload';
        });
      }
      var watchSync = {
        store: '__dataItem__Reload',
        todo: dataFactory__DataItem__.store.length,
        done: 0
      };
      todoTotal = todoTotal + dataFactory__DataItem__.store.length;
      watchSyncs.push(watchSync);

      dataFactory__DataItem__Sup.store = loDash.uniqBy(dataFactory__DataItem__Sup.store, function (__dataItem__Sup) {
        return __dataItem__Sup.get('__dataItem__Id');
      });
      //console.log('dataFactory__DataItem__ TagStore: ', dataFactoryTag.store);
      //console.log('dataFactory__DataItem__ __dataItem__Store: ', dataFactory__DataItem__.store);
      //console.log('dataFactory__DataItem__ __dataItem__SupStore: ', dataFactory__DataItem__Sup.store);
      //console.log('dataFactory__DataItem__ __DataItem__TagStore: ', dataFactory__DataItem__Tag.store);
      if (dataFactory__DataItem__.store.length > 0) {

        var promises = [];

        loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
          //console.log('dataFactory__DataItem__ update__DataItem__List __dataItem__Model loop');
          //console.log('dataFactory__DataItem__ update__DataItem__List __dataItem__Model naam INITIAL UPDATE START: ', __dataItem__Model.get('naam'));
          promises.push(update__DataItem__(__dataItem__Model, '__dataItem__Reload'));
          //update__DataItem__(trackModel, '__dataItem__Reload').then(function () {
          //console.log('dataFactory__DataItem__ update__DataItem__sList naam INITIAL UPDATE SUCCES: ', __dataItem__Model.get('naam'));
          //});
        });
        promises.push(__dataItem__sCheckNieuwTooOld());
        $q.all(promises);
      }
    }
    //
    function update__DataItem__sTodos(todos) {

      //console.clear();
      //console.warn('dataFactory__DataItem__ update__DataItem__Todos: ', todos);

      var q = $q.defer();

      notifications__DataItem__ = 0;
      notifications__DataItem__Reactie = 0;

      todoTotal = 0;

      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === '__dataItem__Refresh';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === '__dataItem__Refresh';
        });
      }
      var watchSync = {
        store: '__dataItem__Refresh',
        todo: todos.length,
        done: 0
      };
      todoTotal = todoTotal + todos.length;
      watchSyncs.push(watchSync);

      if (todos.length > 0) {

        var promises = [];
        //
        loDash.each(todos, function (__dataItem__Id) {
          //loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
          //console.log(__dataItem__Model.get('Id'), __dataItem__Model.get('naam'), __dataItem__Model.get('xprive'), __dataItem__Model.get('gebruikerId'));
          //});
          var __dataItem__Model = loDash.find(dataFactory__DataItem__.store, function (__dataItem__Model) {
            return __dataItem__Model.get('Id') === __dataItem__Id;
          });
          if (__dataItem__Model) {
            if (__dataItem__Model.get('deletedOn') > '1970-01-02 00:00:00' || (__dataItem__Model.get('xprive') === true && __dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
              //console.log('dataFactory__DataItem__ update__DataItem__sTodos __dataItem__ naam REMOVE START: ', __dataItem__Model.get('naam'));
              promises.push(verwijder__DataItem__(__dataItem__Model, '__dataItem__Refresh', true));
            } else {
              //console.log('dataFactory__DataItem__ update__DataItem__sTodos __dataItem__ naam UPDATE START: ', __dataItem__Model.get('naam'));
              promises.push(update__DataItem__(__dataItem__Model, '__dataItem__Refresh'));
            }
          } else {
            //console.error('dataFactory__DataItem__ update__DataItem__Todos IS NOT __dataItem__Model: ', __dataItem__Id);
            watchUpdate('__dataItem__Refresh', __dataItem__Model);
          }
        });
        $q.all(promises).then(function () {
          //console.error('update__DataItem__sTodos all promises resolved');
          $rootScope.$emit('filter');
          $rootScope.$emit('__dataItem__sNieuweAantallen');

          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function __dataItem__sCheckNieuwTooOld() {

      //console.warn('dataFactory__DataItem__ __dataItem__sCheckNieuwTooOld START');

      var q = $q.defer();
      var tooOld = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
      //var tooOld = moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      //console.log('dataFactory__DataItem__ fotosCheckNieuwTooOld: ', tooOld);
      loDash.each(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
        var publishDatum = __dataItem__SupModel.get('createdOn');
        var xnew = __dataItem__SupModel.get('xnew');
        var __dataItem__Id = __dataItem__SupModel.get('__dataItem__Id');
        if (xnew) {
          //console.log('dataFactory__DataItem__ __dataItem__sCheckNieuwTooOld publishDatum if tooOld: ', publishDatum, tooOld, xnew, __dataItem__Id);
          if (publishDatum < tooOld) {
            //console.error('dataFactory__DataItem__ __dataItem__sCheckNieuwTooOld reset xnew');
            __dataItem__SupModel.set('xnew', false);
            __dataItem__SupModel.save();
            loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__Model) {
              return __dataItem__Model.get('Id') === __dataItem__Id;
            });
            $rootScope.$emit('filter');
            $rootScope.$emit('__dataItem__sNieuweAantallen');

            //console.error('dataFactory__DataItem__ __dataItem__sCheckNieuwTooOld updated SUCCESS');
          }
        }
      });
      q.resolve();
      return q.promise;
    }
    //
    function refresh() {

      //console.warn('dataFactory__DataItem__ refresh start');
      //
      //  Tags opnieuw ophalen omdat de store leeg is na reload?!?!?!?
      //
      if (dataFactoryTag.store.length === 0) {
        dataFactoryTag.store = dataFactory__DataItem__.tags;
        //console.log('dataFactory__DataItem__ Tag refresh restored: ', dataFactory__DataItem__.tags, dataFactoryTag.store);
      }
      if (virgin) {
        dataFactoryConfig.currentModel.set('virgin__DataItem__s', false);
        dataFactoryConfigX.update(dataFactoryConfig.currentModel);
        //console.warn('dataFactory__DataItem__ config reset virgin');
      }

      $q.all([
        dataFactoryTag.syncUp(),
        //removeIf(!fotos)
        dataFactoryHelp.syncUp(),
        dataFactoryBlacklist.syncUp(),
        //endRemoveIf(!fotos)
        //removeIf(!tracks)
        dataFactoryGroepen.syncUp(),
        dataFactoryGroepdeelnemers.syncUp(),
        //endRemoveIf(!tracks)
        dataFactory__DataItem__ReactieSup.syncUp(),
        dataFactory__DataItem__Reactie.syncUp(),
        dataFactory__DataItem__Tag.syncUp(),
        dataFactory__DataItem__Sup.syncUp(),
        dataFactory__DataItem__.syncUp()
      ]).then(function () {
        dataFactory__DataItem__.syncDownAll().then(function (newSyncDate) {

          //console.log('refresh dataFactory__DataItem__ newSyncDate: ', newSyncDate);

          if (newSyncDate !== null && newSyncDate !== undefined) {

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Sup, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Tag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Reactie, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__ReactieSup, newSyncDate);
            }
            dataFactoryTag.lastSyncDate = newSyncDate;
            dataFactory__DataItem__.lastSyncDate = newSyncDate;
            dataFactory__DataItem__Sup.lastSyncDate = newSyncDate;
            dataFactory__DataItem__Tag.lastSyncDate = newSyncDate;
            dataFactory__DataItem__Reactie.lastSyncDate = newSyncDate;
            dataFactory__DataItem__ReactieSup.lastSyncDate = newSyncDate;

            //
            //console.log('dataFactoryTag refresh Tag todo: ', dataFactoryTag.todo);
            //console.log('dataFactory__DataItem__ refresh __DataItem__ todo: ', dataFactory__DataItem__.todo);
            //console.log('dataFactory__DataItem__ refresh __DataItem__Sup todo: ', dataFactory__DataItem__Sup.todo);
            //console.log('dataFactory__DataItem__ refresh __DataItem__Tag todo: ', dataFactory__DataItem__Tag.todo);
            //console.log('dataFactory__DataItem__ refresh __dataItem__reactie todo: ', dataFactory__DataItem__Reactie.todo);
            //
            todostmp = [...dataFactory__DataItem__.todo, ...dataFactory__DataItem__Sup.todo, ...dataFactory__DataItem__Tag.todo, ...dataFactory__DataItem__Reactie.todo, ...dataFactory__DataItem__ReactieSup.todo];
            uniqueSet = new Set(todostmp);
            todos = [...uniqueSet];

            if (todos.length > 0) {

              update__DataItem__sTodos(todos).then(function () {

                //console.error('dataFactory__DataItem__ refresh update__DataItem__sTodos SUCCES');

                dataFactoryTag.todo = [];
                dataFactory__DataItem__.todo = [];
                dataFactory__DataItem__Sup.todo = [];
                dataFactory__DataItem__Tag.todo = [];
                dataFactory__DataItem__Reactie.todo = [];
                //console.log('dataFactory__DataItem__ refresh __dataItem__reactie Store: ', dataFactory__DataItem__Reactie.store);
                //console.log('dataFactory__DataItem__ refresh __DataItem__ Store: ', dataFactory__DataItem__.store);
                //console.log('dataFactory__DataItem__ refresh __DataItem__Sup Store: ', dataFactory__DataItem__Sup.store);
                //console.log('dataFactory__DataItem__ refresh __DataItem__Tag Store: ', dataFactory__DataItem__Tag.store);
                //console.log('dataFactory__DataItem__ refresh Tag.store: ', dataFactoryTag.store);
                //console.log(' ');
                todos = [];
              });
            }
          }
        });
      });
    }
    //
    function reload() {

      //console.warn('dataFactory__DataItem__ reload start');

      virgin = true;
      dataFactoryConfigX.loadMe().then(function () {
        virgin = dataFactoryConfig.currentModel.get('dataFactory__DataItem__ virgin__DataItem__s');
        //console.error('dataFactory__DataItem__ Virgin__DataItem__s FROM config DB: ', dataFactoryConfig.currentModel.get('virgin__DataItem__s'));
        //console.error('dataFactory__DataItem__ Virgin__DataItem__s: ', virgin);
      });
      //console.log('dataFactory__DataItem__ Wachten op dataFactoryConfig.currentModel');
      dataFactoryStore.storeInitAll(dataFactory__DataItem__, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactoryTag, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup).then(function (newSyncDate) {

        //console.error('dataFactory__DataItem__ reload dataFactory__DataItem__ newSyncDate: ', newSyncDate);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Sup, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Tag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__Reactie, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactory__DataItem__ReactieSup, newSyncDate);
        }
        dataFactoryTag.lastSyncDate = newSyncDate;
        dataFactory__DataItem__.lastSyncDate = newSyncDate;
        dataFactory__DataItem__Sup.lastSyncDate = newSyncDate;
        dataFactory__DataItem__Tag.lastSyncDate = newSyncDate;
        dataFactory__DataItem__Reactie.lastSyncDate = newSyncDate;
        dataFactory__DataItem__ReactieSup.lastSyncDate = newSyncDate;

        dataFactoryTag.loaded = true;
        dataFactory__DataItem__.loaded = true;
        dataFactory__DataItem__Sup.loaded = true;
        dataFactory__DataItem__Tag.loaded = true;
        dataFactory__DataItem__Reactie.loaded = true;
        dataFactory__DataItem__ReactieSup.loaded = true;

        //removeIf(!tracks)
        dataFactory__DataItem__PoisFotos.__dataItem__StoreReady = true;
        //dataFactory__DataItem__PoisFotos.init().then(function () {
        //console.log('dataFactory__DataItem__ __DataItem__PoisFotos.init SUCCESS');
        //});
        //endRemoveIf(!tracks)
        //console.log('dataFactory__DataItem__ reload wachten op Tag, Blacklist, Groepen en Groepdeelnemers');
        var interval = $interval(function () {

          //console.log('dataFactory__DataItem__ reload wachten op globalStores loaded: ', dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded);
          //if (dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
          if (dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
            $interval.cancel(interval);
            //console.error('dataFactory__DataItem__ reload SUCCESS');
            dataFactoryTag.todo = [];
            dataFactory__DataItem__.todo = [];
            dataFactory__DataItem__Sup.todo = [];
            dataFactory__DataItem__Tag.todo = [];
            dataFactory__DataItem__Reactie.todo = [];
            dataFactory__DataItem__ReactieSup.todo = [];

            //console.time('dataFactory__DataItem__-reloadUpdate__DataItem__sList');
            $rootScope.$emit('dataFactory__DataItem__ __dataItem__sFilter');
            dataFactoryTag.reStore().then(function () {
              dataFactory__DataItem__.tags = dataFactoryTag.store;
              //console.log('dataFactory__DataItem__ Tag reload restored: ', dataFactoryTag.store);
              update__DataItem__sList();
              dataFactory__DataItem__.tags = dataFactoryTag.store;
              dataFactory__DataItem__.verrijkt = true;
            });
            //console.warn('dataFactory__DataItem__ reload updateStores SUCCES');
            if (+ceo.profielId === 4 || +ceo.profielId === 5) {
              //console.error('dataFactory__DataItem__ reload started => refresh');
              $rootScope.$emit('__dataItem__sFilter');
              $rootScope.$emit('__dataItem__sNieuweAantallen');

              dataFactoryClock.startClock__DataItem__Slow(function () {
                refresh();
              });
            }
          }
        }, 50, 50);
      });
    }
    //
    $rootScope.$on('reload__DataItem__', function () {
      //console.log('dataFactory__DataItem__ reload__DataItem__ event');
      reload();
    });
    //
    $rootScope.$on('refresh__DataItem__', function () {
      //console.log('dataFactory__DataItem__ refresh__DataItem__ event');
      refresh();
    });
    //
    $rootScope.$on('sleepClock__DataItem__', function () {
      //console.debug('dataFactoryPoi sleepClock__DataItem__ event');
      dataFactoryClock.startClock__DataItem__Slow(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('startClock__DataItem__', function () {
      //console.debug('dataFactoryPoi startClock__DataItem__ event');
      dataFactoryClock.startClock__DataItem__Fast(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('stopClock__DataItem__', function () {
      //console.debug('dataFactoryPoi stopClock__DataItem__ event');
      dataFactoryClock.stopClock__DataItem__();
    });
    //
    //removeIf(!__dataItem__en)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactory__DataItem__ waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 500);
    //endRemoveIf(!__dataItem__en)
    //removeIf(!fotos)
    if (ceo.profielId === 5) {
      $timeout(function () {
        var teller = 0;
        var startInterval = $interval(function () {
          teller += 1;
          //console.log('dataFactory__DataItem__ waiting for Ceo.... ', teller);
          if (!angular.equals(dataFactoryCeo, {})) {
            $interval.cancel(startInterval);
            reload();
          }
        }, 100, 200);
      }, 5000);
    }
    //endRemoveIf(!fotos)
    //removeIf(!pois)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactory__DataItem__ waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 3000);
    //endRemoveIf(!pois)
    //removeIf(!tracks)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactory__DataItem__ waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 1000);
    //endRemoveIf(!tracks)

    return dataFactory__DataItem__;
  }]);
