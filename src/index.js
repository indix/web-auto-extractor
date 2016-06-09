import $ from 'cheerio'
import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'

const WAEParsedObject = {
  find () {

  }
}

const WAEObject = {
  parseMicrodata () {
    return Object.assign({}, WAEParsedObject, MicroRdfaParser(this.$html, 'micro'))
  },
  parseRdfa () {
    return Object.assign({}, WAEParsedObject, MicroRdfaParser(this.$html, 'rdfa'))
  },
  parseJsonld () {
    return JsonldParser(this.$html)
  },
  parseMetaTags () {
    return Object.assign({}, WAEParsedObject, MetaTagsParser(this.$html))
  },
  parse () {
    return {
      meta: this.parseMetaTags().normalize(),
      micro: this.parseMicrodata().normalize(),
      rdfa: this.parseRdfa().normalize(),
      jsonld: this.parseJsonld()
    }
  }
}

export default {
  init (html) {
    const $html = $.load(html, { xmlMode: true })
    return Object.assign({}, WAEObject, {
      $html
    })
  }
}
