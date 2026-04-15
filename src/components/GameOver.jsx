import React from 'react';

const GameOver = ({ score, highScore, onRestart, onMenu }) => {
  return (
    <div className="game-overlay game-over">
      <h1>Game Over</h1>
      <div className="scores">
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
      </div>
      <div className="actions">
        <button onClick={onRestart}>Play Again</button>
        <button onClick={onMenu}>Main Menu</button>
      </div>
    </div>
  );
};

export default GameOver;
