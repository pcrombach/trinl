/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('__DataItem__CardCtrl', ['loDash', '$timeout', '$rootScope', '$q', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'dataFactoryCeo', 'dataFactoryHelp', 'dataFactoryNotification', 'dataFactoryClock', 'dataFactory__DataItem__Reactie', 'dataFactory__DataItem__ReactieSup', 'dataFactory__DataItem__', 'dataFactory__DataItem__Sup', 'dataFactory__DataItem__Tag', 'dataFactoryTag',
  //removeIf(!pois)
  'dataFactoryTrack',
  //endRemoveIf(!pois)
  /*  ###
  //removeIf(!fotos)
  'dataFactoryTrack',
  //endRemoveIf(!fotos)
  ###  */
  /*  ###
  //removeIf(!fotos)
  'dataFactoryFotos',
  //endRemoveIf(!fotos)
  ###  */
  /*  ###
  //removeIf(!tracks)
  //'dataFactoryTrackPoisFotos',
  //endRemoveIf(!tracks)
  ###  */
  'dataFactoryBlacklist', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers',
  function (loDash, $timeout, $rootScope, $q, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, $ionicListDelegate, dataFactoryCeo, dataFactoryHelp, dataFactoryNotification, dataFactoryClock, dataFactory__DataItem__Reactie, dataFactory__DataItem__ReactieSup, dataFactory__DataItem__, dataFactory__DataItem__Sup, dataFactory__DataItem__Tag, dataFactoryTag,
    //removeIf(!pois)
    dataFactoryTrack,
    //endRemoveIf(!pois)
    /*  ###
    //removeIf(!fotos)
    dataFactoryTrack,
    //endRemoveIf(!fotos)
    ###  */
    /*  ###
    //removeIf(!fotos)
    dataFactoryFotos,
    //endRemoveIf(!fotos)
    ###  */
    /*  ###
    //removeIf(!tracks)
    //dataFactoryTrackPoisFotos,
    //endRemoveIf(!tracks)
    ###  */
    dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers
  ) {

    var isCardClosed = false;

    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    console.error('__DataItem__CardCtrl ceo.Id: ', ceo.Id);
    console.error('__DataItem__CardCtrl ceo.profielId: ', +ceo.profielId);

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
    $scope.details.mode = '__dataItem__';
    var mode = '__dataItem__';


    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'fotos/small_non_existing_id.png';

    var blacklisted = false;
    var isCardClosed = false;

    var __dataItem__Id = $stateParams.Id;
    var __dataItem__Model;
    var __dataItem__SupModel;
    var oldInputNaam;
    var oldInputTekst;
    // eslint-disable-next-line no-unused-vars
    //
    var event0a = $scope.$on('$ionicView.beforeEnter', function () {
      console.warn('__DataItem__CardCtrl $ionicView.beforeEnter');
      init();
    });
    $scope.$on('$destroy', event0a);

    var event0z = $scope.$on('$ionicView.afterEnter', function () {
      console.warn('__DataItem__CardCtrl $ionicView.afterEnter');
      isCardClosed = false;
    });
    $scope.$on('$destroy', event0z);

    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      console.warn('__DataItem__CardCtrl $ionicView.beforeLeave');
      //$timeout(function () {
      $scope.close__DataItem__Card(false);
      //}, 100);
    });
    $scope.$on('$destroy', event0b);
    //
    var event1 = $rootScope.$on('labels__DataItem__Update', function (event, args) {
      var __dataItem__Model = args.__dataItem__Model;
      console.warn('__DataItem__CardCtrl on.labels__DataItem__Update __dataItem__Model: ', __dataItem__Model, __dataItem__Model.get('naam'));
      updateLabels(__dataItem__Model);
    });
    $scope.$on('$destroy', event1);
    //
    var event7 = $rootScope.$on('__dataItem__Verwijderd', function (event, args) {
      var __dataItem__Model = args.__dataItem__Model;
      if (__dataItem__Model.get('Id') === __dataItem__Id) {
        $ionicPopup.confirm({
          title: 'Verwijder Locatie',
          content: 'Deze Locatie is zojuist door de eigenaar verwijderd.<br><br>Deze Locatie wordt gesloten',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('__dataItem__s.__dataItem__s');
            }
          }]
        });
      }
    });
    $scope.$on('$destroy', event7);
    //
    $scope.infoTag = function (tagModel) {

      console.log('__DataItem__CardCtrl tagModel: ', tagModel);

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
      console.warn('__DataItem__CardCtrl editTag: ', tag, tagModel);

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

        console.log('__DataItem__sSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          console.log('__DataItem__sSideMenuCtrl editTag __dataItem__Model tags: ', tag, __dataItem__Model && __dataItem__Model.xData.tags);

          $rootScope.$emit('__dataItem__RemoveLabel', {
            __dataItem__Model: __dataItem__Model,
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

            $rootScope.$emit('__dataItem__AddLabel', {
              __dataItem__Model: __dataItem__Model,
              tagModel: tagModel
            });

            $rootScope.$emit('__dataItem__sFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });

          });
        }
      });
    };

    $scope.deleteTag = function (tagModel) {
      var tag = tagModel.get('tag');
      console.warn('__DataItem__CardCtrl editTag: ', tag);

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

            loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
              console.log('__DataItem__sSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, __dataItem__Model);
              loDash.each(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
                console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__Modal.tags loop: ', __dataItem__Model.xData.tags, __dataItem__TagModel);
                (function (__dataItem__TagModel) {
                  if (__dataItem__TagModel.xData.get('tag') === tag) {
                    console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__TagModel in __dataItem__Model.tags wordt verwijderd uit backend: ', __dataItem__TagModel);
                    __dataItem__TagModel.remove().then(function () {
                      console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__TagModel wordt verwijderd uit __dataItem__Model.tags: ', __dataItem__TagModel);
                      loDash.remove(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
                        return __dataItem__TagModel.xData.get('tag') === tag;
                      });
                    });
                    $rootScope.$emit('__dataItem__RemoveLabel', {
                      __dataItem__Model: __dataItem__Model,
                      tagModel: tagModel
                    });
                  }
                })(__dataItem__TagModel);
              });
            });

            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            console.log('__DataItem__sSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle __dataItem__tags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              console.log('__DataItem__sSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.__dataItem__sFilterAlle();
          }
        }]
      });
    };


    function sorteerGlobalTags() {

      console.error('__dataItem__CardCtrl sorteerGlobalTags');
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

      console.error('__DataItem__CardCtrl sorteerDetailsTags');
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

    function __dataItem__sCheck__DataItem__ReactieAantal(reacties) {
      console.warn('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud, reacties: ', reacties);

      var maxAantal = 50;

      var verwijderingen = 0;

      var q = $q.defer();

      var teller = 0;
      loDash.each(reacties, function (reactieModel) {
        console.log('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieAantal reactieModel: ', reactieModel);
        teller += 1;
        if (teller > maxAantal) {

          verwijderingen += 1;

          var reactieId = reactieModel.get('Id');

          reactieModel.remove();
          loDash.remove(dataFactory__DataItem__Reactie.store, function (reactieModel) {
            return reactieModel.get('Id') === reactieId;
          });
          loDash.remove(dataFactory__DataItem__Reactie.data, function (dataItem) {
            return dataItem.record.get('Id') === reactieId;
          });
          var reactieSupModel = loDash.find(dataFactory__DataItem__ReactieSup.store, function (reactieSupModel) {
            return reactieSupModel.get('reactieId') === reactieId;
          });
          if (reactieSupModel) {
            reactieSupModel.remove();
            loDash.remove(dataFactory__DataItem__ReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            loDash.remove(dataFactory__DataItem__ReactieSup.data, function (dataItem) {
              return dataItem.record.get('reactieId') === reactieId;
            });
          }
          console.error('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieAantal reactie removed SUCCESS');
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

    function __dataItem__sCheck__DataItem__ReactieOud(reacties) {

      console.warn('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud, reacties: ', reacties);

      var aantalOuder = 7;
      var formatOuder = 'days';

      var q = $q.defer();
      var tooOld = moment().subtract(aantalOuder, formatOuder).format('YYYY-MM-DD HH:mm:ss');
      var verwijderingen = false;
      console.log('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud: ', tooOld);
      //
      //  Ouder dan 
      //
      loDash.each(reacties, function (reactieModel) {
        if (reactieModel) {
          console.log('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud reactieModel: ', reactieModel);
          var datum = reactieModel.get('changedOn');
          var reactieId = reactieModel.get('Id');
          if (datum < tooOld) {
            verwijderingen += 1;
            console.log('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud changedOn, __dataItem__Id, tooOld: ', datum, __dataItem__Id, tooOld);

            reactieModel.remove();
            loDash.remove(dataFactory__DataItem__Reactie.store, function (reactieModel) {
              return reactieModel.get('Id') === reactieId;
            });
            loDash.remove(dataFactory__DataItem__Reactie.data, function (dataItem) {
              return dataItem.record.get('Id') === reactieId;
            });
            var reactieSupModel = loDash.find(dataFactory__DataItem__ReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            if (reactieSupModel) {
              reactieSupModel.remove();
              loDash.remove(dataFactory__DataItem__ReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('reactieId') === reactieId;
              });
              loDash.remove(dataFactory__DataItem__ReactieSup.data, function (dataItem) {
                return dataItem.record.get('reactieId') === reactieId;
              });
            }
            $rootScope.$emit('filter');
            $rootScope.$emit('__dataItem__sNieuweAantallen');
            console.error('__DataItem__sCtrl __dataItem__sCheck__DataItem__ReactieOud reactie removed SUCCESS');
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

    function updateReacties(__dataItem__Model) {
      console.log('__DataItem__sCtrl updateReacties voor __dataItem__ naam Id: ', __dataItem__Model.get('Id'), __dataItem__Model.get('naam'));
      var __dataItem__Id = __dataItem__Model.get('Id');

      console.log('__DataItem__sCtrl updateReacties dataFactory__DataItem__Reactie.store: ', dataFactory__DataItem__Reactie.store);

      var __dataItem__Reacties = loDash.filter(dataFactory__DataItem__Reactie.store, function (__dataItem__ReactieModel) {
        return __dataItem__ReactieModel.get('__dataItem__Id') === __dataItem__Id;
      });
      //
      $scope.details.reacties = loDash.orderBy(__dataItem__Reacties, 'createdOn.value', 'desc');
      __dataItem__sCheck__DataItem__ReactieAantal(__dataItem__Reacties).then(function () {
        __dataItem__sCheck__DataItem__ReactieOud(__dataItem__Reacties).then(function () {
        });
      });
      console.warn('__DataItem__CardCtrl loadReactie __dataItem__ in store, aantal: ', dataFactory__DataItem__.store.length);
      console.warn('__DataItem__CardCtrl loadReactie reacties in store, aantal: ', __dataItem__Reacties.length);
      $scope.details.reactiesAantal = __dataItem__Reacties.length;
    }

    $scope.reactie = function () {
      console.warn('__DataItem__CardCtrl reactie');

      $scope.input = {};
      $scope.input.naam = '';
      $scope.input.tekst = '';
      $scope.init__DataItem__ = 'Reactie';

      $scope.openModalReactie();
    };

    $scope.saveReactie = function (input) {

      console.warn('__DataItem__CardCtrl saveReactie input __dataItem__Id: ', input, __dataItem__Id);

      if ($scope.init__DataItem__ === 'Reactie') {

        $scope.details.reactiesAantal += 1;

        var reactieModel = new dataFactory__DataItem__Reactie.Model();

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = tmp.replace(/\\"/g, '"');
        var htmlreactietekst = '<p>' + tmp + '</p>';
        tmp = false;
        console.error('__DataItem__CardCtrl saveReactie: ', htmlreactietekst);
        reactieModel.set('reactie', htmlreactietekst);
        reactieModel.set('__dataItem__Id', __dataItem__Id);
        reactieModel.set('__dataItem__GebruikerId', __dataItem__Model.get('gebruikerId'));
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
          var reactieSupModel = new dataFactory__DataItem__ReactieSup.Model();
          reactieSupModel.set('__dataItem__Id', __dataItem__Id);
          reactieSupModel.set('reactieId', reactieId);
          reactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          reactieSupModel.set('xnew', false);
          reactieSupModel.save().then(function (reactieSupModel) {
            console.error('__DataItem__CardCtrl saveReactie reactieSupModel: ', reactieSupModel);
            reactieModel.xData = {
              sup: reactieSupModel
            };
          });
          __dataItem__SupModel.set('__dataItem__Id', __dataItem__Id);
          __dataItem__SupModel.save().then(function () {
            console.error('__DataItem__CardCtrl saveReactie __dataItem__SupModel: ', __dataItem__SupModel);
          });
          $scope.details.reacties.splice(0, 0, reactieModel);
        });
        $scope.closeModalReactie();
      }
    };

    $scope.save__DataItem__ItemTekst = function (input) {
      console.warn('__DataItem__CardCtrl save__DataItem__Tekst: ', $scope.details);
      console.warn('__DataItem__CardCtrl save__DataItem__Tekst: ', input);
      console.error('__DataItem__CardCtrl size message: ', input.naam.length + input.tekst.length);

      $scope.details.naam = input.naam;
      $scope.details.tekst = input.tekst;
      var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      tmp = false;
      if (input.naam !== oldInputNaam) {
        __dataItem__Model.set('naam', input.naam.substr(0, 7500));
        $scope.details.naam = input.naam.substr(0, 7500);
        tmp = true;
      }
      if (input.tekst !== oldInputTekst) {
        __dataItem__Model.set('tekst', input.tekst.substr(0, 7500));
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
        __dataItem__Model.set('gebruikerId', __dataItem__Model.get('gebruikerId'));
        __dataItem__Model.save();
        $rootScope.$emit('__dataItem__Update', __dataItem__Model);
      }

      $scope.closeModal__DataItem__();
    };

    $scope.open__DataItem__Tekst = function () {
      console.warn('__DataItem__CardCtrl open__DataItem__Tekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModal__DataItem__();
    };

    function updateLabels(__dataItem__Model) {
      console.log('__DataItem__CardCtrl updateLabels __dataItem__Model, __dataItem__Id: ', __dataItem__Model, __dataItem__Id, __dataItem__Model.get('naam'));
      if (__dataItem__Model.get('Id') === __dataItem__Id) {
        console.log('__DataItem__CardCtrl updateLabels __dataItem__Model: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'));
        //
        // Indien labels worden toegevoegd dan worden die toegevoegd in de dataFactory__DataItem__Tag store en data
        // De label moet ook toegevoegd worden aan de __dataItem__Model.xData.tags
        initxData(__dataItem__Model);
        $scope.details.tags = __dataItem__Model.xData.tags;
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
      console.warn('__DataItem__CardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          if (__dataItem__Model.get('xprive')) {
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
            console.log('__DataItem__CardCtrl addNieuweLabel tag: ', tagModel);
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

      console.warn('__DataItem__CardCtrl selectLabelClick tagModel: ', tagModel);
      console.warn('__DataItem__CardCtrl selectLabelClick __dataItem__Id: ', __dataItem__Id);
      console.warn('__DataItem__CardCtrl selectLabelClick tagId: ', tagModel.get('Id'));
      //
      //  Kijk of de __dataItem__tag reeds bestaat
      //
      var found = loDash.find(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
        return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id && __dataItem__TagModel.get('tagId') === tagId;
      });

      if (!found) {
        var __dataItem__TagModel = new dataFactory__DataItem__Tag.Model();
        __dataItem__TagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        __dataItem__TagModel.set('__dataItem__Id', __dataItem__Id);
        __dataItem__TagModel.set('tagId', tagId);
        __dataItem__TagModel.set('xprive', true);
        __dataItem__TagModel.set('yprive', false);

        console.error('__DataItem__CardCtrl newLabel groepenId: ', __dataItem__Model.get('groepenId'));
        var groepenId = __dataItem__Model.get('groepenId');
        if (groepenId === '' || groepenId === 'Iedereen') {
          if (tagId.length <= 3) {
            __dataItem__TagModel.set('yprive', true);
            __dataItem__TagModel.set('xprive', false);
            console.log('__DataItem__CardCtrl publiceren PUBLIC tagId', __dataItem__TagModel.get('tagId'));
          }
        } else {
          __dataItem__TagModel.set('yprive', true);
          __dataItem__TagModel.set('xprive', false);
          console.log('__DataItem__CardCtrl publiceren made PUBLIC tagId', __dataItem__TagModel.get('tagId'));
          //
          tagModel.set('yprive', true);
          tagModel.set('xprive', false);
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
          });
          console.log('__DataItem__CardCtrl publiceren made PUBLIC tag, naam', tagModel.get('tag'));
        }
        __dataItem__TagModel.save().then(function () {

          __dataItem__TagModel.xData = tagModel;
          __dataItem__Model.xData.tags.push(__dataItem__TagModel);
          $scope.details.tags = __dataItem__Model.xData.tags;
          sorteerDetailsTags();
          $rootScope.$emit('__dataItem__AddLabel', {
            __dataItem__Model: __dataItem__Model,
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

    $scope.addTagTo__DataItem__ = function ($event) {
      console.warn('__DataItem__CardCtrl addTagTo__DataItem__');

      $scope.clearSearchLabel($event);
      $scope.openTags($event);
    };

    $scope.deleteLabelTag = function (__dataItem__TagModel) {
      console.warn('__DataItem__CardCtrl deleteLabelTag __dataItem__Model: ', __dataItem__Model, __dataItem__Model.get('naam'), );
      console.warn('__DataItem__CardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('__DataItem__CardCtrl deleteLabelTag __dataItem__TagModel: ', __dataItem__TagModel);
      console.warn('__DataItem__CardCtrl deleteLabelTag tagModel: ', __dataItem__TagModel.xData);
      var tagModel = __dataItem__TagModel.xData;
      console.warn('__DataItem__CardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      console.warn('__DataItem__CardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));
      console.warn('__DataItem__CardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('__DataItem__CardCtrl deleteLabelTag __dataItem__Model.xdata.tags: ', __dataItem__Model.xData.tags);

      var __dataItem__TagId = __dataItem__TagModel.get('Id');

      __dataItem__TagModel.remove().then(function () {

        __dataItem__TagModel.xData = tagModel;
        $rootScope.$emit('__dataItem__RemoveLabel', {
          __dataItem__Model: __dataItem__Model,
          tagModel: tagModel
        });

        loDash.remove($scope.details.tags, function (__dataItem__TagModel) {
          return __dataItem__TagModel.get('Id') === __dataItem__TagId;
        });
        sorteerDetailsTags();
        loDash.remove(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
          return __dataItem__TagModel.get('Id') === __dataItem__TagId;
        });

      });
    };

    $scope.selecteer__DataItem__ = function () {
      console.log('__DataItem__sCtrl selecteer__DataItem__: ', __dataItem__Model);

      $rootScope.$emit('__dataItem__Selected', __dataItem__Model);
      $state.go('app.kaart');
    };

    $scope.clickedAvatar = function (details) {
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      console.warn('__DataItem__CardCtrl clickedAvatar naam: ', details.gebruikerNaam);
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

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

                console.warn('__DataItem__CardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

                if (found) {
                  console.warn('__DataItem__CardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

                  $scope.details.volgt = true;

                  found.set('Id', found.get('Id'));
                  found.set('gebruikerId', $scope.ceo.Id);
                  found.set('type', '__dataItem__gebruikers');
                  found.set('blackId', gebruikerId);
                  found.set('reden', 'avatar');
                  found.remove();
                  removed = false;
                } else {
                  $scope.details.volgt = false;

                  var blacklistModel = new dataFactoryBlacklist.Model();
                  blacklistModel.set('gebruikerId', $scope.ceo.Id);
                  blacklistModel.set('type', '__dataItem__gebruikers');
                  blacklistModel.set('blackId', gebruikerId);
                  blacklistModel.set('eigenaar', gebruikerId);
                  blacklistModel.set('naam', naam);
                  blacklistModel.set('reden', 'avatar');
                  blacklistModel.save();
                  removed = true;

                  console.warn('__DataItem__CardCtrl updateVolgt blacklistStore blacklistModel niet gevonden aangemaakt en saved: ', blacklistModel);
                }

                if (removed) {
                  loDash.remove(dataFactory__DataItem__.star, function (starModel) {
                    return starModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactory__DataItem__.nieuw, function (nieuwModel) {
                    return nieuwModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactory__DataItem__.selected, function (
                    selectedModel
                  ) {
                    return selectedModel.get('gebruikerId') === gebruikerId;
                  });
                  $rootScope.$emit('__dataItem__Delete', details.gebruikerId);
                }
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                var itemsToRemove = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
                  return __dataItem__Model.get('gebruikerId') === gebruikerId;
                });
                console.log('__DataItem__CardCtrl __dataItem__Items removing from Store.....: ', itemsToRemove);

                loDash.each(itemsToRemove, function (__dataItem__Model) {
                  var __dataItem__Id = __dataItem__Model.get('Id');

                  remove__DataItem__FromStores(__dataItem__Id, false);
                });

                $rootScope.$on('__dataItem__sReload');
                $rootScope.$emit('__dataItem__sNieuweAantallen');
                $state.go('__dataItem__s.__dataItem__s');
              }
            }
          ]
        });
      }
    };

    $scope.updateVolgt = function () {
      console.warn('__DataItem__CardCtrl updateVolgt: ', __dataItem__Model, __dataItem__Model.get('naam'));

      $scope.details.volgt = false;

      blacklisted = false;

      var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('blackId') === __dataItem__Model.get('Id');
      });

      console.warn('__DataItem__CardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

      if (found) {
        console.warn('__DataItem__CardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

        remove__DataItem__FromStores(__dataItem__Model.get('Id'), false);

        $scope.details.volgt = true;

        found.set('Id', found.get('Id'));
        found.set('gebruikerId', $scope.ceo.Id);
        found.set('type', '__dataItem__');
        found.set('blackId', __dataItem__Model.get('Id'));
        found.set('reden', 'pinned');
        found.remove();
        blacklisted = false;
      } else {
        $scope.details.volgt = false;

        var blacklistModel = new dataFactoryBlacklist.Model();
        blacklistModel.set('gebruikerId', $scope.ceo.Id);
        blacklistModel.set('type', '__dataItem__');
        blacklistModel.set('blackId', __dataItem__Model.get('Id'));
        blacklistModel.set('eigenaar', __dataItem__Model.get('gebruikerId'));
        blacklistModel.set('naam', __dataItem__Model.get('naam'));
        blacklistModel.set('reden', 'pinned');
        blacklistModel.save();
        blacklisted = true;
      }
    };

    $scope.updateStar = function () {
      console.warn('__DataItem__CardCtrl updateStar in: ', __dataItem__SupModel);

      $scope.details.star = __dataItem__SupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        __dataItem__Model.xData.sup.set('star', false);
        loDash.remove(dataFactory__DataItem__.star, function (__dataItem__Model) {
          return __dataItem__Model.get('Id') === __dataItem__Id;
        });
        __dataItem__SupModel.set('star', $scope.details.star);
        console.warn('__DataItem__CardCtrl updateStar __dataItem__SupModel: ', __dataItem__SupModel.get('__dataItem__Id'));
        __dataItem__SupModel.save();
        console.warn('__DataItem__CardCtrl updateStar: ', __dataItem__SupModel, __dataItem__Model.xData.sup.xnew.value);
      } else {
        $scope.details.star = true;
        __dataItem__Model.xData.sup.set('star', true);
        var found = loDash.find(dataFactory__DataItem__.star, function (__dataItem__StarModel) {
          return __dataItem__StarModel.get('Id') === __dataItem__Id;
        });
        if (!found) {
          dataFactory__DataItem__.star.push(__dataItem__Model);
        }
        __dataItem__SupModel.set('star', $scope.details.star);
        //__dataItem__SupModel.set('__dataItem__Id', __dataItem__Id);
        console.warn('__DataItem__CardCtrl updateStar __dataItem__SupModel: ', __dataItem__SupModel.get('__dataItem__Id'));
        __dataItem__SupModel.save();
        console.warn('__DataItem__CardCtrl updateStar: ', __dataItem__SupModel, __dataItem__Model.xData.sup.xnew.value);
      }
      $rootScope.$emit('__dataItem__sNieuweAantallen');
    };

    $scope.selectGroep = function (groep) {
      console.warn('__DataItem__CardCtrl selectGroep: ', groep, groep.groep, groep.groepenId);
      $scope.details.groep = groep.groep;
      __dataItem__Model.set('groepenId', groep.groepenId);
      $scope.details.xprive = false;
      __dataItem__Model.set('gebruikerId', __dataItem__Model.get('gebruikerId'));
      __dataItem__Model.set('yprive', true);
      __dataItem__Model.set('xprive', false);
      __dataItem__Model.save();
      //
      //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
      //  Standaard labels zijn altijd public. Dus niet publiceren.
      //  Andere Tags en __dataItem__tags ook prive/public maken
      //
      console.log('__DataItem__CardCtrl selectGroep__dataItem__tags, tags van naam: ', __dataItem__Model.get('naam'));
      //
      loDash.each(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
        //
        if (__dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id) {
          //
          var tagId = __dataItem__TagModel.get('tagId');
          //
          __dataItem__TagModel.set('yprive', true);
          __dataItem__TagModel.set('xprive', true);
          console.log('__DataItem__CardCtrl selectGroep made PRIVATE tagId', __dataItem__TagModel.get('tagId'));

          var groepenId = __dataItem__Model.get('groepenId');
          if (groepenId === '' || groepenId === 'Iedereen') {

            if (tagId.length <= 3) {
              __dataItem__TagModel.set('yprive', true);
              __dataItem__TagModel.set('xprive', false);
              console.log('__DataItem__CardCtrl selectGroep PUBLIC tagId', __dataItem__TagModel.get('tagId'));
            }
          } else {
            __dataItem__TagModel.set('yprive', true);
            __dataItem__TagModel.set('xprive', false);
            console.log('__DataItem__CardCtrl selectGroep made PUBLIC tagId', __dataItem__TagModel.get('tagId'));
            //
            var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
            });
            if (tag) {
              tag.set('yprive', true);
              tag.set('xprive', false);
              tag.save();
              console.log('__DataItem__CardCtrl selectGroep made PUBLIC tag, naam', tag.get('tag'));
            }
          }
          __dataItem__TagModel.save();
        }
      });
      $scope.closeGroepen();
    };

    $scope.openDeelnemers = function (groepy, $event) {
      console.warn('__DataItem__CardCtrl openDeelnemersGroep: ', groepy);

      $scope.deelnemers = loDash.filter(dataFactoryGroepdeelnemers.store, function (groep) {
        return groep.get('groep') === groepy;
      });
      console.warn('__DataItem__CardCtrl openDeelnemersGroep: ', $scope.deelnemers);
      $scope.openGroepDeelnemers($event);
    };

    function showGroepen($event) {
      console.warn('__DataItem__CardCtrl showGroepen: ', $event);
      console.warn('__DataItem__CardCtrl showGroepen groepen: ', dataFactoryGroepen.store, dataFactoryGroepen.store.length);
      console.warn('__DataItem__CardCtrl showGroepdeelnemers: ', dataFactoryGroepdeelnemers.store, dataFactoryGroepdeelnemers.store.length);

      $scope.groepen = [];
      $scope.deelnemers = [];
      var tmp;

      tmp = loDash.filter(dataFactoryGroepdeelnemers.store, function (groepdeelnemerModel) {
        return ((groepdeelnemerModel.get('deelnemerId') === dataFactoryCeo.currentModel.get('Id') && groepdeelnemerModel.get('publicist') === true) || groepdeelnemerModel.get('groep') === 'Iedereen');
      });
      console.warn('__DataItem__CardCtrl showGroepen tmp: ', tmp, tmp.length);
      loDash.each(tmp, function (groep) {
        tmp = loDash.mapValues(groep, 'value');
        $scope.deelnemers.push(tmp);
      });
      console.warn('__DataItem__CardCtrl showGroepen $scope.deelnemers: ', $scope.deelnemers);

      $scope.groepen = loDash.uniqBy($scope.deelnemers, 'groep');
      console.warn('__DataItem__CardCtrl showGroepen $scope.groepen: ', $scope.groepen);

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
      if (__dataItem__Model.get('gebruikerId') === $scope.ceo.Id) {
        $scope.details.xprive = __dataItem__Model.get('xprive');
        if ($scope.details.xprive) {
          if ($scope.details.groep == '') {
            showGroepen($event);
          } else {
            $scope.details.xprive = false;
            //
            var groepenId = __dataItem__Model.get('groepenId');
            $scope.details.groep = '';
            __dataItem__Model.xData.groep = '';
            if (groepenId !== '') {
              $scope.details.groep = 'Iedereen';
              __dataItem__Model.xData.groep = 'Iedereen';

              var found = loDash.find(dataFactoryGroepen.store, function (groep) {
                return groep.get('Id') === groepenId;
              });
              if (found) {
                $scope.details.groep = found.get('groep');
                __dataItem__Model.xData.groep = found.get('groep');
                console.error('__DataItem__CardCtrl updateXprive details.groep __dataItem__.xData.groep set: ', $scope.details.groep);
              }
            }
            //
            __dataItem__Model.set('gebruikerId', __dataItem__Model.get('gebruikerId'));
            __dataItem__Model.set('yprive', true);
            __dataItem__Model.set('xprive', false);
            __dataItem__Model.save();
            //
            //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
            //  Standaard labels zijn altijd public. Dus niet publiceren.
            //  Andere Tags en __dataItem__tags ook prive/public maken
            //
            console.log('__DataItem__CardCtrl updateXprive __dataItem__tags, tags van naam: ', __dataItem__Model.get('naam'));
            //
            loDash.each(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {

              if (__dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id) {
                //
                //
                var tagId = __dataItem__TagModel.get('tagId');
                console.log('__DataItem__CardCtrl updateXprive tagId: ', tagId);
                //
                var groepenId = __dataItem__Model.get('groepenId');
                if (groepenId === '' || groepenId === 'Iedereen') {

                  if (tagId.length <= 3) {
                    __dataItem__TagModel.set('yprive', true);
                    __dataItem__TagModel.set('xprive', false);
                    __dataItem__TagModel.save();
                    console.log('__DataItem__CardCtrl updateXprive gepubliceerd tagId', __dataItem__TagModel.get('tagId'));
                  }
                } else {
                  __dataItem__TagModel.set('yprive', true);
                  __dataItem__TagModel.set('xprive', false);
                  __dataItem__TagModel.save();
                  console.log('__DataItem__CardCtrl updateXprive gepubliceerd tagId', __dataItem__TagModel.get('tagId'));
                  var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
                  });
                  if (tag) {
                    tag.set('yprive', true);
                    tag.set('xprive', false);
                    tag.save();
                    console.log('__DataItem__CardCtrl updateXprive gepubliceerd tag, naam', tag.get('tag'));
                  }
                }
              }
            });
          }
        } else {
          $scope.details.xprive = true;
          //
          __dataItem__Model.set('groepenId', '');
          __dataItem__Model.save();
          //
          $scope.details.groep = '';
          __dataItem__Model.xData.groep = '';
          console.error('__DataItem__CardCtrl updateXprive details.groep __dataItem__.xData.groep reset: ', $scope.details.groep);

          __dataItem__Model.set('gebruikerId', __dataItem__Model.get('gebruikerId'));
          __dataItem__Model.set('yprive', true);
          __dataItem__Model.set('xprive', true);
          __dataItem__Model.save();
          //
          // Labels en tags ook prive/public maken
          //
          loDash.each(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
            if (__dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id) {
              __dataItem__TagModel.set('yprive', true);
              __dataItem__TagModel.set('xprive', true);
              __dataItem__TagModel.save();
            }
          });
        }

        console.warn('__DataItem__CardCtrl updateXprive: ', __dataItem__Model);

        __dataItem__Model.set('Id', __dataItem__Id);
        __dataItem__Model.set('gebruikerId', __dataItem__Model.get('gebruikerId'));
        __dataItem__Model.save().then(function () {
          console.error('__DataItem__CardCtrl updateXprive saved SUCCESS: ', __dataItem__Model.get('xprive'));
        });
      }
    };
    /*  ###
    //removeIf(!tracks)
    $scope.updatePoisVolgen = function () {
    
      console.warn('__DataItem__CardCtrl updatePoisVolgen');
    
      if ($scope.details.poisVolgen) {
        $scope.details.poisVolgen = false;
    
        __dataItem__SupModel.set('Id', __dataItem__SupModel.get('Id'));
        __dataItem__SupModel.set('gebruikerId', __dataItem__SupModel.get('gebruikerId'));
        __dataItem__SupModel.set('poisVolgen', false);
        __dataItem__SupModel.save();
        console.log('__DataItem__CardCtrl __dataItem__MakersVolgen saved in __dataItem__SupModel: ', $scope.details.poisVolgen);
    
      } else {
    
    
        $scope.details.poisVolgen = true;
    
        __dataItem__SupModel.set('Id', __dataItem__SupModel.get('Id'));
        __dataItem__SupModel.set('gebruikerId', __dataItem__SupModel.get('gebruikerId'));
        __dataItem__SupModel.set('poisVolgen', true);
        __dataItem__SupModel.save();
        console.log('__DataItem__CardCtrl __dataItem__PoisVolgen saved in __dataItem__SupModel: ', $scope.details.poisVolgen);
      }
    };
    
    $scope.updateFotosVolgen = function () {
    
      console.warn('__DataItem__CardCtrl updateFotosVolgen');
    
      if ($scope.details.fotosVolgen) {
    
        $scope.details.fotosVolgen = false;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('fotosVolgen', false);
        trackSupModel.save();
        console.log('__DataItem__CardCtrl trackFotosVolgen saved in trackSupModel: ', $scope.details.fotosVolgen);
    
      } else {
    
        $scope.details.fotosVolgen = true;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('fotosVolgen', true);
        trackSupModel.save();
        console.log('__DataItem__CardCtrl trackFotosVolgen saved in trackSupModel: ', $scope.details.fotosVolgen);
      }
    };
    //endRemoveIf(!tracks)
    ###  */
    function initxData(__dataItem__Model) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!__dataItem__Model.xData) {
        __dataItem__Model.xData = {};
        console.log('__DataItem__sCtrl initxData xData');
      }
      if (!__dataItem__Model.xData.__dataItem__s) {
        __dataItem__Model.xData.__dataItem__s = [];
        console.log('__DataItem__sCtrl initxData xData.__dataItem__s');
      }
      if (!__dataItem__Model.xData.fotos) {
        __dataItem__Model.xData.fotos = [];
        console.log('__DataItem__sCtrl initxData xData.fotoa');
      }
      if (!__dataItem__Model.xData.tags) {
        __dataItem__Model.xData.tags = [];
        console.log('__DataItem__sCtrl initxData xData.tags');
      }
    }

    function update__DataItem__() {

      console.log('__DataItem__CardCtrl __dataItem__Model: ', __dataItem__Model, __dataItem__Model.get('naam'));
      var __dataItem__Id = __dataItem__Model.get('Id');
      console.warn('__DataItem__CardCtrl __dataItem__Update __dataItem__Id: ', __dataItem__Id);
      /*  ###
      //removeIf(!fotos)
      dataFactoryFotos.getFotoSrc(fotoModel.get('gebruikerId'), fotoModel.get('fotoId'), fotoModel.get('extension')).then(function (result) {
        console.warn('FotoCardCtrl result: ', result);
        $scope.details.content = result.path;
        console.warn('FotoCardCtrl $scope.details.content: ', $scope.details.content);
      });
      //endRemoveIf(!fotos)
      ###  */
      //removeIf(!pois)
      $scope.details.trackNaam = '';
      dataFactoryTrack.syncDown().then(function () {
        console.log('TrackCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store, __dataItem__Id);
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === __dataItem__Model.get('trackId');
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          console.log('TrackCardCtrl trackNaam: ', $scope.details.trackNaam, dataFactoryTrack.store, trackModel);
        }
      });
      //endRemoveIf(!pois)
      /*  ###
      //removeIf(!fotos)
    
    
      $scope.details.trackNaam = '';
      dataFactoryTrack.syncDown().then(function () {
        console.log('TrackCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store, __dataItem__Id);
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === __dataItem__Model.get('trackId');
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          console.log('TrackCardCtrl trackNaam: ', $scope.details.trackNaam, dataFactoryTrack.store, trackModel);
        }
      });
      //endRemoveIf(!fotos)
      ###  */
      /*  ###
      //removeIf(!tracks)
      $scope.details.poisVolgen = trackSupModel.get('poisVolgen');
      $scope.details.fotosVolgen = trackSupModel.get('fotosVolgen');

      $scope.details.poisAantal = 0;
      $scope.details.fotosAantal = 0;
      $scope.details.poisAantal = trackModel.xData.pois.length;
      $scope.details.fotosAantal = trackModel.xData.fotos.length;
      //endRemoveIf(!tracks)
      ###  */
      updateLabels(__dataItem__Model);

      //
      if (mode !== 'bericht') {
        /*  ###
        //removeIf(!berichten)
  
        var groepenId = __dataItem__Model.get('groepenId');
        console.log('__DataItem__CardCtrl update__DataItem__ groepenId: ', groepenId);
  
        $scope.details.groep = '';
        __dataItem__Model.xData.groep = '';
        if (groepenId !== '') {
          $scope.details.groep = 'Iedereen';
          __dataItem__Model.xData.groep = 'Iedereen';
  
          var groep = loDash.find(dataFactoryGroepen.store, function (groep) {
            return groep.get('Id') === groepenId;
          });
          if (groep) {
            $scope.details.groep = groep.get('groep');
            __dataItem__Model.xData.groep = groep.get('groep');
            console.error('__DataItem__CardCtrl update__DataItem__ details.groep __dataItem__.xData.groep update: ', $scope.details.groep);
          }
        }
        //endRemoveIf(berichten)
        ###  */
      }

      var isBlacklisted = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('volgerId') === __dataItem__Model.get('gebruikerId');
      });
      $scope.details.volgt = true;
      if (isBlacklisted) {
        $scope.details.volgt = false;
      }

      $scope.details.__dataItem__Id = __dataItem__Id;
      $scope.details.tags = __dataItem__Model.xData.tags;
      sorteerDetailsTags();
      console.log('__DataItem__CardCtrl update__DataItem__ xData.tags: ', __dataItem__Model.xData.tags);

      $scope.details.groep = '';

      $scope.details.gebruikerId = __dataItem__Model.get('gebruikerId');
      $scope.details.profiel = __dataItem__Model.get('profiel');
      $scope.details.gebruikerNaam = __dataItem__Model.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }

      $scope.details.avatarColor = __dataItem__Model.get('avatarColor');
      $scope.details.avatarLetter = __dataItem__Model.get('avatarLetter');
      $scope.details.avatarInverse = __dataItem__Model.get('avatarInverse');

      $scope.details.createdOn = __dataItem__Model.get('createdOn');
      $scope.details.changedOn = __dataItem__Model.get('changedOn');


      $scope.details.star = __dataItem__SupModel.get('star');
      $scope.details.xprive = __dataItem__Model.get('xprive');

      if (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = __dataItem__SupModel.get('xnew');
      }

      $scope.details.naam = __dataItem__Model.get('naam');
      $scope.details.tekst = __dataItem__Model.get('tekst');
      var tmp2 = __dataItem__Model.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp2 + '</p>';

      $scope.details.lat = __dataItem__Model.get('lat');
      $scope.details.lng = __dataItem__Model.get('lng');

      var gelezen = +__dataItem__SupModel.get('gelezen');
      $scope.details.gelezen = gelezen;
      console.log('update__DataItem__Update gelezen: ', gelezen);

      console.log('__DataItem__CardCtrl update__DataItem__ updateReacties Clock');

      updateReacties(__dataItem__Model);

      dataFactoryClock.stopClock__DataItem__();
      $rootScope.$emit('startClock__DataItem__');
      $timeout(function () {
        console.log('__DataItem__CardCtrl update__DataItem__ updateReacties start Clock');

        dataFactoryClock.startClock__DataItem__CardFast(function () {
          console.log('__DataItem__CardCtrl update__DataItem__ syncDown controleren op gelezen en reacties');
          $scope.details.gelezen = +__dataItem__SupModel.get('gelezen');
          console.log('__DataItem__CardCtrl update__DataItem__ syncDown controleren op gelezen: ', +__dataItem__SupModel.get('gelezen'));
          updateReacties(__dataItem__Model);
        });
      }, 200);
    }

    function typingHelp(tmp) {

      if (!tmp.Id) {

        console.warn('__DataItem__CardCtrl HELP tmp: ', tmp);

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

        console.log('__DataItem__CardCtrl HELP tmp: ', tmp.modal);

        $scope.cardHelps.push(tmp);
      }
    }

    function showHelp() {
      console.warn('__DataItem__CardCtrl showHelp');

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

      /*  ###
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

        console.error('__DataItem__CradCtrl profielId, gebruikerId, ceo: ', ceo.profielId, $scope.details.gebruikerId, $scope.ceo.Id);

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
      ###  */
      /*  ###
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
          //removeIf(!tracks)
          pois,
          fotos,
          //endRemoveIf(!tracks)
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
        /*  ###
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

        console.error('__DataItem__CardCtrl kaartItemHelps $scope.cardHelps: ', $scope.cardHelps);
      }
      //endRemoveIf(berichten)
      ###  */
    }

    function remove__DataItem__FromStores(__dataItem__Id, backend) {

      console.warn('__DataItem__CardCtrl remove__DataItem__FromStores __dataItem__Id: ', __dataItem__Id);

      var __dataItem__Model = loDash.find(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.star, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.selected, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      var __dataItem__tags = __dataItem__Model.xData.tags;

      loDash.each(__dataItem__tags, function (__dataItem__tag) {
        var tagModel = __dataItem__tag.xData;

        if (tagModel) {

          $rootScope.$emit('__dataItem__RemoveLabel', {
            __dataItem__Model: __dataItem__Model,
            tagModel: tagModel
          });
        } else {
          console.error('__DataItem__CardCtrl remove__DataItem__FromStores tagModel NOT FOUND');
        }
      });

      loDash.remove(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
        return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id;
      });
      loDash.remove(dataFactory__DataItem__Tag.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id;
      });

      $rootScope.$emit('__dataItem__Delete', __dataItem__Model);

      loDash.remove(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
        return __dataItem__SupModel.get('__dataItem__Id') === __dataItem__Id;
      });
      loDash.remove(dataFactory__DataItem__Sup.data, function (dataItem) {
        return dataItem.record.get('__dataItem__Id') === __dataItem__Id;
      });

      loDash.remove(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });
      loDash.remove(dataFactory__DataItem__.data, function (dataItem) {
        return dataItem.record.get('Id') === __dataItem__Id;
      });

      if (backend) {
        __dataItem__Model.remove();
      }
    }

    $scope.delete__DataItem__ = function () {
      console.warn('__DataItem__CardCtrl delete__DataItem__');
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
              remove__DataItem__FromStores(__dataItem__Id, true);

              $rootScope.$on('__dataItem__sReload');
              $rootScope.$emit('__dataItem__sNieuweAantallen');
              $state.go('__dataItem__s.__dataItem__s');
            }
          }
        ]
      });
    };

    $scope.close__DataItem__Card = function (stay) {

      console.error('__DataItem__CardCtrl close__DataItem__Card isCardClosed: ', isCardClosed);

      dataFactoryClock.stopClock__DataItem__Card();

      if (!isCardClosed) {
        if (stay === undefined) {
          stay = true;
        }
        console.error('__DataItem__CardCtrl closePoiCard stay: ', stay);
        if (blacklisted) {
          remove__DataItem__FromStores(__dataItem__Id, false);

          $rootScope.$on('__dataItem__sReload');
          $rootScope.$emit('__dataItem__sNieuweAantallen');
          $state.go('__dataItem__s.__dataItem__s');
        } else {

          loDash.each($scope.details.reacties, function (reactieModel) {
            var reactieSupModel = loDash.find(dataFactory__DataItem__ReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieModel.get('Id');
            });
            if (reactieSupModel) {
              reactieSupModel.set('xnew', false);
              reactieSupModel.save();
            }
          });
          console.log('__DataItem__CardCtrl close__DataItem__Card reacties xnew reset in dataFactory__DataItem__ReactieSup.store');
          //
          // Verwijder status nieuw van __dataItem__ in model sup.
          //
          if (__dataItem__SupModel) {

            __dataItem__SupModel.set('gebruikerId', __dataItem__SupModel.get('gebruikerId'));
            __dataItem__SupModel.set('__dataItem__Id', __dataItem__SupModel.get('__dataItem__Id'));
            var gelezen = +__dataItem__SupModel.get('gelezen');

            console.log('__DataItem__CardCtrl close__DataItem__Card $scope.details.gelezen: ', $scope.details.gelezen);

            console.log('__DataItem__CardCtrl close__DataItem__Card gelezen __dataItem__SupModel oud: ', gelezen);
            var xread = +__dataItem__SupModel.get('xread') + 1;
            __dataItem__SupModel.set('xread', xread);
            console.log('__DataItem__CardCtrl close__DataItem__Card xread updated in __dataItem__SupModel: ', xread);

            $scope.details.gelezen = gelezen + xread;
            __dataItem__Model.xData.sup.set('gelezen', $scope.details.gelezen);
            console.log('__DataItem__CardCtrl close__DataItem__Card gelezen + xread updated as gelezen in __dataItem__SupModel: ', $scope.details.gelezen);

            __dataItem__SupModel.set('xnew', false);
            console.log('__DataItem__CardCtrl close__DataItem__Card xnew reset in __dataItem__SupModel');
            //
            // Verwijder __dataItem__ van lijst nieuw in store
            //
            loDash.remove(dataFactory__DataItem__.nieuw, function (__dataItem__NieuwModel) {
              return __dataItem__NieuwModel.get('Id') === __dataItem__Id;
            });

            __dataItem__SupModel.save().then(

              function (__dataItem__SupModel) {
                __dataItem__SupModel.set('xread', 0);
                var __dataItem__Nieuw = [];
                var __dataItem__ReactieNieuw = [];

                __dataItem__Nieuw = loDash.filter(dataFactory__DataItem__Sup.store, function (__dataItem__Sup) {
                  return __dataItem__Sup.get('xnew');
                });

                __dataItem__ReactieNieuw = loDash.filter(dataFactory__DataItem__ReactieSup.store, function (__dataItem__ReactieSup) {
                  return __dataItem__ReactieSup.get('xnew');
                });

                console.log('__DataItem__CardCtrl closed nieuwe __dataItem__, __dataItem__Reacties: ', __dataItem__Nieuw, __dataItem__ReactieNieuw);

                if (__dataItem__Nieuw.length > 0 || __dataItem__ReactieNieuw.length > 0) {
                  dataFactoryNotification.composeTitleBodyNotification(__dataItem__Nieuw.length, __dataItem__ReactieNieuw.length, '__dataItem__');
                  console.log('__DataItem__CardCtrl notification met __dataItem__Nieuw, __dataItem__ReactieNieuw: ', __dataItem__Nieuw, __dataItem__ReactieNieuw);
                }

                $rootScope.$emit('sleepClock__DataItem__');
              },
              function () {
                console.error('__dataItem__SupModel saved ERROR');
              }
            );
          }

          $rootScope.$emit('__dataItem__sNieuweAantallen');
          if (stay) {
            $state.go('__dataItem__s.__dataItem__s');
          }
        }
        isCardClosed = true;
      } else {
        console.warn('__DataItem__CardCtrl close__DataItem__Card SKIPPED!!!!!');
      }
    };

    $scope.clearSearchLabel = function () {
      console.warn('__DataItem__CardCtrl clearearchLabel');

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
      console.warn('__DataItem__CracCtrl closeTags');
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
    // Modal __DataItem__
    //
    $ionicModal.fromTemplateUrl(
      '__dataItem__Modal.html',
      function (modal__DataItem__) {
        $scope.modal__DataItem__ = modal__DataItem__;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModal__DataItem__ = function () {
      $scope.modal__DataItem__.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModal__DataItem__ = function () {
      $scope.modal__DataItem__.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal__DataItem__.remove();
      console.log('__DataItem__CardCtrl Modal__DataItem__ is removed!');
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
    // Modal __dataItem__
    //
    $ionicModal.fromTemplateUrl(
      '__dataItem__Modal.html',
      function (modal__DataItem__) {
        $scope.modal__DataItem__ = modal__DataItem__;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModal__DataItem__ = function () {
      $scope.modal__DataItem__.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModal__DataItem__ = function () {
      $scope.modal__DataItem__.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal__DataItem__.remove();
      console.log('__DataItem__CardCtrl Modal__DataItem__ is removed!');
    });

    $scope.closeGroepen = function ($event) {
      console.log('__DataItem__CardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepenModal();
      } else {
        $scope.closeGroepenPopover($event);
      }
    };

    $scope.openGroepen = function ($event) {
      console.log('__DataItem__CardCtrl openGroepen $event: ', $event);
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
      console.log('__DataItem__CardCtrl openGroepenModal');
      $scope.groepenModal.show();
    };

    $scope.closeGroepenModal = function () {
      console.log('__DataItem__CardCtrl closeGroepenModal');
      $scope.groepenModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepenModal.remove();
      console.log('__DataItem__CardCtrl groepenModal is removed!');
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
      console.log('__DataItem__CardCtrl openGroepenPopover');
      $scope.groepenPopover.show($event);
    };

    $scope.closeGroepenPopover = function () {
      console.log('__DataItem__CardCtrl closeGroepenPopover');
      $scope.groepenPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepenPopover.remove();
    });

    $scope.closeGroepDeelnemers = function () {
      console.log('__DataItem__CardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepDeelnemersModal();
      } else {
        $scope.closeGroepDeelnemersPopover();
      }
    };

    $scope.openGroepDeelnemers = function ($event) {
      console.log('__DataItem__CardCtrl openGroepen $event: ', $event);
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
      console.log('__DataItem__CardCtrl openGroepDeelnemersModal');
      $scope.groepDeelnemersModal.show();
    };

    $scope.closeGroepDeelnemersModal = function () {
      console.log('__DataItem__CardCtrl closeGroepDeelnemersModal');
      $scope.groepDeelnemersModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersModal.remove();
      console.log('__DataItem__CardCtrl groepDeelnemersModal is removed!');
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
      console.log('__DataItem__CardCtrl openGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.show($event);
    };

    $scope.closeGroepDeelnemersPopover = function () {
      console.log('__DataItem__CardCtrl closeGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersPopover.remove();
    });
    //
    // Popover helpPopoverCard
    //
    $scope.openHelp = function ($event) {
      console.log('__DataItem__CardCtrl openHelp');
      showHelp();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      console.log('__DataItem__CardCtrl openHelp');
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
      console.log('__DataItem__CardCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      console.log('__DataItem__CardCtrl openHelpPopover');
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
      console.log('__DataItem__CardCtrl closeHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModalCard = function () {
      console.log('__DataItem__CardCtrl closeHelpModal');
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
      console.log('__DataItem__CardCtrl setReactieNavTitle: ' + title);
      $ionicNavBarDelegate.title(title);
    };

    function init() {
      dataFactory__DataItem__Sup.store = loDash.uniqBy(dataFactory__DataItem__Sup.store, function (__dataItem__Sup) {
        return __dataItem__Sup.get('__dataItem__Id');
      });
      console.warn('__DataItem__CardCtrl init __DataItem__Store: ', dataFactory__DataItem__.store);
      console.warn('__DataItem__CardCtrl init __DataItem__SupStore: ', dataFactory__DataItem__Sup.store);
      __dataItem__Model = loDash.find(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.get('Id') === __dataItem__Id;
      });

      console.warn('__DataItem__CardCtrl init __dataItem__Model: ', __dataItem__Model, __dataItem__Model.get('naam'));

      if (__dataItem__Model) {
        __dataItem__SupModel = loDash.find(dataFactory__DataItem__Sup.store, function (__dataItem__SupModel) {
          return __dataItem__SupModel.get('__dataItem__Id') === __dataItem__Id;
        });
        //
        // Indien geen sup dan nieuwe aanmaken
        //
        if (!__dataItem__SupModel) {
          __dataItem__SupModel = new dataFactory__DataItem__Sup.Model();
          __dataItem__SupModel.set('xnew', true);
          __dataItem__SupModel.set('star', false);
          //__dataItem__SupModel.set('__dataItem__Id', __dataItem__Id);
          __dataItem__SupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          console.error('__DataItem__CardCtrl init __dataItem__SupModel: ', __dataItem__SupModel.get('__dataItem__Id'));
          __dataItem__SupModel.save().then(function () {
            __dataItem__Model.xData.sup = __dataItem__SupModel;
            var xnew = __dataItem__Model.xData.sup.get('xnew');

            if (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
              var nieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (nieuwModel) {
                return nieuwModel.get('Id') === __dataItem__Id;
              });
              if (!nieuwModel) {
                dataFactory__DataItem__.nieuw.push(__dataItem__Model, __dataItem__Model.get('naam'));
              }
            }
            console.log('__DataItem__CardCtrl init met nieuw supModel');
          });
        } else {
          console.log('__DataItem__CardCtrl init bestaand supModel: ', __dataItem__SupModel);

          initxData(__dataItem__Model);

          __dataItem__Model.xData.sup = __dataItem__SupModel;
          console.log('__dataItem__Model.xData.sup: ', __dataItem__Model.xData.sup);

          var xnew = __dataItem__Model.xData.sup.get('xnew');

          if (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
            var nieuwModel = loDash.find(dataFactory__DataItem__.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === __dataItem__Id;
            });
            if (!nieuwModel) {
              dataFactory__DataItem__.nieuw.push(__dataItem__Model);
            }
          }
        }
        update__DataItem__(__dataItem__Model, __dataItem__Model.get('naam'));
      } else {
        console.warn('__DataItem__CardCtrl findRecord ERROR Id: ', __dataItem__Id);

        $ionicPopup.confirm({
          title: 'Locatie',
          content:
            'Deze Locatie is niet meer beschikbaar!<br>De eigenaar heeft deze Locatie waarschijnlijk verwijderd.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $state.go('__dataItem__s.__dataItem__s');
              }
            }
          ]
        });
      }
    }
  }
]);
