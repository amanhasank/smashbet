import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Updated slides with local images
  const slides = [
    {
      image: '/img1.jpg',
      title: 'Welcome to SmashBet',
      description: 'Your Ultimate Badminton Betting Platform'
    },
    {
      image: '/img2.jpg',
      title: 'Live Matches',
      description: 'Bet on exciting badminton matches in real-time'
    },
    {
      image: '/img5.jpg',
      title: 'Competitive Odds',
      description: 'Get the best odds for your favorite players'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">
      {/* Full Screen Slideshow */}
      <div className="slideshow-section">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              <div className="slide-content">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  className="display-1 text-white text-center mb-4"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                  className="lead text-white text-center mb-5"
                >
                  {slide.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="overlay"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              >
                <h1 className="display-2 mb-4">Start Your Betting Journey</h1>
                <p className="lead mb-5">
                  Join thousands of badminton enthusiasts and experience the thrill of live betting
                </p>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9, rotate: -2 }}
                >
                  <Link to="/dashboard" className="btn btn-primary btn-lg px-5 py-3">
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-5 bg-light">
        <div className="container">
          <motion.h2 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose SmashBet?
          </motion.h2>
          <div className="row">
            <motion.div
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card h-100">
                <div className="card-body text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="feature-icon mb-3"
                  >
                    🎯
                  </motion.div>
                  <h3 className="card-title">Live Betting</h3>
                  <p className="card-text">Place bets on ongoing matches with real-time odds updates</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="card h-100">
                <div className="card-body text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="feature-icon mb-3"
                  >
                    🔒
                  </motion.div>
                  <h3 className="card-title">Secure Platform</h3>
                  <p className="card-text">Your data and transactions are protected with advanced security</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="card h-100">
                <div className="card-body text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="feature-icon mb-3"
                  >
                    📊
                  </motion.div>
                  <h3 className="card-title">Expert Analysis</h3>
                  <p className="card-text">Get insights and predictions from badminton experts</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section py-5 bg-white">
        <div className="">
          <motion.h2 
            className="text-center mb-5 text-4xl font-bold text-green-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🏸 How Does It Work?
          </motion.h2>
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="text-content text-gray-800 text-lg leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-4"
                >
                  Welcome to the ultimate Badminton Betting Tournament! Here's how the game goes:
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl font-semibold mb-3 text-green-600"
                >
                  💰 Starting Balance
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-4 ml-4"
                >
                  Every user gets ₹1000 to begin with.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-5 ml-4 italic text-gray-600"
                >
                  No real money needed upfront — just your instincts and game sense!
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl font-semibold mb-3 text-green-600"
                >
                  🎯 Place Your Bets
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-2 ml-4"
                >
                  For every match, you can bet on a team you believe will win.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mb-5 ml-4"
                >
                  You decide the amount you want to bet from your balance.
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-2xl font-semibold mb-3 text-green-600"
                >
                  🏆 Win or Lose
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mb-2 ml-4"
                >
                  If your chosen team wins, you double your bet!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="mb-5 ml-4"
                >
                  If your team loses, you lose the amount you bet.
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="text-2xl font-semibold mb-3 text-green-600"
                >
                  📊 Final Dashboard
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mb-2 ml-4"
                >
                  At the end of the tournament:
                </motion.p>
                <motion.ul
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  className="list-disc list-inside mb-4 ml-8"
                >
                  <li>A leaderboard shows who won big and who lost.</li>
                  <li>It's all fair game until this point… and then comes the fun part 😄</li>
                </motion.ul>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="text-2xl font-semibold mb-3 text-green-600"
                >
                  🎉 Contribution & Party Time
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="mb-2 ml-4"
                >
                  To keep it exciting and social:
                </motion.p>
                <motion.ul
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="list-disc list-inside mb-4 ml-8"
                >
                  <li>Users who lost ₹X or more must contribute ₹X.</li>
                  <li>Users who won ₹(1000 + X) or more also contribute ₹X.</li>
                  <li>All contributions go to one awesome celebration party!</li>
                </motion.ul>
                <motion.p
                  initial={{ opacity: 0, y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                  className="text-center text-xl font-bold mt-8 text-green-700"
                >
                  Let the games begin — may the best bettors win! 🤑🏸🎉
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer py-5">
        <div className="container">
          <div className="row">
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-white mb-3">About SmashBet</h4>
              <p className="text-light">
                Your trusted platform for badminton betting. We provide the best odds and a secure betting environment.
              </p>
            </motion.div>
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-white mb-3">Quick Links</h4>
              <ul className="list-unstyled">
                <li><Link to="/dashboard" className="text-light">Dashboard</Link></li>
                <li><Link to="/login" className="text-light">Login</Link></li>
                <li><Link to="/register" className="text-light">Register</Link></li>
              </ul>
            </motion.div>
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-white mb-3">Contact Us</h4>
              <ul className="list-unstyled text-light">
                <li>Email: support@smashbet.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Betting Street, Sports City</li>
              </ul>
            </motion.div>
          </div>
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-light mb-0">&copy; 2024 SmashBet. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 