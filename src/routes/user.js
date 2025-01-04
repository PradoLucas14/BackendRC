const express = require('express');
const router = express.Router();
const { registerUser, getUsers, deleteUser, updateUser, loginUser} = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para eliminar un usuario por ID
router.delete('/users/:id', deleteUser);

// Ruta para actualizar un usuario por ID
router.patch('/users/:id', updateUser);

// Ruta para login
router.post('/login', loginUser);

module.exports = router;