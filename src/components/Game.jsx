import React, { useRef, useState, useEffect, useCallback } from 'react';
import Bird from '../entities/Bird.jsx';
import Pipe from '../entities/Pipe.jsx';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES, PIPE_SPACING, PIPE_GAP } from '../utils/constants.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { checkBirdPipeCollision, checkWorldCollision } from '../utils/collision.js';
import MainMenu from './MainMenu.jsx';
import GameOver from './GameOver.jsx';
import loadAssets from '../utils/assetLoader.js';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('flappyHighScore')) || 0
  );
  
  const assetsRef = useRef(null);
  const birdRef = useRef(null);
  const pipesRef = useRef([]);
  const frameCountRef = useRef(0);
  const groundXRef = useRef(0);

  useEffect(() => {
    assetsRef.current = loadAssets();
    birdRef.current = new Bird(50, CANVAS_HEIGHT / 2, assetsRef.current.images);
  }, []);

  const resetGame = () => {
    birdRef.current = new Bird(50, CANVAS_HEIGHT / 2, assetsRef.current.images);
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
    if (assetsRef.current.audio.swoosh) {
      assetsRef.current.audio.swoosh.play().catch(() => {});
    }
  };

  const handleJump = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      birdRef.current.jump(assetsRef.current.audio);
    }
  }, [gameState]);

  const handleCollision = useCallback((type) => {
    if (gameState !== GAME_STATES.PLAYING) return;

    if (type === 'pipe') {
      setGameState(GAME_STATES.DYING);
      if (birdRef.current) {
        birdRef.current.velocity = -6; // Small bump up
      }
      if (assetsRef.current.audio.hit) {
        assetsRef.current.audio.hit.play().catch(() => {});
      }
    } else {
      finishGame();
    }
  }, [gameState, assetsRef]);

  const finishGame = useCallback(() => {
    setGameState(GAME_STATES.GAME_OVER);
    
    // Play hit if we didn't already (e.g. hitting ground directly)
    if (gameState === GAME_STATES.PLAYING && assetsRef.current.audio.hit) {
      assetsRef.current.audio.hit.play().catch(() => {});
    }

    if (assetsRef.current.audio.die) {
      assetsRef.current.audio.die.play().catch(() => {});
    }

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score.toString());
    }
  }, [score, highScore, gameState, assetsRef]);

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
  }, [handleJump, gameState]);

  const update = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING && gameState !== GAME_STATES.DYING) return;

    const bird = birdRef.current;
    bird.update();

    const groundY = CANVAS_HEIGHT - 112;

    // Check world collision (ground/ceiling)
    if (checkWorldCollision(bird, groundY)) {
      if (gameState === GAME_STATES.DYING) {
        finishGame();
      } else {
        handleCollision('ground');
      }
      return;
    }

    // If dying, we only update bird physics until it hits ground
    if (gameState === GAME_STATES.DYING) return;

    // Update ground
    groundXRef.current = (groundXRef.current - 3) % CANVAS_WIDTH;

    // Update and spawn pipes
    if (frameCountRef.current % PIPE_SPACING === 0) {
      const minHeight = 50;
      const maxHeight = CANVAS_HEIGHT - PIPE_GAP - minHeight - 112;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipesRef.current.push(new Pipe(CANVAS_WIDTH, topHeight, assetsRef.current.images));
    }

    pipesRef.current.forEach((pipe) => {
      pipe.update();

      // Check collision
      if (checkBirdPipeCollision(bird, pipe)) {
        handleCollision('pipe');
      }

      // Update score
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        setScore((prev) => prev + 1);
        if (assetsRef.current.audio.point) {
          assetsRef.current.audio.point.play().catch(() => {});
        }
      }
    });

    // Remove off-screen pipes
    pipesRef.current = pipesRef.current.filter((pipe) => pipe.x + pipe.width > 0);
    
    frameCountRef.current++;
  }, [gameState, handleCollision, finishGame]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !assetsRef.current) return;
    const ctx = canvas.getContext('2d');
    const images = assetsRef.current.images;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw Background
    if (images.background.complete) {
      ctx.drawImage(images.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw entities
    pipesRef.current.forEach((pipe) => pipe.draw(ctx));
    if (birdRef.current) birdRef.current.draw(ctx);

    // Draw Ground
    if (images.ground.complete) {
      const groundHeight = 112;
      const groundY = CANVAS_HEIGHT - groundHeight;
      ctx.drawImage(images.ground, groundXRef.current, groundY, CANVAS_WIDTH, groundHeight);
      ctx.drawImage(images.ground, groundXRef.current + CANVAS_WIDTH, groundY, CANVAS_WIDTH, groundHeight);
    }
  }, []);

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
        <MainMenu onStart={resetGame} />
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
