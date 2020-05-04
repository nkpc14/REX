import Comments from '../../models/Comments'
import Posts from '../../models/Posts'
import userObj from './User';
import { Types } from 'mongoose';

class Comments {
    Comments = null;
    userObj = null;
    errors = [];
    user = null;

    constructor(Comments, userObj) {
        this.Comments = Comments;
        this.userObj = userObj;
        this.errors = [];
    }

    getCurrentUser = async (id) => {
        const user = await this.userObj.getUserById(id);
        if (user.data != null) {
            this.user = user.data;
        } else {
            return null;
        }
    }

    addFriend = async (id, username) => {
        if (Types.ObjectId.isValid(id)) {
            if (!this.isFriend(username)) {
                const friendId = await this.userObj.getUserId(username);
                const friend = await new this.Friends.findByIdAndUpdate(id, {
                    $push: {
                        friendId: friendId
                    }
                }, {
                    new: true,
                    useFindAndModify: false
                });
                return {
                    message: username + " is your friend now.",
                    success: true,
                    data: username,
                    statusCode: 201
                }
            }
            return {
                message: username + ' is already in your friend list.',
                success: true,
                data: username,
                statusCode: 200
            };
        }
        return {
            message: 'Request userId is not valid.',
            success: true,
            data: null,
            statusCode: 404
        };
    }

    removeFriend = async (id, username) => {
        if (Types.ObjectId.isValid(id)) {
            if (this.isFriend(username)) {
                const friendId = await this.userObj.getUserId(username);
                const friend = await new this.Friends.findByIdAndUpdate({
                    $pop: {
                        friendId: friendId
                    }
                });
                return {
                    success: true,
                    data: username,
                    statusCode: 200
                }
            }
            return {
                message: username + ' is not in your friend list.',
                success: false,
                data: null,
                statusCode: 200
            };
        }
    }

    isFriend = async (id, username) => {
        const otherUserId = user._id;

        return {
            message: 'Username is not valid.',
            success: true,
            data: null,
            statusCode: 404
        };
    }
}


export default new Friendship(Friends, userObj);