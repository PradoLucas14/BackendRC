const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

module.exports = router;
