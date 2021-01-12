/* eslint-disable no-undef */
// eslint-disable-next-line no-undef



    

    
//removeIf(!berichten)
trinl.factory('dataFactoryBericht', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryBerichtSup', 'dataFactoryBerichtTag', 'dataFactoryBerichtReactie', 'dataFactoryBerichtReactieSup', 'dataFactorySyncFS',
function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryHelp, dataFactoryTag, dataFactoryBerichtSup, dataFactoryBerichtTag, dataFactoryBerichtReactie, dataFactoryBerichtReactieSup, dataFactorySyncFS) {
  //endRemoveIf(!berichten)
  

    //console.warn('dataFactoryBericht');

    var dataFactoryBericht = {};
    var me = dataFactoryBericht;

    dataFactoryBericht.storeId = 'bericht';

    dataFactoryBericht.virgin = true;

    dataFactoryBericht.fsEnable = true;
    dataFactoryBericht.fsReady = false;

    dataFactoryBericht.idProperty = '';

    dataFactoryBericht.data = {};
    dataFactoryBericht.store = [];
    dataFactoryBericht.removedRecords = [];

    dataFactoryBericht.nieuw = [];
    dataFactoryBericht.star = [];

    dataFactoryBericht.current = '';
    dataFactoryBericht.selected = [];
    dataFactoryBericht.filters = [];
    dataFactoryBericht.sorters = [];
    dataFactoryBericht.actualTime = '1970-01-02 00:00:00';

    dataFactoryBericht.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryBericht.tmpArray = [];
    dataFactoryBericht.tmpArray2 = [];
    dataFactoryBericht.currentBerichtId = '';

    dataFactoryBericht.globalsLoadReady = false;
    dataFactoryBericht.card = false;
    dataFactoryBericht.verrijkt = false;
    dataFactoryBericht.loaded = false;
    dataFactoryBericht.autoSync = true;
    dataFactoryBericht.enableSyncUp = true;
    dataFactoryBericht.enableSyncDown = true;
    dataFactoryBericht.delaySyncUpTime = 0;
    dataFactoryBericht.todo = [];
    dataFactoryBerichtSup.todo = [];
    dataFactoryBerichtTag.todo = [];
    dataFactoryBerichtReactie.todo = [];
    dataFactoryBerichtReactieSup.todo = [];
    dataFactoryBericht.sideMenuTags = [];

    dataFactoryBericht.remoteSync = true;

    dataFactoryBericht.currentPage = 1;
    dataFactoryBericht.pageSize = 2500;

    dataFactoryBericht.xprive = '0';

    dataFactoryBericht.refreshDone = false;

    dataFactoryBericht.Model = function (config) {

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
      
      //removeIf(!berichten)
      this.berichtId = {
        value: config.berichtId || '',
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
      //endRemoveIf(!berichten)
      
      
      //removeIf(berichten)
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
      //endRemoveIf(!berichten)
      
      
      
      
      
      
      

      dataFactoryObjectId.create();

      return this;
    };

    dataFactoryBericht.Model.prototype = {
      get: function (prop) {
        //console.log(dataFactoryBericht.storeId + ' get: ' + prop);
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
        return dataFactoryBericht.remove(m);
      },
      save: function () {
        //console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        //console.error('save: ', m);
        return dataFactoryBericht.save(m);
      },
      setAll: function () {
        //console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryBericht.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        //console.log('bericht unsetAll');

        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          if (field !== true && field !== false) {
            //console.log('bericht unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        loDash.each(dataFactoryBericht.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        //console.log('bericht unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        //console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactoryBericht.data, function (item) {
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
          loDash.each(dataFactoryBericht.data, function (item) {
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
        loDash.each(dataFactoryBericht.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        //console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactoryBericht.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactoryBericht.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactoryBericht.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactoryBericht.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryBericht.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactoryBericht.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactoryBericht.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactoryBericht.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactoryBericht.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactoryBericht.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactoryBericht.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactoryBericht.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactoryBericht.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactoryBericht.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactoryBericht.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactoryBericht.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactoryBericht.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactoryBericht.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactoryBericht.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactoryBericht.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactoryBericht.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactoryBericht.loadAll = function () {
      return dataFactoryStore.loadAll(me);
    };

    dataFactoryBericht.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactoryBericht.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactoryBericht.syncUpAll = function () {
      return dataFactoryStore.syncUpAll(me);
    };

    dataFactoryBericht.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactoryBericht.syncDownAll = function (update) {
      return dataFactoryStore.syncDownAll(dataFactoryBericht, dataFactoryBerichtSup, dataFactoryBerichtTag, dataFactoryTag, dataFactoryBerichtReactie, dataFactoryBerichtReactieSup, update);
    };

    dataFactoryBericht.init = function () {
      //console.warn('dataFactoryBericht init');

      dataFactoryBericht.fsReady = false;
      dataFactoryBericht.loaded = false;
      dataFactoryBericht.star = [];
      dataFactoryBericht.nieuw = [];
      dataFactoryBericht.selected = [];
      dataFactoryBericht.data = [];
      dataFactoryBericht.store = [];
      dataFactoryBericht.removedRecords = [];
      dataFactoryBericht.current = '';
      dataFactoryBericht.filters = [];
      dataFactoryBericht.sorters = [];
      dataFactoryBericht.actualTime = '1970-01-02 00:00:00';
      dataFactoryBericht.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryBericht.tmpArray = [];
      dataFactoryBerichtSup.todo = [];
      dataFactoryBerichtTag.todo = [];
      dataFactoryBerichtReactie.todo = [];
      dataFactoryBerichtReactieSup.todo = [];
    };
    //
    dataFactoryBericht.init();
    //
    var watchSyncs = [];
    var todoTotal = 0;
    var notificationsBericht = 0;
    var notificationsBerichtReactie = 0;
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
    // Het gaat hier om een gepubliceerd berichtModel die door de eigenaar is geprivatiseerd of defintief verwijderd heeft.
    // De volger hoeft alleen maar de dit berichtModel/berichtSupModel en berichtTagModellen (incl updaten van de lables in SideMenu) 
    // uit zijn stores te verwijderen.
    // Dit berichtModel is dan niet meer zichtbaar in zijn TRINL.
    // Hij laat zijn BerichtSup BerichtReactieModel BerichtReactieSupModel en BerichtTagModellen in de database.
    // Als de eigenaar deze Bericht opnieuw publiceerd worden de Sup en Reactie bestanden weer toegevoegd.
    // Deze POI blijft bij de volger weg als deze Bericht geprivatiseerd blijft. De Als de Bericht niet gesyncd wordt dan worden ook de andere Modellen niet gesynced.
    // !!!Attentie. De updates van dit berichtModel, berichtSupModel, Reacties en berichtTags gaan gewoon door. Nagaan of de volger hierdoor niet lastig gevallen wordt!!!
    // LoadAll gaat goed. Dit berichtModel wordt niet meer geload.
    // SyncDownAll !!!!!!!!!!!!!! SyncDown haalt ook nieuwe modellen op. Alles moet gewoon door de FrontEndAPI in
    // stores worden bijgewerkt. De gelinkte bestanden zijn
    // jammer genoeg overbodig als er geen itemModel is. De volgende loadAll laadt deze overbodige modellen toch niet meer.
    // 
    function verwijderBericht(berichtModel, mode, watch) {

      var q = $q.defer();
      //console.warn('dataFactoryBericht verwijderBericht: ', berichtModel.get('naam'));

      var berichtId = berichtModel.get('Id');

      initxData(berichtModel);
      //
      //  Clean up stores
      //
      loDash.remove(dataFactoryBericht.star, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      loDash.remove(dataFactoryBericht.nieuw, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      loDash.remove(dataFactoryBericht.selected, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });
      //
      //  Verwijderen labels in sidemenu
      //
      loDash.each(berichtModel.xData.tags, function (berichtTagModel) {
        //console.log('dataFactoryBericht updateLabels loop Tags: ', berichtTagModel, berichtTagModel.xData);
        tagsRemove(berichtModel, berichtTagModel.xData);
      });
      berichtModel.xData.tags = [];
      //

      $rootScope.$emit('berichtSideMenuUpdate');
      //
      loDash.remove(dataFactoryBerichtTag.store, function (berichtTagModel) {
        return berichtTagModel.get('berichtId') === berichtId && berichtTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryBerichtTag.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryBericht verwijderBericht berichtTags VERWIJDERD form berichtTagStore/data');

      loDash.remove(dataFactoryBerichtReactie.store, function (berichtReactieModel) {
        return berichtReactieModel.get('berichtId') === berichtId;
      });
      loDash.remove(dataFactoryBerichtReactie.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId;
      });
      //console.warn('dataFactoryBericht verwijderBericht berichtReactie VERWIJDERD form berichtReactieStore/data');

      loDash.remove(dataFactoryBerichtReactieSup.store, function (berichtReactieSupModel) {
        return berichtReactieSupModel.get('berichtId') === berichtId && berichtReactieSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryBerichtReactieSup.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('dataFactoryBericht verwijderBericht berichtReactieSups VERWIJDERD from store');

      loDash.remove(dataFactoryBerichtSup.store, function (berichtSupModel) {
        return berichtSupModel.get('berichtId') === berichtId && berichtSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryBerichtSup.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryBericht verwijderBericht berichtSup VERWIJDERD from berichtSupStore/data');

      //updateLabels(berichtModel).then(function () {
      loDash.remove(dataFactoryBericht.store, function (berichtModel) {
        //console.log('dataFactoryBericht verwijderBericht berichtverijderen loDash remove: ', berichtModel, berichtId, berichtModel.get('Id'), berichtModel.get('xprive'), berichtModel.get('gebruikerId'), berichtModel.get('naam'));
        return berichtModel.get('Id') === berichtId;
      });
      loDash.remove(dataFactoryBericht.data, function (dataItem) {
        return dataItem.record.get('Id') === berichtId;
      });
      //console.warn('dataFactoryBericht verwijderBericht bericht VERWIJDERD from berichtStore/data');
      //console.log('dataFactoryBericht verwijderBericht aantal dataFactoryBericht.store STORE: ', dataFactoryBericht.store, dataFactoryBericht.store.length);
      //
      //  Waarschuwing als de gebruiker in deze Card zit
      //
      $rootScope.$emit('berichtVerwijderd', {
        berichtModel: berichtModel
      });

      if (watch) {
        watchUpdate(mode, berichtModel);
      }
      $timeout(function () {
        $rootScope.$emit('berichtenFilter');
        $rootScope.$emit('berichtenNieuweAantallen');
      }, 500);

      q.resolve();
      //});

      return q.promise;
    }
    //
    function tagsRemove(berichtModel, tagModel) {

      var q = $q.defer();

      //console.warn('BerichtenSideMenuCtrl tagsRemove berichtModel, tagModel: ', berichtModel, tagModel);
      //console.log('BerichtenSideMenuCtrl tagsRemove naam tag', berichtModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find(dataFactoryBericht.sideMenuTags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('BerichtenSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = berichtModel.get('naam');
        //
        //  Verwijder het berichtModel uit de itemss tabel
        //
        //console.log('BerichtenSideMenuCtrl tagsRemove removing bericht Id from xtag.items: ', berichtModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (bericht) {
          //return bericht.Id === berichtModel.get('Id') && bericht.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return bericht.get('Id') === berichtModel.get('Id');
        });

        loDash.remove(dataFactoryBericht.sideMenuTags.berichten, function (bericht) {
          return bericht.get('Id') === berichtModel.get('Id');
        });

        if (xtag.items.length === 0) {
          loDash.remove(dataFactoryBericht.sideMenuTags, function (xtag) {
            return xtag.items.length === 0;
          });

          loDash.remove(dataFactoryBericht.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });
          sorteerSideMenuTags();

          q.resolve();

        } else {

          tmp = loDash.filter(xtag.items, function (berichtModel) {
            return berichtModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (berichtModel) {
            return berichtModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove(dataFactoryBericht.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('BerichtenSideMenuCtrl tagsAdd removed to update: ', xtag);
          dataFactoryBericht.sideMenuTags.push(xtag);

          sorteerSideMenuTags();
          q.resolve();
        }

        //console.log('BerichtenSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), dataFactoryBericht.sideMenuTags);
      } else {
        //console.log('BerichtenSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
        sorteerSideMenuTags();
        q.resolve();
      }

      return q.promise;
    }
    //    
    function tagsAdd(berichtModel, tagModel) {

      var q = $q.defer();

      //console.log('BerichtenSideMenuCtrl tagsAdd berichtModel, tagModel: ', berichtModel, tagModel);
      //console.log('BerichtenSideMenuCtrl tagsAdd naam tag', berichtModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find(dataFactoryBericht.sideMenuTags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten dataFactoryBericht.sideMenuTags hebben de volgende props:
      //  -    berichten: een tabel met alle berichtModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde berichtModellen.
      //  -    aantal: het unieke aantal berichtModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in berichtTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste berichtModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(berichtModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (berichtModel) {
          return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        dataFactoryBericht.sideMenuTags.push(xtag);
        sorteerSideMenuTags();
        //console.log('BerichtenSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', berichtModel.get('naam'), berichtModel.get('Id'), dataFactoryBericht.sideMenuTags);
        //console.log('BerichtenSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => dataFactoryBericht.sideMenuTags object naam, Id: ', berichtModel.get('naam'), berichtModel.get('Id'), dataFactoryBericht.sideMenuTags);

        q.resolve();
      } else {
        //
        //  Voeg het berichtModel toe aan bestaand tag dataFactoryBericht.data.tag object
        //
        xtag.items.push(berichtModel);
        //
        //  Update het berichtTagModel
        //
        tmp = loDash.filter(xtag.items, function (berichtModel) {
          return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (berichtModel) {
          return berichtModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove(dataFactoryBericht.sideMenuTags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('BerichtenSideMenuCtrl tagsAdd removed to update: ', xtag);
        dataFactoryBericht.sideMenuTags.push(xtag);
        //console.log('BerichtenSideMenuCtrl tagsAdd menu-onbject berichtModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', berichtModel.get('naam'), berichtModel.get('Id'), dataFactoryBericht.sideMenuTags);
        sorteerSideMenuTags();

        q.resolve();
      }

      return q.promise;
    }
    //
    function sorteerSideMenuTags() {

      //console.warn('BerichtenSideMenuCtrl sorteerSideMenuTags');
      loDash.remove(dataFactoryBericht.sideMenuTags, function (xtag) {
        return xtag.length === 0;
      });
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(dataFactoryBericht.sideMenuTags, function (xtag) {
        return xtag.length !== 0 && xtag.tagId.length <= 3 && xtag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter(dataFactoryBericht.sideMenuTags, function (xtag) {
        return xtag.tagId.length <= 3 && xtag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter(dataFactoryBericht.sideMenuTags, function (xtag) {
        return xtag.tagId.length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      dataFactoryBericht.sideMenuTags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function updateLabels(berichtModel) {
      //
      // Idere keer als labels geupdate worden helemaal opnieuw beginnen met een situatie zonder labels
      // Daarna de labels filteren die voor dit BerichtModel bedoeld zijn.
      //

      var q = $q.defer();

      var berichtId = berichtModel.get('Id');

      //if (berichtId === '5e3bfffadc6c26958502a5f5') {
      //console.log('================================================================================================');
      //console.log('dataFactoryBericht updateLabels POI naam: ', berichtModel.get('naam'));
      //console.log('dataFactoryBericht updateLabels POI Id: ', berichtId);
      //console.log('dataFactoryBericht updateLabels POI gebruikerId: ', berichtModel.get('gebruikerId'));
      //console.log('================================================================================================');

      if (berichtModel) {
        //console.log('dataFactory.Bericht updatelabels berichtModel: ', berichtModel);
        //
        //  Eerst de oude labels verwijderen
        //  Deze staan in berichtModel.xData.tags.xData
        //

        loDash.each(berichtModel.xData.tags, function (berichtTagModel) {
          //console.log('dataFactoryBericht updateLabels loop Tags: ', berichtTagModel, berichtTagModel.xData);
          tagsRemove(berichtModel, berichtTagModel.xData);
        });
        //
        //  Verwijder berichtTags die verwijderd zijn of niet public zijn
        //
        loDash.remove(dataFactoryBerichtTag.store, function (berichtTagModel) {
          return berichtTagModel.get('deletedOn') > '1970-01-02 00:00:00' || (berichtTagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('xprive'));
        });
        loDash.remove(dataFactoryBerichtTag.data, function (dataItem) {
          return dataItem.record.get('deletedOn') > '1970-01-02 00:00:00' || (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && dataItem.record.get('xprive'));
        });
        //
        //  Selecteer niet verwijderde berichtTags van deze bericht
        //
        var myBerichtTags = [];
        //if (+ceo.profielId === 4 || +ceo.profielId === 5) {
        //myBerichtTags = loDash.filter(dataFactoryBerichtTag.store, function (berichtTagModel) {
        //return (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('berichtId') === berichtId) || (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('berichtId') === berichtId && berichtTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //return berichtTagModel.get('berichtId') === berichtId && (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) || (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //});
        //} else {
        myBerichtTags = loDash.filter(dataFactoryBerichtTag.store, function (berichtTagModel) {
          //return (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('berichtId') === berichtId) || (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && berichtTagModel.get('berichtId') === berichtId && berichtTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
          return berichtTagModel.get('berichtId') === berichtId;
        });
        //}
        //console.log('dataFactoryBericht updateLabels dataFactoryBerichtTag.store: ', dataFactoryBerichtTag.store);
        //console.log('dataFactoryBericht updateLabels myBerichttags: ', myBerichtTags);
        berichtModel.xData.tags = [];
        //
        //  Toevoegen myBerichtTags
        //
        //console.log('dataFactoryBericht updateLabels myBerichtTags TOEVOEGEN: ', myBerichtTags);
        if (myBerichtTags.length > 0) {
          loDash.each(myBerichtTags, function (myBerichtTagModel) {
            var tagId = myBerichtTagModel.get('tagId');
            //console.log('dataFactoryBericht updateLabels myBerichtTag toevoegen tagId: ', tagId);

            if (tagId) {

              //console.log('dataFactoryBericht updateLabels tagModel toevoegen tagId uit dataFactoryTag.store');

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });

              if (tagModel) {

                myBerichtTagModel.xData = tagModel;

                //console.log('dataFactoryBericht updateLabels myBerichtTag TOEVOEGEN in  SideMenu: ', berichtModel.get('naam'), tagModel.get('tag'));
                //console.log('dataFactoryBericht updateLabels myBerichtTag TOEVOEGEN in  berichtModel.xData.tags: ', berichtModel.get('naam'), myBerichtTagModel);

                berichtModel.xData.tags.push(myBerichtTagModel);
                tagsAdd(berichtModel, tagModel);
                $rootScope.$emit('berichtSideMenuUpdate');

                //console.log('dataFactoryBericht updateLabels myBerichtTag TOEGEVOEGD naam tag, xData.tags: ', berichtModel.get('naam'), tagModel.get('tag'), berichtModel.xData.tags);
              } else {
                //console.error('dataFactoryBericht updateLabels berichttag toevoegen tagModel NOT FOUND: ', dataFactoryTag.store);
              }
            }
          });
          //console.log('dataFactoryBericht reload updateLabels SUCCESS');
          /*
          var oud = '';
          loDash.each(berichtModel.xData.tags, function (tag) {
            if (oud !== berichtModel.get('naam')) {
              //console.log(' ');
            }
            //console.error('dataFcatoryBericht updateLabels xdata.tags: ', berichtModel.get('naam'), tag.xData.get('tag'));
            oud = berichtModel.get('naam');
          });
          */
          q.resolve();

        } else {
          //$rootScope.$emit('labelsBerichtUpdate', { berichtModel: berichtModel });
          //console.log('dataFactoryBericht resultaat xData.tags: ', berichtModel.xData.tags);

          //console.log('dataFactoryBericht reload updateLabels SUCCESS');
          q.resolve();

        }

      } else {
        //console.log('dataFactoryBericht reload updateLabels SUCCESS');
        q.resolve();
      }
      //} else {
      //console.log('dataFactoryBericht updateLabels DEBUGGING');
      //q.resolve();
      //}

      return q.promise;
    }
    //
    //  Na de load van alle Sporen wordt in ieder bericht bepaald of er nieuwe reacties zijn toegveoegd.
    //
    function updateReacties(berichtModel) {

      //console.warn('dataFactoryBericht updateReacties naam: ', berichtModel.get('naam'));

      var q = $q.defer();

      var berichtId = berichtModel.get('Id');

      var berichtReacties = loDash.filter(dataFactoryBerichtReactie.store, function (berichtReactieModel) {
        return berichtReactieModel.get('berichtId') === berichtId;
      });
      //console.log('dataFactoryBericht updateReacties berichtReacties: ', berichtReacties);
      if (berichtReacties.length > 0) {
        //console.log('dataFactoryBericht updateReacties syncDown naam, berichtId, berichtReacties: ', berichtModel.get('naam'), berichtId, berichtReacties);
        loDash.each(berichtReacties, function (berichtReactieModel) {
          //console.log('dataFactoryBericht updateReacties berichtId, naam, reactie: ', berichtId, berichtModel.get('naam'), berichtReactieModel.get('reactie'));
          var berichtReactieId = berichtReactieModel.get('Id');

          var berichtReactieSupModel = loDash.find(dataFactoryBerichtReactieSup.store, function (berichtReactieSupModel) {
            return berichtReactieSupModel.get('reactieId') === berichtReactieId;
          });

          if (berichtReactieSupModel) {

            berichtReactieModel.xData = {};
            berichtReactieModel.xData.tags = [];

            berichtReactieModel.xData.sup = berichtReactieSupModel;

            var xnew = berichtReactieSupModel.get('xnew');

            if (xnew) {
              if (!virgin) {
                notificationsBerichtReactie += 1;
              }
              var berichtNieuwModel = loDash.find(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
                return berichtNieuwModel.get('Id') === berichtId;
              });
              if (!berichtNieuwModel) {
                dataFactoryBericht.nieuw.push(berichtModel);
                //console.log('dataFactoryBericht updateBerichtxnew toegevoegd aan nieuw: ', dataFactoryBericht.nieuw);
              }
            } else {
              loDash.remove(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
                return berichtNieuwModel.get('Id') === berichtId;
              });
              //console.log('dataFactoryBericht updateBericht xnew verwijderd: ', dataFactoryBericht.nieuw);
            }
          } else {
            //console.log('dataFactoryBericht updateBerichtreacties heeft nog geen berichtReactieSupModel. Dus nieuw berichtReactieSupModel aanmaken!!');

            berichtReactieSupModel = new dataFactoryBerichtReactieSup.Model();
            berichtReactieSupModel.set('reactieId', berichtReactieId);
            berichtReactieSupModel.set('berichtId', berichtId);
            berichtReactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            berichtReactieSupModel.set('star', false);
            berichtReactieSupModel.set('xnew', true);
            if (virgin) {
              berichtReactieSupModel.set('xnew', false);
            }
            berichtReactieSupModel.save().then(function () {

              //console.log('dataFactoryBericht updateReacties berichtReactieSupModel CREATED.');

              berichtReactieModel.xData = {};
              berichtReactieModel.xData.tags = [];
              berichtReactieModel.xData.sup = berichtReactieSupModel;

              //console.log('dataFactoryBericht updateReacties berichtReactieSupModel toegevoegd aan Reactie.');

              var berichtSupModel = loDash.find(dataFactoryBerichtSup.store, function (berichtSupModel) {
                return berichtSupModel.get('berichtId') === berichtId && berichtSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });

              if (berichtSupModel) {
                //console.log('dataFactoryBericht updateReacties berichtSupModel gevonden: ', berichtId, berichtModel.get('naam'));
                berichtModel.xData.sup = berichtSupModel;

                var xnew = berichtSupModel.get('xnew');
                var star = berichtSupModel.get('star');
                //console.log('dataFactoryBericht updateBericht berichtModel, berichtModel.xData.sup UPDATE berichtId: ', berichtModel, berichtModel.xData.sup, berichtModel.xData.sup.get('berichtId'));

                if (star) {
                  var berichtStarModel = loDash.find(dataFactoryBericht.star, function (berichtStarModel) {
                    return berichtStarModel.get('Id') === berichtId;
                  });
                  if (!berichtStarModel) {
                    dataFactoryBericht.star.push(berichtModel);
                    //console.log('dataFactoryBericht updateBericht star toegevoegd: ', dataFactoryBericht.star);
                  }
                } else {
                  loDash.remove(dataFactoryBericht.star, function (berichtStarModel) {
                    return berichtStarModel.get('Id') === berichtId;
                  });
                  //console.log('dataFactoryBericht updateBericht star verwijderd: ', dataFactoryBericht.star);
                }

                //console.log('dataFactoryBericht updateBericht xnew: ', xnew);


                if (xnew) {
                  if (!virgin) {
                    notificationsBericht += 1;
                  }
                  var berichtNieuwModel = loDash.find(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
                    return berichtNieuwModel.get('Id') === berichtId;
                  });
                  if (!berichtNieuwModel) {
                    dataFactoryBericht.nieuw.push(berichtModel);
                    //console.log('dataFactoryBericht updateBerichtxnew toegevoegd aan nieuw: ', dataFactoryBericht.nieuw);
                  }
                } else {
                  loDash.remove(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
                    return berichtNieuwModel.get('Id') === berichtId;
                  });
                  //console.log('dataFactoryBericht updateBericht xnew verwijderd: ', dataFactoryBericht.nieuw);
                }


                //console.log('dataFactoryBericht reload updateSupModel SUCCESS');
                q.resolve();

                //console.log('dataFactoryBericht updateBerichtList heeft nog geen supModel. Dus nieuw!! Id, naam: ', berichtModel.get('Id'), berichtModel.get('naam'));

                berichtSupModel = new dataFactoryBerichtSup.Model();
                berichtSupModel.set('berichtId', berichtId);
                berichtSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                berichtSupModel.set('star', false);
                berichtSupModel.set('xnew', true);
                if (virgin) {
                  berichtSupModel.set('xnew', false);
                  //console.log('dataFactoryBericht updateBericht nieuwe berichtenup niet als nieuw beschouwen. Gebruiker is maagd');
                }
                //console.log('dataFactoryBericht updateBericht nieuw berichtSupModel: ', berichtSupModel.get('berichtId'));

                berichtSupModel.save().then(function () {

                  //console.log('dataFactoryBericht updateBericht nieuw berichtSupModel: ', berichtSupModel);

                  berichtModel.xData.sup = berichtSupModel;

                  if (!virgin) {
                    notificationsBericht += 1;
                    var nieuwModel = loDash.find(dataFactoryBericht.nieuw, function (nieuwModel) {
                      return nieuwModel.get('Id') === berichtId;
                    });
                    if (!nieuwModel) {
                      dataFactoryBericht.nieuw.push(berichtModel);
                    }
                  } else {
                    //console.error('dataFactoryBericht updateBericht nieuwe berichtenup notifications skipped. Gebruiker is maagd');
                  }
                  //console.log('dataFactoryBericht updateBericht nieuwe berichtenup voor berichtId NOT FOUND in BerichtStore.nieuw: ', berichtId, dataFactoryBericht.nieuw);

                  //console.log('dataFactoryBericht reload updateSupModel nieuwe bericht SUCCESS');
                  q.resolve();

                });
              }
            });
          }
        });
        //console.log('dataFactoryBericht reload updateReacties SUCCESS');
        q.resolve();
      } else {
        //console.log('dataFactoryBericht reload updateReacties SUCCESS');
        q.resolve();
      }

      return q.promise;
    }

    function initxData(berichtModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      //console.log('initxData START: ', berichtModel);

      if (!berichtModel.xData) {
        berichtModel.xData = {};
        //console.log('dataFactoryBericht updateBericht xData: ', berichtModel.xData);
      }
      if (!berichtModel.xData.pois) {
        berichtModel.xData.pois = [];
        //console.log('dataFactoryBericht updateBericht xData.pois: ', berichtModel.xData.pois);
      }
      if (!berichtModel.xData.fotos) {
        berichtModel.xData.fotos = [];
        //console.log('dataFactoryBericht updateBericht xData.fotos: ', berichtModel.xData.fotos);
      }
      if (!berichtModel.xData.tags) {
        berichtModel.xData.tags = [];
        //console.log('dataFactoryBericht updateBericht xData.tags: ', berichtModel.xData.tags);
      }
      if (!berichtModel.xData.groep) {
        berichtModel.xData.groep = '';
        //console.log('dataFactoryBericht updateBericht xData.groep: ', berichtModel.xData.groep);
      }
      //console.log('initxData READY: ', berichtModel.xData);
    }
    //
    
    
    function updateSupModel(berichtModel) {

      //console.log('dataFactoryBericht UpdateBericht: ', berichtModel.get('naam'));

      var q = $q.defer();

      var berichtId = berichtModel.get('Id');
      var gebruikerId = dataFactoryCeo.currentModel.get('Id');

      var berichtSupModel = loDash.find(dataFactoryBerichtSup.store, function (berichtSupModel) {
        return berichtSupModel.get('berichtId') === berichtId && berichtSupModel.get('gebruikerId') === gebruikerId;
      });

      //console.log('dataFactoryBericht UpdateSupModel berichtSupModel: ', berichtSupModel);
      if (berichtSupModel) {

        berichtModel.xData.sup = berichtSupModel;

        var xnew = berichtSupModel.get('xnew');
        var star = berichtSupModel.get('star');
        //console.log('dataFactoryBericht updateBericht berichtModel, berichtModel.xData.sup UPDATE berichtId: ', berichtModel, berichtModel.xData.sup, berichtModel.xData.sup.get('berichtId'));

        if (star) {
          var berichtStarModel = loDash.find(dataFactoryBericht.star, function (berichtStarModel) {
            return berichtStarModel.get('Id') === berichtId;
          });
          if (!berichtStarModel) {
            dataFactoryBericht.star.push(berichtModel);
            //console.log('dataFactoryBericht updateBericht star toegevoegd: ', dataFactoryBericht.star);
          }
        } else {
          loDash.remove(dataFactoryBericht.star, function (berichtStarModel) {
            return berichtStarModel.get('Id') === berichtId;
          });
          //console.log('dataFactoryBericht updateBericht star verwijderd: ', dataFactoryBericht.star);
        }

        //console.log('dataFactoryBericht updateBericht xnew: ', xnew);


        if (xnew) {
          if (!virgin) {
            notificationsBericht += 1;
          }
          var berichtNieuwModel = loDash.find(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
            return berichtNieuwModel.get('Id') === berichtId;
          });
          if (!berichtNieuwModel) {
            dataFactoryBericht.nieuw.push(berichtModel);
            //console.log('dataFactoryBericht updateBerichtxnew toegevoegd aan nieuw: ', dataFactoryBericht.nieuw);
          }
        } else {
          loDash.remove(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
            return berichtNieuwModel.get('Id') === berichtId;
          });
          //console.log('dataFactoryBericht updateBericht xnew verwijderd: ', dataFactoryBericht.nieuw);
        }
        
        
        //console.log('dataFactoryBericht reload updateSupModel SUCCESS');
        q.resolve();
      } else {

        //console.log('dataFactoryBericht updateBerichtList heeft nog geen supModel. Dus nieuw!! Id, naam: ', berichtModel.get('Id'), berichtModel.get('naam'));

        berichtSupModel = new dataFactoryBerichtSup.Model();
        berichtSupModel.set('berichtId', berichtId);
        berichtSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        berichtSupModel.set('star', false);
        berichtSupModel.set('xnew', true);
        if (virgin) {
          berichtSupModel.set('xnew', false);
          //console.log('dataFactoryBericht updateBericht nieuwe berichtenup niet als nieuw beschouwen. Gebruiker is maagd');
        }
        //console.log('dataFactoryBericht updateBericht nieuw berichtSupModel: ', berichtSupModel.get('berichtId'));

        berichtSupModel.save().then(function () {

          //console.log('dataFactoryBericht updateBericht nieuw berichtSupModel: ', berichtSupModel);

          berichtModel.xData.sup = berichtSupModel;

          if (!virgin) {
            notificationsBericht += 1;
            var nieuwModel = loDash.find(dataFactoryBericht.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === berichtId;
            });
            if (!nieuwModel) {
              dataFactoryBericht.nieuw.push(berichtModel);
            }
          } else {
            //console.error('dataFactoryBericht updateBericht nieuwe berichtenup notifications skipped. Gebruiker is maagd');
          }
          //console.log('dataFactoryBericht updateBericht nieuwe berichtenup voor berichtId NOT FOUND in BerichtStore.nieuw: ', berichtId, dataFactoryBericht.nieuw);

          //console.log('dataFactoryBericht reload updateSupModel nieuwe bericht SUCCESS');
          q.resolve();

        });

      }

      return q.promise;
    }

    //
    function updateBericht(berichtModel, mode) {

      var q = $q.defer();

      //console.warn('dataFactoryBericht updateBericht bericht deletedOn, xprive, gebruikerId, naam : ', berichtModel.get('deletedOn'), berichtModel.get('xprive'), berichtModel.get('gebruikerId'), berichtModel.get('naam'));

      initxData(berichtModel);

      var groepenId = berichtModel.get('groepenId');
      //console.log('dataFactoryBericht updateBericht groepenId: ', groepenId);
      berichtModel.xData.groep = '';
      if (groepenId !== '') {
        berichtModel.xData.groep = 'Iedereen';

        var found = loDash.find(dataFactoryGroepen.store, function (groep) {
          return groep.get('Id') === groepenId;
        });
        if (found) {
          berichtModel.xData.groep = found.get('groep');
          //console.log('dataFactoryBericht updateBericht xData.groep: ', berichtModel.xData.groep);
        }
      }

      $q.all([
        updateLabels(berichtModel),
        updateSupModel(berichtModel),
        updateReacties(berichtModel)
      ]).then(function () {
        //console.log('dataFactoryBericht reload updates SUCCESS');
        //return updateReacties(berichtModel)
        watchUpdate(mode, berichtModel);
        q.resolve();
      });


      berichtModel.xData.pois = [];
      berichtModel.xData.fotos = [];

      return q.promise;
    }
    //
    function watchUpdate(store) {

      //console.warn('dataFactoryBericht watchUpdate store: ', store);
      var reacties, nieuweReacties;

      var watch = loDash.find(watchSyncs, function (watch) {
        return watch.store === store;
      });
      if (watch) {
        watch.done = watch.done + 1;
      }
      if (store === 'berichtReload') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryBericht watchUpdateBerichtenList RELOAD updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryBericht watchUpdate done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryBericht watchUpdateBerichtenList RELOAD READY store, done, todo, notificationsBericht, notificationsBerichtReactie: ', store, watch.done, watch.todo, notificationsBericht, notificationsBerichtReactie);
          //console.log('===============================================================================================================');
          //console.warn('dataFactoryBericht watchUpdate SUCCESS');

          if (notificationsBericht > 0 || notificationsBerichtReactie > 0) {

            var berichtenNieuw = [];
            var berichtReactiesNieuw = [];

            berichtenNieuw = loDash.filter(dataFactoryBerichtSup.store, function (berichtSup) {
              return berichtSup.get('xnew');
            });

            berichtReactiesNieuw = loDash.filter(dataFactoryBerichtReactieSup.store, function (berichtReactieSup) {
              return berichtReactieSup.get('xnew');
            });

            //console.error('dataFactoryBericht watchUpdateBerichtenList naar composeNotification notificationsBericht, dataFactoryBericht.nieuw.length, notificationsBerichtReactie, reacties.length: ', store, notificationsBericht, dataFactoryBericht.nieuw.length, notificationsBerichtReactie, berichtReactiesNieuw.length);

            if (berichtenNieuw.length > 0 || berichtReactiesNieuw.length > 0) {
              dataFactoryNotification.composeTitleBodyNotification(berichtenNieuw.length, berichtReactiesNieuw.length, 'bericht');
            }

            $timeout(function () {
              $rootScope.$emit('berichtenFilter');
              $rootScope.$emit('berichtenNieuweAantallen');
            }, 500);
          }
        }
      }
      if (store === 'berichtRefresh') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryBericht watchUpdateBerichtenList REFRESH updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryBericht watchUpdateRefresh done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryBericht watchUpdateBerichtenList REFRESH READY store, done, todo: ', store, watch.done, watch.todo);
          //console.log('dataFactoryBericht watchUpdateBerichtenList REFRESH READY store, notificationsBericht, notificationsBerichtReactie: ', store, notificationsBericht, notificationsBerichtReactie);
          //console.log('===============================================================================================================');

          if (notificationsBericht > 0 || notificationsBerichtReactie > 0) {

            var berichtenNieuw = [];
            var berichtReactiesNieuw = [];

            berichtenNieuw = loDash.filter(dataFactoryBerichtSup.store, function (berichtSup) {
              return berichtSup.get('xnew');
            });

            berichtReactiesNieuw = loDash.filter(dataFactoryBerichtReactieSup.store, function (berichtReactieSup) {
              return berichtReactieSup.get('xnew');
            });

            //console.error('dataFactoryBericht watchUpdateBerichtenList naar composeNotification notificationsBericht, dataFactoryBericht.nieuw.length, notificationsBerichtReactie, reacties.length: ', store, notificationsBericht, dataFactoryBericht.nieuw.length, notificationsBerichtReactie, nieuweReacties.length);
            dataFactoryNotification.composeTitleBodyNotification(berichtenNieuw.length, berichtReactiesNieuw.length, 'bericht');
          }

          $rootScope.$emit('berichtenFilter');
          $rootScope.$emit('berichtenNieuweAantallen');
        }
      }
    }
    //
    function updateBerichtenList() {

      //console.warn('dataFactoryBericht updateBerichtenList');

      dataFactoryBerichtSup.store = loDash.sortBy(dataFactoryBerichtSup.store, 'changedOn');
      dataFactoryBerichtSup.store = loDash.uniqBy(dataFactoryBerichtSup.store, 'berichtId');

      notificationsBericht = 0;
      notificationsBerichtReactie = 0;

      todoTotal = 0;
      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'berichtReload';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'berichtReload';
        });
      }
      var watchSync = {
        store: 'berichtReload',
        todo: dataFactoryBericht.store.length,
        done: 0
      };
      todoTotal = todoTotal + dataFactoryBericht.store.length;
      watchSyncs.push(watchSync);

      dataFactoryBerichtSup.store = loDash.uniqBy(dataFactoryBerichtSup.store, function (berichtSup) {
        return berichtSup.get('berichtId');
      });
      //console.log('dataFactoryBericht TagStore: ', dataFactoryTag.store);
      //console.log('dataFactoryBericht berichtStore: ', dataFactoryBericht.store);
      //console.log('dataFactoryBericht berichtSupStore: ', dataFactoryBerichtSup.store);
      //console.log('dataFactoryBericht BerichtTagStore: ', dataFactoryBerichtTag.store);
      if (dataFactoryBericht.store.length > 0) {

        var promises = [];

        loDash.each(dataFactoryBericht.store, function (berichtModel) {
          //console.log('dataFactoryBericht updateBerichtList berichtModel loop');
          //console.log('dataFactoryBericht updateBerichtList berichtModel naam INITIAL UPDATE START: ', berichtModel.get('naam'));
          promises.push(updateBericht(berichtModel, 'berichtReload'));
          //updateBericht(trackModel, 'berichtReload').then(function () {
          //console.log('dataFactoryBericht updateBerichtenList naam INITIAL UPDATE SUCCES: ', berichtModel.get('naam'));
          //});
        });
        promises.push(berichtenCheckNieuwTooOld());
        $q.all(promises);
      }
    }
    //
    function updateBerichtenTodos(todos) {

      //console.clear();
      //console.warn('dataFactoryBericht updateBerichtTodos: ', todos);

      var q = $q.defer();

      notificationsBericht = 0;
      notificationsBerichtReactie = 0;

      todoTotal = 0;

      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'berichtRefresh';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'berichtRefresh';
        });
      }
      var watchSync = {
        store: 'berichtRefresh',
        todo: todos.length,
        done: 0
      };
      todoTotal = todoTotal + todos.length;
      watchSyncs.push(watchSync);

      if (todos.length > 0) {

        var promises = [];
        //
        loDash.each(todos, function (berichtId) {
          //loDash.each(dataFactoryBericht.store, function (berichtModel) {
          //console.log(berichtModel.get('Id'), berichtModel.get('naam'), berichtModel.get('xprive'), berichtModel.get('gebruikerId'));
          //});
          var berichtModel = loDash.find(dataFactoryBericht.store, function (berichtModel) {
            return berichtModel.get('Id') === berichtId;
          });
          if (berichtModel) {
            if (berichtModel.get('deletedOn') > '1970-01-02 00:00:00' || (berichtModel.get('xprive') === true && berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
              //console.log('dataFactoryBericht updateBerichtenTodos bericht naam REMOVE START: ', berichtModel.get('naam'));
              promises.push(verwijderBericht(berichtModel, 'berichtRefresh', true));
            } else {
              //console.log('dataFactoryBericht updateBerichtenTodos bericht naam UPDATE START: ', berichtModel.get('naam'));
              promises.push(updateBericht(berichtModel, 'berichtRefresh'));
            }
          } else {
            //console.error('dataFactoryBericht updateBerichtTodos IS NOT berichtModel: ', berichtId);
            watchUpdate('berichtRefresh', berichtModel);
          }
        });
        $q.all(promises).then(function () {
          //console.error('updateBerichtenTodos all promises resolved');
          $rootScope.$emit('filter');
          $rootScope.$emit('berichtenNieuweAantallen');

          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function berichtenCheckNieuwTooOld() {

      //console.warn('dataFactoryBericht berichtenCheckNieuwTooOld START');

      var q = $q.defer();
      var tooOld = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
      //var tooOld = moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      //console.log('dataFactoryBericht fotosCheckNieuwTooOld: ', tooOld);
      loDash.each(dataFactoryBerichtSup.store, function (berichtSupModel) {
        var publishDatum = berichtSupModel.get('createdOn');
        var xnew = berichtSupModel.get('xnew');
        var berichtId = berichtSupModel.get('berichtId');
        if (xnew) {
          //console.log('dataFactoryBericht berichtenCheckNieuwTooOld publishDatum if tooOld: ', publishDatum, tooOld, xnew, berichtId);
          if (publishDatum < tooOld) {
            //console.error('dataFactoryBericht berichtenCheckNieuwTooOld reset xnew');
            berichtSupModel.set('xnew', false);
            berichtSupModel.save();
            loDash.remove(dataFactoryBericht.nieuw, function (berichtModel) {
              return berichtModel.get('Id') === berichtId;
            });
            $rootScope.$emit('filter');
            $rootScope.$emit('berichtenNieuweAantallen');

            //console.error('dataFactoryBericht berichtenCheckNieuwTooOld updated SUCCESS');
          }
        }
      });
      q.resolve();
      return q.promise;
    }
    //
    function refresh() {

      //console.warn('dataFactoryBericht refresh start');
      //
      //  Tags opnieuw ophalen omdat de store leeg is na reload?!?!?!?
      //
      if (dataFactoryTag.store.length === 0) {
        dataFactoryTag.store = dataFactoryBericht.tags;
        //console.log('dataFactoryBericht Tag refresh restored: ', dataFactoryBericht.tags, dataFactoryTag.store);
      }
      if (virgin) {
        dataFactoryConfig.currentModel.set('virginBerichten', false);
        dataFactoryConfigX.update(dataFactoryConfig.currentModel);
        //console.warn('dataFactoryBericht config reset virgin');
      }

      $q.all([
        dataFactoryTag.syncUp(),
        dataFactoryBerichtReactieSup.syncUp(),
        dataFactoryBerichtReactie.syncUp(),
        dataFactoryBerichtTag.syncUp(),
        dataFactoryBerichtSup.syncUp(),
        dataFactoryBericht.syncUp()
      ]).then(function () {
        dataFactoryBericht.syncDownAll().then(function (newSyncDate) {

          //console.log('refresh dataFactoryBericht newSyncDate: ', newSyncDate);

          if (newSyncDate !== null && newSyncDate !== undefined) {

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryBericht, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtSup, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtReactie, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtReactieSup, newSyncDate);
            }
            dataFactoryTag.lastSyncDate = newSyncDate;
            dataFactoryBericht.lastSyncDate = newSyncDate;
            dataFactoryBerichtSup.lastSyncDate = newSyncDate;
            dataFactoryBerichtTag.lastSyncDate = newSyncDate;
            dataFactoryBerichtReactie.lastSyncDate = newSyncDate;
            dataFactoryBerichtReactieSup.lastSyncDate = newSyncDate;

            //
            //console.log('dataFactoryTag refresh Tag todo: ', dataFactoryTag.todo);
            //console.log('dataFactoryBericht refresh Bericht todo: ', dataFactoryBericht.todo);
            //console.log('dataFactoryBericht refresh BerichtSup todo: ', dataFactoryBerichtSup.todo);
            //console.log('dataFactoryBericht refresh BerichtTag todo: ', dataFactoryBerichtTag.todo);
            //console.log('dataFactoryBericht refresh berichtreactie todo: ', dataFactoryBerichtReactie.todo);
            //
            todostmp = [...dataFactoryBericht.todo, ...dataFactoryBerichtSup.todo, ...dataFactoryBerichtTag.todo, ...dataFactoryBerichtReactie.todo, ...dataFactoryBerichtReactieSup.todo];
            uniqueSet = new Set(todostmp);
            todos = [...uniqueSet];

            if (todos.length > 0) {

              updateBerichtenTodos(todos).then(function () {

                //console.error('dataFactoryBericht refresh updateBerichtenTodos SUCCES');

                dataFactoryTag.todo = [];
                dataFactoryBericht.todo = [];
                dataFactoryBerichtSup.todo = [];
                dataFactoryBerichtTag.todo = [];
                dataFactoryBerichtReactie.todo = [];
                //console.log('dataFactoryBericht refresh berichtreactie Store: ', dataFactoryBerichtReactie.store);
                //console.log('dataFactoryBericht refresh Bericht Store: ', dataFactoryBericht.store);
                //console.log('dataFactoryBericht refresh BerichtSup Store: ', dataFactoryBerichtSup.store);
                //console.log('dataFactoryBericht refresh BerichtTag Store: ', dataFactoryBerichtTag.store);
                //console.log('dataFactoryBericht refresh Tag.store: ', dataFactoryTag.store);
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

      //console.warn('dataFactoryBericht reload start');

      virgin = true;
      dataFactoryConfigX.loadMe().then(function () {
        virgin = dataFactoryConfig.currentModel.get('dataFactoryBericht virginBerichten');
        //console.error('dataFactoryBericht VirginBerichten FROM config DB: ', dataFactoryConfig.currentModel.get('virginBerichten'));
        //console.error('dataFactoryBericht VirginBerichten: ', virgin);
      });
      //console.log('dataFactoryBericht Wachten op dataFactoryConfig.currentModel');
      dataFactoryStore.storeInitAll(dataFactoryBericht, dataFactoryBerichtSup, dataFactoryBerichtTag, dataFactoryTag, dataFactoryBerichtReactie, dataFactoryBerichtReactieSup).then(function (newSyncDate) {

        //console.error('dataFactoryBericht reload dataFactoryBericht newSyncDate: ', newSyncDate);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryBericht, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtSup, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtReactie, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryBerichtReactieSup, newSyncDate);
        }
        dataFactoryTag.lastSyncDate = newSyncDate;
        dataFactoryBericht.lastSyncDate = newSyncDate;
        dataFactoryBerichtSup.lastSyncDate = newSyncDate;
        dataFactoryBerichtTag.lastSyncDate = newSyncDate;
        dataFactoryBerichtReactie.lastSyncDate = newSyncDate;
        dataFactoryBerichtReactieSup.lastSyncDate = newSyncDate;

        dataFactoryTag.loaded = true;
        dataFactoryBericht.loaded = true;
        dataFactoryBerichtSup.loaded = true;
        dataFactoryBerichtTag.loaded = true;
        dataFactoryBerichtReactie.loaded = true;
        dataFactoryBerichtReactieSup.loaded = true;

        //console.log('dataFactoryBericht reload wachten op Tag, Blacklist, Groepen en Groepdeelnemers');
        var interval = $interval(function () {

          //console.log('dataFactoryBericht reload wachten op globalStores loaded: ', dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded);
          //if (dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
          if (dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
            $interval.cancel(interval);
            //console.error('dataFactoryBericht reload SUCCESS');
            dataFactoryTag.todo = [];
            dataFactoryBericht.todo = [];
            dataFactoryBerichtSup.todo = [];
            dataFactoryBerichtTag.todo = [];
            dataFactoryBerichtReactie.todo = [];
            dataFactoryBerichtReactieSup.todo = [];

            //console.time('dataFactoryBericht-reloadUpdateBerichtenList');
            $rootScope.$emit('dataFactoryBericht berichtenFilter');
            dataFactoryTag.reStore().then(function () {
              dataFactoryBericht.tags = dataFactoryTag.store;
              //console.log('dataFactoryBericht Tag reload restored: ', dataFactoryTag.store);
              updateBerichtenList();
              dataFactoryBericht.tags = dataFactoryTag.store;
              dataFactoryBericht.verrijkt = true;
            });
            //console.warn('dataFactoryBericht reload updateStores SUCCES');
            if (+ceo.profielId === 4 || +ceo.profielId === 5) {
              //console.error('dataFactoryBericht reload started => refresh');
              $rootScope.$emit('berichtenFilter');
              $rootScope.$emit('berichtenNieuweAantallen');

              dataFactoryClock.startClockBerichtSlow(function () {
                refresh();
              });
            }
          }
        }, 50, 50);
      });
    }
    //
    $rootScope.$on('reloadBericht', function () {
      //console.log('dataFactoryBericht reloadBericht event');
      reload();
    });
    //
    $rootScope.$on('refreshBericht', function () {
      //console.log('dataFactoryBericht refreshBericht event');
      refresh();
    });
    //
    $rootScope.$on('sleepClockBericht', function () {
      //console.debug('dataFactoryPoi sleepClockBericht event');
      dataFactoryClock.startClockBerichtSlow(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('startClockBericht', function () {
      //console.debug('dataFactoryPoi startClockBericht event');
      dataFactoryClock.startClockBerichtFast(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('stopClockBericht', function () {
      //console.debug('dataFactoryPoi stopClockBericht event');
      dataFactoryClock.stopClockBericht();
    });
    //
    //removeIf(!berichten)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryBericht waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 500);
    //endRemoveIf(!berichten)
    return dataFactoryBericht;
  }]);
