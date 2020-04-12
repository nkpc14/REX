const mongoose = require('mongoose');

module.exports = mongoose.model('Comments', new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    data: {
        type: String,
    },
    nerve: {
        type: String,
        required: true,
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Replies'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Likes'
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