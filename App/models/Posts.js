const mongoose = require('mongoose');

module.exports = mongoose.model('Posts', new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    data: {
        type: String,
    },
    nerve: {
        type: String,
        required: true,
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comments'
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Replies'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Likes'
    },
    shares: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Shares'
    },
    images: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Images'
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tags'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}));