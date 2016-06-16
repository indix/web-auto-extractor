# Web Auto Extractor
[![Build Status](https://travis-ci.org/ind9/web-auto-extractor.svg?branch=master)](https://travis-ci.org/ind9/web-auto-extractor)

Automatically extracts semantically structured information from any HTML webpage.

Supported formats:-
- Formats that support Schema.org vocabularies:-
  - Microdata
  - RDFa-lite
  - JSON-LD
- Miscellaneous meta tags

**[Demo](https://tonicdev.com/npm/web-auto-extractor)** it on tonicdev

```js
var WAE = require('web-auto-extractor').default
//ES6: import WAE from 'web-auto-extractor'
var wae = WAE.parse(sampleHTML)
console.log(wae)
  /*
    OUTPUT
    ======
    {
      microdata: { data: {..}, unnormalizedData: {..} },
      rdfa: { data: {..}, unnormalizedData: {..} },
      jsonld: { data: {..}, unnormalizedData: null,
      metaTags: { data: {..}, unnormalizedData: {..} }
    }
  */
```

### Installation
`npm install web-auto-extractor`


### Usage

#### Import
```js
> var WAE = require('web-auto-extractor').default
//ES6: import WAE from 'web-auto-extractor'
```

Lets use this `sampleHTML` for our example
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

#### Parsing
```js
> var wae = WAE.parse(sampleHTML)
```
This returns an object with the following attributes, each of which is of the type [WAEParserObject](#waeparserobject-attributes).

- microdata
- rdfa
- jsonld
- metaTags

```js
// Since our sampleHTML uses microdata
> var parsedMicrodata = wae.microdata
```

##### WAEParserObject Attributes

###### .data
Gets the normalized result of the parsed format.

```js
// Let's print this out for our example
> parsedMicrodata.data
```
OUTPUT:
```json
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

###### .unnormalizedData
Gets the unnormalized flattened intermediate result of the parsed format which includes meta information relating to the parsed properties.

For more examples, [See this output here](https://github.com/ind9/web-auto-extractor/blob/master/test/resources/expectedResult.json) which uses [this HTML](https://github.com/ind9/web-auto-extractor/blob/master/test/resources/testPage.html)
