import { absSquared, complex, conjugate, multiply, multiplyByPhase, type Complex } from "./complex";
import { stereographicProject, type Point3D, type Point4D } from "./stereographic";

export interface BasePoint {
  x: number;
  y: number;
  z: number;
}

export interface S3Point {
  z1: Complex;
  z2: Complex;
}

export function normalizeBasePoint(point: BasePoint): BasePoint {
  const length = Math.hypot(point.x, point.y, point.z);
  if (length === 0) {
    return { x: 0, y: 0, z: 1 };
  }
  return { x: point.x / length, y: point.y / length, z: point.z / length };
}

export function basePointFromAngles(latitude: number, longitude: number): BasePoint {
  const cosLat = Math.cos(latitude);
  return {
    x: cosLat * Math.cos(longitude),
    y: cosLat * Math.sin(longitude),
    z: Math.sin(latitude),
  };
}

export function hopfMap(z1: Complex, z2: Complex): BasePoint {
  const product = multiply(z1, conjugate(z2));
  return {
    x: 2 * product.re,
    y: 2 * product.im,
    z: absSquared(z1) - absSquared(z2),
  };
}

export function representativeForBasePoint(x: number, y: number, z: number): S3Point {
  const base = normalizeBasePoint({ x, y, z });

  // A convenient section away from the south pole is:
  // z1 = sqrt((1 + Z) / 2), z2 = (X - iY) / sqrt(2(1 + Z)).
  // With the Hopf convention h(z1,z2) = (2 Re(z1 conjugate(z2)),
  // 2 Im(z1 conjugate(z2)), |z1|^2 - |z2|^2), this maps back to (X,Y,Z).
  if (base.z > -1 + 1e-10) {
    const z1Re = Math.sqrt((1 + base.z) / 2);
    const denominator = Math.sqrt(2 * (1 + base.z));
    return {
      z1: complex(z1Re, 0),
      z2: complex(base.x / denominator, -base.y / denominator),
    };
  }

  // At the south pole the formula above is singular; this point is exact.
  return {
    z1: complex(0, 0),
    z2: complex(1, 0),
  };
}

export function generateFiber(basePoint: BasePoint, sampleCount: number): Point4D[] {
  const safeSampleCount = Math.max(2, Math.floor(sampleCount));
  const representative = representativeForBasePoint(basePoint.x, basePoint.y, basePoint.z);
  const points: Point4D[] = [];

  for (let i = 0; i < safeSampleCount; i += 1) {
    const t = (i / safeSampleCount) * Math.PI * 2;
    const z1 = multiplyByPhase(representative.z1, t);
    const z2 = multiplyByPhase(representative.z2, t);
    points.push({ x: z1.re, y: z1.im, z: z2.re, w: z2.im });
  }

  return points;
}

export function generateFiberCurve(
  basePoint: BasePoint,
  sampleCount: number,
  projectionScale: number,
): Point3D[] {
  return generateFiber(basePoint, sampleCount).map((point) =>
    stereographicProject(point, projectionScale),
  );
}
