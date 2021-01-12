/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef


    
//removeIf(!fotos)
trinl.controller('FotosCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryFoto', 'dataFactoryFotos', 'dataFactoryFotoSup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactoryFotoTag', 'dataFactoryTrack', 'dataFactoryExportFotos', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactoryFoto, dataFactoryFotos, dataFactoryFotoSup, dataFactoryTag, dataFactoryCeo, dataFactoryFotoTag, dataFactoryTrack, dataFactoryExportFotos, dataFactoryCodePush) {
    //endRemoveIf(!fotos)
    
    
  
    $scope.data = {};
    if (!$scope.data.fotos) {
      $scope.data.fotos = [];
    }
    //
    var fotoCard = false;
    //
    $scope.details = {
      mode: 'foto'
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
    var lastArgs = dataFactoryConfig.currentModel.get('fotoFilter');
    console.log('FotoSideMenuCtrl fotoFilter from config: ', lastArgs);
    //
    var filter = {
      filter: lastArgs.tag
    };
    //
    console.log('FotosCtrl lastArgs from config: ', lastArgs);

    if (lastArgs.filter === 'Tag') {
      $rootScope.$emit('setNavTitleEvent', filter);
    }
    //
    var refreshEvent = $rootScope.$on('fotosRefresh', function () {
      refresh();
    });
    $scope.$on('$destroy', refreshEvent);
    //
    //  FotosTeload wordt getriggerd door sideMenu als een label wordt gewijzihd
    //
    var reloadEvent = $rootScope.$on('fotosReload', function () {
      reload();
    });
    $scope.$on('$destroy', reloadEvent);
    //
    var fotoPredicate = $rootScope.$on('fotoPredicate', function (event, args) {

      console.log('FotosCtrl fotoPredicate event fotoSorter set to: ', args);

      $scope.predicate = args.predicate;
      $scope.reverse = args.reverse;

      dataFactoryConfig.currentModel.set('fotoSorter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      console.log('FotosCtrl fotoPredicate event fotoSorter saved in config: ', args);
    });
    $scope.$on('$destroy', fotoPredicate);
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

      console.warn('FotosCtrl $ionicView.ecnter');

      if (!dataFactoryFoto.card) {
        $ionicSideMenuDelegate.toggleLeft();
      }

      if ($scope.data.fotos.length === 0) {
        $rootScope.$emit('fotosFilter');
      }
      
      
      
      //removeIf(!fotos)
      dataFactoryFoto.currentTrackId = '';
      dataFactoryTrack.tmpArray = [];
      dataFactoryTrack.tmpArray2 = [];
      dataFactoryTrack.selected = [];
      $rootScope.$emit('trackKaart');

      $rootScope.$emit('startClockFoto');
      $rootScope.$emit('sleepClockBericht');
      $rootScope.$emit('sleepClockPoi');
      $rootScope.$emit('sleepClockTrack');
      //endRemoveIf(!fotos)
      
      
      
      
      
    });
    $scope.$on('$destroy', event0);
    //
    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      if (dataFactoryFoto.card) {
        console.warn('FotoCtrl $ionicView.beforeLeave, dataFactoryFoto.card: ', dataFactoryFoto.card);
        $rootScope.$emit('sleepClockFoto');
      }
    });
    $scope.$on('$destroy', event0b);
    //
    var event2 = $rootScope.$on('fotoDeleteTagOverall', function (event, args) {
      //
      // Nu nog in details en modellen
      //
      var tagModel = args;
      var tagId = tagModel.get('Id');

      console.warn('+++ FotosCtrl fotoDeleteTags tagId: ', tagId);
      //
      //	Verwijder in mijn fotoSupStore en update
      //
      var chunkDelete = loDash.chunk(dataFactoryFotoSup.store, 10);

      function doChunkDelete(chunkDelete, index) {

        console.warn('FotosCtrl doChunkDelete');

        if (index >= chunkDelete.length) {
          console.log('FotosCtrl doChunkDelete READY');
          return;
        }

        var promises = [];

        loDash.each(chunkDelete[index], function (fotoSupModel) {
          //
          //	Alleen supModel eigenaar
          //
          if (fotoSupModel) {
            console.log('FotosCtrl doChunksDelete', fotoSupModel);
            if (fotoSupModel.eigenaar === false) {
              loDash.remove(fotoSupModel.tags, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });
              if (fotoSupModel.tags) {
                promises.push(fotoSupModel.save());
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
      //	Verwijder in mijn fotoStore en update
      //
      loDash.each(dataFactoryFoto.store, function (fotoModel) {
        if (!fotoModel.xData) {
          fotoModel.xData = {};
        }
        if (!fotoModel.xData.sup) {
          fotoModel.xData.sup = {};
        }
        if (!fotoModel.xData.xois) {
          fotoModel.xData.xois = [];
        }
        if (!fotoModel.xData.fotos) {
          fotoModel.xData.fotos = [];
        }
        if (!fotoModel.xData.tags) {
          fotoModel.xData.tags = [];
        }
        loDash.remove(fotoModel.xData.tags, function (fotoTagModel) {
          return fotoTagModel.get('tagId') === tagId;
        });
      });
      console.log('FotosCtrl fotoDeleteTags after doChunkDelete fotoStore: ', dataFactoryFoto.store);
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
        $rootScope.$emit('fotosFilter');
      });

    });
    $scope.$on('$destroy', event2);
    //
    var event3 = $rootScope.$on('fotoEditTagOverall', function (event, args) {

      var tagModel = args;
      var tagId = tagModel.get('Id');
      var tagTekst = tagModel.get('tag');
      console.warn('+++ FotosCtrl fotoEditTags tagId, tagTekst: ', tagId, tagTekst);
      //
      //	Wijzig in tagStore en update
      //
      console.warn('+++ FotosCtrl fotoEditTags tagStore update: ', dataFactoryTag.store);
      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('Id') === tagId) {
          tagModel.set('tag', tagTekst);
          tagModel.save();
        }
      });
      //
      //	Verwijder in mijn fotoSupStore en update
      //
      var chunkEdit = loDash.chunk(dataFactoryFotoSup.store, 10);
      console.log(chunkEdit);

      function doChunkEdit(chunkEdit, index) {

        console.warn('FotosCtrl doChunkEdit');

        if (index >= chunkEdit.length) {
          console.log('FotosCtrl doChunkEdit READY');
          return;
        }

        var promises = [];

        loDash.each(chunkEdit[index], function (fotoSupModel) {
          //
          //	Alleen supmodellen eigenaar
          //
          if (fotoSupModel.eigenaar === false) {

            loDash.each(fotoSupModel.tags, function (tagModel) {
              if (tagModel.tagId === tagId) {
                tagModel.tag = tagTekst;
              }
            });
            if (fotoSupModel.tags) {
              promises.push(fotoSupModel.save());
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkEdit(chunkEdit, index + 1);
        });
      }

      doChunkEdit(chunkEdit, 0);

      //
      // Wijzig mijn fotoStore
      //
      loDash.each(dataFactoryFoto.store, function (fotoModel) {

        console.log('FotosCtrl EditAllLabels, fotoModel: ', fotoModel);

        initxData(fotoModel);

        loDash.each(fotoModel.xData.tags, function (fotoTagModel) {
          if (fotoTagModel.get('tagId') === tagId) {
            {
              fotoTagModel.xData.set('tag', tagTekst);
            }
          }
        });
      });

      $rootScope.$emit('fotosFilter');
    });
    $scope.$on('$destroy', event3);
    //
    function doVerwijderen(mijnFotos) {
      console.time('Verwijderen');

      $ionicLoading.show({
        template: 'Verwijderen Locaties Selectie<br><br><span class="trinl-rood"><b>' + filter.filter + '</b></span><br><br><br>Een ogenblik geduld aub...'
      });

      var chunkRemove = loDash.chunk(mijnFotos, 10);
      console.log(chunkRemove);

      function doChunkRemove(chunkRemove, index) {

        console.warn('FotosCtrl doChunkRemove, index: ', index);

        if (index >= chunkRemove.length) {
          console.log('FotosCtrl doChunkRemove READY');
          $ionicLoading.hide();

          $rootScope.$emit('sideMenuFotosFilter', {
            filter: 'Alle'
          });
          console.timeEnd('Verwijderen');
          return;
        }
        //
        // Loop fotomodellen
        //
        //var promises = [];

        loDash.each(chunkRemove[index], function (fotoModel) {

          var fotoId = fotoModel.get('Id');

          console.warn('FotosCtrl doChunkRemove, index: ', index);
          //
          // Filter de fototags van dit fotomodel
          //
          var fototags = loDash.filter(dataFactoryFotoTag.store, function (fototagModel) {
            return fototagModel.get('fotoId') === fotoId;
          });
          console.warn('FotosCtrl doChunkRemove, fototags from Id: ', fototags, fotoModel.get('Id'), fotoModel.get('naam'));
          //
          // De fototags van dit model worden later verwijderd
          // Er is nu tijd om de FotoSideMenuCtrl te informeren om zijn tags bij te werken
          // Verwijder de fototag ook in backend
          //
          loDash.each(fototags, function (fotoTagModel) {

            var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === fotoTagModel.get('tagId');
            });
            //
            // Verwijder fotoTagModellen op backend
            //
            if (tagModel) {

              console.warn('FotosCtrl doChunkRemove, verwijder fototag: ', tagModel.get('tag'));

              fotoTagModel.xData = tagModel;

              $rootScope.$emit('fotoRemoveLabel', {
                fotoModel: fotoModel,
                tagModel: tagModel
              });
            }
          });

          loDash.remove(dataFactoryFotoSup.store, function (fotosup) {
            return fotosup.get('fotoId') === fotoModel.get('Id');
          });
          loDash.remove(dataFactoryFotoSup.data, function (dataItem) {
            return dataItem.record.get('fotoId') === fotoModel.get('Id');
          });
          loDash.remove(dataFactoryFotoTag.store, function (fotoTagModel) {
            return fotoTagModel.get('fotoId') === fotoId;
          });
          loDash.remove(dataFactoryFotoTag.data, function (dataItem) {
            return dataItem.record.get('fotoId') === fotoId;
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

          loDash.remove(dataFactoryFoto.store, function (fotoModel) {
            return fotoModel.get('Id') === fotoId;
          });
          loDash.remove(dataFactoryFoto.data, function (dataItem) {
            return dataItem.record.get('Id') === fotoId;
          });
          fotoModel.remove();
        });

        doChunkRemove(chunkRemove, index + 1);
      }

      doChunkRemove(chunkRemove, 0);

      $scope.data.fotos = [];
      $rootScope.$emit('fotosNieuweAantallen');
      $rootScope.$emit('fotosFilter');
    }
    //
    var event12 = $rootScope.$on('fotoVerwijderSelectie', function (event, args) {
      //
      console.error('Verwijderen Selectie ceo data.fotos:  ', $scope.ceo.Id, $scope.data.fotos);
      //
      var mijnFotos = loDash.filter($scope.data.fotos, function (fotoModel) {
        return fotoModel.get('gebruikerId') === $scope.ceo.Id;
      });
      console.error('MijnFotos aantal: ', mijnFotos.length);

      if (mijnFotos.length === 0) {
        $ionicPopup.alert({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat <span class="trinl-rood">geen</span> Locaties die van jou zijn.',
        });
      }

      if (mijnFotos.length > 1) {

        var fotoNamen = '';
        loDash.each(mijnFotos, function (fotoModel) {
          fotoNamen = fotoNamen + '<br><span class="trinl-rood"><b>' + fotoModel.get('naam') + '</b></span>';
        });
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat ' + mijnFotos.length + ' Locaties:<br>' + fotoNamen + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnFotos);
            }
          }]
        });
      }

      if (mijnFotos.length === 1) {
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat 1 Locatie:<br>' + mijnFotos[0].get('naam') + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnFotos);
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
    function watchLabelGeenLabelFoto(tagModel) {
      done += 1;
      console.log('watchLabelGeenLabelFoto todo, done: ', todo, done);
      if (done >= todo) {

        $rootScope.$emit('fotosNieuweAantallen');
        filter.filter = tagModel.get('tag');
        $rootScope.$emit('fotosFilter', {
          filter: 'Tag',
          tag: tagModel.get('tag')
        });
        $rootScope.$emit('setNavTitleEvent', filter);
        $state.go('fotos.fotos');
      }
    }
    //
    var event13 = $rootScope.$on('labelGeenLabelFoto', function (event, args) {

      console.warn('FotosCtrl event labelGeenLabelFoto args: ', args.tagModel);

      var tagModel = args.tagModel;

      var tagId = tagModel.get('Id');

      var fotosZonderLabel = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
        if (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {

          initxData(fotoModel);
          if (fotoModel.xData.tags !== undefined) {
            return fotoModel.xData && fotoModel.xData.tags.length === 0;
          } else {
            return true;
          }
        }
      });
      todo = fotosZonderLabel.length;

      loDash.each(fotosZonderLabel, function (fotoModel) {

        var fotoId = fotoModel.get('Id');
        console.log('FotosCtrl event labelGeenLabelFoto fotosZonderLabel fotoId, fotoNaam: ', fotoId, fotoModel.get('naam'));

        var fotoTagModel = new dataFactoryFotoTag.Model();
        fotoTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        fotoTagModel.set('fotoId', fotoId);
        fotoTagModel.set('tagId', tagId);
        fotoTagModel.save().then(function () {

          fotoTagModel.xData = tagModel;

          console.log('FotosCtrl labelGeenLabelFoto fototag TOEVOEGEN in  SideMenu: ', fotoModel.get('naam'), tagModel.get('tag'));
          console.log('FotosCtrl labelGeenLabelFoto fototag TOEVOEGEN in  fotoModel.xData.tags: ', fotoModel.get('naam'), addFotoTagModel);

          fotoModel.xData.tags.push(fotoTagModel);
          $rootScope.$emit('fotoAddLabel', {
            fotoModel: fotoModel,
            tagModel: tagModel
          });
          watchLabelGeenLabelFoto(tagModel);
        });
      });
    });
    $scope.$on('$destroy', event13);
    //
    var event4 = $rootScope.$on('fotoStartSearch', function () {

      console.warn('+++ fotoCtrl fotoStartSearch');

      $scope.data.fotos = [];
    });
    $scope.$on('$destroy', event4);
    //
    function finishFilter() {

      $timeout(function () {

        dataFactoryFoto.selected = $scope.data.fotos;

        //loDash.each($scope.data.fotos, function (fotoModel) {
          //sorteerDetailsTags(fotoModel);
        //});

        console.log('FotosCtrl finishFilter FILTER AANTAL fotos selected: ', dataFactoryFoto.selected);
        //
        
        //removeIf(berichten)
        // Laat KaartCtrl weten dat de geselecteerde Sporen is gewijzigd
        //
        $rootScope.$emit('fotoKaart', {
          fotos: dataFactoryFoto.selected
        });
        //endRemoveIf(berichten)
        

        $timeout(function () {
          console.log('FotoCtrl finishFilter $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('fotoList').scrollTop(true);
          //$ionicScrollDelegate.scrollTop(true);

        });
      }, 500);
    }
    //
    var event5 = $rootScope.$on('fotosFilter', function (event, args) {

      console.error('FotosCtrl on.fotosFilter: ', args);

      //
      // Indien geen argumenten dan de oude filter toepassen
      //
      if (args === undefined) {
        args = lastArgs;
      } else {
        lastArgs = args;
      }

      dataFactoryConfig.currentModel.set('fotoFilter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      console.log('FotosCtrl laatste fotosFilter saved in config: ', args);

      if (args.filter === 'Mijn') {
        console.warn('FotosCtrl fotosFilter: Mijn');
        $scope.data.fotos = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
          return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Public') {
        console.warn('FotosCtrl fotosFilter: Public');
        $scope.data.fotos = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
          return fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Alle') {
        console.warn('FotosCtrl fotosFilter: Alle');
        $scope.data.fotos = loDash.each(dataFactoryFoto.store);
        finishFilter();
      }

      if (args.filter === 'Geen label') {

        console.warn('FotosCtrl fotosFilter: Geen label');

        $scope.data.fotos = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
          if (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            console.warn('FotosCtrl fotosFilter Geen label in fotoModel: ', fotoModel);
            if (fotoModel.xData === undefined) {
              return false;
            }
            console.warn('FotosCtrl fotosFilter fotoModel.xData: ', fotoModel.xData);
            if (fotoModel.xData.tags !== undefined) {
              return fotoModel.xData && fotoModel.xData.tags.length === 0;
            } else {
              return true;
            }
          }
        });

        console.log('FotosCtrl ongelabeld aantal fotos: ', $scope.data.fotos);

        finishFilter();
      }

      if (args.filter === 'Tag') {

        console.warn('FotosCtrl fotosFilter: Tag:', args.tag);

        $scope.data.fotos = loDash.filter(dataFactoryFoto.store, function (fotoModel) {

          initxData(fotoModel);
          console.log('FotosCtrl fotosFilter Tag fotoModel naam: ', fotoModel.get('naam'));
          console.log('FotosCtrl fotosFilter Tag fotoModel naam: ', fotoModel.xData.tags);
          if (fotoModel.xData.tags.length >= 1) {
            console.warn('FotosCtrl fotosFilter Tag: ', fotoModel.xData.tags.tag);
          }
          var found = loDash.find(fotoModel.xData.tags, function (fotoTagModel) {
            return fotoTagModel.xData.get('tag') === args.tag;
          });
          return found;
        });
        finishFilter();
      }

      if (args.filter === 'Geen') {
        console.warn('FotosCtrl fotosFilter: Geen');
        $scope.data.fotos = [];
        console.log('FotosCtrl ongelabeld aantal fotos: ', $scope.data.fotos);
        finishFilter();
      }

      if (args.filter === 'Search') {
        console.log('FotosCtrl fotosFilter: Search', args);

        if (args.search === '') {
          $scope.search.label = '';
          $scope.data.fotos = [];
          console.log('FotosCtrl fotosFilter: geen Search');
          finishFilter();
        } else {
          $scope.data.fotos = dataFactoryFoto.store;
          $timeout(function () {
            finishFilter();
          }, 10);
        }
      }

      if (args.filter === 'Nieuw') {
        console.warn('FotosCtrl fotosFilter: Nieuw');
        $scope.data.fotos = dataFactoryFoto.nieuw;
        finishFilter();
      }

      if (args.filter === 'Favorieten') {

        console.warn('FotosCtrl fotosFilter: Favorieten');

        $scope.data.fotos = dataFactoryFoto.star;

        console.log('FotosCtrl nieuwe fotos: ', dataFactoryFoto.star);
        finishFilter();
      }
    });
    $scope.$on('$destroy', event5);
    //
    var event10 = $rootScope.$on('deleteLabel', function (event, args) {

      console.warn('FotosCtrl event deleteLabel: ', args);

      loDash.each(dataFactoryFoto.store, function (fotoModel) {

        initxData(fotoModel);

        var fotoTags = loDash.remove(fotoModel.xData.tags, function (fotoTagModel) {
          return fotoTagModel.get('tagId') === args.tagId;
        });
        loDash.each(fotoTags, function (fotoTagModel) {
          (function (fotoTagModel) {
            fotoTagModel.remove();
          }(fotoTagModel));
        });
      });
    });
    $scope.$on('$destroy', event10);
    //
    // eslint-disable-next-line no-unused-vars
    var event14 = $rootScope.$on('fotoExporteerSelectie', function (event, args) {
      
      
      
      //removeIf(!fotos)
      var gpxNaam;
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];
 
      function watchGpxFotosErrors() {
 
        console.warn('FotosCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);
 
        gpxDoneErrors += 1;
        if (gpxDoneErrors >= gpxTodoErrors) {
 
          $ionicLoading.hide();
 
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportFotos.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Locaties',
                content: 'Exporteren gereed',
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
 
      function watchGpxFotos() {
 
        console.warn('FotosCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo);
 
        gpxDone += 1;
        if (gpxDone >= gpxTodo) {
 
          $ionicLoading.hide();
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportFotos.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Locaties',
                content: 'Exporteren gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $timeout(function () {
                doExporterenErrorsFotos(uploadErrors);
              }, 1000);
            }
          }, 500);
        }
      }
 
      function doExporterenErrorsFotos(uploadErrors) {
        gpxTodoErrors = uploadErrors.length;
        gpxDoneErrors = 0;
 
        var uploadErrorsX = loDash.filter(uploadErrors, function () {
          return true;
        });
 
        loDash.each(uploadErrorsX, function (uploadError) {
 
          var fotoModel = uploadError.fotoModel;
          var fotoId = fotoModel.get('Id');
          var base64String = uploadError.base64String;
 
          console.log('FotosCtrl uploadError fotoModel, uploadError: ', fotoModel, uploadError);
 
          dataFactoryExportFotos.recordGPX(fotoModel.get('lat'), fotoModel.get('lng'), fotoModel.get('naam'), fotoModel.get('tekst'), fotoId, base64String).then(function () {
 
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren ' + uploadErrors.length + ' foutieve uploads\'s<br><br>Een ogenblik geduld aub...'
            });
            loDash.remove(uploadErrors, function (uploadError) {
              return uploadError.fotoModel.get('Id') === fotoId;
            });
            watchGpxFotosErrors();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            console.error('FotosCtrl uploadError ERROR err: ', err);
            watchGpxFotosErrors();
          });
        });
      }
 
      function doExporterenFotos(mijnFotos) {
        gpxTodo = mijnFotos.length;
        gpxDone;
 
        dataFactoryExportFotos.openGPX();
 
        if (mijnFotos.length === 1) {
          gpxNaam = mijnFotos[0].get('naam');
        } else {
          gpxNaam = args.filter;
        }
 
        gpxDone = 0;
 
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren Locaties<br><br>Een ogenblik geduld aub...'
        });
 
        loDash.each(mijnFotos, function (fotoModel) {
 
          var fotoId = fotoModel.get('Id');
          //var exportNaam = fotoModel.get('naam');
          var content;
 
          console.warn('FotoCardCtrl fotoModel: ', fotoModel, fotoModel.get('naam'));
          (function (fotoModel) {
 
            dataFactoryFotos.getFotoSrc(fotoModel.get('gebruikerId'), fotoModel.get('dir'), fotoModel.get('fotoId'), fotoModel.get('extension')).then(function (result) {
              content = result;
 
              console.warn('FotosCtrl prep export content: ', content);
 
              var img = new Image();
              img.crossOrigin = 'Anonymous';
              img.setAttribute('style', 'display:none');
              img.setAttribute('alt', 'script div');
              img.setAttribute('src', content);
              console.log('FotosCtrl prep export img: ', img);
 
              img.onload = function () {
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                c.height = img.naturalHeight;
                c.width = img.naturalWidth;
                ctx.drawImage(img, 0, 0, c.width, c.height);
                var uri = c.toDataURL('image/jpg'),
                  base64String = uri.replace(/^data:image.+;base64,/, '');
                console.log('FotosCtrl prep export base64String: ', base64String);
                dataFactoryExportFotos.recordGPX(fotoModel.get('lat'), fotoModel.get('lng'), fotoModel.get('naam'), fotoModel.get('tekst'), fotoId, base64String).then(function () {
                  $ionicLoading.show({
                    template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Exporteren Locaties<br><br><span class="trinl-rood"><b>' + fotoModel.get('naam') + '</b></span><br><br>Een ogenblik geduld aub...'
                  });
                  watchGpxFotos();
                // eslint-disable-next-line no-unused-vars
                }).catch(function (err) {
                  uploadErrors.push({
                    fotoModel: fotoModel,
                    base64String: base64String
                  });
                  console.log('FotosCtrl upload ERROR uploadErrors: ', uploadErrors);
                  console.error('FotosCtrl upload ERROR foto naam, err: ', fotoModel.get('naam'), err);
                  watchGpxFotos();
                });
              };
            });
          })(fotoModel);
        });
      }
 
      var mijnFotos = loDash.filter($scope.data.fotos, function (fotoModel) {
        return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var aantalFotos = mijnFotos.length;
      $ionicLoading.hide();
      if (aantalFotos === 0) {
        $ionicPopup.alert({
          title: 'Exporteren Locaties',
          content: 'Deze selectie heeft geen Locaties van jou.<br><br>Ga naar filter Mijn. Hierin staan al jouw Locaties.<br>Gebruik zoeken om de juiste (max. 3) Locaties te selecteren'
        });
      } else {
        if (aantalFotos === 1) {
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft 1 Locatie van jou:<br><br><span class="trinl-rood"><b>' + mijnFotos[0].get('naam') + '</b></span><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporterenFotos(mijnFotos);
              }
            }]
          });
        } else {
          var fotoNamen = '';
          loDash.each(mijnFotos, function (fotoModel) {
            fotoNamen = fotoNamen + '<br><span class="trinl-rood"><b>' + fotoModel.get('naam') + '</b></span>';
          });
          $ionicLoading.hide();
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft ' + aantalFotos + ' Locaties:<br><br>' + fotoNamen + '<br><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</br>',
              type: 'button-positive',
              onTap: function () {
                doExporterenFotos(mijnFotos);
              }
            }]
          });
        }
      }
      //endRemoveIf(!fotos)
      
      
      
    });
    $scope.$on('$destroy', event14);
    //
    // We gaan een nieuw bericht maken.Open het Formulier
    
    
    
    //removeIf(!fotos)
    $scope.maakFoto = function () {
      //
      dataFactoryCodePush.getPendingPackage();
      //
      if (dataFactoryCodePush.pendingPackage) {
        $ionicPopup.confirm({
          title: 'TRINL update staat klaar',
          content: '<span class="trinl-rood">Om een foto te maken moet eerst deze update geactiveerd worden.<br><br>Update versienr: ' + dataFactoryCodePush.appVersion + '</span><br><br>Toelichting: <br><span class="trinl-blauw">' + dataFactoryCodePush.description + '</span>',
          buttons: [{
            text: 'Later'
          }, {
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function () {
              codePush.restartApplication();
            }
          }]
        });

      } else {
        dataFactoryFotos.addPicture().then(function () {
          refresh();
          // eslint-disable-next-line no-unused-vars
        }, function (err) {
          //dataFactorySync.enableSyncOnResume = true;
          console.error('FotosCtrl maakFoto ERROR: ', err);
        });
      }
    };
    //endRemoveIf(!fotos)
    
    //
    $scope.clickedFoto = function (fotoModel) {
      dataFactoryFoto.card = true;
      console.warn('FotosCtrl clickedFoto dataFactoryFoto.card: ', fotoModel, dataFactoryFoto.card);
      $state.go('fotos.fotoCard', {
        'Id': fotoModel.get('Id')
      });
    };
    /**
     * Het clearkruisje van het zoekveld is getapped
     * Nogmaals filteren starten
     */
    $scope.clearSearchLabel = function () {
      console.warn('FotosCtrl clearSearchLabel');
      $scope.search.label = '';
      $scope.data.fotos = dataFactoryFoto.store;

      $rootScope.$emit('fotoFiltered', {
        fotos: $scope.data.fotos
      });
    };
    //
    function sorteerDetailsTags(fotoModel) {
      //
      console.error('FotoCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(fotoModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');

      var tagsStandaard = loDash.filter(fotoModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');

      var tagsNormaal = loDash.filter(fotoModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.get('tag'), 'asc');

      fotoModel.xData.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function initxData(fotoModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!fotoModel.xData) {
        fotoModel.xData = {};
        console.log('FotosCtrl updateFoto xData: ', fotoModel.xData);
      }
      if (!fotoModel.xData.xois) {
        fotoModel.xData.xois = [];
        console.log('FotosCtrl updateFoto xData.xois: ', fotoModel.xData.xois);
      }
      if (!fotoModel.xData.fotos) {
        fotoModel.xData.fotos = [];
        console.log('FotosCtrl updateFoto xData.fotos: ', fotoModel.xData.fotos);
      }
      if (!fotoModel.xData.tags) {
        fotoModel.xData.tags = [];
        console.log('FotosCtrl updateFoto xData.tags: ', fotoModel.xData.tags);
      }
      if (!fotoModel.xData.groep) {
        fotoModel.xData.groep = '';
        console.log('FotosCtrl updateFoto xData.groep: ', fotoModel.xData.groep);
      }
    }
    //
    $scope.doRefresh = function () {

      $rootScope.$emit('refreshFoto');

      console.error('FotosCtrl doReload broadcast reloadComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
    //
    $scope.$on('elemHasFocus', function (event, args) {

      console.warn('FotosCtrl elemHasFocus event: ', args);
      //
      if (args.message === 'Zoek in locaties') {
        $timeout(function () {
          console.error('FotosCtrl elemHasFocus scrollTop $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('fotoList').scrollTop(true);
        });
      }
    });
    
    
  }
]);
