const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../App/models/Users');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const {PASSWORD_SALT, JWTSECRET_KEY} = require('../config');

router.post('/login',
    body('username').notEmpty().trim().escape().isString().isLength({min: 5}),
    body('password').notEmpty().trim().escape().isString().isLength({min: 8}),
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.json(result);
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await User.findOne({username});
            if (!user) {
                return res.status(404).json({message: 'User don\' exists.', success: false, data: null})
            }
            const doMatch = await bcrypt.compare(password, user.password);
            if (doMatch) {
                //Generate JWT
                const token = await jwt.sign({
                    userId: user._id.toString(),
                    email: user.email
                }, JWTSECRET_KEY, {expiresIn: '1h'});
                if (token) {
                    const data = {token: token, userId: user._id,};
                    return res.json({message: 'User exists.', success: true, data: data});
                }
            }
            return res.json({message: 'Password didn\'t match', success: true, data: null});
        } catch (e) {
            next(e);
        }
    }
);
router.post('/signup',
    body('firstName').notEmpty().trim().escape().isString(),
    body('lastName').notEmpty().trim().escape().isString(),
    body('email').notEmpty().trim().escape().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape().isLength({min: 8})
    , async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json(result);
        }
        try {
            const username = req.body.email.split('@')[0];
            const oldUser = await User.findOne({$or: [{email: req.body.emails}, {username: username}]});
            console.log(oldUser);
            if (!oldUser) {
                req.body.username = username;
                req.body.password = await bcrypt.hash(req.body.password, 12);
                const user = await new User(req.body);
                user.save();
                return res.json({message: "User created successful", success: true, data: null});
            } else {
                return res.json({message: "User already exists", success: false, data: null});
            }
        } catch (e) {
            next(new Error("Server error occurred"));
        }
    });

module.exports = router;