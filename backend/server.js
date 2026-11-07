import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';

import { sequelize } from './src/config/dataBase.js';
import { Sala } from './src/models/salaModel.js';
import { Usuario } from './src/models/userModel.js';
import { AuthController, ReservaController } from './src/controllers/reservationControllers.js';
import { verificarSesion } from './src/middlewares/auth.middleware.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_biblioteca',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000, 
    httpOnly: true,
    secure: false, 
    sameSite: 'lax'
  }
}));

app.post('/api/login', AuthController.login);
app.post('/api/logout', AuthController.logout);

app.get('/api/auth/check', verificarSesion, AuthController.verificar);
app.get('/api/salas', verificarSesion, async (req, res) => {
  const salas = await Sala.findAll();
  res.json(salas);
});
app.get('/api/reservas', verificarSesion, ReservaController.obtenerTodas);
app.post('/api/reservas', verificarSesion, ReservaController.crear);

sequelize.sync({ force: false }).then(async () => {
  if ((await Sala.count()) === 0) {
    await Sala.bulkCreate([
      { nombre: 'Sala A - Silenciosa', capacidad: 4 },
      { nombre: 'Sala B - Grupal', capacidad: 8 },
      { nombre: 'Sala C - Multimedia', capacidad: 6 },
    ]);
  }
  if ((await Usuario.count()) === 0) {
    await Usuario.create({
      email: 'admin@biblioteca.com',
      password: bcrypt.hashSync('123456', 10)
    });
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor activo en http://localhost:3000');
  });
});