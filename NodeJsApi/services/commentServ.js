/**
 * Created by ranostajj on 22.03.2016.
 */


var Comment = require('../models/commentModel');
var _ = require("lodash");
var Commentscollection = require('../collections/commentsCollect');
var Promise = require("bluebird");


var CommentService = function () {
    this.Comments = new Commentscollection();
    this.Comment = new Comment();
};



/**
 * View List of comments
 * @param options
 */
CommentService.prototype.tree = function (options) {

    var $this = this;
    var where = _.assign({parent_id : 0} , _.isEmpty(options) ? {} : options );

    return $this.Comments
        .query({where: where})
        .fetch()
        .then(function (models) {
            return Promise.map(models.models, function (model, index) {
                model.attributes.children = [];
                return $this.children.call($this, model.attributes.id).then(function (child) {
                      model.attributes.children = child;
                    return model;
                })
            })
        })
};


/**
 * View single comment
 * @param options
 */
CommentService.prototype.view = function (options) {

    var $this = this;
    var where = _.isEmpty(options) ? {} : options;

    return new Comment()
        .query({where: where})
        .fetch({require: true,withRelated:['Images'] })
        .then(function (model) {
            model.attributes.children = [];
            return $this.children.call($this, model.attributes.id).then(function (child) {
                model.attributes.children.push(child);
                return model;
            }).catch(function (error) {
                return model;
            });
        })
};


/**
 *
 * @param id comment id
 * @param removeChilds bool remove also childs?
 */
CommentService.prototype.remove = function (id, removeChilds) {

    var $this = this;

    return $this.Comment
        .where({id: id})
        .fetch()
        .then(function (model) {
            if(removeChilds) {
               $this.children.call($this, model.attributes.id)
                    .then(function (childs) {
                       return  _.map(childs,function(child){
                               child.destroy();
                       });
               });
            }

            return model.destroy();
        })
};



/**
 * Recursive load function
 * @param parent
 */
CommentService.prototype.children = function (parent) {
    var where = {parent_id: parent};
    var $this = this;
    return new Commentscollection()
        .query({where: where})
        .fetch()
        .then(function (models) {
            return Promise.map(models.models, function (model, index) {
                model.attributes.children = [];
                return $this.children.call($this, model.attributes.id)
                        .then(function (child) {
                            if(!_.isEmpty(child)) {
                                model.attributes.children = child;
                            }
                        return model;
                });
            })
        })
        .catch(function (err) {
            return err;
        })
};

module.exports = CommentService;
