import 'babel-polyfill'
import $ from 'cheerio'
import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'

export default {
  parse (html, $html) {
    if (!($html && $html.prototype && $html.prototype.cheerio)) {
      $html = $.load(html, { xmlMode: true })
    }

    return {
      metatags: MetaTagsParser($html),
      microdata: MicroRdfaParser(html, 'micro'),
      rdfa: MicroRdfaParser(html, 'rdfa'),
      jsonld: JsonldParser($html)
    }
  }
}
