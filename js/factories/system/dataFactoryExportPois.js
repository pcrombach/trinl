/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryExportPois', ['$q', 'dataFactoryDropbox', '$ionicLoading',
  function ($q, dataFactoryDropbox, $ionicLoading) {

    //console.warn('dataFactoryExportPois');

    var dataFactoryExportPois = {};

    var Geometry = {};

    var options = {
      creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
    };

    dataFactoryExportPois.Geoposition = {};

    dataFactoryExportPois.clearGPX = function () {

      console.warn('dataFactoryExportPois clearTrack');
      //
      // Start opnieuw met een lege track
      //
      dataFactoryExportPois.Geoposition = {};
      dataFactoryExportPois.Geoposition.type = 'FeatureCollection';
      dataFactoryExportPois.Geoposition.features = [];

      dataFactoryExportPois.recording = false;
    };

    dataFactoryExportPois.openGPX = function () {

      console.warn('dataFactoryExportPois openTrack');

      dataFactoryExportPois.clearGPX();
      dataFactoryExportPois.recording = true;

    };

    dataFactoryExportPois.recordGPX = function (lat, lng, name, desc, poiId) {
      var q = $q.defer();

      //console.log('dataFactoryExportPois.recordGPX lat: ', lat);
      //console.log('dataFactoryExportPois.recordGPX lng: ', lng);
      //console.log('dataFactoryExportPois.recordGPX name: ', name);
      //console.log('dataFactoryExportPois.recordGPX desc: ', desc);

      Geometry = {};
      Geometry.type = 'Feature';
      Geometry.geometry = {};
      Geometry.geometry.type = 'Point';
      Geometry.geometry.coordinates = new Array(2);
      Geometry.geometry.coordinates[0] = lng;
      Geometry.geometry.coordinates[1] = lat;
      Geometry.properties = {};
      Geometry.properties.id = poiId;
      Geometry.properties.name = name;
      Geometry.properties.desc = desc;

      dataFactoryExportPois.Geoposition.features.push(Geometry);
      //console.log('Pois recordGPX Geoposition.features: ', dataFactoryExportPois.Geoposition.features);
      q.resolve();

      return q.promise;
    };

    dataFactoryExportPois.closeGPX = function (exportNaam) {

      //console.log('dataFactoryExportPois.Geoposition: ', dataFactoryExportPois.Geoposition);

      dataFactoryDropbox.login().then(function () {

        var gpxdata = togpx(dataFactoryExportPois.Geoposition, options);
        console.log('Export sporen .gpx: ', gpxdata);
        dataFactoryDropbox.upload(gpxdata, exportNaam + '.gpx').then(function (gpxResult) {
          console.warn('dataFactoryExportPois.Geoposition upload SUCCESS: ', gpxResult);
        }).catch(function (err) {
          console.error('dataFactoryExportPois.Geoposition upload ERROR: ', err);
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        console.error('dataFactoryExportPois.Geoposition upload login ERROR: ', err);
      });
    };

    return dataFactoryExportPois;
  }
]);
