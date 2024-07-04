const express = require('express');
const { addReserve, updateReserv } = require('../controllers/reserveController');
const router = express.Router();

//para registrar reserva
router.post('/reserv/register', addReserve);
//editar
router.patch('/reserve/:id', updateReserv);
//mostrar
router.get('/reserve',)