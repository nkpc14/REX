import { model, Schema } from 'mongoose';

export default model('Friends', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles',
        required: true,
    },
    friendId: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles',
        required: true,
    }
}, {
    timestamps: true
}));