/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('EntryCtrl', ['$scope', '$rootScope', '$state', '$q', '$ionicHistory', '$ionicModal', 'dataFactoryOverlay', 'dataFactoryMap', 'dataFactorySyncFS', 'dataFactoryCeo', 'dataFactoryObjectId', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryConfigKaart', 'dataFactoryConfigLaag',
  function ($scope, $rootScope, $state, $q, $ionicHistory, $ionicModal, dataFactoryOverlay, dataFactoryMap, dataFactorySyncFS, dataFactoryCeo, dataFactoryObjectId, dataFactoryConfig, dataFactoryConfigX, dataFactoryConfigKaart, dataFactoryConfigLaag) {

    //console.warn('EntryCtrl');

    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });

    function startAppKaart() {

      //console.warn('EntryCtrl startAppKaart');
      //console.log('EntryCtrl startAppKaart CEO: ', dataFactoryCeo.currentModel);
      //console.log('EntryCtrl startAppKaart CONFIG: ', dataFactoryConfig.currentModel);

      dataFactoryOverlay.init().then(function () {
        //console.log('EntryCtrl Overlay.init SUCCESS: ', dataFactoryOverlay.configOverlays, dataFactoryOverlay.mijnOverlays);
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          dataFactoryOverlay.ready = true;
          $rootScope.$emit('OverlaysReady');
        }
        dataFactoryMap.init().then(function () {
          //console.log('EntryCtrl Map.init SUCCESS: ', dataFactoryMap.configKaartItems);
          if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            dataFactoryMap.ready = true;
            $rootScope.$emit('MapsReady');
          }
          // eslint-disable-next-line no-unused-vars
        }).catch(function (err) {
          //console.error('EntryCtrl Overlay.init ERROR: ', err);
        });
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        //console.error('EntryCtrl Map.init ERROR: ', err);
      });
      //console.log('EntryCtrl ==>> Kaart');
      $state.go('app.kaart');
    }


    function initConfigkaartlaag() {

      //console.warn('EntryCtrl initConfigkaartlaag');
      //
      //  Eerst gaan we kijken of er reeds configkaar enconfiglaag in LS staan
      //  Indien niet dan moeten er op vertrouwen dat deze gehaald kunnen worden op de normale manier van de backend
      //  Indien configkaart en configlaag gehaald worden van het netwerk worden deze gekopieerd naar de LS
      //
      if (localStorage.getItem('configkaart')) {
        //console.warn('EntryCtrl configkaart in Localstorage');
        dataFactoryConfigKaart.store = JSON.parse(localStorage.getItem('configkaart'));
        dataFactoryConfigKaart.loaded = true;
      } else {
        //console.error('EntryCtrl configkaart NOT IN Localstorage');
      }
      //console.warn('EntryCtrl configkaart: ', dataFactoryConfigKaart.store);

      if (localStorage.getItem('configlaag')) {
        //console.warn('EntryCtrl configlaag in Localstorage');
        dataFactoryConfigLaag.store = JSON.parse(localStorage.getItem('configlaag'));
        dataFactoryConfigLaag.loaded = true;
      } else {
        //console.error('EntryCtrl configlaag NOT IN Localstorage');
      }
      //console.warn('EntryCtrl configlaag: ', dataFactoryConfigLaag.store);

    }
    /**
     * Maak initiele configModel aan
     * Update config met platform, appVersion en gebruikerId
     * configModel wordt geplaatst in store
     * configModel stringify naar localstorage
     * Verder met loadStores
     */
    function initConfig() {

      //console.warn('EntryCtrl initConfig');

      var q = $q.defer();

      if (!dataFactoryCeo.appVersion) {
        dataFactoryCeo.appVersion = '+++++++';
      }

      //console.log('EntryCtrl initConfig appVersion: ', dataFactoryCeo.appVersion);

      dataFactoryConfig.currentModel = new dataFactoryConfig.Model();

      //console.log('EntryCtrl initConfig new configModel (NEW): ', dataFactoryConfig.currentModel);

      dataFactoryConfig.currentModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
      dataFactoryConfig.currentModel.set('appVersion', dataFactoryCeo.appVersion);

      var platform = 'Desktop';
      if (ionic.Platform.isAndroid()) {
        platform = 'Android';
      }
      if (ionic.Platform.isIOS()) {
        platform = 'IOS';
      }

      dataFactoryConfig.currentModel.set('platform', platform);
      dataFactoryConfig.currentModel.setAll();

      //console.log('EntryCtrl initConfig new configModel (gebruikerId, appVersion, platform) : ', dataFactoryConfig.currentModel);

      dataFactoryConfigX.update(dataFactoryConfig.currentModel).then(function () {

        //console.log('EntrCtrl initConfig configModel saved SUCCESS updated configId, gebruikerId: ', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('gebruikerId'));
        //$window.document.location.href = 'index.html';
        dataFactoryCeo.setToken(dataFactoryCeo.currentModel).then(function () {
          startAppKaart();
        });
        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        //console.error('EntrCtrl initConfig configModel update ERROR: ', err);
        startAppKaart();
      });

      return q.promise;
    }
    /**
     * Maak een initiele (anonieme) gebruiker aan.
     * Registreer deze gebruiker in Ceo, Localstorage en (via) in backend
     * Ga daarna verder met initConfig
     */
    function initCeo() {

      //console.warn('EntryCtrl initCeo');

      var q = $q.defer();

      dataFactoryCeo.currentModel = new dataFactoryCeo.Model();
      dataFactoryCeo.currentModel.setAll();
      dataFactoryCeo.currentModel.set('Id', dataFactoryObjectId.create());

      localStorage.setItem('authentication_id', dataFactoryCeo.currentModel.get('Id'));
      localStorage.setItem('authentication_randid', dataFactoryCeo.currentModel.get('randid'));
      localStorage.setItem('authentication_profielId', '1');
      //console.log('EntryCtrl initCeo id, profiel: ', localStorage.setItem('authentication_id'), localStorage.setItem('authentication_profielId'));

      dataFactoryCeo.setToken(dataFactoryCeo.currentModel).then(function () {
        dataFactoryCeo.currentModel.save().then(function () {

          //console.log('EntryCtrl initCeo de token en id zijn nu bekend');

          dataFactoryCeo.update(dataFactoryCeo.currentModel).then(function () {
            dataFactorySyncFS.initFS().then(function () {
              initConfig().then(function () {
                q.resolve();
              });
            });

            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('Entryctrl kan ceo niet wijzigen: ', err);
            dataFactorySyncFS.initFS().then(function () {
              initConfig().then(function () {
                q.resolve();
              });
            });
          });

          //console.log('EntryCtrl initCeo dataFactoryCeo.currentModel saved and updated SUCCESS: ', dataFactoryCeo.currentModel.get('Id'));

          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('EntryCtrl ceo save ERROR: ', err);
          initConfig().then(function () {
            q.resolve();
          });
        });

        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        //console.error('EntryCtrl setToken ERROR: ', err);
        initConfig().then(function () {
          q.resolve();
        });
      });

      return q.promise;
    }
    /**
     */
    function loginUserDesktop() {

      //console.warn('EntryCtrl loginUserDesktop');

      var q = $q.defer();
      //
      // getCeoDesktop levert de meest actuele Ceo op in currentModel
      //
      dataFactoryCeo.getCeoDesktop().then(function () {

        dataFactoryCeo.setToken(dataFactoryCeo.currentModel).then(function () {
          //console.log('EntryCtrl loginUserDesktop LS CEO Id, changedOn: ', dataFactoryCeo.currentModel.get('Id'), dataFactoryCeo.currentModel.get('changedOn'));

          dataFactoryConfigX.getConfigDesktop().then(function () {

            //console.log('EntryCtrl loginUserDesktop LS CONFIG Id, changedOn,  gebruikerId: ', dataFactoryConfig.currentModel.get('Id'), dataFactoryConfig.currentModel.get('changedOn'), dataFactoryConfig.currentModel.get('gebruikerId'));
            startAppKaart();

            // eslint-disable-next-line no-unused-vars
          }, function (err) {

            //console.error('EntryCtrl getConfigDesktop LS ERROR: ', err);

            initConfig().thne(function () {
              q.resolve();
            });

          });
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //console.error('EntryCtrl loginUserDesktop setToken ERROR: ', err);
          initConfig().then(function () {
            q.resolve();
          });
        });

        // eslint-disable-next-line no-unused-vars
      }, function (err) {

        //console.error('EntryCtrl loginUserDesktop getCeoDesktop ERROR: ', err);

        initCeo().then(function () {
          q.resolve();
        });
      });

      return q.promise;
    }

    /**
     * Proces:
     * Bepaal of er reeds een ceo is geplaatst in FS
     * Geen ceo dan eerst via initCeo en initConfig een nieuwe anonieme ceo creeren
     *
     */
    function loginUserMobiel() {

      //console.warn('EntryCtrl loginUserMobiel');

      dataFactoryCeo.getCeoMobiel().then(function () {

        //console.log('EntryCtrl loginUserMobiel FS ceoModel: ', dataFactoryCeo.currentModel.get('Id'));

        dataFactoryConfigX.getConfig().then(function () {

          //console.log('EntryCtrl loginUserMobiel FS configModel: ', dataFactoryConfig.currentModel.get('Id'));

          startAppKaart();

          // eslint-disable-next-line no-unused-vars
        }, function (err) {

          //console.error('EntryCtrl loginUserMobiel FS getConfigMobiel ERROR: ', err);

          initConfig().then(function () {
            q.resolve();
          });
        });

        // eslint-disable-next-line no-unused-vars
      }, function (err) {

        //console.error('EntryCtrl loginUserMobiel FS getCeoMobiel ERROR: ', err);

        initCeo().then(function () {
          q.resolve();
        });
      });
    }
    //
    // Inloggen Modal
    //
    $ionicModal.fromTemplateUrl('login/inloggenModal.html', function (modalInloggen) {
      $scope.ModalInloggen = modalInloggen;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    /**
     * Open de modal Inloggen
     */
    $scope.openModalInloggen = function () {

      //console.warn('EntryCtrl openModalInloggen');

      $scope.user = {
        emailadres: '',
        wachtwoord: ''
      };
      $scope.ModalInloggen.show();
      if (ionic.Platform.isAndroid()) {
        cordova.plugins.Keyboard.show('email');
      }

    };

    $scope.closeModalInloggen = function () {

      //console.warn('EntryCtrl closeModalInloggen');

      $scope.ModalInloggen.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.ModalInloggen.remove();
    });

    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      initConfigkaartlaag();
      loginUserMobiel();
    } else {
      initConfigkaartlaag();
      loginUserDesktop();
    }

  }]);
