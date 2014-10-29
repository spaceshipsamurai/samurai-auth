angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('groups', {
        url: '/groups',
        abstract: true,
        templateUrl: 'templates/groups/layout',
        controller: 'group.controller'
    }).state('groups.list', {
        url: '/',
        views: {
            'content@groups': {
                templateUrl: 'templates/groups/list'
            }
        }
    });

}]);