/**
 * Returns an object with a next() method that produces deterministic
 * pseudo-random numbers from the given seed (Lehmer / Park-Miller).
 */
export function seededRandom(seed) {
  let s = seed;
  return {
    next() {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    },
  };
}

/** Ease in-out quad */
export function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** Ease-out cubic */
export function easeOut(q) {
  return 1 - Math.pow(1 - q, 3);
}

/** easeOutBack-like impact bounce */
export function impacto(q) {
  const c1 = 1.25, c3 = c1 + 1;
  const x = q - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}
