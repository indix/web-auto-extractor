import $ from 'cheerio'
import md5 from 'md5'
import { getCheerioObject } from './utils'

function getPropValue (itemPropElement, TYPE, PROP) {
  if ($(itemPropElement).attr(`${TYPE}`)) {
    return null
  } else if ($(itemPropElement).attr('content')) {
    return $(itemPropElement).attr('content')
  } else if ($(itemPropElement).attr(`${PROP}`) === 'image' && $(itemPropElement).attr('src')) {
    return $(itemPropElement).attr('src')
  } else {
    return $(itemPropElement).text()
  }
}

export function resolve (items, idList) {
  if (idList === undefined) {
    idList = Object.keys(items).filter(id =>
      items[id].parentTypeId === null)
  }
  return idList.map(id => {
    const { type, name, value, properties, cssSelector } = items[id]
    let resolvedProperties = {}
    Object.keys(properties).map(key => {
      resolvedProperties[key] = resolve(items, properties[key])
    })
    return {
      type,
      name,
      value,
      cssSelector,
      properties: resolvedProperties
    }
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

export default function (html, specName) {
  const { TYPE, PROP } = getAttrNames(specName)
  const $html = getCheerioObject(html)
  let items = {}

  $html(`[${TYPE}], [${PROP}]`).each((index, itemElement) => {
    const id = md5($(itemElement).html())
    const parentTypeHtml = $(itemElement).parent().closest(`[${TYPE}]`).html()
    const parentTypeId = (parentTypeHtml) ? md5(parentTypeHtml) : null
    const isProp = $(itemElement).attr(`${PROP}`) !== undefined
    const name = (isProp) ? $(itemElement).attr(`${PROP}`) : $(itemElement).attr(`${TYPE}`)
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
      parentSelector = items[parentTypeId].cssSelector + ' '
    }

    const relativeSelector = ((isProp)
                              ? `[${PROP}="${name}"]`
                              : `[${TYPE}="${name}"]`
                            ) + `:eq(${relativeIndexPosition})`
    const cssSelector = `${parentSelector}${relativeSelector}`

    items[id] = {
      type: $(itemElement).attr(`${TYPE}`),
      name,
      value: getPropValue(itemElement, TYPE, PROP),
      properties: {},
      parentTypeId,
      cssSelector,
      ...items[id]
    }
  })

  return items
}
