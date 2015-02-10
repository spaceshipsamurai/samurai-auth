(function(module){

    module.config(['$stateProvider', function($stateProvider){

        $stateProvider.state('keys', {
            url: '/keys',
            controller: 'keys.controller',
            templateUrl: '/templates/keys/list'
        });

    }]);

}(angular.module('ssAuth')));