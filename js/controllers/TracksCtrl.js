/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef

//removeIf(!tracks)
trinl.controller('TracksCtrl', ['loDash', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$state', '$q', 'dataFactoryInstellingen', 'dataFactorySync', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryHelp', 'dataFactoryGroepen', 'dataFactoryGroepdeelnemers', 'dataFactoryTrack', 'dataFactoryFoto', 'dataFactoryPoi', 'dataFactoryTrackSup', 'dataFactoryTag', 'dataFactoryCeo', 'dataFactoryTrackTag', 'dataFactoryExportTracks', 'dataFactoryTrackPoisFotos', 'dataFactoryCodePush',
  // eslint-disable-next-line no-unused-vars
  function (loDash, $rootScope, $scope, $timeout, $ionicPopup, $ionicLoading, $ionicPlatform, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $q, dataFactoryInstellingen, dataFactorySync, dataFactoryConfig, dataFactoryConfigX, dataFactoryHelp, dataFactoryGroepen, dataFactoryGroepdeelnemers, dataFactoryTrack, dataFactoryFoto, dataFactoryPoi, dataFactoryTrackSup, dataFactoryTag, dataFactoryCeo, dataFactoryTrackTag, dataFactoryExportTracks, dataFactoryTrackPoisFotos, dataFactoryCodePush) {
    //endRemoveIf(!tracks)
    
    

    
  
    $scope.data = {};
    if (!$scope.data.tracks) {
      $scope.data.tracks = [];
    }
    //
    var trackCard = false;
    //
    $scope.details = {
      mode: 'track'
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
    var lastArgs = dataFactoryConfig.currentModel.get('trackFilter');
    //console.log('TrackSideMenuCtrl trackFilter from config: ', lastArgs);
    //
    var filter = {
      filter: lastArgs.tag
    };
    //
    //console.log('TracksCtrl lastArgs from config: ', lastArgs);

    if (lastArgs.filter === 'Tag') {
      $rootScope.$emit('setNavTitleEvent', filter);
    }
    //
    var refreshEvent = $rootScope.$on('tracksRefresh', function () {
      refresh();
    });
    $scope.$on('$destroy', refreshEvent);
    //
    //  TracksTeload wordt getriggerd door sideMenu als een label wordt gewijzihd
    //
    var reloadEvent = $rootScope.$on('tracksReload', function () {
      reload();
    });
    $scope.$on('$destroy', reloadEvent);
    //
    var trackPredicate = $rootScope.$on('trackPredicate', function (event, args) {

      //console.log('TracksCtrl trackPredicate event trackSorter set to: ', args);

      $scope.predicate = args.predicate;
      $scope.reverse = args.reverse;

      dataFactoryConfig.currentModel.set('trackSorter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);

      //console.log('TracksCtrl trackPredicate event trackSorter saved in config: ', args);
    });
    $scope.$on('$destroy', trackPredicate);
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

      //console.warn('TracksCtrl $ionicView.ecnter');

      if (!dataFactoryTrack.card) {
        $ionicSideMenuDelegate.toggleLeft();
      }

      if ($scope.data.tracks.length === 0) {
        $rootScope.$emit('tracksFilter');
      }
      
      
      
      
      
      
      
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
      
    });
    $scope.$on('$destroy', event0);
    //
    var event0b = $scope.$on('$ionicView.beforeLeave', function () {
      if (dataFactoryTrack.card) {
        //console.warn('TrackCtrl $ionicView.beforeLeave, dataFactoryTrack.card: ', dataFactoryTrack.card);
        $rootScope.$emit('sleepClockTrack');
      }
    });
    $scope.$on('$destroy', event0b);
    //
    var event2 = $rootScope.$on('trackDeleteTagOverall', function (event, args) {
      //
      // Nu nog in details en modellen
      //
      var tagModel = args;
      var tagId = tagModel.get('Id');

      //console.warn('+++ TracksCtrl trackDeleteTags tagId: ', tagId);
      //
      //	Verwijder in mijn trackSupStore en update
      //
      var chunkDelete = loDash.chunk(dataFactoryTrackSup.store, 10);

      function doChunkDelete(chunkDelete, index) {

        //console.warn('TracksCtrl doChunkDelete');

        if (index >= chunkDelete.length) {
          //console.log('TracksCtrl doChunkDelete READY');
          return;
        }

        var promises = [];

        loDash.each(chunkDelete[index], function (trackSupModel) {
          //
          //	Alleen supModel eigenaar
          //
          if (trackSupModel) {
            //console.log('TracksCtrl doChunksDelete', trackSupModel);
            if (trackSupModel.eigenaar === false) {
              loDash.remove(trackSupModel.tags, function (tagModel) {
                return tagModel.get('Id') === tagId;
              });
              if (trackSupModel.tags) {
                promises.push(trackSupModel.save());
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
      //	Verwijder in mijn trackStore en update
      //
      loDash.each(dataFactoryTrack.store, function (trackModel) {
        if (!trackModel.xData) {
          trackModel.xData = {};
        }
        if (!trackModel.xData.sup) {
          trackModel.xData.sup = {};
        }
        if (!trackModel.xData.pois) {
          trackModel.xData.pois = [];
        }
        if (!trackModel.xData.fotos) {
          trackModel.xData.fotos = [];
        }
        if (!trackModel.xData.tags) {
          trackModel.xData.tags = [];
        }
        loDash.remove(trackModel.xData.tags, function (trackTagModel) {
          return trackTagModel.get('tagId') === tagId;
        });
      });
      //console.log('TracksCtrl trackDeleteTags after doChunkDelete trackStore: ', dataFactoryTrack.store);
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
        $rootScope.$emit('tracksFilter');
      });

    });
    $scope.$on('$destroy', event2);
    //
    var event3 = $rootScope.$on('trackEditTagOverall', function (event, args) {

      var tagModel = args;
      var tagId = tagModel.get('Id');
      var tagTekst = tagModel.get('tag');
      //console.warn('+++ TracksCtrl trackEditTags tagId, tagTekst: ', tagId, tagTekst);
      //
      //	Wijzig in tagStore en update
      //
      //console.warn('+++ TracksCtrl trackEditTags tagStore update: ', dataFactoryTag.store);
      loDash.each(dataFactoryTag.store, function (tagModel) {
        if (tagModel.get('Id') === tagId) {
          tagModel.set('tag', tagTekst);
          tagModel.save();
        }
      });
      //
      //	Verwijder in mijn trackSupStore en update
      //
      var chunkEdit = loDash.chunk(dataFactoryTrackSup.store, 10);
      //console.log(chunkEdit);

      function doChunkEdit(chunkEdit, index) {

        //console.warn('TracksCtrl doChunkEdit');

        if (index >= chunkEdit.length) {
          //console.log('TracksCtrl doChunkEdit READY');
          return;
        }

        var promises = [];

        loDash.each(chunkEdit[index], function (trackSupModel) {
          //
          //	Alleen supmodellen eigenaar
          //
          if (trackSupModel.eigenaar === false) {

            loDash.each(trackSupModel.tags, function (tagModel) {
              if (tagModel.tagId === tagId) {
                tagModel.tag = tagTekst;
              }
            });
            if (trackSupModel.tags) {
              promises.push(trackSupModel.save());
            }
          }
        });

        $q.all(promises).then(function () {
          doChunkEdit(chunkEdit, index + 1);
        });
      }

      doChunkEdit(chunkEdit, 0);

      //
      // Wijzig mijn trackStore
      //
      loDash.each(dataFactoryTrack.store, function (trackModel) {

        //console.log('TracksCtrl EditAllLabels, trackModel: ', trackModel);

        initxData(trackModel);

        loDash.each(trackModel.xData.tags, function (trackTagModel) {
          if (trackTagModel.get('tagId') === tagId) {
            {
              trackTagModel.xData.set('tag', tagTekst);
            }
          }
        });
      });

      $rootScope.$emit('tracksFilter');
    });
    $scope.$on('$destroy', event3);
    //
    function doVerwijderen(mijnTracks) {
      //console.time('Verwijderen');

      $ionicLoading.show({
        template: 'Verwijderen Spoors Selectie<br><br><span class="trinl-rood"><b>' + filter.filter + '</b></span><br><br><br>Een ogenblik geduld aub...'
      });

      var chunkRemove = loDash.chunk(mijnTracks, 10);
      //console.log(chunkRemove);

      function doChunkRemove(chunkRemove, index) {

        //console.warn('TracksCtrl doChunkRemove, index: ', index);

        if (index >= chunkRemove.length) {
          //console.log('TracksCtrl doChunkRemove READY');
          $ionicLoading.hide();

          $rootScope.$emit('sideMenuTracksFilter', {
            filter: 'Alle'
          });
          //console.timeEnd('Verwijderen');
          return;
        }
        //
        // Loop trackmodellen
        //
        //var promises = [];

        loDash.each(chunkRemove[index], function (trackModel) {

          var trackId = trackModel.get('Id');

          //console.warn('TracksCtrl doChunkRemove, index: ', index);
          //
          // Filter de tracktags van dit trackmodel
          //
          var tracktags = loDash.filter(dataFactoryTrackTag.store, function (tracktagModel) {
            return tracktagModel.get('trackId') === trackId;
          });
          //console.warn('TracksCtrl doChunkRemove, tracktags from Id: ', tracktags, trackModel.get('Id'), trackModel.get('naam'));
          //
          // De tracktags van dit model worden later verwijderd
          // Er is nu tijd om de TrackSideMenuCtrl te informeren om zijn tags bij te werken
          // Verwijder de tracktag ook in backend
          //
          loDash.each(tracktags, function (trackTagModel) {

            var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('Id') === trackTagModel.get('tagId');
            });
            //
            // Verwijder trackTagModellen op backend
            //
            if (tagModel) {

              //console.warn('TracksCtrl doChunkRemove, verwijder tracktag: ', tagModel.get('tag'));

              trackTagModel.xData = tagModel;

              $rootScope.$emit('trackRemoveLabel', {
                trackModel: trackModel,
                tagModel: tagModel
              });
            }
          });

          loDash.remove(dataFactoryTrackSup.store, function (tracksup) {
            return tracksup.get('trackId') === trackModel.get('Id');
          });
          loDash.remove(dataFactoryTrackSup.data, function (dataItem) {
            return dataItem.record.get('trackId') === trackModel.get('Id');
          });
          loDash.remove(dataFactoryTrackTag.store, function (trackTagModel) {
            return trackTagModel.get('trackId') === trackId;
          });
          loDash.remove(dataFactoryTrackTag.data, function (dataItem) {
            return dataItem.record.get('trackId') === trackId;
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

          loDash.remove(dataFactoryTrack.store, function (trackModel) {
            return trackModel.get('Id') === trackId;
          });
          loDash.remove(dataFactoryTrack.data, function (dataItem) {
            return dataItem.record.get('Id') === trackId;
          });
          trackModel.remove();
        });

        doChunkRemove(chunkRemove, index + 1);
      }

      doChunkRemove(chunkRemove, 0);

      $scope.data.tracks = [];
      $rootScope.$emit('tracksNieuweAantallen');
      $rootScope.$emit('tracksFilter');
    }
    //
    var event12 = $rootScope.$on('trackVerwijderSelectie', function (event, args) {
      //
      //console.error('Verwijderen Selectie ceo data.tracks:  ', $scope.ceo.Id, $scope.data.tracks);
      //
      var mijnTracks = loDash.filter($scope.data.tracks, function (trackModel) {
        return trackModel.get('gebruikerId') === $scope.ceo.Id;
      });
      //console.error('MijnTracks aantal: ', mijnTracks.length);

      if (mijnTracks.length === 0) {
        $ionicPopup.alert({
          title: 'Verwijderen Spoors',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat <span class="trinl-rood">geen</span> Spoors die van jou zijn.',
        });
      }

      if (mijnTracks.length > 1) {

        var trackNamen = '';
        loDash.each(mijnTracks, function (trackModel) {
          trackNamen = trackNamen + '<br><span class="trinl-rood"><b>' + trackModel.get('naam') + '</b></span>';
        });
        $ionicPopup.confirm({
          title: 'Verwijderen Spoors',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat ' + mijnTracks.length + ' Spoors:<br>' + trackNamen + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnTracks);
            }
          }]
        });
      }

      if (mijnTracks.length === 1) {
        $ionicPopup.confirm({
          title: 'Verwijderen Spoors',
          content: 'De gekozen selectie<br><br><span class="trinl-rood"><b>' + args.filter + '</b></span><br><br>bevat 1 Spoor:<br>' + mijnTracks[0].get('naam') + '<br>',
          buttons: [{
            text: 'Annuleer',
            type: 'button-positive',
            onTap: function () {
            },
          }, {
            text: '<b>Verwijderen</b>',
            type: 'button-positive',
            onTap: function () {
              doVerwijderen(mijnTracks);
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
    function watchLabelGeenLabelTrack(tagModel) {
      done += 1;
      //console.log('watchLabelGeenLabelTrack todo, done: ', todo, done);
      if (done >= todo) {

        $rootScope.$emit('tracksNieuweAantallen');
        filter.filter = tagModel.get('tag');
        $rootScope.$emit('tracksFilter', {
          filter: 'Tag',
          tag: tagModel.get('tag')
        });
        $rootScope.$emit('setNavTitleEvent', filter);
        $state.go('tracks.tracks');
      }
    }
    //
    var event13 = $rootScope.$on('labelGeenLabelTrack', function (event, args) {

      //console.warn('TracksCtrl event labelGeenLabelTrack args: ', args.tagModel);

      var tagModel = args.tagModel;

      var tagId = tagModel.get('Id');

      var tracksZonderLabel = loDash.filter(dataFactoryTrack.store, function (trackModel) {
        if (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {

          initxData(trackModel);
          if (trackModel.xData.tags !== undefined) {
            return trackModel.xData && trackModel.xData.tags.length === 0;
          } else {
            return true;
          }
        }
      });
      todo = tracksZonderLabel.length;

      loDash.each(tracksZonderLabel, function (trackModel) {

        var trackId = trackModel.get('Id');
        //console.log('TracksCtrl event labelGeenLabelTrack tracksZonderLabel trackId, trackNaam: ', trackId, trackModel.get('naam'));

        var trackTagModel = new dataFactoryTrackTag.Model();
        trackTagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
        trackTagModel.set('trackId', trackId);
        trackTagModel.set('tagId', tagId);
        trackTagModel.save().then(function () {

          trackTagModel.xData = tagModel;

          //console.log('TracksCtrl labelGeenLabelTrack tracktag TOEVOEGEN in  SideMenu: ', trackModel.get('naam'), tagModel.get('tag'));
          //console.log('TracksCtrl labelGeenLabelTrack tracktag TOEVOEGEN in  trackModel.xData.tags: ', trackModel.get('naam'), addTrackTagModel);

          trackModel.xData.tags.push(trackTagModel);
          $rootScope.$emit('trackAddLabel', {
            trackModel: trackModel,
            tagModel: tagModel
          });
          watchLabelGeenLabelTrack(tagModel);
        });
      });
    });
    $scope.$on('$destroy', event13);
    //
    var event4 = $rootScope.$on('trackStartSearch', function () {

      //console.warn('+++ trackCtrl trackStartSearch');

      $scope.data.tracks = [];
    });
    $scope.$on('$destroy', event4);
    //
    function finishFilter() {

      $timeout(function () {

        dataFactoryTrack.selected = $scope.data.tracks;

        //loDash.each($scope.data.tracks, function (trackModel) {
          //sorteerDetailsTags(trackModel);
        //});

        //console.log('TracksCtrl finishFilter FILTER AANTAL tracks selected: ', dataFactoryTrack.selected);
        //
        
        //removeIf(berichten)
        // Laat KaartCtrl weten dat de geselecteerde Sporen is gewijzigd
        //
        $rootScope.$emit('trackKaart', {
          tracks: dataFactoryTrack.selected
        });
        //endRemoveIf(berichten)
        

        $timeout(function () {
          //console.log('TrackCtrl finishFilter $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('trackList').scrollTop(true);
          //$ionicScrollDelegate.scrollTop(true);

        });
      }, 500);
    }
    //
    var event5 = $rootScope.$on('tracksFilter', function (event, args) {

      //console.error('TracksCtrl on.tracksFilter: ', args);

      //
      // Indien geen argumenten dan de oude filter toepassen
      //
      if (args === undefined) {
        args = lastArgs;
      } else {
        lastArgs = args;
      }

      dataFactoryConfig.currentModel.set('trackFilter', args);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      //console.log('TracksCtrl laatste tracksFilter saved in config: ', args);

      if (args.filter === 'Mijn') {
        //console.warn('TracksCtrl tracksFilter: Mijn');
        $scope.data.tracks = loDash.filter(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Public') {
        //console.warn('TracksCtrl tracksFilter: Public');
        $scope.data.tracks = loDash.filter(dataFactoryTrack.store, function (trackModel) {
          return trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
        });
        finishFilter();
      }

      if (args.filter === 'Alle') {
        //console.warn('TracksCtrl tracksFilter: Alle');
        $scope.data.tracks = loDash.each(dataFactoryTrack.store);
        finishFilter();
      }

      if (args.filter === 'Geen label') {

        //console.warn('TracksCtrl tracksFilter: Geen label');

        $scope.data.tracks = loDash.filter(dataFactoryTrack.store, function (trackModel) {
          if (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            //console.warn('TracksCtrl tracksFilter Geen label in trackModel: ', trackModel);
            if (trackModel.xData === undefined) {
              return false;
            }
            //console.warn('TracksCtrl tracksFilter trackModel.xData: ', trackModel.xData);
            if (trackModel.xData.tags !== undefined) {
              return trackModel.xData && trackModel.xData.tags.length === 0;
            } else {
              return true;
            }
          }
        });

        //console.log('TracksCtrl ongelabeld aantal tracks: ', $scope.data.tracks);

        finishFilter();
      }

      if (args.filter === 'Tag') {

        //console.warn('TracksCtrl tracksFilter: Tag:', args.tag);

        $scope.data.tracks = loDash.filter(dataFactoryTrack.store, function (trackModel) {

          initxData(trackModel);
          //console.log('TracksCtrl tracksFilter Tag trackModel naam: ', trackModel.get('naam'));
          //console.log('TracksCtrl tracksFilter Tag trackModel naam: ', trackModel.xData.tags);
          if (trackModel.xData.tags.length >= 1) {
            //console.warn('TracksCtrl tracksFilter Tag: ', trackModel.xData.tags.tag);
          }
          var found = loDash.find(trackModel.xData.tags, function (trackTagModel) {
            return trackTagModel.xData.get('tag') === args.tag;
          });
          return found;
        });
        finishFilter();
      }

      if (args.filter === 'Geen') {
        //console.warn('TracksCtrl tracksFilter: Geen');
        $scope.data.tracks = [];
        //console.log('TracksCtrl ongelabeld aantal tracks: ', $scope.data.tracks);
        finishFilter();
      }

      if (args.filter === 'Search') {
        //console.log('TracksCtrl tracksFilter: Search', args);

        if (args.search === '') {
          $scope.search.label = '';
          $scope.data.tracks = [];
          //console.log('TracksCtrl tracksFilter: geen Search');
          finishFilter();
        } else {
          $scope.data.tracks = dataFactoryTrack.store;
          $timeout(function () {
            finishFilter();
          }, 10);
        }
      }

      if (args.filter === 'Nieuw') {
        //console.warn('TracksCtrl tracksFilter: Nieuw');
        $scope.data.tracks = dataFactoryTrack.nieuw;
        finishFilter();
      }

      if (args.filter === 'Favorieten') {

        //console.warn('TracksCtrl tracksFilter: Favorieten');

        $scope.data.tracks = dataFactoryTrack.star;

        //console.log('TracksCtrl nieuwe tracks: ', dataFactoryTrack.star);
        finishFilter();
      }
    });
    $scope.$on('$destroy', event5);
    //
    var event10 = $rootScope.$on('deleteLabel', function (event, args) {

      //console.warn('TracksCtrl event deleteLabel: ', args);

      loDash.each(dataFactoryTrack.store, function (trackModel) {

        initxData(trackModel);

        var trackTags = loDash.remove(trackModel.xData.tags, function (trackTagModel) {
          return trackTagModel.get('tagId') === args.tagId;
        });
        loDash.each(trackTags, function (trackTagModel) {
          (function (trackTagModel) {
            trackTagModel.remove();
          }(trackTagModel));
        });
      });
    });
    $scope.$on('$destroy', event10);
    //
    // eslint-disable-next-line no-unused-vars
    var event14 = $rootScope.$on('trackExporteerSelectie', function (event, args) {
      
      
      
      
      
      //removeIf(!tracks)
      //console.log('Geoposition: ', dataFactoryTrack.Geoposition);
 
      //console.log('TracksCtrl trackExporteerSelectie $scope.data.tracks: ', $scope.data.tracks);
      //
      //  In $scope.data.tracks staan de geselecteerde tracks
      //  Eerst wordt een geojsonModel geopen met openGPX.
      //  Vervolgens worden de geselecteerde tracks gegenereerd met recordGPX
      //  Tenslotte wordt geojsonModel gesloten
      //  Daarna wordt geojson geconverteerd naar gpx en opgeslagen in de Dropbox-map Spoors
      //
      var gpxNaam = args.filter;
      //console.log('TracksCtrl trackExporteerSelectie gpxNaam: ', gpxNaam);

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
            //console.log('FotosSideMenuCtrl editTag Label gewijzigd in: ' + res);
            gpxNaam = res;
          }
        });

      }
      var gpxTodo, gpxDone, gpxTodoErrors, gpxDoneErrors;
      var uploadErrors = [];

      function watchGpxTracksErrors() {

        gpxDoneErrors += 1;

        //console.warn('TracksCtrl watchGpxErrors gpxDoneErrors, gpxTodoErrors: ', gpxDoneErrors, gpxTodoErrors);

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

        //console.warn('TracksCtrl watchGpx gpxDone, gpxTodo: ', gpxDone, gpxTodo, uploadErrors.length);

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

          //console.log('TracksCtrl uploadError trackModel, uploadError: ', trackModel, uploadError);

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
            //console.error('TracksCtrl uploadError ERROR err: ', err);
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
        //console.log('TracksCtrl trackExporteerSelectie trackModel: ', trackModel);

        dataFactoryTracks.loadTrack(gebruikerId, trackId, 'txt').then(function (trackData) {
          //console.log('TracksCtrl trackExporteerSelectie trackData: ', trackData);
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
      
    });
    $scope.$on('$destroy', event14);
    //
    // We gaan een nieuw bericht maken.Open het Formulier
    
    
    
    
    //
    $scope.clickedTrack = function (trackModel) {
      dataFactoryTrack.card = true;
      //console.warn('TracksCtrl clickedTrack dataFactoryTrack.card: ', trackModel, dataFactoryTrack.card);
      $state.go('tracks.trackCard', {
        'Id': trackModel.get('Id')
      });
    };
    /**
     * Het clearkruisje van het zoekveld is getapped
     * Nogmaals filteren starten
     */
    $scope.clearSearchLabel = function () {
      //console.warn('TracksCtrl clearSearchLabel');
      $scope.search.label = '';
      $scope.data.tracks = dataFactoryTrack.store;

      $rootScope.$emit('trackFiltered', {
        tracks: $scope.data.tracks
      });
    };
    //
    function sorteerDetailsTags(trackModel) {
      //
      //console.error('TrackCardCtrl sorteerDetailsTags');
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      var tagsPrivate = loDash.filter(trackModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.xData.get('tag'), 'asc');

      var tagsStandaard = loDash.filter(trackModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length <= 3 && tag.xData.get('gebruikerId') === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.xData.get('tag'), 'asc');

      var tagsNormaal = loDash.filter(trackModel.xData.tags, function (tag) {
        return tag.xData.get('Id').length > 3;
      });
      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.xData.get('tag'), 'asc');

      trackModel.xData.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];
    }
    //
    function initxData(trackModel) {
      //
      //  xData alle subobjecten intialiseren.
      //  Zoveel mogelijk xData intact laten.
      //
      if (!trackModel.xData) {
        trackModel.xData = {};
        //console.log('TracksCtrl updateTrack xData: ', trackModel.xData);
      }
      if (!trackModel.xData.pois) {
        trackModel.xData.pois = [];
        //console.log('TracksCtrl updateTrack xData.pois: ', trackModel.xData.pois);
      }
      if (!trackModel.xData.fotos) {
        trackModel.xData.fotos = [];
        //console.log('TracksCtrl updateTrack xData.fotos: ', trackModel.xData.fotos);
      }
      if (!trackModel.xData.tags) {
        trackModel.xData.tags = [];
        //console.log('TracksCtrl updateTrack xData.tags: ', trackModel.xData.tags);
      }
      if (!trackModel.xData.groep) {
        trackModel.xData.groep = '';
        //console.log('TracksCtrl updateTrack xData.groep: ', trackModel.xData.groep);
      }
    }
    //
    $scope.doRefresh = function () {

      $rootScope.$emit('refreshTrack');

      //console.error('TracksCtrl doReload broadcast reloadComplete');
      $scope.$broadcast('scroll.refreshComplete');
    };
    //
    $scope.$on('elemHasFocus', function (event, args) {

      //console.warn('TracksCtrl elemHasFocus event: ', args);
      //
      if (args.message === 'Zoek in locaties') {
        $timeout(function () {
          //console.error('TracksCtrl elemHasFocus scrollTop $ionicScrollDelegate');
          $ionicScrollDelegate.$getByHandle('trackList').scrollTop(true);
        });
      }
    });
    
    
  }
]);
