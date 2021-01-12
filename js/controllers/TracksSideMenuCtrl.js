/* eslint-disable indent */
/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('TracksSideMenuCtrl', ['loDash', '$rootScope', '$scope', '$state', '$timeout', '$interval', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$ionicPopover', '$ionicModal', '$ionicLoading', '$ionicSideMenuDelegate', 'dataFactoryDropbox', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryTrack', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo', '$ionicListDelegate', '$ionicScrollDelegate', 'dataFactoryAnalytics',
  function (loDash, $rootScope, $scope, $state, $timeout, $interval, $cordovaNetwork, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, dataFactoryDropbox, dataFactoryHelp, dataFactoryTag, dataFactoryTrack, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo, $ionicListDelegate, $ionicScrollDelegate, dataFactoryAnalytics) {

    //console.warn('TracksSideMenuCtrl start');

    dataFactoryDropbox.setType('/Spoors');

    //console.warn('TracksSideMenuCtrl dropbox migratie done!');

    var mode = 'track';

    $scope.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.profiel = dataFactoryCeo.currentModel.get('pofiel');

    $scope.details = [];

    $scope.data = {};
    $scope.data.tags = dataFactoryTrack.sideMenuTags;

    $scope.global = {};
    $scope.global.filtertags = [];

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });

    $scope.data.filteredTracks = dataFactoryTrack.store;

    $rootScope.$on('trackSideMenuUpdate', function () {
      //console.error('trackSideMenuUpdate');
      $scope.data.tags = dataFactoryTrack.sideMenuTags;
      sorteerDataTags();
    });


    function sorteerDataTags() {
      //
      //  Eerst splitsen per type en sorteren en dan samenvoegen
      //
      //console.log('$scope.data.tags: ', $scope.data.tags);

      var tagsPrivate = loDash.filter($scope.data.tags, function (tag) {
        return tag.tagId.length !== 0 && tag.tagId.length <= 3 && tag.tagGebruikerId !== '';
      });
      tagsPrivate = loDash.orderBy(tagsPrivate, o => o.tag, 'asc');

      var tagsStandaard = loDash.filter($scope.data.tags, function (tag) {
        return tag.tagId.length !== 0 && tag.tagId.length <= 3 && tag.tagGebruikerId === '';
      });
      tagsStandaard = loDash.orderBy(tagsStandaard, o => o.tag, 'asc');

      var tagsNormaal = loDash.filter($scope.data.tags, function (tag) {
        return tag.tagId.length !== 0 && tag.tagId.length > 3;
      });

      tagsNormaal = loDash.orderBy(tagsNormaal, o => o.tag, 'asc');
      $scope.data.tags = [...tagsPrivate, ...tagsStandaard, ...tagsNormaal];

      //console.log('tagsPrivate, tagsStandaard, tagsNormaal: ', tagsPrivate, tagsStandaard, tagsNormaal);
    }

    sorteerDataTags();

    $scope.aantalAlle = dataFactoryTrack.store.length;
    $scope.aantalNieuw = dataFactoryTrack.nieuw.length;
    $scope.aantalStar = dataFactoryTrack.star.length;
    $scope.aantalGeenLabels = 0;

    $scope.ceo = {};
    $scope.ceo.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.ceo.profiel = dataFactoryCeo.currentModel.get('profiel');
    $scope.ceo.profielId = dataFactoryCeo.currentModel.get('profielId');

    $scope.dropbox = false;

    $scope.isMobile = false;
    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        $scope.isMobile = true;
      }
    });

    var initSearch = false;

    var lastArgs = dataFactoryConfig.currentModel.get('trackFilter');
    //console.log('trackSideMenuCtrl trackFilter from config: ', lastArgs);

    if (!lastArgs.filter) {
      lastArgs = {
        filter: 'Geen'
      };
    }
    if (typeof lastArgs === 'string') {
      lastArgs = JSON.parse(lastArgs);
    }
    var filter = lastArgs;
    //console.log('trackSideMenuCtrl trackFilter from config: ', filter);

    tracksAantallen();

    $scope.search = {
      label: ''
    };

    $scope.searchTrack = {
      naam: ''
    };

    var sorteer;
    var zoek = '';

    var sorter = dataFactoryConfig.currentModel.get('trackSorter');
    //console.log('trackSideMenuCtrl trackSorter from config: ', sorter);

    if (sorter.predicate === 'createdOn.value') {
      if (sorter.reverse) {
        sorter = {
          predicate: 'createdOn.value',
          reverse: true
        };
        sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
      } else {
        sorter = {
          predicate: 'createdOn.value',
          reverse: false
        };
        sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
      }
      $scope.tracksSortCreatedOnUp = sorter.reverse;
      //console.log('TrackSideMenuCtrl init sorter from config CreatedOn: ', sorter);
    }
    if (sorter.predicate === 'gelezen.value') {
      if (sorter.reverse) {
        sorter = {
          predicate: 'gelezen.value',
          reverse: true
        };
        sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
      } else {
        sorter = {
          predicate: 'gelezen.value',
          reverse: false
        };
        sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
      }
      $scope.tracksSortGelezenUp = sorter.reverse;
      //console.log('TrackSideMenuCtrl init sorter from config Gelezen: ', sorter);
    }
    if (sorter.predicate === 'naam.value') {
      if (sorter.reverse) {
        sorter = {
          predicate: 'naam.value',
          reverse: true
        };
        sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
      } else {
        sorter = {
          predicate: 'naam.value',
          reverse: false
        };
        sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
      }
      $scope.tracksSortNaamUp = sorter.reverse;
      //console.log('TrackSideMenuCtrl init sorter from config Naam: ', sorter);
    }

    $timeout(function () {
      $rootScope.$emit('trackPredicate', sorter);
      setNavTitle();
    }, 100);

    var loadingTime;

    dataFactoryTrack.selected = [];

    $scope.openKaart2 = function () {

      //console.warn('TrackSideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('sessie', 'kaarten', 'start', '1');
    };

    $scope.tracksSortNaamClick = function () {
      //console.warn('TrackSideMenuCtrl tracksSortNaamClick $scope.tracksSortNaamUp: ', $scope.tracksSortNaamUp);

      $scope.tracksSortNaamUp = !$scope.tracksSortNaamUp;
      if ($scope.tracksSortNaamUp) {
        sorter = {
          predicate: 'naam.value',
          reverse: true
        };
        sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        setNavTitle();
      } else {
        sorter = {
          predicate: 'naam.value',
          reverse: false
        };
        sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        setNavTitle();
      }
      $rootScope.$emit('trackPredicate', sorter);

    };

    $scope.tracksSortDatumClick = function () {

      //console.warn('TrackSideMenuCtrl tracksSortDatumClick $scope.tracksSortCreatedOnUp: ', $scope.tracksSortCreatedOnUp);

      $scope.tracksSortCreatedOnUp = !$scope.tracksSortCreatedOnUp;
      if ($scope.tracksSortCreatedOnUp) {
        sorter = {
          predicate: 'createdOn.value',
          reverse: false
        };
        sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        setNavTitle();
      } else {
        sorter = {
          predicate: 'createdOn.value',
          reverse: true
        };
        sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        setNavTitle();
      }
      $rootScope.$emit('trackPredicate', sorter);

    };

    $scope.tracksSortGelezenClick = function () {

      //console.warn('TrackSideMenuCtrl tracksSortGelezenClick $scope.tracksSortGelezenUp: ', $scope.tracksSortGelezenUp);

      $scope.tracksSortGelezenUp = !$scope.tracksSortGelezenUp;
      if ($scope.tracksSortGelezenUp) {
        sorter = {
          predicate: 'gelezen.value',
          reverse: true
        };
        sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
      } else {
        sorter = {
          predicate: 'gelezen.value',
          reverse: false
        };
        sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
      }
      setNavTitle();
      $rootScope.$emit('trackPredicate', sorter);
    };

    function tagsRemove(trackModel, tagModel) {

      //console.warn('TracksSideMenuCtrl tagsRemove trackModel, tagModel: ', trackModel, tagModel);
      //console.log('TracksSideMenuCtrl tagsRemove naam tag', trackModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find($scope.data.tags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('TracksSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = trackModel.get('naam');
        //
        //  Verwijder het trackModel uit de itemss tabel
        //
        //console.log('TracksSideMenuCtrl tagsRemove removing track Id from xtag.items: ', trackModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (track) {
          //return track.Id === trackModel.get('Id') && track.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return track.get('Id') === trackModel.get('Id');
        });

        loDash.remove($scope.data.tags.tracks, function (track) {
          return track.get('Id') === trackModel.get('Id');
        });


        if (xtag.items.length === 0) {
          loDash.remove($scope.data.tags, function (xtag) {
            return xtag.items.length === 0;
          });
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.items.length === 0;
          });

          sorteerDataTags();

        } else {

          tmp = loDash.filter(xtag.items, function (trackModel) {
            return trackModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (trackModel) {
            return trackModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('TracksSideMenuCtrl tagsAdd removed to update: ', xtag);
          $scope.data.tags.push(xtag);
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          sorteerDataTags();
        }

        //console.log('TracksSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), $scope.data.tags);
      } else {
        //console.error('TracksSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
      }
    }
    //
    //  Het trackModel bevat alle gegevens doe bij een track horen.
    //  In trackModel.xData.tag zitten alle trackTagModellen
    //  In iedere potagModel.xData is een bijbehorend tagModel
    //  hier noemen wij dat model tag.
    //  De parameter tagModel geeft aan om welke tagModel in
    //  trackModel.xData.tags.xData het gaat
    //    
    function tagsAdd(trackModel, tagModel) {
      //console.log('TracksSideMenuCtrl tagsAdd trackModel, tagModel: ', trackModel, tagModel);
      //console.log('TracksSideMenuCtrl tagsAdd naam tag', trackModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten $scope.data.tags hebben de volgende props:
      //  -    tracks: een tabel met alle trackModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde trackModellen.
      //  -    aantal: het unieke aantal trackModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in trackTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste trackModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(trackModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (trackModel) {
          return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        //$scope.data.tags.push(xtag);
        //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

        $scope.data.tags.push(xtag);

        sorteerDataTags();
        //console.log('TracksSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', trackModel.get('naam'), trackModel.get('Id'), $scope.data.tags);
        //console.log('TracksSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => $scope.data.tags object naam, Id: ', trackModel.get('naam'), trackModel.get('Id'), $scope.data.tags);

      } else {
        //
        //  Voeg het trackModel toe aan bestaand tag $scope.data.tag object
        //
        xtag.items.push(trackModel);
        //
        //  Update het trackTagModel
        //
        tmp = loDash.filter(xtag.items, function (trackModel) {
          return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (trackModel) {
          return trackModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('TracksSideMenuCtrl tagsAdd removed to update: ', xtag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('TracksSideMenuCtrl tagsAdd menu-onbject trackModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', trackModel.get('naam'), trackModel.get('Id'), $scope.data.tags);
      }
    }

    function tagsUpdate(tagModel) {
      //console.log('TracksSideMenuCtrl tagsUpdate naam tag', tagModel.get('tag'));
      //console.log('TracksSideMenuCtrl tagsUpdate $scope.data.tags: ', $scope.data.tags);
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tagId === tagModel.get('Id');
      });
      //
      //  Update tag
      //
      if (xtag !== undefined) {
        xtag.tag = tagModel.get('tag');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tagId === xtag.tagId;
        });
        //console.log('TracksSideMenuCtrl tagsAdd removed old tagModel: ', tagModel.get('tag'), xtag.tag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('TracksSideMenuCtrl tagsUpdate menu-onbject trackModel in #scope.data.tags  UPDATE: ', $scope.data.tags);
      } else {
        //console.error('TracksSideMenuCtrl tagsUpdate xtag NIET GEVONDEN: ', $scope.data.tags, tagModel.get('Id'));
      }
    }
    //
    // Loop daar alle tags om tags te updaten voor UI
    //
    function finalizeTags() {

      tracksAantallenGeenLabel();
    }

    function delayFinalizeTags() {
      //console.warn('delayFinalizeTags trackModel');
      finalizeTags();
      $timeout.cancel(loadingTime);

    }
    var debouncedFinalizeTags = loDash.debounce(delayFinalizeTags, 100);

    var event1 = $rootScope.$on('sideMenuTracksFilter', function (event, args) {

      //console.warn('sideMenuTracksFilter args: ', args);

      var filter = args.filter;
      var tag = {
        tagModel: args.tag
      };

      switch (filter) {
        case 'Tag':
          $scope.filterTag(tag);
          break;
        default:
          $scope.tracksFilterAlle();
      }
    });
    $scope.$on('$destroy', event1);

    $rootScope.$on('trackAddLabel', function (event, args) {
      //console.log('TracksSideMenuCtrl event trackAddLabel args: ', args);
      var trackModel = args.trackModel;
      var tagModel = args.tagModel;
      //console.warn('TracksSideMenuCtrl trackAddLabel: ', trackModel.get('naam'), tagModel.get('tag'));
      tagsAdd(trackModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('trackRemoveLabel', function (event, args) {
      //console.warn('TracksSideMenuCtrl event trackAddLabel args: ', args);
      var trackModel = args.trackModel;
      var tagModel = args.tagModel;
      //console.warn('TracksSideMenuCtrl trackRemoveLabel: ', trackModel, tagModel);
      //console.warn('TracksSideMenuCtrl trackRemoveLabel: ', trackModel.get('naam'), tagModel.get('tag'));
      tagsRemove(trackModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('trackUpdateLabel', function (event, args) {
      //console.warn('TracksSideMenuCtrl event trackUpdateLabel args: ', args);
      var tagModel = args.tagModel;
      //console.warn('++++++++++++++++++++++++++++++ TracksSideMenuCtrl trackUpdateLabel: ', tagModel.get('tag'));
      tagsUpdate(tagModel);
      debouncedFinalizeTags();
    });

    var event4 = $rootScope.$on('trackNavTitle', function (event, args) {

      //console.warn('+++ TracksSideMenuCtrl navTitle filter sorter, $scope.tracksSortNaamUp: ', args.filter, args.sorter, $scope.tracksSortNaamUp);
      filter.filter = args.filter.filter;
      if (args.filter.tag !== undefined) {
        filter.filter = args.filter.tag;
      }
      if (args.filter.search !== undefined) {
        zoek = args.filter.search;
      }
      $scope.searchTrack.naam = zoek;
      $rootScope.$emit('tracksFilter', args.filter);

      if (!args.sorter) {
        args.sorter = {};
      }

      if (args.sorter.reverse) {
        $scope.tracksSortNaamUp === false;
      }
    });
    $scope.$on('$destroy', event4);

    function tracksAantallenGeenLabel() {

      //console.warn('TracksSideMenuCtrl tracksAantallenGeenLabel');

      $scope.aantalGeenLabels = 0;

      loDash.each(dataFactoryTrack.store, function (trackModel) {
        if (trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
          if (trackModel.xData !== undefined) {
            if (trackModel.xData.tags !== undefined) {
              if (trackModel.xData.tags.length === 0) {
                $scope.aantalGeenLabels = $scope.aantalGeenLabels + 1;
              }
            } else {
              $scope.aantalGeenLabels = $scope.aantalGeenLabels + 1;
            }
          } else {
            $scope.aantalGeenLabels = $scope.aantalGeenLabels + 1;
          }
        }
      });
    }

    function tracksAantallen() {

      loDash.remove(dataFactoryTrack.store, function (trackModel) {
        return trackModel.xprive === true && (trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });
      loDash.remove(dataFactoryTrack.data, function (dataItem) {
        return dataItem.record.xprive === true && (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });

      $scope.aantalAlle = dataFactoryTrack.store.length;
      $scope.aantalMijn = loDash.filter(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      }).length;

      $scope.aantalPublic = loDash.filter(dataFactoryTrack.store, function (trackModel) {
        return trackModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
      }).length;
      $scope.aantalNieuw = dataFactoryTrack.nieuw.length;
      $scope.aantalStar = dataFactoryTrack.star.length;

      tracksAantallenGeenLabel();

      //console.log('TracksSideMenuCtrl aantalAlle: ' + $scope.aantalAlle + ', aantalMijn: ' + $scope.aantalMijn + ', aantalPublic: ' + $scope.aantalPublic + ', aantalNieuw: ' + $scope.aantalNieuw + ', aantalStar: ' + $scope.aantalStar  + ', aantalGeenLabels: ', $scope.aantalGeenLabels);
    }

    var event5 = $rootScope.$on('tracksNieuweAantallen', function () {

      //console.warn('TracksSideMenuCtrl on.tracksNieuwAantallen');

      tracksAantallen();
      //console.log('+++ TracksSideMenuCtrl aantalAlle, aantalMijn, aantalPublic, aantalNieuw, aantalStar, aantalGeenLabels: ', $scope.aantalAlle, $scope.aantalMijn, $scope.aantalPublic, $scope.aantalNieuw, $scope.aantalStar, $scope.aantalGeenLabels);
    });
    $scope.$on('$destroy', event5);

    var event7 = $scope.$on('elemHasFocus', function (event, args) {
      if (args.message !== 'Zoek label') {
        //console.warn('+++ TracksSideMenuCtrl elem has focus: ', args);
        filter.filter = 'Search';
        setNavTitle();

        $rootScope.$emit('trackStartSearch');
        if (args.message === 'Zoek in Spoors') {
          $ionicScrollDelegate.scrollTop(true);
        }
      }
    });
    $scope.$on('$destroy', event7);

    var event8 = $rootScope.$on('setPredicate', function (event, args) {

      //console.log('TracksSideMenuCtrl event setPredicate: ', args);

      sorter = JSON.parse(args);

      if (sorter.predicate === 'gelezen.value') {

        if (sorter.reverse === true) {
          $scope.tracksSortGelezenUp = true;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.tracksSortGelezenUp = false;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'naam.value') {
        if (sorter.reverse === true) {
          $scope.tracksSortNaamUp = true;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.tracksSortNaamUp = false;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'createdOn.value') {
        if (sorter.reverse === true) {
          $scope.tracksSortCreatedOnUp = true;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.tracksSortCreatedOnUp = false;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }

      setNavTitle();
    });
    $scope.$on('$destroy', event8);

    var event11 = $rootScope.$on('trackDelete', function () {

      loDash.each(dataFactoryTrack.store, function (trackModel) {
        if (!trackModel.xData) {
          trackModel.xData = {
            tags: []
          };
        }
      });
      debouncedFinalizeTags();

    });
    $scope.$on('$destroy', event11);

    // eslint-disable-next-line no-unused-vars
    $scope.$watch('search.label', function (val) {
      if ($scope.search.label !== '') {
        //console.error('+++ TracksSideMenuCtrl watch search.label label: ', $scope.search.label);
        //console.error('+++ TracksSideMenuCtrl watch search.label val: ', val);
      }
    });
    //
    $scope.$watch('searchTrack.naam', function (val) {

      if ($scope.searchTrack.naam !== '') {

        //console.warn('+++ TracksSideMenuCtrl watch searchTrack.naam naam: ', $scope.searchTrack.naam);
        //console.warn('+++ TracksSideMenuCtrl watch searchTrack.naam val: ', val);

        zoek = val;
        setNavTitle();
        $rootScope.$emit('tracksFilter', {
          filter: 'Search',
          search: $scope.searchTrack.naam
        });
        $state.go('tracks.tracks');
      } else {
        if (initSearch) {
          $scope.tracksFilterAlle();
        } else {
          initSearch = true;
        }
      }
    });

    $scope.clearSearch = function () {
      //console.log('TracksSideMenuCtrl clearSearch');
      $scope.search.label = '';
      zoek = '';
    };

    $scope.clearSearchTrack = function () {
      //console.log('TracksSideMenuCtrl clearSearchTrack');
      $scope.searchTrack.naam = '';
      zoek = '';
      setNavTitle();
      $rootScope.$emit('tracksFilter');
      $state.go('tracks.tracks');
    };

    var setNavTitleEvent = $rootScope.$on('setNavTitleEvent', function (event, tagFilter) {
      //console.log('TracksSideMenuCtrl setNavTitleEvent filter: ', tagFilter);
      filter = tagFilter;
      setNavTitle();
    });
    $scope.$on('$destroy', setNavTitleEvent);

    var trackSetNavTitleGlobalEvent = $rootScope.$on('trackSetNavTitleGlobal', function (event, args) {
      //console.log('TracksSideMenuCtrl setNavTitleGlobal filter, sorter: ', args);
      filter = {
        filter: args.filter
      };

      sorteer = args.sorteer;
      zoek = args.zoek;
      setNavTitle();
    });
    $scope.$on('$destroy', trackSetNavTitleGlobalEvent);

    function setNavTitle() {

      //console.log('TracksSideMenuCtrl setNavTitle sorteer: ', sorteer);
      //console.log('TracksSideMenuCtrl setNavTitle filter.filter: ', filter.filter);
      //console.log('TracksSideMenuCtrl setNavTitle zoek: ', zoek);

      $scope.subHeader = '';
      var first = false;
      if (filter.filter !== 'Geen') {
        $scope.subHeader = 'Sortering: ' + sorteer;
        first = true;
      }

      if (zoek === '') {
        if (filter.filter !== '' && filter.filter !== 'Alle') {
          if (filter.filter === 'Search') {
            if (first) {
              $scope.subHeader = $scope.subHeader + '&nbsp;&nbsp;&nbsp;&nbsp;Zoek: ' + zoek;
            } else {
              $scope.subHeader = $scope.subHeader + 'Zoek: ' + zoek;
            }
          } else {
            if (first) {
              $scope.subHeader = $scope.subHeader + '&nbsp;&nbsp;&nbsp;&nbsp;Filter: ' + filter.filter;
            } else {
              $scope.subHeader = $scope.subHeader + 'Filter: ' + filter.filter;
            }
            first = true;
          }
        }
      } else {
        if (first) {
          $scope.subHeader = $scope.subHeader + '&nbsp;&nbsp;&nbsp;&nbsp;Zoek: ' + zoek;
        } else {
          $scope.subHeader = $scope.subHeader + 'Zoek: ' + zoek;
        }
        first = true;
      }
      loadingTime = $timeout(function () {
        $ionicScrollDelegate.scrollTop(true);
      });

      //console.log('TracksSideMenuCtrl setNavTitle set : ', $scope.subHeader);

    }

    $scope.toggleLeftSideMenu = function () {
      //console.warn('BerichtenSideMenuCtrl toggleLeftSideMenu');
      dataFactoryAnalytics.createEvent('tracks', 'sessie', 'kaarten', '', '1');
      $ionicSideMenuDelegate.toggleLeft();
    };

    
    
    $rootScope.$on('trackFilterNotification', function () {
      //console.log('trackFilterNotification');
      //console.log('TracksSideMenuCtrl tracksFilterNieuw');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Nieuw'
      });
    });

    $scope.tracksFilterAlle = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterAlle');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Alle';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Alle'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterMijn = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterMijn');
      filter.filter = 'Mijn';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Mijn'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterPublic = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterPublic');
      filter.filter = 'Public';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Public'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterNieuw = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterNieuw');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Nieuw'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterFavorieten = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterFavorieten');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Favorieten';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Favorieten'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterOngelabeld = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterOngelabeld');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Geen label',
        tagId: '0'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterGeen = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterGeen');
      $scope.searchTrack.naam = '';
      zoek = '';

      filter.filter = 'Geen';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Geen'
      });
      $state.go('tracks.tracks');
    };

    $scope.tracksFilterGeenLabel = function () {
      //console.warn('TracksSideMenuCtrl tracksFilterGeen');
      $scope.searchTrack.naam = '';
      zoek = '';
      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('tracksFilter', {
        filter: 'Geen label'
      });
      //console.error('+++ TracksSideMenuCtrl tracksFilter: Geen');
      $state.go('tracks.tracks');
    };

    $scope.filterTag = function (tag) {

      //console.warn('TracksSideMenuCtrl filterTag: ', tag);
      filter.filter = tag.tag;
      //console.log('TracksSideMenuCtrl tracksFilter: ', filter.filter);

      setNavTitle();

      $rootScope.$emit('tracksFilter', {
        filter: 'Tag',
        tag: tag.tag
        //tagId: tag.tracks[0].xData.tags[0].xData.get('Id')
      });
      //console.log('TracksSideMenuCtrl tracksFilter: ', { filter: 'Tag', tag: tag.items[0].xData.tags[0].xData, tagId: tag.items[0].xData.tags[0].xData.get('Id') });

      $state.go('tracks.tracks');
    };

    $scope.tracksVerwijderDoelgroep = function () {
      //console.warn('BerichtenSideMenuCtrl tracksVerwijderDoelgroep');
    };

    //
    // Wijzig de in sidemnu gewijzigde tag in store en database
    // Overal wara deze tag gebruikt wordt moet deze tag gewijzigd worden.
    // Tags worden gebruikt in tracks, locatiesen en tracks.
    //
    //  Alleen de eigenaar van het trackTagModel mag editen
    // @param  {[type]} tag [description]
    // @return {[type]}     [description]
    //
    $scope.editTagFromSideMenu = function (xtag) {

      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu xtag: ', xtag);
      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu tagId: ', xtag.tagId);
      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu tagGebruikerId : ', xtag.tagGebruikerId);

      $ionicListDelegate.closeOptionButtons();
      //
      if (xtag.tagGebruikerId === dataFactoryCeo.currentModel.get('Id')) {

        var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
          return tagModel.get('Id') === xtag.tagId;
        });
        //console.log('TracksSideMenuCtrl editTagFromSideMenu tagModel gevonden: ', tagModel);
        if (!tagModel || (tagModel.get('Id').length < 4 || tagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
          $ionicPopup.alert({
            title: 'Wijzigen label',
            content: 'Label is een standaard label.<br>Niemand kan dit label wijzigen.'
          });
        } else {
          if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            $scope.editTag(tagModel, xtag);
          } else {
            //console.log('TracksSideMenuCtrl editTagFromSideMenu ongeldigtagModel gevonden: ', tagModel, tagModel.get('gebruikerId'), dataFactoryCeo.currentModel.get('Id'));
          }
        }
      } else {
        $ionicPopup.alert({
          title: 'Wijzigen label',
          content: 'Label is van iemand anders.<br>Je kan dit label niet wijzigen.'
        });
      }
    };

    $scope.editTag = function (tagModel, xtag) {
      //console.warn('TracksSideMenuCtrl editTag tagModel: ', tagModel);

      var tag = xtag.tag;
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

        //console.log('TracksSideMenuCtrl editTag Label gewijzigd in: ' + res);
        if (res !== undefined) {

          xtag.tag = res;

          tagModel.set('tag', res);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });

            sorteerDataTags();
            //
            //  De labels in de modellen (lijst) worden wel gewijzigd.
            $rootScope.$emit('tracksFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });
            $state.go('tracks.tracks');
          });
        }
      });
    };
    //
    // Verwijder de in de sideMenu geselecteerde tag in de Store en database
    // Overal waar deze tag gebruikt wordt moet ook daar deze tag verwijderd worden.
    // Tags worden gebruikt in fotos, locaties en sporen
    //
    // @param  {[type]} tag [description]
    // @return {[type]}     [description]
    //
    $scope.deleteTagFromSideMenu = function (xtag) {

      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu xtag: ', xtag);
      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu tagId: ', xtag.tagId);
      //console.log('TracksSideMenuCtrl deleteTagFromSideMenu tagGebruikerId : ', xtag.tagGebruikerId);

      $ionicListDelegate.closeOptionButtons();
      //
      if (xtag.tagGebruikerId === dataFactoryCeo.currentModel.get('Id')) {

        var tagModel = loDash.find(dataFactoryTag.store, function (tagModel) {
          return tagModel.get('Id') === xtag.tagId;
        });
        //console.log('TracksSideMenuCtrl editTagFromSideMenu tagModel gevonden: ', tagModel);
        if (!tagModel || (tagModel.get('Id').length < 4 || tagModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'))) {
          $ionicPopup.alert({
            title: 'Verwijderen label',
            content: 'Label is een standaard label.<br>Niemand kan dit label verwijderen.'
          });
        } else {
          if (tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
            $scope.deleteTag(tagModel, xtag);
          } else {
            //console.log('TracksSideMenuCtrl editTagFromSideMenu ongeldigtagModel gevonden: ', tagModel, tagModel.get('gebruikerId'), dataFactoryCeo.currentModel.get('Id'));
          }
        }
      } else {
        $ionicPopup.alert({
          title: 'Verwijderen label',
          content: 'Label is van iemand anders.<br>Je kan dit label niet verwijderen.'
        });
      }
    };

    $scope.deleteTag = function (tagModel, xtag) {

      //console.log('TracksSideMenuCtrl deleteTag tagModel: ', tagModel);
      //console.log('TracksSideMenuCtrl deleteTag xtag: ', xtag);

      $ionicPopup.confirm({
        title: 'Verwijderen label',
        content: 'Label <br><br><span class="trinl-rood"><b>' + xtag.tag + '</b></span><br><br>wordt overal verwijderd.',
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Verwijderen</b>',
          type: 'button-positive',
          onTap: function () {

            $scope.closeTags();
            //loDash.each($scope.data.tags, function(xtag) {
            var truuk = [];
            loDash.each(xtag.items, function (itemModel) {
              truuk.push(itemModel);
            });
            loDash.each(truuk, function (trackModel) {
              //console.log('TracksSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, trackModel);
              if (trackModel && trackModel.xData) {
                //

                sorteerDataTags();
                //
                loDash.each(trackModel.xData.tags, function (trackTagModel) {
                  //console.log('TracksSideMenuCtrl deleteTag trackModal.tags loop: ', trackModel.xData.tags, trackTagModel);
                  (function (trackModel, trackTagModel) {
                    if (trackTagModel.xData.get('tag') === xtag.tag) {
                      //console.log('TracksSideMenuCtrl deleteTag trackTagModel in trackModel.tags wordt verwijderd uit backend: ', trackTagModel);
                      trackTagModel.remove().then(function () {
                        //console.log('TracksSideMenuCtrl deleteTag trackTagModel wordt verwijderd uit trackModel.tags: ', trackTagModel);
                        loDash.remove(trackModel.xData.tags, function (trackTagModel) {
                          return trackTagModel.xData.get('tag') === xtag.tag;
                        });
                      });
                      $rootScope.$emit('trackRemoveLabel', {
                        trackModel: trackModel,
                        tagModel: tagModel
                      });

                    }
                  })(trackModel, trackTagModel);
                });
              }
            });

            //console.log('TracksSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === xtag.tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === xtag.tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle tracktags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('TracksSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.tracksFilterAlle();
            $state.go('tracks.tracks');
          }
        }]
      });

    };

    $scope.verwijderSelectie = function () {
      //console.log('TracksSideMenuCtrl event trackVerwijderSelectie');
      $rootScope.$emit('trackVerwijderSelectie', filter);
    };
    //
    //	Init Dropbox
    //
    $scope.exporteerSelectie = function () {
      //console.log('TracksSideMenuCtrl event trackExporteerSelectie');
      $rootScope.$emit('trackExporteerSelectie', filter);
    };

    $scope.setDropbox = function () {

      $ionicPopup.confirm({
        title: 'Koppelen Dropbox',
        content: 'De dropbox koppelen betekent dat TRINL bestanden kan uitwisselen met jouw Dropbox<br><br>Weet je dit zeker?',
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Koppelen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.dropbox = true;
            $rootScope.$emit('setDropbox');
          }
        }]
      });
    };

    $rootScope.$on('setDropboxReady', function () {
      //console.log('TracksSideMenuCtrl event setDropboxReady');
      $scope.dropbox = true;
    });

    $scope.resetDropbox = function () {
      $ionicPopup.confirm({
        title: 'Ontkoppelen Dropbox',
        content: 'De dropbox ontkoppelen betekent dat TRINL geen bestanden meer kan uitwisselen met jouw Dropbox<br><br>Weet je dit zeker?',
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Ontkoppelen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.dropbox = false;
            $rootScope.$emit('resetDropbox');
          }
        }]
      });
    };

    $rootScope.$on('resetDropboxReady', function () {
      //console.log('TracksSideMenuCtrl event resetDropboxReady');
      $scope.dropbox = false;
    });

    function checkDbToken() {
      dataFactoryConfigX.loadMe().then(function (configModel) {
        dataFactoryDropbox.accessToken = configModel.get('dbtoken');
        //console.log('TracksSideMenuCtrl configX loadMe dbtoken: ', configModel.get('gebruikerId'), configModel.get('Id'), configModel.get('dbtoken'));
        //console.log('TracksSideMenuCtrl $scope.dropbox: ', $scope.dropbox);

        if ($scope.dropbox && dataFactoryDropbox.accessToken === '') {
          $scope.dropbox = false;
          //console.error('TrackSideMenuCtrl ontkoppelen: ', dataFactoryDropbox.accessToken);
        }
        if (!$scope.dropbox && dataFactoryDropbox.accessToken !== '') {
          $scope.dropbox = true;
          //console.log('TrackSideMenuCtrl koppelen: ', dataFactoryDropbox.accessToken);
        }
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        $scope.dropbox = false;
        dataFactoryDropbox.accessToken = '';
        //console.error('TracksSideMenuCtrl configX.loadme ERROR: ', err);
      });
    }
    //
    // Door alle platforms wordt gekeken of het dbtoken is gewijzigd
    // Het resultaat is dropbox = false/true;
    //
    $interval(function () {
      //console.log('TracksSideMenuCtrl checking dropbox token');
      checkDbToken();
    }, 10000, 5);
    //
    // ***** I N I T status network *****
    // Bij start van TracksSideMenuCtrl eenmalig installeren network event listeners.
    // online = false/true is true tenzij het netwerk offline is
    // drobox = false/true bepalen adhv dbtoken.
    //
    // Alleen voor Mobile
    //
    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

      $rootScope.$on('$cordovaNetwork:online', function () {
        $scope.online = true;
        //console.warn('================================================================================ event cordovaNetwork:online');
        checkDbToken();
      });

      $rootScope.$on('$cordovaNetwork:offline', function () {
        //console.warn('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ event cordovaNetwork:offline');
        $scope.online = false;
      });

      $scope.online = true;
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        if ($cordovaNetwork.isOffline()) {
          $scope.online = false;
        }
      }
      checkDbToken();

    } else {
      //
      // Desktop
      //
      $scope.online = true;
      checkDbToken();
    }

    $scope.addNieuweLabel = function (tag) {

      //console.warn('TrackCardCtrl addNieuweLabel: ', tag);

      if (tag !== '') {

        var found = loDash.find($scope.global.tags, function (tagModel) {
          return tagModel.get('tag') === tag;
        });
        if (!found) {
          var tagModel = new dataFactoryTag.Model();
          tagModel.set('tag', tag);
          tagModel.set('gebruikerId', dataFactoryCeo.currentModel.get('Id'));
          tagModel.save().then(function () {
            $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
              return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });

            sorteerDataTags();
            //
            $scope.selectLabelClick(tagModel);
            $scope.clearSearch();
            //console.log('TrackCardCtrl addNieuweLabel tag: ', tagModel);
          });
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
          $scope.closeTags();
        }
      }
    };

    $scope.selectLabelClick = function (tagModel) {

      //console.warn('TrackSideMenuCtrl selectLabelClick tagModel: ', tagModel);
      //console.log('TrackSideMenuCtrl selectLabelClick tagId: ', tagModel.get('Id'));

      $ionicPopup.confirm({
        title: 'Spoors zonder label',
        template: 'Label <br><br><span class="trinl-rood"><b>' + tagModel.get('tag') + '</b></span><br><br>toevoegen aan alle Spoors zonder label',
        scope: $scope,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Labels toevoegen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.closeTags();
            $rootScope.$emit('labelGeenLabelTrack', {
              tagModel: tagModel
            });
          }
        }]
      });
      $scope.closeTags();
    };

    function typingHelp(tmp) {

      var tmp2, tmp3;
      var helpTypes, helpType, helpTyp;
      if (mode === 'bericht') {
        helpTypes = 'Berichten';
        helpType = 'Bericht';
        helpTyp = 'dit';
      }
      if (mode === 'foto') {
        helpTypes = 'Foto\'s';
        helpType = 'Foto';
        helpTyp = 'deze';
      }
      if (mode === 'poi') {
        helpTypes = 'Spoors';
        helpType = 'Spoor';
        helpTyp = 'deze';
      }
      if (mode === 'track') {
        helpTypes = 'Sporen';
        helpType = 'Spoor';
        helpTyp = 'dit';
      }
      //console.log(mode, tmp);
      tmp.naam = tmp.naam.replace('__TYPE__', helpType);
      tmp2 = tmp.help.replace(/__TYP__/g, helpTyp);
      tmp3 = tmp2.replace(/__TYPE__/g, helpType);
      tmp.help = tmp3.replace(/__TYPES__/g, helpTypes);

      //console.log('HELP tmp: ', tmp);

      $scope.cardHelps.push(tmp);
    }

    function showHelpBeheerMenu() {
      $scope.details = {};
      $scope.details.avatarColor = $scope.avatarColor;
      $scope.details.avatarLetter = $scope.avatarLetter;
      $scope.details.avatarInverse = $scope.avatarInverse;

      var items;
      if (mode === 'bericht') {
        items = 'Berichten';
      }
      if (mode === 'foto') {
        items = 'Foto\'s';
      }
      if (mode === 'poi') {
        items = 'Spoors';
      }
      if (mode === 'track') {
        items = 'Sporen';
      }
      $scope.titelHelp = 'BeheerMenu ' + items;

      $scope.cardHelps = [];

      var diversen,
        filters,
        filterlabel,
        geenlabels,
        sorteren,
        verwijderselectie,
        dropbox;

      diversen = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-diversen';
      });
      typingHelp(loDash.mapValues(diversen, 'value'));

      filters = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-filters';
      });
      typingHelp(loDash.mapValues(filters, 'value'));

      filterlabel = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-filter-label';
      });
      typingHelp(loDash.mapValues(filterlabel, 'value'));

      geenlabels = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-geen-labels';
      });
      typingHelp(loDash.mapValues(geenlabels, 'value'));

      sorteren = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-sorteren';
      });
      typingHelp(loDash.mapValues(sorteren, 'value'));

      verwijderselectie = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-verwijder-selectie';
      });
      typingHelp(loDash.mapValues(verwijderselectie, 'value'));

      dropbox = loDash.find(dataFactoryHelp.store, function (helpModel) {
        return helpModel.get('modal') === 'beheermenu-dropbox';
      });
      typingHelp(loDash.mapValues(dropbox, 'value'));

    }

    $scope.geenLabelSelectie = function ($event) {

      //console.warn('TrackSideMenuCtrl geenLabelSelectie: ', $event, $scope.global.tags);

      dataFactoryTag.syncDown().then(function () {
        $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
          return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
      });

      $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
        return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      });

      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.openTags = function ($event) {
      //console.warn('TrackSideMenuCtrl openTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function ($event) {
      //console.warn('TrackSideMenuCtrl closeTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeModalTags();
      } else {
        $scope.closePopoverTags($event);
      }
    };
    //
    // Popover Tags
    //
    $ionicPopover.fromTemplateUrl('tagsPopover.html', {
      scope: $scope,
    }).then(function (popoverTags) {
      $scope.popoverTags = popoverTags;
    });

    $scope.openPopoverTags = function ($event) {
      //$scope.search.label = '';
      //console.log($scope.global, $scope.search.label);
      //console.warn('TrackSideMenuCtrl openPopoverTags: ', $event);

      //console.warn('TrackSideMenuCtrl openModalTags: ', $scope.global.tags);
      $scope.popoverTags.show($event);
    };

    $scope.closePopoverTags = function () {
      $scope.popoverTags.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.popoverTags.remove();
    });
    //
    // Modal Tags
    //
    $ionicModal.fromTemplateUrl('tagsModal.html', function (modalTags) {
      $scope.modalTags = modalTags;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $scope.openModalTags = function ($event) {
      //console.warn('TrackSideMenuCtrl openModalTags: ', $scope.global.tags);
      $scope.modalTags.show($event);
    };

    $scope.closeModalTags = function () {
      //console.warn('closeModalTags: ');
      $scope.modalTags.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modalTags.remove();
    });
    //
    //  HELP
    //
    $scope.closeHelp = function ($event) {
      //console.log('TrackSideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $scope.openHelpTrackMenu = function ($event) {
      showHelpBeheerMenu();
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openHelpModal();
      } else {
        $scope.openHelpPopover($event);
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
      //console.log('TrackSideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('TrackSideMenuCtrl openHelpPopover');
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
      //console.log('TrackSideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      //console.log('TrackSideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
