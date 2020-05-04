import {
    Router
} from 'express';

const router = Router();
import {
    body,
    header
} from 'express-validator';
import mongoose from 'mongoose';
import {
    sign,
    verify
} from 'jsonwebtoken';
import User from '../../App/models/Users';
import {
    validationResult
} from 'express-validator';
import {
    compare,
    hash
} from 'bcryptjs';
import {
    PASSWORD_SALT,
    JWTSECRET_KEY
} from '../config';

router.post('/login',
    body('username').notEmpty().trim().escape().isString().isLength({
        min: 5
    }),
    body('password').notEmpty().trim().escape().isString().isLength({
        min: 8
    }),
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.json(result);
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await User.findOne({
                username
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User don\' exists.',
                    success: false,
                    data: null
                })
            }
            const doMatch = await compare(password, user.password);
            if (doMatch) {
                //Generate JWT
                const token = await generateJWT(user);
                if (token) {
                    const data = {
                        token: token,
                        userId: user._id,
                    };
                    return res.json({
                        message: 'User exists.',
                        success: true,
                        data: data
                    });
                }
            }
            return res.json({
                message: 'Password didn\'t match',
                success: true,
                data: null
            });
        } catch (e) {
            next(e);
        }
    }
);
router.post('/signup',
    body('firstName').notEmpty().trim().escape().isString(),
    body('lastName').notEmpty().trim().escape().isString(),
    body('email').notEmpty().trim().escape().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape().isLength({
        min: 8
    }), async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json(result);
        }
        try {
            const username = req.body.email.split('@')[0];
            const oldUser = await User.findOne({
                $or: [{
                    email: req.body.emails
                }, {
                    username: username
                }]
            });
            console.log(oldUser);
            if (!oldUser) {
                req.body.username = username;
                req.body.password = await hash(req.body.password, 12);
                const user = await new User(req.body);
                user.save();
                return res.json({
                    message: "User created successful",
                    success: true,
                    data: null
                });
            } else {
                return res.json({
                    message: "User already exists",
                    success: false,
                    data: null
                });
            }
        } catch (e) {
            next(new Error("Server error occurred"));
        }
    });

export default router;


export const isAuthenticated = (req, res, next) => {
    const bearer = req.get('Authorization');
    let token = null;
    if (bearer || req.query.token) {
        token = req.query.token || bearer.split(' ')[1];
        try {
            token = verify(token, JWTSECRET_KEY);
            console.log(token);
            req.authUser = token.userId;
        } catch (err) {
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Something Went Wrong please try after a while.",
                data: null
            })
        }
    }
    if (token) {
        next();
    } else {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "You are not loggedIn",
            data: null
        })
    }
}

export const generateJWT = async (user) => {
    const token = await sign({
        userId: user._id.toString(),
        email: user.email
    }, JWTSECRET_KEY, {
        expiresIn: '7h'
    });
    return token;
}