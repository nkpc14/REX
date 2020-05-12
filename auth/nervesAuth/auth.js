import {Router} from 'express';
import {body, header} from 'express-validator';
import mongoose from 'mongoose';
import {sign, verify} from 'jsonwebtoken';
// import User from '../../App/models/Users';
import {validationResult} from 'express-validator';
import {compare, hash} from 'bcryptjs';
import {PASSWORD_SALT, JWTSECRET_KEY} from '../config';
import Profile from '../../App/Algorithms/Social/Profile';
import {
    RejectResponse,
    HttpResponseHandler,
    SuccessResponse,
    isValidRequest
} from "../../App/Algorithms/Utils/Wrappers";
import User from "../../App/Algorithms/Social/User";

const router = Router();

router.post('/login',
    body('username').notEmpty().trim().escape().isString().isLength({
        min: 5
    }).withMessage("Username can't be less than 5 character"),
    body('password').notEmpty().trim().escape().isString().isLength({
        min: 8
    }),
    async (req, res, next) => {
        isValidRequest(req, res);
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await User.getUserByUsername(username);
            if (!user.data) {
                return HttpResponseHandler(req, res, user);
            }
            const profile = await Profile.getProfileUserId(user.data._id);
            if (!profile.data) {
                await User.deleteUserid(user.data._id);
                return HttpResponseHandler(req, res, RejectResponse("UserProfile not found!"));
            }
            const doMatch = await compare(password, user.data.password);
            if (doMatch) {
                //Generate JWT
                const token = await generateJWT({user: user.data._id, profile: profile.data._id});
                if (token) {
                    const data = {
                        token: token,
                        userId: user.data._id,
                        profile: profile.data._id
                    };
                    return res.json({
                        success: true,
                        message: "User exists",
                        data: data,
                        statusCode: 200
                    })
                }
            }
            return res.json({
                success: true,
                message: "Password didn't match",
                data: null,
                statusCode: 401
            })
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
            if (username.length < 5) {
                res.json(RejectResponse("Username can't be less than 5 character!"))
            }
            const response = await User.getUserByEmailOrUsername(username, req.body.email);
            const oldUser = response.data;
            if (!oldUser) {
                req.body.username = username;
                req.body.password = await hash(req.body.password, 12);
                const user = await User.createUser(req.body);
                if (!user.data) {
                    return HttpResponseHandler(req, res, user);
                }
                const profile = await Profile.createProfile({userId: user.data._id});
                if (!profile.data) {
                    await User.deleteUserid(user.data._id);
                    return HttpResponseHandler(req, res, profile);
                }
            } else {
                return res.json({
                    message: "User already exists",
                    success: false,
                    data: null,
                    statusCode: 200
                });
            }
        } catch (e) {
            console.log(e);
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
            req.user = token.user;
            req.profile = token.profile;
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
    const token = await sign(user, JWTSECRET_KEY, {
        expiresIn: '48h'
    });
    return token;
}