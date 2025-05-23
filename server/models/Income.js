// server/models/Income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    isLocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Income', incomeSchema);
