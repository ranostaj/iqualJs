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
        return this.recursive(options)
    },

    
    
    /**
     * Recursive tree
     * @param options
     */
    recursive: function (options) {
        var $this = this;
        var where = _.isEmpty(options) ? {} : options;
        
        function load(parent) {
           var where =  {parent_id: parent};
           return new Comments().query({where: where})
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
               .catch(function(err){
                   return err;
               })
        };

      
       return  this
           .query({where:where})
           .fetch({require:true})
           .then(function(models) {
           return Promise.map(models.toJSON(), function(model,index) {
               model.children = [];
               return load.call($this,model.id).then(function(child){
                   model.children.push( child );
                   return model;
               })
           }).then(function(collections){
                return _.filter(collections,function(o){
                    return o.id;
                })
           })
       })
    }
});

module.exports = Comments;
