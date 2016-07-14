import htmlparser from 'htmlparser2'
import _ from 'lodash'

function getPropValue (tagName, attribs, TYPE, PROP) {
  let value, attr
  if (attribs[TYPE]) {
    value = null
    attr = null
  } else if (tagName === 'a' || tagName === 'link') {
    value = attribs.href.trim()
    attr = 'href'
  } else if (attribs.content) {
    value = attribs.content.trim()
    attr = 'content'
  } else if (attribs[PROP] === 'image' && attribs.src) {
    value = attribs.src.trim()
    attr = 'src'
  } else {
    value = null
    attr = '@text'
  }
  return {
    value,
    attr
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
    let props = []
    let path = []
    let topLevelScope = {}

    const parser = new htmlparser.Parser({
      onopentag (tagName, attribs) {
        let currentScope = scopes[scopes.length - 1]
        let tag = false
        let parentScope, scopeIndex

        if (attribs[TYPE]) {
          if (attribs[PROP] && currentScope) {
            let newScope = {}
            parentScope = currentScope
            currentScope[attribs[PROP]] = currentScope[attribs[PROP]] || []
            scopeIndex = currentScope[attribs[PROP]].length
            currentScope[attribs[PROP]].push(newScope)
            currentScope = newScope
          } else {
            parentScope = topLevelScope
            currentScope = {}
            const { type } = getType(attribs[TYPE])
            topLevelScope[type] = topLevelScope[type] || []
            scopeIndex = topLevelScope[type].length
            topLevelScope[type].push(currentScope)
          }
        }

        if (currentScope) {
          let { value, attr } = getPropValue(tagName, attribs, TYPE, PROP)
          let cssSelector, name

          if (attribs[TYPE]) {
            const { context, type } = getType(attribs[TYPE])
            const vocab = attribs.vocab
            currentScope['@context'] = context || vocab
            currentScope['@type'] = type
            name = attribs[PROP] ? attribs[PROP] : type
            const parentSelector = parentScope['@selector'] ? parentScope['@selector'] + ' ' : ''
            const selfSelector = (attribs[PROP]) ? `[${PROP}="${attribs[PROP]}"]` : `[${TYPE}="${attribs[TYPE]}"]`
            currentScope['@selector'] = parentSelector + selfSelector + `:eq(${scopeIndex})`
            tag = TYPE
            cssSelector = {
              selector: currentScope['@selector'],
              extract: {
                attr
              }
            }
            props.push({
              name,
              value,
              cssSelector,
              path: path.concat(name, scopeIndex)
            })
            path.push(name, scopeIndex)
            scopes.push(currentScope)
          } else if (attribs[PROP]) {
            cssSelector = {
              selector: currentScope['@selector'] + ' ' + `[${PROP}="${attribs[PROP]}"]` + ':eq(0)',
              extract: {
                attr
              }
            }
            value = (!value && cssSelector) ? $(cssSelector.selector).text().trim() : value
            currentScope[attribs[PROP]] = value
            name = attribs[PROP]
            props.push({
              name,
              value,
              cssSelector,
              path: path.concat(name)
            })
          }
        }
        tags.push(tag)
      },
      onclosetag (tagname) {
        const tag = tags.pop()
        if (tag) {
          let scope = scopes.pop()
          delete scope['@selector']
          if (!scope['@context']) {
            delete scope['@context']
          }
          Object.keys(scope).forEach((key) => {
            if (_.isArray(scope[key]) && scope[key].length === 1) {
              scope[key] = scope[key][0]
            }
          })
          path.pop()
          path.pop()
        }
      },
      onerror (err) {
        reject(err)
      },
      onend () {
        resolve({ data: topLevelScope, unnormalizedData: props })
      }
    })
    parser.write(html)
    parser.done()
  })
}
