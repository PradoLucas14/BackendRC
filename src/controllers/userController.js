const User = require('../models/user');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password, termsAccepted, role, accountActive } = req.body;

    // Crear una nueva instancia del modelo User
    const newUser = new User({
      username,
      email,
      password, // La contraseña será encriptada automáticamente
      termsAccepted,
      role,
      accountActive
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Responder con éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

module.exports = { registerUser };
