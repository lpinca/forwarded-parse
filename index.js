'use strict';

var ParseError = require('./lib/error')
  , ascii = require('./lib/ascii')
  , isDelimiter = ascii.isDelimiter
  , isTokenChar = ascii.isTokenChar
  , isExtended = ascii.isExtended
  , isPrint = ascii.isPrint;

//
// Expose the parser.
//
module.exports = parse;

/**
 * Parse the `Forwarded` header.
 *
 * @param {String} input The field value of the header.
 * @returns {Object}
 * @api public
 */
function parse(input) {
  var forwarded = Object.create(null)
    , escape = false
    , quote = false
    , lock = false
    , ows = false
    , token = ''
    , parameter
    , code
    , ch;

  for (var i = 0; i < input.length; i++) {
    code = input.charCodeAt(i);
    ch = input.charAt(i);

    if (!parameter) {
      if (ows && (code === 0x20/*' '*/|| code === 0x09/*'\t'*/)) {
        continue;
      } else if (code === 0x3D/*'='*/&& token) {
        parameter = token.toLowerCase();
        ows = false;
        token = '';
      } else if (isTokenChar(code)) {
        ows = false;
        token += ch;
      } else {
        throw new ParseError(input, 'Unexpected character \''+ ch +'\'', i);
      }
    } else {
      if (escape && (code === 0x09 || isPrint(code) || isExtended(code))) {
        escape = false;
        token += ch;
      } else if (isDelimiter(code) || isExtended(code)) {
        if (quote) {
          if (code === 0x22/*'"'*/) {
            quote = false;
            lock = true;
          } else if (code === 0x5C/*'\'*/) {
            escape = true;
          } else {
            token += ch;
          }
        } else if (code === 0x22 && input.charCodeAt(i - 1) === 0x3D) {
          quote = true;
        } else if ((code === 0x2C/*','*/|| code === 0x3B/*';'*/) && (token || lock)) {
          if (forwarded[parameter]) {
            forwarded[parameter].push(token);
          } else {
            forwarded[parameter] = [token];
          }
          parameter = token = '';
          lock = false;
          ows = true;
        } else {
          throw new ParseError(input, 'Unexpected character \''+ ch +'\'', i);
        }
      } else if (isTokenChar(code)) {
        if (quote || !lock) {
          token += ch;
        } else {
          throw new ParseError(input, 'Unexpected character \''+ ch +'\'', i);
        }
      } else if (code === 0x20 || code === 0x09) {
        if (quote) {
          token += ch;
        } else if (lock) {
          ows = true;
        } else if (token) {
          lock = ows = true;
        } else {
          throw new ParseError(input, 'Unexpected character \''+ ch +'\'', i);
        }
      } else {
        throw new ParseError(input, 'Unexpected character \''+ ch +'\'', i);
      }
    }
  }

  if (!token && !lock || !parameter || quote || ows) {
    throw new ParseError(input, 'Unexpected end of input');
  }

  if (forwarded[parameter]) {
    forwarded[parameter].push(token);
  } else {
    forwarded[parameter] = [token];
  }

  return forwarded;
}
