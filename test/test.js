/* eslint-env mocha */
import parse, { resolve } from '../src/parsers/micro-rdfa-parser'
import fs from 'fs'

describe('Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/microdata.html', { encoding: 'utf-8' })
    const microdata = parse(html, 'micro')
    const resolvedMicrodata = resolve(microdata)
    console.log(JSON.stringify(resolvedMicrodata, null, 2))
  })

  it('should find all elements with rdfa', function () {
    const html = fs.readFileSync('test/resources/rdfa-lite.html', { encoding: 'utf-8' })
    const rdfaData = parse(html, 'rdfa')
    const resolvedRdfa = resolve(rdfaData)
    console.log(JSON.stringify(resolvedRdfa, null, 2))
  })
})
