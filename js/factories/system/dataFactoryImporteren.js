/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryImporteren', ['loDash', '$window', '$rootScope', '$state', '$q', '$interval', '$timeout', '$ionicLoading', '$ionicPopup', 'dataFactoryTag', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryTrack', 'dataFactoryTrackSup', 'dataFactoryFoto', 'dataFactoryFotoSup', 'dataFactoryFotoTag', 'dataFactoryCeo', 'dataFactorySyncFS', 'dataFactoryDropbox', 'dataFactoryTrackPoisFotos',
  function (loDash, $window, $rootScope, $state, $q, $interval, $timeout, $ionicLoading, $ionicPopup, dataFactoryTag, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTrack, dataFactoryTrackSup, dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryCeo, dataFactorySyncFS, dataFactoryDropbox, dataFactoryTrackPoisFotos) {

    //console.warn('dataFactoryImporteren');

    var dataFactoryImporteren = {};

    var aantalImports = 0;
    var importsDone = 0;
    var fileNaam = '';
    var name = '';
    var trackId = '';
    var tags, nieuwTag;
    var trackModel;

    dataFactoryImporteren.doImporterenLocaties = function (geojson, fileNaam, tagId) {

      //console.log('dataFactoryImporteren doImporterenLocaties');
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Importeren Locaties<br><br><span class="trinl-rood"><b>' + name + '</b></span><br><br>Een ogenblik geduld aub...'
      });
      var poiModel;

      //
      // Speciaal: We wachten op een trackid. DezetrackId wordt aangemaakt door importeren Sporen.
      // Dit is alleen het geval als er sprake is van een import met Spoor en Locaties.
      // Als de import alleen Locaties zijn dan wordt trackId = 'dummy';
      //
      loDash.each(geojson.features, function (feature) {

        var featurenaam = '';

        if (feature.properties.name) {
          featurenaam = feature.properties.name;
        } else {
          featurenaam = fileNaam;
        }

        var featuretekst = '';
        if (feature.properties.desc) {
          featuretekst = feature.properties.desc;
        }
        //console.log('dataFactoryImporteren featurenaam, featuredesc: ', featurenaam, featuretekst);

        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        //console.log('dataFactoryImporteren locatie lat, lng: ', lat, lng);
        //console.log('dataFactoryImporteren locatie lat, lng: ', lat, lng);
        poiModel = new dataFactoryPoi.Model();
        poiModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        poiModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        poiModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        poiModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        poiModel.set('avatarColor', tmp[0]);
        poiModel.set('avatarLetter', tmp[1]);
        poiModel.set('avatarInverse', tmp[2]);
        poiModel.set('naam', featurenaam);
        poiModel.set('tekst', featuretekst);
        poiModel.set('trackId', trackId);
        poiModel.set('lat', lat);
        poiModel.set('lng', lng);
        poiModel.set('xprive', true);
        poiModel.set('yprive', false);

        //console.log('dataFactoryImporteren nieuwe POI: ', poiModel);

        poiModel.save().then(function (poiModel) {

          var poiId = poiModel.get('Id');

          var poisupModel = new dataFactoryPoiSup.Model();
          poisupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          poisupModel.set('poiId', poiId);
          poisupModel.set('xnew', false);
          poisupModel.save().then(function () {

            //console.log('dataFactoryImporteren nieuwe POISUP: ', poisupModel);

            var found = loDash.find(dataFactoryPoiTag.store, function (poiTagModel) {
              return poiTagModel.get('poiId') === poiId && poiTagModel.get('tagId') === tagId;
            });

            if (!found) {
              var poiTagModel = new dataFactoryPoiTag.Model();
              poiTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
              poiTagModel.set('poiId', poiId);
              poiTagModel.set('tagId', tagId);
              poiTagModel.set('xprive', true);
              poiTagModel.save().then(function () {

                //console.log('dataFactoryImporteren nieuwe POITAG: ', poiTagModel);

                var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                  return tagModel.get('Id') === tagId;
                });

                if (tagModel) {

                  //console.log('PoisCtrl updateLabels voeg label toe aan poiModel: ', tagModel.get('tag'), poiModel.get('naam'));

                  if (!poiModel.xData) {
                    poiModel.xData = {};
                  }
                  if (!poiModel.xData.tags) {
                    poiModel.xData.tags = [];
                  }
                  poiTagModel.xData = tagModel;
                  poiModel.xData.tags.push(poiTagModel);

                  dataFactoryImporteren.tagsAdd(poiModel, poiTagModel);
                }
              });
            } else {

              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === found.tagId;
              });

              if (tagModel) {
                found.xData = tagModel;
                dataFactoryImporteren.tagsAdd(poiModel, found);
              }
            }
          });
        });
      });
      dataFactoryImporteren.closeImporteren('pois');
    };

    // eslint-disable-next-line no-unused-vars
    function kopieerFotoFile(oldFotoId, fotoId, fileNaam) {

      console.log('TrackDropboxCtrl downloadFile folderPath: ', '/Fotos/' + oldFotoId);

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Foto....<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
      });
      dataFactoryDropbox.login().then(function () {

        // eslint-disable-next-line no-unused-vars
        dataFactoryDropbox.download('/Fotos/' + oldFotoId + '.b64').then(function (downloadresult) {
          console.log('Importeren downloadFotoFile: ', downloadresult);

          //dataFactorySyncFS.upLoadFotoB64(fotoId + '.b64', downloadresult.data);

          //var image = new Image();
          //image.src = 'data:image/jpg;base64,' + downloadresult.data;
          //console.log('Importeren image: ', image);

          //dataFactorySyncFS.upLoadFoto(image);

          var base64String = downloadresult.data.replace('data:image/jpg;base64,', '');

          var binaryImg = $window.atob(base64String);
          var length = binaryImg.length;
          var ab = new ArrayBuffer(length);
          var ua = new Uint8Array(ab);
          for (var i = 0; i < length; i++) {
            ua[i] = binaryImg.charCodeAt(i);
          }

          console.log('Importeren image: ', ab);
          dataFactorySyncFS.upLoadFotoImage(fotoId + '.jpg', ab);

          $ionicLoading.hide();

        });
      }).catch(function (err) {
        console.error('FotoDropboxCtrl login ERROR: ', err);
      });
    }

    // eslint-disable-next-line no-unused-vars
    dataFactoryImporteren.doImporterenFotos = function (geojson, fileNaam, tagId) {

      console.log('dataFactoryImporteren doImporterenFotos');
      //$ionicLoading.show({
      //template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Importeren Fotos<br><br><span class="trinl-rood"><b>' + name + '</b></span><br><br>Een ogenblik geduld aub...'
      //});
      var fotoModel;
      /*
      var Geoposition = {};
      Geoposition.type = 'FeatureCollection';
      Geoposition.features = [];
      var options = {
        creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
      };
      */
      loDash.each(geojson.features, function (feature) {

        console.log('Foto Importeren geojson feature: ', JSON.stringify(feature));

        var name = '';
        var featurenaam = '';
        var fotoId = ''; // geimporteerde fotoId (nieuw fotoModel)
        var oldFotoId = ''; // verwijzing naar de .b64 in Dropbox

        if (feature.properties.name) {
          name = feature.properties.name;
          var extension = 'jpg';
          console.log('dataFactoryImporteren fotoId: ', fotoId);
          featurenaam = name.substr(0, name.length - 4);
          console.log('dataFactoryImporteren featurenaam: ', featurenaam);
        } else {
          featureNaam = fileNaam;
        }

        if (!extension) {
          extension = 'jpg';
        }

        var desc = feature.properties.desc.split('\n');
        console.log('import foto gpx desc => descArray: ', desc);

        var tmp;

        tmp = loDash.find(desc, function (d) {
          return d.startsWith('id=');
        });
        if (tmp) {
          oldFotoId = tmp.substr(3);
          console.log('import oldFoto gpx desc => oldFotoId: ', oldFotoId);
        } else {
          oldFotoId = '';
        }

        tmp = loDash.find(desc, function (d) {
          return d.startsWith('name=');
        });
        if (tmp) {
          featurenaam = tmp.substr(5);
          console.log('import foto gpx desc => featurenaam: ', featurenaam);
        } else {
          featurenaam = '';
        }

        tmp = loDash.find(desc, function (d) {
          return d.startsWith('desc=');
        });
        if (tmp) {
          var featuretekst = tmp.substr(5);
          console.log('import foto gpx desc => featuretekst: ', featuretekst);
        } else {
          featuretekst = '';
        }

        tmp = loDash.find(desc, function (d) {
          return d.startsWith('trackid=');
        });
        if (tmp) {
          var trackId = tmp.substr(8);
          console.log('import foto gpx desc => trackId: ', trackId);
        } else {
          trackId = '';
        }

        if (featuretekst) {
          if (feature.properties.desc) {
            featuretekst = feature.properties.desc;
          } else {
            featuretekst = '';
          }
          console.log('dataFactoryImporteren featuretekst: ', featuretekst);
        }
        //
        //  Laden foto en uploaden naar FS of website
        //
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        console.log('dataFactoryImporteren locatie lat, lng: ', lat, lng);

        fotoModel = new dataFactoryFoto.Model();
        fotoModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        fotoModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        fotoModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        fotoModel.set('avatarColor', tmp[0]);
        fotoModel.set('avatarLetter', tmp[1]);
        fotoModel.set('avatarInverse', tmp[2]);
        fotoModel.set('naam', featurenaam);
        fotoModel.set('tekst', featuretekst);
        fotoModel.set('fotoId', fotoId);
        fotoModel.set('trackId', trackId);
        fotoModel.set('extension', extension);
        fotoModel.set('lat', lat);
        fotoModel.set('lng', lng);
        fotoModel.set('xprive', true);
        fotoModel.set('yprive', false);
        fotoModel.save().then(function (fotoModel) {
          fotoModel.set('fotoId', fotoModel.get('Id'));
          fotoModel.save().then(function (fotoModel) {

            console.log('dataFactoryImporteren saved fotoModel: ', fotoModel);

            var fotoId = fotoModel.get('Id');

            kopieerFotoFile(oldFotoId, fotoId, fileNaam);

            var fotoSupModel = new dataFactoryFotoSup.Model();
            fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            fotoSupModel.set('fotoId', fotoId);
            fotoSupModel.set('xnew', false);
            fotoSupModel.save().then(function () {

              console.log('dataFactoryImporteren saved fotoSupModel: ', fotoSupModel);

            });
          });
        });
      });

      //$ionicLoading.hide();

      //var gpxdata = togpx(Geoposition, options);
      //console.error('Fotos upload gpxdata: ', gpxdata);

      //dataFactoryDropbox.upload(gpxdata, fileNaam + '.gpx').then(function (gpxResult) {
      //console.warn('Fotos upload GPX SUCCESS: ', gpxResult);
      //});

      //dataFactoryImporteren.closeImporteren('fotos');
    };

    dataFactoryImporteren.doImporterenSporen = function (geojson, fileNaam) {

      //console.log('dataFactoryImporteren doImporterenSporen');
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Importeren Sporen<br><br><span class="trinl-rood"><b>' + name + '</b></span><br><br>Een ogenblik geduld aub...'
      });
      var trackModel;
      //var tagId = tag;

      loDash.each(geojson.features, function (feature) {

        //var featurenaam = '';
        if (feature.properties.name) {
          fileNaam = feature.properties.name;
        }
        var featuretekst = '';
        if (feature.properties.desc) {
          featuretekst = feature.properties.desc;
        }
        //console.log('dataFactoryImporteren featurenaam, featuredesc: ', featurenaam, featuretekst);
        var lat = feature.geometry.coordinates[0][1];
        var lng = feature.geometry.coordinates[0][0];

        //console.log('dataFactoryImporteren doImporterenSporen lat, lng: ', lat, lng);

        trackModel = new dataFactoryTrack.Model();
        trackModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        trackModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        trackModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        trackModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        trackModel.set('avatarColor', tmp[0]);
        trackModel.set('avatarLetter', tmp[1]);
        trackModel.set('avatarInverse', tmp[2]);
        trackModel.set('naam', fileNaam);
        trackModel.set('tekst', featuretekst);
        trackModel.set('trackId', '');
        trackModel.set('lat', lat);
        trackModel.set('lng', lng);
        trackModel.set('xprive', true);
        trackModel.set('yprive', false);

        console.log('dataFactoryImporteren nieuwe TRACK: ', trackModel);

        trackModel.save().then(function (trackModel) {

          trackId = trackModel.get('Id');
          var tracksupModel = new dataFactoryTrackSup.Model();
          tracksupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          tracksupModel.set('trackId', trackId);
          tracksupModel.set('xnew', false);
          tracksupModel.save().then(function () {
            //console.log('dataFactoryImporteren nieuwe TRACKSUP: ', tracksupModel);
            dataFactorySyncFS.upLoadTrackDesktop(trackId, geojson);
          });
        });
      });
      dataFactoryImporteren.closeImporteren('track', trackModel);
    };

    dataFactoryImporteren.closeImporteren = function (type, model) {

      if (type === 'track') {
        trackModel = model;
        if (!trackModel.xData) {
          trackModel.xData = {};
        }
      }
      //console.warn('dataFactoryImporteren.closeImporteren importsDone, aantalImports: ', importsDone, aantalImports);
      importsDone = importsDone + 1;

      if (importsDone >= aantalImports) {

        console.error('dataFactoryImporteren alles binnen');

        var typetje = '';
        if (dataFactoryDropbox.type === '/Sporen') {
          typetje = 'Sporen';
        }
        if (dataFactoryDropbox.type === '/Locaties') {
          typetje = 'Locaties';
        }
        if (dataFactoryDropbox.type === '/Fotos') {
          typetje = 'Fotos';
        }

        dataFactoryTrackPoisFotos.init().then(function (result) {

          console.log('dataFactoryImporteren.closeImporteren result, trackModel: ', result, trackModel.get('naam'));

          dataFactoryTrackPoisFotos.getPois(trackModel.get('Id')).then(function (result) {
            console.table('dataFactoryImporteren.closeImporteren getPois trackModel: ', result);
            trackModel.xData.pois = result;
            console.log('dataFactoryImporteren closeImporteren: ', trackModel);
          });

          dataFactoryTrackPoisFotos.getFotos(trackModel.get('Id')).then(function (result) {
            console.table('dataFactoryImporteren.closeImporteren getFotos trackModel: ', result);
            trackModel.xData.fotos = result;
            console.log('dataFactoryImporteren closeImporteren: ', trackModel);
          });
        });

        $ionicLoading.hide();

        $ionicPopup.confirm({
          title: 'Importeren ' + typetje + ' GPX',
          content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>importeren gereed',
          buttons: [{
            text: '<b>OK</b>',
            onTap: function () {

              if (dataFactoryDropbox.type === '/Sporen') {

                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  $timeout(function () {
                    $state.go('tracks.tracks');
                  }, 200);
                } else {
                  $timeout(function () {
                    $state.go('tracks.tracks');
                  }, 500);
                }
              }
              if (dataFactoryDropbox.type === '/Locaties') {
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  $timeout(function () {
                    $state.go('pois.pois');
                  }, 200);
                } else {
                  $timeout(function () {
                    $state.go('pois.pois');
                  }, 500);
                }
              }
              if (dataFactoryDropbox.type === '/Fotos') {
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                  $timeout(function () {
                    $state.go('fotos.fotos');
                  }, 200);
                } else {
                  $timeout(function () {
                    $state.go('fotos.fotos');
                  }, 500);
                }
              }
            }
          }]
        });
      } else {
        //console.log('closeImporteren more imports left');
      }
    };

    dataFactoryImporteren.tagsAdd = function (fotoModel, tagModel) {

      if (dataFactoryDropbox.type === '/Locaties') {
        tags = loDash.find(dataFactoryPoi.tags, function (tag) {

          //console.log('PoisSideMenuCtrl toevoegen loop dataFactoryPoi.tags: ', tag.tagModel);

          return tag.tagModel.get('Id') === tagModel.get('Id');
        });
        if (!tags) {
          //
          // Tag in tagModel is nog niet aanwezig in tags
          // Nieuwe tag met eerste poiModel.Id in ids toevoegen in $scope.data.tags
          //
          nieuwTag = {
            ids: [
              poiModel.get('Id')
            ],
            tagModel: tagModel
          };

          //console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, eerste id: ', poiModel.get('Id'), dataFactoryPoi.tags, nieuwTag);

          dataFactoryPoi.tags.push(nieuwTag);

        } else {
          //
          // Zoja, dan poiModel.Id toevoegen in ids van $scoep.data.tags
          //
          //console.log('PoisSideMenuCtrl tag aanwezig UPDATE: ', tags, poiModel.get('Id'));
          //
          // poiModel.Id toevoegen aan tag.ids tabel. tag is de label in het sidemenu
          //
          loDash.remove(tags.ids, function (Id) {
            return Id === poiModel.get('Id');
          });
          tags.ids.push(poiModel.get('Id'));

          //console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, nieuwe id: ', poiModel.get('Id'), dataFactoryPoi.tags);

        }
      }

      if (dataFactoryDropbox.type === '/Fotos') {
        tags = loDash.find(dataFactoryFoto.tags, function (tag) {

          //console.log('PoisSideMenuCtrl toevoegen loop dataFactoryFoto.tags: ', tag.tagModel);

          return tag.tagModel.get('Id') === tagModel.get('Id');
        });
        if (!tags) {
          //
          // Tag in tagModel is nog niet aanwezig in tags
          // Nieuwe tag met eerste fotoModel.Id in ids toevoegen in $scope.data.tags
          //
          nieuwTag = {
            ids: [
              fotoModel.get('Id')
            ],
            tagModel: tagModel
          };

          //console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, eerste id: ', fotoModel.get('Id'), dataFactoryFoto.tags, nieuwTag);

          dataFactoryFoto.tags.push(nieuwTag);

        } else {
          //
          // Zoja, dan fotoModel.Id toevoegen in ids van $scoep.data.tags
          //
          //console.log('PoisSideMenuCtrl tag aanwezig UPDATE: ', tags, fotoModel.get('Id'));
          //
          // fotoModel.Id toevoegen aan tag.ids tabel. tag is de label in het sidemenu
          //
          loDash.remove(tags.ids, function (Id) {
            return Id === fotoModel.get('Id');
          });
          tags.ids.push(fotoModel.get('Id'));

          //console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, nieuwe id: ', fotoModel.get('Id'), dataFactoryFoto.tags);

        }
      }
    };

    dataFactoryImporteren.koppelTag = function (tag) {

      //console.log('dataFactoryImporteren koppelTag tag: ', tag);

      var q = $q.defer();

      var found = loDash.find(dataFactoryTag.store, function (tagModel) {
        return tagModel.get('tag') === tag;
      });

      if (!found) {
        var tagModel = new dataFactoryTag.Model();
        tagModel.set('tag', tag);
        tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        tagModel.set('xprive', true);
        tagModel.set('yprive', false);
        tagModel.save().then(function (tagModel) {

          var tagId = tagModel.get('Id');

          //console.log('dataFactoryImporteren koppelTag tag: ', tagModel.get('Id'));
          q.resolve(tagId);

        });

      } else {
        var tagId = found.get('Id');
        q.resolve(tagId);
      }

      return q.promise;

    };

    dataFactoryImporteren.start = function (fileNaam, downloadresult) {

      //console.log('dataFactoryImporteren download SUCCESS downloadresult: ', downloadresult.data);
      //console.warn('dataFactoryImporteren.start');
      //
      //  Evt inhoud splitsen en pas converteren
      //  Daarna alle bestanden analyseren in  resultaat
      //  Maar toch ook gesplitst opslaan als Locaties en Sporen
      //
      var result = '';
      var aantalSporen = 0;
      var aantalLocaties = 0;
      var aantalFotos = 0;
      var isHeader = false;
      var isSporen = false;
      var isLocaties = false;
      var isSporenLoaded = false;
      var isLocatiesLoaded = false;
      var isFotosLoaded = false;
      var geojsonSporen, geojsonLocaties, geojsonFotos, geojson;

      var position = 0;
      var point = 0;
      var multipoint = 0;
      var track = 0;
      var multitrack = 0;
      var line = 0;
      var multiline = 0;
      var polygon = 0;
      var multipolygon = 0;
      var dom;

      const allLines = downloadresult.data.split(/\r\n|\n/);
      allLines.forEach((line) => {
        //console.log(line);
        if (line.indexOf('<trk>') >= 0) {
          aantalSporen = aantalSporen + 1;
        }
        if (line.indexOf('<wpt') >= 0) {

          aantalLocaties = aantalLocaties + 1;
          aantalFotos = aantalFotos + 1;
        }
      });

      //console.log('Sporen tellen: ', aantalSporen);

      var typetje = '';
      if (aantalSporen === 0 || aantalLocaties === 0) {
        if (aantalLocaties > 0) {
          if (dataFactoryDropbox.type === '/Locaties') {
            //console.log('Locaties tellen: ', aantalLocaties);
            typetje = 'Locaties';
          }
          if (dataFactoryDropbox.type === '/Fotos') {
            //console.log('Fotos tellen: ', aantalFotos);
            typetje = 'Fotos';
          }
        }
        if (aantalSporen > 0) {
          typetje = 'Sporen';
        }
        //console.log('dataFactoryImporteren start: Simpele file. converteren zonder te splitsen');
        dom = new DOMParser().parseFromString(downloadresult.data, 'text/xml');
        geojson = toGeoJSON.gpx(dom);
        //console.log('dataFactoryImporteren download SUCCESS result geojson object: ', geojson);

        if (geojson.features.length == 0) {
          $ionicLoading.hide();
          $ionicPopup.confirm({
            title: 'Importeren ' + typetje + ' GPX',
            content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>heeft geen gegevens',
            buttons: [{
              text: '<b>Annuleer</b>'
            }]
          });
          //console.error('dataFactoryImporteren download geen gegevens');
        } else {
          if (geojson.features[0].properties.name) {
            name = geojson.features[0].properties.name;
          }

          loDash.each(geojson.features, function (feature) {

            if (feature.geometry.type === 'Position') {
              position += 1;
            }
            if (feature.geometry.type === 'Point') {
              point += 1;
            }
            if (feature.geometry.type === 'MultiPoint') {
              multipoint += 1;
            }
            if (feature.geometry.type === 'Track') {
              track += 1;
            }
            if (feature.geometry.type === 'MultiTrack') {
              multitrack += 1;
            }
            if (feature.geometry.type === 'LineString') {
              line += 1;
            }
            if (feature.geometry.type === 'MultiLineString') {
              multiline += 1;
            }
            if (feature.geometry.type === 'Polygon') {
              polygon += 1;
            }
            if (feature.geometry.type === 'MultiPolygon') {
              multipolygon += 1;
            }
          });
          if (aantalSporen > 0) {
            if (dataFactoryDropbox.type === '/Sporen') {
              geojsonSporen = geojson;
              isSporenLoaded = true;
              //console.log('Importeren Sporen: ', geojsonSporen);
            }
          }
          if (aantalLocaties > 0) {
            if (dataFactoryDropbox.type === '/Locaties') {
              geojsonLocaties = geojson;
              trackId = 'notrack';
              isLocatiesLoaded = true;
              //console.log('Importeren Locaties: ', geojsonLocaties);
            }
          }
          if (aantalFotos > 0) {
            if (dataFactoryDropbox.type === '/Fotos') {
              geojsonFotos = geojson;
              trackId = 'notrack';
              isFotosLoaded = true;
              //console.log('Importeren Fotos: ', geojsonFotos);
            }
          }
        }

      } else {

        //console.log('dataFactoryImporteren start: Eerst splitsen in 2 gpx. dan Converteren');
        //console.log('denk er aan dat niet iedere gele een CRLF heeft. De gezocht string hoeft niet aan het begin van de regel te staan.');

        isHeader = false;
        isSporen = false;
        result = '';
        //
        //console.log('Eerst kopieren we de header. Totdat we de eertse <wpt of <trk> tegenkomen');
        //
        allLines.forEach((line) => {
          if (!isHeader) {
            if (line.indexOf('<wpt') >= 0 || line.indexOf('<trk>') >= 0) {
              //
              //console.log('Stop kopieren header');
              isHeader = true;
            } else {
              result = result + line;
            }
          }
          if (line.indexOf('<trk>') >= 0) {
            isSporenLoaded = true;
            isSporen = true;
            //console.log('begin Spoor');
          }
          if (isSporen) {
            result = result + line;
          }
          if (line.indexOf('</trk>') >= 0) {
            isSporen = false;
            //console.log('einde Spoor');
          }

        });

        if (isSporenLoaded) {
          //console.log('Resultaat Sporen: ', result);
          dom = new DOMParser().parseFromString(result, 'text/xml');
          geojsonSporen = toGeoJSON.gpx(dom);
          //console.log('dataFactoryImporteren download SUCCESS result geojsonSporen object: ', geojsonSporen);

          if (geojsonSporen.features.length == 0) {
            $ionicLoading.hide();
            $ionicPopup.confirm({
              title: 'Importeren Spoor GPX',
              content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>heeft geen gegevens',
              buttons: [{
                text: '<b>Annuleer</b>'
              }]
            });
            //console.log('dataFactoryImporteren download geen gegevens');
          } else {
            if (geojsonSporen.features[0].properties.name) {
              name = geojsonSporen.features[0].properties.name;
            }

            loDash.each(geojsonSporen.features, function (feature) {

              if (feature.geometry.type === 'Position') {
                position += 1;
              }
              if (feature.geometry.type === 'Point') {
                point += 1;
              }
              if (feature.geometry.type === 'MultiPoint') {
                multipoint += 1;
              }
              if (feature.geometry.type === 'Track') {
                track += 1;
              }
              if (feature.geometry.type === 'MultiTrack') {
                multitrack += 1;
              }
              if (feature.geometry.type === 'LineString') {
                line += 1;
              }
              if (feature.geometry.type === 'MultiLineString') {
                multiline += 1;
              }
              if (feature.geometry.type === 'Polygon') {
                polygon += 1;
              }
              if (feature.geometry.type === 'MultiPolygon') {
                multipolygon += 1;
              }
            });
          }
        }

        isHeader = false;
        isLocaties = false;
        result = '';
        //
        //console.log('Eerst kopieren we de header. Totdat we de eertse <wpt of <trk> tegenkomen');
        //
        allLines.forEach((line) => {
          if (!isHeader) {
            if (line.indexOf('<wpt') >= 0 || line.indexOf('<trk>') >= 0) {
              //
              //console.log('Stop kopieren header');
              isHeader = true;
            } else {
              result = result + line;
            }
          }
          if (line.indexOf('<wpt') >= 0) {
            isLocatiesLoaded = true;
            isLocaties = true;
            //console.log('begin Locatie');
          }
          if (isLocaties) {
            result = result + line;
          }
          if (line.indexOf('</wpt>') >= 0) {
            isLocaties = false;
            //console.log('einde Locatie');
          }

        });

        if (isLocatiesLoaded) {

          //console.log('Resultaat Locaties: ', result);

          dom = new DOMParser().parseFromString(result, 'text/xml');
          geojsonLocaties = toGeoJSON.gpx(dom);
          //console.log('dataFactoryImporteren download SUCCESS result geojsonLocaties object: ', geojsonLocaties);

          if (geojsonLocaties.features.length == 0) {
            $ionicLoading.hide();
            $ionicPopup.confirm({
              title: 'Importeren Locaties GPX',
              content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>heeft geen gegevens',
              buttons: [{
                text: '<b>Annuleer</b>'
              }]
            });
            //console.error('dataFactoryImporteren download geen gegevens');
          } else {
            if (geojsonLocaties.features[0].properties.name) {
              name = geojsonLocaties.features[0].properties.name;
            }

            loDash.each(geojsonLocaties.features, function (feature) {

              if (feature.geometry.type === 'Position') {
                position += 1;
              }
              if (feature.geometry.type === 'Point') {
                point += 1;
              }
              if (feature.geometry.type === 'MultiPoint') {
                multipoint += 1;
              }
              if (feature.geometry.type === 'Track') {
                track += 1;
              }
              if (feature.geometry.type === 'MultiTrack') {
                multitrack += 1;
              }
              if (feature.geometry.type === 'LineString') {
                line += 1;
              }
              if (feature.geometry.type === 'MultiLineString') {
                multiline += 1;
              }
              if (feature.geometry.type === 'Polygon') {
                polygon += 1;
              }
              if (feature.geometry.type === 'MultiPolygon') {
                multipolygon += 1;
              }
            });
          }
        }
      }

      var br = false;
      var gegevens = '';

      if (name) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Naam: ' + name + '<br>';
        br = true;
      }
      if (position) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Coordinaten: ' + position;
        br = true;
      }
      if (point) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Locaties: ' + point + '<br>';
        br = true;
      }
      if (multipoint) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Locatie groepen: ' + multipoint + '<br>';
        br = true;
      }
      if (track) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Sporen: ' + track + '<br>';
        br = true;
      }
      if (multitrack) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Spoor groepen: ' + multitrack + '<br>';
        br = true;
      }
      if (line) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Sporen: ' + line + '<br>';
        br = true;
      }
      if (multiline) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Spoor groepen: ' + multiline + '<br>';
        br = true;
      }
      if (polygon) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Vormen: ' + polygon + '<br>';
        br = true;
      }
      if (multipolygon) {
        if (br) {
          gegevens = '<br>' + gegevens;
        }
        gegevens = gegevens + 'Vorm groepen: ' + multipolygon + '<br>';
      }

      //console.log('dataFactoryImporteren naam: ', name);
      //console.log('dataFactoryImporteren position: ', position);
      //console.log('dataFactoryImporteren locaties: ', point);
      //console.log('dataFactoryImporteren locatie groep: ', multipoint);
      //console.log('dataFactoryImporteren sporen: ', track);
      //console.log('dataFactoryImporteren spoor groepen: ', multitrack);
      //console.log('dataFactoryImporteren sporen: ', line);
      //console.log('dataFactoryImporteren spoor groepen: ', multiline);
      //console.log('dataFactoryImporteren polygon: ', polygon);
      //console.log('dataFactoryImporteren multipolygon: ', multipolygon);
      //
      // isSporenLoaded => Er is een geojsonSporen met sporen
      // isLocatiesLoaded => Er is een geojsonLocaties met locaties
      // Dit kunnen we gebruiken om vast te stellen dat er niets is
      aantalImports = 0;
      if (isSporenLoaded) {
        aantalImports = aantalImports + 1;
      }
      if (isLocatiesLoaded) {
        aantalImports = aantalImports + 1;
      }
      if (isFotosLoaded) {
        aantalImports = aantalImports + 1;
      }
      //console.log('Importeren aantalImports: ', aantalImports);
      //console.log('Importeren isSporenLoaded, isLocatiesLoaded, isFotosLoaded: ', isSporenLoaded, isLocatiesLoaded, isFotosLoaded);
      //console.log('Importeren type: ', dataFactoryDropbox.type);

      if (multitrack + line + multiline !== 0 && multipoint + point + multipoint !== 0) {
        $ionicLoading.hide();
        $ionicPopup.confirm({
          title: 'Importeren Spoor met Locaties GPX',
          content: 'Bestand: <span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br><b>Gegevens</b>' + gegevens,
          buttons: [{
            text: 'Annuleer'
          }, {
            text: '<b>Importeer</b>',
            type: 'button-positive',
            onTap: function () {
              if (isSporenLoaded) {
                dataFactoryImporteren.doImporterenSporen(geojsonSporen, fileNaam);
              }
              var inter = $interval(function () {
                if (trackId !== '') {
                  if (trackId === 'notrack') {
                    trackId = '';
                  }
                  $interval.cancel(inter);

                  if (isLocatiesLoaded) {
                    dataFactoryImporteren.koppelTag(fileNaam).then(function (tagId) {
                      //console.log('doImporterenLocaties found tag with tagId: ', tagId);
                      dataFactoryImporteren.doImporterenLocaties(geojsonLocaties, fileNaam, tagId);
                    });
                  }
                  if (isFotosLoaded) {
                    dataFactoryImporteren.koppelTag(fileNaam).then(function (tagId) {
                      //console.log('doImporterenFotos found tag with tagId: ', tagId);
                      dataFactoryImporteren.doImporterenFotos(geojsonFotos, fileNaam, tagId);
                    });
                  }
                }
              }, 500, 10);
            }
          }]
        });
      } else {
        typetje = '';
        if (dataFactoryDropbox.type === '/Locaties') {
          typetje = 'Locaties';
        }
        if (dataFactoryDropbox.type === '/Fotos') {
          typetje = 'Fotos';
        }

        if (multitrack + line + multiline !== 0) {
          $ionicLoading.hide();
          $ionicPopup.confirm({
            title: 'Importeren ' + typetje + ' GPX',
            content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Gegevens<br>' + gegevens,
            buttons: [{
              text: 'Annuleer'
            }, {
              text: '<b>Importeer</b>',
              type: 'button-positive',
              onTap: function () {
                dataFactoryImporteren.doImporterenSporen(geojsonSporen, fileNaam);
              }
            }]
          });
        }
        if (multipoint + point + multipoint !== 0) {

          $ionicLoading.hide();
          $ionicPopup.confirm({
            title: 'Importeren ' + typetje + ' GPX',
            content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Gegevens<br>' + gegevens,
            buttons: [{
              text: 'Annuleer'
            }, {
              text: '<b>Importeer</b>',
              type: 'button-positive',
              onTap: function () {
                if (dataFactoryDropbox.type === '/Locaties') {
                  if (isLocatiesLoaded) {
                    dataFactoryImporteren.koppelTag(fileNaam).then(function (tagId) {
                      dataFactoryImporteren.doImporterenLocaties(geojsonLocaties, fileNaam, tagId);
                    });
                  }
                }
                if (dataFactoryDropbox.type === '/Fotos') {
                  if (isFotosLoaded) {
                    dataFactoryImporteren.koppelTag(fileNaam).then(function (tagId) {
                      dataFactoryImporteren.doImporterenFotos(geojsonFotos, fileNaam, tagId);
                    });
                  }
                }
              }
            }]
          });
        }
      }
    };

    dataFactoryImporteren.setType = function (type) {
      //console.log('dataFactoryImporteren setType: ', type);
      dataFactoryImporteren.type = type;
    };

    return dataFactoryImporteren;
  }
]);
