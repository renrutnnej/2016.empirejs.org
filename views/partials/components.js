'use strict';

var fs = require('fs'),
    glob = require('glob'),
    path = require('path');

//
// This should really go into paradigm-load-handlebars-extras
// but putting it here for speed.
//
module.exports = (Handlebars) => {

  var basePath = path.join(__dirname, '..');
  var components = glob.sync(path.join(basePath, 'components', '*.hbs'));
  components.forEach(function (component) {
    var filename = path.basename(component, '.hbs');
    var name = 'components/' + filename.replace(basePath + '/', '');

    console.log('Registering %s', name);
    Handlebars.registerPartial(name, fs.readFileSync(component, 'utf8'));
  });
}
