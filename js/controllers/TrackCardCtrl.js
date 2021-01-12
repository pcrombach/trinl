/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('TrackCardCtrl', ['loDash', '$timeout', '$rootScope', '$q', '$scope', '$stateParams', '$state', '$ionicPopup', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'dataFactoryCeo', 'dataFactoryHelp', 'dataFactoryNotification', 'dataFactoryClock', 'dataFactoryTrackReactie', 'dataFactoryTrackReactieSup', 'dataFactoryTrack', 'dataFactoryTrackSup', 'dataFactoryTrackTag', 'dataFactoryTag',
  
  
  
  
  
  //removeIf(!tracks)
  //'dataFactoryTrackPoisFotos',
  //endRemoveIf(!tracks)
  
  'dataFactoryBlacklist', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers',
  function (loDash, $timeout, $rootScope, $q, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, $ionicListDelegate, dataFactoryCeo, dataFactoryHelp, dataFactoryNotification, dataFactoryClock, dataFactoryTrackReactie, dataFactoryTrackReactieSup, dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryTag,
    
    
    
    
    
    //removeIf(!tracks)
    //dataFactoryTrackPoisFotos,
    //endRemoveIf(!tracks)
    
    dataFactoryBlacklist, dataFactoryGroepen, dataFactoryGroepdeelnemers
  ) {

    var isCardClosed = false;

    var ceo = {};
    ceo.Id = localStorage.getItem('authentication_id');
    ceo.profielId = localStorage.getItem('authentication_profielId');
    console.error('TrackCardCtrl ceo.Id: ', ceo.Id);
    console.error('TrackCardCtrl ceo.profielId: ', +ceo.profielId);

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
    $scope.details.mode = 'track';
    var mode = 'track';


    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'fotos/small_non_existing_id.png';

    var blacklisted = false;
    var isCardClosed = false;

    var trackId = $stateParams.Id;
    var trackModel;
    var trackSupModel;
    var oldInputNaam;
    var oldInputTekst;
    // eslint-disable-next-line no-unused-vars
    //
    var event0a = $scope.$on('$ionicView.beforeEnter', function () {
      console.warn('TrackCardCtrl $ionicView.beforeEnter');
      init();
    });
    $scope.$on('$destroy', event0a);

    var event0z = $scope.$on('$ionicView.afterEnter', function () {
      console.warn('TrackCardCtrl $ionicView.afterEnter');
      isCardClosed = false;
    });
    $scope.$on('$destroy', event0z);

    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      console.warn('TrackCardCtrl $ionicView.beforeLeave');
      //$timeout(function () {
      $scope.closeTrackCard(false);
      //}, 100);
    });
    $scope.$on('$destroy', event0b);
    //
    var event1 = $rootScope.$on('labelsTrackUpdate', function (event, args) {
      var trackModel = args.trackModel;
      console.warn('TrackCardCtrl on.labelsTrackUpdate trackModel: ', trackModel, trackModel.get('naam'));
      updateLabels(trackModel);
    });
    $scope.$on('$destroy', event1);
    //
    var event7 = $rootScope.$on('trackVerwijderd', function (event, args) {
      var trackModel = args.trackModel;
      if (trackModel.get('Id') === trackId) {
        $ionicPopup.confirm({
          title: 'Verwijder Spoor',
          content: 'Deze Spoor is zojuist door de eigenaar verwijderd.<br><br>Deze Spoor wordt gesloten',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('tracks.tracks');
            }
          }]
        });
      }
    });
    $scope.$on('$destroy', event7);
    //
    $scope.infoTag = function (tagModel) {

      console.log('TrackCardCtrl tagModel: ', tagModel);

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
      console.warn('TrackCardCtrl editTag: ', tag, tagModel);

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

        console.log('TracksSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          console.log('TracksSideMenuCtrl editTag trackModel tags: ', tag, trackModel && trackModel.xData.tags);

          $rootScope.$emit('trackRemoveLabel', {
            trackModel: trackModel,
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

            $rootScope.$emit('trackAddLabel', {
              trackModel: trackModel,
              tagModel: tagModel
            });

            $rootScope.$emit('tracksFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });

          });
        }
      });
    };

    $scope.deleteTag = function (tagModel) {
      var tag = tagModel.get('tag');
      console.warn('TrackCardCtrl editTag: ', tag);

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

            loDash.each(dataFactoryTrack.store, function (trackModel) {
              console.log('TracksSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, trackModel);
              loDash.each(trackModel.xData.tags, function (trackTagModel) {
                console.log('TracksSideMenuCtrl deleteTag trackModal.tags loop: ', trackModel.xData.tags, trackTagModel);
                (function (trackTagModel) {
                  if (trackTagModel.xData.get('tag') === tag) {
                    console.log('TracksSideMenuCtrl deleteTag trackTagModel in trackModel.tags wordt verwijderd uit backend: ', trackTagModel);
                    trackTagModel.remove().then(function () {
                      console.log('TracksSideMenuCtrl deleteTag trackTagModel wordt verwijderd uit trackModel.tags: ', trackTagModel);
                      loDash.remove(trackModel.xData.tags, function (trackTagModel) {
                        return trackTagModel.xData.get('tag') === tag;
                      });
                    });
                    $rootScope.$emit('trackRemoveLabel', {
                      trackModel: trackModel,
                      tagModel: tagModel
                    });
                  }
                })(trackTagModel);
              });
            });

            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            console.log('TracksSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle tracktags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              console.log('TracksSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.tracksFilterAlle();
          }
        }]
      });
    };


    function sorteerGlobalTags() {

      console.error('trackCardCtrl sorteerGlobalTags');
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

      console.error('TrackCardCtrl sorteerDetailsTags');
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

    function tracksCheckTrackReactieAantal(reacties) {
      console.warn('TracksCtrl tracksCheckTrackReactieOud, reacties: ', reacties);

      var maxAantal = 50;

      var verwijderingen = 0;

      var q = $q.defer();

      var teller = 0;
      loDash.each(reacties, function (reactieModel) {
        console.log('TracksCtrl tracksCheckTrackReactieAantal reactieModel: ', reactieModel);
        teller += 1;
        if (teller > maxAantal) {

          verwijderingen += 1;

          var reactieId = reactieModel.get('Id');

          reactieModel.remove();
          loDash.remove(dataFactoryTrackReactie.store, function (reactieModel) {
            return reactieModel.get('Id') === reactieId;
          });
          loDash.remove(dataFactoryTrackReactie.data, function (dataItem) {
            return dataItem.record.get('Id') === reactieId;
          });
          var reactieSupModel = loDash.find(dataFactoryTrackReactieSup.store, function (reactieSupModel) {
            return reactieSupModel.get('reactieId') === reactieId;
          });
          if (reactieSupModel) {
            reactieSupModel.remove();
            loDash.remove(dataFactoryTrackReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            loDash.remove(dataFactoryTrackReactieSup.data, function (dataItem) {
              return dataItem.record.get('reactieId') === reactieId;
            });
          }
          console.error('TracksCtrl tracksCheckTrackReactieAantal reactie removed SUCCESS');
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

    function tracksCheckTrackReactieOud(reacties) {

      console.warn('TracksCtrl tracksCheckTrackReactieOud, reacties: ', reacties);

      var aantalOuder = 7;
      var formatOuder = 'days';

      var q = $q.defer();
      var tooOld = moment().subtract(aantalOuder, formatOuder).format('YYYY-MM-DD HH:mm:ss');
      var verwijderingen = false;
      console.log('TracksCtrl tracksCheckTrackReactieOud: ', tooOld);
      //
      //  Ouder dan 
      //
      loDash.each(reacties, function (reactieModel) {
        if (reactieModel) {
          console.log('TracksCtrl tracksCheckTrackReactieOud reactieModel: ', reactieModel);
          var datum = reactieModel.get('changedOn');
          var reactieId = reactieModel.get('Id');
          if (datum < tooOld) {
            verwijderingen += 1;
            console.log('TracksCtrl tracksCheckTrackReactieOud changedOn, trackId, tooOld: ', datum, trackId, tooOld);

            reactieModel.remove();
            loDash.remove(dataFactoryTrackReactie.store, function (reactieModel) {
              return reactieModel.get('Id') === reactieId;
            });
            loDash.remove(dataFactoryTrackReactie.data, function (dataItem) {
              return dataItem.record.get('Id') === reactieId;
            });
            var reactieSupModel = loDash.find(dataFactoryTrackReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieId;
            });
            if (reactieSupModel) {
              reactieSupModel.remove();
              loDash.remove(dataFactoryTrackReactieSup.store, function (reactieSupModel) {
                return reactieSupModel.get('reactieId') === reactieId;
              });
              loDash.remove(dataFactoryTrackReactieSup.data, function (dataItem) {
                return dataItem.record.get('reactieId') === reactieId;
              });
            }
            $rootScope.$emit('filter');
            $rootScope.$emit('tracksNieuweAantallen');
            console.error('TracksCtrl tracksCheckTrackReactieOud reactie removed SUCCESS');
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

    function updateReacties(trackModel) {
      console.log('TracksCtrl updateReacties voor track naam Id: ', trackModel.get('Id'), trackModel.get('naam'));
      var trackId = trackModel.get('Id');

      console.log('TracksCtrl updateReacties dataFactoryTrackReactie.store: ', dataFactoryTrackReactie.store);

      var trackReacties = loDash.filter(dataFactoryTrackReactie.store, function (trackReactieModel) {
        return trackReactieModel.get('trackId') === trackId;
      });
      //
      $scope.details.reacties = loDash.orderBy(trackReacties, 'createdOn.value', 'desc');
      tracksCheckTrackReactieAantal(trackReacties).then(function () {
        tracksCheckTrackReactieOud(trackReacties).then(function () {
        });
      });
      console.warn('TrackCardCtrl loadReactie track in store, aantal: ', dataFactoryTrack.store.length);
      console.warn('TrackCardCtrl loadReactie reacties in store, aantal: ', trackReacties.length);
      $scope.details.reactiesAantal = trackReacties.length;
    }

    $scope.reactie = function () {
      console.warn('TrackCardCtrl reactie');

      $scope.input = {};
      $scope.input.naam = '';
      $scope.input.tekst = '';
      $scope.initTrack = 'Reactie';

      $scope.openModalReactie();
    };

    $scope.saveReactie = function (input) {

      console.warn('TrackCardCtrl saveReactie input trackId: ', input, trackId);

      if ($scope.initTrack === 'Reactie') {

        $scope.details.reactiesAantal += 1;

        var reactieModel = new dataFactoryTrackReactie.Model();

        var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
        tmp = tmp.replace(/\\"/g, '"');
        var htmlreactietekst = '<p>' + tmp + '</p>';
        tmp = false;
        console.error('TrackCardCtrl saveReactie: ', htmlreactietekst);
        reactieModel.set('reactie', htmlreactietekst);
        reactieModel.set('trackId', trackId);
        reactieModel.set('trackGebruikerId', trackModel.get('gebruikerId'));
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
          var reactieSupModel = new dataFactoryTrackReactieSup.Model();
          reactieSupModel.set('trackId', trackId);
          reactieSupModel.set('reactieId', reactieId);
          reactieSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          reactieSupModel.set('xnew', false);
          reactieSupModel.save().then(function (reactieSupModel) {
            console.error('TrackCardCtrl saveReactie reactieSupModel: ', reactieSupModel);
            reactieModel.xData = {
              sup: reactieSupModel
            };
          });
          trackSupModel.set('trackId', trackId);
          trackSupModel.save().then(function () {
            console.error('TrackCardCtrl saveReactie trackSupModel: ', trackSupModel);
          });
          $scope.details.reacties.splice(0, 0, reactieModel);
        });
        $scope.closeModalReactie();
      }
    };

    $scope.saveTrackItemTekst = function (input) {
      console.warn('TrackCardCtrl saveTrackTekst: ', $scope.details);
      console.warn('TrackCardCtrl saveTrackTekst: ', input);
      console.error('TrackCardCtrl size message: ', input.naam.length + input.tekst.length);

      $scope.details.naam = input.naam;
      $scope.details.tekst = input.tekst;
      var tmp = input.tekst.replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      tmp = false;
      if (input.naam !== oldInputNaam) {
        trackModel.set('naam', input.naam.substr(0, 7500));
        $scope.details.naam = input.naam.substr(0, 7500);
        tmp = true;
      }
      if (input.tekst !== oldInputTekst) {
        trackModel.set('tekst', input.tekst.substr(0, 7500));
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
        trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
        trackModel.save();
        $rootScope.$emit('trackUpdate', trackModel);
      }

      $scope.closeModalTrack();
    };

    $scope.openTrackTekst = function () {
      console.warn('TrackCardCtrl openTrackTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalTrack();
    };

    function updateLabels(trackModel) {
      console.log('TrackCardCtrl updateLabels trackModel, trackId: ', trackModel, trackId, trackModel.get('naam'));
      if (trackModel.get('Id') === trackId) {
        console.log('TrackCardCtrl updateLabels trackModel: ', trackModel.get('naam'), trackModel.get('Id'));
        //
        // Indien labels worden toegevoegd dan worden die toegevoegd in de dataFactoryTrackTag store en data
        // De label moet ook toegevoegd worden aan de trackModel.xData.tags
        initxData(trackModel);
        $scope.details.tags = trackModel.xData.tags;
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
      console.warn('TrackCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          if (trackModel.get('xprive')) {
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
            console.log('TrackCardCtrl addNieuweLabel tag: ', tagModel);
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

      console.warn('TrackCardCtrl selectLabelClick tagModel: ', tagModel);
      console.warn('TrackCardCtrl selectLabelClick trackId: ', trackId);
      console.warn('TrackCardCtrl selectLabelClick tagId: ', tagModel.get('Id'));
      //
      //  Kijk of de tracktag reeds bestaat
      //
      var found = loDash.find(dataFactoryTrackTag.store, function (trackTagModel) {
        return trackTagModel.get('trackId') === trackId && trackTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var trackTagModel = new dataFactoryTrackTag.Model();
        trackTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        trackTagModel.set('trackId', trackId);
        trackTagModel.set('tagId', tagId);
        trackTagModel.set('xprive', true);
        trackTagModel.set('yprive', false);

        console.error('TrackCardCtrl newLabel groepenId: ', trackModel.get('groepenId'));
        var groepenId = trackModel.get('groepenId');
        if (groepenId === '' || groepenId === 'Iedereen') {
          if (tagId.length <= 3) {
            trackTagModel.set('yprive', true);
            trackTagModel.set('xprive', false);
            console.log('TrackCardCtrl publiceren PUBLIC tagId', trackTagModel.get('tagId'));
          }
        } else {
          trackTagModel.set('yprive', true);
          trackTagModel.set('xprive', false);
          console.log('TrackCardCtrl publiceren made PUBLIC tagId', trackTagModel.get('tagId'));
          //
          tagModel.set('yprive', true);
          tagModel.set('xprive', false);
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return ((tagModel.get('Id').length < 3 && tagModel.get('gebruikerId') === '') || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id'));
            });
            sorteerGlobalTags();
          });
          console.log('TrackCardCtrl publiceren made PUBLIC tag, naam', tagModel.get('tag'));
        }
        trackTagModel.save().then(function () {

          trackTagModel.xData = tagModel;
          trackModel.xData.tags.push(trackTagModel);
          $scope.details.tags = trackModel.xData.tags;
          sorteerDetailsTags();
          $rootScope.$emit('trackAddLabel', {
            trackModel: trackModel,
            tagModel: tagModel
          });
        });
        $scope.closeTags();
      } else {
        $ionicPopup.confirm({
          title: 'Toevoegen label',
          content: 'Dit label is reeds toegevoegd aan deze Spoor.',
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
        'Selecteer een label in onderstaande lijst. Indien deze te lang is kun je door middel van zoeken het aantal labels verkleinen. Voer daarvoor de zoektekst in, in het zoekvenster. De lijst toont dan alle labels waarin deze tekst voorkomt. Als je het label gevonden hebt, selecteer het in de lijst, het label wordt dan toegevoegd aan de Spoor.';
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover($event);
      }
    };

    $scope.toevoegenTagHelp = function () {
      $scope.helpTitel = 'Label toevoegen';
      $scope.helpContent =
        'Wanneer de tekst niet te vinden is door middel van het zoekvenster verschijnt rechtsboven de tekst ‘+ Voeg toe’. Klik hier om de getypte tekst uit het zoekvenster als label toe te voegen aan de lijst. Het label wordt tevens toegevoegd aan de gekozen Spoor.';

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpModal();
        //$scope.openGlobalHelpPopover($event);
      }
    };

    $scope.addTagToTrack = function ($event) {
      console.warn('TrackCardCtrl addTagToTrack');

      $scope.clearSearchLabel($event);
      $scope.openTags($event);
    };

    $scope.deleteLabelTag = function (trackTagModel) {
      console.warn('TrackCardCtrl deleteLabelTag trackModel: ', trackModel, trackModel.get('naam'), );
      console.warn('TrackCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('TrackCardCtrl deleteLabelTag trackTagModel: ', trackTagModel);
      console.warn('TrackCardCtrl deleteLabelTag tagModel: ', trackTagModel.xData);
      var tagModel = trackTagModel.xData;
      console.warn('TrackCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      console.warn('TrackCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));
      console.warn('TrackCardCtrl deleteLabelTag $scope.details.tags: ', $scope.details.tags);
      console.warn('TrackCardCtrl deleteLabelTag trackModel.xdata.tags: ', trackModel.xData.tags);

      var trackTagId = trackTagModel.get('Id');

      trackTagModel.remove().then(function () {

        trackTagModel.xData = tagModel;
        $rootScope.$emit('trackRemoveLabel', {
          trackModel: trackModel,
          tagModel: tagModel
        });

        loDash.remove($scope.details.tags, function (trackTagModel) {
          return trackTagModel.get('Id') === trackTagId;
        });
        sorteerDetailsTags();
        loDash.remove(trackModel.xData.tags, function (trackTagModel) {
          return trackTagModel.get('Id') === trackTagId;
        });

      });
    };

    $scope.selecteerTrack = function () {
      console.log('TracksCtrl selecteerTrack: ', trackModel);

      $rootScope.$emit('trackSelected', trackModel);
      $state.go('app.kaart');
    };

    $scope.clickedAvatar = function (details) {
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      console.warn('TrackCardCtrl clickedAvatar naam: ', details.gebruikerNaam);
      console.error(details.gebruikerId, $scope.ceo.Id, details.xprive);

      if (details.gebruikerId == $scope.ceo.Id) {
        var content =
          'Je bent de eigenaar van deze Spoor.<br><br>Tik op verwijder om deze Spoor te verwijderen.';
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
            'Je wil geen Sporen meer ontvangen van<br><br><span class="trinl-rood">' +
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

                console.warn('TrackCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

                if (found) {
                  console.warn('TrackCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

                  $scope.details.volgt = true;

                  found.set('Id', found.get('Id'));
                  found.set('gebruikerId', $scope.ceo.Id);
                  found.set('type', 'trackgebruikers');
                  found.set('blackId', gebruikerId);
                  found.set('reden', 'avatar');
                  found.remove();
                  removed = false;
                } else {
                  $scope.details.volgt = false;

                  var blacklistModel = new dataFactoryBlacklist.Model();
                  blacklistModel.set('gebruikerId', $scope.ceo.Id);
                  blacklistModel.set('type', 'trackgebruikers');
                  blacklistModel.set('blackId', gebruikerId);
                  blacklistModel.set('eigenaar', gebruikerId);
                  blacklistModel.set('naam', naam);
                  blacklistModel.set('reden', 'avatar');
                  blacklistModel.save();
                  removed = true;

                  console.warn('TrackCardCtrl updateVolgt blacklistStore blacklistModel niet gevonden aangemaakt en saved: ', blacklistModel);
                }

                if (removed) {
                  loDash.remove(dataFactoryTrack.star, function (starModel) {
                    return starModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryTrack.nieuw, function (nieuwModel) {
                    return nieuwModel.get('gebruikerId') === gebruikerId;
                  });

                  loDash.remove(dataFactoryTrack.selected, function (
                    selectedModel
                  ) {
                    return selectedModel.get('gebruikerId') === gebruikerId;
                  });
                  $rootScope.$emit('trackDelete', details.gebruikerId);
                }
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                //
                //  De items van de geblokkerde gebruiker verwijderen
                //
                var itemsToRemove = loDash.filter(dataFactoryTrack.store, function (trackModel) {
                  return trackModel.get('gebruikerId') === gebruikerId;
                });
                console.log('TrackCardCtrl trackItems removing from Store.....: ', itemsToRemove);

                loDash.each(itemsToRemove, function (trackModel) {
                  var trackId = trackModel.get('Id');

                  removeTrackFromStores(trackId, false);
                });

                $rootScope.$on('tracksReload');
                $rootScope.$emit('tracksNieuweAantallen');
                $state.go('tracks.tracks');
              }
            }
          ]
        });
      }
    };

    $scope.updateVolgt = function () {
      console.warn('TrackCardCtrl updateVolgt: ', trackModel, trackModel.get('naam'));

      $scope.details.volgt = false;

      blacklisted = false;

      var found = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('blackId') === trackModel.get('Id');
      });

      console.warn('TrackCardCtrl updateVolgt blacklistStore: ', dataFactoryBlacklist.store);

      if (found) {
        console.warn('TrackCardCtrl updateVolgt blacklistStore blacklistModel gevonden: ', found);

        removeTrackFromStores(trackModel.get('Id'), false);

        $scope.details.volgt = true;

        found.set('Id', found.get('Id'));
        found.set('gebruikerId', $scope.ceo.Id);
        found.set('type', 'track');
        found.set('blackId', trackModel.get('Id'));
        found.set('reden', 'pinned');
        found.remove();
        blacklisted = false;
      } else {
        $scope.details.volgt = false;

        var blacklistModel = new dataFactoryBlacklist.Model();
        blacklistModel.set('gebruikerId', $scope.ceo.Id);
        blacklistModel.set('type', 'track');
        blacklistModel.set('blackId', trackModel.get('Id'));
        blacklistModel.set('eigenaar', trackModel.get('gebruikerId'));
        blacklistModel.set('naam', trackModel.get('naam'));
        blacklistModel.set('reden', 'pinned');
        blacklistModel.save();
        blacklisted = true;
      }
    };

    $scope.updateStar = function () {
      console.warn('TrackCardCtrl updateStar in: ', trackSupModel);

      $scope.details.star = trackSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        trackModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryTrack.star, function (trackModel) {
          return trackModel.get('Id') === trackId;
        });
        trackSupModel.set('star', $scope.details.star);
        console.warn('TrackCardCtrl updateStar trackSupModel: ', trackSupModel.get('trackId'));
        trackSupModel.save();
        console.warn('TrackCardCtrl updateStar: ', trackSupModel, trackModel.xData.sup.xnew.value);
      } else {
        $scope.details.star = true;
        trackModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryTrack.star, function (trackStarModel) {
          return trackStarModel.get('Id') === trackId;
        });
        if (!found) {
          dataFactoryTrack.star.push(trackModel);
        }
        trackSupModel.set('star', $scope.details.star);
        //trackSupModel.set('trackId', trackId);
        console.warn('TrackCardCtrl updateStar trackSupModel: ', trackSupModel.get('trackId'));
        trackSupModel.save();
        console.warn('TrackCardCtrl updateStar: ', trackSupModel, trackModel.xData.sup.xnew.value);
      }
      $rootScope.$emit('tracksNieuweAantallen');
    };

    $scope.selectGroep = function (groep) {
      console.warn('TrackCardCtrl selectGroep: ', groep, groep.groep, groep.groepenId);
      $scope.details.groep = groep.groep;
      trackModel.set('groepenId', groep.groepenId);
      $scope.details.xprive = false;
      trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
      trackModel.set('yprive', true);
      trackModel.set('xprive', false);
      trackModel.save();
      //
      //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
      //  Standaard labels zijn altijd public. Dus niet publiceren.
      //  Andere Tags en tracktags ook prive/public maken
      //
      console.log('TrackCardCtrl selectGroeptracktags, tags van naam: ', trackModel.get('naam'));
      //
      loDash.each(dataFactoryTrackTag.store, function (trackTagModel) {
        //
        if (trackTagModel.get('trackId') === trackId) {
          //
          var tagId = trackTagModel.get('tagId');
          //
          trackTagModel.set('yprive', true);
          trackTagModel.set('xprive', true);
          console.log('TrackCardCtrl selectGroep made PRIVATE tagId', trackTagModel.get('tagId'));

          var groepenId = trackModel.get('groepenId');
          if (groepenId === '' || groepenId === 'Iedereen') {

            if (tagId.length <= 3) {
              trackTagModel.set('yprive', true);
              trackTagModel.set('xprive', false);
              console.log('TrackCardCtrl selectGroep PUBLIC tagId', trackTagModel.get('tagId'));
            }
          } else {
            trackTagModel.set('yprive', true);
            trackTagModel.set('xprive', false);
            console.log('TrackCardCtrl selectGroep made PUBLIC tagId', trackTagModel.get('tagId'));
            //
            var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
            });
            if (tag) {
              tag.set('yprive', true);
              tag.set('xprive', false);
              tag.save();
              console.log('TrackCardCtrl selectGroep made PUBLIC tag, naam', tag.get('tag'));
            }
          }
          trackTagModel.save();
        }
      });
      $scope.closeGroepen();
    };

    $scope.openDeelnemers = function (groepy, $event) {
      console.warn('TrackCardCtrl openDeelnemersGroep: ', groepy);

      $scope.deelnemers = loDash.filter(dataFactoryGroepdeelnemers.store, function (groep) {
        return groep.get('groep') === groepy;
      });
      console.warn('TrackCardCtrl openDeelnemersGroep: ', $scope.deelnemers);
      $scope.openGroepDeelnemers($event);
    };

    function showGroepen($event) {
      console.warn('TrackCardCtrl showGroepen: ', $event);
      console.warn('TrackCardCtrl showGroepen groepen: ', dataFactoryGroepen.store, dataFactoryGroepen.store.length);
      console.warn('TrackCardCtrl showGroepdeelnemers: ', dataFactoryGroepdeelnemers.store, dataFactoryGroepdeelnemers.store.length);

      $scope.groepen = [];
      $scope.deelnemers = [];
      var tmp;

      tmp = loDash.filter(dataFactoryGroepdeelnemers.store, function (groepdeelnemerModel) {
        return ((groepdeelnemerModel.get('deelnemerId') === dataFactoryCeo.currentModel.get('Id') && groepdeelnemerModel.get('publicist') === true) || groepdeelnemerModel.get('groep') === 'Iedereen');
      });
      console.warn('TrackCardCtrl showGroepen tmp: ', tmp, tmp.length);
      loDash.each(tmp, function (groep) {
        tmp = loDash.mapValues(groep, 'value');
        $scope.deelnemers.push(tmp);
      });
      console.warn('TrackCardCtrl showGroepen $scope.deelnemers: ', $scope.deelnemers);

      $scope.groepen = loDash.uniqBy($scope.deelnemers, 'groep');
      console.warn('TrackCardCtrl showGroepen $scope.groepen: ', $scope.groepen);

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
      if (trackModel.get('gebruikerId') === $scope.ceo.Id) {
        $scope.details.xprive = trackModel.get('xprive');
        if ($scope.details.xprive) {
          if ($scope.details.groep == '') {
            showGroepen($event);
          } else {
            $scope.details.xprive = false;
            //
            var groepenId = trackModel.get('groepenId');
            $scope.details.groep = '';
            trackModel.xData.groep = '';
            if (groepenId !== '') {
              $scope.details.groep = 'Iedereen';
              trackModel.xData.groep = 'Iedereen';

              var found = loDash.find(dataFactoryGroepen.store, function (groep) {
                return groep.get('Id') === groepenId;
              });
              if (found) {
                $scope.details.groep = found.get('groep');
                trackModel.xData.groep = found.get('groep');
                console.error('TrackCardCtrl updateXprive details.groep track.xData.groep set: ', $scope.details.groep);
              }
            }
            //
            trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
            trackModel.set('yprive', true);
            trackModel.set('xprive', false);
            trackModel.save();
            //
            //  Indien groep = '' of groep = 'Iedereen' dan alleen standaard labels => Id < '100'
            //  Standaard labels zijn altijd public. Dus niet publiceren.
            //  Andere Tags en tracktags ook prive/public maken
            //
            console.log('TrackCardCtrl updateXprive tracktags, tags van naam: ', trackModel.get('naam'));
            //
            loDash.each(dataFactoryTrackTag.store, function (trackTagModel) {

              if (trackTagModel.get('trackId') === trackId) {
                //
                //
                var tagId = trackTagModel.get('tagId');
                console.log('TrackCardCtrl updateXprive tagId: ', tagId);
                //
                var groepenId = trackModel.get('groepenId');
                if (groepenId === '' || groepenId === 'Iedereen') {

                  if (tagId.length <= 3) {
                    trackTagModel.set('yprive', true);
                    trackTagModel.set('xprive', false);
                    trackTagModel.save();
                    console.log('TrackCardCtrl updateXprive gepubliceerd tagId', trackTagModel.get('tagId'));
                  }
                } else {
                  trackTagModel.set('yprive', true);
                  trackTagModel.set('xprive', false);
                  trackTagModel.save();
                  console.log('TrackCardCtrl updateXprive gepubliceerd tagId', trackTagModel.get('tagId'));
                  var tag = loDash.find(dataFactoryTag.store, function (tagModel) {
                    return tagModel.get('Id') === tagId && tagModel.get('gebruikerId') !== '';
                  });
                  if (tag) {
                    tag.set('yprive', true);
                    tag.set('xprive', false);
                    tag.save();
                    console.log('TrackCardCtrl updateXprive gepubliceerd tag, naam', tag.get('tag'));
                  }
                }
              }
            });
          }
        } else {
          $scope.details.xprive = true;
          //
          trackModel.set('groepenId', '');
          trackModel.save();
          //
          $scope.details.groep = '';
          trackModel.xData.groep = '';
          console.error('TrackCardCtrl updateXprive details.groep track.xData.groep reset: ', $scope.details.groep);

          trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
          trackModel.set('yprive', true);
          trackModel.set('xprive', true);
          trackModel.save();
          //
          // Labels en tags ook prive/public maken
          //
          loDash.each(dataFactoryTrackTag.store, function (trackTagModel) {
            if (trackTagModel.get('trackId') === trackId) {
              trackTagModel.set('yprive', true);
              trackTagModel.set('xprive', true);
              trackTagModel.save();
            }
          });
        }

        console.warn('TrackCardCtrl updateXprive: ', trackModel);

        trackModel.set('Id', trackId);
        trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
        trackModel.save().then(function () {
          console.error('TrackCardCtrl updateXprive saved SUCCESS: ', trackModel.get('xprive'));
        });
      }
    };
    
    //removeIf(!tracks)
    $scope.updatePoisVolgen = function () {
    
      console.warn('TrackCardCtrl updatePoisVolgen');
    
      if ($scope.details.poisVolgen) {
        $scope.details.poisVolgen = false;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('poisVolgen', false);
        trackSupModel.save();
        console.log('TrackCardCtrl trackMakersVolgen saved in trackSupModel: ', $scope.details.poisVolgen);
    
      } else {
    
    
        $scope.details.poisVolgen = true;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('poisVolgen', true);
        trackSupModel.save();
        console.log('TrackCardCtrl trackPoisVolgen saved in trackSupModel: ', $scope.details.poisVolgen);
      }
    };
    
    $scope.updateFotosVolgen = function () {
    
      console.warn('TrackCardCtrl updateFotosVolgen');
    
      if ($scope.details.fotosVolgen) {
    
        $scope.details.fotosVolgen = false;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('fotosVolgen', false);
        trackSupModel.save();
        console.log('TrackCardCtrl trackFotosVolgen saved in trackSupModel: ', $scope.details.fotosVolgen);
    
      } else {
    
        $scope.details.fotosVolgen = true;
    
        trackSupModel.set('Id', trackSupModel.get('Id'));
        trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
        trackSupModel.set('fotosVolgen', true);
        trackSupModel.save();
        console.log('TrackCardCtrl trackFotosVolgen saved in trackSupModel: ', $scope.details.fotosVolgen);
      }
    };
    //endRemoveIf(!tracks)
    
    function initxData(trackModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!trackModel.xData) {
        trackModel.xData = {};
        console.log('TracksCtrl initxData xData');
      }
      if (!trackModel.xData.tracks) {
        trackModel.xData.tracks = [];
        console.log('TracksCtrl initxData xData.tracks');
      }
      if (!trackModel.xData.fotos) {
        trackModel.xData.fotos = [];
        console.log('TracksCtrl initxData xData.fotoa');
      }
      if (!trackModel.xData.tags) {
        trackModel.xData.tags = [];
        console.log('TracksCtrl initxData xData.tags');
      }
    }

    function updateTrack() {

      console.log('TrackCardCtrl trackModel: ', trackModel, trackModel.get('naam'));
      var trackId = trackModel.get('Id');
      console.warn('TrackCardCtrl trackUpdate trackId: ', trackId);
      
      
      
      
      
      //removeIf(!tracks)
      $scope.details.poisVolgen = trackSupModel.get('poisVolgen');
      $scope.details.fotosVolgen = trackSupModel.get('fotosVolgen');

      $scope.details.poisAantal = 0;
      $scope.details.fotosAantal = 0;
      $scope.details.poisAantal = trackModel.xData.pois.length;
      $scope.details.fotosAantal = trackModel.xData.fotos.length;
      //endRemoveIf(!tracks)
      
      updateLabels(trackModel);

      //
      if (mode !== 'bericht') {
        
        
      }

      var isBlacklisted = loDash.find(dataFactoryBlacklist.store, function (blacklistModel) {
        return blacklistModel.get('volgerId') === trackModel.get('gebruikerId');
      });
      $scope.details.volgt = true;
      if (isBlacklisted) {
        $scope.details.volgt = false;
      }

      $scope.details.trackId = trackId;
      $scope.details.tags = trackModel.xData.tags;
      sorteerDetailsTags();
      console.log('TrackCardCtrl updateTrack xData.tags: ', trackModel.xData.tags);

      $scope.details.groep = '';

      $scope.details.gebruikerId = trackModel.get('gebruikerId');
      $scope.details.profiel = trackModel.get('profiel');
      $scope.details.gebruikerNaam = trackModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }

      $scope.details.avatarColor = trackModel.get('avatarColor');
      $scope.details.avatarLetter = trackModel.get('avatarLetter');
      $scope.details.avatarInverse = trackModel.get('avatarInverse');

      $scope.details.createdOn = trackModel.get('createdOn');
      $scope.details.changedOn = trackModel.get('changedOn');


      $scope.details.star = trackSupModel.get('star');
      $scope.details.xprive = trackModel.get('xprive');

      if (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = trackSupModel.get('xnew');
      }

      $scope.details.naam = trackModel.get('naam');
      $scope.details.tekst = trackModel.get('tekst');
      var tmp2 = trackModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp2 + '</p>';

      $scope.details.lat = trackModel.get('lat');
      $scope.details.lng = trackModel.get('lng');

      var gelezen = +trackSupModel.get('gelezen');
      $scope.details.gelezen = gelezen;
      console.log('updateTrackUpdate gelezen: ', gelezen);

      console.log('TrackCardCtrl updateTrack updateReacties Clock');

      updateReacties(trackModel);

      dataFactoryClock.stopClockTrack();
      $rootScope.$emit('startClockTrack');
      $timeout(function () {
        console.log('TrackCardCtrl updateTrack updateReacties start Clock');

        dataFactoryClock.startClockTrackCardFast(function () {
          console.log('TrackCardCtrl updateTrack syncDown controleren op gelezen en reacties');
          $scope.details.gelezen = +trackSupModel.get('gelezen');
          console.log('TrackCardCtrl updateTrack syncDown controleren op gelezen: ', +trackSupModel.get('gelezen'));
          updateReacties(trackModel);
        });
      }, 200);
    }

    function typingHelp(tmp) {

      if (!tmp.Id) {

        console.warn('TrackCardCtrl HELP tmp: ', tmp);

      } else {

        var tmp2, tmp3;
        var helpTypes = 'Sporen';
        var helpType = 'Spoor';
        var helpTyp = 'deze';
        if ($scope.details.mode === 'track' || $scope.details.mode === 'bericht') {
          helpTyp = 'dit';
        }

        tmp.naam = tmp.naam.replace('__TYPE__', helpType);
        tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
        tmp3 = tmp2.replace(/__TYPE__/g, helpType);
        tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

        console.log('TrackCardCtrl HELP tmp: ', tmp.modal);

        $scope.cardHelps.push(tmp);
      }
    }

    function showHelp() {
      console.warn('TrackCardCtrl showHelp');

      var item;
      if (mode === 'bericht') {
        item = 'Bericht';
      }
      if (mode === 'foto') {
        item = 'Foto';
      }
      if (mode === 'poi') {
        item = 'Spoor';
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

        console.error('TrackCardCtrl kaartItemHelps $scope.cardHelps: ', $scope.cardHelps);
      }
      //endRemoveIf(berichten)
      
    }

    function removeTrackFromStores(trackId, backend) {

      console.warn('TrackCardCtrl removeTrackFromStores trackId: ', trackId);

      var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      loDash.remove(dataFactoryTrack.star, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      loDash.remove(dataFactoryTrack.nieuw, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      loDash.remove(dataFactoryTrack.selected, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      var tracktags = trackModel.xData.tags;

      loDash.each(tracktags, function (tracktag) {
        var tagModel = tracktag.xData;

        if (tagModel) {

          $rootScope.$emit('trackRemoveLabel', {
            trackModel: trackModel,
            tagModel: tagModel
          });
        } else {
          console.error('TrackCardCtrl removeTrackFromStores tagModel NOT FOUND');
        }
      });

      loDash.remove(dataFactoryTrackTag.store, function (trackTagModel) {
        return trackTagModel.get('trackId') === trackId;
      });
      loDash.remove(dataFactoryTrackTag.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId;
      });

      $rootScope.$emit('trackDelete', trackModel);

      loDash.remove(dataFactoryTrackSup.store, function (trackSupModel) {
        return trackSupModel.get('trackId') === trackId;
      });
      loDash.remove(dataFactoryTrackSup.data, function (dataItem) {
        return dataItem.record.get('trackId') === trackId;
      });

      loDash.remove(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });
      loDash.remove(dataFactoryTrack.data, function (dataItem) {
        return dataItem.record.get('Id') === trackId;
      });

      if (backend) {
        trackModel.remove();
      }
    }

    $scope.deleteTrack = function () {
      console.warn('TrackCardCtrl deleteTrack');
      $ionicPopup.confirm({
        title: 'Verwijder Spoor',
        content:
          'Weet je zeker dat deze Spoor<br><br><span class="trinl-rood"><b>' +
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
              removeTrackFromStores(trackId, true);

              $rootScope.$on('tracksReload');
              $rootScope.$emit('tracksNieuweAantallen');
              $state.go('tracks.tracks');
            }
          }
        ]
      });
    };

    $scope.closeTrackCard = function (stay) {

      console.error('TrackCardCtrl closeTrackCard isCardClosed: ', isCardClosed);

      dataFactoryClock.stopClockTrackCard();

      if (!isCardClosed) {
        if (stay === undefined) {
          stay = true;
        }
        console.error('TrackCardCtrl closePoiCard stay: ', stay);
        if (blacklisted) {
          removeTrackFromStores(trackId, false);

          $rootScope.$on('tracksReload');
          $rootScope.$emit('tracksNieuweAantallen');
          $state.go('tracks.tracks');
        } else {

          loDash.each($scope.details.reacties, function (reactieModel) {
            var reactieSupModel = loDash.find(dataFactoryTrackReactieSup.store, function (reactieSupModel) {
              return reactieSupModel.get('reactieId') === reactieModel.get('Id');
            });
            if (reactieSupModel) {
              reactieSupModel.set('xnew', false);
              reactieSupModel.save();
            }
          });
          console.log('TrackCardCtrl closeTrackCard reacties xnew reset in dataFactoryTrackReactieSup.store');
          //
          // Verwijder status nieuw van track in model sup.
          //
          if (trackSupModel) {

            trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));
            trackSupModel.set('trackId', trackSupModel.get('trackId'));
            var gelezen = +trackSupModel.get('gelezen');

            console.log('TrackCardCtrl closeTrackCard $scope.details.gelezen: ', $scope.details.gelezen);

            console.log('TrackCardCtrl closeTrackCard gelezen trackSupModel oud: ', gelezen);
            var xread = +trackSupModel.get('xread') + 1;
            trackSupModel.set('xread', xread);
            console.log('TrackCardCtrl closeTrackCard xread updated in trackSupModel: ', xread);

            $scope.details.gelezen = gelezen + xread;
            trackModel.xData.sup.set('gelezen', $scope.details.gelezen);
            console.log('TrackCardCtrl closeTrackCard gelezen + xread updated as gelezen in trackSupModel: ', $scope.details.gelezen);

            trackSupModel.set('xnew', false);
            console.log('TrackCardCtrl closeTrackCard xnew reset in trackSupModel');
            //
            // Verwijder track van lijst nieuw in store
            //
            loDash.remove(dataFactoryTrack.nieuw, function (trackNieuwModel) {
              return trackNieuwModel.get('Id') === trackId;
            });

            trackSupModel.save().then(

              function (trackSupModel) {
                trackSupModel.set('xread', 0);
                var trackNieuw = [];
                var trackReactieNieuw = [];

                trackNieuw = loDash.filter(dataFactoryTrackSup.store, function (trackSup) {
                  return trackSup.get('xnew');
                });

                trackReactieNieuw = loDash.filter(dataFactoryTrackReactieSup.store, function (trackReactieSup) {
                  return trackReactieSup.get('xnew');
                });

                console.log('TrackCardCtrl closed nieuwe track, trackReacties: ', trackNieuw, trackReactieNieuw);

                if (trackNieuw.length > 0 || trackReactieNieuw.length > 0) {
                  dataFactoryNotification.composeTitleBodyNotification(trackNieuw.length, trackReactieNieuw.length, 'track');
                  console.log('TrackCardCtrl notification met trackNieuw, trackReactieNieuw: ', trackNieuw, trackReactieNieuw);
                }

                $rootScope.$emit('sleepClockTrack');
              },
              function () {
                console.error('trackSupModel saved ERROR');
              }
            );
          }

          $rootScope.$emit('tracksNieuweAantallen');
          if (stay) {
            $state.go('tracks.tracks');
          }
        }
        isCardClosed = true;
      } else {
        console.warn('TrackCardCtrl closeTrackCard SKIPPED!!!!!');
      }
    };

    $scope.clearSearchLabel = function () {
      console.warn('TrackCardCtrl clearearchLabel');

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
      console.warn('TrackCracCtrl closeTags');
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
    // Modal Track
    //
    $ionicModal.fromTemplateUrl(
      'trackModal.html',
      function (modalTrack) {
        $scope.modalTrack = modalTrack;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalTrack = function () {
      $scope.modalTrack.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalTrack = function () {
      $scope.modalTrack.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTrack.remove();
      console.log('TrackCardCtrl ModalTrack is removed!');
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
    // Modal track
    //
    $ionicModal.fromTemplateUrl(
      'trackModal.html',
      function (modalTrack) {
        $scope.modalTrack = modalTrack;
      },
      {
        scope: $scope,
        focusFirstInput: true
      }
    );

    $scope.openModalTrack = function () {
      $scope.modalTrack.show();
      //if (ionic.Platform.isAndroid()) {
      //  cordova.plugins.Keyboard.show();
      //}
    };

    $scope.closeModalTrack = function () {
      $scope.modalTrack.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTrack.remove();
      console.log('TrackCardCtrl ModalTrack is removed!');
    });

    $scope.closeGroepen = function ($event) {
      console.log('TrackCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepenModal();
      } else {
        $scope.closeGroepenPopover($event);
      }
    };

    $scope.openGroepen = function ($event) {
      console.log('TrackCardCtrl openGroepen $event: ', $event);
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
      console.log('TrackCardCtrl openGroepenModal');
      $scope.groepenModal.show();
    };

    $scope.closeGroepenModal = function () {
      console.log('TrackCardCtrl closeGroepenModal');
      $scope.groepenModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepenModal.remove();
      console.log('TrackCardCtrl groepenModal is removed!');
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
      console.log('TrackCardCtrl openGroepenPopover');
      $scope.groepenPopover.show($event);
    };

    $scope.closeGroepenPopover = function () {
      console.log('TrackCardCtrl closeGroepenPopover');
      $scope.groepenPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepenPopover.remove();
    });

    $scope.closeGroepDeelnemers = function () {
      console.log('TrackCardCtrl closeGroepen');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeGroepDeelnemersModal();
      } else {
        $scope.closeGroepDeelnemersPopover();
      }
    };

    $scope.openGroepDeelnemers = function ($event) {
      console.log('TrackCardCtrl openGroepen $event: ', $event);
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
      console.log('TrackCardCtrl openGroepDeelnemersModal');
      $scope.groepDeelnemersModal.show();
    };

    $scope.closeGroepDeelnemersModal = function () {
      console.log('TrackCardCtrl closeGroepDeelnemersModal');
      $scope.groepDeelnemersModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersModal.remove();
      console.log('TrackCardCtrl groepDeelnemersModal is removed!');
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
      console.log('TrackCardCtrl openGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.show($event);
    };

    $scope.closeGroepDeelnemersPopover = function () {
      console.log('TrackCardCtrl closeGroepDeelnemersPopover');
      $scope.groepDeelnemersPopover.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.groepDeelnemersPopover.remove();
    });
    //
    // Popover helpPopoverCard
    //
    $scope.openHelp = function ($event) {
      console.log('TrackCardCtrl openHelp');
      showHelp();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
      }
    };

    $scope.closeHelp = function ($event) {
      console.log('TrackCardCtrl openHelp');
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
      console.log('TrackCardCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      console.log('TrackCardCtrl openHelpPopover');
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
      console.log('TrackCardCtrl closeHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModalCard = function () {
      console.log('TrackCardCtrl closeHelpModal');
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
      console.log('TrackCardCtrl setReactieNavTitle: ' + title);
      $ionicNavBarDelegate.title(title);
    };

    function init() {
      dataFactoryTrackSup.store = loDash.uniqBy(dataFactoryTrackSup.store, function (trackSup) {
        return trackSup.get('trackId');
      });
      console.warn('TrackCardCtrl init TrackStore: ', dataFactoryTrack.store);
      console.warn('TrackCardCtrl init TrackSupStore: ', dataFactoryTrackSup.store);
      trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      console.warn('TrackCardCtrl init trackModel: ', trackModel, trackModel.get('naam'));

      if (trackModel) {
        trackSupModel = loDash.find(dataFactoryTrackSup.store, function (trackSupModel) {
          return trackSupModel.get('trackId') === trackId;
        });
        //
        // Indien geen sup dan nieuwe aanmaken
        //
        if (!trackSupModel) {
          trackSupModel = new dataFactoryTrackSup.Model();
          trackSupModel.set('xnew', true);
          trackSupModel.set('star', false);
          //trackSupModel.set('trackId', trackId);
          trackSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          console.error('TrackCardCtrl init trackSupModel: ', trackSupModel.get('trackId'));
          trackSupModel.save().then(function () {
            trackModel.xData.sup = trackSupModel;
            var xnew = trackModel.xData.sup.get('xnew');

            if (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
              var nieuwModel = loDash.find(dataFactoryTrack.nieuw, function (nieuwModel) {
                return nieuwModel.get('Id') === trackId;
              });
              if (!nieuwModel) {
                dataFactoryTrack.nieuw.push(trackModel, trackModel.get('naam'));
              }
            }
            console.log('TrackCardCtrl init met nieuw supModel');
          });
        } else {
          console.log('TrackCardCtrl init bestaand supModel: ', trackSupModel);

          initxData(trackModel);

          trackModel.xData.sup = trackSupModel;
          console.log('trackModel.xData.sup: ', trackModel.xData.sup);

          var xnew = trackModel.xData.sup.get('xnew');

          if (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
            var nieuwModel = loDash.find(dataFactoryTrack.nieuw, function (nieuwModel) {
              return nieuwModel.get('Id') === trackId;
            });
            if (!nieuwModel) {
              dataFactoryTrack.nieuw.push(trackModel);
            }
          }
        }
        updateTrack(trackModel, trackModel.get('naam'));
      } else {
        console.warn('TrackCardCtrl findRecord ERROR Id: ', trackId);

        $ionicPopup.confirm({
          title: 'Spoor',
          content:
            'Deze Spoor is niet meer beschikbaar!<br>De eigenaar heeft deze Spoor waarschijnlijk verwijderd.',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $state.go('tracks.tracks');
              }
            }
          ]
        });
      }
    }
  }
]);
