(function(module){

    //for custom options
    var options = {
        width: '100%'
    };

    module.directive('selectTwo', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.selectTwo));
                angular.element(element).select2(opts);
            }
        };
    });



})(angular.module('ssAuth'));
