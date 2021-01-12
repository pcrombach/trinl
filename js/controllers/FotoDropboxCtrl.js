/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
// eslint-disable-next-line no-undef
trinl.controller('FotoDropboxCtrl', ['loDash', '$scope', 'dataFactoryDropbox', '$ionicPopup', '$ionicLoading', 'dataFactoryImportFotos',
  function (loDash, $scope, dataFactoryDropbox, $ionicPopup, $ionicLoading, dataFactoryImportFotos) {

    //console.log('FotoDropboxCtrl');

    $scope.folders = [];
    $scope.depth = 0;
    $scope.path_display = '';
    $scope.padje = '';
    var fileNaam = '';

    var event0 = $scope.$on('$ionicView.enter', function () {

      //console.log('FotoDropboxCtrl $ionicView.enter');

      $scope.path_display = '';
      $scope.padje = '';

      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met <br/> Dropbox...'
        });

        dataFactoryDropbox.getFolders(dataFactoryDropbox.type).then(function (result) {

          //console.log('FotoDropboxCtrl getFolders result: ', result.data.entries);

          loDash.remove(result.data.entries, function (entry) {
            return entry.name.endsWith('.b64');
          });
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth = 0;
          //console.log('FotoDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          //console.error('FotoDropboxCtrl getFolders ERROR: ', err);
          $ionicLoading.hide();
        });

      }).catch(function (err) {
        //console.error('FotoDropboxCtrl login ERROR: ', err);
        $ionicLoading.hide();
      });
    });
    $scope.$on('$destroy', event0);
    /*
    function koppelTag(tag) {

      //console.log('PoiDropboxCtrl koppelTag tag: ', tag);

      var q = $q.defer();

      var found = loDash.find(dataFactoryTag.store, function (tagModel) {
        return tagModel.get('tag') === tag;
      });

      if (!found) {
        var tagModel = new dataFactoryTag.Model();
        tagModel.set('tag', tag);
        tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        tagModel.set('xprive', true);
        tagModel.save().then(function (tagModel) {

          var tagId = tagModel.get('Id');

          //console.log('PoiDropboxCtrl koppelTag tag: ', tagModel.get('Id'));
          q.resolve(tagId);

        });

      } else {
        var tagId = found.get('Id');
        q.resolve(tagId);
      }

      return q.promise;

    }
    */
    $scope.downloadFile = function (folderPath) {

      //console.log('FotoDropboxCtrl downloadFile folderPath: ', folderPath);

      // eslint-disable-next-line no-useless-escape
      fileNaam = folderPath.path_lower.replace(/^.*[\\\/]/, '');

      //dataFactoryImportFotos.koppelTag(fileNaam).then(function () {

      var re = /(?:\.([^.]+))?$/;
      if (re.exec(fileNaam)[1] === 'gpx') {

        fileNaam = fileNaam.replace('.gpx', '');

        dataFactoryDropbox.login().then(function () {

          dataFactoryDropbox.download(folderPath.path_lower).then(function (downloadresult) {

            $scope.popup = {};
            $scope.popup.tag = fileNaam;

            $ionicPopup.show({
              template: '<input type="text" ng-model="popup.tag">',
              title: 'Importeren Foto\'s Wijzigen label',
              scope: $scope,
              buttons: [{
                text: '<b>Bevestigen</b>',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.popup.tag) {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Analyseren import<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
                    });
                    dataFactoryImportFotos.start(fileNaam, downloadresult, '');
                    e.preventDefault();
                  } else {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Analyseren import<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
                    });

                    //console.log('TrackDropboxCtrl Label gewijzigd in: ', $scope.popup.tag);
                    dataFactoryImportFotos.start(fileNaam, downloadresult, $scope.popup.tag);
                  }
                }
              }]
            });
          });
        }).catch(function (err) {
          //console.error('FotoDropboxCtrl login ERROR: ', err);
        });
      } else {

        //console.error('folderPath heeft geen extension gpx');

        $ionicPopup.confirm({
          title: 'Importeren Fotos',
          content: '<br>Dit is geen .gpx-bestand',
          buttons: [{
            text: '<b>Annuleer</b>',
          }]
        });
      }
    };

    $scope.openFolder = function (path) {
      //console.log('FotoDropboxCtrl openFolder: ', path.path_display);
      $scope.path_display = path.path_lower.replace('/fotos/', '');
      $scope.padje = '(' + $scope.path_display + ')';
      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        //console.log('FotoDropboxCtrl dowbloadFile');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><b>Synchroniseren met Dropbox...'
        });

        dataFactoryDropbox.getFolders(path).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth++;
          //console.log('FotoDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          //console.error('FotoDropboxCtrl getFolders lower ERROR: ', err);
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        //console.error('FotoDropboxCtrl login ERROR: ', err);
      });
    };

    $scope.goBack = function () {
      //console.log('FotoDropboxCtrl goBackFolder');
      dataFactoryDropbox.login().then(function () {
        //console.log('FotoDropboxCtrl dowbloadFile loginresult');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });

        dataFactoryDropbox.goBackFolder().then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth--;
          //console.log('FotoDropboxCtrl goBackFolder SUCCESS: ', $scope.folders);
          if ($scope.depth === 0) {
            $scope.padje = '';
          }
          //console.log('FotoDropboxCtrl goBackFolder SUCCESS result: ', $scope.folders, result);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        }).catch(function (err) {
          //console.error('FotoDropboxCtrl goBackFolder lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        //console.error('FotoDropboxCtrl login ERROR: ', err);
      });
    };

    $scope.refresh = function () {

      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        //console.log('FotoDropboxCtrl dowbloadFile');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });
        //console.log('FotoDropboxCtrl getFolders path: ', dataFactoryDropbox.type + '/' + $scope.path_display);
        dataFactoryDropbox.getFolders().then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth = 0;
          //console.log('FotoDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('FotoDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('FotoDropboxCtrl getFolders lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('FotoDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        });
      }).catch(function (err) {
        //console.error('FotoDropboxCtrl login ERROR: ', err);
      });
    };
  }
]);
