const User = require('../models/Users');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
exports.getAllUser = async (req, res, next) => {
    const user = await User.find({});
    res.json({success: true, data: user});
};
exports.getUserById = async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                message: 'User don\' exists.',
                success: false,
                data: null
            })
        }
        delete user.password;
        delete user.googleId;
        delete user.accountStatus;
        res.json({
            message: 'User exists.',
            success: true,
            data: user
        });
    }
};
exports.getUserByUsername = async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.find({username: req.params.username});
        if (!user) {
            res.status(404).json({
                message: 'User don\' exists.',
                success: false,
                data: null
            })
        }
        delete user.password;
        delete user.googleId;
        delete user.accountStatus;
        res.json({
            message: 'User exists.',
            success: true,
            data: user
        });
    }
};
exports.createUser = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    const oldUser = User.find({$or: [{email: req.body.emails}, {username: req.body.username}]});
    if (!oldUser) {
        res.json({message: "User already exists", success: false, data: null});
    } else {
        const user = await new User(req.body);
        await user.save();
        if (!user) {
            throw new Error("Problem in creating user, please try again later.");
        }
        res.json({message: "User created successful", success: true, data: user});
    }

};

exports.updateUserById = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        if (user) {
            res.json({success: true, message: "User Updated", data: user});
        }
    }
    res.json({success: false, message: "User don't exist", data: null});
};

exports.deleteUserByID = async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findOneAndRemove({_id: req.params.id});
        res.json({success: false, message: "User deleted!", data: null});
    }
    res.json({success: false, message: "User don't exist", data: null});
};

