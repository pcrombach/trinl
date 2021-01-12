/* eslint-disable indent */
/* eslint-disable no-undef */

'use strict';
// eslint-disable-next-line no-undef
trinl.controller('FotosSideMenuCtrl', ['loDash', '$rootScope', '$scope', '$state', '$timeout', '$interval', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$ionicPopover', '$ionicModal', '$ionicLoading', '$ionicSideMenuDelegate', 'dataFactoryDropbox', 'dataFactoryHelp', 'dataFactoryTag', 'dataFactoryFoto', 'dataFactoryConfig', 'dataFactoryConfigX', 'dataFactoryCeo', '$ionicListDelegate', '$ionicScrollDelegate', 'dataFactoryAnalytics',
  function (loDash, $rootScope, $scope, $state, $timeout, $interval, $cordovaNetwork, $ionicPlatform, $ionicPopup, $ionicPopover, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, dataFactoryDropbox, dataFactoryHelp, dataFactoryTag, dataFactoryFoto, dataFactoryConfig, dataFactoryConfigX, dataFactoryCeo, $ionicListDelegate, $ionicScrollDelegate, dataFactoryAnalytics) {

    //console.warn('FotosSideMenuCtrl start');

    dataFactoryDropbox.setType('/Fotos');

    //console.warn('FotosSideMenuCtrl dropbox migratie done!');

    var mode = 'foto';

    $scope.Id = dataFactoryCeo.currentModel.get('Id');
    $scope.profiel = dataFactoryCeo.currentModel.get('pofiel');

    $scope.details = [];

    $scope.data = {};
    $scope.data.tags = dataFactoryFoto.sideMenuTags;

    $scope.global = {};
    $scope.global.filtertags = [];

    $scope.global.tags = loDash.filter(dataFactoryTag.store, function (tagModel) {
      return tagModel.get('gebruikerId') === '' || tagModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
    });

    $scope.data.filteredFotos = dataFactoryFoto.store;

    $rootScope.$on('fotoSideMenuUpdate', function () {
      //console.error('fotoSideMenuUpdate');
      $scope.data.tags = dataFactoryFoto.sideMenuTags;
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

    $scope.aantalAlle = dataFactoryFoto.store.length;
    $scope.aantalNieuw = dataFactoryFoto.nieuw.length;
    $scope.aantalStar = dataFactoryFoto.star.length;
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

    var lastArgs = dataFactoryConfig.currentModel.get('fotoFilter');
    //console.log('fotoSideMenuCtrl fotoFilter from config: ', lastArgs);

    if (!lastArgs.filter) {
      lastArgs = {
        filter: 'Geen'
      };
    }
    if (typeof lastArgs === 'string') {
      lastArgs = JSON.parse(lastArgs);
    }
    var filter = lastArgs;
    //console.log('fotoSideMenuCtrl fotoFilter from config: ', filter);

    fotosAantallen();

    $scope.search = {
      label: ''
    };

    $scope.searchFoto = {
      naam: ''
    };

    var sorteer;
    var zoek = '';

    var sorter = dataFactoryConfig.currentModel.get('fotoSorter');
    //console.log('fotoSideMenuCtrl fotoSorter from config: ', sorter);

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
      $scope.fotosSortCreatedOnUp = sorter.reverse;
      //console.log('FotoSideMenuCtrl init sorter from config CreatedOn: ', sorter);
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
      $scope.fotosSortGelezenUp = sorter.reverse;
      //console.log('FotoSideMenuCtrl init sorter from config Gelezen: ', sorter);
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
      $scope.fotosSortNaamUp = sorter.reverse;
      //console.log('FotoSideMenuCtrl init sorter from config Naam: ', sorter);
    }

    $timeout(function () {
      $rootScope.$emit('fotoPredicate', sorter);
      setNavTitle();
    }, 100);

    var loadingTime;

    dataFactoryFoto.selected = [];

    $scope.openKaart2 = function () {

      //console.warn('FotoSideMenuCtrl openKaart2');
      dataFactoryAnalytics.createEvent('sessie', 'kaarten', 'start', '1');
    };

    $scope.fotosSortNaamClick = function () {
      //console.warn('FotoSideMenuCtrl fotosSortNaamClick $scope.fotosSortNaamUp: ', $scope.fotosSortNaamUp);

      $scope.fotosSortNaamUp = !$scope.fotosSortNaamUp;
      if ($scope.fotosSortNaamUp) {
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
      $rootScope.$emit('fotoPredicate', sorter);

    };

    $scope.fotosSortDatumClick = function () {

      //console.warn('FotoSideMenuCtrl fotosSortDatumClick $scope.fotosSortCreatedOnUp: ', $scope.fotosSortCreatedOnUp);

      $scope.fotosSortCreatedOnUp = !$scope.fotosSortCreatedOnUp;
      if ($scope.fotosSortCreatedOnUp) {
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
      $rootScope.$emit('fotoPredicate', sorter);

    };

    $scope.fotosSortGelezenClick = function () {

      //console.warn('FotoSideMenuCtrl fotosSortGelezenClick $scope.fotosSortGelezenUp: ', $scope.fotosSortGelezenUp);

      $scope.fotosSortGelezenUp = !$scope.fotosSortGelezenUp;
      if ($scope.fotosSortGelezenUp) {
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
      $rootScope.$emit('fotoPredicate', sorter);
    };

    function tagsRemove(fotoModel, tagModel) {

      //console.warn('FotosSideMenuCtrl tagsRemove fotoModel, tagModel: ', fotoModel, tagModel);
      //console.log('FotosSideMenuCtrl tagsRemove naam tag', fotoModel.get('naam'), tagModel.get('tag'));

      var xtag = loDash.find($scope.data.tags, function (tag) {
        return tag.tag === tagModel.get('tag');
      });

      if (xtag) {

        //console.log('FotosSideMenuCtrl tagsRemove xtag gevonden: ', xtag);

        //var naam = fotoModel.get('naam');
        //
        //  Verwijder het fotoModel uit de itemss tabel
        //
        //console.log('FotosSideMenuCtrl tagsRemove removing foto Id from xtag.items: ', fotoModel.get('Id'), xtag.items);
        loDash.remove(xtag.items, function (foto) {
          //return foto.Id === fotoModel.get('Id') && foto.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
          return foto.get('Id') === fotoModel.get('Id');
        });

        loDash.remove($scope.data.tags.fotos, function (foto) {
          return foto.get('Id') === fotoModel.get('Id');
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

          tmp = loDash.filter(xtag.items, function (fotoModel) {
            return fotoModel.get('xprive');
          });
          xtag.xprives = tmp.length;

          var tmp = loDash.uniqBy(xtag.items, function (fotoModel) {
            return fotoModel.get('Id');
          });
          xtag.aantal = tmp.length;

          loDash.remove($scope.data.tags, function (sideMenuTag) {
            return sideMenuTag.tag === xtag.tag;
          });
          //console.log('FotosSideMenuCtrl tagsAdd removed to update: ', xtag);
          $scope.data.tags.push(xtag);
          //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

          sorteerDataTags();
        }

        //console.log('FotosSideMenuCtrl tagsRemove tag, xtag REMOVED: ', tagModel.get('tag'), $scope.data.tags);
      } else {
        //console.error('FotosSideMenuCtrl tagsRemove xtag tag NOT FOUND: ', tagModel.get('tag'));
      }
    }
    //
    //  Het fotoModel bevat alle gegevens doe bij een foto horen.
    //  In fotoModel.xData.tag zitten alle fotoTagModellen
    //  In iedere potagModel.xData is een bijbehorend tagModel
    //  hier noemen wij dat model tag.
    //  De parameter tagModel geeft aan om welke tagModel in
    //  fotoModel.xData.tags.xData het gaat
    //    
    function tagsAdd(fotoModel, tagModel) {
      //console.log('FotosSideMenuCtrl tagsAdd fotoModel, tagModel: ', fotoModel, tagModel);
      //console.log('FotosSideMenuCtrl tagsAdd naam tag', fotoModel.get('naam'), tagModel.get('Id'), tagModel.get('tag'));
      //
      //  Selecteer de xtag die hoort bij tag in tagModel.
      //
      var xtag = loDash.find($scope.data.tags, function (xtag) {
        return xtag.tag === tagModel.get('tag');
      });

      var tmp;
      //
      //  De objecten $scope.data.tags hebben de volgende props:
      //  -    fotos: een tabel met alle fotoModellen waar de tag is toegevoegd.
      //  -    tag: de naam van het label.
      //  -    xprives: het aantal door andere gebruikers gepubliceerde fotoModellen.
      //  -    aantal: het unieke aantal fotoModellen (wordt gebruikt om aantal te display in filtermenu)
      //
      if (xtag === undefined) {
        //
        // Tag in fotoTagModel is nog niet aanwezig in tags
        // Nieuwe tag met eerste fotoModel.Id in de tabel items toevoegen
        //
        xtag = {};
        xtag.items = [];
        xtag.items.push(fotoModel);
        xtag.tagId = tagModel.get('Id');
        xtag.tagGebruikerId = tagModel.get('gebruikerId');
        xtag.tag = tagModel.get('tag');

        tmp = loDash.filter(xtag.items, function (fotoModel) {
          return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        xtag.aantal = 1;

        //$scope.data.tags.push(xtag);
        //$scope.data.tags = loDash.orderBy($scope.data.tags, o => o.tag, 'asc');

        $scope.data.tags.push(xtag);

        sorteerDataTags();
        //console.log('FotosSideMenuCtrl tagsAdd menu-onbject nog NIET AANWEZIG nieuwe xtag object naam, Id: ', fotoModel.get('naam'), fotoModel.get('Id'), $scope.data.tags);
        //console.log('FotosSideMenuCtrl tagsAdd menu-object nog NIET AANWEZIG nieuwe xtag => $scope.data.tags object naam, Id: ', fotoModel.get('naam'), fotoModel.get('Id'), $scope.data.tags);

      } else {
        //
        //  Voeg het fotoModel toe aan bestaand tag $scope.data.tag object
        //
        xtag.items.push(fotoModel);
        //
        //  Update het fotoTagModel
        //
        tmp = loDash.filter(xtag.items, function (fotoModel) {
          return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
        });
        xtag.xprives = tmp.length;

        tmp = loDash.uniqBy(xtag.items, function (fotoModel) {
          return fotoModel.get('Id');
        });
        xtag.aantal = tmp.length;

        loDash.remove($scope.data.tags, function (sideMenuTag) {
          return sideMenuTag.tag === xtag.tag;
        });
        //console.log('FotosSideMenuCtrl tagsAdd removed to update: ', xtag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('FotosSideMenuCtrl tagsAdd menu-onbject fotoModel REEDS AANWEZIG in tabel items naam, Id UPDATE: ', fotoModel.get('naam'), fotoModel.get('Id'), $scope.data.tags);
      }
    }

    function tagsUpdate(tagModel) {
      //console.log('FotosSideMenuCtrl tagsUpdate naam tag', tagModel.get('tag'));
      //console.log('FotosSideMenuCtrl tagsUpdate $scope.data.tags: ', $scope.data.tags);
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
        //console.log('FotosSideMenuCtrl tagsAdd removed old tagModel: ', tagModel.get('tag'), xtag.tag);
        $scope.data.tags.push(xtag);

        sorteerDataTags();

        //console.log('FotosSideMenuCtrl tagsUpdate menu-onbject fotoModel in #scope.data.tags  UPDATE: ', $scope.data.tags);
      } else {
        //console.error('FotosSideMenuCtrl tagsUpdate xtag NIET GEVONDEN: ', $scope.data.tags, tagModel.get('Id'));
      }
    }
    //
    // Loop daar alle tags om tags te updaten voor UI
    //
    function finalizeTags() {

      fotosAantallenGeenLabel();
    }

    function delayFinalizeTags() {
      //console.warn('delayFinalizeTags fotoModel');
      finalizeTags();
      $timeout.cancel(loadingTime);

    }
    var debouncedFinalizeTags = loDash.debounce(delayFinalizeTags, 100);

    var event1 = $rootScope.$on('sideMenuFotosFilter', function (event, args) {

      //console.warn('sideMenuFotosFilter args: ', args);

      var filter = args.filter;
      var tag = {
        tagModel: args.tag
      };

      switch (filter) {
        case 'Tag':
          $scope.filterTag(tag);
          break;
        default:
          $scope.fotosFilterAlle();
      }
    });
    $scope.$on('$destroy', event1);

    $rootScope.$on('fotoAddLabel', function (event, args) {
      //console.log('FotosSideMenuCtrl event fotoAddLabel args: ', args);
      var fotoModel = args.fotoModel;
      var tagModel = args.tagModel;
      //console.warn('FotosSideMenuCtrl fotoAddLabel: ', fotoModel.get('naam'), tagModel.get('tag'));
      tagsAdd(fotoModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('fotoRemoveLabel', function (event, args) {
      //console.warn('FotosSideMenuCtrl event fotoAddLabel args: ', args);
      var fotoModel = args.fotoModel;
      var tagModel = args.tagModel;
      //console.warn('FotosSideMenuCtrl fotoRemoveLabel: ', fotoModel, tagModel);
      //console.warn('FotosSideMenuCtrl fotoRemoveLabel: ', fotoModel.get('naam'), tagModel.get('tag'));
      tagsRemove(fotoModel, tagModel);
      debouncedFinalizeTags();
    });

    $rootScope.$on('fotoUpdateLabel', function (event, args) {
      //console.warn('FotosSideMenuCtrl event fotoUpdateLabel args: ', args);
      var tagModel = args.tagModel;
      //console.warn('++++++++++++++++++++++++++++++ FotosSideMenuCtrl fotoUpdateLabel: ', tagModel.get('tag'));
      tagsUpdate(tagModel);
      debouncedFinalizeTags();
    });

    var event4 = $rootScope.$on('fotoNavTitle', function (event, args) {

      //console.warn('+++ FotosSideMenuCtrl navTitle filter sorter, $scope.fotosSortNaamUp: ', args.filter, args.sorter, $scope.fotosSortNaamUp);
      filter.filter = args.filter.filter;
      if (args.filter.tag !== undefined) {
        filter.filter = args.filter.tag;
      }
      if (args.filter.search !== undefined) {
        zoek = args.filter.search;
      }
      $scope.searchFoto.naam = zoek;
      $rootScope.$emit('fotosFilter', args.filter);

      if (!args.sorter) {
        args.sorter = {};
      }

      if (args.sorter.reverse) {
        $scope.fotosSortNaamUp === false;
      }
    });
    $scope.$on('$destroy', event4);

    function fotosAantallenGeenLabel() {

      //console.warn('FotosSideMenuCtrl fotosAantallenGeenLabel');

      $scope.aantalGeenLabels = 0;

      loDash.each(dataFactoryFoto.store, function (fotoModel) {
        if (fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id')) {
          if (fotoModel.xData !== undefined) {
            if (fotoModel.xData.tags !== undefined) {
              if (fotoModel.xData.tags.length === 0) {
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

    function fotosAantallen() {

      loDash.remove(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.xprive === true && (fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });
      loDash.remove(dataFactoryFoto.data, function (dataItem) {
        return dataItem.record.xprive === true && (dataItem.record.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id'));
      });

      $scope.aantalAlle = dataFactoryFoto.store.length;
      $scope.aantalMijn = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
      }).length;

      $scope.aantalPublic = loDash.filter(dataFactoryFoto.store, function (fotoModel) {
        return fotoModel.get('gebruikerId') !== dataFactoryCeo.currentModel.get('Id');
      }).length;
      $scope.aantalNieuw = dataFactoryFoto.nieuw.length;
      $scope.aantalStar = dataFactoryFoto.star.length;

      fotosAantallenGeenLabel();

      //console.log('FotosSideMenuCtrl aantalAlle: ' + $scope.aantalAlle + ', aantalMijn: ' + $scope.aantalMijn + ', aantalPublic: ' + $scope.aantalPublic + ', aantalNieuw: ' + $scope.aantalNieuw + ', aantalStar: ' + $scope.aantalStar  + ', aantalGeenLabels: ', $scope.aantalGeenLabels);
    }

    var event5 = $rootScope.$on('fotosNieuweAantallen', function () {

      //console.warn('FotosSideMenuCtrl on.fotosNieuwAantallen');

      fotosAantallen();
      //console.log('+++ FotosSideMenuCtrl aantalAlle, aantalMijn, aantalPublic, aantalNieuw, aantalStar, aantalGeenLabels: ', $scope.aantalAlle, $scope.aantalMijn, $scope.aantalPublic, $scope.aantalNieuw, $scope.aantalStar, $scope.aantalGeenLabels);
    });
    $scope.$on('$destroy', event5);

    var event7 = $scope.$on('elemHasFocus', function (event, args) {
      if (args.message !== 'Zoek label') {
        //console.warn('+++ FotosSideMenuCtrl elem has focus: ', args);
        filter.filter = 'Search';
        setNavTitle();

        $rootScope.$emit('fotoStartSearch');
        if (args.message === 'Zoek in Fotos') {
          $ionicScrollDelegate.scrollTop(true);
        }
      }
    });
    $scope.$on('$destroy', event7);

    var event8 = $rootScope.$on('setPredicate', function (event, args) {

      //console.log('FotosSideMenuCtrl event setPredicate: ', args);

      sorter = JSON.parse(args);

      if (sorter.predicate === 'gelezen.value') {

        if (sorter.reverse === true) {
          $scope.fotosSortGelezenUp = true;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.fotosSortGelezenUp = false;
          sorteer = 'Gelezen&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'naam.value') {
        if (sorter.reverse === true) {
          $scope.fotosSortNaamUp = true;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.fotosSortNaamUp = false;
          sorteer = 'Naam&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }
      if (sorter.predicate === 'createdOn.value') {
        if (sorter.reverse === true) {
          $scope.fotosSortCreatedOnUp = true;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-down-b"></i>';
        } else {
          $scope.fotosSortCreatedOnUp = false;
          sorteer = 'Datum&nbsp&nbsp<i class="radio-icon ion-arrow-up-b"></i>';
        }
      }

      setNavTitle();
    });
    $scope.$on('$destroy', event8);

    var event11 = $rootScope.$on('fotoDelete', function () {

      loDash.each(dataFactoryFoto.store, function (fotoModel) {
        if (!fotoModel.xData) {
          fotoModel.xData = {
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
        //console.error('+++ FotosSideMenuCtrl watch search.label label: ', $scope.search.label);
        //console.error('+++ FotosSideMenuCtrl watch search.label val: ', val);
      }
    });
    //
    $scope.$watch('searchFoto.naam', function (val) {

      if ($scope.searchFoto.naam !== '') {

        //console.warn('+++ FotosSideMenuCtrl watch searchFoto.naam naam: ', $scope.searchFoto.naam);
        //console.warn('+++ FotosSideMenuCtrl watch searchFoto.naam val: ', val);

        zoek = val;
        setNavTitle();
        $rootScope.$emit('fotosFilter', {
          filter: 'Search',
          search: $scope.searchFoto.naam
        });
        $state.go('fotos.fotos');
      } else {
        if (initSearch) {
          $scope.fotosFilterAlle();
        } else {
          initSearch = true;
        }
      }
    });

    $scope.clearSearch = function () {
      //console.log('FotosSideMenuCtrl clearSearch');
      $scope.search.label = '';
      zoek = '';
    };

    $scope.clearSearchFoto = function () {
      //console.log('FotosSideMenuCtrl clearSearchFoto');
      $scope.searchFoto.naam = '';
      zoek = '';
      setNavTitle();
      $rootScope.$emit('fotosFilter');
      $state.go('fotos.fotos');
    };

    var setNavTitleEvent = $rootScope.$on('setNavTitleEvent', function (event, tagFilter) {
      //console.log('FotosSideMenuCtrl setNavTitleEvent filter: ', tagFilter);
      filter = tagFilter;
      setNavTitle();
    });
    $scope.$on('$destroy', setNavTitleEvent);

    var fotoSetNavTitleGlobalEvent = $rootScope.$on('fotoSetNavTitleGlobal', function (event, args) {
      //console.log('FotosSideMenuCtrl setNavTitleGlobal filter, sorter: ', args);
      filter = {
        filter: args.filter
      };

      sorteer = args.sorteer;
      zoek = args.zoek;
      setNavTitle();
    });
    $scope.$on('$destroy', fotoSetNavTitleGlobalEvent);

    function setNavTitle() {

      //console.log('FotosSideMenuCtrl setNavTitle sorteer: ', sorteer);
      //console.log('FotosSideMenuCtrl setNavTitle filter.filter: ', filter.filter);
      //console.log('FotosSideMenuCtrl setNavTitle zoek: ', zoek);

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

      //console.log('FotosSideMenuCtrl setNavTitle set : ', $scope.subHeader);

    }

    $scope.toggleLeftSideMenu = function () {
      //console.warn('BerichtenSideMenuCtrl toggleLeftSideMenu');
      dataFactoryAnalytics.createEvent('fotos', 'sessie', 'kaarten', '', '1');
      $ionicSideMenuDelegate.toggleLeft();
    };

    
    //removeIf(!fotos)
    $rootScope.$on('fotoFilterMaakFoto', function () {
      //console.log('FotosSideMenuCtrl fotosFilterMaakFoto');
      $scope.searchFoto.naam = 'Mijn foto';
      zoek = 'Mijn foto';

      filter.filter = 'Search';
      filter.search = 'Mijn foto';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Search',
        search: 'Mijn foto'
      });
    });
    //endRemoveIf(!fotos)
    
    $rootScope.$on('fotoFilterNotification', function () {
      //console.log('fotoFilterNotification');
      //console.log('FotosSideMenuCtrl fotosFilterNieuw');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Nieuw'
      });
    });

    $scope.fotosFilterAlle = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterAlle');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Alle';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Alle'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterMijn = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterMijn');
      filter.filter = 'Mijn';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Mijn'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterPublic = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterPublic');
      filter.filter = 'Public';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Public'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterNieuw = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterNieuw');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Nieuw';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Nieuw'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterFavorieten = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterFavorieten');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Favorieten';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Favorieten'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterOngelabeld = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterOngelabeld');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Geen label',
        tagId: '0'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterGeen = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterGeen');
      $scope.searchFoto.naam = '';
      zoek = '';

      filter.filter = 'Geen';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Geen'
      });
      $state.go('fotos.fotos');
    };

    $scope.fotosFilterGeenLabel = function () {
      //console.warn('FotosSideMenuCtrl fotosFilterGeen');
      $scope.searchFoto.naam = '';
      zoek = '';
      filter.filter = 'Geen label';
      setNavTitle();
      $rootScope.$emit('fotosFilter', {
        filter: 'Geen label'
      });
      //console.error('+++ FotosSideMenuCtrl fotosFilter: Geen');
      $state.go('fotos.fotos');
    };

    $scope.filterTag = function (tag) {

      //console.warn('FotosSideMenuCtrl filterTag: ', tag);
      filter.filter = tag.tag;
      //console.log('FotosSideMenuCtrl fotosFilter: ', filter.filter);

      setNavTitle();

      $rootScope.$emit('fotosFilter', {
        filter: 'Tag',
        tag: tag.tag
        //tagId: tag.fotos[0].xData.tags[0].xData.get('Id')
      });
      //console.log('FotosSideMenuCtrl fotosFilter: ', { filter: 'Tag', tag: tag.items[0].xData.tags[0].xData, tagId: tag.items[0].xData.tags[0].xData.get('Id') });

      $state.go('fotos.fotos');
    };

    $scope.fotosVerwijderDoelgroep = function () {
      //console.warn('BerichtenSideMenuCtrl fotosVerwijderDoelgroep');
    };

    //
    // Wijzig de in sidemnu gewijzigde tag in store en database
    // Overal wara deze tag gebruikt wordt moet deze tag gewijzigd worden.
    // Tags worden gebruikt in fotos, locatiesen en fotos.
    //
    //  Alleen de eigenaar van het fotoTagModel mag editen
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
      //console.warn('FotosSideMenuCtrl editTag tagModel: ', tagModel);

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

        //console.log('FotosSideMenuCtrl editTag Label gewijzigd in: ' + res);
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
            $rootScope.$emit('fotosFilter', {
              filter: 'Tag',
              tag: tagModel.get('tag')
            });
            $state.go('fotos.fotos');
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

      //console.log('FotosSideMenuCtrl deleteTag tagModel: ', tagModel);
      //console.log('FotosSideMenuCtrl deleteTag xtag: ', xtag);

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
            loDash.each(truuk, function (fotoModel) {
              //console.log('FotosSideMenuCtrl deleteTag xtag.items loop: ', xtag.items, fotoModel);
              if (fotoModel && fotoModel.xData) {
                //

                sorteerDataTags();
                //
                loDash.each(fotoModel.xData.tags, function (fotoTagModel) {
                  //console.log('FotosSideMenuCtrl deleteTag fotoModal.tags loop: ', fotoModel.xData.tags, fotoTagModel);
                  (function (fotoModel, fotoTagModel) {
                    if (fotoTagModel.xData.get('tag') === xtag.tag) {
                      //console.log('FotosSideMenuCtrl deleteTag fotoTagModel in fotoModel.tags wordt verwijderd uit backend: ', fotoTagModel);
                      fotoTagModel.remove().then(function () {
                        //console.log('FotosSideMenuCtrl deleteTag fotoTagModel wordt verwijderd uit fotoModel.tags: ', fotoTagModel);
                        loDash.remove(fotoModel.xData.tags, function (fotoTagModel) {
                          return fotoTagModel.xData.get('tag') === xtag.tag;
                        });
                      });
                      $rootScope.$emit('fotoRemoveLabel', {
                        fotoModel: fotoModel,
                        tagModel: tagModel
                      });

                    }
                  })(fotoModel, fotoTagModel);
                });
              }
            });

            //console.log('FotosSideMenuCtrl deleteTag tagModel wordt verwijderd uit dataFactoryTag.store: ', tagModel);
            loDash.remove(dataFactoryTag.store, function (tag) {
              return tag.get('Id') === xtag.tag && tag.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            loDash.remove(dataFactoryTag.data, function (dataItem) {
              return dataItem.record.get('Id') === xtag.tag && dataItem.record.get('gebruikerId') === dataFactoryCeo.currentModel.get('Id');
            });
            //
            // Verwijder tag in de backend. De backend verwijderd ook alle fototags met tagId van alle andere gebruikers
            //
            if (tagModel.get('gebruikerId') !== '') {
              //console.log('FotosSideMenuCtrl deleteTag tagModel wordt verwijderd uit backend: ', tagModel);
              tagModel.remove();
            }

            $scope.fotosFilterAlle();
            $state.go('fotos.fotos');
          }
        }]
      });

    };

    $scope.verwijderSelectie = function () {
      //console.log('FotosSideMenuCtrl event fotoVerwijderSelectie');
      $rootScope.$emit('fotoVerwijderSelectie', filter);
    };
    //
    //	Init Dropbox
    //
    $scope.exporteerSelectie = function () {
      //console.log('FotosSideMenuCtrl event fotoExporteerSelectie');
      $rootScope.$emit('fotoExporteerSelectie', filter);
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
      //console.log('FotosSideMenuCtrl event setDropboxReady');
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
      //console.log('FotosSideMenuCtrl event resetDropboxReady');
      $scope.dropbox = false;
    });

    function checkDbToken() {
      dataFactoryConfigX.loadMe().then(function (configModel) {
        dataFactoryDropbox.accessToken = configModel.get('dbtoken');
        //console.log('FotosSideMenuCtrl configX loadMe dbtoken: ', configModel.get('gebruikerId'), configModel.get('Id'), configModel.get('dbtoken'));
        //console.log('FotosSideMenuCtrl $scope.dropbox: ', $scope.dropbox);

        if ($scope.dropbox && dataFactoryDropbox.accessToken === '') {
          $scope.dropbox = false;
          //console.error('FotoSideMenuCtrl ontkoppelen: ', dataFactoryDropbox.accessToken);
        }
        if (!$scope.dropbox && dataFactoryDropbox.accessToken !== '') {
          $scope.dropbox = true;
          //console.log('FotoSideMenuCtrl koppelen: ', dataFactoryDropbox.accessToken);
        }
        // eslint-disable-next-line no-unused-vars
      }).catch(function (err) {
        $scope.dropbox = false;
        dataFactoryDropbox.accessToken = '';
        //console.error('FotosSideMenuCtrl configX.loadme ERROR: ', err);
      });
    }
    //
    // Door alle platforms wordt gekeken of het dbtoken is gewijzigd
    // Het resultaat is dropbox = false/true;
    //
    $interval(function () {
      //console.log('FotosSideMenuCtrl checking dropbox token');
      checkDbToken();
    }, 10000, 5);
    //
    // ***** I N I T status network *****
    // Bij start van FotosSideMenuCtrl eenmalig installeren network event listeners.
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

      //console.warn('FotoCardCtrl addNieuweLabel: ', tag);

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
            //console.log('FotoCardCtrl addNieuweLabel tag: ', tagModel);
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

      //console.warn('FotoSideMenuCtrl selectLabelClick tagModel: ', tagModel);
      //console.log('FotoSideMenuCtrl selectLabelClick tagId: ', tagModel.get('Id'));

      $ionicPopup.confirm({
        title: 'Fotos zonder label',
        template: 'Label <br><br><span class="trinl-rood"><b>' + tagModel.get('tag') + '</b></span><br><br>toevoegen aan alle Fotos zonder label',
        scope: $scope,
        buttons: [{
          text: 'Annuleer'
        }, {
          text: '<b>Labels toevoegen</b>',
          type: 'button-positive',
          onTap: function () {
            $scope.closeTags();
            $rootScope.$emit('labelGeenLabelFoto', {
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
        helpTypes = 'Fotos';
        helpType = 'Foto';
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
        items = 'Fotos';
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

      //console.warn('FotoSideMenuCtrl geenLabelSelectie: ', $event, $scope.global.tags);

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
      //console.warn('FotoSideMenuCtrl openTags');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.openModalTags();
      } else {
        $scope.openPopoverTags($event);
      }
    };

    $scope.closeTags = function ($event) {
      //console.warn('FotoSideMenuCtrl closeTags');
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
      //console.warn('FotoSideMenuCtrl openPopoverTags: ', $event);

      //console.warn('FotoSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.warn('FotoSideMenuCtrl openModalTags: ', $scope.global.tags);
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
      //console.log('FotoSideMenuCtrl closeHelp');
      if (window.matchMedia('only screen and (max-width : 599px)').matches) {
        $scope.closeHelpModal();
      } else {
        $scope.closeHelpPopover($event);
      }
    };

    $scope.openHelpFotoMenu = function ($event) {
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
      //console.log('FotoSideMenuCtrl openHelpPopover');
      $scope.helpPopover.show($event);
    };
    $scope.closeHelpPopover = function () {
      //console.log('FotoSideMenuCtrl openHelpPopover');
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
      //console.log('FotoSideMenuCtrl openHelpModal');
      $scope.helpModal.show();
    };
    $scope.closeHelpModal = function () {
      //console.log('FotoSideMenuCtrl closeHelpModal');
      $scope.helpModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.helpModal.remove();
    });
  }
]);
