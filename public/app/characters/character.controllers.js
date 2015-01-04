(function(module){

    var characterController = function($scope, $http) {

        $http.get('/api/characters').success(function(data){
            $scope.characters = data;
        });

    };

    var panelController = function($scope, $http, SessionService) {

        var user = {};

        var refreshUser = function(){
            SessionService.getCurrentUser(true).then(function(u){
                user = u;
            });
        };

        refreshUser();

        $scope.setAsPrimary = function(character) {
            $http.put('/api/characters/primary/' + character._id, {}).success(function(){
                refreshUser();
            });
        };

        $scope.isPrimary = function(character) {
            if(!user || !user.primary) return false;
            return user.primary._id === character._id;
        }
    };

    module.controller('character.controller', ['$scope', '$http', characterController]);
    module.controller('character.panel.controller', ['$scope', '$http', 'SessionService', panelController])

})(angular.module('ssAuth'));

