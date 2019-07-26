'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function ($) {
  var metatagsData = {};
  $('meta').each(function (index, elem) {
    var nameKey = Object.keys(elem.attribs).find(function (attr) {
      return ['name', 'property', 'itemprop', 'http-equiv'].indexOf(attr) !== -1;
    });
    var name = elem.attribs[nameKey];
    var value = elem.attribs['content'];
    if (!metatagsData[name]) {
      metatagsData[name] = [];
    }
    metatagsData[name].push(value);
  });
  return metatagsData;
};