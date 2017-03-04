var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var NoApiKeyException = require('./Exceptions/NoApiKeyException');
var NoPrivateKeyException = require('./Exceptions/NoPrivateKeyException');

var Cache = require('./Storage/Cache');
var Content = require('./Content');

class Cosmos{

  constructor(){
    this.contents = [];
  }

  setApiKey(apiKey){
    this.apiKey = apiKey;
  }

  getApiKey(cosmos){
    return this.apiKey;
  }

  setPrivateKey(key){
    if(fs.existsSync(key)){
      key = fs.readFileSync(key);
    }
    this.privateKey = key;
  }

  getPrivateKey(){
    return this.privateKey;
  }

  setCachePath(cachePath){
    Cache.getInstance(cachePath);
  }

  saveCache(){
    Cache.getInstance().save();
  }

  setRefreshRate(refreshRate){
    Cache.getInstance().setRefreshRate(refreshRate);
  }

  get(apiName){
    if(!this.apiKey){
      throw new NoApiKeyException();
    }
    if(!this.privateKey){
      throw new NoPrivateKeyException();
    }

    if(apiName in this.contents){
      return this.contents[apiName];
    }
    var content = new Content(this, apiName);
    content.fetch();
    this.contents[apiName] = content;
    return this.contents[apiName];
  }
}

module.exports = Cosmos;
