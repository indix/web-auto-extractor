import htmlparser from 'htmlparser2'
import _ from 'lodash'

function getPropValue (tagName, attribs, TYPE, PROP) {
  if (attribs[TYPE]) {
    return null
  } else if (tagName === 'a' || tagName === 'link') {
    return attribs.href.trim()
  } else if (attribs.content) {
    return attribs.content.trim()
  } else if (attribs[PROP] === 'image' && attribs.src) {
    return attribs.src.trim()
  } else {
    return null
  }
}

const getAttrNames = (specName) => {
  let TYPE, PROP
  if (specName.toLowerCase().startsWith('micro')) {
    TYPE = 'itemtype'
    PROP = 'itemprop'
  } else if (specName.toLowerCase().startsWith('rdfa')) {
    TYPE = 'typeof'
    PROP = 'property'
  } else {
    throw new Error('Unsupported spec: use either micro or rdfa')
  }
  return { TYPE, PROP }
}

const getType = (typeString) => {
  const match = (/(.*\/)(\w+)/g).exec(typeString)
  return {
    context: match && match[1] ? match[1] : undefined,
    type: match && match[2] ? match[2] : typeString
  }
}

class Handler {

  constructor (specName) {
    this.scopes = []
    this.tags = []
    this.topLevelScope = {}
    this.textForProp = null
    const { TYPE, PROP } = getAttrNames(specName)
    this.TYPE = TYPE
    this.PROP = PROP
  }

  onopentag (tagName, attribs) {
    let currentScope = this.scopes[this.scopes.length - 1]
    let tag = false

    if (attribs[this.TYPE]) {
      if (attribs[this.PROP] && currentScope) {
        let newScope = {}
        currentScope[attribs[this.PROP]] = currentScope[attribs[this.PROP]] || []
        currentScope[attribs[this.PROP]].push(newScope)
        currentScope = newScope
      } else {
        currentScope = {}
        const { type } = getType(attribs[this.TYPE])
        this.topLevelScope[type] = this.topLevelScope[type] || []
        this.topLevelScope[type].push(currentScope)
      }
    }

    if (currentScope) {
      if (attribs[this.TYPE]) {
        const { context, type } = getType(attribs[this.TYPE])
        const vocab = attribs.vocab
        currentScope['@context'] = context || vocab
        currentScope['@type'] = type
        tag = this.TYPE
        this.scopes.push(currentScope)
      } else if (attribs[this.PROP]) {
        const value = getPropValue(tagName, attribs, this.TYPE, this.PROP)
        if (!value) {
          tag = this.PROP
          currentScope[attribs[this.PROP]] = ''
          this.textForProp = attribs[this.PROP]
        } else {
          currentScope[attribs[this.PROP]] = value
        }
      }
    }
    this.tags.push(tag)
  }
  ontext (text) {
    if (this.textForProp) {
      this.scopes[this.scopes.length - 1][this.textForProp] += text.trim()
    }
  }
  onclosetag (tagname) {
    const tag = this.tags.pop()
    if (tag === this.TYPE) {
      let scope = this.scopes.pop()
      if (!scope['@context']) {
        delete scope['@context']
      }
      Object.keys(scope).forEach((key) => {
        if (_.isArray(scope[key]) && scope[key].length === 1) {
          scope[key] = scope[key][0]
        }
      })
    } else if (tag === this.PROP) {
      this.textForProp = false
    }
  }
  onerror (err) {
    return this.topLevelScope
  }
}

export default (html, specName, $) => {
  const handler = new Handler(specName)
  const parser = new htmlparser.Parser(handler).end(html)
  return handler.topLevelScope
}
