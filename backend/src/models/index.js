const User = require('./User');
// const Team = require('./Team'); // Removed Team import
const Match = require('./Match');
const Bet = require('./Bet');

// Define associations
// Match.belongsTo(Team, { as: 'team1', foreignKey: 'team1Id' }); // Removed
// Match.belongsTo(Team, { as: 'team2', foreignKey: 'team2Id' }); // Removed
// Match.belongsTo(Team, { as: 'winner', foreignKey: 'winnerId' }); // Removed

Bet.belongsTo(User, { foreignKey: 'userId' });
Bet.belongsTo(Match, { foreignKey: 'matchId' });
// Bet.belongsTo(Team, { foreignKey: 'teamId' }); // Removed

User.hasMany(Bet, { foreignKey: 'userId' });
Match.hasMany(Bet, { foreignKey: 'matchId' });
// Team.hasMany(Match, { foreignKey: 'team1Id', as: 'team1Matches' }); // Removed
// Team.hasMany(Match, { foreignKey: 'team2Id', as: 'team2Matches' }); // Removed
// Team.hasMany(Match, { foreignKey: 'winnerId', as: 'wonMatches' }); // Removed

module.exports = {
  User,
  // Team, // Removed
  Match,
  Bet
}; 