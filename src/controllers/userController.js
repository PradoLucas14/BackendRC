const User = require('../models/user');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, termsAccepted, role, accountActive } = req.body;

    const newUser = new User({
      username,
      email,
      password,
      termsAccepted,
      role,
      accountActive
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

module.exports = { registerUser };
