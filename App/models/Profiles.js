import { Model, Schema } from 'mongoose';

export default Model('Profile', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles',
        required: true,
    },
    mobile: {
        type: Number,
    },
    gender: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    profileCover: {
        type: String,
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Posts'
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'Friends'
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: 'Followers'
    },
    followings: {
        type: [Schema.Types.ObjectId],
        ref: 'Followings'
    },
}, {
    timestamps: true
}));