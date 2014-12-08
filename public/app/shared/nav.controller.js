angular.module('app.navigation', [ 'ui.router' ]).controller('NavCtrl', ['$scope', '$state', function($scope, $state) {

    var currentState = '';

    this.setActive = function(isActive, state) {

        if(currentState !== state)
        {
            $scope.active = isActive;
            currentState = state;
        }
        else if(isActive)
        {
            $scope.active = true;
        }
    };
}])
.config(['$stateProvider', function($stateProvider){



}]);
