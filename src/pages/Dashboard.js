import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/theme.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, betsRes] = await Promise.all([
          api.get('/matches'),
          api.get('/bets/my-bets')
        ]);
        setMatches(matchesRes.data);
        setBets(betsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ongoingMatches = matches.filter(match => match.status === 'ongoing');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Message */}
      <motion.h1 
        className="text-center text-4xl font-bold mb-8 text-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome To SmashBet {user?.username}
      </motion.h1>

      {/* User Stats */}
      <motion.div 
        className="stats-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="stat-card">
                <h3>Balance</h3>
                <p className="stat-value">Rs {parseFloat(user.balance).toFixed(2)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3>Total Bets</h3>
                <p className="stat-value">{user.totalBets}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3>Wins</h3>
                <p className="stat-value">{user.wins}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3>Losses</h3>
                <p className="stat-value">{user.losses}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Bets Section */}
      <motion.div 
        className="bets-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container">
          <h2 className="section-title">My Bets</h2>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Team</th>
                  <th>Amount</th>
                  <th>Potential Win</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bets.map(bet => (
                  <tr key={bet.id}>
                    <td>{bet.Match.tournament}</td>
                    <td>{bet.selectedTeam}</td>
                    <td>${parseFloat(bet.amount).toFixed(2)}</td>
                    <td>${parseFloat(bet.potentialWinnings).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${bet.status}`}>
                        {bet.status}
                      </span>
                    </td>
                    <td>{new Date(bet.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Ongoing Matches Section */}
      <motion.div 
        className="matches-section mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="container">
          <h2 className="section-title">Ongoing Matches</h2>
          <div className="row">
            {ongoingMatches.length === 0 ? (
              <div className="col-12">
                <p className="text-center text-gray-500">No ongoing matches available.</p>
              </div>
            ) : (
              ongoingMatches.map(match => (
                <div key={match.id} className="col-md-4 mb-4">
                  <div className="match-card">
                    <h3>{match.tournament}</h3>
                    <div className="teams">
                      <span>{match.team1Name}</span>
                      <span className="vs">VS</span>
                      <span>{match.team2Name}</span>
                    </div>
                    <p className="date">
                      {new Date(match.date).toLocaleDateString()}
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = `/match/${match.id}`}
                    >
                      Place Bet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Upcoming Matches Section */}
      <motion.div 
        className="matches-section mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container">
          <h2 className="section-title">Upcoming Matches</h2>
          <div className="row">
            {upcomingMatches.length === 0 ? (
              <div className="col-12">
                <p className="text-center text-gray-500">No upcoming matches available.</p>
              </div>
            ) : (
              upcomingMatches.map(match => (
                <div key={match.id} className="col-md-4 mb-4">
                  <div className="match-card">
                    <h3>{match.tournament}</h3>
                    <div className="teams">
                      <span>{match.team1Name}</span>
                      <span className="vs">VS</span>
                      <span>{match.team2Name}</span>
                    </div>
                    <p className="date">
                      {new Date(match.date).toLocaleDateString()}
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = `/match/${match.id}`}
                    >
                      Place Bet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard; 