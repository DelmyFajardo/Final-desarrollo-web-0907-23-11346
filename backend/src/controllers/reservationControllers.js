import { ReservaService } from '../services/reservationService.js';
import { Usuario } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const reservaService = new ReservaService();

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.usuarioId = usuario.id;
    res.json({ mensaje: 'Login exitoso', usuario: { id: usuario.id, email: usuario.email } });
  }

  static logout(req, res) {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada' });
  }

  static verificar(req, res) {
    res.json({ autenticado: true, usuarioId: req.session.usuarioId });
  }
}

export class ReservaController {
  static async obtenerTodas(req, res) {
    try {
      const reservas = await reservaService.listarReservas();
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const nuevaReserva = await reservaService.crearReserva({
        ...req.body,
        usuarioId: req.session.usuarioId,
      });
      res.status(201).json(nuevaReserva);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }
}