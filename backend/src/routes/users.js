const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Match, Bet } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Bet,
        include: {
          model: Match,
          // No includes for team1 and team2 as they are now direct string fields
          // { model: Team, as: 'teamA' },
          // { model: Team, as: 'teamB' },
          // { model: Team, as: 'winner' }
        }
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', [
  auth,
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('currentPassword').optional().notEmpty().withMessage('Current password is required for password change'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get user's Prediction history
router.get('/Prediction-history', auth, async (req, res) => {
  try {
    const bets = await Bet.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Match,
          include: [
            // No includes for team1 and team2 as they are now direct string fields
            // { model: Team, as: 'teamA' },
            // { model: Team, as: 'teamB' },
            // { model: Team, as: 'winner' }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate Prediction statistics
    const stats = {
      totalBets: bets.length,
      wonBets: bets.filter(bet => bet.status === 'won').length,
      lostBets: bets.filter(bet => bet.status === 'lost').length,
      pendingBets: bets.filter(bet => bet.status === 'pending').length,
      totalWinnings: bets
        .filter(bet => bet.status === 'won')
        .reduce((sum, bet) => sum + (bet.payout || 0), 0),
      totalLosses: bets
        .filter(bet => bet.status === 'lost')
        .reduce((sum, bet) => sum + bet.amount, 0)
    };

    res.json({
      bets,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Prediction history' });
  }
});

// Get user's balance history
router.get('/balance-history', auth, async (req, res) => {
  try {
    // This would typically come from a separate BalanceHistory model
    // For now, we'll return a simple message
    res.json({
      message: 'Balance history feature coming soon'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching balance history' });
  }
});

// Get all users sorted by balance for leaderboards
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'balance'],
      order: [['balance', 'DESC']],
      where: { isAdmin: false } // Exclude admin users from the leaderboard
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

module.exports = router; 