require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Detener el proceso en caso de error
  }
};

module.exports = connectDB;
