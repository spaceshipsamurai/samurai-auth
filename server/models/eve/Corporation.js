var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = Schema({
    id: Number,
    name: String,
    memberCount: Number,
    ceo: {
        id: Number,
        name: String
    },
    description: String,
    station: {
        id: Number,
        name: String
    },
    url: String,
    taxRate: Number,
    ticker: String
});

schema.methods.sync = function(id, vcode) {

    var client, self = this;

    if(id && vcode) {
        console.log('ID AND VCODE');
        client = new neow.EveClient({
            keyID: id,
            vCode: vcode
        });
    } else {
        client = new neow.EveClient({});
    }

    return new Promise(function(resolve, reject){

        client.fetch('corp:CorporationSheet', { corporationID: self.id })
            .then(function(result){

                self.name = result.corporationName.content;
                self.memberCount = Number(result.memberCount.content);
                self.ceo = {
                    id: Number(result.ceoID.content),
                    name: result.ceoName.content
                };
                self.station = {
                    id: Number(result.stationID.content),
                    name: result.stationName.content
                };
                self.descript = result.description.content;
                self.url = result.url.content;
                self.taxRate = Number(result.taxRate.content);
                self.ticker = result.ticker.content;

                self.save(function(err, corp){
                    if(err) {
                        return reject({ corp: self, error: err});
                    }
                    return resolve(corp);
                })

            }).catch(function(err){
                console.log(err);
                return reject({ corp: self, error: err });
            });

    });
};

schema.statics.upsertSync = function(corp, id, vcode) {
    var self = this;

    return new Promise(function(resolve, reject){

        self.findOne({ id: corp }, function(err, corporation ){
            if(err) return reject(err);

            if(!corporation)
            {
                corporation = new self({ id: corp });
                corporation.save(function(err, saved){
                    if(err) return reject({corp: corp, error: err });

                    saved.sync().then(function(c){
                        return resolve(c);
                    }).catch(function(e){
                        reject(e);
                    })

                });
            } else {

                corporation.sync(id, vcode).then(function(c){
                    resolve(c);
                }).catch(function(err){
                    reject(err);
                });

            }
        });

    });


};

var model = mongoose.model('Corporation', schema);

module.exports = model;