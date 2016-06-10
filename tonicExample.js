var WAE = require('web-auto-extractor').default
var request = require('request')
var pageUrl = 'http://southernafricatravel.com/'

request(pageUrl, function (error, response, body) {
  var wae = WAE.init(body)
  console.log(wae.parse())

  // Useful operations for you to try. Refer API section in README for more.
  // var waeMicrodata = wae.parseMicrodata()
  // console.log(waeMicrodata.data())
  //
  // var images = waeMicrodata.find('telephone')
  // console.log(images)
})
