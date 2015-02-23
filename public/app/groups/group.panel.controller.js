(function(module){

    var user;

    var controller = function($scope, $http, SessionService) {

        var group;

        group = $scope.group;
        group.view = 'info';

        SessionService.getCurrentUser().then(function(currentUser){
            user = currentUser;

            console.log('Group: ' + group.name);
            console.log('Owner:' + group.owner._id);
            console.log('User: ' + user._id);

        });

        var isManager = function() {
            if(!user || !group.managers) return false;
            return group.managers.indexOf(user._id) > -1;
        };

        var isOwner = function() {
            if(!user || !user.groups) return false;
            return group.owner._id === user._id;
        };

        $scope.isGroupAdmin = function(){
            if(!user || !user.groups) return false;
            return (user.isAdmin()|| isManager() || isOwner());
        };

        $scope.isOwner = isOwner();
        $scope.isAdmin = function(){
            return user && user.isAdmin();
        };


        $scope.applyToGroup = function(group) {

            $http.post('/api/groups/'+group._id+'/apply', {}).success(function(){

                alert('Application Submitted');
                SessionService.getCurrentUser(true).then(function(currentUser){
                    user = currentUser;
                });

            }).error(function(){
                alert('Error applying to group, try later');
            });

        };

        $scope.userIsMember = function() {
            return user && (user.groups[group.name] || user.pending[group.name]);
        };

        $scope.viewInfo = function(group) {
            group.view = 'info';
        };

        $scope.viewMembers = function(group) {
            group.view = 'members';

            $http.get('/api/groups/' + group._id + '/members').success(function(data){
                group.members = data;
            });
        };

        $scope.viewAdmin = function(group) {
            group.view = 'admin';
        };

        $scope.getGroupMemberFilter = function(group){

            if(group.statusFilter === 'All')
                return {};

            return { status: group.statusFilter };
        };

        $scope.approveMember = function(group, member){

            $http.post('/api/groups/' + group._id + '/members/' + member.user._id + '/approve', {})
                .success(function(){
                    member.status = 'Member';
                }).error(function(err){
                    alert(err);
                });

        };

        $scope.removeMember = function(member) {
            $http.delete('/api/groups/' + group._id + '/members/' + member.user._id).success(function() {
                for(var x = 0; x < group.members.length; x++){
                    if(group.members[x]._id === member._id) group.members.splice(x, 1);
                }
            }).error(function(err){
                alert('error removing character:  ' + err);
            });
        }

        $scope.delete = function(group) {
            $http.delete('/api/groups/' + group._id).success(function(){
                delete $scope.group;
            }).error(function(err){
                alert(err);
            });
        };

    };

    module.controller('group.panel.controller', ['$scope', '$http', 'SessionService', controller]);

})(angular.module('ssAuth'));