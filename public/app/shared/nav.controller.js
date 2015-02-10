angular.module('app.navigation', [ 'ui.router' ]).controller('NavCtrl', ['$scope', '$state', 'SessionService', '$http', function($scope, $state, SessionService, $http) {

    var currentState = '', user;

    SessionService.getCurrentUser().then(function(currentUser){
        user = currentUser;
    });

    $scope.setPrimary = function(character) {
        $http.put('/api/characters/primary/' + character._id, {}).success(function(){

            $scope.selecting = false;

            SessionService.getCurrentUser(true).then(function(currentUser){
                user = currentUser;
            });
        });
    };

    $scope.isAdmin = function() {
        if(!user) return false;
        return user.isAdmin();
    };

    $scope.isAuthorized = function() {
        if(!user) return false;
        if(!$scope.authorize) return true;

        var authorized = $scope.authorize;

        for(var x = 0; x < authorized.length; x++)
            if(user.groups && user.groups[authorized[x]] !== undefined) return true;

        return false;
    };

    $scope.getUserImage = function() {

        if(!user || !user.primary) return '/images/samurai-vader.jpg';

        return 'http://image.eveonline.com/Character/' + user.primary.id +'_32.jpg';

    };

    $scope.getUserName = function() {
        if(!user || !user.primary) return 'New User';

        return user.primary.name;
    };

    $scope.getUserAlt = function() {
        if(!user || !user.primary) return 'Select a character';
        return user.primary.alliance.name;
    };

    $scope.toggleSelect = function() {

        if($scope.selecting) return $scope.selecting = false;

        $http.get('/api/characters/affiliated').success(function(data){
            $scope.affiliated = data;
            $scope.selecting = true;
        });

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
