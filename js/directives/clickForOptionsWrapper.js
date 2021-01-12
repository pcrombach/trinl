trinl.directive('clickForOptionsWrapper', [function () {
    return {
        restrict: 'A',
        controller: function ($scope) {
            this.closeOptions = function () {
                $scope.$broadcast('closeOptions');
            };
        }
    };
}]);