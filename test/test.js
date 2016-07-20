/* eslint-env mocha */
import 'babel-polyfill'
import fs from 'fs'
import { assert } from 'chai'
import WAE from '../src'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })
const expectedResult = JSON.parse(fileReader('test/resources/expectedResult.json'))
const testPage = fileReader('test/resources/testPage.html')
const { microdata, rdfa, metatags, jsonld } = WAE().parse(testPage)

describe('Web Auto Extractor', function () {
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
    assert.deepEqual(metatags, expectedResult.metatags)
  })
})
