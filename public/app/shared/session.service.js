angular.module('ssAuth').factory('SessionService', ['$http', '$cookies', '$q', function($http, $cookies, $q){

    var currentUser = {};

    currentUser.isAdmin = function() {
        if(!currentUser || !currentUser.groups || !currentUser.groups['Admins']) return false;
        return true;
    };

    var getCurrentUser = function(forceUpdate) {

        var deferred = $q.defer();

        if(forceUpdate)
        {
            return fetchUpdatedUser();
        }

        if(currentUser.lastUpdated)
        {
            var diffMS = (new Date()).getTime() - new Date(currentUser.lastUpdated).getTime();
            var diffMin = ((diffMS/60)/60);


            if(diffMin < 5)
            {
                deferred.resolve(currentUser);
                return deferred.promise;
            }
        }

        return fetchUpdatedUser();
    };

    var restoreFromCookie = function() {

        var cookie = $cookies['ag-user'];

        if(!cookie)
            return;

        var user = JSON.parse(cookie);

        angular.extend(currentUser, user);

        return currentUser;
    };

    var saveToCookie = function() {
        $cookies['ag-user'] = JSON.stringify(currentUser);
    };

    var fetchUpdatedUser = function() {

        var deferred = $q.defer();

        $http.get('/session').success(function(user){
            angular.extend(currentUser, user);
            currentUser.lastUpdated = new Date();
            saveToCookie();
            deferred.resolve(currentUser);
        });

        return deferred.promise;

    };

    return {
        getCurrentUser: getCurrentUser,
        restore: restoreFromCookie
    };

}]);