angular.module('ssAuth').controller('ServicesCtrl', ['CharacterService', 'SessionService', '$scope', function(CharacterService, SessionService, $scope){

    SessionService.getCurrentUser().then(function(user){
        $scope.primaryCharacter = user.character;
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