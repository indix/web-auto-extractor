import $ from 'cheerio'
import { parseMetaTags } from './metatag-parser'
import parseMicroRdfa from './micro-rdfa-parser'
import parseJsonld from './jsonld-parser'

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
