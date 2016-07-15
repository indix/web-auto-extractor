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

export default (html, specName, $) => {
  return new Promise((resolve, reject) => {
    const { TYPE, PROP } = getAttrNames(specName)
    let scopes = []
    let tags = []
    let topLevelScope = {}
    let textForProp = null

    const parser = new htmlparser.Parser({
      onopentag (tagName, attribs) {
        let currentScope = scopes[scopes.length - 1]
        let tag = false

        if (attribs[TYPE]) {
          if (attribs[PROP] && currentScope) {
            let newScope = {}
            currentScope[attribs[PROP]] = currentScope[attribs[PROP]] || []
            currentScope[attribs[PROP]].push(newScope)
            currentScope = newScope
          } else {
            currentScope = {}
            const { type } = getType(attribs[TYPE])
            topLevelScope[type] = topLevelScope[type] || []
            topLevelScope[type].push(currentScope)
          }
        }

        if (currentScope) {
          if (attribs[TYPE]) {
            const { context, type } = getType(attribs[TYPE])
            const vocab = attribs.vocab
            currentScope['@context'] = context || vocab
            currentScope['@type'] = type
            tag = TYPE
            scopes.push(currentScope)
          } else if (attribs[PROP]) {
            const value = getPropValue(tagName, attribs, TYPE, PROP)
            if (!value) {
              tag = PROP
              currentScope[attribs[PROP]] = ''
              textForProp = attribs[PROP]
            } else {
              currentScope[attribs[PROP]] = value
            }
          }
        }
        tags.push(tag)
      },
      ontext: function (text) {
        if (textForProp) {
          scopes[scopes.length - 1][textForProp] += text.trim()
        }
      },
      onclosetag (tagname) {
        const tag = tags.pop()
        if (tag === TYPE) {
          let scope = scopes.pop()
          if (!scope['@context']) {
            delete scope['@context']
          }
          Object.keys(scope).forEach((key) => {
            if (_.isArray(scope[key]) && scope[key].length === 1) {
              scope[key] = scope[key][0]
            }
          })
        } else if (tag === PROP) {
          textForProp = false
        }
      },
      onerror (err) {
        reject(err)
      },
      onend () {
        resolve(topLevelScope)
      }
    })
    parser.write(html)
    parser.done()
  })
}
