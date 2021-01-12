/* eslint-disable no-undef */
// eslint-disable-next-line no-undef



    
//removeIf(!fotos)
trinl.factory('dataFactoryFoto', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryFotoSup', 'dataFactoryFotoTag', 'dataFactoryFotoReactie', 'dataFactoryFotoReactieSup', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryHelp, dataFactoryTag, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryFotoReactie, dataFactoryFotoReactieSup, dataFactorySyncFS) {
    //endRemoveIf(!fotos)
    
    


    //console.warn('dataFactoryFoto');

    var dataFactoryFoto = {};
    var me = dataFactoryFoto;

    dataFactoryFoto.storeId = 'foto';

    dataFactoryFoto.virgin = true;

    dataFactoryFoto.fsEnable = true;
    dataFactoryFoto.fsReady = false;

    dataFactoryFoto.idProperty = '';

    dataFactoryFoto.data = {};
    dataFactoryFoto.store = [];
    dataFactoryFoto.removedRecords = [];

    dataFactoryFoto.nieuw = [];
    dataFactoryFoto.star = [];

    dataFactoryFoto.current = '';
    dataFactoryFoto.selected = [];
    dataFactoryFoto.filters = [];
    dataFactoryFoto.sorters = [];
    dataFactoryFoto.actualTime = '1970-01-02 00:00:00';

    dataFactoryFoto.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryFoto.tmpArray = [];
    dataFactoryFoto.tmpArray2 = [];
    dataFactoryFoto.currentFotoId = '';

    dataFactoryFoto.globalsLoadReady = false;
    dataFactoryFoto.card = false;
    dataFactoryFoto.verrijkt = false;
    dataFactoryFoto.loaded = false;
    dataFactoryFoto.autoSync = true;
    dataFactoryFoto.enableSyncUp = true;
    dataFactoryFoto.enableSyncDown = true;
    dataFactoryFoto.delaySyncUpTime = 0;
    dataFactoryFoto.todo = [];
    dataFactoryFotoSup.todo = [];
    dataFactoryFotoTag.todo = [];
    dataFactoryFotoReactie.todo = [];
    dataFactoryFotoReactieSup.todo = [];
    dataFactoryFoto.sideMenuTags = [];

    dataFactoryFoto.remoteSync = true;

    dataFactoryFoto.currentPage = 1;
    dataFactoryFoto.pageSize = 2500;

    dataFactoryFoto.xprive = '0';

    dataFactoryFoto.refreshDone = false;

    dataFactoryFoto.Model = function (config) {

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
      
      //removeIf(!fotoen)
      this.fotoId = {
        value: config.fotoId || '',
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
      //endRemoveIf(!fotoen)
      
      
      //removeIf(fotoen)
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
      //endRemoveIf(!fotoen)
      
      
      //removeIf(!fotos)
      this.orientation = {
        value: config.orientation || 0,
        dirty: false,
        type: 'int'
      };
      //endRemoveIf(!fotos)
      
      
      
      
      

      dataFactoryObjectId.create();

      return this;
    };

    dataFactoryFoto.Model.prototype = {
      get: function (prop) {
        ////console.log(dataFactoryFoto.storeId + ' get: ' + prop);
        var m = this;
        if (m[prop] !== undefined) {
          ////console.log('get: ' + m[prop].value);
          return m[prop].value;
        } else {
          return null;
        }
      },
      getId: function () {
        var m = this;
        ////console.log('getId: ' + m.get['Id']);
        return m.get('Id');
      },
      remove: function () {
        var m = this;
        ////console.log('remove : ' + JSON.stringify(m));
        m.unsetAll();
        m.set('deletedOn', dataFactoryAlive.getTimestamp());
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        return dataFactoryFoto.remove(m);
      },
      save: function () {
        ////console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        ////console.error('save: ', m);
        return dataFactoryFoto.save(m);
      },
      setAll: function () {
        ////console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryFoto.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        ////console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        ////console.log('foto unsetAll');

        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          if (field !== true && field !== false) {
            ////console.log('foto unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        loDash.each(dataFactoryFoto.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        ////console.log('foto unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        ////console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactoryFoto.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        ////console.log('set: ', m);
        return m;
      },
      unset: function (prop) {
        ////console.log('setAll');
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
          loDash.each(dataFactoryFoto.data, function (item) {
            if (item.record.get('Id') === Id) {
              item.dirty = false;
              return false;
            }
          });
        }
        ////console.log('unset: ' + JSON.stringify(m));

        return m;
      },
      setId: function (Id) {
        var m = this;
        ////console.log('setId record: ' + Id);
        m.set('Id', Id);
        loDash.each(dataFactoryFoto.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        ////console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactoryFoto.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactoryFoto.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactoryFoto.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactoryFoto.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryFoto.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactoryFoto.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactoryFoto.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactoryFoto.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactoryFoto.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactoryFoto.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactoryFoto.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactoryFoto.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactoryFoto.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactoryFoto.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactoryFoto.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactoryFoto.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactoryFoto.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactoryFoto.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactoryFoto.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactoryFoto.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactoryFoto.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactoryFoto.loadAll = function () {
      return dataFactoryStore.loadAll(me);
    };

    dataFactoryFoto.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactoryFoto.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactoryFoto.syncUpAll = function () {
      return dataFactoryStore.syncUpAll(me);
    };

    dataFactoryFoto.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactoryFoto.syncDownAll = function (update) {
      return dataFactoryStore.syncDownAll(dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryTag, dataFactoryFotoReactie, dataFactoryFotoReactieSup, update);
    };

    dataFactoryFoto.init = function () {
      //console.warn('dataFactoryFoto init');

      dataFactoryFoto.fsReady = false;
      dataFactoryFoto.loaded = false;
      dataFactoryFoto.star = [];
      dataFactoryFoto.nieuw = [];
      dataFactoryFoto.selected = [];
      dataFactoryFoto.data = [];
      dataFactoryFoto.store = [];
      dataFactoryFoto.removedRecords = [];
      dataFactoryFoto.current = '';
      dataFactoryFoto.filters = [];
      dataFactoryFoto.sorters = [];
      dataFactoryFoto.actualTime = '1970-01-02 00:00:00';
      dataFactoryFoto.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryFoto.tmpArray = [];
      dataFactoryFotoSup.todo = [];
      dataFactoryFotoTag.todo = [];
      dataFactoryFotoReactie.todo = [];
      dataFactoryFotoReactieSup.todo = [];
    };
    //
    dataFactoryFoto.init();
    //
    var watchSyncs = [];
    var todoTotal = 0;
    var notificationsFoto = 0;
    var notificationsFotoReactie = 0;
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
    // Het gaat hier om een gepubliceerd fotoModel die door de eigenaar is geprivatiseerd of defintief verwijderd heeft.
    // De volger hoeft alleen maar de dit fotoModel/fotoSupModel en fotoTagModellen (incl updaten van de lables in SideMenu) 
    // uit zijn stores te verwijderen.
    // Dit fotoModel is dan niet meer zichtbaar in zijn TRINL.
    // Hij laat zijn FotoSup FotoReactieModel FotoReactieSupModel en FotoTagModellen in de database.
    // Als de eigenaar deze Foto opnieuw publiceerd worden de Sup en Reactie bestanden weer toegevoegd.
    // Deze POI blijft bij de volger weg als deze Foto geprivatiseerd blijft. De Als de Foto niet gesyncd wordt dan worden ook de andere Modellen niet gesynced.
    // !!!Attentie. De updates van dit fotoModel, fotoSupModel, Reacties en fotoTags gaan gewoon door. Nagaan of de volger hierdoor niet lastig gevallen wordt!!!
    // LoadAll gaat goed. Dit fotoModel wordt niet meer geload.
    // SyncDownAll !!!!!!!!!!!!!! SyncDown haalt ook nieuwe modellen op. Alles moet gewoon door de FrontEndAPI in
    // stores worden bijgewerkt. De gelinkte bestanden zijn
    // jammer genoeg overbodig als er geen itemModel is. De volgende loadAll laadt deze overbodige modellen toch niet meer.
    // 
    function verwijderFoto(fotoModel, mode, watch) {

      var q = $q.defer();
      //console.warn('dataFactoryFoto verwijderFoto: ', fotoModel.get('naam'));

      var fotoId = fotoModel.get('Id');

      initxData(fotoModel);
      //
      //  Clean up stores
      //
      loDash.remove(dataFactoryFoto.star, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      loDash.remove(dataFactoryFoto.nieuw, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      loDash.remove(dataFactoryFoto.selected, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });
      //
      //  Verwijderen labels in sidemenu
      //
      loDash.each(fotoModel.xData.tags, function (fotoTagModel) {
        //console.log('dataFactoryFoto updateLabels loop Tags: ', fotoTagModel, fotoTagModel.xData);
        tagsRemove(fotoModel, fotoTagModel.xData);
      });
      fotoModel.xData.tags = [];
      //

      $rootScope.$emit('fotoSideMenuUpdate');
      //
      loDash.remove(dataFactoryFotoTag.store, function (fotoTagModel) {
        return fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryFotoTag.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryFoto verwijderFoto fotoTags VERWIJDERD form fotoTagStore/data');

      loDash.remove(dataFactoryFotoReactie.store, function (fotoReactieModel) {
        return fotoReactieModel.get('fotoId') === fotoId;
      });
      loDash.remove(dataFactoryFotoReactie.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId;
      });
      //console.warn('dataFactoryFoto verwijderFoto fotoReactie VERWIJDERD form fotoReactieStore/data');

      loDash.remove(dataFactoryFotoReactieSup.store, function (fotoReactieSupModel) {
        return fotoReactieSupModel.get('fotoId') === fotoId && fotoReactieSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryFotoReactieSup.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('dataFactoryFoto verwijderFoto fotoReactieSups VERWIJDERD from store');

      loDash.remove(dataFactoryFotoSup.store, function (fotoSupModel) {
        return fotoSupModel.get('fotoId') === fotoId && fotoSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryFotoSup.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryFoto verwijderFoto fotoSup VERWIJDERD from fotoSupStore/data');

      //updateLabels(fotoModel).then(function () {
      loDash.remove(dataFactoryFoto.store, function (fotoModel) {
        //console.log('dataFactoryFoto verwijderFoto fotoverijderen loDash remove: ', fotoModel, fotoId, fotoModel.get('Id'), fotoModel.get('xprive'), fotoModel.get('gebruikerId'), fotoModel.get('naam'));
        return fotoModel.get('Id') === fotoId;
      });
      loDash.remove(dataFactoryFoto.data, function (dataItem) {
        return dataItem.record.get('Id') === fotoId;
      });
      //console.warn('dataFactoryFoto verwijderFoto foto VERWIJDERD from fotoStore/data');
      //console.log('dataFactoryFoto verwijderFoto aantal dataFactoryFoto.store STORE: ', dataFactoryFoto.store, dataFactoryFoto.store.length);
      //
      //  Waarschuwing als de gebruiker in deze Card zit
      //
      $rootScope.$emit('fotoVerwijderd', {
        fotoModel: fotoModel
      });

      if (watch) {
        watchUpdate(mode, fotoModel);
      }
      $timeout(function () {
        $rootScope.$emit('fotosFilter');
        $rootScope.$emit('fotosNieuweAantallen');
      }, 500);

      q.resolve();
      //});

      return q.promise;
    }
    //
    function tagsRemove(fotoModel, tagModel) {

      var q = $q.defer();

      //console.warn('FotosSideMenuCtrl tagsRemove fotoModel, tagModel: ', fotoModel, tagModel);
      //console.log('FotosSideMenuCtrl tagsRemove naam tag', fotoModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find(dataFactoryFoto.sideMenuTags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('FotosSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = fotoModel.get('naam');
        //
        //  Verwijder het fotoModel uit de itemss tabel
        //
        //console.log('FotosSideMenuCtrl tagsRemove removing foto Id from xtag.items: ', fotoModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (foto) {
          //return foto.Id === fotoModel.get('Id') && foto.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return foto.get('Id') === fotoModel.get('Id');
        });

        loDash.remove(dataFactoryFoto.sideMenuTags.fotos, function (foto) {
          return foto.get('Id') === fotoModel.get('Id');
        });

        if (xtag.items.length === 0) {
          loDash.remove(dataFactoryFoto.sideMenuTags, function (xtag) {
            return xtag.items.length === 0;
          });

          loDash.remove(dataFactoryFoto.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });
          sorteerSideMenuTags();

          q.resolve();

        } else {

          tmp = loDash.filter(xtag.items, function (fotoModel) {
            return fotoModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (fotoModel) {
            return fotoModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove(dataFactoryFoto.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('FotosSideMenuCtrl tagsAdd removed to update: ', xtag);
          dataFactoryFoto.sideMenuTags.push(xtag);

          sorteerSideMenuTags();
          q.resolve();
        }

        //console.log('FotosSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), dataFactoryFoto.sideMenuTags);
      } else {
        //console.log('FotosSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
        sorteerSideMenuTags();
        q.resolve();
      }

      return q.promise;
    }
    //    
    function tagsAdd(fotoModel, tagModel) {

      var q = $q.defer();

      //console.log('FotosSideMenuCtrl tagsAdd fotoModel, tagModel: ', fotoModel, tagModel);
      //console.log('FotosSideMenuCtrl tagsAdd naam tag', fotoModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find(dataFactoryFoto.sideMenuTags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten dataFactoryFoto.sideMenuTags hebben de volgende props:
      //  -    fotos: een tabel met alle fotoModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde fotoModellen.
      //  -    aantal: het unieke aantal fotoModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in fotoTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste fotoModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(fotoModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (fotoModel) {
          return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        dataFactoryFoto.sideMenuTags.push(xtag);
        sorteerSideMenuTags();
        //console.log('FotosSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', fotoModel.get('naam'), fotoModel.get('Id'), dataFactoryFoto.sideMenuTags);
        //console.log('FotosSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => dataFactoryFoto.sideMenuTags object naam, Id: ', fotoModel.get('naam'), fotoModel.get('Id'), dataFactoryFoto.sideMenuTags);

        q.resolve();
      } else {
        //
        //  Voeg het fotoModel toe aan bestaand tag dataFactoryFoto.data.tag object
        //
        xtag.items.push(fotoModel);
        //
        //  Update het fotoTagModel
        //
        tmp = loDash.filter(xtag.items, function (fotoModel) {
          return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (fotoModel) {
          return fotoModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove(dataFactoryFoto.sideMenuTags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('FotosSideMenuCtrl tagsAdd removed to update: ', xtag);
        dataFactoryFoto.sideMenuTags.push(xtag);
        //console.log('FotosSideMenuCtrl tagsAdd menu-onbject fotoModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', fotoModel.get('naam'), fotoModel.get('Id'), dataFactoryFoto.sideMenuTags);
        sorteerSideMenuTags();

        q.resolve();
      }

      return q.promise;
    }
    //
    function sorteerSideMenuTags() {

      //console.warn('FotosSideMenuCtrl sorteerSideMenuTags');
      loDash.remove(dataFactoryFoto.sideMenuTags, function (xtag) {
        return xtag.length === 0;
      });
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(dataFactoryFoto.sideMenuTags, function (xtag) {
        return xtag.length !== 0 && xtag.tagId.length <= 3 && xtag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter(dataFactoryFoto.sideMenuTags, function (xtag) {
        return xtag.tagId.length <= 3 && xtag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter(dataFactoryFoto.sideMenuTags, function (xtag) {
        return xtag.tagId.length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      dataFactoryFoto.sideMenuTags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function updateLabels(fotoModel) {
      //
      // Idere keer als labels geupdate worden helemaal opnieuw beginnen met een situatie zonder labels
      // Daarna de labels filteren die voor dit FotoModel bedoeld zijn.
      //

      var q = $q.defer();

      var fotoId = fotoModel.get('Id');

      //if (fotoId === '5e3bfffadc6c26958502a5f5') {
      //console.log('================================================================================================');
      //console.log('dataFactoryFoto updateLabels POI naam: ', fotoModel.get('naam'));
      //console.log('dataFactoryFoto updateLabels POI Id: ', fotoId);
      //console.log('dataFactoryFoto updateLabels POI gebruikerId: ', fotoModel.get('gebruikerId'));
      //console.log('================================================================================================');

      if (fotoModel) {
        //console.log('dataFactory.Foto updatelabels fotoModel: ', fotoModel);
        //
        //  Eerst de oude labels verwijderen
        //  Deze staan in fotoModel.xData.tags.xData
        //

        loDash.each(fotoModel.xData.tags, function (fotoTagModel) {
          //console.log('dataFactoryFoto updateLabels loop Tags: ', fotoTagModel, fotoTagModel.xData);
          tagsRemove(fotoModel, fotoTagModel.xData);
        });
        //
        //  Verwijder fotoTags die verwijderd zijn of niet public zijn
        //
        loDash.remove(dataFactoryFotoTag.store, function (fotoTagModel) {
          return fotoTagModel.get('deletedOn') > '1970-01-02 00:00:00' || (fotoTagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('xprive'));
        });
        loDash.remove(dataFactoryFotoTag.data, function (dataItem) {
          return dataItem.record.get('deletedOn') > '1970-01-02 00:00:00' || (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && dataItem.record.get('xprive'));
        });
        //
        //  Selecteer niet verwijderde fotoTags van deze foto
        //
        var myFotoTags = [];
        //if (+ceo.profielId === 4 || +ceo.profielId === 5) {
        //myFotoTags = loDash.filter(dataFactoryFotoTag.store, function (fotoTagModel) {
        //return (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('fotoId') === fotoId) || (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //return fotoTagModel.get('fotoId') === fotoId && (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) || (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //});
        //} else {
        myFotoTags = loDash.filter(dataFactoryFotoTag.store, function (fotoTagModel) {
          //return (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('fotoId') === fotoId) || (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
          return fotoTagModel.get('fotoId') === fotoId;
        });
        //}
        //console.log('dataFactoryFoto updateLabels dataFactoryFotoTag.store: ', dataFactoryFotoTag.store);
        //console.log('dataFactoryFoto updateLabels myFototags: ', myFotoTags);
        fotoModel.xData.tags = [];
        //
        //  Toevoegen myFotoTags
        //
        //console.log('dataFactoryFoto updateLabels myFotoTags TOEVOEGEN: ', myFotoTags);
        if (myFotoTags.length > 0) {
          loDash.each(myFotoTags, function (myFotoTagModel) {
            var tagId = myFotoTagModel.get('tagId');
            //console.log('dataFactoryFoto updateLabels myFotoTag toevoegen tagId: ', tagId);

            if (tagId) {

              //console.log('dataFactoryFoto updateLabels tagModel toevoegen tagId uit dataFactoryTag.store');

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });

              if (tagModel) {

                myFotoTagModel.xData = tagModel;

                //console.log('dataFactoryFoto updateLabels myFotoTag TOEVOEGEN in  SideMenu: ', fotoModel.get('naam'), tagModel.get('tag'));
                //console.log('dataFactoryFoto updateLabels myFotoTag TOEVOEGEN in  fotoModel.xData.tags: ', fotoModel.get('naam'), myFotoTagModel);

                fotoModel.xData.tags.push(myFotoTagModel);
                tagsAdd(fotoModel, tagModel);
                $rootScope.$emit('fotoSideMenuUpdate');

                //console.log('dataFactoryFoto updateLabels myFotoTag TOEGEVOEGD naam tag, xData.tags: ', fotoModel.get('naam'), tagModel.get('tag'), fotoModel.xData.tags);
              } else {
                //console.error('dataFactoryFoto updateLabels fototag toevoegen tagModel NOT FOUND: ', dataFactoryTag.store);
              }
            }
          });
          //console.log('dataFactoryFoto reload updateLabels SUCCESS');
          /*
          var oud = '';
          loDash.each(fotoModel.xData.tags, function (tag) {
            if (oud !== fotoModel.get('naam')) {
              //console.log(' ');
            }
            //console.error('dataFcatoryFoto updateLabels xdata.tags: ', fotoModel.get('naam'), tag.xData.get('tag'));
            oud = fotoModel.get('naam');
          });
          */
          q.resolve();

        } else {
          //$rootScope.$emit('labelsFotoUpdate', { fotoModel: fotoModel });
          //console.log('dataFactoryFoto resultaat xData.tags: ', fotoModel.xData.tags);

          //console.log('dataFactoryFoto reload updateLabels SUCCESS');
          q.resolve();

        }

      } else {
        //console.log('dataFactoryFoto reload updateLabels SUCCESS');
        q.resolve();
      }
      //} else {
      //console.log('dataFactoryFoto updateLabels DEBUGGING');
      //q.resolve();
      //}

      return q.promise;
    }
    //
    //  Na de load van alle Sporen wordt in ieder foto bepaald of er nieuwe reacties zijn toegveoegd.
    //
    function updateReacties(fotoModel) {

      //console.warn('dataFactoryFoto updateReacties naam: ', fotoModel.get('naam'));

      var q = $q.defer();

      var fotoId = fotoModel.get('Id');

      var fotoReacties = loDash.filter(dataFactoryFotoReactie.store, function (fotoReactieModel) {
        return fotoReactieModel.get('fotoId') === fotoId;
      });
      //console.log('dataFactoryFoto updateReacties fotoReacties: ', fotoReacties);
      if (fotoReacties.length > 0) {
        //console.log('dataFactoryFoto updateReacties syncDown naam, fotoId, fotoReacties: ', fotoModel.get('naam'), fotoId, fotoReacties);
        loDash.each(fotoReacties, function (fotoReactieModel) {
          //console.log('dataFactoryFoto updateReacties fotoId, naam, reactie: ', fotoId, fotoModel.get('naam'), fotoReactieModel.get('reactie'));
          var fotoReactieId = fotoReactieModel.get('Id');

          var fotoReactieSupModel = loDash.find(dataFactoryFotoReactieSup.store, function (fotoReactieSupModel) {
            return fotoReactieSupModel.get('reactieId') === fotoReactieId;
          });

          if (fotoReactieSupModel) {

            fotoReactieModel.xData = {};
            fotoReactieModel.xData.tags = [];

            fotoReactieModel.xData.sup = fotoReactieSupModel;

            var xnew = fotoReactieSupModel.get('xnew');

            if (xnew) {
              if (!virgin) {
                notificationsFotoReactie += 1;
              }
              var fotoNieuwModel = loDash.find(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
                return fotoNieuwModel.get('Id') === fotoId;
              });
              if (!fotoNieuwModel) {
                dataFactoryFoto.nieuw.push(fotoModel);
                //console.log('dataFactoryFoto updateFotoxnew toegevoegd aan nieuw: ', dataFactoryFoto.nieuw);
              }
            } else {
              loDash.remove(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
                return fotoNieuwModel.get('Id') === fotoId;
              });
              //console.log('dataFactoryFoto updateFoto xnew verwijderd: ', dataFactoryFoto.nieuw);
            }
          } else {
            //console.log('dataFactoryFoto updateFotoreacties heeft nog geen fotoReactieSupModel. Dus nieuw fotoReactieSupModel aanmaken!!');

            fotoReactieSupModel = new dataFactoryFotoReactieSup.Model();
            fotoReactieSupModel.set('reactieId', fotoReactieId);
            fotoReactieSupModel.set('fotoId', fotoId);
            fotoReactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            fotoReactieSupModel.set('star', false);
            fotoReactieSupModel.set('xnew', true);
            if (virgin) {
              fotoReactieSupModel.set('xnew', false);
            }
            fotoReactieSupModel.save().then(function () {

              //console.log('dataFactoryFoto updateReacties fotoReactieSupModel CREATED.');

              fotoReactieModel.xData = {};
              fotoReactieModel.xData.tags = [];
              fotoReactieModel.xData.sup = fotoReactieSupModel;

              //console.log('dataFactoryFoto updateReacties fotoReactieSupModel toegevoegd aan Reactie.');

              var fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotoSupModel) {
                return fotoSupModel.get('fotoId') === fotoId && fotoSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });

              if (fotoSupModel) {
                //console.log('dataFactoryFoto updateReacties fotoSupModel gevonden: ', fotoId, fotoModel.get('naam'));
                fotoModel.xData.sup = fotoSupModel;

                var xnew = fotoSupModel.get('xnew');
                var star = fotoSupModel.get('star');
                //console.log('dataFactoryFoto updateFoto fotoModel, fotoModel.xData.sup UPDATE fotoId: ', fotoModel, fotoModel.xData.sup, fotoModel.xData.sup.get('fotoId'));

                if (star) {
                  var fotoStarModel = loDash.find(dataFactoryFoto.star, function (fotoStarModel) {
                    return fotoStarModel.get('Id') === fotoId;
                  });
                  if (!fotoStarModel) {
                    dataFactoryFoto.star.push(fotoModel);
                    //console.log('dataFactoryFoto updateFoto star toegevoegd: ', dataFactoryFoto.star);
                  }
                } else {
                  loDash.remove(dataFactoryFoto.star, function (fotoStarModel) {
                    return fotoStarModel.get('Id') === fotoId;
                  });
                  //console.log('dataFactoryFoto updateFoto star verwijderd: ', dataFactoryFoto.star);
                }

                //console.log('dataFactoryFoto updateFoto xnew: ', xnew);


                if (xnew) {
                  if (!virgin) {
                    notificationsFoto += 1;
                  }
                  var fotoNieuwModel = loDash.find(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
                    return fotoNieuwModel.get('Id') === fotoId;
                  });
                  if (!fotoNieuwModel) {
                    dataFactoryFoto.nieuw.push(fotoModel);
                    //console.log('dataFactoryFoto updateFotoxnew toegevoegd aan nieuw: ', dataFactoryFoto.nieuw);
                  }
                } else {
                  loDash.remove(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
                    return fotoNieuwModel.get('Id') === fotoId;
                  });
                  //console.log('dataFactoryFoto updateFoto xnew verwijderd: ', dataFactoryFoto.nieuw);
                }


                //console.log('dataFactoryFoto reload updateSupModel SUCCESS');
                q.resolve();

                //console.log('dataFactoryFoto updateFotoList heeft nog geen supModel. Dus nieuw!! Id, naam: ', fotoModel.get('Id'), fotoModel.get('naam'));

                fotoSupModel = new dataFactoryFotoSup.Model();
                fotoSupModel.set('fotoId', fotoId);
                fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                fotoSupModel.set('star', false);
                fotoSupModel.set('xnew', true);
                if (virgin) {
                  fotoSupModel.set('xnew', false);
                  //console.log('dataFactoryFoto updateFoto nieuwe fotoenup niet als nieuw beschouwen. Gebruiker is maagd');
                }
                //console.log('dataFactoryFoto updateFoto nieuw fotoSupModel: ', fotoSupModel.get('fotoId'));

                fotoSupModel.save().then(function () {

                  //console.log('dataFactoryFoto updateFoto nieuw fotoSupModel: ', fotoSupModel);

                  fotoModel.xData.sup = fotoSupModel;

                  if (!virgin) {
                    notificationsFoto += 1;
                    var nieuwModel = loDash.find(dataFactoryFoto.nieuw, function (nieuwModel) {
                      return nieuwModel.get('Id') === fotoId;
                    });
                    if (!nieuwModel) {
                      dataFactoryFoto.nieuw.push(fotoModel);
                    }
                  } else {
                    //console.error('dataFactoryFoto updateFoto nieuwe fotoenup notifications skipped. Gebruiker is maagd');
                  }
                  //console.log('dataFactoryFoto updateFoto nieuwe fotoenup voor fotoId NOT FOUND in FotoStore.nieuw: ', fotoId, dataFactoryFoto.nieuw);

                  //console.log('dataFactoryFoto reload updateSupModel nieuwe foto SUCCESS');
                  q.resolve();

                });
              }
            });
          }
        });
        //console.log('dataFactoryFoto reload updateReacties SUCCESS');
        q.resolve();
      } else {
        //console.log('dataFactoryFoto reload updateReacties SUCCESS');
        q.resolve();
      }

      return q.promise;
    }

    function initxData(fotoModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      //console.log('initxData START: ', fotoModel);

      if (!fotoModel.xData) {
        fotoModel.xData = {};
        //console.log('dataFactoryFoto updateFoto xData: ', fotoModel.xData);
      }
      if (!fotoModel.xData.pois) {
        fotoModel.xData.pois = [];
        //console.log('dataFactoryFoto updateFoto xData.pois: ', fotoModel.xData.pois);
      }
      if (!fotoModel.xData.fotos) {
        fotoModel.xData.fotos = [];
        //console.log('dataFactoryFoto updateFoto xData.fotos: ', fotoModel.xData.fotos);
      }
      if (!fotoModel.xData.tags) {
        fotoModel.xData.tags = [];
        //console.log('dataFactoryFoto updateFoto xData.tags: ', fotoModel.xData.tags);
      }
      if (!fotoModel.xData.groep) {
        fotoModel.xData.groep = '';
        //console.log('dataFactoryFoto updateFoto xData.groep: ', fotoModel.xData.groep);
      }
      //console.log('initxData READY: ', fotoModel.xData);
    }
    //
    
    
    function updateSupModel(fotoModel) {

      //console.log('dataFactoryFoto UpdateFoto: ', fotoModel.get('naam'));

      var q = $q.defer();

      var fotoId = fotoModel.get('Id');
      var gebruikerId = dataFactoryCeo.currentModel.get('Id');

      var fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotoSupModel) {
        return fotoSupModel.get('fotoId') === fotoId && fotoSupModel.get('gebruikerId') === gebruikerId;
      });

      //console.log('dataFactoryFoto UpdateSupModel fotoSupModel: ', fotoSupModel);
      if (fotoSupModel) {

        fotoModel.xData.sup = fotoSupModel;

        var xnew = fotoSupModel.get('xnew');
        var star = fotoSupModel.get('star');
        //console.log('dataFactoryFoto updateFoto fotoModel, fotoModel.xData.sup UPDATE fotoId: ', fotoModel, fotoModel.xData.sup, fotoModel.xData.sup.get('fotoId'));

        if (star) {
          var fotoStarModel = loDash.find(dataFactoryFoto.star, function (fotoStarModel) {
            return fotoStarModel.get('Id') === fotoId;
          });
          if (!fotoStarModel) {
            dataFactoryFoto.star.push(fotoModel);
            //console.log('dataFactoryFoto updateFoto star toegevoegd: ', dataFactoryFoto.star);
          }
        } else {
          loDash.remove(dataFactoryFoto.star, function (fotoStarModel) {
            return fotoStarModel.get('Id') === fotoId;
          });
          //console.log('dataFactoryFoto updateFoto star verwijderd: ', dataFactoryFoto.star);
        }

        //console.log('dataFactoryFoto updateFoto xnew: ', xnew);


        if (xnew) {
          if (!virgin) {
            notificationsFoto += 1;
          }
          var fotoNieuwModel = loDash.find(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
            return fotoNieuwModel.get('Id') === fotoId;
          });
          if (!fotoNieuwModel) {
            dataFactoryFoto.nieuw.push(fotoModel);
            //console.log('dataFactoryFoto updateFotoxnew toegevoegd aan nieuw: ', dataFactoryFoto.nieuw);
          }
        } else {
          loDash.remove(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
            return fotoNieuwModel.get('Id') === fotoId;
          });
          //console.log('dataFactoryFoto updateFoto xnew verwijderd: ', dataFactoryFoto.nieuw);
        }
        
        
        //console.log('dataFactoryFoto reload updateSupModel SUCCESS');
        q.resolve();
      } else {

        //console.log('dataFactoryFoto updateFotoList heeft nog geen supModel. Dus nieuw!! Id, naam: ', fotoModel.get('Id'), fotoModel.get('naam'));

        fotoSupModel = new dataFactoryFotoSup.Model();
        fotoSupModel.set('fotoId', fotoId);
        fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoSupModel.set('star', false);
        fotoSupModel.set('xnew', true);
        if (virgin) {
          fotoSupModel.set('xnew', false);
          //console.log('dataFactoryFoto updateFoto nieuwe fotosup niet als nieuw beschouwen. Gebruiker is maagd');
        }
        //console.log('dataFactoryFoto updateFoto nieuw fotoSupModel: ', fotoSupModel.get('fotoId'));

        fotoSupModel.save().then(function () {

          //console.log('dataFactoryFoto updateFoto nieuw fotoSupModel: ', fotoSupModel);

          fotoModel.xData.sup = fotoSupModel;

          if (!virgin) {
            notificationsFoto += 1;
            var nieuwModel = loDash.find(dataFactoryFoto.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === fotoId;
            });
            if (!nieuwModel) {
              dataFactoryFoto.nieuw.push(fotoModel);
            }
          } else {
            //console.error('dataFactoryFoto updateFoto nieuwe fotosup notifications skipped. Gebruiker is maagd');
          }
          //console.log('dataFactoryFoto updateFoto nieuwe fotosup voor fotoId NOT FOUND in FotoStore.nieuw: ', fotoId, dataFactoryFoto.nieuw);

          //console.log('dataFactoryFoto reload updateSupModel nieuwe foto SUCCESS');
          q.resolve();

        });

      }

      return q.promise;
    }

    //
    function updateFoto(fotoModel, mode) {

      var q = $q.defer();

      //console.warn('dataFactoryFoto updateFoto foto deletedOn, xprive, gebruikerId, naam : ', fotoModel.get('deletedOn'), fotoModel.get('xprive'), fotoModel.get('gebruikerId'), fotoModel.get('naam'));

      initxData(fotoModel);

      var groepenId = fotoModel.get('groepenId');
      //console.log('dataFactoryFoto updateFoto groepenId: ', groepenId);
      fotoModel.xData.groep = '';
      if (groepenId !== '') {
        fotoModel.xData.groep = 'Iedereen';

        var found = loDash.find(dataFactoryGroepen.store, function (groep) {
          return groep.get('Id') === groepenId;
        });
        if (found) {
          fotoModel.xData.groep = found.get('groep');
          //console.log('dataFactoryFoto updateFoto xData.groep: ', fotoModel.xData.groep);
        }
      }

      $q.all([
        updateLabels(fotoModel),
        updateSupModel(fotoModel),
        updateReacties(fotoModel)
      ]).then(function () {
        //console.log('dataFactoryFoto reload updates SUCCESS');
        //return updateReacties(fotoModel)
        watchUpdate(mode, fotoModel);
        q.resolve();
      });


      fotoModel.xData.pois = [];
      fotoModel.xData.fotos = [];

      return q.promise;
    }
    //
    function watchUpdate(store) {

      //console.warn('dataFactoryFoto watchUpdate store: ', store);
      var reacties, nieuweReacties;

      var watch = loDash.find(watchSyncs, function (watch) {
        return watch.store === store;
      });
      if (watch) {
        watch.done = watch.done + 1;
      }
      if (store === 'fotoReload') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryFoto watchUpdateFotosList RELOAD updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryFoto watchUpdate done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryFoto watchUpdateFotosList RELOAD READY store, done, todo, notificationsFoto, notificationsFotoReactie: ', store, watch.done, watch.todo, notificationsFoto, notificationsFotoReactie);
          //console.log('===============================================================================================================');
          //console.warn('dataFactoryFoto watchUpdate SUCCESS');

          if (notificationsFoto > 0 || notificationsFotoReactie > 0) {

            var fotosNieuw = [];
            var fotoReactiesNieuw = [];

            fotosNieuw = loDash.filter(dataFactoryFotoSup.store, function (fotoSup) {
              return fotoSup.get('xnew');
            });

            fotoReactiesNieuw = loDash.filter(dataFactoryFotoReactieSup.store, function (fotoReactieSup) {
              return fotoReactieSup.get('xnew');
            });

            //console.error('dataFactoryFoto watchUpdateFotosList naar composeNotification notificationsFoto, dataFactoryFoto.nieuw.length, notificationsFotoReactie, reacties.length: ', store, notificationsFoto, dataFactoryFoto.nieuw.length, notificationsFotoReactie, fotoReactiesNieuw.length);

            if (fotosNieuw.length > 0 || fotoReactiesNieuw.length > 0) {
              dataFactoryNotification.composeTitleBodyNotification(fotosNieuw.length, fotoReactiesNieuw.length, 'foto');
            }

            $timeout(function () {
              $rootScope.$emit('fotosFilter');
              $rootScope.$emit('fotosNieuweAantallen');
            }, 500);
          }
        }
      }
      if (store === 'fotoRefresh') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryFoto watchUpdateFotosList REFRESH updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryFoto watchUpdateRefresh done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryFoto watchUpdateFotosList REFRESH READY store, done, todo: ', store, watch.done, watch.todo);
          //console.log('dataFactoryFoto watchUpdateFotosList REFRESH READY store, notificationsFoto, notificationsFotoReactie: ', store, notificationsFoto, notificationsFotoReactie);
          //console.log('===============================================================================================================');

          if (notificationsFoto > 0 || notificationsFotoReactie > 0) {

            var fotosNieuw = [];
            var fotoReactiesNieuw = [];

            fotosNieuw = loDash.filter(dataFactoryFotoSup.store, function (fotoSup) {
              return fotoSup.get('xnew');
            });

            fotoReactiesNieuw = loDash.filter(dataFactoryFotoReactieSup.store, function (fotoReactieSup) {
              return fotoReactieSup.get('xnew');
            });

            //console.error('dataFactoryFoto watchUpdateFotosList naar composeNotification notificationsFoto, dataFactoryFoto.nieuw.length, notificationsFotoReactie, reacties.length: ', store, notificationsFoto, dataFactoryFoto.nieuw.length, notificationsFotoReactie, nieuweReacties.length);
            dataFactoryNotification.composeTitleBodyNotification(fotosNieuw.length, fotoReactiesNieuw.length, 'foto');
          }

          $rootScope.$emit('fotosFilter');
          $rootScope.$emit('fotosNieuweAantallen');
        }
      }
    }
    //
    function updateFotosList() {

      //console.warn('dataFactoryFoto updateFotosList');

      dataFactoryFotoSup.store = loDash.sortBy(dataFactoryFotoSup.store, 'changedOn');
      dataFactoryFotoSup.store = loDash.uniqBy(dataFactoryFotoSup.store, 'fotoId');

      notificationsFoto = 0;
      notificationsFotoReactie = 0;

      todoTotal = 0;
      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'fotoReload';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'fotoReload';
        });
      }
      var watchSync = {
        store: 'fotoReload',
        todo: dataFactoryFoto.store.length,
        done: 0
      };
      todoTotal = todoTotal + dataFactoryFoto.store.length;
      watchSyncs.push(watchSync);

      dataFactoryFotoSup.store = loDash.uniqBy(dataFactoryFotoSup.store, function (fotoSup) {
        return fotoSup.get('fotoId');
      });
      //console.log('dataFactoryFoto TagStore: ', dataFactoryTag.store);
      //console.log('dataFactoryFoto fotoStore: ', dataFactoryFoto.store);
      //console.log('dataFactoryFoto fotoSupStore: ', dataFactoryFotoSup.store);
      //console.log('dataFactoryFoto FotoTagStore: ', dataFactoryFotoTag.store);
      if (dataFactoryFoto.store.length > 0) {

        var promises = [];

        loDash.each(dataFactoryFoto.store, function (fotoModel) {
          //console.log('dataFactoryFoto updateFotoList fotoModel loop');
          //console.log('dataFactoryFoto updateFotoList fotoModel naam INITIAL UPDATE START: ', fotoModel.get('naam'));
          promises.push(updateFoto(fotoModel, 'fotoReload'));
          //updateFoto(trackModel, 'fotoReload').then(function () {
          //console.log('dataFactoryFoto updateFotosList naam INITIAL UPDATE SUCCES: ', fotoModel.get('naam'));
          //});
        });
        promises.push(fotosCheckNieuwTooOld());
        $q.all(promises);
      }
    }
    //
    function updateFotosTodos(todos) {

      //console.clear();
      //console.warn('dataFactoryFoto updateFotoTodos: ', todos);

      var q = $q.defer();

      notificationsFoto = 0;
      notificationsFotoReactie = 0;

      todoTotal = 0;

      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'fotoRefresh';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'fotoRefresh';
        });
      }
      var watchSync = {
        store: 'fotoRefresh',
        todo: todos.length,
        done: 0
      };
      todoTotal = todoTotal + todos.length;
      watchSyncs.push(watchSync);

      if (todos.length > 0) {

        var promises = [];
        //
        loDash.each(todos, function (fotoId) {
          //loDash.each(dataFactoryFoto.store, function (fotoModel) {
          //console.log(fotoModel.get('Id'), fotoModel.get('naam'), fotoModel.get('xprive'), fotoModel.get('gebruikerId'));
          //});
          var fotoModel = loDash.find(dataFactoryFoto.store, function (fotoModel) {
            return fotoModel.get('Id') === fotoId;
          });
          if (fotoModel) {
            if (fotoModel.get('deletedOn') > '1970-01-02 00:00:00' || (fotoModel.get('xprive') === true && fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
              //console.log('dataFactoryFoto updateFotosTodos foto naam REMOVE START: ', fotoModel.get('naam'));
              promises.push(verwijderFoto(fotoModel, 'fotoRefresh', true));
            } else {
              //console.log('dataFactoryFoto updateFotosTodos foto naam UPDATE START: ', fotoModel.get('naam'));
              promises.push(updateFoto(fotoModel, 'fotoRefresh'));
            }
          } else {
            //console.error('dataFactoryFoto updateFotoTodos IS NOT fotoModel: ', fotoId);
            watchUpdate('fotoRefresh', fotoModel);
          }
        });
        $q.all(promises).then(function () {
          //console.error('updateFotosTodos all promises resolved');
          $rootScope.$emit('filter');
          $rootScope.$emit('fotosNieuweAantallen');

          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function fotosCheckNieuwTooOld() {

      //console.warn('dataFactoryFoto fotosCheckNieuwTooOld START');

      var q = $q.defer();
      var tooOld = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
      //var tooOld = moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      //console.log('dataFactoryFoto fotosCheckNieuwTooOld: ', tooOld);
      loDash.each(dataFactoryFotoSup.store, function (fotoSupModel) {
        var publishDatum = fotoSupModel.get('createdOn');
        var xnew = fotoSupModel.get('xnew');
        var fotoId = fotoSupModel.get('fotoId');
        if (xnew) {
          //console.log('dataFactoryFoto fotosCheckNieuwTooOld publishDatum if tooOld: ', publishDatum, tooOld, xnew, fotoId);
          if (publishDatum < tooOld) {
            //console.error('dataFactoryFoto fotosCheckNieuwTooOld reset xnew');
            fotoSupModel.set('xnew', false);
            fotoSupModel.save();
            loDash.remove(dataFactoryFoto.nieuw, function (fotoModel) {
              return fotoModel.get('Id') === fotoId;
            });
            $rootScope.$emit('filter');
            $rootScope.$emit('fotosNieuweAantallen');

            //console.error('dataFactoryFoto fotosCheckNieuwTooOld updated SUCCESS');
          }
        }
      });
      q.resolve();
      return q.promise;
    }
    //
    function refresh() {

      //console.warn('dataFactoryFoto refresh start');
      //
      //  Tags opnieuw ophalen omdat de store leeg is na reload?!?!?!?
      //
      if (dataFactoryTag.store.length === 0) {
        dataFactoryTag.store = dataFactoryFoto.tags;
        //console.log('dataFactoryFoto Tag refresh restored: ', dataFactoryFoto.tags, dataFactoryTag.store);
      }
      if (virgin) {
        dataFactoryConfig.currentModel.set('virginFotos', false);
        dataFactoryConfigX.update(dataFactoryConfig.currentModel);
        //console.warn('dataFactoryFoto config reset virgin');
      }

      $q.all([
        dataFactoryTag.syncUp(),
        //removeIf(!fotos)
        dataFactoryHelp.syncUp(),
        dataFactoryBlacklist.syncUp(),
        //endRemoveIf(!fotos)
        dataFactoryFotoReactieSup.syncUp(),
        dataFactoryFotoReactie.syncUp(),
        dataFactoryFotoTag.syncUp(),
        dataFactoryFotoSup.syncUp(),
        dataFactoryFoto.syncUp()
      ]).then(function () {
        dataFactoryFoto.syncDownAll().then(function (newSyncDate) {

          //console.log('refresh dataFactoryFoto newSyncDate: ', newSyncDate);

          if (newSyncDate !== null && newSyncDate !== undefined) {

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryFoto, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoSup, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoReactie, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoReactieSup, newSyncDate);
            }
            dataFactoryTag.lastSyncDate = newSyncDate;
            dataFactoryFoto.lastSyncDate = newSyncDate;
            dataFactoryFotoSup.lastSyncDate = newSyncDate;
            dataFactoryFotoTag.lastSyncDate = newSyncDate;
            dataFactoryFotoReactie.lastSyncDate = newSyncDate;
            dataFactoryFotoReactieSup.lastSyncDate = newSyncDate;

            //
            //console.log('dataFactoryTag refresh Tag todo: ', dataFactoryTag.todo);
            //console.log('dataFactoryFoto refresh Foto todo: ', dataFactoryFoto.todo);
            //console.log('dataFactoryFoto refresh FotoSup todo: ', dataFactoryFotoSup.todo);
            //console.log('dataFactoryFoto refresh FotoTag todo: ', dataFactoryFotoTag.todo);
            //console.log('dataFactoryFoto refresh fotoreactie todo: ', dataFactoryFotoReactie.todo);
            //
            todostmp = [...dataFactoryFoto.todo, ...dataFactoryFotoSup.todo, ...dataFactoryFotoTag.todo, ...dataFactoryFotoReactie.todo, ...dataFactoryFotoReactieSup.todo];
            uniqueSet = new Set(todostmp);
            todos = [...uniqueSet];

            if (todos.length > 0) {

              updateFotosTodos(todos).then(function () {

                //console.error('dataFactoryFoto refresh updateFotosTodos SUCCES');

                dataFactoryTag.todo = [];
                dataFactoryFoto.todo = [];
                dataFactoryFotoSup.todo = [];
                dataFactoryFotoTag.todo = [];
                dataFactoryFotoReactie.todo = [];
                //console.log('dataFactoryFoto refresh fotoreactie Store: ', dataFactoryFotoReactie.store);
                //console.log('dataFactoryFoto refresh Foto Store: ', dataFactoryFoto.store);
                //console.log('dataFactoryFoto refresh FotoSup Store: ', dataFactoryFotoSup.store);
                //console.log('dataFactoryFoto refresh FotoTag Store: ', dataFactoryFotoTag.store);
                //console.log('dataFactoryFoto refresh Tag.store: ', dataFactoryTag.store);
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

      //console.warn('dataFactoryFoto reload start');

      virgin = true;
      dataFactoryConfigX.loadMe().then(function () {
        virgin = dataFactoryConfig.currentModel.get('dataFactoryFoto virginFotos');
        //console.error('dataFactoryFoto VirginFotos FROM config DB: ', dataFactoryConfig.currentModel.get('virginFotos'));
        //console.error('dataFactoryFoto VirginFotos: ', virgin);
      });
      //console.log('dataFactoryFoto Wachten op dataFactoryConfig.currentModel');
      dataFactoryStore.storeInitAll(dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryTag, dataFactoryFotoReactie, dataFactoryFotoReactieSup).then(function (newSyncDate) {

        //console.error('dataFactoryFoto reload dataFactoryFoto newSyncDate: ', newSyncDate);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryFoto, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoSup, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoReactie, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryFotoReactieSup, newSyncDate);
        }
        dataFactoryTag.lastSyncDate = newSyncDate;
        dataFactoryFoto.lastSyncDate = newSyncDate;
        dataFactoryFotoSup.lastSyncDate = newSyncDate;
        dataFactoryFotoTag.lastSyncDate = newSyncDate;
        dataFactoryFotoReactie.lastSyncDate = newSyncDate;
        dataFactoryFotoReactieSup.lastSyncDate = newSyncDate;

        dataFactoryTag.loaded = true;
        dataFactoryFoto.loaded = true;
        dataFactoryFotoSup.loaded = true;
        dataFactoryFotoTag.loaded = true;
        dataFactoryFotoReactie.loaded = true;
        dataFactoryFotoReactieSup.loaded = true;

        //console.log('dataFactoryFoto reload wachten op Tag, Blacklist, Groepen en Groepdeelnemers');
        var interval = $interval(function () {

          //console.log('dataFactoryFoto reload wachten op globalStores loaded: ', dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded);
          //if (dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
          if (dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
            $interval.cancel(interval);
            //console.error('dataFactoryFoto reload SUCCESS');
            dataFactoryTag.todo = [];
            dataFactoryFoto.todo = [];
            dataFactoryFotoSup.todo = [];
            dataFactoryFotoTag.todo = [];
            dataFactoryFotoReactie.todo = [];
            dataFactoryFotoReactieSup.todo = [];

            //console.time('dataFactoryFoto-reloadUpdateFotosList');
            $rootScope.$emit('dataFactoryFoto fotosFilter');
            dataFactoryTag.reStore().then(function () {
              dataFactoryFoto.tags = dataFactoryTag.store;
              //console.log('dataFactoryFoto Tag reload restored: ', dataFactoryTag.store);
              updateFotosList();
              dataFactoryFoto.tags = dataFactoryTag.store;
              dataFactoryFoto.verrijkt = true;
            });
            //console.warn('dataFactoryFoto reload updateStores SUCCES');
            if (+ceo.profielId === 4 || +ceo.profielId === 5) {
              //console.error('dataFactoryFoto reload started => refresh');
              $rootScope.$emit('fotosFilter');
              $rootScope.$emit('fotosNieuweAantallen');

              dataFactoryClock.startClockFotoSlow(function () {
                refresh();
              });
            }
          }
        }, 50, 50);
      });
    }
    //
    $rootScope.$on('reloadFoto', function () {
      //console.log('dataFactoryFoto reloadFoto event');
      reload();
    });
    //
    $rootScope.$on('refreshFoto', function () {
      //console.log('dataFactoryFoto refreshFoto event');
      refresh();
    });
    //
    $rootScope.$on('sleepClockFoto', function () {
      //console.debug('dataFactoryPoi sleepClockFoto event');
      dataFactoryClock.startClockFotoSlow(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('startClockFoto', function () {
      //console.debug('dataFactoryPoi startClockFoto event');
      dataFactoryClock.startClockFotoFast(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('stopClockFoto', function () {
      //console.debug('dataFactoryPoi stopClockFoto event');
      dataFactoryClock.stopClockFoto();
    });
    //
    //removeIf(!fotoen)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryFoto waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 500);
    //endRemoveIf(!fotoen)
    //removeIf(!fotos)
    if (ceo.profielId === 5) {
      $timeout(function () {
        var teller = 0;
        var startInterval = $interval(function () {
          teller += 1;
          //console.log('dataFactoryFoto waiting for Ceo.... ', teller);
          if (!angular.equals(dataFactoryCeo, {})) {
            $interval.cancel(startInterval);
            reload();
          }
        }, 100, 200);
      }, 5000);
    }
    //endRemoveIf(!fotos)
    return dataFactoryFoto;
  }]);
