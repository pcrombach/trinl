/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryProxy', ['BASE', '$q', '$location', '$http',
  function (BASE, $q, $location, $http) {

    var debug = true;
    //debug = false;
    var debug_method = '';
    var debug_storeId = '';
    var debug_operation = '';
    var debug_jwt = true;

    var jwt;

    //console.log('BASE.URL: ', BASE.URL);
    //console.log('$location: ', $location.$$host);
    //console.log('localStorage id: ', localStorage.getItem('authentication_id'));
    //console.log('localStorage hash: ', localStorage.getItem('authentication_hash'));

    var dataFactoryProxy = {};

    var urlBaseBackend = 'https://www.trinl.nl/Backends/backendTrinl/';

    //console.log('dataFactoryProxy $location.$$host: ', $location.$$host);
    //console.log('dataFactoryProxy BASE.URL: ', BASE.URL);
    //
    // Standaard server voor mobiele apparaten (=$$host = '') is de server in constant BASE
    //
    if ($location.$$host === '') {
      urlBaseBackend = BASE.URL + 'Backends/backendTrinl/';
    }
    if ($location.$$host === 'localhost') {
      urlBaseBackend = 'http://localhost/trinl/Backends/backendTrinl/';
    }
    if ($location.$$host === 'trinl.nl' || $location.$$host === 'www.trinl.nl') {
      urlBaseBackend = 'https://www.trinl.nl/Backends/backendTrinl/';
    }
    if ($location.$$host === 'pcmatic.nl' || $location.$$host === 'www.pcmatic.nl') {
      urlBaseBackend = 'https://www.pcmatic.nl/Backends/backendTrinl/';
    }

    //console.log('dataFactoryProxy urlBaseBackend: ', urlBaseBackend);

    dataFactoryProxy.http = function (store, method, operation, params) {
      if (debug) {
        //console.log('HTTP PROXY ' + store.storeId + ',  ' + method + ',  ' + operation + ' => params : ' + JSON.stringify(params));
      }

      var q = $q.defer();
      var id = localStorage.getItem('authentication_id');
      if (id !== null) {
        var key = '1';
        var jwt = '';

        var profielId = localStorage.getItem(
          'authentication_profielId'
        );

        jwt = localStorage.getItem('authentication_token');

        var timeout = 10000; // 10 sec
        if (store.timeout) {
          timeout = store.timeout;
        }
        if (method === 'GET') {
          params.xprive = store.xprive;
          params.pageStart =
            (store.currentPage - 1) * store.pageSize;
          params.pageLimit = store.pageSize;
          if (!params.pageStart) {
            params.pageStart = 0;
          }
          if (debug) {
            //console.log('HTTP PROXY ' + store.storeId + ',  ' + operation + ' => params : ' + JSON.stringify(params));
          }
        }
        if (debug) {
          //console.log(store.storeId + ' PROXY method, send, params: ' + method + ' => ' + urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId, JSON.stringify(params));
        }
        if (
          debug_method === 'GET' ||
          debug_method === 'POST' ||
          debug_method === 'PUT' ||
          debug_method === 'DELETE'
        ) {
          if (debug_method === method) {
            //console.error(store.storeId + ' PROXY method, send, params: ' + method + ' => ' + urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId, JSON.stringify(params));
          }
        }
        if (debug_storeId === store.storeId) {
          //console.error(store.storeId + ' PROXY method, send, params: ' + method + ' => ' + urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId, JSON.stringify(params));
        }
        if (debug_operation === operation) {
          //console.error(store.storeId + ' PROXY method, send, params: ' + method + ' => ' + urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId, JSON.stringify(params));
        }
        if (jwt) {
          if (debug_jwt) {
            //console.log('PROXY jwt: ' + jwt);
            //console.log('PROXY url: ', urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId);
          }

          $http({
            method: method,
            url: urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId,
            headers: {
              Authorization: 'Bearer ' + jwt
            },
            params: params, timeout: timeout
          })
            .success(function (data) {
              q.resolve(data);
            })
            .error(function (err) {

              //console.error('PROXY ERROR url: ', urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId);

              if (params.Id) {
                if (method === 'POST' || method === 'PUT' || method === 'DELETE') {

                  if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

                    var request = indexedDB.open('trinlSyncDB');
                    request.onerror = function (event) {
                      //console.error('IndexedDB not available!!!!!!', event);
                    };
                    request.onsuccess = function (event) {
                      db = event.target.result;

                      var transaction = db.transaction([store.storeId], 'readwrite');
                      transaction.oncomplete = function (event) {
                        //console.log('IndexedDb transaction OK', event);
                      };

                      var objectStore = transaction.objectStore(store.storeId);
                      var obj = {
                        Id: makeid(32),
                        meta: {
                          method: method,
                          url: urlBaseBackend,
                          token: localStorage.getItem('authentication_token'),
                          gebruikerId: localStorage.getItem('authentication_id'),
                          profielId: localStorage.getItem('authentication_profielId')
                        },
                        record: params
                      };

                      var request = objectStore.add(obj);

                      request.onsuccess = function (event) {
                        //console.log('dataFactoryProxy add indexedDB store result: ', store.storeId, obj.Id, obj.meta, obj.record);
                        navigator.serviceWorker.ready.then(reg => {
                          //console.log('IndexedDB add OK');
                          reg.sync.register(store.storeId);
                          //console.log(store.storeId + ' sync registered with tag: ', store.storeId);
                          reg.sync.getTags().then(tags => {
                            //console.log(store.storeId + ' all tags: ', tags);
                          });
                        });
                      };
                      request.onerror = function (error) {
                        //console.error('dataFactoryProxy add indexedDB store ERROR: ', store.storeId, error);
                      };
                    };
                  }
                }
              }
              q.reject(err);
            });
        } else {
          //console.error('PROXY GEEN jwt');

          $http({
            method: method,
            url: urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId, params: params, timeout: timeout
          })
            .success(function (data) {
              q.resolve(data);
            })
            .error(function (err) {

              //console.error('PROXY ERROR url: ', urlBaseBackend + store.storeId + '/' + operation + '/' + key + '/' + id + '/' + profielId);

              if (method === 'POST' || method === 'PUT' || method === 'DELETE') {

                if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

                  var request = indexedDB.open('trinlSyncDB');
                  request.onerror = function (event) {
                    //console.error('IndexedDB not available!!!!!!');
                  };
                  request.onsuccess = function (event) {
                    db = event.target.result;

                    var transaction = db.transaction([store.storeId], 'readwrite');
                    transaction.oncomplete = function (event) {
                      //console.log('IndexedDb transaction OK');
                    };

                    var objectStore = transaction.objectStore(store.storeId);
                    var obj = {
                      Id: makeid(32),
                      meta: {
                        method: method,
                        url: urlBaseBackend,
                        token: localStorage.getItem('authentication_token'),
                        gebruikerId: localStorage.getItem('authentication_id'),
                        profielId: localStorage.getItem('authentication_profielId')
                      },
                      record: params
                    };
                    var request = objectStore.add(obj);
                    request.onsuccess = function (event) {
                      navigator.serviceWorker.ready.then(reg => {
                        //console.log('IndexedDB add OK');
                        reg.sync.register(store.storeId);
                        //console.log(store.storeId + ' sync registered with tag: ', store.storeId);
                        reg.sync.getTags().then(tags => {
                          //console.log(store.storeId + ' all tags: ', tags);
                        });
                      });
                    };
                  };
                }
              }
              q.reject(err);
            });
        }
      } else {
        //console.error(store.storeId + ' geen id');
        q.reject();
      }
      //});

      return q.promise;
    };

    function makeid(num) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < num; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }


    return dataFactoryProxy;
  }
]);
