/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('RegistreerCtrl', ['loDash', '$scope', '$rootScope', '$q', '$cordovaNetwork', '$ionicPlatform', '$interval', '$timeout', 'dataFactoryMap', 'dataFactoryOverlay', 'dataFactorySync', 'dataFactorySyncFS', 'dataFactoryObjectId', 'dataFactoryConfigX', 'dataFactoryCeo', 'dataFactoryPersoon', 'dataFactoryConfig', 'dataFactoryInstellingen', 'dataFactoryAnalytics',
  function (loDash, $scope, $rootScope, $q, $cordovaNetwork, $ionicPlatform, $interval, $timeout, dataFactoryMap, dataFactoryOverlay, dataFactorySync, dataFactorySyncFS, dataFactoryObjectId, dataFactoryConfigX, dataFactoryCeo, dataFactoryPersoon, dataFactoryConfig, dataFactoryInstellingen, dataFactoryAnalytics) {

    ////console.warn('RegistreerCtrl');

    $scope.formRegistreer = true;

    var event0 = $scope.$on('$ionicView.enter', function () {
      console.log('RegistreerCtrl $ionicView.enter');
      resetAll();
    });
    $scope.$on('$destroy', event0);
    /**
     * Pauze tussen 2 controlles op activering
     * @type {Number}
     */
    var waitActivationInterval = 1000;
    /**
     * Aantal controlles op activering
     * @type {Number}
     */
    var waitActivationRepeat = 180;
    var interval;
    var monitorActivation;

    /**
     * Panel wordt gereset
     */
    function resetPanel() {

      ////console.warn('RegistreerCtrl resetPanel');

      $scope.profielId = dataFactoryCeo.currentModel.get('profielId');
      $scope.isRegistreer = dataFactoryCeo.currentModel.get('isRegistreer');
      $scope.geregistreerd = false;

      $scope.reedsbekend = false;
      $scope.onbekend = false;
      $scope.wachtwoordenongelijk = false;
      $scope.bedankt = false;
      $scope.telaat = false;
      $scope.nietsingevuld = false;
      $scope.wachtwoordweak = false;
      $scope.wachtwoordrichtlijn = true;
      $scope.toelichting = true;
      $scope.verbinding = false;
    }
    /**
     * Reset formulieren
     */
    function resetForm() {

      ////console.warn('RegistreerCtrl resetForm');

      $scope.formRegistreer = true;
    }
    /**
     * Reset gebruiker
     */
    function resetUser() {

      ////console.warn('RegistreerCtrl resetUser');

      $scope.user = {
        mode: '',
        emailadres: '',
        wachtwoord: '',
        wachtwoord2: ''
      };
    }
    /**
     * Reset wachtwoord
     */
    function resetWachtwoord() {

      ////console.warn('RegistreerCtrl resetWachtwoord');

      $scope.user.mode = '';
      $scope.user.wachtwoord = '';
      $scope.user.wachtwoord2 = '';
    }
    /**
     * Reset alles
     */
    function resetAll() {

      ////console.warn('RegistreerCtrl resetAll');

      if (interval) {
        $interval.cancel(interval);
      }
      if (monitorActivation) {
        $timeout.cancel(monitorActivation);
      }
      resetPanel();
      resetForm();
      resetUser();
    }

    function checkWachtwoord(wachtwoord) {

      ////console.warn('RegistreerCtrl checkWachtwoord');

      var len = wachtwoord.length;
      var lowers = 0;
      var uppers = 0;
      var numbers = 0;
      var specials = 1;
      var i = 0;

      for (i = 0; i < len; i++) {
        var ch = wachtwoord.substr(i, 1);
        if (ch >= 'a' && ch <= 'z') {
          lowers++;
          //console.warn('lower: ', i, ch);
        } else {
          if (ch >= 'A' && ch <= 'Z') {
            uppers++;
            //console.warn('upper: ', i, ch);
          } else {
            if (ch >= '0' && ch <= '9') {
              numbers++;
              //console.warn('number: ', i, ch);
            } else {
              if (loDash.includes('!?_-+=@#%*', ch)) {
                //console.warn('special includes: ', i, ch);
              } else {
                //console.warn('special NOT includes: ', i, ch);
                specials = 0;
              }

            }
          }
        }
      }
      //console.warn('wachtwoord, lengte: ', wachtwoord, len);
      //console.warn('lowers uppers numbers specials: ' + lowers + ' => ' + uppers + ' => ' + numbers + ' => ' + specials);

      if (lowers === 0 || uppers === 0 || numbers === 0 || specials === 0 || len <= 7) {
        return false;
      } else {
        return true;
      }
    }
    /*
     *
     * Registreer gebruiker input: user (from registreer template form)
     * Anonieme gebruiker wordt geupdate naar geregistreerde gebruiker
     * Niet anonieme gebruiker registreert een nieuwe gebruiker
     * Backend stuurt activation email naar gebruiker
     * Wacht totdat gebruiker met Id 'geactiveerd' is set door validation.
     * Anonieme gebruiker moet hersteld worden als het registreren noet wordt voltooid
     */
    $scope.registreer = function (user) {

      //console.warn('RegistreerCtrl registreer');

      var nieuweCeoId;
      var ceoModel;
      var oudeCeoId = localStorage.getItem('authentication_id');
      var oudeProfielId = localStorage.getItem('authentication_profielId');

      console.log('Registreer oudeCeoId: ', oudeCeoId);
      console.log('Registreer oudeProfielId: ', oudeProfielId);

      if (user.emailadres !== '' && user.wachtwoord !== '') {
        dataFactoryCeo.wachtwoord = user.wachtwoord;
        if (checkWachtwoord(user.wachtwoord)) {

          $scope.wachtwoordenongelijk = false;
          $scope.nietsingevuld = false;

          if (oudeProfielId === '1') {
            nieuweCeoId = oudeCeoId;
          } else {
            nieuweCeoId = dataFactoryObjectId.create();
          }

          console.log('Registreer nieuweCeoId: ', nieuweCeoId);

          user.wachtwoord2 = user.wachtwoord;

          if (user.wachtwoord === user.wachtwoord2) {

            interval = null;
            monitorActivation = null;
            user.mode = 'registreer';
            user.id = nieuweCeoId;

            console.log('Registreer emailLogin with: ', user);

            $ionicPlatform.ready(function () {
              if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || navigator.onLine === true) {
                //
                // in het Object user staat ook de nieuwe Id.
                dataFactoryCeo.registreer(user).then(function () {
                  console.log('Registreer user accoord: ', user);

                  $scope.bedankt = true;
                  $scope.wachtwoordrichtlijn = true;
                  $scope.formRegistreer = false;
                  $scope.geregistreerd = true;
                  $scope.toelichting = false;
                  // Wachten op geactiveerd = 1
                  // Indien dit niet gebeurd voordat de tijd voorbij is gebruiker terugdraaien naar anoniem
                  console.log('RegistreerCtrl wachten op activering');

                  monitorActivation = $timeout(function () {
                    //
                    // Deze functie wordt gecancelled indien de registratie wordt afgerond.
                    //
                    console.error('RegistreerCtrl WAITING SECONDS FOR ACTIVATION: ', (waitActivationInterval * waitActivationRepeat) / 1000);

                    resetWachtwoord();
                    $scope.geregistreerd = false;
                    $scope.telaat = true;

                    $timeout(function () {
                      $scope.telaat = false;
                      resetAll();
                    }, 5000);

                  }, waitActivationInterval * waitActivationRepeat);

                  var teller = 0;
                  interval = $interval(function () {
                    teller = teller + 1;

                    $ionicPlatform.ready(function () {
                      if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || navigator.onLine === true) {

                        console.log('RegistreerCtrl Registreren wacht op nieuwe gebruiker: ', nieuweCeoId);

                        dataFactoryCeo.loadMe(nieuweCeoId).then(function (model) {
                          ceoModel = model;
                          var geactiveerd = ceoModel.get('geactiveerd');

                          if (geactiveerd) {

                            $interval.cancel(interval);
                            $timeout.cancel(monitorActivation);

                            console.log('RegistreerCtrl Registreren Ahaaa!! de nieuwe gebruiker: ', ceoModel);

                            $scope.geregistreerd = false;
                            $scope.isRegistreer = ceoModel.get('isRegistreer');
                            $scope.profielId = ceoModel.get('profielId');

                            $scope.uitgelogd = false;

                            $rootScope.$emit('uitloggenUit', {
                              inloggen: false,
                              geregistreerd: true,
                              reopen: false
                            });
                            ceoModel.set('uitgelogd', false);
                            resetAll();

                            dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'ok', '', '1', '');

                            $scope.closeModalRegistreer();

                            // ======================================================================================================================
                            //  Timers gestopt. Nieuwe gebruiker geregistreerd: ceoModel
                            // ======================================================================================================================

                            // ==========================================================================================
                            // Nieuwe parameters naar LS tbv mappenstructuur
                            // Eerst de nieuwe FS mappen aanmaken
                            // Token opnieuw genereren op basis van nieuwe ceo
                            // Ceo updaten, ceo naar LS en FS
                            // Gebruiker verwijderen van Backend
                            // De oude mappenstructuur verwijderen (indien profielId = 1)
                            // Laden van de stores van backend naar stores. Indien mobile van FS
                            // ##### Indien mobiel dan zijn de stores niet synchroon met de Backend. Dit oplossen door ook syncdown uit tevoeren
                            // ==========================================================================================

                            localStorage.setItem('authentication_id', ceoModel.get('Id'));
                            localStorage.setItem('authentication_profielId', ceoModel.get('profielId'));
                            
                            dataFactorySync.initStores();

                            dataFactorySyncFS.initFS().then(function () {
                              dataFactoryCeo.setToken(ceoModel).then(function () {
                                dataFactoryCeo.update(ceoModel).then(function () {
                                });
                                var persoonModel = new dataFactoryPersoon.Model();
                                persoonModel.set('gebruikerId', nieuweCeoId);
                                persoonModel.save().then(function (persoonModel) {
                                  var persoonId = persoonModel.get('Id');
                                  ceoModel.set('persoonId', persoonId);
                                  dataFactoryCeo.update(ceoModel).then(function () {

                                    // eslint-disable-next-line no-unused-vars
                                  }, function (err) {
                                    //console.error('InloggenCtrl kan ceo niet wijzigen: ', err);
                                  });
                                });

                                if (oudeProfielId === '1') {
                                  dataFactorySyncFS.removeFSId(oudeCeoId, oudeProfielId);
                                }
                                //
                                // ====================================================================================
                                // Nieuwe config
                                // Haal config op van Backend met loadMe
                                // Update config, config in LS en FS
                                // Verwijder oude config van Backend
                                // converteer inBackend alle gegevens van oude Id naar nieuwe Id
                                // Haal persoonModel op dmv syncDown
                                // Rond inloggen af met bevestiging
                                // ====================================================================================
                                //
                                if (oudeProfielId !== '1') {

                                  var configModel = new dataFactoryConfig.Model();

                                  configModel.setAll();
                                  configModel.set('gebruikerId', nieuweCeoId);
                                  configModel.set('appVersion', dataFactoryCeo.appVersion);

                                  var platform = 'Desktop';
                                  if (ionic.Platform.isAndroid()) {
                                    platform = 'Android';
                                  }
                                  if (ionic.Platform.isIOS()) {
                                    platform = 'IOS';
                                  }
                                  configModel.set('platform', platform);

                                  dataFactoryConfigX.update(configModel).then(function () {

                                  });
                                } else {
                                  dataFactoryConfigX.loadMe().then(function (configModel) {
                                    dataFactoryInstellingen.init();
                                    dataFactoryConfigX.update(configModel);
                                    dataFactoryMap.init();
                                    dataFactoryOverlay.init();

                                    console.log('RegistreerCtrl Registreren nieuwe config geupdate in LS en FS SUCCESS');
                                    // eslint-disable-next-line no-unused-vars
                                  }, function (err) {
                                    //console.error('RegistreerCtrl Registreren nieuwe config record not Found ERROR: ', JSON.parse(err));
                                  });
                                }

                                resetAll();

                                $timeout(function () {
                                  $rootScope.$emit('syncConfig', {
                                    message: 'registreren'
                                  });
                                }, 500);
                                // eslint-disable-next-line no-unused-vars
                              }, function (err) {
                                //console.error('RegistreerCtrl kan ceo niet wijzigen: ', err);
                              });
                              // eslint-disable-next-line no-unused-vars
                            }, function (err) {
                              //console.error('RegistreerCtrl initFS ERROR: ', err);
                            });
                          }
                        });
                      }
                    });
                  }, waitActivationInterval, waitActivationRepeat);

                  // eslint-disable-next-line no-unused-vars
                }, function (error) {
                  //console.error('Registreer emailLogin ERROR: ', error);
                  dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'mislukt', '', '0', '');
                  resetWachtwoord();
                  $scope.reedsbekend = true;
                  $timeout(function () {
                    $scope.reedsbekend = false;
                    resetAll();
                  }, 1500);

                });
              } else {
                dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'notonline', '', '0', '');
                resetWachtwoord();
                $scope.verbinding = true;
                $timeout(function () {
                  $scope.verbinding = false;
                  resetAll();
                }, 1500);

              }
            });
          } else {
            dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'ongelijk', '', '0', '');
            resetWachtwoord();
            $scope.wachtwoordenongelijk = true;
            $timeout(function () {
              $scope.wachtwoordenongelijk = false;
              resetAll();
            }, 1500);
          }

        } else {
          dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'weak', '', '0', '');
          resetWachtwoord();
          $scope.wachtwoordweak = true;
          $timeout(function () {
            $scope.wachtwoordweak = false;
            resetAll();
          }, 1500);

        }

      } else {
        dataFactoryAnalytics.createEvent('hoofdmenu', 'registreer', 'nothing', '', '0', '');
        resetWachtwoord();
        $scope.nietsingevuld = true;
        $timeout(function () {
          $scope.nietsingevuld = false;
          resetAll();
        }, 1500);
      }

    };
    /**
     * Sluit Modal Registreer
     */
    $scope.closeModalRegistreer = function () {
      $scope.ModalRegistreer.hide().then(function () {
      });
    };
    $scope.$on('$destroy', function () {
      $scope.ModalRegistreer.remove().then(function () {
      });
    });
  }]);
