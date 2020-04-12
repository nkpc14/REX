const Posts = require('../models/Posts');
const Reply = require('../models/Replies');
const Comment = require('../models/Comments');
const mongoose = require('mongoose');

const {validationResult} = require('express-validator');
exports.getAllReply = async (req, res, next) => {
    const reply = await Reply.find({});
    res.json({success: true, data: reply});
};
exports.getCommentById = async (req, res, next) => {
    if (mongoose.Types.ObjectId.$isValid()) {
        const reply = await Reply.findById(req.params);
        if (!reply) {
            res.status(404).json({
                message: 'Reply don\' exists.',
                success: false,
                data: null
            })
        }
        delete reply.deleted;
        res.json({
            message: 'Reply exists.',
            success: true,
            data: reply
        });
    }
};
exports.createComment = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }

    if (mongoose.Types.ObjectId.isValid(req.body.postId)) {
        const comment = Comment.find({commentId: req.body.commentId});
        if (!comment) {
            res.json({message: "Comment don\'t exists", success: false, data: null});
        } else {
            const reply = await new Reply(req.body);
            if (!req.body.nerve) {
                comment.nerve = 'MAIN';
            }
            reply.author = req.user;
            reply.commentId = req.body.commentId;
            await reply.save();
            if (!reply) {
                throw new Error("Problem in creating Reply, please try again later.");
            }
            res.json({message: "Reply created successful", success: true, data: reply});
        }
    }
    res.json({message: "Comment don\'t exists", success: false, data: null});
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
