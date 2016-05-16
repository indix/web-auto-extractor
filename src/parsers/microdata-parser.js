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

export default function (html) {
  const $html = $.load(html, { xmlMode: true })
  let items = {}

  $html('[itemtype], [itemprop]').each((index, itemElement) => {
    const id = md5($(itemElement).html())
    const parentItemTypeHtml = $(itemElement).parent().closest('[itemtype]').html()
    const parentItemTypeId = (parentItemTypeHtml) ? md5(parentItemTypeHtml) : null
    const name = $(itemElement).attr('itemprop') || $(itemElement).attr('itemtype')
    let similarSiblingsPosition

    if (parentItemTypeId) {
      if (!items[parentItemTypeId]) {
        items[parentItemTypeId] = { properties: {} }
      }
      if (!items[parentItemTypeId].properties[name]) {
        items[parentItemTypeId].properties[name] = []
      }
      similarSiblingsPosition = items[parentItemTypeId].properties[name].length
      items[parentItemTypeId].properties[name].push(id)
    }

    items[id] = {
      type: $(itemElement).attr('itemtype') || $(itemElement).attr('itemprop'),
      name,
      value: getItemPropValue(itemElement),
      properties: {},
      parentItemTypeId,
      similarSiblingsPosition,
      ...items[id]
    }
  })

  return items
}
