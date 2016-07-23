# Web Auto Extractor
[![Build Status](https://travis-ci.org/ind9/web-auto-extractor.svg?branch=master)](https://travis-ci.org/ind9/web-auto-extractor)

Parse semantically structured information from any HTML webpage.

Supported formats:-
- Encodings that support [Schema.org](http://schema.org/) vocabularies:-
  - Microdata
  - RDFa-lite
  - JSON-LD
- Random Meta tags

Popularly, many websites mark up their webpages with Schema.org vocabularies for better SEO. This library helps you parse that information to JSON.

**[Demo](https://tonicdev.com/npm/web-auto-extractor)** it on tonicdev

## Installation
`npm install web-auto-extractor`

## Usage

```js
// IF CommonJS
var WAE = require('web-auto-extractor').default
// IF ES6
import WAE from 'web-auto-extractor'

var parsed = WAE().parse(sampleHTML)

```

Let's use the following text as the `sampleHTML` in our example. It uses Schema.org vocabularies to structure a Product information and is encoded in `microdata` format.

```html
<div itemscope itemtype="http://schema.org/Product">
  <span itemprop="brand">ACME</span>
  <span itemprop="name">Executive Anvil</span>
  <img itemprop="image" src="anvil_executive.jpg" alt="Executive Anvil logo" />
  <span itemprop="description">Sleeker than ACME's Classic Anvil, the
    Executive Anvil is perfect for the business traveler
    looking for something to drop from a height.
  </span>
  Product #: <span itemprop="mpn">925872</span>
  <span itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">
    <span itemprop="ratingValue">4.4</span> stars, based on <span itemprop="reviewCount">89
      </span> reviews
  </span>

  <span itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    Regular price: $179.99
    <meta itemprop="priceCurrency" content="USD" />
    $<span itemprop="price">119.99</span>
    (Sale ends <time itemprop="priceValidUntil" datetime="2020-11-05">
      5 November!</time>)
    Available from: <span itemprop="seller" itemscope itemtype="http://schema.org/Organization">
                      <span itemprop="name">Executive Objects</span>
                    </span>
    Condition: <link itemprop="itemCondition" href="http://schema.org/UsedCondition"/>Previously owned,
      in excellent condition
    <link itemprop="availability" href="http://schema.org/InStock"/>In stock! Order now!</span>
  </span>
</div>
```

#### Result

Our `parsed` object should look like -

```json
{
  "microdata": {
    "Product": [
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
  },
  "rdfa": {},
  "jsonld": {},
  "metatags": {
    "priceCurrency": [
      "USD",
      "USD"
    ]
  }
}
```

The `parsed` object includes four objects - `microdata`, `rdfa`, `jsonld` and `metatags`. Since the above HTML does not have any information encoded in `rdfa` and `jsonld`, those two objects are empty.

## Caveat

I wouldn't call it a caveat but rather the parser is strict by design. It might not parse like expected if the HTML isn't encoded correctly, so one might assume the parser is broken.

For example, take the following HTML snippet.

```html
<div itemscope itemtype="http://schema.org/Movie">
  <h1 itemprop="name">Ghostbusters</h1>
  <div itemprop="productionCompany" itemscope itemtype="http://schema.org/Organization">Black Rhino</div>
  <div itemprop="countryOfOrigin" itemscope itemtype="http://schema.org/Country">
    Country: <span itemprop="name" content="USA">United States</span><p>
  </div>
</div>
```

The problem here is the `itemprop` - `productionCompany` which is of `itemtype` - `Organization` doesn't have any `itemprop` as its children, in this case - `name`.

The parser assumes every `itemtype` contains an `itemprop`, or every `typeof` contains a `property` in case of `rdfa`. So the `"Black Rhino"` information is lost.

It'll be nice to fix this by having a `non-strict` mode for parsing this information. PRs are welcome.

## License

MIT
