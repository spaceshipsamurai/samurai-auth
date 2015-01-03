var Promise = require('bluebird');

var keyId,
    vCode,
    fetchMethods = {};

exports.EveClient = function(params){
    keyId = params.keyID;
    vCode = params.vCode;

    var fetch = function(method) {
        return new Promise(function(resolve, reject) {
            resolve(fetchMethods[method]);
        });
    };

    return {
        fetch: fetch
    }

};

exports.setFetchResult = function(method, result){
    fetchMethods[method] = result;
};


