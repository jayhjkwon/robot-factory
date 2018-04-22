var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var debug = require('debug')('my-express-app:server')
var http = require('http')
var fs = require('fs')
const _ = require('lodash')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./mock_backend/db.json')
const db = low(adapter)
const lodashId = require('lodash-id')

db._.mixin(lodashId)

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const publicFolder = path.join(__dirname, 'build')
app.use(express.static(publicFolder))

app.get('/robots.json', (req, res, next) => {
  const robots = db.get('robots').value()
  res.json(robots)
})

app.post('/robots/:id/extinguish.json', (req, res, next) => {
  const removedRobots = db
    .get('robots')
    .removeById(req.params.id)
    .write()

  res.json(true)
})

app.post('/robots/recycle.json', (req, res, next) => {
  const ids = req.body.recycleRobots
  const removedRobots = db
    .get('robots')
    .remove(n => _.includes(ids, n.id))
    .write()

  res.json(true)
})

app.put('/shipments/create', (req, res, next) => {
  // #1 remove from robots
  const ids = req.body.robotIds
  const removedRobots = db
    .get('robots')
    .remove(n => _.includes(ids, n.id))
    .write()

  // #2 insert into shipped robots
  db.defaults({ shippedRobots: [] }).write()
  removedRobots.forEach(robot => {
    db
      .get('shippedRobots')
      .push(robot)
      .write()
  })

  res.json(true)
})

app.get('/shipments.json', (req, res, next) => {
  const shippedRobots = db.get('shippedRobots').value()
  res.json(shippedRobots || [])
})

app.all('/*', function(req, res) {
  res.sendfile('index.html', { root: publicFolder })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// module.exports = app

var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
}
