(function(module){

    module.filter('boolYesNo', function(){
        return function(value) {
            if(value === undefined) return 'Undefined';
            return value ? 'Yes' : 'No';
        };
    });

})(angular.module('ssAuth'));
