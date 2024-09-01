const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        match: /^[a-zA-Z\s]*$/,
    },
    telephone: {
        type: String,
        required: true,
        match: /^\d{7,}$/,
    },
    participants: {
        type: Number,
        required: true,
        min: 1,
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
});

module.exports = mongoose.model('Reserva', reservaSchema);
