(function(module){

    var user;

    var controller = function($scope, $http, SessionService) {

        var group;

        group = $scope.group;
        group.view = 'info';

        SessionService.getCurrentUser().then(function(currentUser){
            user = currentUser;
        });

        var isManager = function() {
            var members = $scope.getUserMembers();

            for(var x = 0; x < members.length; x++)
            {
                for(var y = 0; y < group.managers.length; y++)
                {
                    if(group[y].id === members[x].id) return true;
                }
            }
        };

        var isOwner = function() {
            if(!user || !user.groups) return false;
            var members = $scope.getUserMembers();

            for(var x = 0; x < members.length; x++)
            {
                if(group.owner && group.owner.id === members[x].id) return true;
            }
        };

        $scope.hasMembers = function() {
            if(!user || !user.groups) return false;
            return user.groups[group.name] !== undefined;
        };

        $scope.getUserMembers = function() {
            if(!user || !user.groups || !user.groups[group.name]) return [];
            return user.groups[group.name].characters;
        };

        $scope.getAvailableCharacters = function() {
            if(!user || !user.groups) return [];
            if(!user.groups[group.name]) return user.characters;

            var existingCharacters = user.groups[group.name].characters;
            var existingIds = [];

            for(var x = 0; x < existingCharacters.length; x++)
            {
                existingIds.push(existingCharacters[x].id);
            }

            var available = [];

            for(var x = 0; x < user.characters.length; x++)
            {
                if(existingIds.indexOf(user.characters[x].id) === -1)
                    available.push(user.characters[x]);
            }

            return available;
        };

        $scope.isGroupAdmin = function(){
            if(!user || !user.groups) return false;
            return (user.isAdmin()|| isManager() || isOwner());
        };

        $scope.isOwner = isOwner();

        $scope.applyToGroup = function(character) {

            $http.post('/api/groups/'+group._id+'/apply', { id: character.id, name: character.name }).success(function(){

                if(!user.groups[group.name]) {
                    group.characters = [];
                    user.groups[group.name] = group;
                }

                character.status = 'Pending';
                user.groups[group.name].characters.push(character);

            }).error(function(){
                alert('Error applying to group, try later');
            });

        };

        $scope.userIsMember = function() {
            return user.groups[group.name] !== undefined;
        };

        $scope.viewInfo = function(group) {
            group.view = 'info';
        };

        $scope.viewMembers = function(group) {
            group.view = 'members';

            $http.get('/api/admin/groups/' + group._id + '/members').success(function(data){
                group.members = data;
            });
        };

        $scope.getGroupMemberFilter = function(group){

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

        $scope.removeMember = function(member) {
            $http.delete('/api/admin/groups/' + group._id + '/members/' + member.id).success(function() {
                for(var x = 0; x < group.members.length; x++){
                    if(group.members[x].id === member.id) group.members.splice(x, 1);
                }
            }).error(function(err){
                alert('error removing character:  ' + err);
            });
        }

    };

    module.controller('group.panel.controller', ['$scope', '$http', 'SessionService', controller]);

})(angular.module('ssAuth'));