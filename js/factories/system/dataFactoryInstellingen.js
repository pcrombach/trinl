'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryInstellingen', ['$interval', '$q', 'dataFactoryConfig',
  function ($interval, $q, dataFactoryConfig) {

    //console.warn('dataFactoryInstellingen');

    var dataFactoryInstellingen = {};

    dataFactoryInstellingen.ready = false;
    dataFactoryInstellingen.updating = false;

    /**
     * Instellingen van InstellingenCtrl (default)
     */
    dataFactoryInstellingen.stayOpenTime = 10;
    dataFactoryInstellingen.snelMenuPos = 'l';
    dataFactoryInstellingen.stayOpenTimeGeoSearch = 10;
    dataFactoryInstellingen.minOpacity = 25;

    dataFactoryInstellingen.provinciegrensDefault = true;
    dataFactoryInstellingen.provinciegrens = true;
    dataFactoryInstellingen.orientatieroosDefault = true;

    dataFactoryInstellingen.notification = true;
    dataFactoryInstellingen.notifyVibrate = true;
    dataFactoryInstellingen.notifySound = true;
    dataFactoryInstellingen.notifyVolume = 50;

    dataFactoryInstellingen.badgeNumber = 0;
    dataFactoryInstellingen.gpsDefault = false;
    dataFactoryInstellingen.gpsVolgen = true;
    dataFactoryInstellingen.xupdate = true;
    dataFactoryInstellingen.cache = true;
    dataFactoryInstellingen.downloaden = true;
    dataFactoryInstellingen.syncstart = false;
    dataFactoryInstellingen.synclive = false;
    /**
     * Instellin gen van camera
     */
    dataFactoryInstellingen.quality = 50;

    dataFactoryInstellingen.destinationType = '1';
    dataFactoryInstellingen.sourceType = '1';
    dataFactoryInstellingen.encodingType = '1';
    dataFactoryInstellingen.targetWidth = '320';
    dataFactoryInstellingen.targetHeight = '320';
    dataFactoryInstellingen.popoverOptions = 'CameraPopoverOptions';
    dataFactoryInstellingen.saveToPhotoAlbum = '0';

    //    dataFactoryInstellingen.disclaimerConfirmed = '0';

    /**
     * Instellingen van KaartCtrl
     * @return {[type]} [description]
     */
    //var latLng = L.latLng(51.267070677950585, 6.14410400390625);
    dataFactoryInstellingen.defaultLatLng = [51.267070677950585, 6.14410400390625];
    dataFactoryInstellingen.currentTrackId = '';
    dataFactoryInstellingen.zoomLevel = 10;
    dataFactoryInstellingen.crossHair = true;

    dataFactoryInstellingen.gpsrecord = false;
    dataFactoryInstellingen.gpswatch = false;
    dataFactoryInstellingen.gpsDebug = false;
    dataFactoryInstellingen.accuracy = 10;
    dataFactoryInstellingen.radius = 10;
    dataFactoryInstellingen.distanceFilter = 10;
    dataFactoryInstellingen.gpsFrequency = '6000';
    dataFactoryInstellingen.gpsEnableHighAccuracy = true;

    dataFactoryInstellingen.currentTrackId = '';
    dataFactoryInstellingen.trackEigenaar = '';
    dataFactoryInstellingen.trackPrivate = true;
    dataFactoryInstellingen.trackNaam = '';
    dataFactoryInstellingen.opacity = 100;
    //dataFactoryInstellingen.minOpacity = '25';

    dataFactoryInstellingen.kaart = -1;
    dataFactoryInstellingen.kaartHeden = 0;

    dataFactoryInstellingen.gemeentegrenzen= false;
    dataFactoryInstellingen.water = false;
    dataFactoryInstellingen.oppervlaktewater = false;
    dataFactoryInstellingen.hoogtelijnen = false;
    dataFactoryInstellingen.tbo = false;
    dataFactoryInstellingen.electriciteitsnetwerk = false;
    dataFactoryInstellingen.hoofdwegen = false;
    dataFactoryInstellingen.plaatsnamen = false;
    dataFactoryInstellingen.achterban = false;
    dataFactoryInstellingen.tracks = false;
    dataFactoryInstellingen.pois = false;
    dataFactoryInstellingen.fotos = false;

    dataFactoryInstellingen.init = function () {

      //console.log('Instellingen dataFactoryConfig.currentModel', dataFactoryConfig.currentModel.get('Id'));

      var q = $q.defer();

      var interval;

      interval = $interval(function () {
        //console.log('Instellingen wait: ', dataFactoryConfig.currentModel.get('Id'));
        if (dataFactoryConfig.currentModel.get('Id')) {

          $interval.cancel(interval);

          //console.log('dataFactoryInstellingen init  ceoModel en configModel: ', dataFactoryCeo.currentModel, dataFactoryConfig.currentModel);
          //console.log('dataFactoryInstellingen init: ', localStorage.getItem('authentication_id'));
          //console.log('dataFactoryInstellingen dataFactoryConfig: ', dataFactoryConfig);

          //console.log('dataFactoryInstellingen init dataFactoryConfig.currentModel: ', dataFactoryConfig.currentModel);

          dataFactoryInstellingen.minOpacity = +dataFactoryConfig.currentModel.get('minOpacity');
          if (dataFactoryInstellingen.minOpacity < 25) {
            dataFactoryInstellingen.minOpacity = 25;
          }
          dataFactoryInstellingen.opacity = +dataFactoryConfig.currentModel.get('opacity');

          dataFactoryInstellingen.snelMenuPos = dataFactoryConfig.currentModel.get('snelMenuPos');
          if (dataFactoryInstellingen.snelMenuPos === '0') {
            dataFactoryInstellingen.snelMenuPos = 'l';
          }
          dataFactoryInstellingen.stayOpenTime = +dataFactoryConfig.currentModel.get('stayOpenTime');
          dataFactoryInstellingen.stayOpenTimeGeoSearch = +dataFactoryConfig.currentModel.get('stayOpenTimeGeoSearch');
          dataFactoryInstellingen.orientatieroosDefault = dataFactoryConfig.currentModel.get('orientatieroosDefault');
          dataFactoryInstellingen.gpsDefault = dataFactoryConfig.currentModel.get('gpsDefault');
          dataFactoryInstellingen.provinciegrensDefault = dataFactoryConfig.currentModel.get('provinciegrensDefault');

          dataFactoryInstellingen.gpsVolgen = dataFactoryConfig.currentModel.get('gpsVolgen');

          dataFactoryInstellingen.notification = dataFactoryConfig.currentModel.get('notification');

          dataFactoryInstellingen.notifyVolume = dataFactoryConfig.currentModel.get('notifyVolume');
          dataFactoryInstellingen.notifyVibrate = dataFactoryConfig.currentModel.get('notifyVibrate');

          dataFactoryInstellingen.xupdate = dataFactoryConfig.currentModel.get('xupdate');
          dataFactoryInstellingen.cache = dataFactoryConfig.currentModel.get('cache');

          dataFactoryInstellingen.downloaden = dataFactoryConfig.currentModel.get('downloaden');
          dataFactoryInstellingen.syncstart = dataFactoryConfig.currentModel.get('syncstart');
          dataFactoryInstellingen.synclive = dataFactoryConfig.currentModel.get('synclive');

          dataFactoryInstellingen.quality = dataFactoryConfig.currentModel.get('quality');

          dataFactoryInstellingen.gpsDebug = dataFactoryConfig.currentModel.get('gpsDebug');
          dataFactoryInstellingen.accuracy = dataFactoryConfig.currentModel.get('accuracy');
          dataFactoryInstellingen.radius = dataFactoryConfig.currentModel.get('radius');
          dataFactoryInstellingen.distanceFilter = dataFactoryConfig.currentModel.get('distanceFilter');

          dataFactoryInstellingen.destinationType = dataFactoryConfig.currentModel.get('destinationType');
          dataFactoryInstellingen.sourceType = dataFactoryConfig.currentModel.get('sourceType');
          dataFactoryInstellingen.encodingType = dataFactoryConfig.currentModel.get('encodingType');
          dataFactoryInstellingen.targetWidth = dataFactoryConfig.currentModel.get('targetWidth');
          dataFactoryInstellingen.targetHeight = dataFactoryConfig.currentModel.get('targetHeight');
          dataFactoryInstellingen.popoverOptions = dataFactoryConfig.currentModel.get('popoverOptions');
          dataFactoryInstellingen.saveToPhotoAlbum = dataFactoryConfig.currentModel.get('saveToPhotoAlbum');
          dataFactoryInstellingen.disclaimerConfirmed = dataFactoryConfig.currentModel.get('disclaimerConfirmed');

          dataFactoryInstellingen.defaultLatLng = dataFactoryConfig.currentModel.get('defaultLatLng');

          dataFactoryInstellingen.currentTrackId = dataFactoryConfig.currentModel.get('currentTrackId');

          dataFactoryInstellingen.zoomLevel = dataFactoryConfig.currentModel.get('zoomLevel');

          dataFactoryInstellingen.crossHair = dataFactoryConfig.currentModel.get('crossHair');

          dataFactoryInstellingen.gpsrecord = dataFactoryConfig.currentModel.get('gpsrecord');

          dataFactoryInstellingen.gpswatch = dataFactoryConfig.currentModel.get('gpswatch');

          dataFactoryInstellingen.gpsFrequency = dataFactoryConfig.currentModel.get('gpsFrequency');

          dataFactoryInstellingen.gpsEnableHighAccuracy = dataFactoryConfig.currentModel.get('gpsEnableHighAccuracy');

          dataFactoryInstellingen.currentTrackId = dataFactoryConfig.currentModel.get('currentTrackId');

          dataFactoryInstellingen.trackEigenaar = dataFactoryConfig.currentModel.get('trackEigenaar');

          dataFactoryInstellingen.trackPrivate = dataFactoryConfig.currentModel.get('trackPrivate');

          dataFactoryInstellingen.trackNaam = dataFactoryConfig.currentModel.get('trackNaam');

          dataFactoryInstellingen.kaart = dataFactoryConfig.currentModel.get('kaart');
          dataFactoryInstellingen.kaartHeden = dataFactoryConfig.currentModel.get('kaartHeden');
          dataFactoryInstellingen.kaartNietHeden = dataFactoryConfig.currentModel.get('kaartNietHeden');

          dataFactoryInstellingen.provinciegrens = dataFactoryConfig.currentModel.get('provinciegrens');
          dataFactoryInstellingen.gemeentegrenzen = dataFactoryConfig.currentModel.get('gemeentegrenzen');
          dataFactoryInstellingen.water = dataFactoryConfig.currentModel.get('water');
          dataFactoryInstellingen.oppervlaktewater = dataFactoryConfig.currentModel.get('oppervlaktewater');
          dataFactoryInstellingen.hoogtelijnen = dataFactoryConfig.currentModel.get('hoogtelijnen');
          dataFactoryInstellingen.tbo = dataFactoryConfig.currentModel.get('tbo');
          dataFactoryInstellingen.electriciteitsnetwerk = dataFactoryConfig.currentModel.get('electriciteitsnetwerk');
          dataFactoryInstellingen.hoofdwegen = dataFactoryConfig.currentModel.get('hoofdwegen');
          dataFactoryInstellingen.plaatsnamen = dataFactoryConfig.currentModel.get('plaatsnamen');
          dataFactoryInstellingen.achterban = dataFactoryConfig.currentModel.get('achterban');

          dataFactoryInstellingen.ready = true;
          q.resolve();
        }
      }, 100, 50);

      //console.log('NA INIT dataFactoryInstellingen: ', dataFactoryInstellingen);
      return q.promise;
    };

    return dataFactoryInstellingen;

  }
]);
