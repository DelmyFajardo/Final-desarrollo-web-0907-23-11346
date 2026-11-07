import { Reserva } from '../models/reservationModel.js';
import { Sala } from '../models/salaModel.js';
import { Op } from 'sequelize';

export class ReservaRepository {
  async obtenerTodas() {
    return await Reserva.findAll({ include: [Sala] });
  }

  async buscarSolapamiento(salaId, fecha, horaInicio, horaFin) {
    return await Reserva.findOne({
      where: {
        salaId,
        fecha,
        [Op.and]: [
          { horaInicio: { [Op.lt]: horaFin } },
          { horaFin: { [Op.gt]: horaInicio } }
        ]
      }
    });
  }

  async crear(datosReserva) {
    return await Reserva.create(datosReserva);
  }
}