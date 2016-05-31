import 'babel-polyfill'
import $ from 'cheerio'
import { parseMetaTags } from './parsers/metatag-parser'
import parseMicroRdfa from './parsers/micro-rdfa-parser'
import parseJsonld from './parsers/jsonld-parser'

export default function (html, config = {}) {
  const $html = $.load(html, { xmlMode: true })
  const meta = parseMetaTags($html, config)
  const micro = parseMicroRdfa($html, 'micro', config)
  const rdfa = parseMicroRdfa($html, 'rdfa', config)
  const jsonld = parseJsonld($html, config)
  return {
    meta,
    micro,
    rdfa,
    jsonld
  }
}
