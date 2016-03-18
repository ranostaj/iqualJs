/**
 * Users Collection
 */

 var User   = require('../models/userModel');
 var mysql       = require('../config/mysql');
 var Bookshelf   = require('bookshelf')(mysql);

 var Users = Bookshelf.Collection.extend({
      model: User,

      getAll: function(options) {
          return this.fetch(options);
      }
 });

module.exports = Users;
