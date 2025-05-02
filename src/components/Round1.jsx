import React, { useState, useEffect, useRef } from 'react';

const TOTAL_TURNS = 8;
const DISPLAY_TIME_MS = 3000; // 3 seconds

function generateRandomNumber() {
  const length = Math.random() < 0.5 ? 7 : 8; // 7 or 8 digits
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Round1({ onRoundComplete, showScoreFeedback }) {
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [showNumber, setShowNumber] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null); // Ref for focusing the input

  // Timer reference
  const timerRef = useRef(null);

  // Start a new turn
  useEffect(() => {
    if (turn <= TOTAL_TURNS) {
      setAwaitingInput(false); // Reset input state
      setInputValue('');      // Clear previous input
      const newNumber = generateRandomNumber();
      setCurrentNumber(newNumber);
      setShowNumber(true);

      // Clear any existing timer before setting a new one
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setShowNumber(false);
        setAwaitingInput(true);
      }, DISPLAY_TIME_MS);
    } else {
      // Round finished
      onRoundComplete(1, score); // Pass round number and final score
    }

    // Cleanup timer on component unmount or before next effect run
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [turn]); // Rerun effect when turn changes

  // Focus input when it appears
  useEffect(() => {
    if (awaitingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [awaitingInput]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!awaitingInput) return; // Prevent submission if not waiting

    const isCorrect = parseInt(inputValue, 10) === currentNumber;

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      showScoreFeedback(true);
    } else {
      setScore(prevScore => prevScore - 1);
      showScoreFeedback(false);
    }

    // Move to the next turn slightly after feedback starts
     setTimeout(() => {
        setTurn(prevTurn => prevTurn + 1);
     }, 100); // Short delay before next number appears
  };

  return (
    <div className="container round-container">
      <h2>Round 1: Number Memory</h2>
      <p>Turn: {turn} / {TOTAL_TURNS} | Score: {score}</p>

      {showNumber && (
        <div className="number-display" style={{ fontSize: '3em', margin: '20px 0', minHeight: '1.5em' }}>
          {currentNumber}
        </div>
      )}

      {awaitingInput && (
        <form onSubmit={handleSubmit} style={{ minHeight: '1.5em', margin: '20px 0' }}>
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the number"
            required
            style={{ padding: '10px', marginRight: '10px', fontSize: '1em' }}
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {!showNumber && !awaitingInput && turn <= TOTAL_TURNS && (
         <div style={{ minHeight: '1.5em', margin: '20px 0', fontSize: '3em' }}>&nbsp;</div> // Placeholder for layout consistency
      )}
       {!showNumber && !awaitingInput && turn > TOTAL_TURNS && (
         <p>Calculating next round...</p> // Or finishing round message
      )}
    </div>
  );
}

export default Round1;