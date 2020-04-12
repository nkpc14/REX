const Posts = require('../models/Posts');
const Users = require('../models/Users');
const Comment = require('../models/Comments');
const mongoose = require('mongoose');

const {validationResult} = require('express-validator');
exports.getAllComment = async (req, res, next) => {
    const comment = await Comment.find({});
    res.json({success: true, data: comment});
};
exports.getCommentById = async (req, res, next) => {
    if (mongoose.Types.ObjectId.$isValid()) {
        const comment = await Comment.findById(req.params);
        if (!comment) {
            res.status(404).json({
                message: 'Comment don\' exists.',
                success: false,
                data: null
            })
        }
        delete comment.deleted;
        res.json({
            message: 'Comment exists.',
            success: true,
            data: comment
        });
    }
};
exports.createComment = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    const comment = await new Comment(req.body);
    if (!req.body.nerve) {
        comment.nerve = 'MAIN';
    }
    if (mongoose.Types.ObjectId.isValid(req.body.postId)) {
        const post = Posts.find({postId: req.body.postId});
        if (!post) {
            res.json({message: "Post don\'t exists", success: false, data: null});
        } else {
            comment.author = req.user;
            comment.postId = req.body.postId;
            await comment.save();
            if (!comment) {
                throw new Error("Problem in creating Comment, please try again later.");
            }
            res.json({message: "Comment created successful", success: true, data: comment});
        }
    }
    res.json({message: "Post don\'t exists", success: false, data: null});
};
exports.editCommentById = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const comment = await Comment.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        if (comment) {
            res.json({success: true, message: "Comment Updated", data: comment});
        }
    }
    res.json({success: false, message: "Comment don't exist", data: null});
};

exports.deleteTempCommentById = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const comment = await Comment.findOneAndUpdate({_id: req.params.id}, {$set: {deleted: true}}, {new: true});
        if (comment) {
            res.json({success: true, message: "Comment Deleted!", data: null});
        }
    }
    res.json({success: false, message: "Comment don't exist", data: null});
};


exports.deleteCommentByID = async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const comment = await Comment.findOneAndRemove({_id: req.params.id});
        res.json({success: false, message: "Comment deleted!", data: comment});
    }
    res.json({success: false, message: "Comment don't exist", data: null});
};
