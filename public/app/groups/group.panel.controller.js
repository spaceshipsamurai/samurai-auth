(function(module){

    var controller = function($scope, SessionService) {

        var group = $scope.group;
        SessionService.getCurrentUser().then(function(currentUser){

            if(currentUser.groups[group.name])
            {
                var existingCharacters = currentUser.groups[group.name].characters;
                var existingIds = [];

                for(var x = 0; x < existingCharacters.length; x++)
                {
                    existingIds.push(existingCharacters[x].id);
                }

                var available = [];

                for(var x = 0; x < currentUser.characters.length; x++)
                {
                    if(existingIds.indexOf(currentUser.characters[x].id) === -1)
                        available.push(currentUser.characters[x]);
                }

                $scope.hasMembers =  currentUser.groups[group.name] !== undefined;
                $scope.memberCharacters = currentUser.groups[group.name].characters;
                $scope.availableCharacters = available;

            }
            else {
                $scope.availableCharacters = currentUser.characters;
            }




        });

    };

    module.controller('group.panel.controller', ['$scope', 'SessionService', controller]);

})(angular.module('ssAuth'));