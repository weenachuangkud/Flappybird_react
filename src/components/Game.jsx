import React, { useRef, useState, useEffect, useCallback } from 'react';
import Bird from '../entities/Bird.jsx';
import Pipe from '../entities/Pipe.jsx';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES, DIFFICULTY_LEVELS } from '../utils/constants.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { checkBirdPipeCollision, checkWorldCollision } from '../utils/collision.js';
import MainMenu from './MainMenu.jsx';
import GameOver from './GameOver.jsx';
import Settings from './Settings.jsx';
import loadAssets from '../utils/assetLoader.js';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('flappyHighScore')) || 0
  );

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('flappySettings');
    return saved ? JSON.parse(saved) : {
      sound: true,
      difficulty: 'NORMAL',
      birdSkin: 'yellow',
      pipeColor: 'green',
      theme: 'day'
    };
  });

  useEffect(() => {
    localStorage.setItem('flappySettings', JSON.stringify(settings));
  }, [settings]);
  
  const assetsRef = useRef(null);
  const birdRef = useRef(null);
  const pipesRef = useRef([]);
  const frameCountRef = useRef(0);
  const groundXRef = useRef(0);

  useEffect(() => {
    assetsRef.current = loadAssets();
    birdRef.current = new Bird(50, CANVAS_HEIGHT / 2, assetsRef.current.images, settings.birdSkin);
  }, []);

  // Update bird skin when settings change
  useEffect(() => {
    if (birdRef.current) {
      birdRef.current.skin = settings.birdSkin;
    }
  }, [settings.birdSkin]);

  const resetGame = () => {
    birdRef.current = new Bird(50, CANVAS_HEIGHT / 2, assetsRef.current.images, settings.birdSkin);
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
    if (settings.sound && assetsRef.current.audio.swoosh) {
      assetsRef.current.audio.swoosh.play().catch(() => {});
    }
  };

  const handleJump = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      birdRef.current.jump(assetsRef.current.audio, settings.sound);
    }
  }, [gameState, settings.sound]);

  const handleCollision = useCallback((type) => {
    if (gameState !== GAME_STATES.PLAYING) return;

    if (type === 'pipe') {
      setGameState(GAME_STATES.DYING);
      if (birdRef.current) {
        birdRef.current.velocity = -6;
      }
      if (settings.sound && assetsRef.current.audio.hit) {
        assetsRef.current.audio.hit.play().catch(() => {});
      }
    } else {
      finishGame();
    }
  }, [gameState, assetsRef, settings.sound, finishGame]);

  const finishGame = useCallback(() => {
    setGameState(GAME_STATES.GAME_OVER);
    
    if (gameState === GAME_STATES.PLAYING && settings.sound && assetsRef.current.audio.hit) {
      assetsRef.current.audio.hit.play().catch(() => {});
    }

    if (settings.sound && assetsRef.current.audio.die) {
      assetsRef.current.audio.die.play().catch(() => {});
    }

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score.toString());
    }
  }, [score, highScore, gameState, settings.sound]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (gameState === GAME_STATES.PLAYING) {
          handleJump();
        } else if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
          resetGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump, gameState, resetGame]);

  const update = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING && gameState !== GAME_STATES.DYING) return;

    const bird = birdRef.current;
    bird.update();

    const groundY = CANVAS_HEIGHT - 112;

    if (checkWorldCollision(bird, groundY)) {
      if (gameState === GAME_STATES.DYING) {
        finishGame();
      } else {
        handleCollision('ground');
      }
      return;
    }

    if (gameState === GAME_STATES.DYING) return;

    const diff = DIFFICULTY_LEVELS[settings.difficulty];

    groundXRef.current = (groundXRef.current - diff.PIPE_SPEED) % CANVAS_WIDTH;

    if (frameCountRef.current % diff.PIPE_SPACING === 0) {
      const minHeight = 50;
      const maxHeight = CANVAS_HEIGHT - diff.PIPE_GAP - minHeight - 112;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipesRef.current.push(new Pipe(
        CANVAS_WIDTH, 
        topHeight, 
        diff.PIPE_GAP, 
        diff.PIPE_SPEED, 
        assetsRef.current.images, 
        settings.pipeColor
      ));
    }

    pipesRef.current.forEach((pipe) => {
      pipe.update();

      if (checkBirdPipeCollision(bird, pipe)) {
        handleCollision('pipe');
      }

      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        setScore((prev) => prev + 1);
        if (settings.sound && assetsRef.current.audio.point) {
          assetsRef.current.audio.point.play().catch(() => {});
        }
      }
    });

    pipesRef.current = pipesRef.current.filter((pipe) => pipe.x + pipe.width > 0);
    
    frameCountRef.current++;
  }, [gameState, handleCollision, finishGame, settings]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !assetsRef.current) return;
    const ctx = canvas.getContext('2d');
    const images = assetsRef.current.images;
    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const backgroundImg = images.backgrounds[settings.theme];
    if (backgroundImg && backgroundImg.complete) {
      ctx.drawImage(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = settings.theme === 'day' ? '#70c5ce' : '#001933';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    pipesRef.current.forEach((pipe) => pipe.draw(ctx));
    if (birdRef.current) birdRef.current.draw(ctx);

    if (images.ground.complete) {
      const groundHeight = 112;
      const groundY = CANVAS_HEIGHT - groundHeight;
      ctx.drawImage(images.ground, groundXRef.current, groundY, CANVAS_WIDTH, groundHeight);
      ctx.drawImage(images.ground, groundXRef.current + CANVAS_WIDTH, groundY, CANVAS_WIDTH, groundHeight);
    }
  }, [settings.theme]);

  useGameLoop(() => {
    update();
    draw();
  }, true);

  return (
    <div className="game-container" onClick={handleJump}>
      {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.DYING) && (
        <div className="hud">{score}</div>
      )}
      
      {gameState === GAME_STATES.MENU && (
        <MainMenu 
          onStart={resetGame} 
          onSettings={() => setGameState(GAME_STATES.SETTINGS)} 
        />
      )}

      {gameState === GAME_STATES.SETTINGS && (
        <Settings 
          settings={settings} 
          onUpdate={setSettings} 
          onBack={() => setGameState(GAME_STATES.MENU)} 
        />
      )}
      
      {gameState === GAME_STATES.GAME_OVER && (
        <GameOver 
          score={score} 
          highScore={highScore} 
          onRestart={resetGame} 
          onMenu={() => setGameState(GAME_STATES.MENU)} 
        />
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  );
};

export default Game;
