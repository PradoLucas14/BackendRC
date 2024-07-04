const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Ruta para registrar una nueva reserva
router.post('/reservas', reservaController.crearReserva);

module.exports = router;
