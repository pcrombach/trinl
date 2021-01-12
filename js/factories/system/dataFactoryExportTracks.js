/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryExportTracks', ['$q', '$ionicLoading', 'dataFactoryDropbox',
  function ($q, $ionicLoading, dataFactoryDropbox) {

    var dataFactoryExportTracks = {};

    //console.warn('dataFactoryExportTracks');

    var Feature = {};

    var options = {
      creator: 'TRINL Tijdreizen in Limburg, Natuur- en MilieuFederatie Limburg'
    };

    dataFactoryExportTracks.Geoposition = {};

    dataFactoryExportTracks.clearGPX = function () {

      //console.warn('dataFactoryExportTracks clearTrack');
      //
      // Start opnieuw met een lege track
      //
      dataFactoryExportTracks.Geoposition = {};
      dataFactoryExportTracks.Geoposition.type = 'FeatureCollection';
      dataFactoryExportTracks.Geoposition.features = [];

      dataFactoryExportTracks.recording = false;
    };

    dataFactoryExportTracks.openGPX = function () {

      //console.warn('dataFactoryExportTracks openTrack');

      dataFactoryExportTracks.clearGPX();
      dataFactoryExportTracks.recording = true;

    };

    dataFactoryExportTracks.recordGPX = function (lat, lng, name, desc, trackId, trackData) {

      var q = $q.defer();

      //console.log('dataFactoryExportTracks.recordGPX lat: ', lat);
      //console.log('dataFactoryExportTracks.recordGPX lng: ', lng);
      //console.log('dataFactoryExportTracks.recordGPX name: ', name);
      //console.log('dataFactoryExportTracks.recordGPX desc: ', desc);
      //console.log('dataFactoryExportTracks.recordGPX trackData geometry: ', trackData.features[0].geometry);
      //console.log('dataFactoryExportTracks.recordGPX trackData properties: ', trackData.features[0].properties);
      var feature = {};
      feature.type = 'Feature';
      feature.geometry = {};
      feature.geometry.type = 'Point';
      feature.geometry.coordinates = new Array(2);
      feature.geometry.coordinates[0] = lng;
      feature.geometry.coordinates[1] = lat;
      feature.properties = {};
      feature.properties.id = trackId;
      feature.properties.name = name;
      feature.properties.desc = desc;

      dataFactoryExportTracks.Geoposition.features.push(feature);

      feature.type = 'Feature';
      feature.geometry = {};
      feature.geometry.type = 'Track';
      feature.properties = {};
      feature.geometry = trackData.features[0].geometry;
      feature.properties = trackData.features[0].properties;
      feature.properties.id = trackId;
      feature.properties.name = name;
      feature.properties.desc = desc;

      dataFactoryExportTracks.Geoposition.features.push(feature);

      //console.log('Tracks recordGPX Geoposition.features: ', dataFactoryExportTracks.Geoposition.features);
      q.resolve();

      return q.promise;
    };

    dataFactoryExportTracks.closeGPX = function (gpxNaam) {

      //console.log('dataFactoryExportTracks.Geoposition: ', dataFactoryExportTracks.Geoposition);

      dataFactoryDropbox.login().then(function () {

        var gpxdata = togpx(dataFactoryExportTracks.Geoposition, options);
        //console.log('Export locaties .gpx: ', gpxdata);
        dataFactoryDropbox.upload(gpxdata, gpxNaam + '.gpx').then(function (result) {
          //console.warn('dataFactoryExportTracks.Geoposition upload SUCCESS exportNaam: ', gpxNaam);
          //console.warn('dataFactoryExportTracks.Geoposition upload SUCCESS: ', result);
        }).catch(function (err) {
          //console.error('dataFactoryExportTracks.Geoposition upload ERROR: ', err);
          $ionicLoading.hide();
        });
      }).catch(function (err) {
        //console.error('dataFactoryExportTracks.Geoposition upload login ERROR: ', err);
      });
    };

    return dataFactoryExportTracks;
  }
]);
