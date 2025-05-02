import React, { useState, useEffect, useRef } from 'react';

const GRID_COLS = 4;
const GRID_ROWS = 5;
const TILES_TO_HIGHLIGHT = 5;
const TOTAL_TURNS = 8;
const DISPLAY_TIME_MS = 3000; // 3 seconds
const RESULT_DISPLAY_TIME_MS = 1500; // Time to show correct/incorrect tiles

// Helper to generate unique random indices for the pattern
function generatePattern(count) {
  const totalTiles = GRID_COLS * GRID_ROWS;
  const pattern = new Set();
  while (pattern.size < count) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    pattern.add(randomIndex);
  }
  return Array.from(pattern);
}

function Round2({ onRoundComplete, showScoreFeedback }) {
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(0);
  const [correctPattern, setCorrectPattern] = useState([]);
  const [userSelection, setUserSelection] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [showResults, setShowResults] = useState(false); // State to show correct/incorrect tiles

  const turnTimerRef = useRef(null);
  const resultTimerRef = useRef(null);

  // Start a new turn or end the round
  useEffect(() => {
    if (turn <= TOTAL_TURNS) {
      setShowResults(false); // Hide previous results
      setUserSelection([]);   // Clear user selection
      setIsAwaitingInput(false); // Not yet awaiting input
      const newPattern = generatePattern(TILES_TO_HIGHLIGHT);
      setCorrectPattern(newPattern);
      setIsShowingPattern(true);

      // Clear previous timers
      if (turnTimerRef.current) clearTimeout(turnTimerRef.current);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);


      turnTimerRef.current = setTimeout(() => {
        setIsShowingPattern(false);
        setIsAwaitingInput(true); // Now allow user clicks
      }, DISPLAY_TIME_MS);

    } else {
      // Round finished
      onRoundComplete(2, score);
    }

    // Cleanup timers
    return () => {
      if (turnTimerRef.current) clearTimeout(turnTimerRef.current);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [turn]); // Rerun when turn changes

  const handleTileClick = (index) => {
    if (!isAwaitingInput || showResults) return; // Only allow clicks when awaiting input and not showing results

    setUserSelection(prevSelection => {
      if (prevSelection.includes(index)) {
        // Deselect if already selected
        return prevSelection.filter(i => i !== index);
      } else {
        // Select if not already selected
        return [...prevSelection, index];
      }
    });
  };

  const handleSubmit = () => {
    if (!isAwaitingInput || showResults) return;

    setIsAwaitingInput(false); // Stop further input for this turn

    // Check correctness - simple check: all correct tiles selected, and no incorrect tiles selected
    const correctSet = new Set(correctPattern);
    const userSet = new Set(userSelection);
    const isCorrect = correctPattern.length === userSelection.length &&
                      correctPattern.every(tile => userSet.has(tile));

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      showScoreFeedback(true);
    } else {
      setScore(prevScore => prevScore - 1);
      showScoreFeedback(false);
    }

    setShowResults(true); // Show the comparison

    // Move to next turn after showing results
    resultTimerRef.current = setTimeout(() => {
      setTurn(prevTurn => prevTurn + 1);
    }, RESULT_DISPLAY_TIME_MS);
  };

  // Determine the class for each tile based on the state
  const getTileClass = (index) => {
    let className = 'tile';
    if (isShowingPattern && correctPattern.includes(index)) {
      className += ' highlight-pattern'; // Tile is part of the pattern being shown
    }
    if (isAwaitingInput && userSelection.includes(index)) {
      className += ' selected'; // Tile selected by user
    }
    if (showResults) {
      const isCorrectTile = correctPattern.includes(index);
      const isSelected = userSelection.includes(index);
      if (isCorrectTile && isSelected) {
        className += ' correct'; // Correctly selected
      } else if (isCorrectTile && !isSelected) {
        className += ' missed'; // Correct tile, but user missed it
      } else if (!isCorrectTile && isSelected) {
        className += ' incorrect'; // Incorrectly selected
      }
    }
    return className;
  };

  const totalTiles = GRID_COLS * GRID_ROWS;

  return (
    <div className="container round-container">
      <h2>Round 2: Grid Pattern</h2>
      <p>Turn: {turn} / {TOTAL_TURNS} | Score: {score}</p>

      {isShowingPattern && <p>Memorize the pattern...</p>}
      {isAwaitingInput && <p>Click the tiles you remember.</p>}
      {showResults && <p>Checking your answer...</p>}

      <div className="grid-container">
        {[...Array(totalTiles)].map((_, index) => (
          <button
            key={index}
            className={getTileClass(index)}
            onClick={() => handleTileClick(index)}
            disabled={isShowingPattern || showResults} // Disable clicks when showing pattern or results
          >
            {/* Optionally display index for debugging: {index} */}
          </button>
        ))}
      </div>

      {isAwaitingInput && !showResults && (
        <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Submit Pattern
        </button>
      )}
       {turn > TOTAL_TURNS && (
         <p>Calculating next round...</p>
      )}
    </div>
  );
}

export default Round2;