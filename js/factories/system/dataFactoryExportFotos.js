/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryExportFotos', ['$q', 'dataFactoryDropbox',
  function ($q, dataFactoryDropbox) {

    //console.warn('dataFactoryExportFotos');

    var dataFactoryExportFotos = {};

    var Geometry = {};

    var options = {
      creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
    };
    dataFactoryExportFotos.Geoposition = {};

    dataFactoryExportFotos.trackingDataIndex = 0;
    dataFactoryExportFotos.recording = false;
    dataFactoryExportFotos.trackId = '';

    dataFactoryExportFotos.clearGPX = function () {

      console.warn('dataFactoryExportFotos clear GPX');

      dataFactoryExportFotos.Geoposition = {};
      dataFactoryExportFotos.Geoposition.type = 'FeatureCollection';
      dataFactoryExportFotos.Geoposition.features = [];
    };

    dataFactoryExportFotos.openGPX = function () {

      console.warn('Fotos openGPX');

      dataFactoryExportFotos.clearGPX();

    };

    dataFactoryExportFotos.recordGPX = function (lat, lng, name, desc, fotoId, fotoData) {

      var q = $q.defer();

      dataFactoryDropbox.login().then(function () {

        console.log('dataFactoryExportFotos.recordGPX lat: ', lat);
        console.log('dataFactoryExportFotos.recordGPX lng: ', lng);
        console.log('dataFactoryExportFotos.recordGPX name: ', name);
        console.log('dataFactoryExportFotos.recordGPX desc: ', desc);

        dataFactoryDropbox.upload(fotoData, fotoId + '.b64').then(function (urlFotoResult) {
          console.warn('Fotos upload base64 SUCCESS: ', urlFotoResult);

          Geometry = {};
          Geometry.type = 'Feature';
          Geometry.geometry = {};
          Geometry.geometry.type = 'Point';
          Geometry.geometry.coordinates = new Array(2);
          Geometry.geometry.coordinates[0] = lng;
          Geometry.geometry.coordinates[1] = lat;
          Geometry.properties = {};
          Geometry.properties.id = fotoId;
          Geometry.properties.name = name;
          Geometry.properties.desc = desc;

          dataFactoryExportFotos.Geoposition.features.push(Geometry);
          console.log('Fotos recordGPX Geoposition.features: ', dataFactoryExportFotos.Geoposition.features);
          q.resolve();

        }).catch(function (err) {
          console.warn('Fotos uploadFoto base64 ERROR: ', err);
          q.resolve(err);
        });
      }).catch(function (err) {
        console.error('dataFactoryExportFotos.Geoposition upload login ERROR: ', err);
        q.resolve();
      });

      return q.promise;
    };

    dataFactoryExportFotos.closeGPX = function (gpxNaam) {

      console.log('Fotos closeGPX: ', dataFactoryExportFotos.Geoposition);

      dataFactoryDropbox.login().then(function () {

        var gpxdata = togpx(dataFactoryExportFotos.Geoposition, options);

        console.log('Fotos closeGPX gpxdata: ', gpxdata);

        dataFactoryDropbox.upload(gpxdata, gpxNaam + '.gpx').then(function (gpxResult) {
          console.warn('Fotos upload GPX SUCCESS: ', gpxResult);
        }).catch(function (err) {
          console.error('dataFactoryExportFotos.Geoposition upload ERROR: ', err);
        });
      }).catch(function (err) {
        console.error('dataFactoryExportFotos.Geoposition upload login ERROR: ', err);
      });
    };

    return dataFactoryExportFotos;
  }
]);
