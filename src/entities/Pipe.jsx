import GameObject from './GameObject.jsx';
import { PIPE_SPEED, PIPE_WIDTH, PIPE_GAP, CANVAS_HEIGHT } from '../utils/constants.js';

class Pipe extends GameObject {
  constructor(x, topHeight, images) {
    super(x, 0, PIPE_WIDTH, CANVAS_HEIGHT);
    this.topHeight = topHeight;
    this.bottomY = topHeight + PIPE_GAP;
    this.bottomHeight = CANVAS_HEIGHT - this.bottomY;
    this.passed = false;
    this.images = images;
  }

  update() {
    this.x -= PIPE_SPEED;
  }

  draw(ctx) {
    if (this.images && this.images.pipeGreen.complete) {
      // Draw top pipe (flipped)
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.topHeight / 2);
      ctx.rotate(Math.PI);
      ctx.drawImage(this.images.pipeGreen, -this.width / 2, -this.topHeight / 2, this.width, this.topHeight);
      ctx.restore();

      // Draw bottom pipe
      ctx.drawImage(this.images.pipeGreen, this.x, this.bottomY, this.width, this.bottomHeight);
    } else {
      // Placeholder
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, 0, this.width, this.topHeight);
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
