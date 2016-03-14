var path = require('path')

require('dotenv').config({path: path.join(__dirname, '.env')})
require('babel-core/register')
require('babel-polyfill')

var Server = require('./server/express')

var server = new Server()

server.start()
