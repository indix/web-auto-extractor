import { getCheerioObject } from './utils'
import $ from 'cheerio'

export default function (html, config = {}) {
  const $html = getCheerioObject(html)
  let jsonldData = {}

  $html('script[type="application/ld+json"]').each((index, item) => {
    try {
      const parsedJSON = JSON.parse($(item).text())
      const type = parsedJSON['@type']
      jsonldData[type] = jsonldData[type] || []
      jsonldData[type].push(parsedJSON)
    } catch (e) {
      console.log(`Error in jsonld parse - ${e}`)
    }
  })

  return jsonldData
}
