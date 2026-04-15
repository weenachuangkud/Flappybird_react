export const checkCollision = (rect1, rect2) => {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
};

export const checkBirdPipeCollision = (bird, pipe) => {
  const birdBounds = bird.getBounds();
  const pipeBounds = pipe.getBounds(); // Array of two rectangles

  return pipeBounds.some((bound) => checkCollision(birdBounds, bound));
};

export const checkWorldCollision = (bird, canvasHeight) => {
  const birdBounds = bird.getBounds();
  return birdBounds.bottom >= canvasHeight || birdBounds.top <= 0;
};
