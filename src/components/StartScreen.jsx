import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="container">
      <h1>Memory Test Game</h1>
      <p>Test your memory across 3 challenging rounds!</p>
      <div style={{ textAlign: 'left', margin: '20px 0', fontSize: '0.9em', color: '#ccc' }}>
        <p><strong>Round 1: Number Sequence</strong> - Memorize the sequence of numbers shown.</p>
        <p><strong>Round 2: Grid Pattern</strong> - Memorize the pattern highlighted on the grid.</p>
        <p><strong>Round 3: Word Recall</strong> - Memorize the words shown, then identify which ones you saw.</p>
      </div>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}

export default StartScreen;