'use strict';

//
// Expose the helper functions.
//
exports.isDelimiter = isDelimiter;
exports.isTokenChar = isTokenChar;
exports.isExtended = isExtended;
exports.isPrint = isPrint;

/**
 * Check if a character is not allowed in a token as defined in section 3.2.6
 * of RFC 7230.
 *
 *
 * @param {Number} code The code of the character to check.
 * @returns {Boolean}
 * @api public
 */
function isDelimiter(code) {
  return code === 0x22                // '"'
    || code === 0x28                  // '('
    || code === 0x29                  // ')'
    || code === 0x2C                  // ','
    || code === 0x2F                  // '/'
    || code >= 0x3A && code <= 0x40   // ':', ';', '<', '=', '>', '?' '@'
    || code >= 0x5B && code <= 0x5D   // '[', '\', ']'
    || code === 0x7B                  // '{'
    || code === 0x7D;                 // '}'
}

/**
 * Check if a character is allowed in a token as defined in section 3.2.6
 * of RFC 7230.
 *
 * @param {Number} code The code of the character to check.
 * @returns {Boolean}
 * @api public
 */
function isTokenChar(code) {
  return code === 0x21                // '!'
    || code >= 0x23 && code <= 0x27   // '#', '$', '%', '&', '''
    || code === 0x2A                  // '*'
    || code === 0x2B                  // '+'
    || code === 0x2D                  // '-'
    || code === 0x2E                  // '.'
    || code >= 0x30 && code <= 0x39   // 0-9
    || code >= 0x41 && code <= 0x5A   // A-Z
    || code >= 0x5E && code <= 0x7A   // '^', '_', '`', a-z
    || code === 0x7C                  // '|'
    || code === 0x7E;                 // '~'
}

/**
 * Check if a character is a printable ASCII character.
 *
 * @param {Number} code The code of the character to check.
 * @returns {Boolean}
 * @api public
 */
function isPrint(code) {
  return code >= 0x20 && code <= 0x7E;
}

/**
 * Check if a character is an extended ASCII character.
 *
 * @param {Number} code The code of the character to check.
 * @returns {Boolean}
 * @api public
 */
function isExtended(code) {
  return code >= 0x80 && code <= 0xFF;
}
