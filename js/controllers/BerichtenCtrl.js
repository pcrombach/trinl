/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef


    

    
  //removeIf(!berichten)
  trinl.controller('BerichtenCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryBericht', 'dataFactoryFotos', 'dataFactoryBerichtSup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactoryBerichtTag', 'dataFactoryTrack', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactoryBericht, dataFactoryFotos, dataFactoryBerichtSup, dataFactoryTag, dataFactoryCeo, dataFactoryBerichtTag, dataFactoryTrack, dataFactoryCodePush) {
    //endRemoveIf(!berichten)
    
    $scope.data = {};
    if (!$scope.data.berichten) {
      $scope.data.berichten = [];
    }
    //
    var berichtCard = false;
    //
    $scope.details = {
      mode: 'bericht'
    };
    //
    $scope.showLimit = 5000;
    $scope.currentPage = 0;
    $scope.viewport = window.innerWidth;
    $scope.editorCols = 115;
    if ($scope.viewport < 475) {
      $scope.editorCols = 80;
    }

    $scope.selectedTag = '';

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.isMobile = false;
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $scope.isMobile = true;
      }
    });
    //
    var lastArgs = dataFactoryConfig.currentModel.get('berichtFilter');
    console.log('BerichtSideMenuCtrl berichtFilter from config: ', lastArgs);
    //
    var filter = {
      filter: lastArgs.tag
    };
    //
    console.log('BerichtenCtrl lastArgs from config: ', lastArgs);

    if (lastArgs.filter === 'Tag') {
      $rootScope.$emit('setNavTitleEvent', filter);
    }
    //
    var refreshEvent = $rootScope.$on('berichtenRefresh', function () {
      refresh();
    });
    $scope.$on('$destroy', refreshEvent);
    //
    //  BerichtenTeload wordt getriggerd door sideMenu als een label wordt gewijzihd
    //
    var reloadEvent = $rootScope.$on('berichtenReload', function () {
      reload();
    });
    $scope.$on('$destroy', reloadEvent);
    //
    var berichtPredicate = $rootScope.$on('berichtPredicate', function (event, args) {

      console.log('BerichtenCtrl berichtPredicate event berichtSorter set to: ', args);

      $scope.predicate = args.predicate;
      $scope.reverse = args.reverse;

      dataFactoryConfig.currentModel.set('berichtSorter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      console.log('BerichtenCtrl berichtPredicate event berichtSorter saved in config: ', args);
    });
    $scope.$on('$destroy', berichtPredicate);
    //
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', function (event) {
        console.log('Received a message from service worker: ', event.data.message);
        if (event.data.message === 'RefreshSpoor') {
          refresh();
        }
      });
    }
    //
    var event0 = $scope.$on('$ionicView.enter', function () {

      console.warn('BerichtenCtrl $ionicView.ecnter');

      if (!dataFactoryBericht.card) {
        $ionicSideMenuDelegate.toggleLeft();
      }

      if ($scope.data.berichten.length === 0) {
        $rootScope.$emit('berichtenFilter');
      }
      
      //removeIf(!berichten)  
      $rootScope.$emit('startClockBericht');
      $rootScope.$emit('sleepClockFoto');
      $rootScope.$emit('sleepClockPoi');
      $rootScope.$emit('sleepClockTrack');
      //endRemoveIf(!berichten)
      
      
      
      
      
      
      
    });
    $scope.$on('$destroy', event0);
    //
    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      if (dataFactoryBericht.card) {
        console.warn('BerichtCtrl $ionicView.beforeLeave, dataFactoryBericht.card: ', dataFactoryBericht.card);
        $rootScope.$emit('sleepClockBericht');
      }
    });
    $scope.$on('$destroy', event0b);
    //
    var event2 = $rootScope.$on('berichtDeleteTagOverall', function (event, args) {
      //
      // Nu nog in details en modellen
      //
      var tagModel = args;
      var tagId = tagModel.get('Id');

      console.warn('+++ BerichtenCtrl berichtDeleteTags tagId: ', tagId);
      //
      //	Verwijder in mijn berichtSupStore en update
      //
      var chunkDelete = loDash.chunk(dataFactoryBerichtSup.store, 10);

      function doChunkDelete(chunkDelete, index) {

        console.warn('BerichtenCtrl doChunkDelete');

        if (index >= chunkDelete.length) {
          console.log('BerichtenCtrl doChunkDelete READY');
          return;
        }

        var promises = [];

        loDash.each(chunkDelete[index], function (berichtSupModel) {
          //
          //	Alleen supModel eigenaar
          //
          if (berichtSupModel) {
            console.log('BerichtenCtrl doChunksDelete', berichtSupModel);
            if (berichtSupModel.eigenaar === false) {
              loDash.remove(berichtSupModel.tags, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });
              if (berichtSupModel.tags) {
                promises.push(berichtSupModel.save());
              }
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkDelete(chunkDelete, index + 1);
        });
      }

      doChunkDelete(chunkDelete, 0);
      //
      //	Verwijder in mijn berichtStore en update
      //
      loDash.each(dataFactoryBericht.store, function (berichtModel) {
        if (!berichtModel.xData) {
          berichtModel.xData = {};
        }
        if (!berichtModel.xData.sup) {
          berichtModel.xData.sup = {};
        }
        if (!berichtModel.xData.pois) {
          berichtModel.xData.pois = [];
        }
        if (!berichtModel.xData.fotos) {
          berichtModel.xData.fotos = [];
        }
        if (!berichtModel.xData.tags) {
          berichtModel.xData.tags = [];
        }
        loDash.remove(berichtModel.xData.tags, function (berichtTagModel) {
          return berichtTagModel.get('tagId') === tagId;
        });
      });
      console.log('BerichtenCtrl berichtDeleteTags after doChunkDelete berichtStore: ', dataFactoryBericht.store);
      //
      //	Verwijder in tagStore en update
      //
      var promises = [];

      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('gebruikerId') !== '') {
          if (tagModel.get('Id') === tagId) {
            promises.push(tagModel.remove());
            loDash.remove(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === tagId;
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === tagId;
            });
          }
        }
      });

      $q.all(promises).then(function () {
        $rootScope.$emit('berichtenFilter');
      });

    });
    $scope.$on('$destroy', event2);
    //
    var event3 = $rootScope.$on('berichtEditTagOverall', function (event, args) {

      var tagModel = args;
      var tagId = tagModel.get('Id');
      var tagTekst = tagModel.get('tag');
      console.warn('+++ BerichtenCtrl berichtEditTags tagId, tagTekst: ', tagId, tagTekst);
      //
      //	Wijzig in tagStore en update
      //
      console.warn('+++ BerichtenCtrl berichtEditTags tagStore update: ', dataFactoryTag.store);
      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('Id') === tagId) {
          tagModel.set('tag', tagTekst);
          tagModel.save();
        }
      });
      //
      //	Verwijder in mijn berichtSupStore en update
      //
      var chunkEdit = loDash.chunk(dataFactoryBerichtSup.store, 10);
      console.log(chunkEdit);

      function doChunkEdit(chunkEdit, index) {

        console.warn('BerichtenCtrl doChunkEdit');

        if (index >= chunkEdit.length) {
          console.log('BerichtenCtrl doChunkEdit READY');
          return;
        }

        var promises = [];

        loDash.each(chunkEdit[index], function (berichtSupModel) {
          //
          //	Alleen supmodellen eigenaar
          //
          if (berichtSupModel.eigenaar === false) {

            loDash.each(berichtSupModel.tags, function (tagModel) {
              if (tagModel.tagId === tagId) {
                tagModel.tag = tagTekst;
              }
            });
            if (berichtSupModel.tags) {
              promises.push(berichtSupModel.save());
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkEdit(chunkEdit, index + 1);
        });
      }

      doChunkEdit(chunkEdit, 0);

      //
      // Wijzig mijn berichtStore
      //
      loDash.each(dataFactoryBericht.store, function (berichtModel) {

        console.log('BerichtenCtrl EditAllLabels, berichtModel: ', berichtModel);

        initxData(berichtModel);

        loDash.each(berichtModel.xData.tags, function (berichtTagModel) {
          if (berichtTagModel.get('tagId') === tagId) {
            {
              berichtTagModel.xData.set('tag', tagTekst);
            }
          }
        });
      });

      $rootScope.$emit('berichtenFilter');
    });
    $scope.$on('$destroy', event3);
    //
    function doVerwijderen(mijnBerichten) {
      console.time('Verwijderen');

      $ionicLoading.show({
        template: 'Verwijderen Locaties Selectie<br><br><span class="trinl-rood"><b>' + filter.filter + '</b></span><br><br><br>Een ogenblik geduld aub...'
      });

      var chunkRemove = loDash.chunk(mijnBerichten, 10);
      console.log(chunkRemove);

      function doChunkRemove(chunkRemove, index) {

        console.warn('BerichtenCtrl doChunkRemove, index: ', index);

        if (index >= chunkRemove.length) {
          console.log('BerichtenCtrl doChunkRemove READY');
          $ionicLoading.hide();

          $rootScope.$emit('sideMenuBerichtenFilter', {
            filter: 'Alle'
          });
          console.timeEnd('Verwijderen');
          return;
        }
        //
        // Loop berichtmodellen
        //
        //var promises = [];

        loDash.each(chunkRemove[index], function (berichtModel) {

          var berichtId = berichtModel.get('Id');

          console.warn('BerichtenCtrl doChunkRemove, index: ', index);
          //
          // Filter de berichttags van dit berichtmodel
          //
          var berichttags = loDash.filter(dataFactoryBerichtTag.store, function (berichttagModel) {
            return berichttagModel.get('berichtId') === berichtId;
          });
          console.warn('BerichtenCtrl doChunkRemove, berichttags from Id: ', berichttags, berichtModel.get('Id'), berichtModel.get('naam'));
          //
          // De berichttags van dit model worden later verwijderd
          // Er is nu tijd om de BerichtSideMenuCtrl te informeren om zijn tags bij te werken
          // Verwijder de berichttag ook in backend
          //
          loDash.each(berichttags, function (berichtTagModel) {

            var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === berichtTagModel.get('tagId');
            });
            //
            // Verwijder berichtTagModellen op backend
            //
            if (tagModel) {

              console.warn('BerichtenCtrl doChunkRemove, verwijder berichttag: ', tagModel.get('tag'));

              berichtTagModel.xData = tagModel;

              $rootScope.$emit('berichtRemoveLabel', {
                berichtModel: berichtModel,
                tagModel: tagModel
              });
            }
          });

          loDash.remove(dataFactoryBerichtSup.store, function (berichtenup) {
            return berichtenup.get('berichtId') === berichtModel.get('Id');
          });
          loDash.remove(dataFactoryBerichtSup.data, function (dataItem) {
            return dataItem.record.get('berichtId') === berichtModel.get('Id');
          });
          loDash.remove(dataFactoryBerichtTag.store, function (berichtTagModel) {
            return berichtTagModel.get('berichtId') === berichtId;
          });
          loDash.remove(dataFactoryBerichtTag.data, function (dataItem) {
            return dataItem.record.get('berichtId') === berichtId;
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

          loDash.remove(dataFactoryBericht.store, function (berichtModel) {
            return berichtModel.get('Id') === berichtId;
          });
          loDash.remove(dataFactoryBericht.data, function (dataItem) {
            return dataItem.record.get('Id') === berichtId;
          });
          berichtModel.remove();
        });

        doChunkRemove(chunkRemove, index + 1);
      }

      doChunkRemove(chunkRemove, 0);

      $scope.data.berichten = [];
      $rootScope.$emit('berichtenNieuweAantallen');
      $rootScope.$emit('berichtenFilter');
    }
    //
    var event12 = $rootScope.$on('berichtVerwijderSelectie', function (event, args) {
      //
      console.error('Verwijderen Selectie ceo data.berichten:  ', $scope.ceo.Id, $scope.data.berichten);
      //
      var mijnBerichten = loDash.filter($scope.data.berichten, function (berichtModel) {
        return berichtModel.get('gebruikerId') === $scope.ceo.Id;
      });
      console.error('MijnBerichten aantal: ', mijnBerichten.length);

      if (mijnBerichten.length === 0) {
        $ionicPopup.alert({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat <span class="trinl-rood">geen</span> Locaties die van jou zijn.',
        });
      }

      if (mijnBerichten.length > 1) {

        var berichtNamen = '';
        loDash.each(mijnBerichten, function (berichtModel) {
          berichtNamen = berichtNamen + '<br><span class="trinl-rood"><b>' + berichtModel.get('naam') + '</b></span>';
        });
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat ' + mijnBerichten.length + ' Locaties:<br>' + berichtNamen + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnBerichten);
            }
          }]
        });
      }

      if (mijnBerichten.length === 1) {
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat 1 Locatie:<br>' + mijnBerichten[0].get('naam') + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnBerichten);
            }
          }]
        });

      }

    });
    $scope.$on('$destroy', event12);
    //
    var todo = 0;
    var done = 0;
    //
    function watchLabelGeenLabelBericht(tagModel) {
      done += 1;
      console.log('watchLabelGeenLabelBericht todo, done: ', todo, done);
      if (done >= todo) {

        $rootScope.$emit('berichtenNieuweAantallen');
        filter.filter = tagModel.get('tag');
        $rootScope.$emit('berichtenFilter', {
          filter: 'Tag',
          tag: tagModel.get('tag')
        });
        $rootScope.$emit('setNavTitleEvent', filter);
        $state.go('berichten.berichten');
      }
    }
    //
    var event13 = $rootScope.$on('labelGeenLabelBericht', function (event, args) {

      console.warn('BerichtenCtrl event labelGeenLabelBericht args: ', args.tagModel);

      var tagModel = args.tagModel;

      var tagId = tagModel.get('Id');

      var berichtenZonderLabel = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
        if (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {

          initxData(berichtModel);
          if (berichtModel.xData.tags !== undefined) {
            return berichtModel.xData && berichtModel.xData.tags.length === 0;
          } else {
            return true;
          }
        }
      });
      todo = berichtenZonderLabel.length;

      loDash.each(berichtenZonderLabel, function (berichtModel) {

        var berichtId = berichtModel.get('Id');
        console.log('BerichtenCtrl event labelGeenLabelBericht berichtenZonderLabel berichtId, berichtNaam: ', berichtId, berichtModel.get('naam'));

        var berichtTagModel = new dataFactoryBerichtTag.Model();
        berichtTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        berichtTagModel.set('berichtId', berichtId);
        berichtTagModel.set('tagId', tagId);
        berichtTagModel.save().then(function () {

          berichtTagModel.xData = tagModel;

          console.log('BerichtenCtrl labelGeenLabelBericht berichttag TOEVOEGEN in  SideMenu: ', berichtModel.get('naam'), tagModel.get('tag'));
          console.log('BerichtenCtrl labelGeenLabelBericht berichttag TOEVOEGEN in  berichtModel.xData.tags: ', berichtModel.get('naam'), addBerichtTagModel);

          berichtModel.xData.tags.push(berichtTagModel);
          $rootScope.$emit('berichtAddLabel', {
            berichtModel: berichtModel,
            tagModel: tagModel
          });
          watchLabelGeenLabelBericht(tagModel);
        });
      });
    });
    $scope.$on('$destroy', event13);
    //
    var event4 = $rootScope.$on('berichtStartSearch', function () {

      console.warn('+++ berichtCtrl berichtStartSearch');

      $scope.data.berichten = [];
    });
    $scope.$on('$destroy', event4);
    //
    function finishFilter() {

      $timeout(function () {

        dataFactoryBericht.selected = $scope.data.berichten;

        //loDash.each($scope.data.berichten, function (berichtModel) {
          //sorteerDetailsTags(berichtModel);
        //});

        console.log('BerichtenCtrl finishFilter FILTER AANTAL berichten selected: ', dataFactoryBericht.selected);
        //
        
        

        $timeout(function () {
          console.log('BerichtCtrl finishFilter $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('berichtList').scrollTop(true);
          //$ionicScrollDelegate.scrollTop(true);

        });
      }, 500);
    }
    //
    var event5 = $rootScope.$on('berichtenFilter', function (event, args) {

      console.error('BerichtenCtrl on.berichtenFilter: ', args);

      //
      // Indien geen argumenten dan de oude filter toepassen
      //
      if (args === undefined) {
        args = lastArgs;
      } else {
        lastArgs = args;
      }

      dataFactoryConfig.currentModel.set('berichtFilter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      console.log('BerichtenCtrl laatste berichtenFilter saved in config: ', args);

      if (args.filter === 'Mijn') {
        console.warn('BerichtenCtrl berichtenFilter: Mijn');
        $scope.data.berichten = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
          return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Public') {
        console.warn('BerichtenCtrl berichtenFilter: Public');
        $scope.data.berichten = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
          return berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Alle') {
        console.warn('BerichtenCtrl berichtenFilter: Alle');
        $scope.data.berichten = loDash.each(dataFactoryBericht.store);
        finishFilter();
      }

      if (args.filter === 'Geen label') {

        console.warn('BerichtenCtrl berichtenFilter: Geen label');

        $scope.data.berichten = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
          if (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            console.warn('BerichtenCtrl berichtenFilter Geen label in berichtModel: ', berichtModel);
            if (berichtModel.xData === undefined) {
              return false;
            }
            console.warn('BerichtenCtrl berichtenFilter berichtModel.xData: ', berichtModel.xData);
            if (berichtModel.xData.tags !== undefined) {
              return berichtModel.xData && berichtModel.xData.tags.length === 0;
            } else {
              return true;
            }
          }
        });

        console.log('BerichtenCtrl ongelabeld aantal berichten: ', $scope.data.berichten);

        finishFilter();
      }

      if (args.filter === 'Tag') {

        console.warn('BerichtenCtrl berichtenFilter: Tag:', args.tag);

        $scope.data.berichten = loDash.filter(dataFactoryBericht.store, function (berichtModel) {

          initxData(berichtModel);
          console.log('BerichtenCtrl berichtenFilter Tag berichtModel naam: ', berichtModel.get('naam'));
          console.log('BerichtenCtrl berichtenFilter Tag berichtModel naam: ', berichtModel.xData.tags);
          if (berichtModel.xData.tags.length >= 1) {
            console.warn('BerichtenCtrl berichtenFilter Tag: ', berichtModel.xData.tags.tag);
          }
          var found = loDash.find(berichtModel.xData.tags, function (berichtTagModel) {
            return berichtTagModel.xData.get('tag') === args.tag;
          });
          return found;
        });
        finishFilter();
      }

      if (args.filter === 'Geen') {
        console.warn('BerichtenCtrl berichtenFilter: Geen');
        $scope.data.berichten = [];
        console.log('BerichtenCtrl ongelabeld aantal berichten: ', $scope.data.berichten);
        finishFilter();
      }

      if (args.filter === 'Search') {
        console.log('BerichtenCtrl berichtenFilter: Search', args);

        if (args.search === '') {
          $scope.search.label = '';
          $scope.data.berichten = [];
          console.log('BerichtenCtrl berichtenFilter: geen Search');
          finishFilter();
        } else {
          $scope.data.berichten = dataFactoryBericht.store;
          $timeout(function () {
            finishFilter();
          }, 10);
        }
      }

      if (args.filter === 'Nieuw') {
        console.warn('BerichtenCtrl berichtenFilter: Nieuw');
        $scope.data.berichten = dataFactoryBericht.nieuw;
        finishFilter();
      }

      if (args.filter === 'Favorieten') {

        console.warn('BerichtenCtrl berichtenFilter: Favorieten');

        $scope.data.berichten = dataFactoryBericht.star;

        console.log('BerichtenCtrl nieuwe berichten: ', dataFactoryBericht.star);
        finishFilter();
      }
    });
    $scope.$on('$destroy', event5);
    //
    var event10 = $rootScope.$on('deleteLabel', function (event, args) {

      console.warn('BerichtenCtrl event deleteLabel: ', args);

      loDash.each(dataFactoryBericht.store, function (berichtModel) {

        initxData(berichtModel);

        var berichtTags = loDash.remove(berichtModel.xData.tags, function (berichtTagModel) {
          return berichtTagModel.get('tagId') === args.tagId;
        });
        loDash.each(berichtTags, function (berichtTagModel) {
          (function (berichtTagModel) {
            berichtTagModel.remove();
          }(berichtTagModel));
        });
      });
    });
    $scope.$on('$destroy', event10);
    //
    // eslint-disable-next-line no-unused-vars
    var event14 = $rootScope.$on('berichtExporteerSelectie', function (event, args) {
      
      
      
      
      
      
    });
    $scope.$on('$destroy', event14);
    //
    // We gaan een nieuw bericht maken.Open het Formulier
    
    //removeIf(!berichten)
    $scope.nieuwBericht = function () {

      console.warn('BerichtenCtrl nieuwBericht');

      //		$scope.bericht = {};

      console.warn('BerichtenCtrl nieuwBericht uitgelogd = anoniem: ', dataFactoryCeo.currentModel.get('uitgelogd'), dataFactoryCeo.currentModel.get('gebruikerNaam'));

      //		if (!dataFactoryCeo.currentModel.get('uitgelogd')) {

      //			$scope.bericht.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');
      //			$scope.gebruikerNaam = dataFactoryCeo.currentModel.get('gebruikerNaam');
      //		}
      //		$scope.bericht.naam = '';
      //	    $scope.bericht.tekst = '';

      $scope.openModalBerichtForm();
    };
    //endRemoveIf(!berichten)
    
    
    
    //
    $scope.clickedBericht = function (berichtModel) {
      dataFactoryBericht.card = true;
      console.warn('BerichtenCtrl clickedBericht dataFactoryBericht.card: ', berichtModel, dataFactoryBericht.card);
      $state.go('berichten.berichtCard', {
        'Id': berichtModel.get('Id')
      });
    };
    /**
     * Het clearkruisje van het zoekveld is getapped
     * Nogmaals filteren starten
     */
    $scope.clearSearchLabel = function () {
      console.warn('BerichtenCtrl clearSearchLabel');
      $scope.search.label = '';
      $scope.data.berichten = dataFactoryBericht.store;

      $rootScope.$emit('berichtFiltered', {
        berichten: $scope.data.berichten
      });
    };
    //
    function sorteerDetailsTags(berichtModel) {
      //
      console.error('BerichtCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(berichtModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');

      var tagsStandaard = loDash.filter(berichtModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');

      var tagsNormaal = loDash.filter(berichtModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.get('tag'), 'asc');

      berichtModel.xData.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
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
    //
    $scope.doRefresh = function () {

      $rootScope.$emit('refreshBericht');

      console.error('BerichtenCtrl doReload broadcast reloadComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
    //
    $scope.$on('elemHasFocus', function (event, args) {

      console.warn('BerichtenCtrl elemHasFocus event: ', args);
      //
      if (args.message === 'Zoek in locaties') {
        $timeout(function () {
          console.error('BerichtenCtrl elemHasFocus scrollTop $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('berichtList').scrollTop(true);
        });
      }
    });
    
    //removeIf(!berichten)
    //
    // Modal berichtForm
    //
    $ionicModal.fromTemplateUrl('berichtFormModal.html', function (berichtForm) {
      $scope.berichtForm = berichtForm;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $scope.openModalBerichtForm = function () {
      $scope.berichtForm.show();
    };
    $scope.closeBerichtForm = function () {
      $scope.berichtForm.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.berichtForm.remove();
    });
    //endRemoveIf(!berichten)
    
  }
]);
