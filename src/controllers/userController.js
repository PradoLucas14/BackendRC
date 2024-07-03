const User = require('../models/user');
const bcrypt = require('bcrypt');

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

// Función para obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    // Responder con la lista de usuarios
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Función para eliminar un usuario por ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el usuario por ID
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con éxito
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

// Función para actualizar un usuario por ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, accountActive } = req.body;

    // Verificar que al menos uno de los campos a actualizar esté presente
    if (username === undefined && accountActive === undefined) {
      return res.status(400).json({ message: 'Debe proporcionar al menos uno de los campos "username" o "accountActive" para actualizar' });
    }

    // Buscar y actualizar el usuario por ID
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, accountActive },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con el usuario actualizado
    res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

module.exports = { registerUser, getUsers, deleteUser, updateUser };
