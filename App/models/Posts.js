import { model, Schema } from 'mongoose';

export default model('Posts', new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref:'Profiles',
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