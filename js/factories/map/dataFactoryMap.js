/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
trinl.factory('dataFactoryMap', ['loDash', 'BASE', '$q', '$location', '$rootScope', '$timeout', '$interval', '$ionicPopup', '$ionicPlatform', '$cordovaNetwork', '$cordovaFile', '$cordovaFileTransfer', 'dataFactorySync', 'dataFactoryGeom', 'dataFactoryConfigKaart', 'dataFactoryAlive', 'dataFactoryOverlay', function (loDash, BASE, $q, $location, $rootScope, $timeout, $interval, $ionicPopup, $ionicPlatform, $cordovaNetwork, $cordovaFile, $cordovaFileTransfer, dataFactorySync, dataFactoryGeom, dataFactoryConfigKaart, dataFactoryAlive, dataFactoryOverlay) {
  //console.warn('dataFactoryMap');

  var dataFactoryMap = {};

  dataFactoryMap.configKaartItems = [];

  var configKaartItems;
  var configKaartHedenItems;
  var configKaartToekomstItems;
  var configKaartVerledenItems;
  var configKaartNietHedenItems;
  var configKaartThemaItems;

  dataFactoryMap.ready = false;
  dataFactoryMap.map = [];

  dataFactoryAlive.status = 4;

  var trinlFileDir;
  var fileTransferOptions = {};
  fileTransferOptions.headers = {
    Connection: 'close'
  };

  ionic.Platform.ready(function () {
    if (ionic.Platform.isAndroid()) {
      trinlFileDir = cordova.file.externalDataDirectory;
      //trinlFileDir = cordova.file.dataDirectory;
    }
    if (ionic.Platform.isIOS()) {
      trinlFileDir = cordova.file.documentsDirectory;
      //trinlFileDir = cordova.file.dataDirectory;
    }
  });

  var url = 'https://www.pcmatic.nl/';

  if ($location.$$host === '') {
    url = BASE.URL;
  }
  if ($location.$$host === 'localhost') {
    url = 'http://localhost/trinl/';
  }
  if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
    url = 'https://www.trinl.nl/';
  }
  if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
    url = 'https://www.pcmatic.nl/';
  }

  //console.error('dataFactoryMap url: ', url);

  //console.log('Map: ', url);

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

  // 🍂namespace TileLayer

  // 🍂option useCache: Boolean = false
  // Whether to use a PouchDB cache on this tile layer, or not
  L.TileLayer.prototype.options.useCache = false;

  // 🍂option saveToCache: Boolean = true
  // When caching is enabled, whether to save new tiles to the cache or not
  L.TileLayer.prototype.options.saveToCache = true;

  // 🍂option useOnlyCache: Boolean = false
  // When caching is enabled, whether to request new tiles from the network or not
  L.TileLayer.prototype.options.useOnlyCache = false;

  // 🍂option useCache: String = 'image/png'
  // The image format to be used when saving the tile images in the cache
  L.TileLayer.prototype.options.cacheFormat = 'image/png';

  // 🍂option cacheMaxAge: Number = 24*3600*1000
  // Maximum age of the cache, in seconds
  L.TileLayer.prototype.options.cacheMaxAge = 24 * 3600 * 1000;

  // 🍂option cacheMaxAge: Number = 24*3600*1000
  // Maximum age of the cache, in seconds
  L.TileLayer.prototype.options.cacheFolder = '';

  var isRingBbox = function (ring, bbox) {
    if (ring.length !== 4) {
      return false;
    }

    var p, sumX = 0,
      sumY = 0;

    for (p = 0; p < 4; p++) {
      if ((ring[p].x !== bbox.min.x && ring[p].x !== bbox.max.x) ||
        (ring[p].y !== bbox.min.y && ring[p].y !== bbox.max.y)) {
        return false;
      }

      sumX += ring[p].x;
      sumY += ring[p].y;

      //bins[Number(ring[p].x === bbox.min.x) + 2 * Number(ring[p].y === bbox.min.y)] = 1;
    }

    //check that we have all 4 vertex of bbox in our geometry
    return sumX === 2 * (bbox.min.x + bbox.max.x) && sumY === 2 * (bbox.min.y + bbox.max.y);
  };

  var ExtendMethods = {
    _toMercGeometry: function (b, isGeoJSON) {
      var res = [];
      var c, r, p,
        mercComponent,
        mercRing,
        coords;

      if (!isGeoJSON) {
        if (!(b[0] instanceof Array)) {
          b = [
            [b]
          ];
        } else if (!(b[0][0] instanceof Array)) {
          b = [b];
        }
      }

      for (c = 0; c < b.length; c++) {
        mercComponent = [];
        for (r = 0; r < b[c].length; r++) {
          mercRing = [];
          for (p = 0; p < b[c][r].length; p++) {
            coords = isGeoJSON ? L.latLng(b[c][r][p][1], b[c][r][p][0]) : b[c][r][p];
            mercRing.push(this._map.project(coords, 0));
          }
          mercComponent.push(mercRing);
        }
        res.push(mercComponent);
      }

      return res;
    },

    //lazy calculation of layer's boundary in map's projection. Bounding box is also calculated
    _getOriginalMercBoundary: function () {
      if (this._mercBoundary) {
        return this._mercBoundary;
      }

      var compomentBbox, c;

      if (L.Util.isArray(this.options.boundary)) { //Depricated: just array of coordinates
        this._mercBoundary = this._toMercGeometry(this.options.boundary);
      } else { //GeoJSON
        this._mercBoundary = [];
        var processGeoJSONObject = function (obj) {
          if (obj.type === 'GeometryCollection') {
            obj.geometries.forEach(processGeoJSONObject);
          } else if (obj.type === 'Feature') {
            processGeoJSONObject(obj.geometry);
          } else if (obj.type === 'FeatureCollection') {
            obj.features.forEach(processGeoJSONObject);
          } else if (obj.type === 'Polygon') {
            this._mercBoundary = this._mercBoundary.concat(this._toMercGeometry([obj.coordinates], true));
          } else if (obj.type === 'MultiPolygon') {
            this._mercBoundary = this._mercBoundary.concat(this._toMercGeometry(obj.coordinates, true));
          }
        }.bind(this);
        processGeoJSONObject(this.options.boundary);
      }

      this._mercBbox = new L.Bounds();
      for (c = 0; c < this._mercBoundary.length; c++) {
        compomentBbox = new L.Bounds(this._mercBoundary[c][0]);
        this._mercBbox.extend(compomentBbox.min);
        this._mercBbox.extend(compomentBbox.max);
      }

      return this._mercBoundary;
    },

    _getClippedGeometry: function (geom, bounds) {
      var clippedGeom = [],
        clippedComponent,
        clippedExternalRing,
        clippedHoleRing,
        iC, iR;

      for (iC = 0; iC < geom.length; iC++) {
        clippedComponent = [];
        clippedExternalRing = L.PolyUtil.clipPolygon(geom[iC][0], bounds);
        if (clippedExternalRing.length === 0) {
          continue;
        }

        clippedComponent.push(clippedExternalRing);

        for (iR = 1; iR < geom[iC].length; iR++) {
          clippedHoleRing = L.PolyUtil.clipPolygon(geom[iC][iR], bounds);
          if (clippedHoleRing.length > 0) {
            clippedComponent.push(clippedHoleRing);
          }
        }
        clippedGeom.push(clippedComponent);
      }

      if (clippedGeom.length === 0) { //we are outside of all multipolygon components
        return {
          isOut: true
        };
      }

      for (iC = 0; iC < clippedGeom.length; iC++) {
        if (isRingBbox(clippedGeom[iC][0], bounds)) {
          //inside exterior rings and no holes
          if (clippedGeom[iC].length === 1) {
            return {
              isIn: true
            };
          }
        } else { //intersects exterior ring
          return {
            geometry: clippedGeom
          };
        }

        for (iR = 1; iR < clippedGeom[iC].length; iR++) {
          //inside exterior ring, but have intersection with a hole
          if (!isRingBbox(clippedGeom[iC][iR], bounds)) {
            return {
              geometry: clippedGeom
            };
          }
        }
      }

      //we are inside all holes in geometry
      return {
        isOut: true
      };
    },

    // Calculates intersection of original boundary geometry and tile boundary.
    // Uses quadtree as cache to speed-up intersection.
    // Return
    //   {isOut: true} if no intersection,
    //   {isIn: true} if tile is fully inside layer's boundary
    //   {geometry: <LatLng[][][]>} otherwise
    _getTileGeometry: function (x, y, z, skipIntersectionCheck) {
      if (!this.options.boundary) {
        return {
          isIn: true
        };
      }

      var cacheID = x + ':' + y + ':' + z,
        zCoeff = Math.pow(2, z),
        parentState,
        cache = this._boundaryCache;

      if (cache[cacheID]) {
        return cache[cacheID];
      }

      var mercBoundary = this._getOriginalMercBoundary(),
        ts = this.options.tileSize,
        tileBbox = new L.Bounds(new L.Point(x * ts / zCoeff, y * ts / zCoeff), new L.Point((x + 1) * ts / zCoeff, (y + 1) * ts / zCoeff));

      //fast check intersection
      if (!skipIntersectionCheck && !tileBbox.intersects(this._mercBbox)) {
        return {
          isOut: true
        };
      }

      if (z === 0) {
        cache[cacheID] = {
          geometry: mercBoundary
        };
        return cache[cacheID];
      }

      parentState = this._getTileGeometry(Math.floor(x / 2), Math.floor(y / 2), z - 1, true);

      if (parentState.isOut || parentState.isIn) {
        return parentState;
      }

      cache[cacheID] = this._getClippedGeometry(parentState.geometry, tileBbox);
      return cache[cacheID];
    },

    _drawTileInternal: function (canvas, tilePoint, url, callback) {
      var zoom = this._getZoomForUrl(),
        state = this._getTileGeometry(tilePoint.x, tilePoint.y, zoom);

      if (state.isOut) {
        callback();
        return;
      }

      var ts = this.options.tileSize,
        tileX = ts * tilePoint.x,
        tileY = ts * tilePoint.y,
        zCoeff = Math.pow(2, zoom),
        ctx = canvas.getContext('2d'),
        imageObj = new Image();
      // eslint-disable-next-line no-unused-vars
      //_this = this;

      var setPattern = function () {
        var c, r, p,
          pattern,
          geom;

        if (!state.isIn) {
          geom = state.geometry;
          ctx.beginPath();

          for (c = 0; c < geom.length; c++) {
            for (r = 0; r < geom[c].length; r++) {
              if (geom[c][r].length === 0) {
                continue;
              }

              ctx.moveTo(geom[c][r][0].x * zCoeff - tileX, geom[c][r][0].y * zCoeff - tileY);
              for (p = 1; p < geom[c][r].length; p++) {
                ctx.lineTo(geom[c][r][p].x * zCoeff - tileX, geom[c][r][p].y * zCoeff - tileY);
              }
            }
          }
          ctx.clip();
        }

        pattern = ctx.createPattern(imageObj, 'repeat');
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fill();
        callback();
      };

      if (this.options.crossOrigin) {
        imageObj.crossOrigin = '';
      }

      imageObj.onload = function () {
        //TODO: implement correct image loading cancelation
        canvas.complete = true; //HACK: emulate HTMLImageElement property to make happy L.TileLayer
        setTimeout(setPattern, 0); //IE9 bug - black tiles appear randomly if call setPattern() without timeout
      };

      imageObj.src = url;
    },

    onAdd: function (map) {
      (L.TileLayer.Canvas || L.TileLayer).prototype.onAdd.call(this, map);

      if (this.options.trackAttribution) {
        map.on('moveend', this._updateAttribution, this);
        //this._updateAttribution();
      }
    },

    onRemove: function (map) {
      (L.TileLayer.Canvas || L.TileLayer).prototype.onRemove.call(this, map);

      if (this.options.trackAttribution) {
        map.off('moveend', this._updateAttribution, this);
        if (!this._attributionRemoved) {
          var attribution = L.TileLayer.BoundaryCanvas.prototype.getAttribution.call(this);
          map.attributionControl.removeAttribution(attribution);
        }
      }
    },

    //_updateAttribution: function () {
    //}
  };

  L.TileLayer.BoundaryCanvas = L.TileLayer.extend({
    options: {
      // all rings of boundary should be without self-intersections or intersections with other rings
      // zero-winding fill algorithm is used in canvas, so holes should have opposite direction to exterior ring
      // boundary can be
      // LatLng[] - simple polygon
      // LatLng[][] - polygon with holes
      // LatLng[][][] - multipolygon
      boundary: null
    },
    includes: ExtendMethods,
    initialize: function (url, options) {

      //console.log('dataFactoryMap NietHeden initialize url, options: ', url, options);

      L.TileLayer.prototype.initialize.call(this, url, options);
      this._boundaryCache = {}; //cache index "x:y:z"
      this._mercBoundary = null;
      this._mercBbox = null;

      if (this.options.trackAttribution) {
        this._attributionRemoved = true;
        this.getAttribution = null;
      }
    },

    createTile: function (coords, done) {

      //console.log('dataFactoryMap NietHeden createTile: ', coords);

      var me = this;

      var error;

      var tile = L.DomUtil.create('canvas', 'leaflet-tile');

      var url = me.getTileUrl(coords);

      tile.width = tile.height = me.options.tileSize;
      me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));

      tile.onerror = L.bind(me._tileOnError, me, done, tile);

      if (me.options.crossOrigin) {
        tile.crossOrigin = '';
      }
      //
      // Alt tag is *set to empty string to keep screen readers from reading URL and for compliance reasons
      // http://www.w3.org/TR/WCAG20-TECHS/H67
      //
      tile.alt = '';

      //
      // Set role="presentation" to force screen readers to ignore this
      // https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
      //
      tile.setAttribute('role', 'presentation');

      var hostPath = me.options.hostPath;

      hostPath = hostPath.replace('{x}', coords.x);
      hostPath = hostPath.replace('{y}', coords.y);
      hostPath = hostPath.replace('{z}', coords.z);
      var s = loDash.sample(['a', 'b', 'c']);
      hostPath = hostPath.replace('{s}', s);

      //console.log('dataFactoryMap Nietheden hostPath: ', hostPath);

      ionic.Platform.ready(function () {
        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {

          var clientPath = hostPath;

          var params = clientPath.indexOf('?');
          //console.log('dataFactoryMap NietHeden params: ', params);
          if (params >= 0) {
            clientPath = clientPath.substr(0, params);
          }
          var last = nthLastIndex(clientPath, '/', 3);
          var temp = clientPath.substr(last + 1);

          //console.log('dataFactoryMap NietHeden temp: ', temp);

          clientPath = 'tiles/' + me.options.cacheFolder + '/' + temp;

          //console.log('dataFactoryMap NietHeden clientPath: ', trinlFileDir + clientPath);
          if (me.options.useCache) {

            $cordovaFile.checkFile(trinlFileDir, clientPath).then(function () {
              //console.log('dataFactoryMap NietHeden tile from cache');
              //console.log('dataFactoryMap NietHeden Tile: ' + trinlFileDir + clientPath + ' is in clientCache');
              //console.log('dataFactoryMap NietHeden tile: ', tile);
              tile.src = trinlFileDir + clientPath;
              //console.log('dataFactoryMap NietHeden tileload from clientCache: ' + trinlFileDir + clientPath);
              //me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
              me._drawTileInternal(tile, coords, trinlFileDir + clientPath, L.bind(done, null, null, tile));
              //console.log('dataFactoryMap NietHeden tile from cache tile, coords, url: ', tile, coords, url);
              $timeout(function () {
                done(error, tile);
              });

              //done(error, tile);
            }, function () {
              //console.log('dataFactoryMap NietHeden tile NOT IN cache');

              //console.log('dataFactoryMap NietHeden OSM Download tile: ' + hostPath + ' ==> ' + trinlFileDir + clientPath);
              $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPath, fileTransferOptions, true).then(function () {
                tile.src = trinlFileDir + clientPath;
                //console.log('dataFactoryMap NietHeden Download TRINL caching: ' + trinlFileDir + clientPath + '  SUCCESS');
                //me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
                me._drawTileInternal(tile, coords, trinlFileDir + clientPath, L.bind(done, null, null, tile));
                $timeout(function () {
                  done(error, tile);
                });
                //done(error, tile);
              }, function (error) {
                //console.error('dataFactoryMap NietHeden Download ERROR: ' + error.code);
                //tile.src = L.Util.emptyImageUrl;
                //me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
                me._drawTileInternal(tile, coords, trinlFileDir + clientPath, L.bind(done, null, null, tile));
                $timeout(function () {
                  done(error, tile);
                });
                //done(error, tile);
              });
            });
          } else {
            //console.log('dataFactoryMap NietHeden createTile Mobile BROWSER mode');
            tile.src = hostPath;
            me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
            done(error, tile);
          }
        } else {
          //console.log('dataFactoryMap NietHeden createTile BROWSER mode');
          tile.src = hostPath;
          //me._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
          done(error, tile);
        }
      });
      return tile;
    }
  });

  L.TileLayer.boundaryCanvas = function (url, options) {
    return new L.TileLayer.BoundaryCanvas(url, options);
  };

  function nthLastIndex(str, pat, n) {
    var i = str.length;
    while (n-- && i-- > 0) {

      i = str.lastIndexOf(pat, i);
      if (i < 0) {
        i = -1;
        break;
      }
    }
    return i;
  }

  L.TileLayer.CachedHeden = L.GridLayer.extend({

    initialize: function (url, options) {

      //console.warn('dataFactoryMap Heden initialize url, options: ', url, options);

      L.Util.setOptions(this, options);
      this._url = url;
    },

    createTile: function (coords, done) {

      var me = this;

      var error;

      var tile = document.createElement('img');

      if (me.options.crossOrigin) {
        tile.crossOrigin = '';
      }

      //
      //Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
      //http://www.w3.org/TR/WCAG20-TECHS/H67
      //
      tile.alt = '';
      //
      // Set role="presentation" to force screen readers to ignore this
      // https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
      //
      tile.setAttribute('role', 'presentation');

      var hostPath = me.options.hostPath;

      hostPath = hostPath.replace('{x}', coords.x);
      hostPath = hostPath.replace('{y}', coords.y);
      hostPath = hostPath.replace('{z}', coords.z);
      var s = loDash.sample(['a', 'b', 'c']);
      hostPath = hostPath.replace('{s}', s);

      //console.log('dataFactoryMap Heden hostPath: ', hostPath);

      ionic.Platform.ready(function () {
        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {

          var clientPath = hostPath;

          var params = clientPath.indexOf('?');
          //console.log('dataFactoryMap Heden params: ', params);
          if (params >= 0) {
            clientPath = clientPath.substr(0, params);
          }
          var last = nthLastIndex(clientPath, '/', 3);
          var temp = clientPath.substr(last + 1);

          //console.log('dataFactoryMap Heden temp: ', temp);

          clientPath = 'tiles/' + me.options.cacheFolder + '/' + temp;

          (function (clientPath) {

            //console.log('dataFactoryMap Heden clientPath: ', trinlFileDir + clientPath);
            if (me.options.useCache) {

              $cordovaFile.checkFile(trinlFileDir, clientPath).then(function () {
                //console.log('dataFactoryMap Heden tile from cache');
                //console.log('dataFactoryMap Heden tile: ', tile);
                tile.src = trinlFileDir + clientPath;
                //console.log('dataFactoryMap Heden tileload from clientCache: ' + trinlFileDir + clientPath);
                $timeout(function () {
                  done(error, tile);
                });
              }, function () {
                //console.log('dataFactoryMap Heden tile NOT IN cache');
                //console.log('dataFactoryMap Heden Download tile: ' + hostPath + ' ==> ' + trinlFileDir + clientPath);
                $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPath, fileTransferOptions, true).then(function () {
                  tile.src = trinlFileDir + clientPath;
                  //console.log('dataFactoryMap Heden Download TRINL caching: ' + trinlFileDir + clientPath + '  SUCCESS');
                  $timeout(function () {
                    done(null, tile);
                  });
                }, function (error) {
                  //console.error('dataFactoryMap Heden Download ERROR: ', error.code, hostPath, trinlFileDir + clientPath);
                  $timeout(function () {
                    $cordovaFileTransfer.download(hostPath, trinlFileDir + clientPath, fileTransferOptions, true).then(function () {
                      tile.src = trinlFileDir + clientPath;
                      //console.log('dataFactoryMap Heden Download (RETRY) TRINL caching: ' + trinlFileDir + clientPath + '  SUCCESS');
                      $timeout(function () {
                        done(null, tile);
                      });
                    }, function (error) {
                      //tile.src = L.Util.emptyImageUrl;
                      //console.error('dataFactoryMap Heden Download ERROR emptyImageURL: ', error.code, hostPath, trinlFileDir + clientPath);
                      //$timeout(function () {
                      //done(error, tile);
                      //});
                    });
                  }, 1000);
                });
              });
            } else {
              //console.log('dataFactoryMap Heden createTile mobile BROWSER mode: ', hostPath);
              tile.src = hostPath;
              //$timeout(function () {
              done(null, tile);
              //});
            }
          })(clientPath);

        } else {

          //console.log('dataFactoryMap Heden createTile BROWSER mode: ', hostPath);
          tile.src = hostPath;
          //$timeout(function () {
          done(null, tile);
          //});
        }
      });

      //console.warn('dataFactoryMap Heden createTile tile: ', tile);
      return tile;
    }
  });

  //console.log('==================================================');
  //console.log('dataFactoryMap url: ', url);
  //console.log('==================================================');

  var southWest = L.latLng(49.5, 2.36);
  southWest = L.latLng(49.76, 2.36);
  southWest = L.latLng(50.7, 3.5);
  southWest = L.latLng(49, 1);
  //southWest = L.latLng(48.9, 2.1);
  var northEast = L.latLng(53, 9.38);
  northEast = L.latLng(52.22, 9.38);
  northEast = L.latLng(54, 7.5);
  northEast = L.latLng(54, 9);
  //northEast = L.latLng(54.16, 9.14);

  var globalBounds = L.latLngBounds(southWest, northEast);

  var limburgBounds = L.latLngBounds([
    [50.73, 6.25],
    [51.79, 5.53]
  ]);

  var nederlandBounds = L.latLngBounds([
    [50.73, 7.27],
    [53.54, 3.08]
  ]);
  /**
   * Input: tabel configKaartItems uit function init
   * Verdeel de tabel configKaartItems in diverse tabellen
   * voor de UI zijn nodig de tabellen: Heden, Tokomst, Verleden en Thema
   * De tabel Thema krijgt indexen die volgen op de hoogste index die voortkomt in de tabel configKaartItems
   * De tabel nietHeden bevat alle kaarten die niet in de tabel heden voorkomen
   *
   * Adhv de tabellen configKaartHeden en configKaartNietheden worden de TileLayers aangemaakt
   * Dmv een event wordt KaartCtrl gemeld dat d eTilelyers beschikbaar zijn.
   */
  function initMaps() {

    configKaartItems = dataFactoryMap.configKaartItems;
    var maxIndex = 0;
    loDash.each(configKaartItems, function (item) {
      if (maxIndex < item.index) {
        maxIndex = parseInt(item.index);
      }
    });
    //console.log('dataFactoryMap configKaartItems getConfig: ', configKaartItems);

    configKaartHedenItems = loDash.filter(configKaartItems, function (kaart) {
      return kaart.type === 'heden';
    });
    configKaartToekomstItems = loDash.filter(configKaartItems, function (kaart) {
      return kaart.type === 'toekomst';
    });
    configKaartVerledenItems = loDash.filter(configKaartItems, function (kaart) {
      return kaart.type === 'verleden';
    });
    configKaartThemaItems = loDash.filter(configKaartItems, function (kaart) {
      return kaart.type === 'thema';
    });

    L.TileLayer.cachedNietHeden = function (url, options) {
      return new L.TileLayer.boundaryCanvas(url, options);
    };

    L.TileLayer.cachedHeden = function (url, options) {
      return new L.TileLayer.CachedHeden(url, options);
    };

    //console.log('datafactoryMap InitMaps aantal kaarten gevonden: ', configKaartItems.length - configKaartThemaItems.length);

    var tmp = configKaartVerledenItems.concat(configKaartToekomstItems);
    configKaartNietHedenItems = tmp.concat(configKaartThemaItems);

    loDash.each(configKaartHedenItems, function (configKaartItem) {

      var http = configKaartItem.url.indexOf('http');
      if (http < 0) {
        configKaartItem.url = url + configKaartItem.url;
      }
      configKaartItem.url = configKaartItem.url.replace('.nl/trinl', '.nl');

      //console.log('datafactoryMap Heden configKaartItem url, attribute: ', configKaartItem.url);

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        dataFactoryMap.map[configKaartItem.index] = L.TileLayer.cachedHeden(configKaartItem.url, {
          attribution: configKaartItem.attribute,
          edgeBufferTiles: 1,
          minZoom: 8,
          maxZoom: configKaartItem.maxZoom,
          minNativeZoom: 8,
          maxNativeZoom: configKaartItem.maxZoom,
          format: 'image/png',
          transparent: true,
          async: true,
          maxBounds: globalBounds,
          bounds: globalBounds,
          hostPath: configKaartItem.url,
          useCache: configKaartItem.useCache,
          cacheFolder: configKaartItem.cacheFolder,
          cacheMaxAge: configKaartItem.cacheMaxAge,
          crossOrigin: true,
          subdomeins: configKaartItem.subdomeins
        });
      } else {
        var tileSize = 256;
        var zoomOffset = 0;
        if (configKaartItem.url.indexOf('https://api.maptiler.com/') !== -1) {
          tileSize = 512;
          zoomOffset = -1;
        }
        dataFactoryMap.map[configKaartItem.index] = L.tileLayer(configKaartItem.url, {
          attribution: configKaartItem.attribute,
          edgeBufferTiles: 1,
          tileSize: tileSize,
          zoomOffset: zoomOffset,
          minZoom: 8,
          maxZoom: configKaartItem.maxZoom,
          minNativeZoom: 8,
          maxNativeZoom: configKaartItem.maxZoom,
          format: 'image/png',
          transparent: true,
          async: true,
          maxBounds: globalBounds,
          bounds: globalBounds,
          hostPath: configKaartItem.url,
          useCache: configKaartItem.useCache,
          cacheFolder: configKaartItem.cacheFolder,
          cacheMaxAge: configKaartItem.cacheMaxAge,
          crossOrigin: true,
          subdomeins: configKaartItem.subdomeins
        });

      }
    });

    loDash.each(configKaartNietHedenItems, function (configKaartItem) {
      var geom = dataFactoryGeom.limburgGeom;
      if (configKaartItem.naam === '1600') {
        geom = dataFactoryGeom.limburg1600Geom;
      }
      //console.log('datafactoryMap NietHeden naam, url, geom: ', configKaartItem.naam, configKaartItem.url, geom);

      var http = configKaartItem.url.indexOf('http');
      if (http < 0) {
        configKaartItem.url = url + configKaartItem.url;
      }
      configKaartItem.url = configKaartItem.url.replace('.nl/trinl', '.nl');


      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        //console.log('datafactoryMap cacheNietHeden url: ', configKaartItem.url);
        dataFactoryMap.map[configKaartItem.index] = new L.TileLayer.cachedNietHeden(configKaartItem.url, {
          attribution: configKaartItem.attribute,
          edgeBufferTiles: 1,
          boundary: geom,
          minZoom: 8,
          maxZoom: configKaartItem.maxZoom,
          maxNativeZoom: configKaartItem.maxZoom,
          minNativeZoom: 8,
          format: 'image/png',
          transparent: true,
          bounds: globalBounds,
          hostPath: configKaartItem.url,
          useCache: configKaartItem.useCache,
          cacheFolder: configKaartItem.cacheFolder,
          cacheMaxAge: configKaartItem.cacheMaxAge,
          crossOrigin: true
        });
      } else {
        //console.log('datafactoryMap boundaryCanvas url: ', configKaartItem.url);
        dataFactoryMap.map[configKaartItem.index] = new L.TileLayer.boundaryCanvas(configKaartItem.url, {
          attribution: configKaartItem.attribute,
          edgeBufferTiles: 1,
          boundary: geom,
          minZoom: 8,
          maxZoom: configKaartItem.maxZoom,
          maxNativeZoom: configKaartItem.maxZoom,
          minNativeZoom: 8,
          format: 'image/png',
          transparent: true,
          bounds: globalBounds,
          hostPath: configKaartItem.url,
          useCache: configKaartItem.useCache,
          cacheFolder: configKaartItem.cacheFolder,
          cacheMaxAge: configKaartItem.cacheMaxAge,
          crossOrigin: true
        });

      }
    });
    $timeout(() => {
      dataFactoryMap.ready = true;
      //console.error('emit MapsReady LocalStorage');
      $rootScope.$emit('MapsReady');
    }, 200);

    //console.log(dataFactoryMap.map);
    //if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
    //dataFactoryMap.ready = true;
    //console.log('emit MapsReady!!!');
    //$rootScope.$emit('MapsReady');
  }
  /**
   * Prepareer eerst een tabel met kaartitems
   * Input via ThemaKaart Store ophalen
   * Verander de naam van het veld xindex (MySQL) in index
   * Mbv de tabel configKaartItems wordt de functie initMaps uitgevoerd
   */
  dataFactoryMap.init = function () {

    var q = $q.defer();
    //console.log('datafactoryMap init: ', url + 'tiles/LimburgOSM/{z}/{x}/{y}.png');
    dataFactoryMap.configKaartItems = [];

    //console.warn('dataFactoryMap init');

    dataFactoryMap.ready = false;
    dataFactoryMap.map = [];

    dataFactoryMap.map[0] = L.tileLayer(url + 'tiles/LimburgOSM/{z}/{x}/{y}.png', {
      //dataFactoryMap.map[0] = L.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
      attribution: ' &copy; OpenStreetMap',
      edgeBufferTiles: 1,
      minZoom: 8,
      maxZoom: 19,
      format: 'image/png',
      transparent: true,
      async: true,
      maxBounds: globalBounds,
      bounds: globalBounds,
      //hostPath: url + 'tiles/LimburgOSM/{z}/{x}/{y}.png',
      hostPath: 'assets/tiles/{z}/{x}/{y}.png',
      crossOrigin: true,
      subdomeins: '1'
    });


    dataFactorySync.updateStore(dataFactoryConfigKaart).then(function () {

      localStorage.setItem('configkaart', JSON.pruned(dataFactoryConfigKaart.store));

      //console.log('dataFactoryMap maps updateStore from backend: ', JSON.stringify(dataFactoryConfigKaart.store));
      //console.log('dataFactoryMap maps updateStore from backend: ', dataFactoryConfigKaart.store);

      loDash.each(dataFactoryConfigKaart.store, function (item) {
        var itemmap = loDash.mapValues(item, 'value');
        itemmap.index = itemmap.xindex;
        delete itemmap.xindex;
        if (itemmap.menuNaam.substr(0, 4) !== '*** ') {
          //console.log('FactoryMap itemmap backend: ', itemmap);
          dataFactoryMap.configKaartItems.push(itemmap);
        } else {
          //console.warn('Kaart menuNaam disabled backend: ', itemmap.menuNaam);
        }
      });
      initMaps();
      q.resolve(dataFactoryConfigKaart.store);
    }, function (error) {

      if (dataFactoryConfigKaart.loaded) {

        //console.log('dataFactoryMap from LocalStorage: ', JSON.pruned(dataFactoryConfigKaart.store));
        //console.log('dataFactoryMap from LocalStorage: ', dataFactoryConfigKaart.store);

        loDash.each(dataFactoryConfigKaart.store, function (item) {
          var itemmap = loDash.mapValues(item, 'value');
          itemmap.index = itemmap.xindex;
          delete itemmap.xindex;
          if (itemmap.menuNaam.substr(0, 4) !== '*** ') {
            //console.log('FactoryMap itemmap LocalStorage: ', itemmap);
            dataFactoryMap.configKaartItems.push(itemmap);
          } else {
            //console.warn('Kaart menuNaam disabled LocalStorage: ', itemmap.menuNaam);
          }
        });
        initMaps();
        q.resolve(dataFactoryConfigKaart.store);
      }
    });
    return q.promise;
  };
  $rootScope.$emit('MapsReadyEnd');
  /*
  $ionicPlatform.ready(function () {

    function removeLayers(index, tilesNew, tiles, aantalLayers) {
      //console.log('removeLayers started');
      //
      // iterate thru tabel of json objects
      // catch version per layer
      //
      if (index >= aantalLayers) {
        var hostPath = url + 'tiles/tiles.json';
        var clientPath = trinlFileDir + 'tiles/tiles.json';

        //console.log('Download tiles.json from: ' + hostPath + ' => ' + clientPath);
        $cordovaFileTransfer.download(hostPath, clientPath, fileTransferOptions, true).then(function () {
          //console.log('Downloaded tiles.json installed');
          $cordovaFile.removeFile(trinlFileDir, 'tiles/tilesNew.json').then(function () {
            //console.log('tilesNew.json removed');
          },
            function (err) {
              //console.error('tilesNew.json removed ERROR: ', err);
            });
        },
          function (err) {
            //console.error('tilesNew.json download ERROR: ', err);
          });
        //console.log('removeLayers completed');
        return;
      }

      if (tiles) {
        //console.log('tiles  : ', tiles, tilesNew);
        if (tilesNew.layers[index].version !== tiles.layers[index].version) {
          //console.error('NIEUWE KAART ' + tilesNew.layers[index].name + '. OUDE KAART MOET DUS GEWIST WORDEN!!!!');

          $ionicPopup.confirm({
            title: 'Nieuwe kaart',
            content: 'TRINL heeft een nieuwe kaart<br>' + tilesNew.layers[index].name + '<br>Bijwerken?'
          })
            .then(function (result) {
              if (result) {
                $cordovaFile.removeRecursively(trinlFileDir, 'tiles/' + tilesNew.layers[index].folder).then(function () {
                  //console.log('Remove Recursivily Kaart ' + tilesNew.layers[index].folder);
                  removeLayers(index + 1, tilesNew, tiles, aantalLayers);
                },
                  function (err) {
                    //console.error('Remove Recursivily ' + tilesNew.layers[index].folder + ' ERROR: ', err);
                    removeLayers(index + 1, tilesNew, tiles, aantalLayers);
                  });
              }
            });


        }
      } else {
        //console.error('GEEN OUDE tiles.json MOET DUS GEWIST WORDEN!!!!');
        //console.log(index);
        //console.log(tilesNew.layers[index]);
        $cordovaFile.removeRecursively(trinlFileDir, 'tiles/' + tilesNew.layers[index].folder).then(function () {
          //console.log('Removed Kaart ' + tilesNew.layers[index].folder);
          removeLayers(index + 1, tilesNew, tiles, aantalLayers);
        },
          function (err) {
            //console.error('Remove Recursivily ' + tilesNew.layers[index].folder + ' ERROR: ', err);
            removeLayers(index + 1, tilesNew, tiles, aantalLayers);
          });
      }
    }


    if ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline() && dataFactoryAlive.status !== 0) {
      var hostPath = url + 'tiles/tiles.json';
      var clientPath = trinlFileDir + 'tiles/tilesNew.json';
      var aantalLayers = 0;
      var tilesNew;

      //console.log('Download tilesNew.json from: ' + hostPath + ' => ' + clientPath);
      $cordovaFileTransfer.download(hostPath, clientPath, fileTransferOptions, true).then(function () {
        //console.log('Downloaded tilesNew.json');
        $cordovaFile.readAsText(trinlFileDir, 'tiles/tilesNew.json').then(function (result) {
          //console.log('Read tilesNew.json result: ' + result);
          tilesNew = JSON.parse(result);
          aantalLayers = tilesNew.layers.length;
          //console.log('tilesNew: ', tilesNew);
          //console.log('tilesNew aantal: ' + aantalLayers);
          $cordovaFile.readAsText(trinlFileDir, 'tiles/tiles.json').then(function (result) {
            //console.log('Read tiles.json result: ' + result);
            var tiles = JSON.parse(result);
            //console.log('tiles  : ', tiles, tilesNew);
            removeLayers(0, tilesNew, tiles, aantalLayers);
          },
            function (err) {
              //console.error('ReadAsText tiles.json ERROR: ', err);
              $cordovaFile.copyFile(trinlFileDir, 'tiles/tilesNew.json', trinlFileDir, 'tiles/tiles.json').then(function () {
                //console.log('telesNew.json copied to tiles.json SUCCESS');
              }, function (err) {
                //console.error('tilesNew.json copied to tiles.json ERROR: ', err);

              });
              //removeLayers(0, tilesNew, tiles, aantalLayers);
            });
        }, function (err) {
          //console.error('ReadAsText tilesNew.json ERROR: ', err);
          //removeLayers(0, tilesNew, tiles, aantalLayers);
        });
      },
        function (err) {
          //console.error('Download tilesNew.json ERROR: ', err);
          //removeLayers(0, tilesNew, tiles, aantalLayers);
        });
    }

  });
  */
  return dataFactoryMap;
}]);
