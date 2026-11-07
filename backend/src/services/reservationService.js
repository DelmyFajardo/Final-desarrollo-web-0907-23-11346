import { ReservaRepository } from '../repositories/reservationRepository.js';

export class ReservaService {
  constructor() {
    this.reservaRepository = new ReservaRepository();
  }

  async listarReservas() {
    return await this.reservaRepository.obtenerTodas();
  }

  async crearReserva({ salaId, fecha, horaInicio, horaFin, usuarioId }) {
    if (horaInicio >= horaFin) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin.');
    }

    const existeSolapamiento = await this.reservaRepository.buscarSolapamiento(
      salaId,
      fecha,
      horaInicio,
      horaFin
    );

    if (existeSolapamiento) {
      const err = new Error('La sala ya está reservada en el horario seleccionado.');
      err.status = 409; 
      throw err;
    }

    return await this.reservaRepository.crear({
      salaId,
      fecha,
      horaInicio,
      horaFin,
      usuarioId,
    });
  }
}