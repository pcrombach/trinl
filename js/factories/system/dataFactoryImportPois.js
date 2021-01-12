/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryImportPois', ['$rootScope', 'loDash', '$state', '$q', '$timeout', '$ionicLoading', '$ionicPopup', 'dataFactoryTag', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryCeo',
  function ($rootScope, loDash, $state, $q, $timeout, $ionicLoading, $ionicPopup, dataFactoryTag, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryCeo) {

    console.warn('dataFactoryImportPois');

    var dataFactoryImportPois = {};

    var aantalSporen = 0;
    var aantalLocaties = 0;
    var aantalImports = 0;
    var importsDone = 0;
    var trackId = '';
    var fileNaam = '';
    var poiModel;

    /*
    //  *************************************
    //  Custom code FOTO Start
    //  *************************************
    function kopieerPoiFile(oldPoiId, poiId, fileNaam) {

      console.warn('dataFactoryImportPois');
      //console.log('TrackDropboxCtrl downloadFile folderPath: ', '/Pois/' + oldPoiId);

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Poi....<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
      });
      dataFactoryDropbox.login().then(function () {

        // eslint-disable-next-line no-unused-vars
        dataFactoryDropbox.download('/Pois/' + oldPoiId + '.b64').then(function (downloadresult) {
          //console.log('Importeren downloadPoiFile: ', downloadresult);

          //dataFactorySyncFS.upLoadPoiB64(poiId + '.b64', downloadresult.data);

          //var image = new Image();
          //image.src = 'data:image/jpg;base64,' + downloadresult.data;
          //console.log('Importeren image: ', image);

          //dataFactorySyncFS.upLoadPoi(image);

          var base64String = downloadresult.data.replace('data:image/jpg;base64,', '');

          var binaryImg = $window.atob(base64String);
          var length = binaryImg.length;
          var ab = new ArrayBuffer(length);
          var ua = new Uint8Array(ab);
          for (var i = 0; i < length; i++) {
            ua[i] = binaryImg.charCodeAt(i);
          }

          //console.log('Importeren image: ', ab);
          dataFactorySyncFS.upLoadPoiImage(poiId + '.jpg', ab);

          $ionicLoading.hide();

        });
      }).catch(function (err) {
        console.error('PoiDropboxCtrl login ERROR: ', err);
      });
    }
    //
    //  *************************************
    //  Custom code FOTO Start
    //  *************************************
    */
    function composeNameTekst(feature) {
      //loDash.each(geojson.features, function (feature) {

      ////console.log('loop uniq feature.properties: ', feature);
      ////console.log('loop uniq feature.properties.desc: ', feature.properties.desc);

      var startIndexName, startIndexDesc, startIndexTime, startIndexId, startIndexTrackId;
      var name, name1, name2, name3, name4, name5;
      var tekst, tekst1, tekst2, tekst3, tekst4, tekst5;
      var id, id1, id2, id3, id4, id5;
      var trackid, trackid1, trackid2, trackid3, trackid4, trackid5;

      if (feature.properties.name.length > 0) {
        name = feature.properties.name;
      }
      ////console.log('Slits de diverse props into vars: ', feature.properties.desc);
      if (feature.properties.desc) {
        startIndexName = feature.properties.desc.lastIndexOf('name=');
        startIndexDesc = feature.properties.desc.lastIndexOf('desc=');
        startIndexTime = feature.properties.desc.lastIndexOf('time=');
        startIndexId = feature.properties.desc.lastIndexOf('id=');
        startIndexTrackId = feature.properties.desc.lastIndexOf('trackid=');
        console.log('startIndexName: ', startIndexName);
        console.log('startIndexDesc: ', startIndexDesc);
        console.log('startIndexTime: ', startIndexTime);
        console.log('startIndexId: ', startIndexId);
        console.log('startIndexTrackId: ', startIndexTrackId);

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && startIndexTrackId === -1 && feature.properties.name.length > 0) {
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
            if (startIndexTrackId >= startIndexName) {
              name4 = feature.properties.desc.substr(startIndexName + 5, startIndexTrackId - (startIndexName + 5));
            }
            if ((startIndexDesc === -1 || startIndexDesc < startIndexName) && (startIndexTime === -1 || startIndexTime < startIndexName) && (startIndexId === -1 || startIndexId < startIndexName) && (startIndexTrackId === -1 || startIndexTrackId < startIndexName)) {
              name5 = feature.properties.desc.substr(startIndexDesc + 5);
            }


          }
        }

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && startIndexTrackId === -1 && feature.properties.desc.length > 0) {
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
            if (startIndexTrackId >= startIndexDesc) {
              tekst4 = feature.properties.desc.substr(startIndexDesc + 5, startIndexTrackId - (startIndexDesc + 5));
            }



            if ((startIndexName === -1 || startIndexName < startIndexDesc) && (startIndexTime === -1 || startIndexTime < startIndexDesc) && (startIndexId === -1 || startIndexId < startIndexDesc) && (startIndexTrackId === -1 || startIndexTrackId < startIndexDesc)) {
              tekst5 = feature.properties.desc.substr(startIndexDesc + 5);
            }
          }
        }

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && startIndexTrackId === -1 && feature.properties.id.length > 0) {
          tekst = feature.properties.desc;
        } else {
          if (startIndexId !== undefined) {
            if (startIndexName >= startIndexId) {
              id1 = feature.properties.desc.substr(startIndexId + 3, startIndexName - (startIndexId + 3));
            }
            if (startIndexTime >= startIndexId) {
              id2 = feature.properties.desc.substr(startIndexId + 3, startIndexTime - (startIndexId + 3));
            }
            if (startIndexDesc >= startIndexId) {
              id3 = feature.properties.desc.substr(startIndexId + 3, startIndexDesc - (startIndexId + 3));
            }
            if (startIndexTrackId >= startIndexId) {
              id4 = feature.properties.desc.substr(startIndexId + 3, startIndexTrackId - (startIndexId + 3));
            }
            if ((startIndexName === -1 || startIndexName < startIndexId) && (startIndexDesc === -1 || startIndexDesc < startIndexId) && (startIndexTime === -1 || startIndexTime < startIndexId) && (startIndexTrackId === -1 || startIndexTrackId < startIndexId)) {
              id5 = feature.properties.desc.substr(startIndexId + 3);
            }
          }
        }

        if (startIndexDesc === -1 && startIndexName === -1 && startIndexTime === -1 && startIndexId === -1 && startIndexTrackId === -1 && feature.properties.trackid.length > 0) {
          tekst = feature.properties.desc;
        } else {
          if (startIndexTrackId !== undefined) {
            if (startIndexName >= startIndexTrackId) {
              trackid1 = feature.properties.desc.substr(startIndexTrackId + 8, startIndexName - (startIndexTrackId + 8));
            }
            if (startIndexTime >= startIndexTrackId) {
              trackid2 = feature.properties.desc.substr(startIndexTrackId + 8, startIndexTime - (startIndexTrackId + 8));
            }
            if (startIndexDesc >= startIndexTrackId) {
              trackid3 = feature.properties.desc.substr(startIndexTrackId + 8, startIndexDesc - (startIndexTrackId + 8));
            }
            if (startIndexTrackId >= startIndexTrackId) {
              trackid4 = feature.properties.desc.substr(startIndexTrackId + 8, startIndexTrackId - (startIndexTrackId + 8));
            }

            if ((startIndexName === -1 || startIndexName < startIndexTrackId) && (startIndexDesc === -1 || startIndexDesc < startIndexTrackId) && (startIndexTime === -1 || startIndexTime < startIndexTrackId) && (startIndexId === -1 || startIndexId < startIndexTrackId)) {
              trackid5 = feature.properties.desc.substr(startIndexId + 3);
            }
          }
        }
        ////console.log('name: ', name);
        ////console.log('name1: ', name1);
        ////console.log('name2: ', name2);
        ////console.log('name3: ', name3);
        ////console.log('name4: ', name4);
        ////console.log('name5: ', name5);
        ////console.log('tekst: ', tekst);
        ////console.log('tekst1: ', tekst1);
        ////console.log('tekst2: ', tekst2);
        ////console.log('tekst3: ', tekst3);
        ////console.log('tekst4: ', tekst4);
        ////console.log('tekst5: ', tekst5);
        console.log('id1: ', id1);
        console.log('id2: ', id2);
        console.log('id3: ', id3);
        console.log('id4: ', id4);
        console.log('id5: ', id5);
        console.log('trackid1: ', trackid1);
        console.log('trackid2: ', trackid2);
        console.log('trackid3: ', trackid3);
        console.log('trackid4: ', trackid4);
        console.log('trackid5: ', trackid5);

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
        if (name5 !== undefined) {
          if (name === undefined || (name.length >= name5.length)) {
            name = name5;
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
        if (tekst5 !== undefined) {
          if (tekst === undefined || (tekst.length >= tekst5.length)) {
            tekst = tekst5;
          }
        }
        if (id1 !== undefined) {
          id = id1;
        }
        if (id2 !== undefined) {
          if (id === undefined || (id.length >= id2.length)) {
            id = id2;
          }
        }
        if (id3 !== undefined) {
          if (id === undefined || (id.length >= id3.length)) {
            id = id3;
          }
        }
        if (id4 !== undefined) {
          if (id === undefined || (id.length >= id4.length)) {
            id = id4;
          }
        }
        if (id5 !== undefined) {
          if (id === undefined || (id.length >= id5.length)) {
            id = id5;
          }
        }

        if (trackid1 !== undefined) {
          trackid = trackid1;
        }
        if (trackid2 !== undefined) {
          if (trackid === undefined || (trackid.length >= trackid2.length)) {
            trackid = trackid2;
          }
        }
        if (trackid3 !== undefined) {
          if (trackid === undefined || (trackid.length >= trackid3.length)) {
            trackid = trackid3;
          }
        }
        if (trackid4 !== undefined) {
          if (trackid === undefined || (trackid.length >= trackid4.length)) {
            trackid = trackid4;
          }
        }
        if (trackid5 !== undefined) {
          if (trackid === undefined || (trackid.length >= trackid5.length)) {
            trackid = trackid5;
          }
        }
        console.error('name: ', name);
        console.error('tekst: ', tekst);
        console.error('id: ', id);
        console.error('trackid: ', trackid);
        return {
          name: name,
          tekst: tekst,
          id: id,
          trackid: trackid
        };
      }
      //});
    }

    dataFactoryImportPois.doImporterenPois = function (geojson, fileNaam, tagId) {

      console.log('dataFactoryImportPois doImporterenPois fileNaam: ', fileNaam);

      var poiModel;

      loDash.each(geojson.features, function (feature) {

        console.log('Poi Importeren geojson feature: ', feature, JSON.stringify(feature));

        var poiParams = composeNameTekst(feature);
        var featureNaam = poiParams.name;
        var featureTekst = poiParams.tekst;

        console.log('dataFactoryImportTracks doImporterenSporen featurenaam: ', featureNaam);
        console.log('dataFactoryImportTracks doImporterenSporen featuretekst: ', featureTekst);

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Spoor....<br><br><span class="trinl-rood"><b>' + featureNaam + '</b></span><br><br>Een ogenblik geduld aub...'
        });

        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        console.log('dataFactoryImportPois locatie lat, lng: ', lat, lng);

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
        poiModel.set('poiId', '');
        poiModel.set('trackId', trackId);
        poiModel.set('lat', lat);
        poiModel.set('lng', lng);
        poiModel.set('xprive', true);
        poiModel.set('yprive', false);
        poiModel.save().then(function (poiModel) {
          $timeout(function () {
            poiModel.set('poiId', poiModel.get('Id'));
            poiModel.save();
          }, 500);

          //console.log('dataFactoryImportPois saved poiModel: ', poiModel);

          var poiId = poiModel.get('Id');

          var poiSupModel = new dataFactoryPoiSup.Model();
          poiSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          poiSupModel.set('poiId', poiId);
          poiSupModel.set('xnew', false);
          poiSupModel.save().then(function () {
            if (!poiModel.xData) {
              poiModel.xData = {};
            }
            if (!poiModel.xData.tags) {
              poiModel.xData.tags = [];
            }

            if (tagId !== '') {

              ////console.log('dataFactoryImportTracks nieuwe TRACKSUP: ', tracksupModel);
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

                  console.log('dataFactoryImportPois nieuwe POITAG: ', poiTagModel);

                  var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId;
                  });

                  if (tagModel) {

                    console.log('importPois voeg label toe aan poiModel: ', tagModel.get('tag'), poiModel.get('naam'));

                    $rootScope.$emit('poiAddLabel', {
                      poiModel: poiModel,
                      tagModel: tagModel
                    });

                    poiTagModel.xData = tagModel;
                    poiModel.xData.tags.push(poiTagModel);
                  }
                  dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
                }).catch(function () {
                  dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
                });
              } else {

                var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                  return tagModel.get('Id') === found.tagId;
                });

                if (tagModel) {
                  found.xData = tagModel;
                }
                dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
              }
            } else {
              dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
            }
          }).catch(function () {
            dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
          });
          //}).catch(function() {
          //dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
          //});
        }).catch(function () {
          dataFactoryImportPois.closeImporteren(fileNaam, poiModel);
        });
      });

    };

    dataFactoryImportPois.closeImporteren = function (fileNaam, model) {

      poiModel = model;
      if (!poiModel.xData) {
        poiModel.xData = {};
      }

      console.warn('dataFactoryImportPois.closeImporteren importsDone, aantalImports: ', importsDone, aantalImports);

      importsDone = importsDone + 1;

      if (importsDone >= aantalImports) {

        console.error('dataFactoryImportPois alles binnen');

        $ionicLoading.hide();

        $ionicPopup.confirm({
          title: 'Importeren Locaties',
          content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>importeren gereed',
          buttons: [{
            text: '<b>OK</b>',
            onTap: function () {
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
          }]
        });
      }
    };

    dataFactoryImportPois.tagsAdd = function (poiModel, tagModel) {

      console.warn('dataFactoryImportPois');

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
    };

    dataFactoryImportPois.koppelTag = function (tag) {

      console.log('dataFactoryImportPois koppelTag tag: ', tag);

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

          //console.log('dataFactoryImportPois koppelTag tag: ', tagModel.get('Id'));
          q.resolve(tagId);

        });

      } else {
        var tagId = found.get('Id');
        q.resolve(tagId);
      }

      return q.promise;

    };

    dataFactoryImportPois.start = function (fileNaam, downloadresult, label) {

      console.warn('dataFactoryImportPois.start fileNaam, downloadResult, label');

      var tagId = '';

      var dom = new DOMParser().parseFromString(downloadresult.data, 'text/xml');
      var geojson = toGeoJSON.gpx(dom);
      console.log('dataFactoryImportPois download SUCCESS result geojson object: ', geojson);

      aantalLocaties = geojson.features.length;

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

      aantalImports = aantalLocaties;
      importsDone = 0;

      $ionicLoading.hide();

      $ionicPopup.confirm({
        title: 'Importeren Locaties',
        content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>' + gegevens,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Start importeren</>',
          type: 'button-positive',
          onTap: function () {
            //
            if (label !== '') {
              dataFactoryImportPois.koppelTag(label).then(function (tagId) {
                console.log('ImportPois tagId: ', tagId);
                dataFactoryImportPois.doImporterenPois(geojson, fileNaam, tagId);
              });
            } else {
              dataFactoryImportPois.doImporterenPois(geojson, fileNaam, '');
            }
          }
        }]
      });
    };

    dataFactoryImportPois.setType = function (type) {
      //console.log('dataFactoryImportPois setType: ', type);
      dataFactoryImportPois.type = type;
    };

    return dataFactoryImportPois;
  }
]);
