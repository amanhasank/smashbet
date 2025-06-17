# 🏸 SmashBet - Badminton Tournament Prediction Platform

![SmashBet Banner](https://smashbet-ten.vercel.app/static/media/banner.7c3b8a9f.png)

## 🌟 Live Demo
Visit our live application: [SmashBet](https://smashbet-ten.vercel.app/login)

## 📝 Overview
SmashBet is an innovative Prediction platform specifically designed for badminton tournaments. It allows users to place bets on ongoing matches, track their Prediction history, and compete on leaderboards.

## ✨ Key Features

### 🎮 User Features
- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Role-based access control (Admin/User)

- **Dashboard**
  - Real-time balance tracking
  - Prediction statistics (Total bets, Wins, Losses)
  - Active and upcoming matches display
  - Personal Prediction history

- **Match Prediction**
  - Place bets on ongoing matches
  - View match details and odds
  - Track bet status (Pending/Won/Lost)
  - Real-time balance updates

- **Leaderboards**
  - Global user rankings
  - Balance-based sorting
  - Visual indicators for top performers
  - Real-time updates

### 👑 Admin Features
- **Match Management**
  - Create new matches
  - Update match status
  - Declare winners
  - Process payouts

- **User Management**
  - View all users
  - Monitor user activities
  - Manage user balances
  - Track Prediction patterns

## 🛠️ Technical Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Framer Motion for animations
- Bootstrap for styling
- Deployed on Vercel

### Backend
- Node.js with Express
- PostgreSQL database
- Sequelize ORM
- JWT authentication
- Exposed via ngrok for development
- Local PostgreSQL instance

## 🔧 Setup Instructions

### Frontend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=your_ngrok_url/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Install PostgreSQL locally
2. Create a database named `badminton_Prediction`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with:
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/badminton_Prediction
   JWT_SECRET=your_secret_key
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. Expose the server using ngrok:
   ```bash
   ngrok http 5003
   ```

## 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- Rate limiting

## 🎨 UI/UX Features
- Responsive design
- Smooth animations
- Intuitive navigation
- Real-time updates
- Loading states
- Error handling
- Success notifications

## 📱 Mobile Responsiveness
- Fully responsive design
- Optimized for all screen sizes
- Touch-friendly interface
- Mobile-first approach

## 🔄 Data Flow
1. User authentication
2. Match data fetching
3. Bet placement
4. Real-time balance updates
5. Leaderboard updates
6. Admin match management

## 🚀 Future Enhancements
- Real-time notifications
- Live match updates
- Advanced statistics
- Social features
- Multiple tournament support
- Enhanced admin dashboard

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- Your Name - Initial work

## 🙏 Acknowledgments
- Badminton community
- Open source contributors
- All beta testers

---
Made with ❤️ for badminton enthusiasts
