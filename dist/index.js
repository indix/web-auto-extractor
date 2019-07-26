'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var $html = null;

  var loadCheerioObject = function loadCheerioObject(_$html) {
    $html = _$html;
  };

  var parse = function parse(html, options) {
    if (!($html && $html.prototype && $html.prototype.cheerio)) {
      $html = _cheerio2.default.load(html, options);
    }

    return {
      metatags: (0, _metatagParser2.default)($html),
      microdata: (0, _microRdfaParser2.default)(html, 'micro'),
      rdfa: (0, _microRdfaParser2.default)(html, 'rdfa'),
      jsonld: (0, _jsonldParser2.default)($html)
    };
  };

  return {
    parse: parse,
    loadCheerioObject: loadCheerioObject
  };
};

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _metatagParser = require('./parsers/metatag-parser');

var _metatagParser2 = _interopRequireDefault(_metatagParser);

var _microRdfaParser = require('./parsers/micro-rdfa-parser');

var _microRdfaParser2 = _interopRequireDefault(_microRdfaParser);

var _jsonldParser = require('./parsers/jsonld-parser');

var _jsonldParser2 = _interopRequireDefault(_jsonldParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!global._babelPolyfill) {
  require('babel-polyfill');
}