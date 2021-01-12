/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryFotos', ['BASE', '$state', '$rootScope', '$cordovaGeolocation', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', '$cordovaNetwork', '$location', '$ionicPlatform', '$q', 'dataFactoryInstellingen', 'dataFactoryFoto', 'dataFactoryFotoSup', 'dataFactoryCeo', 'dataFactoryAlive', 'dataFactoryDropbox',
  function (BASE, $state, $rootScope, $cordovaGeolocation, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $location, $ionicPlatform, $q, dataFactoryInstellingen, dataFactoryFoto, dataFactoryFotoSup, dataFactoryCeo, dataFactoryAlive, dataFactoryDropbox) {
    //console.warn('dataFactoryFotos');

    var dataFactoryFotos = {};

    var fotosupModel, fotoModel;
    var fotoId;
    var trackId;
    var extension;

    if (dataFactoryAlive.status === 0) {
      dataFactoryAlive.status = 4;
    }
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

    //console.log('dataFactoryFotos urlBase: ', urlBase);

    var Geometry = {};
    var options = {
      creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
    };
    dataFactoryFotos.Geoposition = {};

    dataFactoryFotos.trackingDataIndex = 0;
    dataFactoryFotos.recording = false;
    dataFactoryFotos.trackId = '';

    dataFactoryFotos.clearGPX = function () {

      console.warn('dataFactoryFotos clear GPX');
      //
      // Start opnieuw met een lege GPX
      //
      dataFactoryFotos.Geoposition = {};
      dataFactoryFotos.Geoposition.type = 'FeatureCollection';
      dataFactoryFotos.Geoposition.features = [];
    };

    dataFactoryFotos.openGPX = function () {

      console.warn('Fotos openGPX');

      dataFactoryFotos.clearGPX();

    };

    dataFactoryFotos.recordGPX = function (lat, lng, name, desc, fotoId, fotoData) {

      var q = $q.defer();

      console.log('dataFactoryFotos.recordGPX lat: ', lat);
      console.log('dataFactoryFotos.recordGPX lng: ', lng);
      console.log('dataFactoryFotos.recordGPX name: ', name);
      console.log('dataFactoryFotos.recordGPX desc: ', desc);

      Geometry = {};
      Geometry.type = 'Feature';
      Geometry.geometry = {};
      Geometry.geometry.type = 'Point';
      Geometry.geometry.coordinates = new Array(2);
      Geometry.geometry.coordinates[0] = lng;
      Geometry.geometry.coordinates[1] = lat;
      Geometry.properties = {};
      Geometry.properties.name = name;
      Geometry.properties.desc = desc;
      Geometry.properties.id = fotoId;

      dataFactoryFotos.Geoposition.features.push(Geometry);

      console.log('Fotos recordGPX Geoposition.features: ', dataFactoryFotos.Geoposition.features);

      dataFactoryDropbox.login().then(function () {
        dataFactoryDropbox.upload(fotoData, fotoId + '.b64').then(function (urlFotoResult) {
          console.warn('Fotos upload base64 SUCCESS: ', urlFotoResult);
          q.resolve();
        }).catch(function (err) {
          console.error('Fotos uploadFoto base64 ERROR: ', err);
          q.resolve();
        });
      }).catch(function (err) {
        console.error('dataFactoryFotos.Geoposition upload login ERROR: ', err);
        q.resolve();
      });

      return q.promise;
    };

    dataFactoryFotos.closeGPX = function (gpxNaam) {
      console.log('Fotos closeGPX: ', dataFactoryFotos.Geoposition);
      dataFactoryDropbox.login().then(function () {
        // eslint-disable-next-line no-undef

        var gpxdata = togpx(dataFactoryFotos.Geoposition, options);
        console.log('Export locatie .gpx: ', gpxdata);

        dataFactoryDropbox.upload(gpxdata, gpxNaam + '.gpx').then(function (gpxResult) {
          console.warn('Fotos upload GPX SUCCESS: ', gpxResult);
        }).catch(function (err) {
          console.error('dataFactoryFotos.Geoposition upload ERROR: ', err);
        });
      }).catch(function (err) {
        console.error('dataFactoryFotos.Geoposition upload login ERROR: ', err);
      });
    };

    var downOptions = {
      chunkedMode: false
    };
    var trinlFileDir;
    var clientPathFotos, clientPathFotosKaart;

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }
      //
      //  getFotoSrc genereert de adressen voor de foto's
      //  input: 
      //
      dataFactoryFotos.getFotoSrc = function (gebruikerId, fotoId, extension) {

        //console.log('dataFactoryFotos.getFotoSrc gebruikerId, fotoId, extension: ', gebruikerId, fotoId, extension);

        clientPathFotos = gebruikerId + '/fotos/' + fotoId + '.' + extension;
        clientPathFotosKaart = gebruikerId + '/fotos/kaart/' + fotoId + '.' + extension;

        //console.log('dataFactoryFotos.getFotoSrc clientPathFotos, clientPathFotosKaart: ', clientPathFotos, clientPathFotosKaart);

        var path, pathKaart;

        var q = $q.defer();
        //
        //  Controleer of de foto's reeds zijn gedwonload baar TRINL-cache
        //
        $cordovaFile.checkDir(trinlFileDir, gebruikerId + '/fotos/kaart').then(function () {
          console.warn('dataFactoryFotos.getFotoSrc mappen OK');
        }).catch(function () {
          //console.warn('dataFactoryFotos.getFotoSrc CREATE mappen');
          $cordovaFile.createDir(trinlFileDir, gebruikerId + '/fotos/', false);
          $cordovaFile.createDir(trinlFileDir, gebruikerId + '/fotos/kaart', false);
        });
        if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
          //
          //  Indien DESKTOP
          //
          //console.log('dataFactoryFotos.getFotoSrc for DESKTOP USE');
          path = urlBase + 'gebruikers/' + clientPathFotos;
          pathKaart = urlBase + 'gebruikers/' + clientPathFotosKaart;
          var result = {
            path: path,
            kaartPath: pathKaart
          };
          //console.log('dataFactoryFotos.getFotoSrc DESKTOP RESULT: ', result);
          q.resolve(result);
        } else {
          //
          //  Indien MOBIEL
          //
          clientPathFotos = gebruikerId + '/fotos/' + fotoId + '.' + extension;
          clientPathFotosKaart = gebruikerId + '/fotos/kaart/' + fotoId + '.' + extension;

          console.log('dataFactoryFotos.getFotoSrc for MOBIEL USE clientPathFotos, clientPathFotosKaart: ', clientPathFotos, clientPathFotosKaart);

          (function (result, clientPathFotos, clientPathFotosKaart) {

            getFotoSrcFS(clientPathFotos, clientPathFotosKaart).then(function (result) {

              console.log('dataFactoryFotos.getFotoSrc MOBIEL result: ', result);
              q.resolve(result);
            }).catch(function () {
              q.reject();
            });

          })(result, clientPathFotos, clientPathFotosKaart);
        }

        return q.promise;
      };
    });

    function getFotoSrcFS(clientPathFotos, clientPathFotosKaart) {

      console.warn('getFotoSrcFS');
      var result = {};
      result.path = trinlFileDir + clientPathFotos;
      result.kaartPath = trinlFileDir + clientPathFotosKaart;

      var q = $q.defer();

      function downloadFoto(clientPathFotos) {

        var q = $q.defer();

        console.log('downloadFoto START download fotos clientPathFotos: ', clientPathFotos);
        var hostPath = urlBase + 'gebruikers/' + clientPathFotos;
        //
        //  Ook de foto Downloaden naar TRINL-cache
        //
        console.log('downloadFoto downloading foto FROM, TO: ', hostPath, trinlFileDir + clientPathFotos);
        //return $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPathFotos, downOptions, true);

        $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPathFotos, downOptions, true).then(function () {
          console.log('downloadFoto foto DOWNLOAD SUCCESS USE: ', trinlFileDir + clientPathFotos);
          result.path = trinlFileDir + clientPathFotos;
          q.resolve();
        }).catch(function (err) {
          console.error('downloadFoto foto ERROR Code: ', err.code, trinlFileDir + clientPathFotos);
          result.path = 'ERROR';
          q.resolve('downloadFoto foto DOWNLOAD ERROR ', err.code, trinlFileDir + clientPathFotos);
        });

        return q.promise;
      }

      function downloadFotoKaart(clientPathFotosKaart) {

        var q = $q.defer();

        console.log('downloadFotoKaart START download fotos clientPathFotosKaart: ', clientPathFotosKaart);
        var hostPath = urlBase + 'gebruikers/' + clientPathFotosKaart;
        //
        //  Foto/kaart Downloaden naar TRINL-cache
        //
        hostPath = urlBase + 'gebruikers/' + clientPathFotosKaart;
        console.log('downloadFotoKaart downloading foto/kaart FROM: ' + hostPath + ' TO ' + trinlFileDir + clientPathFotosKaart);
        //return $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPathFotosKaart, downOptions, true);

        $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPathFotosKaart, downOptions, true).then(function () {
          console.log('downloadFotoKaart downloaded foto/kaart DOWNLOAD into cache SUCCESS : ', clientPathFotosKaart);
          result.kaartPath = trinlFileDir + clientPathFotosKaart;
          q.resolve();
        }).catch(function (err) {
          console.error('downloadFotoKaart download foto/kaart ERROR Code: ', err.code, trinlFileDir + clientPathFotosKaart);
          result.pathKaart = 'ERROR';
          q.resolve('downloadFotoKaart download foto/kaart ERROR Code: ', err, trinlFileDir + clientPathFotosKaart);
        });

        return q.promise;
      }

      $cordovaFile.checkFile(trinlFileDir, clientPathFotosKaart).then(function () {
        console.log('dataFactoryFotos foto/kaart REEDS AANWEZIG in cache: ', trinlFileDir + clientPathFotosKaart);
        q.resolve(result);
      }).catch(function () {
        console.log('dataFactoryFotos foto clientPathFotosKaart NOT FOUND => downloaden foto\'s with: ', clientPathFotos);
        $q.all([
          downloadFoto(clientPathFotos),
          downloadFotoKaart(clientPathFotosKaart)
        ]).then(function () {
          console.log('dataFactoryFotos downloaden Fotos SUCCES');
          q.resolve(result);
        }).catch(function (err) {
          console.log('dataFactoryFotos downloaden Fotos ERROR: ', err);
          q.resolve('downloaden Fotos ERROR: ', err);
        });
      });

      return q.promise;
    }

    function createFotoModel() {
      var q = $q.defer();

      dataFactoryFoto.enableSyncUp = false;

      fotoModel = new dataFactoryFoto.Model();
      fotoModel.save().then(function (fotoModel) {
        console.log('MaakFotoCtrl CREATE fotoModel SUCCESS: ', fotoModel, fotoModel.get('gebruikerId'));
        fotoId = fotoModel.get('Id');
        fotoModel.set('fotoId', fotoId);
        fotoModel.set('xprive', true);
        fotoModel.set('yprive', false);
        q.resolve(fotoId);
      }).catch(function (err) {
        console.error('MaakFotoCtrl save fotoMODEL ERROR: ', err);
        q.reject();
      });

      return q.promise;
    }

    function updateFotoModel(naam, tekst, trackId, lat, lng, fotoId, extension) {
      var q = $q.defer();

      trackId = '';
      if (dataFactoryFoto.tmpArray[0]) {
        trackId = dataFactoryFoto.tmpArray[0];
      }
      console.log('dataFactoryFotos updateFotoModel trackId: ', trackId);

      fotoModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
      fotoModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
      fotoModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
      fotoModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
      var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
      fotoModel.set('avatarColor', tmp[0]);
      fotoModel.set('avatarLetter', tmp[1]);
      fotoModel.set('avatarInverse', tmp[2]);
      fotoModel.set('naam', naam);
      fotoModel.set('tekst', tekst);
      fotoModel.set('trackId', trackId);
      fotoModel.set('lat', lat);
      fotoModel.set('lng', lng);
      fotoModel.set('folder', '');
      fotoModel.set('fotoId', fotoId);
      fotoModel.set('extension', extension);
      fotoModel.set('xprive', true);
      fotoModel.set('up', false);

      dataFactoryFoto.enableSyncUp = true;
      fotoModel.save().then(function (fotoModel) {
        fotoModel.xData = {};
        fotoModel.xData.tags = [];
        fotoModel.xData.groep = '';
        console.warn('MaakFotoCtrl UPDATE fotoModel save SUCCESS: ', fotoModel, fotoModel.get('gebruikerId'));

        fotosupModel = new dataFactoryFotoSup.Model();
        fotosupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotosupModel.set('fotoId', fotoId);
        fotosupModel.set('xnew', false);
        fotosupModel.save().then(function () {
          q.resolve();
        }).catch(function (err) {
          console.log('MaakFotoCtrl UPDATE fotoSupModel ERROR: ', err);
          q.reject(err);
        });
      }).catch(function (err) {
        console.error('MaakFotoCtrl UPDATE fotoModel ERROR: ', err);
        q.resolve();
      });

      return q.promise;
    }

    function arresteerFoto(coords) {
      var lat = parseFloat(coords.latitude);
      var lng = parseFloat(coords.longitude);
      console.log('dataFactoryFotos arresteerFoto coords lat, lng FINAL: ', coords, lat, lng);

      updateFotoModel('Foto zonder naam en tekst', '', trackId, lat, lng, fotoId, extension).then(function () {

        $rootScope.$emit('fotoFilterMaakFoto');
        //$state.go('fotos.fotos');
        $cordovaCamera.cleanup();
      }).catch(function (err) {
        console.error('dataFactoryFotos arresteerFoto: ', err);

        $cordovaCamera.cleanup();
      });
    }

    function centerOnMe() {
      var q = $q.defer();

      var high = dataFactoryInstellingen.gpsEnableHighAccuracy || true;
      var gpsOptions = {
        enableHighAccuracy: high,
        timeout: 5000,
        maximumAge: 0
      };

      console.log('dataFactoryFotos centerOnMe gpsOptions: ', gpsOptions);

      $cordovaGeolocation.getCurrentPosition(gpsOptions).then(function (position) {
        console.log('centerOnMe SUCCESS: ', position.coords);
        q.resolve(position.coords);
      }).catch(function (gpsOptions) {
        console.error('MaakFotoCtrl centerOnMe ERROR coords, HighAccuracy: ', coords, gpsOptions.enableHighAccuracy);
        q.reject();
      });

      return q.promise;
    }

    dataFactoryFotos.addPicture = function () {
      var q = $q.defer();
      //
      // Haal de GPS location alvast op
      // Dit kan een tijdje duren
      //
      centerOnMe().then(function (coords) {

        createFotoModel().then(function (fotoId) {

          console.log('Fotos add Image createFotoModel SUCCES Id: ', fotoId);

          //$cordovaFile.checkFile(trinlFileDir, dataFactoryCeo.currentModel.get('Id') + '/fotos').then(function () {
          $cordovaFile.checkFile(trinlFileDir, dataFactoryCeo.currentModel.get('Id') + '/fotos/kaart/').then(function () {
          }).catch(function () {
            //$cordovaFile.createDir(trinlFileDir, dataFactoryCeo.currentModel.get('Id') + '/fotos', true);
            //});
            //}).catch(function () {
            $cordovaFile.createDir(trinlFileDir, dataFactoryCeo.currentModel.get('Id') + '/fotos', true);
            $cordovaFile.createDir(trinlFileDir, dataFactoryCeo.currentModel.get('Id') + '/fotos/kaart', true);
          });

          console.log('addImage quality: ', dataFactoryInstellingen.quality);

          var options = {
            quality: dataFactoryInstellingen.quality || 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 800,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };

          $cordovaCamera.getPicture(options).then(function (imageData) {

            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {

              console.log('Fotos getPicture onImageSuccess fileURI: ', fileURI);
              createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
              console.log('Fotos getPicture createFileEntry fileURI: ', fileURI);
              window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            function copyFile(fileEntry) {
              console.log('Fotos getPicture copyFile fileEntry: ', fileEntry);

              extension = fileEntry.toURL().substr(fileEntry.toURL().lastIndexOf('.') + 1);
              extension = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('.') + 1);
              console.log('URL: ', trinlFileDir + dataFactoryCeo.currentModel.get('Id') + '/fotos');

              window.resolveLocalFileSystemURL(trinlFileDir + dataFactoryCeo.currentModel.get('Id') + '/fotos',
                function (fileSystem2) {
                  console.log('fileSystem2: ', fileSystem2);
                  console.log('fotoId: ', fotoId);
                  console.log('extension: ', extension);

                  fileEntry.copyTo(fileSystem2, fotoId + '.' + extension, onCopySuccess, fail);
                },
                fail
              );
            }

            // eslint-disable-next-line no-unused-vars
            function onCopySuccess(entry) {
              // eslint-disable-next-line no-unused-vars
              console.log('Fotos onCopySuccess entry:', entry);
              console.log('Fotos Upload copy to FS SUCCESS');

              arresteerFoto(coords);
            }

            function fail(error) {
              if (error.code === 1) {
                error.name = 'NOT FOUND';
              }
              if (error.code === 2) {
                error.name = 'SECURITY';
              }
              if (error.code === 3) {
                error.name = 'ABORT';
              }
              if (error.code === 4) {
                error.name = 'NOT READABLE';
              }
              if (error.code === 5) {
                error.name = 'ENCODING';
              }
              if (error.code === 6) {
                error.name = 'NO MODIFICATION ALLOWED';
              }
              if (error.code === 7) {
                error.name = 'INVALID STATE';
              }
              if (error.code === 8) {
                error.name = 'SYNTAX';
              }
              if (error.code === 9) {
                error.name = 'INVALID MODIFICATION';
              }
              if (error.code === 10) {
                error.name = 'QUOTA EXCEEDED';
              }
              if (error.code === 11) {
                error.name = 'TYPE MISMATCH';
              }
              if (error.code === 12) {
                error.name = 'PATH EXISTS';
              }
              /*
              if (+ceo.profielId === 5 || +ceo.profielId === 4) {
                $ionicPopup.alert({
                  title: 'Foto opslaan',
                  content: 'MaakFotoCtrl Upload copy to FS ERROR: ' + error.name
                });
              }
              */
              console.error('MaakFotoCtrl Upload copy to FS ERROR: ' + error.name);

              dataFactoryFoto.enableSyncUp = true;
              $cordovaCamera.cleanup();
              q.reject('fail');
            }
          }).catch(function (err) {
            console.error('MaakFotoCtrl getPicture ERROR: ', err);
            dataFactoryFoto.enableSyncUp = true;
            if (fotoModel) {
              fotoModel.remove();
            }
            $cordovaCamera.cleanup();
            q.reject('fail');
          });
        }).catch(function (err) {
          console.error('MaakFotoCtrl getPicture ERROR: ', err);
          dataFactoryFoto.enableSyncUp = true;
          q.reject('fail');
        });

      }).catch(function () {
        console.error('MaakFotoCtrl centerOnMe ERROR coordinaten, enableHighAccuracy: ' + lat + '-' + lng + ' enableHighAccuracy: ' + gpsOptions.enableHighAccuracy);
        //var high = 'Nee';
        //if (gpsOptions.enableHighAccuracy) {
        //high = 'Ja';
        //}
        /*
        if (+ceo.profielId === 5 || +ceo.profielId === 4) {
          $ionicPopup.alert({
            title: 'Foto GPS Position ERROR',
            //content: 'TRINL kan de GPS-coordinaten niet vaststellen. Een foto maken is daarom niet mogelijk. GPS-coordinaten worden met de foto opgeslagen om de foto op de juiste plek op de kaart te plaatsen.'
            content: 'centerOnMe GPS ERROR coordinaten, enableHighAccuracy: ' + lat + '-' + lng + ' enableHighAccuracy: ' + high
          });
        }
        */
      });

      return q.promise;
    };

    return dataFactoryFotos;
  }
]);
