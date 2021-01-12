'use strict';

trinl.directive('isFocused', function ($timeout) {
  return {
    scope: { trigger: '&isFocused' },
    link: function(scope, element) {
        if(scope.trigger()) {
          $timeout(function() {
            element[0].focus();
            element[0].click();
          });
        }
    }
  };
});