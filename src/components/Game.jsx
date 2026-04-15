import React, { useRef, useState, useEffect, useCallback } from 'react';
import Bird from '../entities/Bird.jsx';
import Pipe from '../entities/Pipe.jsx';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES, PIPE_SPACING, PIPE_GAP } from '../utils/constants.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { checkBirdPipeCollision, checkWorldCollision } from '../utils/collision.js';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  
  const birdRef = useRef(new Bird(50, CANVAS_HEIGHT / 2));
  const pipesRef = useRef([]);
  const frameCountRef = useRef(0);

  const resetGame = () => {
    birdRef.current = new Bird(50, CANVAS_HEIGHT / 2);
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
  };

  const handleJump = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      birdRef.current.jump();
    } else if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
      resetGame();
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') handleJump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  const update = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;

    const bird = birdRef.current;
    bird.update();

    // Check world collision (ground/ceiling)
    if (checkWorldCollision(bird, CANVAS_HEIGHT)) {
      setGameState(GAME_STATES.GAME_OVER);
    }

    // Update and spawn pipes
    if (frameCountRef.current % PIPE_SPACING === 0) {
      const minHeight = 50;
      const maxHeight = CANVAS_HEIGHT - PIPE_GAP - minHeight;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipesRef.current.push(new Pipe(CANVAS_WIDTH, topHeight));
    }

    pipesRef.current.forEach((pipe, index) => {
      pipe.update();

      // Check collision
      if (checkBirdPipeCollision(bird, pipe)) {
        setGameState(GAME_STATES.GAME_OVER);
      }

      // Update score
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        setScore((prev) => prev + 1);
      }
    });

    // Remove off-screen pipes
    pipesRef.current = pipesRef.current.filter((pipe) => pipe.x + pipe.width > 0);
    
    frameCountRef.current++;
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Background placeholder
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw entities
    pipesRef.current.forEach((pipe) => pipe.draw(ctx));
    birdRef.current.draw(ctx);

    // Draw UI Overlay
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameState === GAME_STATES.MENU) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    if (gameState === GAME_STATES.GAME_OVER) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.fillText('Press SPACE to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
  }, [gameState, score]);

  useGameLoop(() => {
    update();
    draw();
  }, true); // Always run loop to render even in MENU

  return (
    <div className="game-container" onClick={handleJump} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid #000', cursor: 'pointer' }}
      />
    </div>
  );
};

export default Game;
