/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
//removeIf(!xois)
trinl.controller('PoisCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryTrack', 'dataFactoryPoi', 'dataFactoryPoiSup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactoryPoiTag',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactoryTrack, dataFactoryPoi, dataFactoryPoiSup, dataFactoryTag, dataFactoryCeo, dataFactoryPoiTag) {
    //endRemoveIf(!xois)
    

    

    
  
    $scope.data = {};
    if (!$scope.data.pois) {
      $scope.data.pois = [];
    }
    //
    var poiCard = false;
    //
    $scope.details = {
      mode: 'poi'
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
    var lastArgs = dataFactoryConfig.currentModel.get('poiFilter');
    //console.log('PoiSideMenuCtrl poiFilter from config: ', lastArgs);
    //
    var filter = {
      filter: lastArgs.tag
    };
    //
    //console.log('PoisCtrl lastArgs from config: ', lastArgs);

    if (lastArgs.filter === 'Tag') {
      $rootScope.$emit('setNavTitleEvent', filter);
    }
    //
    var refreshEvent = $rootScope.$on('poisRefresh', function () {
      refresh();
    });
    $scope.$on('$destroy', refreshEvent);
    //
    //  PoisTeload wordt getriggerd door sideMenu als een label wordt gewijzihd
    //
    var reloadEvent = $rootScope.$on('poisReload', function () {
      reload();
    });
    $scope.$on('$destroy', reloadEvent);
    //
    var poiPredicate = $rootScope.$on('poiPredicate', function (event, args) {

      //console.log('PoisCtrl poiPredicate event poiSorter set to: ', args);

      $scope.predicate = args.predicate;
      $scope.reverse = args.reverse;

      dataFactoryConfig.currentModel.set('poiSorter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      //console.log('PoisCtrl poiPredicate event poiSorter saved in config: ', args);
    });
    $scope.$on('$destroy', poiPredicate);
    //
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', function (event) {
        //console.log('Received a message from service worker: ', event.data.message);
        if (event.data.message === 'RefreshSpoor') {
          refresh();
        }
      });
    }
    //
    var event0 = $scope.$on('$ionicView.enter', function () {

      //console.warn('PoisCtrl $ionicView.ecnter');

      if (!dataFactoryPoi.card) {
        $ionicSideMenuDelegate.toggleLeft();
      }

      if ($scope.data.pois.length === 0) {
        $rootScope.$emit('poisFilter');
      }
      
      
      
      
      
      //removeIf(!xois)
      dataFactoryPoi.currentTrackId = '';
      dataFactoryTrack.tmpArray = [];
      dataFactoryTrack.tmpArray2 = [];
      dataFactoryTrack.selected = [];
      $rootScope.$emit('trackKaart');

      $rootScope.$emit('startClockPoi');
      $rootScope.$emit('sleepClockBericht');
      $rootScope.$emit('sleepClockFoto');
      $rootScope.$emit('sleepClockTrack');
      //endRemoveIf(!xois)
      
      
      
    });
    $scope.$on('$destroy', event0);
    //
    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      if (dataFactoryPoi.card) {
        //console.warn('PoiCtrl $ionicView.beforeLeave, dataFactoryPoi.card: ', dataFactoryPoi.card);
        $rootScope.$emit('sleepClockPoi');
      }
    });
    $scope.$on('$destroy', event0b);
    //
    var event2 = $rootScope.$on('poiDeleteTagOverall', function (event, args) {
      //
      // Nu nog in details en modellen
      //
      var tagModel = args;
      var tagId = tagModel.get('Id');

      //console.warn('+++ PoisCtrl poiDeleteTags tagId: ', tagId);
      //
      //	Verwijder in mijn poiSupStore en update
      //
      var chunkDelete = loDash.chunk(dataFactoryPoiSup.store, 10);

      function doChunkDelete(chunkDelete, index) {

        //console.warn('PoisCtrl doChunkDelete');

        if (index >= chunkDelete.length) {
          //console.log('PoisCtrl doChunkDelete READY');
          return;
        }

        var promises = [];

        loDash.each(chunkDelete[index], function (poiSupModel) {
          //
          //	Alleen supModel eigenaar
          //
          if (poiSupModel) {
            //console.log('PoisCtrl doChunksDelete', poiSupModel);
            if (poiSupModel.eigenaar === false) {
              loDash.remove(poiSupModel.tags, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });
              if (poiSupModel.tags) {
                promises.push(poiSupModel.save());
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
      //	Verwijder in mijn poiStore en update
      //
      loDash.each(dataFactoryPoi.store, function (poiModel) {
        if (!poiModel.xData) {
          poiModel.xData = {};
        }
        if (!poiModel.xData.sup) {
          poiModel.xData.sup = {};
        }
        if (!poiModel.xData.xois) {
          poiModel.xData.xois = [];
        }
        if (!poiModel.xData.fotos) {
          poiModel.xData.fotos = [];
        }
        if (!poiModel.xData.tags) {
          poiModel.xData.tags = [];
        }
        loDash.remove(poiModel.xData.tags, function (poiTagModel) {
          return poiTagModel.get('tagId') === tagId;
        });
      });
      //console.log('PoisCtrl poiDeleteTags after doChunkDelete poiStore: ', dataFactoryPoi.store);
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
        $rootScope.$emit('poisFilter');
      });

    });
    $scope.$on('$destroy', event2);
    //
    var event3 = $rootScope.$on('poiEditTagOverall', function (event, args) {

      var tagModel = args;
      var tagId = tagModel.get('Id');
      var tagTekst = tagModel.get('tag');
      //console.warn('+++ PoisCtrl poiEditTags tagId, tagTekst: ', tagId, tagTekst);
      //
      //	Wijzig in tagStore en update
      //
      //console.warn('+++ PoisCtrl poiEditTags tagStore update: ', dataFactoryTag.store);
      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('Id') === tagId) {
          tagModel.set('tag', tagTekst);
          tagModel.save();
        }
      });
      //
      //	Verwijder in mijn poiSupStore en update
      //
      var chunkEdit = loDash.chunk(dataFactoryPoiSup.store, 10);
      //console.log(chunkEdit);

      function doChunkEdit(chunkEdit, index) {

        //console.warn('PoisCtrl doChunkEdit');

        if (index >= chunkEdit.length) {
          //console.log('PoisCtrl doChunkEdit READY');
          return;
        }

        var promises = [];

        loDash.each(chunkEdit[index], function (poiSupModel) {
          //
          //	Alleen supmodellen eigenaar
          //
          if (poiSupModel.eigenaar === false) {

            loDash.each(poiSupModel.tags, function (tagModel) {
              if (tagModel.tagId === tagId) {
                tagModel.tag = tagTekst;
              }
            });
            if (poiSupModel.tags) {
              promises.push(poiSupModel.save());
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkEdit(chunkEdit, index + 1);
        });
      }

      doChunkEdit(chunkEdit, 0);

      //
      // Wijzig mijn poiStore
      //
      loDash.each(dataFactoryPoi.store, function (poiModel) {

        //console.log('PoisCtrl EditAllLabels, poiModel: ', poiModel);

        initxData(poiModel);

        loDash.each(poiModel.xData.tags, function (poiTagModel) {
          if (poiTagModel.get('tagId') === tagId) {
            {
              poiTagModel.xData.set('tag', tagTekst);
            }
          }
        });
      });

      $rootScope.$emit('poisFilter');
    });
    $scope.$on('$destroy', event3);
    //
    function doVerwijderen(mijnPois) {
      //console.time('Verwijderen');

      $ionicLoading.show({
        template: 'Verwijderen Locaties Selectie<br><br><span class="trinl-rood"><b>' + filter.filter + '</b></span><br><br><br>Een ogenblik geduld aub...'
      });

      var chunkRemove = loDash.chunk(mijnPois, 10);
      //console.log(chunkRemove);

      function doChunkRemove(chunkRemove, index) {

        //console.warn('PoisCtrl doChunkRemove, index: ', index);

        if (index >= chunkRemove.length) {
          //console.log('PoisCtrl doChunkRemove READY');
          $ionicLoading.hide();

          $rootScope.$emit('sideMenuPoisFilter', {
            filter: 'Alle'
          });
          //console.timeEnd('Verwijderen');
          return;
        }
        //
        // Loop poimodellen
        //
        //var promises = [];

        loDash.each(chunkRemove[index], function (poiModel) {

          var poiId = poiModel.get('Id');

          //console.warn('PoisCtrl doChunkRemove, index: ', index);
          //
          // Filter de poitags van dit poimodel
          //
          var poitags = loDash.filter(dataFactoryPoiTag.store, function (poitagModel) {
            return poitagModel.get('poiId') === poiId;
          });
          //console.warn('PoisCtrl doChunkRemove, poitags from Id: ', poitags, poiModel.get('Id'), poiModel.get('naam'));
          //
          // De poitags van dit model worden later verwijderd
          // Er is nu tijd om de PoiSideMenuCtrl te informeren om zijn tags bij te werken
          // Verwijder de poitag ook in backend
          //
          loDash.each(poitags, function (poiTagModel) {

            var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === poiTagModel.get('tagId');
            });
            //
            // Verwijder poiTagModellen op backend
            //
            if (tagModel) {

              //console.warn('PoisCtrl doChunkRemove, verwijder poitag: ', tagModel.get('tag'));

              poiTagModel.xData = tagModel;

              $rootScope.$emit('poiRemoveLabel', {
                poiModel: poiModel,
                tagModel: tagModel
              });
            }
          });

          loDash.remove(dataFactoryPoiSup.store, function (poisup) {
            return poisup.get('poiId') === poiModel.get('Id');
          });
          loDash.remove(dataFactoryPoiSup.data, function (dataItem) {
            return dataItem.record.get('poiId') === poiModel.get('Id');
          });
          loDash.remove(dataFactoryPoiTag.store, function (poiTagModel) {
            return poiTagModel.get('poiId') === poiId;
          });
          loDash.remove(dataFactoryPoiTag.data, function (dataItem) {
            return dataItem.record.get('poiId') === poiId;
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

          loDash.remove(dataFactoryPoi.store, function (poiModel) {
            return poiModel.get('Id') === poiId;
          });
          loDash.remove(dataFactoryPoi.data, function (dataItem) {
            return dataItem.record.get('Id') === poiId;
          });
          poiModel.remove();
        });

        doChunkRemove(chunkRemove, index + 1);
      }

      doChunkRemove(chunkRemove, 0);

      $scope.data.pois = [];
      $rootScope.$emit('poisNieuweAantallen');
      $rootScope.$emit('poisFilter');
    }
    //
    var event12 = $rootScope.$on('poiVerwijderSelectie', function (event, args) {
      //
      //console.error('Verwijderen Selectie ceo data.pois:  ', $scope.ceo.Id, $scope.data.pois);
      //
      var mijnPois = loDash.filter($scope.data.pois, function (poiModel) {
        return poiModel.get('gebruikerId') === $scope.ceo.Id;
      });
      //console.error('MijnPois aantal: ', mijnPois.length);

      if (mijnPois.length === 0) {
        $ionicPopup.alert({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat <span class="trinl-rood">geen</span> Locaties die van jou zijn.',
        });
      }

      if (mijnPois.length > 1) {

        var poiNamen = '';
        loDash.each(mijnPois, function (poiModel) {
          poiNamen = poiNamen + '<br><span class="trinl-rood"><b>' + poiModel.get('naam') + '</b></span>';
        });
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat ' + mijnPois.length + ' Locaties:<br>' + poiNamen + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnPois);
            }
          }]
        });
      }

      if (mijnPois.length === 1) {
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat 1 Locatie:<br>' + mijnPois[0].get('naam') + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnPois);
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
    function watchLabelGeenLabelPoi(tagModel) {
      done += 1;
      //console.log('watchLabelGeenLabelPoi todo, done: ', todo, done);
      if (done >= todo) {

        $rootScope.$emit('poisNieuweAantallen');
        filter.filter = tagModel.get('tag');
        $rootScope.$emit('poisFilter', {
          filter: 'Tag',
          tag: tagModel.get('tag')
        });
        $rootScope.$emit('setNavTitleEvent', filter);
        $state.go('pois.pois');
      }
    }
    //
    var event13 = $rootScope.$on('labelGeenLabelPoi', function (event, args) {

      //console.warn('PoisCtrl event labelGeenLabelPoi args: ', args.tagModel);

      var tagModel = args.tagModel;

      var tagId = tagModel.get('Id');

      var poisZonderLabel = loDash.filter(dataFactoryPoi.store, function (poiModel) {
        if (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {

          initxData(poiModel);
          if (poiModel.xData.tags !== undefined) {
            return poiModel.xData && poiModel.xData.tags.length === 0;
          } else {
            return true;
          }
        }
      });
      todo = poisZonderLabel.length;

      loDash.each(poisZonderLabel, function (poiModel) {

        var poiId = poiModel.get('Id');
        //console.log('PoisCtrl event labelGeenLabelPoi poisZonderLabel poiId, poiNaam: ', poiId, poiModel.get('naam'));

        var poiTagModel = new dataFactoryPoiTag.Model();
        poiTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        poiTagModel.set('poiId', poiId);
        poiTagModel.set('tagId', tagId);
        poiTagModel.save().then(function () {

          poiTagModel.xData = tagModel;

          //console.log('PoisCtrl labelGeenLabelPoi poitag TOEVOEGEN in  SideMenu: ', poiModel.get('naam'), tagModel.get('tag'));
          //console.log('PoisCtrl labelGeenLabelPoi poitag TOEVOEGEN in  poiModel.xData.tags: ', poiModel.get('naam'), addPoiTagModel);

          poiModel.xData.tags.push(poiTagModel);
          $rootScope.$emit('poiAddLabel', {
            poiModel: poiModel,
            tagModel: tagModel
          });
          watchLabelGeenLabelPoi(tagModel);
        });
      });
    });
    $scope.$on('$destroy', event13);
    //
    var event4 = $rootScope.$on('poiStartSearch', function () {

      //console.warn('+++ poiCtrl poiStartSearch');

      $scope.data.pois = [];
    });
    $scope.$on('$destroy', event4);
    //
    function finishFilter() {

      $timeout(function () {

        dataFactoryPoi.selected = $scope.data.pois;

        //loDash.each($scope.data.pois, function (poiModel) {
          //sorteerDetailsTags(poiModel);
        //});

        //console.log('PoisCtrl finishFilter FILTER AANTAL pois selected: ', dataFactoryPoi.selected);
        //
        
        //removeIf(berichten)
        // Laat KaartCtrl weten dat de geselecteerde Sporen is gewijzigd
        //
        $rootScope.$emit('poiKaart', {
          pois: dataFactoryPoi.selected
        });
        //endRemoveIf(berichten)
        

        $timeout(function () {
          //console.log('PoiCtrl finishFilter $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('poiList').scrollTop(true);
          //$ionicScrollDelegate.scrollTop(true);

        });
      }, 500);
    }
    //
    var event5 = $rootScope.$on('poisFilter', function (event, args) {

      //console.error('PoisCtrl on.poisFilter: ', args);

      //
      // Indien geen argumenten dan de oude filter toepassen
      //
      if (args === undefined) {
        args = lastArgs;
      } else {
        lastArgs = args;
      }

      dataFactoryConfig.currentModel.set('poiFilter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      //console.log('PoisCtrl laatste poisFilter saved in config: ', args);

      if (args.filter === 'Mijn') {
        //console.warn('PoisCtrl poisFilter: Mijn');
        $scope.data.pois = loDash.filter(dataFactoryPoi.store, function (poiModel) {
          return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Public') {
        //console.warn('PoisCtrl poisFilter: Public');
        $scope.data.pois = loDash.filter(dataFactoryPoi.store, function (poiModel) {
          return poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Alle') {
        //console.warn('PoisCtrl poisFilter: Alle');
        $scope.data.pois = loDash.each(dataFactoryPoi.store);
        finishFilter();
      }

      if (args.filter === 'Geen label') {

        //console.warn('PoisCtrl poisFilter: Geen label');

        $scope.data.pois = loDash.filter(dataFactoryPoi.store, function (poiModel) {
          if (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            //console.warn('PoisCtrl poisFilter Geen label in poiModel: ', poiModel);
            if (poiModel.xData === undefined) {
              return false;
            }
            //console.warn('PoisCtrl poisFilter poiModel.xData: ', poiModel.xData);
            if (poiModel.xData.tags !== undefined) {
              return poiModel.xData && poiModel.xData.tags.length === 0;
            } else {
              return true;
            }
          }
        });

        //console.log('PoisCtrl ongelabeld aantal pois: ', $scope.data.pois);

        finishFilter();
      }

      if (args.filter === 'Tag') {

        //console.warn('PoisCtrl poisFilter: Tag:', args.tag);

        $scope.data.pois = loDash.filter(dataFactoryPoi.store, function (poiModel) {

          initxData(poiModel);
          //console.log('PoisCtrl poisFilter Tag poiModel naam: ', poiModel.get('naam'));
          //console.log('PoisCtrl poisFilter Tag poiModel naam: ', poiModel.xData.tags);
          if (poiModel.xData.tags.length >= 1) {
            //console.warn('PoisCtrl poisFilter Tag: ', poiModel.xData.tags.tag);
          }
          var found = loDash.find(poiModel.xData.tags, function (poiTagModel) {
            return poiTagModel.xData.get('tag') === args.tag;
          });
          return found;
        });
        finishFilter();
      }

      if (args.filter === 'Geen') {
        //console.warn('PoisCtrl poisFilter: Geen');
        $scope.data.pois = [];
        //console.log('PoisCtrl ongelabeld aantal pois: ', $scope.data.pois);
        finishFilter();
      }

      if (args.filter === 'Search') {
        //console.log('PoisCtrl poisFilter: Search', args);

        if (args.search === '') {
          $scope.search.label = '';
          $scope.data.pois = [];
          //console.log('PoisCtrl poisFilter: geen Search');
          finishFilter();
        } else {
          $scope.data.pois = dataFactoryPoi.store;
          $timeout(function () {
            finishFilter();
          }, 10);
        }
      }

      if (args.filter === 'Nieuw') {
        //console.warn('PoisCtrl poisFilter: Nieuw');
        $scope.data.pois = dataFactoryPoi.nieuw;
        finishFilter();
      }

      if (args.filter === 'Favorieten') {

        //console.warn('PoisCtrl poisFilter: Favorieten');

        $scope.data.pois = dataFactoryPoi.star;

        //console.log('PoisCtrl nieuwe pois: ', dataFactoryPoi.star);
        finishFilter();
      }
    });
    $scope.$on('$destroy', event5);
    //
    var event10 = $rootScope.$on('deleteLabel', function (event, args) {

      //console.warn('PoisCtrl event deleteLabel: ', args);

      loDash.each(dataFactoryPoi.store, function (poiModel) {

        initxData(poiModel);

        var poiTags = loDash.remove(poiModel.xData.tags, function (poiTagModel) {
          return poiTagModel.get('tagId') === args.tagId;
        });
        loDash.each(poiTags, function (poiTagModel) {
          (function (poiTagModel) {
            poiTagModel.remove();
          }(poiTagModel));
        });
      });
    });
    $scope.$on('$destroy', event10);
    //
    // eslint-disable-next-line no-unused-vars
    var event14 = $rootScope.$on('poiExporteerSelectie', function (event, args) {
      
      //removeIf(!xois)
      var gpxNaam;
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];

      function watchGpxPoisErrors() {

        gpxDoneErrors += 1;

        //console.warn('PoisCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);

        if (gpxDoneErrors >= gpxTodoErrors) {

          $ionicLoading.hide();

          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportPois.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Locaties',
                content: 'Exporteren na correctie fouten gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $ionicPopup.confirm({
                title: 'Exporteren Locaties ERROR',
                content: uploadErrors.length + ' Locaties niet  geaccepteerd door Dropbox<br>Probeer opnieuw',
                buttons: [{
                  text: '<b>OK</br>'
                }]
              });
            }
          }, 100);
        }
      }

      function watchGpxPois() {

        gpxDone += 1;

        //console.warn('PoisCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo, uploadErrors.length);

        if (gpxDone >= gpxTodo) {

          $ionicLoading.hide();
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportPois.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Locaties',
                content: 'Exporteren gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $timeout(function () {
                doExporterenPoisErrors(uploadErrors);
              }, 1000);
            }
          }, 500);
        }
      }

      function doExporterenPoisErrors(uploadErrors) {

        gpxTodoErrors = uploadErrors.length;
        gpxDoneErrors = 0;

        var uploadErrorsX = loDash.filter(uploadErrors, function () {
          return true;
        });

        loDash.each(uploadErrorsX, function (uploadError) {

          var poiModel = uploadError.poiModel;
          var poiId = poiModel.get('Id');
          var base64String = uploadError.base64String;

          //console.log('PoisCtrl uploadError poiModel, uploadError: ', poiModel, uploadError);

          dataFactoryExportPois.recordGPX(poiModel.get('lat'), poiModel.get('lng'), poiModel.get('naam'), poiModel.get('tekst'), poiId, base64String).then(function () {

            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren ' + uploadErrors.length + ' foutieve uploads\'s<br><br>Een ogenblik geduld aub...'
            });
            loDash.remove(uploadErrors, function (uploadError) {
              return uploadError.poiModel.get('Id') === poiId;
            });
            watchGpxPoisErrors();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            //console.error('PoisCtrl uploadError ERROR err: ', err);
            watchGpxPoisErrors();
          });
        });
      }

      function doExporterenPois(mijnPois) {

        //console.warn('PoisCtrl doExporterenPois');

        gpxTodo = mijnPois.length;
        gpxDone;

        dataFactoryExportPois.openGPX();

        if (mijnPois.length === 1) {
          gpxNaam = mijnPois[0].get('naam');
        } else {
          gpxNaam = args.filter;
        }

        gpxDone = 0;

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren Locaties<br><br>Een ogenblik geduld aub...'
        });

        loDash.each(mijnPois, function (poiModel) {

          var poiId = poiModel.get('Id');

          dataFactoryExportPois.recordGPX(poiModel.get('lat'), poiModel.get('lng'), poiModel.get('naam'), poiModel.get('tekst'), poiId).then(function () {
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Exporteren Locaties<br><br><span class="trinl-rood"><b>' + poiModel.get('naam') + '</b></span><br><br>Een ogenblik geduld aub...'
            });
            watchGpxPois();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            uploadErrors.push({
              poiModel: poiModel
            });
            //console.error('PoisCtrl upload ERROR poi naam, err: ', poiModel.get('naam'), err);
            watchGpxPois();
          });
        });
      }

      var mijnPois = loDash.filter($scope.data.pois, function (poiModel) {
        return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      //console.log('PoisCtrl poiExporteerSelectie mijnPois: ', mijnPois);

      var aantalPois = mijnPois.length;
      $ionicLoading.hide();
      if (aantalPois === 0) {
        $ionicPopup.alert({
          title: 'Exporteren Locaties',
          content: 'Deze selectie heeft geen Locaties die van jou zijn.<br><br>Ga naar filter Mijn. Hierin staan al jouw Locaties.<br>Gebruik zoeken om de juiste (max. 3) Locaties te selecteren'
        });
      } else {
        if (aantalPois === 1) {
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft 1 Locatie:<br><br><span class="trinl-rood"><b>' + mijnPois[0].get('naam') + '</b></span><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporterenPois(mijnPois);
              }
            }]
          });
        } else {
          var poiNamen = '';
          loDash.each(mijnPois, function (poiModel) {
            poiNamen = poiNamen + '<br><span class="trinl-rood"><b>' + poiModel.get('naam') + '</b></span>';
          });
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft ' + aantalPois + ' Locaties:<br>' + poiNamen + '<br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporterenPois(mijnPois);
              }
            }]
          });
        }
      }
      //endRemoveIf(!xois)
      
      
      
      
      
    });
    $scope.$on('$destroy', event14);
    //
    // We gaan een nieuw bericht maken.Open het Formulier
    
    
    
    
    //
    $scope.clickedPoi = function (poiModel) {
      dataFactoryPoi.card = true;
      //console.warn('PoisCtrl clickedPoi dataFactoryPoi.card: ', poiModel, dataFactoryPoi.card);
      $state.go('pois.poiCard', {
        'Id': poiModel.get('Id')
      });
    };
    /**
     * Het clearkruisje van het zoekveld is getapped
     * Nogmaals filteren starten
     */
    $scope.clearSearchLabel = function () {
      //console.warn('PoisCtrl clearSearchLabel');
      $scope.search.label = '';
      $scope.data.pois = dataFactoryPoi.store;

      $rootScope.$emit('poiFiltered', {
        pois: $scope.data.pois
      });
    };
    //
    function sorteerDetailsTags(poiModel) {
      //
      //console.error('PoiCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(poiModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');

      var tagsStandaard = loDash.filter(poiModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');

      var tagsNormaal = loDash.filter(poiModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.get('tag'), 'asc');

      poiModel.xData.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function initxData(poiModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!poiModel.xData) {
        poiModel.xData = {};
        //console.log('PoisCtrl updatePoi xData: ', poiModel.xData);
      }
      if (!poiModel.xData.xois) {
        poiModel.xData.xois = [];
        //console.log('PoisCtrl updatePoi xData.xois: ', poiModel.xData.xois);
      }
      if (!poiModel.xData.fotos) {
        poiModel.xData.fotos = [];
        //console.log('PoisCtrl updatePoi xData.fotos: ', poiModel.xData.fotos);
      }
      if (!poiModel.xData.tags) {
        poiModel.xData.tags = [];
        //console.log('PoisCtrl updatePoi xData.tags: ', poiModel.xData.tags);
      }
      if (!poiModel.xData.groep) {
        poiModel.xData.groep = '';
        //console.log('PoisCtrl updatePoi xData.groep: ', poiModel.xData.groep);
      }
    }
    //
    $scope.doRefresh = function () {

      $rootScope.$emit('refreshPoi');

      //console.error('PoisCtrl doReload broadcast reloadComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
    //
    $scope.$on('elemHasFocus', function (event, args) {

      //console.warn('PoisCtrl elemHasFocus event: ', args);
      //
      if (args.message === 'Zoek in locaties') {
        $timeout(function () {
          //console.error('PoisCtrl elemHasFocus scrollTop $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('poiList').scrollTop(true);
        });
      }
    });
    
    
  }
]);
