/* eslint-disable indent */
/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('__DataItem__sSideMenuCtrl', ['loDash', '$rootScope', '$scope', '$state', '$timeout', '$interval', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$ionicPopover', '$ionicModal', '$ionicLoading', '$ionicSideMenuDelegate', 'dataFactoryDropbox', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactory__DataItem__', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo', '$ionicListDelegate', '$ionicScrollDelegate', 'dataFactoryAnalytics',
  function (loDash, $rootScope, $scope, $state, $timeout, $interval, $cordovaNetwork, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, dataFactoryDropbox, dataFactoryHelp, dataFactoryTag, dataFactory__DataItem__, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo, $ionicListDelegate, $ionicScrollDelegate, dataFactoryAnalytics) {

    //console.warn('__DataItem__sSideMenuCtrl start');

    dataFactoryDropbox.setType('/Locaties');

    //console.warn('__DataItem__sSideMenuCtrl dropbox migratie done!');

    var mode = '__dataItem__';

    $scope.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.profiel = dataFactoryCeo.currentModel.get('pofiel');

    $scope.details = [];

    $scope.data = {};
    $scope.data.tags = dataFactory__DataItem__.sideMenuTags;

    $scope.global = {};
    $scope.global.filtertags = [];

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });

    $scope.data.filtered__DataItem__s = dataFactory__DataItem__.store;

    $rootScope.$on('__dataItem__SideMenuUpdate', function () {
      //console.error('__dataItem__SideMenuUpdate');
      $scope.data.tags = dataFactory__DataItem__.sideMenuTags;
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

    $scope.aantalAlle = dataFactory__DataItem__.store.length;
    $scope.aantalNieuw = dataFactory__DataItem__.nieuw.length;
    $scope.aantalStar = dataFactory__DataItem__.star.length;
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

    var lastArgs = dataFactoryConfig.currentModel.get('__dataItem__Filter');
    //console.log('__dataItem__SideMenuCtrl __dataItem__Filter from config: ', lastArgs);

    if (!lastArgs.filter) {
      lastArgs = {
        filter: 'Geen'
      };
    }
    if (typeof lastArgs === 'string') {
      lastArgs = JSON.parse(lastArgs);
    }
    var filter = lastArgs;
    //console.log('__dataItem__SideMenuCtrl __dataItem__Filter from config: ', filter);

    __dataItem__sAantallen();

    $scope.search = {
      label: ''
    };

    $scope.search__DataItem__ = {
      naam: ''
    };

    var sorteer;
    var zoek = '';

    var sorter = dataFactoryConfig.currentModel.get('__dataItem__Sorter');
    //console.log('__dataItem__SideMenuCtrl __dataItem__Sorter from config: ', sorter);

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
      $scope.__dataItem__sSortCreatedOnUp = sorter.reverse;
      //console.log('__DataItem__SideMenuCtrl init sorter from config CreatedOn: ', sorter);
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
      $scope.__dataItem__sSortGelezenUp = sorter.reverse;
      //console.log('__DataItem__SideMenuCtrl init sorter from config Gelezen: ', sorter);
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
      $scope.__dataItem__sSortNaamUp = sorter.reverse;
      //console.log('__DataItem__SideMenuCtrl init sorter from config Naam: ', sorter);
    }

    $timeout(function () {
      $rootScope.$emit('__dataItem__Predicate', sorter);
      setNavTitle();
    }, 100);

    var loadingTime;

    dataFactory__DataItem__.selected = [];

    $scope.openKaart2 = function () {

      //console.warn('__DataItem__SideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('sessie', 'kaarten', 'start', '1');
    };

    $scope.__dataItem__sSortNaamClick = function () {
      //console.warn('__DataItem__SideMenuCtrl __dataItem__sSortNaamClick $scope.__dataItem__sSortNaamUp: ', $scope.__dataItem__sSortNaamUp);

      $scope.__dataItem__sSortNaamUp = !$scope.__dataItem__sSortNaamUp;
      if ($scope.__dataItem__sSortNaamUp) {
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
      $rootScope.$emit('__dataItem__Predicate', sorter);

    };

    $scope.__dataItem__sSortDatumClick = function () {

      //console.warn('__DataItem__SideMenuCtrl __dataItem__sSortDatumClick $scope.__dataItem__sSortCreatedOnUp: ', $scope.__dataItem__sSortCreatedOnUp);

      $scope.__dataItem__sSortCreatedOnUp = !$scope.__dataItem__sSortCreatedOnUp;
      if ($scope.__dataItem__sSortCreatedOnUp) {
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
      $rootScope.$emit('__dataItem__Predicate', sorter);

    };

    $scope.__dataItem__sSortGelezenClick = function () {

      //console.warn('__DataItem__SideMenuCtrl __dataItem__sSortGelezenClick $scope.__dataItem__sSortGelezenUp: ', $scope.__dataItem__sSortGelezenUp);

      $scope.__dataItem__sSortGelezenUp = !$scope.__dataItem__sSortGelezenUp;
      if ($scope.__dataItem__sSortGelezenUp) {
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
      $rootScope.$emit('__dataItem__Predicate', sorter);
    };

    function tagsRemove(__dataItem__Model, tagModel) {

      //console.warn('__DataItem__sSideMenuCtrl tagsRemove __dataItem__Model, tagModel: ', __dataItem__Model, tagModel);
      //console.log('__DataItem__sSideMenuCtrl tagsRemove naam tag', __dataItem__Model.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find($scope.data.tags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('__DataItem__sSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = __dataItem__Model.get('naam');
        //
        //  Verwijder het __dataItem__Model uit de itemss tabel
        //
        //console.log('__DataItem__sSideMenuCtrl tagsRemove removing __dataItem__ Id from xtag.items: ', __dataItem__Model.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (__dataItem__) {
          //return __dataItem__.Id === __dataItem__Model.get('Id') && __dataItem__.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return __dataItem__.get('Id') === __dataItem__Model.get('Id');
        });

        loDash.remove($scope.data.tags.__dataItem__s, function (__dataItem__) {
          return __dataItem__.get('Id') === __dataItem__Model.get('Id');
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

          tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
            return __dataItem__Model.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (__dataItem__Model) {
            return __dataItem__Model.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('__DataItem__sSideMenuCtrl tagsAdd removed to update: ', xtag);
          $scope.data.tags.push(xtag);
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          sorteerDataTags();
        }

        //console.log('__DataItem__sSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), $scope.data.tags);
      } else {
        //console.error('__DataItem__sSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
      }
    }
    //
    //  Het __dataItem__Model bevat alle gegevens doe bij een __dataItem__ horen.
    //  In __dataItem__Model.xData.tag zitten alle __dataItem__TagModellen
    //  In iedere potagModel.xData is een bijbehorend tagModel
    //  hier noemen wij dat model tag.
    //  De parameter tagModel geeft aan om welke tagModel in
    //  __dataItem__Model.xData.tags.xData het gaat
    //    
    function tagsAdd(__dataItem__Model, tagModel) {
      //console.log('__DataItem__sSideMenuCtrl tagsAdd __dataItem__Model, tagModel: ', __dataItem__Model, tagModel);
      //console.log('__DataItem__sSideMenuCtrl tagsAdd naam tag', __dataItem__Model.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten $scope.data.tags hebben de volgende props:
      //  -    __dataItem__s: een tabel met alle __dataItem__Modellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde __dataItem__Modellen.
      //  -    aantal: het unieke aantal __dataItem__Modellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in __dataItem__TagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste __dataItem__Model.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(__dataItem__Model);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        //$scope.data.tags.push(xtag);
        //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

        $scope.data.tags.push(xtag);

        sorteerDataTags();
        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), $scope.data.tags);
        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => $scope.data.tags object naam, Id: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), $scope.data.tags);

      } else {
        //
        //  Voeg het __dataItem__Model toe aan bestaand tag $scope.data.tag object
        //
        xtag.items.push(__dataItem__Model);
        //
        //  Update het __dataItem__TagModel
        //
        tmp = loDash.filter(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (__dataItem__Model) {
          return __dataItem__Model.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('__DataItem__sSideMenuCtrl tagsAdd removed to update: ', xtag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('__DataItem__sSideMenuCtrl tagsAdd menu-onbject __dataItem__Model REEDS AANWEZIG in tabel items naam, Id UPDATE: ', __dataItem__Model.get('naam'), __dataItem__Model.get('Id'), $scope.data.tags);
      }
    }

    function tagsUpdate(tagModel) {
      //console.log('__DataItem__sSideMenuCtrl tagsUpdate naam tag', tagModel.get('tag'));
      //console.log('__DataItem__sSideMenuCtrl tagsUpdate $scope.data.tags: ', $scope.data.tags);
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
        //console.log('__DataItem__sSideMenuCtrl tagsAdd removed old tagModel: ', tagModel.get('tag'), xtag.tag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('__DataItem__sSideMenuCtrl tagsUpdate menu-onbject __dataItem__Model in #scope.data.tags  UPDATE: ', $scope.data.tags);
      } else {
        //console.error('__DataItem__sSideMenuCtrl tagsUpdate xtag NIET GEVONDEN: ', $scope.data.tags, tagModel.get('Id'));
      }
    }
    //
    // Loop daar alle tags om tags te updaten voor UI
    //
    function finalizeTags() {

      __dataItem__sAantallenGeenLabel();
    }

    function delayFinalizeTags() {
      //console.warn('delayFinalizeTags __dataItem__Model');
      finalizeTags();
      $timeout.cancel(loadingTime);

    }
    var debouncedFinalizeTags = loDash.debounce(delayFinalizeTags, 100);

    var event1 = $rootScope.$on('sideMenu__DataItem__sFilter', function (event, args) {

      //console.warn('sideMenu__DataItem__sFilter args: ', args);

      var filter = args.filter;
      var tag = {
        tagModel: args.tag
      };

      switch (filter) {
        case 'Tag':
          $scope.filterTag(tag);
          break;
        default:
          $scope.__dataItem__sFilterAlle();
      }
    });
    $scope.$on('$destroy', event1);

    $rootScope.$on('__dataItem__AddLabel', function (event, args) {
      //console.log('__DataItem__sSideMenuCtrl event __dataItem__AddLabel args: ', args);
      var __dataItem__Model = args.__dataItem__Model;
      var tagModel = args.tagModel;
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__AddLabel: ', __dataItem__Model.get('naam'), tagModel.get('tag'));
      tagsAdd(__dataItem__Model, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('__dataItem__RemoveLabel', function (event, args) {
      //console.warn('__DataItem__sSideMenuCtrl event __dataItem__AddLabel args: ', args);
      var __dataItem__Model = args.__dataItem__Model;
      var tagModel = args.tagModel;
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__RemoveLabel: ', __dataItem__Model, tagModel);
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__RemoveLabel: ', __dataItem__Model.get('naam'), tagModel.get('tag'));
      tagsRemove(__dataItem__Model, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('__dataItem__UpdateLabel', function (event, args) {
      //console.warn('__DataItem__sSideMenuCtrl event __dataItem__UpdateLabel args: ', args);
      var tagModel = args.tagModel;
      //console.warn('++++++++++++++++++++++++++++++ __DataItem__sSideMenuCtrl __dataItem__UpdateLabel: ', tagModel.get('tag'));
      tagsUpdate(tagModel);
      debouncedFinalizeTags();
    });

    var event4 = $rootScope.$on('__dataItem__NavTitle', function (event, args) {

      //console.warn('+++ __DataItem__sSideMenuCtrl navTitle filter sorter, $scope.__dataItem__sSortNaamUp: ', args.filter, args.sorter, $scope.__dataItem__sSortNaamUp);
      filter.filter = args.filter.filter;
      if (args.filter.tag !== undefined) {
        filter.filter = args.filter.tag;
      }
      if (args.filter.search !== undefined) {
        zoek = args.filter.search;
      }
      $scope.search__DataItem__.naam = zoek;
      $rootScope.$emit('__dataItem__sFilter', args.filter);

      if (!args.sorter) {
        args.sorter = {};
      }

      if (args.sorter.reverse) {
        $scope.__dataItem__sSortNaamUp === false;
      }
    });
    $scope.$on('$destroy', event4);

    function __dataItem__sAantallenGeenLabel() {

      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sAantallenGeenLabel');

      $scope.aantalGeenLabels = 0;

      loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
        if (__dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
          if (__dataItem__Model.xData !== undefined) {
            if (__dataItem__Model.xData.tags !== undefined) {
              if (__dataItem__Model.xData.tags.length === 0) {
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

    function __dataItem__sAantallen() {

      loDash.remove(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.xprive === true && (__dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });
      loDash.remove(dataFactory__DataItem__.data, function (dataItem) {
        return dataItem.record.xprive === true && (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });

      $scope.aantalAlle = dataFactory__DataItem__.store.length;
      $scope.aantalMijn = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      }).length;

      $scope.aantalPublic = loDash.filter(dataFactory__DataItem__.store, function (__dataItem__Model) {
        return __dataItem__Model.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
      }).length;
      $scope.aantalNieuw = dataFactory__DataItem__.nieuw.length;
      $scope.aantalStar = dataFactory__DataItem__.star.length;

      __dataItem__sAantallenGeenLabel();

      //console.log('__DataItem__sSideMenuCtrl aantalAlle: ' + $scope.aantalAlle + ', aantalMijn: ' + $scope.aantalMijn + ', aantalPublic: ' + $scope.aantalPublic + ', aantalNieuw: ' + $scope.aantalNieuw + ', aantalStar: ' + $scope.aantalStar  + ', aantalGeenLabels: ', $scope.aantalGeenLabels);
    }

    var event5 = $rootScope.$on('__dataItem__sNieuweAantallen', function () {

      //console.warn('__DataItem__sSideMenuCtrl on.__dataItem__sNieuwAantallen');

      __dataItem__sAantallen();
      //console.log('+++ __DataItem__sSideMenuCtrl aantalAlle, aantalMijn, aantalPublic, aantalNieuw, aantalStar, aantalGeenLabels: ', $scope.aantalAlle, $scope.aantalMijn, $scope.aantalPublic, $scope.aantalNieuw, $scope.aantalStar, $scope.aantalGeenLabels);
    });
    $scope.$on('$destroy', event5);

    var event7 = $scope.$on('elemHasFocus', function (event, args) {
      if (args.message !== 'Zoek label') {
        //console.warn('+++ __DataItem__sSideMenuCtrl elem has focus: ', args);
        filter.filter = 'Search';
        setNavTitle();

        $rootScope.$emit('__dataItem__StartSearch');
        if (args.message === 'Zoek in Locaties') {
          $ionicScrollDelegate.scrollTop(true);
        }
      }
    });
    $scope.$on('$destroy', event7);

    var event8 = $rootScope.$on('setPredicate', function (event, args) {

      //console.log('__DataItem__sSideMenuCtrl event setPredicate: ', args);

      sorter = JSON.parse(args);

      if (sorter.predicate === 'gelezen.value') {

        if (sorter.reverse === true) {
          $scope.__dataItem__sSortGelezenUp = true;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.__dataItem__sSortGelezenUp = false;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'naam.value') {
        if (sorter.reverse === true) {
          $scope.__dataItem__sSortNaamUp = true;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.__dataItem__sSortNaamUp = false;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'createdOn.value') {
        if (sorter.reverse === true) {
          $scope.__dataItem__sSortCreatedOnUp = true;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.__dataItem__sSortCreatedOnUp = false;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }

      setNavTitle();
    });
    $scope.$on('$destroy', event8);

    var event11 = $rootScope.$on('__dataItem__Delete', function () {

      loDash.each(dataFactory__DataItem__.store, function (__dataItem__Model) {
        if (!__dataItem__Model.xData) {
          __dataItem__Model.xData = {
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
        //console.error('+++ __DataItem__sSideMenuCtrl watch search.label label: ', $scope.search.label);
        //console.error('+++ __DataItem__sSideMenuCtrl watch search.label val: ', val);
      }
    });
    //
    $scope.$watch('search__DataItem__.naam', function (val) {

      if ($scope.search__DataItem__.naam !== '') {

        //console.warn('+++ __DataItem__sSideMenuCtrl watch search__DataItem__.naam naam: ', $scope.search__DataItem__.naam);
        //console.warn('+++ __DataItem__sSideMenuCtrl watch search__DataItem__.naam val: ', val);

        zoek = val;
        setNavTitle();
        $rootScope.$emit('__dataItem__sFilter', {
          filter: 'Search',
          search: $scope.search__DataItem__.naam
        });
        $state.go('__dataItem__s.__dataItem__s');
      } else {
        if (initSearch) {
          $scope.__dataItem__sFilterAlle();
        } else {
          initSearch = true;
        }
      }
    });

    $scope.clearSearch = function () {
      //console.log('__DataItem__sSideMenuCtrl clearSearch');
      $scope.search.label = '';
      zoek = '';
    };

    $scope.clearSearch__DataItem__ = function () {
      //console.log('__DataItem__sSideMenuCtrl clearSearch__DataItem__');
      $scope.search__DataItem__.naam = '';
      zoek = '';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter');
      $state.go('__dataItem__s.__dataItem__s');
    };

    var setNavTitleEvent = $rootScope.$on('setNavTitleEvent', function (event, tagFilter) {
      //console.log('__DataItem__sSideMenuCtrl setNavTitleEvent filter: ', tagFilter);
      filter = tagFilter;
      setNavTitle();
    });
    $scope.$on('$destroy', setNavTitleEvent);

    var __dataItem__SetNavTitleGlobalEvent = $rootScope.$on('__dataItem__SetNavTitleGlobal', function (event, args) {
      //console.log('__DataItem__sSideMenuCtrl setNavTitleGlobal filter, sorter: ', args);
      filter = {
        filter: args.filter
      };

      sorteer = args.sorteer;
      zoek = args.zoek;
      setNavTitle();
    });
    $scope.$on('$destroy', __dataItem__SetNavTitleGlobalEvent);

    function setNavTitle() {

      //console.log('__DataItem__sSideMenuCtrl setNavTitle sorteer: ', sorteer);
      //console.log('__DataItem__sSideMenuCtrl setNavTitle filter.filter: ', filter.filter);
      //console.log('__DataItem__sSideMenuCtrl setNavTitle zoek: ', zoek);

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

      //console.log('__DataItem__sSideMenuCtrl setNavTitle set : ', $scope.subHeader);

    }

    $scope.toggleLeftSideMenu = function () {
      //console.warn('BerichtenSideMenuCtrl toggleLeftSideMenu');
      dataFactoryAnalytics.createEvent('__dataItem__s', 'sessie', 'kaarten', '', '1');
      $ionicSideMenuDelegate.toggleLeft();
    };

    /*  ###
    //removeIf(!fotos)
    $rootScope.$on('__dataItem__FilterMaak__DataItem__', function () {
      //console.log('__DataItem__sSideMenuCtrl __dataItem__sFilterMaak__DataItem__');
      $scope.search__DataItem__.naam = 'Mijn __dataItem__';
      zoek = 'Mijn __dataItem__';

      filter.filter = 'Search';
      filter.search = 'Mijn __dataItem__';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Search',
        search: 'Mijn __dataItem__'
      });
    });
    //endRemoveIf(!fotos)
    ###  */
    $rootScope.$on('__dataItem__FilterNotification', function () {
      //console.log('__dataItem__FilterNotification');
      //console.log('__DataItem__sSideMenuCtrl __dataItem__sFilterNieuw');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Nieuw'
      });
    });

    $scope.__dataItem__sFilterAlle = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterAlle');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Alle';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Alle'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterMijn = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterMijn');
      filter.filter = 'Mijn';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Mijn'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterPublic = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterPublic');
      filter.filter = 'Public';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Public'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterNieuw = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterNieuw');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Nieuw'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterFavorieten = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterFavorieten');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Favorieten';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Favorieten'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterOngelabeld = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterOngelabeld');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Geen label',
        tagId: '0'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterGeen = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterGeen');
      $scope.search__DataItem__.naam = '';
      zoek = '';

      filter.filter = 'Geen';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Geen'
      });
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sFilterGeenLabel = function () {
      //console.warn('__DataItem__sSideMenuCtrl __dataItem__sFilterGeen');
      $scope.search__DataItem__.naam = '';
      zoek = '';
      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Geen label'
      });
      //console.error('+++ __DataItem__sSideMenuCtrl __dataItem__sFilter: Geen');
      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.filterTag = function (tag) {

      //console.warn('__DataItem__sSideMenuCtrl filterTag: ', tag);
      filter.filter = tag.tag;
      //console.log('__DataItem__sSideMenuCtrl __dataItem__sFilter: ', filter.filter);

      setNavTitle();

      $rootScope.$emit('__dataItem__sFilter', {
        filter: 'Tag',
        tag: tag.tag
        //tagId: tag.__dataItem__s[0].xData.tags[0].xData.get('Id')
      });
      //console.log('__DataItem__sSideMenuCtrl __dataItem__sFilter: ', { filter: 'Tag', tag: tag.items[0].xData.tags[0].xData, tagId: tag.items[0].xData.tags[0].xData.get('Id') });

      $state.go('__dataItem__s.__dataItem__s');
    };

    $scope.__dataItem__sVerwijderDoelgroep = function () {
      //console.warn('BerichtenSideMenuCtrl __dataItem__sVerwijderDoelgroep');
    };

    //
    // Wijzig de in sidemnu gewijzigde tag in store en database
    // Overal wara deze tag gebruikt wordt moet deze tag gewijzigd worden.
    // Tags worden gebruikt in __dataItem__s, locatiesen en __dataItem__s.
    //
    //  Alleen de eigenaar van het __dataItem__TagModel mag editen
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
      //console.warn('__DataItem__sSideMenuCtrl editTag tagModel: ', tagModel);

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

        //console.log('__DataItem__sSideMenuCtrl editTag Label gewijzigd in: ' + res);
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
            $rootScope.$emit('__dataItem__sFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });
            $state.go('__dataItem__s.__dataItem__s');
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

      //console.log('__DataItem__sSideMenuCtrl deleteTag tagModel: ', tagModel);
      //console.log('__DataItem__sSideMenuCtrl deleteTag xtag: ', xtag);

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
            loDash.each(truuk, function (__dataItem__Model) {
              //console.log('__DataItem__sSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, __dataItem__Model);
              if (__dataItem__Model && __dataItem__Model.xData) {
                //

                sorteerDataTags();
                //
                loDash.each(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
                  //console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__Modal.tags loop: ', __dataItem__Model.xData.tags, __dataItem__TagModel);
                  (function (__dataItem__Model, __dataItem__TagModel) {
                    if (__dataItem__TagModel.xData.get('tag') === xtag.tag) {
                      //console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__TagModel in __dataItem__Model.tags wordt verwijderd uit backend: ', __dataItem__TagModel);
                      __dataItem__TagModel.remove().then(function () {
                        //console.log('__DataItem__sSideMenuCtrl deleteTag __dataItem__TagModel wordt verwijderd uit __dataItem__Model.tags: ', __dataItem__TagModel);
                        loDash.remove(__dataItem__Model.xData.tags, function (__dataItem__TagModel) {
                          return __dataItem__TagModel.xData.get('tag') === xtag.tag;
                        });
                      });
                      $rootScope.$emit('__dataItem__RemoveLabel', {
                        __dataItem__Model: __dataItem__Model,
                        tagModel: tagModel
                      });

                    }
                  })(__dataItem__Model, __dataItem__TagModel);
                });
              }
            });

            //console.log('__DataItem__sSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === xtag.tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === xtag.tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle __dataItem__tags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('__DataItem__sSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.__dataItem__sFilterAlle();
            $state.go('__dataItem__s.__dataItem__s');
          }
        }]
      });

    };

    $scope.verwijderSelectie = function () {
      //console.log('__DataItem__sSideMenuCtrl event __dataItem__VerwijderSelectie');
      $rootScope.$emit('__dataItem__VerwijderSelectie', filter);
    };
    //
    //	Init Dropbox
    //
    $scope.exporteerSelectie = function () {
      //console.log('__DataItem__sSideMenuCtrl event __dataItem__ExporteerSelectie');
      $rootScope.$emit('__dataItem__ExporteerSelectie', filter);
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
      //console.log('__DataItem__sSideMenuCtrl event setDropboxReady');
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
      //console.log('__DataItem__sSideMenuCtrl event resetDropboxReady');
      $scope.dropbox = false;
    });

    function checkDbToken() {
      dataFactoryConfigX.loadMe().then(function (configModel) {
        dataFactoryDropbox.accessToken = configModel.get('dbtoken');
        //console.log('__DataItem__sSideMenuCtrl configX loadMe dbtoken: ', configModel.get('gebruikerId'), configModel.get('Id'), configModel.get('dbtoken'));
        //console.log('__DataItem__sSideMenuCtrl $scope.dropbox: ', $scope.dropbox);

        if ($scope.dropbox && dataFactoryDropbox.accessToken === '') {
          $scope.dropbox = false;
          //console.error('__DataItem__SideMenuCtrl ontkoppelen: ', dataFactoryDropbox.accessToken);
        }
        if (!$scope.dropbox && dataFactoryDropbox.accessToken !== '') {
          $scope.dropbox = true;
          //console.log('__DataItem__SideMenuCtrl koppelen: ', dataFactoryDropbox.accessToken);
        }
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        $scope.dropbox = false;
        dataFactoryDropbox.accessToken = '';
        //console.error('__DataItem__sSideMenuCtrl configX.loadme ERROR: ', err);
      });
    }
    //
    // Door alle platforms wordt gekeken of het dbtoken is gewijzigd
    // Het resultaat is dropbox = false/true;
    //
    $interval(function () {
      //console.log('__DataItem__sSideMenuCtrl checking dropbox token');
      checkDbToken();
    }, 10000, 5);
    //
    // ***** I N I T status network *****
    // Bij start van __DataItem__sSideMenuCtrl eenmalig installeren network event listeners.
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

      //console.warn('__DataItem__CardCtrl addNieuweLabel: ', tag);

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
            //console.log('__DataItem__CardCtrl addNieuweLabel tag: ', tagModel);
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

      //console.warn('__DataItem__SideMenuCtrl selectLabelClick tagModel: ', tagModel);
      //console.log('__DataItem__SideMenuCtrl selectLabelClick tagId: ', tagModel.get('Id'));

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
            $rootScope.$emit('labelGeenLabel__DataItem__', {
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

      //console.warn('__DataItem__SideMenuCtrl geenLabelSelectie: ', $event, $scope.global.tags);

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
      //console.warn('__DataItem__SideMenuCtrl openTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function ($event) {
      //console.warn('__DataItem__SideMenuCtrl closeTags');
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
      //console.warn('__DataItem__SideMenuCtrl openPopoverTags: ', $event);

      //console.warn('__DataItem__SideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.warn('__DataItem__SideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.log('__DataItem__SideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $scope.openHelp__DataItem__Menu = function ($event) {
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
      //console.log('__DataItem__SideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('__DataItem__SideMenuCtrl openHelpPopover');
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
      //console.log('__DataItem__SideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      //console.log('__DataItem__SideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
