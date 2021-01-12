'use strict';

// eslint-disable-next-line no-undef
trinl.controller('SignInCtrl', ['$scope', '$q', '$timeout', '$ionicPopup', '$ionicModal', '$ionicViewSwitcher', 'dataFactoryCeo',
  function ($scope, $q, $timeout, $ionicPopup, $ionicModal, $ionicViewSwitcher, dataFactoryCeo) {

    //console.log('SignInCtrl');
    /**
     * [description]
     * @param  {Object} event [description]
     * @param  {String} args
     * @param  {[type]} 500   [description]
     * @return {[type]}       [description]
     */
    var ikRuimMezelfOp2 = $scope.$on('uitloggenUit', function (event, args) {

      //console.warn('SignInCtrl.js event uitloggenUit: ', args);

      $scope.closeModalSignIn();
      $scope.closeModalRegistreer();

      if (args.geregistreerd) {
        $timeout(function () {
          var popupGeregistreerd = $ionicPopup.alert({
            title: 'Registratie voltooid',
            template: 'Welkom als vriend van de<br><br><b>Natuur en Milieufederatie Limburg</b><br><br>De Tranchot-kaart en jouw persoonlijke gegevens zijn nu beschikbaar.'
          });
          popupGeregistreerd.then(function () {
            return false;
          });
        }, 500);
      }

    });
    $scope.$on('$destroy', ikRuimMezelfOp2);

    $scope.openModalSignIn = function () {
      $scope.ModalKaartOpties.hide();
      $scope.formInloggen = true;
      $scope.ModalSignIn.show();
    };
    $scope.closeModalSignIn = function () {
      var q = $q.defer();
      q.resolve($scope.ModalSignIn.hide());
      return q.promise;
    };

    $scope.closeModalRegistreerAnoniem = function () {
      var q = $q.defer();
      q.resolve($scope.ModalRegistreerAnoniem.hide());
      return q.promise;
    };

    $scope.$on('$destroy', function () {
      $scope.ModalSignIn.remove();
    });
    //
    // Registreer Modal
    //
    $ionicModal.fromTemplateUrl('login/registreerModal.html', function (modalRegistreer) {
      $scope.ModalRegistreer = modalRegistreer;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    });
    /**
     * Open Modal Registreer
     */
    $scope.openModalRegistreer = function () {
      //console.log('SignInCtrl openModalRegistreer');
      $ionicViewSwitcher.nextTransition('none');
      $scope.closeModalSignIn().then(function () {
        //console.log('ModalSignIn is hidden finish');
        $timeout(function () {
          $scope.formInloggen = true;
          $scope.ModalRegistreer.show();
          // eslint-disable-next-line no-undef
          if (ionic.Platform.isAndroid()) {
            $timeout(function () {
              // eslint-disable-next-line no-undef
              cordova.plugins.Keyboard.show();
              //console.log('SignInCtrl show keyboard');
            }, 0);
          }
        }, 500);
      });
    };
    $scope.closeModalRegistreer = function () {
      $scope.ModalRegistreer.hide().then(function () {
      });
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
      //console.log('SignInCtrl openModalInloggen');
      $ionicViewSwitcher.nextTransition('none');
      $scope.closeModalSignIn().then(function () {
        //console.log('ModalSignIn is hidden finish');
        $scope.ModalInloggen.show();
        // eslint-disable-next-line no-undef
        if (ionic.Platform.isAndroid()) {
          // eslint-disable-next-line no-undef
          cordova.plugins.Keyboard.show('email');
        }
      });

    };
    $scope.closeModalInloggen = function () {
      $scope.ModalInloggen.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.ModalInloggen.remove();
    });
    //
    // Wachtwoord Modal
    //
    $ionicModal.fromTemplateUrl('login/wachtwoordModal.html', function (modalWachtwoord) {
      $scope.ModalWachtwoord = modalWachtwoord;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    $scope.openModalWachtwoord = function () {
      $scope.ModalWachtwoord.show();
    };
    $scope.closeModalWachtwoord = function () {
      $scope.ModalWachtwoord.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.ModalWachtwoord.remove();
    });
    //
    // Disclaimer Modal
    //
    $ionicModal.fromTemplateUrl('disclaimerModal.html', function (modalDisclaimer) {
      $scope.ModalDisclaimer = modalDisclaimer;
    }, {
      scope: $scope,
      animation: 'slide-in-left',
      focusFirstInput: true
    });
    $scope.openModalDisclaimer = function () {
      $scope.ModalDisclaimer.show();
    };
    $scope.closeModalDisclaimer = function () {
      $scope.ModalDisclaimer.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.ModalDisclaimer.remove();
    });

    var event0 = $scope.$on('$ionicView.enter', function () {
      //console.log('SignInCtrl $ionicView.enter');
      /**
       * profielId in Ceo
       * @type {String}
       */
      $scope.profielId = dataFactoryCeo.currentModel.get('profielId');
      /**
       * isRegistreer in Ceo
       * @type {Boolean}
       */
      $scope.isRegistreer = dataFactoryCeo.currentModel.get('isRegistreer');
      /**
       * Id in Ceo
       * @type {String}
       */
      $scope.id = dataFactoryCeo.currentModel.get('Id');
      /**
       * Gebruiker
       * @type {Object}
       */
      $scope.gebruiker = {};
      /**
       * Uitgelogd in store config
       * @type {[type]}
       */
      $scope.uitgelogd = dataFactoryCeo.currentModel.get('uitgelogd');
    });
    $scope.$on('$destroy', event0);

  }]);

