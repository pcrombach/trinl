/* eslint-disable indent */
/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('BerichtenSideMenuCtrl', ['loDash', '$rootScope', '$scope', '$state', '$timeout', '$interval', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$ionicPopover', '$ionicModal', '$ionicLoading', '$ionicSideMenuDelegate', 'dataFactoryDropbox', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryBericht', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo', '$ionicListDelegate', '$ionicScrollDelegate', 'dataFactoryAnalytics',
  function (loDash, $rootScope, $scope, $state, $timeout, $interval, $cordovaNetwork, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, dataFactoryDropbox, dataFactoryHelp, dataFactoryTag, dataFactoryBericht, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo, $ionicListDelegate, $ionicScrollDelegate, dataFactoryAnalytics) {

    //console.warn('BerichtenSideMenuCtrl start');

    dataFactoryDropbox.setType('/Berichts');

    //console.warn('BerichtenSideMenuCtrl dropbox migratie done!');

    var mode = 'bericht';

    $scope.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.profiel = dataFactoryCeo.currentModel.get('pofiel');

    $scope.details = [];

    $scope.data = {};
    $scope.data.tags = dataFactoryBericht.sideMenuTags;

    $scope.global = {};
    $scope.global.filtertags = [];

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });

    $scope.data.filteredBerichten = dataFactoryBericht.store;

    $rootScope.$on('berichtSideMenuUpdate', function () {
      //console.error('berichtSideMenuUpdate');
      $scope.data.tags = dataFactoryBericht.sideMenuTags;
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

    $scope.aantalAlle = dataFactoryBericht.store.length;
    $scope.aantalNieuw = dataFactoryBericht.nieuw.length;
    $scope.aantalStar = dataFactoryBericht.star.length;
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

    var lastArgs = dataFactoryConfig.currentModel.get('berichtFilter');
    //console.log('berichtSideMenuCtrl berichtFilter from config: ', lastArgs);

    if (!lastArgs.filter) {
      lastArgs = {
        filter: 'Geen'
      };
    }
    if (typeof lastArgs === 'string') {
      lastArgs = JSON.parse(lastArgs);
    }
    var filter = lastArgs;
    //console.log('berichtSideMenuCtrl berichtFilter from config: ', filter);

    berichtenAantallen();

    $scope.search = {
      label: ''
    };

    $scope.searchBericht = {
      naam: ''
    };

    var sorteer;
    var zoek = '';

    var sorter = dataFactoryConfig.currentModel.get('berichtSorter');
    //console.log('berichtSideMenuCtrl berichtSorter from config: ', sorter);

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
      $scope.berichtenSortCreatedOnUp = sorter.reverse;
      //console.log('BerichtSideMenuCtrl init sorter from config CreatedOn: ', sorter);
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
      $scope.berichtenSortGelezenUp = sorter.reverse;
      //console.log('BerichtSideMenuCtrl init sorter from config Gelezen: ', sorter);
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
      $scope.berichtenSortNaamUp = sorter.reverse;
      //console.log('BerichtSideMenuCtrl init sorter from config Naam: ', sorter);
    }

    $timeout(function () {
      $rootScope.$emit('berichtPredicate', sorter);
      setNavTitle();
    }, 100);

    var loadingTime;

    dataFactoryBericht.selected = [];

    $scope.openKaart2 = function () {

      //console.warn('BerichtSideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('sessie', 'kaarten', 'start', '1');
    };

    $scope.berichtenSortNaamClick = function () {
      //console.warn('BerichtSideMenuCtrl berichtenSortNaamClick $scope.berichtenSortNaamUp: ', $scope.berichtenSortNaamUp);

      $scope.berichtenSortNaamUp = !$scope.berichtenSortNaamUp;
      if ($scope.berichtenSortNaamUp) {
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
      $rootScope.$emit('berichtPredicate', sorter);

    };

    $scope.berichtenSortDatumClick = function () {

      //console.warn('BerichtSideMenuCtrl berichtenSortDatumClick $scope.berichtenSortCreatedOnUp: ', $scope.berichtenSortCreatedOnUp);

      $scope.berichtenSortCreatedOnUp = !$scope.berichtenSortCreatedOnUp;
      if ($scope.berichtenSortCreatedOnUp) {
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
      $rootScope.$emit('berichtPredicate', sorter);

    };

    $scope.berichtenSortGelezenClick = function () {

      //console.warn('BerichtSideMenuCtrl berichtenSortGelezenClick $scope.berichtenSortGelezenUp: ', $scope.berichtenSortGelezenUp);

      $scope.berichtenSortGelezenUp = !$scope.berichtenSortGelezenUp;
      if ($scope.berichtenSortGelezenUp) {
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
      $rootScope.$emit('berichtPredicate', sorter);
    };

    function tagsRemove(berichtModel, tagModel) {

      //console.warn('BerichtenSideMenuCtrl tagsRemove berichtModel, tagModel: ', berichtModel, tagModel);
      //console.log('BerichtenSideMenuCtrl tagsRemove naam tag', berichtModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find($scope.data.tags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('BerichtenSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = berichtModel.get('naam');
        //
        //  Verwijder het berichtModel uit de itemss tabel
        //
        //console.log('BerichtenSideMenuCtrl tagsRemove removing bericht Id from xtag.items: ', berichtModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (bericht) {
          //return bericht.Id === berichtModel.get('Id') && bericht.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return bericht.get('Id') === berichtModel.get('Id');
        });

        loDash.remove($scope.data.tags.berichten, function (bericht) {
          return bericht.get('Id') === berichtModel.get('Id');
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

          tmp = loDash.filter(xtag.items, function (berichtModel) {
            return berichtModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (berichtModel) {
            return berichtModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('BerichtenSideMenuCtrl tagsAdd removed to update: ', xtag);
          $scope.data.tags.push(xtag);
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          sorteerDataTags();
        }

        //console.log('BerichtenSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), $scope.data.tags);
      } else {
        //console.error('BerichtenSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
      }
    }
    //
    //  Het berichtModel bevat alle gegevens doe bij een bericht horen.
    //  In berichtModel.xData.tag zitten alle berichtTagModellen
    //  In iedere potagModel.xData is een bijbehorend tagModel
    //  hier noemen wij dat model tag.
    //  De parameter tagModel geeft aan om welke tagModel in
    //  berichtModel.xData.tags.xData het gaat
    //    
    function tagsAdd(berichtModel, tagModel) {
      //console.log('BerichtenSideMenuCtrl tagsAdd berichtModel, tagModel: ', berichtModel, tagModel);
      //console.log('BerichtenSideMenuCtrl tagsAdd naam tag', berichtModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten $scope.data.tags hebben de volgende props:
      //  -    berichten: een tabel met alle berichtModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde berichtModellen.
      //  -    aantal: het unieke aantal berichtModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in berichtTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste berichtModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(berichtModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (berichtModel) {
          return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        //$scope.data.tags.push(xtag);
        //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

        $scope.data.tags.push(xtag);

        sorteerDataTags();
        //console.log('BerichtenSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', berichtModel.get('naam'), berichtModel.get('Id'), $scope.data.tags);
        //console.log('BerichtenSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => $scope.data.tags object naam, Id: ', berichtModel.get('naam'), berichtModel.get('Id'), $scope.data.tags);

      } else {
        //
        //  Voeg het berichtModel toe aan bestaand tag $scope.data.tag object
        //
        xtag.items.push(berichtModel);
        //
        //  Update het berichtTagModel
        //
        tmp = loDash.filter(xtag.items, function (berichtModel) {
          return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (berichtModel) {
          return berichtModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('BerichtenSideMenuCtrl tagsAdd removed to update: ', xtag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('BerichtenSideMenuCtrl tagsAdd menu-onbject berichtModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', berichtModel.get('naam'), berichtModel.get('Id'), $scope.data.tags);
      }
    }

    function tagsUpdate(tagModel) {
      //console.log('BerichtenSideMenuCtrl tagsUpdate naam tag', tagModel.get('tag'));
      //console.log('BerichtenSideMenuCtrl tagsUpdate $scope.data.tags: ', $scope.data.tags);
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
        //console.log('BerichtenSideMenuCtrl tagsAdd removed old tagModel: ', tagModel.get('tag'), xtag.tag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('BerichtenSideMenuCtrl tagsUpdate menu-onbject berichtModel in #scope.data.tags  UPDATE: ', $scope.data.tags);
      } else {
        //console.error('BerichtenSideMenuCtrl tagsUpdate xtag NIET GEVONDEN: ', $scope.data.tags, tagModel.get('Id'));
      }
    }
    //
    // Loop daar alle tags om tags te updaten voor UI
    //
    function finalizeTags() {

      berichtenAantallenGeenLabel();
    }

    function delayFinalizeTags() {
      //console.warn('delayFinalizeTags berichtModel');
      finalizeTags();
      $timeout.cancel(loadingTime);

    }
    var debouncedFinalizeTags = loDash.debounce(delayFinalizeTags, 100);

    var event1 = $rootScope.$on('sideMenuBerichtenFilter', function (event, args) {

      //console.warn('sideMenuBerichtenFilter args: ', args);

      var filter = args.filter;
      var tag = {
        tagModel: args.tag
      };

      switch (filter) {
        case 'Tag':
          $scope.filterTag(tag);
          break;
        default:
          $scope.berichtenFilterAlle();
      }
    });
    $scope.$on('$destroy', event1);

    $rootScope.$on('berichtAddLabel', function (event, args) {
      //console.log('BerichtenSideMenuCtrl event berichtAddLabel args: ', args);
      var berichtModel = args.berichtModel;
      var tagModel = args.tagModel;
      //console.warn('BerichtenSideMenuCtrl berichtAddLabel: ', berichtModel.get('naam'), tagModel.get('tag'));
      tagsAdd(berichtModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('berichtRemoveLabel', function (event, args) {
      //console.warn('BerichtenSideMenuCtrl event berichtAddLabel args: ', args);
      var berichtModel = args.berichtModel;
      var tagModel = args.tagModel;
      //console.warn('BerichtenSideMenuCtrl berichtRemoveLabel: ', berichtModel, tagModel);
      //console.warn('BerichtenSideMenuCtrl berichtRemoveLabel: ', berichtModel.get('naam'), tagModel.get('tag'));
      tagsRemove(berichtModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('berichtUpdateLabel', function (event, args) {
      //console.warn('BerichtenSideMenuCtrl event berichtUpdateLabel args: ', args);
      var tagModel = args.tagModel;
      //console.warn('++++++++++++++++++++++++++++++ BerichtenSideMenuCtrl berichtUpdateLabel: ', tagModel.get('tag'));
      tagsUpdate(tagModel);
      debouncedFinalizeTags();
    });

    var event4 = $rootScope.$on('berichtNavTitle', function (event, args) {

      //console.warn('+++ BerichtenSideMenuCtrl navTitle filter sorter, $scope.berichtenSortNaamUp: ', args.filter, args.sorter, $scope.berichtenSortNaamUp);
      filter.filter = args.filter.filter;
      if (args.filter.tag !== undefined) {
        filter.filter = args.filter.tag;
      }
      if (args.filter.search !== undefined) {
        zoek = args.filter.search;
      }
      $scope.searchBericht.naam = zoek;
      $rootScope.$emit('berichtenFilter', args.filter);

      if (!args.sorter) {
        args.sorter = {};
      }

      if (args.sorter.reverse) {
        $scope.berichtenSortNaamUp === false;
      }
    });
    $scope.$on('$destroy', event4);

    function berichtenAantallenGeenLabel() {

      //console.warn('BerichtenSideMenuCtrl berichtenAantallenGeenLabel');

      $scope.aantalGeenLabels = 0;

      loDash.each(dataFactoryBericht.store, function (berichtModel) {
        if (berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
          if (berichtModel.xData !== undefined) {
            if (berichtModel.xData.tags !== undefined) {
              if (berichtModel.xData.tags.length === 0) {
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

    function berichtenAantallen() {

      loDash.remove(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.xprive === true && (berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });
      loDash.remove(dataFactoryBericht.data, function (dataItem) {
        return dataItem.record.xprive === true && (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });

      $scope.aantalAlle = dataFactoryBericht.store.length;
      $scope.aantalMijn = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      }).length;

      $scope.aantalPublic = loDash.filter(dataFactoryBericht.store, function (berichtModel) {
        return berichtModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
      }).length;
      $scope.aantalNieuw = dataFactoryBericht.nieuw.length;
      $scope.aantalStar = dataFactoryBericht.star.length;

      berichtenAantallenGeenLabel();

      //console.log('BerichtenSideMenuCtrl aantalAlle: ' + $scope.aantalAlle + ', aantalMijn: ' + $scope.aantalMijn + ', aantalPublic: ' + $scope.aantalPublic + ', aantalNieuw: ' + $scope.aantalNieuw + ', aantalStar: ' + $scope.aantalStar  + ', aantalGeenLabels: ', $scope.aantalGeenLabels);
    }

    var event5 = $rootScope.$on('berichtenNieuweAantallen', function () {

      //console.warn('BerichtenSideMenuCtrl on.berichtenNieuwAantallen');

      berichtenAantallen();
      //console.log('+++ BerichtenSideMenuCtrl aantalAlle, aantalMijn, aantalPublic, aantalNieuw, aantalStar, aantalGeenLabels: ', $scope.aantalAlle, $scope.aantalMijn, $scope.aantalPublic, $scope.aantalNieuw, $scope.aantalStar, $scope.aantalGeenLabels);
    });
    $scope.$on('$destroy', event5);

    var event7 = $scope.$on('elemHasFocus', function (event, args) {
      if (args.message !== 'Zoek label') {
        //console.warn('+++ BerichtenSideMenuCtrl elem has focus: ', args);
        filter.filter = 'Search';
        setNavTitle();

        $rootScope.$emit('berichtStartSearch');
        if (args.message === 'Zoek in Berichts') {
          $ionicScrollDelegate.scrollTop(true);
        }
      }
    });
    $scope.$on('$destroy', event7);

    var event8 = $rootScope.$on('setPredicate', function (event, args) {

      //console.log('BerichtenSideMenuCtrl event setPredicate: ', args);

      sorter = JSON.parse(args);

      if (sorter.predicate === 'gelezen.value') {

        if (sorter.reverse === true) {
          $scope.berichtenSortGelezenUp = true;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.berichtenSortGelezenUp = false;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'naam.value') {
        if (sorter.reverse === true) {
          $scope.berichtenSortNaamUp = true;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.berichtenSortNaamUp = false;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'createdOn.value') {
        if (sorter.reverse === true) {
          $scope.berichtenSortCreatedOnUp = true;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.berichtenSortCreatedOnUp = false;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }

      setNavTitle();
    });
    $scope.$on('$destroy', event8);

    var event11 = $rootScope.$on('berichtDelete', function () {

      loDash.each(dataFactoryBericht.store, function (berichtModel) {
        if (!berichtModel.xData) {
          berichtModel.xData = {
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
        //console.error('+++ BerichtenSideMenuCtrl watch search.label label: ', $scope.search.label);
        //console.error('+++ BerichtenSideMenuCtrl watch search.label val: ', val);
      }
    });
    //
    $scope.$watch('searchBericht.naam', function (val) {

      if ($scope.searchBericht.naam !== '') {

        //console.warn('+++ BerichtenSideMenuCtrl watch searchBericht.naam naam: ', $scope.searchBericht.naam);
        //console.warn('+++ BerichtenSideMenuCtrl watch searchBericht.naam val: ', val);

        zoek = val;
        setNavTitle();
        $rootScope.$emit('berichtenFilter', {
          filter: 'Search',
          search: $scope.searchBericht.naam
        });
        $state.go('berichten.berichten');
      } else {
        if (initSearch) {
          $scope.berichtenFilterAlle();
        } else {
          initSearch = true;
        }
      }
    });

    $scope.clearSearch = function () {
      //console.log('BerichtenSideMenuCtrl clearSearch');
      $scope.search.label = '';
      zoek = '';
    };

    $scope.clearSearchBericht = function () {
      //console.log('BerichtenSideMenuCtrl clearSearchBericht');
      $scope.searchBericht.naam = '';
      zoek = '';
      setNavTitle();
      $rootScope.$emit('berichtenFilter');
      $state.go('berichten.berichten');
    };

    var setNavTitleEvent = $rootScope.$on('setNavTitleEvent', function (event, tagFilter) {
      //console.log('BerichtenSideMenuCtrl setNavTitleEvent filter: ', tagFilter);
      filter = tagFilter;
      setNavTitle();
    });
    $scope.$on('$destroy', setNavTitleEvent);

    var berichtSetNavTitleGlobalEvent = $rootScope.$on('berichtSetNavTitleGlobal', function (event, args) {
      //console.log('BerichtenSideMenuCtrl setNavTitleGlobal filter, sorter: ', args);
      filter = {
        filter: args.filter
      };

      sorteer = args.sorteer;
      zoek = args.zoek;
      setNavTitle();
    });
    $scope.$on('$destroy', berichtSetNavTitleGlobalEvent);

    function setNavTitle() {

      //console.log('BerichtenSideMenuCtrl setNavTitle sorteer: ', sorteer);
      //console.log('BerichtenSideMenuCtrl setNavTitle filter.filter: ', filter.filter);
      //console.log('BerichtenSideMenuCtrl setNavTitle zoek: ', zoek);

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

      //console.log('BerichtenSideMenuCtrl setNavTitle set : ', $scope.subHeader);

    }

    $scope.toggleLeftSideMenu = function () {
      //console.warn('BerichtenSideMenuCtrl toggleLeftSideMenu');
      dataFactoryAnalytics.createEvent('berichten', 'sessie', 'kaarten', '', '1');
      $ionicSideMenuDelegate.toggleLeft();
    };

    
    
    $rootScope.$on('berichtFilterNotification', function () {
      //console.log('berichtFilterNotification');
      //console.log('BerichtenSideMenuCtrl berichtenFilterNieuw');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Nieuw'
      });
    });

    $scope.berichtenFilterAlle = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterAlle');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Alle';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Alle'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterMijn = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterMijn');
      filter.filter = 'Mijn';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Mijn'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterPublic = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterPublic');
      filter.filter = 'Public';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Public'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterNieuw = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterNieuw');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Nieuw'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterFavorieten = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterFavorieten');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Favorieten';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Favorieten'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterOngelabeld = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterOngelabeld');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Geen label',
        tagId: '0'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterGeen = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterGeen');
      $scope.searchBericht.naam = '';
      zoek = '';

      filter.filter = 'Geen';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Geen'
      });
      $state.go('berichten.berichten');
    };

    $scope.berichtenFilterGeenLabel = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenFilterGeen');
      $scope.searchBericht.naam = '';
      zoek = '';
      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('berichtenFilter', {
        filter: 'Geen label'
      });
      //console.error('+++ BerichtenSideMenuCtrl berichtenFilter: Geen');
      $state.go('berichten.berichten');
    };

    $scope.filterTag = function (tag) {

      //console.warn('BerichtenSideMenuCtrl filterTag: ', tag);
      filter.filter = tag.tag;
      //console.log('BerichtenSideMenuCtrl berichtenFilter: ', filter.filter);

      setNavTitle();

      $rootScope.$emit('berichtenFilter', {
        filter: 'Tag',
        tag: tag.tag
        //tagId: tag.berichten[0].xData.tags[0].xData.get('Id')
      });
      //console.log('BerichtenSideMenuCtrl berichtenFilter: ', { filter: 'Tag', tag: tag.items[0].xData.tags[0].xData, tagId: tag.items[0].xData.tags[0].xData.get('Id') });

      $state.go('berichten.berichten');
    };

    $scope.berichtenVerwijderDoelgroep = function () {
      //console.warn('BerichtenSideMenuCtrl berichtenVerwijderDoelgroep');
    };

    //
    // Wijzig de in sidemnu gewijzigde tag in store en database
    // Overal wara deze tag gebruikt wordt moet deze tag gewijzigd worden.
    // Tags worden gebruikt in berichten, locatiesen en berichten.
    //
    //  Alleen de eigenaar van het berichtTagModel mag editen
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
      //console.warn('BerichtenSideMenuCtrl editTag tagModel: ', tagModel);

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

        //console.log('BerichtenSideMenuCtrl editTag Label gewijzigd in: ' + res);
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
            $rootScope.$emit('berichtenFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });
            $state.go('berichten.berichten');
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

      //console.log('BerichtenSideMenuCtrl deleteTag tagModel: ', tagModel);
      //console.log('BerichtenSideMenuCtrl deleteTag xtag: ', xtag);

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
            loDash.each(truuk, function (berichtModel) {
              //console.log('BerichtenSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, berichtModel);
              if (berichtModel && berichtModel.xData) {
                //

                sorteerDataTags();
                //
                loDash.each(berichtModel.xData.tags, function (berichtTagModel) {
                  //console.log('BerichtenSideMenuCtrl deleteTag berichtModal.tags loop: ', berichtModel.xData.tags, berichtTagModel);
                  (function (berichtModel, berichtTagModel) {
                    if (berichtTagModel.xData.get('tag') === xtag.tag) {
                      //console.log('BerichtenSideMenuCtrl deleteTag berichtTagModel in berichtModel.tags wordt verwijderd uit backend: ', berichtTagModel);
                      berichtTagModel.remove().then(function () {
                        //console.log('BerichtenSideMenuCtrl deleteTag berichtTagModel wordt verwijderd uit berichtModel.tags: ', berichtTagModel);
                        loDash.remove(berichtModel.xData.tags, function (berichtTagModel) {
                          return berichtTagModel.xData.get('tag') === xtag.tag;
                        });
                      });
                      $rootScope.$emit('berichtRemoveLabel', {
                        berichtModel: berichtModel,
                        tagModel: tagModel
                      });

                    }
                  })(berichtModel, berichtTagModel);
                });
              }
            });

            //console.log('BerichtenSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === xtag.tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === xtag.tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle berichttags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('BerichtenSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.berichtenFilterAlle();
            $state.go('berichten.berichten');
          }
        }]
      });

    };

    $scope.verwijderSelectie = function () {
      //console.log('BerichtenSideMenuCtrl event berichtVerwijderSelectie');
      $rootScope.$emit('berichtVerwijderSelectie', filter);
    };
    //
    //	Init Dropbox
    //
    $scope.exporteerSelectie = function () {
      //console.log('BerichtenSideMenuCtrl event berichtExporteerSelectie');
      $rootScope.$emit('berichtExporteerSelectie', filter);
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
      //console.log('BerichtenSideMenuCtrl event setDropboxReady');
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
      //console.log('BerichtenSideMenuCtrl event resetDropboxReady');
      $scope.dropbox = false;
    });

    function checkDbToken() {
      dataFactoryConfigX.loadMe().then(function (configModel) {
        dataFactoryDropbox.accessToken = configModel.get('dbtoken');
        //console.log('BerichtenSideMenuCtrl configX loadMe dbtoken: ', configModel.get('gebruikerId'), configModel.get('Id'), configModel.get('dbtoken'));
        //console.log('BerichtenSideMenuCtrl $scope.dropbox: ', $scope.dropbox);

        if ($scope.dropbox && dataFactoryDropbox.accessToken === '') {
          $scope.dropbox = false;
          //console.error('BerichtSideMenuCtrl ontkoppelen: ', dataFactoryDropbox.accessToken);
        }
        if (!$scope.dropbox && dataFactoryDropbox.accessToken !== '') {
          $scope.dropbox = true;
          //console.log('BerichtSideMenuCtrl koppelen: ', dataFactoryDropbox.accessToken);
        }
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        $scope.dropbox = false;
        dataFactoryDropbox.accessToken = '';
        //console.error('BerichtenSideMenuCtrl configX.loadme ERROR: ', err);
      });
    }
    //
    // Door alle platforms wordt gekeken of het dbtoken is gewijzigd
    // Het resultaat is dropbox = false/true;
    //
    $interval(function () {
      //console.log('BerichtenSideMenuCtrl checking dropbox token');
      checkDbToken();
    }, 10000, 5);
    //
    // ***** I N I T status network *****
    // Bij start van BerichtenSideMenuCtrl eenmalig installeren network event listeners.
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

      //console.warn('BerichtCardCtrl addNieuweLabel: ', tag);

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
            //console.log('BerichtCardCtrl addNieuweLabel tag: ', tagModel);
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

      //console.warn('BerichtSideMenuCtrl selectLabelClick tagModel: ', tagModel);
      //console.log('BerichtSideMenuCtrl selectLabelClick tagId: ', tagModel.get('Id'));

      $ionicPopup.confirm({
        title: 'Berichts zonder label',
        template: 'Label <br><br><span class="trinl-rood"><b>' + tagModel.get('tag') + '</b></span><br><br>toevoegen aan alle Berichts zonder label',
        scope: $scope,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Labels toevoegen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.closeTags();
            $rootScope.$emit('labelGeenLabelBericht', {
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
        helpTypes = 'Berichts';
        helpType = 'Bericht';
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
        items = 'Berichts';
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

      //console.warn('BerichtSideMenuCtrl geenLabelSelectie: ', $event, $scope.global.tags);

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
      //console.warn('BerichtSideMenuCtrl openTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function ($event) {
      //console.warn('BerichtSideMenuCtrl closeTags');
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
      //console.warn('BerichtSideMenuCtrl openPopoverTags: ', $event);

      //console.warn('BerichtSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.warn('BerichtSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.log('BerichtSideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $scope.openHelpBerichtMenu = function ($event) {
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
      //console.log('BerichtSideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('BerichtSideMenuCtrl openHelpPopover');
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
      //console.log('BerichtSideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      //console.log('BerichtSideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
