'use strict';
/**
 * @class trinl.directives.closeoption
 * [description]
 * @requires $ionicGesture
 * @requires $ionicListDelegate
 * @return {Object} closeOption
 */
trinl.directive('closeOption', ['$ionicGesture', '$ionicListDelegate',
				function ($ionicGesture, $ionicListDelegate) {
  return {
    restrict :  'A',

    link : function(scope, elem) {
     $ionicGesture.on('touch', function(){
       $ionicListDelegate.closeOptionButtons();
     }, elem);

    }
  };
}]);