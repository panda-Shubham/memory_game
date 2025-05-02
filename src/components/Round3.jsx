import React, { useState, useEffect, useRef } from 'react';

// Simple word list (expand as needed)
const WORD_LIST = [
  "apple", "banana", "grape", "orange", "melon", "peach", "kiwi", "berry",
  "lemon", "lime", "mango", "plum", "chair", "table", "couch", "shelf",
  "light", "clock", "phone", "radio", "mouse", "keys", "plant", "earth",
  "water", "fire", "wind", "stone", "sand", "cloud", "rain", "snow", "storm",
  "dream", "sleep", "awake", "happy", "sad", "angry", "calm", "brave", "kind"
].filter(word => word.length <= 8); // Ensure words are <= 8 letters

const WORDS_PER_TURN = 5;
const DISPLAY_INTERVAL_MS = 2000; // 2 seconds per word
const TOTAL_TURNS = 8;
const OPTIONS_COUNT = 4;

// Helper to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Get random words for the turn sequence
function getRandomWords(list, count) {
  const shuffled = shuffleArray([...list]);
  return shuffled.slice(0, count);
}

function Round3({ onRoundComplete, showScoreFeedback }) {
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [wordIndexToShow, setWordIndexToShow] = useState(0); // Index of the word currently displayed
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [questionWordIndex, setQuestionWordIndex] = useState(0); // 0-based index for the question (e.g., 0 for 1st word)
  const [options, setOptions] = useState([]); // Multiple choice options
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Track if submitted for feedback styling

  const intervalRef = useRef(null);
  const turnTimeoutRef = useRef(null);

  // Start a new turn or end the round
  useEffect(() => {
    if (turn <= TOTAL_TURNS) {
      setIsShowingSequence(true);
      setIsAwaitingInput(false);
      setSelectedOption(null);
      setSubmitted(false);
      setWordIndexToShow(0); // Start showing from the first word

      const sequence = getRandomWords(WORD_LIST, WORDS_PER_TURN);
      setCurrentSequence(sequence);

      // Clear previous timers/intervals
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);

      // Start showing words one by one
      intervalRef.current = setInterval(() => {
        setWordIndexToShow(prevIndex => prevIndex + 1);
      }, DISPLAY_INTERVAL_MS);

    } else {
      // Round finished
      onRoundComplete(3, score);
    }

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
    };
  }, [turn]);

  // Effect to handle end of sequence display and setup question
  useEffect(() => {
    if (isShowingSequence && wordIndexToShow >= WORDS_PER_TURN) {
      clearInterval(intervalRef.current); // Stop showing words
      setIsShowingSequence(false);

      // Ask question about a random word in the sequence
      const targetIndex = Math.floor(Math.random() * WORDS_PER_TURN);
      setQuestionWordIndex(targetIndex);
      const correctAnswer = currentSequence[targetIndex];

      // Generate distractors (ensure they are not the correct answer)
      const distractors = [];
      const availableDistractors = WORD_LIST.filter(word => word !== correctAnswer && !currentSequence.includes(word));
      const shuffledDistractors = shuffleArray(availableDistractors);
      while (distractors.length < OPTIONS_COUNT - 1 && shuffledDistractors.length > 0) {
          distractors.push(shuffledDistractors.pop());
      }
      // Fallback if not enough unique distractors (unlikely with a decent list)
       while (distractors.length < OPTIONS_COUNT - 1) {
           const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
           if (randomWord !== correctAnswer && !distractors.includes(randomWord)) {
               distractors.push(randomWord);
           }
       }


      // Combine correct answer with distractors and shuffle
      const allOptions = shuffleArray([correctAnswer, ...distractors]);
      setOptions(allOptions);
      setIsAwaitingInput(true); // Ready for user input
    }
  }, [wordIndexToShow, isShowingSequence, currentSequence]);


  const handleOptionSelect = (option) => {
    if (!isAwaitingInput || submitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!isAwaitingInput || selectedOption === null || submitted) return;

    setSubmitted(true); // Mark as submitted
    const correctAnswer = currentSequence[questionWordIndex];
    const isCorrect = selectedOption === correctAnswer;

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      showScoreFeedback(true);
    } else {
      setScore(prevScore => prevScore - 1);
      showScoreFeedback(false);
    }

    // Move to the next turn after a short delay
    turnTimeoutRef.current = setTimeout(() => {
      setTurn(prevTurn => prevTurn + 1);
    }, 1200); // Delay to allow user to see feedback on options
  };

  const getOptionClass = (option) => {
      let className = 'option-button';
      if (option === selectedOption) {
          className += ' selected';
      }
      if (submitted) {
          const correctAnswer = currentSequence[questionWordIndex];
          if (option === correctAnswer) {
              className += ' correct'; // Always highlight correct answer after submission
          } else if (option === selectedOption && option !== correctAnswer) {
              className += ' incorrect'; // Highlight selected wrong answer
          }
      }
      return className;
  }

  return (
    <div className="container round-container">
      <h2>Round 3: Word Sequence</h2>
      <p>Turn: {turn} / {TOTAL_TURNS} | Score: {score}</p>

      {isShowingSequence && wordIndexToShow < WORDS_PER_TURN && (
        <div className="word-display" style={{ fontSize: '2.5em', margin: '30px 0', minHeight: '1.5em' }}>
          {currentSequence[wordIndexToShow]}
        </div>
      )}

      {isAwaitingInput && (
        <div className="question-area">
          <h3>{`What was word #${questionWordIndex + 1}?`}</h3>
          <div className="options-container">
            {options.map((option, index) => (
              <button
                key={index}
                className={getOptionClass(option)}
                onClick={() => handleOptionSelect(option)}
                disabled={submitted} // Disable after submitting
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || submitted}
            style={{ marginTop: '20px' }}
          >
            Submit Answer
          </button>
        </div>
      )}

       {turn > TOTAL_TURNS && (
         <p>Calculating final score...</p>
      )}
       {!isShowingSequence && !isAwaitingInput && turn <= TOTAL_TURNS && (
            <div style={{ minHeight: '1.5em', margin: '30px 0', fontSize: '2.5em' }}>&nbsp;</div> // Placeholder
       )}
    </div>
  );
}

export default Round3;