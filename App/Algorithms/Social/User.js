import Users from '../../models/Users';
import { Types } from 'mongoose';

class User {
    constructor(User) {
        this.User = User;
        this.userId = null;
    }

    getUsers = async () => {
        const user = await this.User.find({});
        return {
            success: true,
            data: user,
            statusCode: 200
        };
    }

    getUserId = async (username) => {
        const user = await this.User.find({
            username: username
        });
        return {
            success: true,
            data: user._id,
            statusCode: 200
        };
    }

    getUserById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findById(id);
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
        return {
            message: 'UserId is not valid.',
            success: true,
            data: null,
            statusCode: 404
        };
    }

    getUserByUsername = async (username) => {
        if (Types.ObjectId.isValid(username)) {
            const user = await this.User.find({
                username: username
            });
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

    createUser = async (userData) => {
        const oldUser = this.User.find({
            $or: [{
                email: userData.emails
            }, {
                username: userData.username
            }]
        });
        if (!oldUser) {
            return {
                message: "User already exists",
                success: false,
                data: null,
                statusCode: 200
            };
        } else {
            const user = await new this.User(userData);
            await user.save();
            if (!user) {
                return {
                    message: "Problem in creating user, please try again later.",
                    success: false,
                    data: null,
                    statusCode: 500
                };
            }
            return {
                message: "User created successful",
                success: true,
                data: user,
                statusCode: 500
            }
        }
    }

    updateUserById = async (id, userData) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({
                _id: id
            }, {
                $set: userData
            }, {
                new: true
            });
            if (user) {
                return {
                    success: true,
                    message: "User Updated",
                    data: user,
                    statusCode: 200
                }
            }
        }
        return {
            success: false,
            message: "User don't exist",
            data: null,
            statusCode: 201
        }
    }

    deleteUserid = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndRemove({
                _id: id
            });
            return {
                success: false,
                message: "User deleted!",
                data: null,
                statusCode: 200
            }
        }
        return {
            success: false,
            message: "User don't exist",
            data: null,
            statusCode: 200
        }
    }

    deactivate = async (username) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    accountStatus: false
                }
            }, {
                new: true
            });
            if (user) {
                return {
                    success: true,
                    message: "Account deactivated",
                    data: user,
                    statusCode: 200
                }
            }
        }
        return {
            success: false,
            message: "User don't exist",
            data: null,
            statusCode: 201
        }
    }
}

const user = new User(Users);
export default user;