import GameObject from './GameObject.jsx';
import { PIPE_SPEED, PIPE_WIDTH, PIPE_GAP, CANVAS_HEIGHT } from '../utils/constants.js';

class Pipe extends GameObject {
  constructor(x, topHeight) {
    super(x, 0, PIPE_WIDTH, CANVAS_HEIGHT);
    this.topHeight = topHeight;
    this.bottomY = topHeight + PIPE_GAP;
    this.bottomHeight = CANVAS_HEIGHT - this.bottomY;
    this.passed = false;
    this.topPipeImage = null; // To be loaded in Phase 3
    this.bottomPipeImage = null; // To be loaded in Phase 3
  }

  update() {
    this.x -= PIPE_SPEED;
  }

  draw(ctx) {
    if (this.topPipeImage && this.bottomPipeImage) {
      // Draw top pipe
      ctx.drawImage(this.topPipeImage, this.x, 0, this.width, this.topHeight);
      // Draw bottom pipe
      ctx.drawImage(this.bottomPipeImage, this.x, this.bottomY, this.width, this.bottomHeight);
    } else {
      // Placeholder
      ctx.fillStyle = 'green';
      // Top pipe
      ctx.fillRect(this.x, 0, this.width, this.topHeight);
      // Bottom pipe
      ctx.fillRect(this.x, this.bottomY, this.width, this.bottomHeight);
    }
  }

  getBounds() {
    // Returns two rectangles for collision detection
    return [
      {
        left: this.x,
        right: this.x + this.width,
        top: 0,
        bottom: this.topHeight,
      },
      {
        left: this.x,
        right: this.x + this.width,
        top: this.bottomY,
        bottom: CANVAS_HEIGHT,
      },
    ];
  }
}

export default Pipe;
