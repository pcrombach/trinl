/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.controller('BerichtFormCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', 'dataFactoryBericht', 'dataFactoryBerichtSup', 'dataFactoryCeo',
  function ($scope, $state, $rootScope, $ionicPopup, dataFactoryBericht, dataFactoryBerichtSup, dataFactoryCeo) {

    console.warn('BerichtFormCtrl enter');

    //	var converter = new showdown.Converter();

    $scope.editorCols = window.innerWidth;
    console.log('BerichtenCtrl editorCols: ', $scope.editorCols);
    $scope.editorRows = window.innerHeight;
    console.log('BerichtenCtrl editorRows: ', $scope.editorRows);

    var berichtModel;
    var berichtSupModel;

    $scope.bericht = {};
    $scope.bericht.uitgelogd = dataFactoryCeo.currentModel.get('uitgelogd');

    if (!$scope.bericht.uitgelogd) {
      $scope.bericht.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');
      $scope.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');
    }
    $scope.bericht.naam = '';
    $scope.bericht.tekst = '';

    $scope.closeBericht = function () {
      console.warn('BerichtFormCtrl closeBericht');
      $state.go('berichten.berichten');
    };

    function initxData(berichtModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!berichtModel.xData) {
        berichtModel.xData = {};
        console.log('BerichtenCtrl updateBericht xData: ', berichtModel.xData);
      }
      if (!berichtModel.xData.pois) {
        berichtModel.xData.pois = [];
        console.log('BerichtenCtrl updateBericht xData.pois: ', berichtModel.xData.pois);
      }
      if (!berichtModel.xData.fotos) {
        berichtModel.xData.fotos = [];
        console.log('BerichtenCtrl updateBericht xData.fotos: ', berichtModel.xData.fotos);
      }
      if (!berichtModel.xData.tags) {
        berichtModel.xData.tags = [];
        console.log('BerichtenCtrl updateBericht xData.tags: ', berichtModel.xData.tags);
      }
      if (!berichtModel.xData.groep) {
        berichtModel.xData.groep = '';
        console.log('BerichtenCtrl updateBericht xData.groep: ', berichtModel.xData.groep);
      }
    }

    $scope.saveBericht = function (bericht) {

      console.warn('BerichtFormCtrl saveBericht: ', bericht);

      if (bericht.naam !== '') {
        berichtModel = new dataFactoryBericht.Model();

        console.warn('BerichtFormCtrl nieuw BerichtModel: ', berichtModel);

        berichtModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        berichtModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        berichtModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        berichtModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        var avatar = dataFactoryCeo.currentModel.get('avatar').split('.');
        berichtModel.set('avatarColor', avatar[0]);
        berichtModel.set('avatarLetter', avatar[1]);
        berichtModel.set('avatarInverse', avatar[2]);

        berichtModel.set('sendEmail', true);
        berichtModel.set('naarId', '');
        berichtModel.set('context', '');

        if (bericht.naam.length + bericht.tekst.length > 7500) {
          $ionicPopup.alert({
            title: 'WIjzigen tekst',
            template: 'De tekst mag maximaal 7500 karakters lang zijn.<br><br>De tekst is afgekort opgeslagen.'
          });
        }

        berichtModel.set('naam', bericht.naam.substr(0, 7500));
        $scope.bericht.naam = bericht.naam.substr(0, 7500);
        berichtModel.set('tekst', bericht.tekst.substr(0, 7500));
        $scope.bericht.tekst = bericht.tekst.substr(0, 7500);
        berichtModel.set('afzender', bericht.gebruikerNaam);
        berichtModel.set('xprive', false);
        berichtModel.set('yprive', true);
        berichtModel.set('groepenId', '58109a4308dc9b508f607250');

        berichtModel.save().then(function () {

          initxData(berichtModel);

          berichtSupModel = new dataFactoryBerichtSup.Model();
          berichtSupModel.set('xnew', true);
          berichtSupModel.set('xread', 0);
          berichtSupModel.set('star', false);
          berichtSupModel.set('up', false);
          berichtSupModel.set('berichtId', berichtModel.get('Id'));
          berichtSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));

          berichtSupModel.save().then(function () {
            console.error('BerichtFormCtrl berichtSupModel saved: ', berichtSupModel);
            
          }, function (err) {
            console.error('BerichtFormCtrl saveBericht save ERROR: ', err);
          });
          //$rootScope.$emit('bericht', {
          //operation: 'add'
          //});
          console.log('BerichtCtrl bericht saved. emit nieuwbericht');
        }, function () {
          console.log('BerichtCtrl bericht saved ERROR save: ', berichtModel);
          //$rootScope.$emit('bericht', {
          //operation: 'add'
          //});
        });
        $scope.bericht.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');
        $scope.bericht.naam = '';
        $scope.bericht.tekst = '';
        $rootScope.$emit('updateBerichten');
        $scope.closeBerichtForm();
        $rootScope.$emit('berichtenFilter');
        $state.go('berichten.berichten');
      } else {
        $ionicPopup.confirm({
          title: 'Verstuur bericht',
          content: 'Je hebt geen Onderwerp én geen Bericht ingevuld.<br>Een bericht moet minstens een Onderwerp hebben<br><br><b>Bericht is niet verstuurd.</b>',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $scope.closeBerichtForm();
              $rootScope.$emit('berichtenFilter');
              $state.go('berichten.berichten');
            }
          }]
        });
      }
    };
  }
]);
