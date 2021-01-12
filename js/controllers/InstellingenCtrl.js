/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('InstellingenCtrl', ['$rootScope', '$scope', '$timeout', '$ionicPlatform', 'dataFactoryInstellingen', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo',
  function ($rootScope, $scope, $timeout, $ionicPlatform, dataFactoryInstellingen, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo) {

    $scope.isMobile = false;

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $scope.isMobile = true;
      }
    });

    var lockTimeout;

    $scope.profielId = dataFactoryCeo.currentModel.get('profielId');

    // eslint-disable-next-line no-undef
    var sound, soundFile;
    if (+$scope.ceo.profielId === 5) {
      soundFile = 'sound/push-notify.mp3';
    } else {
      soundFile = 'sound/data-notify.mp3';
    }
    sound = new Howl({
      src: [soundFile],
      volume: dataFactoryInstellingen.notifyVolume / 100
    });

    function initConfig() {
      //console.error('InstellingenCtrl initConfig');

      //console.log(' ', dataFactoryInstellingen);
      //console.log('InstellingenCtrl dataFactoryConfig.currentModel: ', dataFactoryConfig.currentModel);

      $scope.stayOpenTime = {
        value: +dataFactoryInstellingen.stayOpenTime
      };
      if (!+$scope.stayOpenTime) {
        $scope.stayOpenTime.value = 10;
      }

      $scope.stayOpenTimeGeoSearch = {
        value: +dataFactoryInstellingen.stayOpenTimeGeoSearch
      };
      if (!+$scope.stayOpenTimeGeoSearch) {
        $scope.stayOpenTimeGeoSearch.value = 10;
      }

      $scope.minOpacity = {
        value: +dataFactoryInstellingen.minOpacity
      };

      $scope.minOLevel = +dataFactoryInstellingen.minOpacity;

      var snelMenuPos = dataFactoryInstellingen.snelMenuPos;

      //console.log('InstellingeCtrl snelMenuPos: ', snelMenuPos);
      if (!snelMenuPos) {
        snelMenuPos = 'r';
      }

      $scope.snelMenuPos = 'rechts';
      if (snelMenuPos === 'l') {
        $scope.snelMenuPos = 'links';
      }
      if (snelMenuPos === 'r') {
        $scope.snelMenuPos = 'rechts';
      }
      //console.log('InstellingeCtrl $scope.snelMenuPos: ', $scope.snelMenuPos);

      $scope.stayOpenTimeLevel = +dataFactoryInstellingen.stayOpenTime;

      $scope.stayOpenTimeGeoSearchLevel = +dataFactoryInstellingen.stayOpenTimeGeoSearch;

      $scope.orientatieroosDefault = {
        checked: dataFactoryInstellingen.orientatieroosDefault
      };

      $scope.gpsDefault = {
        checked: dataFactoryInstellingen.gpsDefault
      };

      $scope.provinciegrensDefault = {
        checked: dataFactoryInstellingen.provinciegrensDefault
      };

      $scope.gpsVolgen = {
        checked: dataFactoryInstellingen.gpsVolgen
      };

      $scope.notification = {
        checked: dataFactoryInstellingen.notification
      };

      $scope.xupdate = {
        checked: dataFactoryInstellingen.xupdate
      };

      $scope.downloaden = {
        checked: dataFactoryInstellingen.downloaden
      };

      $scope.cache = {
        checked: dataFactoryInstellingen.cache
      };

      $scope.syncstart = {
        checked: dataFactoryInstellingen.syncstart
      };

      $scope.synclive = {
        checked: dataFactoryInstellingen.synclive
      };

      $scope.gpsDebug = {
        checked: dataFactoryInstellingen.gpsDebug
      };

      $scope.gpsEnableHighAccuracy = {
        checked: dataFactoryInstellingen.gpsEnableHighAccuracy
      };

      $scope.accuracy = dataFactoryInstellingen.accuracy.toString();

      $scope.radius = dataFactoryInstellingen.radius.toString();

      $scope.distanceFilter = dataFactoryInstellingen.distanceFilter.toString();

      $scope.quality = dataFactoryInstellingen.quality.toString();

      $scope.destinationType = {
        value: dataFactoryInstellingen.destinationType
      };

      $scope.sourceType = {
        value: dataFactoryInstellingen.sourceType
      };

      $scope.encodingType = {
        value: dataFactoryInstellingen.encodingType
      };

      $scope.targetWidth = {
        value: dataFactoryInstellingen.targetWidth
      };

      $scope.targetHeight = {
        value: dataFactoryInstellingen.targetHeight
      };

      $scope.popoverOptions = {
        value: dataFactoryInstellingen.popoverOptions
      };

      $scope.saveToPhotoAlbum = {
        checked: dataFactoryInstellingen.saveToPhotoAlbum
      };

      $scope.disclaimerConfirmed = {
        checked: dataFactoryInstellingen.disclaimerConfirmed
      };

      $scope.notifyVibrate = {
        checked: dataFactoryInstellingen.notifyVibrate
      };

      $scope.notifySound = {
        checked: dataFactoryInstellingen.notifySound
      };

      $scope.notifyVolume = {
        value: dataFactoryInstellingen.notifyVolume
      };
      //console.log('InstellingenCtrl initConfig set volume: ', dataFactoryInstellingen.notifyVolume / 100);

      if (+$scope.ceo.profielId === 5) {
        soundFile = 'sound/push-notify.mp3';
      } else {
        soundFile = 'sound/data-notify.mp3';
      }
      sound = new Howl({
        src: [soundFile],
        volume: dataFactoryInstellingen.notifyVolume / 100
      });

      watchMinOpacity();
      watchStayOpenTime();
      watchStayOpenTimeGeoSearch();
      watchNotifyVolume(false);
    }

    initConfig();

    function updateConfig(item, value) {
      //console.warn('InstellingenCtrl updateConfig: ', item, value, dataFactoryConfig.currentModel.get('Id'));

      //console.log('InstellingenCtrl dataFactoryConfig.currentModel');

      dataFactoryConfig.currentModel.unsetAll();
      dataFactoryConfig.currentModel.set(item, value);
      dataFactoryConfig.currentModel.set('hash', localStorage.getItem('trinlMachineId'));
      dataFactoryConfig.currentModel.set('appVersion', dataFactoryCeo.appVersion);

      //console.log('InstellingenCtrl updateConfig: ', dataFactoryConfig.currentModel);

      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      //console.log('InstellingenCtrl dataFactoryConfig.currentModel update SUCCESS: ', dataFactoryConfig.currentModel);
    }

    /**
  NotifyVolume wordt gewijzigd
*/
    function setNotifyVolume(val) {

      //console.warn('setNotifyVolume nieuw, oud: ', val, dataFactoryInstellingen.notifyVolume);

      if (parseInt(val) !== parseInt(dataFactoryInstellingen.notifyVolume)) {

        $scope.range = val;
        $scope.notifyVolumeLevel = parseInt(val, 10);
        dataFactoryInstellingen.notifyVolume = $scope.notifyVolume.value;
        $rootScope.$emit('notifyVolume');


        //lock = false;

        if (lockTimeout) {
          $timeout.cancel(lockTimeout);
        }
        lockTimeout = $timeout(function () {
          //lock = false;
          updateConfig('notifyVolume', $scope.notifyVolume.value);
          //console.log('InstellingenCtrl setNotifyVolume: ', $scope.notifyVolume.value / 100);
          if (+$scope.ceo.profielId === 5) {
            soundFile = 'sound/push-notify.mp3';
          } else {
            soundFile = 'sound/data-notify.mp3';
          }
          sound = new Howl({
            src: [soundFile],
            volume: dataFactoryInstellingen.notifyVolume / 100
          });
          sound.play();
        }, 500);

        //lock = true;
      }
      //console.log('InstellingenCtrl: ', JSON.stringify(dataFactoryInstellingen));
    }

    /**
      StayOpenTime wordt gewijzigd
    */
    function setStayOpenTime(val) {

      //console.warn('setStayOpenTime: ', val);

      $scope.range = val;
      //console.log('setStayOpenTime $scope.range: ', $scope.range);
      $scope.stayOpenTimeLevel = +val;
      dataFactoryInstellingen.stayOpenTime = +$scope.stayOpenTime.value;
      $rootScope.$emit('stayOpenTime');


      //lock = false;

      if (lockTimeout) {
        $timeout.cancel(lockTimeout);
      }
      lockTimeout = $timeout(function () {
        //lock = false;
        updateConfig('stayOpenTime', +$scope.stayOpenTime.value);
      }, 300);

      //lock = true;

      //console.log('InstellingenCtrl: ', JSON.stringify(dataFactoryInstellingen));
    }

    function setStayOpenTimeGeoSearch(val) {

      //console.warn('setStayOpenTimeGeoSearch: ', val);

      $scope.range = val;
      //console.log('setStayOpenTimeGeoSearch $scope.range: ', $scope.range);
      $scope.stayOpenTimeGeoSearchLevel = +val;
      dataFactoryInstellingen.stayOpenTimeGeoSearch = +$scope.stayOpenTimeGeoSearch.value;
      $rootScope.$emit('OpenTimeGeoSearch');

      if (lockTimeout) {
        $timeout.cancel(lockTimeout);
      }
      lockTimeout = $timeout(function () {
        updateConfig('stayOpenTimeGeoSearch', +$scope.stayOpenTimeGeoSearch.value);
      }, 300);

      //console.log('InstellingenCtrl: ', JSON.stringify(dataFactoryInstellingen));
    }

    /**
  watch NotifyVolume wordt gewijzigd
*/
    function watchNotifyVolume() {

      //console.warn('Selected watchNotifyVolume');

      $scope.$watch('notifyVolume.value', function (val, old) {

        if (val !== undefined && old !== undefined) {

          //console.log('watchNotifyVolume notifyVolume.value change: ' + val);
          $scope.notifyVolumeLevel = parseInt(val, 10);
          $scope.notifyVolume.value = val;
          setNotifyVolume(parseInt(val, 10), parseInt(old, 10));
        }
      });
    }
    /**
  watch StayOpneTime wordt gewijzigd
*/
    function watchStayOpenTime() {

      //console.warn('Selected watchStayOpenTime');

      $scope.$watch('stayOpenTime.value', function (val, old) {
        if (val !== undefined && old !== undefined) {

          //console.log('watchStayOpenTime stayOpenTime.value change: ', +val);
          $scope.stayOpenTimeLevel = +val;
          $scope.stayOpenTime.value = +val;
          setStayOpenTime(+val, +old);
        }
      });
    }

    /**
  watch StayOpneTime wordt gewijzigd
*/
    function watchStayOpenTimeGeoSearch() {

      //console.warn('Selected watchStayOpenTimeGeoSearch');

      $scope.$watch('stayOpenTimeGeoSearch.value', function (val, old) {

        //console.warn('Selected watchStayOpenTimeGeoSearch val, old: ', val, old);

        if (val === undefined) {
          val = 10;
          old = 10;
          //console.warn('Selected watchStayOpenTimeGeoSearch undefined');
        }
        //console.log('watchStayOpenTimeGeoSearch stayOpenTimeGeoSearch.value change: ' + val);
        $scope.stayOpenTimeGeoSearchLevel = val;
        //$scope.stayOpenTimeGeoSearch.value = val;
        setStayOpenTimeGeoSearch(val, old);
      });
    }
    /*
    // *******************************************************************************************
  function setOpacity(val) {
//console.warn('setOpacity: ', val, dataFactoryInstellingen.minOpacity);

        if (val === 0) {
          val = 0.01;
        }

    var o1 = dataFactoryInstellingen.minOpacity /100;
    $scope.range = o1 + (parseFloat(Math.round(parseFloat(val / 100) * Math.pow(10, 2)) / Math.pow(10, 2)) * (1 - o1));
    $scope.oLevel = +parseInt($scope.range * 100, 10);

//console.warn('InstellingenCtrl setOpacity o1, range, oLevel: ', o1, $scope.range, $scope.oLevel);
    // *********************************************************************************************************
  }
*/
    /**
     * Minimum opacity wordt gewijzigd
     */
    function setMinOpacity(val) {

      //console.warn('setMinOpacity: ', val);
      $scope.range = 0.4 + (parseFloat(Math.round(parseFloat(val / 100) * Math.pow(10, 2)) / Math.pow(10, 2)) * 0.6);

      //console.log('setOpacity $scope.range: ', $scope.range);
      $scope.minOLevel = +val;
      dataFactoryInstellingen.minOpacity = +$scope.minOpacity.value;
      $rootScope.$emit('minOpacity');
      updateConfig('minOpacity', +$scope.minOpacity.value);

      //console.log('InstellingenCtrl: ', JSON.stringify(dataFactoryInstellingen));
    }

    function watchMinOpacity() {

      //console.warn('Selected watchMinOpacity');

      $scope.$watch('minOpacity.value', function (val, old) {

        //console.log('watchMonOpacity minOpacity.value change: ' + val);
        $scope.minOLevel = +val;
        $scope.minOpacity.value = +val;
        setMinOpacity(+val, +old);
      });
    }

    $scope.snelMenuPosChange = function (val) {

      //console.warn('Selected snelMenuPosChange: ', val);

      if ($scope.snelMenuPos) {
        $scope.snelMenuPos = 'l';
      }
      if (val === 'rechts') {
        $scope.snelMenuPos = 'r';
      }
      if (val === 'links') {
        $scope.snelMenuPos = 'l';
      }

      //console.warn('Selected snelMenuPosChange: ', $scope.snelMenuPos);

      dataFactoryInstellingen.snelMenuPos = $scope.snelMenuPos;
      updateConfig('snelMenuPos', $scope.snelMenuPos);

      $rootScope.$emit('snelMenuPos', {
        pos: $scope.snelMenuPos
      });
    };

    $scope.notifyVibrateChange = function () {
      //console.log('Selected notifyVibrateChange', $scope.notifyVibrate.checked);
      dataFactoryInstellingen.notifyVibrate = $scope.notifyVibrate.checked;
      //console.log(dataFactoryConfig.currentModel);
      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          navigator.vibrate([300, 50, 150, 50, 300]);
        }
      });
      updateConfig('notifyVibrate', $scope.notifyVibrate.checked);
    };

    $scope.notifySoundChange = function () {

      //console.log('Selected notifySoundChange', $scope.notifySound.checked);

      dataFactoryInstellingen.notifySound = $scope.notifySound.checked;

      if (dataFactoryInstellingen.notifySound) {

        //console.log('Instellingen set volume: ', dataFactoryInstellingen.notifyVolume / 100);

        if (+$scope.ceo.profielId === 5) {
          soundFile = 'sound/push-notify.mp3';
        } else {
          soundFile = 'sound/data-notify.mp3';
        }
        sound = new Howl({
          src: [soundFile],
          volume: dataFactoryInstellingen.notifyVolume / 100
        });
        sound.play();
      }
      updateConfig('notifySound', $scope.notifySound.checked);
    };

    $scope.orientatieroosDefaultChange = function () {
      //console.log('Selected orientatieChange', $scope.orientatieroosDefault.checked);
      dataFactoryInstellingen.orientatieroosDefault = $scope.orientatieroosDefault.checked;
      //console.log(dataFactoryConfig.currentModel);
      updateConfig('orientatieroosDefault', $scope.orientatieroosDefault.checked);
    };

    $scope.gpsDefaultChange = function () {
      //console.log('Selected gpsDefaultChange', $scope.gpsDefault.checked);
      dataFactoryInstellingen.gpsDefault = $scope.gpsDefault.checked;
      updateConfig('gpsDefault', $scope.gpsDefault.checked);
    };

    $scope.provinciegrensDefaultChange = function () {
      //console.log('Selected provinciegrensChange', $scope.provinciegrensDefault.checked);
      dataFactoryInstellingen.provinciegrensDefault = $scope.provinciegrensDefault.checked;
      updateConfig('provinciegrensDefault', $scope.provinciegrensDefault.checked);
    };

    $scope.notificationChange = function () {
      //console.log('Selected notificationChange', $scope.notification.checked);
      dataFactoryInstellingen.notification = $scope.notification.checked;
      updateConfig('notification', $scope.notification.checked);
    };

    $scope.updateChange = function () {
      console.log('Instellingen Selected updateChange', $scope.xupdate.checked);
      dataFactoryInstellingen.xupdate = $scope.xupdate.checked;
      updateConfig('xupdate', $scope.xupdate.checked);
    };

    $scope.downloadenChange = function () {
      //console.log('Selected downloadenChange', $scope.downloaden.checked);
      dataFactoryInstellingen.downloaden = $scope.downloaden.checked;
      updateConfig('downloaden', $scope.downloaden.checked);
    };

    $scope.cacheChange = function () {
      //console.log('Selected cacheChange', $scope.cache.checked);
      dataFactoryInstellingen.cache = $scope.cache.checked;
      updateConfig('cache', $scope.cache.checked);
    };

    $scope.syncstartChange = function () {
      //console.log('Selected syncstartChange', $scope.syncstart.checked);
      dataFactoryInstellingen.syncstart = $scope.syncstart.checked;
      updateConfig('syncstart', $scope.syncstart.checked);
    };

    $scope.syncliveChange = function () {
      //console.log('Selected syncliveChange', $scope.synclive.checked);
      dataFactoryInstellingen.synclive = $scope.synclive.checked;
      updateConfig('synclive', $scope.synclive.checked);
    };

    $scope.qualityChange = function (val) {
      $scope.quality = val.toString();
      //console.log('Selected qualityChange', $scope.quality);
      dataFactoryInstellingen.quality = $scope.quality;
      updateConfig('quality', $scope.quality);
    };

    $scope.destinationTypeChange = function () {
      //console.log('Selected destinationTypeChange', $scope.destinationType.value);
      dataFactoryInstellingen.destinationType = $scope.destinationType.value;
      updateConfig('destinationType', $scope.destinationType.value);
    };

    $scope.sourceTypeChange = function () {
      //console.log('Selected sourceTypeChange', $scope.sourceType.value);
      dataFactoryInstellingen.sourceType = $scope.sourceType.value;
      updateConfig('sourceType', $scope.sourceType.value);
    };

    $scope.encodingTypeChange = function () {
      //console.log('Selected encodingTypeChange', $scope.encodingType.value);
      dataFactoryInstellingen.encodingType = $scope.encodingType.value;
      updateConfig('encodingType', $scope.encodingType.value);
    };

    $scope.targetWidthChange = function () {
      //console.log('Selected targetWidthChange', $scope.targetWidth.value);
      dataFactoryInstellingen.targetWidth = $scope.targetWidth.value;
      updateConfig('targetWidth', $scope.targetWidth.value);
    };

    $scope.targetHeightChange = function () {
      //console.log('Selected targetHeightChange', $scope.targetHeight.value);
      dataFactoryInstellingen.targetHeight = $scope.targetHeight.value;
      updateConfig('targetHeight', $scope.targetHeight.value);
    };

    $scope.popoverOptionsChange = function () {
      //console.log('Selected popoverOptionsChange', $scope.popoverOptions.value);
      dataFactoryInstellingen.popoverOptions = $scope.popoverOptions.value;
      updateConfig('popoverOptions', $scope.popoverOptions.value);
    };

    $scope.saveToPhotoAlbumChange = function () {
      //console.log('Selected saveToPhotoAlbumChange', $scope.saveToPhotoAlbum.checked);
      dataFactoryInstellingen.saveToPhotoAlbum = $scope.saveToPhotoAlbum.checked;
      updateConfig('saveToPhotoAlbum', $scope.saveToPhotoAlbum.checked);
    };

    $scope.gpsVolgenChange = function () {
      //console.log('Selected gpsVolgenChange', $scope.gpsVolgen.checked);
      dataFactoryInstellingen.gpsVolgen = $scope.gpsVolgen.checked;
      updateConfig('gpsVolgen', $scope.gpsVolgen.checked);
    };

    $scope.gpsDebugChange = function () {
      //console.log('Selected gpsDebugChange', $scope.gpsDebug.checked);
      dataFactoryInstellingen.gpsDebug = $scope.gpsDebug.checked;
      //console.log(dataFactoryConfig.currentModel);
      updateConfig('gpsDebug', $scope.gpsDebug.checked);
    };

    $scope.gpsEnableHighAccuracyChange = function () {
      //console.log('Selected gpsEnableHighAccuracyChange', $scope.gpsEnableHighAccuracy.checked);
      dataFactoryInstellingen.gpsEnableHighAccuracy = $scope.gpsEnableHighAccuracy.checked;
      //console.log(dataFactoryConfig.currentModel);
      updateConfig('gpsEnableHighAccuracy', $scope.gpsEnableHighAccuracy.checked);
    };

    $scope.accuracyChange = function (val) {
      $scope.accuracy = val.toString();
      //console.log('Selected accuracyChange', $scope.accuracy);
      dataFactoryInstellingen.accuracy = parseInt($scope.accuracy);
      updateConfig('accuracy', parseInt($scope.accuracy));
    };

    $scope.radiusChange = function (val) {
      $scope.radius = val.toString();
      //console.log('Selected radiusChange', $scope.radius);
      dataFactoryInstellingen.radius = parseInt($scope.radius);
      updateConfig('radius', parseInt($scope.radius));
    };

    $scope.distanceFilterChange = function (val) {
      $scope.distanceFilter = val.toString();
      //console.log('Selected distanceFilterChange', $scope.distanceFilter);
      dataFactoryInstellingen.distanceFilter = parseInt($scope.distanceFilter);
      updateConfig('distanceFilter', parseInt($scope.distanceFilter));
    };

  }
]);
