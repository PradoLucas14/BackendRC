const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    participants: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    }
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
