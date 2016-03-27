/**
 * Comments Controller
 * @type {ProjectModel|exports|module.exports}
 */

var Comment         = require('../models/commentModel');
var CommentService  = require('../services/commentServ');
var User            = require('../models/userModel');
var Image           = require('../models/imageModel');
var crypto          = require('crypto');
var imagick         = require("imagemagick");
var _               = require("lodash");
var multer          = require('multer');
var fs              = require('fs');
var path            = require('path');


// Disk storage
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './media/comments')
    },

    filename: function (req, file, cb) {
        var ext = file.originalname.split(".").pop();
        var filename = crypto.createHash('sha256').update(file.fieldname).digest('hex') + "." + ext;
        cb(null, filename);
    }
});

/**
 * Upload Setup
 */

var upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {

        if (!new RegExp("jpeg|png").test(file.mimetype)) {
            return cb(new Error("Upload Error"));
        }

        return cb(null, true);

    }
}).single('media');


var Ctrl = function commentsCtrl() {
};


/**
 * All Projects
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.all = function (req, res, next) {
    return new CommentService()
        .tree()
        .then(function (models) {
            return res.status(200)
                .json(models);
        });
};


/**
 * Create new project
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.save = function (req, res, next) {
    return User.forge().view(req.user.hash_id)
        .then(function (user) {
            var save_data = _.assign(req.body, {user_id: user.attributes.id});
            return Comment
                .add(save_data)
                .then(function (models) {
                    return res.status(200)
                        .json(models);
                }).catch(function (error) {
                    return res.status(500).json(error);
                });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 * Update Theme
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.update = function (req, res, next) {
    var id = req.params.comment_id;
    var data = req.body;
    return Comment.update(id, data)
        .then(function (saved) {
            return res
                .status(200)
                .json(saved);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });

};


/**
 * View single theme
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.view = function (req, res, next) {

    var id = req.params.comment_id;
    return new CommentService()
        .view({id: id})
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res
                .status(500)
                .json(error);
        });
};


/**
 * comment project
 * @param req
 * @param res
 * @param next
 * @todo Odstranit aj vsetky child commenty
 */
Ctrl.prototype.remove = function (req, res, next) {
    var id = req.params.comment_id;
    return new CommentService()
        .remove(id, true)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 * Upload media with comment
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
Ctrl.prototype.upload = function (req, res, next) {
    var id = req.params.comment_id;

    return Comment.forge()
        .where({id:id})
        .fetch({require:true})
        .then(function(model){
            return upload(req, res, function (err) {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                    }

                return  Image.add({
                        name: req.file.filename,
                        comment_id:model.attributes.id
                }).then(function(image) {
                    return res
                        .status(200)
                        .json({comment: model, image: image});
                });
            });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });

};



Ctrl.prototype.resize = function(req,res) {

    // imagick.readMetadata('./media/comments/721c9525ade2ea8903d343ef25cf68b9bf4ab0aad56bb7b01fbe48d09bc7fcf4.jpg', function(err, metadata){
    //     if (err) throw err;
    //     console.log('Shot at '+metadata.exif.dateTimeOriginal);
    // });

       var img =   imagick.resize({
            srcPath: "C:\www\htdocs\iQualAPI\media\comments\721c9525ade2ea8903d343ef25cf68b9bf4ab0aad56bb7b01fbe48d09bc7fcf4.jpg",
            dstPath: "C:\www\htdocs\iQualAPI\media\comments\test_thumb.jpg",
            width:   256
        }, function(err,stdout,stderr){
              if (err) new Error(err);
                console.log(stdout);

        });

        // imagick.resize(
        //     {
        //         srcData: fs.readFileSync('./media/comments/721c9525ade2ea8903d343ef25cf68b9bf4ab0aad56bb7b01fbe48d09bc7fcf4.jpg', 'binary'),
        //         width:200
        //     },
        //     function(err,stdout, stderr) {
        //
        //         if(err) {
        //             console.log(err);
        //         }
        //
        //         fs.mkdir('./media/comments/thumbs', 755, function(err) {
        //             fs.writeFileSync('./media/comments/thumbs/721c9525ade2ea8903d343ef25cf68b9bf4ab0aad56bb7b01fbe48d09bc7fcf4.jpg', stdout, 'binary');
        //         })
        //     }
        // );

    console.log(img);
        return res
            .status(200)
            .json({});
};

module.exports = new Ctrl();