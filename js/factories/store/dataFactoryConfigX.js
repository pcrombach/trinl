/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryConfigX', ['$q', 'dataFactorySyncFS', 'dataFactoryConfig', 'dataFactoryHelper', 'dataFactoryProxy',
  function ($q, dataFactorySyncFS, dataFactoryConfig, dataFactoryHelper, dataFactoryProxy) {

    //console.warn('dataFactoryConfigX');

    var dataFactoryConfigX = {};
    var me = dataFactoryConfigX;


    me.storeId = 'configX';

    me.fsEnable = false;
    me.fsReady = false;

    me.idProperty = 'gebruikerId';

    me.configXModel = {};

    me.getConfig = function () {

      var q = $q.defer();

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        me.getConfigMobiel().then(function (update) {
          //console.log('dataFactoryConfigX mobiel getConfig getConfigMobile SUCCESS');
          q.resolve(update);
        }, function (err) {
          //console.error('dataFactoryConfigX mobiel getConfig getConfigDesktop err: ', err);
          q.resolve(false);
        });
      } else {

        me.getConfigDesktop().then(function () {
          //console.log('dataFactoryConfigX desktop getConfig getConfigDesktop SUCCESS');
          q.resolve();
        }, function (err) {
          //console.error('dataFactoryConfigX desktop getConfig getConfigDesktop err: ', err);
          q.resolve();
        });
      }

      return q.promise;
    };
    /**
     * Plaats de meest actuele config in dataFactoryConfig.currentModel
     * Start met de config in FileSystem (FS)
     * Vervolgens laad de config van de backend en bepaal welke de meest actuele is.
     *
     */
    me.getConfigMobiel = function () {

      //console.warn('dataFactoryConfigX getConfigMobiel');

      var q = $q.defer();

      dataFactoryConfigX.getFileSystem().then(function (configModel) {
        //console.log('dataFactoryConfigX.getConfigMobiel getFileSystem SUCCESS');

        dataFactoryConfig.currentModel = configModel;
        q.resolve();

      }, function (err) {
        //console.error('dataFactoryConfigX.getConfigMobiel initConfig localstorage ERROR err: ', err);
        q.resolve(false);
      });

      return q.promise;
    };
    /**
     * Plaats de meest actuele config in dataFactoryConfig.currentModel
     * Start met de config in LocalStorage
     * Vervolgens laad de config van de backend en bepaal welke de meest actuele is.
     */
    me.getConfigDesktop = function () {

      //console.warn('dataFactoryConfigX getConfigDesktop');

      var q = $q.defer();

      dataFactoryConfigX.getLocalStorage().then(function (configModel) {
        //console.log('dataFactoryConfigX getConfigDesktop getLocaltorage SUCCESS: ', configModel);

        dataFactoryConfig.currentModel = configModel;
        q.resolve();

      }, function (err) {
        //console.error('dataFactoryConfigX getLocalStorage ERROR: ', err);
        q.resolve();
      });

      return q.promise;
    };

    me.getLocalStorage = function () {

      //console.warn('dataFactoryConfigX getLocalStorage');

      var q = $q.defer();

      if (localStorage.getItem('authentication_id') !== undefined) {

        var config = localStorage.getItem('config');

        if (config !== null) {

          //console.log('dataFactoryConfigX getLocalStorage config: ', config);

          var configModel = dataFactoryHelper.StringToModel(dataFactoryConfig, config);

          //console.log('dataFactoryConfigX getLocalStorage configModel: ', configModel.get('changedOn'));
          q.resolve(configModel);


        } else {

          q.reject('getConfig ERROR no config in LS');
        }
      } else {
        //console.error('dataFactoryConfigX getLocalStorage geen authentication_id in LS');
        q.reject();
      }

      return q.promise;
    };

    me.getFileSystem = function () {

      //console.warn('dataFactoryConfigX getFileSystem');

      var q = $q.defer();

      dataFactorySyncFS.readFSConfig(dataFactoryConfig).then(function (configModel) {

        //console.log('dataFactoryConfigX getFileSystem SUCCESS: ', configModel.get('changedOn'));

        q.resolve(configModel);

      }, function (err) {

        //console.warn('dataFactoryConfigX getFileSystem ERROR: ', err);

        q.resolve('dataFactoryConfigX getFileSystem ERROR: ', err);
      });

      return q.promise;
    };

    me.updateFileSystem = function (configModel) {

      //console.warn('dataFactoryConfigX updateFileSystem');

      var q = $q.defer();

      dataFactorySyncFS.writeFSConfig(dataFactoryConfig, configModel, true).then(function () {
        //console.log('dataFactoryConfigX updateFileSystem save SUCCESS', configModel.get('changedOn'));

        q.resolve();

      }, function (err) {
        //console.error('dataFactoryConfigX updateFileSystem save ERROR', err);


        q.reject(err);
      });

      return q.promise;
    };

    me.updateLocalStorage = function (configModel) {

      //console.warn('dataFactoryConfig.updateLocalStorage configModel: ', configModel);

      var config = dataFactoryHelper.ModelToString(dataFactoryConfig, configModel);
      localStorage.setItem('config', config);
    };
    /**
     * Werk de config bij mbv een configModel
     * Save in Backend
     * LS (desktop) of FS (mobiel)
     */
    me.update = function (configModel) {

      //console.error('dataFactoryConfigX.update: ', configModel);

      var q = $q.defer();

      configModel.save().then(function (configModel) {

        //console.log('dataFactoryConfigX configModel save SUCCESS: ', configModel);

        dataFactoryConfig.currentModel = configModel;

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          me.updateFileSystem(configModel);
          q.resolve();
        } else {
          me.updateLocalStorage(configModel);
          //console.log('dataFactoryConfigX configModel updateLocalStorage SUCCESS: ', configModel);
          q.resolve();
        }
      }, function (err) {
        //console.error('dataFactoryConfigX configModel save ERROR: ', err);
        q.resolve();
      });

      return q.promise;
    };
    /**
     * Levert config van Backend
     * @return {Object} configModel from backend
     */
    me.loadMe = function () {

      //console.warn('dataFactoryConfigX loadMe');

      var q = $q.defer();

      var configModel;

      if (localStorage.getItem('authentication_id')) {

        //console.warn('dataFactoryConfigX loadMe authentication_id in LS OK');

        var params = {
          gebruikerId: localStorage.getItem('authentication_id')
        };

        dataFactoryProxy.http(dataFactoryConfig, 'GET', 'loadMe', params).then(function (data) {
          //console.log('dataFactoryConfigX loadMe params, data: ', params, data);

          if (data.results[0] !== undefined) {

            configModel = dataFactoryHelper.RecordToModel(dataFactoryConfig, data.results[0]);
            //
            // Het configModel gegenereerd door loadMe is in de backend bekend maar niet in de store
            // Plaats het configModel mbv addData in de store
            // Indien save het model niet in de store vindt wordt het model geinsert ipv geupdate
            //
            dataFactoryConfig.currentModel = configModel;
            dataFactoryConfig.addData(configModel).then(function () {
              //console.log('dataFactoryConfigX loadMe add configModel SUCCESS: ', configModel.get('changedOn'));
              q.resolve(configModel);
            }, function (err) {
              //console.error('dataFactoryConfigX loadMe add configModel ERROR: ', err);
              q.resolve();
            });
          } else {
            //console.error('dataFactoryConfigX updateConfig loadMe ERROR: no data');

            q.reject();
          }

        }, function (err) {
          //console.error('dataFactoryConfigX updateConfig loadMe ERROR: ', err);

          q.reject(err);
        });
      } else {
        //console.error('dataFactoryConfigX updateConfig loadMe ERROR: no authentication_id');

        q.reject('no authentication_id');
      }

      return q.promise;
    };

    return dataFactoryConfigX;

  }
]);
