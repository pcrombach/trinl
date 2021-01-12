'use strict';

// eslint-disable-next-line no-undef
trinl.controller('PoiPopupCardCtrl', [
  'loDash',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$state',
  '$ionicPopup',
  '$ionicModal',
  '$ionicPopover',
  'dataFactoryCeo',
  'dataFactoryPoi',
  'dataFactoryPoiSup',
  'dataFactoryPoiTag',
  'dataFactoryTag',
  'dataFactoryTrack',
  function (loDash, $rootScope, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, dataFactoryCeo, dataFactoryPoi, dataFactoryPoiSup, dataFactoryPoiTag, dataFactoryTag, dataFactoryTrack) {

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.global = {};
    $scope.global.tags = dataFactoryTag.store;
    $scope.details = {};
    $scope.details.mode = 'poi';

    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'images/small_non_existing_id.png';

    var poiId = $stateParams.Id;

    var poiModel;
    var poiSupModel;

    var oldInputNaam;
    var oldInputTekst;

    var event0 = $scope.$on('$ionicView.beforeEnter', function () {
      //console.warn('PoiPopupCardCtrl $ionicView.beforeEnter');

      init();
    });
    $scope.$on('$destroy', event0);

    var event3 = $rootScope.$on('syncDownPoiTag', function () {
      //console.log('PoiPopupCardCtrl syncDownPoiTag event');
      updateLabels();
    });
    $scope.$on('$destroy', event3);

    var event4 = $rootScope.$on('syncDownTag', function () {
      updateLabels();
    });
    $scope.$on('$destroy', event4);

    var event5 = $rootScope.$on('syncDownPoiSup', function (event, args) {
      //console.log('PoiPopupCardCtrl syncDownPoiSup event: ', args);

      if (args.poiId === poiModel.get('Id')) {
        var poiId = poiModel.get('Id');

        poiModel = loDash.find(dataFactoryPoi.store, function (poi) {
          return poi.get('Id') === poiId;
        });

        poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSup) {
          return poiSup.get('poiId') === poiId;
        });

        if (poiSupModel) {
          if (!poiModel.xData) {
            poiModel.xData = {};
          }

          poiModel.xData.sup = poiSupModel;

          var xread = poiSupModel.get('xread');
          var gelezen = poiModel.get('gelezen');

          $scope.details.gelezen = xread + gelezen;
          $scope.details.star = star;

          var star = poiSupModel.get('star');

          if (star) {
            var found = loDash.find(dataFactoryPoi.star, function (poiStarModel) {
              return poiStarModel.get('Id') === poiId;
            });
            if (!found) {
              dataFactoryPoi.star.push(poiModel);
            }
          } else {
            loDash.remove(dataFactoryPoi.star, function (poiStarModel) {
              return poiStarModel.get('Id') === poiId;
            });
          }

          $rootScope.$emit('poisFavorieten');
        }
      } else {
        //console.error('PoisCtrl syncDownPoiSup event not for this card yippieeeee!!!');
      }
    });
    $scope.$on('$destroy', event5);

    $scope.saveItemTekst = function (input) {
      //console.warn('PoiPopupCardCtrl saveItemTekst: ', $scope.details);
      //console.warn('PoiPopupCardCtrl saveItemTekst: ', input);
      //console.error('PoiPopupCardCtrl size message: ', input.naam.length + input.tekst.length);

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
        //			if (input.naam.length + input.tekst.length > 7500) {
        //		        $ionicPopup.alert({
        //		            title: 'WIjzigen tekst',
        //					template: 'De tekst mag maximaal 7500 karakters lang zijn.<br><br>De tekst is afgekort opgeslagen.'
        //		        });
        //			}
        poiModel.set('gebruikerId', poiModel.get('gebruikerId'));
        poiModel.set('xprive', true);
        poiModel.save();
      }

      $scope.closeModalPoi();
    };

    $scope.openItemTekst = function () {
      //console.warn('PoiPopupCardCtrl openItemTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalPoi();
    };

    function updateLabels() {
      //console.warn('PoiPopupCardCtrl updateLabels');

      //
      // Indien labels wordne toegevoegd dan worden die toegevoegd in de dataFactoryPoiTag store en data
      // De label moet ook toegevoegd worden aan de poiModel.xData.tags

      $scope.details.tags = poiModel.xData.tags;

      if (!$scope.details.tags) {
        $scope.details.tags = [];
      }
      if (!poitags) {
        poitags = [];
      }
      //console.error('PoiPopupCardCtrl updateLabels store, length:', dataFactoryPoiTag.store, dataFactoryPoiTag.store.length);
      //
      // Alleen de tags van de poi in poiCard filteren
      //
      var poitags = loDash.filter(dataFactoryPoiTag.store, function (poiTagModel) {
        return poiTagModel.get('poiId') === poiId;
      });

      if (!poitags) {
        poitags = [];
      }

      //console.error('PoiPopupCardCtrl updateLabels poitags, length:', poitags, poitags.length);

      //console.log('PoiPopupCardCtrl filtered poiTag: ', poitags);
      //		loDash.each(poitags, function(poitagModel) {
      //			var tagId = poitagModel.get('tagId');
      //      #####//console.log('PoiPopupCardCtrl poiTag: ', poitagModel);
      //			if (tagId) {
      //				var tagModel = loDash.find(dataFactoryTag.store, function(tagModel) {
      //					return tagModel.get('Id') === tagId;
      //				});
      //				if (tagModel) {
      //          #####//console.log('PoiPopupCardCtrl tag: ', tagModel);
      //					$scope.details.tags.push(tagModel);
      //				}
      //			}
      //		});
    }

    $scope.closeTags = function () {
      //console.warn('PoiCracCtrl closeTags');

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeModalTags();
      } else {
        $scope.closeModalTags();
      }
    };

    $scope.addNieuweLabel = function (tag) {
      //console.warn('PoiPopupCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find(dataFactoryTag.store, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          //agModel.set('xprive', true);
          tagModel.save().then(function () {
            $scope.global.tags = dataFactoryTag.store;
            $scope.selectLabelClick(tagModel);
            $scope.clearSearchLabel();

            //console.log('PoiPopupCardCtrl addNieuweLabel tag: ', tagModel);
          });
        } else {
          $ionicPopup.alert({
            title: 'Toevoegen label',
            template: 'Dit label bestaat reeds.<br><br>Tik op de label in de lijst of kies een andere label!',
          });
        }
      } else {
        $scope.closeTags();
      }
    };

    $scope.selectLabelClick = function (tagModel) {
      //console.warn('PoiPopupCardCtrl selectLabelClick: ', tagModel);

      var tagId = tagModel.get('Id');

      var found = loDash.find(dataFactoryPoiTag.store, function (poiTagModel) {
        return poiTagModel.get('poiId') === poiId && poiTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var poiTagModel = new dataFactoryPoiTag.Model();
        poiTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        poiTagModel.set('poiId', poiId);
        poiTagModel.set('tagId', tagId);
        poiTagModel.set('xprive', true);
        poiTagModel.save().then(function () {
          //console.log('PoiPopupCardCtrl tag added: ', tagModel);
          poiTagModel.xData = tagModel;
          $scope.details.tags.push(poiTagModel);

          $rootScope.$emit('poiAddLabel', {
            poiModel: poiModel,
            tagModel: tagModel,
          });
        });
      }
      $scope.closeTags();
    };

    $scope.selecterenTagHelp = function () {
      $scope.helpTitel = 'Label selecteren';
      $scope.helpContent = 'Selecteer een label in onderstaande lijst. Indien deze te lang is kun je door middel van zoeken het aantal labels verkleinen. Voer daarvoor de zoektekst in, in het zoekvenster. De lijst toont dan alle labels waarin deze tekst voorkomt. Als je het label gevonden hebt, selecteer het in de lijst, het label wordt dan toegevoegd aan de locatie.';
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover();
      }
    };

    $scope.toevoegenTagHelp = function () {
      $scope.helpTitel = 'Label toevoegen';
      $scope.helpContent = 'Wanneer de tekst niet te vinden is door middel van het zoekvenster verschijnt rechtsboven de tekst ‘+ Voeg toe’. Klik hier om de getypte tekst uit het zoekvenster als label toe te voegen aan de lijst. Het label wordt tevens toegevoegd aan de gekozen locatie.';

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openGlobalHelpModal();
      } else {
        $scope.openGlobalHelpPopover();
      }
    };

    //	function getGlobalTags() {
    //		$scope.global.filtertags = [];
    //		$scope.global.tags = [];

    //		loDash.each(dataFactoryTag.data, function(tagItem) {
    //			var tagModel = tagItem.record;
    ////			if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') || tagModel.get('gebruikerId') === '') {
    ////				$scope.global.tags.push(tagModel);
    ////			}
    //		});
    //	}

    $scope.addTagToItem = function () {
      //console.warn('PoiPopupCardCtrl addTagToItem');

      //		getGlobalTags();
      $scope.clearSearchLabel();
      //console.warn('++++++++++ PoiPopupCardCtrl addTagToItem global.tags: ', $scope.global.tags);

      $scope.openModalTags();
    };

    $scope.deleteLabelTag = function (tagModel) {
      //console.warn('PoiPopupCardCtrl deleteLabelTag tagModel: ', tagModel);
      //console.warn('PoiPopupCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      //console.warn('PoiPopupCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));

      if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') || tagModel.get('gebruikerId') === '') {
        var tagId = tagModel.get('Id');

        var found = loDash.find(dataFactoryPoiTag.store, function (poiTagModel) {
          return poiTagModel.get('poiId') === poiId && poiTagModel.get('tagId') === tagId;
        });

        if (found) {
          found.remove().then(function () {
            var tagModel = loDash.find($scope.details.tags, function (tagModel) {
              return tagModel.get('Id') === tagId;
            });
            found.xData = tagModel;
            $rootScope.$emit('poiRemoveLabel', {
              poiModel: poiModel,
              tagModel: tagModel
            });
            loDash.remove($scope.details.tags, function (tagModel) {
              return tagModel.get('Id') === tagId;
            });
          });
        } else {
          //console.error('PoiPopupCardCtrl poitag not found ERROR');
        }
      } else {
        $ionicPopup.alert({
          title: 'Verwijderen label',
          template: 'Dit label is van een andere gebruiker.<br>Label wordt niet verwijderd!',
        });

        //console.error('PoisCardCtrl label is van iemand anders');
      }
    };

    $scope.selecteerPoiItem = function () {
      //console.log('PoisCtrl selecteerItem: ', poiModel);

      $rootScope.$emit('poiSelected', poiModel);
      $state.go('app.kaart');
    };

    $scope.updateStar = function () {
      //console.warn('PoiPopupCardCtrl updateStar in: ', poiSupModel);

      $scope.details.star = poiSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        poiModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryPoi.star, function (poiModel) {
          return poiModel.get('Id') === poiId;
        });
      } else {
        $scope.details.star = true;
        poiModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryPoi.star, function (poiStarModel) {
          return poiStarModel.get('Id') === poiId;
        });
        if (!found) {
          dataFactoryPoi.star.push(poiModel);
        }
      }
      $rootScope.$emit('poisFavorieten');

      //console.warn('PoiPopupCardCtrl updateStar: ', poiSupModel, poiModel.xData.sup.xnew.value);

      if (poiSupModel.get('star') !== $scope.details.star) {
        poiSupModel.set('star', $scope.details.star);
        poiSupModel.save().then(function () {
          //console.error('PoiPopupCardCtrl updateStar saved SUCCESS: ', poiSupModel);
        });
      }
    };

    $scope.updateXprive = function () {
      if ($scope.ceo.Id === poiModel.get('gebruikerId')) {
        //console.warn('PoiPopupCardCtrl updateXprive in: ', poiModel);

        $scope.details.xprive = poiModel.get('xprive');
        if ($scope.details.xprive) {
          $scope.details.xprive = false;
          poiModel.set('xprive', false);
        } else {
          $scope.details.xprive = true;
          poiModel.set('xprive', true);
        }
        //
        // Labels ook prive/public maken
        //
        loDash.each(dataFactoryPoiTag.store, function (poiTagModel) {
          if (poiTagModel.get('poiId') === poiId) {
            poiTagModel.set('xprive', poiModel.get('xprive'));
            poiTagModel.save();
          }
        });

        //console.warn('PoiPopupCardCtrl updateXprive: ', poiModel.xprive);

        poiModel.save().then(function () {
          //console.error('PoiPopupCardCtrl updateXprive saved SUCCESS: ', poiModel.get('xprive'));
        });
      }
    };
    /**
     * Vul details met de items in poiModel
     * Converteer changedOn tbv ago
     * @return {[type]} [description]
     */
    function updatePoi() {
      //console.warn('PoiPopupCardCtrl updatePoi: ', poiModel, poiSupModel);

      //
      // Indien dee poi is gekoppeld aan spoor dan hier naam van de track opzoeken updaten
      //
      $scope.details.gebruikerId = poiModel.get('gebruikerId');
      $scope.details.trackNaam = '';
      var trackId = poiModel.get('trackId');

      //console.log('PoiPopupCardCtrl trackId: ', trackId);
      //console.log('PoiPopupCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store);
      dataFactoryTrack.syncDown().then(function () {
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === trackId;
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          //console.log('PoiPopupCardCtrl track: ', dataFactoryTrack.store, trackModel);
        }
      });

      $scope.details.star = poiSupModel.get('star');
      $scope.details.xprive = poiModel.get('xprive');

      if (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = poiSupModel.get('xnew');
      }

      $scope.details.profiel = poiModel.get('profiel');
      $scope.details.gebruikerNaam = poiModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }
      $scope.details.gebruikerId = poiModel.get('gebruikerId');

      $scope.details.avatarColor = poiModel.get('avatarColor');
      $scope.details.avatarLetter = poiModel.get('avatarLetter');
      $scope.details.avatarInverse = poiModel.get('avatarInverse');

      $scope.details.createdOn = poiModel.get('createdOn');
      $scope.details.changedOn = poiModel.get('changedOn');

      $scope.details.naam = poiModel.get('naam');
      $scope.details.tekst = poiModel.get('tekst');
      var tmp = poiModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      //
      // Verhoog gelezen model poi
      // Poi wordt hier nooit echt geupdate mbt gelezen
      // Dat gebeurd pas als poiSup gesaved wordt (met internet)
      //
      var poiGelezen = parseInt(poiModel.get('gelezen'), 10);
      //console.error('PoiPopupCardCtrl poiGelezen poiModel: ', poiGelezen);
      poiModel.set('gelezen', poiGelezen + 1);
      poiModel.unset('gelezen');
      //console.error('PoiPopupCardCtrl poiGelezen poiModel increment: ', poiModel.get('gelezen'));

      $scope.details.lat = poiModel.get('lat');
      $scope.details.lng = poiModel.get('lng');

      //console.error('PoiPopupCardCtrl poiGelezen poiModel increment: ', poiModel.get('gelezen'));

      var readSup = parseInt(poiSupModel.get('xread'), 10);
      poiSupModel.set('xread', readSup + 1);
      poiSupModel.set('poiId', poiId);
      poiSupModel.set('gebruikerId', poiSupModel.get('gebruikerId'));

      $scope.details.gelezen = parseInt(poiModel.get('gelezen'), 10);
    }
    /**
     * Verwijder Poi
     * @return {[type]} [description]
     */
    $scope.deleteItem = function () {
      //console.warn('PoiPopupCardCtrl deleteItem');
      $ionicPopup.confirm({
        title: 'Verwijder Locatie',
        content: 'Weet je zeker dat de locatie<br><br><span class="trinl-rood"><b>' + $scope.details.naam + '</b></span><br><br>definitief verwijderd moet worden?',
        buttons: [{
          text: 'Annuleer',
        },
        {
          text: '<b>Verwijder</b>',
          type: 'button-positive',
          onTap: function () {
            //
            // De sup en tag modellen worden door de server removed
            //
            // De andere gebruikers worden niet gesynced via websocket
            // De andere gebruikers verwijderen hun sup en tag modellen dmv syncDown
            // De eigen sup en tag modellen verwijderen we zelf
            //
            //var poiSups = loDash.filter(dataFactoryPoiSup.store, function (poiSupModel) {
            //return poiSupModel.get('poiId') === poiId;
            //});

            //loDash.each(poiSups, function (poiSupModel) {
            //(function (poiSupModel) {
            //poiSupModel.remove();
            //})(poiSupModel);
            //});

            var poitags = loDash.filter(dataFactoryPoiTag.store, function (poiTagModel) {
              return poiTagModel.get('poiId') === poiId;
            });

            loDash.each(poitags, function (poiTagModel) {
              //						(function(poiTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === poiTagModel.get('tagId');
              });

              poiTagModel.xData = tagModel;
              $rootScope.$emit('poiRemoveLabel', {
                poiModel: poiModel,
                tagModel: tagModel,
              });
              //poiTagModel.remove();
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

            $rootScope.$emit('poiDelete', poiModel);

            //
            // Verwijder poiModel in store
            //
            loDash.remove(dataFactoryPoi.store, function (poiModel) {
              return poiModel.get('Id') === poiId;
            });
            loDash.remove(dataFactoryPoi.data, function (dataItem) {
              return dataItem.record.get('Id') === poiId;
            });

            poiModel.remove();

            $rootScope.$emit('poisNieuweAantallen');
            $rootScope.$emit('poisFavorieten');
            $state.go('pois.pois');
          },
        },
        ],
      });
    };

    $scope.closeItemCard = function () {
      //console.warn('PoiPopupCardCtrl closeItemCard');
      //
      // Verwijder status nieuw van poi in model sup.
      //
      if (poiSupModel) {
        poiSupModel.set('xnew', false);
        //
        // Verwijder poi van lijst nieuw in store
        //
        loDash.remove(dataFactoryPoi.nieuw, function (poiNieuwModel) {
          return poiNieuwModel.get('Id') === poiId;
        });

        poiSupModel.save().then(
          function () {
            //console.error('PoiPopupCardCtrl closeItemCard poiSupModel saved SUCCESS');
            poiSupModel.set('xread', 0);
          },
          function () {
            //console.error('poiSupModel saved ERROR');
          }
        );
      }

      $rootScope.$emit('poisNieuweAantallen');

      $state.go('pois.pois');
    };

    $scope.clearSearchLabel = function () {
      //console.warn('BericgtCardCtrl clearearchLabel');

      $scope.search.label = '';
    };
    //
    // Popover Modal
    //
    $ionicPopover
      .fromTemplateUrl('tagsModal.html', {
        scope: $scope,
      })
      .then(function (modalTags) {
        $scope.modalTags = modalTags;
      });

    $scope.openModalTags = function () {
      //console.warn('openModalTags: ');

      $scope.modalTags.show();
    };

    $scope.closeModalTags = function () {
      //console.warn('closeModalTags: ');

      $scope.modalTags.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTags.remove();
    });
    //
    // Popover Tag
    //
    $ionicPopover
      .fromTemplateUrl('tagsPopover.html', {
        scope: $scope,
      })
      .then(function (popoverTags) {
        $scope.popoverTags = popoverTags;
      });

    $scope.openPopoverTags = function () {
      $scope.popoverTags.show();
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
      }, {
        scope: $scope,
        focusFirstInput: true,
      }
    );

    $scope.openModalPoi = function () {
      $scope.modalPoi.show();
      //	    if (ionic.Platform.isAndroid()) {
      //	        cordova.plugins.Keyboard.show();
      //	    }
    };

    $scope.closeModalPoi = function () {
      $scope.modalPoi.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalPoi.remove();
      //console.log('PoiPopupCardCtrl ModalPoi is removed!');
    });
    //
    // Popover globalHelpPopover
    //
    $ionicPopover
      .fromTemplateUrl('globalHelpPopover.html', {
        scope: $scope,
      })
      .then(function (globalHelpPopover) {
        $scope.globalHelpPopover = globalHelpPopover;
      });
    /**
     * @method openGlobalHelpPopover
     * Open Popover Over
     */
    $scope.openGlobalHelpPopover = function () {
      //console.warn('KaartCtrl openGlobaleHelpPopover');
      $scope.globalHelpPopover.show();
    };
    /**
     * @method closeGlobaleHelpPopover
     * Sluit Popover Over
     */
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
      }, {
        scope: $scope,
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

    function init() {
      //console.warn('PoiPopupCardCtrl init');

      poiModel = loDash.find(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('Id') === poiId;
      });

      if (poiModel) {
        poiSupModel = poiModel.sup;
        //console.error('PoiPopupCardCtrl poiModel: ', poiModel);
        //
        // Zoek poiSup op
        //
        if (!poiSupModel) {
          poiSupModel = loDash.find(dataFactoryPoiSup.store, function (poiSupModel) {
            return poiSupModel.get('poiId') === poiId;
          });
          //
          // Indien geen poiSup dan nieuwe aanmaken
          //
          if (!poiSupModel) {
            poiSupModel = new dataFactoryPoiSup.Model();
            poiSupModel.set('xnew', true);
            poiSupModel.set('star', false);
            poiSupModel.set('poiId', poiId);
            poiSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));

            poiSupModel.save().then(function () {
              if (!poiModel.xData) {
                poiModel.xData = {};
              }
              if (!poiModel.xData.sup) {
                poiModel.xData.sup = poiSupModel;
              }
              poiModel.xData.sup = poiSupModel;

              var xnew = poiModel.xData.sup.get('xnew');

              if (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
                var nieuwModel = loDash.find(dataFactoryPoi.nieuw, function (nieuwModel) {
                  return nieuwModel.get('Id') === poiId;
                });
                if (!nieuwModel) {
                  dataFactoryPoi.nieuw.push(poiModel);
                }
              }

              updatePoi();

              //console.log('PoiPopupCardCtrl init met nieuw supModel');
            });
          } else {
            //console.log('PoiPopupCardCtrl init bestaand supModel: ', poiSupModel);

            if (!poiModel.xData) {
              poiModel.xData = {};
            }
            if (!poiModel.xData.sup) {
              poiModel.xData.sup = poiSupModel;
            }

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
        }

        updatePoi();
        updateLabels();
      } else {
        //console.warn('PoiPopupCardCtrl findRecord ERROR Id: ', poiId);

        $ionicPopup.alert({
          title: 'Locatie',
          template: 'Deze locatie is niet meer beschikbaar!<br>De eigenaar heeft deze locatie waarschijnlijk verwijderd.',
        });

        $state.go('pois.pois');
      }
    }
  },
]);
