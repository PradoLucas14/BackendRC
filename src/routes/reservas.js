const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Ruta para registrar una nueva reserva
router.post('/reservas', reservaController.crearReserva);

// Ruta para obtener todas las reservas
router.get('/reservas', reservaController.obtenerReservas);

// Ruta para eliminar una reserva por ID
router.delete('/reservas/:id', reservaController.eliminarReserva);

// Ruta para editar una reserva por ID
router.patch('/reservas/:id', reservaController.editarReserva);

module.exports = router;
