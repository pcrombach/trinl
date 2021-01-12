'use strict';

// eslint-disable-next-line no-undef
trinl.controller('TrackPopupCardCtrl', [
  'loDash',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$state',
  '$ionicPopup',
  '$ionicModal',
  '$ionicPopover',
  'dataFactoryCeo',
  'dataFactoryTrack',
  'dataFactoryTrackSup',
  'dataFactoryTrackTag',
  'dataFactoryTag',
  function (loDash, $rootScope, $scope, $stateParams, $state, $ionicPopup, $ionicModal, $ionicPopover, dataFactoryCeo, dataFactoryTrack, dataFactoryTrackSup, dataFactoryTrackTag, dataFactoryTag) {

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.global = {};
    $scope.global.tags = dataFactoryTag.store;
    $scope.details = {};
    $scope.details.mode = 'track';

    $scope.viewport = window.innerWidth;
    $scope.avatarSrc = 'images/small_non_existing_id.png';

    var trackId = $stateParams.Id;

    var trackModel;
    var trackSupModel;

    var oldInputNaam;
    var oldInputTekst;

    var event0 = $scope.$on('$ionicView.beforeEnter', function () {
      //console.warn('TrackCardCtrl $ionicView.beforeEnter');

      init();
    });
    $scope.$on('$destroy', event0);
    /*
    var event1 = $rootScope.$on('trackCard', function() {

    //console.warn('TrackCardCtrl trackCard event');

    //		$scope.closeItemCard();

    });
    $scope.$on('$destroy', event1);
    */
    /*
    var event3 = $rootScope.$on('syncDownTrackTag', function () {
      //console.log('TrackCardCtrl syncDownTrackTag event');
      updateLabels();
    });
    $scope.$on('$destroy', event3);

    var event4 = $rootScope.$on('syncDownTag', function () {
      updateLabels();
    });
    $scope.$on('$destroy', event4);

    var event5 = $rootScope.$on('syncDownTrackSup', function (event, args) {
      //console.log('TrackCardCtrl syncDownTrackSup event: ', args);

      if (args.trackId === trackModel.get('Id')) {
        var trackId = trackModel.get('Id');

        trackModel = loDash.find(dataFactoryTrack.store, function (track) {
          return track.get('Id') === trackId;
        });

        trackSupModel = loDash.find(dataFactoryTrackSup.store, function (tracksup) {
          return tracksup.get('trackId') === trackId;
        });

        if (trackSupModel) {
          if (!trackModel.xData) {
            trackModel.xData = {};
          }

          trackModel.xData.sup = trackSupModel;

          var xread = trackSupModel.get('xread');
          var gelezen = trackModel.get('gelezen');

          $scope.details.gelezen = xread + gelezen;
          $scope.details.star = star;

          var star = trackSupModel.get('star');

          if (star) {
            var found = loDash.find(dataFactoryTrack.star, function (trackStarModel) {
              return trackStarModel.get('Id') === trackId;
            });
            if (!found) {
              dataFactoryTrack.star.push(trackModel);
            }
          } else {
            loDash.remove(dataFactoryTrack.star, function (trackStarModel) {
              return trackStarModel.get('Id') === trackId;
            });
          }

          $rootScope.$emit('tracktagFavorieten');
        }
      } else {
        //console.error('TracksCtrl syncDownTrackSup event not for this card yippieeeee!!!');
      }
    });
    $scope.$on('$destroy', event5);
    */
    $scope.saveItemTekst = function (input) {
      //console.warn('TrackCardCtrl saveItemTekst: ', $scope.details);
      //console.warn('TrackCardCtrl saveItemTekst: ', input);
      //console.error('TrackCardCtrl size message: ', input.naam.length + input.tekst.length);

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
        //			if (input.naam.length + input.tekst.length > 7500) {
        //		        $ionicPopup.alert({
        //		            title: 'WIjzigen tekst',
        //					template: 'De tekst mag maximaal 7500 karakters lang zijn.<br><br>De tekst is afgekort opgeslagen.'
        //		        });
        //			}
        trackModel.set('gebruikerId', trackModel.get('gebruikerId'));
        trackModel.set('xprive', true);
        trackModel.save();
      }

      $scope.closeModalTrack();
    };

    $scope.openItemTekst = function () {
      //console.warn('TrackCardCtrl openItemTekst');

      $scope.input = {};
      $scope.input.naam = $scope.details.naam;
      $scope.input.tekst = $scope.details.tekst;
      oldInputNaam = $scope.details.naam;
      oldInputTekst = $scope.details.tekst;

      $scope.openModalTrack();
    };

    function updateLabels() {
      //console.warn('TrackCardCtrl updateLabels');

      //
      // Indien labels wordne toegevoegd dan worden die toegevoegd in de dataFactoryTrackTag store en data
      // De label moet ook toegevoegd worden aan de trackModel.xData.tags

      $scope.details.tags = trackModel.xData.tags;

      if (!$scope.details.tags) {
        $scope.details.tags = [];
      }
      if (!tracktags) {
        tracktags = [];
      }
      //console.error('TrackCardCtrl updateLabels store, length:', dataFactoryTrackTag.store, dataFactoryTrackTag.store.length);
      //
      // Alleen de tags van de track in trackCard filteren
      //
      var tracktags = loDash.filter(dataFactoryTrackTag.store, function (trackTagModel) {
        return trackTagModel.get('trackId') === trackId;
      });

      if (!tracktags) {
        tracktags = [];
      }

      //console.error('TrackCardCtrl updateLabels tracktags, length:', tracktags, tracktags.length);

      //console.log('TrackCardCtrl filtered trackTag: ', tracktags);
      //		loDash.each(tracktags, function(tracktagModel) {
      //			var tagId = tracktagModel.get('tagId');
      //      #####//console.log('TrackCardCtrl trackTag: ', tracktagModel);
      //			if (tagId) {
      //				var tagModel = loDash.find(dataFactoryTag.store, function(tagModel) {
      //					return tagModel.get('Id') === tagId;
      //				});
      //				if (tagModel) {
      //          #####//console.log('TrackCardCtrl tag: ', tagModel);
      //					$scope.details.tags.push(tagModel);
      //				}
      //			}
      //		});
    }

    $scope.closeTags = function () {
      //console.warn('TrackCracCtrl closeTags');

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeModalTags();
      } else {
        $scope.closeModalTags();
      }
    };

    $scope.addNieuweLabel = function (tag) {
      //console.warn('TrackCardCtrl addNieuweLabel: ', tag);

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

            //console.log('TrackCardCtrl addNieuweLabel tag: ', tagModel);
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
      //console.warn('TrackCardCtrl selectLabelClick: ', tagModel);

      var tagId = tagModel.get('Id');

      var found = loDash.find(dataFactoryTrackTag.store, function (trackTagModel) {
        return trackTagModel.get('trackId') === trackId && trackTagModel.get('tagId') === tagId;
      });

      if (!found) {
        var trackTagModel = new dataFactoryTrackTag.Model();
        trackTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        trackTagModel.set('trackId', trackId);
        trackTagModel.set('tagId', tagId);
        trackTagModel.set('xprive', true);
        trackTagModel.save().then(function () {
          //console.log('TrackCardCtrl tag added: ', tagModel);

          $scope.details.tags.push(tagModel);
          $rootScope.$emit('trackAddLabel', {
            trackModel: trackModel,
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
      //console.warn('TrackCardCtrl addTagToItem');

      //		getGlobalTags();
      $scope.clearSearchLabel();
      //console.warn('++++++++++ TrackCardCtrl addTagToItem global.tags: ', $scope.global.tags);

      $scope.openModalTags();
    };

    $scope.deleteLabelTag = function (tagModel) {
      //console.warn('TrackCardCtrl deleteLabelTag tagModel: ', tagModel);
      //console.warn('TrackCardCtrl deleteLabelTag tag.gebruikerId: ', tagModel.get('gebruikerId'));
      //console.warn('TrackCardCtrl ceo.gebruikerId: ', dataFactoryCeo.currentModel.get('Id'));

      if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id') || tagModel.get('gebruikerId') === '') {
        var tagId = tagModel.get('Id');

        var found = loDash.find(dataFactoryTrackTag.store, function (trackTagModel) {
          return trackTagModel.get('trackId') === trackId && trackTagModel.get('tagId') === tagId;
        });

        if (found) {
          found.remove().then(function () {
            loDash.remove($scope.details.tags, function (tagModel) {
              return tagModel.get('Id') === tagId;
            });

            $rootScope.$emit('trackRemoveLabel', {
              trackModel: trackModel,
              tagModel: tagModel,
            });
          });
        } else {
          //console.error('TrackCardCtrl tracktag not found ERROR');
        }
      } else {
        $ionicPopup.alert({
          title: 'Verwijderen label',
          template: 'Dit label is van een andere gebruiker.<br>Label wordt niet verwijderd!',
        });

        //console.error('TracksCardCtrl label is van iemand anders');
      }
    };

    $scope.selecteerTrackItem = function () {
      console.log('TrackPopupCardCtrl selecteerItem: ', trackModel.get('naam'));

      $rootScope.$emit('trackSelected', trackModel);
      $state.go('app.kaart');
    };

    $scope.updateStar = function () {
      //console.warn('TrackCardCtrl updateStar in: ', trackSupModel);

      $scope.details.star = trackSupModel.get('star');

      if ($scope.details.star) {
        $scope.details.star = false;
        trackModel.xData.sup.set('star', false);
        loDash.remove(dataFactoryTrack.star, function (trackModel) {
          return trackModel.get('Id') === trackId;
        });
      } else {
        $scope.details.star = true;
        trackModel.xData.sup.set('star', true);
        var found = loDash.find(dataFactoryTrack.star, function (trackStarModel) {
          return trackStarModel.get('Id') === trackId;
        });
        if (!found) {
          dataFactoryTrack.star.push(trackModel);
        }
      }
      $rootScope.$emit('tracktagFavorieten');

      //console.warn('TrackCardCtrl updateStar: ', trackSupModel, trackModel.xData.sup.xnew.value);

      if (trackSupModel.get('star') !== $scope.details.star) {
        trackSupModel.set('star', $scope.details.star);
        trackSupModel.save().then(function () {
          //console.error('TrackCardCtrl updateStar saved SUCCESS: ', trackSupModel);
        });
      }
    };

    $scope.updateXprive = function () {
      if ($scope.ceo.Id === trackModel.get('gebruikerId')) {
        //console.warn('TrackCardCtrl updateXprive in: ', trackModel);

        $scope.details.xprive = trackModel.get('xprive');
        if ($scope.details.xprive) {
          $scope.details.xprive = false;
          trackModel.set('xprive', false);
        } else {
          $scope.details.xprive = true;
          trackModel.set('xprive', true);
        }
        //
        // Labels ook prive/public maken
        //
        loDash.each(dataFactoryTrackTag.store, function (trackTagModel) {
          if (trackTagModel.get('trackId') === trackId) {
            trackTagModel.set('xprive', trackModel.get('xprive'));
            trackTagModel.save();
          }
        });

        //console.warn('TrackCardCtrl updateXprive: ', trackModel.xprive);

        trackModel.save().then(function () {
          //console.error('TrackCardCtrl updateXprive saved SUCCESS: ', trackModel.get('xprive'));
        });
      }
    };
    /**
     * Vul details met de items in trackModel
     * Converteer changedOn tbv ago
     * @return {[type]} [description]
     */
    function updateTrack() {
      //console.warn('TrackCardCtrl updateTrack: ', trackModel, trackSupModel);

      //
      // Indien dee track is gekoppeld aan spoor dan hier naam van de track opzoeken updaten
      //
      $scope.details.gebruikerId = trackModel.get('gebruikerId');
      $scope.details.trackNaam = '';
      var trackId = trackModel.get('trackId');

      //console.log('TrackCardCtrl trackId: ', trackId);
      //console.log('TrackCardCtrl dataFactoryTrack.store: ', dataFactoryTrack.store);
      dataFactoryTrack.syncDown().then(function () {
        var trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('Id') === trackId;
        });
        if (trackModel) {
          $scope.details.trackNaam = trackModel.get('naam');
          //console.log('TrackCardCtrl track: ', dataFactoryTrack.store, trackModel);
        }
      });

      $scope.details.star = trackSupModel.get('star');
      $scope.details.xprive = trackModel.get('xprive');

      if (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id')) {
        $scope.details.xnew = trackSupModel.get('xnew');
      }

      $scope.details.profiel = trackModel.get('profiel');
      $scope.details.gebruikerNaam = trackModel.get('gebruikerNaam');
      if ($scope.profiel === 'anoniem') {
        $scope.details.gebruikerNaam = 'anoniem';
      }
      $scope.details.gebruikerId = trackModel.get('gebruikerId');

      $scope.details.avatarColor = trackModel.get('avatarColor');
      $scope.details.avatarLetter = trackModel.get('avatarLetter');
      $scope.details.avatarInverse = trackModel.get('avatarInverse');

      $scope.details.createdOn = trackModel.get('createdOn');
      $scope.details.changedOn = trackModel.get('changedOn');

      $scope.details.naam = trackModel.get('naam');
      $scope.details.tekst = trackModel.get('tekst');
      var tmp = trackModel.get('tekst').replace(/\r\n?|\n/g, '<br />');
      $scope.details.htmltekst = '<p>' + tmp + '</p>';
      //
      // Verhoog gelezen model track
      // Track wordt hier nooit echt geupdate mbt gelezen
      // Dat gebeurd pas als tracksup gesaved wordt (met internet)
      //
      var trackGelezen = parseInt(trackModel.get('gelezen'), 10);
      //console.error('TrackCardCtrl trackGelezen trackModel: ', trackGelezen);
      trackModel.set('gelezen', trackGelezen + 1);
      trackModel.unset('gelezen');
      //console.error('TrackCardCtrl trackGelezen trackModel increment: ', trackModel.get('gelezen'));

      $scope.details.lat = trackModel.get('lat');
      $scope.details.lng = trackModel.get('lng');

      //console.error('TrackCardCtrl trackGelezen trackModel increment: ', trackModel.get('gelezen'));

      var readSup = parseInt(trackSupModel.get('xread'), 10);
      trackSupModel.set('xread', readSup + 1);
      trackSupModel.set('trackId', trackId);
      trackSupModel.set('gebruikerId', trackSupModel.get('gebruikerId'));

      $scope.details.gelezen = parseInt(trackModel.get('gelezen'), 10);
    }
    /**
     * Verwijder Track
     * @return {[type]} [description]
     */
    $scope.deleteItem = function () {
      //console.warn('TrackCardCtrl deleteItem');
      $ionicPopup.confirm({
        title: 'Verwijder Spoor',
        content: 'Weet je zeker dat dit Spoor:<br><br><span class="trinl-rood"><b>' + $scope.details.naam + '</b></span><br><br>definitief verwijderd moet worden?',
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
            var tracksups = loDash.filter(dataFactoryTrackSup.store, function (trackSupModel) {
              return trackSupModel.get('trackId') === trackId;
            });

            loDash.each(tracksups, function (trackSupModel) {
              (function (trackSupModel) {
                trackSupModel.remove();
              })(trackSupModel);
            });

            var tracktags = loDash.filter(dataFactoryTrackTag.store, function (trackTagModel) {
              return trackTagModel.get('trackId') === trackId;
            });

            loDash.each(tracktags, function (trackTagModel) {
              //						(function(trackTagModel) {
              var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
                return tagModel.get('Id') === trackTagModel.get('tagId');
              });

              $rootScope.$emit('trackRemoveLabel', {
                trackModel: trackModel,
                tagModel: tagModel,
              });
              //						})(trackTagModel);
              trackTagModel.remove();
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

            $rootScope.$emit('trackDelete', trackModel);

            //
            // Verwijder trackModel in store
            //
            loDash.remove(dataFactoryTrack.store, function (trackModel) {
              return trackModel.get('Id') === trackId;
            });
            loDash.remove(dataFactoryTrack.data, function (dataItem) {
              return dataItem.record.get('Id') === trackId;
            });

            trackModel.remove();

            $rootScope.$emit('trackNieuweAantallen');
            $rootScope.$emit('tracksNieuwe');
            $rootScope.$emit('tracksFavorieten');
            $state.go('tracks.tracks');
          },
        },
        ],
      });
    };

    $scope.closeItemCard = function () {
      //console.warn('TrackCardCtrl closeItemCard');
      //
      // Verwijder status nieuw van track in model sup.
      //
      if (trackSupModel) {
        trackSupModel.set('xnew', false);
        //
        // Verwijder track van lijst nieuw in store
        //
        loDash.remove(dataFactoryTrack.nieuw, function (trackNieuwModel) {
          return trackNieuwModel.get('Id') === trackId;
        });

        trackSupModel.save().then(
          function () {
            //console.error('TrackCardCtrl closeItemCard trackSupModel saved SUCCESS');
            trackSupModel.set('xread', 0);
          },
          function () {
            //console.error('trackSupModel saved ERROR');
          }
        );
      }

      $rootScope.$emit('tracksNieuweAantallen');

      $state.go('tracks.tracks');
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
    // Modal track
    //
    $ionicModal.fromTemplateUrl(
      'trackModal.html',
      function (modalTrack) {
        $scope.modalTrack = modalTrack;
      }, {
        scope: $scope,
        focusFirstInput: true,
      }
    );

    $scope.openModalTrack = function () {
      $scope.modalTrack.show();
      //	    if (ionic.Platform.isAndroid()) {
      //	        cordova.plugins.Keyboard.show();
      //	    }
    };

    $scope.closeModalTrack = function () {
      $scope.modalTrack.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modalTrack.remove();
      //console.log('TrackCardCtrl ModalTrack is removed!');
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
      //console.warn('TrackCardCtrl init');

      trackModel = loDash.find(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('Id') === trackId;
      });

      if (trackModel) {
        trackSupModel = trackModel.sup;
        //console.error('TrackCardCtrl trackModel: ', trackModel);
        //
        // Zoek trackSup op
        //
        if (!trackSupModel) {
          trackSupModel = loDash.find(dataFactoryTrackSup.store, function (trackSupModel) {
            return trackSupModel.get('trackId') === trackId;
          });
          //
          // Indien geen tracksup dan nieuwe aanmaken
          //
          if (!trackSupModel) {
            trackSupModel = new dataFactoryTrackSup.Model();
            trackSupModel.set('xnew', true);
            trackSupModel.set('star', false);
            trackSupModel.set('trackId', trackId);
            trackSupModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));

            trackSupModel.save().then(function () {
              if (!trackModel.xData) {
                trackModel.xData = {};
              }
              if (!trackModel.xData.sup) {
                trackModel.xData.sup = trackSupModel;
              }
              trackModel.xData.sup = trackSupModel;

              var xnew = trackModel.xData.sup.get('xnew');

              if (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id') && xnew) {
                var nieuwModel = loDash.find(dataFactoryTrack.nieuw, function (nieuwModel) {
                  return nieuwModel.get('Id') === trackId;
                });
                if (!nieuwModel) {
                  dataFactoryTrack.nieuw.push(trackModel);
                }
              }

              updateTrack();

              //console.log('TrackCardCtrl init met nieuw supModel');
            });
          } else {
            //console.log('TrackCardCtrl init bestaand supModel: ', trackSupModel);

            if (!trackModel.xData) {
              trackModel.xData = {};
            }
            if (!trackModel.xData.sup) {
              trackModel.xData.sup = trackSupModel;
            }

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
        }

        updateTrack();
        updateLabels();
      } else {
        //console.warn('TrackCardCtrl findRecord ERROR Id: ', trackId);

        $ionicPopup.alert({
          title: 'Spoor',
          template: 'Dit Spoor is niet meer beschikbaar!<br>De eigenaar heeft deze locatie waarschijnlijk verwijderd.',
        });

        $state.go('tracks.tracks');
      }
    }
  },
]);
