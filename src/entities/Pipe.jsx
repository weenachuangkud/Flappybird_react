import GameObject from './GameObject.jsx';
import { PIPE_WIDTH, CANVAS_HEIGHT } from '../utils/constants.js';

class Pipe extends GameObject {
  constructor(x, topHeight, gap, speed, images, color = 'green') {
    super(x, 0, PIPE_WIDTH, CANVAS_HEIGHT);
    this.topHeight = topHeight;
    this.gap = gap;
    this.speed = speed;
    this.bottomY = topHeight + gap;
    this.bottomHeight = CANVAS_HEIGHT - this.bottomY;
    this.passed = false;
    this.images = images;
    this.color = color;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    const pipeImg = this.images.pipes[this.color];
    if (pipeImg && pipeImg.complete) {
      const dw = this.width;
      const sw = pipeImg.width || dw;
      const sh = pipeImg.height || 320;
      const dh = sh * (dw / sw);
      
      ctx.save();
      ctx.translate(this.x + dw / 2, this.topHeight);
      ctx.rotate(Math.PI);
      ctx.drawImage(pipeImg, -dw / 2, 0, dw, dh);
      ctx.restore();

      ctx.drawImage(pipeImg, this.x, this.bottomY, dw, dh);
    } else {
      ctx.fillStyle = this.color === 'red' ? '#ff4d4d' : '#73bf2e';
      ctx.fillRect(this.x, 0, this.width, this.topHeight);
      ctx.fillRect(this.x, this.bottomY, this.width, this.bottomHeight);
    }
  }

  getBounds() {
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
