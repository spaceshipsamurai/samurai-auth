(function(module){

    var groupController = function($scope, $location, $http, $filter) {

        $http.get('/api/groups').success(function(data){
            $scope.groups = data;
        });

    };

    var adminController = function($scope, $location, $http, $filter) {

        var order = $filter('orderBy');

        var refreshGroups = function() {
            $http.get('/api/groups').success(function(data){

                var groups = data;

                for(var x = 0; x < groups.length; x++)
                    groups[x].statusFilter = 'All';

                $scope.groups = order(groups, 'name', false);

            });
        };

        refreshGroups();

        $http.get('/api/characters/primary').success(function(data){
            $scope.primaries = data;
        });

        $scope.save = function(group) {
            $http.post('/api/groups', group).success(function(){
                refreshGroups()
            }).error(function(err){
                alert(err);
            });
        };
    };

    module.controller('group.admin.controller', ['$scope', '$location', '$http', '$filter', adminController]);
    module.controller('group.controller', ['$scope', '$location', '$http', '$filter', groupController])

})(angular.module('ssAuth'));

