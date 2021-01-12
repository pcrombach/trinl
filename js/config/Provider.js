'use strict';
/**
 * @class config
 * Angular UI router and $ionic provider
 * @requires $stateProvider
 * @requires $urlRouterProvider
 * @requires $momentProvider
 * @requires $ionicAppProvider
 * @return {Object} config
 */

// eslint-disable-next-line no-undef
trinl.config(['$cordovaInAppBrowserProvider', '$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$momentProvider',
  function ($cordovaInAppBrowserProvider, $ionicConfigProvider, $stateProvider, $urlRouterProvider, $momentProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);

    $ionicConfigProvider.views.maxCache(50);

    $momentProvider
      .asyncLoading(false)
      .scriptUrl('');

    var defaultOptions = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no',
      hidespinner: 'yes'
    };

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'appSideMenu.html',
        controller: 'AppSideMenuCtrl'
      })

      .state('app.profiel', {
        url: '/profiel',
        views: {
          'menuContent': {
            templateUrl: 'profiel.html',
            controller: 'ProfielCtrl'
          }
        }
      })

      .state('app.entry', {
        url: '/entry',
        views: {
          'menuContent': {
            templateUrl: 'login/entry.html',
            controller: 'EntryCtrl'
          }
        }
      })

      .state('app.kaart', {
        url: '/kaart',
        resolve: {
          snelMenu: ['$rootScope', function ($rootScope) {
            $rootScope.$emit('openSnelMenu');
            return;
          }]
        },
        views: {
          'menuContent': {
            templateUrl: 'kaart.html',
            controller: 'KaartCtrl'
          }
        }
      })

      .state('app.persoon', {
        url: '/persoon',
        views: {
          'menuContent': {
            templateUrl: 'persoon.html',
            controller: 'PersoonCtrl'
          }
        }
      })
      .state('pois', {
        url: '/pois',
        cache: false,
        abstract: true,
        templateUrl: 'poisSideMenu.html',
        controller: 'PoisSideMenuCtrl',
        controllerAs: 'PoisSideMenuCtrl'
      })

      .state('pois.pois', {
        url: '/pois',
        views: {
          'menuPoiContent': {
            templateUrl: 'pois.html',
            controller: 'PoisCtrl',
            controllerAs: 'PoisCtrl'
          }
        }

      })

      .state('pois.poiCard', {
        url: '/poicard/:Id',
        params: {
          Id: {}
        },
        views: {
          'menuPoiContent': {
            templateUrl: 'poiCard.html',
            controller: 'PoiCardCtrl',
            controllerAs: 'PoiCardCtrl'
          }
        }
      })

      .state('berichten', {
        url: '/berichten',
        cache: false,
        abstract: true,
        templateUrl: 'berichtenSideMenu.html',
        controller: 'BerichtenSideMenuCtrl'
      })

      .state('berichten.berichten', {
        url: '/berichten',
        views: {
          'menuBerichtContent': {
            templateUrl: 'berichten.html',
            controller: 'BerichtenCtrl'
          }
        }
      })

      .state('berichten.berichtCard', {
        url: '/berichten/berichtcard/:Id',
        views: {
          'menuBerichtContent': {
            templateUrl: 'berichtCard.html',
            controller: 'BerichtCardCtrl'
          }
        }
      })

      .state('berichten.berichtForm', {
        url: '/berichtform',
        views: {
          'menuBerichtContent': {
            templateUrl: 'berichtFormModal.html',
            controller: 'BerichtFormCtrl'
          }
        }
      })

      .state('fotos', {
        url: '/fotos',
        cache: false,
        abstract: true,
        templateUrl: 'fotosSideMenu.html',
        controller: 'FotosSideMenuCtrl'
      })

      .state('fotos.fotos', {
        url: '/fotos',
        views: {
          'menuFotoContent': {
            templateUrl: 'fotos.html',
            controller: 'FotosCtrl'
          }
        }
      })

      .state('fotos.fotoCard', {
        url: '/fotocard/:Id',
        views: {
          'menuFotoContent': {
            templateUrl: 'fotoCard.html',
            controller: 'FotoCardCtrl'
          }
        }
      })

      .state('tracks', {
        url: '/tracks',
        cache: false,
        abstract: true,
        templateUrl: 'tracksSideMenu.html',
        controller: 'TracksSideMenuCtrl'
      })

      .state('tracks.tracks', {
        url: '/tracks',
        views: {
          'menuTrackContent': {
            templateUrl: 'tracks.html',
            controller: 'TracksCtrl'
          }
        }
      })

      .state('tracks.trackCard', {
        url: '/trackcard/:Id',
        views: {
          'menuTrackContent': {
            templateUrl: 'trackCard.html',
            controller: 'TrackCardCtrl'
          }
        }
      })
      .state('app.over', {
        url: '/over',
        views: {
          'menuContent': {
            templateUrl: 'over.html'
          }
        }
      })

      .state('app.dash', {
        url: '/dash',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('app.privacy', {
        url: '/privacy',
        views: {
          'menuContent': {
            templateUrl: 'privacy.html',
            controller: 'PrivacyCtrl'
          }
        }
      })

      .state('app.disclaimer', {
        url: '/disclaimer',
        views: {
          'menuContent': {
            templateUrl: 'disclaimer.html',
            controller: 'DisclaimerCtrl'
          }
        }
      })

      .state('app.instellingen', {
        url: '/instellingen',
        views: {
          'menuContent': {
            templateUrl: 'instellingen.html',
            controller: 'InstellingenCtrl'
          }
        }
      })

      .state('app.fotodropbox', {
        url: '/fotodropbox',
        views: {
          'menuContent': {
            templateUrl: 'dropbox.html',
            controller: 'FotoDropboxCtrl'
          }
        }
      })

      .state('app.poidropbox', {
        url: '/poidropbox',
        views: {
          'menuContent': {
            templateUrl: 'dropbox.html',
            controller: 'PoiDropboxCtrl'
          }
        }
      })

      .state('app.trackdropbox', {
        url: '/trackdropbox',
        views: {
          'menuContent': {
            templateUrl: 'dropbox.html',
            controller: 'TrackDropboxCtrl'
          }
        }
      })
      /*
      .state('handleiding', {
        url: '/handleiding',
        abstract: true,
        templateUrl: 'handleiding/helpSideMenu.html',
        controller: 'HelpSideMenuCtrl'
      })

      .state('handleiding.handleiding_ss', {
        url: '/handleiding_ss',
        cache: false,
        views: {
          'menuHelpContent': {
            templateUrl: 'handleiding/help_ss.html',
            controller: 'Help_ssCtrl'
          }
        }
      })

      .state('handleiding.handleiding_qa', {
        url: '/handleiding_qa',
        views: {
          'menuHelpContent': {
            templateUrl: 'handleiding/help_qa.html',
            controller: 'Help_qaCtrl'
          }
        }
      })

      .state('handleiding.handleiding_tx', {
        url: '/handleiding_tx',
        views: {
          'menuHelpContent': {
            templateUrl: 'handleiding/help_tx.html',
            controller: 'Help_txCtrl'
          }
        }
      })
      */
      .state('poitagselect', {
        url: '/poitagselect',
        templateUrl: 'tags.html',
        controller: 'PoiCardCtrl'
      })

      .state('app.reset', {
        url: '/reset',
        views: {
          'menuContent': {
            templateUrl: 'reset.html',
            controller: 'AppSideMenuCtrl'
          }
        }
      });

    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
      $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
    }

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/entry');

  }
]);
