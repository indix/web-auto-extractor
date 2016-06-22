import _ from 'lodash'

const normalize = (items) => {
  return Object.keys(items).reduce((normalizedItems, itemName) => {
    normalizedItems[itemName] = items[itemName].map(({ value }) => value)
    return normalizedItems
  }, {})
}

export default ($) => {
  let parsedMetaItems = {}
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => [ 'name', 'property', 'itemprop' ].indexOf(attr) !== -1)
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    if (!parsedMetaItems[name]) {
      parsedMetaItems[name] = []
    }
    parsedMetaItems[name].push({
      value,
      selector: {
        select: `meta[${nameKey}="${name}"].eq(${parsedMetaItems[name].length})`,
        extract: {
          attr: 'content'
        }
      }
    })
  })
  const data = normalize(parsedMetaItems)
  return {
    data,
    unnormalizedData: parsedMetaItems
  }
}
