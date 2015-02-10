(function(module){

    var directive = function() {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                key: '='
            },
            controller: 'key.panel.controller',
            templateUrl: '/templates/keys/key_panel'
        };

    };

    module.directive('keyPanel', directive)

})(angular.module('ssAuth'));
