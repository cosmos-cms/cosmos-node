var ursa = require('ursa');
var crypto = require('crypto');
var base64 = require('base-64');


module.exports = {

  decrypt: function(enc_body, enc_cipher, cosmos){
    var apiKey = cosmos.getApiKey();
    apiKey = apiKey.substr(0, 16);

    var privateKey = base64.decode(cosmos.getPrivateKey());


    enc_cipher = new Buffer(enc_cipher, 'hex');

    var key = ursa.createPrivateKey(privateKey);
    var cipher = key.decrypt(enc_cipher, 'hex', 'utf8', ursa.RSA_PKCS1_PADDING);

    enc_body = new Buffer(enc_body, 'hex');

    var decipher = crypto.createDecipheriv('AES-128-CBC', apiKey, cipher);
    var res = decipher.update(enc_body, 'hex', 'utf-8');
    res += decipher.final('utf-8');

    return res;

  }

};
