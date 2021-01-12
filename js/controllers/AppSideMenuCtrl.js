/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.controller('AppSideMenuCtrl', ['loDash', '$state', '$rootScope', '$scope', '$cordovaNetwork', '$ionicPopover', '$ionicModal', '$ionicPopup', '$ionicPlatform', 'dataFactoryCodePush', 'dataFactoryHelp', 'dataFactoryAlive', 'dataFactoryCeo', 'dataFactoryPoi', 'dataFactoryFoto', 'dataFactoryTrack', 'dataFactoryAnalytics',
  function (loDash, $state, $rootScope, $scope, $cordovaNetwork, $ionicPopover, $ionicModal, $ionicPopup, $ionicPlatform, dataFactoryCodePush, dataFactoryHelp, dataFactoryAlive, dataFactoryCeo, dataFactoryPoi, dataFactoryFoto, dataFactoryTrack, dataFactoryAnalytics) {


    var event0b = $scope.$on('$ionicView.beforeEnter', function () {
      //if (dataFactoryBericht.card) {
        //console.warn('AppSideMenuCtrl $ionicView.beforeLeave');
        $rootScope.$emit('sleepClockBericht');
        $rootScope.$emit('sleepClockFoto');
        $rootScope.$emit('sleepClockPoi');
        $rootScope.$emit('sleepClockTrack');
      //}
    });
    $scope.$on('$destroy', event0b);

    $scope.running = dataFactoryCodePush.running;

    $scope.analytics = function (newState) {
      //console.log('AppSideMenuCtrl Analytics type: ', newState);
      dataFactoryAnalytics.createEvent('hoofdmenu', 'sessie', newState, 'start', '1');
    };

    $scope.cancelStayTimer = function (newState) {
      //console.log('AppSideMenuCtrl cancelStayTimer newState: ', newState);
      dataFactoryAnalytics.createEvent('hoofdmenu', 'sessie', newState, 'start', '1');
    };

    //console.warn('AppSideMenuCtrl');
    /**
     * Ceo store
     * @type {object}
     */
    $scope.ceo = loDash.mapValues(dataFactoryCeo.currentModel, 'value');
    if ($scope.ceo.profielId === undefined) {

      $scope.ceo.avatar = '';
      $scope.ceo.profielId = '1';
      $scope.ceo.uitgelogd = true;
    }
    /**
     * @type {Object}
     */
    //#####var gebruikerId = '';
    /**
     * [mobile description]
     * @type {Boolean}
     */
    $scope.isMobile = false;
    $scope.toelichting = true;
    $scope.wachtwoordrichtlijn = true;

    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $scope.isMobile = true;
      }

    });

    function welkomTerug() {

      //console.warn('AppSideMenuCtrl welkomTerug');

      dataFactoryCeo.loadMe().then(function (ceoModel) {
        ceoModel.setAll();
        //console.log('EntryCtrl ceo.loadMe loginUser SUCCESS: ', ceoModel);
        localStorage.setItem('authentication_id', ceoModel.get('Id'));
        localStorage.setItem('authentication_profielId', ceoModel.get('profielId'));

        dataFactoryCeo.setToken(ceoModel).then(function () {
          dataFactoryCeo.update(ceoModel).then(function () {

            $scope.uitgelogd = false;
            $rootScope.$emit('uitloggenUit', {
              inloggen: false,
              geregistreerd: false,
              reopen: true
            });

            dataFactoryCeo.currentModel.set('uitgelogd', false);
            dataFactoryCeo.currentModel.save();
          });
        });
      });
    }

    function touchIdAndroid() {

      //console.warn('AppSideMenuCtrl touchIdAndroid');

      var client_id = 'cro5_cus1';
      var client_secret = 'godsweerderstraat';
      var disableBackup = true;
      var alertPopup;
      window.FingerprintAuth.isAvailable(function (result) {

        //console.log('AppSideMenuCtrl touchIdAndroid FingerprintAuth.isAvailable result: ', result);

        if (result.isAvailable) {

          if (result.hasEnrolledFingerprints) {
            window.FingerprintAuth.encrypt({
              clientId: client_id,
              clientSecret: client_secret,
              disableBackup: disableBackup,
              dialogTitle: 'Vingerafdruk Authenticatie',
              dialogMessage: 'Plaats vinger op de touch-sensor om in te loggen. Kies annuleer om in te loggen met andere account',
              dialogHind: ''
            }, function (result) {
              if (result.withFingerprint) {
                welkomTerug();
                var popupReopen = $ionicPopup.alert({
                  title: 'Welkom terug',
                  template: 'De Tranchot-kaart en jouw persoonlijke gegevens zijn nu weer beschikbaar.'
                });

                popupReopen.then(function () {
                  return true;
                });

              } else if (result.withPassword) {
                alertPopup = $ionicPopup.alert({
                  title: 'Inloggen (scannen vingerafdruk)',
                  template: 'Scannen vingerafdruk mislukt. Log in met emailadres en wachtwoord'
                });

                alertPopup.then(function () {
                  //console.log('Scannen vingerafdruk mislukt. Log in met emailadres en wachtwoord');
                  $scope.openModalInloggen();
                });
              }
              // eslint-disable-next-line no-unused-vars
            }, function (error) {
              //console.error('Scannen vingerafdruk niet beschikbaar. Reden: ' + error + '<br>Inloggen met emailadres en wachtwoord');
              $scope.openModalInloggen();
            });
          } else {
            //console.log('Geen vingerafdrukken bekend op apparaat.<br>Inloggen met emailadres en wachtwoord');
            $scope.openModalInloggen();
          }
        } else {
          $scope.openModalInloggen();
        }
      }, function () {
        $scope.openModalInloggen();
      });
    }

    function touchIdIOS() {

      //console.warn('AppSideMenuCtrl touchIdIOS: ', window.plugins.touchid);

      window.plugins.touchid.isAvailable(
        function () {
          window.plugins.touchid.verifyFingerprint(
            'Plaats vinger op de touch-sensor om in te loggen. Kies annuleer om in te loggen met andere account', // this will be shown in the native scanner popup
            function () {
              welkomTerug();
              var popupReopen = $ionicPopup.alert({
                title: 'Welkom terug',
                template: 'De Tranchot-kaart en jouw persoonlijke gegevens zijn nu weer beschikbaar.'
              });
              popupReopen.then(function () {
                return true;
              });
            },
            // eslint-disable-next-line no-unused-vars
            function (msg) {
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
    /**
     * Registreren
     *
     */
    $scope.registreren = function () {

      //console.warn('AppSideMenuCtrl registreren');

      $scope.user = {
        emailadres: '',
        wachtwoord: '',
        wachtwoord2: ''
      };
      if (dataFactoryCeo.currentModel.get('profielId') === '1') {
        $scope.openModalRegistreerAnoniem();
      } else {
        $scope.openModalRegistreer();
      }
      //#####  moet nog beveiligen in LS en FS
    };

    $scope.berichten = function () {
      $state.go('berichten.berichten');
    };

    $scope.ingelogd = function (newState) {
      //console.warn('AppSideMenuCtrl ingelogd newState: ', newState);
      var type;
      if (newState === 'pois.pois') {
        type = 'locaties';
      }
      if (newState === 'fotos.fotos') {
        type = 'fotos';
      }
      if (newState === 'tracks.tracks') {
        type = 'sporen';
      }
      dataFactoryAnalytics.createEvent('hoofdmenu', 'sessie', type, 'start', '', '1', '');
      //console.warn('AppSideMenuCtrl uitgelogd, profielId: ', dataFactoryCeo.currentModel.get('uitgelogd'), dataFactoryCeo.currentModel.get('profielId'));

      if (dataFactoryCeo.currentModel.get('uitgelogd')) {
        if (dataFactoryCeo.currentModel.get('profielId') === '1') {
          $state.go(newState);
          $scope.openModalSignIn();
        } else {
          $scope.inloggen();
        }
      } else {
        $state.go(newState);
      }
    };

    $scope.ingelogdBerichten = function () {

      //console.warn('AppSideMenuCtrl uitgelogd, profielId: ', dataFactoryCeo.currentModel.get('uitgelogd'), dataFactoryCeo.currentModel.get('profielId'));

      if (dataFactoryCeo.currentModel.get('uitgelogd')) {
        if (dataFactoryCeo.currentModel.get('profielId') === '1') {
          $scope.openModalSignIn();
        } else {
          $scope.inloggen();
        }
      }
    };
    /**
     * Inloggen
     * Vraag of we inloggen op een bestaande account
     * of een nieuwe account registreren
     * daarna met loadStores de gegevens van de ingelogde gebruiker initueel laden.
     * @return {[type]} [description]
     */
    $scope.inloggen = function () {

      //console.warn('AppSideMenuCtrl inloggen profielId: ', dataFactoryCeo.currentModel.get('profielId'));

      $scope.user = {
        emailadres: '',
        wachtwoord: ''
      };
      if (dataFactoryCeo.currentModel.get('profielId') !== '1') {
        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
          if (ionic.Platform.isIOS()) {
            //console.log('AppSideMenuCtrl inloggen naar IOS TouchId');
            touchIdIOS();
          }
          if (ionic.Platform.isAndroid()) {
            //console.log('AppSideMenuCtrl inloggen naar Android TouchId');
            touchIdAndroid();
          }
        } else {
          $scope.openModalInloggen();
        }
      } else {
        $scope.openModalInloggen();
      }

    };
    /**
     * Uitloggen
     * Verwijder de container in FS van deze gebruiker
     * start opnieuw op als anonieme gebruiker
     * @return {[type]} [description]
     */
    $scope.uitloggen = function () {

      //console.warn('AppSideMenuCtrl uitloggen');

      $scope.ceo = loDash.mapValues(dataFactoryCeo.currentModel, 'value');

      $scope.data = {};

      var poiPopup = $ionicPopup.show({
        title: 'Uitloggen',
        template: 'Je staat nu op het punt om uit te loggen!<br><br>Als je uitlogt zijn jouw persoonlijke gegevens (Berichten, Locaties en Tranchot-kaart) niet meer zichtbaar.',
        scope: $scope,
        buttons: [{
          text: 'Annuleer',
          onTap: function () {
            //console.log('onTap Annuleer: ', $scope.data.poiNaam);
            $scope.data.action = 'Annuleer';
            return $scope.data;
          }
        }, {
          text: '<b>Uitloggen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.data.action = 'Uitloggen';
            return $scope.data;
          }
        }]
      });
      poiPopup.then(function (data) {
        //console.warn('Tapped!', data);

        if (data.action === 'Uitloggen') {

          //				$ionicPush.unregister().then( function() {
          //					$ionicAuth.logout();
          //				});

          var timestamp = dataFactoryAlive.getTimestamp();

          dataFactoryPoi.selected = [];
          dataFactoryFoto.selected = [];
          dataFactoryTrack.selected = [];

          $scope.ceo.uitgelogd = true;
          $rootScope.$emit('uitloggenAan');

          $rootScope.$emit('poiKaart');
          $rootScope.$emit('poisFilter');
          $rootScope.$emit('fotoKaart');
          $rootScope.$emit('fotosFilter');
          $rootScope.$emit('trackKaart');
          $rootScope.$emit('tracksFilter');

          dataFactoryCeo.currentModel.set('uitgelogd', true);
          dataFactoryCeo.currentModel.set('changedOn', timestamp);
          dataFactoryCeo.update(dataFactoryCeo.currentModel).then(function () {

            // eslint-disable-next-line no-unused-vars
          }, function (err) {
            //console.error('AppSideMenuCtrl kan ceo niet wijzigen: ', err);
          });

        }
      });
    };

    $scope.gotoBeheren = function () {

      //console.warn('AppSideMenuCtrl gotoBeheren');

      $state.go('beheren');
    };
    var event0 = $rootScope.$on('uitloggenUit', function () {

      //console.warn('AppSideMenuCtrl event uitloggenUit');

      $scope.closeModalRegistreerAnoniem();
    });
    $scope.$on('$destroy', event0);

    var event1 = $rootScope.$on('appVersionReady', function (event, args) {

      //console.warn('AppSideMenuCtrl event appVersionReady: ', args);

      var version = args.version;
      dataFactoryCeo.appVersion = version;
      $scope.appVersion = version;
    });
    $scope.$on('$destroy', event1);

    var event2 = $rootScope.$on('InitCeo', function () {

      //console.warn('AppSideMenuCtrl event InitCeo: ', dataFactoryCeo);

      appSideMenuProfielUpdate();
    });
    $scope.$on('$destroy', event2);

    function appSideMenuProfielUpdate() {

      //console.warn('AppSideMenuCtrl appSideMenuProfielUpdate');

      $scope.ceo = loDash.mapValues(dataFactoryCeo.currentModel, 'value');
      //
      // Ieder keer als ceoReady of Inloggen wordt getriggerd dan de avatar hier updaten
      // CeoReady wordt getriggerd als
      // Wel moeten alle stores geladen zijn. Bij Inloggen zijn die reeds geladen.
      //
      //console.log('++++++++++++++++++++++++++++++++++++++++++++++');
      //console.log('AppSideMenuCtrl InitCeo');
      //console.log('++++++++++++++++++++++++++++++++++++++++++++++');

      //#####gebruikerId = dataFactoryCeo.currentModel.get('Id');
      //console.log('AppSideMenu Ready: ', dataFactoryCeo.currentModel.get('Id'));
      $scope.avatarSrc = '';
      if ($scope.ceo.profiel === 'anoniem') {
        $scope.avatarSrc = 'images/small_non_existing_id.png';
      }

      $scope.ceo.uitgelogd = dataFactoryCeo.currentModel.get('uitgelogd');
      $scope.profiel = dataFactoryCeo.currentModel.get('profiel');
      $scope.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');

      $scope.avatarLetter = '';
      var avatar = dataFactoryCeo.currentModel.get('avatar').split('.');

      //console.log('AppSideMenu Ready avatar: ', avatar);
      if (avatar.length === 3) {
        $scope.avatarColor = avatar[0];
        $scope.avatarLetter = avatar[1];
        $scope.avatarInverse = avatar[2];
        //console.log('AppSideMenu avatarColor: ', $scope.avatarColor);
        //console.log('AppSideMenu avatarLetter: ', $scope.avatarLetter);
        //console.log('AppSideMenu avatarInverse: ', $scope.avatarInverse);
      }

      //console.log('appSideMenuCtrl Profiel Update: ', $scope.profiel);
      //		}, function(err) {
      //		});

    }

    $scope.openKaart = function () {

      //console.warn('AppSideMenuCtrl openKaart');

      $rootScope.$emit('navigatie', {
        from: 'home'
      });
      $rootScope.$emit('openSnelMenu');

    };

    $scope.openKaart2 = function () {

      //console.warn('AppSideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('hoofdmenu', 'sessie', 'kaarten', 'start', '1');

      $rootScope.$emit('navigatie', {
        from: 'kaart'
      });
      $rootScope.$emit('openSnelMenu');
    };

    function typingHelp(tmp) {
      /*
      var tmp2, tmp3;
      var helpTypes = 'Foto\'s';
      var helpType = 'Foto';
      var helpTyp = 'deze';
      if ($scope.details.mode === 'track') {
        helpTyp = 'dit';
      }

      tmp.naam = tmp.naam.replace('__TYPE__', helpType);
      tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
      tmp3 = tmp2.replace(/__TYPE__/g, helpType);
      tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

      //console.log('HELP tmp: ', tmp);
      */
      $scope.cardHelps.push(tmp);
    }

    function showHelpKaartMenu() {

      $scope.titelHelp = 'Kaartmenu';
      $scope.cardHelps = [];
      $scope.help = 'none';


      var toelichting;

      toelichting = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'kaartmenu-toelichting';
      });
      $scope.cardHelps.push(loDash.mapValues(toelichting, 'value'));
    }

    function showHelpHoofdMenu() {
      $scope.details = {};
      $scope.details.avatarColor = $scope.avatarColor;
      $scope.details.avatarLetter = $scope.avatarLetter;
      $scope.details.avatarInverse = $scope.avatarInverse;


      $scope.titelHelp = 'Hoofdmenu';

      $scope.cardHelps = [];

      var mijnprofiel,
        home,
        berichten,
        locaties,
        fotos,
        sporen,
        versie,
        over,
        privacy,
        disclaimer,
        instellingen,
        registreren,
        inloggen,
        uitloggen,
        wachtwoord;

      mijnprofiel = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-mijnprofiel';
      });
      $scope.cardHelps.push(loDash.mapValues(mijnprofiel, 'value'));

      home = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-home';
      });
      typingHelp(loDash.mapValues(home, 'value'));

      berichten = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-berichten';
      });
      typingHelp(loDash.mapValues(berichten, 'value'));

      locaties = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-locaties';
      });
      typingHelp(loDash.mapValues(locaties, 'value'));

      fotos = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-fotos';
      });
      typingHelp(loDash.mapValues(fotos, 'value'));

      sporen = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-sporen';
      });
      typingHelp(loDash.mapValues(sporen, 'value'));

      versie = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-versie';
      });
      typingHelp(loDash.mapValues(versie, 'value'));

      over = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-over';
      });
      typingHelp(loDash.mapValues(over, 'value'));

      privacy = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-privacy';
      });
      typingHelp(loDash.mapValues(privacy, 'value'));

      disclaimer = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-disclaimer';
      });
      typingHelp(loDash.mapValues(disclaimer, 'value'));

      instellingen = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-instellingen';
      });
      typingHelp(loDash.mapValues(instellingen, 'value'));

      registreren = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-registreren';
      });
      typingHelp(loDash.mapValues(registreren, 'value'));

      inloggen = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-inloggen';
      });
      typingHelp(loDash.mapValues(inloggen, 'value'));

      uitloggen = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-uitloggen';
      });
      typingHelp(loDash.mapValues(uitloggen, 'value'));

      wachtwoord = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'hoofdmenu-wachtwoord';
      });
      typingHelp(loDash.mapValues(wachtwoord, 'value'));
    }

    /**
     * Open Modal RegistreerAnoniem
     */
    $ionicModal.fromTemplateUrl('login/registreerAnoniemModal.html', function (modalRegistreerAnoniem) {
      $scope.ModalRegistreerAnoniem = modalRegistreerAnoniem;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    $scope.openModalRegistreerAnoniem = function () {

      //console.warn('AppSideMenuCtrl openModalRegistreer');

      $ionicPlatform.ready(function () {
        $scope.isOnline = true;
        $scope.ModalRegistreerAnoniem.show();
        if (ionic.Platform.isAndroid()) {
          cordova.plugins.Keyboard.show('email');
        }
      });
    };
    $scope.closeModalRegistreerAnoniem = function () {

      //console.warn('AppSideMenuCtrl closeModalRegistreerAnoniem');

      $scope.ModalRegistreerAnoniem.hide().then(function () { });
    };
    $scope.$on('$destroy', function () {
      $scope.ModalRegistreerAnoniem.remove();
    });
    /**
     * Open Modal Registreer
     */
    $ionicModal.fromTemplateUrl('login/registreerModal.html', function (modalRegistreer) {
      $scope.ModalRegistreer = modalRegistreer;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    $scope.openModalRegistreer = function () {

      //console.warn('AppSideMenuCtrl openModalRegistreer');

      $ionicPlatform.ready(function () {
        if ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) || $cordovaNetwork.isOnline() && (ionic.Platform.isAndroid() || ionic.Platform.isIOS())) {
          $scope.isOnline = true;
        } else {
          $scope.isOnline = false;
        }
        $scope.ModalRegistreer.show();
        if (ionic.Platform.isAndroid()) {
          cordova.plugins.Keyboard.show('email');
        }
      });
    };
    $scope.closeModalRegistreer = function () {

      //console.warn('AppSideMenuCtrl closeModalRegistreer');

      $scope.ModalRegistreer.hide().then(function () { });
    };
    $scope.$on('$destroy', function () {
      $scope.ModalRegistreer.remove();
    });
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

      //console.warn('AppSideMenuCtrl openModalInloggen');

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

      //console.warn('AppSideMenuCtrl closeModalInloggen');

      $scope.ModalInloggen.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.ModalInloggen.remove();
    });

    //
    // Modal SignIn
    //
    $ionicModal.fromTemplateUrl('login/signInModal.html', function (modalSignIn) {
      $scope.ModalSignIn = modalSignIn;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });

    $scope.openModalSignIn = function () {

      //console.warn('AppSideMenuCtrl openModalSignIn');

      $ionicPlatform.ready(function () {
        if ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) || $cordovaNetwork.isOnline() && (ionic.Platform.isAndroid() || ionic.Platform.isIOS())) {
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

      //console.warn('AppSideMenyCtrl closeModalSignIn');

      $scope.ModalSignIn.hide().then(function () {
        //console.warn('ModalSignIn hide finish');
      });
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.ModalSignIn.remove();
      //console.warn('KaartCtrl ModalSignIn is removed!');
    });

    $scope.nieuwWachtwoord = function () {

      //console.warn('AppSideMenuCtrl nieuwWachtwoord');

      $scope.openModalWachtwoord();
    };

    //
    // Modal wachtwoord
    //
    $ionicModal.fromTemplateUrl('login/wachtwoordModal.html', function (modalWachtwoord) {
      $scope.ModalWachtwoord = modalWachtwoord;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    /**
     * @method openModalWachtwoord
     * Open Modal Wachtwoord
     */
    $scope.openModalWachtwoord = function () {

      //console.warn('AppSideMenuCtrl openModalWachtwoord');
      $ionicPlatform.ready(function () {

        if (((ionic.Platform.isAndroid() || ionic.Platform.isIOS()) && $cordovaNetwork.isOnline()) || ((!ionic.Platform.isAndroid() && !ionic.Platform.isIOS() && navigator.onLine))) {
          $scope.isOnline = true;
        } else {
          $scope.isOnline = false;
        }
        $scope.ModalWachtwoord.show();
      });
    };
    /**
     * @method closeModalWachtwoord
     * Sluit Modal Wachtwoord
     */
    $scope.closeModalWachtwoord = function () {

      //console.warn('AppSideMenuCtrl closeModalWachtwoord');

      $scope.ModalWachtwoord.hide().then(function () {
        //console.warn('ModalWachtwoord hide finish');
      });
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.ModalWachtwoord.remove();
      //console.warn('PersoonCtrl ModalWachtwoord is removed!');
    });

    $scope.openHelpKaartMenu = function ($event) {
      console.log('AppSideMenuCtrl openHelpKaartMenu');
      showHelpKaartMenu();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.openHelpHoofdMenu = function ($event) {
      console.log('AppSideMenuCtrl openHelpHoofdMenu');
      showHelpHoofdMenu();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      console.log('AppSideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };
    /*
    $scope.closeHelp = function ($event) {
      console.log('AppSideMenuCtrl closeHelpPopover');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };
    */
    $ionicPopover
      .fromTemplateUrl('helpPopover.html', {
        scope: $scope
      })
      .then(function (helpPopover) {
        $scope.helpPopover = helpPopover;
      });
    $scope.openHelpPopover = function ($event) {
      console.log('AppSideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      console.log('AppSideMenuCtrl closeHelpPopover');
      $scope.helpPopover.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpPopover.remove();
    });
    $ionicModal.fromTemplateUrl(
      'helpModal.html',
      function (helpModal) {
        $scope.helpModal = helpModal;
      },
      {
        scope: $scope
      }
    );
    $scope.openHelpModal = function () {
      console.log('AppSideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      console.log('AppSideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
