export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

const POLE_EPSILON = 1e-5;

export function stereographicProject(point: Point4D, scale = 1): Point3D {
  // Projection convention: treat S^3 as points (a, b, c, d) in R^4 and
  // stereographically project from the north pole (0, 0, 0, +1) onto d = 0.
  // The projected R^3 coordinates are scale * (a, b, c) / (1 - d).
  // Near the pole the denominator approaches zero, so clamp it to avoid NaN
  // or Infinity while preserving the direction of the projection.
  const rawDenominator = 1 - point.w;
  const denominator =
    Math.abs(rawDenominator) < POLE_EPSILON
      ? Math.sign(rawDenominator || 1) * POLE_EPSILON
      : rawDenominator;

  return {
    x: (scale * point.x) / denominator,
    y: (scale * point.y) / denominator,
    z: (scale * point.z) / denominator,
  };
}
