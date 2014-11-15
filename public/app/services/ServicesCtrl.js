angular.module('ssAuth').controller('ServicesCtrl', ['CharacterService', 'SessionService', '$scope', function(CharacterService, SessionService, $scope){

    SessionService.getCurrentUser().then(function(user){
        if(user.character && user.character.id)
            $scope.primaryCharacter = user.character;
        else
            $scope.primaryCharacter = undefined;
    });

    CharacterService.getByUserId().then(function(characters){
        $scope.characters = characters;
    });

    $scope.setPrimary = function(characterId) {
        CharacterService.updatePrimaryCharacter(characterId).then(function(){
            SessionService.getCurrentUser(true).then(function(user){
                $scope.primaryCharacter = user.character;
            });
        });
    };
}]);