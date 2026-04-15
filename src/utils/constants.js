export const GRAVITY = 0.4;
export const JUMP_STRENGTH = -8;
export const BIRD_SIZE = 34;
export const PIPE_WIDTH = 52;
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  DYING: 'DYING',
  GAME_OVER: 'GAME_OVER',
  SETTINGS: 'SETTINGS',
};

export const BIRD_SKINS = {
  YELLOW: 'yellow',
  BLUE: 'blue',
  RED: 'red',
};

export const PIPE_COLORS = {
  GREEN: 'green',
  RED: 'red',
};

export const THEMES = {
  DAY: 'day',
  NIGHT: 'night',
};

export const DIFFICULTY_LEVELS = {
  EASY: {
    PIPE_SPEED: 2.5,
    PIPE_GAP: 180,
    PIPE_SPACING: 220,
  },
  NORMAL: {
    PIPE_SPEED: 3,
    PIPE_GAP: 150,
    PIPE_SPACING: 200,
  },
  HARD: {
    PIPE_SPEED: 4,
    PIPE_GAP: 120,
    PIPE_SPACING: 180,
  },
};
