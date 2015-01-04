angular.module('ssAuth').config(['$locationProvider', '$stateProvider',  function($locationProvider, $stateProvider) {

    $stateProvider.state('characters', {
        url: '/characters',
        templateUrl: '/templates/characters/index',
        controller: 'character.controller'
    });

}]);