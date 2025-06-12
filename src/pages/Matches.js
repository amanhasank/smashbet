import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/matches');
      if (response.data && Array.isArray(response.data)) {
        setMatches(response.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      if (err.response) {
        setError(`Failed to fetch matches: ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to fetch matches. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBet = async (matchId, selectedTeam, amount) => {
    if (!user) {
      setError('Please log in to place bets');
      return;
    }

    try {
      await api.post('/bets', {
        matchId,
        selectedTeam,
        amount
      });
      // Refresh matches to update betting status
      fetchMatches();
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Failed to place bet: ' + (err.response?.data?.error || err.message));
    }
  };

  const ongoingMatches = matches.filter(match => match.status === 'ongoing');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
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
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button 
              className="btn btn-link p-0 ms-2" 
              onClick={fetchMatches}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Ongoing Matches */}
        <h2 className="mb-4">Ongoing Matches</h2>
        {!loading && !error && ongoingMatches.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No ongoing matches available at the moment.
          </div>
        ) : (
          <div className="row">
            {ongoingMatches.map(match => (
              <div key={match.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{match.tournament}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-center flex-grow-1">
                        <h6>{match.team1Name}</h6>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePlaceBet(match.id, match.team1Name, 10)}
                          disabled={!match.isBettingOpen}
                        >
                          Bet on {match.team1Name}
                        </button>
                      </div>
                      <div className="mx-3">VS</div>
                      <div className="text-center flex-grow-1">
                        <h6>{match.team2Name}</h6>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePlaceBet(match.id, match.team2Name, 10)}
                          disabled={!match.isBettingOpen}
                        >
                          Bet on {match.team2Name}
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className={`badge bg-${match.isBettingOpen ? 'success' : 'secondary'}`}>
                        {match.isBettingOpen ? 'Betting Open' : 'Betting Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Matches */}
        <h2 className="mb-4 mt-5">Upcoming Matches</h2>
        {!loading && !error && upcomingMatches.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No upcoming matches available at the moment.
          </div>
        ) : (
          <div className="row">
            {upcomingMatches.map(match => (
              <div key={match.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{match.tournament}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-center flex-grow-1">
                        <h6>{match.team1Name}</h6>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePlaceBet(match.id, match.team1Name, 10)}
                          disabled={!match.isBettingOpen}
                        >
                          Bet on {match.team1Name}
                        </button>
                      </div>
                      <div className="mx-3">VS</div>
                      <div className="text-center flex-grow-1">
                        <h6>{match.team2Name}</h6>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePlaceBet(match.id, match.team2Name, 10)}
                          disabled={!match.isBettingOpen}
                        >
                          Bet on {match.team2Name}
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className={`badge bg-${match.isBettingOpen ? 'success' : 'secondary'}`}>
                        {match.isBettingOpen ? 'Betting Open' : 'Betting Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
}

export default Matches;