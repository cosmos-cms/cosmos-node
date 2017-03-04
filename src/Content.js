var request = require('urllib-sync').request;

var NotFoundInApiException = require('./Exceptions/NotFoundInApiException');

var Cache = require('./Storage/Cache');
var Encryption = require('./Security/Encryption');

class Content{

  constructor(cosmos, apiName){
    this._cosmos = cosmos;
    this._apiName = apiName;
  }

  fetch(){

    if(Cache.getInstance().has(this._apiName)){
      content = Cache.getInstance().get(this._apiName);
      this._body = content.body;
      this._name = content.name;
      this._type = content.type;
      return;
    }

    var res = request(this.url());
    if(res.status != 200){
      throw new NotFoundInApiException();
    }
    var response = JSON.parse(res.data);
    var content = response.contents;

    this._body = Encryption.decrypt(content.body, content.cipher, this._cosmos);
    this._name = content.name;
    this._type = content.type;

    Cache.getInstance().addContent(this).save();
  }

  url(){
    return 'https://cosmos-cms.com/api/'+ this._cosmos.getApiKey() +'/'+ this._apiName;
  }

  body(){
    return this._body;
  }
  name(){
    return this._name;
  }
  type(){
    return this._type;
  }
  apiName(){
    return this._apiName;
  }

  toString(){
    return this.body();
  }
}

module.exports = Content;
