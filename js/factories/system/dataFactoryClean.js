/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryClean', [
  function () {

    console.warn('dataFactoryClean');

    var dataFactoryClean = {};


    dataFactoryClean.cleanStore = function (store) {

      if (store.storeId === 'bericht' || store.storeId === 'poi' || store.storeId === 'foto' || store.storeId === 'track') {
        console.warn(store.storeId + ' cleanStore');
        store.cleanStore().then(function (result) {
          console.log(store.storeId + ' cleanStore: ', result);
        }).catch(function (err) {
          console.error(store.storeId + ' cleanStore ERROR: ', err);
        });
      }
    };

    return dataFactoryClean;
  }
]);
