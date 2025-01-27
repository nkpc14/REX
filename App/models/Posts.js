import {model, Schema} from 'mongoose';

export default model('Posts', new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    data: {
        type: String,
    },
    nerve: {
        type: String,
        required: true,
        default: 'Public'
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comments'
    },
    replies: {
        type: [Schema.Types.ObjectId],
        ref: 'Replies'
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Likes'
    },
    shares: {
        type: [Schema.Types.ObjectId],
        ref: 'Shares'
    },
    images: {
        type: [Schema.Types.ObjectId],
        ref: 'PostImages'
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: 'Tags'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}));