import React from 'react';
import { BIRD_SKINS, PIPE_COLORS, THEMES, DIFFICULTY_LEVELS } from '../utils/constants.js';

const Settings = ({ settings, onUpdate, onBack }) => {
  const handleChange = (key, value) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="game-overlay settings-menu">
      <h2>Settings</h2>
      
      <div className="setting-item">
        <label>Sound: </label>
        <button 
          className={settings.sound ? 'active' : ''} 
          onClick={() => handleChange('sound', !settings.sound)}
        >
          {settings.sound ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>Difficulty: </label>
        <select 
          value={settings.difficulty} 
          onChange={(e) => handleChange('difficulty', e.target.value)}
        >
          {Object.keys(DIFFICULTY_LEVELS).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>Bird Skin: </label>
        <div className="skin-options">
          {Object.values(BIRD_SKINS).map(skin => (
            <button 
              key={skin} 
              className={settings.birdSkin === skin ? 'active' : ''}
              onClick={() => handleChange('birdSkin', skin)}
              style={{ backgroundColor: skin }}
            >
              {skin}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <label>Pipe Color: </label>
        <div className="skin-options">
          {Object.values(PIPE_COLORS).map(color => (
            <button 
              key={color} 
              className={settings.pipeColor === color ? 'active' : ''}
              onClick={() => handleChange('pipeColor', color)}
              style={{ backgroundColor: color === 'green' ? '#73bf2e' : '#ff4d4d' }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <label>Theme: </label>
        <button onClick={() => handleChange('theme', settings.theme === 'day' ? 'night' : 'day')}>
          {settings.theme.toUpperCase()}
        </button>
      </div>

      <button className="back-button" onClick={onBack}>Back to Menu</button>
    </div>
  );
};

export default Settings;
