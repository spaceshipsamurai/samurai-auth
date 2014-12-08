angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('groupAdmin', {
        url: '/admin/groups',
        templateUrl: '/templates/groups/admin',
        controller: 'group.admin.controller'
    });

}]);