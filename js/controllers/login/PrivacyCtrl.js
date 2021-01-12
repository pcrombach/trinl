'use strict';

trinl.controller('PrivacyCtrl', ['$timeout', 'dataFactoryConfig',
  function ( $timeout, dataFactoryConfig) {

    $timeout(function () {

      if (dataFactoryConfig.currentModel.Id) {

        //console.log('DisclaimerCtrl dataFactoryConfig.currentModel: ', dataFactoryConfig.currentModel);

      } else {
        //console.error('DisclaimerCtrl recordFind config ERROR');

      }
    }, 1500);

  }]);