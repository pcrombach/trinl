/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('TrackDropboxCtrl', ['loDash', '$scope', 'dataFactoryDropbox', '$ionicPopup', '$ionicLoading', 'dataFactoryImportTracks',
  function (loDash, $scope, dataFactoryDropbox, $ionicPopup, $ionicLoading, dataFactoryImportTracks) {

    console.log('TrackDropboxCtrl');

    var fileNaam = '';

    $scope.folders = [];
    $scope.depth = 0;
    $scope.path_display = '';
    $scope.padje = '';

    var event0 = $scope.$on('$ionicView.enter', function () {
      //console.log('TrackDropboxCtrl $ionicView.enter');

      $scope.path_display = '';
      $scope.padje = '';
      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });
        //console.log('TrackDropboxCtrl: ', dataFactoryDropbox.type);
        dataFactoryDropbox.getFolders(dataFactoryDropbox.type).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth = 0;
          //console.log('TrackDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          /*
          $ionicPopup.alert({
            title: 'Dropbox probleem',
            template: 'Dropbox kan bestanden niet lezen. Waarschijnlijk is Dropbox niet meer gekoppeld aan TRINL.<br><br><span class="trinl-rood">' + err.data.error['.tag'] + '</span><br><br>Probeer met Dropbox ontkoppelen en opnieuw koppelen'
          });
          */
          console.error('TrackDropboxCtrl getFolders ERROR: ', err);
          $ionicLoading.hide();
        });
      }).catch(function () {

      });
    });
    $scope.$on('$destroy', event0);

    $scope.downloadFile = function (folderPath) {

      console.log('TrackDropboxCtrl downloadFile folderPath: ', folderPath);

      // eslint-disable-next-line no-useless-escape
      fileNaam = folderPath.path_lower.replace(/^.*[\\\/]/, '');

      dataFactoryImportTracks.koppelTag(fileNaam).then(function () {

        var re = /(?:\.([^.]+))?$/;
        if (re.exec(fileNaam)[1] === 'gpx') {

          fileNaam = fileNaam.replace('.gpx', '');

          dataFactoryDropbox.login().then(function () {


            dataFactoryDropbox.download(folderPath.path_lower).then(function (downloadresult) {

              $scope.popup = {};
              $scope.popup.tag = fileNaam;

              $ionicPopup.show({
                template: '<input type="text" ng-model="popup.tag">',
                title: 'Importeren Sporen Wijzigen label',
                scope: $scope,
                buttons: [{
                  text: '<b>Bevestigen</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                    if (!$scope.popup.tag) {
                      dataFactoryImportTracks.start(fileNaam, downloadresult, '');
                      e.preventDefault();
                    } else {
                      console.log('TrackDropboxCtrl Label gewijzigd in: ', $scope.popup.tag);
                      dataFactoryImportTracks.start(fileNaam, downloadresult, $scope.popup.tag);
                    }
                  }
                }]
              });
            });
          });
        } else {

          console.error('folderPath heeft geen extension gpx');

          $ionicPopup.confirm({
            title: 'Importeren Spoor GPX',
            content: '<br>is geen .gpx-bestand',
            buttons: [{
              text: '<b>Annuleer</b>',
            }]
          });
        }
      });
    };

    $scope.openFolder = function (path) {
      //console.log('TrackDropboxCtrl openFolder: ', path.path_display);
      $scope.path_display = path.path_lower.replace('/locaties/', '');
      $scope.padje = '(' + $scope.path_display + ')';
      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });

        //console.log('TrackDropboxCtrl getFolders: ', path.path_lower);
        dataFactoryDropbox.getFolders(path.path_lower).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth++;
          //console.log('TrackDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          console.error('TrackDropboxCtrl getFolders lower ERROR: ', err);
          $ionicLoading.hide();
        });
      });
    };

    $scope.goBack = function () {
      //console.log('TrackDropboxCtrl goBackFolder');
      dataFactoryDropbox.login().then(function () {
        //console.log('TrackDropboxCtrl login');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });
        dataFactoryDropbox.goBackFolder().then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth--;
          if ($scope.depth === 0) {
            $scope.padje = '';
          }
          //console.log('TrackDropboxCtrl goBackFolder SUCCESS result: ', $scope.folders, result);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        }).catch(function (err) {
          console.error('TrackDropboxCtrl goBackFolder lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        });
      });
    };

    $scope.doRefresh = function () {
      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        //console.log('TrackDropboxCtrl before doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });
        //console.log('TrackDropboxCtrl getFolders path: ', dataFactoryDropbox.type + '/' + $scope.path_display);
        dataFactoryDropbox.getFolders(dataFactoryDropbox.type + '/' + $scope.path_display).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          //console.log('TrackDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('TrackDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        }).catch(function (err) {
          console.error('TrackDropboxCtrl getFolders lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('TrackDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        });
      });
    };

  }
]);
