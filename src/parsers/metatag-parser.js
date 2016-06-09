import _ from 'lodash'

const normalize = () => {

}

export default function ($, config) {
  _.defaults(config, defaultConfig)
  let parsedMetaItems = []
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => attr !== 'content')
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    parsedMetaItems.push(_.pickBy({
      name,
      value,
      selector: config.withSelector ? {
        select: `meta[${nameKey}="${name}"]`,
        extract: {
          attr: 'content'
        }
      } : undefined
    }, (val) => !_.isUndefined(val)))
  })
  return parsedMetaItems
}
