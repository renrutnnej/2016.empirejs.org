'use strict';

module.exports = (server) => {
  server.get('/', (req, res) => {
    res.render('index', { layout: 'layouts/main' });
  });
};
