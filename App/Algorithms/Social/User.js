import Users from '../../models/Users';
import {Types} from 'mongoose';
import {SuccessResponse, RejectResponse} from '../Utils/Wrappers';

class User {
    constructor(User) {
        this.User = User;
        this.userId = null;
    }

    getUsers = async () => {
        const user = await this.User.find({});
        return SuccessResponse(user);
    };

    getUserId = async (username) => {
        const user = await this.User.find({
            username: username
        });
        return SuccessResponse(user._id);
    };

    getUserById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findById(id);
            if (!user) {
                return RejectResponse("User don't exists.", 404);
            }
            const data = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                profilePhoto: user.profilePhoto
            };

            return SuccessResponse(data);
        }
        return RejectResponse("UserId is not valid.", 404);
    };

    getUserByUsername = async (username) => {
        const user = await this.User.findOne({
            username: username
        });
        if (!user) {
            return RejectResponse("User don't exists.", 404);
        }
        delete user.password;
        delete user.googleId;
        delete user.accountStatus;
        return SuccessResponse(user);
    };
    getUserByEmailOrUsername = async (username, email) => {
        const user = await this.User.findOne({
            $or: [{
                email: email
            }, {
                username: username
            }]
        });
        if (!user) {
            return RejectResponse("User don't exists.", 404);
        }
        delete user.password;
        delete user.googleId;
        delete user.accountStatus;
        return SuccessResponse(user);
    };

    createUser = async (userData) => {
        const oldUser = this.User.find({
            $or: [{
                email: userData.emails
            }, {
                username: userData.username
            }]
        });
        if (!oldUser) {
            return RejectResponse("User already exists", 200);
        } else {
            console.log(userData);
            const user = await new this.User(userData);
            await user.save();
            if (!user) {
                return RejectResponse("Problem in creating user, please try again later.", 500);
            }
            return SuccessResponse(user);
        }
    };

    updateUserById = async (id, userData) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({_id: id}, {$set: userData}, {new: true});
            if (user) {
                return SuccessResponse(user);
            }
        }
        return RejectResponse("User don't exist", 404);
    };

    deleteUserid = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndRemove({
                _id: id
            });
            return SuccessResponse();
        }
        return RejectResponse("User don't exist", 404);
    };

    deactivate = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({_id: id}, {$set: {accountStatus: false}}, {new: true});
            if (user) {
                return SuccessResponse(user, "Account deactivated");
            }
        }
        return RejectResponse("User don't exist", 404);
    }
}

const user = new User(Users);
export default user;