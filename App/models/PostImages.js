import {model, Schema} from 'mongoose';

export default model('PostImages', new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles',
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}));