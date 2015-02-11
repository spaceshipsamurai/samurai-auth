angular.module('ssAuth').factory('KeyService', ['$http', '$q', 'SessionService', function($http, $q, SessionService){

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
        }).error(function(data){
            console.log('ERROR:' + JSON.stringify(data));
            deferred.reject(data.message);
        });

        return deferred.promise;
    };

    var updateKey = function(key) {

        var deferred = $q.defer();

        $http.put('/api/keys/' + key._id, { keyID: key.keyId, vCode: key.vCode }).success(function(data){
            SessionService.getCurrentUser(true);
            deferred.resolve(data);
        }).error(function(response, status){
            if(status === 400)
                deferred.reject(response);
        });

        return deferred.promise;
    };

    var removeKey = function(keyId) {

        var deferred = $q.defer();

        $http.delete('/api/keys/' + keyId).success(function() {
            deferred.resolve();
        });

        return deferred.promise;

    };

    return {
        getKeys: getKeys,
        save: saveKey,
        remove: removeKey,
        updateKey: updateKey
    };
}]);