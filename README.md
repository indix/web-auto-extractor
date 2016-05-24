# Web Auto Extractor
[![Build Status](https://travis-ci.org/ind9/web-auto-extractor.svg?branch=master)](https://travis-ci.org/ind9/web-auto-extractor)

Automatically extracts semantically structured information from any HTML webpage.

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
import parseWeb from 'web-auto-extractor'
import fs from 'fs'

const html = fs.readFileSync('test/resources/microdata.html', { encoding: 'utf-8' })

const data = parseWeb(html)
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

The output will be a JSON in JSON-LD format

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

You can also pass in a configuration object to the function
```
const config = {
  normalize: false,
  withSelector: true
}

const data = parseWeb(html, config)
```
### Supported options:-

#### withSelector
default: false

Set to true if you'd want the result to include the `selector` object.

The `selector` object provides you with two fields:-

- `select`: The css-selector of the HTMLElement
- `extract`: The HTMLElement property from which the `value` object was extracted from.

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

Set to false if you'd want to work with the intermediate non-normalized result.

See [relevant output](https://github.com/ind9/web-auto-extractor/blob/master/test/resources/nonNormalizedResult.json) in test case.
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

[See test cases](https://github.com/ind9/web-auto-extractor/blob/master/test/test.js) for more examples.
