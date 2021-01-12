'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryAlive', ['$rootScope', '$q', '$timeout', '$interval', '$moment', '$ionicPlatform', 'dataFactoryProxy',
  function ($rootScope, $q, $timeout, $interval, $moment, $ionicPlatform, dataFactoryProxy) {

    ////console.warn('dataFactoryAlive');

    var dataFactoryAlive = {};

    dataFactoryAlive.noHashhhh = false;
    dataFactoryAlive.status = 4;
    dataFactoryAlive.vorigestatus = 0;
    dataFactoryAlive.turn = 10;
    dataFactoryAlive.timer = 60000;
    dataFactoryAlive.aliveTimer = 10;
    dataFactoryAlive.tokenTimer = dataFactoryAlive.timer;
    dataFactoryAlive.intervalId = null;
    dataFactoryAlive.offset = 0;
    dataFactoryAlive.correctTime = '';

    function status_report(nieuw, oud) {
      ////console.warn('Alive status_report: ', nieuw, oud, dataFactoryAlive.offset);
      if (oud !== nieuw) {
        ////console.log('++++++++++++++++++++++');
        if (nieuw !== 0) {
          ////console.log('+ Alive HOST is UP '+ nieuw + ' +');
        } else {
          if (nieuw === 0) {
            ////console.log('+ Alive HOST is DOWN +');
          } else {
            ////console.log('+ Alive status: ' + nieuw + '   +');
          }
        }
        ////console.log('++++++++++++++++++++++');
      }
      dataFactoryAlive.vorigestatus = nieuw;
    }

    $rootScope.$on('$cordovaNetwork:online', function () {
      dataFactoryAlive.init();
      //console.warn('=============================================================================================  alive event cordovaNetwork:online');
    });

    $rootScope.$on('$cordovaNetwork:offline', function () {
      dataFactoryAlive.stopCheck();
      //console.warn('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ alive event cordovaNetwork:offline');
      //        dataFactoryAlive.status = 0;
      //        status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
    });

    $ionicPlatform.on('pause', function () {
      dataFactoryAlive.stopCheck();
      ////console.warn('alive event pause');
    });

    $ionicPlatform.on('resume', function () {
      dataFactoryAlive.init();
      ////console.warn('alive event resume');
    });

    dataFactoryAlive.init = function () {
      ////console.log('Alive init');
      dataFactoryAlive.noHash = false;
      dataFactoryAlive.check();
      dataFactoryAlive.intervalId = $interval(function () {
        //            status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
        dataFactoryAlive.check();
      }, dataFactoryAlive.timer);
      ////console.log('Alive init: ', dataFactoryAlive.intervalId);
    };

    dataFactoryAlive.getTimestamp = function () {
      if (dataFactoryAlive.status !== 0) {
        return $moment().add(dataFactoryAlive.offset, 'seconds').format('YYYY-MM-DD HH:mm:ss');
      } else {
        return $moment().format('YYYY-MM-DD HH:mm:ss');

      }
    };

    dataFactoryAlive.checkAlive = function () {
      //console.warn('checkAlive');
      var q = $q.defer();
      var data = {
        data: {
          success: true
        }
      };
      q.resolve(data);
      return q.promise;
    };

    dataFactoryAlive.zzzzzzcheckAlive = function () {
      ////console.warn('keepAlive');
      var q = $q.defer();

      var store = {
        storeId: 'alive',
        xprive: '',
        currentPage: 1,
        pageSize: 100
      };
      var params = {};

      var key = localStorage.getItem('authentication_hash');
      var id = localStorage.getItem('authentication_id');
      if (key !== null && id !== null) {
        ////console.log('dataFactoryAlive checkAlive: ', key, id, params);
        dataFactoryProxy.http(store, 'GET', 'checkAlive', params).then(function (response) {
          ////console.log('dataFactoryALive checkAlive http: ', response);
          q.resolve(response);
        }, function (err) {

          console.error('dataFactoryALive checkAlive http ERROR: ', err);
          q.reject();
        });
      } else {
        dataFactoryAlive.status = 0;
        status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
        var data = {
          data: {
            success: false
          }
        };
        q.resolve(data);
      }

      return q.promise;
    };

    dataFactoryAlive.check = function () {

      ////console.log('check: ', dataFactoryAlive.turn, dataFactoryAlive.aliveTimer);

      //        if (localStorage.getItem('authentication_token') === undefined || localStorage.getItem('authentication_token') === '') {
      ////console.warn('checkToken');
      //            $rootScope.$emit('noHash');
      //        }

      if (dataFactoryAlive.turn === dataFactoryAlive.aliveTimer) {
        ////console.log('check aLive');
        dataFactoryAlive.turn = 0;

        dataFactoryAlive.checkAlive().then(function (alive) {
          ////console.warn('checkAlive: ', alive.results);
          if (alive.results !== undefined) {
            dataFactoryAlive.offset = $moment(alive.results.backendtime).diff($moment(), 'seconds');
            ////console.warn('checkAlive offset: ', dataFactoryAlive.offset);

            if (alive.success) {
              dataFactoryAlive.status += 1;
              if (dataFactoryAlive.status >= 5) {
                dataFactoryAlive.status = 4;
              }
              status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
            } else {
              dataFactoryAlive.status = 0;
              status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
            }
          } else {
            dataFactoryAlive.status = 0;
            status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
          }
        }, function () {
          dataFactoryAlive.status = 0;
          status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
        });
      } else {
        dataFactoryAlive.turn = dataFactoryAlive.turn + 1;
      }
    };

    dataFactoryAlive.stopCheck = function () {
      ////console.log('Alive stopCheck: ', dataFactoryAlive.intervalId);
      dataFactoryAlive.status = 0;
      if (dataFactoryAlive.intervalId !== null) {
        status_report(dataFactoryAlive.status, dataFactoryAlive.vorigestatus);
        $interval.cancel(dataFactoryAlive.intervalId);
        dataFactoryAlive.intervalId = null;
        ////console.log('Alive stopCheck interval cancelled');
      }
    };

    status_report(4, 4);
    $timeout(function () {
      dataFactoryAlive.init();
    }, 5000);

    return dataFactoryAlive;
  }
]);
