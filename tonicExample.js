var WAE = require('web-auto-extractor').default
//ES6: import WAE from 'web-auto-extractor'
var request = require('request')

var pageUrl = 'http://southernafricatravel.com/'
//var pageUrl = 'https://raw.githubusercontent.com/ind9/web-auto-extractor/master/test/resources/testPage.html'

request(pageUrl, function (error, response, body) {

  var wae = WAE()

  var parsed = wae.parse(body)

  console.log(wae)

})
