angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('recruitment', {
        url: '/recruitement',
        templateUrl: 'templates/recruitment/index',
        controller: 'recruitment.controller'
    })

}]);