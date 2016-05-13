/* eslint-env mocha */
import MicrodataParser from '../../src/parsers/microdata-parser'
import fs from 'fs'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample_2.html')
    const microdataParser = new MicrodataParser(html)
    console.log(JSON.stringify(microdataParser.parse(), null, 2))
  })
})
