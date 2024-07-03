const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  role: { type: String, required: true },
  accountActive: { type: Boolean, required: true }
});

// Hook para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Solo encriptar si la contraseña ha sido modificada
  
  try {
    const salt = await bcrypt.genSalt(10); // Generar un "salt"
    this.password = await bcrypt.hash(this.password, salt); // Encriptar la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Crear y exportar el modelo del usuario
const User = mongoose.model('User', userSchema);
module.exports = User;
