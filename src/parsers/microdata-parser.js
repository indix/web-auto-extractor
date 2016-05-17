import $ from 'cheerio'
import md5 from 'md5'

function getItemPropValue (itemPropElement) {
  if ($(itemPropElement).attr('itemtype')) {
    return null
  } else if ($(itemPropElement).attr('content')) {
    return $(itemPropElement).attr('content')
  } else if ($(itemPropElement).attr('itemprop') === 'image' && $(itemPropElement).attr('src')) {
    return $(itemPropElement).attr('src')
  } else {
    return $(itemPropElement).text()
  }
}

export function resolveMicrodata (items, idList) {
  if (idList === undefined) {
    idList = Object.keys(items).filter(id =>
      items[id].parentItemTypeId === null)
  }
  return idList.map(id => {
    const { type, name, value, properties, cssSelector } = items[id]
    let resolvedProperties = {}
    Object.keys(properties).map(key => {
      resolvedProperties[key] = resolveMicrodata(items, properties[key])
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

export default function (html) {
  let $html

  if (typeof html === 'string') {
    $html = $.load(html, { xmlMode: true })
  } else if ($(html).cheerio) {
    $html = html
  } else {
    throw new Error('Invalid argument: pass valid html string or cheerio object')
  }

  let items = {}

  $html('[itemtype], [itemprop]').each((index, itemElement) => {
    const id = md5($(itemElement).html())
    const parentItemTypeHtml = $(itemElement).parent().closest('[itemtype]').html()
    const parentItemTypeId = (parentItemTypeHtml) ? md5(parentItemTypeHtml) : null
    const isProp = $(itemElement).attr('itemprop') !== undefined
    const name = (isProp) ? $(itemElement).attr('itemprop') : $(itemElement).attr('itemtype')
    let relativeIndexPosition = 0
    let parentSelector = ''

    if (parentItemTypeId) {
      if (!items[parentItemTypeId]) {
        items[parentItemTypeId] = { properties: {} }
      }
      if (!items[parentItemTypeId].properties[name]) {
        items[parentItemTypeId].properties[name] = []
      }
      relativeIndexPosition = items[parentItemTypeId].properties[name].length
      items[parentItemTypeId].properties[name].push(id)
      parentSelector = items[parentItemTypeId].cssSelector + ' '
    }

    const relativeSelector = ((isProp)
                              ? `[itemprop="${name}"]`
                              : `[itemtype="${name}"]`
                            ) + `:eq(${relativeIndexPosition})`
    const cssSelector = `${parentSelector}${relativeSelector}`

    items[id] = {
      type: $(itemElement).attr('itemtype'),
      name,
      value: getItemPropValue(itemElement),
      properties: {},
      parentItemTypeId,
      cssSelector,
      ...items[id]
    }
  })

  return items
}
