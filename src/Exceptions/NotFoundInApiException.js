module.exports = function NotFoundInApiException(){
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = "API couldn't resolve anything. Please check your API-Key and API-Name.";
  this.extra = null;
}

require('util').inherits(module.exports, Error);
