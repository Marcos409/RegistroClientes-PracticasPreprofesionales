const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());

// Middlewares
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Rutas de usuarios
const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/usuarios', usuariosRoutes);

// Rutas de admin
const adminRoutes = require('./routes/admin.routes')
app.use('/admin', adminRoutes)

// En tu app.js o server.js
const clientesRoutes = require('./routes/clientes.routes');

// Montar rutas
app.use('/clientes', clientesRoutes);

module.exports = app;
