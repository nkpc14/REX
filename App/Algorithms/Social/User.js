import Users from '../../models/Users';
import {Types} from 'mongoose';
import {HttpSuccessResponse, HttpRejectResponse} from '../Utils/Wrappers';

class User {
    constructor(User) {
        this.User = User;
        this.userId = null;
    }

    getUsers = async () => {
        const user = await this.User.find({});
        HttpSuccessResponse(user);
    };

    getUserId = async (username) => {
        const user = await this.User.find({
            username: username
        });
        HttpSuccessResponse(user._id);
    };

    getUserById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findById(id);
            if (!user) {
                return HttpRejectResponse("User don't exists.", 404);
            }
            const data = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                profilePhoto: user.profilePhoto
            };

            return HttpSuccessResponse(data);
        }
        return HttpRejectResponse("UserId is not valid.", 404);
    };

    getUserByUsername = async (username) => {
        if (Types.ObjectId.isValid(username)) {
            const user = await this.User.find({
                username: username
            });
            if (!user) {
                HttpRejectResponse("User don't exists.", 404);
            }
            delete user.password;
            delete user.googleId;
            delete user.accountStatus;
            HttpSuccessResponse(user);
        }
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
            HttpRejectResponse("User already exists", 200);
        } else {
            const user = await new this.User(userData);
            await user.save();
            if (!user) {
                HttpRejectResponse("Problem in creating user, please try again later.", 500);
            }
            HttpSuccessResponse(user);
        }
    };

    updateUserById = async (id, userData) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({_id: id}, {$set: userData}, {new: true});
            if (user) {
                HttpSuccessResponse(user);
            }
        }
        HttpRejectResponse("User don't exist", 404);
    };

    deleteUserid = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndRemove({
                _id: id
            });
            HttpSuccessResponse();
        }
        HttpRejectResponse("User don't exist", 404);
    };

    deactivate = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.User.findOneAndUpdate({_id: id}, {$set: {accountStatus: false}}, {new: true});
            if (user) {
                HttpSuccessResponse(user, "Account deactivated");
            }
        }
        HttpRejectResponse("User don't exist", 404);
    }
}

const user = new User(Users);
export default user;