import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dataBase.js';

export const Sala = sequelize.define('Sala', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  capacidad: { type: DataTypes.INTEGER, allowNull: false },
});