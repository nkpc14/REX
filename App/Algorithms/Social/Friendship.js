const Friends = require('../../models/Friends');
const Users = require('../../models/Users');
const mongoose = require('mongoose');

class Friendship {
    Friends = null;
    Users = null;
    errors = [];
    userId = null;

    constructor(Friends, Users) {
        this.Friends = Friends;
        this.User = Users;
    }

    getUser() {

    }

    addFriend(user) {

    }

    sendFriendRequest() {

    }

    isFriend() {

    }

    friendSince() {

    }


}

module.exports = new Friendship(Friends);