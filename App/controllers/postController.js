const Posts = require('../models/Posts');
const Users = require('../models/Users');
const mongoose = require('mongoose');

const {validationResult} = require('express-validator');
exports.getAllPost = async (req, res, next) => {
    const post = await Posts.find({});
    res.json({success: true, data: post});
};
exports.getPostById = async (req, res, next) => {
    if (mongoose.Types.ObjectId.$isValid()) {
        const post = await Posts.findById(req.params);
        if (!post) {
            res.status(404).json({
                message: 'Posts don\' exists.',
                success: false,
                data: null
            })
        }
        delete post.deleted;
        res.json({
            message: 'Post exists.',
            success: true,
            data: user
        });
    }
};
exports.createPost = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    const post = await new Posts(req.body);
    if (!req.body.nerve) {
        post.nerve = 'MAIN';
    }
    post.author = req.user;
    await post.save();
    if (!post) {
        throw new Error("Problem in creating user, please try again later.");
    }
    res.json({message: "Post created successful", success: true, data: post});

};
exports.filterByTag = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    const filterByTags = [];
    req.body.forEach((tag) => {
        filterByTags.push({tags: tag})
    });
    const post = Posts.find({$or: filterByTags});
    if (!post) {
        res.json({message: "Post don\'t exists", success: false, data: null});
    } else {
        res.json({message: "Post exists", success: true, data: post});
    }

};

exports.editPostById = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.body.author = req.user;
        const post = await Posts.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        if (post) {
            res.json({success: true, message: "Post Updated", data: post});
        }
    }
    res.json({success: false, message: "Post don't exist", data: null});
};
exports.deleteTempPostById = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const post = await Posts.findOneAndUpdate({_id: req.params.id}, {$set: {deleted: true}}, {new: true});
        if (post) {
            res.json({success: true, message: "Post Deleted!", data: null});
        }
    }
    res.json({success: false, message: "Post don't exist", data: null});
};

exports.deletePostByID = async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const post = await Posts.findOneAndRemove({_id: req.params.id});
        res.json({success: false, message: "Post deleted!", data: post});
    }
    res.json({success: false, message: "Post don't exist", data: null});
};

