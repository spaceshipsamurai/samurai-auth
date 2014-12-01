angular.module('ssAuth').controller('KeyCtrl', ['$scope', 'KeyService', function($scope, KeyService) {

    var updateKeys = function(){
        KeyService.getKeys().then(function(keys){
            $scope.keys = keys;
        });
    };

    updateKeys();

    $scope.save = function() {
        KeyService.save($scope.newKey).then(function(){
            updateKeys();
            $scope.newKey = undefined;
            $scope.error = undefined;
        }).catch(function(err){
            $scope.error = err;
        });
    };

    $scope.deleteKey = function(id) {
        if(confirm('Are you sure you want to delete this key?')) {
            KeyService.remove(id).then(function(){
                updateKeys();
            });
        }
    };

    $scope.characterImage = function(characterId, size) {
        return '//image.eveonline.com/Character/' + characterId + '_' + size + '.jpg';
    };

}]);
