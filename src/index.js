import $ from 'cheerio'
import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'

const WAEParsedObject = {
  find () {

  }
}

const WAEObject = {
  parseMicrodata (config = {}) {
    return Object.assign({}, WAEParsedObject, MicroRdfaParser(this.$html, 'micro', config))
  },
  parseRdfa (config = {}) {
    return Object.assign({}, WAEParsedObject, MicroRdfaParser(this.$html, 'rdfa', config))
  },
  parseJsonld (config = {}) {
    return JsonldParser(this.$html, config)
  },
  parseMetaTags (config = {}) {
    return MetaTagsParser(this.$html, config)
  },
  parse () {
    return {
      meta: this.parseMetaTags(),
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
