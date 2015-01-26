(function(module){

    var allianceController = function($scope, $location, $http, $filter) {

        $scope.filter = 'Alliance';

        $http.get('/api/alliances').success(function(data){
            $scope.allAlliances = data;
        });

        $http.get('/api/alliances/affiliated').success(function(data){
            $scope.alliances = data;
        });

        $scope.addAlliance = function(id) {

            $http.get('/api/alliances/' + id).success(function(data){
                data.editing = true;
                $scope.alliances.push(data);
            });

        };

        $scope.edit = function(alliance) {

            var original = {};
            angular.copy(alliance, original);

            alliance.original = original;
            alliance.editing = true;
        };

        $scope.save = function(alliance) {

            $http.put('/api/alliances/' + alliance.id, alliance).success(function(saved){
                angular.copy(saved, alliance);
                delete alliance.original;
                delete alliance.editing;
            }).error(function(err){
                alert('Error updating alliance');
            });

        };

        $scope.cancel = function(alliance) {
            angular.copy(alliance.original, alliance);
            delete alliance.original;
            delete alliance.editing;
        };

    };

    var corporationController = function($scope, $location, $http, $filter) {

        $scope.filter = 'Alliance';

        $http.get('/api/alliances/affiliated').success(function(data){
            $scope.groups = data;
        });

    };

    module.controller('entities.alliances.controller', ['$scope', '$location', '$http', '$filter', allianceController]);
    module.controller('entities.corporations.controller', ['$scope', '$location', '$http', '$filter', corporationController]);

})(angular.module('ssAuth'));

