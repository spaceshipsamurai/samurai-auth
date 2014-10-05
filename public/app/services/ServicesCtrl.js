angular.module('ssAuth').controller('ServicesCtrl', ['CharacterService', 'UserService', '$scope', function(CharacterService, UserService, $scope){

    $scope.primaryCharacter = UserService.CurrentUser.character;

    CharacterService.getByUserId().then(function(characters){
        $scope.characters = characters;
    });

    $scope.setPrimary = function(characterId) {
        CharacterService.updatePrimaryCharacter(characterId).then(function(){
            UserService.fetchUser().then(function(user){
                $scope.primaryCharacter = user.character;
            });
        });
    };
}]);