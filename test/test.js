/* eslint-env mocha */
import fs from 'fs'
import { assert } from 'chai'
import WAE from '../src'

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
    const data = WAE.init(microdataHTML).parseMicrodata().normalize()
    assert.deepEqual(data, normalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = WAE.init(rdfaHTML).parseRdfa().normalize()
    assert.deepEqual(data, normalizedResult.rdfa)
  })

  it('should find embedded json-ld', function () {
    const data = WAE.init(jsonldHTML).parseJsonld()
    assert.deepEqual(data, normalizedResult.jsonld)
  })

  it('should find all supported structured information', function () {
    const data = WAE.init(mixedHTML).parse()
    assert.deepEqual(data, normalizedResult)
  })

  it('should find all microdata elements with selector', function () {
    const data = WAE.init(microdataHTML).parseMicrodata({
      withSelector: true
    }).normalize()
    assert.deepEqual(data, normalizedWithSelector.micro)
  })
})

describe('Web Auto Extractor for NON-NORMALIZED output', function () {
  it('should find all elements with microdata', function () {
    const data = WAE.init(microdataHTML).parseMicrodata().items
    assert.deepEqual(data, nonNormalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = WAE.init(rdfaHTML).parseRdfa().items
    assert.deepEqual(data, nonNormalizedResult.rdfa)
  })

  it('should find all microdata elements with selector', function () {
    const data = WAE.init(microdataHTML).parseMicrodata({
      withSelector: true
    }).items
    assert.deepEqual(data, nonNormalizedWithSelector.micro)
  })
})
