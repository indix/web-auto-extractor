import cheerio from 'cheerio'

export let getElementsWithMicrodata = function (html) {
  let $ = cheerio.load(html)
  let a = $('[itemscope]')
  return a
}
