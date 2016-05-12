import cheerio from 'cheerio'
import { parseMetaTags } from './metatag-parser'

const parse = function (html) {
  const $ = cheerio.load(html)
  const parsedMetaTags = parseMetaTags($)
  return parsedMetaTags
}

export default {
  parse,
  parseMetaTags
}
