const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  team1Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team2Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  winner: {
    type: DataTypes.STRING,
    allowNull: true, // Winner is null until declared
  },
  tournament: {
    type: DataTypes.STRING,
    allowNull: true, // Tournament can be optional now
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false, // Match date is still required
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
    defaultValue: 'upcoming'
  },
  isBettingOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Match; 