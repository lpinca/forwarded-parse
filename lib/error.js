'use strict';

var util = require('util');

//
// Expose the contructor.
//
module.exports = ParseError;

/**
 * An error thrown by the parser on unexpected input.
 *
 * @constructor
 * @param {String} input The unexpected input.
 * @param {String} message The error message.
 * @param {Number} [index] The character position where the error occurred.
 * @api public
 */
function ParseError(input, message, index) {
  Error.call(this);
  Error.captureStackTrace(this, ParseError);

  this.name = this.constructor.name;
  this.input = input;
  this.message = message;
  if (index) this.message += ' at index '+ index;
}

util.inherits(ParseError, Error);
