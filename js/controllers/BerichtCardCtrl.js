/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('BerichtCardCtrl', ['loDash', '$timeout', '$rootScope', '$q', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'dataFactoryCeo', 'dataFactoryHelp', 'dataFactoryNotification', 'dataFactoryClock', 'dataFactoryBerichtReactie', 'dataFactoryBerichtReactieSup', 'dataFactoryBericht', 'dataFactoryBerichtSup', 'dataFactoryBerichtTag', 'dataFactoryTag',
  
  
  
  
  
  
  'dataFactoryBlacklist', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers',
  function (loDash, $timeout, $rootScope, $q, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, $ionicListDelegate, dataFactoryCeo, dataFactoryHelp, dataFactoryNotification, dataFactoryClock, dataFactoryBerichtReactie, dataFactoryBerichtReactieSup, dataFactoryBericht, dataFactoryBerichtSup, dataFactoryBerichtTag, dataFactoryTag,
    
    
    
    
    
    
    dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers
  ) {

    var isCardClosed = false;

    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    console.error('BerichtCardCtrl ceo.Id: ', ceo.Id);
    console.error('BerichtCardCtrl ceo.profielId: ', +ceo.profielId);

    $scope.global = {};

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
    });
    sorteerGlobalTags();
    //
    $scope.details = {};
    $scope.details.mode = 'bericht';
    var mode = 'bericht';


    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'fotos/small_non_existing_id.png';

    var blacklisted = false;
    var isCardClosed = false;

    var berichtId = $stateParams.Id;
    var berichtModel;
    var berichtSupModel;
    var oldInputNaam;
    var oldInputTekst;
    // eslint-disable-next-line no-unused-vars
    //
    var event0a = $scope.$on('$ionicView.beforeEnter', function () {
      console.warn('BerichtCardCtrl $ionicView.beforeEnter');
      init();
    });
    $scope.$on('$destroy', event0a);

    var event0z = $scope.$on('$ionicView.afterEnter', function () {
      console.warn('BerichtCardCtrl $ionicView.afterEnter');
      isCardClosed = false;
    });
    $scope.$on('$destroy', event0z);

    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      console.warn('BerichtCardCtrl $ionicView.beforeLeave');
      //$timeout(function () {
      $scope.closeBerichtCard(false);
      //}, 100);
    });
    $scope.$on('$destroy', event0b);
    //
    var event1 = $rootScope.$on('labelsBerichtUpdate', function (event, args) {
      var berichtModel = args.berichtModel;
      console.warn('BerichtCardCtrl on.labelsBerichtUpdate berichtModel: ', berichtModel, berichtModel.get('naam'));
      updateLabels(berichtModel);
    });
    $scope.$on('$destroy', event1);
    //
    var event7 = $rootScope.$on('berichtVerwijderd', function (event, args) {
      var berichtModel = args.berichtModel;
      if (berichtModel.get('Id') === berichtId) {
        $ionicPopup.confirm({
          title: 'Verwijder Bericht',
          content: 'Deze Bericht is zojuist door de eigenaar verwijderd.<br><br>Deze Bericht wordt gesloten',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('berichten.berichten');
            }
          }]
        });
      }
    });
    $scope.$on('$destroy', event7);
    //
    $scope.infoTag = function (tagModel) {

      console.log('BerichtCardCtrl tagModel: ', tagModel);

      $ionicListDelegate.closeOptionButtons();

      $ionicPopup.confirm({
        template: '<p>' + tagModel.get('toelichting') + '</p>',
        title: 'Info label',
        buttons: [{
          text: 'Ok',
          type: 'button-positive',
        }]
      });
    };

    $scope.editTag = function (tagModel) {
      var tag = tagModel.get('tag');
      console.warn('BerichtCardCtrl editTag: ', tag, tagModel);

      $ionicListDelegate.closeOptionButtons();

      $scope.popup = {};
      $scope.popup.tag = tag;

      var popupEditTag;

      popupEditTag = $ionicPopup.show({
        template: '<input type="text" ng-model="popup.tag">',
        title: 'Wijzigen label',
        scope: $scope,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Wijzigen</b>',
          type: 'button-positive',
          onTap: function (e) {
            $scope.closeTags();
            if (!$scope.popup.tag) {
              e.preventDefault();
            } else {
              return $scope.popup.tag;
            }
          }
        }]
      });
      popupEditTag.then(function (res) {

        console.log('BerichtenSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          console.log('BerichtenSideMenuCtrl editTag berichtModel tags: ', tag, berichtModel && berichtModel.xData.tags);

          $rootScope.$emit('berichtRemoveLabel', {
            berichtModel: berichtModel,
            tagModel: tagModel
          });

          tagModel.set('tag', res);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
            sorteerDetailsTags();

            $rootScope.$emit('berichtAddLabel', {
              berichtModel: berichtModel,
              tagModel: tagModel
            });

            $rootScope.$emit('berichtenFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });

          });
        }
      });
    };

    $scope.deleteTag = function (tagModel) {
      var tag = tagModel.get('tag');
      console.warn('BerichtCardCtrl editTag: ', tag);

      $ionicListDelegate.closeOptionButtons();

      $ionicPopup.confirm({
        title: 'Verwijderen label',
        content: 'Label <br><br><span class="trinl-rood"><b>' + tag + '</b></span><br><br>wordt overal verwijderd.',
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Verwijderen</b>',
          type: 'button-positive',
          onTap: function () {

            $scope.closeTags();

            loDash.each(dataFactoryBericht.store, function (berichtModel) {
              console.log('BerichtenSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, berichtModel);
              loDash.each(berichtModel.xData.tags, function (berichtTagModel) {
                console.log('BerichtenSideMenuCtrl deleteTag berichtModal.tags loop: ', berichtModel.xData.tags, berichtTagModel);
                (function (berichtTagModel) {
                  if (berichtTagModel.xData.get('tag') === tag) {
                    console.log('BerichtenSideMenuCtrl deleteTag berichtTagModel in berichtModel.tags wordt verwijderd uit backend: ', berichtTagModel);
                    berichtTagModel.remove().then(function () {
                      console.log('BerichtenSideMenuCtrl deleteTag berichtTagModel wordt verwijderd uit berichtModel.tags: ', berichtTagModel);
                      loDash.remove(berichtModel.xData.tags, function (berichtTagModel) {
                        return berichtTagModel.xData.get('tag') === tag;
                      });
                    });
                    $rootScope.$emit('berichtRemoveLabel', {
                      berichtModel: berichtModel,
                      tagModel: tagModel
                    });
                  }
                })(berichtTagModel);
              });
            });

            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            console.log('BerichtenSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle berichttags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              console.log('BerichtenSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.berichtenFilterAlle();
          }
        }]
      });
    };


    function sorteerGlobalTags() {

      console.error('berichtCardCtrl sorteerGlobalTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter($scope.global.tags, function (tag) {
        return tag.get('Id').length <= 3 && tag.get('gebruikerId') !== '';
      });
      if (tagsPrivate.length > 0) {
        tagsPrivate = loDash.orderBy(tagsPrivate, o => o.get('tag'), 'asc');
      }
      var tagsStandaard = loDash.filter($scope.global.tags, function (tag) {
        return tag.get('Id').length <= 3 && tag.get('gebruikerId') === '';
      });
      if (tagsStandaard.length > 1) {
        tagsStandaard = loDash.orderBy(tagsStandaard, o => o.get('tag'), 'asc');
      }
      var tagsNormaal = loDash.filter($scope.global.tags, function (tag) {
        return tag.get('Id').length > 3;
      });
      if (tagsNormaal.length > 1) {
        tagsNormaal = loDash.orderBy(tagsNormaal, o => o.get('tag'), 'asc');
      }
      $scope.global.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }

    function sorteerDetailsTags() {

      console.error('BerichtCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //

      console.error('$scope.details.tags: ', $scope.details.tags);

      var tagsPrivate = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      if (tagsPrivate.length > 0) {
        tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');
      }
      console.error('tagsPrivate: ', tagsPrivate);

      var tagsStandaard = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      if (tagsStandaard.length > 0) {
        tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');
      }
      console.error('tagsStandaard: ', tagsStandaard);

      var tagsNormaal = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      if (tagsNormaal.length > 0) {
        tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.tag.value, 'asc');
      }
      console.error('tagsNormaal: ', tagsNormaal);

      $scope.details.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }

    function berichtenCheckBerichtReactieAantal(reacties) {
      console.warn('BerichtenCtrl berichtenCheckBerichtReactieOud, reacties: ', reacties);

      var maxAantal = 50;

      var verwijderingen = 0;

      var q = $q.defer();

      var teller = 0;
      loDash.each(reacties, function (reactieModel) {
        console.log('BerichtenCtrl berichtenCheckBerichtReactieAantal reactieModel: ', reactieModel);
        teller += 1;
        if (teller > maxAantal) {

          verwijderingen += 1;

          var reactieId = reactieModel.get('Id');

          reactieModel.remove();
          loDash.remove(dataFactoryBerichtReactie.store, function (reactieModel) {
            return reactieModel.get('Id') === reactieId;
          });
          loDash.remove(dataFactoryBerichtReactie.data, function (dataItem) {
            return dataItem.record.get('Id') === reactieId;
          });
          var reactieSupModel = loDash.find(dataFactoryBerichtReactieSup.store, function (reactieSupModel) {
            return reactieSupModel.get('reactieId') === reactieId;
          });
          if (reactieSupModel) {
            reactieSupModel.remove();
            loDash.remove(dataFactoryBerichtReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            loDash.remove(dataFactoryBerichtReactieSup.data, function (dataItem) {
              return dataItem.record.get('reactieId') === reactieId;
            });
          }
          console.error('BerichtenCtrl berichtenCheckBerichtReactieAantal reactie removed SUCCESS');
        }
      });
      if (verwijderingen > 0) {
        var reactiesTmp = loDash.uniqBy(reacties, 'Id');
        $scope.details.reacties = loDash.orderBy(reactiesTmp, 'createdOn.value', 'desc');
        $scope.details.reactiesAantal = $scope.details.reacties.length;
        q.resolve();
      } else {
        q.reject();
      }

      return q.promise;
    }

    function berichtenCheckBerichtReactieOud(reacties) {

      console.warn('BerichtenCtrl berichtenCheckBerichtReactieOud, reacties: ', reacties);

      var aantalOuder = 7;
      var formatOuder = 'days';

      var q = $q.defer();
      var tooOld = moment().subtract(aantalOuder, formatOuder).format('YYYY-MM-DD HH:mm:ss');
      var verwijderingen = false;
      console.log('BerichtenCtrl berichtenCheckBerichtReactieOud: ', tooOld);
      //
      //  Ouder dan 
      //
      loDash.each(reacties, function (reactieModel) {
        if (reactieModel) {
          console.log('BerichtenCtrl berichtenCheckBerichtReactieOud reactieModel: ', reactieModel);
          var datum = reactieModel.get('changedOn');
          var reactieId = reactieModel.get('Id');
          if (datum < tooOld) {
            verwijderingen += 1;
            console.log('BerichtenCtrl berichtenCheckBerichtReactieOud changedOn, berichtId, tooOld: ', datum, berichtId, tooOld);

            reactieModel.remove();
            loDash.remove(dataFactoryBerichtReactie.store, function (reactieModel) {
              return reactieModel.get('Id') === reactieId;
            });
            loDash.remove(dataFactoryBerichtReactie.data, function (dataItem) {
              return dataItem.record.get('Id') === reactieId;
            });
            var reactieSupModel = loDash.find(dataFactoryBerichtReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            if (reactieSupModel) {
              reactieSupModel.remove();
              loDash.remove(dataFactoryBerichtReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('reactieId') === reactieId;
              });
              loDash.remove(dataFactoryBerichtReactieSup.data, function (dataItem) {
                return dataItem.record.get('reactieId') === reactieId;
              });
            }
            $rootScope.$emit('filter');
            $rootScope.$emit('berichtenNieuweAantallen');
            console.error('BerichtenCtrl berichtenCheckBerichtReactieOud reactie removed SUCCESS');
          }
        }
      });
      if (verwijderingen > 0) {
        var reactiesTmp = loDash.uniqBy(reacties, 'Id');
        $scope.details.reacties = loDash.orderBy(reactiesTmp, 'createdOn.value', 'desc');
        $scope.details.reactiesAantal = $scope.details.reacties.length;
        q.resolve();
      } else {
        q.reject();
      }

      return q.promise;
    }

    function updateReacties(berichtModel) {
      console.log('BerichtenCtrl updateReacties voor bericht naam Id: ', berichtModel.get('Id'), berichtModel.get('naam'));
      var berichtId = berichtModel.get('Id');

      console.log('BerichtenCtrl updateReacties dataFactoryBerichtReactie.store: ', dataFactoryBerichtReactie.store);

      var berichtReacties = loDash.filter(dataFactoryBerichtReactie.store, function (berichtReactieModel) {
        return berichtReactieModel.get('berichtId') === berichtId;
      });
      //
      $scope.details.reacties = loDash.orderBy(berichtReacties, 'createdOn.value', 'desc');
      berichtenCheckBerichtReactieAantal(berichtReacties).then(function () {
        berichtenCheckBerichtReactieOud(berichtReacties).then(function () {
        });
      });
      console.warn('BerichtCardCtrl loadReactie bericht in store, aantal: ', dataFactoryBericht.store.length);
      console.warn('BerichtCardCtrl loadReactie reacties in store, aantal: ', berichtReacties.length);
      $scope.details.reactiesAantal = berichtReacties.length;
    }

    $scope.reactie = function () {
      console.warn('BerichtCardCtrl reactie');

      $scope.input = {};
      $scope.input.naam = '';
      $scope.input.tekst = '';
      $scope.initBericht = 'Reactie';

      $scope.openModalReactie();
    };

    $scope.saveReactie = function (input) {

      console.warn('BerichtCardCtrl saveReactie input berichtId: ', input, berichtId);

      if ($scope.initBericht === 'Reactie') {

        $scope.details.reactiesAantal += 1;

        var reactieModel = new dataFactoryBerichtReactie.Model();

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = tmp.replace(/\\"/g, '"');
        var htmlreactietekst = '<p>' + tmp + '</p>';
        tmp = false;
        console.error('BerichtCardCtrl saveReactie: ', htmlreactietekst);
        reactieModel.set('reactie', htmlreactietekst);
        reactieModel.set('berichtId', berichtId);
        reactieModel.set('berichtGebruikerId', berichtModel.get('gebruikerId'));
        reactieModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        reactieModel.set('gebruikerNaam', dataFactoryCeo.currentModel.get('gebruikerNaam'));
        reactieModel.set('profiel', dataFactoryCeo.currentModel.get('profiel'));
        reactieModel.set('avatar', dataFactoryCeo.currentModel.get('avatar'));
        tmp = dataFactoryCeo.currentModel.get('avatar').split('.');
        reactieModel.set('avatarColor', tmp[0]);
        reactieModel.set('avatarLetter', tmp[1]);
        reactieModel.set('avatarInverse', tmp[2]);

        reactieModel.save().then(function () {
          var reactieId = reactieModel.get('Id');
          var reactieSupModel = new dataFactoryBerichtReactieSup.Model();
          reactieSupModel.set('berichtId', berichtId);
          reactieSupModel.set('reactieId', reactieId);
          reactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          reactieSupModel.set('xnew', false);
          reactieSupModel.save().then(function (reactieSupModel) {
            console.error('BerichtCardCtrl saveReactie reactieSupModel: ', reactieSupModel);
            reactieModel.xData = {
              sup: reactieSupModel
            };
          });
          berichtSupModel.set('berichtId', berichtId);
          berichtSupModel.save().then(function () {
            console.error('BerichtCardCtrl saveReactie berichtSupModel: ', berichtSupModel);
          });
          $scope.details.reacties.splice(0, 0, reactieModel);
        });
        $scope.closeModalReactie();
      }
    };

    $scope.saveBerichtItemTekst = function (input) {
      console.warn('BerichtCardCtrl saveBerichtTekst: ', $scope.details);
      console.warn('BerichtCardCtrl saveBerichtTekst: ', input);
      console.error('BerichtCardCtrl size message: ', input.naam.length + input.tekst.length);

      $scope.details.naam = input.naam;
      $scope.details.tekst = input.tekst;
      var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      tmp = false;
      if (input.naam !== oldInputNaam) {
        berichtModel.set('naam', input.naam.substr(0, 7500));
        $scope.details.naam = input.naam.substr(0, 7500);
        tmp = true;
      }
      if (input.tekst !== oldInputTekst) {
        berichtModel.set('tekst', input.tekst.substr(0, 7500));
        $scope.details.tekst = input.tekst.substr(0, 7500);
        tmp = true;
      }
      if (tmp) {
        if (input.naam.length + input.tekst.length > 7500) {
          $ionicPopup.alert({
            title: 'Wijzigen tekst',
            template: 'De tekst mag maximaal 7500 karakters lang zijn.<br><br>De tekst is afgekort opgeslagen.'
          });
        }
        berichtModel.set('gebruikerId', berichtModel.get('gebruikerId'));
        berichtModel.save();
        $rootScope.$emit('berichtUpdate', berichtModel);
      }

      $scope.closeModalBericht();
    };

    $scope.openBerichtTekst = function () {
      console.warn('BerichtCardCtrl openBerichtTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalBericht();
    };

    function updateLabels(berichtModel) {
      console.log('BerichtCardCtrl updateLabels berichtModel, berichtId: ', berichtModel, berichtId, berichtModel.get('naam'));
      if (berichtModel.get('Id') === berichtId) {
        console.log('BerichtCardCtrl updateLabels berichtModel: ', berichtModel.get('naam'), berichtModel.get('Id'));
        //
        // Indien labels worden toegevoegd dan worden die toegevoegd in de dataFactoryBerichtTag store en data
        // De label moet ook toegevoegd worden aan de berichtModel.xData.tags
        initxData(berichtModel);
        $scope.details.tags = berichtModel.xData.tags;
        sorteerDetailsTags();
        if ($scope.details.tags.length === 0) {
          $scope.details.tags = [];
        }
      }
    }
    //
    //  De gebruiker heeft een nieuw lable aangemaakt.
    //  Dit label wordt toegevoegd aan zijn labels (private)
    //  Bovendien wordt dit label toegevoegd aan de labels van het het Model.
    //
    $scope.addNieuweLabel = function (tag) {
      console.warn('BerichtCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          if (berichtModel.get('xprive')) {
            tagModel.set('xprive', true);
            tagModel.set('yprive', false);
          } else {
            tagModel.set('xprive', false);
            tagModel.set('yprive', true);
          }
          tagModel.save().then(function () {
            console.log('addNieuweLabel: ', dataFactoryTag.store);
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
            console.log('addNieuweLabel: ', $scope.global.tags);
            $scope.selectLabelClick(tagModel);
            $scope.clearSearchLabel();
            console.log('BerichtCardCtrl addNieuweLabel tag: ', tagModel);
          });
        } else {
          $ionicPopup.confirm({
            title: 'Toevoegen label',
            content:
              'Dit label bestaat reeds.<br><br>Tik op de label in de lijst of kies een andere label!',
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-positive',
                onTap: function () {
                  $scope.closeTags();
                }
              }
            ]
          });
          $scope.closeTags();
        }
      }
    };

    $scope.selectLabelClick = function (tagModel) {
      var tagId = tagModel.get('Id');

      console.warn('BerichtCardCtrl selectLabelClick tagModel: ', tagModel);
      console.warn('BerichtCardCtrl selectLabelClick berichtId: ', berichtId);
      console.warn('BerichtCardCtrl selectLabelClick tagId: ', tagModel.get('Id'));
      //
      //  Kijk of de berichttag reeds bestaat
      //
      var found = loDash.find(dataFactoryBerichtTag.store, function (berichtTagModel) {
        return berichtTagModel.get('berichtId') === berichtId && berichtTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var berichtTagModel = new dataFactoryBerichtTag.Model();
        berichtTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        berichtTagModel.set('berichtId', berichtId);
        berichtTagModel.set('tagId', tagId);
        berichtTagModel.set('xprive', true);
        berichtTagModel.set('yprive', false);

        console.error('BerichtCardCtrl newLabel groepenId: ', berichtModel.get('groepenId'));
        var groepenId = berichtModel.get('groepenId');
        if (groepenId === '' || groepenId === 'Iedereen') {
          if (tagId.length <= 3) {
            berichtTagModel.set('yprive', true);
            berichtTagModel.set('xprive', false);
            console.log('BerichtCardCtrl publiceren PUBLIC tagId', berichtTagModel.get('tagId'));
          }
        } else {
          berichtTagModel.set('yprive', true);
          berichtTagModel.set('xprive', false);
          console.log('BerichtCardCtrl publiceren made PUBLIC tagId', berichtTagModel.get('tagId'));
          //
          tagModel.set('yprive', true);
          tagModel.set('xprive', false);
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
          });
          console.log('BerichtCardCtrl publiceren made PUBLIC tag, naam', tagModel.get('tag'));
        }
        berichtTagModel.save().then(function () {

          berichtTagModel.xData = tagModel;
          berichtModel.xData.tags.push(berichtTagModel);
          $scope.details.tags = berichtModel.xData.tags;
          sorteerDetailsTags();
          $rootScope.$emit('berichtAddLabel', {
            berichtModel: berichtModel,
            tagModel: tagModel
          });
        });
        $scope.closeTags();
      } else {
        $ionicPopup.confirm({
          title: 'Toevoegen label',
          content: 'Dit label is reeds toegevoegd aan deze Bericht.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $scope.closeTags();
              }
            }
          ]
        });
      }
    };

    $scope.selecterenTagHelp = function ($event) {
      $scope.helpTitel = 'Label selecteren';
      $scope.helpContent =
        'Selecteer een label in onderstaande lijst. Indien deze te lang is kun je door middel van zoeken het aantal labels verkleinen. Voer daarvoor de zoektekst in, in het zoekvenster. De lijst toont dan alle labels waarin deze tekst voorkomt. Als je het label gevonden hebt, selecteer het in de lijst, het label wordt dan toegevoegd aan de Bericht.';
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover($event);
      }
    };

    $scope.toevoegenTagHelp = function () {
      $scope.helpTitel = 'Label toevoegen';
      $scope.helpContent =
        'Wanneer de tekst niet te vinden is door middel van het zoekvenster verschijnt rechtsboven de tekst ‘+ Voeg toe’. Klik hier om de getypte tekst uit het zoekvenster als label toe te voegen aan de lijst. Het label wordt tevens toegevoegd aan de gekozen Bericht.';

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpModal();
        //$scope.openGlobalHelpPopover($event);
      }
    };

    $scope.addTagToBericht = function ($event) {
      console.warn('BerichtCardCtrl addTagToBericht');

      $scope.clearSearchLabel($event);
      $scope.openTags($event);
    };

    $scope.deleteLabelTag = function (berichtTagModel) {
      console.warn('BerichtCardCtrl deleteLabelTag berichtModel: ', berichtModel, berichtModel.get('naam'), );
      console.warn('BerichtCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('BerichtCardCtrl deleteLabelTag berichtTagModel: ', berichtTagModel);
      console.warn('BerichtCardCtrl deleteLabelTag tagModel: ', berichtTagModel.xData);
      var tagModel = berichtTagModel.xData;
      console.warn('BerichtCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      console.warn('BerichtCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));
      console.warn('BerichtCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('BerichtCardCtrl deleteLabelTag berichtModel.xdata.tags: ', berichtModel.xData.tags);

      var berichtTagId = berichtTagModel.get('Id');

      berichtTagModel.remove().then(function () {

        berichtTagModel.xData = tagModel;
        $rootScope.$emit('berichtRemoveLabel', {
          berichtModel: berichtModel,
          tagModel: tagModel
        });

        loDash.remove($scope.details.tags, function (berichtTagModel) {
          return berichtTagModel.get('Id') === berichtTagId;
        });
        sorteerDetailsTags();
        loDash.remove(berichtModel.xData.tags, function (berichtTagModel) {
          return berichtTagModel.get('Id') === berichtTagId;
        });

      });
    };

    $scope.selecteerBericht = function () {
      console.log('BerichtenCtrl selecteerBericht: ', berichtModel);

      $rootScope.$emit('berichtSelected', berichtModel);
      $state.go('app.kaart');
    };

    $scope.clickedAvatar = function (details) {
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      console.warn('BerichtCardCtrl clickedAvatar naam: ', details.gebruikerNaam);
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      if (details.gebruikerId == $scope.ceo.Id) {
        var content =
          'Je bent de eigenaar van deze Bericht.<br><br>Tik op verwijder om deze Bericht te verwijderen.';
        if (!details.xprive) {
          content =
            content +
            '<br><br>Om te stoppen met publiceren maak het slotje rood door er op te tikken.';
        }
        $ionicPopup.confirm({
          title: 'Publicaties verwijderen',
          content: content,
          buttons: [
            {
              text: '<b>OK</b>'
            }
          ]
        });
      } else {
        var gebruikerId = details.gebruikerId;
        var removed = false;
        var naam = details.gebruikerNaam;
        if (naam === null) {
          naam = 'deze gebruiker';
        }
        $ionicPopup.confirm({
          title: 'Publicaties verwijderen door gebruiker te blokkeren',
          content:
            'Je wil geen Berichts meer ontvangen van<br><br><span class="trinl-rood">' +
            naam +
            '</span><br><br>Weet je dit zeker?',
          buttons: [
            {
              text: 'Annuleer',
              onTap: function () { }
            },
            {
              text: '<b>Gebruiker blokkeren</b>',
              type: 'button-positive',
              onTap: function () {
                var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
                  return blacklistModel.get('type') === 'gebruikers' && blacklistModel.get('blackId') === gebruikerId;
                });

                console.warn('BerichtCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

                if (found) {
                  console.warn('BerichtCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

                  $scope.details.volgt = true;

                  found.set('Id', found.get('Id'));
                  found.set('gebruikerId', $scope.ceo.Id);
                  found.set('type', 'berichtgebruikers');
                  found.set('blackId', gebruikerId);
                  found.set('reden', 'avatar');
                  found.remove();
                  removed = false;
                } else {
                  $scope.details.volgt = false;

                  var blacklistModel = new dataFactoryBlacklist.Model();
                  blacklistModel.set('gebruikerId', $scope.ceo.Id);
                  blacklistModel.set('type', 'berichtgebruikers');
                  blacklistModel.set('blackId', gebruikerId);
                  blacklistModel.set('eigenaar', gebruikerId);
                  blacklistModel.set('naam', naam);
                  blacklistModel.set('reden', 'avatar');
                  blacklistModel.save();
                  removed = true;

                  console.warn('BerichtCardCtrl updateVolgt blacklistStore blacklistModel niet gevonden aangemaakt en saved: ', blacklistModel);
                }

                if (removed) {
                  loDash.remove(dataFactoryBericht.star, function (starModel) {
                    return starModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryBericht.nieuw, function (nieuwModel) {
                    return nieuwModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryBericht.selected, function (
                    selectedModel
                  ) {
                    return selectedModel.get('gebruikerId') === gebruikerId;
                  });
                  $rootScope.$emit('berichtDelete', details.gebruikerId);
                }
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                var itemsToRemove = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
                  return berichtModel.get('gebruikerId') === gebruikerId;
                });
                console.log('BerichtCardCtrl berichtItems removing from Store.....: ', itemsToRemove);

                loDash.each(itemsToRemove, function (berichtModel) {
                  var berichtId = berichtModel.get('Id');

                  removeBerichtFromStores(berichtId, false);
                });

                $rootScope.$on('berichtenReload');
                $rootScope.$emit('berichtenNieuweAantallen');
                $state.go('berichten.berichten');
              }
            }
          ]
        });
      }
    };

    $scope.updateVolgt = function () {
      console.warn('BerichtCardCtrl updateVolgt: ', berichtModel, berichtModel.get('naam'));

      $scope.details.volgt = false;

      blacklisted = false;

      var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('blackId') === berichtModel.get('Id');
      });

      console.warn('BerichtCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

      if (found) {
        console.warn('BerichtCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

        removeBerichtFromStores(berichtModel.get('Id'), false);

        $scope.details.volgt = true;

        found.set('Id', found.get('Id'));
        found.set('gebruikerId', $scope.ceo.Id);
        found.set('type', 'bericht');
        found.set('blackId', berichtModel.get('Id'));
        found.set('reden', 'pinned');
        found.remove();
        blacklisted = false;
      } else {
        $scope.details.volgt = false;

        var blacklistModel = new dataFactoryBlacklist.Model();
        blacklistModel.set('gebruikerId', $scope.ceo.Id);
        blacklistModel.set('type', 'bericht');
        blacklistModel.set('blackId', berichtModel.get('Id'));
        blacklistModel.set('eigenaar', berichtModel.get('gebruikerId'));
        blacklistModel.set('naam', berichtModel.get('naam'));
        blacklistModel.set('reden', 'pinned');
        blacklistModel.save();
        blacklisted = true;
      }
    };

    $scope.updateStar = function () {
      console.warn('BerichtCardCtrl updateStar in: ', berichtSupModel);

      $scope.details.star = berichtSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        berichtModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryBericht.star, function (berichtModel) {
          return berichtModel.get('Id') === berichtId;
        });
        berichtSupModel.set('star', $scope.details.star);
        console.warn('BerichtCardCtrl updateStar berichtSupModel: ', berichtSupModel.get('berichtId'));
        berichtSupModel.save();
        console.warn('BerichtCardCtrl updateStar: ', berichtSupModel, berichtModel.xData.sup.xnew.value);
      } else {
        $scope.details.star = true;
        berichtModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryBericht.star, function (berichtStarModel) {
          return berichtStarModel.get('Id') === berichtId;
        });
        if (!found) {
          dataFactoryBericht.star.push(berichtModel);
        }
        berichtSupModel.set('star', $scope.details.star);
        //berichtSupModel.set('berichtId', berichtId);
        console.warn('BerichtCardCtrl updateStar berichtSupModel: ', berichtSupModel.get('berichtId'));
        berichtSupModel.save();
        console.warn('BerichtCardCtrl updateStar: ', berichtSupModel, berichtModel.xData.sup.xnew.value);
      }
      $rootScope.$emit('berichtenNieuweAantallen');
    };

    $scope.selectGroep = function (groep) {
      console.warn('BerichtCardCtrl selectGroep: ', groep, groep.groep, groep.groepenId);
      $scope.details.groep = groep.groep;
      berichtModel.set('groepenId', groep.groepenId);
      $scope.details.xprive = false;
      berichtModel.set('gebruikerId', berichtModel.get('gebruikerId'));
      berichtModel.set('yprive', true);
      berichtModel.set('xprive', false);
      berichtModel.save();
      //
      //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
      //  Standaard labels zijn altijd public. Dus niet publiceren.
      //  Andere Tags en berichttags ook prive/public maken
      //
      console.log('BerichtCardCtrl selectGroepberichttags, tags van naam: ', berichtModel.get('naam'));
      //
      loDash.each(dataFactoryBerichtTag.store, function (berichtTagModel) {
        //
        if (berichtTagModel.get('berichtId') === berichtId) {
          //
          var tagId = berichtTagModel.get('tagId');
          //
          berichtTagModel.set('yprive', true);
          berichtTagModel.set('xprive', true);
          console.log('BerichtCardCtrl selectGroep made PRIVATE tagId', berichtTagModel.get('tagId'));

          var groepenId = berichtModel.get('groepenId');
          if (groepenId === '' || groepenId === 'Iedereen') {

            if (tagId.length <= 3) {
              berichtTagModel.set('yprive', true);
              berichtTagModel.set('xprive', false);
              console.log('BerichtCardCtrl selectGroep PUBLIC tagId', berichtTagModel.get('tagId'));
            }
          } else {
            berichtTagModel.set('yprive', true);
            berichtTagModel.set('xprive', false);
            console.log('BerichtCardCtrl selectGroep made PUBLIC tagId', berichtTagModel.get('tagId'));
            //
            var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
            });
            if (tag) {
              tag.set('yprive', true);
              tag.set('xprive', false);
              tag.save();
              console.log('BerichtCardCtrl selectGroep made PUBLIC tag, naam', tag.get('tag'));
            }
          }
          berichtTagModel.save();
        }
      });
      $scope.closeGroepen();
    };

    $scope.openDeelnemers = function (groepy, $event) {
      console.warn('BerichtCardCtrl openDeelnemersGroep: ', groepy);

      $scope.deelnemers = loDash.filter(dataFactoryGroepdeelnemers.store, function (groep) {
        return groep.get('groep') === groepy;
      });
      console.warn('BerichtCardCtrl openDeelnemersGroep: ', $scope.deelnemers);
      $scope.openGroepDeelnemers($event);
    };

    function showGroepen($event) {
      console.warn('BerichtCardCtrl showGroepen: ', $event);
      console.warn('BerichtCardCtrl showGroepen groepen: ', dataFactoryGroepen.store, dataFactoryGroepen.store.length);
      console.warn('BerichtCardCtrl showGroepdeelnemers: ', dataFactoryGroepdeelnemers.store, dataFactoryGroepdeelnemers.store.length);

      $scope.groepen = [];
      $scope.deelnemers = [];
      var tmp;

      tmp = loDash.filter(dataFactoryGroepdeelnemers.store, function (groepdeelnemerModel) {
        return ((groepdeelnemerModel.get('deelnemerId') === dataFactoryCeo.currentModel.get('Id') && groepdeelnemerModel.get('publicist') === true) || groepdeelnemerModel.get('groep') === 'Iedereen');
      });
      console.warn('BerichtCardCtrl showGroepen tmp: ', tmp, tmp.length);
      loDash.each(tmp, function (groep) {
        tmp = loDash.mapValues(groep, 'value');
        $scope.deelnemers.push(tmp);
      });
      console.warn('BerichtCardCtrl showGroepen $scope.deelnemers: ', $scope.deelnemers);

      $scope.groepen = loDash.uniqBy($scope.deelnemers, 'groep');
      console.warn('BerichtCardCtrl showGroepen $scope.groepen: ', $scope.groepen);

      if ($scope.groepen.length > 1) {
        $scope.openGroepen($event);
      } else {
        var groep = {
          groep: '',
          groepenId: ''
        };
        $scope.selectGroep(groep);
      }
    }

    $scope.updateXprive = function ($event) {
      if (berichtModel.get('gebruikerId') === $scope.ceo.Id) {
        $scope.details.xprive = berichtModel.get('xprive');
        if ($scope.details.xprive) {
          if ($scope.details.groep == '') {
            showGroepen($event);
          } else {
            $scope.details.xprive = false;
            //
            var groepenId = berichtModel.get('groepenId');
            $scope.details.groep = '';
            berichtModel.xData.groep = '';
            if (groepenId !== '') {
              $scope.details.groep = 'Iedereen';
              berichtModel.xData.groep = 'Iedereen';

              var found = loDash.find(dataFactoryGroepen.store, function (groep) {
                return groep.get('Id') === groepenId;
              });
              if (found) {
                $scope.details.groep = found.get('groep');
                berichtModel.xData.groep = found.get('groep');
                console.error('BerichtCardCtrl updateXprive details.groep bericht.xData.groep set: ', $scope.details.groep);
              }
            }
            //
            berichtModel.set('gebruikerId', berichtModel.get('gebruikerId'));
            berichtModel.set('yprive', true);
            berichtModel.set('xprive', false);
            berichtModel.save();
            //
            //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
            //  Standaard labels zijn altijd public. Dus niet publiceren.
            //  Andere Tags en berichttags ook prive/public maken
            //
            console.log('BerichtCardCtrl updateXprive berichttags, tags van naam: ', berichtModel.get('naam'));
            //
            loDash.each(dataFactoryBerichtTag.store, function (berichtTagModel) {

              if (berichtTagModel.get('berichtId') === berichtId) {
                //
                //
                var tagId = berichtTagModel.get('tagId');
                console.log('BerichtCardCtrl updateXprive tagId: ', tagId);
                //
                var groepenId = berichtModel.get('groepenId');
                if (groepenId === '' || groepenId === 'Iedereen') {

                  if (tagId.length <= 3) {
                    berichtTagModel.set('yprive', true);
                    berichtTagModel.set('xprive', false);
                    berichtTagModel.save();
                    console.log('BerichtCardCtrl updateXprive gepubliceerd tagId', berichtTagModel.get('tagId'));
                  }
                } else {
                  berichtTagModel.set('yprive', true);
                  berichtTagModel.set('xprive', false);
                  berichtTagModel.save();
                  console.log('BerichtCardCtrl updateXprive gepubliceerd tagId', berichtTagModel.get('tagId'));
                  var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
                  });
                  if (tag) {
                    tag.set('yprive', true);
                    tag.set('xprive', false);
                    tag.save();
                    console.log('BerichtCardCtrl updateXprive gepubliceerd tag, naam', tag.get('tag'));
                  }
                }
              }
            });
          }
        } else {
          $scope.details.xprive = true;
          //
          berichtModel.set('groepenId', '');
          berichtModel.save();
          //
          $scope.details.groep = '';
          berichtModel.xData.groep = '';
          console.error('BerichtCardCtrl updateXprive details.groep bericht.xData.groep reset: ', $scope.details.groep);

          berichtModel.set('gebruikerId', berichtModel.get('gebruikerId'));
          berichtModel.set('yprive', true);
          berichtModel.set('xprive', true);
          berichtModel.save();
          //
          // Labels en tags ook prive/public maken
          //
          loDash.each(dataFactoryBerichtTag.store, function (berichtTagModel) {
            if (berichtTagModel.get('berichtId') === berichtId) {
              berichtTagModel.set('yprive', true);
              berichtTagModel.set('xprive', true);
              berichtTagModel.save();
            }
          });
        }

        console.warn('BerichtCardCtrl updateXprive: ', berichtModel);

        berichtModel.set('Id', berichtId);
        berichtModel.set('gebruikerId', berichtModel.get('gebruikerId'));
        berichtModel.save().then(function () {
          console.error('BerichtCardCtrl updateXprive saved SUCCESS: ', berichtModel.get('xprive'));
        });
      }
    };
    
    
    function initxData(berichtModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!berichtModel.xData) {
        berichtModel.xData = {};
        console.log('BerichtenCtrl initxData xData');
      }
      if (!berichtModel.xData.berichten) {
        berichtModel.xData.berichten = [];
        console.log('BerichtenCtrl initxData xData.berichten');
      }
      if (!berichtModel.xData.fotos) {
        berichtModel.xData.fotos = [];
        console.log('BerichtenCtrl initxData xData.fotoa');
      }
      if (!berichtModel.xData.tags) {
        berichtModel.xData.tags = [];
        console.log('BerichtenCtrl initxData xData.tags');
      }
    }

    function updateBericht() {

      console.log('BerichtCardCtrl berichtModel: ', berichtModel, berichtModel.get('naam'));
      var berichtId = berichtModel.get('Id');
      console.warn('BerichtCardCtrl berichtUpdate berichtId: ', berichtId);
      
      
      
      
      
      
      updateLabels(berichtModel);

      //
      if (mode !== 'bericht') {
        
        //removeIf(!berichten)
  
        var groepenId = berichtModel.get('groepenId');
        console.log('BerichtCardCtrl updateBericht groepenId: ', groepenId);
  
        $scope.details.groep = '';
        berichtModel.xData.groep = '';
        if (groepenId !== '') {
          $scope.details.groep = 'Iedereen';
          berichtModel.xData.groep = 'Iedereen';
  
          var groep = loDash.find(dataFactoryGroepen.store, function (groep) {
            return groep.get('Id') === groepenId;
          });
          if (groep) {
            $scope.details.groep = groep.get('groep');
            berichtModel.xData.groep = groep.get('groep');
            console.error('BerichtCardCtrl updateBericht details.groep bericht.xData.groep update: ', $scope.details.groep);
          }
        }
        //endRemoveIf(berichten)
        
      }

      var isBlacklisted = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('volgerId') === berichtModel.get('gebruikerId');
      });
      $scope.details.volgt = true;
      if (isBlacklisted) {
        $scope.details.volgt = false;
      }

      $scope.details.berichtId = berichtId;
      $scope.details.tags = berichtModel.xData.tags;
      sorteerDetailsTags();
      console.log('BerichtCardCtrl updateBericht xData.tags: ', berichtModel.xData.tags);

      $scope.details.groep = '';

      $scope.details.gebruikerId = berichtModel.get('gebruikerId');
      $scope.details.profiel = berichtModel.get('profiel');
      $scope.details.gebruikerNaam = berichtModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }

      $scope.details.avatarColor = berichtModel.get('avatarColor');
      $scope.details.avatarLetter = berichtModel.get('avatarLetter');
      $scope.details.avatarInverse = berichtModel.get('avatarInverse');

      $scope.details.createdOn = berichtModel.get('createdOn');
      $scope.details.changedOn = berichtModel.get('changedOn');


      $scope.details.star = berichtSupModel.get('star');
      $scope.details.xprive = berichtModel.get('xprive');

      if (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = berichtSupModel.get('xnew');
      }

      $scope.details.naam = berichtModel.get('naam');
      $scope.details.tekst = berichtModel.get('tekst');
      var tmp2 = berichtModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp2 + '</p>';

      $scope.details.lat = berichtModel.get('lat');
      $scope.details.lng = berichtModel.get('lng');

      var gelezen = +berichtSupModel.get('gelezen');
      $scope.details.gelezen = gelezen;
      console.log('updateBerichtUpdate gelezen: ', gelezen);

      console.log('BerichtCardCtrl updateBericht updateReacties Clock');

      updateReacties(berichtModel);

      dataFactoryClock.stopClockBericht();
      $rootScope.$emit('startClockBericht');
      $timeout(function () {
        console.log('BerichtCardCtrl updateBericht updateReacties start Clock');

        dataFactoryClock.startClockBerichtCardFast(function () {
          console.log('BerichtCardCtrl updateBericht syncDown controleren op gelezen en reacties');
          $scope.details.gelezen = +berichtSupModel.get('gelezen');
          console.log('BerichtCardCtrl updateBericht syncDown controleren op gelezen: ', +berichtSupModel.get('gelezen'));
          updateReacties(berichtModel);
        });
      }, 200);
    }

    function typingHelp(tmp) {

      if (!tmp.Id) {

        console.warn('BerichtCardCtrl HELP tmp: ', tmp);

      } else {

        var tmp2, tmp3;
        var helpTypes = 'Berichts';
        var helpType = 'Bericht';
        var helpTyp = 'deze';
        if ($scope.details.mode === 'track' || $scope.details.mode === 'bericht') {
          helpTyp = 'dit';
        }

        tmp.naam = tmp.naam.replace('__TYPE__', helpType);
        tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
        tmp3 = tmp2.replace(/__TYPE__/g, helpType);
        tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

        console.log('BerichtCardCtrl HELP tmp: ', tmp.modal);

        $scope.cardHelps.push(tmp);
      }
    }

    function showHelp() {
      console.warn('BerichtCardCtrl showHelp');

      var item;
      if (mode === 'bericht') {
        item = 'Bericht';
      }
      if (mode === 'foto') {
        item = 'Foto';
      }
      if (mode === 'poi') {
        item = 'Bericht';
      }
      if (mode === 'track') {
        item = 'Spoor';
      }
      $scope.titelHelp = 'Blad ' + item;

      $scope.cardHelps = [];

      //attentie = loDash.find(dataFactoryHelp.store, function (helpModel) {
        //return helpModel.get('modal') === 'card-attentie';
      //});
      //typingHelp(loDash.mapValues(attentie, 'value'));

      
      //removeIf(!berichten);
      if ($scope.details.mode === 'bericht') {

        var toelichtingeigenaarbericht,
          toelichtingvolger,
          toelichtingalgemeen,
          toelichtingbericht,
          publiceer,
          bekeken,
          reacties,
          nieuw,
          favoriet,
          bewaren,
          blokkeren,
          groep,
          verwijderen,
          reageer,
          wijzigen,
          kaart,
          label;

        console.error('BerichtCradCtrl profielId, gebruikerId, ceo: ', ceo.profielId, $scope.details.gebruikerId, $scope.ceo.Id);

        if (+ceo.profielId !== 4 && +ceo.profielId !== 5) {
        //if ($scope.details.gebruikerId === $scope.ceo.Id) {
          //
          //  Eigenaar
          //
          toelichtingeigenaarbericht = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-toelichting-eigenaar-bericht';
          });
          typingHelp(loDash.mapValues(toelichtingeigenaarbericht, 'value'));

        } else {
          toelichtingvolger = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-toelichting-volger';
          });
          typingHelp(loDash.mapValues(toelichtingvolger, 'value'));

        }


        toelichtingalgemeen = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-toelichting-algmeen';
        });
        typingHelp(loDash.mapValues(toelichtingalgemeen, 'value'));

        toelichtingbericht = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-toelichting-bericht';
        });
        typingHelp(loDash.mapValues(toelichtingbericht, 'value'));

        bekeken = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-bekeken';
        });
        typingHelp(loDash.mapValues(bekeken, 'value'));

        if ($scope.details.reactiesAantal > 0) {
          reacties = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-reacties';
          });
          typingHelp(loDash.mapValues(reacties, 'value'));
        }

        if ($scope.details.xnew) {
          nieuw = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-nieuw';
          });
          typingHelp(loDash.mapValues(nieuw, 'value'));
        }

        if ($scope.details.star) {
          favoriet = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-favoriet-aan';
          });
        } else {
          favoriet = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-favoriet-uit';
          });
        }
        typingHelp(loDash.mapValues(favoriet, 'value'));

        if ($scope.details.gebruikerId === $scope.ceo.Id) {
          //
          //  Eigenaar
          //
          //
          //   verwijderen
          //
          verwijderen = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-verwijderen';
          });
          typingHelp(loDash.mapValues(verwijderen, 'value'));
          //
          //   wijzigen
          //
          wijzigen = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-wijzigen';
          });
          typingHelp(loDash.mapValues(wijzigen, 'value'));
        } else {
          //
          //  Volger
          //
          blokkeren = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-blokkeren';
          });
          typingHelp(loDash.mapValues(blokkeren, 'value'));
          //
          //   bewaren
          //
          if ($scope.details.volgt) {
            bewaren = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-bewaren-aan';
            });
          } else {
            bewaren = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-bewaren-uit';
            });
          }
          typingHelp(loDash.mapValues(bewaren, 'value'));
        }

        reageer = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-reageer';
        });
        typingHelp(loDash.mapValues(reageer, 'value'));

        label = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-plus';
        });
        typingHelp(loDash.mapValues(label, 'value'));
      }
      //endRemoveIf(!berichten)
      
      
      //remove(berichten)
      if ($scope.details.mode !== 'bericht') {

        var toelichtingalgemeen,
          toelichtingvolger,
          toelichtingeigenaar,
          publiceer,
          bekeken,
          reacties,
          nieuw,
          favoriet,
          bewaren,
          blokkeren,
          groep,
          verwijderen,
          reageer,
          wijzigen,
          kaart,
          label;

        if ($scope.details.gebruikerId === $scope.ceo.Id) {
          //
          //  Eigenaar
          //
          toelichtingeigenaar = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-toelichting-eigenaar';
          });
          typingHelp(loDash.mapValues(toelichtingeigenaar, 'value'));
          //
          //  Private
          //
          if ($scope.details.xprive) {
            publiceer = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-public-uit';
            });
          } else {
            publiceer = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-public-aan';
            });
          }
          typingHelp(loDash.mapValues(publiceer, 'value'));

          toelichtingeigenaar = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-toelichting-eigenaar';
          });
          typingHelp(loDash.mapValues(toelichtingeigenaar, 'value'));

        } else {
          toelichtingvolger = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-toelichting-volger';
          });
          typingHelp(loDash.mapValues(toelichtingvolger, 'value'));

        }

        toelichtingalgemeen = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-toelichting-algmeen';
        });
        typingHelp(loDash.mapValues(toelichtingalgemeen, 'value'));

        bekeken = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-bekeken';
        });
        typingHelp(loDash.mapValues(bekeken, 'value'));

        if ($scope.details.groep !== '') {
          groep = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-groep';
          });
          typingHelp(loDash.mapValues(groep, 'value'));

        }

        if ($scope.details.reactiesAantal > 0) {
          reacties = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-reacties';
          });
          typingHelp(loDash.mapValues(reacties, 'value'));
        }

        if ($scope.details.xnew) {
          nieuw = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-nieuw';
          });
          typingHelp(loDash.mapValues(nieuw, 'value'));
        }

        if ($scope.details.star) {
          favoriet = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-favoriet-aan';
          });
        } else {
          favoriet = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-favoriet-uit';
          });
        }
        typingHelp(loDash.mapValues(favoriet, 'value'));

        //removeIf(!tracks)
        if ($scope.details.poisAantal > 0) {
          if ($scope.details.poisVolgen) {
            pois = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-pois-aan';
            });
          } else {
            pois = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-pois-uit';
            });
          }
          typingHelp(loDash.mapValues(pois, 'value'));
        }

        if ($scope.details.fotosAantal > 0) {
          if ($scope.details.fotosVolgen) {
            fotos = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-fotos-aan';
            });
          } else {
            fotos = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-fotos-uit';
            });
          }
          typingHelp(loDash.mapValues(fotos, 'value'));
        }
        
        //removeIf(berichten)

        if ($scope.details.gebruikerId === $scope.ceo.Id) {
          //
          //  Eigenaar
          //
          //
          //   verwijderen
          //
          verwijderen = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-verwijderen';
          });
          typingHelp(loDash.mapValues(verwijderen, 'value'));
          //
          //   wijzigen
          //
          wijzigen = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-wijzigen';
          });
          typingHelp(loDash.mapValues(wijzigen, 'value'));
        } else {
          //
          //  Volger
          //
          blokkeren = loDash.find(dataFactoryHelp.store, function (helpModel) {
            return helpModel.get('modal') === 'card-blokkeren';
          });
          typingHelp(loDash.mapValues(blokkeren, 'value'));
          //
          //   bewaren
          //
          if ($scope.details.volgt) {
            bewaren = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-bewaren-aan';
            });
          } else {
            bewaren = loDash.find(dataFactoryHelp.store, function (helpModel) {
              return helpModel.get('modal') === 'card-bewaren-uit';
            });
          }
          typingHelp(loDash.mapValues(bewaren, 'value'));
        }

        reageer = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-reageer';
        });
        typingHelp(loDash.mapValues(reageer, 'value'));
        //
        //   naar kaart
        //
        kaart = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-kaart';
        });
        typingHelp(loDash.mapValues(kaart, 'value'));

        label = loDash.find(dataFactoryHelp.store, function (helpModel) {
          return helpModel.get('modal') === 'card-plus';
        });
        typingHelp(loDash.mapValues(label, 'value'));

        console.error('BerichtCardCtrl kaartItemHelps $scope.cardHelps: ', $scope.cardHelps);
      }
      //endRemoveIf(berichten)
      
    }

    function removeBerichtFromStores(berichtId, backend) {

      console.warn('BerichtCardCtrl removeBerichtFromStores berichtId: ', berichtId);

      var berichtModel = loDash.find(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      loDash.remove(dataFactoryBericht.star, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      loDash.remove(dataFactoryBericht.nieuw, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      loDash.remove(dataFactoryBericht.selected, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      var berichttags = berichtModel.xData.tags;

      loDash.each(berichttags, function (berichttag) {
        var tagModel = berichttag.xData;

        if (tagModel) {

          $rootScope.$emit('berichtRemoveLabel', {
            berichtModel: berichtModel,
            tagModel: tagModel
          });
        } else {
          console.error('BerichtCardCtrl removeBerichtFromStores tagModel NOT FOUND');
        }
      });

      loDash.remove(dataFactoryBerichtTag.store, function (berichtTagModel) {
        return berichtTagModel.get('berichtId') === berichtId;
      });
      loDash.remove(dataFactoryBerichtTag.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId;
      });

      $rootScope.$emit('berichtDelete', berichtModel);

      loDash.remove(dataFactoryBerichtSup.store, function (berichtSupModel) {
        return berichtSupModel.get('berichtId') === berichtId;
      });
      loDash.remove(dataFactoryBerichtSup.data, function (dataItem) {
        return dataItem.record.get('berichtId') === berichtId;
      });

      loDash.remove(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });
      loDash.remove(dataFactoryBericht.data, function (dataItem) {
        return dataItem.record.get('Id') === berichtId;
      });

      if (backend) {
        berichtModel.remove();
      }
    }

    $scope.deleteBericht = function () {
      console.warn('BerichtCardCtrl deleteBericht');
      $ionicPopup.confirm({
        title: 'Verwijder Bericht',
        content:
          'Weet je zeker dat deze Bericht<br><br><span class="trinl-rood"><b>' +
          $scope.details.naam +
          '</b></span><br><br>definitief verwijderd moet worden?',
        buttons: [
          {
            text: 'Annuleer'
          },
          {
            text: '<b>Verwijder</b>',
            type: 'button-positive',
            onTap: function () {
              removeBerichtFromStores(berichtId, true);

              $rootScope.$on('berichtenReload');
              $rootScope.$emit('berichtenNieuweAantallen');
              $state.go('berichten.berichten');
            }
          }
        ]
      });
    };

    $scope.closeBerichtCard = function (stay) {

      console.error('BerichtCardCtrl closeBerichtCard isCardClosed: ', isCardClosed);

      dataFactoryClock.stopClockBerichtCard();

      if (!isCardClosed) {
        if (stay === undefined) {
          stay = true;
        }
        console.error('BerichtCardCtrl closePoiCard stay: ', stay);
        if (blacklisted) {
          removeBerichtFromStores(berichtId, false);

          $rootScope.$on('berichtenReload');
          $rootScope.$emit('berichtenNieuweAantallen');
          $state.go('berichten.berichten');
        } else {

          loDash.each($scope.details.reacties, function (reactieModel) {
            var reactieSupModel = loDash.find(dataFactoryBerichtReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieModel.get('Id');
            });
            if (reactieSupModel) {
              reactieSupModel.set('xnew', false);
              reactieSupModel.save();
            }
          });
          console.log('BerichtCardCtrl closeBerichtCard reacties xnew reset in dataFactoryBerichtReactieSup.store');
          //
          // Verwijder status nieuw van bericht in model sup.
          //
          if (berichtSupModel) {

            berichtSupModel.set('gebruikerId', berichtSupModel.get('gebruikerId'));
            berichtSupModel.set('berichtId', berichtSupModel.get('berichtId'));
            var gelezen = +berichtSupModel.get('gelezen');

            console.log('BerichtCardCtrl closeBerichtCard $scope.details.gelezen: ', $scope.details.gelezen);

            console.log('BerichtCardCtrl closeBerichtCard gelezen berichtSupModel oud: ', gelezen);
            var xread = +berichtSupModel.get('xread') + 1;
            berichtSupModel.set('xread', xread);
            console.log('BerichtCardCtrl closeBerichtCard xread updated in berichtSupModel: ', xread);

            $scope.details.gelezen = gelezen + xread;
            berichtModel.xData.sup.set('gelezen', $scope.details.gelezen);
            console.log('BerichtCardCtrl closeBerichtCard gelezen + xread updated as gelezen in berichtSupModel: ', $scope.details.gelezen);

            berichtSupModel.set('xnew', false);
            console.log('BerichtCardCtrl closeBerichtCard xnew reset in berichtSupModel');
            //
            // Verwijder bericht van lijst nieuw in store
            //
            loDash.remove(dataFactoryBericht.nieuw, function (berichtNieuwModel) {
              return berichtNieuwModel.get('Id') === berichtId;
            });

            berichtSupModel.save().then(

              function (berichtSupModel) {
                berichtSupModel.set('xread', 0);
                var berichtNieuw = [];
                var berichtReactieNieuw = [];

                berichtNieuw = loDash.filter(dataFactoryBerichtSup.store, function (berichtSup) {
                  return berichtSup.get('xnew');
                });

                berichtReactieNieuw = loDash.filter(dataFactoryBerichtReactieSup.store, function (berichtReactieSup) {
                  return berichtReactieSup.get('xnew');
                });

                console.log('BerichtCardCtrl closed nieuwe bericht, berichtReacties: ', berichtNieuw, berichtReactieNieuw);

                if (berichtNieuw.length > 0 || berichtReactieNieuw.length > 0) {
                  dataFactoryNotification.composeTitleBodyNotification(berichtNieuw.length, berichtReactieNieuw.length, 'bericht');
                  console.log('BerichtCardCtrl notification met berichtNieuw, berichtReactieNieuw: ', berichtNieuw, berichtReactieNieuw);
                }

                $rootScope.$emit('sleepClockBericht');
              },
              function () {
                console.error('berichtSupModel saved ERROR');
              }
            );
          }

          $rootScope.$emit('berichtenNieuweAantallen');
          if (stay) {
            $state.go('berichten.berichten');
          }
        }
        isCardClosed = true;
      } else {
        console.warn('BerichtCardCtrl closeBerichtCard SKIPPED!!!!!');
      }
    };

    $scope.clearSearchLabel = function () {
      console.warn('BerichtCardCtrl clearearchLabel');

      $scope.search.label = '';
    };

    $scope.openTags = function ($event) {
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function () {
      console.warn('BerichtCracCtrl closeTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeModalTags();
      } else {
        $scope.closePopoverTags();
      }
    };
    //
    // Popover Modal
    //
    $ionicPopover
      .fromTemplateUrl('tagsModal.html', {
        scope: $scope
      })
      .then(function (modalTags) {
        $scope.modalTags = modalTags;
      });

    $scope.openModalTags = function ($event) {
      console.warn('openModalTags: ');
      $scope.modalTags.show($event);
    };

    $scope.closeModalTags = function () {
      console.warn('closeModalTags: ');
      $scope.modalTags.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTags.remove();
    });
    //
    // Modal Bericht
    //
    $ionicModal.fromTemplateUrl(
      'berichtModal.html',
      function (modalBericht) {
        $scope.modalBericht = modalBericht;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalBericht = function () {
      $scope.modalBericht.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalBericht = function () {
      $scope.modalBericht.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalBericht.remove();
      console.log('BerichtCardCtrl ModalBericht is removed!');
    });
    //
    // Popover Tag
    //
    $ionicPopover
      .fromTemplateUrl('tagsPopover.html', {
        scope: $scope
      })
      .then(function (popoverTags) {
        $scope.popoverTags = popoverTags;
      });

    $scope.openPopoverTags = function ($event) {
      $scope.popoverTags.show($event);
    };

    $scope.closePopoverTags = function () {
      $scope.popoverTags.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.popoverTags.remove();
    });
    //
    // Modal bericht
    //
    $ionicModal.fromTemplateUrl(
      'berichtModal.html',
      function (modalBericht) {
        $scope.modalBericht = modalBericht;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalBericht = function () {
      $scope.modalBericht.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalBericht = function () {
      $scope.modalBericht.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalBericht.remove();
      console.log('BerichtCardCtrl ModalBericht is removed!');
    });

    $scope.closeGroepen = function ($event) {
      console.log('BerichtCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepenModal();
      } else {
        $scope.closeGroepenPopover($event);
      }
    };

    $scope.openGroepen = function ($event) {
      console.log('BerichtCardCtrl openGroepen $event: ', $event);
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGroepenModal();
      } else {
        $scope.openGroepenPopover($event);
      }
    };
    //
    // GroepenModal
    //
    $ionicModal.fromTemplateUrl(
      'groepenModal.html',
      function (groepenModal) {
        $scope.groepenModal = groepenModal;
      },
      {
        scope: $scope
      }
    );

    $scope.openGroepenModal = function () {
      console.log('BerichtCardCtrl openGroepenModal');
      $scope.groepenModal.show();
    };

    $scope.closeGroepenModal = function () {
      console.log('BerichtCardCtrl closeGroepenModal');
      $scope.groepenModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepenModal.remove();
      console.log('BerichtCardCtrl groepenModal is removed!');
    });
    //
    // GroepenPopover
    //
    $ionicPopover
      .fromTemplateUrl('groepenPopover.html', {
        scope: $scope
      })
      .then(function (groepenPopover) {
        $scope.groepenPopover = groepenPopover;
      });

    $scope.openGroepenPopover = function ($event) {
      console.log('BerichtCardCtrl openGroepenPopover');
      $scope.groepenPopover.show($event);
    };

    $scope.closeGroepenPopover = function () {
      console.log('BerichtCardCtrl closeGroepenPopover');
      $scope.groepenPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepenPopover.remove();
    });

    $scope.closeGroepDeelnemers = function () {
      console.log('BerichtCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepDeelnemersModal();
      } else {
        $scope.closeGroepDeelnemersPopover();
      }
    };

    $scope.openGroepDeelnemers = function ($event) {
      console.log('BerichtCardCtrl openGroepen $event: ', $event);
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGroepDeelnemersModal();
      } else {
        $scope.openGroepDeelnemersPopover($event);
      }
    };
    //
    // GroepenDeelnemersModal
    //
    $ionicModal.fromTemplateUrl(
      'groepDeelnemersModal.html',
      function (groepDeelnemersModal) {
        $scope.groepDeelnemersModal = groepDeelnemersModal;
      },
      {
        scope: $scope
      }
    );

    $scope.openGroepDeelnemersModal = function () {
      console.log('BerichtCardCtrl openGroepDeelnemersModal');
      $scope.groepDeelnemersModal.show();
    };

    $scope.closeGroepDeelnemersModal = function () {
      console.log('BerichtCardCtrl closeGroepDeelnemersModal');
      $scope.groepDeelnemersModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersModal.remove();
      console.log('BerichtCardCtrl groepDeelnemersModal is removed!');
    });
    //
    // GroepDeelnemersPopover
    //
    $ionicPopover
      .fromTemplateUrl('groepDeelnemersPopover.html', {
        scope: $scope
      })
      .then(function (groepDeelnemersPopover) {
        $scope.groepDeelnemersPopover = groepDeelnemersPopover;
      });

    $scope.openGroepDeelnemersPopover = function ($event) {
      console.log('BerichtCardCtrl openGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.show($event);
    };

    $scope.closeGroepDeelnemersPopover = function () {
      console.log('BerichtCardCtrl closeGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersPopover.remove();
    });
    //
    // Popover helpPopoverCard
    //
    $scope.openHelp = function ($event) {
      console.log('BerichtCardCtrl openHelp');
      showHelp();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      console.log('BerichtCardCtrl openHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $ionicPopover
      .fromTemplateUrl('helpPopover.html', {
        scope: $scope
      })
      .then(function (helpPopover) {
        $scope.helpPopover = helpPopover;
      });
    $scope.openHelpPopover = function ($event) {
      console.log('BerichtCardCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      console.log('BerichtCardCtrl openHelpPopover');
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
      console.log('BerichtCardCtrl closeHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModalCard = function () {
      console.log('BerichtCardCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
    /*
    //
    // Modal globalHelpModal
    //
    $ionicModal.fromTemplateUrl(
      'globalHelpModal.html',
      function (globalHelpModal) {
        $scope.globalHelpModal = globalHelpModal;
      },
      {
        scope: $scope
      }
    );
    $scope.openGlobalHelpModal = function () {
      $scope.globalHelpModal.show();
    };
    $scope.closeGlobalHelpModal = function () {
      $scope.globalHelpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.globalHelpModal.remove();
    });
    
    //
    // Popover globalHelpPopover
    //
    $ionicPopover
      .fromTemplateUrl('globalHelpPopover.html', {
        scope: $scope
      })
      .then(function (globalHelpPopover) {
        $scope.globalHelpPopover = globalHelpPopover;
      });
    
      $scope.openGlobalHelpPopover = function ($event) {
      console.warn('KaartCtrl openGlobaleHelpPopover');
      $scope.globalHelpPopover.show($event);
    };
    
    $scope.closeGlobaleHelpPopover = function () {
      $scope.globalHelpPopover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.globalHelpPopover.remove();
    });
    //
    // Modal globalHelpModal
    //
    $ionicModal.fromTemplateUrl(
      'globalHelpModal.html',
      function (globalHelpModal) {
        $scope.globalHelpModal = globalHelpModal;
      },
      {
        scope: $scope
      }
    );
    $scope.openGlobalHelpModal = function () {
      $scope.globalHelpModal.show();
    };
    
    $scope.closeGlobalHelpModal = function () {
      $scope.globalHelpModal.hide();
    };
    
    $scope.$on('$destroy', function () {
      $scope.globalHelpModal.remove();
    });
    */
    //
    // Modal reactie
    //
    $ionicModal.fromTemplateUrl(
      'reactieModal.html',
      function (modalReactie) {
        $scope.modalReactie = modalReactie;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalReactie = function () {
      $scope.modalReactie.show();
    };

    $scope.closeModalReactie = function () {
      $scope.modalReactie.hide();
    };

    $scope.setReactieNavTitle = function (title) {
      console.log('BerichtCardCtrl setReactieNavTitle: ' + title);
      $ionicNavBarDelegate.title(title);
    };

    function init() {
      dataFactoryBerichtSup.store = loDash.uniqBy(dataFactoryBerichtSup.store, function (berichtSup) {
        return berichtSup.get('berichtId');
      });
      console.warn('BerichtCardCtrl init BerichtStore: ', dataFactoryBericht.store);
      console.warn('BerichtCardCtrl init BerichtSupStore: ', dataFactoryBerichtSup.store);
      berichtModel = loDash.find(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.get('Id') === berichtId;
      });

      console.warn('BerichtCardCtrl init berichtModel: ', berichtModel, berichtModel.get('naam'));

      if (berichtModel) {
        berichtSupModel = loDash.find(dataFactoryBerichtSup.store, function (berichtSupModel) {
          return berichtSupModel.get('berichtId') === berichtId;
        });
        //
        // Indien geen sup dan nieuwe aanmaken
        //
        if (!berichtSupModel) {
          berichtSupModel = new dataFactoryBerichtSup.Model();
          berichtSupModel.set('xnew', true);
          berichtSupModel.set('star', false);
          //berichtSupModel.set('berichtId', berichtId);
          berichtSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          console.error('BerichtCardCtrl init berichtSupModel: ', berichtSupModel.get('berichtId'));
          berichtSupModel.save().then(function () {
            berichtModel.xData.sup = berichtSupModel;
            var xnew = berichtModel.xData.sup.get('xnew');

            if (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
              var nieuwModel = loDash.find(dataFactoryBericht.nieuw, function (nieuwModel) {
                return nieuwModel.get('Id') === berichtId;
              });
              if (!nieuwModel) {
                dataFactoryBericht.nieuw.push(berichtModel, berichtModel.get('naam'));
              }
            }
            console.log('BerichtCardCtrl init met nieuw supModel');
          });
        } else {
          console.log('BerichtCardCtrl init bestaand supModel: ', berichtSupModel);

          initxData(berichtModel);

          berichtModel.xData.sup = berichtSupModel;
          console.log('berichtModel.xData.sup: ', berichtModel.xData.sup);

          var xnew = berichtModel.xData.sup.get('xnew');

          if (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
            var nieuwModel = loDash.find(dataFactoryBericht.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === berichtId;
            });
            if (!nieuwModel) {
              dataFactoryBericht.nieuw.push(berichtModel);
            }
          }
        }
        updateBericht(berichtModel, berichtModel.get('naam'));
      } else {
        console.warn('BerichtCardCtrl findRecord ERROR Id: ', berichtId);

        $ionicPopup.confirm({
          title: 'Bericht',
          content:
            'Deze Bericht is niet meer beschikbaar!<br>De eigenaar heeft deze Bericht waarschijnlijk verwijderd.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $state.go('berichten.berichten');
              }
            }
          ]
        });
      }
    }
  }
]);
