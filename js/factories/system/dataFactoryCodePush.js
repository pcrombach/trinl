/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryCodePush', ['$rootScope', '$timeout', '$ionicPopup', '$ionicPlatform', 'dataFactoryAlive', 'dataFactoryHistorie', 'dataFactoryNotification',
  function ($rootScope, $timeout, $ionicPopup, $ionicPlatform, dataFactoryAlive, dataFactoryHistorie, dataFactoryNotification) {

    console.warn('dataFactoryCodePush');

    var dataFactoryCodePush = {};

    dataFactoryCodePush.running = false;

    dataFactoryCodePush.description = '';
    dataFactoryCodePush.appVersion = '';

    dataFactoryCodePush.channel = 'dev';
    dataFactoryCodePush.remotePackage = {};

    function onPackageError(error) {
      dataFactoryCodePush.running = false;
      console.log('dataFactoryCodePush download progress An error occurred. ' + error);
    }
    function onUpdateError(error) {
      dataFactoryCodePush.running = false;
      console.log('dataFactoryCodePush checkForUpdate An error occurred. ' + error);
    }
    function onInstallError(error) {
      dataFactoryCodePush.running = false;
      console.log('dataFactoryCodePush install An error occurred. ' + error);
    }

    function onInstallSuccess() {

      dataFactoryCodePush.running = false;

      $rootScope.$emit('codePushCtrlInstallSucces');

      console.log('dataFactoryCodePush Installation succeeded. App restarting now');
      dataFactoryNotification.doNotificationMobiel('TRINL Update beschikbaar', 'Stop en start TRINL opnieuw om deze update te activeren', 'update');

      var timestamp = dataFactoryAlive.getTimestamp();
      console.log('dataFactoryCodePush timestamp voor historie: ', timestamp);

      var historieModel = new dataFactoryHistorie.Model();
      historieModel.set('version', '<p><b>' + dataFactoryCodePush.appVersion + '</b>&nbsp;&nbsp;&nbsp;' + timestamp + '</p>');
      historieModel.set('versionId', dataFactoryCodePush.appVersion);
      historieModel.set('tekst', '<p>-&nbsp;&nbsp;&nbsp;&nbsp;' + dataFactoryCodePush.description + '</p>');
      historieModel.set('gebruikerId', localStorage.getItem('authentication_id'));
      console.log('datafactoryCodePush historieModel: ', historieModel);
      historieModel.save().then(function () {
        console.log('datafactoryCodePush history saved SUCCESS');

        if (dataFactoryCodePush.ctrlMode) {
          $timeout(function () {
            dataFactoryCodePush.ctrlMode = false;
            codePush.restartApplication();
          }, 30000);

          $ionicPopup.confirm({
            title: 'TRINL update staat klaar',
            content: '<span class="trinl-rood">Update versienr: ' + dataFactoryCodePush.appVersion + '</span><br><br>Toelichting: <br><span class="trinl-blauw">' + dataFactoryCodePush.description + '</span>',
            buttons: [{
              text: 'Later'
            }, {
              text: '<b>Update activeren</b>',
              type: 'button-positive',
              onTap: function () {
                codePush.restartApplication();
              }
            }]
          });
        }

      }).catch(function (err) {
        console.log('datafactoryCodePush history saved ERROR: ', err);
      });

    }

    function onPackageDownloaded(localPackage) {
      console.log('dataFactoryCodePush onPackageDownloaded event codePushCtrlPackageDownloaded: ', localPackage);
      $rootScope.$emit('codePushCtrlPackageDownloaded', localPackage);
      localPackage.install(onInstallSuccess, onInstallError, { installMode: InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 100, mandatoryInstallMode: InstallMode.ON_NEXT_RESTART });
    }

    function onProgress(downloadProgress) {
      if (dataFactoryCodePush.ctrlMode) {
        $rootScope.$emit('codePushCtrlProgress', downloadProgress);
      }
    }

    $rootScope.$on('codePushCtrlOk', function (event) {
      console.log('dataFactoryCodePush codePushCtrlOk from popup in DashCtrl');
      var remotePackage = dataFactoryCodePush.remotePackage;
      remotePackage.download(onPackageDownloaded, onPackageError, onProgress);
    });

    function onUpdateCheck(remotePackage) {
      dataFactoryCodePush.remotePackage = remotePackage;
      if (!remotePackage) {
        dataFactoryCodePush.running = false;
        console.log('dataFactoryCodePush TRINL is up to date, remotePackage: ', remotePackage);
        if (dataFactoryCodePush.ctrlMode) {
          console.log('dataFactoryCodePush updateChack event codePushCtrlNoUpdate');
          $rootScope.$emit('codePushCtrlNoUpdate');
        }
      } else {
        // The hash of each previously reverted package is stored for later use.
        // This way, we avoid going into an infinite bad update/revert loop.
        if (!remotePackage.failedInstall) {

          var tmp = remotePackage.description.split(' ');
          dataFactoryCodePush.appVersion = tmp[0];
          dataFactoryCodePush.description = remotePackage.description.replace(tmp[0], '');

          if (dataFactoryCodePush.ctrlMode) {
            console.log('dataFactoryCodePush updateChack event codePushCtrlUpdate');
            $rootScope.$emit('codePushCtrlUpdate', remotePackage);
          } else {
            remotePackage.download(onPackageDownloaded, onPackageError, onProgress);
          }
        } else {
          dataFactoryCodePush.running = false;
          console.log('dataFactoryCodePush The available update was attempted before and failed.');
          if (dataFactoryCodePush.ctrlMode) {
            console.log('dataFactoryCodePush updateCheck event codePushCtrlNoUpdate');
            $rootScope.$emit('codePushCtrlRollback');
          }
        }
      }
    }

    dataFactoryCodePush.doUpdate = function () {

      if (!dataFactoryCodePush.running) {

        dataFactoryCodePush.running = true;

        $ionicPlatform.ready(function () {
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

            var androidKey, iOSKey;
            if (+localStorage.getItem('authentication_profielId') === 1 || +localStorage.getItem('authentication_profielId') === 2) {
              androidKey = '7NeEllCy3d8_TyWk2aQ7ebXLIeAjr17Qjk59V';
              iOSKey = 'wkKixmGLDIa-7GgDU_qDYwnQgYLxHk9lokq54';
              dataFactoryCodePush.channel = 'Production';
            }
            if (+localStorage.getItem('authentication_profielId') === 4) {
              androidKey = 'GoLTPjnAw_4QznW_CME6hXCBe2P6BknDwk55N';
              iOSKey = '35M8N8kPb9P8YeUvytSC6sBGlogpHJj3wy55V';
              dataFactoryCodePush.$emitchannel = 'Staging';
            }
            if (+localStorage.getItem('authentication_profielId') === 5) {
              androidKey = 'ipIxEmGOEmlr43bk9JLU8OfpuAU7rkiUzaWhE';
              iOSKey = 'DkCaG1gk3285I6EuIv6s0AKjj4oUrkuU0IVh4';
              dataFactoryCodePush.channel = 'dev';
            }

            console.log('dataFactoryCodePush STARTED checkForUpdate');

            if (ionic.Platform.isAndroid()) {
              window.codePush.checkForUpdate(onUpdateCheck, onUpdateError, androidKey);
            }
            if (ionic.Platform.isIOS()) {
              window.codePush.checkForUpdate(onUpdateCheck, onUpdateError, iOSKey);
            }
          }
        });
      } else {
        console.error('dataFactoryCodePush is allready running');
        console.log('dataFactoryCodePush updateChack event codePushCtrlNoUpdateAuto');
        $rootScope.$emit('codePushCtrlNoUpdateAllreadyAuto');
      }
    };

    dataFactoryCodePush.getPendingPackage = function () {

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          codePush.getPendingPackage(function (update) {

            console.error('dataFactoryCodePush getPendingPackage result: ', update);

            if (update) {
              dataFactoryCodePush.pending = true;

              $ionicPopup.confirm({
                title: 'TRINL update staat klaar',
                content: '<span class="trinl-rood">Update versienr: ' + dataFactoryCodePush.appVersion + '</span><br><br>Toelichting: <br><span class="trinl-blauw">' + dataFactoryCodePush.description + '</span>',
                buttons: [{
                  text: 'Later'
                }, {
                  text: '<b>Update activeren</b>',
                  type: 'button-positive',
                  onTap: function () {
                    codePush.restartApplication();
                  }
                }]
              });
            } else {

              dataFactoryCodePush.pending = false;
            }
          });
        }
      });
    };

    dataFactoryCodePush.getPendingPackage();

    return dataFactoryCodePush;
  }
]);
