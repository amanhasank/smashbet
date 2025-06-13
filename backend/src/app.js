require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const initDb = require('./config/initDb');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // only needed if you use cookies/auth headers
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Set default content type for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/users', require('./routes/users'));
console.log('Mounting admin routes at /api/admin');
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5003;

async function startServer() {
  try {
    // Initialize database
    await initDb();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 