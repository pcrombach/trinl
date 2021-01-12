'use strict';

  trinl.directive('myRadio', ['ionRadioDirective', function (ionRadioDirective) {
  return angular.extend({}, ionRadioDirective[0], {
    template:'<label class="item item-radio">' +
    '<input type="radio" name="radio-group">' +
    '<div class="item-content disable-pointer-events" ng-transclude></div>' +
    '<i class="radio-icon disable-pointer-events icon ion-ios7-information-outline"></i>' +
    '</label>'
  });
}]);