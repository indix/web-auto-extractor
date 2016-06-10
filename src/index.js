import $ from 'cheerio'
import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'

const WAEParserObject = () => {
  let result = {}
  return {
    find (propName) {
      if (!result[propName]) {
        result[propName] = []
        const items = this.unnormalizedData()
        Object.keys(items).forEach(key => {
          const item = items[key]
          if (item.name === propName) {
            result[propName].push(item)
          }
        })
      }
      return result[propName]
    }
  }
}

const WAEObject = (function () {
  let micro, rdfa, jsonld, meta
  return {
    parseMicrodata () {
      if (!micro) {
        micro = Object.assign(WAEParserObject(), MicroRdfaParser(this.$html, 'micro'))
      }
      return micro
    },
    parseRdfa () {
      if (!rdfa) {
        rdfa = Object.assign(WAEParserObject(), MicroRdfaParser(this.$html, 'rdfa'))
      }
      return rdfa
    },
    parseJsonld () {
      if (!jsonld) {
        jsonld = Object.assign(WAEParserObject(), JsonldParser(this.$html))
      }
      return jsonld
    },
    parseMetaTags () {
      if (!meta) {
        meta = Object.assign(WAEParserObject(), MetaTagsParser(this.$html))
      }
      return meta
    },
    parse () {
      return {
        meta: this.parseMetaTags().data(),
        micro: this.parseMicrodata().data(),
        rdfa: this.parseRdfa().data(),
        jsonld: this.parseJsonld().data()
      }
    }
  }
})()

export default {
  init (html) {
    const $html = $.load(html, { xmlMode: true })
    return Object.assign({}, WAEObject, {
      $html
    })
  }
}
