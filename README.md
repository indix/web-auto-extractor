# Web Auto Extractor [![Build Status](https://travis-ci.org/ind9/web-auto-extractor.svg?branch=master)](https://travis-ci.org/ind9/web-auto-extractor)

Automatically extracts semantically structured information from a HTML webpage.

Supported formats:-
- Formats that support Schema.org vocabularies:-
  - Microdata
  - RDFa-lite
  - JSON-LD
- meta tags

## Installation
`npm install web-auto-extractor`

## Example
Sample code:-
```
import parse from 'web-auto-extractor' // You can use any name in place of "parse"
import fs from 'fs'

const html = fs.readFileSync('test/resources/microdata.html', { encoding: 'utf-8' })

const data = parse(html)
console.log(data.micro)     // Microdata Result
//console.log(data.rdfa)    // RDFa-Lite Result
//console.log(data.jsonld)  // JSON-LD Result
//console.log(data.meta)    // Meta tags Result
```
CommonJS import style:-

```
var parse = require('web-auto-extractor').default
```

Output:-

The output will be in a JSON in JSON-LD format

```
[
  {
    "@context": "http://schema.org/",
    "@type": "Product",
    "brand": "ACME",
    "name": "Executive Anvil",
    "image": "anvil_executive.jpg",
    "description": "Sleeker than ACME's Classic Anvil, the\n    Executive Anvil is perfect for the business traveler\n    looking for something to drop from a height.",
    "mpn": "925872",
    "aggregateRating": {
      "@context": "http://schema.org/",
      "@type": "AggregateRating",
      "ratingValue": "4.4",
      "reviewCount": "89"
    },
    "offers": {
      "@context": "http://schema.org/",
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "119.99",
      "priceValidUntil": "5 November!",
      "seller": {
        "@context": "http://schema.org/",
        "@type": "Organization",
        "name": "Executive Objects"
      },
      "itemCondition": "http://schema.org/UsedCondition",
      "availability": "http://schema.org/InStock"
    }
  }
]
```

## Configuration

You can also pass in a config object to the function like:-
```
const config = {
  normalize: false,
  withSelector: true
}

const data = parse(html, config)
```
### Supported options:-

#### withSelector
default: false

Set to true if you'd want the result to include the `selector` object.

The `selector` object provides you with the css-selector (`select`) along with the property from with the `value` object was extracted from (`extract`).
```
[
    {
      "@context": "http://schema.org/",
      "@type": "Product",
      "image": {
        "value": "anvil_executive.jpg",
        "selector": {
          "select": "[itemtype=\"http://schema.org/Product\"]:eq(0) [itemprop=\"image\"]:eq(1)",
          "extract": {
            "attr": "src"
          }
        }
      },
      "name": {
        "value": "Executive Anvil",
        "selector": {
          "select": "[itemtype=\"http://schema.org/Product\"]:eq(0) [itemprop=\"name\"]:eq(1)",
          "extract": {
            "attr": "@text"
          }
        }
      },
    ...
    ...
]
```
#### normalize
default: true

Set to false if you want to work with the intermediate non-normalized result.

See [relevant test output](https://github.com/ind9/web-auto-extractor/blob/master/test/resources/nonNormalizedResult.json)
```
//The keys are the md5 hash of the respective HTML element
{
  "ed08397308d9c31da5e50485f2dfe184": {   
    "context": "http://schema.org/",
    "type": "Product",
    "name": "Product",
    "value": null,
    "properties": {
      "brand": [
      "e3abccbeed2389fd64e4fe57439c4ab6"
      ],
      "name": [
      "8da2f7f6cb7e420b13442c075d4a1a17"
      ],
      ...
      ...
      },
      "parentTypeId": null
      },
      "e3abccbeed2389fd64e4fe57439c4ab6": {
        "name": "brand",
        "value": "ACME",
        "properties": {},
        "parentTypeId": "ed08397308d9c31da5e50485f2dfe184"
        },
      "8da2f7f6cb7e420b13442c075d4a1a17": {
        "name": "name",
        "value": "Executive Anvil",
        "properties": {},
        "parentTypeId": "ed08397308d9c31da5e50485f2dfe184"
        },
      ...
      ...
    }
  }
  ...
}
```
