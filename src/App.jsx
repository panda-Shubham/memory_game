import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Round1 from './components/Round1';
import Round2 from './components/Round2'; // Assuming Round2 exists
import Round3 from './components/Round3'; // Assuming Round3 exists
import Scoreboard from './components/Scoreboard';
import './styles.css'; // Ensure styles are imported

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'round1', 'round2', 'round3', 'scoreboard'
  const [scores, setScores] = useState({ round1: 0, round2: 0, round3: 0 });
  const [scoreFeedback, setScoreFeedback] = useState({ show: false, correct: false });

  const handleStartGame = () => {
    setGameState('round1');
    setScores({ round1: 0, round2: 0, round3: 0 }); // Reset scores
    setScoreFeedback({ show: false, correct: false }); // Reset feedback
  };

  const handleRoundComplete = (roundNumber, score) => {
    setScores(prevScores => ({ ...prevScores, [`round${roundNumber}`]: score }));
    setScoreFeedback({ show: false, correct: false }); // Hide feedback between rounds

    // Determine next state
    if (roundNumber === 1) {
      setGameState('round2'); // Uncomment when Round2 is ready
      // setGameState('scoreboard'); // Temporary: Go to scoreboard after Round 1
    } else if (roundNumber === 2) {
      setGameState('round3'); // Uncomment when Round3 is ready
      // setGameState('scoreboard'); // Temporary: Go to scoreboard after Round 2
    } else if (roundNumber === 3) {
      setGameState('scoreboard');
    }
  };

  const handlePlayAgain = () => {
    setGameState('start');
  };

  // Function to show score feedback (+1 / -1)
  const showScoreFeedback = (isCorrect) => {
    setScoreFeedback({ show: true, correct: isCorrect });
    setTimeout(() => {
      setScoreFeedback({ show: false, correct: false });
    }, 800); // Hide feedback after 0.8 seconds
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      case 'round1':
        return <Round1 onRoundComplete={handleRoundComplete} showScoreFeedback={showScoreFeedback} />;
      case 'round2':
        return <Round2 onRoundComplete={handleRoundComplete} showScoreFeedback={showScoreFeedback} />; // Uncomment when Round2 is ready
      case 'round3':
        return <Round3 onRoundComplete={handleRoundComplete} showScoreFeedback={showScoreFeedback} />; // Uncomment when Round3 is ready
      case 'scoreboard':
        return <Scoreboard scores={scores} onPlayAgain={handlePlayAgain} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="app-container">
      {scoreFeedback.show && (
        <div className={`score-feedback ${scoreFeedback.correct ? 'correct' : 'incorrect'}`}>
          {scoreFeedback.correct ? '+1' : '-1'}
        </div>
      )}
      {renderGameState()}
    </div>
  );
}

export default App;