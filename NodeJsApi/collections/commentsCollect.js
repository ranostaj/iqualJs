/**
 * Comments Collection
 */

var Comment = require('../models/commentModel');
var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var _ = require("lodash");
var Promise = require("bluebird");

var Comments = Bookshelf.Collection.extend({
    model: Comment,

    getAll: function (options) {
        return this.recursive()
    },

    recursive: function () {
        var $this = this;

        function load(parent) {
           var where =  {parent_id: parent}
           return this
                .query({where: where})
                .fetch()
                .then(function(models) {

                    return Promise.map(models.toJSON(), function(model,index) {
                        model.children = [];
                        return load.call($this,model.id).then(function(child){
                            model.children.push(child);
                            return model;
                        });
                    })
                })
        };


       return load.call($this,0);
    }
});

module.exports = Comments;
