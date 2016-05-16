/* eslint-env mocha */
import parseMicrodata from '../../src/parsers/microdata-parser'
import fs from 'fs'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample_2.html')
    const microdata = parseMicrodata(html)
    console.log(JSON.stringify(microdata, null, 2))
  })
})
