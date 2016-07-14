import 'babel-polyfill'
import $ from 'cheerio'
import cheerioAdv from 'cheerio-advanced-selectors'
import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'

export default {
  async parse (html) {
    const $html = cheerioAdv.wrap($).load(html, { xmlMode: true })
    return {
      metaTags: MetaTagsParser($html),
      microdata: await MicroRdfaParser(html, 'micro', $html),
      rdfa: await MicroRdfaParser(html, 'rdfa', $html),
      jsonld: JsonldParser($html)
    }
  }
}
