/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('InloggenCtrl', ['loDash', '$scope', '$rootScope', '$q', '$window', '$cordovaNetwork', '$ionicPopup', '$ionicPlatform', '$interval', '$timeout', 'dataFactorySyncFS', 'dataFactoryConfigX', 'dataFactoryCeo', 'dataFactoryConfig', 'dataFactoryDropbox', 'dataFactoryAnalytics',
  function (loDash, $scope, $rootScope, $q, $window, $cordovaNetwork, $ionicPopup, $ionicPlatform, $interval, $timeout, dataFactorySyncFS, dataFactoryConfigX, dataFactoryCeo, dataFactoryConfig, dataFactoryDropbox, dataFactoryAnalytics) {

    //console.warn('InloggenCtrl');

    $scope.formInloggen = true;

    var event0 = $scope.$on('$ionicView.enter', function () {
      //console.log('RegistreerCtrl $ionicView.enter');
      resetAll();
    });
    $scope.$on('$destroy', event0);
    var interval;
    var monitorActivation;

    /**
     * Panel wordt gereset
     */
    function resetPanel() {

      //console.warn('RegistreerCtrl resetPanel');

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
     * Reset formulier
     */
    function resetForm() {

      //console.warn('RegistreerCtrl resetForm');

      $scope.formInloggen = true;
    }
    /**
     * Reset gebruiker
     */
    function resetUser() {

      //console.warn('RegistreerCtrl resetUser');

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

      //console.warn('RegistreerCtrl resetWachtwoord');

      $scope.user.mode = '';
      $scope.user.wachtwoord = '';
      $scope.user.wachtwoord2 = '';
    }
    /**
     * Reset alles
     */
    function resetAll() {

      //console.warn('RegistreerCtrl resetAll');

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

      //console.warn('RegistreerCtrl checkWachtwoord');

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
     * Gebruiker inloggen
     * Input user van form Inloggen
     * Anonieme gebruiker inloggen verwijderd anonieme gebruiker volledig
     * Inloggen wordt tevens gebruikt om een uiteglogde gebruiker weer in te loggen
     * Gegevens van deze gebruiker zijn nog intact
     * Na Inloggen gegevens van de ingelogde gebruiker koppelen
     */
    $scope.inloggen = function (user) {

      //console.warn('RegistreerCtrl inloggen: ', user);

      //console.log('ceo: ', dataFactoryCeo);

      if (user.emailadres !== '' && user.wachtwoord !== '') {
        dataFactoryCeo.wachtwoord = user.wachtwoord;

        if (checkWachtwoord(user.wachtwoord)) {
          var params = {
            mode: 'inloggen',
            name: '',
            emailadres: user.emailadres,
            wachtwoord: user.wachtwoord,
            wachtwoord2: user.wachtwoord
          };

          var oudeId = localStorage.getItem('authentication_id');
          var oudeProfielId = localStorage.getItem('authentication_profielId');
          var oudeCeoModel = dataFactoryCeo.currentModel;
          var oudeConfigModel = dataFactoryConfig.currentModel;

          //console.log('RegistreerCtrl Inloggen login user: ', user);

          $ionicPlatform.ready(function () {
            if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || navigator.onLine === true) {
              dataFactoryCeo.login(params).then(function (ceoModel) {

                $scope.bedankt = true;
                $scope.wachtwoordrichtlijn = true;
                $scope.formWachtwoord = false;
                $scope.geregistreerd = true;
                $scope.toelichting = true;

                //console.log('RegistreerCtrl Inloggen login: ', ceoModel);
                //console.error('RegistreerCtrl Inloggen login nieuw, oud: ', ceoModel.get('emailadres'), dataFactoryCeo.currentModel.get('emailadres'));

                if (ceoModel.get('emailadres') !== dataFactoryCeo.currentModel.get('emailadres')) {
                  // ==========================================================================================
                  // Nieuwe ceo door inloggen
                  // ==========================================================================================

                  //console.error('RegistreerCtrl Inloggen nieuwe account');

                  $scope.isRegistreer = ceoModel.get('isRegistreer');
                  $scope.profielId = ceoModel.get('profielId');

                  localStorage.setItem('authentication_id', ceoModel.get('Id'));
                  localStorage.setItem('authentication_profielId', ceoModel.get('profielId'));
                  console.log('InloggenCtrl inloggen id, profiel: ', localStorage.getItem('authentication_id'), localStorage.getItem('authentication_profielId'));


                  $scope.uitgelogd = false;
                  ceoModel.set('uitgelogd', false);

                  dataFactoryCeo.setToken(ceoModel).then(function () {

                    dataFactoryCeo.update(ceoModel).then(function () {

                      dataFactoryConfigX.loadMe().then(function (configModel) {

                        dataFactoryConfigX.update(configModel).then(function () {

                          dataFactoryDropbox.accessToken = null;
                          localStorage.removeItem('accessToken');

                          $timeout(function () {

                            var popupReopen = $ionicPopup.alert({
                              title: 'Inloggen voltooid',
                              template: 'Welkom als vriend van de<br><br><span class="trinl-rood"><b>Natuur en Milieufederatie Limburg</b></span><br><br><span class="trinl-blauw"><b>TRINL wordt opnieuw gestart.</b></span><br><br>Daarna zijn de Tranchot-kaart en jouw persoonlijke gegevens beschikbaar.'
                            });
                            popupReopen.then(function () {
                              if (parseInt(oudeProfielId) === 1) {
                                dataFactorySyncFS.removeFSId(oudeId, oudeProfielId);
                                $q.all([
                                  oudeCeoModel.remove(),
                                  oudeConfigModel.remove()
                                ]).then(function () {
                                  $window.document.location.href = 'index.html';
                                });
                              } else {
                                $window.document.location.href = 'index.html';
                              }
                            });
                          }, 500);
                        });
                        // eslint-disable-next-line no-unused-vars
                      }, function (err) {
                        //console.error('RegistreerCtrl Inloggen nieuwe config record not Found ERROR: ', err);
                      });

                      // eslint-disable-next-line no-unused-vars
                    }, function (err) {
                      //console.error('InloggenCtrl kan ceo niet wijzigen: ', err);
                    });
                  });
                } else {
                  //
                  // Terug naar oude ingelogde gebruiker
                  // Reupdate gebruiker met ingelogde (oude) gebruiker
                  // Event uitloggenUit want we zijn weer ingelogd
                  // Event initCeo omdat profiel in AsideMenu weer hersteld moet worden.
                  // Welkom terug
                  // Restart websocket
                  //
                  //console.log('RegistreerCtrl Inloggen oude account (login met dezelfde account: ', dataFactoryCeo.currentModel);

                  ceoModel.set('uitgelogd', false);
                  $scope.uitgelogd = false;

                  dataFactoryCeo.update(ceoModel).then(function () {

                    $rootScope.$emit('uitloggenUit', {
                      inloggen: true,
                      geregistreerd: false,
                      reopen: false
                    });

                    $rootScope.$emit('initCeo', {
                      message: 'initCeo from Inloggen'
                    });

                    $timeout(function () {

                      var popupReopen = $ionicPopup.alert({
                        title: 'Welkom terug',
                        template: '<br>De Tranchot-kaart en jouw persoonlijke gegevens zijn nu weer beschikbaar.'
                      });
                      popupReopen.then(function () {
                        return true;
                      });
                    }, 500);

                    // eslint-disable-next-line no-unused-vars
                  }, function (err) {
                    //console.error('InloggenCtrl kan ceo niet wijzigen: ', err);
                  });

                  $scope.closeModalInloggen();
                  dataFactoryAnalytics.createEvent('hoofdmenu', 'inloggen', 'ok', '', '1', '');

                  resetAll();

                  $rootScope.$emit('syncConfig', {
                    message: 'inloggen'
                  });
                }

                // eslint-disable-next-line no-unused-vars
              }, function (err) {

                //console.error('RegistreerCtrl inloggen ERROR: ', err);

                dataFactoryAnalytics.createEvent('hoofdmenu', 'inloggen', 'mislukt', '', '0', '');
                resetWachtwoord();
                $scope.onbekend = true;
                $timeout(function () {
                  resetAll();
                  $scope.onbekend = false;
                }, 1500);
              });
            } else {

              //console.error('RegistreerCtrl netwerkverbinding ERROR');

              dataFactoryAnalytics.createEvent('hoofdmenu', 'inloggen', 'notonline', '', '0', '');
              resetWachtwoord();
              $scope.verbinding = true;
              $timeout(function () {
                resetAll();
                $scope.verbinding = false;
              }, 1500);
            }
          });

        } else {

          //console.warn('RegistreerCtrl inloggen wachtwoord niet sterk genoeg');

          dataFactoryAnalytics.createEvent('hoofdmenu', 'inloggen', 'weak', '', '0', '');
          resetWachtwoord();
          $scope.wachtwoordweak = true;
          $timeout(function () {
            resetAll();
            $scope.wachtwoordweak = false;
          }, 1500);
        }
      } else {

        //console.warn('RegistreerCtrl Inloggen niets ingevuld');

        dataFactoryAnalytics.createEvent('hoofdmenu', 'inloggen', 'niets', '', '0', '');
        resetWachtwoord();
        $scope.nietsingevuld = true;
        $timeout(function () {
          $scope.nietsingevuld = false;
          resetAll();
        }, 1500);
      }
    };
    /**
     * Sluit Modal Inloggen
     */
    $scope.closeModalInloggen = function () {
      $scope.ModalInloggen.hide().then(function () {
        //console.error('closeModalInloggen hide SUCCESS: ');
        resetAll();
        // eslint-disable-next-line no-unused-vars
      }, function (err) {
        //console.error('closeModalInloggen ERROR: ', err);
        resetAll();
      });
    };

    $scope.$on('$destroy', function () {
      $scope.ModalInloggen.remove();
    });
  }]);
