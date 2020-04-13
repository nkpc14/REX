import User from '../models/Users';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { getUsers } from '../Algorithms/Social/User';
export async function getAllUser(req, res, next) {
    const response = await getUsers();
    if (response.success) {
        res.json(response.data);
    }
}
export async function getUserById(req, res, next) {
    if (Types.ObjectId.isValid(req.params.id)) {
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
}
export async function getUserByUsername(req, res, next) {
    if (Types.ObjectId.isValid(req.params.id)) {
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
}
export async function createUser(req, res, next) {
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

}

export async function updateUserById(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
    if (Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        if (user) {
            res.json({success: true, message: "User Updated", data: user});
        }
    }
    res.json({success: false, message: "User don't exist", data: null});
}

export async function deleteUserByID(req, res, next) {
    if (Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findOneAndRemove({_id: req.params.id});
        res.json({success: false, message: "User deleted!", data: null});
    }
    res.json({success: false, message: "User don't exist", data: null});
}

