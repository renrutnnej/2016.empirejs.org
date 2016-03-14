'use strict'

require('babel-core/register')

require('babel-polyfill')

var Server = require('./server/express')

var server = new Server()

server.start()
