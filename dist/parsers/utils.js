'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCheerioObject = getCheerioObject;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCheerioObject(html) {
  var $html = void 0;
  if (typeof html === 'string') {
    $html = _cheerio2.default.load(html, { xmlMode: true });
  } else if ((0, _cheerio2.default)(html).cheerio) {
    $html = html;
  } else {
    throw new Error('Invalid argument: pass valid html string or cheerio object');
  }
  return $html;
}