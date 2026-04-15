import GameObject from './GameObject.jsx';
import { GRAVITY, JUMP_STRENGTH, BIRD_SIZE } from '../utils/constants.js';

class Bird extends GameObject {
  constructor(x, y) {
    super(x, y, BIRD_SIZE, BIRD_SIZE);
    this.velocity = 0;
    this.rotation = 0;
    this.image = null; // To be loaded in Phase 3
  }

  jump() {
    this.velocity = JUMP_STRENGTH;
  }

  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;

    // Rotation logic based on velocity
    if (this.velocity < 0) {
      this.rotation = -Math.PI / 6; // Tilt up
    } else if (this.velocity > 5) {
      this.rotation = Math.min(Math.PI / 2, this.rotation + 0.1); // Tilt down
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    if (this.image) {
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      // Placeholder
      ctx.fillStyle = 'yellow';
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    
    ctx.restore();
  }

  getBounds() {
    // Slightly smaller hit box for better gameplay feel
    const padding = 5;
    return {
      left: this.x + padding,
      right: this.x + this.width - padding,
      top: this.y + padding,
      bottom: this.y + this.height - padding,
    };
  }
}

export default Bird;
