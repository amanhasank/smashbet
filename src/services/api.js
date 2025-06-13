import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://b100-14-195-8-190.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  withCredentials: false,
  timeout: 10000
});

// Add a request interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Ensure we're getting JSON data
    if (response.headers['content-type']?.includes('application/json')) {
      return response;
    }
    // If not JSON, try to parse it as JSON
    try {
      const jsonData = JSON.parse(response.data);
      return { ...response, data: jsonData };
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return Promise.reject(new Error('Invalid response format'));
    }
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Matches API calls
export const matchesAPI = {
  getActiveMatches: () => api.get('/matches/active'),
  getMatch: (id) => api.get(`/matches/${id}`),
  createMatch: (matchData) => api.post('/matches', matchData),
  closeBetting: (matchId) => api.post(`/matches/${matchId}/close-betting`),
  declareWinner: (matchId, winnerId) => 
    api.post(`/matches/${matchId}/declare-winner`, { winnerId }),
};

// Bets API calls
export const betsAPI = {
  placeBet: (betData) => api.post('/bets', betData),
  getMyBets: () => api.get('/bets/my-bets'),
  getBet: (id) => api.get(`/bets/${id}`),
};

// Admin API calls
export const adminAPI = {
  createTeam: (teamData) => api.post('/admin/teams', teamData),
  getTeams: () => api.get('/admin/teams'),
  processPayouts: (matchId) => api.post(`/admin/matches/${matchId}/process-payouts`),
  getUsers: () => api.get('/admin/users'),
  updateUserBalance: (userId, amount) => 
    api.post(`/admin/users/${userId}/balance`, { amount }),
};

// User API calls
export const userAPI = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  getBettingHistory: () => api.get('/users/betting-history'),
  getBalanceHistory: () => api.get('/users/balance-history'),
  getLeaderboard: () => api.get('/users/leaderboard')
};

export default api; 