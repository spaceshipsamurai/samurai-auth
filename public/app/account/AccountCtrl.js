angular.module('ssAuth').controller('AccountCtrl', ['$scope', '$location',
                                                    '$http', '$routeParams', '$window',
                                                    function($scope, $location, $http, $routeParams, $window) {

    $scope.registrationComplete = function() {
        return $location.search('rc') || false;
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
            $scope.errors = ["Passwords do not match"];
            return;
        }

        $http.post('/account/register', {
            email: $scope.email,
            password: $scope.password
        }).success(function() {
            $location.path('/login').search('rc', 'true');
        }).error(function(res) {
            var errors = res.errors;
            console.log(errors);
            $scope.errors = errors || ["Invalid Registration Information"];
        });;
    };

    $scope.clearError = function() {
        delete $scope.errors;
    };

}]);