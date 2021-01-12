/* eslint-disable no-undef */
'use strict';
// eslint-disable-next-line no-undef
trinl.controller('DoelgroepenSideMenuCtrl', ['loDash', '$q', '$scope', '$timeout', '$interval', '$ionicLoading', 'dataFactorySync', 'dataFactoryDoelgroep',
  function (loDash, $q, $scope, $timeout, $interval, $ionicLoading, dataFactorySync, dataFactoryDoelgroep) {

    //console.warn('DoelgroepenSideMenuCtrl start');

    $scope.listDeelnemersfromSideMenu = function (doelgroepModel) {
      console.warn('DoelgroepenSideMenuCtrl listDeelnemers van doelgroep: ', doelgroepModel.get('doelgroepNaam'));
    };

    $scope.editDoelgroepfromSideMenu = function (doelgroepModel) {
      console.warn('DoelgroepenSideMenuCtrl editDoelgroep: ', doelgroepModel.get('doelgroepNaam'));
    };

    $scope.deleteDoelgroepfromSideMenu = function (doelgroepModel) {
      console.warn('DoelgroepenSideMenuCtrl deleteDoelgroep: ', doelgroepModel.get('doelgroepNaam'));
    };

    function refresh() {

      //console.warn('DoelgroepenSideMenuCtrl refresh');

      $q.all([
        dataFactoryDoelgroep.syncUp()
      ]).then(function () {
        //console.warn('DoelgroepenSideMenuCtrl refresh syncUps SUCCES');
        $q.all([
          dataFactoryDoelgroep.syncDown()
        ]).then(function () {
          //console.warn('DoelgroepenSideMenuCtrl refresh syncDown SUCCES: ', dataFactoryDoelgroep.store);
          $scope.doelgroepen = loDash.uniqBy(dataFactoryDoelgroep.store, function (doelgroepModel) {
            return doelgroepModel.get('doelgroepNaam');
          });
          //console.warn('DoelgroepenSideMenuCtrl refresh updateStores uniqBy SUCCES: ', $scope.doelgroepen);
        });
      });
    }

    function reload() {

      //console.warn('DoelgroepenSideMenuCtrl reload');

      var timeuit = $timeout(function () {
        //console.warn('DoelgroepenSideMenuCtrl reload timeout');
        $ionicLoading.hide();
      }, 8000);

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner> <br/>Doelgroep gegevens bijwerken<br><br>Een ogenblik geduld...'
      });

      $q.all([
        dataFactorySync.updateStore(dataFactoryDoelgroep)
      ]).then(function () {
        //console.warn('DoelgroepenSideMenuCtrl refresh updateStores SUCCES: ', dataFactoryDoelgroep.store);
        $scope.doelgroepen = loDash.uniqBy(dataFactoryDoelgroep.store, function (doelgroepModel) {
          return doelgroepModel.get('doelgroepNaam');
        });
        //console.warn('DoelgroepenSideMenuCtrl refresh updateStores uniqBy SUCCES: ', $scope.doelgroepen);
        $timeout.cancel(timeuit);
        $ionicLoading.hide();
      });
    }

    reload();

    $interval(function () {
      refresh();
    }, 10000);
    /**
     * Update de lijst met Locaties
     * Input: syncDown = false dan is syncdown reeds gebeurd
     */
    $scope.doRefresh = function () {

      refresh();

      //console.error('DoelgroepenCtrl doRefresh broadcast reFreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
  }
]);
