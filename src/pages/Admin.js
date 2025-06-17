import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New match form state
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    tournament: '',
    isPredictionOpen: true
  });

  // Edit match state
  const [editingMatch, setEditingMatch] = useState(null);

  // Add match modal state
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [tournamentName, setTournamentName] = useState('');

  // State for declaring winner modal
  const [showDeclareWinnerModal, setShowDeclareWinnerModal] = useState(false);
  const [matchToDeclareWinnerFor, setMatchToDeclareWinnerFor] = useState(null);
  const [selectedWinnerTeam, setSelectedWinnerTeam] = useState('');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch users and matches separately to handle errors individually
      try {
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      }

      try {
        const matchesResponse = await api.get('/admin/matches');
        setMatches(matchesResponse.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(prev => prev ? `${prev}. Failed to fetch matches.` : 'Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/admin/matches/${matchId}`);
        setMatches(matches.filter(match => match.id !== matchId));
      } catch (err) {
        setError('Failed to delete match');
      }
    }
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to add match with data:', { team1Name, team2Name, tournament: tournamentName });
      const response = await api.post('/admin/matches', {
        team1Name,
        team2Name,
        tournament: tournamentName
      });
      setMatches([...matches, response.data]);
      setShowAddMatchModal(false);
      setTeam1Name('');
      setTeam2Name('');
      setTournamentName('');
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Failed to add match: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateMatchStatus = async (matchId, status, winner = null) => {
    try {
      if (status === 'completed' && winner) {
        await api.put(`/admin/matches/${matchId}/result`, { winner });
      } else {
        await api.put(`/admin/matches/${matchId}`, { status });
      }
      // Refresh matches
      const response = await api.get('/admin/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error updating match status:', error);
      alert('Failed to update match status: ' + (error.response?.data?.error || error.message));
    }
  };

  const openDeclareWinnerModal = (match) => {
    setMatchToDeclareWinnerFor(match);
    setShowDeclareWinnerModal(true);
  };

  const closeDeclareWinnerModal = () => {
    setMatchToDeclareWinnerFor(null);
    setSelectedWinnerTeam('');
    setShowDeclareWinnerModal(false);
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Admin Dashboard</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              Matches
            </button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title mb-4">User Management</h3>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Match Management</h2>
                  <button
                    onClick={() => setShowAddMatchModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add New Match
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matches.map((match) => (
                        <tr key={match.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {match.team1Name} vs {match.team2Name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{match.tournament}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(match.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${match.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                                match.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {match.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {match.winner ? match.winner : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {match.status === 'upcoming' && (
                              <button
                                onClick={() => openDeclareWinnerModal(match)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Select Winner
                              </button>
                            )}
                            {match.status === 'ongoing' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUpdateMatchStatus(match.id, 'completed', match.team1Name)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  {match.team1Name} Wins
                                </button>
                                <button
                                  onClick={() => handleUpdateMatchStatus(match.id, 'completed', match.team2Name)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  {match.team2Name} Wins
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => handleDeleteMatch(match.id)}
                              className="text-red-600 hover:text-red-900 ml-3"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Add Match Modal */}
      {showAddMatchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Add New Match</h3>
              <form onSubmit={handleAddMatch} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Team 1</label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter Team 1 name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Team 2</label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter Team 2 name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tournament</label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter tournament name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMatchModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Match
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Select Winner Modal */}
      {showDeclareWinnerModal && matchToDeclareWinnerFor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Declare Winner for {matchToDeclareWinnerFor.team1Name} vs {matchToDeclareWinnerFor.team2Name}</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateMatchStatus(matchToDeclareWinnerFor.id, 'completed', selectedWinnerTeam);
                closeDeclareWinnerModal();
              }} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Select Winning Team</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="winnerTeam"
                        value={matchToDeclareWinnerFor.team1Name}
                        checked={selectedWinnerTeam === matchToDeclareWinnerFor.team1Name}
                        onChange={(e) => setSelectedWinnerTeam(e.target.value)}
                        required
                      />
                      <span className="ml-2">{matchToDeclareWinnerFor.team1Name}</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio"
                        name="winnerTeam"
                        value={matchToDeclareWinnerFor.team2Name}
                        checked={selectedWinnerTeam === matchToDeclareWinnerFor.team2Name}
                        onChange={(e) => setSelectedWinnerTeam(e.target.value)}
                        required
                      />
                      <span className="ml-2">{matchToDeclareWinnerFor.team2Name}</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeDeclareWinnerModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={!selectedWinnerTeam}
                  >
                    Declare Winner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin; 