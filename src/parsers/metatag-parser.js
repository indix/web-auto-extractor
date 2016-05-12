import _ from 'lodash'
import { ParsedItem, Selector, fieldType } from './fields'

export const parseMetaTags = function ($) {
  let parsedMetaItems = []
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => attr !== 'content')
    const name = elem.attribs[nameKey]
    const content = elem.attribs['content']
    parsedMetaItems.push(
      ParsedItem(
        fieldType.META,
        name,
        content,
        Selector(
          `meta[${nameKey}="${name}"]`,
          'content'
        )
      )
    )
  })
  return parsedMetaItems
}
