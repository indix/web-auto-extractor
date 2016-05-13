import $ from 'cheerio'
import md5 from 'md5'

function getMicrodataPropValue (itemPropElement) {
  if ($(itemPropElement).attr('content')) {
    return $(itemPropElement).attr('content')
  } else if ($(itemPropElement).attr('itemprop') === 'image' && $(itemPropElement).attr('src')) {
    return $(itemPropElement).attr('src')
  } else {
    return $(itemPropElement).text()
  }
}

function identifyMicrodataItemTypes ($html) {
  let itemTypes = {}
  $html('[itemtype]').each((index, itemTypeElement) => {
    const itemTypeId = md5($(itemTypeElement).html())
    itemTypes[itemTypeId] = {
      name: $(itemTypeElement).attr('itemtype'),
      properties: []
    }
  })
  return itemTypes
}

function identifyMicrodataItemProps ($html, itemTypes) {
  let itemProps = {}
  $html('[itemprop]').each((index, itemPropElement) => {
    const parentItemType = $(itemPropElement).closest('[itemtype]')
    const parentItemTypeHtml = $(parentItemType).html()
    const parentItemTypeId = (parentItemTypeHtml) ? md5($(parentItemType).html()) : null
    const itemPropId = md5($(itemPropElement).html())
    if (parentItemTypeId === itemPropId) {
      itemTypes[itemPropId].isProp = true
      itemTypes[itemPropId].value = itemPropId
    } else if (parentItemTypeId) {
      itemTypes[parentItemTypeId].properties.push(itemPropId)
    }
    itemProps[itemPropId] = {
      name: $(itemPropElement).attr('itemprop'),
      value: getMicrodataPropValue(itemPropElement),
      parentItemTypeId
    }
  })
  return {
    itemTypes,
    itemProps
  }
}

export function parseMicrodataItems (html) {
  let $html = $.load(html)
  let microdataItemTypes = identifyMicrodataItemTypes($html)
  let microdata = identifyMicrodataItemProps($html, microdataItemTypes)

  return microdata
}
