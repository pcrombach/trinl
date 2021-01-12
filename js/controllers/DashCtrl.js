/* eslint-disable no-undef */
'use strict';



// eslint-disable-next-line no-undef
trinl.controller('DashCtrl', ['$rootScope', '$scope', 'loDash', '$interval', '$timeout', 'dataFactoryCodePush', 'dataFactoryHistorie', 'dataFactoryCeo', '$ionicPlatform', '$ionicPopup',
  function ($rootScope, $scope, loDash, $interval, $timeout, dataFactoryCodePush, dataFactoryHistorie, dataFactoryCeo, $ionicPlatform, $ionicPopup) {

    console.log('DashCtrl');

    $scope.hasUpdate = false;
    $scope.preLoadingState = 'ready';
    $scope.abortTekst = '';
    $scope.uptodate = 'TRINL is up-to-date';
    $scope.info = '';

    var appVersion = '';
    var description = '';
    var currentAppVersion = '';

    var progressBar = null;

    var progress = 0;
    var downP;
    var vorigDownP;

    var event0 = $scope.$on('$ionicView.afterEnter', function () {
      console.warn('DashCtrl $ionicView.beforeEnter');
      $scope.hasUpdate = false;
      $scope.preLoadingState = 'ready';
      $scope.abortTekst = '';
      $scope.uptodate = 'TRINL is up-to-date';
      $scope.info = '';
      appVersion = '';
      description = '';
      currentAppVersion = '';
      progressBar = null;
      progress = 0;
      downP = 0;
      vorigDownP = 0;
    });
    $rootScope.$on('$destroy', event0);

    /*
    var event1 = $rootScope.$on('appVersionReady', function (event, args) {

      console.warn('AppSideMenuCtrl event appVersionReady: ', args);
      console.warn('AppSideMenuCtrl dataFactoryCeo.appVersion: ', dataFactoryCeo.appVersion);

      currentAppVersion = args.version;
      dataFactoryCodePush.appVersion = args.version;
      currentAppVersion = dataFactoryCeo.appVersion;

      console.warn('DashCtrl event appVersionReady currentAppVersion: ', currentAppVersion);

    });
    $scope.$on('$destroy', event1);
    */

    //if (ionic.Platform.isAndroid()) {
    $scope.underConstruction = false;
    //}

    dataFactoryHistorie.storeInit().then(function () {

      $scope.histories = loDash.sortBy(dataFactoryHistorie.store, 'Id');
    });

    $rootScope.$on('codePushCtrlProgress', function (event, downloadProgress) {

      if (progressBar !== null) {
        //console.error('DashCtrl downloadProgress: ', downloadProgress, progressBar);
        //console.log('Run ReceivedBytes from totalBytes ' + downloadProgress.receivedBytes + ' of ' + downloadProgress.totalBytes + ' bytes.');
        //console.log('Run Downloading Moet gedeeld door 100 voor progress-indicator: ' + parseInt(downloadProgress.receivedBytes / (downloadProgress.totalBytes / 100), 10) + ' %.');
        progress = parseInt(downloadProgress.receivedBytes / (downloadProgress.totalBytes / 100), 10) / 100;

        downP = (progress).toFixed(2);
        if (downP !== vorigDownP) {
          progressBar.animate(downP);
        }
        vorigDownP = downP;
      }
    });

    function initProgressBar() {

      console.error('DashCtrl initProgressBar: ', progressBar);
      if (progressBar === null) {
        var documentInterval = $interval(function () {
          if (document.getElementById('progressDown')) {
            $interval.cancel(documentInterval);

            $scope.preLoadingState = 'downloaden';

            progressBar = new ProgressBar.Circle(document.getElementById('progressDown'), {
              color: '#c3b600',
              strokeWidth: 6,
              trailWidth: 1,
              text: {
                value: '0'
              },
              step: function (state, bar) {
                bar.setText((bar.value() * 100).toFixed(0) + '%');
              }
            });

            console.error('DashCtrl A CodePush ProgressBar: ', progressBar);
            console.log('DashCtrl popup OK event codePushCtrlOk');

          }
        });
      }
      progress = 0;
      downP = 0;
      vorigDownP = 0;
    }

    $rootScope.$on('codePushCtrlUpdate', function (event, remotePackage) {

      console.log('DashCtrl remotePackage appVerion: ', remotePackage.appVersion);
      console.log('DashCtrl remotePackage description: ', remotePackage.description);
      console.log('DashCtrl remotePackage mandatory: ', remotePackage.isMandatory);

      var tmp = remotePackage.description.split(' ');
      appVersion = tmp[0];
      description = remotePackage.description.replace(tmp[0], '');
      
      dataFactoryCodePush.appVersion = appVersion;
      dataFactoryCodePush.description = description;

      $scope.info = '<span class="trinl-rood">Jij hebt TRINL versienr: ' + currentAppVersion + '<br><br><b>Beschikbaar is update versienr: ' + appVersion + '</b></span><br><br>Toelichting: <br><span class="trinl-blauw">' + description + '</span>';
      console.log('DashCtrl informatie: ', $scope.info);

      $scope.uptodate = 'TRINL ' + appVersion + ' is de meest recente versie';
      $scope.preLoadingState = 'informeren';
      $scope.hasUpdate = true;

      $timeout(function () {

        $ionicPopup.confirm({
          title: 'TRINL update',
          content: $scope.info,
          buttons: [{
            text: 'Later'
          }, {
            text: '<b>Start update</b>',
            type: 'button-positive',
            onTap: function () {

              dataFactoryCodePush.ctrlMode = true;
              initProgressBar();
              $rootScope.$emit('codePushCtrlOk');
            }
          }]
        });
      });
    });

    $rootScope.$on('codePushCtrlRollback', function () {
      $scope.preLoadingState = 'geenupdaterollback';
      console.log('DashCtrl No update. Former update Rollback.');
    });

    $rootScope.$on('codePushCtrlNoUpdate', function () {
      $scope.preLoadingState = 'geenupdate';
      console.log('DashCtrl TRINL is up to date.');
    });

    $rootScope.$on('codePushCtrlNoUpdateAllreadyAuto', function () {

      $scope.hasUpdate = false;
      $scope.preLoadingState = 'geenupdateauto';
      console.log('DashCtrl Een automatische update is reeds gestart.');
    });

    $rootScope.$on('codePushCtrlPackageDownloaded', function () {
      $scope.preLoadingState = 'installeren';
    });

    $rootScope.$on('codePushCtrlInstallSucces', function () {
      $scope.preLoadingState = 'done';
    });

    $scope.herstartNu = function () {
      codePush.restartApplication();
    };

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        var interval = $interval(function () {
          console.count('DashCtrl waiting for config....');
          if (!angular.equals(dataFactoryCeo, {})) {
            $interval.cancel(interval);
            currentAppVersion = dataFactoryCeo.appVersion;
            dataFactoryCodePush.appVersion = dataFactoryCeo.appVersion;
            currentAppVersion = dataFactoryCeo.appVersion;
            appVersion = dataFactoryCeo.appVersion;
            console.error('DashCtrl appVersion: ', dataFactoryCeo.appVersion);
          }
        }, 100, 200);
      }
    });

    $scope.checkForUpdates = function () {
      console.log('DashCtrl checkForUpdates');
      dataFactoryCodePush.ctrlMode = true;
      dataFactoryCodePush.doUpdate();
    };

  }
]);
