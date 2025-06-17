const express = require('express');
const router = express.Router();
const { Match, User, Bet } = require('../models');
const { isAdmin } = require('../middleware/auth');
// const sequelize = require('sequelize'); // Sequelize instance is typically accessed via models.sequelize if configured that way

// Get all matches (public)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.findAll({
      // No includes needed for team1Name, team2Name, or winner as they are now direct string fields on Match model
      order: [['date', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get all matches (admin)
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const matches = await Match.findAll({
      // No includes needed for team1Name, team2Name, or winner as they are now direct string fields on Match model
      order: [['date', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching admin matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Create a new match (admin only)
router.post('/admin/matches', isAdmin, async (req, res) => {
  try {
    const { team1Name, team2Name, tournament, status, isPredictionOpen } = req.body;

    if (!team1Name || !team2Name) {
      return res.status(400).json({ error: 'Team 1 name and Team 2 name are required' });
    }

    if (team1Name === team2Name) {
      return res.status(400).json({ error: 'Teams must be different' });
    }

    const match = await Match.create({
      team1Name,
      team2Name,
      tournament: tournament || null, // Allow tournament to be optional
      status: status || 'upcoming',
      isPredictionOpen: isPredictionOpen !== undefined ? isPredictionOpen : true,
    });

    // No includes needed as team names are direct fields
    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// Update match status (admin only)
router.put('/admin/matches/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['upcoming', 'ongoing', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const match = await Match.findByPk(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    await match.update({ status });

    // No includes needed as team names are direct fields
    res.json(match);
  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

// Declare match winner (admin only)
router.put('/admin/matches/:id/result', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { winner } = req.body; // winner is now a string (team name)

    const match = await Match.findByPk(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'ongoing') {
      return res.status(400).json({ error: 'Can only declare winner for ongoing matches' });
    }

    // Validate that the winner name matches one of the participating team names
    if (winner !== match.team1Name && winner !== match.team2Name) {
      return res.status(400).json({ error: 'Winner must be one of the participating team names' });
    }

    // Update match status and winner
    await match.update({
      status: 'completed',
      winner: winner // Directly assign the winner string
    });

    // --- IMPORTANT: Bet processing logic needs to be re-evaluated ---
    // The original bet processing used 'winnerId' (a User ID) and compared it with 'bet.teamId'.
    // Since 'winner' is now a team name string and Match no longer has 'team1Id'/'team2Id' foreign keys,
    // the current bet processing logic is fundamentally broken. You will need a way to link bets
    // (which are likely tied to User IDs or Team IDs if you introduce a Team model later) to the winning team name.
    // For now, I'm removing this section to prevent errors, but it requires a new implementation based on your Prediction logic.
    // await models.sequelize.transaction(async (t) => {
    //   // ... (original bet processing logic, adapted to new model)
    // });

    res.json(match);
  } catch (error) {
    console.error('Error declaring match winner:', error);
    res.status(500).json({ error: 'Failed to declare match winner' });
  }
});

// Delete a match (admin only)
router.delete('/admin/matches/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByPk(id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Only allow deletion of upcoming matches
    if (match.status !== 'upcoming') {
      return res.status(400).json({ error: 'Can only delete upcoming matches' });
    }

    await match.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

module.exports = router; 