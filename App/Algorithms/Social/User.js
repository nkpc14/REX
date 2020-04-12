const Users = require('../../models/Users');
const mongoose = require('mongoose');

class User {
    User = null;
    userId = null;

    constructor(User) {
        this.User = User;
    }

    async getUsers() {
        const user = await User.find({});
        return {success: true, data: user};
    }

    async getUserById(id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const user = await User.findById(id);
            if (!user) {
                return {
                    message: 'User don\' exists.',
                    success: false,
                    data: null,
                    statusCode: 404
                };
            }
            delete user.password;
            delete user.googleId;
            delete user.accountStatus;
            return {
                message: 'User exists.',
                success: true,
                data: user,
                statusCode: 200
            };
        }
    }

    async getUserByUsername(username) {
        if (mongoose.Types.ObjectId.isValid(username)) {
            const user = await User.find({username: username});
            if (!user) {
                return {
                    message: 'User don\' exists.',
                    success: false,
                    data: null,
                    statusCode: 404
                }
            }
            delete user.password;
            delete user.googleId;
            delete user.accountStatus;
            res.json({
                message: 'User exists.',
                success: true,
                data: user,
                statusCode: 200
            });
        }
    }

    async createUser(userData) {
        const oldUser = User.find({$or: [{email: userData.emails}, {username: userData.username}]});
        if (!oldUser) {
            return {message: "User already exists", success: false, data: null, statusCode: 200};
        } else {
            const user = await new User(userData);
            await user.save();
            if (!user) {
                return {
                    message: "Problem in creating user, please try again later.",
                    success: false,
                    data: null,
                    statusCode: 500
                };
            }
            return {message: "User created successful", success: true, data: user, statusCode: 500}
        }
    }

    async updateUserById(id, userData) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const user = await User.findOneAndUpdate({_id: id}, {$set: userData}, {new: true});
            if (user) {
                return {success: true, message: "User Updated", data: user, statusCode: 200}
            }
        }
        return {success: false, message: "User don't exist", data: null, statusCode: 201}
    }

    async deleteUserid(id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const user = await User.findOneAndRemove({_id: id});
            return {success: false, message: "User deleted!", data: null, statusCode: 200}
        }
        return {success: false, message: "User don't exist", data: null, statusCode: 200}
    }
}

module.exports = new User;