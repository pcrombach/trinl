'use strict';

// eslint-disable-next-line no-undef
trinl.factory('loDash', ['$window', function ($window) {

  var _ = $window._;

  delete ($window._);

  return (_);
}]);

