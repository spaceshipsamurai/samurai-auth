angular.module('ssAuth', ['ngRoute', 'ui.router', 'ngCookies', 'app.navigation']);
angular.module('ssAuth').config(['$locationProvider', '$stateProvider', '$httpProvider', function($locationProvider, $stateProvider, $httpProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider.state('dashboard', {
        url: '/',
        templateUrl: '/templates/dashboard/index',
        controller: 'HomeCtrl'
    }).state('keys', {
        url: '/keys',
        templateUrl: '/templates/keys/list',
        controller: 'KeyCtrl'
    }).state('services', {
        url: '/services',
        templateUrl: '/templates/services/list',
        controller: 'ServicesCtrl'
    });

    var unauthorizedInterceptor = ['$location', '$q', function($location, $q) {

        function success(response){

            return response;
        }

        function error(response) {
            console.log(response.status);
            if(response.status === 401){
                $location.path('/login');

                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }

    }];

    $httpProvider.responseInterceptors.push(unauthorizedInterceptor);

}]);

angular.module('ssAuth').run(function($rootScope, $state, SessionService){

    $rootScope.currentUser = SessionService.restore();

    $rootScope.isMemberOf = function(group) {
        if(!$rootScope.currentUser.groups) return false;

        return $rootScope.currentUser.groups[group];
    };

    $rootScope.$on('$stateChangeStart',
        function(){
            SessionService.getCurrentUser().then(function(user){
                $rootScope.currentUser = user;
            });
    });


});
