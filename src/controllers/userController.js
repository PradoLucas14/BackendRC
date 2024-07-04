const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

let verificationCodes = {}; // Almacenar códigos de verificación temporalmente

// Enviar código de verificación
const sendVerificationCode = async (request, response) => {
  const { email } = request.body;
  const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Código de 6 caracteres

  // Configura nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Código de verificación',
    text: `Tu código de verificación es ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return response.status(500).send('Error enviando el correo');
    }
    verificationCodes[email] = verificationCode; // Almacenar el código temporalmente
    response.status(200).send('Código de verificación enviado');
  });
};

// Verificar código de verificación
const verifyCode = async (request, response) => {
  const { email, code } = request.body;
  if (verificationCodes[email] === code) {
    delete verificationCodes[email]; // Eliminar el código después de la verificación
    response.status(200).send('Verificación exitosa');
  } else {
    response.status(400).send('Código de verificación inválido');
  }
};

// Registrar un nuevo usuario
const registerUser = async (request, response) => {
  try {
    const { username, email, password, termsAccepted, role, accountActive } = request.body;

    // Verificar si el correo electrónico ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password, termsAccepted, role, accountActive });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();
    response.status(201).json({ message: 'Usuario registrado con éxito', user: { username, email, role, accountActive } });
  } catch (error) {
    response.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser,
  sendVerificationCode,
  verifyCode
};