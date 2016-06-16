import _ from 'lodash'

const normalize = (items) => {
  let normalizedItems = {}
  items.map(item => {
    const { name, value } = item
    if (normalizedItems[name]) {
      if (_.isArray(normalizedItems[name])) {
        normalizedItems[name].push(value)
      } else {
        normalizedItems[name] = [
          normalizedItems[name],
          value
        ]
      }
    } else {
      normalizedItems[name] = value
    }
  })
  return normalizedItems
}

export default ($) => {
  let parsedMetaItems = []
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => attr !== 'content')
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    parsedMetaItems.push({
      name,
      value,
      selector: {
        select: `meta[${nameKey}="${name}"]`,
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
