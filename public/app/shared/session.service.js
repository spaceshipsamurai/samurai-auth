angular.module('ssAuth').factory('SessionService', ['$http', '$cookies', '$q', function($http, $cookies, $q){

    var currentUser = {};

    var getCurrentUser = function(forceUpdate) {

        var deferred = $q.defer();

        if(forceUpdate)
        {
            return fetchUpdatedUser();
        }

        if(currentUser.lastUpdated)
        {
            var diffMS = (new Date()).getTime() - currentUser.lastUpdated.getTime();
            var diffMin = ((diffMS/60)/60);

            if(diffMin < 10)
            {
                return deferred.resolve(currentUser);
            }
        }

        return fetchUpdatedUser();
    };

    var restoreFromCookie = function() {

        var cookie = $cookies['ag-user'];

        if(!cookie)
            return;

        var user = JSON.parse(cookie);

        currentUser.email = user.email;
        currentUser.character = user.character;

        return currentUser;
    };

    var saveToCookie = function() {
        $cookies['ag-user'] = JSON.stringify(currentUser);
    };

    var fetchUpdatedUser = function() {

        var deferred = $q.defer();

        $http.get('/session').success(function(user){
            currentUser.email = user.email;
            currentUser.character = user.character;
            saveToCookie();
            deferred.resolve(user);
        });

        return deferred.promise;

    };

    return {
        getCurrentUser: getCurrentUser,
        restore: restoreFromCookie
    };

}]);