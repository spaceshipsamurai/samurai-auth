angular.module('ssAuth').factory('UserService', ['$http', '$cookies', '$q', function($http, $cookies, $q){

    var fetchUser = function(){

        var deferred = $q.defer();

        $http.get('/api/user').success(function(user){

            currentUser.email = user.email;
            currentUser.character = user.character;

            deferred.resolve(user);
        });

        return deferred.promise;

    };

    var loadUserFromCookie = function() {

        var cookie = $cookies['ag-user'];

        if(!cookie)
            return;

        var user = JSON.parse(cookie);

        currentUser.email = user.email;
        currentUser.character = user.character;

    };

    var currentUser = {
        lastUpdated: undefined
    };

    var isAuthenticated = function() {
        return currentUser != undefined;
    };

    return {
        isAuthenticated: isAuthenticated(),
        loadUserFromCookie: loadUserFromCookie,
        CurrentUser: currentUser,
        fetchUser: fetchUser
    };
}]);