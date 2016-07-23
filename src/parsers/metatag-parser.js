import _ from 'lodash'

export default ($) => {
  let metatagsData = {}
  $('meta').each((index, elem) => {
    const nameKey = _.find(_.keys(elem.attribs), attr => [ 'name', 'property', 'itemprop' ].indexOf(attr) !== -1)
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    if (!metatagsData[name]) {
      metatagsData[name] = []
    }
    metatagsData[name].push(value)
  })
  return metatagsData
}
