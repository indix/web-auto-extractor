/* eslint-env mocha */
import parse, { resolve } from '../../src/parsers/micro-rfda-parser'
import fs from 'fs'
import $ from 'cheerio'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample.html')
    const microdata = parse($.load(html), 'micro')
    const resolvedMicrodata = resolve(microdata)
    console.log(JSON.stringify(resolvedMicrodata, null, 2))
  })
})
