import {model, Schema} from 'mongoose';

export default model('Tags', new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        default: 'general'
    }
}, {
    timestamps: true
}));