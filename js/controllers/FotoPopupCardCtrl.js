'use strict';

// eslint-disable-next-line no-undef
trinl.controller('FotoPopupCardCtrl', [
  'loDash',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$state',
  '$ionicPopup',
  '$ionicModal',
  '$ionicPopover',
  'dataFactoryCeo',
  'dataFactoryFoto',
  'dataFactoryFotoSup',
  'dataFactoryFotoTag',
  'dataFactoryTag',
  'dataFactoryTrack',
  function (loDash, $rootScope, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, dataFactoryCeo, dataFactoryFoto, dataFactoryFotoSup, dataFactoryFotoTag, dataFactoryTag, dataFactoryTrack) {

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.global = {};
    $scope.global.tags = dataFactoryTag.store;
    $scope.details = {};
    $scope.details.mode = 'foto';

    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'images/small_non_existing_id.png';

    var fotoId = $stateParams.Id;

    var fotoModel;
    var fotoSupModel;

    var oldInputNaam;
    var oldInputTekst;

    var event0 = $scope.$on('$ionicView.beforeEnter', function () {
      //console.warn('FotoCardCtrl $ionicView.beforeEnter');

      init();
    });
    $scope.$on('$destroy', event0);
    /*
  var event1 = $rootScope.$on('fotoCard', function() {

//console.warn('FotoCardCtrl fotoCard event');

//		$scope.closeItemCard();

  });
    $scope.$on('$destroy', event1);
*/
    var event3 = $rootScope.$on('syncDownFotoTag', function () {
      //console.log('FotoCardCtrl syncDownFotoTag event');
      updateLabels();
    });
    $scope.$on('$destroy', event3);

    var event4 = $rootScope.$on('syncDownTag', function () {
      updateLabels();
    });
    $scope.$on('$destroy', event4);

    var event5 = $rootScope.$on('syncDownFotoSup', function (event, args) {
      //console.log('FotoCardCtrl syncDownFotoSup event: ', args);

      if (args.fotoId === fotoModel.get('Id')) {
        var fotoId = fotoModel.get('Id');

        fotoModel = loDash.find(dataFactoryFoto.store, function (foto) {
          return foto.get('Id') === fotoId;
        });

        fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotosup) {
          return fotosup.get('fotoId') === fotoId;
        });

        if (fotoSupModel) {
          if (!fotoModel.xData) {
            fotoModel.xData = {};
            fotoModel.xData.tags = [];
          }

          fotoModel.xData.sup = fotoSupModel;

          var xread = fotoSupModel.get('xread');
          var gelezen = fotoModel.get('gelezen');

          $scope.details.gelezen = xread + gelezen;
          $scope.details.star = star;

          var star = fotoSupModel.get('star');

          if (star) {
            var found = loDash.find(dataFactoryFoto.star, function (fotoStarModel) {
              return fotoStarModel.get('Id') === fotoId;
            });
            if (!found) {
              dataFactoryFoto.star.push(fotoModel);
            }
          } else {
            loDash.remove(dataFactoryFoto.star, function (fotoStarModel) {
              return fotoStarModel.get('Id') === fotoId;
            });
          }

          $rootScope.$emit('fotosFavorieten');
        }
      } else {
        //console.error('FotosCtrl syncDownFotoSup event not for this card yippieeeee!!!');
      }
    });
    $scope.$on('$destroy', event5);

    $scope.saveItemTekst = function (input) {
      //console.warn('FotoCardCtrl saveItemTekst: ', $scope.details);
      //console.warn('FotoCardCtrl saveItemTekst: ', input);
      //console.error('FotoCardCtrl size message: ', input.naam.length + input.tekst.length);

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
        //			if (input.naam.length + input.tekst.length > 7500) {
        //		        $ionicPopup.alert({
        //		            title: 'WIjzigen tekst',
        //					template: 'De tekst mag maximaal 7500 karakters lang zijn.<br><br>De tekst is afgekort opgeslagen.'
        //		        });
        //			}
        fotoModel.set('gebruikerId', fotoModel.get('gebruikerId'));
        fotoModel.set('xprive', true);
        fotoModel.save();
      }

      $scope.closeModalFoto();
    };

    $scope.openItemTekst = function () {
      //console.warn('FotoCardCtrl openItemTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalFoto();
    };

    function updateLabels() {
      //console.warn('FotoCardCtrl updateLabels');

      //
      // Indien labels wordne toegevoegd dan worden die toegevoegd in de dataFactoryFotoTag store en data
      // De label moet ook toegevoegd worden aan de fotoModel.xData.tags

      $scope.details.tags = fotoModel.xData.tags;

      if (!$scope.details.tags) {
        $scope.details.tags = [];
      }
      if (!fototags) {
        fototags = [];
      }
      //console.error('FotoCardCtrl updateLabels store, length:', dataFactoryFotoTag.store, dataFactoryFotoTag.store.length);
      //
      // Alleen de tags van de foto in fotoCard filteren
      //
      var fototags = loDash.filter(dataFactoryFotoTag.store, function (fotoTagModel) {
        return fotoTagModel.get('fotoId') === fotoId;
      });

      if (!fototags) {
        fototags = [];
      }

      //console.error('FotoCardCtrl updateLabels fototags, length:', fototags, fototags.length);

      //console.log('FotoCardCtrl filtered fotoTag: ', fototags);
      //		loDash.each(fototags, function(fototagModel) {
      //			var tagId = fototagModel.get('tagId');
      //      #####//console.log('FotoCardCtrl fotoTag: ', fototagModel);
      //			if (tagId) {
      //				var tagModel = loDash.find(dataFactoryTag.store, function(tagModel) {
      //					return tagModel.get('Id') === tagId;
      //				});
      //				if (tagModel) {
      //          #####//console.log('FotoCardCtrl tag: ', tagModel);
      //					$scope.details.tags.push(tagModel);
      //				}
      //			}
      //		});
    }

    $scope.closeTags = function () {
      //console.warn('FotoCracCtrl closeTags');

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeModalTags();
      } else {
        $scope.closeModalTags();
      }
    };

    $scope.addNieuweLabel = function (tag) {
      //console.warn('FotoCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {
        var found = loDash.find(dataFactoryTag.store, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          //tagModel.set('xprive', true);
          tagModel.save().then(function () {
            $scope.global.tags = dataFactoryTag.store;
            $scope.selectLabelClick(tagModel);
            $scope.clearSearchLabel();

            //console.log('FotoCardCtrl addNieuweLabel tag: ', tagModel);
          });
          $scope.closeTags();
        } else {
          $ionicPopup.confirm({
            title: 'Toevoegen label',
            content: 'Dit label bestaat reeds.<br><br>Tik op de label in de lijst of kies een andere label!',
            buttons: [{
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function () {
                $scope.closeTags();
              }
            }]
          });
        }
      } else {
        $scope.closeTags();
      }
    };

    $scope.selectLabelClick = function (tagModel) {
      //console.warn('FotoCardCtrl selectLabelClick: ', tagModel);

      var tagId = tagModel.get('Id');

      var found = loDash.find(dataFactoryFotoTag.store, function (fotoTagModel) {
        return fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var fotoTagModel = new dataFactoryFotoTag.Model();
        fotoTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoTagModel.set('fotoId', fotoId);
        fotoTagModel.set('tagId', tagId);
        fotoTagModel.set('xprive', true);
        fotoTagModel.save().then(function () {
          //console.log('FotoCardCtrl tag added: ', tagModel);

          $scope.details.tags.push(tagModel);
          $rootScope.$emit('fotoAddLabel', {
            fotoModel: fotoModel,
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
      //console.warn('FotoCardCtrl addTagToItem');

      //		getGlobalTags();
      $scope.clearSearchLabel();
      //console.warn('++++++++++ FotoCardCtrl addTagToItem global.tags: ', $scope.global.tags);

      $scope.openModalTags();
    };

    $scope.deleteLabelTag = function (tagModel) {
      //console.warn('FotoCardCtrl deleteLabelTag tagModel: ', tagModel);
      //console.warn('FotoCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      //console.warn('FotoCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));

      if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') || tagModel.get('gebruikerId') === '') {
        var tagId = tagModel.get('Id');

        var found = loDash.find(dataFactoryFotoTag.store, function (fotoTagModel) {
          return fotoTagModel.get('fotoId') === fotoId && fotoTagModel.get('tagId') === tagId;
        });

        if (found) {
          found.remove().then(function () {
            loDash.remove($scope.details.tags, function (tagModel) {
              return tagModel.get('Id') === tagId;
            });

            $rootScope.$emit('fotoRemoveLabel', {
              fotoModel: fotoModel,
              tagModel: tagModel,
            });
          });
        } else {
          //console.error('FotoCardCtrl fototag not found ERROR');
        }
      } else {
        $ionicPopup.confirm({
          title: 'Verwijderen label',
          content: 'Dit label is van een andere gebruiker.<br>Label wordt niet verwijderd!',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {}
          }]
        });
        //console.error('FotosCardCtrl label is van iemand anders');
      }
    };

    $scope.selecteerFotoItem = function () {
      //console.log('FotosCtrl selecteerItem: ', fotoModel);

      $rootScope.$emit('fotoSelected', fotoModel);
      $state.go('app.kaart');
    };

    $scope.updateStar = function () {
      //console.warn('FotoCardCtrl updateStar in: ', fotoSupModel);

      $scope.details.star = fotoSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        fotoModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryFoto.star, function (fotoModel) {
          return fotoModel.get('Id') === fotoId;
        });
      } else {
        $scope.details.star = true;
        fotoModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryFoto.star, function (fotoStarModel) {
          return fotoStarModel.get('Id') === fotoId;
        });
        if (!found) {
          dataFactoryFoto.star.push(fotoModel);
        }
      }
      $rootScope.$emit('fotosFavorieten');

      //console.warn('FotoCardCtrl updateStar: ', fotoSupModel, fotoModel.xData.sup.xnew.value);

      if (fotoSupModel.get('star') !== $scope.details.star) {
        fotoSupModel.set('star', $scope.details.star);
        fotoSupModel.save().then(function () {
          //console.error('FotoCardCtrl updateStar saved SUCCESS: ', fotoSupModel);
        });
      }
    };

    $scope.updateXprive = function () {
      if ($scope.ceo.Id === fotoModel.get('gebruikerId')) {
        //console.warn('FotoCardCtrl updateXprive in: ', fotoModel);

        $scope.details.xprive = fotoModel.get('xprive');
        if ($scope.details.xprive) {
          $scope.details.xprive = false;
          fotoModel.set('xprive', false);
        } else {
          $scope.details.xprive = true;
          fotoModel.set('xprive', true);
        }
        //
        // Labels ook prive/public maken
        //
        loDash.each(dataFactoryFotoTag.store, function (fotoTagModel) {
          if (fotoTagModel.get('fotoId') === fotoId) {
            fotoTagModel.set('xprive', fotoModel.get('xprive'));
            fotoTagModel.save();
          }
        });

        //console.warn('FotoCardCtrl updateXprive: ', fotoModel.xprive);
        fotoModel.save().then(function () {
          //console.error('FotoCardCtrl updateXprive saved SUCCESS: ', fotoModel.get('xprive'));
        });
      }
    };
    /**
     * Vul details met de items in fotoModel
     * Converteer changedOn tbv ago
     * @return {[type]} [description]
     */
    function updateFoto() {
      //console.warn('FotoCardCtrl updateFoto: ', fotoModel, fotoSupModel);

      //
      // Indien dee foto is gekoppeld aan spoor dan hier naam van de track opzoeken updaten
      //
      $scope.details.gebruikerId = fotoModel.get('gebruikerId');
      $scope.details.trackNaam = '';
      var trackId = fotoModel.get('trackId');

      //console.log('FotoCardCtrl trackId: ', trackId);
      //console.log('FotoCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store);
      dataFactoryTrack.syncDown().then(function () {
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === trackId;
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          //console.log('FotoCardCtrl track: ', dataFactoryTrack.store, trackModel);
        }
      });

      $scope.details.star = fotoSupModel.get('star');
      $scope.details.xprive = fotoModel.get('xprive');

      if (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = fotoSupModel.get('xnew');
      }

      $scope.details.profiel = fotoModel.get('profiel');
      $scope.details.gebruikerNaam = fotoModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }
      $scope.details.gebruikerId = fotoModel.get('gebruikerId');

      $scope.details.avatarColor = fotoModel.get('avatarColor');
      $scope.details.avatarLetter = fotoModel.get('avatarLetter');
      $scope.details.avatarInverse = fotoModel.get('avatarInverse');

      $scope.details.createdOn = fotoModel.get('createdOn');
      $scope.details.changedOn = fotoModel.get('changedOn');

      $scope.details.naam = fotoModel.get('naam');
      $scope.details.tekst = fotoModel.get('tekst');
      var tmp = fotoModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      //
      // Verhoog gelezen model foto
      // Foto wordt hier nooit echt geupdate mbt gelezen
      // Dat gebeurd pas als fotosup gesaved wordt (met internet)
      //
      var fotoGelezen = parseInt(fotoModel.get('gelezen'), 10);
      //console.error('FotoCardCtrl fotoGelezen fotoModel: ', fotoGelezen);
      fotoModel.set('gelezen', fotoGelezen + 1);
      fotoModel.unset('gelezen');
      //console.error('FotoCardCtrl fotoGelezen fotoModel increment: ', fotoModel.get('gelezen'));

      $scope.details.lat = fotoModel.get('lat');
      $scope.details.lng = fotoModel.get('lng');

      //console.error('FotoCardCtrl fotoGelezen fotoModel increment: ', fotoModel.get('gelezen'));

      var readSup = parseInt(fotoSupModel.get('xread'), 10);
      fotoSupModel.set('xread', readSup + 1);
      fotoSupModel.set('fotoId', fotoId);
      fotoSupModel.set('gebruikerId', fotoSupModel.get('gebruikerId'));

      $scope.details.gelezen = parseInt(fotoModel.get('gelezen'), 10);
    }
    /**
     * Verwijder Foto
     * @return {[type]} [description]
     */
    $scope.deleteItem = function () {
      //console.warn('FotoCardCtrl deleteItem');
      $ionicPopup.confirm({
        title: 'Verwijder Foto',
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
            var fotosups = loDash.filter(dataFactoryFotoSup.store, function (fotoSupModel) {
              return fotoSupModel.get('fotoId') === fotoId;
            });

            loDash.each(fotosups, function (fotoSupModel) {
              (function (fotoSupModel) {
                fotoSupModel.remove();
              })(fotoSupModel);
            });

            var fototags = loDash.filter(dataFactoryFotoTag.store, function (fotoTagModel) {
              return fotoTagModel.get('fotoId') === fotoId;
            });

            loDash.each(fototags, function (fotoTagModel) {
              //						(function(fotoTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === fotoTagModel.get('tagId');
              });

              $rootScope.$emit('fotoRemoveLabel', {
                fotoModel: fotoModel,
                tagModel: tagModel,
              });
              //						})(fotoTagModel);
              fotoTagModel.remove();
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

            $rootScope.$emit('fotoDelete', fotoModel);

            //
            // Verwijder fotoModel in store
            //
            loDash.remove(dataFactoryFoto.store, function (fotoModel) {
              return fotoModel.get('Id') === fotoId;
            });
            loDash.remove(dataFactoryFoto.data, function (dataItem) {
              return dataItem.record.get('Id') === fotoId;
            });

            fotoModel.remove();

            $rootScope.$emit('fotosNieuweAantallen');
            $rootScope.$emit('fotosFavorieten');
            $state.go('fotos.fotos');
          },
        },
        ],
      });
    };

    $scope.closeItemCard = function () {
      //console.warn('FotoCardCtrl closeItemCard');
      //
      // Verwijder status nieuw van foto in model sup.
      //
      if (fotoSupModel) {
        fotoSupModel.set('xnew', false);
        //
        // Verwijder foto van lijst nieuw in store
        //
        loDash.remove(dataFactoryFoto.nieuw, function (fotoNieuwModel) {
          return fotoNieuwModel.get('Id') === fotoId;
        });

        fotoSupModel.save().then(
          function () {
            //console.error('FotoCardCtrl closeItemCard fotoSupModel saved SUCCESS');
            fotoSupModel.set('xread', 0);
          },
          function () {
            //console.error('fotoSupModel saved ERROR');
          }
        );
      }

      $rootScope.$emit('fotosNieuweAantallen');

      $state.go('fotos.fotos');
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
    // Modal foto
    //
    $ionicModal.fromTemplateUrl(
      'fotoModal.html',
      function (modalFoto) {
        $scope.modalFoto = modalFoto;
      }, {
        scope: $scope,
        focusFirstInput: true,
      }
    );

    $scope.openModalFoto = function () {
      $scope.modalFoto.show();
      //	    if (ionic.Platform.isAndroid()) {
      //	        cordova.plugins.Keyboard.show();
      //	    }
    };

    $scope.closeModalFoto = function () {
      $scope.modalFoto.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalFoto.remove();
      //console.log('FotoCardCtrl ModalFoto is removed!');
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
      //console.warn('FotoCardCtrl init');

      fotoModel = loDash.find(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('Id') === fotoId;
      });

      if (fotoModel) {
        fotoSupModel = fotoModel.sup;
        //console.error('FotoCardCtrl fotoModel: ', fotoModel);
        //
        // Zoek fotoSup op
        //
        if (!fotoSupModel) {
          fotoSupModel = loDash.find(dataFactoryFotoSup.store, function (fotoSupModel) {
            return fotoSupModel.get('fotoId') === fotoId;
          });
          //
          // Indien geen fotosup dan nieuwe aanmaken
          //
          if (!fotoSupModel) {
            fotoSupModel = new dataFactoryFotoSup.Model();
            fotoSupModel.set('xnew', true);
            fotoSupModel.set('star', false);
            fotoSupModel.set('fotoId', fotoId);
            fotoSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));

            fotoSupModel.save().then(function () {
              if (!fotoModel.xData) {
                fotoModel.xData = {};
                fotoModel.xData.tags = [];
              }
              if (!fotoModel.xData.sup) {
                fotoModel.xData.sup = fotoSupModel;
              }
              fotoModel.xData.sup = fotoSupModel;

              var xnew = fotoModel.xData.sup.get('xnew');

              if (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
                var nieuwModel = loDash.find(dataFactoryFoto.nieuw, function (nieuwModel) {
                  return nieuwModel.get('Id') === fotoId;
                });
                if (!nieuwModel) {
                  dataFactoryFoto.nieuw.push(fotoModel);
                }
              }

              updateFoto();

              //console.log('FotoCardCtrl init met nieuw supModel');
            });
          } else {
            //console.log('FotoCardCtrl init bestaand supModel: ', fotoSupModel);

            if (!fotoModel.xData) {
              fotoModel.xData = {};
              fotoModel.xDatat.tags = [];
            }
            if (!fotoModel.xData.sup) {
              fotoModel.xData.sup = fotoSupModel;
            }

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
        }

        updateFoto();
        updateLabels();
        $state.go('fotos.fotos');
      } else {
        //console.warn('FotoCardCtrl findRecord ERROR Id: ', fotoId);

        $ionicPopup.confirm({
          title: 'Foto',
          content: 'Deze locatie is niet meer beschikbaar!<br>De eigenaar heeft deze locatie waarschijnlijk verwijderd.',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              $state.go('fotos.fotos');
            }
          }]
        });
      }
    }
  },
]);
