angular.module('app.navigation', [ 'ui.router' ]).controller('NavCtrl', ['$scope', '$state', 'SessionService', '$http', function($scope, $state, SessionService, $http) {

    var currentState = '', user;

    $scope.$watch(SessionService.userUpdated, function(){
        SessionService.getCurrentUser().then(function(current){

            user = current;
            console.log('nav:user:change');

            if(!user.primary)
            {
                $scope.user = {
                    image: '/images/samurai-vader.jpg',
                    name: 'New User',
                    altText: 'Select a primary'
                }
            } else {
                $scope.user = {
                    name: current.primary.name,
                    image: 'http://image.eveonline.com/Character/' + user.primary.id +'_32.jpg',
                    altText: current.primary.alliance.name
                }
            }

        })
    });

    SessionService.getCurrentUser(true);

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
