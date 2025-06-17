const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Match extends Model {
    static associate(models) {
      Match.hasMany(models.Bet, { foreignKey: 'matchId' });
    }
  }

  Match.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      allowNull: true, // Optional, can be null initially
    },
    tournament: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
      allowNull: false,
      defaultValue: 'upcoming',
    },
    isPredictionOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Match',
  });

  return Match;
}; 