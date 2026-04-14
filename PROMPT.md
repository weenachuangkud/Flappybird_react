# Flappy Bird Clone - Project Specification

## Overview
A browser-based Flappy Bird clone built with React, demonstrating object-oriented programming principles and game development patterns.

## Architecture & Design Patterns

### Object-Oriented Programming (OOP)
The game uses class-based inheritance to share common behavior across game entities:

GameObject.jsx (Base Class) -> Bird.jsx, Pipe.jsx

**Base Class: `GameObject`**
- Provides core properties: position (x, y), dimensions (width, height)
- Defines common methods:
  - `update()` - Updates object state each frame
  - `draw()` - Renders object to canvas/screen
  - `getBounds()` - Returns collision box for hit detection

**Derived Classes:**
- `Bird.jsx` - Extends GameObject with gravity, jump mechanics, rotation
- `Pipe.jsx` - Extends GameObject with scrolling behavior, gap positioning

### Key Design Patterns
- **Game Loop Pattern**: Continuous update-render cycle
- **State Management**: React hooks for game state (menu, playing, dead)
- **Component Architecture**: Separation of game logic and UI presentation

## Game Flow & Lifecycle

Main Menu -> Play Button -> Playing State -> (on collision) -> Game Over Screen -> Play Again or Main Menu

### State Transitions
1. **MENU** -> User clicks "Play" -> **PLAYING**
2. **PLAYING** -> Collision detected -> **GAME_OVER**
3. **GAME_OVER** -> User clicks "Play Again" -> **PLAYING**
4. **GAME_OVER** -> User clicks "Menu" -> **MENU**

## Core Gameplay Mechanics

### Bird Physics
- Constant downward gravity acceleration
- Jump impulse on spacebar/click (upward velocity boost)
- Rotation based on vertical velocity (tilt up when rising, down when falling)

### Pipe System
- Continuous scrolling from right to left
- Random gap positioning (within constraints)
- Pipes despawn when off-screen (left edge)
- New pipes spawn at regular intervals
- Score increments when bird passes pipe center

### Collision Detection
- Bird boundaries vs. pipe boundaries (rectangle collision)
- Bird vs. ground/ceiling boundaries

## Technical Implementation

### File Structure (Planned)
- src/components/ - Game.jsx, MainMenu.jsx, GameOver.jsx, Settings.jsx
- src/entities/ - GameObject.jsx, Bird.jsx, Pipe.jsx
- src/hooks/ - useGameLoop.js
- src/utils/ - collision.js, constants.js
- App.jsx

### State Management
Game states: MENU, PLAYING, PAUSED, GAME_OVER
Core state: gameState, score, highScore, bird, pipes

## Assets & Resources
- Located in Assets folder

## Game Configuration Constants

Example constants (to be refined):
- GRAVITY: 0.6
- JUMP_STRENGTH: -10
- PIPE_SPEED: 3
- PIPE_GAP: 150
- PIPE_SPACING: 200
- CANVAS_WIDTH: 400
- CANVAS_HEIGHT: 600
- BIRD_SIZE: 34
- PIPE_WIDTH: 52

## Development Roadmap

### Phase 1: Core Mechanics (Current)
- Define architecture
- Implement GameObject base class
- Implement Bird with physics
- Implement Pipe generation
- Basic collision detection
- Simple score system

### Phase 2: Game Loop & UI
- Main menu screen
- Game over screen with restart
- Score display during gameplay
- High score persistence (localStorage)

### Phase 3: Polish
- Add visual assets
- Smooth animations
- Particle effects (optional)
- Sound effects
- Mobile touch controls

### Phase 4: Enhancements (Future)
- Settings menu (sound toggle, difficulty)
- Different bird skins
- Day/night themes
- Leaderboard integration

## Questions to Resolve
- Rendering approach: HTML Canvas vs. CSS/DOM manipulation?
- Mobile responsiveness strategy?
- Score calculation: per pipe or distance-based?
- Difficulty curve: increasing speed over time?
