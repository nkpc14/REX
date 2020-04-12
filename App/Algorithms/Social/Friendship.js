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

                const friend = new this.Friends({
                    userId: id,
                    friendId:
                });

            }
            return {
                message: username + 'is already in your friend list.',
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

    }

    sendFriendRequest(id, username) {

    }

    isFriend(id, username) {
        const user = this.userObj.find({_id: username});
        const otherUserId = user._id;

        return {
            message: 'Username is not valid.',
            success: true,
            data: null,
            statusCode: 404
        };
    }

    friendSince(id, username) {

    }

    mutualFriends(id, username) {

    }

}

module.exports = new Friendship(Friends, userObj);