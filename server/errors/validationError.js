var NongoError = require('./nongoError'),
    _          = require('lodash');

/*!
 * ValidationError Error constructor.
 *
 * @inherits NongoError
 */
function ValidationError(param, message) {
    Error.captureStackTrace(this, arguments.callee);

    NongoError.call(this, 'Validation error.');


    if(_.isArray(param)){
        this.errors = param;
    }else{
        this.errors = [{param: param, message: message}];
    }

    this.name = 'ValidationError';
}

/*!
 * Inherits from NongoError.
 */
ValidationError.prototype.__proto__ = NongoError.prototype;

/*!
 * exports
 */
module.exports = ValidationError;
