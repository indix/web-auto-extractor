/* eslint-env mocha */
import { getElementsWithMicrodata } from '../../src/parsers/microdata-parser'
import fs from 'fs'

describe('Microdata Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/sample.html')
    const elem = getElementsWithMicrodata(html)
    return elem
  })
})
