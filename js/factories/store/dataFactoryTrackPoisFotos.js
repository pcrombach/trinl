
/* eslint-disable no-unused-vars */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryTrackPoisFotos', ['loDash', '$timeout', '$interval', '$q', 'dataFactoryProxy', 'dataFactoryPoi', 'dataFactoryFoto',
  function (loDash, $timeout, $interval, $q, dataFactoryProxy, dataFactoryPoi, dataFactoryFoto) {

    //console.warn('dataFactoryTrackPoisFotos');

    var dataFactoryTrackPoisFotos = {};
    var me = dataFactoryTrackPoisFotos;
    //
    // Store with objects (trackId, pois, fotos)
    //
    me.data = [];
    me.loaded = false;
    me.trackStoreReady = false;
    //
    // Load poiss from backend
    //
    function updatePoisForTrackId(trackModel) {

      var q = $q.defer();

      //console.warn('dataFactoryTrackPoisFotos updatePoisForTrackId trackModel: ', trackModel, trackModel.fotos.value, trackModel.pois.value);

      if (trackModel.get('pois')) {

        var store = {
          storeId: 'poi'
        };
        var params = {
          trackId: trackModel.get('Id')
        };

        dataFactoryProxy.http(store, 'GET', 'loadPoisForTrackId', params).then(function (result) {
          //console.warn('POI loadPoisForTrackId  SUCCESS: ', result);
          var poiModels = [];
          loDash.each(result.results, function (poi) {
            var poiModel = new dataFactoryPoi.Model(poi);
            poiModels.push(poiModel);
          });
          q.resolve(poiModels);
        }).catch(function (err) {
          //console.error('POI loadPoisForTrackId ERROR: ', err);
          q.reject('dataFactoryTrackPoisFotos loadPoisForTrackId ERROR: ' + err);
        });
      } else {
        //console.log('Parameters in trackModel fotos, pois: ', trackModel.get('fotos'), trackModel.get('pois'));
        q.reject('Parameters in trackModel fotos, pois: ', trackModel.get('fotos'), trackModel.get('pois'));
      }

      return q.promise;
    }
    //
    // Load fotos from backend
    //
    function updateFotosForTrackId(trackModel) {

      var q = $q.defer();

      //console.warn('dataFactoryTrackPoisFotos updateFotosForTrackId trackModel: ', trackModel);

      if (trackModel.get('fotos')) {

        var store = {
          storeId: 'foto'
        };
        var params = {
          trackId: trackModel.get('Id')
        };

        dataFactoryProxy.http(store, 'GET', 'loadFotosForTrackId', params).then(function (result) {
          //console.warn('POI loadFotosForTrackId  SUCCESS: ', result);
          var fotoModels = [];
          loDash.each(result.results, function (foto) {
            var fotoModel = new dataFactoryFoto.Model(foto);
            fotoModels.push(fotoModel);
          });
          q.resolve(fotoModels);
        }).catch(function (err) {
          //console.error('dataFactoryTrackPoisFotos updateFotosForTrackId loadFotosForTrackId ERROR: ', err);
          q.reject();
        });
      } else {
        q.reject();
      }

      return q.promise;
    }
    //
    // zoek pois obv trackId in me.data
    //
    me.getPois = function (trackId) {

      var q = $q.defer();

      var intervalPois = $interval(function () {

        if (me.loaded) {

          $interval.cancel(intervalPois);

          //console.warn('dataFactoryTrackPoisFotos getPois loaded: ', me.loaded);
          //console.table(me.data);

          var result = loDash.find(me.data, function (idPois) {
            return idPois.trackId === trackId;
          });
          if (result) {
            //console.warn('dataFactoryTrackPoisFotos getPois naam: ', result.naam);
            //console.warn('dataFactoryTrackPoisFotos getPois result.pois: ', result.pois);
            q.resolve(result.pois);
          } else {
            q.resolve([]);
          }
        }
      }, 100, 200);

      return q.promise;

    };
    //
    // zoek fotos obv trackId in me.data
    //
    me.getFotos = function (trackId) {

      var q = $q.defer();

      var intervalFotos = $interval(function () {

        if (me.loaded) {

          $interval.cancel(intervalFotos);

          //console.warn('dataFactoryTrackPoisFotos getFotos loaded: ', me.loaded);
          //console.table(me.data);

          var result = loDash.find(me.data, function (idFotos) {
            return idFotos.trackId === trackId;
          });
          if (result) {
            //console.warn('dataFactoryTrackPoisFotos getFotos naam: ', result.naam);
            //console.warn('dataFactoryTrackPoisFotos getFotos result.fotos: ', result.fotos);
            q.resolve(result.fotos);
          } else {
            q.resolve([]);
          }
        }
      }, 100, 200);

      return q.promise;

    };
    //
    // Load fotos from backend
    //
    me.load = function (dataFactoryTrack) {

      var q = $q.defer();

      //console.warn('dataFactoryTrackPoisFotos load trackStoreReady: ', me.trackStoreReady);

      var interval = $interval(function () {

        //console.log('dataFactoryTrackPoisFotos waiting for store: ', dataFactoryTrack);

        if (me.trackStoreReady) {
          $interval.cancel(interval);

          //console.warn('dataFactoryTrackPoisFotos tracks: ', dataFactoryTrack.store);
          //console.table(dataFactoryTrack.store);

          var todo = dataFactoryTrack.store.length;
          var done = 0;

          loDash.each(dataFactoryTrack.store, async function (trackModel) {

            if (trackModel.get('pois')) {
              //console.warn('dataFactoryTrackPoisFotos naam, trackId: ', trackModel.get('naam'), trackModel.get('Id'));
              var poiModels = await updatePoisForTrackId(trackModel);

              //console.log('dataFactoryTrackPoisFotos load pois: ', poiModels);
              //console.table(poiModels);

              if (poiModels.length > 0) {
                //
                //  Kijk of er een me.data is met trackId
                //  Niet dan een nieuwe pushen met deze pois
                //  zoja deze pois updaten in de bestaande me.data.
                var found = loDash.find(me.data, function (dat) {
                  return dat.trackId === trackModel.get('Id');
                });
                if (found) {
                  //console.log('dataFactoryTrackPoisFotos update pois : ', found, poiModels);
                  found.pois = poiModels;
                  //console.table(me.data);
                } else {
                  var data = {
                    naam: trackModel.get('naam'),
                    trackId: trackModel.get('Id'),
                    pois: poiModels,
                    fotos: []
                  };

                  //console.log('dataFactoryTrackPoisFotos push nieuwe data : ', data);
                  me.data.push(data)
                  //console.table(me.data);
                }
              } else {
                //console.log('dataFactoryTrackPoisFotos RESET pois');
                trackModel.set('pois', false);
                trackModel.save();
              }
            }

            if (trackModel.get('fotos')) {
              var fotoModels = await updateFotosForTrackId(trackModel);

              //console.log('dataFactoryTrackPoisFotos load fotos: ', fotoModels);
              //console.table(fotoModels);
              if (fotoModels.length > 0) {
                //  Kijk of er een me.data is met trackId
                //  Niet dan een nieuwe pushen met deze fotos
                //  zoja deze fotos updaten in de bestaande me.data.
                var found = loDash.find(me.data, function (dat) {
                  return dat.trackId === trackModel.get('Id');
                });
                if (found) {
                  //console.log('dataFactoryTrackPoisFotos update fotos : ', found, fotoModels);
                  found.fotos = fotoModels;
                  //console.table(me.data);
                } else {
                  var data = {
                    naam: trackModel.get('naam'),
                    trackId: trackModel.get('Id'),
                    pois: [],
                    fotos: fotoModels
                  };

                  //console.log('dataFactoryTrackPoisFotos push nieuwe data : ', data);
                  me.data.push(data)
                  //console.table(me.data);
                }
              } else {
                //console.log('dataFactoryTrackPoisFotos RESET fotos');
                trackModel.set('fotos', false);
                trackModel.save();
              }
            }

            done += 1;
            //console.error('dataFactoryTrackPoisFotos todo, done: ', todo, done);
            if (done >= todo) {
              //console.table(me.data);
              q.resolve(me.data);
            }
          });
        }
      }, 100, 100);

      return q.promise;
    };

    me.init = function (dataFactoryTrack) {

      var q = $q.defer();
      //console.table('dataFactoryTrackPoisFotos init');
      if (!me.loaded) {
        me.load(dataFactoryTrack).then(function () {
          //loDash.remove(me.data, function (poisfotos) {
          //return poisfotos.pois.length === 0 && poisfotos.fotos.length === 0;
          //});
          //console.warn('dataFactoryTrackPoisFotos loaded SUCCESS: ', me.data);
          //console.table(me.data);
          me.loaded = true;
          q.resolve();
        }).catch(function (err) {
          //console.error('dataFactoryTrackPoisFotos allready LOADED');
        });
      } else {
        q.resolve(me.data);
      }
      return q.promise;
    };

    me.start = function (dataFactoryTrack) {

      //console.error('trackspoisfotos start dataFactoryTrack: ', dataFactoryTrack);
      var interval = $interval(function () {
        //console.count('dataFactoryTrackPoisFotos waiting for tracks loaded');
        if (dataFactoryTrack.loaded) {
          $interval.cancel(interval);
          me.trackStoreReady = true;
          me.init(dataFactoryTrack).then(function () {
            //console.table(me.data);
            //console.log('trackspoisfotos init SUCCESS');
          });
        }
      }, 100, 200);

    };

    return dataFactoryTrackPoisFotos;
  }
]);