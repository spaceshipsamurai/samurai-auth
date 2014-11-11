angular.module('ssAuth').controller('NavCtrl', ['$scope', '$state', function($scope, $state) {

    $scope.stateActive = function(stateName) {
            console.log($state.includes(stateName));
            return stateName === $state.includes(stateName);
    };

}]);
