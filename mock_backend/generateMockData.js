/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

var jsf = require('json-schema-faker')
var mockDataSchema = require('./mockDataSchema')
var fs = require('fs')

jsf.extend('faker', function() {
  return require('faker')
})

var json = JSON.stringify(jsf(mockDataSchema))

fs.writeFile('./mock_backend/db.json', json, { flag: 'w' }, function(err) {
  if (err) {
    return console.log(err)
  } else {
    console.log('Mock data generated.')
  }
})
