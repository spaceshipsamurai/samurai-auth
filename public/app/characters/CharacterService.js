angular.module('ssAuth').factory('CharacterService', ['$http', '$q', function($http, $q){

    var getByUserId = function() {

        var deferred = $q.defer();

        $http.get('/api/characters').success(function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;

    };

    var updatePrimaryCharacter = function(id) {

        var deferred = $q.defer();

        $http.put('/api/characters/primary/' + id).success(function() {
            deferred.resolve();
        });

        return deferred.promise;

    };

    return {
        getByUserId: getByUserId,
        updatePrimaryCharacter: updatePrimaryCharacter
    }

}]);