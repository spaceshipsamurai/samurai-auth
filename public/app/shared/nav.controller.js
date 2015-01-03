angular.module('app.navigation', [ 'ui.router' ]).controller('NavCtrl', ['$scope', '$state', 'SessionService', function($scope, $state, SessionService) {

    var currentState = '', user;

    SessionService.getCurrentUser().then(function(currentUser){
        user = currentUser;
    });

    $scope.isAdmin = function() {
        if(!user) return false;
        return user.isAdmin();
    };

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
}]);
