# Flappy Bird Clone - Project Specification

## Overview
A browser-based Flappy Bird clone built with React and HTML5 Canvas, demonstrating object-oriented programming principles and game development patterns.

## Architecture & Design Patterns

### Object-Oriented Programming (OOP)
The game uses class-based inheritance to share common behavior across game entities:

GameObject.jsx (Base Class) -> Bird.jsx, Pipe.jsx

**Base Class: `GameObject`**
- Provides core properties: position (x, y), dimensions (width, height)
- Defines common methods:
  - `update()` - Updates object state each frame
  - `draw()` - Renders object to canvas/screen
  - `getBounds()` - Returns collision box(es) for hit detection

**Derived Classes:**
- `Bird.jsx` - Extends GameObject with gravity, jump mechanics, rotation, and skin support.
- `Pipe.jsx` - Extends GameObject with scrolling behavior, gap positioning, and color variations.

### Key Design Patterns
- **Game Loop Pattern**: Continuous update-render cycle via `useGameLoop` hook using `requestAnimationFrame`.
- **State Management**: React hooks for game state and persistent user settings.
- **Component Architecture**: Separation of game logic (entities), UI (React components), and asset management.

## Game Flow & Lifecycle

Main Menu -> Play Button -> Playing State -> (on collision) -> Dying State -> (hit ground) -> Game Over Screen -> Play Again or Main Menu

### State Transitions
1. **MENU** -> User clicks "Play" -> **PLAYING**
2. **MENU** -> User clicks "Settings" -> **SETTINGS**
3. **PLAYING** -> Collision with pipe detected -> **DYING** (Bird bumps up with velocity -6, movement pauses)
4. **PLAYING** -> Collision with ground detected -> **GAME_OVER**
5. **DYING** -> Bird hits ground -> **GAME_OVER**
6. **GAME_OVER** -> User clicks "Play Again" -> **PLAYING**
7. **GAME_OVER** -> User clicks "Menu" -> **MENU**
8. **SETTINGS** -> User clicks "Back" -> **MENU**

## Core Gameplay Mechanics

### Bird Physics
- Constant downward gravity acceleration (0.4)
- Jump impulse on spacebar/click (Upward velocity boost: -8)
- Death jump: Bird gets upward velocity of -6 upon hitting a pipe before falling.
- Rotation based on vertical velocity (tilt up when rising, down when falling)
- Flap animation cycling through up/mid/down sprites.

### Pipe System
- Continuous scrolling from right to left
- Difficulty-based configuration (Speed, Gap Size, Spacing)
- Random vertical positioning of the gap
- Pipes despawn when off-screen (left edge)
- New pipes spawn based on distance spacing
- Score increments when bird passes pipe center
- Movement (scrolling) pauses during **DYING** state

### Collision Detection
- Bird boundaries (with padding) vs. pipe boundaries (dual rectangles): Triggers **DYING** state.
- Bird vs. ground/ceiling boundaries: Triggers instant **GAME_OVER** or ends **DYING** state.

## Technical Implementation

### File Structure
- src/components/ - Game.jsx (Main orchestrator), MainMenu.jsx, GameOver.jsx, Settings.jsx
- src/entities/ - GameObject.jsx, Bird.jsx, Pipe.jsx
- src/hooks/ - useGameLoop.js
- src/utils/ - collision.js, constants.js, assetLoader.js
- App.jsx

### State Management & Persistence
- Game states: MENU, PLAYING, DYING, GAME_OVER, SETTINGS
- Core state: gameState, score, highScore, bird, pipes
- Persistence: `localStorage` used for high score and user settings (sound, difficulty, skins).

### Rendering
- HTML5 Canvas for high-performance game rendering.
- React components for UI overlays (Menu, HUD, Game Over, Settings).
- Responsive ground scrolling and background themes.

## Assets & Resources
- Sprites: birds (yellow, blue, red), pipes (green, red), backgrounds (day, night), ground.
- Audio: die, hit, point, swoosh, wing.
- Dynamic asset loading via `assetLoader.js`.

## Game Configuration Constants

### Difficulty Levels
- **EASY**: Speed 2.5, Gap 180, Spacing 220
- **NORMAL**: Speed 3, Gap 150, Spacing 200
- **HARD**: Speed 4, Gap 120, Spacing 180

### General Constants
- GRAVITY: 0.4
- JUMP_STRENGTH: -8
- CANVAS_WIDTH: 400
- CANVAS_HEIGHT: 600
- BIRD_SIZE: 34
- PIPE_WIDTH: 52

## Development Status
- Phase 1 & 2: Core mechanics and UI completed.
- Phase 3: Visual assets, audio, and mobile touch controls implemented.
- Phase 4: Settings menu, skins, and difficulty levels implemented.

## Resolved Questions
- Rendering approach: HTML5 Canvas for the game world, React for UI.
- Score calculation: Per pipe passed.
- Difficulty curve: Selectable difficulty levels with varying speed and gap sizes.
- Persistence: Handled via `localStorage`.
