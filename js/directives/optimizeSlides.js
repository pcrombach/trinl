'use strict';

trinl.directive('optimizeSlides', function () {
    return {
      link: function (scope, elem, attrs) {
        scope.$watch(function () {
          return scope.$eval(attrs.activeSlide);
        }, function (val) {
          var array = [scope.$eval(attrs.activeSlide), scope.$eval(attrs.activeSlide) + 1, scope.$eval(attrs.activeSlide) - 1];
          for (var i = 0, len = scope.$eval(attrs.optimizeSlides).length; i < len; i++) {
            if (array.indexOf(i)>-1) {
              scope.$eval(attrs.optimizeSlides)[i].show = true;
            } else {
              scope.$eval(attrs.optimizeSlides)[i].show = false;
            }
          }
        });
      }
    };
  });