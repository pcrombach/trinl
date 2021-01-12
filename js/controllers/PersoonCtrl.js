'use strict';

// eslint-disable-next-line no-undef
trinl.controller('PersoonCtrl', ['loDash', '$q', '$scope', '$state', '$rootScope', '$ionicPopup', 'dataFactoryBericht', 'dataFactoryBerichtReactie', 'dataFactoryFoto', 'dataFactoryFotoReactie', 'dataFactoryPoi', 'dataFactoryPoiReactie', 'dataFactoryTrack', 'dataFactoryTrackReactie', 'dataFactoryGebruiker', 'dataFactoryPersoon', 'dataFactoryCeo',
  function (loDash, $q, $scope, $state, $rootScope, $ionicPopup, dataFactoryBericht, dataFactoryBerichtReactie, dataFactoryFoto, dataFactoryFotoReactie, dataFactoryPoi, dataFactoryPoiReactie, dataFactoryTrack, dataFactoryTrackReactie, dataFactoryGebruiker, dataFactoryPersoon, dataFactoryCeo) {


    console.log('PersoonCtrl: ', dataFactoryCeo.currentModel);

    var persoonModel;
    $scope.persoon = {};

    console.log('PersoonCtrl dataFactoryPersoon.data: ', dataFactoryPersoon.data);
    persoonModel = loDash.find(dataFactoryPersoon.store, function (persoonModel) {
      return persoonModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });
    if (persoonModel) {
      console.log('PersoonCtrl gebruiker met persoon: ', persoonModel, $scope.persoon);
      $scope.persoon = loDash.mapValues(persoonModel, 'value');

    } else {
      console.log('PersoonCtrl gebruikerId: ' + dataFactoryCeo.currentModel.get('Id') + ' in persoon niet gevonden');
      persoonModel = new dataFactoryPersoon.Model();
      $scope.persoon = loDash.mapValues(persoonModel, 'value');
      console.log('PersoonCtrl persoon ERROR: ', persoonModel, $scope.persoon);

    }

    if (dataFactoryCeo.currentModel.get('profielId') === '1' || dataFactoryCeo.currentModel.get('uitgelogd')) {

      $ionicPopup.confirm({
        title: 'Profiel',
        content: 'Je bent momenteel een anonieme gebruiker.<br>Om jouw profiel aan te maken registreer eerst of log in met een geregistreerde account',
        buttons: [{
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function () {
            $state.go('app.kaart');
          }
        }]
      });
    }

    /**
     * Persoon bevat de velden die in het formulier zijn ingevuld.
     * Deze gegevens worden in het persoonModel geschreven en met save() naar de DB
     * @param  {[type]} persoon [description]
     * @return {[type]}         [description]
     */
    $scope.savePersoon = function (persoon) {
      console.log('savePersoon: ', persoon, persoonModel);

      var naam = '';
      var notFirstItem = false;
      var hasVoorLetters = false;
      persoonModel.set('voorLetters', persoon.voorLetters);
      if (persoon.voorLetters !== '') {
        naam = naam + persoon.voorLetters;
        hasVoorLetters = true;
        notFirstItem = true;
      }
      persoonModel.set('voorNaam', persoon.voorNaam);
      if (persoon.voorNaam !== '') {
        if (notFirstItem) {
          naam = naam + ' ';
        }
        if (hasVoorLetters) {
          naam = naam + '(' + persoon.voorNaam + ')';
        } else {
          naam = naam + persoon.voorNaam;
        }
        notFirstItem = true;
      }
      persoonModel.set('tussenVoegsel1', persoon.tussenVoegsel1);
      if (persoon.tussenVoegsel1 !== '') {
        if (notFirstItem) {
          naam = naam + ' ';
        }
        naam = naam + persoon.tussenVoegsel1;
        notFirstItem = true;
      }
      persoonModel.set('achterNaam', persoon.achterNaam);
      if (persoon.achterNaam !== '') {
        if (notFirstItem) {
          naam = naam + ' ';
        }
        naam = naam + persoon.achterNaam;
        notFirstItem = true;
      }
      persoonModel.set('tussenVoegsel2', persoon.tussenVoegsel2);
      persoonModel.set('meisjesNaam', persoon.meisjesNaam);
      if (persoon.meisjesNaam !== '') {
        if (notFirstItem) {
          naam = naam + ' - ';
        }
        if (persoon.tussenVoegsel2 !== '') {
          naam = naam + persoon.tussenVoegsel2 + ' ';
          notFirstItem = true;
        }
        naam = naam + persoon.meisjesNaam;
      }
      persoonModel.set('naam', naam);
      persoonModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
      persoonModel.set('telefoonNummer', persoon.telefoonNummer);
      persoonModel.set('mobiel', persoon.mobiel);
      persoonModel.set('email1', persoon.email1);
      persoonModel.set('email2', persoon.email2);
      persoonModel.set('email3', persoon.email3);
      persoonModel.set('straatNaam', persoon.straatNaam);
      persoonModel.set('huisNummer', persoon.huisNummer);
      persoonModel.set('postCode', persoon.postCode);
      persoonModel.set('woonPlaats', persoon.woonPlaats);
      persoonModel.set('land', persoon.land);

      console.log('Persoon saven: ', persoon);
      persoonModel.save().then(function (persoonModel) {
        console.log('PersoonCtrl persoon saved: ', persoonModel);

        dataFactoryCeo.currentModel.set('persoonId', persoonModel.get('Id'));
        dataFactoryCeo.currentModel.set('gebruikerNaam', persoonModel.get('naam'));

        console.log('PersoonCtrl dataFactoryCeo.currentModel persoonId update: ', dataFactoryCeo.currentModel.get('persoonId'));
        var gebruikerModel = loDash.find(dataFactoryGebruiker.store, function (gebruikerModel) {
          return gebruikerModel.get('Id') === dataFactoryCeo.currentModel.get('Id');
        });
        if (gebruikerModel) {

          gebruikerModel.set('persoonId', dataFactoryCeo.currentModel.get('persoonId'));
          gebruikerModel.set('gebruikerNaam', naam);
          gebruikerModel.save().then(function () {
            dataFactoryCeo.update(gebruikerModel).then(function () {

              console.error('Gebruiker save SUCCESS changedOn: ', gebruikerModel.get('changedOn'));
              $rootScope.$emit('InitCeo', {
                message: 'ceo updated PersoonCtrl savePersoon'
              });

              var ceoLS = JSON.parse(localStorage.getItem('ceo'));

              if (ceoLS !== null) {
                ceoLS.persoonId = dataFactoryCeo.currentModel.get('persoonId');

                ceoLS.changedOn = gebruikerModel.get('changedOn');
                localStorage.setItem('ceo', JSON.stringify(ceoLS));
              }
            }, function (err) {
              console.error('AppSideMenu ceo.update ERROR: ', err);
            });
          }, function (err) {
            console.error('Gebruiker niet gebruiker save ERROR: ', err);
          });

          updatePersoonInDataStores(naam);

        } else {
          console.error('Gebruiker niet gevonden geen gebruiker ERROR');
        }
      });

      $state.go('app.kaart');
    };

    /**
     * Update gebruiker in stores
     * @param  {String} oud   oude Id gebruiker
     * @param  {String} nieuw nieuwe Id gebruiker
     */
    function updatePersoonInDataStores(gebruikerNaam) {

      console.log('updateGebruikerIdInDataStores oude ID, nieuwe Id, dataFactoryCeo.currentModel: ', dataFactoryCeo.currentModel.get('Id'));
      //
      // Dit is niet de manier waarop het moet
      // Zoals shet moet is findRecord gebruikerId
      // Set GebruikerId in model
      // Save model
      //
      var q = $q.defer();

      var done = 0;
      var todo = 0;

      var filterBericht = loDash.filter(dataFactoryBericht.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterBerichtReactie = loDash.filter(dataFactoryBerichtReactie.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterFoto = loDash.filter(dataFactoryFoto.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterFotoReactie = loDash.filter(dataFactoryFotoReactie.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterPoi = loDash.filter(dataFactoryPoi.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterPoiReactie = loDash.filter(dataFactoryPoiReactie.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterTrack = loDash.filter(dataFactoryTrack.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var filterTrackReactie = loDash.filter(dataFactoryTrackReactie.data, function (item) {
        var record = item.record;
        return record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });

      todo += filterBericht.length;
      todo += filterBerichtReactie.length;
      todo += filterFoto.length;
      todo += filterFotoReactie.length;
      todo += filterPoi.length;
      todo += filterPoiReactie.length;
      todo += filterTrack.length;
      todo += filterTrackReactie.length;

      if (filterBericht.length !== 0) {
        loDash.each(filterBericht, function (item) {

          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores bericht model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.set('sendEmail', '0');
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterBerichtReactie.length !== 0) {
        loDash.each(filterBerichtReactie, function (item) {

          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores berichtreactie model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.set('sendEmail', '0');
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterFoto.length !== 0) {
        loDash.each(filterFoto, function (item) {
          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores foto model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterFotoReactie.length !== 0) {

        loDash.each(filterFotoReactie, function (item) {

          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores fotoreactie model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterPoi.length !== 0) {
        loDash.each(filterPoi, function (item) {
          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores poi model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterPoiReactie.length !== 0) {

        loDash.each(filterPoiReactie, function (item) {

          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores poireactie model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterTrack.length !== 0) {
        loDash.each(filterTrack, function (item) {
          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores track model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      if (filterTrackReactie.length !== 0) {

        loDash.each(filterTrackReactie, function (item) {

          (function (item) {

            var record = item.record;

            console.log('updateGebruikerIdInDataStores trackreactie model: ', record);

            record.set('gebruikerNaam', gebruikerNaam);
            record.save().then(function () {
              done += 1;
              if (done === todo) {
                q.resolve();
              }
            });
          })(item);
        });
      }

      return q.promise;
    }

  }
]);
