/* eslint-env mocha */
import 'babel-polyfill'
import fs from 'fs'
import { assert } from 'chai'
import WAE from '../src'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })
const expectedResult = JSON.parse(fileReader('test/resources/expectedResult.json'))
const testPage = fileReader('test/resources/testPage.html')
let microdata, rdfa, metaTags, jsonld

describe('Web Auto Extractor', function () {
  before(async function () {
    const result = await WAE.parse(testPage)
    microdata = result.microdata
    rdfa = result.rdfa
    metaTags = result.metaTags
    jsonld = result.jsonld
  })
  it('should find all elements with microdata', function () {
    assert.deepEqual(microdata, expectedResult.microdata)
  })

  it('should find all elements with rdfa', function () {
    assert.deepEqual(rdfa, expectedResult.rdfa)
  })

  it('should find embedded json-ld', function () {
    assert.deepEqual(jsonld, expectedResult.jsonld)
  })

  it('should find embedded meta tags', function () {
    assert.deepEqual(metaTags, expectedResult.metaTags)
  })
})
