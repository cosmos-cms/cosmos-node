module.exports = function NoPrivateKeyException(){
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = "Please provide a Private-Key before getting contents.";
  this.extra = null;
}

require('util').inherits(module.exports, Error);
