/* eslint-env mocha */
import parse from '../src/parsers'

import fs from 'fs'

describe('Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/microdata.html', { encoding: 'utf-8' })
    const microdata = parse(html)
    console.log(JSON.stringify(microdata, null, 2))
  })

  it('should find all elements with rdfa', function () {
    const html = fs.readFileSync('test/resources/rdfa-lite.html', { encoding: 'utf-8' })
    const rdfaData = parse(html)
    console.log(JSON.stringify(rdfaData, null, 2))
  })

  it('should find embeded json-ld', function () {
    const html = fs.readFileSync('test/resources/json-ld.html', { encoding: 'utf-8' })
    const jsonldData = parse(html)
    console.log(JSON.stringify(jsonldData, null, 2))
  })

  it('should find all supported structured information', function () {
    const html = fs.readFileSync('test/resources/rdfa-lite.html', { encoding: 'utf-8' })
    const data = parse(html)
    console.log(JSON.stringify(data, null, 2))
  })
})
