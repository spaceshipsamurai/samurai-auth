(function(module){

    var groupController = function($scope, $location, $http, filterFilter) {

        var publicGroups;
        $scope.filter = 'All';

        $http.get('/api/groups').success(function(data){
            publicGroups = filterFilter(data, { isPrivate: false });
            $scope.groups = publicGroups;
        });

        $scope.filterGroups = function(filter) {
            $scope.filter = filter;

            if(filter === 'My Groups') $scope.groups = $scope.currentUser.groups;
            else if(filter === 'All') $scope.groups = publicGroups;

        };
    };

    var adminController = function($scope, $location, $http) {

        $http.get('/api/groups').success(function(data){
            var groups = data;

            for(var x = 0; x < groups.length; x++)
                groups[x].statusFilter = 'All';

            $scope.groups = groups;
        });

        $http.get('/api/characters/primary').success(function(data){
            $scope.primaries = data;
        });
    };

    module.controller('group.admin.controller', ['$scope', '$location', '$http', adminController]);
    module.controller('group.controller', ['$scope', '$location', '$http', 'filterFilter', groupController])

})(angular.module('ssAuth'));

