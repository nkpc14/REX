import mongoose from 'mongoose'


export default mongoose.model('sockets',new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required: true,
    },
    socketId:{
        type:String,
        default:null,
        unique:true,
    }
}))