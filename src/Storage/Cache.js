var fs = require('fs');
var path = require('path');

var instance = null;

class Cache{

  constructor(cachePath){

    this.dir = path.resolve(cachePath);
    this.refreshRate = 60 * 60 * 24;
    this.contents = {};

    if (!fs.existsSync(this.dir)){
      fs.mkdirSync(this.dir);
    }

    var dir = fs.readdirSync(this.dir);
    this.file = dir[0];

    if(this.file){
      this.contents = JSON.parse(fs.readFileSync(path.join(this.dir, this.file)));
    }

  }


  addContent(content){
    var time = Math.round(new Date().getTime() / 1000);
    var c = {
      body: content.body(),
      name: content.name(),
      type: content.type(),
      time: time
    };
    this.contents[content.apiName()] = c;
    return this;
  }

  has(apiName){
    var time = Math.round(new Date().getTime() / 1000);

    if(apiName in this.contents && time - this.contents[apiName].time > this.refreshRate){
      return false;
    }
    return apiName in this.contents;
  }

  get(apiName){
    return this.contents[apiName];
  }

  save(){
    var time = Math.round(new Date().getTime() / 1000) + "";
    var dir = fs.readdirSync(this.dir);

    for(var i = 0; i < dir.length; i++){
      var file = path.join(this.dir, dir[i]);
      fs.unlinkSync(file);
    }
    var newFile = path.join(this.dir, time);
    var fd = fs.openSync(newFile, 'w+');
    console.log(JSON.stringify(this.contents));
    fs.writeFileSync(fd, JSON.stringify(this.contents));
    fs.closeSync(fd);
  }

  setRefreshRate(refreshRate){
    this.refreshRate = refreshRate;
  }

}

module.exports = {
  getInstance: function(cachePath){
    if(typeof cachePath == 'undefined'){
      return instance;
    }
    return instance || (instance = new Cache(cachePath));
  }
};
