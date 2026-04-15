const loadAssets = () => {
  const images = {
    background: new Image(),
    ground: new Image(),
    birdMid: new Image(),
    birdUp: new Image(),
    birdDown: new Image(),
    pipeGreen: new Image(),
    pipeGreenInverted: new Image(),
    gameover: new Image(),
    message: new Image(),
  };

  images.background.src = '/assets/sprites/background-day.png';
  images.ground.src = '/assets/sprites/base.png';
  images.birdMid.src = '/assets/sprites/yellowbird-midflap.png';
  images.birdUp.src = '/assets/sprites/yellowbird-upflap.png';
  images.birdDown.src = '/assets/sprites/yellowbird-downflap.png';
  images.pipeGreen.src = '/assets/sprites/pipe-green.png';
  images.pipeGreenInverted.src = '/assets/sprites/pipe-green.png'; // We'll handle flipping in draw
  images.gameover.src = '/assets/sprites/gameover.png';
  images.message.src = '/assets/sprites/message.png';

  const audio = {
    die: new Audio('/assets/audio/die.wav'),
    hit: new Audio('/assets/audio/hit.wav'),
    point: new Audio('/assets/audio/point.wav'),
    swoosh: new Audio('/assets/audio/swoosh.wav'),
    wing: new Audio('/assets/audio/wing.wav'),
  };

  return { images, audio };
};

export default loadAssets;
