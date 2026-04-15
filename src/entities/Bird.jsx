import GameObject from './GameObject.jsx';
import { GRAVITY, JUMP_STRENGTH } from '../utils/constants.js';

class Bird extends GameObject {
  constructor(x, y, images, skin = 'yellow') {
    super(x, y, 34, 24);
    this.velocity = 0;
    this.rotation = 0;
    this.images = images;
    this.skin = skin;
    this.flapFrame = 0;
  }

  jump(audio, soundEnabled = true) {
    this.velocity = JUMP_STRENGTH;
    if (soundEnabled && audio) {
      audio.wing.currentTime = 0;
      audio.wing.play().catch(() => {});
    }
  }

  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;
    this.flapFrame = (this.flapFrame + 0.1) % 3;

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
    
    const skinImages = this.images.birds[this.skin];
    let img = skinImages.mid;
    const frame = Math.floor(this.flapFrame);
    if (frame === 0) img = skinImages.up;
    else if (frame === 2) img = skinImages.down;

    if (img && img.complete) {
      ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = this.skin;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    
    ctx.restore();
  }

  getBounds() {
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
