'use strict';

// eslint-disable-next-line no-undef
trinl.controller('DisclaimerCtrl', ['$scope', '$timeout', 'dataFactoryConfig', 'dataFactoryConfigX',
  function ($scope, $timeout, dataFactoryConfig, dataFactoryConfigX) {

    var disclaimerConfirmed = {};

    $timeout(function () {

      if (dataFactoryConfig.currentModel.Id) {

        //console.log('DisclaimerCtrl dataFactoryConfig.currentModel: ', dataFactoryConfig.currentModel);

        disclaimerConfirmed.checked = dataFactoryConfig.currentModel.get('disclaimerConfirmed');
        //console.log('DislaimerCtrl disclaiemrConfirmed: ', disclaimerConfirmed.checked);
        $scope.disclaimer = disclaimerConfirmed.checked;
      } else {
        //console.error('DisclaimerCtrl recordFind config ERROR');

      }
    }, 1500);

    $scope.disclaimerConfirmedChange = function () {
      //console.warn('DiscaliemrCtrl disclaimerConfirmedChange');

      dataFactoryConfig.currentModel.set('disclaimerConfirmed', true);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      //console.log('DisclaimerCtrl dataFactoryConfig.currentModel update SUCCESS: ', dataFactoryConfig.currentModel);

    };


  }]);
