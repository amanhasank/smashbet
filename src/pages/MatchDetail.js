import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [betAmount, setBetAmount] = useState(10);

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/matches/${id}`);
      setMatch(response.data);
    } catch (err) {
      console.error('Error fetching match details:', err);
      setError('Failed to fetch match details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBet = async () => {
    if (!user) {
      setError('Please log in to place bets');
      return;
    }

    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    try {
      await api.post('/bets', {
        matchId: id,
        selectedTeam: selectedTeam,
        amount: betAmount
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Failed to place bet: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Match not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <div className="card-body">
            <h2 className="card-title mb-4">Match #{match.id}</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row mb-4">
              <div className="col-md-5">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>{match.team1Name}</h5>
                    <p className="mb-0">Odds: 2.0</p>
                    <button
                      className={`btn ${selectedTeam === match.team1Name ? 'btn-primary' : 'btn-outline-primary'} mt-3`}
                      onClick={() => setSelectedTeam(match.team1Name)}
                    >
                      Select {match.team1Name}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <h3>VS</h3>
              </div>
              <div className="col-md-5">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>{match.team2Name}</h5>
                    <p className="mb-0">Odds: 2.0</p>
                    <button
                      className={`btn ${selectedTeam === match.team2Name ? 'btn-primary' : 'btn-outline-primary'} mt-3`}
                      onClick={() => setSelectedTeam(match.team2Name)}
                    >
                      Select {match.team2Name}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedTeam && (
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Place Your Bet</h5>
                      <div className="mb-3">
                        <label className="form-label">Bet Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          min="1"
                          max={user?.balance || 0}
                        />
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handlePlaceBet}
                        disabled={!match.isBettingOpen}
                      >
                        Place Bet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-4">
              <span className={`badge bg-${match.isBettingOpen ? 'success' : 'secondary'}`}>
                {match.isBettingOpen ? 'Betting Open' : 'Betting Closed'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MatchDetail; 