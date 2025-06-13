import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import '../styles/theme.css'; // Ensure this has white-green theme

function Leaderboards() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getLeaderboard();
        console.log('Leaderboard response:', response);
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to fetch leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-20 text-center">
        <motion.div
          className="spinner-border text-green-600"
          role="status"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="visually-hidden">Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-10">
        <motion.div
          className="alert alert-danger text-center"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.h1
        className="text-4xl font-extrabold text-green-700 text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🏆 Leaderboards
      </motion.h1>

      {users.length === 0 ? (
        <motion.div
          className="text-center text-gray-600"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No users on the leaderboard yet.
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto bg-white shadow-xl rounded-2xl"
        >
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-600">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Username
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const rowColor =
                  index === 0
                    ? 'bg-yellow-100 text-yellow-800 font-bold'
                    : index === 1
                    ? 'bg-gray-100 text-gray-800 font-semibold'
                    : index === 2
                    ? 'bg-orange-100 text-orange-800 font-semibold'
                    : '';

                return (
                  <motion.tr
                    key={user.id}
                    className={`transition-all hover:bg-green-50 ${rowColor}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-8 py-4">{index + 1}</td>
                    <td className="px-8 py-4">{user.username}</td>
                    <td className="px-8 py-4 font-semibold">₹{parseFloat(user.balance).toFixed(2)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

export default Leaderboards;
