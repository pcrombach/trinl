/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryImportFotos', ['$rootScope', 'loDash', '$window', '$state', '$q', '$timeout', '$ionicLoading', '$ionicPopup', 'dataFactoryTag', 'dataFactoryFotos', 'dataFactoryFoto', 'dataFactoryFotoSup', 'dataFactoryFotoTag', 'dataFactoryCeo', 'dataFactorySyncFS', 'dataFactoryDropbox',
  function ($rootScope, loDash, $window, $state, $q, $timeout, $ionicLoading, $ionicPopup, dataFactoryTag, dataFactoryFotos, dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryCeo, dataFactorySyncFS, dataFactoryDropbox) {

    //console.warn('dataFactoryImportFotos ceo: ', dataFactoryCeo.getCurrentModel);

    var dataFactoryImportFotos = {};

    //var aantalSporen = 0;
    var aantalFotos = 0;
    var aantalImports = 0;
    var importsDone = 0;
    //var trackId = '';
    //var fileNaam = '';
    var fotoModel;

    //
    //  *************************************
    //  Custom code FOTO Start
    //  *************************************
    function kopieerFotoFile(oldFotoId, fotoId, fileNaam, extension) {

      var q = $q.defer();

      //console.warn('dataFactoryImportFotos kopieerFotoFile oldFotoId, fotoId, fileNaam, extension: ', oldFotoId, fotoId, fileNaam, extension);

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Importeren Foto....<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
      });
      dataFactoryDropbox.login().then(function () {

        dataFactoryDropbox.download('/Fotos/' + oldFotoId + '.b64').then(function (downloadresult) {
          //console.log('Importeren downloadFotoFile: ', downloadresult);

          var base64String = downloadresult.data.replace('data:image/jpg;base64,', '');

          var binaryImg = $window.atob(base64String);
          var length = binaryImg.length;
          var ab = new ArrayBuffer(length);
          var ua = new Uint8Array(ab);
          for (var i = 0; i < length; i++) {
            ua[i] = binaryImg.charCodeAt(i);
          }

          //console.log('Importeren image: ', ab);

          dataFactorySyncFS.upLoadFotoDesktop(fotoId + '.' + extension, ab).then(function (result) {
            //console.log('dataFactoryImportFotos kopieerFotoFile backend result: ', result);
            dataFactoryFotos.getFotoSrc(localStorage.getItem('authentication_id'), '', fotoId, extension).then(function(result) {
              //console.log('kopieerFotoFile getFotoSrc with: ', localStorage.getItem('authentication_id'), 'fotos', fotoId, extension);
              //console.log('kopieerFotoFile getFotoSrc result: ', result);
              $ionicLoading.hide();
              q.resolve();
            });
          });
        });
      }).catch(function (err) {
        //console.error('FotoDropboxCtrl login ERROR: ', err);
        q.reject();
      });

      return q.promise;
    }

    function composeNameTekst(feature) {

      //console.log('loop uniq feature.properties: ', feature);
      //console.log('loop uniq feature.properties.desc: ', feature.properties.desc);

      var startIndexName, startIndexDesc, startIndexTime, startIndexId, startIndexTrackId;
      var name, name1, name2, name3, name4, name5;
      var tekst, tekst1, tekst2, tekst3, tekst4, tekst5;
      var id, id1, id2, id3, id4, id5;
      var trackid, trackid1, trackid2, trackid3, trackid4, trackid5;

      if (feature.properties.name.length > 0) {
        name = feature.properties.name;
      }
      //console.log('Slits de diverse props into vars: ', feature.properties.desc);
      if (feature.properties.desc) {
        startIndexName = feature.properties.desc.lastIndexOf('name=');
        startIndexDesc = feature.properties.desc.lastIndexOf('desc=');
        startIndexTime = feature.properties.desc.lastIndexOf('time=');
        startIndexId = feature.properties.desc.lastIndexOf('id=');
        startIndexTrackId = feature.properties.desc.lastIndexOf('trackid=');
        //console.log('startIndexName: ', startIndexName);
        //console.log('startIndexDesc: ', startIndexDesc);
        //console.log('startIndexTime: ', startIndexTime);
        //console.log('startIndexId: ', startIndexId);
        //console.log('startIndexTrackId: ', startIndexTrackId);

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
        //console.log('name: ', name);
        //console.log('name1: ', name1);
        //console.log('name2: ', name2);
        //console.log('name3: ', name3);
        //console.log('name4: ', name4);
        //console.log('name5: ', name5);
        //console.log('tekst: ', tekst);
        //console.log('tekst1: ', tekst1);
        //console.log('tekst2: ', tekst2);
        //console.log('tekst3: ', tekst3);
        //console.log('tekst4: ', tekst4);
        //console.log('tekst5: ', tekst5);
        //console.log('id1: ', id1);
        //console.log('id2: ', id2);
        //console.log('id3: ', id3);
        //console.log('id4: ', id4);
        //console.log('id5: ', id5);
        //console.log('trackid1: ', trackid1);
        //console.log('trackid2: ', trackid2);
        //console.log('trackid3: ', trackid3);
        //console.log('trackid4: ', trackid4);
        //console.log('trackid5: ', trackid5);

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
        //console.log('name: ', name);
        //console.log('tekst: ', tekst);
        //console.log('id: ', id);
        //console.log('trackid: ', trackid);

        var indexNaam = name.lastIndexOf('\n');
        if (indexNaam !== -1) {
          name = name.substr(0, indexNaam);
        }
        var indexTekst = tekst.lastIndexOf('\n');
        if (indexTekst !== -1) {
          tekst = tekst.substr(0, indexTekst);
        }
        var indexId = id.lastIndexOf('\n');
        if (indexId !== -1) {
          id = id.substr(0, indexId);
        }
        var indexTrackId = trackid.lastIndexOf('\n');
        if (indexTrackId !== -1) {
          trackid = trackid.substr(0, indexTrackId);
        }

        //console.log('name: ', name);
        //console.log('tekst: ', tekst);
        //console.log('id: ', id);
        //console.log('trackid: ', trackid);

        return {
          name: name,
          tekst: tekst,
          id: id,
          trackid: trackid
        };
      }
    }

    // eslint-disable-next-line no-unused-vars
    dataFactoryImportFotos.doImporterenFotos = function (geojson, fileNaam, tagId) {

      //console.log('dataFactoryImportFotos doImporterenFotos fileNaam: ', fileNaam);

      var fotoModel;

      loDash.each(geojson.features, function (feature) {

        //console.log('Foto Importeren geojson feature: ', JSON.stringify(feature));

        var fotoParams = composeNameTekst(feature);
        var featureNaam = fotoParams.name;
        var featureTekst = fotoParams.tekst;
        var oldFotoId = fotoParams.id;

        var trackId = '';
        var extension = 'jpg';

        if (feature.properties.name) {
          //console.log('dataFactoryImportFotos feature.properties.name: ', feature.properties.name);
          tmp = feature.properties.name.split('.').pop();
          if (tmp !== feature.properties.name) {
            extension = tmp;
          }
          //console.log('dataFactoryImportFotos extension: ', extension);
          var name = feature.properties.name.replace(extension, '');
          //console.log('dataFactoryImportFotos name: ', name);
        }
        //
        //  Laden foto en uploaden naar FS of website
        //
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        //console.log('dataFactoryImportFotos locatie lat, lng: ', lat, lng);

        //dataFactoryFoto.enableSyncUp = false;

        fotoModel = new dataFactoryFoto.Model();
        fotoModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        fotoModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        fotoModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        fotoModel.set('avatarColor', tmp[0]);
        fotoModel.set('avatarLetter', tmp[1]);
        fotoModel.set('avatarInverse', tmp[2]);
        fotoModel.set('naam', featureNaam);
        fotoModel.set('tekst', featureTekst);
        fotoModel.set('fotoId', '');
        fotoModel.set('trackId', trackId);
        fotoModel.set('extension', extension);
        fotoModel.set('lat', lat);
        fotoModel.set('lng', lng);
        fotoModel.set('xprive', true);
        fotoModel.set('yprive', false);
        //console.log('dataFactoryImportFotos fotoModel save: ', fotoModel);
        fotoModel.save().then(function () {
          fotoModel.set('fotoId', fotoModel.get('Id'));
          fotoModel.save();

          //console.log('dataFactoryImportFotos saved fotoModel: ', fotoModel);

          var fotoId = fotoModel.get('Id');

          kopieerFotoFile(oldFotoId, fotoId, fileNaam, extension).then(function() {

            var fotoSupModel = new dataFactoryFotoSup.Model();
            fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            fotoSupModel.set('fotoId', fotoId);
            fotoSupModel.set('xnew', false);
            fotoSupModel.save().then(function () {

              if (!fotoModel.xData) {
                fotoModel.xData = {};
              }
              if (!fotoModel.xData.tags) {
                fotoModel.xData.tags = [];
              }

              if (tagId !== '') {

                var found = loDash.find(dataFactoryFotoTag.store, function (fotoTagModel) {
                  return fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('tagId') === tagId;
                });

                if (!found) {
                  var fotoTagModel = new dataFactoryFotoTag.Model();
                  fotoTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
                  fotoTagModel.set('fotoId', fotoId);
                  fotoTagModel.set('tagId', tagId);
                  fotoTagModel.set('xprive', true);
                  fotoTagModel.save().then(function () {

                    //console.log('dataFactoryImportFotos nieuwe FOTOTAG: ', fotoTagModel);

                    var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                      return tagModel.get('Id') === tagId;
                    });

                    if (tagModel) {

                      //console.log('importFotos voeg label toe aan fotoModel: ', tagModel.get('tag'), fotoModel.get('naam'));

                      $rootScope.$emit('fotoAddLabel', {
                        fotoModel: fotoModel,
                        tagModel: tagModel
                      });

                      fotoTagModel.xData = tagModel;
                      fotoModel.xData.tags.push(fotoTagModel);
                    }
                    //dataFactoryFoto.enableSyncUp = true;
                    dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
                  }).catch(function () {
                    //dataFactoryFoto.enableSyncUp = true;
                    dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
                  });
                } else {

                  var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === found.tagId;
                  });

                  if (tagModel) {
                    found.xData = tagModel;
                  }
                  //dataFactoryFoto.enableSyncUp = true;
                  dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
                }
              } else {
                //dataFactoryFoto.enableSyncUp = true;
                dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
              }
            }).catch(function() {
              //dataFactoryFoto.enableSyncUp = true;
              dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
            });
          }).catch(function() {
            //dataFactoryFoto.enableSyncUp = true;
            dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
          });
        }).catch(function() {
          //dataFactoryFoto.enableSyncUp = true;
          dataFactoryImportFotos.closeImporteren(fileNaam, fotoModel);
        });
      });
    };

    dataFactoryImportFotos.closeImporteren = function (fileNaam, model) {

      fotoModel = model;
      if (!fotoModel.xData) {
        fotoModel.xData = {};
      }

      //console.warn('dataFactoryImportFotos.closeImporteren importsDone, aantalImports: ', importsDone, aantalImports);

      importsDone = importsDone + 1;

      if (importsDone >= aantalImports) {

        //console.error('dataFactoryImportFotos alles binnen');

        $ionicLoading.hide();

        $ionicPopup.confirm({
          title: 'Importeren Foto\'s',
          content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>importeren gereed',
          buttons: [{
            text: '<b>OK</b>',
            onTap: function () {
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
          }]
        });
      }
    };

    dataFactoryImportFotos.tagsAdd = function (fotoModel, tagModel) {

      //console.warn('dataFactoryImportFotos');


      tags = loDash.find(dataFactoryFoto.tags, function (tag) {

        //console.log('FotosSideMenuCtrl toevoegen loop dataFactoryFoto.tags: ', tag.tagModel);

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

        //console.log('FotosSideMenuCtrl tag nog niet aanwezig INSERT, eerste id: ', fotoModel.get('Id'), dataFactoryFoto.tags, nieuwTag);

        dataFactoryFoto.tags.push(nieuwTag);

      } else {
        //
        // Zoja, dan fotoModel.Id toevoegen in ids van $scoep.data.tags
        //
        //console.log('FotosSideMenuCtrl tag aanwezig UPDATE: ', tags, fotoModel.get('Id'));
        //
        // fotoModel.Id toevoegen aan tag.ids tabel. tag is de label in het sidemenu
        //
        loDash.remove(tags.ids, function (Id) {
          return Id === fotoModel.get('Id');
        });
        tags.ids.push(fotoModel.get('Id'));

        //console.log('FotosSideMenuCtrl tag nog niet aanwezig INSERT, nieuwe id: ', fotoModel.get('Id'), dataFactoryFoto.tags);

      }
    };

    dataFactoryImportFotos.koppelTag = function (tag) {

      //console.log('dataFactoryImportFotos koppelTag tag: ', tag);

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

          //console.log('dataFactoryImportFotos koppelTag tag: ', tagModel.get('Id'));
          q.resolve(tagId);

        });

      } else {
        var tagId = found.get('Id');
        q.resolve(tagId);
      }

      return q.promise;

    };

    dataFactoryImportFotos.start = function (fileNaam, downloadresult, label) {

      //console.warn('dataFactoryImportFitis.start fileNaam, downloadResult, label');

      var tagId = '';

      var dom = new DOMParser().parseFromString(downloadresult.data, 'text/xml');
      var geojson = toGeoJSON.gpx(dom);
      //console.log('dataFactoryImportFotos download SUCCESS result geojson object: ', geojson);

      aantalFotos = geojson.features.length;

      var gegevens = '';

      if (aantalFotos > 0) {
        gegevens = gegevens + 'Aantal Foto\'s: ' + aantalFotos + '<br>';
      }
      if (label !== '') {
        gegevens = gegevens + '<br>Label: ' + label + '<br>';
      }

      aantalImports = aantalFotos;
      importsDone = 0;

      $ionicLoading.hide();

      $ionicPopup.confirm({
        title: 'Importeren Fotos',
        content: '<span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>' + gegevens,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Start importeren</>',
          type: 'button-positive',
          onTap: function () {
            //
            if (label !== '') {
              dataFactoryImportFotos.koppelTag(label).then(function (tagId) {
                //console.log('ImportFotos tagId: ', tagId);
                dataFactoryImportFotos.doImporterenFotos(geojson, fileNaam, tagId);
              });
            } else {
              dataFactoryImportfotos.doImporterenFotos(geojson, fileNaam, '');
            }
          }
        }]
      });
    };

    dataFactoryImportFotos.setType = function (type) {
      //console.log('dataFactoryImportFotos setType: ', type);
      dataFactoryImportFotos.type = type;
    };

    return dataFactoryImportFotos;
  }
]);
