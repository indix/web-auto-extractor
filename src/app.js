import 'babel-polyfill'
import koa from 'koa'

let app = koa()
const PORT = 3000

app.use(function * () {
  this.body = 'Hello World'
})

app.listen(PORT)
console.log('Server listening on port ' + PORT)
