/* eslint-disable no-undef */
'use strict';
// eslint-disable-next-line no-undef
trinl.controller('DoelgroepenCtrl', ['$q', '$scope', '$timeout', '$interval', '$ionicLoading', 'dataFactoryDoelgroep', 'dataFactorySync',
  function ($q, $scope, $timeout, $interval, $ionicLoading, dataFactoryDoelgroep, dataFactorySync) {

    console.warn('DoelgroepenCtrl start');


    function refresh() {

      console.warn('DoelgroepenCtrl refresh');

      $q.all([
        dataFactoryDoelgroep.syncUp()
      ]).then(function () {
        console.warn('DoelgroepenCtrl refresh syncUps SUCCES');
        $q.all([
          dataFactoryDoelgroep.syncDown()
        ]).then(function () {
          console.warn('DoelgroepenCtrl refresh syncDown SUCCES: ', dataFactoryDoelgroep.store);
          $scope.deelnemers = dataFactoryDoelgroep.store;
          console.warn('DoelgroepenCtrl refresh updateStores uniqBy SUCCES: ', $scope.deelbeners);
        });
      });
    }

    function reload() {

      console.warn('DoelgroepenCtrl reload');

      var timeuit = $timeout(function () {
        $ionicLoading.hide();
      }, 8000);

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner> <br/>Doelgroep gegevens bijwerken<br><br>Een ogenblik geduld...'
      });

      $q.all([
        dataFactorySync.updateStore(dataFactoryDoelgroep)
      ]).then(function () {
        //console.warn('DoelgroepenCtrl refresh updateStores SUCCES: ', dataFactoryDoelgroep.store);
        $scope.deelnemers = dataFactoryDoelgroep.store;
        console.warn('DoelgroepenCtrl refresh updateStores SUCCES: ', $scope.deelnemers);
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

      console.error('DoelgroepenCtrl doRefresh broadcast reFreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
  }
]);
