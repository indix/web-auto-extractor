/* eslint-env mocha */
import fs from 'fs'
import { assert } from 'chai'
import parse from '../src/parsers'
import parseMicroRdfa from '../src/parsers/micro-rdfa-parser'
import parseJsonld from '../src/parsers/jsonld-parser'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })
const normalizedResult = JSON.parse(fileReader('test/resources/normalizedResult.json'))
const nonNormalizedResult = JSON.parse(fileReader('test/resources/nonNormalizedResult.json'))
const normalizedWithSelector = JSON.parse(fileReader('test/resources/normalizedWithSelector.json'))
const nonNormalizedWithSelector = JSON.parse(fileReader('test/resources/nonNormalizedWithSelector.json'))
const microdataHTML = fileReader('test/resources/microdata.html')
const rdfaHTML = fileReader('test/resources/rdfa-lite.html')
const jsonldHTML = fileReader('test/resources/json-ld.html')
const mixedHTML = fileReader('test/resources/mixed.html')

describe('Web Auto Extractor for NORMALIZED output', function () {
  it('should find all elements with microdata', function () {
    const data = parseMicroRdfa(microdataHTML, 'micro')
    assert.deepEqual(data, normalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = parseMicroRdfa(rdfaHTML, 'rdfa')
    assert.deepEqual(data, normalizedResult.rdfa)
  })

  it('should find embedded json-ld', function () {
    const data = parseJsonld(jsonldHTML)
    assert.deepEqual(data, normalizedResult.jsonld)
  })

  it('should find all supported structured information', function () {
    const data = parse(mixedHTML)
    assert.deepEqual(data, normalizedResult)
  })

  it('should find all elements with selector', function () {
    const data = parse(mixedHTML, {
      withSelector: true
    })
    assert.deepEqual(data, normalizedWithSelector)
  })
})

describe('Web Auto Extractor for NON-NORMALIZED output', function () {
  it('should find all elements with microdata', function () {
    const data = parseMicroRdfa(microdataHTML, 'micro', {
      normalize: false
    })
    assert.deepEqual(data, nonNormalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = parseMicroRdfa(rdfaHTML, 'rdfa', {
      normalize: false
    })
    assert.deepEqual(data, nonNormalizedResult.rdfa)
  })

  it('should find all elements with selector', function () {
    const data = parse(mixedHTML, {
      normalize: false,
      withSelector: true
    })
    assert.deepEqual(data, nonNormalizedWithSelector)
  })
})
