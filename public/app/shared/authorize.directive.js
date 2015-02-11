(function(module){

    module.directive('authorize', ['SessionService', function(SessionService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // instance-specific options
                var groups = scope.$eval(attrs.authorize);
                var hasGroup = false;

                scope.$watch(SessionService.userUpdated, function(){

                    SessionService.getCurrentUser().then(function(user){

                        for(var x = 0; x < groups.length; x++) {
                            if(user.groups && user.groups[groups[x]]) hasGroup = true;
                        }

                        if(!hasGroup) {
                            angular.element(element).toggle(false);
                        }

                    });

                });


            }
        };
    }]);



})(angular.module('ssAuth'));
