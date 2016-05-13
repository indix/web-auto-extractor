/* eslint-env mocha */
import { parseMicrodataItems } from '../../src/parsers/microdata-parser'
import fs from 'fs'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample.html')
    const elem = parseMicrodataItems(html)
    console.log(JSON.stringify(elem, null, 2))
    return elem
  })
})
