import htmlparser from 'htmlparser2'

function getPropValue (tagName, attribs, TYPE, PROP) {
  if (attribs[TYPE]) {
    return null
  } else if ((tagName === 'a' || tagName === 'link') && attribs.href) {
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
  let contexts = []
  let types = []
  for (const typeString of typeString.split(' ')) {
    const match = (/([^ ]*[\/#])(\w+)/g).exec(typeString)
    let context = match && match[1] ? match[1] : undefined
    let type = match && match[2] ? match[2] : typeString
    if (!contexts.includes(context)) {
      contexts.push(context)
    }
    if (!types.includes(type)) {
      types.push(type)
    }
  }
  if (contexts.length < 2) {
    contexts = contexts[0]
  }
  if (types.length < 2) {
    types = types[0]
  }
  return {
    context: contexts,
    type: types
  }
}

const createHandler = function (specName) {
  let scopes = []
  let tags = []
  let topLevelScope = {}
  let textForProp = null
  const { TYPE, PROP } = getAttrNames(specName)

  const onopentag = function (tagName, attribs) {
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
        if (currentScope[attribs[PROP]] && !Array.isArray(currentScope[attribs[PROP]])) {
          // PROP occurs for the second time, storing it as an array
          currentScope[attribs[PROP]] = [currentScope[attribs[PROP]]]
        }

        var value = getPropValue(tagName, attribs, TYPE, PROP)
        if (!value) {
          tag = PROP
          if (Array.isArray(currentScope[attribs[PROP]])) {
            currentScope[attribs[PROP]].push('')
          } else {
            currentScope[attribs[PROP]] = ''
          }
          textForProp = attribs[PROP]
        } else {
          if (Array.isArray(currentScope[attribs[PROP]])) {
            currentScope[attribs[PROP]].push(value)
          } else {
            currentScope[attribs[PROP]] = value
          }
        }
      }
    }
    tags.push(tag)
  }
  const ontext = function (text) {
    if (textForProp) {
      if (Array.isArray(scopes[scopes.length - 1][textForProp])) {
        scopes[scopes.length - 1][textForProp][scopes[scopes.length - 1][textForProp].length - 1] += text.trim()
      } else {
        scopes[scopes.length - 1][textForProp] += text.trim()
      }
    }
  }
  const onclosetag = function (tagname) {
    const tag = tags.pop()
    if (tag === TYPE) {
      let scope = scopes.pop()
      if (!scope['@context']) {
        delete scope['@context']
      }
      Object.keys(scope).forEach((key) => {
        if (Array.isArray(scope[key]) && scope[key].length === 1) {
          scope[key] = scope[key][0]
        }
      })
    } else if (tag === PROP) {
      textForProp = false
    }
  }

  return {
    onopentag,
    ontext,
    onclosetag,
    topLevelScope
  }
}

export default (html, specName) => {
  const handler = createHandler(specName)
  new htmlparser.Parser(handler).end(html)
  return handler.topLevelScope
}
