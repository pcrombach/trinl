/* eslint-disable no-undef */
// eslint-disable-next-line no-undef


//removeIf(!tracks)
trinl.factory('dataFactoryTrack', ['loDash', '$rootScope', '$q', '$timeout', '$interval', '$ionicPlatform', 'dataFactoryNotification', 'dataFactoryProxy', 'dataFactoryObjectId', 'dataFactoryStore', 'dataFactoryAlive', 'dataFactoryClock', 'dataFactoryInstellingen', 'dataFactoryCeo', 'dataFactoryBlacklist', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryTag', 'dataFactoryHelp', 'dataFactoryTrackSup', 'dataFactoryTrackTag', 'dataFactoryTrackReactie', 'dataFactoryTrackReactieSup', 'dataFactoryTrackPoisFotos', 'dataFactorySyncFS',
  function (loDash, $rootScope, $q, $timeout, $interval, $ionicPlatform, dataFactoryNotification, dataFactoryProxy, dataFactoryObjectId, dataFactoryStore, dataFactoryAlive, dataFactoryClock, dataFactoryInstellingen, dataFactoryCeo, dataFactoryBlacklist , dataFactoryConfig, dataFactoryConfigX, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryTag, dataFactoryHelp, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryTrackReactie, dataFactoryTrackReactieSup, dataFactoryTrackPoisFotos, dataFactorySyncFS) {
    //endRemoveIf(!tracks)
    
    

    


    //console.warn('dataFactoryTrack');

    var dataFactoryTrack = {};
    var me = dataFactoryTrack;

    dataFactoryTrack.storeId = 'track';

    dataFactoryTrack.virgin = true;

    dataFactoryTrack.fsEnable = true;
    dataFactoryTrack.fsReady = false;

    dataFactoryTrack.idProperty = '';

    dataFactoryTrack.data = {};
    dataFactoryTrack.store = [];
    dataFactoryTrack.removedRecords = [];

    dataFactoryTrack.nieuw = [];
    dataFactoryTrack.star = [];

    dataFactoryTrack.current = '';
    dataFactoryTrack.selected = [];
    dataFactoryTrack.filters = [];
    dataFactoryTrack.sorters = [];
    dataFactoryTrack.actualTime = '1970-01-02 00:00:00';

    dataFactoryTrack.lastSyncDate = '1970-01-02 00:00:00';

    dataFactoryTrack.tmpArray = [];
    dataFactoryTrack.tmpArray2 = [];
    dataFactoryTrack.currentTrackId = '';

    dataFactoryTrack.globalsLoadReady = false;
    dataFactoryTrack.card = false;
    dataFactoryTrack.verrijkt = false;
    dataFactoryTrack.loaded = false;
    dataFactoryTrack.autoSync = true;
    dataFactoryTrack.enableSyncUp = true;
    dataFactoryTrack.enableSyncDown = true;
    dataFactoryTrack.delaySyncUpTime = 0;
    dataFactoryTrack.todo = [];
    dataFactoryTrackSup.todo = [];
    dataFactoryTrackTag.todo = [];
    dataFactoryTrackReactie.todo = [];
    dataFactoryTrackReactieSup.todo = [];
    dataFactoryTrack.sideMenuTags = [];

    dataFactoryTrack.remoteSync = true;

    dataFactoryTrack.currentPage = 1;
    dataFactoryTrack.pageSize = 2500;

    dataFactoryTrack.xprive = '0';

    dataFactoryTrack.refreshDone = false;

    dataFactoryTrack.Model = function (config) {

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
      
      //removeIf(!tracken)
      this.trackId = {
        value: config.trackId || '',
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
      //endRemoveIf(!tracken)
      
      
      //removeIf(tracken)
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
      //endRemoveIf(!tracken)
      
      
      
      
      
      
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
      

      dataFactoryObjectId.create();

      return this;
    };

    dataFactoryTrack.Model.prototype = {
      get: function (prop) {
        ////console.log(dataFactoryTrack.storeId + ' get: ' + prop);
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
        return dataFactoryTrack.remove(m);
      },
      save: function () {
        ////console.log('save');
        var m = this;
        m.set('changedOn', dataFactoryAlive.getTimestamp());
        ////console.error('save: ', m);
        return dataFactoryTrack.save(m);
      },
      setAll: function () {
        ////console.log('setAll');
        var m = this;
        loDash.each(m, function (field) {
          field.dirty = true;
        });
        var Id = m.get('Id');
        loDash.each(dataFactoryTrack.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        ////console.log('setAll: ' + JSON.stringify(m));
        return m;
      },
      unsetAll: function () {
        ////console.log('track unsetAll');

        var m = this;
        if (m.$$hashKey) {
          delete m.$$hashKey;
        }
        loDash.each(m, function (field) {
          if (field !== true && field !== false) {
            ////console.log('track unsetAll m, field: ', m, field);
            field.dirty = false;
          }
        });
        loDash.each(dataFactoryTrack.data, function (item) {
          if (item.record.get('Id') === m.Id) {
            item.dirty = false;
            return false;
          }
        });
        ////console.log('track unsetAll: ', m);
        return m;
      },
      set: function (prop, value) {
        var m = this;
        ////console.log('set prop: ', prop);
        m[prop].value = value;
        m[prop].dirty = true;
        var Id = m.get('Id');
        loDash.each(dataFactoryTrack.data, function (item) {
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
          loDash.each(dataFactoryTrack.data, function (item) {
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
        loDash.each(dataFactoryTrack.data, function (item) {
          if (item.record.get('Id') === Id) {
            item.dirty = true;
            return false;
          }
        });
        ////console.log('setId: ' + JSON.stringify(m));

        return m;
      }
    };

    dataFactoryTrack.clear = function () {
      return dataFactoryStore.clear(me);
    };

    dataFactoryTrack.find = function (prop, value) {
      return dataFactoryStore.find(me, prop, value);
    };

    dataFactoryTrack.findBy = function (fn) {
      return dataFactoryStore.findBy(me, fn);
    };

    dataFactoryTrack.findRecord = function (prop, value, startIndex, anyMatch, caseSensitive, exactMatch) {
      return dataFactoryStore.findRecord(me, prop, value, startIndex, anyMatch, caseSensitive, exactMatch);
    };

    dataFactoryTrack.first = function () {
      return dataFactoryStore.first(me);
    };

    dataFactoryTrack.getById = function (Id) {
      return dataFactoryStore.getById(me, Id);
    };

    dataFactoryTrack.getCount = function () {
      return dataFactoryStore.getCount(me);
    };

    dataFactoryTrack.getStoreId = function () {
      return dataFactoryStore.getStoreId(me);
    };

    dataFactoryTrack.initLoad = function () {
      return dataFactoryStore.initLoad(me);
    };

    dataFactoryTrack.isLoaded = function () {
      return dataFactoryStore.isLoaded(me);
    };

    dataFactoryTrack.last = function () {
      return dataFactoryStore.last(me);
    };

    dataFactoryTrack.addData = function (model) {
      return dataFactoryStore.addData(me, model);
    };

    dataFactoryTrack.nextPage = function () {
      return dataFactoryStore.nextPage(me);
    };

    dataFactoryTrack.previousPage = function () {
      return dataFactoryStore.previousPage(me);
    };

    dataFactoryTrack.remove = function (record) {
      return dataFactoryStore.remove(me, record);
    };

    dataFactoryTrack.removeAll = function () {
      return dataFactoryStore.removeAll(dataFactoryStore);
    };

    dataFactoryTrack.setAutoSync = function (bool) {
      return dataFactoryStore.setAutoSync(me, bool);
    };

    dataFactoryTrack.setPageSize = function (size) {
      return dataFactoryStore.setPageSize(me, size);
    };

    dataFactoryTrack.setPrive = function (bool) {
      return dataFactoryStore.setPrive(me, bool);
    };

    dataFactoryTrack.save = function (model) {
      return dataFactoryStore.save(me, model);
    };

    dataFactoryTrack.storeInit = function () {
      return dataFactoryStore.storeInit(me);
    };

    dataFactoryTrack.loadAll = function () {
      return dataFactoryStore.loadAll(me);
    };

    dataFactoryTrack.sync = function () {
      return dataFactoryStore.syncUp(me)
        .then(dataFactoryStore.syncDown(me));
    };

    dataFactoryTrack.syncUp = function () {
      return dataFactoryStore.syncUp(me);
    };

    dataFactoryTrack.syncUpAll = function () {
      return dataFactoryStore.syncUpAll(me);
    };

    dataFactoryTrack.syncDown = function (update) {
      return dataFactoryStore.syncDown(me, update);
    };

    dataFactoryTrack.syncDownAll = function (update) {
      return dataFactoryStore.syncDownAll(dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryTag, dataFactoryTrackReactie, dataFactoryTrackReactieSup, update);
    };

    dataFactoryTrack.init = function () {
      //console.warn('dataFactoryTrack init');

      dataFactoryTrack.fsReady = false;
      dataFactoryTrack.loaded = false;
      dataFactoryTrack.star = [];
      dataFactoryTrack.nieuw = [];
      dataFactoryTrack.selected = [];
      dataFactoryTrack.data = [];
      dataFactoryTrack.store = [];
      dataFactoryTrack.removedRecords = [];
      dataFactoryTrack.current = '';
      dataFactoryTrack.filters = [];
      dataFactoryTrack.sorters = [];
      dataFactoryTrack.actualTime = '1970-01-02 00:00:00';
      dataFactoryTrack.lastSyncDate = '1970-01-02 00:00:00';
      dataFactoryTrack.tmpArray = [];
      dataFactoryTrackSup.todo = [];
      dataFactoryTrackTag.todo = [];
      dataFactoryTrackReactie.todo = [];
      dataFactoryTrackReactieSup.todo = [];
    };
    //
    dataFactoryTrack.init();
    //
    var watchSyncs = [];
    var todoTotal = 0;
    var notificationsTrack = 0;
    var notificationsTrackReactie = 0;
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
    // Het gaat hier om een gepubliceerd trackModel die door de eigenaar is geprivatiseerd of defintief verwijderd heeft.
    // De volger hoeft alleen maar de dit trackModel/trackSupModel en trackTagModellen (incl updaten van de lables in SideMenu) 
    // uit zijn stores te verwijderen.
    // Dit trackModel is dan niet meer zichtbaar in zijn TRINL.
    // Hij laat zijn TrackSup TrackReactieModel TrackReactieSupModel en TrackTagModellen in de database.
    // Als de eigenaar deze Track opnieuw publiceerd worden de Sup en Reactie bestanden weer toegevoegd.
    // Deze POI blijft bij de volger weg als deze Track geprivatiseerd blijft. De Als de Track niet gesyncd wordt dan worden ook de andere Modellen niet gesynced.
    // !!!Attentie. De updates van dit trackModel, trackSupModel, Reacties en trackTags gaan gewoon door. Nagaan of de volger hierdoor niet lastig gevallen wordt!!!
    // LoadAll gaat goed. Dit trackModel wordt niet meer geload.
    // SyncDownAll !!!!!!!!!!!!!! SyncDown haalt ook nieuwe modellen op. Alles moet gewoon door de FrontEndAPI in
    // stores worden bijgewerkt. De gelinkte bestanden zijn
    // jammer genoeg overbodig als er geen itemModel is. De volgende loadAll laadt deze overbodige modellen toch niet meer.
    // 
    function verwijderTrack(trackModel, mode, watch) {

      var q = $q.defer();
      //console.warn('dataFactoryTrack verwijderTrack: ', trackModel.get('naam'));

      var trackId = trackModel.get('Id');

      initxData(trackModel);
      //
      //  Clean up stores
      //
      loDash.remove(dataFactoryTrack.star, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      loDash.remove(dataFactoryTrack.nieuw, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      loDash.remove(dataFactoryTrack.selected, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });
      //
      //  Verwijderen labels in sidemenu
      //
      loDash.each(trackModel.xData.tags, function (trackTagModel) {
        //console.log('dataFactoryTrack updateLabels loop Tags: ', trackTagModel, trackTagModel.xData);
        tagsRemove(trackModel, trackTagModel.xData);
      });
      trackModel.xData.tags = [];
      //

      $rootScope.$emit('trackSideMenuUpdate');
      //
      loDash.remove(dataFactoryTrackTag.store, function (trackTagModel) {
        return trackTagModel.get('trackId') === trackId && trackTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryTrackTag.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryTrack verwijderTrack trackTags VERWIJDERD form trackTagStore/data');

      loDash.remove(dataFactoryTrackReactie.store, function (trackReactieModel) {
        return trackReactieModel.get('trackId') === trackId;
      });
      loDash.remove(dataFactoryTrackReactie.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId;
      });
      //console.warn('dataFactoryTrack verwijderTrack trackReactie VERWIJDERD form trackReactieStore/data');

      loDash.remove(dataFactoryTrackReactieSup.store, function (trackReactieSupModel) {
        return trackReactieSupModel.get('trackId') === trackId && trackReactieSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryTrackReactieSup.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('dataFactoryTrack verwijderTrack trackReactieSups VERWIJDERD from store');

      loDash.remove(dataFactoryTrackSup.store, function (trackSupModel) {
        return trackSupModel.get('trackId') === trackId && trackSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      loDash.remove(dataFactoryTrackSup.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.warn('dataFactoryTrack verwijderTrack trackSup VERWIJDERD from trackSupStore/data');

      //updateLabels(trackModel).then(function () {
      loDash.remove(dataFactoryTrack.store, function (trackModel) {
        //console.log('dataFactoryTrack verwijderTrack trackverijderen loDash remove: ', trackModel, trackId, trackModel.get('Id'), trackModel.get('xprive'), trackModel.get('gebruikerId'), trackModel.get('naam'));
        return trackModel.get('Id') === trackId;
      });
      loDash.remove(dataFactoryTrack.data, function (dataItem) {
        return dataItem.record.get('Id') === trackId;
      });
      //console.warn('dataFactoryTrack verwijderTrack track VERWIJDERD from trackStore/data');
      //console.log('dataFactoryTrack verwijderTrack aantal dataFactoryTrack.store STORE: ', dataFactoryTrack.store, dataFactoryTrack.store.length);
      //
      //  Waarschuwing als de gebruiker in deze Card zit
      //
      $rootScope.$emit('trackVerwijderd', {
        trackModel: trackModel
      });

      if (watch) {
        watchUpdate(mode, trackModel);
      }
      $timeout(function () {
        $rootScope.$emit('tracksFilter');
        $rootScope.$emit('tracksNieuweAantallen');
      }, 500);

      q.resolve();
      //});

      return q.promise;
    }
    //
    function tagsRemove(trackModel, tagModel) {

      var q = $q.defer();

      //console.warn('TracksSideMenuCtrl tagsRemove trackModel, tagModel: ', trackModel, tagModel);
      //console.log('TracksSideMenuCtrl tagsRemove naam tag', trackModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find(dataFactoryTrack.sideMenuTags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('TracksSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = trackModel.get('naam');
        //
        //  Verwijder het trackModel uit de itemss tabel
        //
        //console.log('TracksSideMenuCtrl tagsRemove removing track Id from xtag.items: ', trackModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (track) {
          //return track.Id === trackModel.get('Id') && track.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return track.get('Id') === trackModel.get('Id');
        });

        loDash.remove(dataFactoryTrack.sideMenuTags.tracks, function (track) {
          return track.get('Id') === trackModel.get('Id');
        });

        if (xtag.items.length === 0) {
          loDash.remove(dataFactoryTrack.sideMenuTags, function (xtag) {
            return xtag.items.length === 0;
          });

          loDash.remove(dataFactoryTrack.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });
          sorteerSideMenuTags();

          q.resolve();

        } else {

          tmp = loDash.filter(xtag.items, function (trackModel) {
            return trackModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (trackModel) {
            return trackModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove(dataFactoryTrack.sideMenuTags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('TracksSideMenuCtrl tagsAdd removed to update: ', xtag);
          dataFactoryTrack.sideMenuTags.push(xtag);

          sorteerSideMenuTags();
          q.resolve();
        }

        //console.log('TracksSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), dataFactoryTrack.sideMenuTags);
      } else {
        //console.log('TracksSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
        sorteerSideMenuTags();
        q.resolve();
      }

      return q.promise;
    }
    //    
    function tagsAdd(trackModel, tagModel) {

      var q = $q.defer();

      //console.log('TracksSideMenuCtrl tagsAdd trackModel, tagModel: ', trackModel, tagModel);
      //console.log('TracksSideMenuCtrl tagsAdd naam tag', trackModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find(dataFactoryTrack.sideMenuTags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten dataFactoryTrack.sideMenuTags hebben de volgende props:
      //  -    tracks: een tabel met alle trackModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde trackModellen.
      //  -    aantal: het unieke aantal trackModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in trackTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste trackModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(trackModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (trackModel) {
          return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        dataFactoryTrack.sideMenuTags.push(xtag);
        sorteerSideMenuTags();
        //console.log('TracksSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', trackModel.get('naam'), trackModel.get('Id'), dataFactoryTrack.sideMenuTags);
        //console.log('TracksSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => dataFactoryTrack.sideMenuTags object naam, Id: ', trackModel.get('naam'), trackModel.get('Id'), dataFactoryTrack.sideMenuTags);

        q.resolve();
      } else {
        //
        //  Voeg het trackModel toe aan bestaand tag dataFactoryTrack.data.tag object
        //
        xtag.items.push(trackModel);
        //
        //  Update het trackTagModel
        //
        tmp = loDash.filter(xtag.items, function (trackModel) {
          return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (trackModel) {
          return trackModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove(dataFactoryTrack.sideMenuTags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('TracksSideMenuCtrl tagsAdd removed to update: ', xtag);
        dataFactoryTrack.sideMenuTags.push(xtag);
        //console.log('TracksSideMenuCtrl tagsAdd menu-onbject trackModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', trackModel.get('naam'), trackModel.get('Id'), dataFactoryTrack.sideMenuTags);
        sorteerSideMenuTags();

        q.resolve();
      }

      return q.promise;
    }
    //
    function sorteerSideMenuTags() {

      //console.warn('TracksSideMenuCtrl sorteerSideMenuTags');
      loDash.remove(dataFactoryTrack.sideMenuTags, function (xtag) {
        return xtag.length === 0;
      });
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(dataFactoryTrack.sideMenuTags, function (xtag) {
        return xtag.length !== 0 && xtag.tagId.length <= 3 && xtag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter(dataFactoryTrack.sideMenuTags, function (xtag) {
        return xtag.tagId.length <= 3 && xtag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter(dataFactoryTrack.sideMenuTags, function (xtag) {
        return xtag.tagId.length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      dataFactoryTrack.sideMenuTags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function updateLabels(trackModel) {
      //
      // Idere keer als labels geupdate worden helemaal opnieuw beginnen met een situatie zonder labels
      // Daarna de labels filteren die voor dit TrackModel bedoeld zijn.
      //

      var q = $q.defer();

      var trackId = trackModel.get('Id');

      //if (trackId === '5e3bfffadc6c26958502a5f5') {
      //console.log('================================================================================================');
      //console.log('dataFactoryTrack updateLabels POI naam: ', trackModel.get('naam'));
      //console.log('dataFactoryTrack updateLabels POI Id: ', trackId);
      //console.log('dataFactoryTrack updateLabels POI gebruikerId: ', trackModel.get('gebruikerId'));
      //console.log('================================================================================================');

      if (trackModel) {
        //console.log('dataFactory.Track updatelabels trackModel: ', trackModel);
        //
        //  Eerst de oude labels verwijderen
        //  Deze staan in trackModel.xData.tags.xData
        //

        loDash.each(trackModel.xData.tags, function (trackTagModel) {
          //console.log('dataFactoryTrack updateLabels loop Tags: ', trackTagModel, trackTagModel.xData);
          tagsRemove(trackModel, trackTagModel.xData);
        });
        //
        //  Verwijder trackTags die verwijderd zijn of niet public zijn
        //
        loDash.remove(dataFactoryTrackTag.store, function (trackTagModel) {
          return trackTagModel.get('deletedOn') > '1970-01-02 00:00:00' || (trackTagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('xprive'));
        });
        loDash.remove(dataFactoryTrackTag.data, function (dataItem) {
          return dataItem.record.get('deletedOn') > '1970-01-02 00:00:00' || (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && dataItem.record.get('xprive'));
        });
        //
        //  Selecteer niet verwijderde trackTags van deze track
        //
        var myTrackTags = [];
        //if (+ceo.profielId === 4 || +ceo.profielId === 5) {
        //myTrackTags = loDash.filter(dataFactoryTrackTag.store, function (trackTagModel) {
        //return (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('trackId') === trackId) || (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('trackId') === trackId && trackTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //return trackTagModel.get('trackId') === trackId && (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) || (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
        //});
        //} else {
        myTrackTags = loDash.filter(dataFactoryTrackTag.store, function (trackTagModel) {
          //return (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('trackId') === trackId) || (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') && trackTagModel.get('trackId') === trackId && trackTagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
          return trackTagModel.get('trackId') === trackId;
        });
        //}
        //console.log('dataFactoryTrack updateLabels dataFactoryTrackTag.store: ', dataFactoryTrackTag.store);
        //console.log('dataFactoryTrack updateLabels myTracktags: ', myTrackTags);
        trackModel.xData.tags = [];
        //
        //  Toevoegen myTrackTags
        //
        //console.log('dataFactoryTrack updateLabels myTrackTags TOEVOEGEN: ', myTrackTags);
        if (myTrackTags.length > 0) {
          loDash.each(myTrackTags, function (myTrackTagModel) {
            var tagId = myTrackTagModel.get('tagId');
            //console.log('dataFactoryTrack updateLabels myTrackTag toevoegen tagId: ', tagId);

            if (tagId) {

              //console.log('dataFactoryTrack updateLabels tagModel toevoegen tagId uit dataFactoryTag.store');

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });

              if (tagModel) {

                myTrackTagModel.xData = tagModel;

                //console.log('dataFactoryTrack updateLabels myTrackTag TOEVOEGEN in  SideMenu: ', trackModel.get('naam'), tagModel.get('tag'));
                //console.log('dataFactoryTrack updateLabels myTrackTag TOEVOEGEN in  trackModel.xData.tags: ', trackModel.get('naam'), myTrackTagModel);

                trackModel.xData.tags.push(myTrackTagModel);
                tagsAdd(trackModel, tagModel);
                $rootScope.$emit('trackSideMenuUpdate');

                //console.log('dataFactoryTrack updateLabels myTrackTag TOEGEVOEGD naam tag, xData.tags: ', trackModel.get('naam'), tagModel.get('tag'), trackModel.xData.tags);
              } else {
                //console.error('dataFactoryTrack updateLabels tracktag toevoegen tagModel NOT FOUND: ', dataFactoryTag.store);
              }
            }
          });
          //console.log('dataFactoryTrack reload updateLabels SUCCESS');
          /*
          var oud = '';
          loDash.each(trackModel.xData.tags, function (tag) {
            if (oud !== trackModel.get('naam')) {
              //console.log(' ');
            }
            //console.error('dataFcatoryTrack updateLabels xdata.tags: ', trackModel.get('naam'), tag.xData.get('tag'));
            oud = trackModel.get('naam');
          });
          */
          q.resolve();

        } else {
          //$rootScope.$emit('labelsTrackUpdate', { trackModel: trackModel });
          //console.log('dataFactoryTrack resultaat xData.tags: ', trackModel.xData.tags);

          //console.log('dataFactoryTrack reload updateLabels SUCCESS');
          q.resolve();

        }

      } else {
        //console.log('dataFactoryTrack reload updateLabels SUCCESS');
        q.resolve();
      }
      //} else {
      //console.log('dataFactoryTrack updateLabels DEBUGGING');
      //q.resolve();
      //}

      return q.promise;
    }
    //
    //  Na de load van alle Sporen wordt in ieder track bepaald of er nieuwe reacties zijn toegveoegd.
    //
    function updateReacties(trackModel) {

      //console.warn('dataFactoryTrack updateReacties naam: ', trackModel.get('naam'));

      var q = $q.defer();

      var trackId = trackModel.get('Id');

      var trackReacties = loDash.filter(dataFactoryTrackReactie.store, function (trackReactieModel) {
        return trackReactieModel.get('trackId') === trackId;
      });
      //console.log('dataFactoryTrack updateReacties trackReacties: ', trackReacties);
      if (trackReacties.length > 0) {
        //console.log('dataFactoryTrack updateReacties syncDown naam, trackId, trackReacties: ', trackModel.get('naam'), trackId, trackReacties);
        loDash.each(trackReacties, function (trackReactieModel) {
          //console.log('dataFactoryTrack updateReacties trackId, naam, reactie: ', trackId, trackModel.get('naam'), trackReactieModel.get('reactie'));
          var trackReactieId = trackReactieModel.get('Id');

          var trackReactieSupModel = loDash.find(dataFactoryTrackReactieSup.store, function (trackReactieSupModel) {
            return trackReactieSupModel.get('reactieId') === trackReactieId;
          });

          if (trackReactieSupModel) {

            trackReactieModel.xData = {};
            trackReactieModel.xData.tags = [];

            trackReactieModel.xData.sup = trackReactieSupModel;

            var xnew = trackReactieSupModel.get('xnew');

            if (xnew) {
              if (!virgin) {
                notificationsTrackReactie += 1;
              }
              var trackNieuwModel = loDash.find(dataFactoryTrack.nieuw, function (trackNieuwModel) {
                return trackNieuwModel.get('Id') === trackId;
              });
              if (!trackNieuwModel) {
                dataFactoryTrack.nieuw.push(trackModel);
                //console.log('dataFactoryTrack updateTrackxnew toegevoegd aan nieuw: ', dataFactoryTrack.nieuw);
              }
            } else {
              loDash.remove(dataFactoryTrack.nieuw, function (trackNieuwModel) {
                return trackNieuwModel.get('Id') === trackId;
              });
              //console.log('dataFactoryTrack updateTrack xnew verwijderd: ', dataFactoryTrack.nieuw);
            }
          } else {
            //console.log('dataFactoryTrack updateTrackreacties heeft nog geen trackReactieSupModel. Dus nieuw trackReactieSupModel aanmaken!!');

            trackReactieSupModel = new dataFactoryTrackReactieSup.Model();
            trackReactieSupModel.set('reactieId', trackReactieId);
            trackReactieSupModel.set('trackId', trackId);
            trackReactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            trackReactieSupModel.set('star', false);
            trackReactieSupModel.set('xnew', true);
            if (virgin) {
              trackReactieSupModel.set('xnew', false);
            }
            trackReactieSupModel.save().then(function () {

              //console.log('dataFactoryTrack updateReacties trackReactieSupModel CREATED.');

              trackReactieModel.xData = {};
              trackReactieModel.xData.tags = [];
              trackReactieModel.xData.sup = trackReactieSupModel;

              //console.log('dataFactoryTrack updateReacties trackReactieSupModel toegevoegd aan Reactie.');

              var trackSupModel = loDash.find(dataFactoryTrackSup.store, function (trackSupModel) {
                return trackSupModel.get('trackId') === trackId && trackSupModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
              });

              if (trackSupModel) {
                //console.log('dataFactoryTrack updateReacties trackSupModel gevonden: ', trackId, trackModel.get('naam'));
                trackModel.xData.sup = trackSupModel;

                var xnew = trackSupModel.get('xnew');
                var star = trackSupModel.get('star');
                //console.log('dataFactoryTrack updateTrack trackModel, trackModel.xData.sup UPDATE trackId: ', trackModel, trackModel.xData.sup, trackModel.xData.sup.get('trackId'));

                if (star) {
                  var trackStarModel = loDash.find(dataFactoryTrack.star, function (trackStarModel) {
                    return trackStarModel.get('Id') === trackId;
                  });
                  if (!trackStarModel) {
                    dataFactoryTrack.star.push(trackModel);
                    //console.log('dataFactoryTrack updateTrack star toegevoegd: ', dataFactoryTrack.star);
                  }
                } else {
                  loDash.remove(dataFactoryTrack.star, function (trackStarModel) {
                    return trackStarModel.get('Id') === trackId;
                  });
                  //console.log('dataFactoryTrack updateTrack star verwijderd: ', dataFactoryTrack.star);
                }

                //console.log('dataFactoryTrack updateTrack xnew: ', xnew);


                if (xnew) {
                  if (!virgin) {
                    notificationsTrack += 1;
                  }
                  var trackNieuwModel = loDash.find(dataFactoryTrack.nieuw, function (trackNieuwModel) {
                    return trackNieuwModel.get('Id') === trackId;
                  });
                  if (!trackNieuwModel) {
                    dataFactoryTrack.nieuw.push(trackModel);
                    //console.log('dataFactoryTrack updateTrackxnew toegevoegd aan nieuw: ', dataFactoryTrack.nieuw);
                  }
                } else {
                  loDash.remove(dataFactoryTrack.nieuw, function (trackNieuwModel) {
                    return trackNieuwModel.get('Id') === trackId;
                  });
                  //console.log('dataFactoryTrack updateTrack xnew verwijderd: ', dataFactoryTrack.nieuw);
                }


                //console.log('dataFactoryTrack reload updateSupModel SUCCESS');
                q.resolve();

                //console.log('dataFactoryTrack updateTrackList heeft nog geen supModel. Dus nieuw!! Id, naam: ', trackModel.get('Id'), trackModel.get('naam'));

                trackSupModel = new dataFactoryTrackSup.Model();
                trackSupModel.set('trackId', trackId);
                trackSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                trackSupModel.set('star', false);
                trackSupModel.set('xnew', true);
                if (virgin) {
                  trackSupModel.set('xnew', false);
                  //console.log('dataFactoryTrack updateTrack nieuwe trackenup niet als nieuw beschouwen. Gebruiker is maagd');
                }
                //console.log('dataFactoryTrack updateTrack nieuw trackSupModel: ', trackSupModel.get('trackId'));

                trackSupModel.save().then(function () {

                  //console.log('dataFactoryTrack updateTrack nieuw trackSupModel: ', trackSupModel);

                  trackModel.xData.sup = trackSupModel;

                  if (!virgin) {
                    notificationsTrack += 1;
                    var nieuwModel = loDash.find(dataFactoryTrack.nieuw, function (nieuwModel) {
                      return nieuwModel.get('Id') === trackId;
                    });
                    if (!nieuwModel) {
                      dataFactoryTrack.nieuw.push(trackModel);
                    }
                  } else {
                    //console.error('dataFactoryTrack updateTrack nieuwe trackenup notifications skipped. Gebruiker is maagd');
                  }
                  //console.log('dataFactoryTrack updateTrack nieuwe trackenup voor trackId NOT FOUND in TrackStore.nieuw: ', trackId, dataFactoryTrack.nieuw);

                  //console.log('dataFactoryTrack reload updateSupModel nieuwe track SUCCESS');
                  q.resolve();

                });
              }
            });
          }
        });
        //console.log('dataFactoryTrack reload updateReacties SUCCESS');
        q.resolve();
      } else {
        //console.log('dataFactoryTrack reload updateReacties SUCCESS');
        q.resolve();
      }

      return q.promise;
    }

    function initxData(trackModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      //console.log('initxData START: ', trackModel);

      if (!trackModel.xData) {
        trackModel.xData = {};
        //console.log('dataFactoryTrack updateTrack xData: ', trackModel.xData);
      }
      if (!trackModel.xData.pois) {
        trackModel.xData.pois = [];
        //console.log('dataFactoryTrack updateTrack xData.pois: ', trackModel.xData.pois);
      }
      if (!trackModel.xData.fotos) {
        trackModel.xData.fotos = [];
        //console.log('dataFactoryTrack updateTrack xData.fotos: ', trackModel.xData.fotos);
      }
      if (!trackModel.xData.tags) {
        trackModel.xData.tags = [];
        //console.log('dataFactoryTrack updateTrack xData.tags: ', trackModel.xData.tags);
      }
      if (!trackModel.xData.groep) {
        trackModel.xData.groep = '';
        //console.log('dataFactoryTrack updateTrack xData.groep: ', trackModel.xData.groep);
      }
      //console.log('initxData READY: ', trackModel.xData);
    }
    //
    
    //removeIf(!tracks)
    function getPois(trackModel, trackSupModel) {
 
      //console.log('dataFactoryTrack getPois: ', trackModel.get('Id'), trackModel.get('naam'), trackModel.get('pois'));
      var q = $q.defer();
      var trackId = trackModel.get('Id');
    
      if (trackModel.get('pois')) {
        dataFactoryTrackPoisFotos.getPois(trackId).then(function (result) {
          //console.log('dataFactoryTrack getPois naam result: ', trackModel.get('naam'), result);
          trackModel.xData.pois = result;
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('dataFactoryTrack getPois ERROR: ', err);
          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function getFotos(trackModel, trackSupModel) {
    
      //console.log('dataFactoryTrack getFotos: ', trackModel.get('Id'), trackModel.get('naam'), trackModel.get('fotos'));
      var q = $q.defer();
    
      if (trackModel.get('fotos')) {
        dataFactoryTrackPoisFotos.getFotos(trackModel.get('trackId')).then(function (result) {
    
          //console.log('dataFactoryTrack getFotos naam result: ', trackModel.get('naam'), result);
          trackModel.xData.fotos = result;
          q.resolve();
          // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('dataFactoryTrack getFotos ERROR: ', err);
          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function getPoisFotos(trackModel, trackSupModel) {
    
      var q = $q.defer();
      getPois(trackModel, trackSupModel).then(function () {
        getFotos(trackModel, trackSupModel).then(function () {
          q.resolve();
        });
      });
    
      return q.promise;
    }

    dataFactoryTrackPoisFotos.start(dataFactoryTrack);
    //endRemoveIf(!tracks)
    
    function updateSupModel(trackModel) {

      //console.log('dataFactoryTrack UpdateTrack: ', trackModel.get('naam'));

      var q = $q.defer();

      var trackId = trackModel.get('Id');
      var gebruikerId = dataFactoryCeo.currentModel.get('Id');

      var trackSupModel = loDash.find(dataFactoryTrackSup.store, function (trackSupModel) {
        return trackSupModel.get('trackId') === trackId && trackSupModel.get('gebruikerId') === gebruikerId;
      });

      //console.log('dataFactoryTrack UpdateSupModel trackSupModel: ', trackSupModel);
      if (trackSupModel) {

        trackModel.xData.sup = trackSupModel;

        var xnew = trackSupModel.get('xnew');
        var star = trackSupModel.get('star');
        //console.log('dataFactoryTrack updateTrack trackModel, trackModel.xData.sup UPDATE trackId: ', trackModel, trackModel.xData.sup, trackModel.xData.sup.get('trackId'));

        if (star) {
          var trackStarModel = loDash.find(dataFactoryTrack.star, function (trackStarModel) {
            return trackStarModel.get('Id') === trackId;
          });
          if (!trackStarModel) {
            dataFactoryTrack.star.push(trackModel);
            //console.log('dataFactoryTrack updateTrack star toegevoegd: ', dataFactoryTrack.star);
          }
        } else {
          loDash.remove(dataFactoryTrack.star, function (trackStarModel) {
            return trackStarModel.get('Id') === trackId;
          });
          //console.log('dataFactoryTrack updateTrack star verwijderd: ', dataFactoryTrack.star);
        }

        //console.log('dataFactoryTrack updateTrack xnew: ', xnew);


        if (xnew) {
          if (!virgin) {
            notificationsTrack += 1;
          }
          var trackNieuwModel = loDash.find(dataFactoryTrack.nieuw, function (trackNieuwModel) {
            return trackNieuwModel.get('Id') === trackId;
          });
          if (!trackNieuwModel) {
            dataFactoryTrack.nieuw.push(trackModel);
            //console.log('dataFactoryTrack updateTrackxnew toegevoegd aan nieuw: ', dataFactoryTrack.nieuw);
          }
        } else {
          loDash.remove(dataFactoryTrack.nieuw, function (trackNieuwModel) {
            return trackNieuwModel.get('Id') === trackId;
          });
          //console.log('dataFactoryTrack updateTrack xnew verwijderd: ', dataFactoryTrack.nieuw);
        }
        
        //removeIf(!tracks)
        //
        //  xData pois en fotos toevoegen
        //
        var poisfotosinterval = $interval(function() {
          //console.log('dataFactoryTrack waiting for dataFactoryTrackPoisFotos.loaded...: ', dataFactoryTrackPoisFotos.loaded);
          if (dataFactoryTrackPoisFotos.loaded) {
            $interval.cancel(poisfotosinterval);
            getPoisFotos(trackModel, trackSupModel).then(function () {
              //console.log('dataFactoryTrack getTracksFotos SUCCES: ', trackModel.xData.pois, trackModel.xData.fotos);
            }).catch(function() {
              //console.error('dataFactoryTrack getTracksFotos ERROR');
            });
          }
        }, 100, 500);
        //endRemoveIf(!tracks)
        
        //console.log('dataFactoryTrack reload updateSupModel SUCCESS');
        q.resolve();
      } else {

        //console.log('dataFactoryTrack updateTrackList heeft nog geen supModel. Dus nieuw!! Id, naam: ', trackModel.get('Id'), trackModel.get('naam'));

        trackSupModel = new dataFactoryTrackSup.Model();
        trackSupModel.set('trackId', trackId);
        trackSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        trackSupModel.set('star', false);
        trackSupModel.set('xnew', true);
        if (virgin) {
          trackSupModel.set('xnew', false);
          //console.log('dataFactoryTrack updateTrack nieuwe tracksup niet als nieuw beschouwen. Gebruiker is maagd');
        }
        //console.log('dataFactoryTrack updateTrack nieuw trackSupModel: ', trackSupModel.get('trackId'));

        trackSupModel.save().then(function () {

          //console.log('dataFactoryTrack updateTrack nieuw trackSupModel: ', trackSupModel);

          trackModel.xData.sup = trackSupModel;

          if (!virgin) {
            notificationsTrack += 1;
            var nieuwModel = loDash.find(dataFactoryTrack.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === trackId;
            });
            if (!nieuwModel) {
              dataFactoryTrack.nieuw.push(trackModel);
            }
          } else {
            //console.error('dataFactoryTrack updateTrack nieuwe tracksup notifications skipped. Gebruiker is maagd');
          }
          //console.log('dataFactoryTrack updateTrack nieuwe tracksup voor trackId NOT FOUND in TrackStore.nieuw: ', trackId, dataFactoryTrack.nieuw);

          //console.log('dataFactoryTrack reload updateSupModel nieuwe track SUCCESS');
          q.resolve();

        });

      }

      return q.promise;
    }

    //
    function updateTrack(trackModel, mode) {

      var q = $q.defer();

      //console.warn('dataFactoryTrack updateTrack track deletedOn, xprive, gebruikerId, naam : ', trackModel.get('deletedOn'), trackModel.get('xprive'), trackModel.get('gebruikerId'), trackModel.get('naam'));

      initxData(trackModel);

      var groepenId = trackModel.get('groepenId');
      //console.log('dataFactoryTrack updateTrack groepenId: ', groepenId);
      trackModel.xData.groep = '';
      if (groepenId !== '') {
        trackModel.xData.groep = 'Iedereen';

        var found = loDash.find(dataFactoryGroepen.store, function (groep) {
          return groep.get('Id') === groepenId;
        });
        if (found) {
          trackModel.xData.groep = found.get('groep');
          //console.log('dataFactoryTrack updateTrack xData.groep: ', trackModel.xData.groep);
        }
      }

      $q.all([
        updateLabels(trackModel),
        updateSupModel(trackModel),
        updateReacties(trackModel)
      ]).then(function () {
        //console.log('dataFactoryTrack reload updates SUCCESS');
        //return updateReacties(trackModel)
        watchUpdate(mode, trackModel);
        q.resolve();
      });


      trackModel.xData.pois = [];
      trackModel.xData.fotos = [];

      return q.promise;
    }
    //
    function watchUpdate(store) {

      //console.warn('dataFactoryTrack watchUpdate store: ', store);
      var reacties, nieuweReacties;

      var watch = loDash.find(watchSyncs, function (watch) {
        return watch.store === store;
      });
      if (watch) {
        watch.done = watch.done + 1;
      }
      if (store === 'trackReload') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryTrack watchUpdateTracksList RELOAD updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryTrack watchUpdate done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryTrack watchUpdateTracksList RELOAD READY store, done, todo, notificationsTrack, notificationsTrackReactie: ', store, watch.done, watch.todo, notificationsTrack, notificationsTrackReactie);
          //console.log('===============================================================================================================');
          //console.warn('dataFactoryTrack watchUpdate SUCCESS');

          if (notificationsTrack > 0 || notificationsTrackReactie > 0) {

            var tracksNieuw = [];
            var trackReactiesNieuw = [];

            tracksNieuw = loDash.filter(dataFactoryTrackSup.store, function (trackSup) {
              return trackSup.get('xnew');
            });

            trackReactiesNieuw = loDash.filter(dataFactoryTrackReactieSup.store, function (trackReactieSup) {
              return trackReactieSup.get('xnew');
            });

            //console.error('dataFactoryTrack watchUpdateTracksList naar composeNotification notificationsTrack, dataFactoryTrack.nieuw.length, notificationsTrackReactie, reacties.length: ', store, notificationsTrack, dataFactoryTrack.nieuw.length, notificationsTrackReactie, trackReactiesNieuw.length);

            if (tracksNieuw.length > 0 || trackReactiesNieuw.length > 0) {
              dataFactoryNotification.composeTitleBodyNotification(tracksNieuw.length, trackReactiesNieuw.length, 'track');
            }

            $timeout(function () {
              $rootScope.$emit('tracksFilter');
              $rootScope.$emit('tracksNieuweAantallen');
            }, 500);
          }
        }
      }
      if (store === 'trackRefresh') {
        //console.log('================================================================================================================');
        //console.log('dataFactoryTrack watchUpdateTracksList REFRESH updating store, done, todo: ', store, watch.done, watch.todo);
        //console.log('================================================================================================================');

        if (watch.done >= watch.todo) {

          //console.warn('dataFactoryTrack watchUpdateRefresh done store: ', store);
          //console.log('===============================================================================================================');
          //console.log('dataFactoryTrack watchUpdateTracksList REFRESH READY store, done, todo: ', store, watch.done, watch.todo);
          //console.log('dataFactoryTrack watchUpdateTracksList REFRESH READY store, notificationsTrack, notificationsTrackReactie: ', store, notificationsTrack, notificationsTrackReactie);
          //console.log('===============================================================================================================');

          if (notificationsTrack > 0 || notificationsTrackReactie > 0) {

            var tracksNieuw = [];
            var trackReactiesNieuw = [];

            tracksNieuw = loDash.filter(dataFactoryTrackSup.store, function (trackSup) {
              return trackSup.get('xnew');
            });

            trackReactiesNieuw = loDash.filter(dataFactoryTrackReactieSup.store, function (trackReactieSup) {
              return trackReactieSup.get('xnew');
            });

            //console.error('dataFactoryTrack watchUpdateTracksList naar composeNotification notificationsTrack, dataFactoryTrack.nieuw.length, notificationsTrackReactie, reacties.length: ', store, notificationsTrack, dataFactoryTrack.nieuw.length, notificationsTrackReactie, nieuweReacties.length);
            dataFactoryNotification.composeTitleBodyNotification(tracksNieuw.length, trackReactiesNieuw.length, 'track');
          }

          $rootScope.$emit('tracksFilter');
          $rootScope.$emit('tracksNieuweAantallen');
        }
      }
    }
    //
    function updateTracksList() {

      //console.warn('dataFactoryTrack updateTracksList');

      dataFactoryTrackSup.store = loDash.sortBy(dataFactoryTrackSup.store, 'changedOn');
      dataFactoryTrackSup.store = loDash.uniqBy(dataFactoryTrackSup.store, 'trackId');

      notificationsTrack = 0;
      notificationsTrackReactie = 0;

      todoTotal = 0;
      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'trackReload';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'trackReload';
        });
      }
      var watchSync = {
        store: 'trackReload',
        todo: dataFactoryTrack.store.length,
        done: 0
      };
      todoTotal = todoTotal + dataFactoryTrack.store.length;
      watchSyncs.push(watchSync);

      dataFactoryTrackSup.store = loDash.uniqBy(dataFactoryTrackSup.store, function (trackSup) {
        return trackSup.get('trackId');
      });
      //console.log('dataFactoryTrack TagStore: ', dataFactoryTag.store);
      //console.log('dataFactoryTrack trackStore: ', dataFactoryTrack.store);
      //console.log('dataFactoryTrack trackSupStore: ', dataFactoryTrackSup.store);
      //console.log('dataFactoryTrack TrackTagStore: ', dataFactoryTrackTag.store);
      if (dataFactoryTrack.store.length > 0) {

        var promises = [];

        loDash.each(dataFactoryTrack.store, function (trackModel) {
          //console.log('dataFactoryTrack updateTrackList trackModel loop');
          //console.log('dataFactoryTrack updateTrackList trackModel naam INITIAL UPDATE START: ', trackModel.get('naam'));
          promises.push(updateTrack(trackModel, 'trackReload'));
          //updateTrack(trackModel, 'trackReload').then(function () {
          //console.log('dataFactoryTrack updateTracksList naam INITIAL UPDATE SUCCES: ', trackModel.get('naam'));
          //});
        });
        promises.push(tracksCheckNieuwTooOld());
        $q.all(promises);
      }
    }
    //
    function updateTracksTodos(todos) {

      //console.clear();
      //console.warn('dataFactoryTrack updateTrackTodos: ', todos);

      var q = $q.defer();

      notificationsTrack = 0;
      notificationsTrackReactie = 0;

      todoTotal = 0;

      var found = loDash.find(watchSyncs, function (watch) {
        return watch.store === 'trackRefresh';
      });
      if (found) {
        loDash.remove(watchSyncs, function (watch) {
          return watch.store === 'trackRefresh';
        });
      }
      var watchSync = {
        store: 'trackRefresh',
        todo: todos.length,
        done: 0
      };
      todoTotal = todoTotal + todos.length;
      watchSyncs.push(watchSync);

      if (todos.length > 0) {

        var promises = [];
        //
        loDash.each(todos, function (trackId) {
          //loDash.each(dataFactoryTrack.store, function (trackModel) {
          //console.log(trackModel.get('Id'), trackModel.get('naam'), trackModel.get('xprive'), trackModel.get('gebruikerId'));
          //});
          var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
            return trackModel.get('Id') === trackId;
          });
          if (trackModel) {
            if (trackModel.get('deletedOn') > '1970-01-02 00:00:00' || (trackModel.get('xprive') === true && trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
              //console.log('dataFactoryTrack updateTracksTodos track naam REMOVE START: ', trackModel.get('naam'));
              promises.push(verwijderTrack(trackModel, 'trackRefresh', true));
            } else {
              //console.log('dataFactoryTrack updateTracksTodos track naam UPDATE START: ', trackModel.get('naam'));
              promises.push(updateTrack(trackModel, 'trackRefresh'));
            }
          } else {
            //console.error('dataFactoryTrack updateTrackTodos IS NOT trackModel: ', trackId);
            watchUpdate('trackRefresh', trackModel);
          }
        });
        $q.all(promises).then(function () {
          //console.error('updateTracksTodos all promises resolved');
          $rootScope.$emit('filter');
          $rootScope.$emit('tracksNieuweAantallen');

          q.resolve();
        });
      } else {
        q.resolve();
      }
      return q.promise;
    }
    //
    function tracksCheckNieuwTooOld() {

      //console.warn('dataFactoryTrack tracksCheckNieuwTooOld START');

      var q = $q.defer();
      var tooOld = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
      //var tooOld = moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      //console.log('dataFactoryTrack fotosCheckNieuwTooOld: ', tooOld);
      loDash.each(dataFactoryTrackSup.store, function (trackSupModel) {
        var publishDatum = trackSupModel.get('createdOn');
        var xnew = trackSupModel.get('xnew');
        var trackId = trackSupModel.get('trackId');
        if (xnew) {
          //console.log('dataFactoryTrack tracksCheckNieuwTooOld publishDatum if tooOld: ', publishDatum, tooOld, xnew, trackId);
          if (publishDatum < tooOld) {
            //console.error('dataFactoryTrack tracksCheckNieuwTooOld reset xnew');
            trackSupModel.set('xnew', false);
            trackSupModel.save();
            loDash.remove(dataFactoryTrack.nieuw, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });
            $rootScope.$emit('filter');
            $rootScope.$emit('tracksNieuweAantallen');

            //console.error('dataFactoryTrack tracksCheckNieuwTooOld updated SUCCESS');
          }
        }
      });
      q.resolve();
      return q.promise;
    }
    //
    function refresh() {

      //console.warn('dataFactoryTrack refresh start');
      //
      //  Tags opnieuw ophalen omdat de store leeg is na reload?!?!?!?
      //
      if (dataFactoryTag.store.length === 0) {
        dataFactoryTag.store = dataFactoryTrack.tags;
        //console.log('dataFactoryTrack Tag refresh restored: ', dataFactoryTrack.tags, dataFactoryTag.store);
      }
      if (virgin) {
        dataFactoryConfig.currentModel.set('virginTracks', false);
        dataFactoryConfigX.update(dataFactoryConfig.currentModel);
        //console.warn('dataFactoryTrack config reset virgin');
      }

      $q.all([
        dataFactoryTag.syncUp(),
        //removeIf(!tracks)
        dataFactoryGroepen.syncUp(),
        dataFactoryGroepdeelnemers.syncUp(),
        //endRemoveIf(!tracks)
        dataFactoryTrackReactieSup.syncUp(),
        dataFactoryTrackReactie.syncUp(),
        dataFactoryTrackTag.syncUp(),
        dataFactoryTrackSup.syncUp(),
        dataFactoryTrack.syncUp()
      ]).then(function () {
        dataFactoryTrack.syncDownAll().then(function (newSyncDate) {

          //console.log('refresh dataFactoryTrack newSyncDate: ', newSyncDate);

          if (newSyncDate !== null && newSyncDate !== undefined) {

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTrack, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackSup, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackTag, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackReactie, newSyncDate);
              dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackReactieSup, newSyncDate);
            }
            dataFactoryTag.lastSyncDate = newSyncDate;
            dataFactoryTrack.lastSyncDate = newSyncDate;
            dataFactoryTrackSup.lastSyncDate = newSyncDate;
            dataFactoryTrackTag.lastSyncDate = newSyncDate;
            dataFactoryTrackReactie.lastSyncDate = newSyncDate;
            dataFactoryTrackReactieSup.lastSyncDate = newSyncDate;

            //
            //console.log('dataFactoryTag refresh Tag todo: ', dataFactoryTag.todo);
            //console.log('dataFactoryTrack refresh Track todo: ', dataFactoryTrack.todo);
            //console.log('dataFactoryTrack refresh TrackSup todo: ', dataFactoryTrackSup.todo);
            //console.log('dataFactoryTrack refresh TrackTag todo: ', dataFactoryTrackTag.todo);
            //console.log('dataFactoryTrack refresh trackreactie todo: ', dataFactoryTrackReactie.todo);
            //
            todostmp = [...dataFactoryTrack.todo, ...dataFactoryTrackSup.todo, ...dataFactoryTrackTag.todo, ...dataFactoryTrackReactie.todo, ...dataFactoryTrackReactieSup.todo];
            uniqueSet = new Set(todostmp);
            todos = [...uniqueSet];

            if (todos.length > 0) {

              updateTracksTodos(todos).then(function () {

                //console.error('dataFactoryTrack refresh updateTracksTodos SUCCES');

                dataFactoryTag.todo = [];
                dataFactoryTrack.todo = [];
                dataFactoryTrackSup.todo = [];
                dataFactoryTrackTag.todo = [];
                dataFactoryTrackReactie.todo = [];
                //console.log('dataFactoryTrack refresh trackreactie Store: ', dataFactoryTrackReactie.store);
                //console.log('dataFactoryTrack refresh Track Store: ', dataFactoryTrack.store);
                //console.log('dataFactoryTrack refresh TrackSup Store: ', dataFactoryTrackSup.store);
                //console.log('dataFactoryTrack refresh TrackTag Store: ', dataFactoryTrackTag.store);
                //console.log('dataFactoryTrack refresh Tag.store: ', dataFactoryTag.store);
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

      //console.warn('dataFactoryTrack reload start');

      virgin = true;
      dataFactoryConfigX.loadMe().then(function () {
        virgin = dataFactoryConfig.currentModel.get('dataFactoryTrack virginTracks');
        //console.error('dataFactoryTrack VirginTracks FROM config DB: ', dataFactoryConfig.currentModel.get('virginTracks'));
        //console.error('dataFactoryTrack VirginTracks: ', virgin);
      });
      //console.log('dataFactoryTrack Wachten op dataFactoryConfig.currentModel');
      dataFactoryStore.storeInitAll(dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryTag, dataFactoryTrackReactie, dataFactoryTrackReactieSup).then(function (newSyncDate) {

        //console.error('dataFactoryTrack reload dataFactoryTrack newSyncDate: ', newSyncDate);

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTrack, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackSup, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackTag, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackReactie, newSyncDate);
          dataFactorySyncFS.updateLastSyncDate(dataFactoryTrackReactieSup, newSyncDate);
        }
        dataFactoryTag.lastSyncDate = newSyncDate;
        dataFactoryTrack.lastSyncDate = newSyncDate;
        dataFactoryTrackSup.lastSyncDate = newSyncDate;
        dataFactoryTrackTag.lastSyncDate = newSyncDate;
        dataFactoryTrackReactie.lastSyncDate = newSyncDate;
        dataFactoryTrackReactieSup.lastSyncDate = newSyncDate;

        dataFactoryTag.loaded = true;
        dataFactoryTrack.loaded = true;
        dataFactoryTrackSup.loaded = true;
        dataFactoryTrackTag.loaded = true;
        dataFactoryTrackReactie.loaded = true;
        dataFactoryTrackReactieSup.loaded = true;

        //removeIf(!tracks)
        dataFactoryTrackPoisFotos.trackStoreReady = true;
        //dataFactoryTrackPoisFotos.init().then(function () {
        //console.log('dataFactoryTrack TrackPoisFotos.init SUCCESS');
        //});
        //endRemoveIf(!tracks)
        //console.log('dataFactoryTrack reload wachten op Tag, Blacklist, Groepen en Groepdeelnemers');
        var interval = $interval(function () {

          //console.log('dataFactoryTrack reload wachten op globalStores loaded: ', dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded);
          //if (dataFactoryTag.loaded && dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
          if (dataFactoryBlacklist.loaded && dataFactoryGroepen.loaded && dataFactoryGroepdeelnemers.loaded) {
            $interval.cancel(interval);
            //console.error('dataFactoryTrack reload SUCCESS');
            dataFactoryTag.todo = [];
            dataFactoryTrack.todo = [];
            dataFactoryTrackSup.todo = [];
            dataFactoryTrackTag.todo = [];
            dataFactoryTrackReactie.todo = [];
            dataFactoryTrackReactieSup.todo = [];

            //console.time('dataFactoryTrack-reloadUpdateTracksList');
            $rootScope.$emit('dataFactoryTrack tracksFilter');
            dataFactoryTag.reStore().then(function () {
              dataFactoryTrack.tags = dataFactoryTag.store;
              //console.log('dataFactoryTrack Tag reload restored: ', dataFactoryTag.store);
              updateTracksList();
              dataFactoryTrack.tags = dataFactoryTag.store;
              dataFactoryTrack.verrijkt = true;
            });
            //console.warn('dataFactoryTrack reload updateStores SUCCES');
            if (+ceo.profielId === 4 || +ceo.profielId === 5) {
              //console.error('dataFactoryTrack reload started => refresh');
              $rootScope.$emit('tracksFilter');
              $rootScope.$emit('tracksNieuweAantallen');

              dataFactoryClock.startClockTrackSlow(function () {
                refresh();
              });
            }
          }
        }, 50, 50);
      });
    }
    //
    $rootScope.$on('reloadTrack', function () {
      //console.log('dataFactoryTrack reloadTrack event');
      reload();
    });
    //
    $rootScope.$on('refreshTrack', function () {
      //console.log('dataFactoryTrack refreshTrack event');
      refresh();
    });
    //
    $rootScope.$on('sleepClockTrack', function () {
      //console.debug('dataFactoryPoi sleepClockTrack event');
      dataFactoryClock.startClockTrackSlow(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('startClockTrack', function () {
      //console.debug('dataFactoryPoi startClockTrack event');
      dataFactoryClock.startClockTrackFast(function () {
        refresh();
      });
    });
    //
    $rootScope.$on('stopClockTrack', function () {
      //console.debug('dataFactoryPoi stopClockTrack event');
      dataFactoryClock.stopClockTrack();
    });
    //
    //removeIf(!tracken)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryTrack waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 500);
    //endRemoveIf(!tracken)
    //removeIf(!tracks)
    $timeout(function () {
      var teller = 0;
      var startInterval = $interval(function () {
        teller += 1;
        //console.log('dataFactoryTrack waiting for Ceo.... ', teller);
        if (!angular.equals(dataFactoryCeo, {})) {
          $interval.cancel(startInterval);
          reload();
        }
      }, 100, 200);
    }, 1000);
    //endRemoveIf(!tracks)

    return dataFactoryTrack;
  }]);
