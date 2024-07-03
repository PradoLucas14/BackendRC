const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Paquete para generar un token único

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password, termsAccepted, role, accountActive } = req.body;

    // Verificar si el correo electrónico ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Crear un token único para el usuario
    const token = crypto.randomBytes(32).toString('hex'); // Genera un token único de 32 bytes

    // Crear una nueva instancia del modelo User
    const newUser = new User({
      username,
      email,
      password,
      termsAccepted,
      role,
      accountActive,
      token // Asignar el token único
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

// Función para manejar el login de usuarios
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      // Generar el token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  
      // Responder con el token
      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión', error });
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

module.exports = { registerUser, getUsers, deleteUser, updateUser, loginUser };
