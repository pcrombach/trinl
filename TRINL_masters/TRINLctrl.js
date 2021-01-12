/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
//removeIf(!pois)
trinl.controller('__DataItem__sCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryTrack', 'dataFactory__DataItem__', 'dataFactory__DataItem__Sup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactory__DataItem__Tag',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactoryTrack, dataFactory__DataItem__, dataFactory__DataItem__Sup, dataFactoryTag, dataFactoryCeo, dataFactory__DataItem__Tag) {
    //endRemoveIf(!pois)
    /*  ###
//removeIf(!tracks)
trinl.controller('__DataItem__sCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryInstellingen', 'dataFactorySync', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryHelp', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactory__DataItem__', 'dataFactoryFoto', 'dataFactoryPoi', 'dataFactory__DataItem__Sup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactory__DataItem__Tag', 'dataFactoryExport__DataItem__s', 'dataFactoryTrackPoisFotos', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryInstellingen, dataFactorySync, dataFactoryConfig, dataFactoryConfigX, dataFactoryHelp, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactory__DataItem__, dataFactoryFoto, dataFactoryPoi, dataFactory__DataItem__Sup, dataFactoryTag, dataFactoryCeo, dataFactory__DataItem__Tag, dataFactoryExport__DataItem__s, dataFactoryTrackPoisFotos, dataFactoryCodePush) {
    //endRemoveIf(!tracks)
    ###  */
    /*  ###
//removeIf(!fotos)
trinl.controller('__DataItem__sCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactory__DataItem__', 'dataFactoryFotos', 'dataFactory__DataItem__Sup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactory__DataItem__Tag', 'dataFactoryTrack', 'dataFactoryExport__DataItem__s', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactory__DataItem__, dataFactoryFotos, dataFactory__DataItem__Sup, dataFactoryTag, dataFactoryCeo, dataFactory__DataItem__Tag, dataFactoryTrack, dataFactoryExport__DataItem__s, dataFactoryCodePush) {
    //endRemoveIf(!fotos)
    ###  */
    /*  ###
  //removeIf(!berichten)
  trinl.controller('__DataItem__sCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactory__DataItem__', 'dataFactoryFotos', 'dataFactory__DataItem__Sup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactory__DataItem__Tag', 'dataFactoryTrack', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryConfig, dataFactoryConfigX, dataFactory__DataItem__, dataFactoryFotos, dataFactory__DataItem__Sup, dataFactoryTag, dataFactoryCeo, dataFactory__DataItem__Tag, dataFactoryTrack, dataFactoryCodePush) {
    //endRemoveIf(!berichten)
    ###  */
    $scope.data = {};
    if (!$scope.data.__dataItem__s) {
      $scope.data.__dataItem__s = [];
    }
    //
    var __dataItem__Card = false;
    //
    $scope.details = {
      mode: '__dataItem__'
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
    var lastArgs = dataFactoryConfig.currentModel.get('__dataItem__Filter');
    console.log('__DataItem__SideMenuCtrl __dataItem__Filter from config: ', lastArgs);
    //
    var filter = {
      filter: lastArgs.tag
    };
    //
    console.log('__DataItem__sCtrl lastArgs from config: ', lastArgs);

    if (lastArgs.filter === 'Tag') {
      $rootScope.$emit('setNavTitleEvent', filter);
    }
    //
    var refreshEvent = $rootScope.$on('__dataItem__sRefresh', function () {
      refresh();
    });
    $scope.$on('$destroy', refreshEvent);
    //
    //  __DataItem__sTeload wordt getriggerd door sideMenu als een label wordt gewijzihd
    //
    var reloadEvent = $rootScope.$on('__dataItem__sReload', function () {
      reload();
    });
    $scope.$on('$destroy', reloadEvent);
    //
    var __dataItem__Predicate = $rootScope.$on('__dataItem__Predicate', function (event, args) {

      console.log('__DataItem__sCtrl __dataItem__Predicate event __dataItem__Sorter set to: ', args);

      $scope.predicate = args.predicate;
      $scope.reverse = args.reverse;

      dataFactoryConfig.currentModel.set('__dataItem__Sorter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      console.log('__DataItem__sCtrl __dataItem__Predicate event __dataItem__Sorter saved in config: ', args);
    });
    $scope.$on('$destroy', __dataItem__Predicate);
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

      console.warn('__DataItem__sCtrl $ionicView.ecnter');

      if (!dataFactory__DataItem__.card) {
        $ionicSideMenuDelegate.toggleLeft();
      }

      if ($scope.data.__dataItem__s.length === 0) {
        $rootScope.$emit('__dataItem__sFilter');
      }
      /*  ###
      //removeIf(!berichten)  
      $rootScope.$emit('startClockBericht');
      $rootScope.$emit('sleepClockFoto');
      $rootScope.$emit('sleepClockPoi');
      $rootScope.$emit('sleepClockTrack');
      //endRemoveIf(!berichten)
      ###  */
      /*  ###
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
      ###  */
      /*  ###
      //removeIf(!pois)
      dataFactory__DataItem__.currentTrackId = '';
      dataFactoryTrack.tmpArray = [];
      dataFactoryTrack.tmpArray2 = [];
      dataFactoryTrack.selected = [];
      $rootScope.$emit('trackKaart');

      $rootScope.$emit('startClockPoi');
      $rootScope.$emit('sleepClockBericht');
      $rootScope.$emit('sleepClockFoto');
      $rootScope.$emit('sleepClockTrack');
      //endRemoveIf(!pois)
      ###  */
      /*  ###
      //removeIf(!tracks)
      dataFactoryFoto.currentTrackId = '';
      dataFactoryPoi.currentTrackId = ''; 
      dataFactoryFoto.tmpArray = [];
      dataFactoryFoto.tmpArray2 = [];
      dataFactoryFoto.selected = [];
      $rootScope.$emit('fotoKaart');
      dataFactoryPoi.tmpArray = [];
      dataFactoryPoi.tmpArray2 = [];
      dataFactoryPoi.selected = [];
      $rootScope.$emit('poiKaart');

      $rootScope.$emit('startClockTrack');
      $rootScope.$emit('sleepClockBericht');
      $rootScope.$emit('sleepClockFoto');
      $rootScope.$emit('sleepClockPoi');
      //endRemoveIf(!tracks)
      ###  */
    });
    $scope.$on('$destroy', event0);
    //
    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      if (dataFactory__DataItem__.card) {
        console.warn('__DataItem__Ctrl $ionicView.beforeLeave, dataFactory__DataItem__.card: ', dataFactory__DataItem__.card);
        $rootScope.$emit('sleepClock__DataItem__');
      }
    });
    $scope.$on('$destroy', event0b);
    //
    var event2 = $rootScope.$on('__dataItem__DeleteTagOverall', function (event, args) {
      //
      // Nu nog in details en modellen
      //
      var tagModel = args;
      var tagId = tagModel.get('Id');

      console.warn('+++ __DataItem__sCtrl __dataItem__DeleteTags tagId: ', tagId);
      //
      //	Verwijder in mijn __dataItem__SupStore en update
      //
      var chunkDelete = loDash.chunk(dataFactory__DataItem__Sup.store, 10);

      function doChunkDelete(chunkDelete, index) {

        console.warn('__DataItem__sCtrl doChunkDelete');

        if (index >= chunkDelete.length) {
          console.log('__DataItem__sCtrl doChunkDelete READY');
          return;
        }

        var promises = [];

        loDash.each(chunkDelete[index], function (__dataItem__SupModel) {
          //
          //	Alleen supModel eigenaar
          //
          if (__dataItem__SupModel) {
            console.log('__DataItem__sCtrl doChunksDelete', __dataItem__SupModel);
            if (__dataItem__SupModel.eigenaar === false) {
              loDash.remove(__dataItem__SupModel.tags, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });
              if (__dataItem__SupModel.tags) {
                promises.push(__dataItem__SupModel.save());
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
      //	Verwijder in mijn __dataItem__Store en update
      //
      loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
        if (!__dataItem__Model.xData) {
          __dataItem__Model.xData = {};
        }
        if (!__dataItem__Model.xData.sup) {
          __dataItem__Model.xData.sup = {};
        }
        if (!__dataItem__Model.xData.pois) {
          __dataItem__Model.xData.pois = [];
        }
        if (!__dataItem__Model.xData.fotos) {
          __dataItem__Model.xData.fotos = [];
        }
        if (!__dataItem__Model.xData.tags) {
          __dataItem__Model.xData.tags = [];
        }
        loDash.remove(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
          return __dataItem__TagModel.get('tagId') === tagId;
        });
      });
      console.log('__DataItem__sCtrl __dataItem__DeleteTags after doChunkDelete __dataItem__Store: ', dataFactory__DataItem__.store);
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
        $rootScope.$emit('__dataItem__sFilter');
      });

    });
    $scope.$on('$destroy', event2);
    //
    var event3 = $rootScope.$on('__dataItem__EditTagOverall', function (event, args) {

      var tagModel = args;
      var tagId = tagModel.get('Id');
      var tagTekst = tagModel.get('tag');
      console.warn('+++ __DataItem__sCtrl __dataItem__EditTags tagId, tagTekst: ', tagId, tagTekst);
      //
      //	Wijzig in tagStore en update
      //
      console.warn('+++ __DataItem__sCtrl __dataItem__EditTags tagStore update: ', dataFactoryTag.store);
      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('Id') === tagId) {
          tagModel.set('tag', tagTekst);
          tagModel.save();
        }
      });
      //
      //	Verwijder in mijn __dataItem__SupStore en update
      //
      var chunkEdit = loDash.chunk(dataFactory__DataItem__Sup.store, 10);
      console.log(chunkEdit);

      function doChunkEdit(chunkEdit, index) {

        console.warn('__DataItem__sCtrl doChunkEdit');

        if (index >= chunkEdit.length) {
          console.log('__DataItem__sCtrl doChunkEdit READY');
          return;
        }

        var promises = [];

        loDash.each(chunkEdit[index], function (__dataItem__SupModel) {
          //
          //	Alleen supmodellen eigenaar
          //
          if (__dataItem__SupModel.eigenaar === false) {

            loDash.each(__dataItem__SupModel.tags, function (tagModel) {
              if (tagModel.tagId === tagId) {
                tagModel.tag = tagTekst;
              }
            });
            if (__dataItem__SupModel.tags) {
              promises.push(__dataItem__SupModel.save());
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkEdit(chunkEdit, index + 1);
        });
      }

      doChunkEdit(chunkEdit, 0);

      //
      // Wijzig mijn __dataItem__Store
      //
      loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {

        console.log('__DataItem__sCtrl EditAllLabels, __dataItem__Model: ', __dataItem__Model);

        initxData(__dataItem__Model);

        loDash.each(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
          if (__dataItem__TagModel.get('tagId') === tagId) {
            {
              __dataItem__TagModel.xData.set('tag', tagTekst);
            }
          }
        });
      });

      $rootScope.$emit('__dataItem__sFilter');
    });
    $scope.$on('$destroy', event3);
    //
    function doVerwijderen(mijn__DataItem__s) {
      console.time('Verwijderen');

      $ionicLoading.show({
        template: 'Verwijderen Locaties Selectie<br><br><span class="trinl-rood"><b>' + filter.filter + '</b></span><br><br><br>Een ogenblik geduld aub...'
      });

      var chunkRemove = loDash.chunk(mijn__DataItem__s, 10);
      console.log(chunkRemove);

      function doChunkRemove(chunkRemove, index) {

        console.warn('__DataItem__sCtrl doChunkRemove, index: ', index);

        if (index >= chunkRemove.length) {
          console.log('__DataItem__sCtrl doChunkRemove READY');
          $ionicLoading.hide();

          $rootScope.$emit('sideMenu__DataItem__sFilter', {
            filter: 'Alle'
          });
          console.timeEnd('Verwijderen');
          return;
        }
        //
        // Loop __dataItem__modellen
        //
        //var promises = [];

        loDash.each(chunkRemove[index], function (__dataItem__Model) {

          var __dataItem__Id = __dataItem__Model.get('Id');

          console.warn('__DataItem__sCtrl doChunkRemove, index: ', index);
          //
          // Filter de __dataItem__tags van dit __dataItem__model
          //
          var __dataItem__tags = loDash.filter(dataFactory__DataItem__Tag.store, function (__dataItem__tagModel) {
            return __dataItem__tagModel.get('__dataItem__Id') === __dataItem__Id;
          });
          console.warn('__DataItem__sCtrl doChunkRemove, __dataItem__tags from Id: ', __dataItem__tags, __dataItem__Model.get('Id'), __dataItem__Model.get('naam'));
          //
          // De __dataItem__tags van dit model worden later verwijderd
          // Er is nu tijd om de __DataItem__SideMenuCtrl te informeren om zijn tags bij te werken
          // Verwijder de __dataItem__tag ook in backend
          //
          loDash.each(__dataItem__tags, function (__dataItem__TagModel) {

            var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === __dataItem__TagModel.get('tagId');
            });
            //
            // Verwijder __dataItem__TagModellen op backend
            //
            if (tagModel) {

              console.warn('__DataItem__sCtrl doChunkRemove, verwijder __dataItem__tag: ', tagModel.get('tag'));

              __dataItem__TagModel.xData = tagModel;

              $rootScope.$emit('__dataItem__RemoveLabel', {
                __dataItem__Model: __dataItem__Model,
                tagModel: tagModel
              });
            }
          });

          loDash.remove(dataFactory__DataItem__Sup.store, function (__dataItem__sup) {
            return __dataItem__sup.get('__dataItem__Id') === __dataItem__Model.get('Id');
          });
          loDash.remove(dataFactory__DataItem__Sup.data, function (dataItem) {
            return dataItem.record.get('__dataItem__Id') === __dataItem__Model.get('Id');
          });
          loDash.remove(dataFactory__DataItem__Tag.store, function (__dataItem__TagModel) {
            return __dataItem__TagModel.get('__dataItem__Id') === __dataItem__Id;
          });
          loDash.remove(dataFactory__DataItem__Tag.data, function (dataItem) {
            return dataItem.record.get('__dataItem__Id') === __dataItem__Id;
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

          loDash.remove(dataFactory__DataItem__.store, function (__dataItem__Model) {
            return __dataItem__Model.get('Id') === __dataItem__Id;
          });
          loDash.remove(dataFactory__DataItem__.data, function (dataItem) {
            return dataItem.record.get('Id') === __dataItem__Id;
          });
          __dataItem__Model.remove();
        });

        doChunkRemove(chunkRemove, index + 1);
      }

      doChunkRemove(chunkRemove, 0);

      $scope.data.__dataItem__s = [];
      $rootScope.$emit('__dataItem__sNieuweAantallen');
      $rootScope.$emit('__dataItem__sFilter');
    }
    //
    var event12 = $rootScope.$on('__dataItem__VerwijderSelectie', function (event, args) {
      //
      console.error('Verwijderen Selectie ceo data.__dataItem__s:  ', $scope.ceo.Id, $scope.data.__dataItem__s);
      //
      var mijn__DataItem__s = loDash.filter($scope.data.__dataItem__s, function (__dataItem__Model) {
        return __dataItem__Model.get('gebruikerId') === $scope.ceo.Id;
      });
      console.error('Mijn__DataItem__s aantal: ', mijn__DataItem__s.length);

      if (mijn__DataItem__s.length === 0) {
        $ionicPopup.alert({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat <span class="trinl-rood">geen</span> Locaties die van jou zijn.',
        });
      }

      if (mijn__DataItem__s.length > 1) {

        var __dataItem__Namen = '';
        loDash.each(mijn__DataItem__s, function (__dataItem__Model) {
          __dataItem__Namen = __dataItem__Namen + '<br><span class="trinl-rood"><b>' + __dataItem__Model.get('naam') + '</b></span>';
        });
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat ' + mijn__DataItem__s.length + ' Locaties:<br>' + __dataItem__Namen + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijn__DataItem__s);
            }
          }]
        });
      }

      if (mijn__DataItem__s.length === 1) {
        $ionicPopup.confirm({
          title: 'Verwijderen Locaties',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat 1 Locatie:<br>' + mijn__DataItem__s[0].get('naam') + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijn__DataItem__s);
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
    function watchLabelGeenLabel__DataItem__(tagModel) {
      done += 1;
      console.log('watchLabelGeenLabel__DataItem__ todo, done: ', todo, done);
      if (done >= todo) {

        $rootScope.$emit('__dataItem__sNieuweAantallen');
        filter.filter = tagModel.get('tag');
        $rootScope.$emit('__dataItem__sFilter', {
          filter: 'Tag',
          tag: tagModel.get('tag')
        });
        $rootScope.$emit('setNavTitleEvent', filter);
        $state.go('__dataItem__s.__dataItem__s');
      }
    }
    //
    var event13 = $rootScope.$on('labelGeenLabel__DataItem__', function (event, args) {

      console.warn('__DataItem__sCtrl event labelGeenLabel__DataItem__ args: ', args.tagModel);

      var tagModel = args.tagModel;

      var tagId = tagModel.get('Id');

      var __dataItem__sZonderLabel = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
        if (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {

          initxData(__dataItem__Model);
          if (__dataItem__Model.xData.tags !== undefined) {
            return __dataItem__Model.xData && __dataItem__Model.xData.tags.length === 0;
          } else {
            return true;
          }
        }
      });
      todo = __dataItem__sZonderLabel.length;

      loDash.each(__dataItem__sZonderLabel, function (__dataItem__Model) {

        var __dataItem__Id = __dataItem__Model.get('Id');
        console.log('__DataItem__sCtrl event labelGeenLabel__DataItem__ __dataItem__sZonderLabel __dataItem__Id, __dataItem__Naam: ', __dataItem__Id, __dataItem__Model.get('naam'));

        var __dataItem__TagModel = new dataFactory__DataItem__Tag.Model();
        __dataItem__TagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        __dataItem__TagModel.set('__dataItem__Id', __dataItem__Id);
        __dataItem__TagModel.set('tagId', tagId);
        __dataItem__TagModel.save().then(function () {

          __dataItem__TagModel.xData = tagModel;

          console.log('__DataItem__sCtrl labelGeenLabel__DataItem__ __dataItem__tag TOEVOEGEN in  SideMenu: ', __dataItem__Model.get('naam'), tagModel.get('tag'));
          console.log('__DataItem__sCtrl labelGeenLabel__DataItem__ __dataItem__tag TOEVOEGEN in  __dataItem__Model.xData.tags: ', __dataItem__Model.get('naam'), add__DataItem__TagModel);

          __dataItem__Model.xData.tags.push(__dataItem__TagModel);
          $rootScope.$emit('__dataItem__AddLabel', {
            __dataItem__Model: __dataItem__Model,
            tagModel: tagModel
          });
          watchLabelGeenLabel__DataItem__(tagModel);
        });
      });
    });
    $scope.$on('$destroy', event13);
    //
    var event4 = $rootScope.$on('__dataItem__StartSearch', function () {

      console.warn('+++ __dataItem__Ctrl __dataItem__StartSearch');

      $scope.data.__dataItem__s = [];
    });
    $scope.$on('$destroy', event4);
    //
    function finishFilter() {

      $timeout(function () {

        dataFactory__DataItem__.selected = $scope.data.__dataItem__s;

        //loDash.each($scope.data.__dataItem__s, function (__dataItem__Model) {
          //sorteerDetailsTags(__dataItem__Model);
        //});

        console.log('__DataItem__sCtrl finishFilter FILTER AANTAL __dataItem__s selected: ', dataFactory__DataItem__.selected);
        //
        /*  ###
        //removeIf(berichten)
        // Laat KaartCtrl weten dat de geselecteerde Sporen is gewijzigd
        //
        $rootScope.$emit('__dataItem__Kaart', {
          __dataItem__s: dataFactory__DataItem__.selected
        });
        //endRemoveIf(berichten)
        ###  */

        $timeout(function () {
          console.log('__DataItem__Ctrl finishFilter $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('__dataItem__List').scrollTop(true);
          //$ionicScrollDelegate.scrollTop(true);

        });
      }, 500);
    }
    //
    var event5 = $rootScope.$on('__dataItem__sFilter', function (event, args) {

      console.error('__DataItem__sCtrl on.__dataItem__sFilter: ', args);

      //
      // Indien geen argumenten dan de oude filter toepassen
      //
      if (args === undefined) {
        args = lastArgs;
      } else {
        lastArgs = args;
      }

      dataFactoryConfig.currentModel.set('__dataItem__Filter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      console.log('__DataItem__sCtrl laatste __dataItem__sFilter saved in config: ', args);

      if (args.filter === 'Mijn') {
        console.warn('__DataItem__sCtrl __dataItem__sFilter: Mijn');
        $scope.data.__dataItem__s = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Public') {
        console.warn('__DataItem__sCtrl __dataItem__sFilter: Public');
        $scope.data.__dataItem__s = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Alle') {
        console.warn('__DataItem__sCtrl __dataItem__sFilter: Alle');
        $scope.data.__dataItem__s = loDash.each(dataFactory__DataItem__.store);
        finishFilter();
      }

      if (args.filter === 'Geen label') {

        console.warn('__DataItem__sCtrl __dataItem__sFilter: Geen label');

        $scope.data.__dataItem__s = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
          if (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            console.warn('__DataItem__sCtrl __dataItem__sFilter Geen label in __dataItem__Model: ', __dataItem__Model);
            if (__dataItem__Model.xData === undefined) {
              return false;
            }
            console.warn('__DataItem__sCtrl __dataItem__sFilter __dataItem__Model.xData: ', __dataItem__Model.xData);
            if (__dataItem__Model.xData.tags !== undefined) {
              return __dataItem__Model.xData && __dataItem__Model.xData.tags.length === 0;
            } else {
              return true;
            }
          }
        });

        console.log('__DataItem__sCtrl ongelabeld aantal __dataItem__s: ', $scope.data.__dataItem__s);

        finishFilter();
      }

      if (args.filter === 'Tag') {

        console.warn('__DataItem__sCtrl __dataItem__sFilter: Tag:', args.tag);

        $scope.data.__dataItem__s = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {

          initxData(__dataItem__Model);
          console.log('__DataItem__sCtrl __dataItem__sFilter Tag __dataItem__Model naam: ', __dataItem__Model.get('naam'));
          console.log('__DataItem__sCtrl __dataItem__sFilter Tag __dataItem__Model naam: ', __dataItem__Model.xData.tags);
          if (__dataItem__Model.xData.tags.length >= 1) {
            console.warn('__DataItem__sCtrl __dataItem__sFilter Tag: ', __dataItem__Model.xData.tags.tag);
          }
          var found = loDash.find(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
            return __dataItem__TagModel.xData.get('tag') === args.tag;
          });
          return found;
        });
        finishFilter();
      }

      if (args.filter === 'Geen') {
        console.warn('__DataItem__sCtrl __dataItem__sFilter: Geen');
        $scope.data.__dataItem__s = [];
        console.log('__DataItem__sCtrl ongelabeld aantal __dataItem__s: ', $scope.data.__dataItem__s);
        finishFilter();
      }

      if (args.filter === 'Search') {
        console.log('__DataItem__sCtrl __dataItem__sFilter: Search', args);

        if (args.search === '') {
          $scope.search.label = '';
          $scope.data.__dataItem__s = [];
          console.log('__DataItem__sCtrl __dataItem__sFilter: geen Search');
          finishFilter();
        } else {
          $scope.data.__dataItem__s = dataFactory__DataItem__.store;
          $timeout(function () {
            finishFilter();
          }, 10);
        }
      }

      if (args.filter === 'Nieuw') {
        console.warn('__DataItem__sCtrl __dataItem__sFilter: Nieuw');
        $scope.data.__dataItem__s = dataFactory__DataItem__.nieuw;
        finishFilter();
      }

      if (args.filter === 'Favorieten') {

        console.warn('__DataItem__sCtrl __dataItem__sFilter: Favorieten');

        $scope.data.__dataItem__s = dataFactory__DataItem__.star;

        console.log('__DataItem__sCtrl nieuwe __dataItem__s: ', dataFactory__DataItem__.star);
        finishFilter();
      }
    });
    $scope.$on('$destroy', event5);
    //
    var event10 = $rootScope.$on('deleteLabel', function (event, args) {

      console.warn('__DataItem__sCtrl event deleteLabel: ', args);

      loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {

        initxData(__dataItem__Model);

        var __dataItem__Tags = loDash.remove(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
          return __dataItem__TagModel.get('tagId') === args.tagId;
        });
        loDash.each(__dataItem__Tags, function (__dataItem__TagModel) {
          (function (__dataItem__TagModel) {
            __dataItem__TagModel.remove();
          }(__dataItem__TagModel));
        });
      });
    });
    $scope.$on('$destroy', event10);
    //
    // eslint-disable-next-line no-unused-vars
    var event14 = $rootScope.$on('__dataItem__ExporteerSelectie', function (event, args) {
      /*  ###
      //removeIf(!pois)
      var gpxNaam;
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];

      function watchGpx__DataItem__sErrors() {

        gpxDoneErrors += 1;

        console.warn('__DataItem__sCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);

        if (gpxDoneErrors >= gpxTodoErrors) {

          $ionicLoading.hide();

          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExport__DataItem__s.closeGPX(gpxNaam);
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

      function watchGpx__DataItem__s() {

        gpxDone += 1;

        console.warn('__DataItem__sCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo, uploadErrors.length);

        if (gpxDone >= gpxTodo) {

          $ionicLoading.hide();
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExport__DataItem__s.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Locaties',
                content: 'Exporteren gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $timeout(function () {
                doExporteren__DataItem__sErrors(uploadErrors);
              }, 1000);
            }
          }, 500);
        }
      }

      function doExporteren__DataItem__sErrors(uploadErrors) {

        gpxTodoErrors = uploadErrors.length;
        gpxDoneErrors = 0;

        var uploadErrorsX = loDash.filter(uploadErrors, function () {
          return true;
        });

        loDash.each(uploadErrorsX, function (uploadError) {

          var __dataItem__Model = uploadError.__dataItem__Model;
          var __dataItem__Id = __dataItem__Model.get('Id');
          var base64String = uploadError.base64String;

          console.log('__DataItem__sCtrl uploadError __dataItem__Model, uploadError: ', __dataItem__Model, uploadError);

          dataFactoryExport__DataItem__s.recordGPX(__dataItem__Model.get('lat'), __dataItem__Model.get('lng'), __dataItem__Model.get('naam'), __dataItem__Model.get('tekst'), __dataItem__Id, base64String).then(function () {

            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren ' + uploadErrors.length + ' foutieve uploads\'s<br><br>Een ogenblik geduld aub...'
            });
            loDash.remove(uploadErrors, function (uploadError) {
              return uploadError.__dataItem__Model.get('Id') === __dataItem__Id;
            });
            watchGpx__DataItem__sErrors();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            console.error('__DataItem__sCtrl uploadError ERROR err: ', err);
            watchGpx__DataItem__sErrors();
          });
        });
      }

      function doExporteren__DataItem__s(mijn__DataItem__s) {

        console.warn('__DataItem__sCtrl doExporteren__DataItem__s');

        gpxTodo = mijn__DataItem__s.length;
        gpxDone;

        dataFactoryExport__DataItem__s.openGPX();

        if (mijn__DataItem__s.length === 1) {
          gpxNaam = mijn__DataItem__s[0].get('naam');
        } else {
          gpxNaam = args.filter;
        }

        gpxDone = 0;

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren Locaties<br><br>Een ogenblik geduld aub...'
        });

        loDash.each(mijn__DataItem__s, function (__dataItem__Model) {

          var __dataItem__Id = __dataItem__Model.get('Id');

          dataFactoryExport__DataItem__s.recordGPX(__dataItem__Model.get('lat'), __dataItem__Model.get('lng'), __dataItem__Model.get('naam'), __dataItem__Model.get('tekst'), __dataItem__Id).then(function () {
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Exporteren Locaties<br><br><span class="trinl-rood"><b>' + __dataItem__Model.get('naam') + '</b></span><br><br>Een ogenblik geduld aub...'
            });
            watchGpx__DataItem__s();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            uploadErrors.push({
              __dataItem__Model: __dataItem__Model
            });
            console.error('__DataItem__sCtrl upload ERROR __dataItem__ naam, err: ', __dataItem__Model.get('naam'), err);
            watchGpx__DataItem__s();
          });
        });
      }

      var mijn__DataItem__s = loDash.filter($scope.data.__dataItem__s, function (__dataItem__Model) {
        return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      console.log('__DataItem__sCtrl __dataItem__ExporteerSelectie mijn__DataItem__s: ', mijn__DataItem__s);

      var aantal__DataItem__s = mijn__DataItem__s.length;
      $ionicLoading.hide();
      if (aantal__DataItem__s === 0) {
        $ionicPopup.alert({
          title: 'Exporteren Locaties',
          content: 'Deze selectie heeft geen Locaties die van jou zijn.<br><br>Ga naar filter Mijn. Hierin staan al jouw Locaties.<br>Gebruik zoeken om de juiste (max. 3) Locaties te selecteren'
        });
      } else {
        if (aantal__DataItem__s === 1) {
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft 1 Locatie:<br><br><span class="trinl-rood"><b>' + mijn__DataItem__s[0].get('naam') + '</b></span><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporteren__DataItem__s(mijn__DataItem__s);
              }
            }]
          });
        } else {
          var __dataItem__Namen = '';
          loDash.each(mijn__DataItem__s, function (__dataItem__Model) {
            __dataItem__Namen = __dataItem__Namen + '<br><span class="trinl-rood"><b>' + __dataItem__Model.get('naam') + '</b></span>';
          });
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft ' + aantal__DataItem__s + ' Locaties:<br>' + __dataItem__Namen + '<br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporteren__DataItem__s(mijn__DataItem__s);
              }
            }]
          });
        }
      }
      //endRemoveIf(!pois)
      ###  */
      /*  ###
      //removeIf(!fotos)
      var gpxNaam;
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];
 
      function watchGpxFotosErrors() {
 
        console.warn('__DataItem__sCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);
 
        gpxDoneErrors += 1;
        if (gpxDoneErrors >= gpxTodoErrors) {
 
          $ionicLoading.hide();
 
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExport__DataItem__s.closeGPX(gpxNaam);
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
 
        console.warn('__DataItem__sCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo);
 
        gpxDone += 1;
        if (gpxDone >= gpxTodo) {
 
          $ionicLoading.hide();
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExport__DataItem__s.closeGPX(gpxNaam);
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
 
          var __dataItem__Model = uploadError.__dataItem__Model;
          var __dataItem__Id = __dataItem__Model.get('Id');
          var base64String = uploadError.base64String;
 
          console.log('__DataItem__sCtrl uploadError __dataItem__Model, uploadError: ', __dataItem__Model, uploadError);
 
          dataFactoryExport__DataItem__s.recordGPX(__dataItem__Model.get('lat'), __dataItem__Model.get('lng'), __dataItem__Model.get('naam'), __dataItem__Model.get('tekst'), __dataItem__Id, base64String).then(function () {
 
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren ' + uploadErrors.length + ' foutieve uploads\'s<br><br>Een ogenblik geduld aub...'
            });
            loDash.remove(uploadErrors, function (uploadError) {
              return uploadError.__dataItem__Model.get('Id') === __dataItem__Id;
            });
            watchGpxFotosErrors();
            // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            console.error('__DataItem__sCtrl uploadError ERROR err: ', err);
            watchGpxFotosErrors();
          });
        });
      }
 
      function doExporterenFotos(mijn__DataItem__s) {
        gpxTodo = mijn__DataItem__s.length;
        gpxDone;
 
        dataFactoryExport__DataItem__s.openGPX();
 
        if (mijn__DataItem__s.length === 1) {
          gpxNaam = mijn__DataItem__s[0].get('naam');
        } else {
          gpxNaam = args.filter;
        }
 
        gpxDone = 0;
 
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren Locaties<br><br>Een ogenblik geduld aub...'
        });
 
        loDash.each(mijn__DataItem__s, function (__dataItem__Model) {
 
          var __dataItem__Id = __dataItem__Model.get('Id');
          //var exportNaam = __dataItem__Model.get('naam');
          var content;
 
          console.warn('__DataItem__CardCtrl __dataItem__Model: ', __dataItem__Model, __dataItem__Model.get('naam'));
          (function (__dataItem__Model) {
 
            dataFactory__DataItem__s.get__DataItem__Src(__dataItem__Model.get('gebruikerId'), __dataItem__Model.get('dir'), __dataItem__Model.get('__dataItem__Id'), __dataItem__Model.get('extension')).then(function (result) {
              content = result;
 
              console.warn('__DataItem__sCtrl prep export content: ', content);
 
              var img = new Image();
              img.crossOrigin = 'Anonymous';
              img.setAttribute('style', 'display:none');
              img.setAttribute('alt', 'script div');
              img.setAttribute('src', content);
              console.log('__DataItem__sCtrl prep export img: ', img);
 
              img.onload = function () {
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                c.height = img.naturalHeight;
                c.width = img.naturalWidth;
                ctx.drawImage(img, 0, 0, c.width, c.height);
                var uri = c.toDataURL('image/jpg'),
                  base64String = uri.replace(/^data:image.+;base64,/, '');
                console.log('__DataItem__sCtrl prep export base64String: ', base64String);
                dataFactoryExport__DataItem__s.recordGPX(__dataItem__Model.get('lat'), __dataItem__Model.get('lng'), __dataItem__Model.get('naam'), __dataItem__Model.get('tekst'), __dataItem__Id, base64String).then(function () {
                  $ionicLoading.show({
                    template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Bezig met Exporteren Locaties<br><br><span class="trinl-rood"><b>' + __dataItem__Model.get('naam') + '</b></span><br><br>Een ogenblik geduld aub...'
                  });
                  watchGpxFotos();
                // eslint-disable-next-line no-unused-vars
                }).catch(function (err) {
                  uploadErrors.push({
                    __dataItem__Model: __dataItem__Model,
                    base64String: base64String
                  });
                  console.log('__DataItem__sCtrl upload ERROR uploadErrors: ', uploadErrors);
                  console.error('__DataItem__sCtrl upload ERROR __dataItem__ naam, err: ', __dataItem__Model.get('naam'), err);
                  watchGpxFotos();
                });
              };
            });
          })(__dataItem__Model);
        });
      }
 
      var mijn__DataItem__s = loDash.filter($scope.data.__dataItem__s, function (__dataItem__Model) {
        return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });
      var aantal__DataItem__s = mijn__DataItem__s.length;
      $ionicLoading.hide();
      if (aantal__DataItem__s === 0) {
        $ionicPopup.alert({
          title: 'Exporteren Locaties',
          content: 'Deze selectie heeft geen Locaties van jou.<br><br>Ga naar filter Mijn. Hierin staan al jouw Locaties.<br>Gebruik zoeken om de juiste (max. 3) Locaties te selecteren'
        });
      } else {
        if (aantal__DataItem__s === 1) {
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft 1 Locatie van jou:<br><br><span class="trinl-rood"><b>' + mijn__DataItem__s[0].get('naam') + '</b></span><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</b>',
              type: 'button-positive',
              onTap: function () {
                doExporterenFotos(mijn__DataItem__s);
              }
            }]
          });
        } else {
          var __dataItem__Namen = '';
          loDash.each(mijn__DataItem__s, function (__dataItem__Model) {
            __dataItem__Namen = __dataItem__Namen + '<br><span class="trinl-rood"><b>' + __dataItem__Model.get('naam') + '</b></span>';
          });
          $ionicLoading.hide();
          $ionicPopup.confirm({
            title: 'Exporteren Locaties',
            content: 'Deze selectie heeft ' + aantal__DataItem__s + ' Locaties:<br><br>' + __dataItem__Namen + '<br><br>',
            buttons: [{
              text: 'Annuleer',
              type: 'button-positive',
              onTap: function () {
              },
            }, {
              text: '<b>Exporteren</br>',
              type: 'button-positive',
              onTap: function () {
                doExporterenFotos(mijn__DataItem__s);
              }
            }]
          });
        }
      }
      //endRemoveIf(!fotos)
      ###  */
      /*  ###
      //removeIf(!tracks)
      console.log('Geoposition: ', dataFactoryTrack.Geoposition);
 
      console.log('TracksCtrl trackExporteerSelectie $scope.data.tracks: ', $scope.data.tracks);
      //
      //  In $scope.data.tracks staan de geselecteerde tracks
      //  Eerst wordt een geojsonModel geopen met openGPX.
      //  Vervolgens worden de geselecteerde tracks gegenereerd met recordGPX
      //  Tenslotte wordt geojsonModel gesloten
      //  Daarna wordt geojson geconverteerd naar gpx en opgeslagen in de Dropbox-map Locaties
      //
      var gpxNaam = args.filter;
      console.log('TracksCtrl trackExporteerSelectie gpxNaam: ', gpxNaam);

      if (gpxNaam === 'Search') {

        $scope.popup = {};
        $scope.popup.zoeknaam = 'Zoeken ' + args.search;

        var popupEditZoekNaam;

        popupEditZoekNaam = $ionicPopup.show({
          template: '<input type="text" ng-model="popup.zoeknaam">',
          title: 'Wijzigen naam selectie',
          scope: $scope,
          buttons: [{
            text: 'Annuleer',
            onTap: function() {
              $ionicLoading.hide();
            }
          }, {
            text: '<b>Wijzigen</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.popup.zoeknaam) {
                e.preventDefault();
              } else {
                return $scope.popup.zoeknaam;
              }
            }
          }]
        });
        popupEditZoekNaam.then(function (res) {

          if (res !== undefined) {
            console.log('FotosSideMenuCtrl editTag Label gewijzigd in: ' + res);
            gpxNaam = res;
          }
        });

      }
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];

      function watchGpxTracksErrors() {

        gpxDoneErrors += 1;

        console.warn('TracksCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);

        if (gpxDoneErrors >= gpxTodoErrors) {

          $ionicLoading.hide();

          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportTracks.closeGPX(gpxNaam);
              $ionicPopup.confirm({
                title: 'Exporteren Sporen',
                content: 'Exporteren na correctie fouten gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $ionicPopup.confirm({
                title: 'Exporteren Sporen ERROR',
                content: uploadErrors.length + ' Sporen niet  geaccepteerd door Dropbox<br>Probeer opnieuw',
                buttons: [{
                  text: '<b>OK</br>'
                }]
              });
            }
          }, 100);
        }
      }

      function watchGpxTracks() {

        gpxDone += 1;

        console.warn('TracksCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo, uploadErrors.length);

        if (gpxDone >= gpxTodo) {

          $ionicLoading.hide();
          $timeout(function () {
            if (uploadErrors.length === 0) {
              dataFactoryExportTracks.closeGPX(gpxNaam);
              var aantal = 'Selectie';
              if (mijnTracks.length === 1) {
                aantal = 'Spoor';
                gpxNaam = mijnTracks[0].get('naam');
              }

              $ionicPopup.confirm({
                title: 'Exporteren Sporen',
                content: aantal + '<br><br><span class="trinl-rood"><b>' + gpxNaam + '</b></span><br><br>Exporteren gereed',
                buttons: [{
                  text: '<b>OK</b>'
                }]
              });
            } else {
              $timeout(function () {
                doExporterenTracksErrors(uploadErrors);
              }, 1000);
            }
          }, 500);
        }
      }

      function doExporterenTracksErrors(uploadErrors) {

        gpxTodoErrors = uploadErrors.length;
        gpxDoneErrors = 0;

        var uploadErrorsX = loDash.filter(uploadErrors, function () {
          return true;
        });

        loDash.each(uploadErrorsX, function (uploadError) {

          var trackModel = uploadError.trackModel;
          var trackId = trackModel.get('Id');

          console.log('TracksCtrl uploadError trackModel, uploadError: ', trackModel, uploadError);

          dataFactoryExportTracks.recordGPX(trackModel.get('lat'), trackModel.get('lng'), trackModel.get('naam'), trackModel.get('tekst'), trackId, trackData).then(function () {

            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren ' + uploadErrors.length + ' foutieve uploads\'s<br><br>Een ogenblik geduld aub...'
            });
            loDash.remove(uploadErrors, function (uploadError) {
              return uploadError.trackModel.get('Id') === trackId;
            });
            watchGpxTracksErrors();
          // eslint-disable-next-line no-unused-vars
          }).catch(function (err) {
            console.error('TracksCtrl uploadError ERROR err: ', err);
            watchGpxTracksErrors();
          });
        });
      }

      var mijnTracks = $scope.data.tracks;

      gpxTodo = mijnTracks.length;
      gpxDone = 0;

      if (mijnTracks.length === 1) {
        gpxNaam = mijnTracks[0].get('naam');
      }

      gpxDone = 0;

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Start met Exporteren Sporen<br><br>Een ogenblik geduld aub...'
      });

      dataFactoryExportTracks.openGPX();
      loDash.each(mijnTracks, function (trackModel) {
        var trackId = trackModel.get('Id');
        var gebruikerId = trackModel.get('gebruikerId');
        console.log('TracksCtrl trackExporteerSelectie trackModel: ', trackModel);

        dataFactoryTracks.loadTrack(gebruikerId, trackId, 'txt').then(function (trackData) {
          console.log('TracksCtrl trackExporteerSelectie trackData: ', trackData);
          //dataFactoryExportTracks.openGPX();
          dataFactoryExportTracks.recordGPX(trackModel.get('lat'), trackModel.get('lng'), trackModel.get('naam'), trackModel.get('tekst'), trackId, trackData);
          //dataFactoryExportTracks.closeGPX('NMFL-naam');
          watchGpxTracks(gpxNaam);
        });
      });

      $rootScope.$emit('tracksNieuwAantallen');
      $rootScope.$emit('tracksFavorieten');

      $timeout(function () {
        refresh(true);
      }, 1000);
      //endRemoveIf(!tracks)
      ###  */
    });
    $scope.$on('$destroy', event14);
    //
    // We gaan een nieuw bericht maken.Open het Formulier
    /*  ###
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
    ###  */
    /*  ###
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
    ###  */
    //
    $scope.clicked__DataItem__ = function (__dataItem__Model) {
      dataFactory__DataItem__.card = true;
      console.warn('__DataItem__sCtrl clicked__DataItem__ dataFactory__DataItem__.card: ', __dataItem__Model, dataFactory__DataItem__.card);
      $state.go('__dataItem__s.__dataItem__Card', {
        'Id': __dataItem__Model.get('Id')
      });
    };
    /**
     * Het clearkruisje van het zoekveld is getapped
     * Nogmaals filteren starten
     */
    $scope.clearSearchLabel = function () {
      console.warn('__DataItem__sCtrl clearSearchLabel');
      $scope.search.label = '';
      $scope.data.__dataItem__s = dataFactory__DataItem__.store;

      $rootScope.$emit('__dataItem__Filtered', {
        __dataItem__s: $scope.data.__dataItem__s
      });
    };
    //
    function sorteerDetailsTags(__dataItem__Model) {
      //
      console.error('__DataItem__CardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(__dataItem__Model.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');

      var tagsStandaard = loDash.filter(__dataItem__Model.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');

      var tagsNormaal = loDash.filter(__dataItem__Model.xData.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.get('tag'), 'asc');

      __dataItem__Model.xData.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function initxData(__dataItem__Model) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!__dataItem__Model.xData) {
        __dataItem__Model.xData = {};
        console.log('__DataItem__sCtrl update__DataItem__ xData: ', __dataItem__Model.xData);
      }
      if (!__dataItem__Model.xData.pois) {
        __dataItem__Model.xData.pois = [];
        console.log('__DataItem__sCtrl update__DataItem__ xData.pois: ', __dataItem__Model.xData.pois);
      }
      if (!__dataItem__Model.xData.fotos) {
        __dataItem__Model.xData.fotos = [];
        console.log('__DataItem__sCtrl update__DataItem__ xData.fotos: ', __dataItem__Model.xData.fotos);
      }
      if (!__dataItem__Model.xData.tags) {
        __dataItem__Model.xData.tags = [];
        console.log('__DataItem__sCtrl update__DataItem__ xData.tags: ', __dataItem__Model.xData.tags);
      }
      if (!__dataItem__Model.xData.groep) {
        __dataItem__Model.xData.groep = '';
        console.log('__DataItem__sCtrl update__DataItem__ xData.groep: ', __dataItem__Model.xData.groep);
      }
    }
    //
    $scope.doRefresh = function () {

      $rootScope.$emit('refresh__DataItem__');

      console.error('__DataItem__sCtrl doReload broadcast reloadComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
    //
    $scope.$on('elemHasFocus', function (event, args) {

      console.warn('__DataItem__sCtrl elemHasFocus event: ', args);
      //
      if (args.message === 'Zoek in locaties') {
        $timeout(function () {
          console.error('__DataItem__sCtrl elemHasFocus scrollTop $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('__dataItem__List').scrollTop(true);
        });
      }
    });
    /*  ###
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
    ###  */
  }
]);
