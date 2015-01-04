(function(module){

    var directive = function() {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                character: '='
            },
            controller: 'character.panel.controller',
            link: function(scope, element, attrs) {
            },
            templateUrl: '/templates/characters/character-panel'
        };

    };

    module.directive('characterPanel', directive)

})(angular.module('ssAuth'));
