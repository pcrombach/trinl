/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('PoiCardCtrl', ['loDash', '$timeout', '$rootScope', '$q', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'dataFactoryCeo', 'dataFactoryHelp', 'dataFactoryNotification', 'dataFactoryClock', 'dataFactoryPoiReactie', 'dataFactoryPoiReactieSup', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryPoiTag', 'dataFactoryTag',
  //removeIf(!pois)
  'dataFactoryTrack',
  //endRemoveIf(!pois)
  
  
  
  
  
  
  'dataFactoryBlacklist', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers',
  function (loDash, $timeout, $rootScope, $q, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, $ionicListDelegate, dataFactoryCeo, dataFactoryHelp, dataFactoryNotification, dataFactoryClock, dataFactoryPoiReactie, dataFactoryPoiReactieSup, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTag,
    //removeIf(!pois)
    dataFactoryTrack,
    //endRemoveIf(!pois)
    
    
    
    
    
    
    dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers
  ) {

    var isCardClosed = false;

    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    //console.error('PoiCardCtrl ceo.Id: ', ceo.Id);
    //console.error('PoiCardCtrl ceo.profielId: ', +ceo.profielId);

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
    $scope.details.mode = 'poi';
    var mode = 'poi';


    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'fotos/small_non_existing_id.png';

    var blacklisted = false;
    var isCardClosed = false;

    var poiId = $stateParams.Id;
    var poiModel;
    var poiSupModel;
    var oldInputNaam;
    var oldInputTekst;
    // eslint-disable-next-line no-unused-vars
    //
    var event0a = $scope.$on('$ionicView.beforeEnter', function () {
      //console.warn('PoiCardCtrl $ionicView.beforeEnter');
      init();
    });
    $scope.$on('$destroy', event0a);

    var event0z = $scope.$on('$ionicView.afterEnter', function () {
      //console.warn('PoiCardCtrl $ionicView.afterEnter');
      isCardClosed = false;
    });
    $scope.$on('$destroy', event0z);

    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      //console.warn('PoiCardCtrl $ionicView.beforeLeave');
      //$timeout(function () {
      $scope.closePoiCard(false);
      //}, 100);
    });
    $scope.$on('$destroy', event0b);
    //
    var event1 = $rootScope.$on('labelsPoiUpdate', function (event, args) {
      var poiModel = args.poiModel;
      //console.warn('PoiCardCtrl on.labelsPoiUpdate poiModel: ', poiModel, poiModel.get('naam'));
      updateLabels(poiModel);
    });
    $scope.$on('$destroy', event1);
    //
    var event7 = $rootScope.$on('poiVerwijderd', function (event, args) {
      var poiModel = args.poiModel;
      if (poiModel.get('Id') === poiId) {
        $ionicPopup.confirm({
          title: 'Verwijder Locatie',
          content: 'Deze Locatie is zojuist door de eigenaar verwijderd.<br><br>Deze Locatie wordt gesloten',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('pois.pois');
            }
          }]
        });
      }
    });
    $scope.$on('$destroy', event7);
    //
    $scope.infoTag = function (tagModel) {

      //console.log('PoiCardCtrl tagModel: ', tagModel);

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
      //console.warn('PoiCardCtrl editTag: ', tag, tagModel);

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

        //console.log('PoisSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          //console.log('PoisSideMenuCtrl editTag poiModel tags: ', tag, poiModel && poiModel.xData.tags);

          $rootScope.$emit('poiRemoveLabel', {
            poiModel: poiModel,
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

            $rootScope.$emit('poiAddLabel', {
              poiModel: poiModel,
              tagModel: tagModel
            });

            $rootScope.$emit('poisFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });

          });
        }
      });
    };

    $scope.deleteTag = function (tagModel) {
      var tag = tagModel.get('tag');
      //console.warn('PoiCardCtrl editTag: ', tag);

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

            loDash.each(dataFactoryPoi.store, function (poiModel) {
              //console.log('PoisSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, poiModel);
              loDash.each(poiModel.xData.tags, function (poiTagModel) {
                //console.log('PoisSideMenuCtrl deleteTag poiModal.tags loop: ', poiModel.xData.tags, poiTagModel);
                (function (poiTagModel) {
                  if (poiTagModel.xData.get('tag') === tag) {
                    //console.log('PoisSideMenuCtrl deleteTag poiTagModel in poiModel.tags wordt verwijderd uit backend: ', poiTagModel);
                    poiTagModel.remove().then(function () {
                      //console.log('PoisSideMenuCtrl deleteTag poiTagModel wordt verwijderd uit poiModel.tags: ', poiTagModel);
                      loDash.remove(poiModel.xData.tags, function (poiTagModel) {
                        return poiTagModel.xData.get('tag') === tag;
                      });
                    });
                    $rootScope.$emit('poiRemoveLabel', {
                      poiModel: poiModel,
                      tagModel: tagModel
                    });
                  }
                })(poiTagModel);
              });
            });

            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //console.log('PoisSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle poitags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('PoisSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.poisFilterAlle();
          }
        }]
      });
    };


    function sorteerGlobalTags() {

      //console.error('poiCardCtrl sorteerGlobalTags');
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

      //console.error('PoiCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //

      //console.error('$scope.details.tags: ', $scope.details.tags);

      var tagsPrivate = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      if (tagsPrivate.length > 0) {
        tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');
      }
      //console.error('tagsPrivate: ', tagsPrivate);

      var tagsStandaard = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      if (tagsStandaard.length > 0) {
        tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');
      }
      //console.error('tagsStandaard: ', tagsStandaard);

      var tagsNormaal = loDash.filter($scope.details.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      if (tagsNormaal.length > 0) {
        tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.tag.value, 'asc');
      }
      //console.error('tagsNormaal: ', tagsNormaal);

      $scope.details.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }

    function poisCheckPoiReactieAantal(reacties) {
      //console.warn('PoisCtrl poisCheckPoiReactieOud, reacties: ', reacties);

      var maxAantal = 50;

      var verwijderingen = 0;

      var q = $q.defer();

      var teller = 0;
      loDash.each(reacties, function (reactieModel) {
        //console.log('PoisCtrl poisCheckPoiReactieAantal reactieModel: ', reactieModel);
        teller += 1;
        if (teller > maxAantal) {

          verwijderingen += 1;

          var reactieId = reactieModel.get('Id');

          reactieModel.remove();
          loDash.remove(dataFactoryPoiReactie.store, function (reactieModel) {
            return reactieModel.get('Id') === reactieId;
          });
          loDash.remove(dataFactoryPoiReactie.data, function (dataItem) {
            return dataItem.record.get('Id') === reactieId;
          });
          var reactieSupModel = loDash.find(dataFactoryPoiReactieSup.store, function (reactieSupModel) {
            return reactieSupModel.get('reactieId') === reactieId;
          });
          if (reactieSupModel) {
            reactieSupModel.remove();
            loDash.remove(dataFactoryPoiReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            loDash.remove(dataFactoryPoiReactieSup.data, function (dataItem) {
              return dataItem.record.get('reactieId') === reactieId;
            });
          }
          //console.error('PoisCtrl poisCheckPoiReactieAantal reactie removed SUCCESS');
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

    function poisCheckPoiReactieOud(reacties) {

      //console.warn('PoisCtrl poisCheckPoiReactieOud, reacties: ', reacties);

      var aantalOuder = 7;
      var formatOuder = 'days';

      var q = $q.defer();
      var tooOld = moment().subtract(aantalOuder, formatOuder).format('YYYY-MM-DD HH:mm:ss');
      var verwijderingen = false;
      //console.log('PoisCtrl poisCheckPoiReactieOud: ', tooOld);
      //
      //  Ouder dan 
      //
      loDash.each(reacties, function (reactieModel) {
        if (reactieModel) {
          //console.log('PoisCtrl poisCheckPoiReactieOud reactieModel: ', reactieModel);
          var datum = reactieModel.get('changedOn');
          var reactieId = reactieModel.get('Id');
          if (datum < tooOld) {
            verwijderingen += 1;
            //console.log('PoisCtrl poisCheckPoiReactieOud changedOn, poiId, tooOld: ', datum, poiId, tooOld);

            reactieModel.remove();
            loDash.remove(dataFactoryPoiReactie.store, function (reactieModel) {
              return reactieModel.get('Id') === reactieId;
            });
            loDash.remove(dataFactoryPoiReactie.data, function (dataItem) {
              return dataItem.record.get('Id') === reactieId;
            });
            var reactieSupModel = loDash.find(dataFactoryPoiReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            if (reactieSupModel) {
              reactieSupModel.remove();
              loDash.remove(dataFactoryPoiReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('reactieId') === reactieId;
              });
              loDash.remove(dataFactoryPoiReactieSup.data, function (dataItem) {
                return dataItem.record.get('reactieId') === reactieId;
              });
            }
            $rootScope.$emit('filter');
            $rootScope.$emit('poisNieuweAantallen');
            //console.error('PoisCtrl poisCheckPoiReactieOud reactie removed SUCCESS');
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

    function updateReacties(poiModel) {
      //console.log('PoisCtrl updateReacties voor poi naam Id: ', poiModel.get('Id'), poiModel.get('naam'));
      var poiId = poiModel.get('Id');

      //console.log('PoisCtrl updateReacties dataFactoryPoiReactie.store: ', dataFactoryPoiReactie.store);

      var poiReacties = loDash.filter(dataFactoryPoiReactie.store, function (poiReactieModel) {
        return poiReactieModel.get('poiId') === poiId;
      });
      //
      $scope.details.reacties = loDash.orderBy(poiReacties, 'createdOn.value', 'desc');
      poisCheckPoiReactieAantal(poiReacties).then(function () {
        poisCheckPoiReactieOud(poiReacties).then(function () {
        });
      });
      //console.warn('PoiCardCtrl loadReactie poi in store, aantal: ', dataFactoryPoi.store.length);
      //console.warn('PoiCardCtrl loadReactie reacties in store, aantal: ', poiReacties.length);
      $scope.details.reactiesAantal = poiReacties.length;
    }

    $scope.reactie = function () {
      //console.warn('PoiCardCtrl reactie');

      $scope.input = {};
      $scope.input.naam = '';
      $scope.input.tekst = '';
      $scope.initPoi = 'Reactie';

      $scope.openModalReactie();
    };

    $scope.saveReactie = function (input) {

      //console.warn('PoiCardCtrl saveReactie input poiId: ', input, poiId);

      if ($scope.initPoi === 'Reactie') {

        $scope.details.reactiesAantal += 1;

        var reactieModel = new dataFactoryPoiReactie.Model();

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = tmp.replace(/\\"/g, '"');
        var htmlreactietekst = '<p>' + tmp + '</p>';
        tmp = false;
        //console.error('PoiCardCtrl saveReactie: ', htmlreactietekst);
        reactieModel.set('reactie', htmlreactietekst);
        reactieModel.set('poiId', poiId);
        reactieModel.set('poiGebruikerId', poiModel.get('gebruikerId'));
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
          var reactieSupModel = new dataFactoryPoiReactieSup.Model();
          reactieSupModel.set('poiId', poiId);
          reactieSupModel.set('reactieId', reactieId);
          reactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          reactieSupModel.set('xnew', false);
          reactieSupModel.save().then(function (reactieSupModel) {
            //console.error('PoiCardCtrl saveReactie reactieSupModel: ', reactieSupModel);
            reactieModel.xData = {
              sup: reactieSupModel
            };
          });
          poiSupModel.set('poiId', poiId);
          poiSupModel.save().then(function () {
            //console.error('PoiCardCtrl saveReactie poiSupModel: ', poiSupModel);
          });
          $scope.details.reacties.splice(0, 0, reactieModel);
        });
        $scope.closeModalReactie();
      }
    };

    $scope.savePoiItemTekst = function (input) {
      //console.warn('PoiCardCtrl savePoiTekst: ', $scope.details);
      //console.warn('PoiCardCtrl savePoiTekst: ', input);
      //console.error('PoiCardCtrl size message: ', input.naam.length + input.tekst.length);

      $scope.details.naam = input.naam;
      $scope.details.tekst = input.tekst;
      var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      tmp = false;
      if (input.naam !== oldInputNaam) {
        poiModel.set('naam', input.naam.substr(0, 7500));
        $scope.details.naam = input.naam.substr(0, 7500);
        tmp = true;
      }
      if (input.tekst !== oldInputTekst) {
        poiModel.set('tekst', input.tekst.substr(0, 7500));
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
        poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
        poiModel.save();
        $rootScope.$emit('poiUpdate', poiModel);
      }

      $scope.closeModalPoi();
    };

    $scope.openPoiTekst = function () {
      //console.warn('PoiCardCtrl openPoiTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalPoi();
    };

    function updateLabels(poiModel) {
      //console.log('PoiCardCtrl updateLabels poiModel, poiId: ', poiModel, poiId, poiModel.get('naam'));
      if (poiModel.get('Id') === poiId) {
        //console.log('PoiCardCtrl updateLabels poiModel: ', poiModel.get('naam'), poiModel.get('Id'));
        //
        // Indien labels worden toegevoegd dan worden die toegevoegd in de dataFactoryPoiTag store en data
        // De label moet ook toegevoegd worden aan de poiModel.xData.tags
        initxData(poiModel);
        $scope.details.tags = poiModel.xData.tags;
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
      //console.warn('PoiCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          if (poiModel.get('xprive')) {
            tagModel.set('xprive', true);
            tagModel.set('yprive', false);
          } else {
            tagModel.set('xprive', false);
            tagModel.set('yprive', true);
          }
          tagModel.save().then(function () {
            //console.log('addNieuweLabel: ', dataFactoryTag.store);
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
            //console.log('addNieuweLabel: ', $scope.global.tags);
            $scope.selectLabelClick(tagModel);
            $scope.clearSearchLabel();
            //console.log('PoiCardCtrl addNieuweLabel tag: ', tagModel);
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

      //console.warn('PoiCardCtrl selectLabelClick tagModel: ', tagModel);
      //console.warn('PoiCardCtrl selectLabelClick poiId: ', poiId);
      //console.warn('PoiCardCtrl selectLabelClick tagId: ', tagModel.get('Id'));
      //
      //  Kijk of de poitag reeds bestaat
      //
      var found = loDash.find(dataFactoryPoiTag.store, function (poiTagModel) {
        return poiTagModel.get('poiId') === poiId && poiTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var poiTagModel = new dataFactoryPoiTag.Model();
        poiTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        poiTagModel.set('poiId', poiId);
        poiTagModel.set('tagId', tagId);
        poiTagModel.set('xprive', true);
        poiTagModel.set('yprive', false);

        //console.error('PoiCardCtrl newLabel groepenId: ', poiModel.get('groepenId'));
        var groepenId = poiModel.get('groepenId');
        if (groepenId === '' || groepenId === 'Iedereen') {
          if (tagId.length <= 3) {
            poiTagModel.set('yprive', true);
            poiTagModel.set('xprive', false);
            //console.log('PoiCardCtrl publiceren PUBLIC tagId', poiTagModel.get('tagId'));
          }
        } else {
          poiTagModel.set('yprive', true);
          poiTagModel.set('xprive', false);
          //console.log('PoiCardCtrl publiceren made PUBLIC tagId', poiTagModel.get('tagId'));
          //
          tagModel.set('yprive', true);
          tagModel.set('xprive', false);
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
          });
          //console.log('PoiCardCtrl publiceren made PUBLIC tag, naam', tagModel.get('tag'));
        }
        poiTagModel.save().then(function () {

          poiTagModel.xData = tagModel;
          poiModel.xData.tags.push(poiTagModel);
          $scope.details.tags = poiModel.xData.tags;
          sorteerDetailsTags();
          $rootScope.$emit('poiAddLabel', {
            poiModel: poiModel,
            tagModel: tagModel
          });
        });
        $scope.closeTags();
      } else {
        $ionicPopup.confirm({
          title: 'Toevoegen label',
          content: 'Dit label is reeds toegevoegd aan deze Locatie.',
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
        'Selecteer een label in onderstaande lijst. Indien deze te lang is kun je door middel van zoeken het aantal labels verkleinen. Voer daarvoor de zoektekst in, in het zoekvenster. De lijst toont dan alle labels waarin deze tekst voorkomt. Als je het label gevonden hebt, selecteer het in de lijst, het label wordt dan toegevoegd aan de Locatie.';
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover($event);
      }
    };

    $scope.toevoegenTagHelp = function () {
      $scope.helpTitel = 'Label toevoegen';
      $scope.helpContent =
        'Wanneer de tekst niet te vinden is door middel van het zoekvenster verschijnt rechtsboven de tekst ‘+ Voeg toe’. Klik hier om de getypte tekst uit het zoekvenster als label toe te voegen aan de lijst. Het label wordt tevens toegevoegd aan de gekozen Locatie.';

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpModal();
        //$scope.openGlobalHelpPopover($event);
      }
    };

    $scope.addTagToPoi = function ($event) {
      //console.warn('PoiCardCtrl addTagToPoi');

      $scope.clearSearchLabel($event);
      $scope.openTags($event);
    };

    $scope.deleteLabelTag = function (poiTagModel) {
      //console.warn('PoiCardCtrl deleteLabelTag poiModel: ', poiModel, poiModel.get('naam'), );
      //console.warn('PoiCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      //console.warn('PoiCardCtrl deleteLabelTag poiTagModel: ', poiTagModel);
      //console.warn('PoiCardCtrl deleteLabelTag tagModel: ', poiTagModel.xData);
      var tagModel = poiTagModel.xData;
      //console.warn('PoiCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      //console.warn('PoiCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));
      //console.warn('PoiCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      //console.warn('PoiCardCtrl deleteLabelTag poiModel.xdata.tags: ', poiModel.xData.tags);

      var poiTagId = poiTagModel.get('Id');

      poiTagModel.remove().then(function () {

        poiTagModel.xData = tagModel;
        $rootScope.$emit('poiRemoveLabel', {
          poiModel: poiModel,
          tagModel: tagModel
        });

        loDash.remove($scope.details.tags, function (poiTagModel) {
          return poiTagModel.get('Id') === poiTagId;
        });
        sorteerDetailsTags();
        loDash.remove(poiModel.xData.tags, function (poiTagModel) {
          return poiTagModel.get('Id') === poiTagId;
        });

      });
    };

    $scope.selecteerPoi = function () {
      //console.log('PoisCtrl selecteerPoi: ', poiModel);

      $rootScope.$emit('poiSelected', poiModel);
      $state.go('app.kaart');
    };

    $scope.clickedAvatar = function (details) {
      //console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      //console.warn('PoiCardCtrl clickedAvatar naam: ', details.gebruikerNaam);
      //console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      if (details.gebruikerId == $scope.ceo.Id) {
        var content =
          'Je bent de eigenaar van deze Locatie.<br><br>Tik op verwijder om deze Locatie te verwijderen.';
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
            'Je wil geen Locaties meer ontvangen van<br><br><span class="trinl-rood">' +
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

                //console.warn('PoiCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

                if (found) {
                  //console.warn('PoiCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

                  $scope.details.volgt = true;

                  found.set('Id', found.get('Id'));
                  found.set('gebruikerId', $scope.ceo.Id);
                  found.set('type', 'poigebruikers');
                  found.set('blackId', gebruikerId);
                  found.set('reden', 'avatar');
                  found.remove();
                  removed = false;
                } else {
                  $scope.details.volgt = false;

                  var blacklistModel = new dataFactoryBlacklist.Model();
                  blacklistModel.set('gebruikerId', $scope.ceo.Id);
                  blacklistModel.set('type', 'poigebruikers');
                  blacklistModel.set('blackId', gebruikerId);
                  blacklistModel.set('eigenaar', gebruikerId);
                  blacklistModel.set('naam', naam);
                  blacklistModel.set('reden', 'avatar');
                  blacklistModel.save();
                  removed = true;

                  //console.warn('PoiCardCtrl updateVolgt blacklistStore blacklistModel niet gevonden aangemaakt en saved: ', blacklistModel);
                }

                if (removed) {
                  loDash.remove(dataFactoryPoi.star, function (starModel) {
                    return starModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryPoi.nieuw, function (nieuwModel) {
                    return nieuwModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryPoi.selected, function (
                    selectedModel
                  ) {
                    return selectedModel.get('gebruikerId') === gebruikerId;
                  });
                  $rootScope.$emit('poiDelete', details.gebruikerId);
                }
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                var itemsToRemove = loDash.filter(dataFactoryPoi.store, function (poiModel) {
                  return poiModel.get('gebruikerId') === gebruikerId;
                });
                //console.log('PoiCardCtrl poiItems removing from Store.....: ', itemsToRemove);

                loDash.each(itemsToRemove, function (poiModel) {
                  var poiId = poiModel.get('Id');

                  removePoiFromStores(poiId, false);
                });

                $rootScope.$on('poisReload');
                $rootScope.$emit('poisNieuweAantallen');
                $state.go('pois.pois');
              }
            }
          ]
        });
      }
    };

    $scope.updateVolgt = function () {
      //console.warn('PoiCardCtrl updateVolgt: ', poiModel, poiModel.get('naam'));

      $scope.details.volgt = false;

      blacklisted = false;

      var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('blackId') === poiModel.get('Id');
      });

      //console.warn('PoiCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

      if (found) {
        //console.warn('PoiCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

        removePoiFromStores(poiModel.get('Id'), false);

        $scope.details.volgt = true;

        found.set('Id', found.get('Id'));
        found.set('gebruikerId', $scope.ceo.Id);
        found.set('type', 'poi');
        found.set('blackId', poiModel.get('Id'));
        found.set('reden', 'pinned');
        found.remove();
        blacklisted = false;
      } else {
        $scope.details.volgt = false;

        var blacklistModel = new dataFactoryBlacklist.Model();
        blacklistModel.set('gebruikerId', $scope.ceo.Id);
        blacklistModel.set('type', 'poi');
        blacklistModel.set('blackId', poiModel.get('Id'));
        blacklistModel.set('eigenaar', poiModel.get('gebruikerId'));
        blacklistModel.set('naam', poiModel.get('naam'));
        blacklistModel.set('reden', 'pinned');
        blacklistModel.save();
        blacklisted = true;
      }
    };

    $scope.updateStar = function () {
      //console.warn('PoiCardCtrl updateStar in: ', poiSupModel);

      $scope.details.star = poiSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        poiModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryPoi.star, function (poiModel) {
          return poiModel.get('Id') === poiId;
        });
        poiSupModel.set('star', $scope.details.star);
        //console.warn('PoiCardCtrl updateStar poiSupModel: ', poiSupModel.get('poiId'));
        poiSupModel.save();
        //console.warn('PoiCardCtrl updateStar: ', poiSupModel, poiModel.xData.sup.xnew.value);
      } else {
        $scope.details.star = true;
        poiModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryPoi.star, function (poiStarModel) {
          return poiStarModel.get('Id') === poiId;
        });
        if (!found) {
          dataFactoryPoi.star.push(poiModel);
        }
        poiSupModel.set('star', $scope.details.star);
        //poiSupModel.set('poiId', poiId);
        //console.warn('PoiCardCtrl updateStar poiSupModel: ', poiSupModel.get('poiId'));
        poiSupModel.save();
        //console.warn('PoiCardCtrl updateStar: ', poiSupModel, poiModel.xData.sup.xnew.value);
      }
      $rootScope.$emit('poisNieuweAantallen');
    };

    $scope.selectGroep = function (groep) {
      //console.warn('PoiCardCtrl selectGroep: ', groep, groep.groep, groep.groepenId);
      $scope.details.groep = groep.groep;
      poiModel.set('groepenId', groep.groepenId);
      $scope.details.xprive = false;
      poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
      poiModel.set('yprive', true);
      poiModel.set('xprive', false);
      poiModel.save();
      //
      //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
      //  Standaard labels zijn altijd public. Dus niet publiceren.
      //  Andere Tags en poitags ook prive/public maken
      //
      //console.log('PoiCardCtrl selectGroeppoitags, tags van naam: ', poiModel.get('naam'));
      //
      loDash.each(dataFactoryPoiTag.store, function (poiTagModel) {
        //
        if (poiTagModel.get('poiId') === poiId) {
          //
          var tagId = poiTagModel.get('tagId');
          //
          poiTagModel.set('yprive', true);
          poiTagModel.set('xprive', true);
          //console.log('PoiCardCtrl selectGroep made PRIVATE tagId', poiTagModel.get('tagId'));

          var groepenId = poiModel.get('groepenId');
          if (groepenId === '' || groepenId === 'Iedereen') {

            if (tagId.length <= 3) {
              poiTagModel.set('yprive', true);
              poiTagModel.set('xprive', false);
              //console.log('PoiCardCtrl selectGroep PUBLIC tagId', poiTagModel.get('tagId'));
            }
          } else {
            poiTagModel.set('yprive', true);
            poiTagModel.set('xprive', false);
            //console.log('PoiCardCtrl selectGroep made PUBLIC tagId', poiTagModel.get('tagId'));
            //
            var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
            });
            if (tag) {
              tag.set('yprive', true);
              tag.set('xprive', false);
              tag.save();
              //console.log('PoiCardCtrl selectGroep made PUBLIC tag, naam', tag.get('tag'));
            }
          }
          poiTagModel.save();
        }
      });
      $scope.closeGroepen();
    };

    $scope.openDeelnemers = function (groepy, $event) {
      //console.warn('PoiCardCtrl openDeelnemersGroep: ', groepy);

      $scope.deelnemers = loDash.filter(dataFactoryGroepdeelnemers.store, function (groep) {
        return groep.get('groep') === groepy;
      });
      //console.warn('PoiCardCtrl openDeelnemersGroep: ', $scope.deelnemers);
      $scope.openGroepDeelnemers($event);
    };

    function showGroepen($event) {
      //console.warn('PoiCardCtrl showGroepen: ', $event);
      //console.warn('PoiCardCtrl showGroepen groepen: ', dataFactoryGroepen.store, dataFactoryGroepen.store.length);
      //console.warn('PoiCardCtrl showGroepdeelnemers: ', dataFactoryGroepdeelnemers.store, dataFactoryGroepdeelnemers.store.length);

      $scope.groepen = [];
      $scope.deelnemers = [];
      var tmp;

      tmp = loDash.filter(dataFactoryGroepdeelnemers.store, function (groepdeelnemerModel) {
        return ((groepdeelnemerModel.get('deelnemerId') === dataFactoryCeo.currentModel.get('Id') && groepdeelnemerModel.get('publicist') === true) || groepdeelnemerModel.get('groep') === 'Iedereen');
      });
      //console.warn('PoiCardCtrl showGroepen tmp: ', tmp, tmp.length);
      loDash.each(tmp, function (groep) {
        tmp = loDash.mapValues(groep, 'value');
        $scope.deelnemers.push(tmp);
      });
      //console.warn('PoiCardCtrl showGroepen $scope.deelnemers: ', $scope.deelnemers);

      $scope.groepen = loDash.uniqBy($scope.deelnemers, 'groep');
      //console.warn('PoiCardCtrl showGroepen $scope.groepen: ', $scope.groepen);

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
      if (poiModel.get('gebruikerId') === $scope.ceo.Id) {
        $scope.details.xprive = poiModel.get('xprive');
        if ($scope.details.xprive) {
          if ($scope.details.groep == '') {
            showGroepen($event);
          } else {
            $scope.details.xprive = false;
            //
            var groepenId = poiModel.get('groepenId');
            $scope.details.groep = '';
            poiModel.xData.groep = '';
            if (groepenId !== '') {
              $scope.details.groep = 'Iedereen';
              poiModel.xData.groep = 'Iedereen';

              var found = loDash.find(dataFactoryGroepen.store, function (groep) {
                return groep.get('Id') === groepenId;
              });
              if (found) {
                $scope.details.groep = found.get('groep');
                poiModel.xData.groep = found.get('groep');
                //console.error('PoiCardCtrl updateXprive details.groep poi.xData.groep set: ', $scope.details.groep);
              }
            }
            //
            poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
            poiModel.set('yprive', true);
            poiModel.set('xprive', false);
            poiModel.save();
            //
            //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
            //  Standaard labels zijn altijd public. Dus niet publiceren.
            //  Andere Tags en poitags ook prive/public maken
            //
            //console.log('PoiCardCtrl updateXprive poitags, tags van naam: ', poiModel.get('naam'));
            //
            loDash.each(dataFactoryPoiTag.store, function (poiTagModel) {

              if (poiTagModel.get('poiId') === poiId) {
                //
                //
                var tagId = poiTagModel.get('tagId');
                //console.log('PoiCardCtrl updateXprive tagId: ', tagId);
                //
                var groepenId = poiModel.get('groepenId');
                if (groepenId === '' || groepenId === 'Iedereen') {

                  if (tagId.length <= 3) {
                    poiTagModel.set('yprive', true);
                    poiTagModel.set('xprive', false);
                    poiTagModel.save();
                    //console.log('PoiCardCtrl updateXprive gepubliceerd tagId', poiTagModel.get('tagId'));
                  }
                } else {
                  poiTagModel.set('yprive', true);
                  poiTagModel.set('xprive', false);
                  poiTagModel.save();
                  //console.log('PoiCardCtrl updateXprive gepubliceerd tagId', poiTagModel.get('tagId'));
                  var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
                  });
                  if (tag) {
                    tag.set('yprive', true);
                    tag.set('xprive', false);
                    tag.save();
                    //console.log('PoiCardCtrl updateXprive gepubliceerd tag, naam', tag.get('tag'));
                  }
                }
              }
            });
          }
        } else {
          $scope.details.xprive = true;
          //
          poiModel.set('groepenId', '');
          poiModel.save();
          //
          $scope.details.groep = '';
          poiModel.xData.groep = '';
          //console.error('PoiCardCtrl updateXprive details.groep poi.xData.groep reset: ', $scope.details.groep);

          poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
          poiModel.set('yprive', true);
          poiModel.set('xprive', true);
          poiModel.save();
          //
          // Labels en tags ook prive/public maken
          //
          loDash.each(dataFactoryPoiTag.store, function (poiTagModel) {
            if (poiTagModel.get('poiId') === poiId) {
              poiTagModel.set('yprive', true);
              poiTagModel.set('xprive', true);
              poiTagModel.save();
            }
          });
        }

        //console.warn('PoiCardCtrl updateXprive: ', poiModel);

        poiModel.set('Id', poiId);
        poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
        poiModel.save().then(function () {
          //console.error('PoiCardCtrl updateXprive saved SUCCESS: ', poiModel.get('xprive'));
        });
      }
    };
    
    
    function initxData(poiModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!poiModel.xData) {
        poiModel.xData = {};
        //console.log('PoisCtrl initxData xData');
      }
      if (!poiModel.xData.pois) {
        poiModel.xData.pois = [];
        //console.log('PoisCtrl initxData xData.pois');
      }
      if (!poiModel.xData.fotos) {
        poiModel.xData.fotos = [];
        //console.log('PoisCtrl initxData xData.fotoa');
      }
      if (!poiModel.xData.tags) {
        poiModel.xData.tags = [];
        //console.log('PoisCtrl initxData xData.tags');
      }
    }

    function updatePoi() {

      //console.log('PoiCardCtrl poiModel: ', poiModel, poiModel.get('naam'));
      var poiId = poiModel.get('Id');
      //console.warn('PoiCardCtrl poiUpdate poiId: ', poiId);
      
      
      //removeIf(!pois)
      $scope.details.trackNaam = '';
      dataFactoryTrack.syncDown().then(function () {
        //console.log('TrackCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store, poiId);
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === poiModel.get('trackId');
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          //console.log('TrackCardCtrl trackNaam: ', $scope.details.trackNaam, dataFactoryTrack.store, trackModel);
        }
      });
      //endRemoveIf(!pois)
      
      
      
      
      updateLabels(poiModel);

      //
      if (mode !== 'bericht') {
        
        
      }

      var isBlacklisted = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('volgerId') === poiModel.get('gebruikerId');
      });
      $scope.details.volgt = true;
      if (isBlacklisted) {
        $scope.details.volgt = false;
      }

      $scope.details.poiId = poiId;
      $scope.details.tags = poiModel.xData.tags;
      sorteerDetailsTags();
      //console.log('PoiCardCtrl updatePoi xData.tags: ', poiModel.xData.tags);

      $scope.details.groep = '';

      $scope.details.gebruikerId = poiModel.get('gebruikerId');
      $scope.details.profiel = poiModel.get('profiel');
      $scope.details.gebruikerNaam = poiModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }

      $scope.details.avatarColor = poiModel.get('avatarColor');
      $scope.details.avatarLetter = poiModel.get('avatarLetter');
      $scope.details.avatarInverse = poiModel.get('avatarInverse');

      $scope.details.createdOn = poiModel.get('createdOn');
      $scope.details.changedOn = poiModel.get('changedOn');


      $scope.details.star = poiSupModel.get('star');
      $scope.details.xprive = poiModel.get('xprive');

      if (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = poiSupModel.get('xnew');
      }

      $scope.details.naam = poiModel.get('naam');
      $scope.details.tekst = poiModel.get('tekst');
      var tmp2 = poiModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp2 + '</p>';

      $scope.details.lat = poiModel.get('lat');
      $scope.details.lng = poiModel.get('lng');

      var gelezen = +poiSupModel.get('gelezen');
      $scope.details.gelezen = gelezen;
      //console.log('updatePoiUpdate gelezen: ', gelezen);

      //console.log('PoiCardCtrl updatePoi updateReacties Clock');

      updateReacties(poiModel);

      dataFactoryClock.stopClockPoi();
      $rootScope.$emit('startClockPoi');
      $timeout(function () {
        //console.log('PoiCardCtrl updatePoi updateReacties start Clock');

        dataFactoryClock.startClockPoiCardFast(function () {
          //console.log('PoiCardCtrl updatePoi syncDown controleren op gelezen en reacties');
          $scope.details.gelezen = +poiSupModel.get('gelezen');
          //console.log('PoiCardCtrl updatePoi syncDown controleren op gelezen: ', +poiSupModel.get('gelezen'));
          updateReacties(poiModel);
        });
      }, 200);
    }

    function typingHelp(tmp) {

      if (!tmp.Id) {

        //console.warn('PoiCardCtrl HELP tmp: ', tmp);

      } else {

        var tmp2, tmp3;
        var helpTypes = 'Locaties';
        var helpType = 'Locatie';
        var helpTyp = 'deze';
        if ($scope.details.mode === 'track' || $scope.details.mode === 'bericht') {
          helpTyp = 'dit';
        }

        tmp.naam = tmp.naam.replace('__TYPE__', helpType);
        tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
        tmp3 = tmp2.replace(/__TYPE__/g, helpType);
        tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

        //console.log('PoiCardCtrl HELP tmp: ', tmp.modal);

        $scope.cardHelps.push(tmp);
      }
    }

    function showHelp() {
      //console.warn('PoiCardCtrl showHelp');

      var item;
      if (mode === 'bericht') {
        item = 'Bericht';
      }
      if (mode === 'foto') {
        item = 'Foto';
      }
      if (mode === 'poi') {
        item = 'Locatie';
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

        //console.error('PoiCardCtrl kaartItemHelps $scope.cardHelps: ', $scope.cardHelps);
      }
      //endRemoveIf(berichten)
      
    }

    function removePoiFromStores(poiId, backend) {

      //console.warn('PoiCardCtrl removePoiFromStores poiId: ', poiId);

      var poiModel = loDash.find(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      loDash.remove(dataFactoryPoi.star, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      loDash.remove(dataFactoryPoi.nieuw, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      loDash.remove(dataFactoryPoi.selected, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      var poitags = poiModel.xData.tags;

      loDash.each(poitags, function (poitag) {
        var tagModel = poitag.xData;

        if (tagModel) {

          $rootScope.$emit('poiRemoveLabel', {
            poiModel: poiModel,
            tagModel: tagModel
          });
        } else {
          //console.error('PoiCardCtrl removePoiFromStores tagModel NOT FOUND');
        }
      });

      loDash.remove(dataFactoryPoiTag.store, function (poiTagModel) {
        return poiTagModel.get('poiId') === poiId;
      });
      loDash.remove(dataFactoryPoiTag.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId;
      });

      $rootScope.$emit('poiDelete', poiModel);

      loDash.remove(dataFactoryPoiSup.store, function (poiSupModel) {
        return poiSupModel.get('poiId') === poiId;
      });
      loDash.remove(dataFactoryPoiSup.data, function (dataItem) {
        return dataItem.record.get('poiId') === poiId;
      });

      loDash.remove(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });
      loDash.remove(dataFactoryPoi.data, function (dataItem) {
        return dataItem.record.get('Id') === poiId;
      });

      if (backend) {
        poiModel.remove();
      }
    }

    $scope.deletePoi = function () {
      //console.warn('PoiCardCtrl deletePoi');
      $ionicPopup.confirm({
        title: 'Verwijder Locatie',
        content:
          'Weet je zeker dat deze Locatie<br><br><span class="trinl-rood"><b>' +
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
              removePoiFromStores(poiId, true);

              $rootScope.$on('poisReload');
              $rootScope.$emit('poisNieuweAantallen');
              $state.go('pois.pois');
            }
          }
        ]
      });
    };

    $scope.closePoiCard = function (stay) {

      //console.error('PoiCardCtrl closePoiCard isCardClosed: ', isCardClosed);

      dataFactoryClock.stopClockPoiCard();

      if (!isCardClosed) {
        if (stay === undefined) {
          stay = true;
        }
        //console.error('PoiCardCtrl closePoiCard stay: ', stay);
        if (blacklisted) {
          removePoiFromStores(poiId, false);

          $rootScope.$on('poisReload');
          $rootScope.$emit('poisNieuweAantallen');
          $state.go('pois.pois');
        } else {

          loDash.each($scope.details.reacties, function (reactieModel) {
            var reactieSupModel = loDash.find(dataFactoryPoiReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieModel.get('Id');
            });
            if (reactieSupModel) {
              reactieSupModel.set('xnew', false);
              reactieSupModel.save();
            }
          });
          //console.log('PoiCardCtrl closePoiCard reacties xnew reset in dataFactoryPoiReactieSup.store');
          //
          // Verwijder status nieuw van poi in model sup.
          //
          if (poiSupModel) {

            poiSupModel.set('gebruikerId', poiSupModel.get('gebruikerId'));
            poiSupModel.set('poiId', poiSupModel.get('poiId'));
            var gelezen = +poiSupModel.get('gelezen');

            //console.log('PoiCardCtrl closePoiCard $scope.details.gelezen: ', $scope.details.gelezen);

            //console.log('PoiCardCtrl closePoiCard gelezen poiSupModel oud: ', gelezen);
            var xread = +poiSupModel.get('xread') + 1;
            poiSupModel.set('xread', xread);
            //console.log('PoiCardCtrl closePoiCard xread updated in poiSupModel: ', xread);

            $scope.details.gelezen = gelezen + xread;
            poiModel.xData.sup.set('gelezen', $scope.details.gelezen);
            //console.log('PoiCardCtrl closePoiCard gelezen + xread updated as gelezen in poiSupModel: ', $scope.details.gelezen);

            poiSupModel.set('xnew', false);
            //console.log('PoiCardCtrl closePoiCard xnew reset in poiSupModel');
            //
            // Verwijder poi van lijst nieuw in store
            //
            loDash.remove(dataFactoryPoi.nieuw, function (poiNieuwModel) {
              return poiNieuwModel.get('Id') === poiId;
            });

            poiSupModel.save().then(

              function (poiSupModel) {
                poiSupModel.set('xread', 0);
                var poiNieuw = [];
                var poiReactieNieuw = [];

                poiNieuw = loDash.filter(dataFactoryPoiSup.store, function (poiSup) {
                  return poiSup.get('xnew');
                });

                poiReactieNieuw = loDash.filter(dataFactoryPoiReactieSup.store, function (poiReactieSup) {
                  return poiReactieSup.get('xnew');
                });

                //console.log('PoiCardCtrl closed nieuwe poi, poiReacties: ', poiNieuw, poiReactieNieuw);

                if (poiNieuw.length > 0 || poiReactieNieuw.length > 0) {
                  dataFactoryNotification.composeTitleBodyNotification(poiNieuw.length, poiReactieNieuw.length, 'poi');
                  //console.log('PoiCardCtrl notification met poiNieuw, poiReactieNieuw: ', poiNieuw, poiReactieNieuw);
                }

                $rootScope.$emit('sleepClockPoi');
              },
              function () {
                //console.error('poiSupModel saved ERROR');
              }
            );
          }

          $rootScope.$emit('poisNieuweAantallen');
          if (stay) {
            $state.go('pois.pois');
          }
        }
        isCardClosed = true;
      } else {
        //console.warn('PoiCardCtrl closePoiCard SKIPPED!!!!!');
      }
    };

    $scope.clearSearchLabel = function () {
      //console.warn('PoiCardCtrl clearearchLabel');

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
      //console.warn('PoiCracCtrl closeTags');
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
      //console.warn('openModalTags: ');
      $scope.modalTags.show($event);
    };

    $scope.closeModalTags = function () {
      //console.warn('closeModalTags: ');
      $scope.modalTags.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTags.remove();
    });
    //
    // Modal Poi
    //
    $ionicModal.fromTemplateUrl(
      'poiModal.html',
      function (modalPoi) {
        $scope.modalPoi = modalPoi;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalPoi = function () {
      $scope.modalPoi.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalPoi = function () {
      $scope.modalPoi.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalPoi.remove();
      //console.log('PoiCardCtrl ModalPoi is removed!');
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
    // Modal poi
    //
    $ionicModal.fromTemplateUrl(
      'poiModal.html',
      function (modalPoi) {
        $scope.modalPoi = modalPoi;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalPoi = function () {
      $scope.modalPoi.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalPoi = function () {
      $scope.modalPoi.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalPoi.remove();
      //console.log('PoiCardCtrl ModalPoi is removed!');
    });

    $scope.closeGroepen = function ($event) {
      //console.log('PoiCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepenModal();
      } else {
        $scope.closeGroepenPopover($event);
      }
    };

    $scope.openGroepen = function ($event) {
      //console.log('PoiCardCtrl openGroepen $event: ', $event);
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
      //console.log('PoiCardCtrl openGroepenModal');
      $scope.groepenModal.show();
    };

    $scope.closeGroepenModal = function () {
      //console.log('PoiCardCtrl closeGroepenModal');
      $scope.groepenModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepenModal.remove();
      //console.log('PoiCardCtrl groepenModal is removed!');
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
      //console.log('PoiCardCtrl openGroepenPopover');
      $scope.groepenPopover.show($event);
    };

    $scope.closeGroepenPopover = function () {
      //console.log('PoiCardCtrl closeGroepenPopover');
      $scope.groepenPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepenPopover.remove();
    });

    $scope.closeGroepDeelnemers = function () {
      //console.log('PoiCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepDeelnemersModal();
      } else {
        $scope.closeGroepDeelnemersPopover();
      }
    };

    $scope.openGroepDeelnemers = function ($event) {
      //console.log('PoiCardCtrl openGroepen $event: ', $event);
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
      //console.log('PoiCardCtrl openGroepDeelnemersModal');
      $scope.groepDeelnemersModal.show();
    };

    $scope.closeGroepDeelnemersModal = function () {
      //console.log('PoiCardCtrl closeGroepDeelnemersModal');
      $scope.groepDeelnemersModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersModal.remove();
      //console.log('PoiCardCtrl groepDeelnemersModal is removed!');
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
      //console.log('PoiCardCtrl openGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.show($event);
    };

    $scope.closeGroepDeelnemersPopover = function () {
      //console.log('PoiCardCtrl closeGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersPopover.remove();
    });
    //
    // Popover helpPopoverCard
    //
    $scope.openHelp = function ($event) {
      //console.log('PoiCardCtrl openHelp');
      showHelp();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      //console.log('PoiCardCtrl openHelp');
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
      //console.log('PoiCardCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('PoiCardCtrl openHelpPopover');
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
      //console.log('PoiCardCtrl closeHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModalCard = function () {
      //console.log('PoiCardCtrl closeHelpModal');
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
      //console.warn('KaartCtrl openGlobaleHelpPopover');
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
      //console.log('PoiCardCtrl setReactieNavTitle: ' + title);
      $ionicNavBarDelegate.title(title);
    };

    function init() {
      dataFactoryPoiSup.store = loDash.uniqBy(dataFactoryPoiSup.store, function (poiSup) {
        return poiSup.get('poiId');
      });
      //console.warn('PoiCardCtrl init PoiStore: ', dataFactoryPoi.store);
      //console.warn('PoiCardCtrl init PoiSupStore: ', dataFactoryPoiSup.store);
      poiModel = loDash.find(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      //console.warn('PoiCardCtrl init poiModel: ', poiModel, poiModel.get('naam'));

      if (poiModel) {
        poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSupModel) {
          return poiSupModel.get('poiId') === poiId;
        });
        //
        // Indien geen sup dan nieuwe aanmaken
        //
        if (!poiSupModel) {
          poiSupModel = new dataFactoryPoiSup.Model();
          poiSupModel.set('xnew', true);
          poiSupModel.set('star', false);
          //poiSupModel.set('poiId', poiId);
          poiSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          //console.error('PoiCardCtrl init poiSupModel: ', poiSupModel.get('poiId'));
          poiSupModel.save().then(function () {
            poiModel.xData.sup = poiSupModel;
            var xnew = poiModel.xData.sup.get('xnew');

            if (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
              var nieuwModel = loDash.find(dataFactoryPoi.nieuw, function (nieuwModel) {
                return nieuwModel.get('Id') === poiId;
              });
              if (!nieuwModel) {
                dataFactoryPoi.nieuw.push(poiModel, poiModel.get('naam'));
              }
            }
            //console.log('PoiCardCtrl init met nieuw supModel');
          });
        } else {
          //console.log('PoiCardCtrl init bestaand supModel: ', poiSupModel);

          initxData(poiModel);

          poiModel.xData.sup = poiSupModel;
          //console.log('poiModel.xData.sup: ', poiModel.xData.sup);

          var xnew = poiModel.xData.sup.get('xnew');

          if (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
            var nieuwModel = loDash.find(dataFactoryPoi.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === poiId;
            });
            if (!nieuwModel) {
              dataFactoryPoi.nieuw.push(poiModel);
            }
          }
        }
        updatePoi(poiModel, poiModel.get('naam'));
      } else {
        //console.warn('PoiCardCtrl findRecord ERROR Id: ', poiId);

        $ionicPopup.confirm({
          title: 'Locatie',
          content:
            'Deze Locatie is niet meer beschikbaar!<br>De eigenaar heeft deze Locatie waarschijnlijk verwijderd.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $state.go('pois.pois');
              }
            }
          ]
        });
      }
    }
  }
]);
