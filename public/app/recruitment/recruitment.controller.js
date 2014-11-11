angular.module('ssAuth').controller('recruitment.controller', ['$scope','$http', '$state', 'recruits', function($scope, $http, $state, recruits) {

    var currentMailRecruits = [];

    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.recruits', function (recruits) {
        $scope.recruits = recruits.data;
    });

    $scope.newRecruits = {};
    $scope.mailOptions = {
        count: 25,
        priority: 'older'
    };


    $scope.recruits = recruits.data;

    $scope.parse = function() {

        if(!$scope.newRecruits || !$scope.newRecruits.names)
            return;

        var names = $scope.newRecruits.names.split("\n");
        var location = $scope.newRecruits.location;


        $http.post('/api/recruitment/add', {
            names: names,
            location: location
        }).success(function(){
            $scope.newRecruits = {};
            $state.transitionTo('recruitment.list');
        });

    };

    $scope.updateMail = function() {

        var options = '?lock=true&limit=' + $scope.mailOptions.count + '&priority='+ $scope.mailOptions.priority;

        $http.get('/api/recruitment' + options).success(function(mailRecruits){

            currentMailRecruits = [];

            for(var x = 0; x < mailRecruits.length; x++)
                currentMailRecruits.push(mailRecruits[x].name);

            $scope.mailRecruits = currentMailRecruits.join(', ');
        });

    };

    $scope.sendMail = function() {

        $http.post('/api/recruitment/mail', { names: currentMailRecruits }).success(function(){
            delete $scope.mailRecruits;
            currentMailRecruits = [];
        });

    };


}]);
