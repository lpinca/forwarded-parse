'use strict';

var test = require('tape')
  , parse = require('./');

test('is exported as a function', function (t) {
  t.equal(typeof parse, 'function');
  t.end();
});

test('parses the pairs as expected', function (t) {
  t.deepEqual(parse('foo=a,foo=b;bar=c;baz=d;qux=e'), [
    { foo: 'a' }, { foo: 'b', bar: 'c', baz: 'd', qux: 'e' }
  ]);

  t.end();
});

test('handles double quotes and escaped characters', function (t) {
  t.deepEqual(parse([
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
  ].join(',')), [
    { foo: 'bar' },
    { foo: 'bar' },
    { foo: ',;' },
    { foo: '' },
    { foo: ' ' },
    { foo: '\t' },
    { foo: '"' },
    { foo: '\\' },
    { foo: '¥' },
    { foo: '§' }
  ]);

  t.end();
});

test('ignores the optional white spaces', function (t) {
  t.deepEqual(parse('foo=a,foo=b, foo="c" ,foo=d  ,  foo=e'), [
    { foo: 'a' },
    { foo: 'b' },
    { foo: 'c' },
    { foo: 'd' },
    { foo: 'e' }
  ]);

  t.deepEqual(parse('foo=a;bar=b; baz=c ;qux="d"  ;  norf=e'), [{
    foo: 'a',
    bar: 'b',
    baz: 'c',
    qux: 'd',
    norf: 'e'
  }]);

  t.end();
});

test('ignores the case of the parameter names', function (t) {
  t.deepEqual(parse('foo=a,Foo=b'), [
    { foo: 'a' },
    { foo: 'b' }
  ]);

  t.end();
});

test('does not allow empty parameters', function (t) {
  t.throws(function () {
    parse('foo=bar,=baz');
  }, /Unexpected character '=' at index 8/);

  t.end();
});

test('throws an error if a parameter is not made of 1*tchar', function (t) {
  t.throws(function () {
    parse('f@r=192.0.2.43');
  }, /Unexpected character '@' at index 1/);

  t.end();
});

test('throws an error if it detects a misplaced whitespace', function (t) {
  t.throws(function () {
    parse('for =192.0.2.43');
  }, /Unexpected character ' ' at index 3/);

  t.throws(function () {
    parse('for= 192.0.2.43');
  }, /Unexpected character ' ' at index 4/);

  t.end();
});

test('throws an error if an identifier is not a token / quoted-string', function (t) {
  t.throws(function () {
    parse('foo=b"ar"');
  }, /Unexpected character '"' at index 5/);

  t.throws(function () {
    parse('foo="ba"r, foo=baz');
  }, /Unexpected character 'r' at index 8/);

  t.throws(function () {
    parse('foo=ba r, foo=baz');
  }, /Unexpected character 'r' at index 7/);

  t.throws(function () {
    parse('foo=, foo=baz');
  }, /Unexpected character ',' at index 4/);

  t.end();
});

test('throws an error when escaping a character not in quotes', function (t) {
  t.throws(function () {
    parse('foo=b\\ar');
  }, /Unexpected character '\\' at index 5/);

  t.end();
});

test('throws an error if an identifier contains an invalid character', function (t) {
  t.throws(function () {
    parse('foo=Ω, foo=baz');
  }, /Unexpected character 'Ω' at index 4/);

  t.throws(function () {
    parse('foo="Ω", foo=baz');
  }, /Unexpected character 'Ω' at index 5/);

  t.end();
});

test('throws an error if it detects a premature end of input', function (t) {
  t.throws(function () {
    parse('foo=');
  }, /Unexpected end of input/);

  t.throws(function () {
    parse('foo');
  }, /Unexpected end of input/);

  t.throws(function () {
    parse('foo="bar');
  }, /Unexpected end of input/);

  t.throws(function () {
    parse('foo=bar ');
  }, /Unexpected end of input/);

  t.end();
});
