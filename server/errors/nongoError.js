/*!
* NongoError Error constructor.
*/
function NongoError(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.message = msg;
    this.name = 'Nongo';
}

/*!
* Inherits from Error.
*/
NongoError.prototype.__proto__ = Error.prototype;

/*!
* Module exports.
*/
module.exports = exports = NongoError;

/*!
* Expose subclasses
*/
NongoError.ValidationError = require('./validationError');