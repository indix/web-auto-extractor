'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _htmlparser = require('htmlparser2');

var _htmlparser2 = _interopRequireDefault(_htmlparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPropValue(tagName, attribs, TYPE, PROP) {
  if (attribs[TYPE]) {
    return null;
  } else if ((tagName === 'a' || tagName === 'link') && attribs.href) {
    return attribs.href.trim();
  } else if (attribs.content) {
    return attribs.content.trim();
  } else if (attribs[PROP] === 'image' && attribs.src) {
    return attribs.src.trim();
  } else {
    return null;
  }
}

var getAttrNames = function getAttrNames(specName) {
  var TYPE = void 0,
      PROP = void 0;
  if (specName.toLowerCase().startsWith('micro')) {
    TYPE = 'itemtype';
    PROP = 'itemprop';
  } else if (specName.toLowerCase().startsWith('rdfa')) {
    TYPE = 'typeof';
    PROP = 'property';
  } else {
    throw new Error('Unsupported spec: use either micro or rdfa');
  }
  return { TYPE: TYPE, PROP: PROP };
};

var getType = function getType(typeString) {
  var match = /(.*\/)(\w+)/g.exec(typeString);
  return {
    context: match && match[1] ? match[1] : undefined,
    type: match && match[2] ? match[2] : typeString
  };
};

var cleanWhitespace = function cleanWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
};

var createHandler = function createHandler(specName) {
  var scopes = [];
  var tags = [];
  var topLevelScope = {};
  var textForProp = null;

  var _getAttrNames = getAttrNames(specName),
      TYPE = _getAttrNames.TYPE,
      PROP = _getAttrNames.PROP;

  var onopentag = function onopentag(tagName, attribs) {
    var currentScope = scopes[scopes.length - 1];
    var tag = false;

    if (attribs[TYPE]) {
      if (attribs[PROP] && currentScope) {
        var newScope = {};
        currentScope[attribs[PROP]] = currentScope[attribs[PROP]] || [];
        currentScope[attribs[PROP]].push(newScope);
        currentScope = newScope;
      } else {
        currentScope = {};

        var _getType = getType(attribs[TYPE]),
            type = _getType.type;

        topLevelScope[type] = topLevelScope[type] || [];
        topLevelScope[type].push(currentScope);
      }
    }

    if (currentScope) {
      if (attribs[TYPE]) {
        var _getType2 = getType(attribs[TYPE]),
            context = _getType2.context,
            _type = _getType2.type;

        var vocab = attribs.vocab;
        currentScope['@context'] = context || vocab;
        currentScope['@type'] = _type;
        tag = TYPE;
        scopes.push(currentScope);
      } else if (attribs[PROP]) {
        if (currentScope[attribs[PROP]] && !Array.isArray(currentScope[attribs[PROP]])) {
          // PROP occurs for the second time, storing it as an array
          currentScope[attribs[PROP]] = [currentScope[attribs[PROP]]];
        }

        var value = getPropValue(tagName, attribs, TYPE, PROP);
        if (!value) {
          tag = PROP;
          if (Array.isArray(currentScope[attribs[PROP]])) {
            currentScope[attribs[PROP]].push('');
          } else {
            currentScope[attribs[PROP]] = '';
          }
          textForProp = attribs[PROP];
        } else {
          if (Array.isArray(currentScope[attribs[PROP]])) {
            currentScope[attribs[PROP]].push(value);
          } else {
            currentScope[attribs[PROP]] = value;
          }
        }
      }
    }
    tags.push(tag);
  };
  var ontext = function ontext(text) {
    if (textForProp) {
      if (Array.isArray(scopes[scopes.length - 1][textForProp])) {
        scopes[scopes.length - 1][textForProp][scopes[scopes.length - 1][textForProp].length - 1] += text;
      } else {
        scopes[scopes.length - 1][textForProp] += text;
      }
    }
  };
  var onclosetag = function onclosetag(tagname) {
    var tag = tags.pop();
    if (tag === TYPE) {
      var scope = scopes.pop();
      if (!scope['@context']) {
        delete scope['@context'];
      }
      Object.keys(scope).forEach(function (key) {
        if (Array.isArray(scope[key]) && scope[key].length === 1) {
          scope[key] = scope[key][0];
        }
      });
    } else if (tag === PROP) {
      var _scope = scopes[scopes.length - 1];
      if (Array.isArray(_scope[textForProp])) {
        _scope[textForProp] = _scope[textForProp].map(cleanWhitespace);
      } else {
        _scope[textForProp] = cleanWhitespace(_scope[textForProp]);
      }
      textForProp = false;
    }
  };

  return {
    onopentag: onopentag,
    ontext: ontext,
    onclosetag: onclosetag,
    topLevelScope: topLevelScope
  };
};

exports.default = function (html, specName) {
  var handler = createHandler(specName);
  new _htmlparser2.default.Parser(handler).end(html);
  return handler.topLevelScope;
};