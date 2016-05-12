import 'babel-polyfill'
import koa from 'koa'
import Router from 'koa-router'
import Parsers from './parsers'

let app = koa()
const PORT = 3000

let router = new Router()

router
  .get('/', function * (next) {
    this.body = 'Hello World'
  })
  .get('/parse', function * (next) {
    this.type = 'json'
    this.status = 200
    this.body = Parsers.parse('')
  })

app
  .use(router.routes())

app.listen(PORT)
console.log('Server listening on port ' + PORT)
