var conf = require('./env');

var knex = require('knex')({
    client: 'mysql',
    connection: conf.database
});

module.exports = knex;
