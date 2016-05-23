import { getCheerioObject } from './utils'
import $ from 'cheerio'

export default function (html, config = {}) {
  const $html = getCheerioObject(html)
  let jsonldData = []

  $html('script[type="application/ld+json"]').each((index, item) => {
    try {
      jsonldData[index] = JSON.parse($(item).text())
    } catch (e) {
      console.log(`Error in jsonld parse - ${e}`)
    }
  })

  return jsonldData
}
