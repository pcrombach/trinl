'use strict';

// eslint-disable-next-line no-undef
trinl.controller('ProfielCtrl', ['$scope', '$ionicSideMenuDelegate',
  function ($scope, $ionicSideMenuDelegate) {

    $scope.$watch(function () {
      return $ionicSideMenuDelegate.isOpenLeft();
    },
    function (isOpen) {
      if (isOpen) {
        $scope.toggleHideSnelMenu();
      }
    });


  }
]);
