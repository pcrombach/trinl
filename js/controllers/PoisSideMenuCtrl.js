/* eslint-disable indent */
/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('PoisSideMenuCtrl', ['loDash', '$rootScope', '$scope', '$state', '$timeout', '$interval', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$ionicPopover', '$ionicModal', '$ionicLoading', '$ionicSideMenuDelegate', 'dataFactoryDropbox', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryPoi', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo', '$ionicListDelegate', '$ionicScrollDelegate', 'dataFactoryAnalytics',
  function (loDash, $rootScope, $scope, $state, $timeout, $interval, $cordovaNetwork, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, dataFactoryDropbox, dataFactoryHelp, dataFactoryTag, dataFactoryPoi, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo, $ionicListDelegate, $ionicScrollDelegate, dataFactoryAnalytics) {

    //console.warn('PoisSideMenuCtrl start');

    dataFactoryDropbox.setType('/Locaties');

    //console.warn('PoisSideMenuCtrl dropbox migratie done!');

    var mode = 'poi';

    $scope.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.profiel = dataFactoryCeo.currentModel.get('pofiel');

    $scope.details = [];

    $scope.data = {};
    $scope.data.tags = dataFactoryPoi.sideMenuTags;

    $scope.global = {};
    $scope.global.filtertags = [];

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });

    $scope.data.filteredPois = dataFactoryPoi.store;

    $rootScope.$on('poiSideMenuUpdate', function () {
      //console.error('poiSideMenuUpdate');
      $scope.data.tags = dataFactoryPoi.sideMenuTags;
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

    $scope.aantalAlle = dataFactoryPoi.store.length;
    $scope.aantalNieuw = dataFactoryPoi.nieuw.length;
    $scope.aantalStar = dataFactoryPoi.star.length;
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

    var lastArgs = dataFactoryConfig.currentModel.get('poiFilter');
    //console.log('poiSideMenuCtrl poiFilter from config: ', lastArgs);

    if (!lastArgs.filter) {
      lastArgs = {
        filter: 'Geen'
      };
    }
    if (typeof lastArgs === 'string') {
      lastArgs = JSON.parse(lastArgs);
    }
    var filter = lastArgs;
    //console.log('poiSideMenuCtrl poiFilter from config: ', filter);

    poisAantallen();

    $scope.search = {
      label: ''
    };

    $scope.searchPoi = {
      naam: ''
    };

    var sorteer;
    var zoek = '';

    var sorter = dataFactoryConfig.currentModel.get('poiSorter');
    //console.log('poiSideMenuCtrl poiSorter from config: ', sorter);

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
      $scope.poisSortCreatedOnUp = sorter.reverse;
      //console.log('PoiSideMenuCtrl init sorter from config CreatedOn: ', sorter);
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
      $scope.poisSortGelezenUp = sorter.reverse;
      //console.log('PoiSideMenuCtrl init sorter from config Gelezen: ', sorter);
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
      $scope.poisSortNaamUp = sorter.reverse;
      //console.log('PoiSideMenuCtrl init sorter from config Naam: ', sorter);
    }

    $timeout(function () {
      $rootScope.$emit('poiPredicate', sorter);
      setNavTitle();
    }, 100);

    var loadingTime;

    dataFactoryPoi.selected = [];

    $scope.openKaart2 = function () {

      //console.warn('PoiSideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('sessie', 'kaarten', 'start', '1');
    };

    $scope.poisSortNaamClick = function () {
      //console.warn('PoiSideMenuCtrl poisSortNaamClick $scope.poisSortNaamUp: ', $scope.poisSortNaamUp);

      $scope.poisSortNaamUp = !$scope.poisSortNaamUp;
      if ($scope.poisSortNaamUp) {
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
      $rootScope.$emit('poiPredicate', sorter);

    };

    $scope.poisSortDatumClick = function () {

      //console.warn('PoiSideMenuCtrl poisSortDatumClick $scope.poisSortCreatedOnUp: ', $scope.poisSortCreatedOnUp);

      $scope.poisSortCreatedOnUp = !$scope.poisSortCreatedOnUp;
      if ($scope.poisSortCreatedOnUp) {
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
      $rootScope.$emit('poiPredicate', sorter);

    };

    $scope.poisSortGelezenClick = function () {

      //console.warn('PoiSideMenuCtrl poisSortGelezenClick $scope.poisSortGelezenUp: ', $scope.poisSortGelezenUp);

      $scope.poisSortGelezenUp = !$scope.poisSortGelezenUp;
      if ($scope.poisSortGelezenUp) {
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
      $rootScope.$emit('poiPredicate', sorter);
    };

    function tagsRemove(poiModel, tagModel) {

      //console.warn('PoisSideMenuCtrl tagsRemove poiModel, tagModel: ', poiModel, tagModel);
      //console.log('PoisSideMenuCtrl tagsRemove naam tag', poiModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find($scope.data.tags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('PoisSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = poiModel.get('naam');
        //
        //  Verwijder het poiModel uit de itemss tabel
        //
        //console.log('PoisSideMenuCtrl tagsRemove removing poi Id from xtag.items: ', poiModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (poi) {
          //return poi.Id === poiModel.get('Id') && poi.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return poi.get('Id') === poiModel.get('Id');
        });

        loDash.remove($scope.data.tags.pois, function (poi) {
          return poi.get('Id') === poiModel.get('Id');
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

          tmp = loDash.filter(xtag.items, function (poiModel) {
            return poiModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (poiModel) {
            return poiModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('PoisSideMenuCtrl tagsAdd removed to update: ', xtag);
          $scope.data.tags.push(xtag);
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          sorteerDataTags();
        }

        //console.log('PoisSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), $scope.data.tags);
      } else {
        //console.error('PoisSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
      }
    }
    //
    //  Het poiModel bevat alle gegevens doe bij een poi horen.
    //  In poiModel.xData.tag zitten alle poiTagModellen
    //  In iedere potagModel.xData is een bijbehorend tagModel
    //  hier noemen wij dat model tag.
    //  De parameter tagModel geeft aan om welke tagModel in
    //  poiModel.xData.tags.xData het gaat
    //    
    function tagsAdd(poiModel, tagModel) {
      //console.log('PoisSideMenuCtrl tagsAdd poiModel, tagModel: ', poiModel, tagModel);
      //console.log('PoisSideMenuCtrl tagsAdd naam tag', poiModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten $scope.data.tags hebben de volgende props:
      //  -    pois: een tabel met alle poiModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde poiModellen.
      //  -    aantal: het unieke aantal poiModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in poiTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste poiModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(poiModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (poiModel) {
          return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        //$scope.data.tags.push(xtag);
        //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

        $scope.data.tags.push(xtag);

        sorteerDataTags();
        //console.log('PoisSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', poiModel.get('naam'), poiModel.get('Id'), $scope.data.tags);
        //console.log('PoisSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => $scope.data.tags object naam, Id: ', poiModel.get('naam'), poiModel.get('Id'), $scope.data.tags);

      } else {
        //
        //  Voeg het poiModel toe aan bestaand tag $scope.data.tag object
        //
        xtag.items.push(poiModel);
        //
        //  Update het poiTagModel
        //
        tmp = loDash.filter(xtag.items, function (poiModel) {
          return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (poiModel) {
          return poiModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('PoisSideMenuCtrl tagsAdd removed to update: ', xtag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('PoisSideMenuCtrl tagsAdd menu-onbject poiModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', poiModel.get('naam'), poiModel.get('Id'), $scope.data.tags);
      }
    }

    function tagsUpdate(tagModel) {
      //console.log('PoisSideMenuCtrl tagsUpdate naam tag', tagModel.get('tag'));
      //console.log('PoisSideMenuCtrl tagsUpdate $scope.data.tags: ', $scope.data.tags);
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
        //console.log('PoisSideMenuCtrl tagsAdd removed old tagModel: ', tagModel.get('tag'), xtag.tag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('PoisSideMenuCtrl tagsUpdate menu-onbject poiModel in #scope.data.tags  UPDATE: ', $scope.data.tags);
      } else {
        //console.error('PoisSideMenuCtrl tagsUpdate xtag NIET GEVONDEN: ', $scope.data.tags, tagModel.get('Id'));
      }
    }
    //
    // Loop daar alle tags om tags te updaten voor UI
    //
    function finalizeTags() {

      poisAantallenGeenLabel();
    }

    function delayFinalizeTags() {
      //console.warn('delayFinalizeTags poiModel');
      finalizeTags();
      $timeout.cancel(loadingTime);

    }
    var debouncedFinalizeTags = loDash.debounce(delayFinalizeTags, 100);

    var event1 = $rootScope.$on('sideMenuPoisFilter', function (event, args) {

      //console.warn('sideMenuPoisFilter args: ', args);

      var filter = args.filter;
      var tag = {
        tagModel: args.tag
      };

      switch (filter) {
        case 'Tag':
          $scope.filterTag(tag);
          break;
        default:
          $scope.poisFilterAlle();
      }
    });
    $scope.$on('$destroy', event1);

    $rootScope.$on('poiAddLabel', function (event, args) {
      //console.log('PoisSideMenuCtrl event poiAddLabel args: ', args);
      var poiModel = args.poiModel;
      var tagModel = args.tagModel;
      //console.warn('PoisSideMenuCtrl poiAddLabel: ', poiModel.get('naam'), tagModel.get('tag'));
      tagsAdd(poiModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('poiRemoveLabel', function (event, args) {
      //console.warn('PoisSideMenuCtrl event poiAddLabel args: ', args);
      var poiModel = args.poiModel;
      var tagModel = args.tagModel;
      //console.warn('PoisSideMenuCtrl poiRemoveLabel: ', poiModel, tagModel);
      //console.warn('PoisSideMenuCtrl poiRemoveLabel: ', poiModel.get('naam'), tagModel.get('tag'));
      tagsRemove(poiModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('poiUpdateLabel', function (event, args) {
      //console.warn('PoisSideMenuCtrl event poiUpdateLabel args: ', args);
      var tagModel = args.tagModel;
      //console.warn('++++++++++++++++++++++++++++++ PoisSideMenuCtrl poiUpdateLabel: ', tagModel.get('tag'));
      tagsUpdate(tagModel);
      debouncedFinalizeTags();
    });

    var event4 = $rootScope.$on('poiNavTitle', function (event, args) {

      //console.warn('+++ PoisSideMenuCtrl navTitle filter sorter, $scope.poisSortNaamUp: ', args.filter, args.sorter, $scope.poisSortNaamUp);
      filter.filter = args.filter.filter;
      if (args.filter.tag !== undefined) {
        filter.filter = args.filter.tag;
      }
      if (args.filter.search !== undefined) {
        zoek = args.filter.search;
      }
      $scope.searchPoi.naam = zoek;
      $rootScope.$emit('poisFilter', args.filter);

      if (!args.sorter) {
        args.sorter = {};
      }

      if (args.sorter.reverse) {
        $scope.poisSortNaamUp === false;
      }
    });
    $scope.$on('$destroy', event4);

    function poisAantallenGeenLabel() {

      //console.warn('PoisSideMenuCtrl poisAantallenGeenLabel');

      $scope.aantalGeenLabels = 0;

      loDash.each(dataFactoryPoi.store, function (poiModel) {
        if (poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
          if (poiModel.xData !== undefined) {
            if (poiModel.xData.tags !== undefined) {
              if (poiModel.xData.tags.length === 0) {
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

    function poisAantallen() {

      loDash.remove(dataFactoryPoi.store, function (poiModel) {
        return poiModel.xprive === true && (poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });
      loDash.remove(dataFactoryPoi.data, function (dataItem) {
        return dataItem.record.xprive === true && (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });

      $scope.aantalAlle = dataFactoryPoi.store.length;
      $scope.aantalMijn = loDash.filter(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      }).length;

      $scope.aantalPublic = loDash.filter(dataFactoryPoi.store, function (poiModel) {
        return poiModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
      }).length;
      $scope.aantalNieuw = dataFactoryPoi.nieuw.length;
      $scope.aantalStar = dataFactoryPoi.star.length;

      poisAantallenGeenLabel();

      //console.log('PoisSideMenuCtrl aantalAlle: ' + $scope.aantalAlle + ', aantalMijn: ' + $scope.aantalMijn + ', aantalPublic: ' + $scope.aantalPublic + ', aantalNieuw: ' + $scope.aantalNieuw + ', aantalStar: ' + $scope.aantalStar  + ', aantalGeenLabels: ', $scope.aantalGeenLabels);
    }

    var event5 = $rootScope.$on('poisNieuweAantallen', function () {

      //console.warn('PoisSideMenuCtrl on.poisNieuwAantallen');

      poisAantallen();
      //console.log('+++ PoisSideMenuCtrl aantalAlle, aantalMijn, aantalPublic, aantalNieuw, aantalStar, aantalGeenLabels: ', $scope.aantalAlle, $scope.aantalMijn, $scope.aantalPublic, $scope.aantalNieuw, $scope.aantalStar, $scope.aantalGeenLabels);
    });
    $scope.$on('$destroy', event5);

    var event7 = $scope.$on('elemHasFocus', function (event, args) {
      if (args.message !== 'Zoek label') {
        //console.warn('+++ PoisSideMenuCtrl elem has focus: ', args);
        filter.filter = 'Search';
        setNavTitle();

        $rootScope.$emit('poiStartSearch');
        if (args.message === 'Zoek in Locaties') {
          $ionicScrollDelegate.scrollTop(true);
        }
      }
    });
    $scope.$on('$destroy', event7);

    var event8 = $rootScope.$on('setPredicate', function (event, args) {

      //console.log('PoisSideMenuCtrl event setPredicate: ', args);

      sorter = JSON.parse(args);

      if (sorter.predicate === 'gelezen.value') {

        if (sorter.reverse === true) {
          $scope.poisSortGelezenUp = true;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.poisSortGelezenUp = false;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'naam.value') {
        if (sorter.reverse === true) {
          $scope.poisSortNaamUp = true;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.poisSortNaamUp = false;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'createdOn.value') {
        if (sorter.reverse === true) {
          $scope.poisSortCreatedOnUp = true;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.poisSortCreatedOnUp = false;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }

      setNavTitle();
    });
    $scope.$on('$destroy', event8);

    var event11 = $rootScope.$on('poiDelete', function () {

      loDash.each(dataFactoryPoi.store, function (poiModel) {
        if (!poiModel.xData) {
          poiModel.xData = {
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
        //console.error('+++ PoisSideMenuCtrl watch search.label label: ', $scope.search.label);
        //console.error('+++ PoisSideMenuCtrl watch search.label val: ', val);
      }
    });
    //
    $scope.$watch('searchPoi.naam', function (val) {

      if ($scope.searchPoi.naam !== '') {

        //console.warn('+++ PoisSideMenuCtrl watch searchPoi.naam naam: ', $scope.searchPoi.naam);
        //console.warn('+++ PoisSideMenuCtrl watch searchPoi.naam val: ', val);

        zoek = val;
        setNavTitle();
        $rootScope.$emit('poisFilter', {
          filter: 'Search',
          search: $scope.searchPoi.naam
        });
        $state.go('pois.pois');
      } else {
        if (initSearch) {
          $scope.poisFilterAlle();
        } else {
          initSearch = true;
        }
      }
    });

    $scope.clearSearch = function () {
      //console.log('PoisSideMenuCtrl clearSearch');
      $scope.search.label = '';
      zoek = '';
    };

    $scope.clearSearchPoi = function () {
      //console.log('PoisSideMenuCtrl clearSearchPoi');
      $scope.searchPoi.naam = '';
      zoek = '';
      setNavTitle();
      $rootScope.$emit('poisFilter');
      $state.go('pois.pois');
    };

    var setNavTitleEvent = $rootScope.$on('setNavTitleEvent', function (event, tagFilter) {
      //console.log('PoisSideMenuCtrl setNavTitleEvent filter: ', tagFilter);
      filter = tagFilter;
      setNavTitle();
    });
    $scope.$on('$destroy', setNavTitleEvent);

    var poiSetNavTitleGlobalEvent = $rootScope.$on('poiSetNavTitleGlobal', function (event, args) {
      //console.log('PoisSideMenuCtrl setNavTitleGlobal filter, sorter: ', args);
      filter = {
        filter: args.filter
      };

      sorteer = args.sorteer;
      zoek = args.zoek;
      setNavTitle();
    });
    $scope.$on('$destroy', poiSetNavTitleGlobalEvent);

    function setNavTitle() {

      //console.log('PoisSideMenuCtrl setNavTitle sorteer: ', sorteer);
      //console.log('PoisSideMenuCtrl setNavTitle filter.filter: ', filter.filter);
      //console.log('PoisSideMenuCtrl setNavTitle zoek: ', zoek);

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

      //console.log('PoisSideMenuCtrl setNavTitle set : ', $scope.subHeader);

    }

    $scope.toggleLeftSideMenu = function () {
      //console.warn('BerichtenSideMenuCtrl toggleLeftSideMenu');
      dataFactoryAnalytics.createEvent('pois', 'sessie', 'kaarten', '', '1');
      $ionicSideMenuDelegate.toggleLeft();
    };

    
    
    $rootScope.$on('poiFilterNotification', function () {
      //console.log('poiFilterNotification');
      //console.log('PoisSideMenuCtrl poisFilterNieuw');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Nieuw'
      });
    });

    $scope.poisFilterAlle = function () {
      //console.warn('PoisSideMenuCtrl poisFilterAlle');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Alle';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Alle'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterMijn = function () {
      //console.warn('PoisSideMenuCtrl poisFilterMijn');
      filter.filter = 'Mijn';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Mijn'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterPublic = function () {
      //console.warn('PoisSideMenuCtrl poisFilterPublic');
      filter.filter = 'Public';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Public'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterNieuw = function () {
      //console.warn('PoisSideMenuCtrl poisFilterNieuw');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Nieuw'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterFavorieten = function () {
      //console.warn('PoisSideMenuCtrl poisFilterFavorieten');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Favorieten';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Favorieten'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterOngelabeld = function () {
      //console.warn('PoisSideMenuCtrl poisFilterOngelabeld');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Geen label',
        tagId: '0'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterGeen = function () {
      //console.warn('PoisSideMenuCtrl poisFilterGeen');
      $scope.searchPoi.naam = '';
      zoek = '';

      filter.filter = 'Geen';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Geen'
      });
      $state.go('pois.pois');
    };

    $scope.poisFilterGeenLabel = function () {
      //console.warn('PoisSideMenuCtrl poisFilterGeen');
      $scope.searchPoi.naam = '';
      zoek = '';
      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('poisFilter', {
        filter: 'Geen label'
      });
      //console.error('+++ PoisSideMenuCtrl poisFilter: Geen');
      $state.go('pois.pois');
    };

    $scope.filterTag = function (tag) {

      //console.warn('PoisSideMenuCtrl filterTag: ', tag);
      filter.filter = tag.tag;
      //console.log('PoisSideMenuCtrl poisFilter: ', filter.filter);

      setNavTitle();

      $rootScope.$emit('poisFilter', {
        filter: 'Tag',
        tag: tag.tag
        //tagId: tag.pois[0].xData.tags[0].xData.get('Id')
      });
      //console.log('PoisSideMenuCtrl poisFilter: ', { filter: 'Tag', tag: tag.items[0].xData.tags[0].xData, tagId: tag.items[0].xData.tags[0].xData.get('Id') });

      $state.go('pois.pois');
    };

    $scope.poisVerwijderDoelgroep = function () {
      //console.warn('BerichtenSideMenuCtrl poisVerwijderDoelgroep');
    };

    //
    // Wijzig de in sidemnu gewijzigde tag in store en database
    // Overal wara deze tag gebruikt wordt moet deze tag gewijzigd worden.
    // Tags worden gebruikt in pois, locatiesen en pois.
    //
    //  Alleen de eigenaar van het poiTagModel mag editen
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
      //console.warn('PoisSideMenuCtrl editTag tagModel: ', tagModel);

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

        //console.log('PoisSideMenuCtrl editTag Label gewijzigd in: ' + res);
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
            $rootScope.$emit('poisFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });
            $state.go('pois.pois');
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

      //console.log('PoisSideMenuCtrl deleteTag tagModel: ', tagModel);
      //console.log('PoisSideMenuCtrl deleteTag xtag: ', xtag);

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
            loDash.each(truuk, function (poiModel) {
              //console.log('PoisSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, poiModel);
              if (poiModel && poiModel.xData) {
                //

                sorteerDataTags();
                //
                loDash.each(poiModel.xData.tags, function (poiTagModel) {
                  //console.log('PoisSideMenuCtrl deleteTag poiModal.tags loop: ', poiModel.xData.tags, poiTagModel);
                  (function (poiModel, poiTagModel) {
                    if (poiTagModel.xData.get('tag') === xtag.tag) {
                      //console.log('PoisSideMenuCtrl deleteTag poiTagModel in poiModel.tags wordt verwijderd uit backend: ', poiTagModel);
                      poiTagModel.remove().then(function () {
                        //console.log('PoisSideMenuCtrl deleteTag poiTagModel wordt verwijderd uit poiModel.tags: ', poiTagModel);
                        loDash.remove(poiModel.xData.tags, function (poiTagModel) {
                          return poiTagModel.xData.get('tag') === xtag.tag;
                        });
                      });
                      $rootScope.$emit('poiRemoveLabel', {
                        poiModel: poiModel,
                        tagModel: tagModel
                      });

                    }
                  })(poiModel, poiTagModel);
                });
              }
            });

            //console.log('PoisSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === xtag.tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === xtag.tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle poitags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('PoisSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.poisFilterAlle();
            $state.go('pois.pois');
          }
        }]
      });

    };

    $scope.verwijderSelectie = function () {
      //console.log('PoisSideMenuCtrl event poiVerwijderSelectie');
      $rootScope.$emit('poiVerwijderSelectie', filter);
    };
    //
    //	Init Dropbox
    //
    $scope.exporteerSelectie = function () {
      //console.log('PoisSideMenuCtrl event poiExporteerSelectie');
      $rootScope.$emit('poiExporteerSelectie', filter);
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
      //console.log('PoisSideMenuCtrl event setDropboxReady');
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
      //console.log('PoisSideMenuCtrl event resetDropboxReady');
      $scope.dropbox = false;
    });

    function checkDbToken() {
      dataFactoryConfigX.loadMe().then(function (configModel) {
        dataFactoryDropbox.accessToken = configModel.get('dbtoken');
        //console.log('PoisSideMenuCtrl configX loadMe dbtoken: ', configModel.get('gebruikerId'), configModel.get('Id'), configModel.get('dbtoken'));
        //console.log('PoisSideMenuCtrl $scope.dropbox: ', $scope.dropbox);

        if ($scope.dropbox && dataFactoryDropbox.accessToken === '') {
          $scope.dropbox = false;
          //console.error('PoiSideMenuCtrl ontkoppelen: ', dataFactoryDropbox.accessToken);
        }
        if (!$scope.dropbox && dataFactoryDropbox.accessToken !== '') {
          $scope.dropbox = true;
          //console.log('PoiSideMenuCtrl koppelen: ', dataFactoryDropbox.accessToken);
        }
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        $scope.dropbox = false;
        dataFactoryDropbox.accessToken = '';
        //console.error('PoisSideMenuCtrl configX.loadme ERROR: ', err);
      });
    }
    //
    // Door alle platforms wordt gekeken of het dbtoken is gewijzigd
    // Het resultaat is dropbox = false/true;
    //
    $interval(function () {
      //console.log('PoisSideMenuCtrl checking dropbox token');
      checkDbToken();
    }, 10000, 5);
    //
    // ***** I N I T status network *****
    // Bij start van PoisSideMenuCtrl eenmalig installeren network event listeners.
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

      //console.warn('PoiCardCtrl addNieuweLabel: ', tag);

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
            //console.log('PoiCardCtrl addNieuweLabel tag: ', tagModel);
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

      //console.warn('PoiSideMenuCtrl selectLabelClick tagModel: ', tagModel);
      //console.log('PoiSideMenuCtrl selectLabelClick tagId: ', tagModel.get('Id'));

      $ionicPopup.confirm({
        title: 'Locaties zonder label',
        template: 'Label <br><br><span class="trinl-rood"><b>' + tagModel.get('tag') + '</b></span><br><br>toevoegen aan alle Locaties zonder label',
        scope: $scope,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Labels toevoegen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.closeTags();
            $rootScope.$emit('labelGeenLabelPoi', {
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
        helpTypes = 'Locaties';
        helpType = 'Locatie';
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
        items = 'Locaties';
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

      //console.warn('PoiSideMenuCtrl geenLabelSelectie: ', $event, $scope.global.tags);

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
      //console.warn('PoiSideMenuCtrl openTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function ($event) {
      //console.warn('PoiSideMenuCtrl closeTags');
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
      //console.warn('PoiSideMenuCtrl openPopoverTags: ', $event);

      //console.warn('PoiSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.warn('PoiSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.log('PoiSideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $scope.openHelpPoiMenu = function ($event) {
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
      //console.log('PoiSideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('PoiSideMenuCtrl openHelpPopover');
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
      //console.log('PoiSideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      //console.log('PoiSideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
