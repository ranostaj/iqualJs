/**
 * App Model
 *
 */

var _ = require('lodash');

var appModel = {

    /**
     * View single Model item
     * @param id
     * @param assoc
     */
    view: function (id, assoc) {
        var options = _.assign({require: true}, !_.isEmpty(assoc) ? {withRelated: assoc} : {});
        return this.where({id: id})
            .fetch(options)
            .then(function (model) {
                return model;
            })
            .catch(function(err){
                return err;
            });
    },

    /**
     * Remove model
     * @param id
     */
    remove: function (id) {
        return this.where({id: id})
            .fetch({
                require: true
            })
            .then(function (model) {
                return model.destroy();
            });
    },

    /**
     * Update Model
     * @param data
     */
    update: function (id, data) {
        return new this({id: id}).fetch({
               require: true
            })
            .then(function (model) {
               return  model.save(data, {method: "update"})
                    .then(function (model) {
                        return model;
                    })
                    .catch(function (error) {
                        return error;
                    });
            })
            .catch(function (error) {
                return error;
            });
    },

    /**
     * Save new model
     * @param data
     */
    add: function (data) {
        return new this(data).save(data, {method: "insert"})
            .then(function (model) {
                return model;
            })
            .catch(function (error) {
                return error;
            });
    }
};


module.exports = appModel;