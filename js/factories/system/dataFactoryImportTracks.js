/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryImportTracks', ['loDash', '$rootScope', '$state', '$q', '$interval', '$timeout', '$ionicLoading', '$ionicPopup', 'dataFactoryTag', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryTrack', 'dataFactoryTrackSup', 'dataFactoryTrackTag', 'dataFactoryCeo', 'dataFactorySyncFS', 'dataFactoryTrackPoisFotos',
  function (loDash, $rootScope, $state, $q, $interval, $timeout, $ionicLoading, $ionicPopup, dataFactoryTag, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryCeo, dataFactorySyncFS, dataFactoryTrackPoisFotos) {

    console.warn('dataFactoryImportTracks');

    var dataFactoryImportTracks = {};

    var aantalSporen = 0;
    var aantalLocaties = 0;
    var aantalImports = 0;
    var importsDone = 0;
    var fileNaam = '';
    var titel = '';
    var trackId = '';
    var trackModel;
    //  
    dataFactoryImportTracks.doImporterenLocaties = function (geojson, tagId, trackId) {

      //console.log('dataFactoryImportTracks doImporterenLocaties tagId, trackId: ', tagId, trackId);

      var poiModel;
      //
      // Speciaal: We wachten op een trackid. DezetrackId wordt aangemaakt door importeren Sporen.
      // Dit is alleen het geval als er sprake is van een import met Spoor en Locaties.
      // Als de import alleen Locaties zijn dan wordt trackId = 'dummy';
      //
      loDash.each(geojson.features, function (feature) {

        if (feature.geometry.type === 'Point') {

          var featureNaam = '';
          if (feature.properties.name) {
            featureNaam = feature.properties.name;
          } else {
            featureNaam = fileNaam;
          }

          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Locatie....<br><br><span class="trinl-rood"><b>' + featureNaam + '</b></span><br><br>Een ogenblik geduld aub...'
          });

          var featureTekst = '';
          if (feature.properties.desc) {
            featureTekst = feature.properties.desc;
          }
          ////console.log('dataFactoryImportTracks featureNaam, featureTekst: ', featureNaam, featureTekst);

          var lat = feature.geometry.coordinates[1];
          var lng = feature.geometry.coordinates[0];

          ////console.log('dataFactoryImportTracks locatie lat, lng: ', lat, lng);
          ////console.log('dataFactoryImportTracks locatie lat, lng: ', lat, lng);
          poiModel = new dataFactoryPoi.Model();
          poiModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          poiModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
          poiModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
          poiModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
          var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
          poiModel.set('avatarColor', tmp[0]);
          poiModel.set('avatarLetter', tmp[1]);
          poiModel.set('avatarInverse', tmp[2]);
          poiModel.set('naam', featureNaam);
          poiModel.set('tekst', featureTekst);
          poiModel.set('trackId', trackId);
          poiModel.set('lat', lat);
          poiModel.set('lng', lng);
          poiModel.set('xprive', true);
          poiModel.set('yprive', false);

          ////console.log('dataFactoryImportTracks nieuwe POI: ', poiModel.get('naam'));

          poiModel.save().then(function (poiModel) {

            var poiId = poiModel.get('Id');

            var poisupModel = new dataFactoryPoiSup.Model();
            poisupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            poisupModel.set('poiId', poiId);
            poisupModel.set('xnew', false);
            poisupModel.save().then(function () {

              ////console.log('dataFactoryImportTracks nieuwe POISUP: ', poisupModel);
              if (tagId !== '') {
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

                    ////console.log('importTracks nieuwe POITAG: ', poiTagModel);

                    var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                      return tagModel.get('Id') === tagId;
                    });

                    if (tagModel) {

                      ////console.log('importTracks poitag TOEVOEGEN in  SideMenu en xData: ', tagModel.get('tag'));

                      $rootScope.$emit('poiAddLabel', {
                        poiModel: poiModel,
                        tagModel: tagModel
                      });

                      if (!poiModel.xData) {
                        poiModel.xData = {};
                      }
                      if (!poiModel.xData.tags) {
                        poiModel.xData.tags = [];
                      }
                      poiTagModel.xData = tagModel;
                      poiModel.xData.tags.push(poiTagModel);

                    }
                    dataFactoryImportTracks.closeImporteren(titel, 'pois');
                  });
                } else {

                  var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === found.tagId;
                  });

                  if (tagModel) {
                    found.xData = tagModel;
                    //dataFactoryImportTracks.tagsAdd(poiModel, found);
                  }
                  dataFactoryImportTracks.closeImporteren(titel, 'pois');
                }
              } else {
                dataFactoryImportTracks.closeImporteren(titel, 'pois');
              }
            });
          });
        }
      });
    };

    dataFactoryImportTracks.doImporteren = function (geojson, tagId) {

      //console.log('dataFactoryImportTracks doImporteren geojson: ', geojson, tagId);

      if (aantalSporen > 0) {
        dataFactoryImportTracks.doImporterenSporen(geojson, tagId);
      }
      if (aantalLocaties > 0) {
        var interval = $interval(function () {
          if (trackId !== '') {
            $interval.cancel(interval);
            dataFactoryImportTracks.doImporterenLocaties(geojson, tagId, trackId);
          }

        }, 10, 10);
      }

    };

    dataFactoryImportTracks.doImporterenSporen = function (geojson, tagId) {

      //console.log('dataFactoryImportTracks doImporterenSporen');

      var trackModel;

      loDash.each(geojson.features, function (feature) {

        if (feature.geometry.type === 'LineString') {

          var tmp;

          var nameTekst = composeNameTekst(feature);
          var featureNaam = nameTekst.name;
          var featureTekst = nameTekst.tekst;

          ////console.log('dataFactoryImportTracks doImporterenSporen featurenaam: ', featureNaam);
          ////console.log('dataFactoryImportTracks doImporterenSporen featuretekst: ', featureTekst);

          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Spoor....<br><br><span class="trinl-rood"><b>' + featureNaam + '</b></span><br><br>Een ogenblik geduld aub...'
          });

          var lat = feature.geometry.coordinates[0][1];
          var lng = feature.geometry.coordinates[0][0];

          ////console.log('dataFactoryImportTracks doImporterenSporen lat, lng: ', lat, lng);

          trackModel = new dataFactoryTrack.Model();
          trackModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          trackModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
          trackModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
          trackModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
          tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
          trackModel.set('avatarColor', tmp[0]);
          trackModel.set('avatarLetter', tmp[1]);
          trackModel.set('avatarInverse', tmp[2]);
          trackModel.set('naam', featureNaam);
          trackModel.set('tekst', featureTekst);
          trackModel.set('trackId', '');
          trackModel.set('lat', lat);
          trackModel.set('lng', lng);
          trackModel.set('xprive', true);
          trackModel.set('yprive', false);
          if (aantalLocaties > 0) {
            trackModel.set('pois', true);
          }


          ////console.log('dataFactoryImportTracks nieuwe TRACK: ', trackModel);

          trackModel.save().then(function (trackModel) {

            trackId = trackModel.get('Id');

            var tracksupModel = new dataFactoryTrackSup.Model();
            tracksupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            tracksupModel.set('trackId', trackId);
            tracksupModel.set('xnew', false);
            tracksupModel.save().then(function () {
              if (!trackModel.xData) {
                trackModel.xData = {};
              }
              if (!trackModel.xData.tags) {
                trackModel.xData.tags = [];
              }

              if (tagId !== '') {

                ////console.log('dataFactoryImportTracks nieuwe TRACKSUP: ', tracksupModel);
                var found = loDash.find(dataFactoryPoiTag.store, function (trackTagModel) {
                  return trackTagModel.get('trackId') === trackId && trackTagModel.get('tagId') === tagId;
                });

                if (!found) {
                  var trackTagModel = new dataFactoryTrackTag.Model();
                  trackTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                  trackTagModel.set('trackId', trackId);
                  trackTagModel.set('tagId', tagId);
                  trackTagModel.set('xprive', true);
                  trackTagModel.save().then(function () {

                    ////console.log('dataFactoryImportTracks nieuwe TRACKTAG: ', trackTagModel);

                    var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                      return tagModel.get('Id') === tagId;
                    });

                    if (tagModel) {

                      ////console.log('importTracks voeg label toe aan trackModel: ', tagModel.get('tag'), trackModel.get('naam'));

                      $rootScope.$emit('trackAddLabel', {
                        trackModel: trackModel,
                        tagModel: tagModel
                      });

                      trackTagModel.xData = tagModel;
                      trackModel.xData.tags.push(trackTagModel);
                    }
                    dataFactoryImportTracks.closeImporteren(titel, 'track', trackModel);
                  });
                } else {

                  var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === found.tagId;
                  });

                  if (tagModel) {
                    found.xData = tagModel;
                    //dataFactoryImportTracks.tagsAdd(poiModel, found);
                  }
                  dataFactoryImportTracks.closeImporteren(titel, 'track', trackModel);
                }
              } else {
                dataFactoryImportTracks.closeImporteren(titel, 'track', trackModel);
              }
              dataFactorySyncFS.upLoadTrackDesktop(trackId, geojson);
            });
          });
        }
      });
    };

    dataFactoryImportTracks.closeImporteren = function (titel, type, model) {

      if (type === 'track') {
        trackModel = model;
        if (!trackModel.xData) {
          trackModel.xData = {};
        }
      }
      //console.warn('dataFactoryImportTracks.closeImporteren importsDone, aantalImports: ', importsDone, aantalImports);

      importsDone = importsDone + 1;

      if (importsDone >= aantalImports) {

        console.error('dataFactoryImportTracks alles binnen');

        dataFactoryTrackPoisFotos.init().then(function (result) {

          console.log('dataFactoryImportTracks.closeImporteren result, trackModel: ', result, trackModel.get('naam'));

          dataFactoryTrackPoisFotos.getPois(trackModel.get('Id')).then(function (result) {
            console.table('dataFactoryImportTracks.closeImporteren getPois trackModel: ', result);
            trackModel.xData.pois = result;
            console.log('dataFactoryImportTracks closeImporteren: ', trackModel);
          });
          /*
          dataFactoryTrackPoisFotos.getFotos(trackModel.get('Id')).then(function (result) {
            //console.table('dataFactoryImportTracks.closeImporteren getFotos trackModel: ', result);
            trackModel.xData.fotos = result;
            //console.log('dataFactoryImportTracks closeImporteren: ', trackModel);
          });
          */
        });

        $ionicLoading.hide();

        $ionicPopup.confirm({
          title: titel,
          content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>importeren gereed',
          buttons: [{
            text: '<b>OK</b>',
            onTap: function () {
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
          }]
        });
      }
    };

    /*
    dataFactoryImportTracks.tagsAdd = function (poiModel, tagModel) {
  
      console.warn('dataFactoryImportTracks');


      if (dataFactoryDropbox.type === '/Locaties') {
        tags = loDash.find(dataFactoryPoi.tags, function (tag) {

          ////console.log('PoisSideMenuCtrl toevoegen loop dataFactoryPoi.tags: ', tag.tagModel);

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

          ////console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, eerste id: ', poiModel.get('Id'), dataFactoryPoi.tags, nieuwTag);

          dataFactoryPoi.tags.push(nieuwTag);

        } else {
          //
          // Zoja, dan poiModel.Id toevoegen in ids van $scoep.data.tags
          //
          ////console.log('PoisSideMenuCtrl tag aanwezig UPDATE: ', tags, poiModel.get('Id'));
          //
          // poiModel.Id toevoegen aan tag.ids tabel. tag is de label in het sidemenu
          //
          loDash.remove(tags.ids, function (Id) {
            return Id === poiModel.get('Id');
          });
          tags.ids.push(poiModel.get('Id'));

          ////console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, nieuwe id: ', poiModel.get('Id'), dataFactoryPoi.tags);

        }
      }

      if (dataFactoryDropbox.type === '/Fotos') {
        tags = loDash.find(dataFactoryFoto.tags, function (tag) {

          ////console.log('PoisSideMenuCtrl toevoegen loop dataFactoryFoto.tags: ', tag.tagModel);

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

          ////console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, eerste id: ', fotoModel.get('Id'), dataFactoryFoto.tags, nieuwTag);

          dataFactoryFoto.tags.push(nieuwTag);

        } else {
          //
          // Zoja, dan fotoModel.Id toevoegen in ids van $scoep.data.tags
          //
          ////console.log('PoisSideMenuCtrl tag aanwezig UPDATE: ', tags, fotoModel.get('Id'));
          //
          // fotoModel.Id toevoegen aan tag.ids tabel. tag is de label in het sidemenu
          //
          loDash.remove(tags.ids, function (Id) {
            return Id === fotoModel.get('Id');
          });
          tags.ids.push(fotoModel.get('Id'));

          ////console.log('PoisSideMenuCtrl tag nog niet aanwezig INSERT, nieuwe id: ', fotoModel.get('Id'), dataFactoryFoto.tags);

        }
      }
    };
    */

    dataFactoryImportTracks.koppelTag = function (tag) {

      var q = $q.defer();

      if (tag !== '') {
        ////console.log('dataFactoryImportTracks koppelTag tag: ', tag);

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

            ////console.log('dataFactoryImportTracks koppelTag tag: ', tagModel.get('Id'));
            q.resolve(tagId);

          });

        } else {
          var tagId = found.get('Id');
          q.resolve(tagId);
        }
      } else {
        q.resolve();
      }

      return q.promise;
    };

    function composeNameTekst(feature) {
      //loDash.each(geojson.features, function (feature) {

      ////console.log('loop uniq feature.properties: ', feature);
      ////console.log('loop uniq feature.properties.desc: ', feature.properties.desc);

      var startIndexName, startIndexDesc, startIndexTime, startIndexId;
      var name, name1, name2, name3, name4;
      var tekst, tekst1, tekst2, tekst3, tekst4;

      if (feature.properties.name.length > 0) {
        name = feature.properties.name;
      }
      ////console.log('Slits de diverse props into vars: ', feature.properties.desc);
      if (feature.properties.desc) {
        startIndexName = feature.properties.desc.lastIndexOf('name=');
        startIndexDesc = feature.properties.desc.lastIndexOf('desc=');
        startIndexTime = feature.properties.desc.lastIndexOf('time=');
        startIndexId = feature.properties.desc.lastIndexOf('id=');
        ////console.log('startIndexName: ', startIndexName);
        ////console.log('startIndexDesc: ', startIndexDesc);
        ////console.log('startIndexTime: ', startIndexTime);
        ////console.log('startIndexId: ', startIndexId);

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && feature.properties.name.length > 0) {
          name = feature.properties.name;
        } else {
          if (startIndexName !== undefined) {
            if (startIndexDesc >= startIndexName) {
              name1 = feature.properties.desc.substr(startIndexName + 5, startIndexDesc - (startIndexName + 5));
            }
            if (startIndexTime >= startIndexName) {
              name2 = feature.properties.desc.substr(startIndexName + 5, startIndexTime - (startIndexName + 5));
            }
            if (startIndexId >= startIndexName) {
              name3 = feature.properties.desc.substr(startIndexName + 5, startIndexId - (startIndexName + 5));
            }
            if ((startIndexDesc === -1 || startIndexDesc < startIndexName) && (startIndexTime === -1 || startIndexTime < startIndexName) && (startIndexId === -1 || startIndexId < startIndexName)) {
              name4 = feature.properties.desc.substr(startIndexDesc + 5);
            }
          }
        }

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && feature.properties.desc.length > 0) {
          tekst = feature.properties.desc;
        } else {
          if (startIndexDesc !== undefined) {
            if (startIndexName >= startIndexDesc) {
              tekst1 = feature.properties.desc.substr(startIndexDesc + 5, startIndexName - (startIndexDesc + 5));
            }
            if (startIndexTime >= startIndexDesc) {
              tekst2 = feature.properties.desc.substr(startIndexDesc + 5, startIndexTime - (startIndexDesc + 5));
            }
            if (startIndexId >= startIndexDesc) {
              tekst3 = feature.properties.desc.substr(startIndexDesc + 5, startIndexId - (startIndexDesc + 5));
            }
            if ((startIndexName === -1 || startIndexName < startIndexDesc) && (startIndexTime === -1 || startIndexTime < startIndexDesc) && (startIndexId === -1 || startIndexId < startIndexDesc)) {
              tekst4 = feature.properties.desc.substr(startIndexDesc + 5);
            }
          }
        }

        ////console.log('name: ', name);
        ////console.log('name1: ', name1);
        ////console.log('name2: ', name2);
        ////console.log('name3: ', name3);
        ////console.log('name4: ', name4);
        ////console.log('tekst: ', tekst);
        ////console.log('tekst1: ', tekst1);
        ////console.log('tekst2: ', tekst2);
        ////console.log('tekst3: ', tekst3);
        ////console.log('tekst4: ', tekst4);

        if (name1 !== undefined) {
          name = name1;
        }
        if (name2 !== undefined) {
          if (name === undefined || (name.length >= name2.length)) {
            name = name2;
          }
        }
        if (name3 !== undefined) {
          if (name === undefined || (name.length >= name3.length)) {
            name = name3;
          }
        }
        if (name4 !== undefined) {
          if (name === undefined || (name.length >= name4.length)) {
            name = name4;
          }
        }

        if (tekst1 !== undefined) {
          tekst = tekst1;
        }
        if (tekst2 !== undefined) {
          if (tekst === undefined || (tekst.length >= tekst2.length)) {
            tekst = tekst2;
          }
        }
        if (tekst3 !== undefined) {
          if (tekst === undefined || (tekst.length >= tekst3.length)) {
            tekst = tekst3;
          }
        }
        if (tekst4 !== undefined) {
          if (tekst === undefined || (tekst.length >= tekst4.length)) {
            tekst = tekst4;
          }
        }
        ////console.error('name: ', name);
        ////console.error('tekst: ', tekst);
        return {
          name: name,
          tekst: tekst
        };
      }
      //});
    }

    dataFactoryImportTracks.start = function (fileNaam, downloadresult, label) {

      ////console.log('dataFactoryImportTracks download SUCCESS downloadresult: ', downloadresult.data);
      ////console.warn('dataFactoryImportTracks.start');
      //
      //  Evt inhoud splitsen en pas converteren
      //  Daarna alle bestanden analyseren in  resultaat
      //  Maar toch ook gesplitst opslaan als Locaties en Sporen
      //
      aantalSporen = 0;
      aantalLocaties = 0;
      var geojson;

      var dom;
      dom = new DOMParser().parseFromString(downloadresult.data, 'text/xml');
      geojson = toGeoJSON.gpx(dom);

      ////console.log('ImportTracks geojson: ', geojson.features[0].properties.name);

      var newObjList = [];
      loDash.each(geojson.features, function (feature) {

        var result = loDash.find(newObjList, function (list) {
          return (list.properties.name === feature.properties.name) && (list.geometry.type === 'LineString') && (list.geometry.coordinates.length === feature.geometry.coordinates.length);
        });
        if (!result) {
          ////console.error('loop uniq obj: ', feature.properties.name, feature.properties.desc, feature.geometry.type);
          newObjList.push(feature);
          if (feature.geometry.type === 'LineString') {
            aantalSporen += 1;
          }
          if (feature.geometry.type === 'Point') {
            aantalLocaties += 1;
          }
        }
      });

      geojson.features = newObjList;

      console.log('ImportTracks geojson.features: ', geojson.features);

      var gegevens = '';

      if (aantalSporen > 0) {
        gegevens = gegevens + 'Aantal Sporen: ' + aantalSporen + '<br>';
      }
      if (aantalLocaties > 0) {
        gegevens = gegevens + 'Aantal Locaties: ' + aantalLocaties + '<br>';
      }
      if (label !== '') {
        gegevens = gegevens + '<br>Label: ' + label + '<br>';
      }

      aantalImports = aantalSporen + aantalLocaties;
      importsDone = 0;

      $ionicLoading.hide();

      titel = 'Importeren';
      if (aantalSporen > 0 && aantalLocaties === 0) {
        titel = titel + ' Sporen';
      }
      if (aantalSporen === 0 && aantalLocaties > 0) {
        titel = titel + ' Locaties';
      }
      if (aantalSporen > 0 && aantalLocaties > 0) {
        titel = titel + ' Sporen met Locaties';
      }

      $ionicPopup.confirm({
        title: 'Importeren Spoor',
        content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>' + gegevens,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Importeer</>',
          type: 'button-positive',
          onTap: function () {
            //
            //  Hier werd fileNaam meeggeven als label
            //
            dataFactoryImportTracks.koppelTag(label).then(function (tagId) {
              if (!tagId) {
                tagId = '';
              }
              console.log('ImportTrack tagId: ', tagId);
              dataFactoryImportTracks.doImporteren(geojson, tagId);
            });
          }
        }]
      });

    };

    dataFactoryImportTracks.setType = function (type) {
      ////console.log('dataFactoryImportTracks setType: ', type);
      dataFactoryImportTracks.type = type;
    };

    return dataFactoryImportTracks;
  }
]);
