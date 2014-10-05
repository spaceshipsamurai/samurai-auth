var crypto = require('crypto');

module.exports = {
    createSalt: function() {
        return crypto.randomBytes(128).toString('base64');
    },
    hashValue: function(value, salt) {
        var hmac = crypto.createHmac('sha256', salt);
        return hmac.update(value).digest('hex');
    },
    createGuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};
