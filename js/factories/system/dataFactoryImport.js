/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryImport', ['BASE', 'loDash', 'dataFactoryAlive', 'dataFactoryFoto', 'dataFactoryFotoSup', 'dataFactoryFotoTag', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryTag', 'dataFactoryTrack', 'dataFactoryTrackSup', 'dataFactoryTrackTag', 'dataFactoryCeo', '$rootScope', '$location', '$ionicPlatform', '$q', '$http',
  function (BASE, loDash, dataFactoryAlive, dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTag, dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryCeo, $rootScope, $location, $ionicPlatform, $q, $http) {

    //console.log('dataFactoryImport');


    var dataFactoryImport = {};

    var overlay;

    var urlBase = 'https://www.pcmatic.nl/';

    if ($location.$$host === '') {
      urlBase = BASE.URL;
    }
    if ($location.$$host === 'localhost') {
      urlBase = 'http://localhost/trinl/';
    }
    if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
      urlBase = 'https://www.trinl.nl/';
    }
    if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
      urlBase = 'https://www.pcmatic.nl/';
    }

    console.error('dataFactoryImport urlBase: ', urlBase);

    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }

    });

    var gebruikerId = localStorage.getItem('authentication_id');

    //console.error('Import gebruikerId: ', gebruikerId);

    importeer('Waterwandeling Eys', ['Duiker en Wittemermolen', 'Eyserbeek', 'Bruggetje', 'Bospad', 'Geul', 'Kalkgrasland', 'Cartils', 'Kasteel Cartils', 'Meetgoot', 'Miljoenenlijntje', 'Tunnel', 'Warm bronwater']);
    //	importeer('Waterwandeling Itteren', ['Dijk', 'Kademuur Maas', 'Kapelletje', 'Kasteelhoeve', 'Onverhard Pad', 'Pomp', 'Putdeksels']);
    //	importeer('Waterwandeling Watervalderbeek', ['Beekdallandschap', 'Bronnen', 'Kademuur', 'Maretak', 'Natuurlijke Beek', 'Onkluisde Watervalderbeek', 'Overzicht', 'Regenbuffer', 'Watervalderbeek Ondergronds']);
    //	importeer('Waterwandeling Worm', ['Bocht in rivier', 'Brug', 'Huis Duitsland', 'Overhangende boom', 'Overzicht Landschap', 'Snel stromend water', 'Waterzuivering']);
    //  importeer('Grenspalen Limburg', []);

    function importeer(naamProject, fotos) {

      //console.warn('Import importeer naamProject, fotos: ', naamProject, fotos);

      var folder = naamProject.replace(/ /g, '_') + '/';
      var loopcounter = 0;
      var WaterwandelingUrl = urlBase + 'import/' + folder + folder + 'WP.geojson';

      //console.log('Waterwandeling URL WP.geojson: ', WaterwandelingUrl);

      var avatar;
      var tagId;
      var trackId;
      var trackModel;
      var lat;
      var lng;

      if (dataFactoryAlive.status === 0) {
        dataFactoryAlive.status = 4;
      }
      //
      // folder is de naamProject zonder spaties.
      // Foto's en Tracks moeten geupload worden naar '<tracks | fotos>/<gebruikerId>/<folder>'
      // De input voor deze import wordt gehaald uit '<tracks | fotos>/<gebruikerId>/<folder>'
      // Deze foto | track wordt in foto en trackModel geplaatst in folder. De <baseURL>/<fotos | tracks> worden in de app toegevoegd
      //
      function onEachTrackFeature(feature, layer) {

        //console.clear();
        //console.warn('Waterwandeling feature name: ', feature.properties.name);

        feature.properties.name = feature.properties.name.replace('?', '');
        loopcounter = loopcounter + 1;
        if (loopcounter === 1) {
          lat = feature.geometry.coordinates[1];
          lng = feature.geometry.coordinates[0];
          trackModel.set('lat', lat);
          trackModel.set('lng', lng);
          trackModel.save();

        }
        //console.warn('Waterwandeling waypoint: ', feature, layer);

        if (gebruikerId !== undefined) {

          (function (feature2) {

            var lat = feature2.geometry.coordinates[1];
            var lng = feature2.geometry.coordinates[0];
            var tekst = feature2.properties.desc;
            var artikelNaam = feature2.properties.name;
            var naam = artikelNaam;
            var found = loDash.find(fotos, function (fotoNaam) {

              //console.error(fotoNaam, naam);

              return fotoNaam === naam;
            });

            naam = naam.replace(/ /g, '_');

            if (found) {
              var fotoModel = new dataFactoryFoto.Model();
              fotoModel.set('gebruikerId', gebruikerId);
              fotoModel.set('avatar', avatar);
              fotoModel.set('naam', artikelNaam);
              fotoModel.set('tekst', tekst);
              fotoModel.set('trackId', trackId);
              fotoModel.set('lat', lat);
              fotoModel.set('lng', lng);
              fotoModel.set('fotoId', naam);
              fotoModel.set('folder', folder);
              fotoModel.set('extension', 'jpg');
              fotoModel.set('xprive', true);
              fotoModel.set('yprive', false);
              fotoModel.save().then(function (newFotoModel) {

                //console.log('dataFactoryImport fotoModel save SUCCESS: ', newFotoModel);

                var fotoId = newFotoModel.get('Id');

                var fotosupModel = new dataFactoryFotoSup.Model();
                fotosupModel.set('gebruikerId', gebruikerId);
                fotosupModel.set('fotoId', fotoId);
                fotosupModel.set('xnew', false);
                fotosupModel.save();

                var fototagModel = new dataFactoryFotoTag.Model();
                fototagModel.set('gebruikerId', gebruikerId);
                fototagModel.set('fotoId', fotoId);
                fototagModel.set('tagId', tagId);
                fototagModel.save();

              }, function (err) {

                console.error('dataFactoryImport foto SAVE ERROR: ', err);

              });
            } else {
              var poiModel = new dataFactoryPoi.Model();
              poiModel.set('lat', lat);
              poiModel.set('lng', lng);
              poiModel.set('trackId', trackId);
              poiModel.set('gebruikerId', gebruikerId);
              poiModel.set('avatar', avatar);
              poiModel.set('naam', artikelNaam);
              poiModel.set('tekst', tekst);
              poiModel.set('fotoId', '');
              poiModel.set('poiId', '');
              poiModel.set('trackId', '');
              poiModel.set('folder', folder);
              poiModel.set('xprive', true);
              poiModel.set('yprive', false);
              poiModel.save().then(function (newPoiModel) {

                //console.log('dataFactoryImport poiModel save SUCCESS: ', newPoiModel);
                /*
                              var poi = loDash.mapValues(poiModel, 'value');
                              poi._id = poi.Id;
                              delete poi.Id;
                //console.log('Import put poi pouchdb: ', poi);

                              poiDB.put(poi).then( function(result) {
                //console.log('Import put poi pouchdb: ', result);
                              }, function(err) {
                //console.error('Import put poi pouchdb: ', err);
                              });
                */
                var poiId = newPoiModel.get('Id');

                var poisupModel = new dataFactoryPoiSup.Model();
                poisupModel.set('gebruikerId', gebruikerId);
                poisupModel.set('poiId', poiId);
                poisupModel.set('xnew', false);
                poisupModel.save().then(function () {
                  /*
                                  var poisup = loDash.mapValues(poisupModel, 'value');
                                  poisup._id = poisup.Id;
                                  delete poisup.Id;
                  //console.log('Import put poisup pouchdb: ', poisup);

                                  poisupDB.put(poisup).then( function(result) {
                  //console.log('Import put poisup pouchdb: ', result);
                                  }, function(err) {
                  //console.error('Import put poisup pouchdb: ', err);
                                  });
                  */
                });

                var poitagModel = new dataFactoryPoiTag.Model();
                poitagModel.set('gebruikerId', gebruikerId);
                poitagModel.set('poiId', poiId);
                poitagModel.set('tagId', tagId);
                poitagModel.save().then(function () {
                  /*
                                  var poitag = loDash.mapValues(poitagModel, 'value');
                                  poitag._id = poitag.Id;
                                  delete poitag.Id;
                  //console.log('Import put poitag pouchdb: ', poitag);

                                  poitagDB.put(poitag).then( function(result) {
                  //console.log('Import put poitag pouchdb: ', result);
                                  }, function(err) {
                  //console.error('Import put poitag pouchdb: ', err);
                                  });
                  */
                });

              }, function (err) {

                console.error('dataFactoryImport poi SAVE ERROR: ', err);

              });
            }

          })(feature);
          if (feature.properties && feature.properties.name) {
            layer.bindLabel(feature.properties.name, {
              offset: [22, -7],
              noHide: true
            });
          }
        }
      }

      function loadOverlayTrack() {
        var q = $q.defer();

        $http.get(WaterwandelingUrl)
          .success(function (layer) {
            overlay = L.geoJson(layer, {
              onEachFeature: onEachTrackFeature,
              transparent: true
            });

            //console.error('Loading track SUCCESS');
            q.resolve(overlay);
          })
          .error(function (err) {
            //console.error('Loading track ERROR: ', err);
            q.reject(err);
          });

        return q.promise;
      }
      //
      // Wacht tot we alle stores in FSCache hebben
      //

      $rootScope.$on('DataStoresInit', function () {

        //console.error('Import importeer onStoresInit');

        avatar = dataFactoryCeo.currentModel.set('avatar');

        //console.log('Waterwandeling avatar: ', avatar);

        if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

          var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
            return tagModel.get('tag') === naamProject;
          });
          if (tagModel) {
            tagId = tagModel.get('Id');
          } else {
            tagModel = new dataFactoryTag.Model();
            tagModel.set('tag', naamProject);
            tagModel.set('gebruikerId', gebruikerId);
            tagModel.set('xprive', false);
            tagModel.set('yprive', false);
            tagModel.save().then(function () {
              tagId = tagModel.get('Id');
            });
          }
          //console.error('tagId: ', tagId);
          trackModel = new dataFactoryTrack.Model();
          trackModel.set('avatar', avatar);
          trackModel.set('gebruikerId', gebruikerId);
          trackModel.set('naam', naamProject);
          trackModel.set('tekst', 'Waterwandeling geconverteerd van .gpx naar .geojson. De waypoints zijn geconverteerd naar locaties en de fotos geconverteerd naar fotos in TRINL.');
          trackModel.set('fotoId', '');
          trackModel.set('fotoId', '');
          trackModel.set('trackId', folder);
          trackModel.set('folder', folder);
          trackModel.set('xprive', true);
          trackModel.set('yprive', false);
          trackModel.save().then(function (newTrackModel) {
            trackId = newTrackModel.get('Id');

            var tracksupModel = new dataFactoryTrackSup.Model();
            tracksupModel.set('gebruikerId', gebruikerId);
            tracksupModel.set('trackId', trackId);
            tracksupModel.set('xnew', false);
            tracksupModel.save();

            var tracktagModel = new dataFactoryTrackTag.Model();
            tracktagModel.set('gebruikerId', gebruikerId);
            tracktagModel.set('trackId', trackId);
            tracktagModel.set('tagId', tagId);
            tracktagModel.save().then(function () {
              loadOverlayTrack().then(function (layer) {
                dataFactoryImport.waterwandeling = layer;
              });
              //console.log('dataFactoryImport tracktagModel save SUCCESS: ', tracktagModel);
            }, function (err) {
              console.error('dataFactoryImport tracktag SAVE ERROR: ', err);
            });
          });
        }
      });

    }

    return dataFactoryImport;

  }
]);
