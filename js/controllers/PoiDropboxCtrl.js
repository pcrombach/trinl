/* eslint-disable no-unused-vars */
'use strict';
// eslint-disable-next-line no-undef
trinl.controller('PoiDropboxCtrl', ['loDash', '$scope', '$q', 'dataFactoryDropbox', '$ionicPopup', '$ionicLoading', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactoryImportPois',
  function (loDash, $scope, $q, dataFactoryDropbox, $ionicPopup, $ionicLoading, dataFactoryTag, dataFactoryCeo, dataFactoryImportPois) {

    //console.log('PoiDropboxCtrl');

    $scope.folders = [];
    $scope.depth = 0;
    $scope.path_display = '';
    $scope.padje = '';
    var fileNaam = '';

    var event0 = $scope.$on('$ionicView.enter', function () {

      console.log('PoiDropboxCtrl $ionicView.enter');

      $scope.path_display = '';
      $scope.padje = '';

      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met <br/> Dropbox...'
        });

        dataFactoryDropbox.getFolders(dataFactoryDropbox.type).then(function (result) {

          console.log('PoiDropboxCtrl getFolders result: ', result.data.entries);

          //loDash.remove(result.data.entries, function (entry) {
          //return entry.name.endsWith('.b64');
          //});
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth = 0;
          console.log('PoiDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          console.error('PoiDropboxCtrl getFolders ERROR: ', err);
          $ionicLoading.hide();
        });

      }).catch(function (err) {
        console.error('PoiDropboxCtrl login ERROR: ', err);
        $ionicLoading.hide();
      });
    });
    $scope.$on('$destroy', event0);

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

    $scope.downloadFile = function (folderPath) {

      console.log('PoiDropboxCtrl downloadFile folderPath: ', folderPath);

      // eslint-disable-next-line no-useless-escape
      fileNaam = folderPath.path_lower.replace(/^.*[\\\/]/, '');

      //dataFactoryImportFotos.koppelTag(fileNaam).then(function () {

      var re = /(?:\.([^.]+))?$/;
      if (re.exec(fileNaam)[1] === 'gpx') {

        fileNaam = fileNaam.replace('.gpx', '');
        //
        //  fileNaam is de naam van de gekozen .gpx
        //  
        dataFactoryDropbox.login().then(function () {

          dataFactoryDropbox.download(folderPath.path_lower).then(function (downloadresult) {
            $scope.popup = {};
            $scope.popup.tag = fileNaam;

            $ionicPopup.show({
              template: '<input type="text" ng-model="popup.tag">',
              title: 'Importeren Locaties Wijzigen label',
              scope: $scope,
              buttons: [{
                text: '<b>Bevestigen</b>',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.popup.tag) {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Analyseren import<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
                    });
                    dataFactoryImportPois.start(fileNaam, downloadresult, '');
                    e.preventDefault();
                  } else {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Analyseren import<br><br><span class="trinl-rood"><b>' + fileNaam + '</b></span><br><br>Een ogenblik geduld aub...'
                    });

                    console.log('TrackDropboxCtrl Label gewijzigd in: ', $scope.popup.tag);
                    dataFactoryImportPois.start(fileNaam, downloadresult, $scope.popup.tag);
                  }
                }
              }]
            });
          });
        }).catch(function (err) {
          console.error('PoiDropboxCtrl login ERROR: ', err);
        });
      } else {

        console.error('folderPath heeft geen extension gpx');

        $ionicPopup.confirm({
          title: 'Importeren Locaties',
          content: '<br>Dit is geen .gpx-bestand',
          buttons: [{
            text: '<b>Annuleer</b>',
          }]
        });
      }
    };

    $scope.openFolder = function (path) {
      //console.log('PoiDropboxCtrl openFolder: ', path.path_display);
      $scope.path_display = path.path_lower.replace('/locaties/', '');
      $scope.padje = '(' + $scope.path_display + ')';
      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        console.log('PoiDropboxCtrl dowbloadFile');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });

        dataFactoryDropbox.getFolders(path.path_lower).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth++;
          //console.log('PoiDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $ionicLoading.hide();
        }).catch(function (err) {
          //console.error('PoiDropboxCtrl getFolders lower ERROR: ', err);
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        console.error('PoiDropboxCtrl login ERROR: ', err);
      });
    };

    $scope.goBack = function () {
      //console.log('PoiDropboxCtrl goBackFolder');
      dataFactoryDropbox.login().then(function () {
        //console.log('PoiDropboxCtrl login');
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });

        dataFactoryDropbox.goBackFolder().then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth--;
          console.log('FotoDropboxCtrl goBackFolder SUCCESS: ', $scope.folders);
          if ($scope.depth === 0) {
            $scope.padje = '';
          }
          //console.log('PoiDropboxCtrl goBackFolder SUCCESS result: ', $scope.folders, result);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        }).catch(function (err) {
          //console.error('PoiDropboxCtrl goBackFolder lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        console.error('PoiDropboxCtrl login ERROR: ', err);
      });
    };

    $scope.doRefresh = function () {

      $scope.folders = [];

      dataFactoryDropbox.login().then(function () {
        //console.log('PoiDropboxCtrl before doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Synchroniseren met Dropbox...'
        });
        //console.log('PoiDropboxCtrl getFolders path: ', dataFactoryDropbox.type + '/' + $scope.path_display);
        dataFactoryDropbox.getFolders(dataFactoryDropbox.type + '/' + $scope.path_display).then(function (result) {
          $scope.folders = loDash.sortBy(result.data.entries, 'name');
          $scope.depth = 0;
          //console.log('PoiDropboxCtrl getFolders SUCCESS: ', $scope.folders);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('PoiDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('PoiDropboxCtrl getFolders lower ERROR: ', err);
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          //console.log('PoiDropboxCtrl after doRefresh History: ', dataFactoryDropbox.folderHistory, dataFactoryDropbox.folderHistory.length);
        });
      }).catch(function (err) {
        console.error('PoiDropboxCtrl login ERROR: ', err);
      });
    };
  }
]);
