var WAE = require('web-auto-extractor').default
var request = require('request')
var pageUrl = 'http://southernafricatravel.com/'

request(pageUrl, function (error, response, body) {
  console.log(WAE.init(body).parse())
})
