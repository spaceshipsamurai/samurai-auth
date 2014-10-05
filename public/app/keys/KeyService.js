angular.module('ssAuth').factory('KeyService', ['$http', '$q', 'UserService', function($http, $q, $userService){

    var getKeys = function() {

        var deferred = $q.defer();

        $http.get('/api/keys').success(function(data){
            deferred.resolve(data);
        });

        return deferred.promise;
    };

    var saveKey = function(key) {

        var deferred = $q.defer();

        $http.post('/api/keys', key).success(function(){
            deferred.resolve();
        });

        return deferred.promise;
    };

    var removeKey = function(keyId) {

        var deferred = $q.defer();

        $http.delete('/api/keys/' + keyId).success(function() {
            $userService.fetchUser();
            deferred.resolve();
        });

        return deferred.promise;

    };

    return {
        getKeys: getKeys,
        save: saveKey,
        remove: removeKey
    };
}]);