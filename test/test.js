/* eslint-env mocha */
import parse from '../src/parsers'
import fs from 'fs'
import { assert } from 'chai'

let result = JSON.parse(fs.readFileSync('test/resources/result.json', { encoding: 'utf-8' }))

describe('Parser', function () {
  it('should find all elements with microdata', function () {
    const html = fs.readFileSync('test/resources/microdata.html', { encoding: 'utf-8' })
    const data = parse(html)
    assert.deepEqual(data.micro, result.micro)
  })

  it('should find all elements with rdfa', function () {
    const html = fs.readFileSync('test/resources/rdfa-lite.html', { encoding: 'utf-8' })
    const data = parse(html)
    assert.deepEqual(data.rdfa, result.rdfa)
  })

  it('should find embeded json-ld', function () {
    const html = fs.readFileSync('test/resources/json-ld.html', { encoding: 'utf-8' })
    const data = parse(html)
    assert.deepEqual(data.jsonld, result.jsonld)
  })

  it('should find all supported structured information', function () {
    const html = fs.readFileSync('test/resources/mixed.html', { encoding: 'utf-8' })
    const data = parse(html)
    assert.deepEqual(data, result)
  })
})
