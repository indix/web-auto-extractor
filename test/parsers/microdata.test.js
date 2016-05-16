/* eslint-env mocha */
import parseMicrodata, { resolveMicrodata } from '../../src/parsers/microdata-parser'
import fs from 'fs'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample.html')
    const microdata = parseMicrodata(html)
    const resolvedMicrodata = resolveMicrodata(microdata)
    console.log(JSON.stringify(resolvedMicrodata, null, 2))
  })
})
