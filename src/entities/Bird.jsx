import GameObject from './GameObject.jsx';
import { GRAVITY, JUMP_STRENGTH, BIRD_SIZE } from '../utils/constants.js';

class Bird extends GameObject {
  constructor(x, y, images) {
    super(x, y, 34, 24); // Original sprite size is roughly 34x24
    this.velocity = 0;
    this.rotation = 0;
    this.images = images;
    this.flapFrame = 0;
  }

  jump(audio) {
    this.velocity = JUMP_STRENGTH;
    if (audio) {
      audio.wing.currentTime = 0;
      audio.wing.play().catch(() => {});
    }
  }

  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;
    this.flapFrame = (this.flapFrame + 0.1) % 3;

    // Rotation logic
    if (this.velocity < 0) {
      this.rotation = -Math.PI / 8;
    } else {
      this.rotation = Math.min(Math.PI / 2, this.rotation + 0.05);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    let img = this.images.birdMid;
    const frame = Math.floor(this.flapFrame);
    if (frame === 0) img = this.images.birdUp;
    else if (frame === 2) img = this.images.birdDown;

    if (img && img.complete) {
      ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
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
