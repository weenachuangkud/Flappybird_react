const loadAssets = () => {
  const images = {
    backgrounds: {
      day: new Image(),
      night: new Image(),
    },
    
    ground: new Image(),
    
    birds: {
      yellow: {
        up: new Image(),
        mid: new Image(),
        down: new Image(),
      },
      
      blue: {
        up: new Image(),
        mid: new Image(),
        down: new Image(),
      },
      
      red: {
        up: new Image(),
        mid: new Image(),
        down: new Image(),
      },
    },
    
    pipes: {
      green: new Image(),
      red: new Image(),
    },
  };

  images.backgrounds.day.src = '/assets/sprites/background-day.png';
  images.backgrounds.night.src = '/assets/sprites/background-night.png';
  images.ground.src = '/assets/sprites/base.png';

  images.birds.yellow.up.src = '/assets/sprites/yellowbird-upflap.png';
  images.birds.yellow.mid.src = '/assets/sprites/yellowbird-midflap.png';
  images.birds.yellow.down.src = '/assets/sprites/yellowbird-downflap.png';

  images.birds.blue.up.src = '/assets/sprites/bluebird-upflap.png';
  images.birds.blue.mid.src = '/assets/sprites/bluebird-midflap.png';
  images.birds.blue.down.src = '/assets/sprites/bluebird-downflap.png';

  images.birds.red.up.src = '/assets/sprites/redbird-upflap.png';
  images.birds.red.mid.src = '/assets/sprites/redbird-midflap.png';
  images.birds.red.down.src = '/assets/sprites/redbird-downflap.png';

  images.pipes.green.src = '/assets/sprites/pipe-green.png';
  images.pipes.red.src = '/assets/sprites/pipe-red.png';

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
