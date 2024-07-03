const express = require('express');
const router = express.Router();
const { registerUser, getUsers, deleteUser } = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para eliminar un usuario por ID
router.delete('/users/:id', deleteUser);

module.exports = router;
