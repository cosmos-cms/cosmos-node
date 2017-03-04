module.exports = function NoApiKeyException(){
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = "Please provide an API-Key before getting contents.";
  this.extra = null;
}

require('util').inherits(module.exports, Error);
