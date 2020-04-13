import { model, Schema } from 'mongoose';

export default model('User', new Schema({
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