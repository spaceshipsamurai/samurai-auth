angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('entities', {
        url: '/entities',
        abstract: true,
        templateUrl: '/templates/entities/index'
    }).state('entities.alliance', {
        url: '/alliances',
        templateUrl: '/templates/entities/alliances',
        controller: 'entities.alliances.controller'
    }).state('entities.corporation', {
        url: '/corporations',
        templateUrl: '/templates/entities/corporations',
        controller: 'entities.corporations.controller'
    });

}]);