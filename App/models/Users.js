import {model, Schema} from 'mongoose';

export default model('User', new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: false,
        default: 'demo-male.svg'
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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