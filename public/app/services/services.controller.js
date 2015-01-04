angular.module('ssAuth').controller('services.controller', ['CharacterService', 'SessionService', '$scope', '$http',  function(CharacterService, SessionService, $scope, $http){

    SessionService.getCurrentUser(true).then(function(user){
         $scope.services = user.services || {};
    });

    CharacterService.getByUserId().then(function(characters){
        $scope.characters = characters;
    });

    $scope.setForumUser = function(character) {
        $http.post('/api/services/forum/user', { cid: character.id, cname: character.name })
            .success(function(){
                SessionService.getCurrentUser(true).then(function(user){
                    $scope.services = user.services || {};
                });
            }).error(function(data){
                alert(data);
            });
    };

    $scope.setJabberUser = function(character) {
        $http.post('/api/services/jabber/user', { character: character._id })
            .success(function(){
                SessionService.getCurrentUser(true).then(function(user){
                    $scope.services = user.services || {};
                });
            }).error(function(data){
                alert(data);
            })
    };

    $scope.updateJabberPassword = function(password) {

        $http.put('/api/services/jabber/user/password', { password: password}).success(function(){
            alert('updated');
        }).error(function(err){
            alert(err);
        });

    };

    $scope.setPrimary = function(characterId) {
        CharacterService.updatePrimaryCharacter(characterId).then(function(){
            SessionService.getCurrentUser(true).then(function(user){
                $scope.primaryCharacter = user.character;
            });
        });
    };
}]);