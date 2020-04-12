const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    gender: {
        type: String,
    },
    photo: {
        type: String,
    },
    dob: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    accountStatus: {
        type: Boolean,
        required: false,
        default: true
    },
    googleId: String,
    token: String
}, {
    timestamps: true
}));