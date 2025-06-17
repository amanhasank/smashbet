const express = require('express');
const router = express.Router();
const { Match, User, Bet } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get active matches (ongoing and upcoming)
router.get('/active', async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        status: ['ongoing', 'upcoming']
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching active matches:', error);
    res.status(500).json({ error: 'Failed to fetch active matches' });
  }
});

// Get all matches (public, now includes upcoming, ongoing, completed)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get all matches (admin endpoint - similar to public but for admin context)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const matches = await Match.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching admin matches:', error);
    res.status(500).json({ error: 'Failed to fetch admin matches' });
  }
});

// Get a specific match by ID (public/authenticated)
router.get('/:id', auth, async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id); // No includes needed for team names/winner

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    console.error('Error fetching match by ID:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// Create new match (admin only)
router.post('/admin/matches', [
  adminAuth,
  body('team1Name').trim().notEmpty().withMessage('Team 1 name is required'),
  body('team2Name').trim().notEmpty().withMessage('Team 2 name is required'),
  body('tournament').optional().trim(), // Tournament is optional
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed']).withMessage('Invalid status'),
  body('isPredictionOpen').optional().isBoolean().withMessage('isPredictionOpen must be a boolean'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { team1Name, team2Name, tournament, status, isPredictionOpen } = req.body;

    if (team1Name === team2Name) {
      return res.status(400).json({ error: 'Teams must be different' });
    }

    const match = await Match.create({
      team1Name,
      team2Name,
      tournament,
      status: status || 'upcoming',
      isPredictionOpen: isPredictionOpen !== undefined ? isPredictionOpen : true,
      // Date will be automatically set by defaultValue: DataTypes.NOW in model
    });

    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// Update match status (admin only)
router.put('/admin/matches/:id', adminAuth, async (req, res) => {
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

    const updateFields = { status };
    if (status === 'ongoing') {
      updateFields.isPredictionOpen = true; // Open Prediction when status is ongoing
    }

    await match.update(updateFields);

    res.json(match);
  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

// Declare winner (admin only) - uses winner (string team name)
router.put('/admin/matches/:id/result', [
  adminAuth,
  body('winner').trim().notEmpty().withMessage('Winner name is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    // Since 'winner' is now a team name string and Match no longer has foreign keys to Teams,
    // and Bet model now stores 'selectedTeam' as a string,
    // the current bet processing logic in the Bet route needs to be updated to match winning team names.
    // This current route simply updates the Match. A separate process would be needed to resolve bets.

    res.json(match);
  } catch (error) {
    console.error('Error declaring match winner:', error);
    res.status(500).json({ error: 'Failed to declare match winner' });
  }
});

// Delete a match (admin only)
router.delete('/admin/matches/:id', adminAuth, async (req, res) => {
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