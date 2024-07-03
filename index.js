require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./db'); // Importar la función de conexión a la base de datos

const app = express();
const port = process.env.PORT || 3000;

// Middleware para registro de solicitudes HTTP
app.use(morgan('dev'));

// Configuración básica de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar y usar la ruta de usuarios
const userRouter = require('./src/routes/user');
app.use('/api', userRouter);

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});
