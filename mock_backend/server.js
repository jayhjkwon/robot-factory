// server.js
var fs = require('fs')
const _ = require('lodash')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./mock_backend/db.json')
const db = low(adapter)
const lodashId = require('lodash-id')

db._.mixin(lodashId)

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./mock_backend/db.json')
const middlewares = jsonServer.defaults()

server.use(jsonServer.bodyParser)
server.use(middlewares)

/* custom routes --> */
server.get('/robots.json', (req, res, next) => {
  const robots = db.get('robots').value()
  res.json(robots)
})

server.post('/robots/:id/extinguish.json', (req, res, next) => {
  const removedRobots = db
    .get('robots')
    .removeById(req.params.id)
    .write()

  res.json(true)
})

server.post('/robots/recycle.json', (req, res, next) => {
  const ids = req.body.recycleRobots
  const removedRobots = db
    .get('robots')
    .remove(n => _.includes(ids, n.id))
    .write()

  res.json(true)
})

server.put('/shipments/create', (req, res, next) => {
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

server.get('/shipments.json', (req, res, next) => {
  const shippedRobots = db.get('shippedRobots').value()
  res.json(shippedRobots || [])
})
/* <-- custom routes */

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})
