import $ from 'cheerio'
import md5 from 'md5'
import { getCheerioObject } from './utils'
import _ from 'lodash'

const defaultConfig = {
  normalize: true
}

function getPropValue (itemPropElement, TYPE, PROP) {
  let value, attr
  if ($(itemPropElement).attr(`${TYPE}`)) {
    value = null
    attr = null
  } else if (itemPropElement.tagName === 'a' || itemPropElement.tagName === 'link') {
    value = $(itemPropElement).attr('href').trim()
    attr = 'href'
  } else if ($(itemPropElement).attr('content')) {
    value = $(itemPropElement).attr('content').trim()
    attr = 'content'
  } else if ($(itemPropElement).attr(`${PROP}`) === 'image' && $(itemPropElement).attr('src')) {
    value = $(itemPropElement).attr('src').trim()
    attr = 'src'
  } else {
    value = $(itemPropElement).text().trim()
    attr = '@text'
  }
  return {
    value,
    attr
  }
}

export function normalize (items, idList) {
  if (idList === undefined) {
    idList = Object.keys(items).filter(id =>
      items[id].parentTypeId === null)
  }
  return idList.map(id => {
    const { context, type, value, properties } = items[id]
    if (!type) {
      return value
    }
    let normalizedProperties = {}
    Object.keys(properties).map(key => {
      let propValue = normalize(items, properties[key])
      if (propValue.length === 1) {
        normalizedProperties[key] = propValue[0]
      } else if (propValue.length > 1) {
        normalizedProperties[key] = propValue
      }
    })
    return _.pickBy({
      '@context': context,
      '@type': type,
      ...normalizedProperties
    }, (val) => !_.isUndefined(val))
  })
}

function getAttrNames (specName) {
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

function getType (typeString) {
  const match = (/(.*\/)(\w+)/g).exec(typeString)
  return {
    context: match && match[1] ? match[1] : undefined,
    type: match && match[2] ? match[2] : typeString
  }
}

export default function (html, specName, config = {}) {
  _.defaults(config, defaultConfig)
  const { TYPE, PROP } = getAttrNames(specName)
  const $html = getCheerioObject(html)

  let items = {}

  $html(`[${TYPE}], [${PROP}]`).each((idx, itemElement) => {
    const itemElementId = $(itemElement).attr('id')
    const id = md5($.html($(itemElement)))
    const parentTypeHtml = $.html($(itemElement).parent().closest(`[${TYPE}]`))
    const parentTypeId = (parentTypeHtml) ? md5(parentTypeHtml) : null
    const isProp = $(itemElement).attr(`${PROP}`) !== undefined
    const typeString = $(itemElement).attr(`${TYPE}`)
    const vocab = $(itemElement).attr('vocab')
    const { context, type } = typeString ? getType(typeString) : {}
    const name = (isProp) ? $(itemElement).attr(`${PROP}`) : type
    const { value, attr } = getPropValue(itemElement, TYPE, PROP)

    let relativeIndexPosition = 0
    let parentSelector = ''

    if (parentTypeId) {
      if (!items[parentTypeId]) {
        items[parentTypeId] = { properties: {} }
      }
      if (!items[parentTypeId].properties[name]) {
        items[parentTypeId].properties[name] = []
      }
      relativeIndexPosition = items[parentTypeId].properties[name].length
      items[parentTypeId].properties[name].push(id)
      parentSelector = items[parentTypeId].selector.select + ' '
    }

    const relativeSelector = ((isProp)
                              ? `[${PROP}="${name}"]`
                              : `[${TYPE}="${typeString}"]`
                            ) + `:eq(${relativeIndexPosition})`
    const cssSelector = itemElementId ? `#${itemElementId}` : `${parentSelector}${relativeSelector}`

    items[id] = _.pickBy({
      context: vocab || context,
      type,
      name,
      value,
      properties: {},
      parentTypeId,
      selector: {
        select: cssSelector,
        extract: {
          attr
        }
      },
      ...items[id]
    }, (val) => !_.isUndefined(val))
  })

  if (config.normalize) {
    return normalize(items)
  }
  return items
}
