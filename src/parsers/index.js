import $ from 'cheerio'
import { parseMetaTags } from './metatag-parser'
import parseMicroRdfa from './micro-rdfa-parser'
import parseJsonld from './jsonld-parser'

export default function (html) {
  const $html = $.load(html)
  const meta = parseMetaTags($html)
  const micro = parseMicroRdfa($html, 'micro')
  const rdfa = parseMicroRdfa($html, 'rdfa')
  const jsonld = parseJsonld($html)
  return {
    meta,
    micro,
    rdfa,
    jsonld
  }
}
