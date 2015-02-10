(function(module){

    var keyController = function($scope, KeyService) {

        var updateKeys = function(){
            KeyService.getKeys().then(function(keys){
                console.log(keys);
                $scope.keys = keys;
            });
        };

        updateKeys();

        $scope.save = function(newKey) {

            console.log(newKey);

            KeyService.save(newKey).then(function(){
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

        $scope.shortVCode = function(vCode) {
            return vCode.substring(0, 10) + '...';
        };

        $scope.characterImage = function(characterId, size) {
            return '//image.eveonline.com/Character/' + characterId + '_' + size + '.jpg';
        };

        $scope.cancel = function() {
            $scope.newKey = undefined;
            $scope.errors = undefined;
        }


    };

    var keyPanel = function($scope, $http, KeyService) {

        $scope.save = function(key){
            $http.put('/api/keys/' + key._id, { keyID: key.keyId, vCode: key.vCode }).success(function(data){
                $scope.key = data;
            }).error(function(response, status){
                if(status === 400)
                    $scope.errors = response;
            });
        };

        $scope.deleteKey = function(id) {
            if(confirm('Are you sure you want to delete this key?')) {
                KeyService.remove(id).then(function(){
                    $scope.key = undefined;
                });
            }
        };

    };



    module.controller('keys.controller', ['$scope', 'KeyService', keyController]);
    module.controller('key.panel.controller', ['$scope', '$http', 'KeyService', keyPanel]);

}(angular.module('ssAuth')));