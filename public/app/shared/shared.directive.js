(function(module){

    //for custom options
    var options = {
        width: '100%'
    };

    module.directive('slimScroll', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.slimScroll));
                angular.element(element).slimScroll(opts);
            }
        };
    });



})(angular.module('ssAuth'));
