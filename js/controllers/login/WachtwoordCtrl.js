/* eslint-disable no-undef */
'use strict';

trinl.controller('WachtwoordCtrl', ['loDash', '$window', '$rootScope', '$scope', '$cordovaNetwork', '$ionicPlatform', '$interval', '$timeout', 'dataFactorySync', 'dataFactorySyncFS', 'dataFactoryCeo', 'dataFactoryAnalytics',
  function (loDash, $window, $rootScope, $scope, $cordovaNetwork, $ionicPlatform, $interval, $timeout, dataFactorySync, dataFactorySyncFS, dataFactoryCeo, dataFactoryAnalytics) {

    //console.warn('WachtwoordCtrl');

    $scope.formWachtwoord = true;

    var event0 = $scope.$on('$ionicView.enter', function () {
      //console.log('WachtwoordCtrl $ionicView.enter');
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

      //console.warn('WachtwoordCtrl resetPanel');

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

      //console.warn('WachtwoordCtrl resetForm');

      $scope.formWachtwoord = true;
    }
    /**
     * Reset gebruiker
     */
    function resetUser() {

      //console.warn('WachtwoordCtrl resetUser');

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

      //console.warn('WachtwoordCtrl resetWachtwoord');

      $scope.user.mode = '';
      $scope.user.wachtwoord = '';
      $scope.user.wachtwoord2 = '';
    }
    /**
     * Reset alles
     */
    function resetAll() {

      //console.warn('WachtwoordCtrl resetAll');

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

      //console.warn('WachtwoordCtrl checkWachtwoord');

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
          //console.log('lower: ', i, ch);
        } else {
          if (ch >= 'A' && ch <= 'Z') {
            uppers++;
            //console.log('upper: ', i, ch);
          } else {
            if (ch >= '0' && ch <= '9') {
              numbers++;
              //console.log('number: ', i, ch);
            } else {
              if (loDash.includes('!?_-+=@#%*', ch)) {
                //console.log('special includes: ', i, ch);
              } else {
                //console.log('special NOT includes: ', i, ch);
                specials = 0;
              }

            }
          }
        }


      }
      //console.log('wachtwoord, lengte: ', wachtwoord, len);
      //console.log('lowers uppers numbers specials: ' + lowers + ' => ' + uppers + ' => ' + numbers + ' => ' + specials);

      if (lowers === 0 || uppers === 0 || numbers === 0 || specials === 0 || len <= 7) {
        return false;
      } else {
        return true;
      }
    }
    /**
     * Registreer een nieuw wachtwoord voor gebruiker
     * De paramater geactiveerd -> false moet hier niet gereset worden. Dez egebruiker blijft geactiveerd ook als er verder niets gebeurd.
     * Wacht op de wijziging van het oude wachtwoord in het nieuwe wachtwoord (oude wachtwoord is nieuwe wachtwoord.
     * Verwijder dan het oude wachtwoord.
     * Indien het oude wachtwoord niet wordt vervangeen (door activericng) dan blijft het oude wachtwoord geldig.
     */
    $scope.nieuwWachtwoord = function (user) {

      //console.warn('WachtwoordCtrl nieuwWachtwoord: ', user);

      if (user.emailadres !== '' && user.wachtwoord !== '') {
        if (checkWachtwoord(user.wachtwoord)) {
          //
          //#### skipped 2 wachtwoorden
          //
          user.wachtwoord2 = user.wachtwoord;

          $scope.wachtwoordenongelijk = false;
          $scope.nietsingevuld = false;

          if (user.wachtwoord === user.wachtwoord2) {

            interval = null;
            monitorActivation = null;
            user.mode = 'wachtwoord';
            var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            user.actualTime = timestamp;
            console.log('NieuwWachtwoord with: ', user);

            $ionicPlatform.ready(function () {
              if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || navigator.onLine === true) {
                //
                dataFactoryCeo.registreer(user).then(function (registratie) {

                  console.error('NieuwWachtwoord opnieuw geregistreerd registratie: ', registratie);

                  var registratieId = registratie.Id;
                  var profielId = registratie.profielId;

                  dataFactoryCeo.setTokenGebruiker(registratieId, profielId);


                  console.error('NieuwWachtwoord opnieuw geregistreerd data SUCCESS');

                  $scope.bedankt = true;
                  $scope.wachtwoordrichtlijn = true;
                  $scope.formWachtwoord = false;
                  $scope.geregistreerd = true;
                  $scope.toelichting = false;

                  //console.log('nieuwWachtwoord wachten op activering');

                  monitorActivation = $timeout(function () {
                    // Deze functie wordt gecancelled indien de registratie wordt afgerond.
                    //console.log('NieuwWachtwoord Waited for waitActivationInterval * waitActivationRepeat milliseconds for activation');

                    resetWachtwoord();
                    $scope.geregistreerd = false;
                    $scope.telaat = true;

                    $timeout(function () {
                      $scope.telaat = false;
                      resetAll();
                    }, 3000);

                  }, waitActivationInterval * waitActivationRepeat);

                  var teller = 0;
                  interval = $interval(function () {
                    teller = teller + 1;

                    $ionicPlatform.ready(function () {
                      if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || navigator.onLine === true) {

                        //
                        //  Hier moet gewacht worden op de gebruiker waarvoor het wachtwoord hersteld is geactiveerd wordt
                        //  In Registreren wordt die beschikbaar door de functie datafactoryCeo.registreer?????
                        //
                        //
                        dataFactoryCeo.loadMe(registratieId).then(function (ceoModel) {
                          console.error('NieuwWachtwoord controle activering ceoModel: ', ceoModel);

                          ceoModel.get('geactiveerd');
                          dataFactoryCeo.update(ceoModel).then(function () {

                          }, function (err) {
                            console.error('WachtwoordCtrl kan ceo niet wijzigen: ', err);
                          });

                          var tmp = ceoModel.get('tmp');

                          if (tmp === '') {
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

                            dataFactoryAnalytics.createEvent('hoofdmenu', 'wachtwoord', 'ok', '', '1', '');

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
                                /*
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
                                */
                                $scope.closeModalWachtwoord();
                                $timeout(function () {
                                  resetAll();
                                  $scope.geactiveerd = false;
                                  $window.document.location.href = 'index.html';
                                }, 500);

                                resetAll();
                                // eslint-disable-next-line no-unused-vars
                              }, function (err) {
                                //console.error('RegistreerCtrl kan ceo niet wijzigen: ', err);
                              });
                              // eslint-disable-next-line no-unused-vars
                            }, function (err) {
                              //console.error('RegistreerCtrl initFS ERROR: ', err);
                            });
                          }
                          /*
                          if (tmp === '') {

                            console.error('NieuwWachtwoord Wow a new wachtwoord!!!!');
                            //
                            $interval.cancel(interval);
                            $timeout.cancel(monitorActivation);

                            $scope.geregistreerd = false;
                            $scope.geactiveerd = true;

                            $timeout(function () {
                              resetAll();
                              $scope.geactiveerd = false;
                              $scope.closeModalWachtwoord();
                            }, 500);

                          }
                          */
                        });
                      }
                    });
                  }, waitActivationInterval, waitActivationRepeat);

                }, function (data) {
                  console.error('WachtwoordCtrl registreer data ERROR: ', data);
                  if (data === 'Emailadres bestaat niet') {
                    resetAll();
                    resetWachtwoord();
                    $scope.onbekend = true;
                    $timeout(function () {
                      $scope.onbekend = false;
                    }, 1500);
                  }
                });
              } else {
                console.error('WachtwoordCtrl registreer geen InternetVerbinding ERROR');
                resetAll();
                resetWachtwoord();
                $scope.verbinding = true;
                $timeout(function () {
                  $scope.verbinding = false;
                }, 1500);
              }
            });
          } else {
            console.error('WachtwoordCtrl Nieuw wachtwoord wachtwoorden ongelijk');
            resetAll();
            resetWachtwoord();
            $scope.wachtwoordenongelijk = true;
            $timeout(function () {
              $scope.wachtwoordenongelijk = false;
            }, 1500);
          }
        } else {
          console.error('WachtwoordCtrl Nieuw wachtwoord wachtwoord voldoet niet');
          resetAll();
          resetWachtwoord();
          $scope.wachtwoordweak = true;
          $timeout(function () {
            $scope.wachtwoordweak = false;
          }, 1500);
        }
      } else {
        resetAll();
        resetWachtwoord();
        $scope.nietsingevuld = true;
        $timeout(function () {
          $scope.nietsingevuld = false;
        }, 1500);
      }
    };

    $scope.closeModalWachtwoord = function () {
      $scope.ModalWachtwoord.hide().then(function () {
        //console.warn('ModalWachtwoord hide finish');
      });
    };

    $scope.$on('$destroy', function () {
      $scope.ModalWachtwoord.remove();
    });
  }]);
