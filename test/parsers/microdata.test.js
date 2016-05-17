/* eslint-env mocha */
import parseMicrodata, { resolveMicrodata } from '../../src/parsers/microdata-parser'
import fs from 'fs'
import $ from 'cheerio'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample.html')
    const microdata = parseMicrodata($.load(html))
    const resolvedMicrodata = resolveMicrodata(microdata)
    resolvedMicrodata
    // console.log(JSON.stringify(resolvedMicrodata, null, 2))
  })
})
