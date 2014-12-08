(function(module){

    var createManagersList = function(managers) {

        if(!managers || managers.length < 1) return '';

        var names = managers[0].name;

        for(var x = 1; x < managers.length; x++)
        {
            names += ', ' + managers[x].name;
        }

        return names;

    };

    var adminController = function($scope, $location, $http) {

        $http.get('/api/admin/groups').success(function(data){

            var groups = data;

            for(var x = 0; x < groups.length; x++)
                groups[x].statusFilter = 'All';

            $scope.groups = groups;
        });

        $scope.viewInfo = function(group) {
            group.view = 'info';
        };

        $scope.viewMembers = function(group) {
            group.view = 'members';

            $http.get('/api/admin/groups/' + group._id + '/members').success(function(data){
                group.members = data;
            });
        };

        $scope.getGroupFilter = function(group){

            if(group.statusFilter === 'All')
                return {};

            return { status: group.statusFilter };
        };

        $scope.approveMember = function(group, member){

            $http.post('/api/admin/groups/' + group._id + '/members/' + member.id + '/approve', {})
                .success(function(){
                    member.status = 'Member';
                }).error(function(err){
                    alert(err);
                });

        };

        $scope.createManagersList = createManagersList;
    };

    module.controller('group.admin.controller', ['$scope', '$location', '$http', adminController]);

})(angular.module('ssAuth'));

