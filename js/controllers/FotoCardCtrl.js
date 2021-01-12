/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('FotoCardCtrl', ['loDash', '$timeout', '$rootScope', '$q', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'dataFactoryCeo', 'dataFactoryHelp', 'dataFactoryNotification', 'dataFactoryClock', 'dataFactoryFotoReactie', 'dataFactoryFotoReactieSup', 'dataFactoryFoto', 'dataFactoryFotoSup', 'dataFactoryFotoTag', 'dataFactoryTag',
  
  //removeIf(!fotos)
  'dataFactoryTrack',
  //endRemoveIf(!fotos)
  
  
  //removeIf(!fotos)
  'dataFactoryFotos',
  //endRemoveIf(!fotos)
  
  
  
  'dataFactoryBlacklist', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers',
  function (loDash, $timeout, $rootScope, $q, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, $ionicListDelegate, dataFactoryCeo, dataFactoryHelp, dataFactoryNotification, dataFactoryClock, dataFactoryFotoReactie, dataFactoryFotoReactieSup, dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryTag,
    
    //removeIf(!fotos)
    dataFactoryTrack,
    //endRemoveIf(!fotos)
    
    
    //removeIf(!fotos)
    dataFactoryFotos,
    //endRemoveIf(!fotos)
    
    
    
    dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers
  ) {

    var isCardClosed = false;

    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    console.error('FotoCardCtrl ceo.Id: ', ceo.Id);
    console.error('FotoCardCtrl ceo.profielId: ', +ceo.profielId);

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
    $scope.details.mode = 'foto';
    var mode = 'foto';


    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'fotos/small_non_existing_id.png';

    var blacklisted = false;
    var isCardClosed = false;

    var fotoId = $stateParams.Id;
    var fotoModel;
    var fotoSupModel;
    var oldInputNaam;
    var oldInputTekst;
    // eslint-disable-next-line no-unused-vars
    //
    var event0a = $scope.$on('$ionicView.beforeEnter', function () {
      console.warn('FotoCardCtrl $ionicView.beforeEnter');
      init();
    });
    $scope.$on('$destroy', event0a);

    var event0z = $scope.$on('$ionicView.afterEnter', function () {
      console.warn('FotoCardCtrl $ionicView.afterEnter');
      isCardClosed = false;
    });
    $scope.$on('$destroy', event0z);

    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      console.warn('FotoCardCtrl $ionicView.beforeLeave');
      //$timeout(function () {
      $scope.closeFotoCard(false);
      //}, 100);
    });
    $scope.$on('$destroy', event0b);
    //
    var event1 = $rootScope.$on('labelsFotoUpdate', function (event, args) {
      var fotoModel = args.fotoModel;
      console.warn('FotoCardCtrl on.labelsFotoUpdate fotoModel: ', fotoModel, fotoModel.get('naam'));
      updateLabels(fotoModel);
    });
    $scope.$on('$destroy', event1);
    //
    var event7 = $rootScope.$on('fotoVerwijderd', function (event, args) {
      var fotoModel = args.fotoModel;
      if (fotoModel.get('Id') === fotoId) {
        $ionicPopup.confirm({
          title: 'Verwijder Foto',
          content: 'Deze Foto is zojuist door de eigenaar verwijderd.<br><br>Deze Foto wordt gesloten',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('fotos.fotos');
            }
          }]
        });
      }
    });
    $scope.$on('$destroy', event7);
    //
    $scope.infoTag = function (tagModel) {

      console.log('FotoCardCtrl tagModel: ', tagModel);

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
      console.warn('FotoCardCtrl editTag: ', tag, tagModel);

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

        console.log('FotosSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          console.log('FotosSideMenuCtrl editTag fotoModel tags: ', tag, fotoModel && fotoModel.xData.tags);

          $rootScope.$emit('fotoRemoveLabel', {
            fotoModel: fotoModel,
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

            $rootScope.$emit('fotoAddLabel', {
              fotoModel: fotoModel,
              tagModel: tagModel
            });

            $rootScope.$emit('fotosFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });

          });
        }
      });
    };

    $scope.deleteTag = function (tagModel) {
      var tag = tagModel.get('tag');
      console.warn('FotoCardCtrl editTag: ', tag);

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

            loDash.each(dataFactoryFoto.store, function (fotoModel) {
              console.log('FotosSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, fotoModel);
              loDash.each(fotoModel.xData.tags, function (fotoTagModel) {
                console.log('FotosSideMenuCtrl deleteTag fotoModal.tags loop: ', fotoModel.xData.tags, fotoTagModel);
                (function (fotoTagModel) {
                  if (fotoTagModel.xData.get('tag') === tag) {
                    console.log('FotosSideMenuCtrl deleteTag fotoTagModel in fotoModel.tags wordt verwijderd uit backend: ', fotoTagModel);
                    fotoTagModel.remove().then(function () {
                      console.log('FotosSideMenuCtrl deleteTag fotoTagModel wordt verwijderd uit fotoModel.tags: ', fotoTagModel);
                      loDash.remove(fotoModel.xData.tags, function (fotoTagModel) {
                        return fotoTagModel.xData.get('tag') === tag;
                      });
                    });
                    $rootScope.$emit('fotoRemoveLabel', {
                      fotoModel: fotoModel,
                      tagModel: tagModel
                    });
                  }
                })(fotoTagModel);
              });
            });

            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            console.log('FotosSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle fototags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              console.log('FotosSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.fotosFilterAlle();
          }
        }]
      });
    };


    function sorteerGlobalTags() {

      console.error('fotoCardCtrl sorteerGlobalTags');
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

      console.error('FotoCardCtrl sorteerDetailsTags');
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

    function fotosCheckFotoReactieAantal(reacties) {
      console.warn('FotosCtrl fotosCheckFotoReactieOud, reacties: ', reacties);

      var maxAantal = 50;

      var verwijderingen = 0;

      var q = $q.defer();

      var teller = 0;
      loDash.each(reacties, function (reactieModel) {
        console.log('FotosCtrl fotosCheckFotoReactieAantal reactieModel: ', reactieModel);
        teller += 1;
        if (teller > maxAantal) {

          verwijderingen += 1;

          var reactieId = reactieModel.get('Id');

          reactieModel.remove();
          loDash.remove(dataFactoryFotoReactie.store, function (reactieModel) {
            return reactieModel.get('Id') === reactieId;
          });
          loDash.remove(dataFactoryFotoReactie.data, function (dataItem) {
            return dataItem.record.get('Id') === reactieId;
          });
          var reactieSupModel = loDash.find(dataFactoryFotoReactieSup.store, function (reactieSupModel) {
            return reactieSupModel.get('reactieId') === reactieId;
          });
          if (reactieSupModel) {
            reactieSupModel.remove();
            loDash.remove(dataFactoryFotoReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            loDash.remove(dataFactoryFotoReactieSup.data, function (dataItem) {
              return dataItem.record.get('reactieId') === reactieId;
            });
          }
          console.error('FotosCtrl fotosCheckFotoReactieAantal reactie removed SUCCESS');
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

    function fotosCheckFotoReactieOud(reacties) {

      console.warn('FotosCtrl fotosCheckFotoReactieOud, reacties: ', reacties);

      var aantalOuder = 7;
      var formatOuder = 'days';

      var q = $q.defer();
      var tooOld = moment().subtract(aantalOuder, formatOuder).format('YYYY-MM-DD HH:mm:ss');
      var verwijderingen = false;
      console.log('FotosCtrl fotosCheckFotoReactieOud: ', tooOld);
      //
      //  Ouder dan 
      //
      loDash.each(reacties, function (reactieModel) {
        if (reactieModel) {
          console.log('FotosCtrl fotosCheckFotoReactieOud reactieModel: ', reactieModel);
          var datum = reactieModel.get('changedOn');
          var reactieId = reactieModel.get('Id');
          if (datum < tooOld) {
            verwijderingen += 1;
            console.log('FotosCtrl fotosCheckFotoReactieOud changedOn, fotoId, tooOld: ', datum, fotoId, tooOld);

            reactieModel.remove();
            loDash.remove(dataFactoryFotoReactie.store, function (reactieModel) {
              return reactieModel.get('Id') === reactieId;
            });
            loDash.remove(dataFactoryFotoReactie.data, function (dataItem) {
              return dataItem.record.get('Id') === reactieId;
            });
            var reactieSupModel = loDash.find(dataFactoryFotoReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            if (reactieSupModel) {
              reactieSupModel.remove();
              loDash.remove(dataFactoryFotoReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('reactieId') === reactieId;
              });
              loDash.remove(dataFactoryFotoReactieSup.data, function (dataItem) {
                return dataItem.record.get('reactieId') === reactieId;
              });
            }
            $rootScope.$emit('filter');
            $rootScope.$emit('fotosNieuweAantallen');
            console.error('FotosCtrl fotosCheckFotoReactieOud reactie removed SUCCESS');
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

    function updateReacties(fotoModel) {
      console.log('FotosCtrl updateReacties voor foto naam Id: ', fotoModel.get('Id'), fotoModel.get('naam'));
      var fotoId = fotoModel.get('Id');

      console.log('FotosCtrl updateReacties dataFactoryFotoReactie.store: ', dataFactoryFotoReactie.store);

      var fotoReacties = loDash.filter(dataFactoryFotoReactie.store, function (fotoReactieModel) {
        return fotoReactieModel.get('fotoId') === fotoId;
      });
      //
      $scope.details.reacties = loDash.orderBy(fotoReacties, 'createdOn.value', 'desc');
      fotosCheckFotoReactieAantal(fotoReacties).then(function () {
        fotosCheckFotoReactieOud(fotoReacties).then(function () {
        });
      });
      console.warn('FotoCardCtrl loadReactie foto in store, aantal: ', dataFactoryFoto.store.length);
      console.warn('FotoCardCtrl loadReactie reacties in store, aantal: ', fotoReacties.length);
      $scope.details.reactiesAantal = fotoReacties.length;
    }

    $scope.reactie = function () {
      console.warn('FotoCardCtrl reactie');

      $scope.input = {};
      $scope.input.naam = '';
      $scope.input.tekst = '';
      $scope.initFoto = 'Reactie';

      $scope.openModalReactie();
    };

    $scope.saveReactie = function (input) {

      console.warn('FotoCardCtrl saveReactie input fotoId: ', input, fotoId);

      if ($scope.initFoto === 'Reactie') {

        $scope.details.reactiesAantal += 1;

        var reactieModel = new dataFactoryFotoReactie.Model();

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = tmp.replace(/\\"/g, '"');
        var htmlreactietekst = '<p>' + tmp + '</p>';
        tmp = false;
        console.error('FotoCardCtrl saveReactie: ', htmlreactietekst);
        reactieModel.set('reactie', htmlreactietekst);
        reactieModel.set('fotoId', fotoId);
        reactieModel.set('fotoGebruikerId', fotoModel.get('gebruikerId'));
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
          var reactieSupModel = new dataFactoryFotoReactieSup.Model();
          reactieSupModel.set('fotoId', fotoId);
          reactieSupModel.set('reactieId', reactieId);
          reactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          reactieSupModel.set('xnew', false);
          reactieSupModel.save().then(function (reactieSupModel) {
            console.error('FotoCardCtrl saveReactie reactieSupModel: ', reactieSupModel);
            reactieModel.xData = {
              sup: reactieSupModel
            };
          });
          fotoSupModel.set('fotoId', fotoId);
          fotoSupModel.save().then(function () {
            console.error('FotoCardCtrl saveReactie fotoSupModel: ', fotoSupModel);
          });
          $scope.details.reacties.splice(0, 0, reactieModel);
        });
        $scope.closeModalReactie();
      }
    };

    $scope.saveFotoItemTekst = function (input) {
      console.warn('FotoCardCtrl saveFotoTekst: ', $scope.details);
      console.warn('FotoCardCtrl saveFotoTekst: ', input);
      console.error('FotoCardCtrl size message: ', input.naam.length + input.tekst.length);

      $scope.details.naam = input.naam;
      $scope.details.tekst = input.tekst;
      var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      tmp = false;
      if (input.naam !== oldInputNaam) {
        fotoModel.set('naam', input.naam.substr(0, 7500));
        $scope.details.naam = input.naam.substr(0, 7500);
        tmp = true;
      }
      if (input.tekst !== oldInputTekst) {
        fotoModel.set('tekst', input.tekst.substr(0, 7500));
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
        fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
        fotoModel.save();
        $rootScope.$emit('fotoUpdate', fotoModel);
      }

      $scope.closeModalFoto();
    };

    $scope.openFotoTekst = function () {
      console.warn('FotoCardCtrl openFotoTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalFoto();
    };

    function updateLabels(fotoModel) {
      console.log('FotoCardCtrl updateLabels fotoModel, fotoId: ', fotoModel, fotoId, fotoModel.get('naam'));
      if (fotoModel.get('Id') === fotoId) {
        console.log('FotoCardCtrl updateLabels fotoModel: ', fotoModel.get('naam'), fotoModel.get('Id'));
        //
        // Indien labels worden toegevoegd dan worden die toegevoegd in de dataFactoryFotoTag store en data
        // De label moet ook toegevoegd worden aan de fotoModel.xData.tags
        initxData(fotoModel);
        $scope.details.tags = fotoModel.xData.tags;
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
      console.warn('FotoCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          if (fotoModel.get('xprive')) {
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
            console.log('FotoCardCtrl addNieuweLabel tag: ', tagModel);
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

      console.warn('FotoCardCtrl selectLabelClick tagModel: ', tagModel);
      console.warn('FotoCardCtrl selectLabelClick fotoId: ', fotoId);
      console.warn('FotoCardCtrl selectLabelClick tagId: ', tagModel.get('Id'));
      //
      //  Kijk of de fototag reeds bestaat
      //
      var found = loDash.find(dataFactoryFotoTag.store, function (fotoTagModel) {
        return fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var fotoTagModel = new dataFactoryFotoTag.Model();
        fotoTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoTagModel.set('fotoId', fotoId);
        fotoTagModel.set('tagId', tagId);
        fotoTagModel.set('xprive', true);
        fotoTagModel.set('yprive', false);

        console.error('FotoCardCtrl newLabel groepenId: ', fotoModel.get('groepenId'));
        var groepenId = fotoModel.get('groepenId');
        if (groepenId === '' || groepenId === 'Iedereen') {
          if (tagId.length <= 3) {
            fotoTagModel.set('yprive', true);
            fotoTagModel.set('xprive', false);
            console.log('FotoCardCtrl publiceren PUBLIC tagId', fotoTagModel.get('tagId'));
          }
        } else {
          fotoTagModel.set('yprive', true);
          fotoTagModel.set('xprive', false);
          console.log('FotoCardCtrl publiceren made PUBLIC tagId', fotoTagModel.get('tagId'));
          //
          tagModel.set('yprive', true);
          tagModel.set('xprive', false);
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
          });
          console.log('FotoCardCtrl publiceren made PUBLIC tag, naam', tagModel.get('tag'));
        }
        fotoTagModel.save().then(function () {

          fotoTagModel.xData = tagModel;
          fotoModel.xData.tags.push(fotoTagModel);
          $scope.details.tags = fotoModel.xData.tags;
          sorteerDetailsTags();
          $rootScope.$emit('fotoAddLabel', {
            fotoModel: fotoModel,
            tagModel: tagModel
          });
        });
        $scope.closeTags();
      } else {
        $ionicPopup.confirm({
          title: 'Toevoegen label',
          content: 'Dit label is reeds toegevoegd aan deze Foto.',
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
        'Selecteer een label in onderstaande lijst. Indien deze te lang is kun je door middel van zoeken het aantal labels verkleinen. Voer daarvoor de zoektekst in, in het zoekvenster. De lijst toont dan alle labels waarin deze tekst voorkomt. Als je het label gevonden hebt, selecteer het in de lijst, het label wordt dan toegevoegd aan de Foto.';
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover($event);
      }
    };

    $scope.toevoegenTagHelp = function () {
      $scope.helpTitel = 'Label toevoegen';
      $scope.helpContent =
        'Wanneer de tekst niet te vinden is door middel van het zoekvenster verschijnt rechtsboven de tekst ‘+ Voeg toe’. Klik hier om de getypte tekst uit het zoekvenster als label toe te voegen aan de lijst. Het label wordt tevens toegevoegd aan de gekozen Foto.';

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpModal();
        //$scope.openGlobalHelpPopover($event);
      }
    };

    $scope.addTagToFoto = function ($event) {
      console.warn('FotoCardCtrl addTagToFoto');

      $scope.clearSearchLabel($event);
      $scope.openTags($event);
    };

    $scope.deleteLabelTag = function (fotoTagModel) {
      console.warn('FotoCardCtrl deleteLabelTag fotoModel: ', fotoModel, fotoModel.get('naam'), );
      console.warn('FotoCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('FotoCardCtrl deleteLabelTag fotoTagModel: ', fotoTagModel);
      console.warn('FotoCardCtrl deleteLabelTag tagModel: ', fotoTagModel.xData);
      var tagModel = fotoTagModel.xData;
      console.warn('FotoCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      console.warn('FotoCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));
      console.warn('FotoCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('FotoCardCtrl deleteLabelTag fotoModel.xdata.tags: ', fotoModel.xData.tags);

      var fotoTagId = fotoTagModel.get('Id');

      fotoTagModel.remove().then(function () {

        fotoTagModel.xData = tagModel;
        $rootScope.$emit('fotoRemoveLabel', {
          fotoModel: fotoModel,
          tagModel: tagModel
        });

        loDash.remove($scope.details.tags, function (fotoTagModel) {
          return fotoTagModel.get('Id') === fotoTagId;
        });
        sorteerDetailsTags();
        loDash.remove(fotoModel.xData.tags, function (fotoTagModel) {
          return fotoTagModel.get('Id') === fotoTagId;
        });

      });
    };

    $scope.selecteerFoto = function () {
      console.log('FotosCtrl selecteerFoto: ', fotoModel);

      $rootScope.$emit('fotoSelected', fotoModel);
      $state.go('app.kaart');
    };

    $scope.clickedAvatar = function (details) {
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      console.warn('FotoCardCtrl clickedAvatar naam: ', details.gebruikerNaam);
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      if (details.gebruikerId == $scope.ceo.Id) {
        var content =
          'Je bent de eigenaar van deze Foto.<br><br>Tik op verwijder om deze Foto te verwijderen.';
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
            'Je wil geen Foto\'s meer ontvangen van<br><br><span class="trinl-rood">' +
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

                console.warn('FotoCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

                if (found) {
                  console.warn('FotoCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

                  $scope.details.volgt = true;

                  found.set('Id', found.get('Id'));
                  found.set('gebruikerId', $scope.ceo.Id);
                  found.set('type', 'fotogebruikers');
                  found.set('blackId', gebruikerId);
                  found.set('reden', 'avatar');
                  found.remove();
                  removed = false;
                } else {
                  $scope.details.volgt = false;

                  var blacklistModel = new dataFactoryBlacklist.Model();
                  blacklistModel.set('gebruikerId', $scope.ceo.Id);
                  blacklistModel.set('type', 'fotogebruikers');
                  blacklistModel.set('blackId', gebruikerId);
                  blacklistModel.set('eigenaar', gebruikerId);
                  blacklistModel.set('naam', naam);
                  blacklistModel.set('reden', 'avatar');
                  blacklistModel.save();
                  removed = true;

                  console.warn('FotoCardCtrl updateVolgt blacklistStore blacklistModel niet gevonden aangemaakt en saved: ', blacklistModel);
                }

                if (removed) {
                  loDash.remove(dataFactoryFoto.star, function (starModel) {
                    return starModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryFoto.nieuw, function (nieuwModel) {
                    return nieuwModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryFoto.selected, function (
                    selectedModel
                  ) {
                    return selectedModel.get('gebruikerId') === gebruikerId;
                  });
                  $rootScope.$emit('fotoDelete', details.gebruikerId);
                }
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                var itemsToRemove = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
                  return fotoModel.get('gebruikerId') === gebruikerId;
                });
                console.log('FotoCardCtrl fotoItems removing from Store.....: ', itemsToRemove);

                loDash.each(itemsToRemove, function (fotoModel) {
                  var fotoId = fotoModel.get('Id');

                  removeFotoFromStores(fotoId, false);
                });

                $rootScope.$on('fotosReload');
                $rootScope.$emit('fotosNieuweAantallen');
                $state.go('fotos.fotos');
              }
            }
          ]
        });
      }
    };

    $scope.updateVolgt = function () {
      console.warn('FotoCardCtrl updateVolgt: ', fotoModel, fotoModel.get('naam'));

      $scope.details.volgt = false;

      blacklisted = false;

      var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('blackId') === fotoModel.get('Id');
      });

      console.warn('FotoCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

      if (found) {
        console.warn('FotoCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

        removeFotoFromStores(fotoModel.get('Id'), false);

        $scope.details.volgt = true;

        found.set('Id', found.get('Id'));
        found.set('gebruikerId', $scope.ceo.Id);
        found.set('type', 'foto');
        found.set('blackId', fotoModel.get('Id'));
        found.set('reden', 'pinned');
        found.remove();
        blacklisted = false;
      } else {
        $scope.details.volgt = false;

        var blacklistModel = new dataFactoryBlacklist.Model();
        blacklistModel.set('gebruikerId', $scope.ceo.Id);
        blacklistModel.set('type', 'foto');
        blacklistModel.set('blackId', fotoModel.get('Id'));
        blacklistModel.set('eigenaar', fotoModel.get('gebruikerId'));
        blacklistModel.set('naam', fotoModel.get('naam'));
        blacklistModel.set('reden', 'pinned');
        blacklistModel.save();
        blacklisted = true;
      }
    };

    $scope.updateStar = function () {
      console.warn('FotoCardCtrl updateStar in: ', fotoSupModel);

      $scope.details.star = fotoSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        fotoModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryFoto.star, function (fotoModel) {
          return fotoModel.get('Id') === fotoId;
        });
        fotoSupModel.set('star', $scope.details.star);
        console.warn('FotoCardCtrl updateStar fotoSupModel: ', fotoSupModel.get('fotoId'));
        fotoSupModel.save();
        console.warn('FotoCardCtrl updateStar: ', fotoSupModel, fotoModel.xData.sup.xnew.value);
      } else {
        $scope.details.star = true;
        fotoModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryFoto.star, function (fotoStarModel) {
          return fotoStarModel.get('Id') === fotoId;
        });
        if (!found) {
          dataFactoryFoto.star.push(fotoModel);
        }
        fotoSupModel.set('star', $scope.details.star);
        //fotoSupModel.set('fotoId', fotoId);
        console.warn('FotoCardCtrl updateStar fotoSupModel: ', fotoSupModel.get('fotoId'));
        fotoSupModel.save();
        console.warn('FotoCardCtrl updateStar: ', fotoSupModel, fotoModel.xData.sup.xnew.value);
      }
      $rootScope.$emit('fotosNieuweAantallen');
    };

    $scope.selectGroep = function (groep) {
      console.warn('FotoCardCtrl selectGroep: ', groep, groep.groep, groep.groepenId);
      $scope.details.groep = groep.groep;
      fotoModel.set('groepenId', groep.groepenId);
      $scope.details.xprive = false;
      fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
      fotoModel.set('yprive', true);
      fotoModel.set('xprive', false);
      fotoModel.save();
      //
      //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
      //  Standaard labels zijn altijd public. Dus niet publiceren.
      //  Andere Tags en fototags ook prive/public maken
      //
      console.log('FotoCardCtrl selectGroepfototags, tags van naam: ', fotoModel.get('naam'));
      //
      loDash.each(dataFactoryFotoTag.store, function (fotoTagModel) {
        //
        if (fotoTagModel.get('fotoId') === fotoId) {
          //
          var tagId = fotoTagModel.get('tagId');
          //
          fotoTagModel.set('yprive', true);
          fotoTagModel.set('xprive', true);
          console.log('FotoCardCtrl selectGroep made PRIVATE tagId', fotoTagModel.get('tagId'));

          var groepenId = fotoModel.get('groepenId');
          if (groepenId === '' || groepenId === 'Iedereen') {

            if (tagId.length <= 3) {
              fotoTagModel.set('yprive', true);
              fotoTagModel.set('xprive', false);
              console.log('FotoCardCtrl selectGroep PUBLIC tagId', fotoTagModel.get('tagId'));
            }
          } else {
            fotoTagModel.set('yprive', true);
            fotoTagModel.set('xprive', false);
            console.log('FotoCardCtrl selectGroep made PUBLIC tagId', fotoTagModel.get('tagId'));
            //
            var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
            });
            if (tag) {
              tag.set('yprive', true);
              tag.set('xprive', false);
              tag.save();
              console.log('FotoCardCtrl selectGroep made PUBLIC tag, naam', tag.get('tag'));
            }
          }
          fotoTagModel.save();
        }
      });
      $scope.closeGroepen();
    };

    $scope.openDeelnemers = function (groepy, $event) {
      console.warn('FotoCardCtrl openDeelnemersGroep: ', groepy);

      $scope.deelnemers = loDash.filter(dataFactoryGroepdeelnemers.store, function (groep) {
        return groep.get('groep') === groepy;
      });
      console.warn('FotoCardCtrl openDeelnemersGroep: ', $scope.deelnemers);
      $scope.openGroepDeelnemers($event);
    };

    function showGroepen($event) {
      console.warn('FotoCardCtrl showGroepen: ', $event);
      console.warn('FotoCardCtrl showGroepen groepen: ', dataFactoryGroepen.store, dataFactoryGroepen.store.length);
      console.warn('FotoCardCtrl showGroepdeelnemers: ', dataFactoryGroepdeelnemers.store, dataFactoryGroepdeelnemers.store.length);

      $scope.groepen = [];
      $scope.deelnemers = [];
      var tmp;

      tmp = loDash.filter(dataFactoryGroepdeelnemers.store, function (groepdeelnemerModel) {
        return ((groepdeelnemerModel.get('deelnemerId') === dataFactoryCeo.currentModel.get('Id') && groepdeelnemerModel.get('publicist') === true) || groepdeelnemerModel.get('groep') === 'Iedereen');
      });
      console.warn('FotoCardCtrl showGroepen tmp: ', tmp, tmp.length);
      loDash.each(tmp, function (groep) {
        tmp = loDash.mapValues(groep, 'value');
        $scope.deelnemers.push(tmp);
      });
      console.warn('FotoCardCtrl showGroepen $scope.deelnemers: ', $scope.deelnemers);

      $scope.groepen = loDash.uniqBy($scope.deelnemers, 'groep');
      console.warn('FotoCardCtrl showGroepen $scope.groepen: ', $scope.groepen);

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
      if (fotoModel.get('gebruikerId') === $scope.ceo.Id) {
        $scope.details.xprive = fotoModel.get('xprive');
        if ($scope.details.xprive) {
          if ($scope.details.groep == '') {
            showGroepen($event);
          } else {
            $scope.details.xprive = false;
            //
            var groepenId = fotoModel.get('groepenId');
            $scope.details.groep = '';
            fotoModel.xData.groep = '';
            if (groepenId !== '') {
              $scope.details.groep = 'Iedereen';
              fotoModel.xData.groep = 'Iedereen';

              var found = loDash.find(dataFactoryGroepen.store, function (groep) {
                return groep.get('Id') === groepenId;
              });
              if (found) {
                $scope.details.groep = found.get('groep');
                fotoModel.xData.groep = found.get('groep');
                console.error('FotoCardCtrl updateXprive details.groep foto.xData.groep set: ', $scope.details.groep);
              }
            }
            //
            fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
            fotoModel.set('yprive', true);
            fotoModel.set('xprive', false);
            fotoModel.save();
            //
            //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
            //  Standaard labels zijn altijd public. Dus niet publiceren.
            //  Andere Tags en fototags ook prive/public maken
            //
            console.log('FotoCardCtrl updateXprive fototags, tags van naam: ', fotoModel.get('naam'));
            //
            loDash.each(dataFactoryFotoTag.store, function (fotoTagModel) {

              if (fotoTagModel.get('fotoId') === fotoId) {
                //
                //
                var tagId = fotoTagModel.get('tagId');
                console.log('FotoCardCtrl updateXprive tagId: ', tagId);
                //
                var groepenId = fotoModel.get('groepenId');
                if (groepenId === '' || groepenId === 'Iedereen') {

                  if (tagId.length <= 3) {
                    fotoTagModel.set('yprive', true);
                    fotoTagModel.set('xprive', false);
                    fotoTagModel.save();
                    console.log('FotoCardCtrl updateXprive gepubliceerd tagId', fotoTagModel.get('tagId'));
                  }
                } else {
                  fotoTagModel.set('yprive', true);
                  fotoTagModel.set('xprive', false);
                  fotoTagModel.save();
                  console.log('FotoCardCtrl updateXprive gepubliceerd tagId', fotoTagModel.get('tagId'));
                  var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
                  });
                  if (tag) {
                    tag.set('yprive', true);
                    tag.set('xprive', false);
                    tag.save();
                    console.log('FotoCardCtrl updateXprive gepubliceerd tag, naam', tag.get('tag'));
                  }
                }
              }
            });
          }
        } else {
          $scope.details.xprive = true;
          //
          fotoModel.set('groepenId', '');
          fotoModel.save();
          //
          $scope.details.groep = '';
          fotoModel.xData.groep = '';
          console.error('FotoCardCtrl updateXprive details.groep foto.xData.groep reset: ', $scope.details.groep);

          fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
          fotoModel.set('yprive', true);
          fotoModel.set('xprive', true);
          fotoModel.save();
          //
          // Labels en tags ook prive/public maken
          //
          loDash.each(dataFactoryFotoTag.store, function (fotoTagModel) {
            if (fotoTagModel.get('fotoId') === fotoId) {
              fotoTagModel.set('yprive', true);
              fotoTagModel.set('xprive', true);
              fotoTagModel.save();
            }
          });
        }

        console.warn('FotoCardCtrl updateXprive: ', fotoModel);

        fotoModel.set('Id', fotoId);
        fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
        fotoModel.save().then(function () {
          console.error('FotoCardCtrl updateXprive saved SUCCESS: ', fotoModel.get('xprive'));
        });
      }
    };
    
    
    function initxData(fotoModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!fotoModel.xData) {
        fotoModel.xData = {};
        console.log('FotosCtrl initxData xData');
      }
      if (!fotoModel.xData.fotos) {
        fotoModel.xData.fotos = [];
        console.log('FotosCtrl initxData xData.fotos');
      }
      if (!fotoModel.xData.fotos) {
        fotoModel.xData.fotos = [];
        console.log('FotosCtrl initxData xData.fotoa');
      }
      if (!fotoModel.xData.tags) {
        fotoModel.xData.tags = [];
        console.log('FotosCtrl initxData xData.tags');
      }
    }

    function updateFoto() {

      console.log('FotoCardCtrl fotoModel: ', fotoModel, fotoModel.get('naam'));
      var fotoId = fotoModel.get('Id');
      console.warn('FotoCardCtrl fotoUpdate fotoId: ', fotoId);
      
      //removeIf(!fotos)
      dataFactoryFotos.getFotoSrc(fotoModel.get('gebruikerId'), fotoModel.get('fotoId'), fotoModel.get('extension')).then(function (result) {
        console.warn('FotoCardCtrl result: ', result);
        $scope.details.content = result.path;
        console.warn('FotoCardCtrl $scope.details.content: ', $scope.details.content);
      });
      //endRemoveIf(!fotos)
      
      
      //removeIf(!fotos)
    
    
      $scope.details.trackNaam = '';
      dataFactoryTrack.syncDown().then(function () {
        console.log('TrackCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store, fotoId);
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === fotoModel.get('trackId');
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          console.log('TrackCardCtrl trackNaam: ', $scope.details.trackNaam, dataFactoryTrack.store, trackModel);
        }
      });
      //endRemoveIf(!fotos)
      
      
      
      updateLabels(fotoModel);

      //
      if (mode !== 'bericht') {
        
        
      }

      var isBlacklisted = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('volgerId') === fotoModel.get('gebruikerId');
      });
      $scope.details.volgt = true;
      if (isBlacklisted) {
        $scope.details.volgt = false;
      }

      $scope.details.fotoId = fotoId;
      $scope.details.tags = fotoModel.xData.tags;
      sorteerDetailsTags();
      console.log('FotoCardCtrl updateFoto xData.tags: ', fotoModel.xData.tags);

      $scope.details.groep = '';

      $scope.details.gebruikerId = fotoModel.get('gebruikerId');
      $scope.details.profiel = fotoModel.get('profiel');
      $scope.details.gebruikerNaam = fotoModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }

      $scope.details.avatarColor = fotoModel.get('avatarColor');
      $scope.details.avatarLetter = fotoModel.get('avatarLetter');
      $scope.details.avatarInverse = fotoModel.get('avatarInverse');

      $scope.details.createdOn = fotoModel.get('createdOn');
      $scope.details.changedOn = fotoModel.get('changedOn');


      $scope.details.star = fotoSupModel.get('star');
      $scope.details.xprive = fotoModel.get('xprive');

      if (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = fotoSupModel.get('xnew');
      }

      $scope.details.naam = fotoModel.get('naam');
      $scope.details.tekst = fotoModel.get('tekst');
      var tmp2 = fotoModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp2 + '</p>';

      $scope.details.lat = fotoModel.get('lat');
      $scope.details.lng = fotoModel.get('lng');

      var gelezen = +fotoSupModel.get('gelezen');
      $scope.details.gelezen = gelezen;
      console.log('updateFotoUpdate gelezen: ', gelezen);

      console.log('FotoCardCtrl updateFoto updateReacties Clock');

      updateReacties(fotoModel);

      dataFactoryClock.stopClockFoto();
      $rootScope.$emit('startClockFoto');
      $timeout(function () {
        console.log('FotoCardCtrl updateFoto updateReacties start Clock');

        dataFactoryClock.startClockFotoCardFast(function () {
          console.log('FotoCardCtrl updateFoto syncDown controleren op gelezen en reacties');
          $scope.details.gelezen = +fotoSupModel.get('gelezen');
          console.log('FotoCardCtrl updateFoto syncDown controleren op gelezen: ', +fotoSupModel.get('gelezen'));
          updateReacties(fotoModel);
        });
      }, 200);
    }

    function typingHelp(tmp) {

      if (!tmp.Id) {

        console.warn('FotoCardCtrl HELP tmp: ', tmp);

      } else {

        var tmp2, tmp3;
        var helpTypes = 'Foto\'s';
        var helpType = 'Foto';
        var helpTyp = 'deze';
        if ($scope.details.mode === 'track' || $scope.details.mode === 'bericht') {
          helpTyp = 'dit';
        }

        tmp.naam = tmp.naam.replace('__TYPE__', helpType);
        tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
        tmp3 = tmp2.replace(/__TYPE__/g, helpType);
        tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

        console.log('FotoCardCtrl HELP tmp: ', tmp.modal);

        $scope.cardHelps.push(tmp);
      }
    }

    function showHelp() {
      console.warn('FotoCardCtrl showHelp');

      var item;
      if (mode === 'bericht') {
        item = 'Bericht';
      }
      if (mode === 'foto') {
        item = 'Foto';
      }
      if (mode === 'poi') {
        item = 'Foto';
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

        console.error('FotoCardCtrl kaartItemHelps $scope.cardHelps: ', $scope.cardHelps);
      }
      //endRemoveIf(berichten)
      
    }

    function removeFotoFromStores(fotoId, backend) {

      console.warn('FotoCardCtrl removeFotoFromStores fotoId: ', fotoId);

      var fotoModel = loDash.find(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      loDash.remove(dataFactoryFoto.star, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      loDash.remove(dataFactoryFoto.nieuw, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      loDash.remove(dataFactoryFoto.selected, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      var fototags = fotoModel.xData.tags;

      loDash.each(fototags, function (fototag) {
        var tagModel = fototag.xData;

        if (tagModel) {

          $rootScope.$emit('fotoRemoveLabel', {
            fotoModel: fotoModel,
            tagModel: tagModel
          });
        } else {
          console.error('FotoCardCtrl removeFotoFromStores tagModel NOT FOUND');
        }
      });

      loDash.remove(dataFactoryFotoTag.store, function (fotoTagModel) {
        return fotoTagModel.get('fotoId') === fotoId;
      });
      loDash.remove(dataFactoryFotoTag.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId;
      });

      $rootScope.$emit('fotoDelete', fotoModel);

      loDash.remove(dataFactoryFotoSup.store, function (fotoSupModel) {
        return fotoSupModel.get('fotoId') === fotoId;
      });
      loDash.remove(dataFactoryFotoSup.data, function (dataItem) {
        return dataItem.record.get('fotoId') === fotoId;
      });

      loDash.remove(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });
      loDash.remove(dataFactoryFoto.data, function (dataItem) {
        return dataItem.record.get('Id') === fotoId;
      });

      if (backend) {
        fotoModel.remove();
      }
    }

    $scope.deleteFoto = function () {
      console.warn('FotoCardCtrl deleteFoto');
      $ionicPopup.confirm({
        title: 'Verwijder Foto',
        content:
          'Weet je zeker dat deze Foto<br><br><span class="trinl-rood"><b>' +
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
              removeFotoFromStores(fotoId, true);

              $rootScope.$on('fotosReload');
              $rootScope.$emit('fotosNieuweAantallen');
              $state.go('fotos.fotos');
            }
          }
        ]
      });
    };

    $scope.closeFotoCard = function (stay) {

      console.error('FotoCardCtrl closeFotoCard isCardClosed: ', isCardClosed);

      dataFactoryClock.stopClockFotoCard();

      if (!isCardClosed) {
        if (stay === undefined) {
          stay = true;
        }
        console.error('FotoCardCtrl closePoiCard stay: ', stay);
        if (blacklisted) {
          removeFotoFromStores(fotoId, false);

          $rootScope.$on('fotosReload');
          $rootScope.$emit('fotosNieuweAantallen');
          $state.go('fotos.fotos');
        } else {

          loDash.each($scope.details.reacties, function (reactieModel) {
            var reactieSupModel = loDash.find(dataFactoryFotoReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieModel.get('Id');
            });
            if (reactieSupModel) {
              reactieSupModel.set('xnew', false);
              reactieSupModel.save();
            }
          });
          console.log('FotoCardCtrl closeFotoCard reacties xnew reset in dataFactoryFotoReactieSup.store');
          //
          // Verwijder status nieuw van foto in model sup.
          //
          if (fotoSupModel) {

            fotoSupModel.set('gebruikerId', fotoSupModel.get('gebruikerId'));
            fotoSupModel.set('fotoId', fotoSupModel.get('fotoId'));
            var gelezen = +fotoSupModel.get('gelezen');

            console.log('FotoCardCtrl closeFotoCard $scope.details.gelezen: ', $scope.details.gelezen);

            console.log('FotoCardCtrl closeFotoCard gelezen fotoSupModel oud: ', gelezen);
            var xread = +fotoSupModel.get('xread') + 1;
            fotoSupModel.set('xread', xread);
            console.log('FotoCardCtrl closeFotoCard xread updated in fotoSupModel: ', xread);

            $scope.details.gelezen = gelezen + xread;
            fotoModel.xData.sup.set('gelezen', $scope.details.gelezen);
            console.log('FotoCardCtrl closeFotoCard gelezen + xread updated as gelezen in fotoSupModel: ', $scope.details.gelezen);

            fotoSupModel.set('xnew', false);
            console.log('FotoCardCtrl closeFotoCard xnew reset in fotoSupModel');
            //
            // Verwijder foto van lijst nieuw in store
            //
            loDash.remove(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
              return fotoNieuwModel.get('Id') === fotoId;
            });

            fotoSupModel.save().then(

              function (fotoSupModel) {
                fotoSupModel.set('xread', 0);
                var fotoNieuw = [];
                var fotoReactieNieuw = [];

                fotoNieuw = loDash.filter(dataFactoryFotoSup.store, function (fotoSup) {
                  return fotoSup.get('xnew');
                });

                fotoReactieNieuw = loDash.filter(dataFactoryFotoReactieSup.store, function (fotoReactieSup) {
                  return fotoReactieSup.get('xnew');
                });

                console.log('FotoCardCtrl closed nieuwe foto, fotoReacties: ', fotoNieuw, fotoReactieNieuw);

                if (fotoNieuw.length > 0 || fotoReactieNieuw.length > 0) {
                  dataFactoryNotification.composeTitleBodyNotification(fotoNieuw.length, fotoReactieNieuw.length, 'foto');
                  console.log('FotoCardCtrl notification met fotoNieuw, fotoReactieNieuw: ', fotoNieuw, fotoReactieNieuw);
                }

                $rootScope.$emit('sleepClockFoto');
              },
              function () {
                console.error('fotoSupModel saved ERROR');
              }
            );
          }

          $rootScope.$emit('fotosNieuweAantallen');
          if (stay) {
            $state.go('fotos.fotos');
          }
        }
        isCardClosed = true;
      } else {
        console.warn('FotoCardCtrl closeFotoCard SKIPPED!!!!!');
      }
    };

    $scope.clearSearchLabel = function () {
      console.warn('FotoCardCtrl clearearchLabel');

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
      console.warn('FotoCracCtrl closeTags');
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
    // Modal Foto
    //
    $ionicModal.fromTemplateUrl(
      'fotoModal.html',
      function (modalFoto) {
        $scope.modalFoto = modalFoto;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalFoto = function () {
      $scope.modalFoto.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalFoto = function () {
      $scope.modalFoto.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalFoto.remove();
      console.log('FotoCardCtrl ModalFoto is removed!');
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
    // Modal foto
    //
    $ionicModal.fromTemplateUrl(
      'fotoModal.html',
      function (modalFoto) {
        $scope.modalFoto = modalFoto;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalFoto = function () {
      $scope.modalFoto.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalFoto = function () {
      $scope.modalFoto.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalFoto.remove();
      console.log('FotoCardCtrl ModalFoto is removed!');
    });

    $scope.closeGroepen = function ($event) {
      console.log('FotoCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepenModal();
      } else {
        $scope.closeGroepenPopover($event);
      }
    };

    $scope.openGroepen = function ($event) {
      console.log('FotoCardCtrl openGroepen $event: ', $event);
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
      console.log('FotoCardCtrl openGroepenModal');
      $scope.groepenModal.show();
    };

    $scope.closeGroepenModal = function () {
      console.log('FotoCardCtrl closeGroepenModal');
      $scope.groepenModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepenModal.remove();
      console.log('FotoCardCtrl groepenModal is removed!');
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
      console.log('FotoCardCtrl openGroepenPopover');
      $scope.groepenPopover.show($event);
    };

    $scope.closeGroepenPopover = function () {
      console.log('FotoCardCtrl closeGroepenPopover');
      $scope.groepenPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepenPopover.remove();
    });

    $scope.closeGroepDeelnemers = function () {
      console.log('FotoCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepDeelnemersModal();
      } else {
        $scope.closeGroepDeelnemersPopover();
      }
    };

    $scope.openGroepDeelnemers = function ($event) {
      console.log('FotoCardCtrl openGroepen $event: ', $event);
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
      console.log('FotoCardCtrl openGroepDeelnemersModal');
      $scope.groepDeelnemersModal.show();
    };

    $scope.closeGroepDeelnemersModal = function () {
      console.log('FotoCardCtrl closeGroepDeelnemersModal');
      $scope.groepDeelnemersModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersModal.remove();
      console.log('FotoCardCtrl groepDeelnemersModal is removed!');
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
      console.log('FotoCardCtrl openGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.show($event);
    };

    $scope.closeGroepDeelnemersPopover = function () {
      console.log('FotoCardCtrl closeGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersPopover.remove();
    });
    //
    // Popover helpPopoverCard
    //
    $scope.openHelp = function ($event) {
      console.log('FotoCardCtrl openHelp');
      showHelp();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      console.log('FotoCardCtrl openHelp');
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
      console.log('FotoCardCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      console.log('FotoCardCtrl openHelpPopover');
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
      console.log('FotoCardCtrl closeHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModalCard = function () {
      console.log('FotoCardCtrl closeHelpModal');
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
      console.log('FotoCardCtrl setReactieNavTitle: ' + title);
      $ionicNavBarDelegate.title(title);
    };

    function init() {
      dataFactoryFotoSup.store = loDash.uniqBy(dataFactoryFotoSup.store, function (fotoSup) {
        return fotoSup.get('fotoId');
      });
      console.warn('FotoCardCtrl init FotoStore: ', dataFactoryFoto.store);
      console.warn('FotoCardCtrl init FotoSupStore: ', dataFactoryFotoSup.store);
      fotoModel = loDash.find(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      console.warn('FotoCardCtrl init fotoModel: ', fotoModel, fotoModel.get('naam'));

      if (fotoModel) {
        fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotoSupModel) {
          return fotoSupModel.get('fotoId') === fotoId;
        });
        //
        // Indien geen sup dan nieuwe aanmaken
        //
        if (!fotoSupModel) {
          fotoSupModel = new dataFactoryFotoSup.Model();
          fotoSupModel.set('xnew', true);
          fotoSupModel.set('star', false);
          //fotoSupModel.set('fotoId', fotoId);
          fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          console.error('FotoCardCtrl init fotoSupModel: ', fotoSupModel.get('fotoId'));
          fotoSupModel.save().then(function () {
            fotoModel.xData.sup = fotoSupModel;
            var xnew = fotoModel.xData.sup.get('xnew');

            if (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
              var nieuwModel = loDash.find(dataFactoryFoto.nieuw, function (nieuwModel) {
                return nieuwModel.get('Id') === fotoId;
              });
              if (!nieuwModel) {
                dataFactoryFoto.nieuw.push(fotoModel, fotoModel.get('naam'));
              }
            }
            console.log('FotoCardCtrl init met nieuw supModel');
          });
        } else {
          console.log('FotoCardCtrl init bestaand supModel: ', fotoSupModel);

          initxData(fotoModel);

          fotoModel.xData.sup = fotoSupModel;
          console.log('fotoModel.xData.sup: ', fotoModel.xData.sup);

          var xnew = fotoModel.xData.sup.get('xnew');

          if (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
            var nieuwModel = loDash.find(dataFactoryFoto.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === fotoId;
            });
            if (!nieuwModel) {
              dataFactoryFoto.nieuw.push(fotoModel);
            }
          }
        }
        updateFoto(fotoModel, fotoModel.get('naam'));
      } else {
        console.warn('FotoCardCtrl findRecord ERROR Id: ', fotoId);

        $ionicPopup.confirm({
          title: 'Foto',
          content:
            'Deze Foto is niet meer beschikbaar!<br>De eigenaar heeft deze Foto waarschijnlijk verwijderd.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $state.go('fotos.fotos');
              }
            }
          ]
        });
      }
    }
  }
]);
