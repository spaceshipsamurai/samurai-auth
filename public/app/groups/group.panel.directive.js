(function(module){

    var directive = function() {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                group: '='
            },
            controller: 'group.panel.controller',
            link: function(scope, element, attrs) {

            },
            templateUrl: '/templates/groups/group_panel'
        };

    };

    module.directive('groupPanel', directive)

})(angular.module('ssAuth'));
