import bodyParser      from 'body-parser'
import {chalk, logger} from '../lib/logger'
import express         from 'express'
import fs              from 'fs'
import glob            from 'glob'
import hbs             from 'hbs'
import path            from 'path'
import serveStatic     from 'serve-static'

function removePoweredBy(req, res, next) {
  res.removeHeader('X-Powered-By')
  next()
}

var cwd = process.cwd()

class Server {

  constructor() {

    this.server = express()

    this.server.use(serveStatic(path.join(__dirname, '../public')))
    this.server.use(bodyParser.urlencoded({extended: true}))
    this.server.use(bodyParser.json({strict: false}))
    this.server.use(removePoweredBy)
    this.server.use(this.logRequestInfo)

    this.server.set('views', path.join(__dirname, '../views'))
    this.server.set('view engine', 'hbs')
    this.server.engine('hbs', hbs.__express)

    this.loadHelpers()
    this.loadPartials()
    this.loadRoutes()

  }

  loadHelpers() {

    var helpers = glob.sync('./views/helpers/**/*.js', {cwd})
    console.error('helpers list', helpers)
    helpers.forEach( function(helper) {
      console.error('helper', helper)
      require(path.join(cwd, helper))(hbs)

    })

  }

  loadPartials() {
    var partials = glob.sync('./views/partials/**/*.hbs', {cwd})

    partials.forEach( function(partial) {

      var matches = partial.split('.hbs')

      if (!matches) {
        return
      }

      var name = matches[0].replace('./views/', '')
      var template = fs.readFileSync(path.join(cwd, partial), 'utf8')

      hbs.registerPartial(name, template)

    })

    var partialLoaders = glob.sync('../views/partials/**/*.js')

    partialLoaders.forEach( function(partialLoader) {

      require(path.join(cwd, partialLoader))(hbs)

    })
  }

  loadRoutes() {
    require('./routes')(this.server)
  }

  logRequestInfo(req, res, next) {

    logger.info(req.method, req.originalUrl)
    next()

  }

  start() {

    this.server = this.server.listen(process.env.EXPRESS_PORT)

  }

  stop() {

    this.server.close()

  }

  use() {

    this.server.use.apply(this.server, arguments)

  }

}

module.exports = Server
