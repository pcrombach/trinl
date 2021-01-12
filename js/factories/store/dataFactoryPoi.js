/* eslint-disable no-undef */
// eslint-disable-next-line no-undef

//removeIf(!pois)
trinl.factory('dataFactoryPoi', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryTag', 'dataFactoryHelp', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryPoiReactie', 'dataFactoryPoiReactieSup', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist, dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryTag, dataFactoryHelp, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryPoiReactie, dataFactoryPoiReactieSup, dataFactorySyncFS) {
    //endRemoveIf(!pois)
    

    

    


    //console.warn('dataFactoryPoi');

    var dataFactoryPoi = {};
    var me = dataFactoryPoi;

    dataFactoryPoi.storeId = 'poi';

    dataFactoryPoi.virgin = true;

    dataFactoryPoi.fsEnable = true;
    dataFactoryPoi.fsReady = false;

    dataFactoryPoi.idProperty = '';

    dataFactoryPoi.data = {};
    dataFactoryPoi.store = [];
    dataFactoryPoi.removedRecords = [];

    dataFactoryPoi.nieuw = [];
    dataFactoryPoi.star = [];

    dataFactoryPoi.current = '';
    dataFactoryPoi.selected = [];
    dataFactoryPoi.filters = [];
    dataFactoryPoi.sorters = [];
    dataFactoryPoi.actualTime = '1970-01-02 00:00:00';

    dataFactoryPoi.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryPoi.tmpArray = [];
    dataFactoryPoi.tmpArray2 = [];
    dataFactoryPoi.currentPoiId = '';

    dataFactoryPoi.globalsLoadReady = false;
    dataFactoryPoi.card = false;
    dataFactoryPoi.verrijkt = false;
    dataFactoryPoi.loaded = false;
    dataFactoryPoi.autoSync = true;
    dataFactoryPoi.enableSyncUp = true;
    dataFactoryPoi.enableSyncDown = true;
    dataFactoryPoi.delaySyncUpTime = 0;
    dataFactoryPoi.todo = [];
    dataFactoryPoiSup.todo = [];
    dataFactoryPoiTag.todo = [];
    dataFactoryPoiReactie.todo = [];
    dataFactoryPoiReactieSup.todo = [];
    dataFactoryPoi.sideMenuTags = [];

    dataFactoryPoi.remoteSync = true;

    dataFactoryPoi.currentPage = 1;
    dataFactoryPoi.pageSize = 2500;

    dataFactoryPoi.xprive = '0';

    dataFactoryPoi.refreshDone = false;

    dataFactoryPoi.Model = function (config) {

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
      
      //removeIf(!poien)
      this.poiId = {
        value: config.poiId || '',
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
      //endRemoveIf(!poien)
      
      
      //removeIf(poien)
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
      //endRemoveIf(!poien)
      
      
      
      
      //removeIf(!pois)
      this.soort = {
        value: config.soort || '',
        dirty: false,
        type: 'string'
      };
      //endRemoveIf(!pois)
      
      
      

      dataFactoryObjectId.create();

      return this;
    };

    dataFactoryPoi.Model.prototype = {
      get: function (prop) {
        //console.log(dataFactoryPoi.storeId + ' get: ' + prop);
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
        return dataFactoryPoi.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        //console.error('save: ', m);
        return dataFactoryPoi.save(m);
      },
      setAll: function () {
        //console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryPoi.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        //console.log('poi unsetAll');

        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          if (field !== true && field !== false) {
            //console.log('poi unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        loDash.each(dataFactoryPoi.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        //console.log('poi unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        //console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactoryPoi.data, function (item) {
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
          loDash.each(dataFactoryPoi.data, function (item) {
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
        loDash.each(dataFactoryPoi.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactoryPoi.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactoryPoi.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactoryPoi.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactoryPoi.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryPoi.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactoryPoi.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactoryPoi.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactoryPoi.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactoryPoi.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactoryPoi.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactoryPoi.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactoryPoi.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactoryPoi.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactoryPoi.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactoryPoi.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactoryPoi.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactoryPoi.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactoryPoi.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactoryPoi.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactoryPoi.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactoryPoi.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactoryPoi.loadAll = function () {
      return dataFactoryStore.loadAll(me);
    };

    dataFactoryPoi.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactoryPoi.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactoryPoi.syncUpAll = function () {
      return dataFactoryStore.syncUpAll(me);
    };

    dataFactoryPoi.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactoryPoi.syncDownAll = function (update) {
      return dataFactoryStore.syncDownAll(dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTag, dataFactoryPoiReactie, dataFactoryPoiReactieSup, update);
    };

    dataFactoryPoi.init = function () {
      //console.warn('dataFactoryPoi init');

      dataFactoryPoi.fsReady = false;
      dataFactoryPoi.loaded = false;
      dataFactoryPoi.star = [];
      dataFactoryPoi.nieuw = [];
      dataFactoryPoi.selected = [];
      dataFactoryPoi.data = [];
      dataFactoryPoi.store = [];
      dataFactoryPoi.removedRecords = [];
      dataFactoryPoi.current = '';
      dataFactoryPoi.filters = [];
      dataFactoryPoi.sorters = [];
      dataFactoryPoi.actualTime = '1970-01-02 00:00:00';
      dataFactoryPoi.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryPoi.tmpArray = [];
      dataFactoryPoiSup.todo = [];
      dataFactoryPoiTag.todo = [];
      dataFactoryPoiReactie.todo = [];
      dataFactoryPoiReactieSup.todo = [];
    };
    //
    dataFactoryPoi.init();
    //
    var watchSyncs = [];
    var todoTotal = 0;
    var notificationsPoi = 0;
    var notificationsPoiReactie = 0;
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
    // Het gaat hier om een gepubliceerd poiModel die door de eigenaar is geprivatiseerd of defintief verwijderd heeft.
    // De volger hoeft alleen maar de dit poiModel/poiSupModel en poiTagModellen (incl updaten van de lables in SideMenu) 
    // uit zijn stores te verwijderen.
    // Dit poiModel is dan niet meer zichtbaar in zijn TRINL.
    // Hij laat zijn PoiSup PoiReactieModel PoiReactieSupModel en PoiTagModellen in de database.
    // Als de eigenaar deze Poi opnieuw publiceerd worden de Sup en Reactie bestanden weer toegevoegd.
    // Deze POI blijft bij de volger weg als deze Poi geprivatiseerd blijft. De Als de Poi niet gesyncd wordt dan worden ook de andere Modellen niet gesynced.
    // !!!Attentie. De updates van dit poiModel, poiSupModel, Reacties en poiTags gaan gewoon door. Nagaan of de volger hierdoor niet lastig gevallen wordt!!!
    // LoadAll gaat goed. Dit poiModel wordt niet meer geload.
    // SyncDownAll !!!!!!!!!!!!!! SyncDown haalt ook nieuwe modellen op. Alles moet gewoon door de FrontEndAPI in
    // stores worden bijgewerkt. De gelinkte bestanden zijn
    // jammer genoeg overbodig als er geen itemModel is. De volgende loadAll laadt deze overbodige modellen toch niet meer.
    // 
    function verwijderPoi(poiModel, mode, watch) {

      var q = $q.defer();
      //console.warn('dataFactoryPoi verwijderPoi: ', poiModel.get('naam'));

      var poiId = poiModel.get('Id');

      initxData(poiModel);
      //
      //  Clean up stores
      //
      loDash.remove(dataFactoryPoi.star, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      loDash.remove(dataFactoryPoi.nieuw, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      loDash.remove(dataFactoryPoi.selected, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });
      //
      //  Verwijderen labels in sidemenu
      //
      loDash.each(poiModel.xData.tags, function (poiTagModel) {
        //console.log('dataFactoryPoi updateLabels loop Tags: ', poiTagModel, poiTagModel.xData);
        tagsRemove(poiModel, poiTagModel.xData);
      });
      poiModel.xData.tags = [];
      //

      $rootScope.$emit('poiSideMenuUpdate');
      //
      loDash.remove(dataFactoryPoiTag.store, function (poiTagModel) {
        return poiTagModel.get('poiId') === poiId && poiTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryPoiTag.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryPoi verwijderPoi poiTags VERWIJDERD form poiTagStore/data');

      loDash.remove(dataFactoryPoiReactie.store, function (poiReactieModel) {
        return poiReactieModel.get('poiId') === poiId;
      });
      loDash.remove(dataFactoryPoiReactie.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId;
      });
      //console.warn('dataFactoryPoi verwijderPoi poiReactie VERWIJDERD form poiReactieStore/data');

      loDash.remove(dataFactoryPoiReactieSup.store, function (poiReactieSupModel) {
        return poiReactieSupModel.get('poiId') === poiId && poiReactieSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryPoiReactieSup.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('dataFactoryPoi verwijderPoi poiReactieSups VERWIJDERD from store');

      loDash.remove(dataFactoryPoiSup.store, function (poiSupModel) {
        return poiSupModel.get('poiId') === poiId && poiSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryPoiSup.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryPoi verwijderPoi poiSup VERWIJDERD from poiSupStore/data');

      //updateLabels(poiModel).then(function () {
      loDash.remove(dataFactoryPoi.store, function (poiModel) {
        //console.log('dataFactoryPoi verwijderPoi poiverijderen loDash remove: ', poiModel, poiId, poiModel.get('Id'), poiModel.get('xprive'), poiModel.get('gebruikerId'), poiModel.get('naam'));
        return poiModel.get('Id') === poiId;
      });
      loDash.remove(dataFactoryPoi.data, function (dataItem) {
        return dataItem.record.get('Id') === poiId;
      });
      //console.warn('dataFactoryPoi verwijderPoi poi VERWIJDERD from poiStore/data');
      //console.log('dataFactoryPoi verwijderPoi aantal dataFactoryPoi.store STORE: ', dataFactoryPoi.store, dataFactoryPoi.store.length);
      //
      //  Waarschuwing als de gebruiker in deze Card zit
      //
      $rootScope.$emit('poiVerwijderd', {
        poiModel: poiModel
      });

      if (watch) {
        watchUpdate(mode, poiModel);
      }
      $timeout(function () {
        $rootScope.$emit('poisFilter');
        $rootScope.$emit('poisNieuweAantallen');
      }, 500);

      q.resolve();
      //});

      return q.promise;
    }
    //
    function tagsRemove(poiModel, tagModel) {

      var q = $q.defer();

      //console.warn('PoisSideMenuCtrl tagsRemove poiModel, tagModel: ', poiModel, tagModel);
      //console.log('PoisSideMenuCtrl tagsRemove naam tag', poiModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find(dataFactoryPoi.sideMenuTags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('PoisSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = poiModel.get('naam');
        //
        //  Verwijder het poiModel uit de itemss tabel
        //
        //console.log('PoisSideMenuCtrl tagsRemove removing poi Id from xtag.items: ', poiModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (poi) {
          //return poi.Id === poiModel.get('Id') && poi.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return poi.get('Id') === poiModel.get('Id');
        });

        loDash.remove(dataFactoryPoi.sideMenuTags.pois, function (poi) {
          return poi.get('Id') === poiModel.get('Id');
        });

        if (xtag.items.length === 0) {
          loDash.remove(dataFactoryPoi.sideMenuTags, function (xtag) {
            return xtag.items.length === 0;
          });

          loDash.remove(dataFactoryPoi.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });
          sorteerSideMenuTags();

          q.resolve();

        } else {

          tmp = loDash.filter(xtag.items, function (poiModel) {
            return poiModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (poiModel) {
            return poiModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove(dataFactoryPoi.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('PoisSideMenuCtrl tagsAdd removed to update: ', xtag);
          dataFactoryPoi.sideMenuTags.push(xtag);

          sorteerSideMenuTags();
          q.resolve();
        }

        //console.log('PoisSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), dataFactoryPoi.sideMenuTags);
      } else {
        //console.log('PoisSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
        sorteerSideMenuTags();
        q.resolve();
      }

      return q.promise;
    }
    //    
    function tagsAdd(poiModel, tagModel) {

      var q = $q.defer();

      //console.log('PoisSideMenuCtrl tagsAdd poiModel, tagModel: ', poiModel, tagModel);
      //console.log('PoisSideMenuCtrl tagsAdd naam tag', poiModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find(dataFactoryPoi.sideMenuTags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten dataFactoryPoi.sideMenuTags hebben de volgende props:
      //  -    pois: een tabel met alle poiModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde poiModellen.
      //  -    aantal: het unieke aantal poiModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in poiTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste poiModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(poiModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (poiModel) {
          return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        dataFactoryPoi.sideMenuTags.push(xtag);
        sorteerSideMenuTags();
        //console.log('PoisSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', poiModel.get('naam'), poiModel.get('Id'), dataFactoryPoi.sideMenuTags);
        //console.log('PoisSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => dataFactoryPoi.sideMenuTags object naam, Id: ', poiModel.get('naam'), poiModel.get('Id'), dataFactoryPoi.sideMenuTags);

        q.resolve();
      } else {
        //
        //  Voeg het poiModel toe aan bestaand tag dataFactoryPoi.data.tag object
        //
        xtag.items.push(poiModel);
        //
        //  Update het poiTagModel
        //
        tmp = loDash.filter(xtag.items, function (poiModel) {
          return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (poiModel) {
          return poiModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove(dataFactoryPoi.sideMenuTags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('PoisSideMenuCtrl tagsAdd removed to update: ', xtag);
        dataFactoryPoi.sideMenuTags.push(xtag);
        //console.log('PoisSideMenuCtrl tagsAdd menu-onbject poiModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', poiModel.get('naam'), poiModel.get('Id'), dataFactoryPoi.sideMenuTags);
        sorteerSideMenuTags();

        q.resolve();
      }

      return q.promise;
    }
    //
    function sorteerSideMenuTags() {

      //console.warn('PoisSideMenuCtrl sorteerSideMenuTags');
      loDash.remove(dataFactoryPoi.sideMenuTags, function (xtag) {
        return xtag.length === 0;
      });
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(dataFactoryPoi.sideMenuTags, function (xtag) {
        return xtag.length !== 0 && xtag.tagId.length <= 3 && xtag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter(dataFactoryPoi.sideMenuTags, function (xtag) {
        return xtag.tagId.length <= 3 && xtag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter(dataFactoryPoi.sideMenuTags, function (xtag) {
        return xtag.tagId.length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      dataFactoryPoi.sideMenuTags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function updateLabels(poiModel) {
      //
      // Idere keer als labels geupdate worden helemaal opnieuw beginnen met een situatie zonder labels
      // Daarna de labels filteren die voor dit PoiModel bedoeld zijn.
      //

      var q = $q.defer();

      var poiId = poiModel.get('Id');

      //if (poiId === '5e3bfffadc6c26958502a5f5') {
      //console.log('================================================================================================');
      //console.log('dataFactoryPoi updateLabels POI naam: ', poiModel.get('naam'));
      //console.log('dataFactoryPoi updateLabels POI Id: ', poiId);
      //console.log('dataFactoryPoi updateLabels POI gebruikerId: ', poiModel.get('gebruikerId'));
      //console.log('================================================================================================');

      if (poiModel) {
        //console.log('dataFactory.Poi updatelabels poiModel: ', poiModel);
        //
        //  Eerst de oude labels verwijderen
        //  Deze staan in poiModel.xData.tags.xData
        //

        loDash.each(poiModel.xData.tags, function (poiTagModel) {
          //console.log('dataFactoryPoi updateLabels loop Tags: ', poiTagModel, poiTagModel.xData);
          tagsRemove(poiModel, poiTagModel.xData);
        });
        //
        //  Verwijder poiTags die verwijderd zijn of niet public zijn
        //
        loDash.remove(dataFactoryPoiTag.store, function (poiTagModel) {
          return poiTagModel.get('deletedOn') > '1970-01-02 00:00:00' || (poiTagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('xprive'));
        });
        loDash.remove(dataFactoryPoiTag.data, function (dataItem) {
          return dataItem.record.get('deletedOn') > '1970-01-02 00:00:00' || (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && dataItem.record.get('xprive'));
        });
        //
        //  Selecteer niet verwijderde poiTags van deze poi
        //
        var myPoiTags = [];
        //if (+ceo.profielId === 4 || +ceo.profielId === 5) {
        //myPoiTags = loDash.filter(dataFactoryPoiTag.store, function (poiTagModel) {
        //return (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('poiId') === poiId) || (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('poiId') === poiId && poiTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //return poiTagModel.get('poiId') === poiId && (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) || (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //});
        //} else {
        myPoiTags = loDash.filter(dataFactoryPoiTag.store, function (poiTagModel) {
          //return (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('poiId') === poiId) || (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && poiTagModel.get('poiId') === poiId && poiTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
          return poiTagModel.get('poiId') === poiId;
        });
        //}
        //console.log('dataFactoryPoi updateLabels dataFactoryPoiTag.store: ', dataFactoryPoiTag.store);
        //console.log('dataFactoryPoi updateLabels myPoitags: ', myPoiTags);
        poiModel.xData.tags = [];
        //
        //  Toevoegen myPoiTags
        //
        //console.log('dataFactoryPoi updateLabels myPoiTags TOEVOEGEN: ', myPoiTags);
        if (myPoiTags.length > 0) {
          loDash.each(myPoiTags, function (myPoiTagModel) {
            var tagId = myPoiTagModel.get('tagId');
            //console.log('dataFactoryPoi updateLabels myPoiTag toevoegen tagId: ', tagId);

            if (tagId) {

              //console.log('dataFactoryPoi updateLabels tagModel toevoegen tagId uit dataFactoryTag.store');

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });

              if (tagModel) {

                myPoiTagModel.xData = tagModel;

                //console.log('dataFactoryPoi updateLabels myPoiTag TOEVOEGEN in  SideMenu: ', poiModel.get('naam'), tagModel.get('tag'));
                //console.log('dataFactoryPoi updateLabels myPoiTag TOEVOEGEN in  poiModel.xData.tags: ', poiModel.get('naam'), myPoiTagModel);

                poiModel.xData.tags.push(myPoiTagModel);
                tagsAdd(poiModel, tagModel);
                $rootScope.$emit('poiSideMenuUpdate');

                //console.log('dataFactoryPoi updateLabels myPoiTag TOEGEVOEGD naam tag, xData.tags: ', poiModel.get('naam'), tagModel.get('tag'), poiModel.xData.tags);
              } else {
                //console.error('dataFactoryPoi updateLabels poitag toevoegen tagModel NOT FOUND: ', dataFactoryTag.store);
              }
            }
          });
          //console.log('dataFactoryPoi reload updateLabels SUCCESS');
          /*
          var oud = '';
          loDash.each(poiModel.xData.tags, function (tag) {
            if (oud !== poiModel.get('naam')) {
              //console.log(' ');
            }
            //console.error('dataFcatoryPoi updateLabels xdata.tags: ', poiModel.get('naam'), tag.xData.get('tag'));
            oud = poiModel.get('naam');
          });
          */
          q.resolve();

        } else {
          //$rootScope.$emit('labelsPoiUpdate', { poiModel: poiModel });
          //console.log('dataFactoryPoi resultaat xData.tags: ', poiModel.xData.tags);

          //console.log('dataFactoryPoi reload updateLabels SUCCESS');
          q.resolve();

        }

      } else {
        //console.log('dataFactoryPoi reload updateLabels SUCCESS');
        q.resolve();
      }
      //} else {
      //console.log('dataFactoryPoi updateLabels DEBUGGING');
      //q.resolve();
      //}

      return q.promise;
    }
    //
    //  Na de load van alle Sporen wordt in ieder poi bepaald of er nieuwe reacties zijn toegveoegd.
    //
    function updateReacties(poiModel) {

      //console.warn('dataFactoryPoi updateReacties naam: ', poiModel.get('naam'));

      var q = $q.defer();

      var poiId = poiModel.get('Id');

      var poiReacties = loDash.filter(dataFactoryPoiReactie.store, function (poiReactieModel) {
        return poiReactieModel.get('poiId') === poiId;
      });
      //console.log('dataFactoryPoi updateReacties poiReacties: ', poiReacties);
      if (poiReacties.length > 0) {
        //console.log('dataFactoryPoi updateReacties syncDown naam, poiId, poiReacties: ', poiModel.get('naam'), poiId, poiReacties);
        loDash.each(poiReacties, function (poiReactieModel) {
          //console.log('dataFactoryPoi updateReacties poiId, naam, reactie: ', poiId, poiModel.get('naam'), poiReactieModel.get('reactie'));
          var poiReactieId = poiReactieModel.get('Id');

          var poiReactieSupModel = loDash.find(dataFactoryPoiReactieSup.store, function (poiReactieSupModel) {
            return poiReactieSupModel.get('reactieId') === poiReactieId;
          });

          if (poiReactieSupModel) {

            poiReactieModel.xData = {};
            poiReactieModel.xData.tags = [];

            poiReactieModel.xData.sup = poiReactieSupModel;

            var xnew = poiReactieSupModel.get('xnew');

            if (xnew) {
              if (!virgin) {
                notificationsPoiReactie += 1;
              }
              var poiNieuwModel = loDash.find(dataFactoryPoi.nieuw, function (poiNieuwModel) {
                return poiNieuwModel.get('Id') === poiId;
              });
              if (!poiNieuwModel) {
                dataFactoryPoi.nieuw.push(poiModel);
                //console.log('dataFactoryPoi updatePoixnew toegevoegd aan nieuw: ', dataFactoryPoi.nieuw);
              }
            } else {
              loDash.remove(dataFactoryPoi.nieuw, function (poiNieuwModel) {
                return poiNieuwModel.get('Id') === poiId;
              });
              //console.log('dataFactoryPoi updatePoi xnew verwijderd: ', dataFactoryPoi.nieuw);
            }
          } else {
            //console.log('dataFactoryPoi updatePoireacties heeft nog geen poiReactieSupModel. Dus nieuw poiReactieSupModel aanmaken!!');

            poiReactieSupModel = new dataFactoryPoiReactieSup.Model();
            poiReactieSupModel.set('reactieId', poiReactieId);
            poiReactieSupModel.set('poiId', poiId);
            poiReactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            poiReactieSupModel.set('star', false);
            poiReactieSupModel.set('xnew', true);
            if (virgin) {
              poiReactieSupModel.set('xnew', false);
            }
            poiReactieSupModel.save().then(function () {

              //console.log('dataFactoryPoi updateReacties poiReactieSupModel CREATED.');

              poiReactieModel.xData = {};
              poiReactieModel.xData.tags = [];
              poiReactieModel.xData.sup = poiReactieSupModel;

              //console.log('dataFactoryPoi updateReacties poiReactieSupModel toegevoegd aan Reactie.');

              var poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSupModel) {
                return poiSupModel.get('poiId') === poiId && poiSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });

              if (poiSupModel) {
                //console.log('dataFactoryPoi updateReacties poiSupModel gevonden: ', poiId, poiModel.get('naam'));
                poiModel.xData.sup = poiSupModel;

                var xnew = poiSupModel.get('xnew');
                var star = poiSupModel.get('star');
                //console.log('dataFactoryPoi updatePoi poiModel, poiModel.xData.sup UPDATE poiId: ', poiModel, poiModel.xData.sup, poiModel.xData.sup.get('poiId'));

                if (star) {
                  var poiStarModel = loDash.find(dataFactoryPoi.star, function (poiStarModel) {
                    return poiStarModel.get('Id') === poiId;
                  });
                  if (!poiStarModel) {
                    dataFactoryPoi.star.push(poiModel);
                    //console.log('dataFactoryPoi updatePoi star toegevoegd: ', dataFactoryPoi.star);
                  }
                } else {
                  loDash.remove(dataFactoryPoi.star, function (poiStarModel) {
                    return poiStarModel.get('Id') === poiId;
                  });
                  //console.log('dataFactoryPoi updatePoi star verwijderd: ', dataFactoryPoi.star);
                }

                //console.log('dataFactoryPoi updatePoi xnew: ', xnew);


                if (xnew) {
                  if (!virgin) {
                    notificationsPoi += 1;
                  }
                  var poiNieuwModel = loDash.find(dataFactoryPoi.nieuw, function (poiNieuwModel) {
                    return poiNieuwModel.get('Id') === poiId;
                  });
                  if (!poiNieuwModel) {
                    dataFactoryPoi.nieuw.push(poiModel);
                    //console.log('dataFactoryPoi updatePoixnew toegevoegd aan nieuw: ', dataFactoryPoi.nieuw);
                  }
                } else {
                  loDash.remove(dataFactoryPoi.nieuw, function (poiNieuwModel) {
                    return poiNieuwModel.get('Id') === poiId;
                  });
                  //console.log('dataFactoryPoi updatePoi xnew verwijderd: ', dataFactoryPoi.nieuw);
                }


                //console.log('dataFactoryPoi reload updateSupModel SUCCESS');
                q.resolve();

                //console.log('dataFactoryPoi updatePoiList heeft nog geen supModel. Dus nieuw!! Id, naam: ', poiModel.get('Id'), poiModel.get('naam'));

                poiSupModel = new dataFactoryPoiSup.Model();
                poiSupModel.set('poiId', poiId);
                poiSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                poiSupModel.set('star', false);
                poiSupModel.set('xnew', true);
                if (virgin) {
                  poiSupModel.set('xnew', false);
                  //console.log('dataFactoryPoi updatePoi nieuwe poienup niet als nieuw beschouwen. Gebruiker is maagd');
                }
                //console.log('dataFactoryPoi updatePoi nieuw poiSupModel: ', poiSupModel.get('poiId'));

                poiSupModel.save().then(function () {

                  //console.log('dataFactoryPoi updatePoi nieuw poiSupModel: ', poiSupModel);

                  poiModel.xData.sup = poiSupModel;

                  if (!virgin) {
                    notificationsPoi += 1;
                    var nieuwModel = loDash.find(dataFactoryPoi.nieuw, function (nieuwModel) {
                      return nieuwModel.get('Id') === poiId;
                    });
                    if (!nieuwModel) {
                      dataFactoryPoi.nieuw.push(poiModel);
                    }
                  } else {
                    //console.error('dataFactoryPoi updatePoi nieuwe poienup notifications skipped. Gebruiker is maagd');
                  }
                  //console.log('dataFactoryPoi updatePoi nieuwe poienup voor poiId NOT FOUND in PoiStore.nieuw: ', poiId, dataFactoryPoi.nieuw);

                  //console.log('dataFactoryPoi reload updateSupModel nieuwe poi SUCCESS');
                  q.resolve();

                });
              }
            });
          }
        });
        //console.log('dataFactoryPoi reload updateReacties SUCCESS');
        q.resolve();
      } else {
        //console.log('dataFactoryPoi reload updateReacties SUCCESS');
        q.resolve();
      }

      return q.promise;
    }

    function initxData(poiModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      //console.log('initxData START: ', poiModel);

      if (!poiModel.xData) {
        poiModel.xData = {};
        //console.log('dataFactoryPoi updatePoi xData: ', poiModel.xData);
      }
      if (!poiModel.xData.pois) {
        poiModel.xData.pois = [];
        //console.log('dataFactoryPoi updatePoi xData.pois: ', poiModel.xData.pois);
      }
      if (!poiModel.xData.fotos) {
        poiModel.xData.fotos = [];
        //console.log('dataFactoryPoi updatePoi xData.fotos: ', poiModel.xData.fotos);
      }
      if (!poiModel.xData.tags) {
        poiModel.xData.tags = [];
        //console.log('dataFactoryPoi updatePoi xData.tags: ', poiModel.xData.tags);
      }
      if (!poiModel.xData.groep) {
        poiModel.xData.groep = '';
        //console.log('dataFactoryPoi updatePoi xData.groep: ', poiModel.xData.groep);
      }
      //console.log('initxData READY: ', poiModel.xData);
    }
    //
    
    
    function updateSupModel(poiModel) {

      //console.log('dataFactoryPoi UpdatePoi: ', poiModel.get('naam'));

      var q = $q.defer();

      var poiId = poiModel.get('Id');
      var gebruikerId = dataFactoryCeo.currentModel.get('Id');

      var poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSupModel) {
        return poiSupModel.get('poiId') === poiId && poiSupModel.get('gebruikerId') === gebruikerId;
      });

      //console.log('dataFactoryPoi UpdateSupModel poiSupModel: ', poiSupModel);
      if (poiSupModel) {

        poiModel.xData.sup = poiSupModel;

        var xnew = poiSupModel.get('xnew');
        var star = poiSupModel.get('star');
        //console.log('dataFactoryPoi updatePoi poiModel, poiModel.xData.sup UPDATE poiId: ', poiModel, poiModel.xData.sup, poiModel.xData.sup.get('poiId'));

        if (star) {
          var poiStarModel = loDash.find(dataFactoryPoi.star, function (poiStarModel) {
            return poiStarModel.get('Id') === poiId;
          });
          if (!poiStarModel) {
            dataFactoryPoi.star.push(poiModel);
            //console.log('dataFactoryPoi updatePoi star toegevoegd: ', dataFactoryPoi.star);
          }
        } else {
          loDash.remove(dataFactoryPoi.star, function (poiStarModel) {
            return poiStarModel.get('Id') === poiId;
          });
          //console.log('dataFactoryPoi updatePoi star verwijderd: ', dataFactoryPoi.star);
        }

        //console.log('dataFactoryPoi updatePoi xnew: ', xnew);


        if (xnew) {
          if (!virgin) {
            notificationsPoi += 1;
          }
          var poiNieuwModel = loDash.find(dataFactoryPoi.nieuw, function (poiNieuwModel) {
            return poiNieuwModel.get('Id') === poiId;
          });
          if (!poiNieuwModel) {
            dataFactoryPoi.nieuw.push(poiModel);
            //console.log('dataFactoryPoi updatePoixnew toegevoegd aan nieuw: ', dataFactoryPoi.nieuw);
          }
        } else {
          loDash.remove(dataFactoryPoi.nieuw, function (poiNieuwModel) {
            return poiNieuwModel.get('Id') === poiId;
          });
          //console.log('dataFactoryPoi updatePoi xnew verwijderd: ', dataFactoryPoi.nieuw);
        }
        
        
        //console.log('dataFactoryPoi reload updateSupModel SUCCESS');
        q.resolve();
      } else {

        //console.log('dataFactoryPoi updatePoiList heeft nog geen supModel. Dus nieuw!! Id, naam: ', poiModel.get('Id'), poiModel.get('naam'));

        poiSupModel = new dataFactoryPoiSup.Model();
        poiSupModel.set('poiId', poiId);
        poiSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        poiSupModel.set('star', false);
        poiSupModel.set('xnew', true);
        if (virgin) {
          poiSupModel.set('xnew', false);
          //console.log('dataFactoryPoi updatePoi nieuwe poisup niet als nieuw beschouwen. Gebruiker is maagd');
        }
        //console.log('dataFactoryPoi updatePoi nieuw poiSupModel: ', poiSupModel.get('poiId'));

        poiSupModel.save().then(function () {

          //console.log('dataFactoryPoi updatePoi nieuw poiSupModel: ', poiSupModel);

          poiModel.xData.sup = poiSupModel;

          if (!virgin) {
            notificationsPoi += 1;
            var nieuwModel = loDash.find(dataFactoryPoi.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === poiId;
            });
            if (!nieuwModel) {
              dataFactoryPoi.nieuw.push(poiModel);
            }
          } else {
            //console.error('dataFactoryPoi updatePoi nieuwe poisup notifications skipped. Gebruiker is maagd');
          }
          //console.log('dataFactoryPoi updatePoi nieuwe poisup voor poiId NOT FOUND in PoiStore.nieuw: ', poiId, dataFactoryPoi.nieuw);

          //console.log('dataFactoryPoi reload updateSupModel nieuwe poi SUCCESS');
          q.resolve();

        });

      }

      return q.promise;
    }

    //
    function updatePoi(poiModel, mode) {

      var q = $q.defer();

      //console.warn('dataFactoryPoi updatePoi poi deletedOn, xprive, gebruikerId, naam : ', poiModel.get('deletedOn'), poiModel.get('xprive'), poiModel.get('gebruikerId'), poiModel.get('naam'));

      initxData(poiModel);

      var groepenId = poiModel.get('groepenId');
      //console.log('dataFactoryPoi updatePoi groepenId: ', groepenId);
      poiModel.xData.groep = '';
      if (groepenId !== '') {
        poiModel.xData.groep = 'Iedereen';

        var found = loDash.find(dataFactoryGroepen.store, function (groep) {
          return groep.get('Id') === groepenId;
        });
        if (found) {
          poiModel.xData.groep = found.get('groep');
          //console.log('dataFactoryPoi updatePoi xData.groep: ', poiModel.xData.groep);
        }
      }

      $q.all([
        updateLabels(poiModel),
        updateSupModel(poiModel),
        updateReacties(poiModel)
      ]).then(function () {
        //console.log('dataFactoryPoi reload updates SUCCESS');
        //return updateReacties(poiModel)
        watchUpdate(mode, poiModel);
        q.resolve();
      });


      poiModel.xData.pois = [];
      poiModel.xData.fotos = [];

      return q.promise;
    }
    //
    function watchUpdate(store) {

      //console.warn('dataFactoryPoi watchUpdate store: ', store);
      var reacties, nieuweReacties;

      var watch = loDash.find(watchSyncs, function (watch) {
        return watch.store === store;
      });
      if (watch) {
        watch.done = watch.done + 1;
      }
      if (store === 'poiReload') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryPoi watchUpdatePoisList RELOAD updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryPoi watchUpdate done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryPoi watchUpdatePoisList RELOAD READY store, done, todo, notificationsPoi, notificationsPoiReactie: ', store, watch.done, watch.todo, notificationsPoi, notificationsPoiReactie);
          //console.log('===============================================================================================================');
          //console.warn('dataFactoryPoi watchUpdate SUCCESS');

          if (notificationsPoi > 0 || notificationsPoiReactie > 0) {

            var poisNieuw = [];
            var poiReactiesNieuw = [];

            poisNieuw = loDash.filter(dataFactoryPoiSup.store, function (poiSup) {
              return poiSup.get('xnew');
            });

            poiReactiesNieuw = loDash.filter(dataFactoryPoiReactieSup.store, function (poiReactieSup) {
              return poiReactieSup.get('xnew');
            });

            //console.error('dataFactoryPoi watchUpdatePoisList naar composeNotification notificationsPoi, dataFactoryPoi.nieuw.length, notificationsPoiReactie, reacties.length: ', store, notificationsPoi, dataFactoryPoi.nieuw.length, notificationsPoiReactie, poiReactiesNieuw.length);

            if (poisNieuw.length > 0 || poiReactiesNieuw.length > 0) {
              dataFactoryNotification.composeTitleBodyNotification(poisNieuw.length, poiReactiesNieuw.length, 'poi');
            }

            $timeout(function () {
              $rootScope.$emit('poisFilter');
              $rootScope.$emit('poisNieuweAantallen');
            }, 500);
          }
        }
      }
      if (store === 'poiRefresh') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryPoi watchUpdatePoisList REFRESH updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryPoi watchUpdateRefresh done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryPoi watchUpdatePoisList REFRESH READY store, done, todo: ', store, watch.done, watch.todo);
          //console.log('dataFactoryPoi watchUpdatePoisList REFRESH READY store, notificationsPoi, notificationsPoiReactie: ', store, notificationsPoi, notificationsPoiReactie);
          //console.log('===============================================================================================================');

          if (notificationsPoi > 0 || notificationsPoiReactie > 0) {

            var poisNieuw = [];
            var poiReactiesNieuw = [];

            poisNieuw = loDash.filter(dataFactoryPoiSup.store, function (poiSup) {
              return poiSup.get('xnew');
            });

            poiReactiesNieuw = loDash.filter(dataFactoryPoiReactieSup.store, function (poiReactieSup) {
              return poiReactieSup.get('xnew');
            });

            //console.error('dataFactoryPoi watchUpdatePoisList naar composeNotification notificationsPoi, dataFactoryPoi.nieuw.length, notificationsPoiReactie, reacties.length: ', store, notificationsPoi, dataFactoryPoi.nieuw.length, notificationsPoiReactie, nieuweReacties.length);
            dataFactoryNotification.composeTitleBodyNotification(poisNieuw.length, poiReactiesNieuw.length, 'poi');
          }

          $rootScope.$emit('poisFilter');
          $rootScope.$emit('poisNieuweAantallen');
        }
      }
    }
    //
    function updatePoisList() {

      //console.warn('dataFactoryPoi updatePoisList');

      dataFactoryPoiSup.store = loDash.sortBy(dataFactoryPoiSup.store, 'changedOn');
      dataFactoryPoiSup.store = loDash.uniqBy(dataFactoryPoiSup.store, 'poiId');

      notificationsPoi = 0;
      notificationsPoiReactie = 0;

      todoTotal = 0;
      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'poiReload';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'poiReload';
        });
      }
      var watchSync = {
        store: 'poiReload',
        todo: dataFactoryPoi.store.length,
        done: 0
      };
      todoTotal = todoTotal + dataFactoryPoi.store.length;
      watchSyncs.push(watchSync);

      dataFactoryPoiSup.store = loDash.uniqBy(dataFactoryPoiSup.store, function (poiSup) {
        return poiSup.get('poiId');
      });
      //console.log('dataFactoryPoi TagStore: ', dataFactoryTag.store);
      //console.log('dataFactoryPoi poiStore: ', dataFactoryPoi.store);
      //console.log('dataFactoryPoi poiSupStore: ', dataFactoryPoiSup.store);
      //console.log('dataFactoryPoi PoiTagStore: ', dataFactoryPoiTag.store);
      if (dataFactoryPoi.store.length > 0) {

        var promises = [];

        loDash.each(dataFactoryPoi.store, function (poiModel) {
          //console.log('dataFactoryPoi updatePoiList poiModel loop');
          //console.log('dataFactoryPoi updatePoiList poiModel naam INITIAL UPDATE START: ', poiModel.get('naam'));
          promises.push(updatePoi(poiModel, 'poiReload'));
          //updatePoi(trackModel, 'poiReload').then(function () {
          //console.log('dataFactoryPoi updatePoisList naam INITIAL UPDATE SUCCES: ', poiModel.get('naam'));
          //});
        });
        promises.push(poisCheckNieuwTooOld());
        $q.all(promises);
      }
    }
    //
    function updatePoisTodos(todos) {

      //console.clear();
      //console.warn('dataFactoryPoi updatePoiTodos: ', todos);

      var q = $q.defer();

      notificationsPoi = 0;
      notificationsPoiReactie = 0;

      todoTotal = 0;

      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'poiRefresh';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'poiRefresh';
        });
      }
      var watchSync = {
        store: 'poiRefresh',
        todo: todos.length,
        done: 0
      };
      todoTotal = todoTotal + todos.length;
      watchSyncs.push(watchSync);

      if (todos.length > 0) {

        var promises = [];
        //
        loDash.each(todos, function (poiId) {
          //loDash.each(dataFactoryPoi.store, function (poiModel) {
          //console.log(poiModel.get('Id'), poiModel.get('naam'), poiModel.get('xprive'), poiModel.get('gebruikerId'));
          //});
          var poiModel = loDash.find(dataFactoryPoi.store, function (poiModel) {
            return poiModel.get('Id') === poiId;
          });
          if (poiModel) {
            if (poiModel.get('deletedOn') > '1970-01-02 00:00:00' || (poiModel.get('xprive') === true && poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
              //console.log('dataFactoryPoi updatePoisTodos poi naam REMOVE START: ', poiModel.get('naam'));
              promises.push(verwijderPoi(poiModel, 'poiRefresh', true));
            } else {
              //console.log('dataFactoryPoi updatePoisTodos poi naam UPDATE START: ', poiModel.get('naam'));
              promises.push(updatePoi(poiModel, 'poiRefresh'));
            }
          } else {
            //console.error('dataFactoryPoi updatePoiTodos IS NOT poiModel: ', poiId);
            watchUpdate('poiRefresh', poiModel);
          }
        });
        $q.all(promises).then(function () {
          //console.error('updatePoisTodos all promises resolved');
          $rootScope.$emit('filter');
          $rootScope.$emit('poisNieuweAantallen');

          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function poisCheckNieuwTooOld() {

      //console.warn('dataFactoryPoi poisCheckNieuwTooOld START');

      var q = $q.defer();
      var tooOld = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
      //var tooOld = moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      //console.log('dataFactoryPoi fotosCheckNieuwTooOld: ', tooOld);
      loDash.each(dataFactoryPoiSup.store, function (poiSupModel) {
        var publishDatum = poiSupModel.get('createdOn');
        var xnew = poiSupModel.get('xnew');
        var poiId = poiSupModel.get('poiId');
        if (xnew) {
          //console.log('dataFactoryPoi poisCheckNieuwTooOld publishDatum if tooOld: ', publishDatum, tooOld, xnew, poiId);
          if (publishDatum < tooOld) {
            //console.error('dataFactoryPoi poisCheckNieuwTooOld reset xnew');
            poiSupModel.set('xnew', false);
            poiSupModel.save();
            loDash.remove(dataFactoryPoi.nieuw, function (poiModel) {
              return poiModel.get('Id') === poiId;
            });
            $rootScope.$emit('filter');
            $rootScope.$emit('poisNieuweAantallen');

            //console.error('dataFactoryPoi poisCheckNieuwTooOld updated SUCCESS');
          }
        }
      });
      q.resolve();
      return q.promise;
    }
    //
    function refresh() {

      //console.warn('dataFactoryPoi refresh start');
      //
      //  Tags opnieuw ophalen omdat de store leeg is na reload?!?!?!?
      //
      if (dataFactoryTag.store.length === 0) {
        dataFactoryTag.store = dataFactoryPoi.tags;
        //console.log('dataFactoryPoi Tag refresh restored: ', dataFactoryPoi.tags, dataFactoryTag.store);
      }
      if (virgin) {
        dataFactoryConfig.currentModel.set('virginPois', false);
        dataFactoryConfigX.update(dataFactoryConfig.currentModel);
        //console.warn('dataFactoryPoi config reset virgin');
      }

      $q.all([
        dataFactoryTag.syncUp(),
        dataFactoryPoiReactieSup.syncUp(),
        dataFactoryPoiReactie.syncUp(),
        dataFactoryPoiTag.syncUp(),
        dataFactoryPoiSup.syncUp(),
        dataFactoryPoi.syncUp()
      ]).then(function () {
        dataFactoryPoi.syncDownAll().then(function (newSyncDate) {

          //console.log('refresh dataFactoryPoi newSyncDate: ', newSyncDate);

          if (newSyncDate !== null && newSyncDate !== undefined) {

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryPoi, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiSup, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiReactie, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiReactieSup, newSyncDate);
            }
            dataFactoryTag.lastSyncDate = newSyncDate;
            dataFactoryPoi.lastSyncDate = newSyncDate;
            dataFactoryPoiSup.lastSyncDate = newSyncDate;
            dataFactoryPoiTag.lastSyncDate = newSyncDate;
            dataFactoryPoiReactie.lastSyncDate = newSyncDate;
            dataFactoryPoiReactieSup.lastSyncDate = newSyncDate;

            //
            //console.log('dataFactoryTag refresh Tag todo: ', dataFactoryTag.todo);
            //console.log('dataFactoryPoi refresh Poi todo: ', dataFactoryPoi.todo);
            //console.log('dataFactoryPoi refresh PoiSup todo: ', dataFactoryPoiSup.todo);
            //console.log('dataFactoryPoi refresh PoiTag todo: ', dataFactoryPoiTag.todo);
            //console.log('dataFactoryPoi refresh poireactie todo: ', dataFactoryPoiReactie.todo);
            //
            todostmp = [...dataFactoryPoi.todo, ...dataFactoryPoiSup.todo, ...dataFactoryPoiTag.todo, ...dataFactoryPoiReactie.todo, ...dataFactoryPoiReactieSup.todo];
            uniqueSet = new Set(todostmp);
            todos = [...uniqueSet];

            if (todos.length > 0) {

              updatePoisTodos(todos).then(function () {

                //console.error('dataFactoryPoi refresh updatePoisTodos SUCCES');

                dataFactoryTag.todo = [];
                dataFactoryPoi.todo = [];
                dataFactoryPoiSup.todo = [];
                dataFactoryPoiTag.todo = [];
                dataFactoryPoiReactie.todo = [];
                //console.log('dataFactoryPoi refresh poireactie Store: ', dataFactoryPoiReactie.store);
                //console.log('dataFactoryPoi refresh Poi Store: ', dataFactoryPoi.store);
                //console.log('dataFactoryPoi refresh PoiSup Store: ', dataFactoryPoiSup.store);
                //console.log('dataFactoryPoi refresh PoiTag Store: ', dataFactoryPoiTag.store);
                //console.log('dataFactoryPoi refresh Tag.store: ', dataFactoryTag.store);
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

      //console.warn('dataFactoryPoi reload start');

      virgin = true;
      dataFactoryConfigX.loadMe().then(function () {
        virgin = dataFactoryConfig.currentModel.get('dataFactoryPoi virginPois');
        //console.error('dataFactoryPoi VirginPois FROM config DB: ', dataFactoryConfig.currentModel.get('virginPois'));
        //console.error('dataFactoryPoi VirginPois: ', virgin);
      });
      //console.log('dataFactoryPoi Wachten op dataFactoryConfig.currentModel');
      dataFactoryStore.storeInitAll(dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTag, dataFactoryPoiReactie, dataFactoryPoiReactieSup).then(function (newSyncDate) {

        //console.error('dataFactoryPoi reload dataFactoryPoi newSyncDate: ', newSyncDate);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryPoi, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiSup, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiReactie, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryPoiReactieSup, newSyncDate);
        }
        dataFactoryTag.lastSyncDate = newSyncDate;
        dataFactoryPoi.lastSyncDate = newSyncDate;
        dataFactoryPoiSup.lastSyncDate = newSyncDate;
        dataFactoryPoiTag.lastSyncDate = newSyncDate;
        dataFactoryPoiReactie.lastSyncDate = newSyncDate;
        dataFactoryPoiReactieSup.lastSyncDate = newSyncDate;

        dataFactoryTag.loaded = true;
        dataFactoryPoi.loaded = true;
        dataFactoryPoiSup.loaded = true;
        dataFactoryPoiTag.loaded = true;
        dataFactoryPoiReactie.loaded = true;
        dataFactoryPoiReactieSup.loaded = true;

        //console.log('dataFactoryPoi reload wachten op Tag, Blacklist, Groepen en Groepdeelnemers');
        var interval = $interval(function () {

          //console.log('dataFactoryPoi reload wachten op globalStores loaded: ', dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded);
          //if (dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
          if (dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
            $interval.cancel(interval);
            //console.error('dataFactoryPoi reload SUCCESS');
            dataFactoryTag.todo = [];
            dataFactoryPoi.todo = [];
            dataFactoryPoiSup.todo = [];
            dataFactoryPoiTag.todo = [];
            dataFactoryPoiReactie.todo = [];
            dataFactoryPoiReactieSup.todo = [];

            //console.time('dataFactoryPoi-reloadUpdatePoisList');
            $rootScope.$emit('dataFactoryPoi poisFilter');
            dataFactoryTag.reStore().then(function () {
              dataFactoryPoi.tags = dataFactoryTag.store;
              //console.log('dataFactoryPoi Tag reload restored: ', dataFactoryTag.store);
              updatePoisList();
              dataFactoryPoi.tags = dataFactoryTag.store;
              dataFactoryPoi.verrijkt = true;
            });
            //console.warn('dataFactoryPoi reload updateStores SUCCES');
            if (+ceo.profielId === 4 || +ceo.profielId === 5) {
              //console.error('dataFactoryPoi reload started => refresh');
              $rootScope.$emit('poisFilter');
              $rootScope.$emit('poisNieuweAantallen');

              dataFactoryClock.startClockPoiSlow(function () {
                refresh();
              });
            }
          }
        }, 50, 50);
      });
    }
    //
    $rootScope.$on('reloadPoi', function () {
      //console.log('dataFactoryPoi reloadPoi event');
      reload();
    });
    //
    $rootScope.$on('refreshPoi', function () {
      //console.log('dataFactoryPoi refreshPoi event');
      refresh();
    });
    //
    $rootScope.$on('sleepClockPoi', function () {
      //console.debug('dataFactoryPoi sleepClockPoi event');
      dataFactoryClock.startClockPoiSlow(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('startClockPoi', function () {
      //console.debug('dataFactoryPoi startClockPoi event');
      dataFactoryClock.startClockPoiFast(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('stopClockPoi', function () {
      //console.debug('dataFactoryPoi stopClockPoi event');
      dataFactoryClock.stopClockPoi();
    });
    //
    //removeIf(!poien)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryPoi waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 500);
    //endRemoveIf(!poien)
    //removeIf(!pois)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryPoi waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 3000);
    //endRemoveIf(!pois)
    return dataFactoryPoi;
  }]);
