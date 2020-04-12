const mongoose = require('mongoose');

module.exports = mongoose.model('Friends', new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
}, {
    timestamps: true
}));