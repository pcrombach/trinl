/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var trinl = angular.module('trinl', ['ngSanitize', 'ionic', 'monospaced.elastic', 'templates', 'ngCordova', 'angular-momentjs', 'angularMoment'],
  function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
  })
  .filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  })
  .filter('html', ['$sce', function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }])
  .filter('regexStore', ['loDash', function (loDash) {

    //console.log('regexStore');

    return function (input, field, regex) {
      //console.log('regex input: ', input);
      //console.log('regex field: ', field);
      var out, patt;
      if (input !== null) {
        patt = new RegExp(regex);
        //console.log('regex regex patt: ', patt);
        out = [];
        loDash.each(input, function (model) {
          //console.log('regex value in model: ', model[field]);
          if (patt.test(model.get([field]))) {
            out.push(model);
          }
        });
        return out;
      }
    };
  }])
  .filter('regexStoreBegin', ['loDash', function (loDash) {

    //console.error('regexStoreBegin');

    return function (input, field, regex) {
      var out, patt;
      if (input !== null && regex !== null) {
        //console.log('regex input: ', input);
        //console.log('regex field: ', field);
        //console.log('regex regex: ', regex);
        regex = '^' + regex;
        patt = new RegExp(regex, 'i');
        //console.log('regex regex patt: ', patt);
        out = [];
        loDash.each(input, function (model) {
          //console.log('regex value in model: ', model[field]);
          if (patt.test(model.get([field]))) {
            out.push(model);
          }
        });
        return out;
      }
    };
  }]);

