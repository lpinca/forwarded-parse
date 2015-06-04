# forwarded-parse

[![Version npm][npm-forwarded-parse-badge]][npm-forwarded-parse]
[![Build Status][travis-forwarded-parse-badge]][travis-forwarded-parse]
[![Coverage Status][coverage-forwarded-parse-badge]][coverage-forwarded-parse]

Parse the `Forwarded` header ([RFC 7239][rfc7239]) into an object.

## Install

```
npm install --save forwarded-parse
```

## API

This module exports a single function that takes a string and returns an object.

```js
var parse = require('forwarded-parse');

console.log(parse('for=192.0.2.43;by=198.51.100.17;proto=http;host=example.com'));

/*
{
  for: [ '192.0.2.43' ],
  by: [ '198.51.100.17' ],
  proto: [ 'http' ],
  host: [ 'example.com' ]
}
*/
```

## License

[MIT](LICENSE)

[npm-forwarded-parse-badge]: https://img.shields.io/npm/v/forwarded-parse.svg
[npm-forwarded-parse]: https://www.npmjs.com/package/forwarded-parse
[travis-forwarded-parse-badge]: https://img.shields.io/travis/lpinca/forwarded-parse/master.svg
[travis-forwarded-parse]: https://travis-ci.org/lpinca/forwarded-parse
[coverage-forwarded-parse-badge]: https://img.shields.io/coveralls/lpinca/forwarded-parse/master.svg
[coverage-forwarded-parse]: https://coveralls.io/r/lpinca/forwarded-parse?branch=master
[rfc7239]: http://tools.ietf.org/html/rfc7239
