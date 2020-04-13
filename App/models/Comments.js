import { model, Schema } from 'mongoose';

export default model('Comments', new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref:'Profiles',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref:'Posts',
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
        type: [Schema.Types.ObjectId],
        ref: 'Replies'
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Likes'
    },
    images: {
        type: [Schema.Types.ObjectId],
        ref: 'Images'
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