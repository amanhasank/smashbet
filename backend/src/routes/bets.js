const express = require('express');
const { body, validationResult } = require('express-validator');
const { Bet, Match, User } = require('../models');
const sequelize = require('../config/database'); // Import sequelize instance
const { auth } = require('../middleware/auth');

const router = express.Router();

// Place a bet
router.post('/', [
  auth,
  body('matchId').isUUID().withMessage('Invalid match ID'),
  body('selectedTeam').notEmpty().withMessage('Selected team name is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { matchId, selectedTeam, amount } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    const match = await Match.findByPk(matchId);

    if (!user || !match) {
      return res.status(404).json({ error: 'User or Match not found' });
    }

    // Validate that the selectedTeam is one of the participating team names in the match
    if (selectedTeam !== match.team1Name && selectedTeam !== match.team2Name) {
      return res.status(400).json({ error: 'Invalid team for this match' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    console.log(`Match status: ${match.status}, isPredictionOpen: ${match.isPredictionOpen}`);
    if (match.status === 'completed' || !match.isPredictionOpen) {
      return res.status(400).json({ error: 'Prediction is not open for this match' });
    }

    // Calculate potential winnings (assuming 2x payout for simplicity for now)
    const potentialWinnings = amount * 2;

    // Start a transaction for placing the bet and updating user balance
    const newBet = await sequelize.transaction(async (t) => {
      await user.update({ balance: user.balance - amount }, { transaction: t });
      const bet = await Bet.create({
        matchId,
        userId,
        selectedTeam,
        amount,
        potentialWinnings // Include potentialWinnings
      }, { transaction: t });
      return bet;
    });

    res.status(201).json(newBet);
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
});

// Get user's bets
router.get('/my-bets', auth, async (req, res) => {
  try {
    const bets = await Bet.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Match,
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bets);
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({ error: 'Failed to fetch bets' });
  }
});

// Get bet by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const bet = await Bet.findByPk(req.params.id, {
      include: [
        {
          model: Match,
        }
      ]
    });

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    // Check if user owns this bet
    if (bet.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(bet);
  } catch (error) {
    console.error('Error fetching bet by ID:', error);
    res.status(500).json({ error: 'Error fetching bet' });
  }
});

module.exports = router; 