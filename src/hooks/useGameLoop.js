import { useEffect, useRef } from 'react';

const useGameLoop = (callback, isActive) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      callback(time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, callback]);
};

export default useGameLoop;
