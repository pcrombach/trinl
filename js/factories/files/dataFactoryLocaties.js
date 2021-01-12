/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryLocaties', ['loDash', '$q', '$ionicPopup', '$ionicLoading', 'dataFactoryCeo', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryTag', 'dataFactoryPoiTag', 'dataFactoryDropbox', function (loDash, $q, $ionicPopup, $ionicLoading, dataFactoryCeo, dataFactoryPoi, dataFactoryPoiSup, dataFactoryTag, dataFactoryPoiTag, dataFactoryDropbox) {
  //console.warn('dataFactoryLocaties');
  var dataFactoryLocaties = {};

  var Geometry = {};

  var options = {
    creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
  };

  dataFactoryLocaties.Geoposition = {};
  dataFactoryLocaties.trackingDataIndex = 0;

  dataFactoryLocaties.recording = false;
  dataFactoryLocaties.trackId = '';


  dataFactoryLocaties.loadPoi = function (gebruikerId, poiId, extension) {

    //console.log('dataFactoryLocatiess.loadPoi gebruikerId, poiId, extension: ', gebruikerId, poiId, extension);

    var q = $q.defer();

    if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

      var url = urlBase + 'gebruikers/' + gebruikerId + '/pois/' + poiId + '.' + extension;
      //var url = urlBase + gebruikerId + '/tracks/' + trackId + '.' + extension;

      //console.log('dataFactoryLocaties.loadPoi url: ', url);

      load(url).then(function (layer) {
        q.resolve(layer);
      }, function () {
        q.reject();
      });
    } else {
      var clientPath = trinlFileDir + 'gebruikers/' + gebruikerId + '/pois/' + poiId + '.' + extension;
      //var clientPath = trinlFileDir + gebruikerId + '/tracks/' + trackId + '.' + extension;

      //console.log('dataFactoryLocaties.loadPoi clientPath: ', clientPath);

      loadFS(clientPath).then(function (layer) {
        q.resolve(layer);
      }, function () {
        q.reject();
      });
    }

    return q.promise;
  };

  dataFactoryLocaties.clearGPX = function () {

    //console.warn('dataFactoryLocaties clearTrack');
    //
    // Start opnieuw met een lege track
    //
    dataFactoryLocaties.Geoposition = {};
    dataFactoryLocaties.Geoposition.type = 'FeatureCollection';
    dataFactoryLocaties.Geoposition.features = [];

    dataFactoryLocaties.recording = false;
  };

  dataFactoryLocaties.openGPX = function () {

    //console.warn('dataFactoryLocaties openTrack');

    dataFactoryLocaties.clearGPX();
    dataFactoryLocaties.recording = true;

  };

  dataFactoryLocaties.recordGPX = function (lat, lng, name, desc) {

    //console.log('dataFactoryLocaties.recordGPX lat: ', lat);
    //console.log('dataFactoryLocaties.recordGPX lng: ', lng);
    //console.log('dataFactoryLocaties.recordGPX name: ', name);
    //console.log('dataFactoryLocaties.recordGPX desc: ', desc);

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

    dataFactoryLocaties.Geoposition.features.push(Geometry);

    //console.log('dataFactoryLocaties.Geoposition.features: ', dataFactoryLocaties.Geoposition.features);

  };

  dataFactoryLocaties.closeGPX = function (exportNaam) {

    //console.log('dataFactoryLocaties.Geoposition: ', dataFactoryLocaties.Geoposition);

    dataFactoryDropbox.login().then(function () {

      // eslint-disable-next-line no-undef
      var gpxdata = togpx(dataFactoryLocaties.Geoposition, options);

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
        //console.warn('dataFactoryLocaties.Geoposition upload SUCCESS: ', result);
        $ionicPopup.confirm({
          title: 'Exporteren GPX',
          content: '<span class="trinl-rood"><b>' + exportNaam + '.gpx</b></span><br><br>exporteren gereed',
          buttons: [{
            text: '<b>OK</b>'
          }]
        });

        $ionicLoading.hide();

      }).catch(function (err) {
        //console.error('dataFactoryLocaties.Geoposition upload ERROR: ', err);
        $ionicLoading.hide();
      });
    });
  };


  return dataFactoryLocaties;

}]);
