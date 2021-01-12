/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryPois', ['loDash', '$q', '$location', '$ionicPopup', '$ionicLoading', 'dataFactoryCeo', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryTag', 'dataFactoryPoiTag', 'dataFactoryDropbox', function (loDash, $q, $location, $ionicPopup, $ionicLoading, dataFactoryCeo, dataFactoryPoi, dataFactoryPoiSup, dataFactoryTag, dataFactoryPoiTag, dataFactoryDropbox) {
  //console.warn('dataFactoryPois')
  /*
  var urlBase = 'https://www.pcmatic.nl/';

  if ($location.$$host === '') {
    urlBase = BASE.URL;
  }
  if ($location.$$host === 'localhost') {
    urlBase = 'http://localhost/trinl/';
  }
  if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
    urlBase = 'https://www.trinl.nl/';
  }
  if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
    urlBase = 'https://www.pcmatic.nl/';
  }
  */
  var dataFactoryPois = {};

  var Geometry = {};

  var options = {
    creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
  };

  dataFactoryPois.Geoposition = {};
  dataFactoryPois.trackingDataIndex = 0;

  dataFactoryPois.recording = false;
  dataFactoryPois.trackId = '';

  /*
  dataFactoryPois.loadPoi = function (gebruikerId, poiId, extension) {

    console.log('dataFactoryPoiss.loadPoi gebruikerId, poiId, extension: ', gebruikerId, poiId, extension);

    var q = $q.defer();

    if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

      var url = urlBase + 'gebruikers/' + gebruikerId + '/pois/' + poiId + '.' + extension;
      //var url = urlBase + gebruikerId + '/tracks/' + trackId + '.' + extension;

      console.log('dataFactoryPois.loadPoi url: ', url);

      load(url).then(function (layer) {
        q.resolve(layer);
      }, function () {
        q.reject();
      });
    } else {
      var clientPath = trinlFileDir + 'gebruikers/' + gebruikerId + '/pois/' + poiId + '.' + extension;
      //var clientPath = trinlFileDir + gebruikerId + '/tracks/' + trackId + '.' + extension;

      console.log('dataFactoryPois.loadPoi clientPath: ', clientPath);

      loadFS(clientPath).then(function (layer) {
        q.resolve(layer);
      }, function () {
        q.reject();
      });
    }

    return q.promise;
  };
  */
  dataFactoryPois.clearGPX = function () {

    console.warn('dataFactoryPois clearTrack');
    //
    // Start opnieuw met een lege track
    //
    dataFactoryPois.Geoposition = {};
    dataFactoryPois.Geoposition.type = 'FeatureCollection';
    dataFactoryPois.Geoposition.features = [];

    dataFactoryPois.recording = false;
  };

  dataFactoryPois.openGPX = function () {

    console.warn('dataFactoryPois openTrack');

    dataFactoryPois.clearGPX();
    dataFactoryPois.recording = true;

  };

  dataFactoryPois.recordGPX = function (lat, lng, name, desc) {

    //console.log('dataFactoryPois.recordGPX lat: ', lat);
    //console.log('dataFactoryPois.recordGPX lng: ', lng);
    //console.log('dataFactoryPois.recordGPX name: ', name);
    //console.log('dataFactoryPois.recordGPX desc: ', desc);

    Geometry = {};
    Geometry.type = 'Feature';
    Geometry.geometry = {};
    Geometry.geometry.type = 'Point';
    Geometry.geometry.coordinates = new Array(2);
    Geometry.geometry.coordinates[0] = lng;
    Geometry.geometry.coordinates[1] = lat;
    Geometry.properties = {};
    Geometry.properties.name = name;
    Geometry.properties.desc = desc;

    dataFactoryPois.Geoposition.features.push(Geometry);

    //console.log('dataFactoryPois.Geoposition.features: ', dataFactoryPois.Geoposition.features);

  };

  dataFactoryPois.closeGPX = function (exportNaam) {

    //console.log('dataFactoryPois.Geoposition: ', dataFactoryPois.Geoposition);

    dataFactoryDropbox.login().then(function () {

      // eslint-disable-next-line no-undef
      var gpxdata = togpx(dataFactoryPois.Geoposition, options);

      var start = 0;
      var nametagstart, nametagend;
      var nametable = [];
      do {
        nametagstart = gpxdata.indexOf('<name>', start);
        nametagend = gpxdata.indexOf('</name>', start);
        var x = gpxdata.substring(nametagstart + 6, nametagend);
        if (x !== '<gpx ') {
          nametable.push('name=' + x);
          nametable.push('desc=');
        }
        //console.error('Export cleanjob loop x, tagstart, tagend, start: ', x, nametagstart, nametagend, start);
        start = nametagend + 7;
      }
      while (nametagstart > 0);

      //console.log('Export locaties .gpx: ', gpxdata);
      //console.error('Export locaties nametable: ', nametable);

      loDash.each(nametable, function (name) {
        //console.error('Export locaties remove name: ', name);
        gpxdata = gpxdata.replace(name, '');
        //console.error('Export locaties .gpx: ', gpxdata);
      });

      for (var i = 0; i < nametable.length; i++) {
        gpxdata = gpxdata.replace('desc=', '');
      }

      //console.log('Export locaties .gpx: ', gpxdata);

      dataFactoryDropbox.upload(gpxdata, exportNaam + '.gpx').then(function (result) {
        console.warn('dataFactoryPois.Geoposition upload SUCCESS: ', result);
        $ionicPopup.confirm({
          title: 'Exporteren GPX',
          content: '<span class="trinl-rood"><b>' + exportNaam + '.gpx</b></span><br><br>exporteren gereed',
          buttons: [{
            text: '<b>OK</b>'
          }]
        });

        $ionicLoading.hide();

      }).catch(function (err) {
        console.error('dataFactoryPois.Geoposition upload ERROR: ', err);
        $ionicLoading.hide();
      });
    });
  };


  return dataFactoryPois;

}]);
