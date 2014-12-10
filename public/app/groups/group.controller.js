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

    var groupController = function($scope, $location, $http, filterFilter) {

        var publicGroups;
        $scope.filter = 'All';

        $http.get('/api/admin/groups').success(function(data){
            publicGroups = filterFilter(data, { isPrivate: false });
            $scope.groups = publicGroups;
        });

        $scope.filterGroups = function(filter) {
            $scope.filter = filter;

            if(filter === 'My Groups') $scope.groups = $scope.currentUser.groups;
            else if(filter === 'All') $scope.groups = publicGroups;

        };

        $scope.hasMembers = function(group) {
            return $scope.currentUser.groups[group.name] !== undefined;
        };

        $scope.getCharacters = function(group) {
            return $scope.currentUser.groups[group.name].characters;
        };

        $scope.getAvailableCharacters = function(group) {

            if($scope.currentUser.groups[group.name])
            {
                var existingCharacters = $scope.currentUser.groups[group.name].characters;
                var existingIds = [];

                for(var x = 0; x < existingCharacters.length; x++)
                {
                    existingIds.push(existingCharacters[x].id);
                }

                var available = [];

                for(var x = 0; x < $scope.currentUser.characters.length; x++)
                {
                    if(existingIds.indexOf($scope.currentUser.characters[x].id) === -1)
                        available.push($scope.currentUser.characters[x]);
                }

                return available;

            }

            return $scope.currentUser.characters;
        };

        $scope.applyToGroup = function(group, character) {

            $http.post('/api/groups/'+group._id+'/apply', { id: character.id, name: character.name }).success(function(){

                if(!$scope.currentUser.groups[group.name]) {
                    group.characters = [];
                    $scope.currentUser.groups[group.name] = group;
                }

                character.status = 'Pending';
                $scope.currentUser.groups[group.name].characters.push(character);

            }).error(function(){
                alert('Error applying to group, try later');
            });

        };

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
    module.controller('group.controller', ['$scope', '$location', '$http', 'filterFilter', groupController])

})(angular.module('ssAuth'));

