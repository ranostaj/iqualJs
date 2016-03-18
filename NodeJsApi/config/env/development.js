/**
 * Development enviroment config
 */

var conf = {

  token: {
      expire: 5000,
  },
  database:  {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'iqual_demo',
    charset  : 'utf8'
  }
};

module.exports = conf;
