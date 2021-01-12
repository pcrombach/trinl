/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
'use strict';

trinl.factory('dataFactoryOverlay', ['BASE', 'loDash', '$rootScope', '$cordovaFile', '$cordovaFileTransfer', '$cordovaNetwork', '$location', '$ionicPlatform', '$timeout', '$q', '$http', 'dataFactorySync', 'dataFactoryConfigLaag', 'dataFactoryAlive',
  function (BASE, loDash, $rootScope, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $location, $ionicPlatform, $timeout, $q, $http, dataFactorySync, dataFactoryConfigLaag, dataFactoryAlive) {

    //console.warn('dataFactoryOverlay');

    var dataFactoryOverlay = {};

    dataFactoryOverlay.ready = false;

    dataFactoryOverlay.configOverlays = [];
    dataFactoryOverlay.overlays = [];

    dataFactoryOverlay.configMijnOverlays = [];
    dataFactoryOverlay.mijnOverlays = [];

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

    //console.log('datafactoryOverlay urlBase: ', urlBase);
    /*
    (function () {
      'use strict';

      //var DEFAULT_MAX_DEPTH = 6;
      //var DEFAULT_ARRAY_MAX_LENGTH = 50;
      var DEFAULT_MAX_DEPTH = 10;
      var DEFAULT_ARRAY_MAX_LENGTH = 100;
      var seen; // Same variable used for all stringifications

      Date.prototype.toPrunedJSON = Date.prototype.toJSON;
      String.prototype.toPrunedJSON = String.prototype.toJSON;

      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        // eslint-disable-next-line no-useless-escape
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = { // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"': '\\"',
          '\\': '\\\\'
        };

      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ?
            c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }

      function str(key, holder, depthDecr, arrayMaxLength) {
        var i, // The loop counter.
          k, // The member key.
          v, // The member value.
          length,
          partial,
          value = holder[key];
        if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
          value = value.toPrunedJSON(key);
        }

        switch (typeof value) {
          case 'string':
            return quote(value);
          case 'number':
            return isFinite(value) ? String(value) : 'null';
          case 'boolean':
          case 'null':
            return String(value);
          case 'object':
            if (!value) {
              return 'null';
            }
            if (depthDecr <= 0 || seen.indexOf(value) !== -1) {
              return '"-pruned-"';
            }
            seen.push(value);
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
              length = Math.min(value.length, arrayMaxLength);
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value, depthDecr - 1, arrayMaxLength) || 'null';
              }
              v = partial.length === 0 ?
                '[]' :
                '[' + partial.join(',') + ']';
              return v;
            }
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                try {
                  v = str(k, value, depthDecr - 1, arrayMaxLength);
                  if (v) partial.push(quote(k) + ':' + v);
                } catch (e) {
                  // this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
                }
              }
            }
            v = partial.length === 0 ?
              '{}' :
              '{' + partial.join(',') + '}';
            return v;
        }
      }

      JSON.pruned = function (value, depthDecr, arrayMaxLength) {
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        return str('', {
          '': value
        }, depthDecr, arrayMaxLength);
      };

    }());
    */

    dataFactoryOverlay.ready = false;

    if (dataFactoryAlive.status === 0) {
      dataFactoryAlive.status = 4;
    }

    var options = {};
    var layers;
    var trinlFileDir;

    var aantalLayers = 0;
    var layersNew;
    var layersUpdate = false;
    var layersUpdateReady = false;

    var LeafIconOptions = {
      iconSize: [11, 14],
      iconAnchor: [11, 28],
      popupAnchor: [0, -22],
      shadowSize: [50, 64],
      shadowAnchor: [4, 62]
    };

    var toolTipPoint = new L.Point(15, 7);

    var LeafIcon = L.Icon.extend({
      options: LeafIconOptions
    });

    var rood_vierkant_Icon = new LeafIcon({
      iconUrl: 'images/pico_red_square.png',
      iconSize: [15, 15],
      iconAnchor: [0, 0]

    });
    var groen_vierkant_Icon = new LeafIcon({
      iconUrl: 'images/green_square.png',
      iconSize: [15, 15],
      iconAnchor: [0, 0]

    });

    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }
      /**
       * Loop door layer ein layers en layersNew. Vergelijkt versions.
       * Indien versions verschillen wordt layer in FS verwijderd
       * @param  {Integer} index       index in layers
       * @param  {Object} layersNew    layers van backend
       * @param  {Object} layers       layers in FS
       * @param  {Integer} aantalLayers
       */
      function removeLayers(index, layersNew, layers, aantalLayers) {
        //console.log('removeLayers started');
        //
        $ionicPlatform.ready(function () {
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

            if (index >= aantalLayers) {
              //console.log('Alle layers verwijderd, afronden removeLayers');
              //				loadOverlaysFS();
              layersUpdateReady = true;
              //console.log('dataFactoryOverlay event layerUpdated na laatste controle');
              $rootScope.$emit('layerUpdated', {
                layers: layers,
                layersUpdate: layersUpdate,
                layersUpdateReady: layersUpdateReady
              });
              //console.log('dataFactoryOverlay removeLayers completed');
              return;
            } else {

              if (layers !== undefined) {
                //console.log('dataFactoryOverlay versions layers layersNew: ', layers[index].version, layersNew[index].version);
                if (layersNew[index].version !== layers[index].version) {
                  //console.error('dataFactoryOverlay NIEUWE LAYER ' + layersNew[index].titel + '. WORDT GEWIST!!!!');

                  $cordovaFile.removeFile(trinlFileDir, 'geojson/' + layersNew[index].name).then(function () {
                    //console.log('dataFactoryOverlay Removed Layer ' + layersNew[index].titel + ' SUCCESS');
                    layers[index].version = layersNew[index].version;
                    layersUpdate = true;
                    removeLayers(index + 1, layersNew, layers, aantalLayers);
                  },
                  function (err) {
                    console.error('dataFactoryOverlay Remove Layer ' + layersNew[index].titel + ' ERROR: ', err);
                    layers[index].version = layersNew[index].version;
                    layersUpdate = true;
                    removeLayers(index + 1, layersNew, layers, aantalLayers);
                  });
                } else {
                  removeLayers(index + 1, layersNew, layers, aantalLayers);
                }
              } else {
                index = aantalLayers;
                removeLayers(index + 1, layersNew, layers, aantalLayers);
              }
            }
          }
        });
      }
      /**
       * event mpasRead wordt getriggerd door dataFactoryMap nadat map en mapNew zijn ontvangen en in objecten getransformeerd
       * @param  {Function} event
       * @param  {Object} args) bevat layers en layersNew
       */
      $rootScope.$on('mapsRead', function (event, args) {
        //console.warn('dataFactoryOverlay mapsRead event: ', args);

        $ionicPlatform.ready(function () {
          if ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline() && dataFactoryAlive.status !== 0) {
            layers = args.layers;
            layersNew = args.layersNew;
            aantalLayers = layersNew.length;
            //console.log('dataFactoryOverlay layers layersNew aantalLayers: ',layers, layersNew, aantalLayers);
            //console.log('dataFactoryOverlay controleer of er updates zijn');
            if (layers !== undefined) {
              var i = 0;
              var newVersion = false;
              for (i = 0; i < aantalLayers; i++) {
                if (layersNew[i].version !== layers[i].version) {
                  newVersion = true;
                  //console.log('dataFactoryOverlay nieuwe overlay gevonden: ' + layers[i].titel);
                  break;
                }
              }

              if (newVersion) {
                //console.log('dataFactoryOverlay update gevonden: ', layersNew[i].titel);
                //console.log('dataFactoryOverlay removeLayers  : ', layers, layersNew);
                removeLayers(0, layersNew, layers, aantalLayers);
              } else {
                //console.log('dataFactoryOverlay geen map gevonden. We gaan ALLES verwijderen');
                //							loadOverlaysFS();
                layersUpdateReady = true;
                $rootScope.$emit('layerUpdated', {
                  layers: layers,
                  layersUpdate: layersUpdate,
                  layersUpdateReady: layersUpdateReady
                });
              }
            } else {
              removeLayers(0, layersNew, layers, aantalLayers);
            }
          }
        });
      });

    });

    function createOverlayMobile(overlay) {

      function loadOverlay() {
        //console.log('loadOverlay ' + overlay.index + ': ' + overlay.naam + ': ' + trinlFileDir, overlay.url);
        $cordovaFile.readAsText(trinlFileDir, overlay.url).then(function (data) {
          //console.log('loadOverlay ' + overlay.index + ': ' + overlay.naam + ': ' + trinlFileDir, overlay.url);
          //console.log('loadOverlay data: ', data);
          var layer = JSON.parse(data);

          updateStyleLayers(overlay, layer);
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('Error reading ' + overlay.url + ': ', err);
          $rootScope.$emit('OverlayReady', {
            layer: overlay.url
          });
        });
      }

      function downloadOverlay() {
        if ($cordovaNetwork.isOnline()) {
          //console.log('dataFactoryOverlay Network: ', ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()));
          var hostPath = urlBase + overlay.url;
          var clientPath = trinlFileDir + overlay.url;
          //console.log('Download from: ' + hostPath + ' to ' + clientPath);
          $cordovaFileTransfer.download(hostPath, clientPath, options, true).then(function () {
            //console.log('Download overlay ' + overlay.url + ' SUCCESS');
            loadOverlay();
            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('Download ' + overlay.url + ' errorCode: ' + angular.toJson(err));
            $rootScope.$emit('OverlayReady', {
              layer: overlay.url
            });
          });
        }
      }

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $cordovaFile.checkFile(trinlFileDir, overlay.url).then(function () {
            loadOverlay();
          }, function () {
            downloadOverlay();
          });
        }
      });
    }

    function createMijnOverlayMobile(overlay) {
      function loadOverlay() {
        //console.log('loadOverlay ' + overlay.naam + ': ' + trinlFileDir, overlay.url);
        $cordovaFile.readAsText(trinlFileDir, overlay.url).then(function (data) {
          var layer = JSON.parse(data);
          dataFactoryOverlay.mijnOverlays[overlay.index] = L.geoJson(layer, overlay.config);
          $rootScope.$emit('OverlayReady', {
            layer: overlay.url
          });
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('Error reading ' + overlay.naam + ': ', err);
          $rootScope.$emit('OverlayReady', {
            layer: overlay.url
          });
        });
      }

      function downloadOverlay() {
        $ionicPlatform.ready(function () {
          if ($cordovaNetwork.isOnline()) {
            //console.warn('dataFactoryOverlay Network: ', ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()));
            var hostPath = urlBase + overlay.url;
            var clientPath = trinlFileDir + overlay.url;
            //console.log('Download from: ' + hostPath + ' to ' + clientPath);
            $cordovaFileTransfer.download(hostPath, clientPath, options, true).then(function () {
              //console.log('Download overlay ' + overlay.url + ' SUCCESS');
              loadOverlay();
              // eslint-disable-next-line no-unused-vars
            }, function (err) {
              //console.error('Download ' + overlay.url + ' errorCode: ' + angular.toJson(err));
              $rootScope.$emit('OverlayReady', {
                layer: overlay.url
              });
            });
          }
        });
      }

      $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $cordovaFile.checkFile(trinlFileDir, overlay.url).then(function () {
            loadOverlay();
          }, function () {
            downloadOverlay();
          });
        }
      });
    }

    function updateStyleLayers(overlay, layer) {

      if (overlay.naam === 'hoogtelijnen') {
        overlay.config = {
          style: function (feature) {
            //console.log('updateStyleLayer desc: ', feature.properties.desc);
            if (feature.properties.desc === '8-10 m') {
              return {
                'stroke-color': '#002473',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#002473',
                'weight': '1',
                'color': '#002473',
                'fill-opacity': '0.8'
              };
            }
            if (feature.properties.desc === '11-13 m') {
              return {
                strokeColor: '#014c72',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#014c72',
                'weight': '1',
                'color': '#014c72',
                'fill-opacity': '0.8'
              };
            }
            if (feature.properties.desc === '14-16 m') {
              return {
                strokeColor: '#015be7',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#015be7',
                'weight': '1',
                'color': '#015be7',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '17-19 m') {
              return {
                strokeColor: '#73b1ff',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#73b1ff',
                'weight': '1',
                'color': '#73b1ff',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '20-22 m') {
              return {
                strokeColor: '#01c5ff',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#01c5ff',
                'weight': '1',
                'color': '#01c5ff',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '23-25 m') {
              return {
                strokeColor: '#73fedf',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#73fedf',
                'weight': '1',
                'color': '#73fedf',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '26-28 m') {
              return {
                strokeColor: '#bee8ff',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#bee8ff',
                'weight': '1',
                'color': '#bee8ff',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '29-31 m') {
              return {
                strokeColor: '#00734c',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#00734c',
                'weight': '1',
                'color': '#00734c',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '32-35 m') {
              return {
                strokeColor: '#267202',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#267202',
                'weight': '1',
                'color': '#267202',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '36-40 m') {
              return {
                strokeColor: '#38a700',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#38a700',
                'weight': '1',
                'color': '#38a700',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '41-50 m') {
              return {
                strokeColor: '#56fa03',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#56fa03',
                'weight': '1',
                'color': '#56fa03',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '51-70 m') {
              return {
                strokeColor: '#abfa03',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#abfa03',
                'weight': '1',
                'color': '#abfa03',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '71-85 m') {
              return {
                strokeColor: '#cffb73',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#cffb73',
                'weight': '1',
                'color': '#cffb73',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '86-100 m') {
              return {
                strokeColor: '#e9fdbc',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#e9fdbc',
                'weight': '1',
                'color': '#e9fdbc',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '101-125 m') {
              return {
                strokeColor: '#fefb74',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#fefb74',
                'weight': '1',
                'color': '#fefb74',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '126-150 m') {
              return {
                strokeColor: '#fffa02',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#fffa02',
                'weight': '1',
                'color': '#fffa02',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '151-175 m') {
              return {
                strokeColor: '#ffaa00',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#ffaa00',
                'weight': '1',
                'color': '#ffaa00',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '176-200 m') {
              return {
                strokeColor: '#fe0100',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#fe0100',
                'weight': '1',
                'color': '#fe0100',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '201-250 m') {
              return {
                strokeColor: '#a70001',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'fill-color': '#a70001',
                'weight': '1',
                'color': '#a70001',
                'fill-opacity': 0.8
              };
            }
            if (feature.properties.desc === '251-336 m') {
              return {
                'weight': '1',
                'color': '#ff29c3',
                'stroke-color': '#ff29c3',
                'stroke-width': '5',
                'stroke-opacity': '1',
                'fill-color': '#ff29c3',
                'fill-opacity': 0.8
              };
            }
          }
        };
      }
      if (overlay.naam === 'oppervlaktewater') {
        overlay.config = {
          style: function (feature) {
            //console.log('updateStyleLayer desc: ', feature.properties.desc);
            if (feature.properties.desc === 'Natuurbeken') {
              return {
                'color': '#1476da'
              };
            }
            if (feature.properties.desc === 'Overige beken') {
              return {
                'weight': 2,
                'color': '#20b2aa'
              };
            }
            if (feature.properties.desc === 'Maas Kanalen') {
              return {
                'color': '#0039fd'
              };
            }
          }
        };
      }
      if (overlay.naam === 'electriciteitsnetwerk') {
        overlay.config = {
          style: function (feature) {
            //console.log('++++++++++++ Electriciteit: ', feature.properties.desc);
            if (feature.properties.desc === 'hoogspanningsleiding - 146-170kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#0055ff',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: '#0055ff',
                color: '#0055ff',
                fillOpacity: 0.8
              };
            }
            if (feature.properties.desc === 'hoogspanningsleiding - 363-420kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#ff0066',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: '#ff0066',
                color: '#ff0066',
                fillOpacity: 0.8
              };
            }
            if (feature.properties.desc === 'hoogspanningskabel - 40,5-80kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#d5d580',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: 'd5d580',
                color: '#d5d580',
                fillOpacity: 0.4
              };
            }
            if (feature.properties.desc === 'hoogspanningskabel - 146-170kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#4dc4c4',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: '#4dc4c4',
                color: '#4dc4c4',
                fillOpacity: 0.4
              };
            }
            if (feature.properties.desc === 'hoogspanningskabel - 60,1-66kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#ffd47f',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: '#ffd47f',
                color: '#ffd47f',
                fillOpacity: 0.4
              };
            }
            if (feature.properties.desc === 'hoogspanningskabel - 30-40,4kV') {
              //console.log('layer ********: ', feature.properties.desc);
              return {
                strokeColor: '#9b7d9b',
                strokeWidth: 2,
                strokeOpacity: 1,
                fillColor: '#9b7d9b',
                color: '#9b7d9b',
                fillOpacity: 0.4
              };
            }
            //console.log('?????????????????????: ', feature);
          },

          pointToLayer: function (feature, latlng) {
            var iconType = groen_vierkant_Icon;
            if (feature.properties.name.substr(-4) === 'rood') {
              iconType = rood_vierkant_Icon;
            }
            return L.marker(latlng, {
              icon: iconType
            });
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
              var tooltip = 'myTooltipElectriciteitNeven';
              if (feature.properties.name.substr(-4) === 'rood') {
                tooltip = 'myTooltipElectriciteitHoofd';
              }
              //console.log('================================================: ', tooltip)
              layer
                .bindTooltip(feature.properties.name.substr(0, 12), {
                  offset: toolTipPoint,
                  permanent: true,
                  direction: 'right',
                  className: tooltip
                })
                .openTooltip();
            }
          }
        };
        //console.log('dataFactoryOverlay createOverlayBrowser overlay config plaatsnamen: ', overlay.naam.substr(0, 11), overlay.config);
      }

      if (overlay.naam.substr(0, 11) === 'plaatsnamen') {
        overlay.config = {
          pointToLayer: function (feature, latlng) {
            //console.log("dataFatoryOverlay plaatsnamen latlng tooltip: ", JSON.stringify(latlng));
            return L.marker(latlng, {
              icon: rood_vierkant_Icon
            });
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name, {
                offset: toolTipPoint,
                permanent: true,
                direction: 'right',
                className: 'myTooltipPlaats'
              }).openTooltip();
            }
          }
        };
        //console.warn('createOverlay overlay config plaatsnamen: ', overlay.naam.substr(0, 11), overlay.config);
      }

      if (overlay.naam === 'achterban') {
        overlay.config = {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: groen_vierkant_Icon,
            });
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name, {
                offset: toolTipPoint,
                permanent: true,
                direction: 'right',
                className: 'myTooltipAchter'
              }).openTooltip();
            }
          }
        };
        //console.warn('createOverlay overlay config achterban: ', overlay.config);
      }

      if (overlay.cluster) {
        dataFactoryOverlay.overlays[overlay.index] = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: false
        });
        dataFactoryOverlay.overlays[overlay.index].on('clusterclick', function (a) {
          a.layer.zoomToBounds();
        });
        dataFactoryOverlay.overlays[overlay.index].addLayer(L.geoJson(layer, overlay.config));
        //console.warn('createOverlay overlay.cluster config: ', overlay.naam, overlay.config);
      } else {
        if (!overlay.config) {
          dataFactoryOverlay.overlays[overlay.index] = L.geoJson(layer, {
            style: function (feature) {

              //console.log(feature.properties.desc, feature.properties.style);
              return feature.properties.style;
            }
          });
          //console.warn('createOverlay overlay geen config: ', overlay.naam, overlay.config);
        } else {
          //console.warn('createOverlay overlay wel config: ', layer, overlay.naam, overlay.config);
          dataFactoryOverlay.overlays[overlay.index] = L.geoJson(layer, overlay.config);
        }
        //console.log(dataFactoryOverlay.overlays[overlay.index]);
      }

    }

    //  var myLatLng = {
    //    lat: 5.996547,
    //    lng: 51.278549
    //  };

    function createOverlayBrowser(overlay) {
      //console.warn('createOverlay configOverlay: ', overlay.url);

      $http({
        method: 'GET',
        headers: 'X-PINGOTHER: \'pingpong\'',
        url: urlBase + overlay.url
      }).success(function (layer) {

        //console.log('createOverlay overlay layer: ', layer);
        //console.log('createOverlay overlay url: ', overlay.url);
        //console.log('createOverlay overlay index: ', overlay.index);
        //console.log('createOverlay overlay naam: ', overlay.naam);
        //console.log('createOverlay overlay bron: ', overlay.bron);
        //console.log('createOverlay overlay toelichting: ', overlay.toelichting);
        //console.log('createOverlay overlay legenda: ', overlay.legenda);
        //console.log('createOverlay overlay special: ', overlay.special);
        //console.log('createOverlay overlay cluster: ', overlay.cluster);
        //console.log('createOverlay overlay marker: ', overlay.marker);
        //console.log('createOverlay overlay config: ', overlay.config);
        updateStyleLayers(overlay, layer);
        $rootScope.$emit('OverlayReady', {
          layer: overlay.url
        });

        // eslint-disable-next-line no-unused-vars
      }).error(function (err) {
        //console.error('Error reading ' + overlay.naam + ': ', err);
      });
    }

    function createMijnOverlayBrowser(configOverlay) {
      var url = configOverlay.url.replace('Users/pietcrombach/Development/Projecten/trinl/', '');
      //console.warn('dataFactoryOverlay createMijnOverlayBrowser: ', url);
      url = url.replace('.gpx', '.geojson');
      //console.warn('dataFactoryOverlay createMijnOverlayBrowser: ', url);
      $http({
        method: 'POST',
        headers: 'X-PINGOTHER: \'pingpong\'',
        url: urlBase + url
      })
        .success(function (layer) {
          //console.log('dataFactoryOverlay createMijnOverlayBrowser layer, index: ', layer, configOverlay.index);

          dataFactoryOverlay.mijnOverlays[configOverlay.index] = L.geoJson(layer, configOverlay.config);
          $rootScope.$emit('MijnOverlaysReady', {
            configOverlay: configOverlay,
            layer: dataFactoryOverlay.mijnOverlays[configOverlay.index]
          });
          // eslint-disable-next-line no-unused-vars
        }).error(function (err) {
          //console.error('dataFactoryOverlay Error reading ' + configOverlay.naam + ': ', err);
        });
    }
    /**
     * Haal de standaard lagen met lagen op in
     * @return {[type]} [description]
     */
    dataFactoryOverlay.init = function () {

      var q = $q.defer();

      //console.warn('dataFactoryOverlay init');

      dataFactoryOverlay.ready = false;

      dataFactoryOverlay.configOverlays = [];
      dataFactoryOverlay.overlays = [];

      dataFactoryOverlay.configMijnOverlays = [];
      dataFactoryOverlay.mijnOverlays = [];

      dataFactorySync.updateStore(dataFactoryConfigLaag).then(function () {

        //if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        localStorage.setItem('configlaag', JSON.pruned(dataFactoryConfigLaag.store));
        //}

        //console.log('dataFactoryOverlay.init dataFactoryConfigLaag.store backend: ', JSON.stringify(dataFactoryConfigLaag.store));
        //console.log('dataFactoryOverlay.init dataFactoryConfigLaag.store backend: ', dataFactoryConfigLaag.store);

        loDash.each(dataFactoryConfigLaag.store, function (configLaag) {

          //console.log('dataFactoryOverlay.init configLaag backend: ', configLaag.menuNaam.value);

          var config = loDash.mapValues(configLaag, 'value');

          if (config.menuNaam.substr(0, 4) !== '*** ') {
            config.index = config.xindex;
            delete config.xindex;

            //console.log('dataFactoryOverlay.init index, type, menuNaam: backend ', config.index, config.type, config.menuNaam);

            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              if (config.type === '') {
                dataFactoryOverlay.configOverlays.push(config);
                createOverlayMobile(config);
              }
              if (config.type === 'thema') {
                dataFactoryOverlay.configMijnOverlays.push(config);
                createMijnOverlayMobile(config);
              }
            } else {
              if (config.type === '') {
                dataFactoryOverlay.configOverlays.push(config);
                createOverlayBrowser(config);
              }
              if (config.type === 'thema') {
                dataFactoryOverlay.configMijnOverlays.push(config);
                createMijnOverlayBrowser(config);
              }
            }
          } else {
            console.warn('FactoryOverlay menuNaam disabled backend: ', configLaag.menuNaam.value);
          }
        });

        //console.log('dataFactoryOverlay init desktop overlays OverlaysReady backend: ', dataFactoryConfigLaag.store);

        $timeout(() => {
          dataFactoryOverlay.ready = true;
          //console.error('emit OverlaysReady LocalStorage');
          $rootScope.$emit('OverlaysReady');
        }, 2000);
        q.resolve(dataFactoryOverlay.configMijnOverlays);

        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        if (dataFactoryConfigLaag.loaded) {
          //if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactoryOverlay lagen localStorage: ', JSON.stringify(dataFactoryConfigLaag.store));
          //console.log('dataFactoryOverlay lagen localStorage: ', dataFactoryConfigLaag.store);

          loDash.each(dataFactoryConfigLaag.store, function (configLaag) {

            //console.log('dataFactoryOverlay.init configLaag localStorage: ', configLaag.menuNaam.value);

            var config = loDash.mapValues(configLaag, 'value');
            //console.log('dataFactoryOverlay laag localStorage: ', config);

            if (config.menuNaam.substr(0, 4) !== '*** ') {
              config.index = config.xindex;
              delete config.xindex;

              //console.log('config LocalStorage: ', JSON.stringify(config));
              //console.log('dataFactoryOverlay.init index, type, menuNaam LocalStorage: ', config.index, config.type, config.menuNaam);

              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (config.type === '') {
                  dataFactoryOverlay.configOverlays.push(config);
                  createOverlayMobile(config);
                }
                if (config.type === 'thema') {
                  dataFactoryOverlay.configMijnOverlays.push(config);
                  createMijnOverlayMobile(config);
                }
              } else {
                if (config.type === '') {
                  dataFactoryOverlay.configOverlays.push(config);
                  createOverlayBrowser(config);
                }
                if (config.type === 'thema') {
                  dataFactoryOverlay.configMijnOverlays.push(config);
                  createMijnOverlayBrowser(config);
                }
              }
            } else {
              //console.error('FactoryOverlay menuNaam disabled localStorage: ', configLaag.menuNaam.value);
            }
          });

          //console.log('dataFactoryOverlay init overlays mobile from FS Ready OverlaysReady: ', JSON.stringify(dataFactoryOverlay.overlays));
          //console.log('dataFactoryOverlay init overlays mobile from FS Ready OverlaysReady localStorage: ', dataFactoryOverlay.configOverlays, dataFactoryOverlay.configMijnOverlays);

          $timeout(() => {
            dataFactoryOverlay.ready = true;
            //console.error('emit OverlaysReady LocalStorage');
            $rootScope.$emit('OverlaysReady');
          }, 1000);
          q.resolve(dataFactoryOverlay.configMijnOverlays);
        }
      });

      /*
      if (!dataFactoryConfigLaag.loaded) {

        dataFactorySync.updateStore(dataFactoryConfigLaag).then(function () {

          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            localStorage.setItem('configlaag', JSON.pruned(dataFactoryConfigLaag.store));
          }

          //console.log('dataFactoryOverlay.init dataFactoryConfigLaag.store: ', JSON.stringify(dataFactoryConfigLaag.store));
          console.log('dataFactoryOverlay.init dataFactoryConfigLaag.store: ', dataFactoryConfigLaag.store);

          loDash.each(dataFactoryConfigLaag.store, function (configLaag) {

            console.log('dataFactoryOverlay.init configLaag: ', configLaag.menuNaam.value);

            var config = loDash.mapValues(configLaag, 'value');

            if (config.menuNaam.substr(0, 4) !== '*** ') {
              config.index = config.xindex;
              delete config.xindex;

              console.log('dataFactoryOverlay.init index, type, menuNaam: ', config.index, config.type, config.menuNaam);

              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (config.type === '') {
                  dataFactoryOverlay.configOverlays.push(config);
                  createOverlayMobile(config);
                }
                if (config.type === 'thema') {
                  dataFactoryOverlay.configMijnOverlays.push(config);
                  createMijnOverlayMobile(config);
                }
              } else {
                if (config.type === '') {
                  dataFactoryOverlay.configOverlays.push(config);
                  createOverlayBrowser(config);
                }
                if (config.type === 'thema') {
                  dataFactoryOverlay.configMijnOverlays.push(config);
                  createMijnOverlayBrowser(config);
                }
              }
            } else {
              console.warn('FactoryOverlay menuNaam disabled: ', configLaag.menuNaam.value);
            }
          });

          console.log('dataFactoryOverlay init desktop overlays OverlaysReady backend: ', dataFactoryConfigLaag.store);

          dataFactoryOverlay.ready = true;
          $rootScope.$emit('OverlaysReady');
          q.resolve(dataFactoryOverlay.configMijnOverlays);

          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          console.error('updateStore ERROR: ', err);
          q.reject();
        });
      } else {

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //console.log('dataFactoryOverlay lagen localStorage: ', JSON.stringify(dataFactoryConfigLaag.store));
          console.log('dataFactoryOverlay lagen localStorage: ', dataFactoryConfigLaag.store);

          loDash.each(dataFactoryConfigLaag.store, function (configLaag) {

            console.log('dataFactoryOverlay.init configLaag localStorage: ', configLaag.menuNaam.value);

            var config = loDash.mapValues(configLaag, 'value');

            if (config.menuNaam.substr(0, 4) !== '*** ') {
              config.index = config.xindex;
              delete config.xindex;

              if (config.type === '') {
                dataFactoryOverlay.configOverlays.push(config);
                createOverlayMobile(config);
              }
              if (config.type === 'thema') {
                dataFactoryOverlay.configMijnOverlays.push(config);
                createMijnOverlayMobile(config);
              }
            } else {
              console.error('FactoryOverlay menuNaam disabled localStorage: ', configLaag.menuNaam.value);
            }
          });

          //console.log('dataFactoryOverlay init overlays mobile from FS Ready OverlaysReady: ', JSON.stringify(dataFactoryOverlay.overlays));
          console.log('dataFactoryOverlay init overlays mobile from FS Ready OverlaysReady localStorage: ', dataFactoryOverlay.configOverlays);

          dataFactoryOverlay.ready = true;
          $rootScope.$emit('OverlaysReady');
          q.resolve(dataFactoryOverlay.configOverlays);
        }
      }
      */
      return q.promise;
    };
    return dataFactoryOverlay;
  }
]);
