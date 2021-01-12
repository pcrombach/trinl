/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.controller('KaartCtrl', ['loDash',
  'BASE',
  '$q',
  '$window',
  '$scope',
  '$cordovaFile',
  '$cordovaFileTransfer',
  '$cordovaNetwork',
  '$cordovaSplashscreen',
  '$state',
  '$rootScope',
  '$ionicModal',
  '$ionicPopover',
  'dataFactorySync',
  '$location',
  '$interval',
  '$timeout',
  '$ionicPlatform',
  '$ionicLoading',
  '$ionicPopup',
  '$ionicSideMenuDelegate',
  '$ionicScrollDelegate',
  '$ionicNavBarDelegate',
  'dataFactoryInstellingen',
  'dataFactoryCeo',
  'dataFactoryGeo',
  'dataFactoryConfig',
  'dataFactoryConfigX',
  'dataFactorySyncFS',
  'dataFactoryPoi',
  'dataFactoryPoiSup',
  'dataFactoryPoiTag',
  'dataFactoryTrack',
  'dataFactoryTrackSup',
  'dataFactoryTrackTag',
  'dataFactoryTracks',
  'dataFactoryFoto',
  'dataFactoryFotoSup',
  'dataFactoryFotoTag',
  'dataFactoryFotos',
  'dataFactoryTag',
  'dataFactoryMap',
  'dataFactoryOverlay',
  'dataFactoryAlive',
  'dataFactoryAnalytics',
  'dataFactoryCodePush',
  'dataFactoryDropbox',
  function (
    loDash,
    BASE,
    $q,
    $window,
    $scope,
    $cordovaFile,
    $cordovaFileTransfer,
    $cordovaNetwork,
    $cordovaSplashscreen,
    $state,
    $rootScope,
    $ionicModal,
    $ionicPopover,
    dataFactorySync,
    $location,
    $interval,
    $timeout,
    $ionicPlatform,
    $ionicLoading,
    $ionicPopup,
    $ionicSideMenuDelegate,
    $ionicScrollDelegate,
    $ionicNavBarDelegate,
    dataFactoryInstellingen,
    dataFactoryCeo,
    dataFactoryGeo,
    dataFactoryConfig,
    dataFactoryConfigX,
    dataFactorySyncFS,
    dataFactoryPoi,
    dataFactoryPoiSup,
    dataFactoryPoiTag,
    dataFactoryTrack,
    dataFactoryTrackSup,
    dataFactoryTrackTag,
    dataFactoryTracks,
    dataFactoryFoto,
    dataFactoryFotoSup,
    dataFactoryFotoTag,
    dataFactoryFotos,
    dataFactoryTag,
    dataFactoryMap,
    dataFactoryOverlay,
    dataFactoryAlive,
    dataFactoryAnalytics,
    dataFactoryCodePush,
    dataFactoryDropbox
  ) {
    //console.warn('KaartCtrl');

    //var flyingBool = false;
    var modalKaartOpties = false;
    var plaatsnamentabel = [4, 4, 4, 4, 4, 4, 4, 4, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12];
    var vorigNietHedenKaartIndex = -1;
    var oldInputNaam;
    var oldInputTekst;
    var markersCentrum;
    var latlng = L.latLng(51.1955847, 5.9926069);
    var pad = 0.3;
    var flying = false;

    var vorigCentrum = latlng;

    //$scope.gotoHelp = function () {
      //console.log('KaartCtrl gotoHelp');

      //$state.go('handleiding.handleiding_ss');
    //};

    $scope.snelMenuPos = dataFactoryConfig.currentModel.get('snelMenuPos');

    //console.log('KaartCtrl snelMenuPos: ', $scope.snelMenuPos);

    $rootScope.$on('snelMenuPos', function (event, args) {
      //console.log('snelMenuPos: ', args.pos);

      $scope.snelMenuPos = args.pos;
    });

    splashScreen();

    if (dataFactoryInstellingen.updating) {
      var intervalUpdating = $interval(function () {
        if (!dataFactoryInstellingen.updating) {
          $interval.cancel(intervalUpdating);
          $ionicLoading.hide();
        }
      }, 100, 100);
    }

    var naam = '';
    var naamInterval = $interval(function () {

      if (localStorage.getItem('ceo')) {
        $interval.cancel(naamInterval);
        naam = JSON.parse(localStorage.getItem('ceo')).gebruikerNaam;
        if (naam === '') {
          var emailadres = JSON.parse(localStorage.getItem('ceo')).emailadres;
          if (emailadres !== '') {
            var emails = emailadres.split('@');
            naam = emails[0];
          }
        }
        if (naam === null) {
          naam = '';
        }
        //console.log('dataFactoryFotos LS naam: ', naam);
      }
    }, 10, 100);



    var configInterval = $interval(function () {

      if (localStorage.getItem('config')) {

        $interval.cancel(configInterval);
        //console.count('snelMenu');
        var statusSnelmenu = false;
        if (JSON.parse(localStorage.getItem('config')).snelMenuPos === 'l') {
          //console.error('dataFactoryFotos snelMenu links');
          //if (dataFactoryConfig.currentModel.get('snelMenuPos') === 'l') {
          if ($scope.modalKaartOptiesSmL.isShown()) {
            statusSnelmenu = true;
            //console.warn('KaartCtrl timer toggleSnelMenu links was OPEN');
          }
        } else {
          //console.error('dataFactoryFotos snelMenu rechts');
          if ($scope.modalKaartOptiesSmR.isShown()) {
            statusSnelmenu = true;
            //console.warn('KaartCtrl timer toggleSnelMenu rechts was OPEN');
          }
        }
        if (!statusSnelmenu) {

          if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
            $timeout(function () {

              var welkomPopup = $ionicPopup.show({
                noBackdrop: true,
                title: 'Welkom ' + naam,
                scope: $scope,
                content:
                  'Veel plezier met de <span class="trinl-rood"><b>nieuwe</b></span> TRINL<br>Tijdreizen in limburg<br><br>Deel nu ook jouw Locaties met andere gebruikers.<br><br><span class="trinl-rood">Ook nieuw zijn sporen (wandelingen).</span>',
                buttons: [{
                  text: 'Doorgaan',
                  type: 'button-positive',
                  onTap: function (e) {
                    welkomPopup.close();
                    $timeout(function () {
                      $scope.snelMenuOpen();
                    }, 200);

                  }
                }]
              });
            }, 500);
          }
        }
      }
    }, 100, 100);

    $scope.footerOpacity = false;

    $scope.toggleStatus = function () {
      $scope.footerOpacity = !$scope.footerOpacity;
    };

    var isUpdated = false;
    syncConfig();
    /**
     * We gaan een nieuw foto maken. Open het Formulier
     */
    $scope.maakFoto = function () {
      //console.warn('KaartCtrl maakFoto');
      dataFactoryCodePush.getPendingPackage();
      //
      if (dataFactoryCodePush.pendingPackage) {
        $ionicPopup.confirm({
          title: 'TRINL update staat klaar',
          content: '<span class="trinl-rood">Om een foto te maken moet eerst deze update geactiveerd worden.<br><br>Update versienr: ' + dataFactoryCodePush.appVersion + '</span><br><br>Toelichting: <br><span class="trinl-blauw">' + dataFactoryCodePush.description + '</span>',
          buttons: [{
            text: 'Later'
          }, {
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              codePush.restartApplication();
            }
          }]
        });

      } else {
        dataFactoryFotos.addPicture().then(function () {
          refresh();
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //dataFactorySync.enableSyncOnResume = true;
          //console.error('FotosCtrl maakFoto ERROR: ', err);
        });
      }
    };

    var initZoomendByZoomLevel = true;
    var initMoveendByLatLng = true;
    var automaticDraggingEnabled = true;
    var trackPopup = false;

    var titleHedenNaam;
    var titleHedenNaamKort;
    var titleNietHedenNaam;
    var titleNietHedenNaamKort;

    var poiPopupEdit;
    var fotoPopupEdit;
    var trackPopupEdit;
    var fotoSrc;
    var durationSpoor = 2.5;
    var durationItems = 1.5;
    var durationItem = 1.5;

    $scope.kaartTitle = 'TRINL';
    $scope.spinner = false;

    $scope.crossHair = false;
    $scope.gpsWatch = false;

    $scope.$on('$ionicView.enter', function () {
      //console.log('$ionicView.enter');
      if (map) {
        //console.log('map.invalidateSize: ', map);
        map.invalidateSize();
      } else {
        if (map) {
          $timeout(function () {
            //console.log('map.invalidateSize');
            map.invalidateSize();
          }, 500);
        }
      }
    });

    $scope.dataFactoryAliveStatus = dataFactoryAlive.status;

    $scope.allowPreCache = false;

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $scope.allowPreCache = true;
      }
    });

    prepareModals1();
    prepareModals2();

    var stayOpenTime = 1000;
    var stayTimer;

    function cancelStayTimer() {
      if (stayTimer) {
        $timeout.cancel(stayTimer);

        //console.warn('KaartCtrl cancelStayTimer');
      }
    }

    /**
     * ALs deze timer afloopt wordt het snelmenu gesloten (indien geopend)
     * @return {[type]} [description]
     */
    function startStayTimer() {
      cancelStayTimer();

      stayTimer = $timeout(function () {
        //			if ($scope.popoverLegenda.isShown()) {
        //				$scope.closePopoverLegenda();
        //			}

        //			if ($scope.modalLegenda.isShown()) {
        //				$scope.closeModalLegenda();
        //			}

        if (dataFactoryConfig.currentModel.get('snelMenuPos') === 'l') {
          if ($scope.modalKaartOptiesSmL.isShown()) {
            //console.warn('KaartCtrl timer toggleSnelMenu links was OPEN => GESLOTEN');
            $scope.closeModalKaartOptiesSmL();
          }
        } else {
          if ($scope.modalKaartOptiesSmR.isShown()) {
            //console.warn('KaartCtrl timer toggleSnelMenu rechts was OPEN => GESLOTEN');
            $scope.closeModalKaartOptiesSmR();
          }
        }
      }, +stayOpenTime);

      //console.warn('KaartCtrl startStayTimer: ', +stayOpenTime);
    }
    /**
     * lopende stayTimer annuleren en opnieuw starten
     * Moet aangeropen worden bij iedere keuze uit het snelmenu
     * Indien de gebruiker stayTime mseconden niets iets doet met het snelmenu
     * wordt het snelmenu gesloten
     *
     * @return {[type]} [description]
     */
    function restartStayTimer() {
      //console.log('KaartCtrl restartStayTimer');
      cancelStayTimer();
      $timeout(function () {
        startStayTimer();
      }, 500);
    }

    function setStayTime(val) {
      //console.warn('KaartCtrl setStayTime: ', val);

      stayOpenTime = +val;
    }

    var from = '';
    //console.log('KaartCtrl set from: ', from);

    $rootScope.$on('navigatie', function (event, args) {
      //console.log('KaartCtrl event navigatie from: ', args.from);

      from = args.from;
      if (from === 'kaart') {
        $scope.snelMenuOpen();
      } else {
        $timeout(function () {
          $scope.snelMenuSluit();
          $ionicSideMenuDelegate.toggleLeft();
        }, 200);
      }
      from = '';
      //console.error('KaartCtrl set from door event navigatie: ', from);
    });

    //    var MapsReady = false;
    var OverlaysReady = false;

    var configKaartenReady = false;
    var configLagenReady = false;

    var overlay1600On = false;

    var popupZoomMaxHedenActive = false;
    var hedenMax = false;
    //    var nietHedenMax = false;
    /**
     * hidescreen run 1 time is enough
     * @type {Boolean}
     */
    var isHidescreen = false;
    /**
     * na config synchroniseerd geeft configSource aan waar config vandaankomt 'local' => er is niets gewijzigd, backend => config is gewijzigd
     * @type {String}
     */
    //    var configSource = 'local';
    /**
     * Wacht totdat de app tot rust gekomen is met het bijwerken van de config
     * @type {Boolean}
     */
    var configUpdateAllowed = false;
    //console.log('KaartCtrl init configUpdateAllowed FALSE');
    /**
     * Tijdens verplaatsen van de kaart naar nieuwe position geen updates in statusbar
     */
    var updateLatLngEnable = true;
    /**
     * [currentTrackId description]
     * @type {String}
     */
    var currentTrackId = '';
    /**
     * [currentTrackModel description]
     * @type {Object}
     */
    var currentTrackModel;
    /**
     * [geosearcher description]
     * @type {Object}
     */
    var geosearcher;
    /**
     * [geolocationMarker description]
     * @type {Object}
     */
    var geolocationMarker;
    /**
     * ZIjn de configParameters geset
     * @type {Boolean}
     */
    var configParameterInit = false;
    /**
     * De kaart
     * @type {Object}
     */
    var map = null;
    /**
     * Hulp voor delayed opacity
     */
    var lockTimeout;
    /**
     * huidige level voor plaatsnamen
     */
    var currentPlaatsnaamLevel;
    /**
     * Grens zuidwest waarmee de kaart wordt afgebakend
     * @type {[float}
     */
    var southWest = L.latLng(48.9, 0.7);
    /**
     * Grens noordoost waarmee de kaart wordt afgebakend
     * @type {[float}
     */
    var northEast = L.latLng(53.5, 11.1);
    /**
     * Leaflet kaart grens
     * @type {Object}
     */
    var bounds = L.latLngBounds(southWest, northEast);
    //
    // Track object
    //
    var trackingDataIndex = 0;
    var centerMarker;
    var Geoposition = {};
    var Geometry = {};

    var isStarted = false;
    //    var isLocationEnabled = false;

    var backgroundGeolocation =
      $window.backgroundGeolocation ||
      $window.backgroundGeoLocation ||
      $window.universalGeolocation;
    /**
     * Tabel met pois
     * @type {Array}
     */
    var tracks = dataFactoryTrack.store;

    //    var storesInitReady = false;
    /**
     * Bewegen van de kaart is gestopt omdat getrackd wordt
     * @type {Boolean}
     */
    var isOnMoveTracking = false;
    /**
     * Zoom van de kaart is gestopt
     * @type {Boolean}
     */
    var isOnZoomEnd = false;

    //console.log('KaartCtrl isOnZoomEnd FALSE');

    //    var onMap = false;
    /**
     * True indien GPS locaties worden geregistreerd in een track
     * @type {Boolean}
     */
    var geoRecording = false;
    /**
     * Style van de lijn die getrokken wordt door georecording
     * @type {Object}
     */
    var trackStyle = {
      color: '#aa2017',
      weight: 5,
      opacity: 0.9
    };
    /**
     * Huidige Id voor watching GPS
     * @type {Number}
     */
    var watchGeoId = null;
    /**
     * Vorige GPS positie
     * @type {Object} LatLng
     */
    var vorigeCenterLatLng = null;
    /**
     * Actule GPS positie
     * @type {Object} LatLng
     */
    var centerLatLng = null;

    var preCacheRunning = false;

    var fileTransferOptions = {};
    var trinlFileDir;
    /**
     * Padnamen
     * @type {Array}
     */
    var urls = [];
    /**
     *
     */
    //	var currentConfigHash = localStorage.getItem('trinlMachineId');
    /**
     * Te laden padnamen
     * @type {Array}
     */
    var loadUrls = [];
    var clientPath;
    var hostPath;
    /**
     * Container voor plaatsNaam markers
     * @type {Object} L.markerClusterGroup
     */
    var plaatsNaamMarkers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false
    });
    plaatsNaamMarkers.on('clusterclick', function (a) {
      a.layer.zoomToBounds();
    });
    /**
     * Container voor achterban markers
     * @type {Object} L.markerClusterGroup
     */
    var achterBanMarkers = L.markerClusterGroup({
      animate: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });
    achterBanMarkers.on('clusterclick', function (a) {
      a.layer.zoomToBounds();
    });
    /**
     * Container voor track markers
     * @type {Object} L.markerClusterGroup
     */
    var trackClusterLayer = L.markerClusterGroup({
      animate: true,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    var fotoClusterLayer = L.markerClusterGroup({
      animate: true,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    var poiClusterLayer = L.markerClusterGroup({
      animate: true,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    var trackFotosClusterLayer = L.markerClusterGroup({
      animate: true,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    var trackPoisClusterLayer = L.markerClusterGroup({
      animate: true,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });
    /**
     * Laag voor poiCluster
     * @type {Object} L.markerClusterGroup
     */
    //	var trackClusterLayer = L.markerClusterGroup();
    //	var fotoClusterLayer = L.markerClusterGroup();

    var trackSoloLayer;
    /**
     * Icon voor poi marker
     * @type {Object}
     */
    var poiIcon = L.icon({
      iconUrl: 'images/poi2-marker.png',
      iconSize: [42, 42],
      iconAnchor: [20, 42],
      popupAnchor: [0, -42]
    });
    /**
     * Icon voor track marker
     * @type {Object} trackIcon
     */
    var trackIcon = L.icon({
      iconUrl: 'images/track-marker.png',
      iconSize: [42, 42],
      iconAnchor: [20, 42],
      popupAnchor: [0, -42]
    });
    /**
     * Icon voor foto marker
     * @type {Object}
     */
    var fotoIcon = L.icon({
      iconUrl: 'images/camera-marker.png',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });
    /**
     * Icon voor windmolen marker
     * @type {Object}
     */
    var windmolenIcon = L.icon({
      iconUrl: 'images/windmolenx.png',
      iconSize: [52, 52],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });
    /**
     * Options for precaching
     * @type {Object}
     */
    var progressPreCache = null;
    /*
     * @class RotatedMarker
     * @extends L
     * Marker voor GPS locatie
     */
    L.RotatedMarker = L.Marker.extend({
      options: {
        angle: 0
      },
      _setPos: function (pos) {
        L.Marker.prototype._setPos.call(this, pos);
        if (L.DomUtil.TRANSFORM) {
          // use the CSS transform rule if available
          this._icon.style[L.DomUtil.TRANSFORM] +=
            ' rotate(' + this.options.angle + 'deg)';
        } else if (L.Browser.ie) {
          // fallback for IE6, IE7, IE8
          var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
            costheta = Math.cos(rad),
            sintheta = Math.sin(rad);
          this._icon.style.filter +=
            ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
            costheta +
            ', M12=' +
            -sintheta +
            ', M21=' +
            sintheta +
            ', M22=' +
            costheta +
            ')';
        }
      }
    });

    L.rotatedMarker = function (pos, options) {
      return new L.RotatedMarker(pos, options);
    };
    //
    // We are open
    //
    /**
     * =========================================================================================================================
     *
     * Functies die de app  gereed maken voor gebruik
     *
     * =========================================================================================================================
     *
     * Eerst wordt de actuele config opgezocht in de configStore
     * Dit is de meest actuele config bepaald in EntryCtrl
     * De Objecten met de kaartconfuguratie worden geinitialiseerd
     * De map wordt geinitialiseerd met initMap().
     * De app moet nu in feite gereed zijn en de kaart moet tezien zijn als we de splashscreen nu weghalen.
     */
    /**
     * Initialiseer de kaart
     *
     * Kaart object instantieren
     * Installeren van event handlers
     * Deze kunnen zeer waarschijnlijk hier weggehaald worden en toegevoegd bij de andere Event handlers
     */
    function initMap() {
      //console.warn('Kaart initMap');

      if (!map) {
        window.L._DISABLE_3D = true;
        /*
        if (ionic.Platform.isIOS()) {
          L.Browser.webkit3d = true;
        }
        if (ionic.Platform.isAndroid()) {
          L.Browser.webkit3d = true;
        }
        */
        map = L.map('lfmap', {
          center: centerLatLng,
          //attributionControl: false,
          //transform3DLimit: 2 ^ 50,
          zoomControl: false,
          inertia: true
        });

        L.control.attribution({
          prefix: '',
          position: 'topright'
        });

        $timeout(function () {
          map.addLayer(dataFactoryMap.map[0]);
        }, 3);

        map.fitBounds(bounds);

        L.control
          .graphicScale({
            fill: 'fill',
            showSubunits: true
          })
          .addTo(map);

        var interval2 = $interval(
          function () {
            if (+dataFactoryInstellingen.stayOpenTimeGeoSearch) {
              $interval.cancel(interval2);

              geosearcher = new L.Control.GeoSearch({
                provider: new L.GeoSearch.Provider.OpenStreetMap(),
                limit: 20,
                position: 'topright',
                searchLabel: '  Zoek adres',
                notFoundMessage: 'TRINL kan het opgegeven adres niet vinden',
                messageHideDelay:
                  +dataFactoryInstellingen.stayOpenTimeGeoSearch *
                  1000,
                retainZoomLevel: true,
                showMarker: false
              }).addTo(map);
            }
          },
          100,
          30
        );

        //$timeout(function () {
        //$scope.snelMenuOpen();
        //}, 500);

        //$ionicPlatform.ready(function () {
        //if ((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOffline()) {
        //$timeout(function () {
        //console.log('Geen Internet');

        //$ionicPopup.alert({
        //title: 'Geen Internetverbinding',
        //content:
        //'TRINL heeft Internet nodig om optimaal te kunnen functioneren. Schakel Internet in. Stop en start desnoods daarna TRINL opnieuw. Kies OK om verder te gaan.'
        //});
        //}, 8000);
        //}
        //});
        //
        // Installeer listeners op map
        //
        map.on('geosearch_showlocation', function (location) {
          //console.log('Event geosearch_showlocation: ', location);
          //				var zoom = +map.getZoom();

          var latlng = L.latLng(
            location.Location.Y,
            location.Location.X
          );
          var lat = parseFloat(location.Location.Y);
          var lng = parseFloat(location.Location.X);
          if (lat >= 49.1 && lat <= 54 && lng >= 1 && lng <= 9) {
            //console.log('adres is in Limburg dus OK');

            if ($scope.crossHair === false) {
              $scope.toggleCrosshair();
            }

            geolocationMarker = L.marker(latlng, {
              bounceOnAdd: true,
              bounceOnAddCallback: popupMarker(location),
              icon: poiIcon
            });
            /*
             * Tijdens het verwerken van een geplaatste marker tijdelijk geolocationMarker plaatsen
             * omdat de marker nog niet geplaatst wordt door een poi
             * Pas als de poi is toegevoegd aan pois kan de geolocationMarker weer verwijderd worden
             */
            map.addLayer(geolocationMarker);
            map.invalidateSize(true);

            if (configUpdateAllowed && !isOnMoveTracking) {
              dataFactoryAnalytics.createEvent(
                'kaarten',
                'geosearch',
                '',
                '',
                '1'
              );
            }
          } else {
            var alertPopup = $ionicPopup.alert({
              title: 'Zoek adres',
              template: 'Het adres: <br><br>' +
                location.Location.Label +
                '</b><br> ligt niet in het bereik van de kaart.'
            });
            alertPopup.then(
              function () {
                return false;
              },
              function (err) {
                //console.error(err);
              }
            );
          }
        });

        map.on('move', function () {

          //console.log('KaartCtrl on.move');

          //console.log('KaartCtrl on.move automaticDraggingEnabled: ', automaticDraggingEnabled);
          //if (automaticDraggingEnabled) {
          //console.log('KaartCtrl automaticDraggingEnabled');
          //map.dragging.enable();
          //map.doubleClickZoom.enable();
          //map.scrollWheelZoom.enable();
          //}

          if (updateLatLngEnable) {
            //            //console.log('Event map move');
            var lat = map.getCenter().lat;
            var lng = map.getCenter().lng;

            //            //console.log('Event move: ', lat, lng);
            $scope.LatLngCrossHair =
              parseFloat(
                Math.round(parseFloat(lat) * Math.pow(10, 4)) /
                Math.pow(10, 4)
              ) +
              ' - ' +
              parseFloat(
                Math.round(parseFloat(lng) * Math.pow(10, 4)) /
                Math.pow(10, 4)
              );
            $scope.LatLngCrossHairLong =
              parseFloat(
                Math.round(parseFloat(lat) * Math.pow(10, 8)) /
                Math.pow(10, 8)
              ) +
              ' - ' +
              parseFloat(
                Math.round(parseFloat(lng) * Math.pow(10, 8)) /
                Math.pow(10, 8)
              );
            $scope.LatLngCrossHairX = long2tile(lng, map.getZoom());
            $scope.LatLngCrossHairY = lat2tile(lat, map.getZoom());
            $timeout(function () { }, 0);
          }
        });

        map.on('moveend', function () {

          //console.log('KaartCtrl on.moveend');

          //console.log('KaartCtrl stop flying');
          map.dragging.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();

          if (configUpdateAllowed && !isOnMoveTracking) {
            //dataFactoryAnalytics.createEvent('kaarten', 'movemap', '', '', '1');
          }

          var lat = map.getCenter().lat;
          var lng = map.getCenter().lng;
          //console.log('Event moveend: ', lat, lng);
          $scope.LatLngCrossHair =
            parseFloat(
              Math.round(parseFloat(lat) * Math.pow(10, 4)) /
              Math.pow(10, 4)
            ) +
            ' - ' +
            parseFloat(
              Math.round(parseFloat(lng) * Math.pow(10, 4)) /
              Math.pow(10, 4)
            );
          $scope.LatLngCrossHairLong =
            parseFloat(
              Math.round(parseFloat(lat) * Math.pow(10, 8)) /
              Math.pow(10, 8)
            ) +
            ' - ' +
            parseFloat(
              Math.round(parseFloat(lng) * Math.pow(10, 8)) /
              Math.pow(10, 8)
            );
          $scope.LatLngCrossHairX = long2tile(
            lng,
            +map.getZoom()
          );
          $scope.LatLngCrossHairY = lat2tile(
            lat,
            +map.getZoom()
          );

          if (!isOnMoveTracking) {
            if (configUpdateAllowed) {
              //console.log('Event map moveend configUpdateAllowed: ', map.getCenter().lat, map.getCenter().lng, configUpdateAllowed);
              centerLatLng = {
                lat: map.getCenter().lat,
                lng: map.getCenter().lng
              };
              //console.log('Event map moveend centerLatLng: ', centerLatLng);
              $scope.defaultLatLng = centerLatLng;
              updateConfig('defaultLatLng', centerLatLng);
            }
          }
          //          initMoveendByZoomLevel = true;
          initMoveendByLatLng = true;
          $timeout(function () { }, 0);
        });

        map.on('zoom', function () {
          //console.log('KaartCtrl on.zoom');
          //          //console.log('Event map onzoom: ', +map.getZoom());
          //          vorigeZoomLevel = +map.getZoom();
        });

        map.on('zoomend', function () {
          //console.log('KaartCtrl on.zoomend');

          if (configUpdateAllowed && !isOnMoveTracking) {
            //dataFactoryAnalytics.createEvent('kaarten', 'zoommap', '', '', '1');
          }

          isOnZoomEnd = true;
          //console.log('Event map zooomend');
          //console.log('Event map zoomLevel: ', $scope.zoomLevel.value);
          //console.log('Event map getZoom: ', +map.getZoom());
          //console.log('Event map onzoom popupZoomMaxHedenActive: ', popupZoomMaxHedenActive);

          var kaartItemHeden = loDash.find(
            $scope.configKaartItems,
            function (configKaartItem) {
              return (
                configKaartItem.index ===
                $scope.currentHedenKaartIndex
              );
            }
          );

          var kaartItemNietHeden = loDash.find(
            $scope.configKaartItems,
            function (configKaartItem) {
              return (
                configKaartItem.index ===
                $scope.currentNietHedenKaartIndex
              );
            }
          );

          if (kaartItemNietHeden) {
            checkKaartHedenNietHeden();
          }

          if (kaartItemHeden) {
            if (
              +map.getZoom() > kaartItemHeden.maxZoom
            ) {
              hedenMax = true;
            } else {
              hedenMax = false;
            }
          }
          //console.log('KaartCtrl zoomend hedenMax: ', hedenMax);

          //				if (hedenMax || (!hedenMax && vorigeZoomLevel >= 19)) {
          if (hedenMax) {
            //console.error('zoomend alert maxHeden');

            $ionicPopup.alert({
              title: 'ZoomLevel',
              template: 'ZoomLevel groter dan ' +
                kaartItemHeden.maxZoom +
                ' voor<br>kaart-' +
                kaartItemHeden.naam +
                '<br>is niet beschikbaar.'
            });
            updateConfig('zoomLevel', kaartItemHeden.maxZoom);
          }

          if (kaartItemNietHeden) {
            //console.log('KaartCtrl zoom.on 1600 kaders zoom: ', +map.getZoom());
            if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() <= 11) {
              if (!overlay1600On) {
                //console.log('KaartCtrl zoom,on 1600 kaders SHOW');
                dataFactoryOverlay.overlay1600.addTo(map);
                overlay1600On = true;
              }
            }
            if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() >= 12) {
              if (overlay1600On) {
                //console.log('KaartCtrl zoom,on 1600 kaders HIDE');
                map.removeLayer(dataFactoryOverlay.overlay1600);
                overlay1600On = false;
              }
            }
          }

          if (isOnZoomEnd) {
            //console.log('Event map zoomend isOnZoomEnd, configParameterInit: ', isOnZoomEnd, configParameterInit);
            var tmp = +map.getZoom();
            if (tmp) {
              $scope.zoomLevel.value = parseInt(tmp, 10);
            }
            //console.log('KaartCtrl zoomLevel: ', $scope.zoomLevel.value, tmp);

            if (configParameterInit) {
              updatePlaatsnamenOverlay();
            }
            $timeout(function () {
              updateConfig('zoomLevel', $scope.zoomLevel.value);
            });
          }

          initZoomendByZoomLevel = true;
          //          initZoomendByLatLng = true;

          //console.log('Event map zoomend reset initiator');
        });
      }
    }

    function checkKaartHedenNietHeden() {
      //		var retourZoomLevel = vorigeZoomLevel;

      var kaartItemHeden = loDash.find($scope.configKaartItems, function (
        configKaartItem
      ) {
        return configKaartItem.index === $scope.currentHedenKaartIndex;
      });

      var kaartItemNietHeden = loDash.find(
        $scope.configKaartItems,
        function (configKaartItem) {
          return (
            configKaartItem.index ===
            $scope.currentNietHedenKaartIndex
          );
        }
      );

      //console.log('Event map zoomend maxZoomNietHeden: ', kaartItemNietHeden.maxZoom);

      //
      // Corrigeer titel indien niethedenKaart dan nietHeden title.. NietHedenKaart niet zichtbaar dan hedenKaart titel.
      //
      if (+map.getZoom() > kaartItemNietHeden.maxZoom) {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $scope.setNavTitle(titleHedenNaamKort);
        } else {
          $scope.setNavTitle(titleHedenNaam);
        }
      } else {
        dataFactoryMap.map[$scope.currentNietHedenKaartIndex].addTo(
          map
        );
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $scope.setNavTitle(titleNietHedenNaamKort);
        } else {
          $scope.setNavTitle(titleNietHedenNaam);
        }
      }
      //
      // Deze zijn nodig voor $scope.ZoomLevelelPlus
      //
      if (+map.getZoom() >= kaartItemNietHeden.maxZoom) {
        //        nietHedenMax = true;
      } else {
        //        nietHedenMax = false;
      }
      //
      // Reset popupZoomMaxHedenActive in nieuwe zoomLevel < dan de max van kaartItemNietHeden
      //
      if (+map.getZoom() < kaartItemNietHeden.maxZoom + 1) {
        popupZoomMaxHedenActive = false;
      }
      //
      // Popup indien popupZoomMaxHedenActive = false
      //
      if (popupZoomMaxHedenActive === false) {
        //
        // Popup indien de nieuwe zoomLevel groter of gelijk dan max kaartItemNietHeden
        //
        if (+map.getZoom() >= kaartItemNietHeden.maxZoom + 1) {
          var nieuwZoomLevel = kaartItemNietHeden.maxZoom;
          //if (kaartItemNietHeden.naam === '1600') {
          //nieuwZoomLevel = 11;
          //}
          $ionicPopup.confirm({
            title: 'ZoomLevel',
            //content: 'ZoomLevel groter dan ' + kaartItemNietHeden.maxZoom + ' voor<br>kaart-' + kaartItemNietHeden.naam + '<br>is niet beschikbaar.<br><br>De Heden/Thema-kaart blijft wel beschikbaar.',
            content: 'ZoomLevel groter dan ' + kaartItemNietHeden.maxZoom + ' voor<br>kaart-' + kaartItemNietHeden.naam + ' is niet beschikbaar.<br><br>Selecteer een heden-kaart voor hogere zoomLevels',
            buttons: [{
              text: 'Terug naar <br>zoomLevel ' + nieuwZoomLevel,
              onTap: function () {
                //
                // We gaan niet verder dus we draaien zoomLevel terug naar waar we vandaan komen
                //
                map.setZoom(nieuwZoomLevel, {
                  animate: true
                });
                updateConfig('zoomLevel', nieuwZoomLevel);
              }
              /*
              }, {
                text: '<b>Doorgaan met Heden/Thema</b>',
                type: 'button-positive',
                onTap: function () {
                  //
                  // 	Set popupZoomMaxHedenActive als we verder gaan
                  //
                  popupZoomMaxHedenActive = true;
    
                  if (dataFactoryMap.map[$scope.currentNietHedenKaartIndex]) {
                    dataFactoryMap.map[$scope.currentNietHedenKaartIndex].removeFrom(map);
                  }
    
                  map.setZoom(kaart.maxZoom + 1, { animate: true });
                  updateConfig('zoomLevel', kaart.maxZoom + 1);
                }
              */
            }]
          });
          /*
          $ionicPopup.confirm({
            title: 'ZoomLevel',
            content: 'ZoomLevel groter dan ' + kaartItemNietHeden.maxZoom + ' voor<br>kaart-' + kaartItemNietHeden.naam + '<br>is niet beschikbaar.<br><br>De Heden/Thema-kaart blijft wel beschikbaar.',
            buttons: [
              {
                text: 'Annuleer',
                onTap: function () {
                  //
                  // We gaan niet verder dus we draaien zoomLevel terug naar waar we vandaan komen
                  //
                  map.setZoom(kaartItemNietHeden.maxZoom, {
                    animate: true
                  });
                  updateConfig('zoomLevel', kaartItemNietHeden.maxZoom);
                }
              }, {
                text: '<b>Doorgaan met Heden/Thema</b>',
                type: 'button-positive',
                onTap: function () {
                  //
                  // 	Set popupZoomMaxHedenActive als we verder gaan
                  //
                  popupZoomMaxHedenActive = true;
    
                  if (dataFactoryMap.map[$scope.currentNietHedenKaartIndex]) {
                    dataFactoryMap.map[$scope.currentNietHedenKaartIndex].removeFrom(map);
                  }
    
                  map.setZoom(kaartItemNietHeden.maxZoom + 1, {animate: true});
                  updateConfig('zoomLevel', kaartItemNietHeden.maxZoom + 1);
                }
              }
            ]
          });
          */
        }
      }

      if (kaartItemNietHeden) {
        if (map.getZoom() >= kaartItemNietHeden.maxZoom) {
          //          nietHedenMax = true;
        } else {
          //          nietHedenMax = false;
        }

        //console.log('Event map zoomend maxZoomNietHeden: ', kaartItemNietHeden.maxZoom);

        if (map.getZoom() <= kaartItemNietHeden.maxZoom) {
          popupZoomMaxHedenActive = false;
        }

        if (map.getZoom() > kaartItemNietHeden.maxZoom) {
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            $scope.setNavTitle(titleHedenNaamKort);
          } else {
            $scope.setNavTitle(titleHedenNaam);
          }
        }
      }
      //console.log('Event map zoomend getZoom, zoomLevel, popupZoomMaxHedenActive: ', +map.getZoom(), $scope.zoomLevel.value, popupZoomMaxHedenActive);

      if (+map.getZoom() >= kaartItemHeden.maxZoom) {
        hedenMax = true;
      } else {
        hedenMax = false;
      }

      if (isOnZoomEnd) {
        //console.log('Event map zoomend isOnZoomEnd, configParameterInit: ', isOnZoomEnd, configParameterInit);
        var tmp = +map.getZoom();
        if (tmp) {
          $scope.zoomLevel.value = parseInt(tmp, 10);
        }
        //console.log('KaartCtrl zoomLevel: ', $scope.zoomLevel.value, tmp);

        if (configParameterInit) {
          updatePlaatsnamenOverlay();
        }

        updateConfig('zoomLevel', $scope.zoomLevel.value);
      }
    }

    var hideSplash = $timeout(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $ionicPlatform.ready(function () {
          //console.warn('+++++++++++++++++++++++++++++++++++');
          //console.warn('HIDE SPLASHSCREEN FORCE');
          //console.warn('+++++++++++++++++++++++++++++++++++');
          splashScreen();
        });
      }
    }, 5000);

    function splashScreen() {
      //console.warn('KaartCtrl splashscreen onMap, isHideScreen: ', isHidescreen);

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent('trinl', 'app', 'splashscreen', '', '1');
        dataFactoryAnalytics.createEvent('kaarten', 'sessie', 'kaarten', 'start', '1');
      }
      if (!isHidescreen) {
        //console.warn('+++++++++++++++++++++++++++++++');
        //console.warn('HIDE splashscreen (standaard)');
        //console.warn('+++++++++++++++++++++++++++++++');
        $timeout.cancel(hideSplash);
        isHidescreen = true;
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $ionicPlatform.ready(function () {
            $cordovaSplashscreen.hide();
          });
        }
      }
    }
    /**
     * =========================================================================================================================
     *
     * Functies die gebruikt worden om te reageren op gebruikerhandelingen
     *
     * =========================================================================================================================
     */
    /**
     * Reageer als transparantie wordt gewijzigd
     */
    function watchOpacityValue() {
      //console.warn('watchOpacityValue');
      $scope.$watch('opacity.value', function (val, old) {
        if (+val !== +old) {
          //console.log('watchOpacityValue opacity.value change: ', val, old);
          $scope.oLevel = parseInt(val, 10);
          $scope.opacity = {
            value: +val
          };
          setOpacity(parseInt($scope.oLevel, 10));
        }
      });
    }
    /**
     * =========================================================================================================================================
     *
     * Functions met betrekking tot config
     *
     * =========================================================================================================================================
     */
    /**
     * [setConfigMap description]
     */
    function setConfigMap() {
      var q = $q.defer();
      //console.warn('KaartCtrl setConfigMap');

      //console.log('KaartCtrl setConfigMap Instellingen kaartHeden: ', dataFactoryInstellingen.kaartHeden);
      //console.log('KaartCtrl setConfigMap Instellingen kaartNietHeden: ', dataFactoryInstellingen.kaartNietHeden);
      if (!dataFactoryInstellingen.kaartHeden) {
        dataFactoryInstellingen.kaartHeden = 0;
      }
      if (!dataFactoryInstellingen.kaartNietHeden) {
        dataFactoryInstellingen.kaartNietHeden = -1;
      }
      //
      // Heden
      //
      $scope.currentHedenKaartIndex = dataFactoryInstellingen.kaartHeden;
      if ($scope.currentHedenKaartIndex === -1) {
        $scope.currentHedenKaartIndex = 0;
      }

      var kaartHeden = loDash.find($scope.configKaartItems, function (kaart) {
        return kaart.index === +$scope.currentHedenKaartIndex && kaart.menuNaam.substr(0, 4) !== '*** ';
      });
      //
      // Force naar hedenKaart van Instellingen
      //
      $scope.currentHedenKaartIndex = -1;

      $scope.changeKaart(kaartHeden);
      dataFactoryAnalytics.createEvent('kaarten', 'kaart', kaartHeden.naam, kaartHeden.index, '1');
      //
      // Niet Heden
      //
      if (dataFactoryInstellingen.kaartNietHeden !== -1) {
        $scope.currentNietHedenKaartIndex = -1;
        //console.log('KaartCtrl setConfigMap: currentNietHedenKaartIndex: ', $scope.currentNietHedenKaartIndex);

        var kaartNietHeden = loDash.find(
          $scope.configKaartItems,
          function (kaart) {
            return (kaart.index === dataFactoryInstellingen.kaartNietHeden && kaart.menuNaam.substr(0, 4) !== '*** ');
          }
        );
        if (kaartNietHeden) {
          //console.log('KaartCtrl setConfigMap index, naam: ', kaartNietHeden.index, kaartNietHeden.naam);

          titleNietHedenNaam = kaartNietHeden.naam;
          titleNietHedenNaamKort = kaartNietHeden.naamKort;

          //console.log('KaartCtrl setConfigMap titleNietHedenNaam: ', titleNietHedenNaam);
          //console.log('KaartCtrl setConfigMap NEW add currentNiethedenKaart type: ', kaartNietHeden.index, kaartNietHeden.type);

          $timeout(function () {
            dataFactoryMap.map[kaartNietHeden.index].addTo(map);
            dataFactoryAnalytics.createEvent('kaarten', 'kaart', kaartNietHeden.naam, kaartNietHeden.index, '1');
            //console.error('KaartCtrl setConfigMap kaart: ', kaartNietHeden.naam, kaartHeden.index);
            //console.log('KaartCtrl setConfigMap NEW added map: ', dataFactoryMap.map[kaartNietHeden.index]);
            $scope.currentNietHedenKaartIndex =
              kaartNietHeden.index;
            vorigNietHedenKaartIndex = kaartNietHeden.index;
            //console.log('KaartCtrl setConfigMap currentNietHedenKaartIndex: ', $scope.currentNietHedenKaartIndex);
            //console.warn('KaartCtrl setConfigMap currentHedenKaartIndex: ', $scope.currentHedenKaartIndex);

            updateConfig('kaartNietHeden', $scope.currentNietHedenKaartIndex);
            if (+map.getZoom() < kaartNietHeden.maxZoom) {
              popupZoomMaxHedenActive = false;
              //console.log('KaartCtrl toKaart reset popupZoomMaxHedenActive: ', popupZoomMaxHedenActive);
            } else {
              popupZoomMaxHedenActive = true;
              //console.log('KaartCtrl toKaart set popupZoomMaxHedenActive: ', popupZoomMaxHedenActive);
            }
            checkKaartHedenNietHeden();

            if (kaartNietHeden) {
              if (kaartNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() <= 11) {
                //console.log('KaartCtrl zoom,on 1600 kaders SHOW');
                dataFactoryOverlay.overlay1600.addTo(map);
                overlay1600On = true;
              }
            }

            q.resolve();
          }, 100);
        } else {
          //console.error('KaartCtrl setConfigMap NietHedenKaart NOT found');
          q.resolve();
        }
      } else {
        q.resolve();
      }

      return q.promise;
    }
    /**
     * @method setConfigParameters
     * Set config parameter
     */
    function setConfigParameters() {
      var q = $q.defer();

      //console.warn('setConfigParameters');

      //console.log('Instellingen defaultLatLng: ', dataFactoryInstellingen.defaultLatLng);
      //console.log('Instellingen minOpacity: ', dataFactoryInstellingen.minOpacity);
      //console.log('Instellingen zoomLevel: ', dataFactoryInstellingen.zoomLevel);
      //console.log('Instellingen electriciteitsnetwerk: ', dataFactoryInstellingen.electriciteitsnetwerk);
      //console.log('Instellingen plaatsnamen: ', dataFactoryInstellingen.plaatsnamen);
      //console.log('Instellingen orientatieroosDefault: ', dataFactoryInstellingen.orientatieroosDefault);
      //console.log('Instellingen crossHair: ', dataFactoryInstellingen.crossHair);
      //console.log('Instellingen provinciegrensDefault: ', dataFactoryInstellingen.provinciegrensDefault);
      //console.log('Instellingen provinciegrens: ', dataFactoryInstellingen.provinciegrens);

      $scope.opacity = {
        value: +dataFactoryInstellingen.opacity
      };

      setOpacity(+$scope.opacity.value);

      setStayTime(
        +dataFactoryInstellingen.stayOpenTime * 1000
      );

      //console.log('KaartCtrl setConfigParameters styOpenTime: ', stayOpenTime);

      //console.log('KaartCtrl initConfig set volume: ', dataFactoryInstellingen.notifyVolume / 100);

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

      configParameterInit = true;

      //console.log('KaartCtrl setConfigParameters setLagen');

      setLagen('snelMenu');
      setLagen('crossHair');
      setLagen('gpswatch');
      setLagen('gpsrecord');
      setLagen('provinciegrens');
      setLagen('gemeentegrenzen');
      setLagen('oppervlaktewater');
      setLagen('water');
      setLagen('tbo');
      setLagen('electriciteitsnetwerk');
      setLagen('plaatsnamen');
      setLagen('achterban');
      setLagen('hoogtelijnen');

      isOnZoomEnd = true;

      q.resolve();

      //console.log('KaartCtrl setConfigParameters READY isOnZoomEnd TRUE');

      return q.promise;
    }

    function setLagen(type) {
      //console.warn('KaartCtrl setLagen');
      //console.log('KaartCtrl setLagen: ', type, $scope.configOverlays);

      if (configParameterInit) {
        if (type === 'plaatsnamen') {
          type = 'plaatsnamen8';
        }
        var overlay = loDash.find($scope.configOverlays, function (overlay) {
          return overlay.naam === type && overlay.menuNaam.substr(0, 4) !== '*** ';
        });
        if (type === 'plaatsnamen8') {
          type = 'plaatsnamen';
        }
        if (overlay) {
          if ($scope.overlay[overlay.index] === undefined) {
            $scope.overlay[overlay.index] = false;
          }
        }

        switch (type) {
          case 'snelMenu':
            //console.log('snelMenuPos: ', dataFactoryInstellingen.snelMenuPos, $scope.snelMenuPos);

            if (overlay) {
              if (dataFactoryInstellingen.snelMenuPos) {
                $scope.snelMenuPos =
                  dataFactoryInstellingen.snelMenuPos;
              } else {
                $scope.snelMenuPos = 'r';
              }
            }
            break;

          case 'crossHair':
            //console.log('crossHair, orientatieroosDefault: ', dataFactoryInstellingen.crossHair, dataFactoryInstellingen.orientatieroosDefault, $scope.crossHair);

            if (overlay) {
              if (dataFactoryInstellingen.crossHair && !dataFactoryInstellingen.orientatieroosDefault) {

                if (!$scope.crossHair) {
                  $scope.toggleCrosshair();
                }
              } else {
                //console.log('crossHair, orientatieroosDefault: ', dataFactoryInstellingen.crossHair, dataFactoryInstellingen.orientatieroosDefault, $scope.crossHair);

                if ($scope.crossHair) {
                  $scope.toggleCrosshair();
                }
              }
            }
            break;

          case 'gpswatch':
            //console.log('gpswatch, gpsDefault : ', dataFactoryInstellingen.gpswatch, dataFactoryInstellingen.gpsDefault, $scope.gpsWatch);

            if (overlay) {
              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                if (
                  dataFactoryInstellingen.gps ||
                  dataFactoryInstellingen.gpsDefault
                ) {
                  if (!$scope.gpsWatch) {
                    $scope.gpsWatchChange();
                  }
                } else {
                  if ($scope.gpsWatch) {
                    $scope.gpsWatchChange();
                  }
                }
              } else {
                if ($scope.gpsWatch) {
                  $scope.gpsWatchChange();
                }
              }
            }
            break;

          case 'gpsrecord':
            //console.log('gpsrecord, gpsRecordDefault : ', dataFactoryInstellingen.gpsrecordwatch, dataFactoryInstellingen.gpsRecordDefault);

            if (overlay) {
              if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

                if ($scope.gpsRecordWatch) {
                  $scope.gpsRecordWatchChange();
                }
              } else {
                if ($scope.gpsRecordWatch) {
                  $scope.gpsRecordWatchChange();
                }
              }
            }
            break;

          case 'provinciegrens':
            //console.log('provinciegrens, provinciegrensDefault: ', dataFactoryInstellingen.provinciegrens, dataFactoryInstellingen.provinciegrensDefault);

            if (overlay) {
              if (dataFactoryInstellingen.provinciegrens || dataFactoryInstellingen.provinciegrensDefault) {
                //console.log('setLagen Provinciegrens $scope.overlay: ', $scope.overlay[overlay.index]);

                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'provinciegrens', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'gemeentegrenzen':
            //console.log('gemeentegrenzen: ', dataFactoryInstellingen.gemeentegrenzen);

            if (overlay) {
              if (dataFactoryInstellingen.gemeentegrenzen) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'gemeentegrenzen', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'oppervlaktewater':
            //console.log('oppervlaktewater: ', dataFactoryInstellingen.oppervlaktewater);

            if (overlay) {
              if (dataFactoryInstellingen.oppervlaktewater) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'oppervlaktewater', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'water':
            //console.log('water: ', dataFactoryInstellingen.water);

            if (overlay) {
              if (dataFactoryInstellingen.water) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'water', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'tbo':
            //console.log('tbo: ', dataFactoryInstellingen.tbo);

            if (overlay) {
              if (dataFactoryInstellingen.tbo) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'tbo', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'electriciteitsnetwerk':
            //console.log('electriciteitsnetwerk: ', dataFactoryInstellingen.electriciteitsnetwerk);

            if (overlay) {
              if (dataFactoryInstellingen.electriciteitsnetwerk) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'electriciteitsnetwerk', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'plaatsnamen':
            //console.log('plaatsnamen instellingen: ', dataFactoryInstellingen.plaatsnamen);
            //console.log('plaatsnamen switch: ', $scope.plaatsnamen);

            if (overlay) {
              if (dataFactoryInstellingen.plaatsnamen) {
                if (!$scope.plaatsnamen) {
                  $scope.plaatsnamenChange();
                }
              } else {
                if ($scope.plaatsnamen) {
                  $scope.plaatsnamenChange();
                }
              }
            }
            break;

          case 'achterban':
            //console.log('achterban: ', dataFactoryInstellingen.achterban);

            if (overlay) {
              if (dataFactoryInstellingen.achterban) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'achterban', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;

          case 'hoogtelijnen':
            //console.log('hoogtelijnen: ', dataFactoryInstellingen.hoogtelijnen);
            if (overlay) {
              if (dataFactoryInstellingen.hoogtelijnen) {
                if (!$scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'hoogtelijnen', overlay.index, '1');
                }
              } else {
                if ($scope.overlay[overlay.index]) {
                  $scope.overlayChange(overlay);
                }
              }
            }
            break;
          default:
        }
      } else {
        //console.warn('SetLagen blocked door configParameterInit: ', configParameterInit, type);
      }
    }

    function configZoom() {
      //console.warn('KaartCtrl configZoom');

      var q = $q.defer();

      initZoomendByZoomLevel = false;

      if (
        +dataFactoryInstellingen.zoomLevel !==
        +map.getZoom()
      ) {
        //console.log('START configZoomLevel: ', dataFactoryInstellingen.zoomLevel, +map.getZoom());

        if (dataFactoryInstellingen.zoomLevel) {
          $scope.setZoomLevel(dataFactoryInstellingen.zoomLevel);

          if ($scope.zoomLevel.value <= 7) {
            $scope.zoomLevel.value = 8;
          }

          $scope.zoomLevel.value = parseInt(dataFactoryInstellingen.zoomLevel, 10);
          //console.log('KaartCtrl setConfigParameters zoomLevel: ', $scope.zoomLevel.value);

          //console.log('KaartCtrl setConfigParameters zoomLevel: ', $scope.zoomLevel.value);
          map.setZoom($scope.zoomLevel.value, {
            animate: true
          });
        }
        //
        // Watch zoomLevel
        //
        var zoomendLevelWatch = $interval(
          function () {
            //console.log('zoomLevelWatch..........');
            if (initZoomendByZoomLevel) {
              $interval.cancel(zoomendLevelWatch);
              //console.log('END configZoomLevel=============================================================');
              $timeout(function () {
                initZoomendByZoomLevel = true;
                q.resolve();
              }, 300);
            }
          },
          100,
          20
        );
      } else {
        //console.log('GEEN nieuwe configZoomLevel');

        $timeout(function () {
          initZoomendByZoomLevel = true;
          q.resolve();
        }, 300);
      }

      return q.promise;
    }
    /**
     * De functie sync gebruikt deze functie om de kaart te positioneren op
     * dataFactoryInstellingen.defaultLatLng
     */
    function configLatLng() {
      //console.warn('KaartCtrl centerLatLng');

      var q = $q.defer();

      updateLatLngEnable = false;

      if (centerLatLng === null) {
        centerLatLng = dataFactoryInstellingen.defaultLatLng;
        if (centerLatLng === '') {
          centerLatLng = JSON.parse(
            '{"lat":51.1955847,"lng":5.9926069}'
          );
          updateConfig('defaultLatLng', centerLatLng);
        }
        vorigeCenterLatLng = centerLatLng;
        $scope.defaultLatLng = centerLatLng;
      }
      //console.log('KaartCtrl centerLatLng: ', centerLatLng);

      if (centerLatLng !== null && centerLatLng !== map.getCenter()) {
        //console.log('KaartCtrl centerLatLng START configLatLng: ', dataFactoryInstellingen.defaultLatLng);

        initMoveendByLatLng = false;

        updateConfig('defaultLatLng', centerLatLng);

        //console.log('KaartCtrl configLatLng setView START: ', centerLatLng);
        //var flying = {};
        //if (flyingBool) {
        //flying = {
        //animate: true,
        //duration: 2.5,
        //easeLinearity: 0.25,
        //noMovestart: true
        //};
        //}

        map.setView(L.latLng(centerLatLng));

        var moveendLatLngWatch = $interval(
          function () {
            //console.log('KaartCtrl centerLatLng zoomendLatLngWatch..........');
            if (initMoveendByLatLng) {
              $interval.cancel(moveendLatLngWatch);
              $timeout(function () {
                //console.log('KaartCtrl centerLatLng END========================================================');
                updateLatLngEnable = true;
                q.resolve();
              }, 10);
            }
          },
          100,
          50
        );
      } else {
        //console.error('KaartCtrl centerLatLng GEEN configLatLng');
        //console.log('setConfigParameters en setConfigMap..........');
        q.resolve();
      }

      $timeout(function () {
        updateLatLngEnable = true;
      }, 1);

      return q.promise;
    }

    /**
     * Sync met nieuwe config
     */
    function sync(update) {
      if (update) {
        dataFactoryAnalytics.createEvent('trinl', 'app', 'sync', '', '1');
        dataFactoryAnalytics.createEvent('kaarten', 'sessie', 'kaarten', 'start', '1');

        //console.warn('KaartCtrl sync configKaartenReady, configLagenReady, inSync: ', configKaartenReady && configLagenReady);
        //console.warn('.... EFFE wachten!!!!!!!!!');
        //console.log('KaartCtrl sync configModel: ', dataFactoryConfig.currentModel);
        //console.log('KaartCtrl sync ceoModel: ', dataFactoryCeo.currentModel);
        //console.log('=========================================================================================');
        //console.log(' ');
        //console.log(' Kaarten en Lagen beschikbaar: sync sync sync sync sync sync sync sync sync sync sync sync ');
        //console.log(' ');
        //console.log('=========================================================================================');
        //console.log('KaartCtrl sync configModel: ', dataFactoryConfig.currentModel.get('Id'));
        //console.log('KaartCtrl sync ceoModel: ', dataFactoryCeo.currentModel.get('Id'));
        //console.log('KaartCtrl gebruikerId in configModel: ', dataFactoryConfig.currentModel.get('gebruikerId'));
        //console.log('KaartCtrl provinciegrens in configModel: ', dataFactoryConfig.currentModel.get('provinciegrens'));
        //console.log('KaartCtrl crossHair in configModel: ', dataFactoryConfig.currentModel.get('crossHair'));
        //console.log('KaartCtrl electriciteitsnetwerk in configModel: ', dataFactoryConfig.currentModel.get('electriciteitsnetwerk'));
        //console.log('KaartCtrl plaatsnamen in configModel: ', dataFactoryConfig.currentModel.get('plaatsnamen'));
        //console.log('KaartCtrl defaultLatLng in configModel: ', JSON.stringify(dataFactoryConfig.currentModel.get('defaultLatLng')));
        //console.log('KaartCtrl zoomLevel in configModel: ', JSON.stringify(dataFactoryConfig.currentModel.get('zoomLevel')));
        //console.log('=========================================================================================');
        //console.log('KaartCtrl kaartHeden in configModel: ', dataFactoryConfig.currentModel.get('kaartHeden'));
        //console.log('KaartCtrl kaartNietheden in configModel: ', dataFactoryConfig.currentModel.get('kaartNietHeden'));
        //console.log('=========================================================================================');

        // Wachten op map
        // dan config
        //
        configUpdateAllowed = true;

        dataFactoryInstellingen.init().then(
          function () {
            //
            // Wachten op map beschikbaar ( wordt aangemaakt in KaartCtrl)
            //
            var mapWatch = $interval(
              function () {
                if (map) {
                  $interval.cancel(mapWatch);
                  setConfigMap().then(
                    function () {
                      $timeout(function () {
                        if (!dataFactoryDropbox.updating) {
                          $ionicLoading.hide();
                        }
                      }, 500);

                      $timeout(function () {
                        //flyingBool = true;
                        configLatLng().then(
                          function () {
                            //flyingBool = false;
                            //console.log('KaartCtrl configLatLng READY');

                            setConfigParameters().then(
                              function () {
                                //console.log('KaartCtrl confifUpdateAllowed: ', configUpdateAllowed);
                                configZoom().then(
                                  function () {
                                    $timeout(
                                      function () {
                                        //console.log('KaartCtrl configZoom READY');
                                        configUpdateAllowed = true;
                                      },
                                      300
                                    );
                                  },
                                  function (
                                    err
                                  ) {
                                    //console.error('KaartCtrl sync configZoom ERROR: ', err);
                                  }
                                );
                              },
                              function (err) {
                                //console.error('KaartCtrl sync setConfigParameters ERROR: ', err);
                              }
                            );
                          },
                          function (err) {
                            //console.error('KaartCtrl sync configLatLng ERROR: ', err);
                          }
                        );
                      }, 1);
                    },
                    function (err) {
                      //console.error('KaartCtrl sync ERROR: ', err);
                    }
                  );
                  //console.timeEnd('InitialLoad');
                }
              },
              10,
              200
            );
          },
          function (err) {
            //console.error('KaartCtrl syncdataFactory.Instellingen.init ERROR: ', err);
          }
        );
      }
    }

    function syncConfig() {
      var update = true;

      if (configKaartenReady && configLagenReady) {
        //console.warn('KaartCtrl syncConfig');

        dataFactoryConfigX.getConfig().then(
          function () {
            //console.log('KaartCtrl syncConfig getConfig changedOn, Id, gebruikerId SUCCESS: ', dataFactoryConfig.currentModel.get('changedOn'), dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));

            //console.warn('KaartCtrl syncConfig getConfig changedOn, gebruikerId: ', dataFactoryConfig.currentModel.get('changedOn'), dataFactoryConfig.currentModel.get('gebruikerId'));

            //console.log('KaartCtrl syncConfig loadMe');
            dataFactoryConfigX.loadMe().then(
              function (configModelBE) {
                //console.warn('KaartCtrl syncConfig BE changedOn, LS changedOn, gebruikerId: ', configModelBE.get('changedOn'), dataFactoryConfig.currentModel.get('changedOn'), configModelBE.get('gebruikerId'));
                if (
                  configModelBE.get('changedOn') >
                  dataFactoryConfig.currentModel.get(
                    'changedOn'
                  ) &&
                  configModelBE.get('hash') !==
                  localStorage.getItem('trinlMachineId')
                ) {
                  //console.error('KaartCtrl syncConfig configModelBE => currentConfig: ', configModelBE.get('Id'), configModelBE.get('gebruikerId'));
                  dataFactoryConfigX
                    .update(configModelBE)
                    .then(
                      function () {
                        //console.log('======================================');
                        //console.log('KaartCtrl syncConfig READY!!!! BE     ');
                        //console.log('======================================');
                        //                configSource = 'backend';
                        sync(true);
                        //							dataFactoryInstellingen.init();
                      },
                      function () {
                        //console.log('======================================');
                        //console.log('KaartCtrl syncConfig READY!!!! BE     ');
                        //console.log('======================================');
                        //                configSource = 'backend';
                        sync(true);
                      }
                    );
                } else {
                  //console.log('KaartCtrl syncConfig dataFactoryConfig.currentModel configModel: ', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));
                  dataFactoryConfigX
                    .update(dataFactoryConfig.currentModel)
                    .then(
                      function () {
                        //console.log('======================================');
                        //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                        //console.log('======================================');
                        sync(false);
                        if (!isUpdated) {
                          sync(update);
                          isUpdated = true;
                        }
                      },
                      function () {
                        //							dataFactoryInstellingen.init();
                        //console.log('======================================');
                        //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                        //console.log('======================================');
                        sync(false);
                        if (!isUpdated) {
                          sync(update);
                          isUpdated = true;
                        }
                      }
                    );
                }
              },
              function () {
                //console.log('KaartCtrl syncConfig config.loadMe ERROR configModel: ', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));
                dataFactoryConfigX
                  .update(dataFactoryConfig.currentModel)
                  .then(
                    function () {
                      //console.log('======================================');
                      //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                      //console.log('======================================');
                      sync(false);
                      if (!isUpdated) {
                        sync(update);
                        isUpdated = true;
                      }
                    },
                    function () {
                      //console.log('======================================');
                      //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                      //console.log('======================================');
                      sync(false);
                      if (!isUpdated) {
                        sync(update);
                        isUpdated = true;
                      }
                    }
                  );
              }
            );
          },
          function (err) {
            //console.error('KaartCtrl syncConfig getLocalStorage ERROR: ', err);
            //console.log('KaartCtrl syncConfig loadMe');
            dataFactoryConfigX.loadMe().then(
              function (configModelBE) {
                dataFactoryConfigX.update(configModelBE).then(
                  function () {
                    //						dataFactoryInstellingen.init();
                  },
                  function () {
                    //						dataFactoryInstellingen.init();
                  }
                );
                //console.log('======================================');
                //console.log('KaartCtrl syncConfig READY!!!! BE      ');
                //console.log('======================================');
                sync(true);
                //console.log('KaartCtrl syncConfig configModelBE => dataFactoryConfig.currentModel', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));
              },
              function () {
                //
                // Geen Config in LS en geen config in Backend
                // Moeten we hier niet een nieuwe config aanmaken!!!!!!!!
                //
                dataFactoryConfigX
                  .update(dataFactoryConfig.currentModel)
                  .then(
                    function () {
                      //console.log('======================================');
                      //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                      //console.log('======================================');
                      sync(false);
                      if (!isUpdated) {
                        sync(update);
                        isUpdated = true;
                      }
                    },
                    function () {
                      //console.log('======================================');
                      //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                      //console.log('======================================');
                      sync(false);
                      if (!isUpdated) {
                        sync(update);
                        isUpdated = true;
                      }
                    }
                  );
                //console.log('======================================');
                //console.log('KaartCtrl syncConfig READY!!!! LS     ');
                //console.log('======================================');
                sync(false);
                if (!isUpdated) {
                  sync(update);
                  isUpdated = true;
                }
              }
            );
          },
          function (err) {
            //console.error('syncConfig getLocalStorage ERROR: ', err);
          }
        );
      } else {
        //console.log('EFFE WACHTEN........');
      }
    }

    /*
    function nthIndex(str, pat, n) {
        var L= str.length, i= -1;
        while(n-- && i++ <L){
            i= str.indexOf(pat, i);
            if (i < 0) {
              break;
            }
        }
        return i;
    }
    */
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
    /**
     * Initialiseren config
     * Haal actueel configModel op in Store
     * In de configStore staat het laatst actuele configModel.
     * Dit model wordt na installatie default gegenereerd
     * Dit model is bij een warme start de laatste config die ook in LS en FS staat
     * Maak $scope.configOfflineBestanden objecten aan
     *
     * Daarna wordt de functie synchroniseer uitgevoerd.
     *
     */
    function initConfigLagen() {
      //console.warn('KaartCtrl initConfigLagen');

      $scope.mijnOverlays = dataFactoryOverlay.mijnOverlays;

      $scope.mijnOver = [];
      $scope.configOverlays = dataFactoryOverlay.configOverlays;

      $scope.configOverlays = loDash.filter($scope.configOverlays,
        function (overlay) {
          //console.warn('KaartCtrl initConfigLagen filter: ', overlay.menuNaam, overlay.menuNaam.substr(0, 4));
          return overlay.menuNaam !== '' && overlay.menuNaam.substr(0, 4) !== '*** ';
        }
      );
      $scope.configMijnOverlays = dataFactoryOverlay.configMijnOverlays;

      configLagenReady = true;

      //console.log('KaartCtrl ConfigLagen: ', $scope.configOverlays, $scope.configMijnOverlays);
      //console.log('======================================');
      //console.log('KaartCtrl initConfigLagen READY!!!!');
      //console.log('======================================');

      syncConfig();
    }

    function initConfigKaarten() {
      //console.warn('KaartCtrl initConfigKaarten');

      configParameterInit = false;

      $scope.configKaartHedenItems = [];
      $scope.configKaartToekomstItems = [];
      $scope.configKaartVerledenItems = [];
      $scope.configKaartNietHedenItems = [];
      $scope.configKaartThemaItems = [];

      $scope.configKaartItems = dataFactoryMap.configKaartItems;

      $scope.configKaartItems = loDash.sortBy(
        $scope.configKaartItems,
        'prev'
      );

      //console.log('KaartCtrl initConfigKaarten configOfflineBestanden', $scope.configKaartItems);

      $scope.configKaartHedenItems = loDash.filter(
        $scope.configKaartItems,
        function (kaart) {
          return kaart.type === 'heden';
        }
      );

      $scope.configKaartToekomstItems = loDash.filter(
        $scope.configKaartItems,
        function (kaart) {
          return kaart.type === 'toekomst';
        }
      );

      $scope.configKaartVerledenItems = loDash.filter(
        $scope.configKaartItems,
        function (kaart) {
          return kaart.type === 'verleden';
        }
      );
      $scope.configKaartNietHedenItems = $scope.configKaartVerledenItems.concat(
        $scope.configKaartToekomstItems
      );

      $scope.configKaartThemaItems = loDash.filter(
        $scope.configKaartItems,
        function (kaart) {
          return kaart.type === 'thema';
        }
      );

      $scope.aantalKaartItems = $scope.configKaartItems.length;
      $scope.aantalKaartHedenItems = $scope.configKaartHedenItems.length;
      $scope.aantalKaartVerledenItems =
        $scope.configKaartVerledenItems.length;
      $scope.aantalKaartNietHedenItems =
        $scope.configKaartNietHedenItems.length;
      $scope.aantalKaartThemaItems = $scope.configKaartThemaItems.length;

      configKaartenReady = true;

      $scope.precache_options = {
        maps: []
      };
      $scope.precache_options.maps = loDash.sortBy(
        $scope.configKaartItems,
        function (map) {
          return map.index;
        }
      );

      loDash.each($scope.precache_options, function (options) {
        options.enable = false;
      });

      //console.log('KaartCtrl ConfigKaarten: ', $scope.configKaartItems);
      //console.log('======================================');
      //console.log('KaartCtrl initConfigKaarten READY!!!!');
      //console.log('======================================');

      syncConfig();

      watchOpacityValue();
    }
    /**
     * @method updateConfig
     * Werk config model bij
     * @param  {String} status het gedeelte van config dat moet worden bijgewerkt
     * @param  {String} type   hetgeen bijgewerkt moet worden
     */
    function updateConfig(item, value) {
      //if ((configUpdateAllowed && !isOnMoveTracking) || item === 'zoomLevel') {
      if (configUpdateAllowed && !isOnMoveTracking) {
        //console.log('KaartCtrl updateConfig item, value: ', item, value);

        if (item !== undefined && value !== undefined) {
          //console.log('KaartCtrl updateConfig dataFactoryConfig.currentModel: ', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));

          //dataFactoryConfig.currentModel.unsetAll();
          dataFactoryConfig.currentModel.set(item, value);
          dataFactoryConfig.currentModel.set(
            'hash',
            localStorage.getItem('trinlMachineId')
          );
          dataFactoryConfig.currentModel.set(
            'appVersion',
            dataFactoryCeo.appVersion
          );

          dataFactoryConfigX.update(dataFactoryConfig.currentModel);

          //console.log('KaartCtrl updateConfig SUCCESSSUCCESSSUCCESS: ', dataFactoryConfig.currentModel.kaartNietHeden, item, value);
        } else {
          //console.error('KaartCtrl updateConfig ERROR geen item of value');
        }
      } else {
        //console.warn('KaartCtrl updateConfig BLOKBLOKBLOK: ', configUpdateAllowed);
      }
    }
    /**
     * ================================================================================================================================
     *
     * Diverse functies die door anderefuncties gebruikt worden
     *
     * ================================================================================================================================
     */
    /**
     * @method long2tile
     * Bepaal tile x op basis van lon en zoom
     * @param  {Number} lon  lon van actuele GPS locatie
     * @param  {Number} zoom actuele zoom level
     * @return {Number}      tile x waarde
     */
    function long2tile(lon, zoom) {
      return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    }
    /**
     * @method lat2tile
     * Bepaal tile y op nbasis van lat en zoom
     * @param  {Number} lat  lat van actuele GPS locatie
     * @param  {Number} zoom actule zoom level
     * @return {Number}      tile y waarde
     */
    function lat2tile(lat, zoom) {
      return Math.floor(
        ((1 -
          Math.log(
            Math.tan((lat * Math.PI) / 180) +
            1 / Math.cos((lat * Math.PI) / 180)
          ) /
          Math.PI) /
          2) *
        Math.pow(2, zoom)
      );
    }
    /**
     * ==============================================================================================================================
     *
     * Gegevens die aan de kaart toegevoegd worden beheren
     *
     * ==============================================================================================================================
     */
    /**
     * @method addPois
     * Loop door alle poi en haal de bijbehorende namen en teksten op.
     * Creeer een marker voor iedere poi en installer marker in poiClusterLayer
     */
    function addPois() {

      //console.log('addPois: pois', dataFactoryPoi.selected, dataFactoryPoi.selected.length);

      if (map) {
        var pois = dataFactoryPoi.selected;
        map.removeLayer(poiClusterLayer);

        poiClusterLayer = null;
        poiClusterLayer = L.markerClusterGroup({
          animate: true,
          disableClusteringAtZoom: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        var bounds;
        var coordinatesToCenter = [];

        loDash.each(pois, function (poiModel) {

          //console.log('KaartCtrl addPois via seleted naam: ', poiModel.get('naam'));

          var gebruikerId = poiModel.get('gebruikerId');
          var changedOn = poiModel.get('changedOn');
          var naam = poiModel.get('naam');
          var tekst = poiModel.get('tekst');

          var lat = poiModel.get('lat');
          var lng = poiModel.get('lng');
          var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

          coordinatesToCenter.push(latlng);

          var poiMarker = L.marker(latlng, {
            icon: poiIcon
          });

          if (poiModel.xData && poiModel.xData.tags.length > 0) {

            //console.log('KaartCtrl TEST poiModel.xData.tags: ', poiModel.xData.tags);
            if (
              poiModel.xData.tags[0].xData.tag.value.indexOf('windmolen') > -1 || poiModel.xData.tags[0].xData.tag.value.indexOf('Windmolen') > -1) {
              poiMarker = L.marker(latlng, {
                icon: windmolenIcon
              });
            }
          }

          var poiDivNode = L.DomUtil.create('div', 'poiDiv');
          poiDivNode.className = 'popup';

          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {

            var poiIconsNode = L.DomUtil.create('div', 'trinl-popup-iconsNode', poiDivNode);

            var poiIconDeleteNode = L.DomUtil.create('div', 'poiIconDelete', poiIconsNode);
            poiIconDeleteNode.innerHTML = '<div class="trinl-popup-verwijder my-icon"><i class="trinl-icon-popup ion-trash-a"></i><div class="trinl-text-popup-left">verwijder</div>';
            L.DomEvent.on(poiIconDeleteNode, 'click', function () {
              verwijderPoiModel(poiModel);
            });

            var poiIconWijzigNode = L.DomUtil.create('div', 'poiIconWijzig', poiIconsNode);
            poiIconWijzigNode.innerHTML = '<div class="trinl-popup-wijzig my-icon"><i class="trinl-icon-popup ion-compose"></i><div class="trinl-text-popup-left">wijzig</div>';
            L.DomEvent.on(poiIconWijzigNode, 'click', function () {
              poiPopupEdit = {
                poiModel: poiModel,
                poiDivNode: poiDivNode,
                poiMarker: poiMarker,
                naamNode: poiNaamNode,
                tekstNode: poiTekstNode,
                naam: naam,
                tekst: tekst
              };
              openPoiItemTekst(poiPopupEdit);
            });
          }

          var poiBodyNode = L.DomUtil.create('div', 'trinl-popup-bodyNode', poiDivNode);
          poiBodyNode.style = 'clear: left;';

          var poiNaamNode = L.DomUtil.create('div', 'trinl-popup-naamNode', poiBodyNode);
          poiNaamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood">' + naam + '</span></b>';

          var coord = lat + '-' + lng;
          var poiDatumCoordNode = L.DomUtil.create('div', 'trinl-popup-datumCoordNode', poiBodyNode);
          poiDatumCoordNode.style = 'margin-top: -14px;';
          poiDatumCoordNode.innerHTML = '<p><span class="trinl-popup-coord trinl-rood">GPS: ' + coord + '</span><br><span class="trinl-popup-datum trinl-blauw">Datum: ' + changedOn + '</span></p>';

          var poiTekstNode = L.DomUtil.create('div', 'trinl-popup-tekstNode', poiBodyNode);
          poiTekstNode.innerHTML = '<p>' + tekst + '</p>';

          poiMarker.bindPopup(poiDivNode);

          poiClusterLayer.addLayer(poiMarker);
        });

        //console.log('KaartCtrl coordinatesToCenter addPois: ', coordinatesToCenter, coordinatesToCenter.length);
        if (coordinatesToCenter.length > 0) {
          if (coordinatesToCenter.length === 1) {
            markersCentrum = coordinatesToCenter[0];
          } else {
            var markersCentrum = GetCenterFromDegrees(coordinatesToCenter);
            bounds = L.latLngBounds(coordinatesToCenter);
          }
          //
          //  Is er een nieuw centrum
          //
          if (markersCentrum.lat !== vorigCentrum.lat || markersCentrum.lng !== vorigCentrum.lng) {
            //console.log('KaartCtrl addPois afstand naar nieuwe Locatie meter: ', markersCentrum.distanceTo(vorigCentrum));
            //console.log('KaartCtrl addPois flyTo markersCentrum, vorigCentrum: ', markersCentrum, vorigCentrum);
            vorigCentrum = markersCentrum;
            map.setZoom(10, {
              animate: true
            });
            $timeout(function () {
              //
              //  Indien er een bounds is dan flyToBounds
              //
              if (coordinatesToCenter.length > 1 || bounds) {
                //console.log('KaartCtrl addPois flyToBounds: ', bounds);
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyToBounds(bounds.pad(pad), {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: true
                });
              } else {
                //
                //  Geen bounds dan flyTo markersCentrum
                //
                map.setZoom(15, {
                  animate: true
                });
                //console.log('KaartCtrl addPois flyto: ', markersCentrum);
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyTo(markersCentrum, 15, {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: true
                });
              }
            }, 800);
          }
        }

        if (map !== null) {
          map.addLayer(poiClusterLayer);
        }
      }
    }
    /**
     * @method addFotos
     * Loop door alle fotos en haal de bijbehorende namen en teksten op.
     * Creeer een marker voor iedere foto en installer marker in fotoClusterLayer
     */
    function addFotos() {
      //console.log('addFotos: fotos', dataFactoryFoto.selected, dataFactoryFoto.selected.length);

      if (map) {
        var fotos = dataFactoryFoto.selected;
        map.removeLayer(fotoClusterLayer);

        var bounds;
        var coordinatesToCenter = [];

        fotoClusterLayer = null;
        fotoClusterLayer = L.markerClusterGroup({
          animate: true,
          disableClusteringAtZoom: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        loDash.each(fotos, function (fotoModel) {

          //console.log('KaartCtrl addFotos naam via selected: ', fotoModel.get('naam'));

          var gebruikerId = fotoModel.get('gebruikerId');
          var changedOn = fotoModel.get('changedOn');
          var srcFotoId = fotoModel.get('fotoId');
          var extension = fotoModel.get('extension');
          var naam = fotoModel.get('naam');
          var tekst = fotoModel.get('tekst');

          var lat = fotoModel.get('lat');
          var lng = fotoModel.get('lng');
          var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

          coordinatesToCenter.push(latlng);

          var fotoMarker = L.marker(latlng, {
            icon: fotoIcon
          });

          var fotoDivNode = L.DomUtil.create('div', 'fotoDiv');
          fotoDivNode.className = 'popup';

          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {
            var fotoIconsNode = L.DomUtil.create('div', 'trinl-popup-iconsNode', fotoDivNode);

            var fotoIconDeleteNode = L.DomUtil.create('div', 'fotoIconDelete', fotoIconsNode);
            fotoIconDeleteNode.innerHTML = '<div class="trinl-popup-verwijder my-icon"><i class="trinl-icon-popup ion-trash-a"></i><div class="trinl-text-popup-left">verwijder</div>';
            L.DomEvent.on(fotoIconDeleteNode, 'click', function () {
              verwijderFotoModel(fotoModel);
            });

            var fotoIconWijzigNode = L.DomUtil.create('div', 'fotoIconWijzig', fotoIconsNode);
            fotoIconWijzigNode.innerHTML = '<div class="trinl-popup-wijzig my-icon"><i class="trinl-icon-popup ion-compose"></i><div class="trinl-text-popup-left">wijzig</div>';
            L.DomEvent.on(fotoIconWijzigNode, 'click', function () {
              fotoPopupEdit = {
                fotoModel: fotoModel,
                fotoDivNode: fotoDivNode,
                fotoMarker: fotoMarker,
                naamNode: fotoNaamNode,
                tekstNode: fotoTekstNode,
                naam: naam,
                tekst: tekst
              };
              openFotoItemTekst(fotoPopupEdit);
            });
          }

          var fotoBodyNode = L.DomUtil.create('div', 'trinl-popup-bodyNode', fotoDivNode);
          fotoBodyNode.style = 'clear: left;';

          var fotoNaamNode = L.DomUtil.create('div', 'trinl-popup-naamNode', fotoBodyNode);
          fotoNaamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood">' + naam + '</span></b>';

          var coord = lat + '-' + lng;
          var fotoDatumCoordNode = L.DomUtil.create('div', 'trinl-popup-datumCoordNode', fotoBodyNode);
          fotoDatumCoordNode.innerHTML = '<p><span class="trinl-popup-coord trinl-rood">GPS: ' + coord + '</span><br><span class="trinl-popup-datum trinl-blauw">Datum: ' + changedOn + '</span></p>';

          var fotoImg = L.DomUtil.create('div', 'fotoImg', fotoBodyNode);

          var fotoTekstNode = L.DomUtil.create('div', 'trinl-popup-tekstNode', fotoBodyNode);
          fotoTekstNode.innerHTML = '<p>' + tekst + '</p>';

          //console.log('KaartCtrl addFotos getFotoSrc gebruikerId, srcFotoId, extension: ', gebruikerId, srcFotoId, extension);
          dataFactoryFotos.getFotoSrc(gebruikerId, srcFotoId, extension).then(function (result) {
            //console.log('KaartCtrl addFotos getFotoSrc result: ', result);
            var fotoSrc = result.kaartPath;
            if (fotoSrc !== '' && fotoSrc !== undefined) {
              fotoImg.innerHTML = '<img id="kaartfotoimage" src="' + fotoSrc + '" /> <div>';
            }
          });

          fotoMarker.bindPopup(fotoDivNode);
          /*
          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {
            L.DomEvent.on(fotoIconWijzigNode, 'click', function () {
              fotoPopupEdit = {
                fotoModel: fotoModel,
                fotoDivNode: fotoDivNode,
                fotoMarker: fotoMarker,
                naamNode: fotoNaamNode,
                tekstNode: fotoTekstNode,
                naam: naam,
                tekst: tekst
              };
              openFotoItemTekst(fotoPopupEdit);
            });
            L.DomEvent.on(fotoIconDeleteNode, 'click', function () {
              verwijderFotoModel(fotoModel);
            });
          }
          */
          fotoClusterLayer.addLayer(fotoMarker);
        });

        //console.log('KaartCtrl coordinatesToCenter addFotos: ', coordinatesToCenter, coordinatesToCenter.length);
        if (coordinatesToCenter.length > 0) {
          if (coordinatesToCenter.length === 1) {
            markersCentrum = coordinatesToCenter[0];
          } else {
            var markersCentrum = GetCenterFromDegrees(coordinatesToCenter);
            //if (coordinatesToCenter.length > 2) {
            bounds = L.latLngBounds(coordinatesToCenter);
            var fitBounds = map.fitBounds(L.latLngBounds(coordinatesToCenter));
            //}
          }
          //
          //  Is er een nieuw centrum
          //
          if (markersCentrum.lat !== vorigCentrum.lat || markersCentrum.lng !== vorigCentrum.lng) {
            //console.log('KaartCtrl addFotos flyTo afstand naar nieuwe Locatie meter: ', markersCentrum.distanceTo(vorigCentrum));
            //console.log('KaartCtrl addFotos flyTo markersCentrum, vorigCentrum: ', markersCentrum, vorigCentrum);
            //console.log('KaartCtrl addFotos flyTo bounds: ', bounds);
            vorigCentrum = markersCentrum;
            map.setZoom(10, {
              animate: true
            });
            $timeout(function () {
              //
              //  Indien er een bounds is dan flyToBounds
              //
              if (coordinatesToCenter.length > 1 || bounds) {
                //console.log('KaartCtrl addFotos flyToBounds coordinatesToCenter, bounds : ', coordinatesToCenter, coordinatesToCenter.length, bounds);
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyToBounds(bounds.pad(pad), {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: false
                });
              } else {
                //console.log('KaartCtrl addFotos flyTo coordinatesToCenter, bounds : ', coordinatesToCenter, coordinatesToCenter.length, bounds);
                //
                //  Geen bounds dan flyTo markersCentrum
                //
                //console.log('KaartCtrl addFotos flyTo: ', markersCentrum);
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyTo(markersCentrum, 15, {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: true
                });
              }
            }, 800);
          }
        }

        if (map !== null) {
          map.addLayer(fotoClusterLayer);
        }
      }
    }

    function addTracks() {

      //console.log('addTrackFotos: fotos', dataFactoryTrack.selected, dataFactoryTrack.selected.length);


      if (map) {
        var tracks = loDash.uniq(dataFactoryTrack.selected, 'Id');
        map.removeLayer(trackClusterLayer);
        var len = tracks.length;

        trackClusterLayer = null;
        trackClusterLayer = L.markerClusterGroup({
          animate: true,
          disableClusteringAtZoom: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        var bounds;
        var justClicked = '';
        var coordinatesToCenter = [];

        //if (len !== 0) {
        loDash.each(tracks, function (trackModel) {
          //console.log('KaartCtrl addTracks via selected naam: ', trackModel.get('naam'));
          //(function (trackModel) {
          var trackId = trackModel.get('Id');
          var gebruikerId = trackModel.get('gebruikerId');
          var createdOn = trackModel.get('changedOn');
          var naam = trackModel.get('naam');
          var tekst = trackModel.get('tekst');

          var lat = trackModel.get('lat');
          var lng = trackModel.get('lng');
          var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

          //console.log('KaartCtrl addTracks TrackSup.store: ', dataFactoryTrackSup.store);
          var trackSupModel = loDash.find(dataFactoryTrackSup.store, function (supModel) {
            return supModel.get('trackId') === trackId;
          });
          //console.log('KaartCtrl addTracks trackSupModel: ', trackSupModel);

          coordinatesToCenter.push(latlng);

          var trackMarkerPopup;

          var spoorCentrum;

          var trackMarker = L.marker(latlng, {
            rotationAngle: 180,
            icon: trackIcon
          });

          var trackDivNode = L.DomUtil.create('div', 'trackDiv');
          trackDivNode.className = 'popup';
          //
          //  Indien de gebruiker = eigenaar of poi of fotos dan ruimte voor de iconen ceeren
          //
          if (!trackModel.xData) {
            trackModel.xData = {};
          }
          if (!trackModel.xData.sup) {
            trackModel.xData.sup = {};
          }
          if (!trackModel.xData.pois) {
            trackModel.xData.pois = [];
          }
          if (!trackModel.xData.fotos) {
            trackModel.xData.fotos = [];
          }
          if (!trackModel.xData.tags) {
            trackModel.xData.tags = [];
          }

          if (gebruikerId === dataFactoryCeo.currentModel.get('Id') || trackModel.xData.pois.length > 0 || trackModel.xData.fotos.length > 0) {
            var trackIconsNode = L.DomUtil.create('div', 'trinl-popup-iconsNode', trackDivNode);
            //console.log('KaartCtrl addTracks trackIconsNode toegevoegd gebruikerId, ceo.Id, trackModel.xData.pois, trackModel.xData.fotos: ', gebruikerId, dataFactoryCeo.currentModel.get('Id'), trackModel.xData.pois.length, trackModel.xData.fotos.length);
          }
          //
          // Indien gebruiker = eigenaar dan iconen voor verwijderen en wijzigen toevoegen in iconenlijst
          //
          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {

            var trackIconWijzigNode = L.DomUtil.create('div', 'trackIconWijzig', trackIconsNode);
            //
            //  Indien wijzigen getikt wordt dan starten wijzigen naam en/of tekst
            //
            L.DomEvent.on(trackIconWijzigNode, 'click', function () {
              trackPopupEdit = {
                trackModel: trackModel,
                trackDivNode: trackDivNode,
                trackMarker: trackMarker,
                naamNode: trackNaamNode,
                tekstNode: trackTekstNode,
                naam: naam,
                tekst: tekst
              };
              openTrackItemTekst(trackPopupEdit);
            });
            //
            //  Indien verwijderen getikt wordt dan starten met jet verijderen van het Spoor
            //
            var trackIconDeleteNode = L.DomUtil.create('div', 'trackIconDelete', trackIconsNode);
            L.DomEvent.on(trackIconDeleteNode, 'click', function () {
              //console.error('KaartCtrl click verwijder');
              verwijderTrackModel(trackModel);
            });

            trackIconWijzigNode.innerHTML = '<div class="trinl-popup-wijzig my-icon"><i class="trinl-icon-popup ion-compose"></i><div class="trinl-text-popup-left">wijzig</div>';
            trackIconDeleteNode.innerHTML = '<div class="trinl-popup-verwijder my-icon"><i class="trinl-icon-popup ion-trash-a"></i><div class="trinl-text-popup-left">verwijder</div>';
          }
          //
          //  Indien pois dan icon in/uitschakelen toevoegen op basis van poisVolgen in trackModel
          //
          if (trackModel.xData.pois.length > 0) {
            //console.log('KaartCtrl addTracks init naam, xData.pois:', trackModel.get('naam'), trackModel.xData.pois);
            var trackIconPoisNode = L.DomUtil.create('div', 'trackIconPois', trackIconsNode);
            //
            //  Flip Locaties
            //
            L.DomEvent.on(trackIconPoisNode, 'click', function () {
              //console.warn('**********************************************************************************************************************************');
              //console.warn('*');
              //console.warn('*  Poimarker click');
              //console.warn('*  trackIconPoisNode: ', trackIconPoisNode);
              //console.warn('*');
              //console.warn('**********************************************************************************************************************************');

              var poisVolgen = trackSupModel.get('poisVolgen');
              if (poisVolgen) {
                //console.log('KaartCtrl addTracks pois click naam, xData.pois:', trackModel.get('naam'), trackModel.xData.pois);
                trackSupModel.set('Id', trackSupModel.get('Id'));
                trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
                trackSupModel.set('poisVolgen', false);
                trackSupModel.save();
                //console.log('KaartCtrl popup trackPoisVolgen saved in trackSupModel: ', false);
                dataFactoryTrack.tmpArray = [];
                trackIconPoisNode.innerHTML = '<div class="trinl-popup-icon-left socio-grey my-icon"><i class="trinl-icon-popup ion-location"></i>';
                addTrackPois();

              } else {

                trackSupModel.set('Id', trackSupModel.get('Id'));
                trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
                trackSupModel.set('poisVolgen', true);
                trackSupModel.save();
                //console.log('KaartCtrl popup Ctrl trackPoisVolgen saved in trackSupModel: ', true);
                dataFactoryTrack.tmpArray = trackModel.xData.pois;
                trackIconPoisNode.innerHTML = '<div class="trinl-popup-icon-left socio-trinl-blue my-icon"><i class="trinl-icon-popup ion-location"></i>';
                addTrackPois();
              }
              //console.log('KaartCtrl addTracks pois click naar kaart naam, poisVolgen, xData.pois:', trackModel.get('naam'), poisVolgen, trackModel.xData.pois);
            });
          } else {
            //console.warn('KaartCtrl addTracks GEEN LOCATIES');
          }
          //
          //  Indien fotos dan icon in/uitschakelen toevoegen op basis van fotosVolgen in trackModel
          //
          if (trackModel.xData.fotos.length > 0) {

            //console.log('KaartCtrl addTracks init naam, xData.fotos:', trackModel.get('naam'), trackModel.xData.fotos);
            var trackIconFotosNode = L.DomUtil.create('div', 'trackIconFotos', trackIconsNode);
            //
            //  Flip de Fotos
            //

            L.DomEvent.on(trackIconFotosNode, 'click', function () {

              var fotosVolgen = trackSupModel.get('fotosVolgen');
              //console.log('KaartCtrl addTracks fotos click naam, fotosVolgen,  xData.fotos:', trackModel.get('naam'), fotosVolgen, trackModel.xData.fotos);
              if (fotosVolgen) {
                //console.log('KaartCtrl addTracks fotos click naam, xData.fotos:', trackModel.get('naam'), trackModel.xData.fotos);

                trackSupModel.set('Id', trackSupModel.get('Id'));
                trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
                trackSupModel.set('fotosVolgen', false);
                trackSupModel.save();
                //console.log('KaartCtrl popup trackFotosVolgen saved in trackSupModel: ', false);
                dataFactoryTrack.tmpArray2 = [];
                trackIconFotosNode.innerHTML = '<div class="trinl-popup-icon-left socio-grey my-icon"><i class="trinl-icon-popup ion-camera"></i>';
                addTrackFotos();
              } else {
                trackSupModel.set('Id', trackSupModel.get('Id'));
                trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
                trackSupModel.set('fotosVolgen', true);
                trackSupModel.save();
                //console.log('KaartCtrl popup Ctrl trackFotosVolgen saved in trackModel: ', true);
                dataFactoryTrack.tmpArray2 = trackModel.xData.fotos;
                trackIconFotosNode.innerHTML = '<div class="trinl-popup-icon-left socio-trinl-yellow my-icon"><i class="trinl-icon-popup ion-camera"></i>';
                addTrackFotos();
              }
            });
          } else {
            //console.log('KaartCtrl addTracks GEEN FOTOS');
          }
          function flyToTrack() {
            $timeout(function () {

              //console.error('KaartCtrl addTracks flyToTrack: ', spoorCentrum, justClicked, trackModel.get('Id'));
              if (justClicked === trackModel.get('Id')) {
                if (spoorCentrum) {
                  map.flyToBounds(spoorCentrum, {
                    animate: true,
                    duration: 1,
                    easeLinearity: 0.25,
                  });
                } else {
                  //console.log('KaartCtrl addTracks flyTo: ', latlng);
                  map.flyTo(latlng, +map.getZoom(), {
                    animate: true,
                    duration: 1,
                    easeLinearity: 0.25,
                  });
                }
              }
            }, 500);
          }
          //
          //  Content elementen toevoegen aan popup
          //  Nieuwe container bodyNode met daarin naamNode, datumCoordNote en tekstnode
          //
          var trackBodyNode = L.DomUtil.create('div', 'trinl-popup-bodyNode', trackDivNode);
          trackBodyNode.style = 'clear: left;';

          var trackNaamNode = L.DomUtil.create('div', 'trinl-popup-naamNode', trackBodyNode);
          trackNaamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood">' + naam + '</span></b>';

          var coord = lat + '-' + lng;
          var trackDatumCoordNode = L.DomUtil.create('div', 'trinl-popup-datumCoordNode', trackBodyNode);
          trackDatumCoordNode.style = 'margin-top: -10px;';
          trackDatumCoordNode.innerHTML = '<p><span class="trinl-popup-coord trinl-rood">GPS: ' + coord + '</span><br><span class="trinl-popup-datum trinl-blauw">Datum: ' + createdOn + '</span></p>';

          var trackTekstNode = L.DomUtil.create('div', 'trinl-popup-tekstNode', trackBodyNode);
          trackTekstNode.style = 'margin-top: -8px;';
          trackTekstNode.innerHTML = '<p>' + tekst + '</p>';

          trackMarker.on('click', function () {

            //console.error('KaartCtrl addTracks trackMarker on.click');

            //justclicked = true;

            //if (trackMarkerPopup) {
            //trackMarkerPopup.off('remove', flyToTrack);
            //map.closePopup();
            //}

            //console.log('**********************************************************************************************************************************');
            //console.log('*');
            //console.log('*  addTracks');
            //console.log('*  DOM Ready voor trackModel naam: ' + trackModel.get('naam'));
            //console.log('*  DOM Ready voor trackModel Id: ' + trackModel.get('Id'));
            //console.log('*  trackDivNode: ', trackDivNode);
            //console.log('*');
            //console.log('**********************************************************************************************************************************');
            //
            //  Toon Spoor op de kaart
            //
            trackSelected(trackModel).then(function (result) {

              spoorCentrum = result;
              //console.log('KaartCtrl addTracks trackSelected spoorCentrum naam: ', spoorCentrum, trackModel.get('naam'));
              //console.log('KaartCtrl addTracks trackMarker event trackModel lat, lng: ', trackModel.get('lat'), trackModel.get('lng'));
              //console.log('KaartCtrl addTracks trackMarker event trackModel naam: ', trackModel.get('naam'));
              var lat = trackModel.get('lat');
              var lng = trackModel.get('lng');
              var latlng = L.latLng(parseFloat(lat), parseFloat(lng));
              justClicked = trackModel.get('Id');

              //console.log('KaartCtrl addTracks trackMarker event latlng used by Popup, justClicked: ', latlng, justClicked);

              trackMarkerPopup = L.popup()
                .setLatLng(latlng)
                .setContent(trackDivNode)
                .openOn(map);

              //automaticDraggingEnabled = false;
              //map.dragging.disable();
              //map.doubleClickZoom.disable();
              //map.scrollWheelZoom.disable();
              //console.log('KaartCtrl spoorCentrum, justClicked: ', spoorCentrum, justClicked);

              trackMarkerPopup.on('remove', flyToTrack);

              //justclicked = false;

              //$timeout(function () {
              //console.log('KaartCtrl addTracks dragging enabled after flying');
              //automaticDraggingEnabled = true;
              //map.dragging.enable();
              //map.doubleClickZoom.enable();
              //map.scrollWheelZoom.enable();
              //}, 3000);

            }).catch(function (err) {
              //console.log('KaartCtrl addTracks trackSelected ERROR: ', err);
            });

            var poisVolgen = true;

            if (trackModel.xData.pois.length > 0) {
              //console.log('KaartCtrl addTracks poisVolgen in trackModel.sup:', trackModel.xData.sup);
              poisVolgen = trackSupModel.get('poisVolgen');
              //console.log('KaartCtrl addTracks poisVolgen naam xData.pois:', trackModel.get('naam'), poisVolgen, trackModel.xData.pois);
              if (poisVolgen) {
                dataFactoryTrack.tmpArray = trackModel.xData.pois;
                trackIconPoisNode.innerHTML = '<div class="trinl-popup-icon-left socio-trinl-blue my-icon"><i class="trinl-icon-popup ion-location"></i>';
              } else {
                dataFactoryTrack.tmpArray = [];
                trackIconPoisNode.innerHTML = '<div class="trinl-popup-icon-left socio-grey my-icon"><i class="trinl-icon-popup ion-location"></i>';
              }
              addTrackPois();
            }

            var fotosVolgen = true;
            if (trackModel.xData.fotos.length > 0) {
              fotosVolgen = trackSupModel.get('fotosVolgen');
              //console.log('KaartCtrl addTracks fotosVolgen naam xData fotos:', trackModel.get('naam'), fotosVolgen, trackModel.xData.fotos);
              if (fotosVolgen) {
                dataFactoryTrack.tmpArray2 = trackModel.xData.fotos;
                trackIconFotosNode.innerHTML = '<div class="trinl-popup-icon-left socio-trinl-yellow my-icon"><i class="trinl-icon-popup ion-camera"></i>';
              } else {
                dataFactoryTrack.tmpArray2 = [];
                trackIconFotosNode.innerHTML = '<div class="trinl-popup-icon-left socio-grey my-icon"><i class="trinl-icon-popup ion-camera"></i>';
              }

              addTrackFotos();
            }
            //console.warn('**********************************************************************************************************************************');
            //console.warn('*');
            //console.warn('*  Trackmarker click');
            //console.warn('*  DOM Ready voor trackModel: ' + trackModel.get('naam'));
            //console.warn('*  trackDivNode: ', trackDivNode);
            //console.warn('*');
            //console.warn('**********************************************************************************************************************************');
          });

          trackClusterLayer.addLayer(trackMarker);
          map.addLayer(trackClusterLayer);

          //})(trackModel);
        });

        //console.log('KaartCtrl coordinatesToCenter addTracks: ', coordinatesToCenter, coordinatesToCenter.length);
        if (coordinatesToCenter.length > 0) {
          if (coordinatesToCenter.length === 1) {
            markersCentrum = coordinatesToCenter[0];
          } else {
            var markersCentrum = GetCenterFromDegrees(coordinatesToCenter);
            bounds = L.latLngBounds(coordinatesToCenter);
          }
          //
          //  Is er een nieuw centrum
          //
          if (markersCentrum.lat !== vorigCentrum.lat || markersCentrum.lng !== vorigCentrum.lng) {
            //console.log('KaartCtrl addTracks afstand naar nieuwe Locatie meter: ', markersCentrum.distanceTo(vorigCentrum));
            //console.log('KaartCtrl addTracks flyTo markersCentrum, vorigCentrum: ', markersCentrum, vorigCentrum);
            vorigCentrum = markersCentrum;
            map.setZoom(10, {
              animate: true
            });
            $timeout(function () {
              //
              //  Indien er een bounds is dan flyToBounds
              //
              if (coordinatesToCenter.length > 1 || bounds) {
                //console.log('KaartCtrl addTracks flyToBounds: ', bounds);
                //console.log('KaartCtrl start flying');
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyToBounds(bounds.pad(pad), {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: true
                });
              } else {
                //
                //  Geen bounds dan flyTo markersCentrum
                //
                //console.log('KaartCtrl addTracks flyTo: ', markersCentrum);
                //console.log('KaartCtrl start flying');
                map.dragging.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.flyTo(markersCentrum, 15, {
                  inertia: true,
                  animate: true,
                  duration: durationItems,
                  easeLinearity: 0.25,
                  noMovestart: true
                });
              }
            }, 800);
          }
          //console.log('CenterFrom: ', markersCentrum);
        }
      } else {
        //console.warn('KaartCtrl geen map');
      }
    }

    /**
     * @method addTrackPois
     */
    function addTrackPois() {

      //console.log('addTrackPois: pois', dataFactoryTrack.tmpArray, dataFactoryTrack.tmpArray.length);

      if (map) {
        var pois = dataFactoryTrack.tmpArray;
        map.removeLayer(trackPoisClusterLayer);
        L.DomUtil.TRANSITION = true;

        trackPoisClusterLayer = null;
        trackPoisClusterLayer = L.markerClusterGroup({
          animate: true,
          disableClusteringAtZoom: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        var bounds;
        var coordinatesToCenter = [];

        loDash.each(pois, function (poiModel) {

          //console.log('KaartCtrl addPois poiModel: ', poiModel);

          var poiId, gebruikerId, changedOn, naam, tekst, lat, lng, latlng, latlng2, poiMarker;

          poiId = poiModel.get('Id');
          gebruikerId = poiModel.get('gebruikerId');
          changedOn = poiModel.get('changedOn');
          naam = poiModel.get('naam');
          tekst = poiModel.get('tekst');
          lat = poiModel.get('lat');
          lng = poiModel.get('lng');
          latlng = L.latLng(lat, lng);
          latlng2 = [];
          latlng2[0] = parseFloat(lat);
          latlng2[1] = parseFloat(lng);
          coordinatesToCenter.push(latlng2);

          poiMarker = L.marker(latlng, {
            icon: poiIcon
          });
          if (poiModel.xData && poiModel.xData.tags.length > 0) {
            //console.log('KaartCtrl TEST poiModel.xData.tags: ', poiModel.xData.tags);
            if (poiModel.xData.tags[0].tag.value.indexOf('windmolen') > -1 || poiModel.xData.tags[0].tag.value.indexOf('Windmolen') > -1) {
              poiMarker = L.marker(latlng, {
                icon: windmolenIcon
              });
            }
          }
          //console.log('addPoi poiMarker, latlng: ', poiMarker, latlng);

          var poiDivNode = L.DomUtil.create('div', 'poiDiv');
          poiDivNode.className = 'popup';

          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {
            var poiIconsNode = L.DomUtil.create('div', 'trinl-popup-iconsNode', poiDivNode);
            poiIconsNode.style = 'padding-bottom: 45px; margin-top:-10px;';

            var poiIconDeleteNode = L.DomUtil.create('div', 'poiIconDelete', poiIconsNode);
            poiIconDeleteNode.innerHTML = '<div class="trinl-popup-verwijder my-icon"><i class="trinl-icon-popup ion-trash-a"></i><div class="trinl-text-popup-left">verwijder</div>';
            L.DomEvent.on(poiIconDeleteNode, 'click', function () {
              verwijderPoiModel(poiModel);
            });

            var poiIconWijzigNode = L.DomUtil.create('div', 'poiIconWijzig', poiIconsNode);
            poiIconWijzigNode.innerHTML = '<div class="trinl-popup-wijzig my-icon"><i class="trinl-icon-popup ion-compose"></i><div class="trinl-text-popup-left">wijzig</div>';
            L.DomEvent.on(poiIconWijzigNode, 'click', function () {
              //console.log('addPoi click wijzig');
              poiPopupEdit = {
                poiModel: poiModel,
                poiDivNode: poiDivNode,
                poiMarker: poiMarker,
                naamNode: poiNaamNode,
                tekstNode: poiTekstNode,
                naam: naam,
                tekst: tekst
              };
              openPoiItemTekst(poiPopupEdit);
            });
          }

          var poiBodyNode = L.DomUtil.create('div', 'trinl-popup-bodyNode', poiDivNode);
          poiBodyNode.style = 'clear: left;';

          var poiNaamNode = L.DomUtil.create('div', 'trinl-popup-naamNode', poiBodyNode);
          poiNaamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood">' + naam + '</span></b>';

          var coord = lat + '-' + lng;
          var poiDatumCoordNode = L.DomUtil.create('div', 'trinl-popup-datumCoordNode', poiBodyNode);
          //poiDatumCoordNode.style = 'margin-top: -14px;';
          poiDatumCoordNode.innerHTML = '<p><span class="trinl-popup-coord trinl-rood">GPS: ' + coord + '</span></b><br><span class="trinl-popup-datum trinl-blauw">Datum: ' + changedOn + '</span></p>';

          var poiTekstNode = L.DomUtil.create('div', 'trinl-popup-tekstNode', poiBodyNode);
          //poiTekstNode.style = 'margin-top: -8px;';
          poiTekstNode.innerHTML = '<p>' + tekst + '</p>';

          poiMarker.bindPopup(poiDivNode);

          trackPoisClusterLayer.addLayer(poiMarker);
        });

        if (map !== null) {
          map.addLayer(trackPoisClusterLayer);
        }
      }
    }
    /**
     * @method addTrackFotos
     */
    function addTrackFotos() {

      //console.log('addTrackFotos: fotos', dataFactoryTrack.tmpArray2, dataFactoryTrack.tmpArray2.length);

      if (map && dataFactoryTrack.tmpArray2) {
        var fotos = dataFactoryTrack.tmpArray2;
        map.removeLayer(trackFotosClusterLayer);

        var coordinatesToCenter = [];

        trackFotosClusterLayer = null;
        trackFotosClusterLayer = L.markerClusterGroup({
          animate: true,
          disableClusteringAtZoom: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        loDash.each(fotos, function (fotoModel) {

          //console.error('KaartCtrl addTrackFotos fotoModel: ', fotoModel);

          var gebruikerId, changedOn, fotoId, srcFotoId, extension, naam, tekst, lat, lng;
          var latlng, fotoMarker, latlng2;
          gebruikerId = fotoModel.get('gebruikerId');
          changedOn = fotoModel.get('changedOn');
          fotoId = fotoModel.get('Id');
          srcFotoId = fotoModel.get('fotoId');
          extension = fotoModel.get('extension');
          naam = fotoModel.get('naam');
          tekst = fotoModel.get('tekst');
          lat = fotoModel.get('lat');
          lng = fotoModel.get('lng');
          latlng = L.latLng(lat, lng);

          fotoMarker = L.marker(latlng, {
            icon: fotoIcon
          });

          latlng2 = [];
          latlng2[0] = parseFloat(lat);
          latlng2[1] = parseFloat(lng);

          coordinatesToCenter.push(latlng2);

          var fotoDivNode = L.DomUtil.create('div', 'fotoDiv');
          fotoDivNode.className = 'popup';

          if (gebruikerId === dataFactoryCeo.currentModel.get('Id')) {
            var fotoIconsNode = L.DomUtil.create('div', 'trinl-popup-iconsNode', fotoDivNode);

            var fotoIconDeleteNode = L.DomUtil.create('div', 'fotoIconDelete', fotoIconsNode);
            fotoIconDeleteNode.innerHTML = '<div class="trinl-popup-verwijder my-icon"><i class="trinl-icon-popup ion-trash-a"></i><div class="trinl-text-popup-left">verwijder</div>';
            L.DomEvent.on(fotoIconDeleteNode, 'click', function () {
              verwijderFotoModel(fotoModel);
            });

            var fotoIconWijzigNode = L.DomUtil.create('div', 'fotoIconWijzig', fotoIconsNode);
            fotoIconWijzigNode.innerHTML = '<div class="trinl-popup-wijzig my-icon"><i class="trinl-icon-popup ion-compose"></i><div class="trinl-text-popup-left">wijzig</div>';
            L.DomEvent.on(fotoIconWijzigNode, 'click', function () {

              fotoPopupEdit = {
                fotoModel: fotoModel,
                fotoDivNode: fotoDivNode,
                fotoMarker: fotoMarker,
                naamNode: fotoNaamNode,
                tekstNode: fotoTekstNode,
                naam: naam,
                tekst: tekst
              };
              openFotoItemTekst(fotoPopupEdit);
            });
          }

          var fotoBodyNode = L.DomUtil.create('div', 'trinl-popup-bodyNode', fotoDivNode);
          fotoBodyNode.style = 'clear: left;';

          var fotoNaamNode = L.DomUtil.create('div', 'trinl-popup-naamNode', fotoBodyNode);
          fotoNaamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood">' + naam + '</span></b>';

          var coord = lat + '-' + lng;
          var fotoDatumCoordNode = L.DomUtil.create('div', 'trinl-popup-datumCoordNode', fotoBodyNode);
          fotoDatumCoordNode.innerHTML = '<p><span class="trinl-popup-coord trinl-rood">GPS: ' + coord + '</span><br><span class="trinl-popup-datum trinl-blauw">Datum: ' + changedOn + '</span></p>';

          var fotoImg = L.DomUtil.create('div', 'fotoImg', fotoBodyNode);

          var fotoTekstNode = L.DomUtil.create('div', 'trinl-popup-tekstNode', fotoBodyNode);
          fotoTekstNode.style = 'margin-top: -8px;';
          fotoTekstNode.innerHTML = '<div><p>' + tekst + '</p></div>';

          //console.log('KaartCtrl addTrackFotos srcFotoId: ', srcFotoId);

          dataFactoryFotos.getFotoSrc(gebruikerId, srcFotoId, extension).then(function (src) {
            var fotoSrc = src.kaartPath;
            //console.log('KaartCtrl addTrackFotos src: ', src);
            if (fotoSrc !== '' && fotoSrc !== undefined) {
              fotoImg.innerHTML = '<img id="kaartfotoimage" src="' + fotoSrc + '" /> <div>';
            }
          });

          fotoMarker.bindPopup(fotoDivNode);

          trackFotosClusterLayer.addLayer(fotoMarker);
        });

        if (map !== null) {
          map.addLayer(trackFotosClusterLayer);
        }
      }
    }

    function verwijderPoiModel(poiModel) {

      //console.warn('KaartCtrl verwijderPoiModel: ', poiModel);
      var poiId = poiModel.get('Id');

      $ionicPopup.confirm({
        title: 'Verwijder Locatie',
        content: 'Weet je zeker dat de Locatie<br><br><span class="trinl-rood"><b>' + poiModel.get('naam') + '</b></span><br><br>definitief verwijderd moet worden?',
        buttons: [{
          text: 'Annuleer'
        },
        {
          text: '<b>Verwijder</b>',
          type: 'button-positive',
          onTap: function () {

            //var poisups = loDash.filter(dataFactoryPoiSup.store, function (poiSupModel) {
            //return poiSupModel.get('poiId') === poiId;
            //});

            //console.warn('KaartCtrl verwijderPoiModel poisups te verwijderen: ', poisups);

            //loDash.each(poisups, function (poiSupModel) {
            //(function (poiSupModel) {
            //poiSupModel.remove();
            //})(poiSupModel);
            //});

            //console.warn('KaartCtrl verwijderPoiModel poisups verwijderd');

            var poitags = loDash.filter(dataFactoryPoiTag.store, function (poiTagModel) {
              return poiTagModel.get('poiId') === poiId;
            });

            loDash.each(poitags, function (poiTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return (tagModel.get('Id') === poiTagModel.get('tagId'));
              });

              poiTagModel.xData = tagModel;
              $rootScope.$emit('poiRemoveLabel', {
                poiModel: poiModel,
                tagModel: tagModel
              });
              //poiTagModel.remove();
            });

            //console.warn('KaartCtrl verwijderPoiModel poitags verwijderd');

            loDash.remove(dataFactoryPoi.star, function (poiModel) {
              return poiModel.get('Id') === poiId;
            });

            loDash.remove(dataFactoryPoi.nieuw, function (poiModel) {
              return poiModel.get('Id') === poiId;
            });

            //console.warn('KaartCtrl verwijderPoiModel star en nieuw verwijderd');

            $rootScope.$emit('poiDelete', poiModel.get('Id'));

            //console.warn('KaartCtrl verwijderPoiModel poisups verwijderd');

            loDash.remove(dataFactoryTrack.tmpArray, function (poiModel) {
              return poiModel.get('Id') === poiId;
            });

            //console.warn('KaartCtrl verwijderPoiModel tmpArray verwijderd');

            poiModel.remove();

            //console.warn('KaartCtrl verwijderPoiModel poiModel verwijderd');

            addTrackPois();
          }
        }
        ]
      });
    }

    function verwijderFotoModel(fotoModel) {

      //console.warn('KaartCtrl verwijderFotoModel: ', fotoModel);
      var fotoId = fotoModel.get('Id');

      $ionicPopup.confirm({
        title: 'Verwijder Foto',
        content: 'Weet je zeker dat de Foto<br><br><span class="trinl-rood"><b>' + fotoModel.get('naam') + '</b></span><br><br>definitief verwijderd moet worden?',
        buttons: [{
          text: 'Annuleer'
        },
        {
          text: '<b>Verwijder</b>',
          type: 'button-positive',
          onTap: function () {

            //console.warn('KaartCtrl verwijderFotoModel start');

            var fotosups = loDash.filter(dataFactoryFotoSup.store, function (fotoSupModel) {
              return fotoSupModel.get('fotoId') === fotoId;
            });

            loDash.each(fotosups, function (fotoSupModel) {
              (function (fotoSupModel) {
                fotoSupModel.remove();
              })(fotoSupModel);
            });

            //console.warn('KaartCtrl verwijderFotoModel fotosups verwijderd');

            var fototags = loDash.filter(dataFactoryFotoTag.store, function (fotoTagModel) {
              return fotoTagModel.get('fotoId') === fotoId;
            });

            loDash.each(fototags, function (fotoTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return (tagModel.get('Id') === fotoTagModel.get('tagId'));
              });

              $rootScope.$emit('fotoRemoveLabel', {
                fotoModel: fotoModel,
                tagModel: tagModel
              });
              fotoTagModel.remove();
            });

            //console.warn('KaartCtrl verwijderFotoModel fototags verwijderd');

            loDash.remove(dataFactoryFoto.star, function (fotoModel) {
              return fotoModel.get('Id') === fotoId;
            });

            loDash.remove(dataFactoryFoto.nieuw, function (fotoModel) {
              return fotoModel.get('Id') === fotoId;
            });

            //console.warn('KaartCtrl verwijderFotoModel star nieuwe verwijderd');

            $rootScope.$emit('fotoDelete', fotoModel.get('Id'));

            loDash.remove(dataFactoryTrack.tmpArray2, function (fotoModel) {
              return fotoModel.get('Id') === fotoId;
            });

            //console.warn('KaartCtrl verwijderFotoModel tmpArray2 verwijderd');

            fotoModel.remove();

            //console.warn('KaartCtrl verwijderFotoModel fotoModel verwijderd: ', fotoModel);

            addTrackFotos();
          }
        }
        ]
      });
    }

    function verwijderTrackModel(trackModel) {

      //console.warn('KaartCtrl verwijderTrackModel: ', trackModel);
      var trackId = trackModel.get('Id');

      $ionicPopup.confirm({
        title: 'Verwijder Track',
        content: 'Weet je zeker dat het Spoor<br><br><span class="trinl-rood"><b>' + trackModel.get('naam') + '</b></span><br><br>definitief verwijderd moet worden?',
        buttons: [{
          text: 'Annuleer'
        },
        {
          text: '<b>Verwijder</b>',
          type: 'button-positive',
          onTap: function () {

            var tracksups = loDash.filter(dataFactoryTrackSup.store, function (trackSupModel) {
              return trackSupModel.get('trackId') === trackId;
            });

            loDash.each(tracksups, function (trackSupModel) {
              (function (trackSupModel) {
                trackSupModel.remove();
              })(trackSupModel);
            });

            var tracktags = loDash.filter(dataFactoryTrackTag.store, function (trackTagModel) {
              return trackTagModel.get('trackId') === trackId;
            });

            loDash.each(tracktags, function (trackTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return (tagModel.get('Id') === trackTagModel.get('tagId'));
              });

              $rootScope.$emit('trackRemoveLabel', {
                trackModel: trackModel,
                tagModel: tagModel
              });
              trackTagModel.remove();
            });

            loDash.remove(dataFactoryTrack.star, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });

            loDash.remove(dataFactoryTrack.nieuw, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });

            loDash.remove(dataFactoryTrack.selected, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });

            loDash.remove(dataFactoryTrack.tmpArray, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });
            loDash.remove(dataFactoryTrack.tmpArray2, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });

            $rootScope.$emit('trackDelete', trackModel.get('Id'));

            loDash.remove(dataFactoryTrack.store, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });
            loDash.remove(dataFactoryTrack.data, function (dataItem) {
              return dataItem.record.get('Id') === trackId;
            });

            trackModel.remove();
          }
        }
        ]
      });
    }

    function openPoiItemTekst(poiPopupEdit) {
      //console.warn('KaartCtrl openPoiItemTekst: ', poiPopupEdit);

      var poiModel = poiPopupEdit.poiModel;
      if (poiModel) {
        //console.log('KaartCtrl openPoiItemTekst poiModel: ', poiModel);
        $scope.input = {};
        $scope.input.naam = poiModel.get('naam');
        $scope.input.tekst = poiModel.get('tekst');
        $scope.input.poiPopupEdit = poiPopupEdit;
        $scope.input.oldInputNaam = poiModel.get('naam');
        $scope.input.oldInputTekst = poiModel.get('tekst');

        $scope.openModalPoi();
      }
    }

    function openFotoItemTekst(fotoPopupEdit) {
      //console.warn('KaartCtrl openFotoItemTekst: ', fotoPopupEdit);

      var fotoModel = fotoPopupEdit.fotoModel;
      if (fotoModel) {
        //console.log('KaartCtrl openFotoItemTekst fotoModel: ', fotoModel);
        $scope.input = {};
        $scope.input.naam = fotoModel.get('naam');
        $scope.input.tekst = fotoModel.get('tekst');
        $scope.input.fotoPopupEdit = fotoPopupEdit;
        $scope.input.oldInputNaam = fotoModel.get('naam');
        $scope.input.oldInputTekst = fotoModel.get('tekst');

        $scope.openModalFoto();
      }
    }

    function openTrackItemTekst(trackPopupEdit) {
      //console.warn('KaartCtrl openTrackItemTekst: ', trackPopupEdit);

      var trackModel = trackPopupEdit.trackModel;
      if (trackModel) {
        //console.log('KaartCtrl openTrackItemTekst trackModel: ', trackModel);
        $scope.input = {};
        $scope.input.naam = trackModel.get('naam');
        $scope.input.tekst = trackModel.get('tekst');
        $scope.input.trackPopupEdit = trackPopupEdit;
        $scope.input.oldInputNaam = trackModel.get('naam');
        $scope.input.oldInputTekst = trackModel.get('tekst');

        $scope.openModalTrack();
      }
    }

    $scope.savePoiItemTekst = function (input) {

      var poiModel = input.poiPopupEdit.poiModel;
      if (poiModel) {
        //console.log('KaartCtrl savePoiItemTekst poiModel: ', poiModel);

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = false;
        if (input.naam !== input.poiPopupEdit.oldInputNaam) {
          poiModel.set('naam', input.naam.substr(0, 7500));
          tmp = true;
        }
        if (input.tekst !== input.poiPopupEdit.oldInputTekst) {
          poiModel.set('tekst', input.tekst.substr(0, 7500));
          tmp = true;
        }
        if (tmp) {
          poiModel.set('Id', poiModel.get('Id'));
          poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
          poiModel.set('xprive', true);
          poiModel.save();

          input.poiPopupEdit.naamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood"><br>' + input.naam + '</span></b>';
          input.poiPopupEdit.tekstNode.innerHTML = '<p>' + input.tekst + '</p>';

          input.poiPopupEdit.poiMarker.bindPopup(input.poiPopupEdit.poiDivNode, {
            maxHeight: 'auto'
          });
        }
      }

      $scope.closeModalPoi();
    };

    $scope.saveFotoItemTekst = function (input) {

      //console.warn('KaartCtrl saveFotoItemTekst: ', input);
      var fotoModel = input.fotoPopupEdit.fotoModel;
      if (fotoModel) {

        //console.log('KaartCtrl saveFotoItemTekst fotoModel: ', fotoModel);

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = false;
        if (input.naam !== input.fotoPopupEdit.oldInputNaam) {
          fotoModel.set('naam', input.naam.substr(0, 7500));
          tmp = true;
        }
        if (input.tekst !== input.fotoPopupEdit.oldInputTekst) {
          fotoModel.set('tekst', input.tekst.substr(0, 7500));
          tmp = true;
        }
        if (tmp) {
          fotoModel.set('Id', fotoModel.get('Id'));
          fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
          fotoModel.set('xprive', true);
          fotoModel.save();

          input.fotoPopupEdit.naamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood"><br>' + input.naam + '</span></b>';
          input.fotoPopupEdit.tekstNode.innerHTML = '<p>' + input.tekst + '</p>';

          input.fotoPopupEdit.fotoMarker.bindPopup(input.fotoPopupEdit.fotoDivNode, {
            maxHeight: 'auto'
          });
        }
      }

      $scope.closeModalFoto();
    };

    $scope.saveTrackItemTekst = function (input) {

      //console.log('KaartCtrl saveTrackItemTekst input: ', input);

      var trackModel = input.trackPopupEdit.trackModel;
      if (trackModel) {

        //console.log('KaartCtrl saveTrackItemTekst trackModel: ', trackModel);

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = false;
        if (input.naam !== input.trackPopupEdit.oldInputNaam) {
          trackModel.set('naam', input.naam.substr(0, 7500));
          tmp = true;
        }
        if (input.tekst !== input.trackPopupEdit.oldInputTekst) {
          trackModel.set('tekst', input.tekst.substr(0, 7500));
          tmp = true;
        }
        if (tmp) {
          trackModel.set('Id', trackModel.get('Id'));
          trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
          trackModel.set('xprive', true);
          trackModel.save();

          input.trackPopupEdit.naamNode.innerHTML = '<b><span class="trinl-popup-naam trinl-rood"><br>' + input.naam + '</span></b>';
          input.trackPopupEdit.tekstNode.innerHTML = '<p>' + input.tekst + '</p>';

          input.trackPopupEdit.trackMarker.bindPopup(input.trackPopupEdit.trackDivNode, {
            maxHeight: 'auto'
          });
        }
      }

      $scope.closeModalTrack();
    };

    //
    // Modal poi
    //
    $ionicModal.fromTemplateUrl('poiModal.html', function (modalPoi) {
      $scope.modalPoi = modalPoi;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $scope.openModalPoi = function () {
      $scope.modalPoi.show();
    };

    $scope.closeModalPoi = function () {
      $scope.modalPoi.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalPoi.remove();
      //console.log('KaartCtrl ModalPoi is removed!');
    });
    //
    // Modal foto
    //
    $ionicModal.fromTemplateUrl('fotoModal.html', function (modalFoto) {
      $scope.modalFoto = modalFoto;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $scope.openModalFoto = function () {
      $scope.modalFoto.show();
    };

    $scope.closeModalFoto = function () {
      $scope.modalFoto.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalFoto.remove();
      //console.log('KaartCtrl ModalFoto is removed!');
    });
    //
    // Modal track
    //
    $ionicModal.fromTemplateUrl('trackModal.html', function (modalTrack) {
      $scope.modalTrack = modalTrack;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $scope.openModalTrack = function () {
      $scope.modalTrack.show();
    };

    $scope.closeModalTrack = function () {
      $scope.modalTrack.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTrack.remove();
      //console.log('KaartCtrl ModalTrack is removed!');
    });

    /**
     * Instal
     * Loop door alle track en haal de bijbehorende tekst op.
     * Creeer de marker en installer marker in trackClusterLayer
     * @param {Array} tracks tabel met tracks
     * @param {Number} index
     */
    function rad2degr(rad) {
      return rad * 180 / Math.PI;
    }

    function degr2rad(degr) {
      return degr * Math.PI / 180;
    }

    function GetCenterFromDegrees(data) {

      //console.log('coordinatesToCenter data: ', data);

      var latlng;

      if (data.length == 1) {
        latlng = data[0];
        //console.warn('coordinatesToCenter 1 location in data: ', data, latlng);
        return latlng;
      }

      if (data.length == 0) {
        latlng = L.latLng(parseFloat(51.1955847), parseFloat(5.9926069));
        //console.error('coordinatesToCenter GEEN location in data: ', data, latlng);
        return latlng;
      }

      var num_coords = data.length;

      var X = 0.0;
      var Y = 0.0;
      var Z = 0.0;
      var i, lat, lng, hyp;

      for (i = 0; i < data.length; i++) {
        lat = data[i].lat * Math.PI / 180;
        lng = data[i].lng * Math.PI / 180;

        var a = Math.cos(lat) * Math.cos(lng);
        var b = Math.cos(lat) * Math.sin(lng);
        var c = Math.sin(lat);

        X += a;
        Y += b;
        Z += c;
      }

      X /= num_coords;
      Y /= num_coords;
      Z /= num_coords;

      lng = Math.atan2(Y, X);
      hyp = Math.sqrt(X * X + Y * Y);
      lat = Math.atan2(Z, hyp);

      var newX = (lat * 180 / Math.PI);
      var newY = (lng * 180 / Math.PI);
      //if (isNaN(newX) || isNaN(newY)) {
      if (!newX || !newY) {
        latlng = L.latLng(parseFloat(51.1955847), parseFloat(5.9926069));
        //console.error('KaartCtrl GetCenterFromDegrees aantal newX, newY NaN: ', latlng);
        return latlng;
      } else {

        latlng = L.latLng(parseFloat(newX), parseFloat(newY));
        //console.log('KaartCtrl GetCenterFromDegrees aantal newX, newY SUCCES: ', latlng);
        return latlng;
      }
    }

    function popupMarker(location) {
      popupMarker2(location);
    }

    /**
     * Toon popup om gegevens aan te vullen
     * @param  {Object} location locatie waar marker geplaatst wordt
     */
    function popupMarker2(location) {
      //console.warn('Geosearch popupmarker: ', location);
      $scope.data = {};
      var labelArray = location.Location.Label.split(',');
      var postcode = loDash.filter(labelArray, function (item, index) {
        //console.log('Geosearch array[' + index + ']: ', item);
        return item.substr(1, 4).match(/^\d+$/) && index !== 0;
      });
      //console.log('Geosearch: ', postcode);
      if (labelArray.length >= 6) {
        $scope.data.poiNaam =
          labelArray[1] +
          ' ' +
          labelArray[0] +
          ' ' +
          postcode +
          ' ' +
          labelArray[2];
      } else {
        $scope.data.poiNaam = labelArray[0];
      }

      var poiPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.poiNaam">',
        title: 'Locatie opslaan',
        subTitle: '<br>Geef deze locatie een naam.',
        scope: $scope,
        buttons: [{
          text: 'Annuleer',
          onTap: function () {
            //console.log('onTap Annuleer: ', $scope.data.poiNaam);
            $scope.data.action = 'Annuleer';
            return $scope.data;
          }
        },
        {
          text: '<b>Opslaan</b>',
          type: 'button-positive',
          onTap: function (e) {
            //console.log('onTap Save: ', e, $scope.data.poiNaam);
            if (!$scope.data.poiNaam) {
              e.preventDefault();
            } else {
              $scope.data.action = 'Opslaan';
              return $scope.data;
            }
          }
        }
        ]
      });
      poiPopup.then(function (data) {
        //console.warn('Tapped!', data);

        if (data.action === 'Opslaan') {
          //console.log('Tapped! Opslaan');

          var poiModel = new dataFactoryPoi.Model();
          poiModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          poiModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
          poiModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
          poiModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
          var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
          poiModel.set('avatarColor', tmp[0]);
          poiModel.set('avatarLetter', tmp[1]);
          poiModel.set('avatarInverse', tmp[2]);
          poiModel.set('naam', data.poiNaam);
          poiModel.set('tekst', location.Location.Label);
          poiModel.set('fotoId', '');
          poiModel.set('poiId', '');
          poiModel.set('trackId', currentTrackId);
          poiModel.set('lat', location.Location.Y);
          poiModel.set('lng', location.Location.X);
          poiModel.set('xprive', true);

          poiModel.save().then(function (poiModel) {
            //console.log('KaartCtrl nieuwe poiModel SAVED: ', poiModel);
            poiModel.xData = {
              tags: []
            };
            dataFactoryPoi.currentModel = poiModel;
            //navigator.serviceWorker.ready.then(reg => {
            //reg.sync.register('poi');
            //});
            var poiId = poiModel.get('Id');
            var poisupModel = new dataFactoryPoiSup.Model();
            poisupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            poisupModel.set('poiId', poiId);
            poisupModel.set('xnew', false);
            poisupModel.save().then(function () { });

            //console.log('KaartCtrl nieuwe poisup SAVED: ', poisupModel);

            location.Location.Label = '';
            $rootScope.$emit('poi', {
              operation: 'add',
              poiId: poiModel.get('Id')
            });
          });
          //
          // De nieuwe poi wordt toegevoegd aan dataFactoryPoi.selected
          // ###Opmerking###
          // De poi is in de store toegevoegd. Het kan best zo zijn dat de neiuwe poi
          // niet in selected thuishoort omdat het filter deze poi niet kopieert naar selected
          // De poi op onderstaande wijze toevoegen aan selected is daarom niet correct.
          // Als de PoiCtrl dit zou doen dan is dat de reden dat een poi 2 keer voorkomt in selected.
          // PoiCtrl doet dit niety want die weet niet dat KaartCtrl een Poi heeft toegevoegd aan de store.
          // later als de gebruiker een andere filter kiest kan het zijn dat deze poi terecht niet meer op de kaart staat.
          //
          var newPoi = [];
          newPoi.push(poiModel);
          dataFactoryPoi.selected = newPoi.concat(
            dataFactoryPoi.selected
          );
          addPois();
        }
        //
        // De Poi gemaakt door deze functie is niet meer nodig. De Poi staat nu op de kaart door selected addPois()
        $timeout(function () {
          map.removeLayer(geolocationMarker);
          map.invalidateSize(true);
          //console.log('KaartCtrl map.invalidateSize after geosearch');
        }, 2000);

        //console.log('Poi geosearch geinstalleerd');
      });
    }
    /**
     * Switch naar de volgende kaart
     * @param  {Number} index kaartnummer
     */
    function toKaart(kaart) {
      //console.warn('KaartCtrl toKaart');

      //console.warn('NEW toKaart nieuw oud, prev, next, type, naam: ', kaart.index, $scope.currentHedenKaartIndex, kaart.prev, kaart.next, kaart.type, kaart.naam);
      //console.log($scope.configKaartItems[kaart.index]);

      var configKaartItem = loDash.find($scope.configKaartItems, function (
        item
      ) {
        return item.index === kaart.index;
      });
      if (configKaartItem.type === 'heden') {
        if (overlay1600On) {
          //console.warn('NEW toKaart remove oude overlay1600');
          map.removeLayer(dataFactoryOverlay.overlay1600);
          overlay1600On = false;
        }
        //console.log('NEW toKaart heden');
        //
        // Indien er ook een nnietheden kaart is deze van map verwijderen
        //
        if ($scope.currentNietHedenKaartIndex !== -1) {
          //console.warn('NEW toKaart remove oude nietHeden Kaart index: ', $scope.currentNietHedenKaartIndex);
          dataFactoryMap.map[
            $scope.currentNietHedenKaartIndex
          ].removeFrom(map);
          if (overlay1600On) {
            //console.warn('NEW toKaart remove oude overlay1600');
            map.removeLayer(dataFactoryOverlay.overlay1600);
            overlay1600On = false;
          }
          $scope.currentNietHedenKaartIndex = -1;
          updateConfig(
            'kaartNietHeden',
            $scope.currentNietHedenKaartIndex
          );
          //console.log('NEW toKaart removed currentNiethedenKaart: ', $scope.currentNietHedenKaartIndex);
        }

        if ($scope.currentHedenKaartIndex !== kaart.index) {
          if ($scope.currentHedenKaartIndex !== -1) {
            dataFactoryMap.map[
              $scope.currentHedenKaartIndex
            ].removeFrom(map);
            //console.warn('NEW toKaart remove oude Heden Kaart index: ', $scope.currentHedenKaartIndex);
          }
          dataFactoryMap.map[kaart.index].addTo(map);
          //console.warn('NEW toKaart add nieuwe Kaart index: ', kaart.index);

          $scope.currentHedenKaartIndex = kaart.index;

          updateConfig('kaartHeden', $scope.currentHedenKaartIndex);
        }

        titleHedenNaam = configKaartItem.naam;
        titleHedenNaamKort = configKaartItem.naamKort;

        //console.log('KaartCtrl toKaart Heden navTitle');
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $scope.setNavTitle(titleHedenNaamKort);
        } else {
          $scope.setNavTitle(titleHedenNaam);
        }
        //console.log('KaartCtrl toKaart titleHedenNaam: ', titleHedenNaam);
      } else {
        //console.log('NEW toKaart verleden currentNietHedenIndex: ', $scope.currentNietHedenKaartIndex);
        if ($scope.currentNietHedenKaartIndex > 2) {
          if (dataFactoryMap.map[$scope.currentNietHedenKaartIndex]) {
            dataFactoryMap.map[
              $scope.currentNietHedenKaartIndex
            ].removeFrom(map);
            //console.log('NEW toKaart removed currentNiethedenKaart naam, index, index, type: ', kaart.naam, $scope.currentNietHedenKaartIndex, kaart.index, configKaartItem.type);
          }
        }

        titleNietHedenNaam = configKaartItem.naam;
        titleNietHedenNaamKort = configKaartItem.naamKort;

        if (dataFactoryMap.map[kaart.index]) {
          dataFactoryMap.map[kaart.index].addTo(map);
          //console.log('NEW toKaart added currentNiethedenKaart naam, index type: ', configKaartItem.naam, kaart.index, kaart.type);
        }
        if (configKaartItem.naam != '1600') {

          if (overlay1600On) {
            //console.warn('NEW toKaart add  overlay1600');
            dataFactoryOverlay.overlay1600.removeFrom(map);
            overlay1600On = false;
          }
        }
        if (configKaartItem.naam === '1600' && +map.getZoom() > 12) {
          if (overlay1600On) {
            //console.warn('NEW toKaart add  overlay1600');
            dataFactoryOverlay.overlay1600.addTo(map);
            overlay1600On = false;
          }
        }
        if (configKaartItem.naam === '1600' && +map.getZoom() <= 11) {
          if (!overlay1600On) {
            //console.warn('NEW toKaart add  overlay1600');
            dataFactoryOverlay.overlay1600.addTo(map);
            overlay1600On = true;
          }
        }
        $scope.currentNietHedenKaartIndex = kaart.index;
        vorigNietHedenKaartIndex = kaart.index;
        updateConfig('kaartNietHeden', kaart.index);
        //console.log('KaartCtrl toKaart: currentNietHedenKaartIndex: ', $scope.currentNietHedenKaartIndex);
        //console.log('KaartCtrl toKaart: currentHedenKaartIndex: ', $scope.currentHedenKaartIndex);
        if (map.getZoom() < kaart.maxZoom + 1) {
          popupZoomMaxHedenActive = false;
          //console.log('KaartCtrl toKaart reset popupZoomMaxHedenActive: ', popupZoomMaxHedenActive);
        } else {
          popupZoomMaxHedenActive = true;
          //console.log('KaartCtrl toKaart set popupZoomMaxHedenActive: ', popupZoomMaxHedenActive);
        }
        checkKaartHedenNietHeden();
      }

      $scope.kaartNaam = configKaartItem.naam;
    }
    /**
     * ==============================================================================================================================
     *
     * Function voor GPS
     *
     * ==============================================================================================================================
     */
    /*
    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            bgConfigure();
          backgroundGeolocation.watchLocationMode(
    function (enabled) {
            isLocationEnabled = enabled;
    if (enabled && $scope.gpsRecord) {
            startTracking();
    } else {
    if (isStarted) {
            stopTracking();
    //console.error('Location tracking has been stopped');
        }
      }
    },
    function (error) {
            //console.error('Error watching location mode: ', error);
          }
          );
    } else {
            //console.warn('Geen tracking mogelijk. Uitsluitend op mobiele apparaten');
          }
          */
    function bgConfigure() {
      var bgOptions = {
        stationaryRadius: dataFactoryInstellingen.radius,
        distanceFilter: dataFactoryInstellingen.distanceFilter,
        desiredAccuracy: dataFactoryInstellingen.accuracy,
        debug: dataFactoryInstellingen.gpsDebug,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        notificationIconColor: '#FEDD1E',
        notificationIconLarge: 'mappointer_large',
        notificationIconSmall: 'mappointer_small',
        locationProvider: 0, //backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        stopOnTerminate: false,
        startOnBoot: false,
        startForeground: true,
        stopOnStillActivity: true,
        activityType: 'AutomotiveNavigation',
        pauseLocationUpdates: false,
        saveBatteryOnBackground: false,
        maxLocations: 1000
      };

      //console.log('KaartCtrl bgConfigure bgOptions: ', bgOptions);

      if (isStarted) {
        stopTracking();
        backgroundGeolocation.configure(
          callbackBg,
          function (err) {
            //console.error('Error occured', err);
          },
          bgOptions
        );
        startTracking();
      } else {
        backgroundGeolocation.configure(
          callbackBg,
          function (err) {
            //console.error('Error occured: ', err);
          },
          bgOptions
        );
      }
    }

    function startTracking() {
      //console.warn('KaartCtrl startTracking');

      if (isStarted) {
        return;
      }

      backgroundGeolocation.isLocationEnabled(
        function (enabled) {
          //          isLocationEnabled = enabled;
          if (enabled) {
            //console.log('KaartCtrl startTracking backgroundGeolocation.start');
            backgroundGeolocation.start(
              null,

              function (error) {
                // Tracking has not started because of error
                // you should adjust your app UI for example change switch element to indicate
                // that service is not running
                //console.log('KaartCtrl startTracking backgroundGeolocation.start ERROR');
                stopTracking();
                if (error.code === 2) {
                  $ionicPopup.confirm({
                    title: 'Sporen maken toestaan',
                    content: 'Je hebt nog niet kenbaar gemaakt dat sporen maken is toegestaan.<br>Wil je sporen toestaan?',
                    buttons: [{
                      text: 'Annuleer',
                      onTap: function () { }
                    },
                    {
                      text: '<b>Sporen maken toestaan</b>',
                      type: 'button-positive',
                      onTap: function () {
                        backgroundGeolocation.showAppSettings();
                      }
                    }
                    ]
                  });
                } else {
                  var alertTrackingPopup = $ionicPopup.alert({
                    title: 'Sporen maken toestaan',
                    content: 'Start spoor maken mislukt, ' +
                      error.message
                  });
                  alertTrackingPopup.then(function () {
                    return true;
                  });
                }
              }
            );
            isStarted = true;
          } else {
            // Location services are disabled

            $ionicPopup.confirm({
              title: 'Sporen maken toestaan',
              content: 'Je hebt nog niet kenbaar gemaakt dat sporen maken is toegestaan.<br>Wil je sporen toestaan?',
              buttons: [{
                text: 'Annuleer',
                onTap: function () { }
              },
              {
                text: '<b>Sporen maken toestaan</b>',
                type: 'button-positive',
                onTap: function () {
                  backgroundGeolocation.showAppSettings();
                }
              }
              ]
            });
          }
        },
        function (error) {
          var alertSettingsPopup = $ionicPopup.alert({
            title: 'Sporen maken toestaan',
            content: 'Status location settings mislukt, ' + error
          });
          alertSettingsPopup.then(function () {
            return true;
          });
        }
      );
    }

    function stopTracking() {
      //console.warn('KaartCtrl stopTracking');

      if (!isStarted) {
        return;
      }

      backgroundGeolocation.stop();
      isStarted = false;
    }

    function callbackBg(location) {
      //console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
      // IOS to backend
      // Do your HTTP request here to POST location to your server.
      //
      //		watchHandlerBg(location);

      var geoModel = new dataFactoryGeo.Model();
      geoModel.set(
        'gebruikerNaam',
        dataFactoryCeo.currentModel.get('gebruikerNaam')
      );
      geoModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
      geoModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
      var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
      geoModel.set('avatarColor', tmp[0]);
      geoModel.set('avatarLetter', tmp[1]);
      geoModel.set('avatarInverse', tmp[2]);
      geoModel.set('trackId', currentTrackId);
      geoModel.set('deviceType', 'CALLBACK!!!!');
      geoModel.set('latitude', location.latitude);
      geoModel.set('longitude', location.longitude);
      geoModel.save();

      //console.log('BackgroundGeo callbackFn save geoModel: ', geoModel);
      backgroundGeolocation.finish();
    }
    /**
     * Maak track leeg om opnieuw te beginnen
     */

    function clearTrack() {
      //console.warn('clearTrack');

      if (trackClusterLayer) {
        map.removeLayer(trackClusterLayer);
        //console.warn('KaartCtrl clearTrack oude trackClusterLayer verwijderd');
      }

      if (centerMarker) {
        map.removeLayer(centerMarker);
        //console.warn('KaartCtrl clearTrack oude centerMarker verwijderd');
      }

      vorigeCenterLatLng = null;
      centerLatLng = null;

      currentTrackId = '';
      dataFactoryFoto.tmpArray = [];
      //
      // Start opnieuw met een lege track
      //
      Geoposition = {};
      Geoposition.type = 'FeatureCollection';
      Geoposition.features = new Array(1);
      Geoposition.features[0] = {};
      Geoposition.features[0].type = 'Feature';
      Geoposition.features[0].geometry = {};
      Geoposition.features[0].geometry.type = 'LineString';
      //
      // Een lege Geometry
      //
      Geometry.timestamp = [];
      Geometry.coordinates = [];
      Geoposition.features[0].geometry.timestamp = Geometry.timestamp;
      Geoposition.features[0].geometry.coordinates = Geometry.coordinates;

      //console.log(JSON.stringify(Geoposition));

      trackingDataIndex = 0;
      trackClusterLayer = L.geoJson(Geoposition, {
        style: trackStyle
      }).addTo(map);

      //console.log('clearTrack: ', trackClusterLayer);
      //console.log('Einde clearTrack');
    }
    //
    // Start recording in nieuwe track
    //
    function openTrack() {
      //console.warn('openTrack');

      //dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', '', '1');

      clearTrack();
      //
      // track registreren in DB get ID for connecting fotos to this track
      //
      dataFactoryTrack.enableSyncUp = false;

      currentTrackModel = new dataFactoryTrack.Model();
      currentTrackModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
      currentTrackModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
      currentTrackModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
      currentTrackModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
      var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
      currentTrackModel.set('avatarColor', tmp[0]);
      currentTrackModel.set('avatarLetter', tmp[1]);
      currentTrackModel.set('avatarInverse', tmp[2]);
      currentTrackModel.set('fotoId', '');
      currentTrackModel.set('poiId', '');
      currentTrackModel.set('trackId', '');
      currentTrackModel.set('extension', 'txt');
      currentTrackModel.set('xprive', true);
      currentTrackModel.set('lat', 0.0);
      currentTrackModel.set('lng', 0.0);

      //console.log('openTrack: ', dataFactoryTrack);

      currentTrackModel.save().then(
        function (currentTrackModel) {
          currentTrackId = currentTrackModel.get('Id');
          //dataFactoryFoto.tmpArray = [];
          //dataFactoryFoto.tmpArray.push(currentTrackId);

          //console.log('openTrack currentTrackId: ', currentTrackId);
          isOnMoveTracking = true;
        },
        function (err) {
          //console.error('openTrack save TrackModel ERROR: ', err);
          isOnMoveTracking = true;
        }
      );
    }
    /**
     * Registreer nieuwe locatie in track
     * @param  {String} lat latitude
     * @param  {String} lng longitude
     */

    function recordPosition(lng, lat) {
      var timestamp = dataFactoryAlive.getTimestamp();
      //console.log('recordPosition timestamp: ', timestamp);

      if (trackingDataIndex <= 4999) {
        //console.log('recordPosition trackingDataIndex: ', trackingDataIndex);
        Geometry.coordinates[trackingDataIndex] = new Array(2);
        Geometry.coordinates[trackingDataIndex][0] = lng;
        Geometry.coordinates[trackingDataIndex][1] = lat;
        Geometry.timestamp[trackingDataIndex] = timestamp;
        trackingDataIndex += 1;
        //console.log('[js] KaartCtrl recordPosition:  ' + lat + ',' + lng);
        //console.log('recordPosition: ' + trackingDataIndex + ' => ' + JSON.stringify(Geometry.coordinates[trackingDataIndex - 1]));
      } else {
        //console.error('KaartCtrl recordPosition max limiet bereikt');
      }
    }

    function closeTrackModel(trackNaam) {
      //console.warn('KaartCtrl closeTrack closeTrackModel');

      var lat;
      var lng;

      var firstCoordinate =
        Geoposition.features[0].geometry.coordinates[0];

      //console.log('CloseTrack onSelecteerTrack firstCoordinate: ', firstCoordinate);

      if (firstCoordinate) {
        if (firstCoordinate[1]) {
          lng =
            Math.round(firstCoordinate[0] * 10000000000) /
            10000000000;
        } else {
          lng = 0.0;
        }
        if (firstCoordinate[0]) {
          lat =
            Math.round(firstCoordinate[1] * 100000000) / 100000000;
        } else {
          lat = 0.0;
        }
      } else {
        lat = 0.0;
        lng = 0.0;
      }

      //console.log('CloseTrack closeTrack firstCoordinate, lat, lng: ', firstCoordinate, lat, lng);

      currentTrackModel.set('lat', lat);
      currentTrackModel.set('lng', lng);
      currentTrackModel.set('trackId', currentTrackModel.get('Id'));

      //console.log('CLoseTrack Tapped!', trackNaam);

      //		map.removeLayer(trackClusterLayer);
      if (centerMarker !== null) {
        map.removeLayer(centerMarker);
        //console.log('KaartCtrl closeTrackModel centerMarker verwijderd');
      }

      Geoposition.features[0].properties = {};
      Geoposition.features[0].properties.trackNaam = trackNaam;
      //
      // Track opslaan in FS met filenaam de Id
      // Daarna de track met FS naar de backend (indien internet)
      //
      //console.log('CloseTrack GeoPosition!', Geoposition);

      function saveTrackModel() {
        currentTrackModel.set('Id', currentTrackModel.set('Id'));
        currentTrackModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        currentTrackModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        currentTrackModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        currentTrackModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        currentTrackModel.set('avatarColor', tmp[0]);
        currentTrackModel.set('avatarLetter', tmp[1]);
        currentTrackModel.set('avatarInverse', tmp[2]);
        currentTrackModel.set('extension', 'txt');
        currentTrackModel.set('xprive', true);
        currentTrackModel.set('naam', trackNaam);
        currentTrackModel.set('up', false);

        dataFactoryTrack.enableSyncUp = true;

        currentTrackModel.save().then(function () {
          //console.log('KaartCtrl save trackModel SUCCESS');
        });
      }

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $ionicPlatform.ready(function () {
          dataFactorySyncFS.writeFSTrack(currentTrackModel.get('Id') + '.txt', JSON.stringify(Geoposition), true).then(function () {
            //console.log('KaartCtrl writeFSTrack SUCCESS');
            saveTrackModel();
          }, function (err) {
            //console.error('KaartCtrl writeFSTrack ERROR: ', err);
            saveTrackModel();
          });
        });
      } else {
        //console.error('KaartCtrl writeFSTrack and Upload ERROR NOT mobile');
      }
    }
    /**
     * Sluit track
     */
    function closeTrack() {
      //console.warn('KaartCtrl closeTrack: ' + trackingDataIndex);

      currentTrackId = '';
      dataFactoryFoto.tmpArray = [];

      geoRecording = false;
      isOnMoveTracking = false;

      if (trackingDataIndex > 2) {
        $scope.data = {};

        $ionicPopup.show({
          template: '<input type="text" ng-model="data.trackNaam">',
          title: 'Spoor opslaan',
          subTitle: 'Dit spoor heeft ' +
            trackingDataIndex +
            ' stappen<br><br>Geef dit spoor een naam',
          scope: $scope,
          buttons: [{
            text: 'Annuleer',
            onTap: function () {
              dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', 'abort', '1');
              if (trackClusterLayer) {
                map.removeLayer(trackClusterLayer);
                //console.warn('KaartCtrl closeTrack oude trackClusterLayer verwijderd');
              }

              if (centerMarker) {
                map.removeLayer(centerMarker);
                //console.warn('KaartCtrl closeTrack oude centerMarker verwijderd');
              }
            }
          },
          {
            text: '<b>Opslaan</b>',
            type: 'button-positive',
            onTap: function () {
              if (!$scope.data.trackNaam) {
                //console.log('KaartCtrl closeTrack ERROR: Geen trackNaam ingevoerd. currentTrackModel verwijderd: ', $scope.data.trackNaam);
                if (currentTrackModel) {
                  currentTrackModel.remove();
                }
                clearTrack();
                dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', 'finish', '1');

                return;
              } else {
                //console.warn('KaartCtrl  closeTrack onTap Save: ', $scope.data.trackNaam);

                closeTrackModel($scope.data.trackNaam);
                dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', 'finish', '1');

                return;
              }
            }
          }
          ]
        });
      } else {
        //console.log('stopWatchGeo EMPTY');

        if (currentTrackModel) {
          currentTrackModel.remove();
        }
        clearTrack();
        dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', 'abort', '1');
      }
    }

    /**
     * Stop GPS watching
     */

    $scope.stopWatchGeo = function () {
      //console.warn('stopWatchGeo watchGeoId: ', watchGeoId);
      if (centerMarker) {
        map.removeLayer(centerMarker);
        centerMarker = null;
        //console.log('KaartCtrl stopWatchGeo centerMarker verwijderd');
      }
      updateConfig('gpswatch', false);
      dataFactoryAnalytics.createEvent('kaarten', 'gpswatch', '', 'stop', '1');
      navigator.geolocation.clearWatch(watchGeoId);
      if (geoRecording) {
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          stopTracking();
        }
        //console.log('KaartCtrl RecordGeoStopping Id, aantal stappen: ' + trackingDataIndex);
        closeTrack();
        dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', 'stop', '1');
      }
    };
    /**
     * @method watchHandlerSuccess
     * Nieuwe locatie geconstateerd
     * @param  {Object} position [description]
     */
    function watchHandlerSuccess(position) {
      centerLatLng = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      );
      $scope.defaultLatLng = centerLatLng;
      //console.warn('WatchHandlerSuccess Update defaultLatLng: ', $scope.defaultLatLng);
      updateConfig('defaultLatLng', centerLatLng);

      //console.log('Watching location position, nieuw oud: ', position, centerLatLng, vorigeCenterLatLng);

      if (centerLatLng.lat !== vorigeCenterLatLng.lat || centerLatLng.lng !== vorigeCenterLatLng.lng) {
        if (geoRecording) {
          recordPosition(
            parseFloat(position.coords.longitude),
            parseFloat(position.coords.latitude)
          );

          if (trackClusterLayer) {
            map.removeLayer(trackClusterLayer);
          }
          trackClusterLayer = L.geoJson(Geoposition, {
            style: trackStyle
          }).addTo(map);
        }

        map.removeLayer(centerMarker);

        var pulsingIcon;

        if (geoRecording) {
          pulsingIcon = L.icon.pulse({
            iconSize: [20, 20],
            color: 'red'
          });
        } else {
          pulsingIcon = L.icon.pulse({
            iconSize: [20, 20],
            color: 'green'
          });
        }
        centerMarker = L.marker(centerLatLng, {
          icon: pulsingIcon
        });

        /*
      var lon2 = vorigeCenterLatLng.lng;
      var lon1 = centerLatLng.lng;
      var lat2 = vorigeCenterLatLng.lat;
      var lat1 = centerLatLng.lat;
      var dLon = lon2 - lon1;
      var f = 1 / 298.257223563;
      var b = (1 - f) * (1 - f);
      var tanLat2 = Math.tan(lat2);
      var y = Math.sin(dLon);
      var x;
    if (lat1 === 0) {
            x = b * tanLat2;
    } else {
    var a = f * (2 - f);
          var tanLat1 = Math.tan(lat1);
          var c = 1 + b * tanLat2 * tanLat2;
          var d = 1 + b * tanLat1 * tanLat1;
          var t = b * Math.tan(lat2) / Math.tan(lat1) + a * Math.sqrt(c / d);
          x = (t - Math.cos(dLon)) * Math.sin(lat1);
      }
      var angle = Math.atan2(y, x) * 180 / Math.PI;
      centerMarker.options.angle = angle + 225;
    */
        map.addLayer(centerMarker);
        if (dataFactoryInstellingen.gpsVolgen) {
          //console.error('KaartCtrl gpsVolgen volgen (with setView)');

          map.setView(centerLatLng);
        } else {
          //console.error('KaartCtrl gpsVolgen NIET volgen (no setView)');
        }
        $scope.LatLng =
          parseFloat(
            Math.round(
              parseFloat(position.coords.latitude) *
              Math.pow(10, 4)
            ) / Math.pow(10, 4)
          ) +
          ' - ' +
          parseFloat(
            Math.round(
              parseFloat(position.coords.longitude) *
              Math.pow(10, 6)
            ) / Math.pow(10, 6)
          );
        //console.log('Nieuwe position: ' + position.coords.latitude + ' => ' + position.coords.longitude);
        vorigeCenterLatLng = centerLatLng;
      }
    }
    /**
     * Fout tijdens GPS watching geconstateerd
     * @param  {Object} error foutmedling
     */
    function watchHandlerError(error) {
      //console.warn('watchHandlerError: ' + JSON.stringify(error));

      switch (error.code) {
        case error.PERMISSION_DENIED:
          $scope.loading = $ionicLoading.show({
            template: 'Gebruiker staat niet toe dat huidige locatie wordt gedeeld'
          });
          break;

        case error.POSITION_UNAVAILABLE:
          $scope.loading = $ionicLoading.show({
            template: 'Bepalen huidige huidige locatie niet mogelijk'
          });
          break;

        case error.TIMEOUT:
          $scope.loading = $ionicLoading.show({
            template: 'Bepalen huidige locatie time out'
          });
          break;

        default:
          $scope.loading = $ionicLoading.show({
            template: 'Bepalen huidige locatie onbekende fout:<br>' +
              error.code
          });
          break;
      }
      $timeout(function () {
        if (!dataFactoryDropbox.updating) {
          $ionicLoading.hide();
        }
      }, 1000);
    }
    /**
     * Huidige locatie bepalen
     * @param  {Object} position huidige locatie
     */
    function successHandler(position) {
      //console.log('startWatchGeo: ' + JSON.stringify(position.coords.latitude));

      centerLatLng = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      );

      $scope.defaultLatLng = centerLatLng;
      if (dataFactoryInstellingen.gpsVolgen) {
        if (map) {
          map.flyTo(centerLatLng, +map.getZoom(), {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.25,
            noMovestart: true
          });
        }
      }

      vorigeCenterLatLng = centerLatLng;

      //console.log('centerLatLng: ', centerLatLng);
      //console.log('vorigeCenterLatLng: ', vorigeCenterLatLng);

      if (centerMarker) {
        map.removeLayer(centerMarker);
      }

      var pulsingIcon = L.icon.pulse({
        iconSize: [20, 20],
        color: 'green'
      });
      centerMarker = L.marker(centerLatLng, {
        icon: pulsingIcon
      });
      /*
    centerMarker.options.angle = 225;
    */

      map.addLayer(centerMarker);

      /*
       * We gaan nu volgen. Ook indien de gegevens niet worden vastgelegd
       */

      watchGeoId = navigator.geolocation.watchPosition(
        watchHandlerSuccess,
        watchHandlerError, {
        timeout: 15000,
        frequency: 300,
        maximumAge: 0,
        enableHighAccuracy: dataFactoryInstellingen.gpsEnableHighAccuracy || true
      }
      );

      if ($scope.gpsRecord) {
        bgConfigure();
        //			startTracking();
      }
      /*
       * Tijdens het verwerken van een geplaatste marker tijdelijk geolocationMarker plaatsen
       * omdat de marker nog niet geplaatst wordt door een poi
       * Pas als de poi is toegevoegd aan pois kan de geolocationMarker weer verwijderd worden
       */
      if (geolocationMarker) {
        map.addLayer(geolocationMarker);
      }
    }

    function errorHandlerTekst(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return 'User denied the request for Geolocation.';
        //break;
        case error.POSITION_UNAVAILABLE:
          return 'Location information is unavailable.';
        //break;
        case error.TIMEOUT:
          return 'The request to get user location timed out.';
        //break;
        case error.UNKNOWN_ERROR:
          return 'An unknown error occurred.';
        //break;
      }
    }
    /**
     * Fout geconstateerd tijdens bepalen huidige positie
     */
    function errorHandler(err) {
      //console.error('centerOnMe err: ', err);

      $scope.LatLng = centerLatLng;
      $scope.loading = $ionicLoading.show({
        template: 'Kan huidige locatie niet bepalen<br>' + errorHandlerTekst(err),
        duration: 2000
      });
    }
    /**
     * Start GPS watching
     */

    $scope.startWatchGeo = function () {
      cancelStayTimer();
      /*
    function init() {
    
        // Check for Geolocation API permissions
        navigator.permissions.query({ name: 'geolocation' }).then(function (p) {
          updatePermission('geolocation', p.state);
    
          p.onchange = function () {
            updatePermission('geolocation', this.state);
          };
        });
    
      // Check for Notifications API permissions
    navigator.permissions.query({name: 'notifications' }).then(function (p) {
        updatePermission('notifications', p.state);
    p.onchange = function () {
        updatePermission('notifications', this.state);
    };
    });
    
    }
    
    function getPosPermisssion() {
        navigator.geolocation.getCurrentPosition(function (position) {
          log('Geolocation permissions granted');
          log('Latitude:' + position.coords.latitude);
          log('Longitude:' + position.coords.longitude);
        });
    };
    
    init();
    getPosPermisssion();
    
    navigator.permissions.query({name: 'push', userVisibleOnly: true });
    
    Notification.requestPermission(function (result) {
    if (result === 'denied') {
    //console.log('Permission wasn\'t granted. Allow a retry.');
    return;
    } else if (result === 'default') {
    //console.log('The permission request was dismissed.');
    return;
    }
    //console.log('Permission was granted for notifications');
    });
    */

      if (dataFactoryConfig.currentModel.get('snelMenuPos') === 'l') {
        if ($scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('KaartCtrl timer CANCEL en toggleSnelMenu links GESLOTEN');
          $scope.closeModalKaartOptiesSmL();
        }
      } else {
        if ($scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('KaartCtrl timer CANCEL en toggleSnelMenu rechts GESLOTEN');
          $scope.closeModalKaartOptiesSmR();
        }
      }

      var geoLocationOptions = {
        enableHighAccuracy: true,
        //enableHighAccuracy:
        //dataFactoryInstellingen.gpsEnableHighAccuracy,
        timeout: 15000,
        maximumAge: 0
      };

      //console.log('KaartCtrl startWatchGeo geoLocationOptions: ', geoLocationOptions);

      //if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      if (navigator.geolocation) {
        //console.warn('startWatchGeo');
        //		updateConfig('gpswatch', true);

        navigator.geolocation.getCurrentPosition(
          successHandler,
          errorHandler,
          geoLocationOptions
        );

        if ($scope.gpsRecord) {
          //console.log('startWatchEnRecordGeo');
          geoRecording = true;

          $timeout(function () {
            $ionicPopup.confirm({
              title: 'Registreren spoor',
              content: 'Klik nu Start registeren indien je werkelijk wil starten met het registreren van een spoor',
              buttons: [{
                text: 'Annuleer'
              },
              {
                text: '<b>Start registreren</b>',
                type: 'button-positive',
                onTap: function () {
                  //console.warn('startWatchGeo store: ', dataFactoryTrack);
                  openTrack();
                  //navigator.geolocation.getCurrentPosition(successHandler, errorHandler, geoLocationOptions);

                  if ($scope.gpsRecord) {
                    bgConfigure();
                    //									startTracking();
                  }
                }
              }
              ]
            });
          }, 1000);
        }
      }
    };
    /**
     * Verander de transparantie
     */
    function setOpacity(val) {
      lastOpacity = +val;

      if (val === 0) {
        val = 0.01;
      }

      //console.warn('setOpacity: ', +val, +dataFactoryInstellingen.minOpacity);

      // Van a naar b
      //
      // Stel a heeft 50
      //
      // Bereken perc van val in a (0-100) = 0.5
      // Vermenigvuldig met aantal punten in b  (bv 25-100 = 75) maal 0.5 = 37.5
      // Tel op de minwaarde 37.5 + 25 = 62.5
      //
      // Stel a  heeft 10
      //
      // perc in a (0-100) = 0.1
      // Vermenigvuldig met aantal punten in b  (bv 25-100 = 75) maal 0.1 = 7.5
      // Tel op de minwaarde 7.5 + 25 = 32.5
      //
      // Stel a  heeft 0
      //
      // perc in a (0-100) = 0
      // Vermenigvuldig met aantal punten in b  (bv 25-100 = 75) maal 0 = 0
      // Tel op de minwaarde 0 + 25 = 25
      //
      // Stel a  heeft 100
      //
      // perc in a (0-100) = 1
      // Vermenigvuldig met aantal punten in b  (bv 25-100 = 75) maal 1 = 75
      // Tel op de minwaarde 75 + 25 = 100
      //
      // Van b naar a
      //
      // Stel b heeft 62.5
      //
      // Trek af minwaarde (62.5 - 25) = 37.5
      // deel door de range 37.5 / 75 = 0.5
      // a = 100 * 0.5 = 50
      //
      var o1 = dataFactoryInstellingen.minOpacity / 100;
      $scope.range =
        o1 +
        parseFloat(
          Math.round(parseFloat(val / 100) * Math.pow(10, 2)) /
          Math.pow(10, 2)
        ) *
        (1 - o1);
      $scope.oLevel = parseInt($scope.range * 100, 10);

      //console.warn('KaartCtrl setOpacity val, dataFactoryInstellingen.minOpacity, o1, range, oLevel: ', +val, +dataFactoryInstellingen.minOpacity, +o1, +$scope.range, $scope.oLevel);
      //console.log($scope.configKaartVerledenItems);
      //console.log($scope.configKaartThemaItems);

      loDash.each($scope.configKaartVerledenItems, function (
        configKaartVerledenItem
      ) {
        //console.log(configKaartVerledenItem.naam);
        dataFactoryMap.map[configKaartVerledenItem.index].setOpacity(
          +$scope.range
        );
      });

      loDash.each($scope.configKaartThemaItems, function (
        configKaartThemaItem
      ) {
        //console.log(configKaartThemaItem.naam);

        dataFactoryMap.map[configKaartThemaItem.index].setOpacity(
          +$scope.range
        );
      });

      //      var lock = false;
      if (configParameterInit) {
        if (lockTimeout) {
          clearTimeout(lockTimeout);
        }
        lockTimeout = setTimeout(function () {
          //          lock = false;
          updateConfig('opacity', +lastOpacity);
          //console.warn('KaartCtrl Analytics opacity: ', +lastOpacity);
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'opacity',
            +lastOpacity,
            'start',
            '1'
          );
        }, 300);

        //        lock = true;
      }
    }
    /**
     * @method startPrecache
     * Laad alle tiles op huidige locaties van aangegeven kaarten in cache
     */

    $scope.togglePreCache = function () {
      //console.warn('togglePreCache');

      if (!preCacheRunning) {
        preCacheRunning = true;
        startPreCache();
      } else {
        preCacheRunning = false;
        stopPreCache();
      }
    };

    function stopPreCache() {
      //console.warn('stopPreCache');

      urls = [];
      loadUrls = [];
      $scope.preLoadingState = 'cancel';
      $timeout(function () {
        progressPreCache.animate(
          '', {
          duration: 1000
        },
          function () {
            progressPreCache.setText('');
          }
        );
      }, 1000);
      $timeout(function () {
        $scope.preLoadingState = 'starting';
        //console.log('Pre-caching finished');
        loDash.each($scope.precache_options.maps, function (option) {
          option.enable = false;
        });
        return;
      }, 4000);
    }

    function startPreCache() {
      //console.warn('startPreCache');

      urls = [];
      loadUrls = [];

      $scope.preLoadingState = 'counting';
      $scope.aantal_tiles = 0;

      if (
        window.matchMedia('only screen and (max-width : 599px)').matches
      ) {
        $timeout(function () {
          $ionicScrollDelegate
            .$getByHandle('modalPreCache')
            .scrollTop(true);
          //console.log('startPreCache with progressPreCacheModal');
        }, 50);
        if (progressPreCache === null) {
          progressPreCache = new ProgressBar.Circle(
            document.getElementById('progressPreCacheModal'), {
            color: '#aa2017',
            strokeWidth: 10,
            text: {
              value: ''
            },
            step: function (state, bar) {
              bar.setText(
                (bar.value() * 100).toFixed(0) + '%'
              );
            }
          }
          );
        }
      } else {
        //console.log('startPreCache with progressPreCachePopover');
        $timeout(function () {

          $ionicScrollDelegate
            .$getByHandle('popoverPreCache')
            .scrollTop(true);
        }, 50);

        if (progressPreCache === null) {
          progressPreCache = new ProgressBar.Circle(
            document.getElementById('progressPreCachePopover'), {
            color: '#aa2017',
            strokeWidth: 10,
            text: {
              value: ''
            },
            step: function (state, bar) {
              bar.setText(
                (bar.value() * 100).toFixed(0) + '%'
              );
            }
          }
          );
        }
      }

      //Given a list of mapIDs, a central lat/lng, and zoomLimit/radius options
      //generate the urls for the pyramid of tiles for zoom levels minZoom - maxZoom

      //radius is how many tiles from the center at zoomLimit
      //(by default
      //	zooms 3-14 have radius of 1.
      //	15 has radius 2
      //	16 has radius 4.
      //	17 has radius 8
      //)
      var lat = parseFloat(
        Math.round(parseFloat(map.getCenter().lat) * Math.pow(10, 8)) /
        Math.pow(10, 8)
      );
      var lon = parseFloat(
        Math.round(parseFloat(map.getCenter().lng) * Math.pow(10, 8)) /
        Math.pow(10, 8)
      );
      var mapLen = $scope.precache_options.maps.length - 1;

      progressPreCache.setText('');

      //console.log('preCache lat: ' + lat);
      //console.log('preCache lon: ' + lon);
      //console.log('preCache maps: ', $scope.precache_options.maps);
      //console.log('preCache mapLen: ', mapLen);

      //declare vars outside of loop
      /*
       * Create an Array with all the urls to preload
       *
       * result: Array urls
       */
      urls = [];
      loadUrls = [];
      var zoom, t_x, t_y, r, x, y;

      for (var i = 0; i <= mapLen; i++) {
        //iterate over map ids
        if ($scope.precache_options.maps[i].enable) {
          var cacheFolder =
            $scope.precache_options.maps[i].cacheFolder;
          var url = $scope.precache_options.maps[i].url;
          var zoomLimit = 19;
          var minZoom = $scope.precache_options.maps[i].minZoom;
          var maxZoom = $scope.precache_options.maps[i].maxZoom;
          var radius = 1;

          //console.log('preCache cacheFolder: ' + cacheFolder);
          //console.log('preCache url: ' + url);
          //console.log('preCache zoomLimit: ' + zoomLimit);
          //console.log('preCache minZoom: ' + minZoom);
          //console.log('preCache maxZoom: ' + maxZoom);
          //console.log('preCache radius: ' + radius);
          //console.log('preCache hostStr: ' + hostStr);
          //console.log('preCache to: ' + cacheFolder.replace(hostStr, ''));
          //#############
          //				$scope.allowPreCache = true;

          //console.error('$scope.allowPreCache: ', $scope.allowPreCache);

          maxZoom = Math.min(maxZoom, 15);

          for (zoom = minZoom; zoom <= maxZoom; zoom++) {
            //iterate over zoom levels
            t_x = long2tile(lon, zoom);
            t_y = lat2tile(lat, zoom);
            r = radius * Math.pow(2, Math.max(zoom, zoomLimit) - zoomLimit);
            //console.error('$scope.preCache aantal mappen: ', r);
            if (zoom === 8) {
              r = 1;
            }
            if (zoom === 9) {
              r = 1;
            }
            if (zoom === 10) {
              r = 1;
            }
            if (zoom === 11) {
              r = 1;
            }
            if (zoom === 12) {
              r = 1;
            }
            if (zoom === 13) {
              r = 1;
            }
            if (zoom === 14) {
              r = 1;
            }
            if (zoom === 15) {
              r = 2;
            }
            if (zoom === 16) {
              r = 4;
            }
            if (zoom === 17) {
              r = 8;
            }
            if (zoom === 18) {
              r = 16;
            }
            if (zoom === 19) {
              r = 32;
            }
            //					if (zoom === 19) {
            //						r = 32;
            //					}
            //console.error('preCache + zoom, zoomLimit: ', zoom, zoomLimit);
            //console.error('preCache + 2 kwdraat van: ', Math.max(zoom, zoomLimit) - zoomLimit);
            //console.error('preCache + 2 kwadraat: ', Math.pow(2, Math.max(zoom, zoomLimit) - zoomLimit));
            //console.error('$scope.preCache aantal mappen zoom: ', zoom, r);
            for (x = t_x - r; x <= t_x + r; x++) {
              //iterate over x's
              //console.error('$scope.preCache x: ', x);
              for (y = t_y - r; y <= t_y + r; y++) {
                //iterate over y's
                //console.error('$scope.preCache y: ', y);
                var to = tile2url(
                  'tiles/' + cacheFolder.replace(hostStr, ''),
                  zoom,
                  x,
                  y
                ).replace(hostStr, '');
                var obj = {
                  from: url,
                  to: to
                };
                urls.push(obj);
                //console.log('preCache pushed: ', obj);
              }
            }
          }
        }
      }
      //console.log('StartPrecache Aantal urls: ' + urls.length);
      loadUrls = [];
      if (urls.length > 0) {
        //console.warn('cleanUrls');
        cleanUrls(urls, 0);
      } else {
        //console.warn('StartPrecache download completed');
        $scope.preLoadingState = 'ready';
        preCacheRunning = false;
        $timeout(function () {
          //console.log('StartPrecach finished');
          $scope.preLoadingState = 'starting';
          loDash.each(
            $scope.precache_options.maps,
            function (option) {
              option.enable = false;
            }
          );
          $scope.preLoadingState = '';
          return;
        }, 4000);
      }

    }
    /**
     * @method clearUrls
     * Wis alle padnamen in tabel urls die niet nodig zijn
     * @param  {Array} urls  [description]
     * @param  {Number} index [description]
     */
    function cleanUrls(urls, index) {

      if (index >= urls.length) {
        //console.log('Aantal urls after cleanUrls: ', loadUrls.length);
        $scope.aantal_tiles = loadUrls.length + 1;
        if (loadUrls.length > 0) {
          $scope.preLoadingState = 'downloading';
          //console.warn('downloadUrls');
          downloadUrls(loadUrls, 0);
          return;
        } else {
          //console.warn('download completed');
          $scope.preLoadingState = 'ready';
          preCacheRunning = false;
          $timeout(function () {
            $scope.preLoadingState = 'starting';
            //console.log('cleanUrls finished');
            loDash.each(
              $scope.precache_options.maps,
              function (option) {
                option.enable = false;
              }
            );
            return;
          }, 4000);
          return;
        }
      } else {
        clientPath = urls[index].to.replace(hostStr, '');
        //console.log('cleanUrls clientPath: ', clientPath);
        $cordovaFile.checkFile(trinlFileDir, clientPath).then(
          function () {
            //console.log(trinlFileDir + clientPath + ' reeds in clientCache: ');
            cleanUrls(urls, index + 1);
          },
          function () {
            //console.log(trinlFileDir + clientPath + ' NIET in clientCache');
            loadUrls.push(urls[index]);
            cleanUrls(urls, index + 1);
          }
        );
      }
    }

    /**
     * @method downloadUrls
     * [downloadUrls description]
     * @param  {Array} urls  [description]
     * @param  {Number} index [description]
     */

    function downloadUrls(urls, index) {
      if (preCacheRunning) {
        if (urls.length <= index) {
          $timeout(function () {
            progressPreCache.animate(
              1, {
              duration: 200
            },
              function () {
                if (index >= urls.length) {
                  $scope.preLoadingState = 'ready';
                  preCacheRunning = false;
                  $timeout(function () {
                    progressPreCache.animate(
                      '', {
                      duration: 1000
                    },
                      function () {
                        progressPreCache.setText('');
                      }
                    );
                  }, 1000);
                  $timeout(function () {
                    $scope.preLoadingState = 'starting';
                    //console.log('DownloadUrls finished');
                    loDash.each(
                      $scope.precache_options.maps,
                      function (option) {
                        option.enable = false;
                      }
                    );
                    return;
                  }, 4000);
                }
              }
            );
          }, 1000);
        } else {
          $scope.aantal_tiles = $scope.aantal_tiles - 1;
          progressPreCache.animate(
            index / (urls.length + 0.8).toFixed(2)
          );
        }

        if (index < urls.length) {
          hostPath = urls[index].from.replace(
            '{s}',
            loDash.sample(['a', 'b', 'c'])
          );
          //console.log('(PRE)Dwonload hostPath: ', hostPath);
          clientPath = trinlFileDir + urls[index].to;
          var clientImg = clientPath.substr(
            nthLastIndex(clientPath, '/', 3) + 1
          );
          hostPath = hostPath.replace('{z}/{x}/{y}.png', clientImg);

          //console.log('DownLoadUrls hostPath, clientPath: ', hostPath, clientPath);

          $cordovaFileTransfer
            .download(
              hostPath,
              clientPath,
              fileTransferOptions,
              true
            )
            .then(
              function () {
                //console.log('(PRE)Download success: ', hostPath + ' => ' + clientPath);

                downloadUrls(urls, index + 1);
              },
              function (err) {
                //console.error('(PRE)Download ERROR: ', hostPath + ' => ' + clientPath, err);
                if (err.code === 1 && err.http_status === 404) {
                  //console.error('(PRE)Download ERROR: ', err.code, err.http_status);
                  /*
                  $cordovaFileTransfer
                    .download(
                      L.Util.emptyImageUrl,
                      clientPath,
                      fileTransferOptions,
                      true
                    )
                    .then(function () { });
                  */
                }
                downloadUrls(urls, index + 1);
              }
            );
        }
      }
    }

    /**
     * @method tile2url
     * Bereken padnaam naar tile in een map
     * @param  {String} mapID mapnaam
     * @param  {Number} zoom  zoomlevel
     * @param  {String} x     x-waarde vantile
     * @param  {String} y     y-waarde van tile
     * @return {String}       padnaam
     */

    function tile2url(mapID, zoom, x, y) {
      //  Given a mapID, zoom, tile_x, and tile_y,
      //  return the url of that tile
      //
      return urlBase + mapID + '/' + zoom + '/' + x + '/' + y + '.png';
    }

    /**
     * Padnaam naar de server
     * @type {String}
     */
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

    //console.log('KaartCtrl urlBase: ', urlBase);

    var hostStr = urlBase;
    /**
     * @method $ionicPLatform
     * Wacht totdat Ionic (en ngCordova) zijn opgestart
     * Sluit de splashscreen
     * Bepaal de appVersion en plaats appVersion in Ceo model
     */
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid()) {
        trinlFileDir = cordova.file.externalDataDirectory;
      }
      if (ionic.Platform.isIOS()) {
        trinlFileDir = cordova.file.documentsDirectory;
      }
      /*
       * Indien hardware backbutton wordt geactiveerd
       * Indien de app op de homepage (Kaart) wordt de app gestoppd. Eerst wordt met een popup navraag gedaan of dit de bedoeling is.
       */
      if (ionic.Platform.isAndroid()) {
        $ionicPlatform.registerBackButtonAction(function () {
          //console.log('registerBackButtonAction: ', $state.current.name);
          if ($state.current.name === 'app.kaart') {
            var scope = {};
            scope.popup = {};
            var poiPopup = $ionicPopup.show({
              template: 'Wil je TRINL stoppen?',
              title: 'TRINL stoppen',
              scope: $scope,
              buttons: [{
                text: 'Annuleer',
                onTap: function () {
                  scope.popup.action = 'Annuleer';
                  return scope.popup;
                }
              },
              {
                text: '<b>Stoppen</b>',
                type: 'button-positive',
                onTap: function () {
                  scope.popup.action = 'Stoppen';
                  return scope.popup;
                }
              }
              ]
            });
            poiPopup.then(function (data) {
              if (data.action === 'Stoppen') {
                dataFactoryAnalytics.createEvent(
                  'trinl',
                  'app',
                  'backbutton',
                  '',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'kaarten',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'berichten',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'locaties',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'fotos',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'sporen',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'hofdmenu',
                  'stop',
                  '0'
                );
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'sessie',
                  'help',
                  'stop',
                  '0'
                );
                ionic.Platform.exitApp();
              }
            });
          } else {
            $ionicSideMenuDelegate.toggleLeft();
            //console.log('KaartCtrl regeisterBackButtonAction in state: ' + $state.current.name);
          }
        }, 101);
      }
    }, false);

    /*
    var noHash;
    var noHashPopup;
    $rootScope.$on('noHash', function() {
    if (!noHash) {
          //console.error('KaartCtrl $on.noHash: ');
          noHash = true;
    
    $scope.data = {};
    noHashPopup = $ionicPopup.show({
          template: 'Schakel internet in om gegevens definitief te bewaren',
        title: 'Offline',
        subTitle: 'Geen internet beschikbaar',
        scope: $scope,
    buttons: [{
          text: 'Offline'
    }, {
          text: '<b>Opnieuw</b>',
        type: 'button-positive',
    onTap: function(e) {
          $scope.data.action = 'opnieuw';
    //console.log('KaartCtrl noHashPopup: ', $scope.data);
          return $scope.data.action;
      }
    }]
    });
    
    noHashPopup.then(function(data) {
          //console.log('Tapped!', data);
          $rootScope.$emit('noHash2');
            });
        }
    });
    */

    /**
     * =====================================================================================================================================
     *
     * $scope variabelen
     *
     * =====================================================================================================================================
     */
    $scope.fotoSelected = dataFactoryFoto.selected;
    $scope.poiSelected = dataFactoryPoi.selected;
    $scope.trackSelected = dataFactoryTrack.selected;

    $scope.overlay = [];
    $scope.mijnOverlay = [];
    $scope.configMijnOverlays = [];

    $scope.provinciegrens = false;
    $scope.gemeentegrenzen = false;
    $scope.water = false;
    $scope.oppervlaktewater = false;
    $scope.hoogtelijnen = false;
    $scope.plaatsnamen = false;
    $scope.achterban = false;
    $scope.track = true;
    $scope.poi = true;
    $scope.foto = true;
    $scope.gpsWatch = false;
    $scope.gpsRecord = false;
    $scope.zoomLevel = {
      value: 8
    };

    $scope.notify = false;
    var contactAantal = 0;
    var reactieAantal = 0;
    $scope.notificationAantal = contactAantal + reactieAantal;
    $scope.notify = false;
    $scope.isMobile = false;
    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      $scope.isMobile = true;
    }

    /**
     * Ceo store
     * @type {Object}
     */
    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profiel = dataFactoryCeo.currentModel.get('profiel');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');
    //console.log('KaartCtrl ceo.profielId, ceo.Id: ', $scope.ceo.profielId, $scope.ceo.Id);
    /**
     * Actuele kaart
     * @type {Number} index
     */
    $scope.currentNietHedenKaartIndex = -1;
    var lastNietHedenKaartIndex = 0;
    /**
     * Viewport innerwidth
     * @type {Object}
     */
    $scope.viewport = window.innerWidth;
    $scope.possnelmenu = $scope.viewport - 50;
    /**
     * [overlaysReadyNr description]
     * @type {Number}
     */
    $scope.overlaysReadyNr = 0;

    $scope.currentHedenKaartIndex = 0;
    /**
     * ======================================================================================================================================
     *
     * Modals
     *
     * ======================================================================================================================================
     */
    function prepareModals1() {
      //console.warn('prepareModals1');
      //
      // Legenda Generiek
      //
      $ionicModal.fromTemplateUrl(
        'legendaModal.html',
        function (modalLegenda) {
          $scope.modalLegenda = modalLegenda;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );

      $scope.openModalLegenda = function () {
        $scope.modalLegenda.show();
      };

      $scope.closeModalLegenda = function () {
        $scope.modalLegenda.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modalLegenda.remove();
      });

      $ionicPopover
        .fromTemplateUrl('legendaPopover.html', {
          scope: $scope
        })
        .then(function (popoverLegenda) {
          $scope.popoverLegenda = popoverLegenda;
        });
      $scope.openPopoverLegenda = function (event) {
        $scope.popoverLegenda.show(event);
      };
      $scope.closePopoverLegenda = function () {
        $scope.popoverLegenda.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverLegenda.remove();
      });
      //
      // Modal Vooraf laden
      //
      $ionicModal.fromTemplateUrl(
        'preCacheModal.html',
        function (modalPreCache) {
          //console.warn('KaartCtrl modalPreCache: ', modalPreCache);
          $scope.ModalPreCache = modalPreCache;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      $scope.openModalPreCache = function () {
        $scope.ModalPreCache.show();
      };
      $scope.closeModalPreCache = function () {
        $scope.ModalPreCache.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.ModalPreCache.remove();
      });

      $ionicModal.fromTemplateUrl(
        'preCacheModal.html',
        function (modalPreCache) {
          $scope.ModalPreCache = modalPreCache;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      $scope.openModalFullScreenPreCache = function () {
        $scope.ModalFullScreenPreCache.show();
      };
      $scope.closeModalFullScreenPreCache = function () {
        $scope.ModalFullScreenPreCache.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.ModalFullScreenPreCache.remove();
      });

      $ionicPopover
        .fromTemplateUrl('preCachePopover.html', {
          scope: $scope
        })
        .then(function (popoverPreCache) {
          $scope.popoverPreCache = popoverPreCache;
        });

      $scope.openPopoverPreCache = function (event) {
        $scope.popoverPreCache.show(event);
      };
      $scope.closePopoverPreCache = function () {
        $scope.popoverPreCache.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverPreCache.remove();
      });

      $scope.openPreCache = function (event) {
        $scope.preLoadingState = 'starting';

        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalPreCache();
        } else {
          $scope.openPopoverPreCache(event);
        }
      };
      //
      // Modal lagen
      //
      $ionicModal.fromTemplateUrl(
        'lagenModal.html',
        function (modalLagen) {
          $scope.modalLagen = modalLagen;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      $scope.openModalLagen = function () {
        $scope.modalLagen.show();
      };
      $scope.closeModalLagen = function () {
        $scope.modalLagen.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modalLagen.remove();
      });

      $ionicPopover
        .fromTemplateUrl('lagenPopover.html', {
          scope: $scope
        })
        .then(function (popoverLagen) {
          $scope.popoverLagen = popoverLagen;
        });
      $scope.openPopoverLagen = function (event) {
        $scope.popoverLagen.show(event);
      };
      $scope.closePopoverLagen = function () {
        $scope.popoverLagen.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverLagen.remove();
      });
      //
      // Modal KaartOpties
      //
      $ionicModal.fromTemplateUrl(
        'kaartOptiesModal.html',
        function (modalKaartOpties) {
          $scope.modalKaartOpties = modalKaartOpties;
        }, {
        scope: $scope
      }
      );
      $scope.openModalKaartOpties = function () {
        modalKaartOpties = true;
        $scope.modalKaartOpties.show();
      };
      $scope.closeModalKaartOpties = function () {
        return $scope.modalKaartOpties.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modalKaartOpties.remove();
      });

      $ionicPopover
        .fromTemplateUrl('kaartOptiesPopover.html', {
          scope: $scope
        })
        .then(function (popoverKaartOpties) {
          $scope.popoverKaartOpties = popoverKaartOpties;
        });
      $scope.openPopoverKaartOpties = function (event) {
        modalKaartOpties = false;

        $scope.popoverKaartOpties.show(event);
      };
      $scope.closePopoverKaartOpties = function () {
        return $scope.popoverKaartOpties.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverKaartOpties.remove();
      });

      //
      // Modal KaartOptiesSMLeft
      //
      $ionicModal
        .fromTemplateUrl('kaartOptiesSmModalL.html', {
          scope: $scope,
          animation: 'slide-in-left'
        })
        .then(
          function (modalKaartOptiesSmL) {
            $scope.modalKaartOptiesSmL = modalKaartOptiesSmL;
          }, {
          scope: $scope
        }
        );
      $scope.openModalKaartOptiesSmL = function () {
        $scope.modalKaartOptiesSmL.show();
      };
      $scope.closeModalKaartOptiesSmL = function () {
        $scope.modalKaartOptiesSmL.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modalKaartOptiesSmL.remove();
      });
      //console.log('KaartCtrl snelMenuPos links');

      //
      // Modal KaartOptiesSMRight
      //
      $ionicModal
        .fromTemplateUrl('kaartOptiesSmModalR.html', {
          scope: $scope,
          animation: 'slide-in-right'
        })
        .then(
          function (modalKaartOptiesSmR) {
            $scope.modalKaartOptiesSmR = modalKaartOptiesSmR;
          }, {
          scope: $scope
        }
        );
      $scope.openModalKaartOptiesSmR = function () {
        $scope.modalKaartOptiesSmR.show();
      };
      $scope.closeModalKaartOptiesSmR = function () {
        $scope.modalKaartOptiesSmR.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modalKaartOptiesSmR.remove();
      });
      //console.log('KaartCtrl snelMenuPos rechts');

      $scope.openLegendaModalPopover = function (event) {
        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalLegenda();
        } else {
          $scope.openPopoverLegenda(event);
        }
      };
      $scope.openLagen = function (event) {
        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalLagen();
        } else {
          $scope.openPopoverLagen(event);
        }
      };
    }

    function prepareModals2() {
      //console.warn('prepareModals2');
      //
      // Modal Over
      //
      $ionicModal.fromTemplateUrl(
        'overModal.html',
        function (modalOver) {
          //	//console.warn('KaartCtrl modalOver: ', modalOver);
          $scope.ModalOver = modalOver;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      /**
       * @method openModalOver
       * Open Modal Over
       */
      $scope.openModalOver = function () {
        //console.warn('KaartCtrl openModalOver');
        $scope.ModalOver.show();
      };
      /**
       * @method closeModalOver
       * Sluit Modal Over
       */
      $scope.closeModalOver = function () {
        //console.warn('KaartCtrl closeModalOver');
        $scope.ModalOver.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.ModalOver.remove();
      });
      //
      // Popover Over
      //
      $ionicPopover
        .fromTemplateUrl('overPopover.html', {
          scope: $scope
        })
        .then(function (popoverOver) {
          $scope.popoverOver = popoverOver;
        });
      $scope.openPopoverOver = function (event) {
        $scope.popoverOver.show(event);
      };
      $scope.closePopoverOver = function () {
        $scope.popoverOver.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverOver.remove();
      });
      //
      // Modal Disclaimer
      //
      $ionicModal.fromTemplateUrl(
        'disclaimerModal.html',
        function (modalDisclaimer) {
          $scope.ModalDisclaimer = modalDisclaimer;
        }, {
        scope: $scope,
        //			animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      /**
       * @method openModalDisclaimer
       * Open Modal Disclaimer
       */
      $scope.openModalDisclaimer = function () {
        //console.warn('KaartCtrl openModalDisclaimer');
        $scope.ModalDisclaimer.show();
      };
      /**
       * @method closeModalDisclaimer
       * Sluit Modal Disclaimer
       */
      $scope.closeModalDisclaimer = function () {
        //console.warn('KaartCtrl closeModalDisclaimer');
        $scope.ModalDisclaimer.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.ModalDisclaimer.remove();
      });
      //
      // Popover Disclaimer
      //
      $ionicPopover
        .fromTemplateUrl('disclaimerPopover.html', {
          scope: $scope
        })
        .then(function (popoverDisclaimer) {
          $scope.popoverDisclaimer = popoverDisclaimer;
        });
      $scope.openPopoverDisclaimer = function (event) {
        $scope.popoverDisclaimer.show(event);
      };
      $scope.closePopoverDisclaimer = function () {
        $scope.popoverDisclaimer.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverDisclaimer.remove();
      });
      //
      // Modal Help
      //
      $ionicModal.fromTemplateUrl(
        'helpModal.html',
        function (modalHelp) {
          $scope.ModalHelp = modalHelp;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      $scope.openModalHelp = function () {
        //			$scope.ModalHelp.show($event);
        $scope.ModalHelp.show();
      };
      $scope.closeModalHelp = function () {
        $scope.ModalHelp.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.ModalHelp.remove();
      });
      //
      // Popover help
      //
      $ionicPopover
        .fromTemplateUrl('helpPopover.html', {
          scope: $scope
        })
        .then(function (popoverHelp) {
          $scope.popoverHelp = popoverHelp;
        });
      $scope.openPopoverHelp = function (event) {
        $scope.popoverHelp.show(event);
      };
      $scope.closePopoverHelp = function () {
        $scope.popoverHelp.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popoverHelp.remove();
      });

      //
      // Modal SignIn
      //
      $ionicModal.fromTemplateUrl(
        'login/signInModal.html',
        function (modalSignIn) {
          $scope.ModalSignIn = modalSignIn;
        }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
      }
      );
      $scope.openModalSignIn = function () {
        //console.warn('KaartCtrl openModalSignIn');
        $ionicPlatform.ready(function () {
          if (
            (!ionic.Platform.isAndroid() &&
              !ionic.Platform.isIOS()) ||
            ($cordovaNetwork.isOnline() &&
              (ionic.Platform.isAndroid() ||
                ionic.Platform.isIOS()))
          ) {
            $scope.isOnline = true;
          } else {
            $scope.isOnline = false;
          }
          $scope.ModalSignIn.show();
        });
      };
      /**
       * @method closeModalSignIn
       * Sluit Modal SignIn
       */
      $scope.closeModalSignIn = function () {
        //console.warn('KaartCtrl closeModalSignIn');
        $scope.ModalSignIn.hide().then(function () {
          //console.warn('ModalSignIn hide finish');
        });
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.ModalSignIn.remove();
        //console.warn('KaartCtrl ModalSignIn is removed!');
      });
      /**
       * @method openKaartOpties
       * Open Modal of Popover voor KaartOpties (Kaartmenu)
       */
      $scope.openKaartOpties = function (event) {
        //console.log('openKaartOpties');
        $ionicPlatform.ready(function () {
          if (
            ((ionic.Platform.isAndroid() ||
              ionic.Platform.isIOS()) &&
              $cordovaNetwork.isOnline()) ||
            navigator.onLine === true
          ) {
            $scope.isOnline =
              ((ionic.Platform.isAndroid() ||
                ionic.Platform.isIOS()) &&
                $cordovaNetwork.isOnline()) ||
              navigator.onLine === true;
          } else {
            $scope.isOnline = false;
          }
          //console.log('ONLINE!!!: ', $scope.isOnline);
          if (
            window.matchMedia('only screen and (max-width : 599px)')
              .matches
          ) {
            //console.warn('openModalKaartOpties modal');
            $scope.openModalKaartOpties();
          } else {
            //console.warn('openKaartOpties popover: ', event);
            $scope.openPopoverKaartOpties(event);
          }
        });
      };
      /**
       * @method openOver
       * Open Modal of Popover voor Over
       */

      $scope.openOver = function (event) {
        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalOver();
        } else {
          $scope.openPopoverOver(event);
        }
      };
      /**
       * @method openDisclaimer
       * Open Modal of Popover voor Diclaimer
       */

      $scope.openDisclaimer = function (event) {
        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalDisclaimer();
        } else {
          $scope.openPopoverDisclaimer(event);
        }
      };
      /**
       * @method openHelp
       * Open Modal of Popover voor Help
       */
      $scope.openHelp = function (event) {
        if (
          window.matchMedia('only screen and (max-width : 599px)')
            .matches
        ) {
          $scope.openModalHelp();
        } else {
          $scope.openPopoverHelp(event);
        }
      };
    }

    /**
     * ==============================================================================================================================
     *
     *  $scope functions
     *
     * ==============================================================================================================================
     */
    /**
     * Schakel orientatieroos in of uit
     */
    $scope.toggleCrosshair = function () {
      //console.warn('KaartCtrl toggleCrossHair');

      restartStayTimer();
      //console.warn('toggleCrosshair: ' + $scope.crossHair);
      if ($scope.crossHair === true) {
        $scope.crossHair = false;
      } else {
        $scope.crossHair = true;
      }
      if (configUpdateAllowed && !isOnMoveTracking) {
        var bool = $scope.crossHair;
        var str = '0';
        if (bool) {
          str = '1';
        }
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'crosshair',
          '',
          '',
          str
        );
      }
      updateConfig('crossHair', $scope.crossHair);
    };

    /**
     * @method openSideMenu
     * Open Hoofdmenu
     */
    $scope.openSideMenu = function () {
      //console.warn('KaartCtrl openSideMenu');

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'sidemenu',
          '',
          '',
          '1'
        );
      }

      $ionicSideMenuDelegate.toggleLeft();
      $scope.snelMenuSluit();
    };
    //	var key = 'tiendelfmorgen';

    $scope.notification = function () {
      //console.warn('KaartCtrl notification');

      $state.go('contacts.contactsSortCreatedOnA');
    };

    /**
     * Open de aangeklikte legenda
     * @param  {Number} index legendanummer
     */
    $scope.openLegendaOverlay = function (index, $event) {
      //console.warn('KaartCtrl openLegendaOverlay');

      //console.log('currentNietHedenKaartIndex, currentHedenKaartIndex', index, $event, $scope.currentNietHedenKaartIndex, $scope.currentHedenKaartIndex);

      //		if (index === undefined || index === -1) {
      //			index = $scope.currentNietHedenKaartIndex;
      //			if ($scope.currentNietHedenKaartIndex === -1) {
      //				index = $scope.currentHedenKaartIndex;
      //			}
      //		}

      //console.log('KaartCtrl openlegendaOverlay index: ', index);

      //console.log('KaartCtrl openLegendaOverlay configOverlays: ', $scope.configOverlays);
      var overlay = loDash.find($scope.configOverlays, function (
        configOverlay
      ) {
        return configOverlay.index === index;
      });
      //console.log('KaartCtrl show KaartItems overlay: ', overlay);

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'legendalaag',
          overlay.naam,
          '',
          '1'
        );
      }

      if (overlay.legenda.length === undefined) {
        overlay.legenda = [];
      }

      $scope.legenda = {
        height: overlay.height,
        titel: overlay.menuNaam,
        naam: overlay.naam,
        naamKort: overlay.naamKort,
        bron: overlay.bron,
        toelichting: overlay.toelichting,
        legenda: overlay.legenda
      };

      //console.log('KaartCtrl show Overlays overlay: ', $scope.legenda, $event);

      $scope.openLegendaModalPopover($event);

      restartStayTimer();
    };
    /**
     * Open de aangeklikte legenda
     * @param  {Number} index legendanummer
     */
    $scope.openLegenda = function (index, $event) {
      //console.warn('KaartCtrl openLegenda');

      //console.log('currentNietHedenKaartIndex, currentHedenKaartIndex', index, $event, $scope.currentNietHedenKaartIndex, $scope.currentHedenKaartIndex);
      if (index === undefined || index === -1) {
        index = $scope.currentNietHedenKaartIndex;
        if ($scope.currentNietHedenKaartIndex === -1) {
          index = $scope.currentHedenKaartIndex;
        }
      }

      //console.log('KaartCtrl openlegenda index: ', index);

      //console.log('KaartCtrl openLegenda configKaartItems: ', $scope.configKaartItems);
      var kaart = loDash.find($scope.configKaartItems, function (
        configKaartItem
      ) {
        //console.log('KaartCtrl show KaartItems configKaartItem: ', configKaartItem);
        return configKaartItem.index === index;
      });
      //console.log('KaartCtrl show KaartItems kaart: ', kaart);
      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'legendakaart',
          kaart.naam,
          '',
          '1'
        );
      }

      if (kaart.legenda.length === undefined) {
        kaart.legenda = [];
        //		} else {
        //			index = 0;
        //			loDash.each(kaart.legenda, function(legendaItem) {
        //				legendaItem['index'] = index;
        //				index = index + 1;
        //			});
      }

      $scope.legenda = {
        height: kaart.height,
        titel: kaart.menuNaam,
        naam: kaart.naam,
        naamKort: kaart.naamKort,
        bron: kaart.bron,
        toelichting: kaart.toelichting,
        legenda: kaart.legenda
      };
      //console.log('KaartCtrl show KaartItems kaart: ', $scope.legenda, $event);

      $scope.openLegendaModalPopover($event);

      restartStayTimer();
    };
    /**
     * Maak een marker aan op de aangegeven locatie
     */
    $scope.plaatsMarker = function () {
      //console.warn('plaatsMarker');

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'plaatsmarker',
          '',
          'start',
          '1'
        );
      }

      cancelStayTimer();

      if (dataFactoryConfig.currentModel.get('snelMenuPos') === 'l') {
        if ($scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('KaartCtrl timer CANCEL en toggleSnelMenu GESLOTEN');
          $scope.closeModalKaartOptiesSmL();
        }
      } else {
        if ($scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('KaartCtrl timer CANCEL en toggleSnelMenu GESLOTEN');
          $scope.closeModalKaartOptiesSmR();
        }
      }
      /**
       * Toon een popup om gegevens aan te vullen
       * Deze functie moet blijven ondanks dat linter geen referentie vindt naar deze funtie
       * Deze functie wordt gecalled door plaatsMarker hierboven
       */
      var lat;
      var lng;

      function popupMarker() {
        $scope.data = {};

        var poiPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="data.poiNaam">',
          title: 'Locatie',
          subTitle: '<br><br>Geef deze locatie een naam.',
          scope: $scope,
          buttons: [{
            text: 'Annuleer',
            onTap: function () {
              $scope.data.action = 'Annuleer';
              return $scope.data;
            }
          },
          {
            text: '<b>Opslaan</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.poiNaam) {
                e.preventDefault();
              } else {
                $scope.data.action = 'Opslaan';
                return $scope.data;
              }
            }
          }
          ]
        });
        poiPopup.then(function (data) {
          if (data.action === 'Opslaan') {
            //console.log('Tapped! Opslaan');

            var poiModel = new dataFactoryPoi.Model();

            poiModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
            poiModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
            poiModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
            poiModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
            var tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
            poiModel.set('avatarColor', tmp[0]);
            poiModel.set('avatarLetter', tmp[1]);
            poiModel.set('avatarInverse', tmp[2]);
            poiModel.set('naam', data.poiNaam);
            poiModel.set('tekst', '');
            poiModel.set('lat', lat);
            poiModel.set('lng', lng);
            poiModel.set('fotoId', '');
            poiModel.set('poiId', '');
            poiModel.set('trackId', currentTrackId);
            poiModel.set('xprive', true);

            //console.log('KaartCtrl nieuwe poi: ', poiModel);

            poiModel.save().then(function (poiModel) {

              poiModel.xData = {
                tags: []
              };

              //console.log('KaartCtrl nieuwe poi SAVED: ', poiModel);

              dataFactoryPoi.currentModel = poiModel;

              var poiId = poiModel.get('Id');
              var poisupModel = new dataFactoryPoiSup.Model();
              poisupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
              poisupModel.set('poiId', poiId);
              poisupModel.set('xnew', false);

              poisupModel.save().then(function () {

              }, function (err) {
                //console.error('KaartCtr plaatsMarker save poisupModel ERROR: ', err);
              });

              $rootScope.$emit('poi', {
                operation: 'add',
                poiId: poiModel.get('Id')
              });
            }, function (err) {
              //console.error('KaartCtr plaatsMarker save poiModel ERROR: ', err);
            });

            var newPoi = [];
            newPoi.push(poiModel);
            dataFactoryPoi.selected = newPoi.concat(
              dataFactoryPoi.selected
            );
            addPois();
            //console.log('store dataFactoryPoi after save PopupMarker: ', dataFactoryPoi);
          } else {
            if (configUpdateAllowed && !isOnMoveTracking) {
              dataFactoryAnalytics.createEvent(
                'kaarten',
                'plaatsmarker',
                '',
                'abort',
                '1'
              );
            }
          }
          map.removeLayer(geolocationMarker);
        });
      }
      /*
       * Tijdens het verwerken van een geplaatste marker tijdelijk geolocationMarker plaatsen
       * omdat de marker nog niet geplaatst wordt door een poi
       * Pas als de poi is toegevoegd aan pois kan de geolocationMarker weer verwijderd worden
       */
      lat = map.getCenter().lat;
      lng = map.getCenter().lng;
      var latlng = L.latLng(lat, lng);
      var geolocationMarker = L.marker(latlng, {
        bounceOnAdd: true,
        bounceOnAddCallback: popupMarker,
        icon: poiIcon
      });
      map.addLayer(geolocationMarker);

      /*
       * De lyer is reeds de juiste layer
       */
    };

    $scope.overlayChange = function (overlay) {
      //console.log('KaartCtrl overlayChange dataFactoryInstellingen overlay: ', overlay);
      //console.log('KaartCtrl overlayChange dataFactoryInstellingen Elektriciteitsnetwerk: ', dataFactoryInstellingen.electriciteitsnetwerk);
      //console.log('KaartCtrl overlayChange dataFactoryInstellingen Elektriciteitsnetwerk: ', dataFactoryInstellingen.hoogtelijnen);
      //console.log('KaartCtrl overlayChange dataFactoryInstellingen Plaatsnamen: ', dataFactoryInstellingen.plaatsnamen);
      //console.log('KaartCtrl overlayChange naam, checked, index: ', overlay.naam, overlay.checked, overlay.index);

      if (OverlaysReady) {
        //console.warn('KaartCtrl overlayChange');

        if (dataFactoryOverlay.overlays[overlay.index]) {
          if (overlay.special) {
            //console.warn('KaartCtrl overlayChange overlay special: ', overlay.special);

            var zoomLevel = +$scope.zoomLevel.value;
            var tabelLevel = plaatsnamentabel[zoomLevel];
            currentPlaatsnaamLevel = tabelLevel;

            if ($scope.plaatsnamen === true) {
              //
              // Current plaatsnamen verwijderen
              //
              //console.log('KaartCtrl overlayChange plaatsnamen verwijderen level: ', currentPlaatsnaamLevel);

              if (currentPlaatsnaamLevel === 11) {
                //console.log('KaartCtrl overlayChange plaatsnamen OFF: ' + currentPlaatsnaamLevel);

                map.removeLayer(plaatsNaamMarkers);
                map.removeLayer(dataFactoryOverlay.overlays[currentPlaatsnaamLevel]);
                if (configUpdateAllowed && !isOnMoveTracking) {
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'plaatsnamen' + currentPlaatsnaamLevel, '', '0');
                }
              } else {
                //console.log('KaartCtrl overlayChange plaatsnamen OFF: ' + currentPlaatsnaamLevel);

                map.removeLayer(dataFactoryOverlay.overlays[currentPlaatsnaamLevel]);
                if (configUpdateAllowed && !isOnMoveTracking) {
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'plaatsnamen' + currentPlaatsnaamLevel, '', '0');
                }

                //console.log('KaartCtrl overlayChange plaatsnamen SINGLE OFF: ' + currentPlaatsnaamLevel);
              }

              overlay.checked = false;
              $scope.plaatsnamen = false;
              updateConfig('plaatsnamen', false);
            } else {
              //console.log('KaartCtrl overlayChange plaatsnamen toevoegen level: ', currentPlaatsnaamLevel);

              if (currentPlaatsnaamLevel === 11) {
                //console.log('KaartCtrl overlayChange plaatsnamen ON: ' + currentPlaatsnaamLevel);

                $scope.plaatsnamen = true;
                updatePlaatsnamenOverlay();
              } else {
                //console.log('KaartCtrl overlayChange plaatsnamen ON: ' + currentPlaatsnaamLevel);

                dataFactoryOverlay.overlays[
                  currentPlaatsnaamLevel
                ].addTo(map);
                if (configUpdateAllowed && !isOnMoveTracking) {
                  dataFactoryAnalytics.createEvent('kaarten', 'laag', 'plaatsnamen' + currentPlaatsnaamLevel, '', '1');
                }
                //console.log('KaartCtrl overlayChange plaatsnamen SINGLE ON: ' + currentPlaatsnaamLevel);
              }

              overlay.checked = true;
              $scope.plaatsnamen = true;
              updateConfig('plaatsnamen', true);
            }
          } else {

            if ($scope.overlay[overlay.index]) {
              map.removeLayer(
                dataFactoryOverlay.overlays[overlay.index]
              );
              if (configUpdateAllowed && !isOnMoveTracking) {
                dataFactoryAnalytics.createEvent('kaarten', 'laag', overlay.naam, overlay.index, '0');
              }
              //console.log('KaartCtrl overlayChange ', overlay.naam + ' UIT');
              $scope.overlay[overlay.index] = false;
              overlay.checked = false;
              updateConfig(overlay.naam, $scope.overlay[overlay.index]);
            } else {
              dataFactoryOverlay.overlays[overlay.index].addTo(
                map
              );
              if (configUpdateAllowed && !isOnMoveTracking) {
                dataFactoryAnalytics.createEvent('kaarten', 'laag', overlay.naam, overlay.index, '1');
              }
              //console.log('KaartCtrl overlayChange ', overlay.naam + ' AAN');
              $scope.overlay[overlay.index] = true;
              overlay.checked = true;
              updateConfig(
                overlay.naam,
                $scope.overlay[overlay.index]
              );
            }
          }
        } else {
          //console.warn('KaartCtrl overlayChange index: ', overlay.index);
        }
      } else {
        //console.log('KaartCtrl overlayChange OverlaysReady ERROR');
      }
    };
    /**
     * Schakel plaatsnamen in of uit
     */
    $scope.plaatsnamenChange = function () {
      //      //console.warn('plaatsnamenChange zoomLevel, plaatsnamen, currentPlaatsnamen: ', zoomLevel, $scope.plaatsnamen, currentPlaatsnaamLevel);
      //console.warn('plaatsnamenChange zoomLevel: ', zoomLevel);

      var zoomLevel = +$scope.zoomLevel.value;
      var tabelLevel = plaatsnamentabel[zoomLevel];
      currentPlaatsnaamLevel = tabelLevel;

      //console.warn('plaatsnamenChange $scope.configOverlays: ', $scope.configOverlays);

      var overlay = loDash.find($scope.configOverlays, function (
        overlayItem
      ) {
        return overlayItem.index === 7;
      });
      $scope.overlayChange(overlay);
    };
    /**
     * Werk plaatsnamen bij
     */
    function updatePlaatsnamenOverlay() {
      //console.warn('KaartCtrl updatePlaatsnamenOverlay $scope.plaatsnamen: ', $scope.plaatsnamen);
      //console.log('KaartCtrl updatePlaatsnamenOverlay: ', configParameterInit);

      var zoomLevel = +$scope.zoomLevel.value;
      var tabelLevel = plaatsnamentabel[zoomLevel];
      //      var configOverlay;

      //console.log('KaartCtrl updatePlaatsnamenOverlay: zoomLevel, plaatsnamen, currentPlaatsnaamLevel, tabelLevel: ', zoomLevel, $scope.plaatsnamen, currentPlaatsnaamLevel, tabelLevel);

      if ($scope.plaatsnamen) {
        //
        // Current plaatsnamen verwijderen
        //
        if (currentPlaatsnaamLevel !== undefined) {
          if (currentPlaatsnaamLevel !== tabelLevel) {
            if (currentPlaatsnaamLevel === 12) {
              //console.log('KaartCtrl updatePlaatsnamenOverlay plaatsnamen OFF: 11');

              map.removeLayer(plaatsNaamMarkers);
              map.removeLayer(dataFactoryOverlay.overlays[currentPlaatsnaamLevel]);
            } else {
              map.removeLayer(dataFactoryOverlay.overlays[currentPlaatsnaamLevel]);
              //console.log('KaartCtrl updatePlaatsnamenOverlay plaatsnamen SINGLE OFF: ' + currentPlaatsnaamLevel);
            }
          }
        }
        //
        // Nieuwe plaatsnamen toevoegen
        // tabellevel adhv ZoomLevel
        //
        currentPlaatsnaamLevel = +tabelLevel;

        //console.log('KaartCtrl updatePlaatsnamenOverlay: plaatsnamen, currentPlaatsnameLevel, tabelLevel: ', $scope.plaatsnamen, currentPlaatsnaamLevel, tabelLevel);

        if (currentPlaatsnaamLevel === 12) {
          map.addLayer(plaatsNaamMarkers);
          dataFactoryOverlay.overlays[currentPlaatsnaamLevel].addTo(
            map
          );
          //console.log('KaartCtrl updatePlaatsnamenOverlay plaatsnamen GROEP ON');
        } else {
          //console.log('KaartCtrl updatePlaatsnamenOverlay: ', dataFactoryOverlay.overlays[currentPlaatsnaamLevel], map);
          dataFactoryOverlay.overlays[currentPlaatsnaamLevel].addTo(
            map
          );
          //console.log('KaartCtrl updatePlaatsnamenOverlay plaatsnamen ON: ' + currentPlaatsnaamLevel);
        }
      }
    }
    /**
     * Schakel achterban in of uit
     */
    $scope.achterbanChange = function () {
      //console.warn('achterbansChange start');
      if (dataFactoryOverlay.overlays[12]) {
        if ($scope.achterban) {
          map.removeLayer(achterBanMarkers);
          //console.log('Achterban OFF');
          $scope.achterban = false;
          updateConfig('achterban', $scope.achterban);
        } else {
          map.addLayer(achterBanMarkers);
          //console.log('Achterban ON');
          $scope.achterban = true;
          updateConfig('achterban', $scope.achterban);
        }
        if (configUpdateAllowed && !isOnMoveTracking) {
          var bool = $scope.achterban;
          var str = '0';
          if (bool) {
            str = '1';
          }
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'laag',
            'achterban',
            '',
            str
          );
        }
      }
    };
    /**
     * Schakel geselecteerde track in of uit
     */
    $scope.trackSelectedChange = function () {
      //console.warn('KaartCtrl trackSelectedChange');

      //console.log('dataFactoryOverlay.overlays[13]:', dataFactoryOverlay.overlays[13]);
      if (dataFactoryOverlay.overlays[13]) {
        if (dataFactoryOverlay.overlays[13]) {
          map.removeLayer(dataFactoryOverlay.overlays[13]);
        }
        if ($scope.track) {
          $scope.track = false;
          if (centerMarker !== null) {
            map.removeLayer(centerMarker);
            //console.log('KaartCtrl centerMarker verwijderd');
          }
          //console.log('trackChange to false');
        } else {
          $scope.track = true;
          //console.log('trackChange to true');
          if (dataFactoryOverlay.overlays[13]) {
            map.addLayer(dataFactoryOverlay.overlays[13]);
          }
        }
        if (configUpdateAllowed && !isOnMoveTracking) {
          var bool = $scope.track;
          var str = '0';
          if (bool) {
            str = '1';
          }

          dataFactoryAnalytics.createEvent(
            'kaarten',
            'laag',
            'tracks',
            '',
            str
          );
        }
        updateConfig('tracks', $scope.track);
      }
    };
    /**
     * [changeKaart description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.changeKaart = function (kaart) {
      if (kaart.index !== $scope.currentNietHedenKaartIndex) {
        //console.warn('KaartCtrl changeKaart kaart: ', kaart);

        //console.warn('KaartCtrl changeKaart auth, uitgelogd: ', kaart.auth, dataFactoryCeo.currentModel.get('uitgelogd'));
        //console.warn('KaartCtrl changeKaart maxZoom: ', kaart.maxZoom);
        //console.warn('KaartCtrl changeKaart map.getZoom(): ', map.getZoom());
        //console.warn('KaartCtrl changeKaart naam: ', kaart.naam);
        //console.warn('KaartCtrl changeKaart HedenKaartIndex: ', $scope.currentHedenKaartIndex);
        //console.warn('KaartCtrl changeKaart NietHedenKaartIndex: ', $scope.currentNietHedenKaartIndex);
        if (kaart.maxZoom > map.getZoom()) {
          //console.log('kaart met maxzoom > current zoomLevel');
        } else {
          //console.log('kaart met maxzoom <= current zoomLevel');
          //if (popupZoomMaxHedenActive === false) {
          //
          // Popup indien de nieuwe zoomLevel groter of gelijk dan max kaartItemNietHeden
          //
          if (+map.getZoom() >= kaart.maxZoom + 1) {
            var nieuwZoomLevel = kaart.maxZoom;
            if (kaart.naam === '1600') {
              nieuwZoomLevel = 11;
            }
            $ionicPopup.confirm({
              title: 'ZoomLevel',
              //content: 'ZoomLevel groter dan ' + kaart.maxZoom + ' voor<br>kaart-' + kaart.naam + '<br>is niet beschikbaar.<br><br>De Heden/Thema-kaart blijft wel beschikbaar.',
              content: 'ZoomLevel groter dan ' + kaart.maxZoom + ' voor<br>kaart-' + kaart.naam + ' is niet beschikbaar.<br><br>Selecteer een heden-kaart voor hogere zoomLevels',
              buttons: [{
                text: 'Terug naar <br>zoomLevel ' + nieuwZoomLevel,
                onTap: function () {
                  //
                  // We gaan niet verder dus we draaien zoomLevel terug naar waar we vandaan komen
                  //
                  map.setZoom(nieuwZoomLevel, {
                    animate: true
                  });
                  updateConfig('zoomLevel', nieuwZoomLevel);
                }
                /*
    }, {
                      text: '<b>Doorgaan met Heden/Thema</b>',
                    type: 'button-positive',
    onTap: function () {
                      //
                      // 	Set popupZoomMaxHedenActive als we verder gaan
                      //
                      popupZoomMaxHedenActive = true;
    
    if (dataFactoryMap.map[$scope.currentNietHedenKaartIndex]) {
                      dataFactoryMap.map[$scope.currentNietHedenKaartIndex].removeFrom(map);
                  }
    
    map.setZoom(kaart.maxZoom + 1, {animate: true });
                    updateConfig('zoomLevel', kaart.maxZoom + 1);
                  }
                */
              }]
            });
          }
          //}
        }
        if (kaart.auth && dataFactoryCeo.currentModel.get('uitgelogd')) {
          $scope.currentNietHedenKaartIndex = kaart.index;
          $scope.grendelen();
        }

        if (!kaart.auth || !dataFactoryCeo.currentModel.get('uitgelogd')) {
          toKaart(kaart);
          if (configUpdateAllowed && !isOnMoveTracking) {
            dataFactoryAnalytics.createEvent('kaarten', 'kaart', kaart.naam, kaart.index, '1');
          }
        }
      }
    };

    function welkomTerug() {
      //console.log('AppSideMenuCtrl welkomTerug');

      dataFactoryAnalytics.createEvent('kaarten', 'welkomterug', '', '', '1');

      dataFactoryCeo.loadMe().then(function (ceoModel) {
        //console.log('EntryCtrl ceo.loadMe loginUser SUCCESS: ', ceoModel);

        ceoModel.setAll();

        localStorage.setItem('authentication_id', ceoModel.get('Id'));
        localStorage.setItem('authentication_profielId', ceoModel.get('profielId'));

        dataFactoryCeo.setToken(ceoModel).then(function () {
          dataFactoryCeo.update(ceoModel).then(
            function () {
              $scope.uitgelogd = false;
              $rootScope.$emit('uitloggenUit', {
                inloggen: false,
                geregistreerd: false,
                reopen: true
              });

              dataFactoryCeo.currentModel.set('uitgelogd', false);
              dataFactoryCeo
                .update(dataFactoryCeo.currentModel)
                .then(
                  function () { },
                  function (err) {
                    //console.error('KaartCtrl kan ceo niet wijzigen: ', err);
                  }
                );
            },
            function (err) {
              //console.error('KaartCtrl kan ceo niet wijzigen: ', err);
            }
          );
        });
      });
    }

    function touchIdAndroid() {
      //console.log('AppSideMenuCtrl touchIdAndroid');

      var client_id = 'cro5_cus1';
      var client_secret = 'godsweerderstraat';
      var disableBackup = true;
      var locale = 'es';
      var alertPopup;

      window.FingerprintAuth.isAvailable(
        function (result) {
          if (result.isAvailable) {
            if (result.hasEnrolledFingerprints) {
              window.FingerprintAuth.encrypt({
                clientId: client_id,
                clientSecret: client_secret,
                disableBackup: disableBackup,
                local: locale,
                dialogTitle: 'Vingerafdruk Authenticatie',
                dialogMessage: 'Plaats vinger op de touch-sensor om in te loggen.<br><br>Kies annuleer om in te loggen met een andere account',
                dialogHind: ''
              },
                function (result) {
                  if (result.withFingerprint) {
                    welkomTerug();
                    if (
                      configUpdateAllowed &&
                      !isOnMoveTracking
                    ) {
                      dataFactoryAnalytics.createEvent(
                        'kaarten',
                        'fingerprint',
                        'android',
                        'start',
                        '1'
                      );
                    }
                    var popupReopen = $ionicPopup.alert({
                      title: 'Welkom terug',
                      template: '<br>De Tranchot-kaart en jouw persoonlijke gegevens zijn nu weer beschikbaar.'
                    });
                    popupReopen.then(function () {
                      return true;
                    });
                  } else if (result.withPassword) {
                    if (
                      configUpdateAllowed &&
                      !isOnMoveTracking
                    ) {
                      dataFactoryAnalytics.createEvent(
                        'kaarten',
                        'fingerprint',
                        'android',
                        'abort',
                        '1'
                      );
                    }
                    alertPopup = $ionicPopup.alert({
                      title: 'Inloggen (scannen vingerafdruk)',
                      template: 'Scannen vingerafdruk mislukt. Log in met emailadres en wachtwoord'
                    });

                    alertPopup.then(function () {
                      //console.warn('Scannen vingerafdruk mislukt. Log in met emailadres en wachtwoord');
                      $timeout(function () {
                        openModalInloggen();
                      }, 500);
                    });
                  }
                },
                function (error) {
                  //console.error('Scannen vingerafdruk niet beschikbaar. Reden: ' + error + '<br>Inloggen met emailadres en wachtwoord');
                  $timeout(function () {
                    openModalInloggen();
                  }, 500);
                }
              );
            } else {
              //console.log('Geen vingerafdrukken bekend op apparaat.<br>Inloggen met emailadres en wachtwoord');
              $timeout(function () {
                openModalInloggen();
              }, 500);
            }
          } else {
            $timeout(function () {
              openModalInloggen();
            }, 500);
          }
        },
        function () {
          $timeout(function () {
            openModalInloggen();
          }, 500);
        }
      );
    }

    function touchIdIOS() {
      //console.log('AppSideMenuCtrl touchIdIOS: ', window.plugins.touchid);

      window.plugins.touchid.isAvailable(
        function () {
          window.plugins.touchid.verifyFingerprint(
            'Plaats vinger op de touch-sensor om in te loggen.<br><br>Kies annuleer om in te loggen met andere account', // this will be shown in the native scanner popup
            function () {
              if (configUpdateAllowed && !isOnMoveTracking) {
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'fingerprint',
                  'ios',
                  'start',
                  '1'
                );
              }
              welkomTerug();
              var popupReopen = $ionicPopup.alert({
                title: 'Welkom terug',
                template: '<br>De Tranchot-kaart en jouw persoonlijke gegevens zijn nu weer beschikbaar.'
              });
              popupReopen.then(function () {
                return true;
              });
            },
            function (msg) {
              if (configUpdateAllowed && !isOnMoveTracking) {
                dataFactoryAnalytics.createEvent(
                  'kaarten',
                  'fingerprint',
                  'ios',
                  'abort',
                  '1'
                );
              }
              //console.error('Scannen vingerfdruk mislukt.<br>Inloggen met emailadres en wachtwoord: ' + JSON.stringify(msg));
              $scope.openModalInloggen();
            }
          );
        },
        function () {
          $scope.openModalInloggen();
        }
      );
    }

    //  Vergrenden of ontgrendelen kaart
    //  Er is een kaart geselecteerd
    //  Indien de kaart auth heeft of als de gebruiker is uitgelogd moet de gebruiker
    //  eerst inloggen. De ingelogde account moet bovendien auth hebben voor deze kaart.
    //  Indien auth of uitgelogd moet de gebruiker eerst inloggen.
    //
    //  Eerst wordt de aktie die de selectie heeft ingezet teruggedraaid naar de kaart waar
    //  die vandaan komt. Dat kan zijn in het kaartmenu of het snelmenu in tijdrezien
    //  (pijltjes vooruit of achteruit).
    //  Het kan zijn dat de gebruiker niet inlogt dan blijft de teruggedraaide kaart aktief.
    //  Logt de gebruiker wel in dan wordt de oorspronkelijk geselecteerde kaart geaktiveerd.
    //  Wel moet dan gekeken worden of er sprake is van auth.

    $scope.grendelen = function () {
      //console.warn('KaartCtrl grendelen oude kaart');
      //var fakeKaart = loDash.find($scope.configKaartItems, function (
      loDash.find($scope.configKaartItems, function (
        kaart
      ) {
        return kaart.naam === '1850';
      });
      if (vorigNietHedenKaartIndex !== -1) {
        var menuKaart = loDash.find($scope.configKaartItems, function (
          kaart
        ) {
          return (
            +kaart.index ===
            +vorigNietHedenKaartIndex
          );
        });
        //console.log('KaartCtrl prevKaart deze last menuKaart: ', menuKaart, menuKaart.naam);
        if (menuKaart.naam !== '1800') {
          toKaart(menuKaart);
        }
      }
      //console.warn('KaartCtrl grendelen profielId, ceo: ' + dataFactoryCeo.currentModel.get('profielId'), $scope.ceo);
      if (dataFactoryCeo.currentModel.get('uitgelogd')) {
        if (dataFactoryCeo.currentModel.get('profielId') !== '1') {
          if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            if (ionic.Platform.isIOS()) {
              //console.log('KaartCtrl grendelen inloggen met IOS TouchId');
              touchIdIOS();
            }
            if (ionic.Platform.isAndroid()) {
              //console.log('KaartCtrl grendelen inloggen met Android TouchId');
              touchIdAndroid();
            }
          } else {
            if (!modalKaartOpties) {
              $scope.closePopoverKaartOpties().then(function () {
                //console.log('KaartCtrl grendelen popoverKaartOpties closed');
                $timeout(function () {
                  $scope.openModalInloggen();
                  //console.log('KaartCtrl grendelen modalInloggen opened');
                }, 500);
              });
            } else {
              $scope.closeModalKaartOpties().then(function () {
                //console.log('KaartCtrl grendelen modalKaartOpties closed');
                $timeout(function () {
                  $scope.openModalInloggen();
                  //console.log('KaartCtrl grendelen modalInloggen opened');
                }, 500);
              });
            }
          }
        } else {
          if (!modalKaartOpties) {
            $scope.closePopoverKaartOpties().then(function () {
              //console.log('KaartCtrl grendelen popoverKaartOpties closed');
              $timeout(function () {
                $scope.openModalInloggen();
                //console.log('KaartCtrl grendelen modalInloggen opened');
              }, 500);
            });
          } else {
            $scope.closeModalKaartOpties().then(function () {
              //console.log('KaartCtrl grendelen modalKaartOpties closed');
              $timeout(function () {
                $scope.openModalInloggen();
                //console.log('KaartCtrl grendelen modalInloggen opened');
              }, 500);
            });
          }
        }
      }
    };

    /**
     * Wijzig titel in header
     */
    $scope.setNavTitle = function (title) {
      //console.warn('setNavTitle: ' + title);
      $scope.kaartTitle = title;
      $timeout(function () {
        $ionicNavBarDelegate.title(title);
      }, 200);
    };

    /**
     * Ga naar kaart heden indien switcher lang wordt vastgehouden
     */
    $scope.onHold = function () {
      //console.warn('KaartCtrl onHold');
      restartStayTimer();

      var kaart = loDash.find($scope.configKaartItems, function (configKaartItem) {
        return configKaartItem.index === $scope.currentNietHedenKaartIndex;
      });

      //console.warn('KaartCtrl onHold index: ', kaart);

      if (kaart && configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'kaart',
          kaart.naam,
          'hold',
          '1'
        );
      }

      if (kaart !== undefined) {
        dataFactoryMap.map[
          $scope.currentNietHedenKaartIndex
        ].removeFrom(map);
        if (overlay1600On) {
          //console.log('KaartCtrl zoomLevelPlus 1600 kaders HIDE');
          map.removeLayer(dataFactoryOverlay.overlay1600);
          overlay1600On = false;
        }
        lastNietHedenKaartIndex = $scope.currentNietHedenKaartIndex;
        $scope.currentNietHedenKaartIndex = -1;
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $scope.setNavTitle(titleHedenNaamKort);
        } else {
          $scope.setNavTitle(titleHedenNaam);
        }

        updateConfig('kaartNietHeden', -1);
      }
    };

    $scope.snelMenuSluit = function () {
      if ($scope.snelMenuPos === 'l') {
        //console.warn('KaartCtrl snelMenuSluit: ', $scope.modalKaartOptiesSmL);

        //			if ($scope.modalKaartOptiesSmL !== undefined) {
        //console.warn('toggleSnelMenu links forced OPEN');
        if ($scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('toggleSnelMenu links was OPEN => GESLOTEN');
          $scope.openModalKaartOptiesSmL();
        }
        //			}
      } else {

        //console.warn('KaartCtrl snelMenuSluit: ', $scope.modalKaartOptiesSmR);

        //			if ($scope.modalKaartOptiesSmR !== undefined) {
        //console.warn('toggleSnelMenu rechts forced OPEN');
        if ($scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('toggleSnelMenu rechts was OPEN => GESLOTEN');
          $scope.openModalKaartOptiesSmR();
        }
        //			}
      }
    };

    $scope.snelMenuOpen = function () {
      //console.warn('kaartCtrl snelMenuOpen');

      if ($scope.snelMenuPos === 'l') {
        //		if ($scope.modalKaartOptiesSmL !== undefined) {
        //console.warn('toggleSnelMenu links forced OPEN');
        if (!$scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('toggleSnelMenu links was GESLOTEN => OPEN');
          restartStayTimer();
          $scope.openModalKaartOptiesSmL();
        }
      }
      if ($scope.snelMenuPos === 'r') {
        //		if ($scope.modalKaartOptiesSmR !== undefined) {
        //console.warn('toggleSnelMenu rechts forced OPEN');
        if (!$scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('toggleSnelMenu rechts was GESLOTEN => OPEN');
          restartStayTimer();
          $scope.openModalKaartOptiesSmR();
        }
      }
    };

    /**
     * Schakel GPS recording in of uit
     *
     * Start door klik op record in snelmenu of via setconfigParameters
     * volgende functie is setGpsVolgen
     * vervolgens $scope.startWatchGeo
     */
    $scope.gpsRecordChange = function () {
      restartStayTimer();
      //console.warn('gpsRecordChange: ', $scope.gpsRecord.checked);
      if ($scope.gpsRecord) {
        $scope.gpsRecord = false;
        $scope.gpsWatch = false;
        //console.warn('gpsRecordChange OFF');
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', '', '0');
        }
      } else {
        $scope.gpsRecord = true;
        $scope.gpsWatch = true;
        //console.warn('gpsWatchChange ON');
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent('kaarten', 'gpsrecord', '', '', '1');
        }
      }
      setGpsVolgen();

      updateConfig('gpsrecord', $scope.gpsRecord);
    };
    /**
     * Schakel GPS watching in of uit
     * Start door klik op GEO watching in snelmenu of via setConfigParameters
     *
     * Volgende functie setGpsVolgen
     * vervolgens $scope.startWatchGeo
     */
    $scope.gpsWatchChange = function (timer) {
      if (!timer) {
        restartStayTimer();
      }
      if ($scope.gpsWatch) {
        $scope.gpsWatch = false;
        $scope.gpsRecord = false;
        //console.warn('gpsWatchChange OFF');
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'gpswatch',
            '',
            '',
            '0'
          );
        }
      } else {
        $scope.gpsWatch = true;
        //console.warn('gpsWatchChange ON');
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'gpswatch',
            '',
            '',
            '1'
          );
        }
      }
      setGpsVolgen();
      updateConfig('gpswatch', $scope.gpsWatch);
    };
    /**
     * Schakel GPS volgen in
     */
    function setGpsVolgen() {
      //console.warn('setGpsVolgen');
      if ($scope.gpsWatch) {
        $scope.startWatchGeo();
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'gpsvolgen',
            '',
            '',
            '1'
          );
        }
      } else {
        $scope.stopWatchGeo();
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'gpsvolgen',
            '',
            '',
            '0'
          );
        }
      }
    }
    /*
    function checkNietHedenHeden() {
    
    //console.warn('KaartCtrl checkNietHedenHeden checkHeden kaartItemHeden.maxZoom, zoomLevel, getZoom, popupZoomMaxHedenActive: ', kaartItemHeden.maxZoom, $scope.zoomLevel.value, +map.getZoom(), popupZoomMaxHedenActive);
    
    var zoomUpdated = false;
    
          var popupZoomMax;
          //
          // Kijken wat de maxZoomLevel is voor HedenKaart
          //
    function checkHeden() {
    
    //console.log('KaartCtrl checkNietHedenHeden checkHeden kaartItemHeden.maxZoom, zoomLevel, getZoom, popupZoomMaxHedenActive: ', kaartItemHeden.maxZoom, $scope.zoomLevel.value, map.getZoom(), popupZoomMaxHedenActive);
    
    if (+map.getZoom() > kaartItemHeden.maxZoom - 1) && $scope.zoomLevel.value > kaartItemHeden.maxZoom - 1) {
            $scope.zoomLevel.value = +kaartItemHeden.maxZoom;
    
      //console.error('checkNietHedenHeden alert maxHeden');
    
    popupZoomMax = $ionicPopup.alert({
            title: 'ZoomLevel',
    template: 'ZoomLevel groter dan ' + kaartItemHeden.maxZoom + ' voor<br>kaart-' + kaartItemHeden.naam + '<br>is niet beschikbaar.'
        });
    popupZoomMax.then(function() {
              restartStayTimer();
            return false;
          });
    } else {
    
    if (popupZoomMaxHedenActive === undefined) {
              popupZoomMaxHedenActive = false;
    if (+map.getZoom() > kaartItemHeden.maxZoom) {
              kaartItemHeden.maxZoom = true;
          }
        }
    if (!zoomUpdated) {
              map.setZoom($scope.zoomLevel.value + 1, {
                animate: true
              });
            updateConfig('zoomLevel', $scope.zoomLevel.value + 1);
          }
        }
      }
    
    var kaartItemHeden = loDash.find($scope.configKaartItems, function(configKaartItem) {
    return configKaartItem.index === $scope.currentHedenKaartIndex;
          });
    var kaartItemNietHeden = loDash.find($scope.configKaartItems, function(configKaartItem) {
    return configKaartItem.index === $scope.currentNietHedenKaartIndex;
          });
    
    if (kaartItemNietHeden) {
    
    //console.log('KaartCtrl checkNietHedenHeden kaartItemNietHeden.maxZoom, zoomLevel, getZoom, Active: ', kaartItemNietHeden.maxZoom, $scope.zoomLevel.value, +map.getZoom(), popupZoomMaxHedenActive);
    
    if (popupZoomMaxHedenActive) {
    if (+map.getZoom() < kaartItemNietHeden.maxZoom) {
              popupZoomMaxHedenActive = false;
          }
    if ((+map.getZoom() - 1 <= kaartItemNietHeden.maxZoom) && ($scope.zoomLevel.value <= kaartItemNietHeden.maxZoom)) {
    //console.log('checkNietHedenHeden => nietHedenTitle');
    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
              $scope.setNavTitle(titleNietHedenNaamKort);
    } else {
              $scope.setNavTitle(titleNietHedenNaam);
          }
        }
      }
    
    if (popupZoomMaxHedenActive === false) {
    //
    // ALs we van Active naar Niet Active gaan dan niets doen
    //
    //console.log('KaartCtrl checkNietHedenHeden kaartItemHeden.maxZoom, getZoom: ', kaartItemHeden.maxZoom, +map.getZoom());
    
    if (+map.getZoom() >= kaartItemNietHeden.maxZoom) {
    
              //console.log('KaartCtrl checkNietHedenHeden zoomLevel PLUS, Active = false, nieuwe zoom is lager of gelijk aan nietHeden.maxZoom: ', +map.getZoom(), kaartItemNietHeden.maxZoom);
    
              restartStayTimer();
    
    } else {
              map.setZoom($scope.zoomLevel.value + 1, {
                animate: true
              });
            updateConfig('zoomLevel', $scope.zoomLevel.value + 1);
            zoomUpdated = true;
            checkHeden();
          }
    } else {
              map.setZoom($scope.zoomLevel.value + 1, {
                animate: true
              });
            updateConfig('zoomLevel', $scope.zoomLevel.value + 1);
            zoomUpdated = true;
            checkHeden();
          }
    } else {
              checkHeden();
          }
    
    $timeout( function() {
              //console.log('KaartCtrl checkNietHedenHeden zoomLevel, getZoom: ', $scope.zoomLevel.value, +map.getZoom());
            }, 1000);
            }
            */
    /**
     * Zoom naar volgende level
     */
    $scope.zoomLevelPlus = function () {
      //console.warn('zoomLevelPlus hedenMax, getZoom(), value, popupZoomMaxHedenActive: ', hedenMax, +map.getZoom(), $scope.zoomLevel.value, popupZoomMaxHedenActive);

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'zoomlevel',
          'plus',
          '',
          '1'
        );
      }

      if (currentPlaatsnaamLevel !== undefined) {
        map.removeLayer(
          dataFactoryOverlay.overlays[currentPlaatsnaamLevel]
        );
      }

      var kaartItemHeden = loDash.find($scope.configKaartItems, function (
        configKaartItem
      ) {
        return configKaartItem.index === $scope.currentHedenKaartIndex;
      });

      var kaartItemNietHeden = loDash.find($scope.configKaartItems, function (
        configKaartItem
      ) {
        return configKaartItem.index === $scope.currentNietHedenKaartIndex;
      });

      if (+map.getZoom() >= kaartItemHeden.maxZoom) {
        hedenMax = true;
      } else {
        hedenMax = false;
      }

      if (!hedenMax) {
        $scope.zoomLevel.value = parseInt($scope.zoomLevel.value + 1, 10);
        map.setZoom($scope.zoomLevel.value, {
          animate: true
        });
        updateConfig('zoomLevel', $scope.zoomLevel.value);

        restartStayTimer();
      } else {
        //console.log('zoomLevelPlus alert maxHeden');

        var popupZoomMax = $ionicPopup.alert({
          title: 'ZoomLevel',
          template: 'ZoomLevel groter dan ' +
            kaartItemHeden.maxZoom +
            ' voor<br>kaart-' +
            kaartItemHeden.naam +
            '<br>is niet beschikbaar.'
        });
        popupZoomMax.then(function () {
          restartStayTimer();
          //				return false;
        });
      }
      //console.log('KaartCtrl zoomLevelPlus 1600 kaders zoom: ', +map.getZoom());
      //console.log('KaartCtrl kaartItemNietHeden: ', kaartItemNietHeden);
      if (kaartItemNietHeden) {
        if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() < 11) {
          if (!overlay1600On) {
            //console.log('KaartCtrl zoomLevelPlus 1600 kaders SHOW');
            dataFactoryOverlay.overlay1600.addTo(map);
            overlay1600On = true;
          }
        }
        if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() >= 11) {
          if (overlay1600On) {
            //console.log('KaartCtrl zoomLevelPlus 1600 kaders HIDE');
            map.removeLayer(dataFactoryOverlay.overlay1600);
            overlay1600On = false;
          }
        }
      }
    };
    /**
     * Zoom naar vorige level
     */
    $scope.zoomLevelMin = function () {
      //console.warn('zoomLevelMin getZoom(), value: ', +map.getZoom(), $scope.zoomLevel.value);

      if (configUpdateAllowed && !isOnMoveTracking) {
        dataFactoryAnalytics.createEvent(
          'kaarten',
          'zoomlevel',
          'min',
          '',
          '1'
        );
      }

      var value = +map.getZoom();

      if (value > 8) {
        if (currentPlaatsnaamLevel !== undefined) {
          map.removeLayer(
            dataFactoryOverlay.overlays[currentPlaatsnaamLevel - 1]
          );
        }
        $scope.zoomLevel.value = parseInt(value - 1, 10);
        map.setZoom($scope.zoomLevel.value, {
          animate: true
        });
        updateConfig('zoomLevel', $scope.zoomLevel.value);

        //			checkNietHedenHeden();
      } else {
        var popupZoom7 = $ionicPopup.alert({
          title: 'ZoomLevel',
          template: 'ZoomLevel kleiner dan 8 is niet beschikbaar.'
        });

        updateConfig('zoomLevel', $scope.zoomLevel.value);

        popupZoom7.then(function () {
          return false;
        });
      }

      var kaartItemNietHeden = loDash.find($scope.configKaartItems, function (
        configKaartItem
      ) {
        return configKaartItem.index === $scope.currentNietHedenKaartIndex;
      });

      //console.log('KaartCtrl zoomLevelMin 1600 kaders zoom: ', +map.getZoom(), kaartItemNietHeden.cacheFolder);
      if (kaartItemNietHeden) {
        if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() <= 12) {
          if (!overlay1600On) {
            //console.log('KaartCtrl zoomLevelMin 1600 kaders SHOW');
            dataFactoryOverlay.overlay1600.addTo(map);
            overlay1600On = true;
          }
        }
        if (kaartItemNietHeden.cacheFolder == 'Limburg1600' && +map.getZoom() >= 13) {
          if (overlay1600On) {
            //console.log('KaartCtrl zoomLevelMin 1600 kaders HIDE');
            map.removeLayer(dataFactoryOverlay.overlay1600);
            overlay1600On = false;
          }
        }
      }
      restartStayTimer();
    };
    /**
     * Schakel naar zoom level
     */
    $scope.setZoomLevel = function (value) {
      //console.warn('KaartCtrl setZoomLevel: ', value);

      if (value > 7 && value < 20) {
        map.setZoom(value, {
          animate: true
        });
      }
    };

    $scope.back = function () {
      $scope.closeLoginModal();
    };

    $scope.nextKaart = function () {
      //console.log(' ');
      //console.log('KaartCtrl nextKaart');
      //console.log('KaartCtrl nextKaart $scope.currentNietHedenKaartIndex ', $scope.currentNietHedenKaartIndex);
      //console.log('KaartCtrl nextKaart $scope.currentHedenKaartIndex ', $scope.currentHedenKaartIndex);
      //
      // Indien geen NietHeden kaart dan de laatst bekende kaart
      //

      //prevNextNietHedenKaartIndex = $scope.currentNietHedenKaartIndex;

      if ($scope.currentNietHedenKaartIndex === -1) {
        //$scope.currentNietHedenKaartIndex = lastNietHedenKaartIndex;
        $scope.currentNietHedenKaartIndex = 0;
        //console.log('KaartCtrl nextKaart currentNietHedenKaartIndex', $scope.currentNietHedenKaartIndex);
      }
      //console.warn('KaartCtrl nextKaart currentKaart index: ' + $scope.currentNietHedenKaartIndex);
      //
      // Bepaal kaartitem dmv index currentNietHeden
      //
      var kaart = loDash.find($scope.configKaartItems, function (kaart) {
        return (
          +kaart.index ===
          +$scope.currentNietHedenKaartIndex
        );
      });
      //console.log('KaartCtrl nextKaart deze kaart index, naam: ', kaart.index, kaart.naam);
      //
      // Bepaal de volgende kaart dmv prop next in kaart
      //
      var kaartVolgende = kaart.next;

      if (kaartVolgende !== $scope.currentNietHedenKaartIndex) {
        //
        // Indien naar hedenKaart dan de current nietHedenKaart
        //
        if (kaartVolgende === 0) {
          kaartVolgende = $scope.currentHedenKaartIndex;
        }
        //
        // Bepaal de volgende kaart dmv index vorige
        //
        var nextKaart = loDash.find($scope.configKaartItems, function (kaart) {
          return +kaart.index === +kaartVolgende;
        });
        //
        // Ga naar de volgende kaart indien ingelogd of kaart niet auth
        //
        //if (nextKaart.auth && dataFactoryCeo.currentModel.get('uitgelogd')) {
        //$scope.grendelen();
        //}
        //if (!nextKaart.auth || !dataFactoryCeo.currentModel.get('uitgelogd', '', '', '0')) {
        //console.warn('KaartCtrl nextKaart auth, uitgelogd: ', nextKaart.naam, nextKaart.auth, dataFactoryCeo.currentModel.get('uitgelogd'));
        if ((!nextKaart.auth || !dataFactoryCeo.currentModel.get('uitgelogd'))) {
          //console.warn('KaartCtrl nextKaart nieuwe (volgende) kaart index, naam: ', nextKaart.index, nextKaart.naam);
          if (nextKaart.naam == '1700') {
            //
            // Deze kaart overslaan
            //
            //console.warn('KaartCtrl nextKaart overslaan naam: ', nextKaart.naam);
            kaartVolgende = nextKaart.next;
            nextKaart = loDash.find(
              $scope.configKaartItems,
              function (kaart) {
                return (
                  +kaart.index ===
                  +kaartVolgende
                );
              }
            );
            //console.warn('KaartCtrl nextKaart naam: ', nextKaart.naam);
            //console.warn('KaartCtrl nextKaart nieuwe kaart index: ', kaartVolgende);
          }
          if (nextKaart.index <= 2) {
            $scope.currentHedenKaartIndex = 13;
          }
          $scope.changeKaart(nextKaart);
        } else {
          //
          // Deze kaart overslaan
          //
          //console.warn('KaartCtrl nextKaart overslaan naam: ', nextKaart.naam);
          kaartVolgende = nextKaart.next;
          nextKaart = loDash.find(
            $scope.configKaartItems,
            function (kaart) {
              return (
                +kaart.index ===
                +kaartVolgende
              );
            }
          );
          //console.warn('KaartCtrl nextKaart naam: ', nextKaart.naam);
          //console.warn('KaartCtrl nextKaart nieuwe kaart index: ', kaartVolgende);
          if (nextKaart.naam == '1700') {
            //
            // Deze kaart overslaan
            //
            //console.warn('KaartCtrl nextKaart overslaan naam: ', nextKaart.naam);
            kaartVolgende = nextKaart.next;
            nextKaart = loDash.find(
              $scope.configKaartItems,
              function (kaart) {
                return (
                  +kaart.index ===
                  +kaartVolgende
                );
              }
            );
            //console.warn('KaartCtrl nextKaart naam: ', nextKaart.naam);
            //console.warn('KaartCtrl nextKaart nieuwe kaart index: ', kaartVolgende);
            if (nextKaart.index <= 2) {
              $scope.currentHedenKaartIndex = 13;
            }
            $scope.changeKaart(nextKaart);

          }
          if (nextKaart.index <= 2) {
            $scope.currentHedenKaartIndex = 13;
          }
          $scope.changeKaart(nextKaart);
        }
        if (configUpdateAllowed && !isOnMoveTracking) {
          dataFactoryAnalytics.createEvent(
            'kaarten',
            'kaart',
            kaart.naam,
            kaart.index,
            '1'
          );
          //dataFactoryAnalytics.createEvent('kaarten', 'next', '', '', '1');
        }
        //console.warn('KaartCtrl nextKaart volgende kaart: ', nextKaart.naam);
      } else {
        var popupThema = $ionicPopup.alert({
          title: 'Thema kaart',
          template: 'Reizen door de tijd is niet mogelijk met \'Thema\'-kaarten.<br><br>Kies eerst, in het Kaartmenu, een \'Limburg verleden\'-kaart.'
        });

        popupThema.then(function () {
          return false;
        });
      }

      restartStayTimer();
    };
    /**
     * Bepaal vorige kaart
     */
    $scope.prevKaart = function () {
      //console.log(' ');
      //
      // Indien geen NietHeden kaart dan de laatst bekende kaart
      //
      //prevNextNiethedenKaartIndex = $scope.currentNietHedenKaartIndex;

      if ($scope.currentNietHedenKaartIndex === -1) {
        $scope.currentNietHedenKaartIndex = 18;
        lastNietHedenKaartIndex = 18;
        //
        //  Dit komt voor als de eerste keer prevKaart wordt geactiveerd
        //
        prevKaart = loDash.find(
          $scope.configKaartItems,
          function (kaart) {
            return (
              +kaart.index === $scope.currentNietHedenKaartIndex
            );
          }
        );
        //console.warn('KaartCtrl prevKaart nieuwe (vorige) prevKaart.naam: ', prevKaart.naam);
        toKaart(prevKaart);
      } else {
        //console.warn('prevKaart currentKaart index: ' + $scope.currentNietHedenKaartIndex);
        //
        // Bepaal kaartitem dmv index currentNietHeden
        //
        var kaart = loDash.find($scope.configKaartItems, function (kaart) {
          return (
            +kaart.index ===
            +$scope.currentNietHedenKaartIndex
          );
        });
        //console.log('KaartCtrl prevKaart deze kaart, kaart.naam: ', kaart, kaart.naam);
        //
        //  Bepaal de volgende kaart dmv prop next in kaart
        //  Dit is de aktie die nog een kee rmoet gebeuren om de 1800 kaart over te slaan
        //
        var kaartVorige = kaart.prev;
        //console.log('KaartCtrl prevKaart kaartVorige: ', kaartVorige);

        if (kaartVorige !== $scope.currentNietHedenKaartIndex) {
          //console.log('KaartCtrl prevKaart index kaartVorige currentNietHedenKaartIndex: ', kaartVorige, $scope.currentNietHedenKaartIndex);
          //
          // Indien naar hedenKaart dan de currentActuele kaart
          //  Dit hoeft niet want de 1800 kaart heeft een volgende en een vorige kaart
          //
          if (kaartVorige <= 2) {
            kaartVorige = $scope.currentHedenKaartIndex;
          }
          //
          //  Bepaal de vorige kaart dmv index vorige
          //  Dit moet gebeuren pas nadat is bekeken of de 1800 kaart moet worden overgeslagen
          //
          var prevKaart = loDash.find($scope.configKaartItems, function (
            kaart
          ) {
            return +kaart.index === +kaartVorige;
          });
          //console.log('KaartCtrl prevKaart prevKaart: ', prevKaart);
          //
          // Ga naar de vorige kaart indien ingelogd of kaart niet auth
          //
          if (
            prevKaart.auth &&
            dataFactoryCeo.currentModel.get('uitgelogd')
          ) {
            //$scope.grendelen();
          }
          //console.log('KaartCtrl prevKaart.naam prevKaart.auth, uitgelogd: ', prevKaart.naam, prevKaart.auth, dataFactoryCeo.currentModel.get('uitgelogd'));
          if (prevKaart.naam == '1700') {
            //
            // Deze kaart overslaan
            //
            //console.warn('KaartCtrl prevKaart overslaan naam: ', prevKaart.naam);
            //console.warn('KaartCtrl prevKaart overslaan next: ', prevKaart.prev);
            kaartVorige = prevKaart.prev;
            prevKaart = loDash.find(
              $scope.configKaartItems,
              function (kaart) {
                return (
                  +kaart.index === +kaartVorige
                );
              }
            );
            //console.warn('KaartCtrl prevKaart naam: ', prevKaart.naam);
            //console.warn('KaartCtrl prevKaart nieuwe kaart index: ', kaartVorige);
          }
          if ((!prevKaart.auth || !dataFactoryCeo.currentModel.get('uitgelogd'))) {
            //console.warn('prevKaart nieuwe (vorige) kaart index: ', kaartVorige);
            $scope.changeKaart(prevKaart);
          } else {
            //
            // Deze kaart overslaan dus de volgende
            //
            //console.warn('KaartCtrl prevKaart overslaan naam: ', prevKaart.naam);
            kaartVorige = prevKaart.prev;
            //console.log('KaartCtrl prevKaart kaartVorige: ', kaartVorige);

            prevKaart = loDash.find(
              $scope.configKaartItems,
              function (kaart) {
                return (
                  +kaart.index === +kaartVorige
                );
              }
            );
            //console.warn('prevKaart nieuwe (vorige) prevKaart.naam: ', prevKaart.naam);
            $scope.changeKaart(prevKaart);
          }
          if (configUpdateAllowed && !isOnMoveTracking) {
            dataFactoryAnalytics.createEvent(
              'kaarten',
              'kaart',
              prevKaart.naam,
              kaart.index,
              '1'
            );
            //dataFactoryAnalytics.createEvent('kaarten', 'prev', '', '', '1');
          }

          //console.warn('KaartCtrl prevKaart einde kaartNaam: ', prevKaart.naam);
        } else {
          var popupThema = $ionicPopup.alert({
            title: 'Thema kaart',
            template: 'Reizen door de tijd is niet mogelijk met \'Thema\'-kaarten.<br><br>Kies eerst, in het Kaartmenu, een \'Limburg verleden\'-kaart.'
          });

          popupThema.then(function () {
            return false;
          });
        }
      }

      restartStayTimer();
    };

    /**
     * =====================================================================================================================================
     *
     * Event handlers
     *
     * =====================================================================================================================================
     */
    var onOpenTimeGeoSearch = $rootScope.$on(
      'OpenTimeGeoSearch',
      function () {
        //console.warn('KaartCtrl event onOpenTimeGeoSearch');

        geosearcher.remove(map);

        geosearcher = new L.Control.GeoSearch({
          provider: new L.GeoSearch.Provider.OpenStreetMap(),
          limit: 20,
          position: 'topleft',
          searchLabel: '  Zoek adres',
          notFoundMessage: 'Kan adres niet vinden',
          messageHideDelay:
            +dataFactoryInstellingen.stayOpenTimeGeoSearch * 1000,
          retainZoomLevel: true,
          showMarker: false
        }).addTo(map);
      }
    );
    //
    // De PoisCtrl heeft iets gewijzigd in de PoiStore
    // De Pois moeten opnieuw op de kaart geplaatst worden.
    // Dit is zeer inefficient. Meestal gaat het om de wijziging van 1 enkele Poi,
    // Beter zou zijn als PoiCtrl de wijziging ook in selected verwerkt
    // Selected wordt met addPois() op de kaart geplaatst.
    // Ipv addPois() moet dan de wijziging in de poi op de kaart worden aangebracht.
    //
    var poiKaartEvent = $rootScope.$on('poiKaart', function () {
      //console.warn('KaartCtrl event poiKaart', dataFactoryPoi.selected, dataFactoryPoi.selected.length);
      addPois();
    });

    var poiUpdatedEvent = $rootScope.$on('poiUpdate', function (event, poiModel) {
      //console.warn('KaartCtrl event poiUpdated poiModel: ', poiModel);
      var tmp = loDash.remove(dataFactoryPoi.selected, function (selectedModel) {
        return selectedModel.get('Id') === poiModel.get('Id');
      });
      //console.warn('KaartCtrl event poiUpdated poiModel success: ', tmp);
      dataFactoryPoi.selected.push(poiModel);

      addPois();
    });
    /**
     * @method poiDelete
     * In poi beheer is een poi verwijderd
     * Verwijder de poi in pois en installeer alle pois opnieuw (zonder de verwijderde poi)
     */
    var poiDeletedEvent = $rootScope.$on('poiDelete', function (event, poiId) {
      //console.warn('kaartCtrl event poiDeleted: ', event, poiModel);
      loDash.remove(dataFactoryPoi.selected, function (selectedModel) {
        return selectedModel.get('Id') === poiId;
      });
      addPois();
    });

    /**
     * @method poiSelected
     * In poi beheer is een poi geselecteerd
     * event stuurt de bijbehorende LatLng
     * centreer de kaart op de aangwezen LatLng
     */
    var poiSelectedEvent = $rootScope.$on('poiSelected', function (event, poiModel) {
      //$timeout(function () {
      //console.warn('KaartCtrl.js event poiSelected: ', poiModel);
      var lat = poiModel.get('lat');
      var lng = poiModel.get('lng');
      var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

      //console.log('KaartCtrl poiSelected flyTo: ', latlng);
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.flyTo(latlng, 15, {
        animate: true,
        duration: durationItem,
        easeLinearity: 0.25,
        noMovestart: true
      });
      //}, 100);
    });
    /**
     * @method event on syncPoi
     */
    //var syncPoiEvent = $rootScope.$on('syncPoi', function () {
    //console.warn('KaartCtrl.js event syncPoi!!!!!!!');
    //});

    var fotoKaartEvent = $rootScope.$on('fotoKaart', function () {
      //console.warn('KaartCtrl event fotoKaart');
      addFotos();
    });

    /**
     * @method fotoUpdate
     * In beheer foto is een foto gewijzigd
     * Wijzig de foto in fotos en installer alle foto in fotos opnieuw (met de gwijziging)
     */
    var fotoUpdatedEvent = $rootScope.$on('fotoUpdate', function (
      event,
      fotoModel
    ) {
      //console.warn('KaartCtrl event fotoUpdate: ', fotoModel);
      loDash.remove(dataFactoryFoto.selected, function (selectedModel) {
        return selectedModel.get('Id') === fotoModel.get('Id');
      });
      dataFactoryFoto.selected.push(fotoModel);
      addFotos();
    });

    /**
     * @method fotoDelete
     * In foto beheer is een foto verwijderd
     * Verwijder de foto in fotos en installeer alle fotos opnieuw (zonder de verwijderde foto)
     */
    var fotoDeletedEvent = $rootScope.$on('fotoDelete', function (
      event,
      fotoId
    ) {
      //console.warn('kaartCtrl event fotoDeleted: ', fotoId);
      loDash.remove(dataFactoryFoto.selected, function (selectedModel) {
        return selectedModel.get('Id') === fotoId;
      });
      addFotos();
    });

    /**
     * @method fotoSelected
     * In foto beheer is een foto geslecteerd
     * event stuurt de bijbehorende LatLng
     * centereer de kaart op de aangwezen LatLng
     */

    var fotoSelectedEvent = $rootScope.$on('fotoSelected', function (event, fotoModel) {
      //console.warn('KaartCtrl fotoSelected fotoModel: ', fotoModel);
      var lat = fotoModel.get('lat');
      var lng = fotoModel.get('lng');
      var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

      //console.log('KaartCtrl fotoSelected flyTo: ', latlng);
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.flyTo(latlng, 15, {
        animate: true,
        duration: durationItem,
        easeLinearity: 0.25,
        noMovestart: true
      });
    });

    /**
     * @method event on syncFoto
     */

    var syncFotoEvent = $rootScope.$on('syncFoto', function () {
      //console.warn('KaartCtrl event syncFoto');
    });

    var trackKaartEvent = $rootScope.$on('trackKaart', function () {
      //console.warn('KaartCtrl event trackKaart');
      addTracks();
      addTrackPois();
      addTrackFotos();
    });

    /*
     * trackUpdated
     * In beheer track is een trackgewijzigd
     * Wijzig de track in tracks en installer alle track in tracks opnieuw (met de gwijziging)
     */
    var trackUpdatedEvent = $rootScope.$on('trackUpdate', function (
      event,
      args
    ) {
      $timeout(function () {
        //console.warn('KaartCtrl event trackUpdate');

        if (args.track) {
          var len = tracks.length;
          var i = 0;
          for (i = 0; i < len; i++) {
            if (tracks[i].Id === args.track.get('Id')) {
              tracks[i] = args.track;
              //console.log('KaartCtrl track updated');
              break;
            }
          }
        }
      }, 100);
      //console.log('KaartCtrl.js trackUpdated');
    });

    /*
     * In track beheer is een track verwijderd
     * Verwijder de track in tracks en installeer alle tracks opnieuw (zonder de verwijderde track)
     */
    var trackDeletedEvent = $rootScope.$on('trackDelete', function (event, args) {
      $timeout(function () {
        //console.warn('kaartCtrl trackDeleted event');

        if (args.trackId) {
          var len = tracks.length;
          var i = 0;
          for (i = 0; i < len; i++) {
            if (tracks[i].Id === args.trackId) {
              tracks.splice(i, 1);
              break;
            }
          }
        }
      }, 100);
    });

    var trackSelectedEvent = $rootScope.$on('trackSelected', function (event, trackModel) {

      //console.warn('KaartCtrl trackSelected event naam: ', trackModel.get('naam'));

      map.closePopup();

      var lat = trackModel.get('lat');
      var lng = trackModel.get('lng');
      var latlng = L.latLng(parseFloat(lat), parseFloat(lng));

      //console.error('KaartCtrl trackselected flyTo: ', latlng);
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.flyTo(latlng, 15, {
        animate: true,
        duration: durationItem,
        easeLinearity: 0.25,
        noMovestart: true
      });
      //console.log('KaartCtrl trackSelectedEvent fly to SUCCES');
    });

    function trackSelected(trackModel) {

      //console.warn('KaartCtrl trackSelected naam: ', trackModel.get('naam'));

      var q = $q.defer();

      map.closePopup();

      if (trackSoloLayer) {
        trackClusterLayer.removeLayer(trackSoloLayer);
        //console.log('KaartCtrl trackSelectedEvent old trackSoloLayer removed');
      }
      if (trackClusterLayer) {
        map.removeLayer(trackClusterLayer);
        //console.log('KaartCtrl trackSelectedEvent old trackClusterlayer removed from map');
      }

      var gebruikerId = trackModel.get('gebruikerId');
      var trackId = trackModel.get('Id');

      dataFactoryTracks.loadTrack(gebruikerId, trackId, 'txt').then(function (layer) {

        //console.log('KaartCtrl loadTrack layer : ', layer);

        var newObjs = [];
        loDash.each(layer.features, function (feature) {
          //console.log('KaartCtrl alleen features met sporen filteren : ', feature.geometry.coordinates);
          if (feature.geometry.type === 'LineString') {
            newObjs.push(feature);
          }
        });

        //console.log('KaartCtrl loadTrack features met tracks : ', newObjs);

        layer.features = newObjs;

        trackSoloLayer = L.geoJson(layer, {
          onEachFeature: function (feature) {

            //console.log('KaartCtrl loop coordinates: ', feature.geometry.coordinates);

            var spoorLatLngs = [];
            loDash.each(feature.geometry.coordinates, function (coordinaat) {
              spoorLatLngs.push(L.latLng(coordinaat[1], coordinaat[0]));
            });

            //console.log('KaartCtrl SpoorLatLngs: ', spoorLatLngs);

            var spoorCentrum = GetCenterFromDegrees(spoorLatLngs);

            //console.log('KaartCtrl spoorCentrum naam: ', spoorCentrum, trackModel.get('naam'));

            trackModel.xData.spoorCentrum = spoorCentrum;

            q.resolve(L.latLngBounds(spoorLatLngs));
          },
          style: trackStyle
        });

        trackClusterLayer.addLayer(trackSoloLayer);

        map.addLayer(trackClusterLayer);

      }, function (err) {
        //console.error('KaartCtrl loadTrack ERROR track not found: ', err);
      });
      return q.promise;
    }

    $rootScope.$on('uitloggenAan', function () {
      //console.warn('++++++ KaartCtrl.js event uitloggenAan');
      if ($scope.currentNietHedenKaartIndex >= 0) {
        var kaartItemNietHeden = loDash.find(
          $scope.configKaartItems,
          function (configKaartItem) {
            return (
              configKaartItem.index ===
              $scope.currentNietHedenKaartIndex
            );
          }
        );
        if (kaartItemNietHeden.naam === '1800') {
          $scope.onHold();
        }
      }
    });

    $rootScope.$on('uitloggenUit', function () {
      //console.warn('++++++ KaartCtrl.js event uitloggenUit: ', $scope.currentNietHedenKaartIndex);
      if ($scope.currentNietHedenKaartIndex >= 0) {
        var kaartItemNietHeden = loDash.find(
          $scope.configKaartItems,
          function (configKaartItem) {
            return (
              configKaartItem.index ===
              $scope.currentNietHedenKaartIndex
            );
          }
        );
        toKaart(kaartItemNietHeden);
      }
      //
      // Indien de kaart1800 was geactiveerd dan
    });

    $rootScope.$on('deployUpdate', function () {
      //console.warn('++++++ KaartCtrl.js event deployUpdate');
      $scope.spinner = true;
    });

    $rootScope.$on('enterBerichten', function () {
      //console.error('KaartCtrl onEnterBerichten');

      if (dataFactoryConfig.currentModel.get('snelMenuPos') === 'l') {
        if ($scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('toggleSnelMenu links was OPEN => GESLOTEN');
          $scope.closeModalKaartOptiesSmL();
        }
        if ($scope.modalKaartOptiesSmL.isShown()) {
          //console.warn('KaartCtrl enterBerichten toggleSnelMenu links was OPEN => GESLOTEN');
          $scope.closeModalKaartOptiesSmL();
        }
      } else {
        //console.error('KaartCtrl onEnterBerichten');
        if ($scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('toggleSnelMenu rechts was OPEN => GESLOTEN');
          $scope.closeModalKaartOptiesSmR();
        }
        if ($scope.modalKaartOptiesSmR.isShown()) {
          //console.warn('KaartCtrl enterBerichten toggleSnelMenu rechts was OPEN => GESLOTEN');
          $scope.closeModalKaartOptiesSmR();
        }
      }
    });

    function init() {
      //console.error('KaartCtrl init');

      dataFactoryAnalytics.createEvent('trinl', 'app', 'init', '', '1');
      dataFactoryAnalytics.createEvent(
        'kaarten',
        'sessie',
        'kaarten',
        'start',
        '1'
      );

      configKaartenReady = false;
      configLagenReady = false;
      dataFactorySync.initStores();
      //dataFactoryMap.init();
      //dataFactoryOverlay.init();
      syncConfig();
    }
    /**
     * ==============================================================================================================================
     *
     * Events getriggered door andere modules (factories en controllers)
     *
     * ==============================================================================================================================
     */
    var event0 = $rootScope.$on('OverlayReady', function (event, args) {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event OverlayReady: ', args);
      //console.log('*******************************************************************');

      $scope.overlaysReady = args.layer;
    });

    var event1 = $rootScope.$on('MapsReady', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event MapsReady: ', dataFactoryMap.configKaartItems);
      //console.log('*******************************************************************');

      //MapsReady = true;
      initMap();
      initConfigKaarten();
    });

    var event2 = $rootScope.$on('FirstMapsReady', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event FirstMapsReady');
      //console.log('*******************************************************************');
    });

    var event3 = $rootScope.$on('OverlaysReady', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event OverlaysReady: ', dataFactoryOverlay.configOverlays);
      //console.log('*******************************************************************');

      $scope.overlaysReadyNr = 99;
      OverlaysReady = true;
      initConfigLagen();
    });

    var event4 = $rootScope.$on('uitloggenUit', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event uitloggenUit (ingelogd)');
      //console.log('*******************************************************************');

      dataFactoryCeo.currentModel.set('uitgelogd', false);
      dataFactoryCeo.update(dataFactoryCeo.currentModel).then(
        function () { },
        function (err) {
          //console.error('KaartCtrl kan ceo niet wijzigen: ', err);
        }
      );

      $scope.closeModalKaartOpties();
    });

    var event5 = $rootScope.$on('ConfigStoresInit', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event ConfigStoresInit');
      //console.log('*******************************************************************');
      //      storesInitReady = true;
    });

    var event6 = $rootScope.$on('DataStoresInit', function () {
      //console.log('*******************************************************************');
      //console.log('****************************** KaartCtrl.js event DataStoresInit');
      //console.log('*******************************************************************');
      //      storesInitReady = true;
    });

    var event7 = $rootScope.$on('openSnelMenu', function (event, args) {
      //console.warn('++++++ KaartCtrl.js event openSnelMenu: ', args, ' => ', from);

      if (args === undefined && from === undefined) {
        $ionicSideMenuDelegate.toggleLeft();
      }
      if (from === 'home') {
        $scope.openSideMenu();
      }
      from = undefined;
    });

    var event8 = $rootScope.$on('syncConfig', function (event, args) {
      //console.warn('KaartCtrl event config.currentModel: ', dataFactoryConfig.currentModel);
      //console.warn('KaartCtrl event SyncConfig: ', args.message);
      if (args.message !== 'resume') {
        init();
      } else {
        syncConfig();
      }
    });

    var event9 = $rootScope.$on('syncInstellingen', function (args) {
      //console.error('+++++ KaartCtrl.js event SyncInstellingen: ' + args.item + ' = ' + args.value);
    });

    var event10 = $rootScope.$on('minOpacity', function () {
      //console.warn('++++++ KaartCtrl.js event minOpacity');
      //
      // Hier moet eerst $scope.opacity.value herrekend worden op basis van d enieuwe minOpacity
      //
      // Stel opacity = 62.5
      // Trek af minwaarde (62.5 - 25) = 37.5
      // deel door de range 37.5 / 75 = 0.5
      // a = 100 * 0.5 = 50

      //		var o1 = dataFactoryInstellingen.minOpacity /100;
      //		$scope.range = o1 + (parseFloat(Math.round(parseFloat(val / 100) * Math.pow(10, 2)) / Math.pow(10, 2)) * (1 - o1));
      //		$scope.oLevel = +$scope.range * 100;

      //console.error('KaartCtrl minOpacity event $scope.opacity.value, lastOpacity: ', +$scope.opacity.value, +lastOpacity);

      var x = lastOpacity - +dataFactoryInstellingen.minOpacity;
      if (x < +dataFactoryInstellingen.minOpacity) {
        x = 0;
      }
      var range = 100 - +dataFactoryInstellingen.minOpacity;
      var y = x / range;
      var z = y * 100;

      //console.error('KaartCtrl minOpacity event x, range, y, z: ', x, range, y, z);

      lastOpacity = z;
      //console.warn('KaartCtrl.js setOpacity: ', +$scope.opacity.value);
      //		setOpacity(z);
    });

    var event11 = $rootScope.$on('stayOpenTime', function () {
      //console.warn('+++++ KaartCtrl.js event stayOpenTime');

      setStayTime(+dataFactoryInstellingen.stayOpenTime * 1000);
      //console.log('KaartCtrl event11 -stayOpenTime-: ', +dataFactoryInstellingen.stayOpenTime * 1000);
    });

    function openModalInloggen() {
      //console.warn('KaartCtrl openModalInloggen');
      $rootScope.$emit('openModalInloggen');
    }

    $scope.$on('$destroy', onOpenTimeGeoSearch);
    $scope.$on('$destroy', poiSelectedEvent);
    $scope.$on('$destroy', poiDeletedEvent);
    $scope.$on('$destroy', poiUpdatedEvent);
    $scope.$on('$destroy', poiKaartEvent);
    $scope.$on('$destroy', fotoSelectedEvent);
    $scope.$on('$destroy', fotoDeletedEvent);
    $scope.$on('$destroy', fotoUpdatedEvent);
    $scope.$on('$destroy', fotoKaartEvent);
    $scope.$on('$destroy', trackSelectedEvent);
    $scope.$on('$destroy', trackDeletedEvent);
    $scope.$on('$destroy', trackUpdatedEvent);
    $scope.$on('$destroy', trackKaartEvent);
    //$scope.$on('$destroy', syncPoiEvent);
    $scope.$on('$destroy', syncFotoEvent);
    $scope.$on('$destroy', event0);
    $scope.$on('$destroy', event1);
    $scope.$on('$destroy', event2);
    $scope.$on('$destroy', event3);
    $scope.$on('$destroy', event4);
    $scope.$on('$destroy', event5);
    $scope.$on('$destroy', event6);
    $scope.$on('$destroy', event7);
    $scope.$on('$destroy', event8);
    $scope.$on('$destroy', event9);
    $scope.$on('$destroy', event10);
    $scope.$on('$destroy', event11);

    var lastOpacity;

    //	prepareModals1();
    //	prepareModals2();
  }
]);
