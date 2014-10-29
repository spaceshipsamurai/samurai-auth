angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login',
        controller: 'AccountCtrl'
    }).state('register', {
        url: '/register',
        templateUrl: 'templates/login',
        controller: 'AccountCtrl'
    });

}]);