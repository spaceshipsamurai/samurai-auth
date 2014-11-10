angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('recruitment', {
        url: '/recruitement',
        abstract: true,
        controller: 'recruitment.controller',
        templateUrl: 'templates/recruitment/layout'
    }).state('recruitment.list', {
        url: '/',
        views: {
            'content@recruitment': {
                templateUrl: '/templates/recruitment/list'
            }
        }
    }).state('recruitment.add', {
        url: '/add',
        views: {
            'content@recruitment': {
                templateUrl: '/templates/recruitment/add'
            }
        }
    });

}]);