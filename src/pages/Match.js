import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function Match() {
  const { id } = useParams();
  const [betAmount, setBetAmount] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  // Mock match data
  const matchData = {
    id: id,
    player1: 'John Doe',
    player2: 'Jane Smith',
    date: '2024-03-20',
    time: '14:00',
    odds: {
      player1: 1.5,
      player2: 2.5
    }
  };

  const handleBet = (e) => {
    e.preventDefault();
    // TODO: Implement Prediction logic
    console.log('Bet placed:', {
      matchId: id,
      player: selectedPlayer,
      amount: betAmount
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Match #{id}</h2>
              <div className="row mb-4">
                <div className="col-6 text-center">
                  <h4>{matchData.player1}</h4>
                  <p>Odds: {matchData.odds.player1}</p>
                </div>
                <div className="col-6 text-center">
                  <h4>{matchData.player2}</h4>
                  <p>Odds: {matchData.odds.player2}</p>
                </div>
              </div>
              <form onSubmit={handleBet}>
                <div className="mb-3">
                  <label className="form-label">Select Player</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="player"
                        id="player1"
                        value={matchData.player1}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="player1">
                        {matchData.player1}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="player"
                        id="player2"
                        value={matchData.player2}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="player2">
                        {matchData.player2}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="betAmount" className="form-label">Bet Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="betAmount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Place Bet
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match; 