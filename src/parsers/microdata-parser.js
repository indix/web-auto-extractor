import $ from 'cheerio'
import md5 from 'md5'

class MicrodataParser {
  constructor (html) {
    this.html = html
  }

  parse () {
    const $html = $.load(this.html)
    let itemTypes = MicrodataParserHelper.identifyItemTypes($html)
    const microdata = MicrodataParserHelper.identifyItemProps($html, itemTypes)
    return microdata
  }
}

class MicrodataParserHelper {
  static getItemPropValue (itemPropElement) {
    if ($(itemPropElement).attr('content')) {
      return $(itemPropElement).attr('content')
    } else if ($(itemPropElement).attr('itemprop') === 'image' && $(itemPropElement).attr('src')) {
      return $(itemPropElement).attr('src')
    } else {
      return $(itemPropElement).text()
    }
  }

  static identifyItemTypes ($html) {
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

  static identifyItemProps ($html, itemTypes) {
    const itemProps = {}
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
        value: this.getItemPropValue(itemPropElement),
        parentItemTypeId
      }
    })
    return {
      itemTypes,
      itemProps
    }
  }
}

export default MicrodataParser
