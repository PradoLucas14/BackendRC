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

// Iniciar sesión
const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Buscar el usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ message: 'Correo electrónico' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: 'Contraseña incorrectos' });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user._id,userRole: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });

    response.status(200).json({ message: 'Login exitoso', accesToken:token });
  } catch (error) {
    response.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Obtener todos los usuarios
const getUsers = async (request, response) => {
  try {
    const users = await User.find();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// Eliminar un usuario
const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    // Eliminar el usuario por ID
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return response.status(404).json({ message: 'Usuario no encontrado' });
    }

    response.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    response.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Actualizar un usuario
const updateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const { username, accountActive } = request.body;

    // Actualizar el usuario por ID
    const updatedUser = await User.findByIdAndUpdate(id, { username, accountActive }, { new: true });
    if (!updatedUser) {
      return response.status(404).json({ message: 'Usuario no encontrado' });
    }

    response.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedUser });
  } catch (error) {
    response.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
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