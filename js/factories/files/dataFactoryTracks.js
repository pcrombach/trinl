/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryTracks', ['BASE', 'loDash', '$cordovaFile', '$cordovaFileTransfer', '$cordovaNetwork', '$location', '$ionicPlatform', '$ionicPopup', '$ionicLoading', '$q', '$http', 'dataFactoryAlive', 'dataFactoryDropbox',
  function (BASE, loDash, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $location, $ionicPlatform, $ionicPopup, $ionicLoading, $q, $http, dataFactoryAlive, dataFactoryDropbox) {

    //.warn('dataFactoryTracks');

    var dataFactoryTracks = {};

    //    var tracksupModel, trackModel;

    if (dataFactoryAlive.status === 0) {
      dataFactoryAlive.status = 4;
    }

    var urlBase = 'https://www.pcmatic.nl/';

    if ($location.$$host === '') {
      urlBase = BASE.URL;
    }
    if ($location.$$host === 'localhost') {
      urlBase = 'http://localhost/';
    }
    if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
      urlBase = 'https://www.trinl.nl/';
    }
    if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
      urlBase = 'https://www.pcmatic.nl/';
    }

    //console.log('dataFactoryTracks urlBase: ', urlBase);


    var options = {
      creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
    };

    dataFactoryTracks.Geoposition = {};
    dataFactoryTracks.trackingDataIndex = 0;

    dataFactoryTracks.recording = false;
    dataFactoryTracks.trackId = '';

    dataFactoryTracks.clearGPX = function () {

      //console.warn('dataFactoryTracks clearTrack');
      //
      // Start opnieuw met een lege track
      //
      dataFactoryTracks.Geoposition = {};
      //dataFactoryTracks.Geoposition.type = 'FeatureCollection';
      //dataFactoryTracks.Geoposition.features = [];
    };

    dataFactoryTracks.openGPX = function () {

      //console.warn('dataFactoryTracks openTrack');

      dataFactoryTracks.clearGPX();

    };

    dataFactoryTracks.recordGPX = function (trackData) {

      dataFactoryTracks.Geoposition = trackData;
      //console.log('dataFactoryTracks.Geoposition.features: ', dataFactoryTracks.Geoposition);

    };

    dataFactoryTracks.closeGPX = function (exportNaam) {

      //console.log('dataFactoryTracks.Geoposition: ', dataFactoryTracks.Geoposition);

      dataFactoryDropbox.login().then(function () {

        // eslint-disable-next-line no-undef
        var gpxdata = togpx(dataFactoryTracks.Geoposition, options);
        //console.log('Export locaties .gpx: ', gpxdata);

        dataFactoryDropbox.upload(gpxdata, exportNaam + '.gpx').then(function (result) {
          //console.warn('dataFactoryTracks.Geoposition upload SUCCESS: ', result);
          $ionicPopup.confirm({
            title: 'Exporteren GPX',
            content: '<span class="trinl-rood"><b>' + exportNaam + '.gpx</b></span><br><br>exporteren gereed',
            buttons: [{
              text: '<b>OK</b>'
            }]
          });

          $ionicLoading.hide();

        }).catch(function (err) {
          //console.error('dataFactoryTracks.Geoposition upload ERROR: ', err);
          $ionicLoading.hide();
        });
      });
    };

    dataFactoryTracks.data = {};

    //var options = {};
    var trinlFileDir;

    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }

      function getTrackSrcFS(clientPath) {
        //console.warn('dataFactoryTracks.getTrackSrcFS: ', clientPath);

        var q = $q.defer();

        function download(clientPath) {
          $ionicPlatform.ready(function () {
            if ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) {
              var hostPath = urlBase + 'gebruikers/' + clientPath.replace(trinlFileDir, '');
              //console.log('dataFactoryTracks.getTrackSrcFS download Track FROM: ' + hostPath + ' TO ' + clientPath);
              $cordovaFileTransfer.download(hostPath, clientPath, downOptions, true).then(
                function () {
                  //console.log('dataFactoryTracks.getTrackSrcFS download track DWONLOAD SUCCESS USE: ', clientPath);
                  q.resolve(clientPath);
                },
                function (err) {
                  //console.error('dataFactoryTracks.getTrackSrcFS download track ERROR Code: ', err.code, clientPath);
                  q.resolve(clientPath);
                }
              );
            } else {
              //console.error('dataFactoryTracks.getTrackSrcFS download track on DESKTOP OR NOT ONLINE USE: ', clientPath);
              q.resolve(clientPath);
            }
          });
        }

        //console.log('dataFactoryTracks check track clientPath: ', clientPath);

        $cordovaFile.checkFile(trinlFileDir, clientPath.replace(trinlFileDir, '')).then(
          function () {
            q.resolve(clientPath);
          },
          function () {
            //console.log('dataFactoryTracks track clientPath NOT FOUND first download track: ', clientPath);
            download(clientPath);
          }
        );

        return q.promise;
      }

      dataFactoryTracks.getTrackSrc = function (gebruikerId, dir, trackId, extension) {
        //console.warn('dataFactoryTracks.getTrackSrc: ' + gebruikerId + ' ==>' + dir + ' ==> ' + trackId + ' ==> ' + extension);

        var q = $q.defer();

        //console.warn('dataFactoryTracks.getTrackSrc geen dir');
        $cordovaFile.checkDir(trinlFileDir, gebruikerId + '/tracks').then(
          function () {},
          function () {
            $cordovaFile.createDir(trinlFileDir, gebruikerId + '/tracks', false);
          }
        );

        var path;

        if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
          path = urlBase + 'gebruikers/' + gebruikerId + '/tracks/' + trackId + '.' + extension;
          //console.warn('dataFactoryTracks.getTrackSrc for DESKTOP USE: ', path);

          q.resolve(path);
        } else {
          path = trinlFileDir + gebruikerId + '/tracks/' + trackId + '.' + extension;
          //console.warn('dataFactoryTracks.getTrackSrc for MOBILE USE: ', path);

          getTrackSrcFS(path).then(
            function (src) {
              //console.log('dataFactoryTracks.getTrackSrc FS USE: ', src);

              q.resolve(src);
            },
            function () {
              q.reject();
            }
          );
        }

        return q.promise;
      };


      function load(url) {

        var q = $q.defer();

        //console.log('dataFactoryTracks.load url: ', url);

        $http.get(url).success(function (layer) {
          //console.log('dataFactoryTracks get track SUCCESS: ', url);
          q.resolve(layer);
        }).error(function (err) {
          //console.error('Loading track ERROR: ', url, err);
          q.reject(err);
        });

        return q.promise;
      }

      function loadFS(clientPath) {

        //console.log('Start loading track clientPath: ', clientPath);

        var q = $q.defer();

        function loadTrack(clientPath) {
          //console.log('loadTrack: ' + trinlFileDir, clientPath.replace(trinlFileDir, ''));
          $cordovaFile.readAsText(trinlFileDir, clientPath.replace(trinlFileDir, '')).then(function (data) {
            var layer = JSON.parse(data);
            q.resolve(layer);
          }, function (err) {
            //console.error('Error reading track: ', err);
            q.resolve('read cached track ERROR');
          });
        }

        function downloadTrack(clientPath) {
          $ionicPlatform.ready(function () {
            if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline())) {
              var hostPath = urlBase + clientPath.replace(trinlFileDir, '');
              //console.log('DownloadTrack from: ' + hostPath + ' to ' + clientPath);
              $cordovaFileTransfer.download(hostPath, clientPath, options, true).then(function () {
                //console.log('DownloadTrack track success');
                loadTrack(clientPath);
              }, function (err) {
                //console.error('DownloadTrack track error Code: ', err.code);
                q.reject();
              });
            } else {
              //console.error('Error download track: ');
              q.reject();
            }
          });
        }
        $cordovaFile.checkFile(trinlFileDir, clientPath.replace(trinlFileDir, '')).then(function () {
          loadTrack(clientPath);
        }, function () {
          downloadTrack(clientPath);
        });

        return q.promise;
      }

      dataFactoryTracks.loadTrack = function (gebruikerId, trackId, extension) {

        //console.log('dataFactoryTracks.loadTrack gebruikerId, trackId, extension: ', gebruikerId, trackId, extension);

        var q = $q.defer();

        if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

          var url = urlBase + 'gebruikers/' + gebruikerId + '/tracks/' + trackId + '.' + extension;
          //var url = urlBase + gebruikerId + '/tracks/' + trackId + '.' + extension;

          //console.log('dataFactoryTracks.loadTrack url: ', url);

          load(url).then(function (layer) {
            q.resolve(layer);
          }, function () {
            q.reject();
          });
        } else {
          var clientPath = trinlFileDir + 'gebruikers/' + gebruikerId + '/tracks/' + trackId + '.' + extension;
          //var clientPath = trinlFileDir + gebruikerId + '/tracks/' + trackId + '.' + extension;

          //console.log('dataFactoryTracks.loadTrack clientPath: ', clientPath);

          loadFS(clientPath).then(function (layer) {
            q.resolve(layer);
          }, function () {
            q.reject();
          });
        }

        return q.promise;
      };
    });

    return dataFactoryTracks;

  }
]);
