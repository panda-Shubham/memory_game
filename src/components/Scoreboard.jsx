import React from 'react';

function Scoreboard({ scores, onPlayAgain }) {
  const totalScore = scores.round1 + scores.round2 + scores.round3;

  return (
    <div className="container scoreboard">
      <h1>Game Over!</h1>
      <h2>Final Score: {totalScore}</h2>
      <div className="score-breakdown">
        <p>Round 1 (Numbers): {scores.round1}</p>
        <p>Round 2 (Grid): {scores.round2}</p>
        <p>Round 3 (Words): {scores.round3}</p>
      </div>
      <button onClick={onPlayAgain} style={{ marginTop: '20px' }}>
        Play Again
      </button>
    </div>
  );
}

export default Scoreboard;