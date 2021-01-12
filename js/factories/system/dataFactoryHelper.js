/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryHelper', ['loDash',
  function (loDash) {

    //console.warn('dataFactoryHelper');

    var dataFactoryHelper = {};

    dataFactoryHelper.switch = 0;
    /**
     * explodeAvatar converteert een string avatar in 3 parameters: avatarColor, avatarLette en avatarInverse
     */
    dataFactoryHelper.ExplodeAvatar = function (avatar) {

      //console.warn('dataFactoryHelper ExplodeAvatar: ', avatar);

      var avatarObj = [];

      avatarObj.Letter = '';
      var avatars = avatar.split('.');
      if (avatars.length === 3) {
        avatarObj.Color = avatar[0];
        avatarObj.Letter = avatar[1];
        avatarObj.Inverse = avatar[2];
        //console.log('ExplodeAvatar avatarColor: ', avatarObj.Color);
        //console.log('ExplodeAvatar avatarLetter: ', avatarObj.Letter);
        //console.log('ExplodeAvatar avatarInverse: ', avatarObj.Inverse);
      }

      return avatarObj;
    };

    /**
     * RecordToModel converteert een MySQL record naar een model
     * Wordt gebruikt in initLoad en syncDown
     */
    dataFactoryHelper.RecordToModel = function (store, record) {

      //console.warn('dataFactoryHelper RecordToModel: ', store.storeId);
      //console.error(store.storeId + ' dataFactoryHelper RecordToModel  record: ', record);

      var model = new store.Model();

      //console.error(store.storeId + ' dataFactoryHelper RecordToModel new model: ', model);

      loDash.each(model, function (item, prop) {
        //if (store.storeId === 'poi' && item.type === 'object') {
          //console.error(store.storeId + ' dataFactoryHelper RecordToModel  item, value, prop: ', item.type, item.value, prop);
        //}
        model[prop].value = record[prop];

        if (item.type === 'boolean' || item.type === 'bool') {
          item.value = false;
          if (parseInt(record[prop], 10) === 1) {
            item.value = true;
          }
        }
        if (item.type === 'int' || item.type === 'integer') {
          item.value = parseInt(record[prop]);
        }
        if (item.type === 'float') {
          item.value = parseFloat(record[prop]);
        }
        if (item.type === 'object' || item.type === 'obj') {
          if (typeof record[prop] !== 'object' && record[prop] !== undefined && record[prop] !== null && record[prop] !== '') {
            item.value = JSON.parse(record[prop]);
          }
        }
        //if (store.storeId === 'poi' && item.type === 'object') {
          //console.error(store.storeId + ' dataFactoryHelper RecordToModel  item: ', item.type, item.value);
        //}
      });

      return model;
    };
    /**
     * ModelToRecid converteert een model naar parameters die toegevoegd worden aan een http request naar MySQL
     * Wordt gebruikt in syncUp
     */
    dataFactoryHelper.ModelToRecord = function (store, model, dirty) {

      //console.warn('dataFactoryHelper ModelToRecord: ', store.storeId);
      //console.warn('dataFactoryHelper ModelToRecord: ', model);

      if (dirty === undefined) {
        dirty = false;
      }

      var params = {};

      loDash.each(model, function (item, prop) {

        //console.log(store.storeId + ' dataFactoryHelper ModelToRecord model: prop, dirty, type, value: ', prop, item.dirty, item.type, item.value);

        if ((dirty && item.dirty) || !dirty) {

          //console.log(store.storeId + ' dataFactoryHelper ModelToRecord model: prop, type, value, dirty, item.dirty: ', prop, item.type, item.value, dirty, item.dirty);

          params[prop] = item.value;

          if (item.type === 'boolean' || item.type === 'bool') {
            var bool = '0';
            if (item.value === true) {
              bool = '1';
            }
            params[prop] = bool;
          }
          if (item.type === 'int' || item.type === 'integer') {
            params[prop] = parseInt(item.value);
          }
          if (item.type === 'float') {
            params[prop] = parseFloat(item.value);
          }
          if (item.type === 'object' || item.type === 'obj') {
            //console.log(store.storeId + ' dataFactoryHelper ModelToRecord item object: ', item.value);
            if (item.value !== undefined && item.value !== null) {
              //                        params[prop] = JSON.stringify(item.value).replace(/\\(.)/mg, "$1");
              params[prop] = JSON.stringify(item.value);
            }
          }
        }
      });
      //console.log(store.storeId + ' dataFactoryHelper return params: ', params);

      return params;
    };
    /**
     * StringToModel converteert een string naar een model
     * Wordt gebruikt om strings afkomstig uit readFS en getLocalStorage
     */
    dataFactoryHelper.StringToModel = function (store, string) {

      //console.warn('dataFactoryHelper StringToModel ' + store.storeId);

      string = string.replace(/"{/g, '{');
      string = string.replace(/\}"/g, '}');

      //console.log(' ');
      //console.log(store.storeId + ' StringToModel: ', string);

      var configParse = JSON.parse(string);

      //console.log(' ');
      //console.log(store.storeId + ' dataFactoryHelper.StringToModel input configParse: ', configParse);

      var model = new store.Model();

      loDash.each(model, function (item, prop) {

        //console.log(store.storeId + ' dataFactoryHelper StringToModel  item: ', item);
        //console.log(store.storeId + ' dataFactoryHelper StringToModel  prop, type, value: ', prop, item.type, configParse[prop]);
        //console.log(store.storeId + ' dataFactoryHelper StringToModel  type configParse[prop]: ', typeof configParse[prop]);

        item.value = configParse[prop];

        if (item.type === 'boolean' || item.type === 'bool') {
          item.value = false;
          if (parseInt(configParse[prop], 10) === 1) {
            item.value = true;
          }
        }
        if (item.type === 'int' || item.type === 'integer') {
          item.value = parseInt(configParse[prop]);
        }
        if (item.type === 'float') {
          item.value = parseFloat(configParse[prop]);
        }
        if (item.type === 'object' || item.type === 'obj') {
          if (typeof configParse[prop] !== 'object' && configParse[prop] !== undefined && configParse[prop] !== null && configParse[prop] !== '') {
            item.value = JSON.parse(configParse[prop]);
          }
        }

        //console.log(store.storeId + ' dataFactoryHelper.StringToModel result model: ', model);


      });

      //console.log(store.storeId + ' dataFactoryHelper.StringToModel result model: ', model);
      //console.log(store.storeId + ' dataFactoryHelper.StringToModel result model: ', JSON.stringify(model));

      return model;
    };
    /**
     * ModelToString converteert een model naar een string.
     * Wordt gebruikt om modellen op te slaan in FS of LS
     */
    dataFactoryHelper.ModelToString = function (store, model) {

      //console.warn('dataFactoryHelper ModelToString: ', store.storeId);

      var model_tmp = {};

      angular.copy(model, model_tmp);

      loDash.each(model_tmp, function (item, prop) {
        //console.log(store.storeId + ' dataFactoryHelper ModelToString  prop, dirty, type, value: ', prop, item.dirty, item.type, item.value);
        if (item.type === 'boolean' || item.type === 'bool') {
          if (model_tmp[prop].value === true) {
            model_tmp[prop].value = '1';
          }
          if (model_tmp[prop].value === false) {
            model_tmp[prop].value = '0';
          }
        }
      });
      var newString = JSON.stringify(loDash.mapValues(model_tmp, 'value'));

      //console.log(store.storeId + ' dataFactoryHelper.ModelToString result string: ', newString);
      if (newString === '') {
        //console.error('ModelToSTring empty result');
      }
      return newString;
    };

    return dataFactoryHelper;
  }
]);
