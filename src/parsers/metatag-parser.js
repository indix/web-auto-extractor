import _ from 'lodash'

export const parseMetaTags = function ($, config = {}) {
  let parsedMetaItems = []
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => attr !== 'content')
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    parsedMetaItems.push(
      {
        name,
        value,
        selector: {
          select: `meta[${nameKey}="${name}"]`,
          extract: {
            attr: 'content'
          }
        }
      }
    )
  })
  return parsedMetaItems
}
