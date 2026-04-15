import React from 'react';

const MainMenu = ({ onStart }) => {
  return (
    <div className="game-overlay main-menu">
      <h1>Flappy Bird</h1>
      <button onClick={onStart}>Play Game</button>
      <div className="instructions">
        <p>Press SPACE or Click to Jump</p>
      </div>
    </div>
  );
};

export default MainMenu;
