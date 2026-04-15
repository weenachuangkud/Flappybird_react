import React from 'react';

const MainMenu = ({ onStart, onSettings }) => {
  return (
    <div className="game-overlay main-menu">
      <h1>Flappy Bird</h1>
      <div className="menu-buttons">
        <button onClick={onStart}>Play Game</button>
        <button onClick={onSettings}>Settings</button>
      </div>
      <div className="instructions">
        <p>Press SPACE or Click to Jump</p>
      </div>
    </div>
  );
};

export default MainMenu;
