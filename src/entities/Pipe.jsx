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
      const pipeImg = this.images.pipeGreen;
      
      // Draw top pipe (flipped)
      // We want the 'cap' of the pipe to be at the bottom of the top section (at this.topHeight)
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.topHeight);
      ctx.rotate(Math.PI);
      // Draw from the gap upwards. 
      // We use a large height (like CANVAS_HEIGHT) to ensure it covers the screen regardless of topHeight
      ctx.drawImage(pipeImg, -this.width / 2, 0, this.width, CANVAS_HEIGHT);
      ctx.restore();

      // Draw bottom pipe
      // We want the 'cap' of the pipe to be at the top of the bottom section (at this.bottomY)
      ctx.drawImage(pipeImg, this.x, this.bottomY, this.width, CANVAS_HEIGHT);
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
