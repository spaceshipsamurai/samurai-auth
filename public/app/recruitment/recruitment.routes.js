angular.module('ssAuth').config(['$locationProvider', '$stateProvider', function($locationProvider, $stateProvider) {

    $stateProvider.state('recruitment', {
        url: '/recruitement',
        abstract: true,
        controller: 'recruitment.controller',
        templateUrl: '/templates/recruitment/layout',
        resolve: {
            recruits: function(){
                return [];
            }
        }
    }).state('recruitment.list', {
        url: '/',
        views: {
            'content@recruitment': {
                templateUrl: '/templates/recruitment/list'
            }
        },
        resolve: {
            recruits: ['$http', function($http) {
                return $http.get('/api/recruitment');
            }]
        }
    }).state('recruitment.add', {
        url: '/add',
        views: {
            'content@recruitment': {
                templateUrl: '/templates/recruitment/add'
            }
        }
    }).state('recruitment.mail', {
        url: '/mail',
        views: {
            'content@recruitment': {
                templateUrl: '/templates/recruitment/mail'
            }
        }
    });

}]);