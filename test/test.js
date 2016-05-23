/* eslint-env mocha */
import fs from 'fs'
import { assert } from 'chai'
import parse from '../src/parsers'
import parseMicroRdfa from '../src/parsers/micro-rdfa-parser'
import parseJsonld from '../src/parsers/jsonld-parser'

describe('Parser', function () {
  let normalizedResult, nonNormalizedResult, microdataHTML, rdfaHTML, jsonldHTML, mixedHTML

  before(function () {
    let fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })
    normalizedResult = JSON.parse(fileReader('test/resources/normalizedResult.json'))
    nonNormalizedResult = JSON.parse(fileReader('test/resources/nonNormalizedResult.json'))
    microdataHTML = fileReader('test/resources/microdata.html')
    rdfaHTML = fileReader('test/resources/rdfa-lite.html')
    jsonldHTML = fileReader('test/resources/json-ld.html')
    mixedHTML = fileReader('test/resources/mixed.html')
  })

  it('should find all elements with microdata in NORMALIZED format', function () {
    const data = parseMicroRdfa(microdataHTML, 'micro')
    assert.deepEqual(data, normalizedResult.micro)
  })

  it('should find all elements with microdata in NON-NORMALIZED format', function () {
    const data = parseMicroRdfa(microdataHTML, 'micro', {
      normalize: false
    })
    assert.deepEqual(data, nonNormalizedResult.micro)
  })

  it('should find all elements with rdfa in NORMALIZED format', function () {
    const data = parseMicroRdfa(rdfaHTML, 'rdfa')
    assert.deepEqual(data, normalizedResult.rdfa)
  })

  it('should find all elements with rdfa in NON-NORMALIZED format', function () {
    const data = parseMicroRdfa(rdfaHTML, 'rdfa', {
      normalize: false
    })
    assert.deepEqual(data, nonNormalizedResult.rdfa)
  })

  it('should find embedded json-ld in NORMALIZED format', function () {
    const data = parseJsonld(jsonldHTML)
    assert.deepEqual(data, normalizedResult.jsonld)
  })

  it('should find all supported structured information in NORMALIZED format', function () {
    const data = parse(mixedHTML)
    assert.deepEqual(data, normalizedResult)
  })
})
