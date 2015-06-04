describe('forwarded-parse', function () {
  'use strict';

  var assert = require('assert')
    , parse = require('./');

  it('is exported as a function', function () {
    assert.strictEqual(typeof parse, 'function');
  });

  it('parses the pairs as expected', function () {
    assert.deepEqual(parse('foo=a,foo=b;bar=c;baz=d;qux=e'), {
      foo: [ 'a', 'b' ],
      bar: [ 'c' ],
      baz: [ 'd' ],
      qux: [ 'e' ]
    });
  });

  it('ignores the optional white spaces', function () {
    assert.deepEqual(parse('foo=a,foo=b, foo=c ,foo=d  ,  foo=e'), {
      foo: [ 'a', 'b', 'c', 'd', 'e' ]
    });

    assert.deepEqual(parse('foo=a;bar=b; baz=c ;qux=d  ;  norf=e'), {
      foo: [ 'a' ],
      bar: [ 'b' ],
      baz: [ 'c' ],
      qux: [ 'd' ],
      norf: [ 'e' ],
    });
  });

  it('ignores the case of the parameter names', function () {
    assert.deepEqual(parse('foo=a,Foo=b'), {
      foo: [ 'a', 'b' ]
    });
  });

  it('handles double quotes and escaped characters', function () {
    assert.deepEqual(parse([
      'foo="bar"',
      'foo="ba\\r"',
      'foo=",;"',
      'foo=""',
      'foo=" "',
      'foo="\t"',
      'foo="\\""',
      'foo="\\\\"',
      'foo="¥"',
      'foo="\\§"'
    ].join(',')), {
      foo: [ 'bar', 'bar', ',;', '', ' ', '\t', '"', '\\', '¥', '§' ]
    });
  });

  it('does not allow empty parameters', function () {
    assert.throws(function () {
      parse('foo=bar,=baz');
    }, /Unexpected character '=' at index 8/);
  });

  it('throws an error if a parameter is not made of 1*tchar', function () {
    assert.throws(function () {
      parse('f@r=192.0.2.43');
    }, /Unexpected character '@' at index 1/);
  });

  it('throws an error if it detects a misplaced whitespace', function () {
    assert.throws(function () {
      parse('for =192.0.2.43');
    }, /Unexpected character ' ' at index 3/);

    assert.throws(function () {
      parse('for= 192.0.2.43');
    }, /Unexpected character ' ' at index 4/);
  });

  it('throws an error if an identifier is not a token / quoted-string', function () {
    assert.throws(function () {
      parse('foo=b"ar"');
    }, /Unexpected character '"' at index 5/);

    assert.throws(function () {
      parse('foo="ba"r, foo=baz');
    }, /Unexpected character 'r' at index 8/);

    assert.throws(function () {
      parse('foo=, foo=baz');
    }, /Unexpected character ',' at index 4/);
  });

  it('throws an error when escaping a character not in quotes', function () {
    assert.throws(function () {
      parse('foo=b\\ar');
    }, /Unexpected character '\\' at index 5/);
  });

  it('throws an error if an identifier contains an invalid character', function () {
    assert.throws(function () {
      parse('foo=Ω, foo=baz');
    }, /Unexpected character 'Ω' at index 4/);

    assert.throws(function () {
      parse('foo="Ω", foo=baz');
    }, /Unexpected character 'Ω' at index 5/);
  });

  it('throws an error if it detects a premature end of input', function () {
    assert.throws(function () {
      parse('foo=');
    }, /Unexpected end of input/);

    assert.throws(function () {
      parse('foo');
    }, /Unexpected end of input/);

    assert.throws(function () {
      parse('foo="bar');
    }, /Unexpected end of input/);

    assert.throws(function () {
      parse('foo=bar ');
    }, /Unexpected end of input/);
  });
});
