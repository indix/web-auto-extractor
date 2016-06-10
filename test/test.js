/* eslint-env mocha */
import fs from 'fs'
import { assert } from 'chai'
import WAE from '../src'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })
const normalizedResult = JSON.parse(fileReader('test/resources/normalizedResult.json'))
const nonNormalizedResult = JSON.parse(fileReader('test/resources/nonNormalized.json'))
const microdataHTML = fileReader('test/resources/microdata.html')
const rdfaHTML = fileReader('test/resources/rdfa-lite.html')
const jsonldHTML = fileReader('test/resources/json-ld.html')
const mixedHTML = fileReader('test/resources/mixed.html')

describe('Web Auto Extractor for NORMALIZED output', function () {
  it('should find all elements with microdata', function () {
    const data = WAE.init(microdataHTML).parseMicrodata().data()
    assert.deepEqual(data, normalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = WAE.init(rdfaHTML).parseRdfa().data()
    assert.deepEqual(data, normalizedResult.rdfa)
  })

  it('should find embedded json-ld', function () {
    const data = WAE.init(jsonldHTML).parseJsonld().data()
    assert.deepEqual(data, normalizedResult.jsonld)
  })

  it('should find all supported structured information', function () {
    const data = WAE.init(mixedHTML).parse()
    assert.deepEqual(data, normalizedResult)
  })
})

describe('Web Auto Extractor for NON-NORMALIZED output', function () {
  it('should find all elements with microdata', function () {
    const data = WAE.init(microdataHTML).parseMicrodata().unnormalizedData()
    assert.deepEqual(data, nonNormalizedResult.micro)
  })

  it('should find all elements with rdfa', function () {
    const data = WAE.init(rdfaHTML).parseRdfa().unnormalizedData()
    assert.deepEqual(data, nonNormalizedResult.rdfa)
  })
})

describe('WAEParserObject', function () {
  it('should use find() to find properties', function () {
    const expectedResult = [
      {
        name: 'image',
        value: 'anvil_executive.jpg',
        properties: {},
        parentTypeId: 'ed08397308d9c31da5e50485f2dfe184',
        selector: {
          select: '[itemtype="http://schema.org/Product"]:eq(0) [itemprop="image"]:eq(1)',
          extract: {
            attr: 'src'
          }
        }
      }
    ]
    const waeMicro = WAE.init(microdataHTML).parseMicrodata()
    const actualResult = waeMicro.find('image')
    assert.deepEqual(expectedResult, actualResult)
  })
})
