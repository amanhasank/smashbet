const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bet = sequelize.define('Bet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  matchId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Matches',
      key: 'id'
    }
  },
  selectedTeam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'won', 'lost'),
    defaultValue: 'pending'
  },
  potentialWinnings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payout: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Bet; 