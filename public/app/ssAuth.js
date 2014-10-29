angular.module('ssAuth', ['ngRoute', 'ui.router', 'ngCookies']);
angular.module('ssAuth').config(['$locationProvider', '$stateProvider', '$httpProvider', function($locationProvider, $stateProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider.state('dashboard', {
        url: '/',
        templateUrl: 'templates/dashboard/index',
        controller: 'HomeCtrl',
        access: { requiresAuth: true }
    }).state('keys', {
        url: '/keys',
        templateUrl: 'templates/keys/list',
        controller: 'KeyCtrl',
        access: { requiresAuth: true }
    }).state('services', {
        url: '/services',
        templateUrl: 'templates/services/list',
        controller: 'ServicesCtrl',
        access: { requiresAuth: true }
    });

    var unauthorizedInterceptor = ['$location', '$q', function($location, $q) {

        function success(response){

            return response;
        }

        function error(response) {

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

angular.module('ssAuth').run(function($rootScope, $state, UserService, $location){

    UserService.loadUserFromCookie();

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

       if((toState.access && toState.access.requiresAuth) && !UserService.isAuthenticated)
       {
           //e.preventDefault();
           //console.log('NOT AUTHORIZED');
           //window.location = '/login'
       }
    });
});
