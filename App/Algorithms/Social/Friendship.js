const Friends = require('../../models/Friends');
const userObj = require('./User');
const mongoose = require('mongoose');

class Friendship {
    Friends = null;
    userObj = null;
    errors = [];
    user = null;

    constructor(Friends, userObj) {
        this.Friends = Friends;
        this.userObj = userObj;
    }

    getCurrentUser(id) {
        const user = this.userObj.getUserById(id);
        if (user.data != null) {
            this.user = user.data;
        } else {
            return null;
        }
    }

    addFriend(id, username) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            if (!this.isFriend(username)) {
                const friendId = this.userObj.getUserId(username);
                const friend = new this.Friends.findByIdAndUpdate(id,
                    {$push: {friendId: friendId}},
                    {new: true, useFindAndModify: false}
                );
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

    removeFriend(id, username) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            if (this.isFriend(username)) {
                const friendId = this.userObj.getUserId(username);
                const friend = new this.Friends.findByIdAndUpdate({$pop: {friendId: friendId}});
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

    isFriend(id, username) {
        const otherUserId = user._id;

        return {
            message: 'Username is not valid.',
            success: true,
            data: null,
            statusCode: 404
        };
    }
}


module.exports = new Friendship(Friends, userObj);