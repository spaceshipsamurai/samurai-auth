angular.module('ssAuth').controller('AccountCtrl', ['$scope', '$location',
                                                    '$http', '$routeParams', '$window',
                                                    function($scope, $location, $http, $routeParams, $window) {

    var redirect = $routeParams.cb;

    $scope.registrationComplete = function() {
        return $routeParams.rc || false;
    };

    $scope.isPath = function(path)
    {
        return path == $location.path();
    };

    $scope.login = function() {
        $http.post('/session', {
            email: $scope.email,
            password: $scope.password
        }).success(function() {
            $window.location.href = redirect || '/';
        }).error(function(data) {

            if(data.message)
                $scope.errorMessage = data.message;
            else
                $scope.errorMessage = "Invalid Username/Password";

        });
    };

    $scope.register = function() {

        if($scope.password != $scope.repeatPassword)
        {
            $scope.errorMessage = "Passwords do not match";
            return;
        }

        $http.post('/account/register', {
            email: $scope.email,
            password: $scope.password
        }).success(function() {
            console.log('registered');
            $location.path('/login').search('rc', 'true');
        }).error(function(res) {
            console.log(res);
            var msg = res.message;
            $scope.errorMessage = msg || "Invalid Registration Information";
        });;
    };

    $scope.clearError = function() {
        delete $scope.errorMessage;
    };

}]);