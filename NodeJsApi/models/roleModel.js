/**
 * Role Model
 */

 var mysql       = require('../config/mysql');
 var Bookshelf   = require('bookshelf')(mysql);
 var config      = require('../config/env');
 var jwt         = require("jsonwebtoken");
 var _           = require("lodash");
 var User     = require("./userModel");
 var Promise     = require("bluebird");

 var RoleModel = Bookshelf.Model.extend({

     tableName: 'roles',

     users:function(){
       return this.hasMany(User);
     }

   });

   module.exports = RoleModel;
