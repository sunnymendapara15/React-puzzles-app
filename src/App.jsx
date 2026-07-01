import { useState } from 'react';
import './App.css';

const wordBank = ['GALAXY', 'ORANGE', 'PUZZLE', 'BREEZE', 'CANDLE', 'RIVER', 'SPARK', 'MANGO'];

const scrambleWord = (word) => {
  if (word.length < 2) return word;
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const scrambled = letters.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
};

const createWordPuzzle = () => {
  const word = wordBank[Math.floor(Math.random() * wordBank.length)];
  return {
    id: `word-${word}-${Date.now()}`,
    type: 'Word Scramble',
    prompt: scrambleWord(word),
    answer: word,
    description: 'Unscramble the letters above.',
    hint: 'Think of a familiar noun that keeps popping up in short stories.'
  };
};

const createMathPuzzle = () => {
  const left = Math.ceil(Math.random() * 12);
  const right = Math.ceil(Math.random() * 12);
  return {
    id: `math-${left}-${right}-${Date.now()}`,
    type: 'Math Challenge',
    prompt: `${left} × ${right}`,
    answer: (left * right).toString(),
    description: 'Multiply the two numbers and enter the total.',
    hint: 'Use the basic multiplication tables you remember from school.'
  };
};

const riddles = [
  {
    prompt: 'I can be cracked, made, told, and played. What am I?',
    answer: 'JOKE',
    hint: 'A quick way to turn a quiet room into laughter.',
    description: 'Solve the riddle to reveal the secret word.'
  },
  {
    prompt: 'What gets wetter as it dries?',
    answer: 'TOWEL',
    hint: 'You call on it after a shower.',
    description: 'Crack the riddle to unlock the answer.'
  },
  {
    prompt: 'I speak without a mouth and hear without ears. What am I?',
    answer: 'ECHO',
    hint: 'You might hear me bounce off a cliff.',
    description: 'Ponder the words and submit your guess.'
  }
];

const createRiddlePuzzle = () => {
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];
  return {
    id: `riddle-${riddle.answer}-${Date.now()}`,
    type: 'Riddle',
    prompt: riddle.prompt,
    answer: riddle.answer,
    description: riddle.description,
    hint: riddle.hint
  };
};

const puzzleGenerators = [createWordPuzzle, createMathPuzzle, createRiddlePuzzle];
const getFreshPuzzle = () => puzzleGenerators[Math.floor(Math.random() * puzzleGenerators.length)]();

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(getFreshPuzzle);
  const [submission, setSubmission] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = submission.trim();
    if (!trimmed) {
      setFeedback({ message: 'Type an answer before submitting.', success: false });
      return;
    }
    const normalized = trimmed.toUpperCase();
    const correct = normalized === currentPuzzle.answer.toUpperCase();
    setFeedback({
      message: correct ? 'You nailed it! 🎉' : 'Keep trying — almost there.',
      success: correct
    });
    setHistory((prev) => {
      const next = [
        {
          id: currentPuzzle.id,
          type: currentPuzzle.type,
          prompt: currentPuzzle.prompt,
          answer: currentPuzzle.answer,
          submission: trimmed,
          correct
        },
        ...prev
      ];
      return next.slice(0, 6);
    });
    if (correct) {
      setSubmission('');
    }
  };

  const handleNewPuzzle = () => {
    setCurrentPuzzle(getFreshPuzzle());
    setSubmission('');
    setFeedback(null);
    setHintVisible(false);
  };

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Mini Puzzle Playground</p>
        <h1>React Puzzles App</h1>
        <p>Fresh brain teasers with hints and a short result history.</p>
      </header>

      <section className="puzzle-card">
        <div className="puzzle-meta">
          <span>{currentPuzzle.type}</span>
          <button type="button" onClick={handleNewPuzzle}>New puzzle</button>
        </div>
        <p className="puzzle-description">{currentPuzzle.description}</p>
        <div className="puzzle-prompt">{currentPuzzle.prompt}</div>

        <form className="answer-form" onSubmit={handleSubmit}>
          <input
            className="answer-input"
            placeholder="Enter your answer…"
            value={submission}
            onChange={(event) => setSubmission(event.target.value)}
          />
          <button className="submit-button" type="submit">Check</button>
        </form>

        {feedback && (
          <p className={`feedback ${feedback.success ? 'correct' : 'incorrect'}`}>
            {feedback.message}
          </p>
        )}

        <div className="hint-area">
          {hintVisible && <p>{currentPuzzle.hint}</p>}
          <button type="button" className="hint-toggle" onClick={() => setHintVisible((visible) => !visible)}
          >
            {hintVisible ? 'Hide hint' : 'Show hint'}
          </button>
        </div>
      </section>

      <section className="history-panel">
        <h2>Recent results</h2>
        {history.length === 0 ? (
          <p className="empty-state">Solve a puzzle to build your recent streak.</p>
        ) : (
          <ul className="history-list">
            {history.map((entry) => (
              <li key={`${entry.id}-${entry.submission}-${entry.correct ? '1' : '0'}`} className="history-item">
                <div className="history-text">
                  <strong>{entry.type}</strong>
                  <span>{entry.prompt}</span>
                  <span>Answer: {entry.answer}</span>
                </div>
                <span className={`status-badge ${entry.correct ? 'correct' : 'incorrect'}`} >
                  {entry.correct ? 'Correct' : 'Try again'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
