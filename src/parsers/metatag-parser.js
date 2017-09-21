
export default ($) => {
  let metatagsData = {}
  $('meta').each((index, elem) => {
    const nameKey = Object.keys(elem.attribs).find((attr) => ['name', 'property', 'itemprop', 'http-equiv'].indexOf(attr) !== -1)
    const name = elem.attribs[nameKey]
    const value = elem.attribs['content']
    if (!metatagsData[name]) {
      metatagsData[name] = []
    }
    metatagsData[name].push(value)
  })
  return metatagsData
}
