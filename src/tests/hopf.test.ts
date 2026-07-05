import { describe, expect, it } from "vitest";
import { absSquared } from "../math/complex";
import {
  basePointFromAngles,
  generateFiber,
  generateFiberCurve,
  hopfMap,
  representativeForBasePoint,
  type BasePoint,
} from "../math/hopf";
import { stereographicProject } from "../math/stereographic";

const EPSILON = 1e-8;

function expectBasePointClose(actual: BasePoint, expected: BasePoint, epsilon = EPSILON): void {
  expect(actual.x).toBeCloseTo(expected.x, Math.abs(Math.log10(epsilon)));
  expect(actual.y).toBeCloseTo(expected.y, Math.abs(Math.log10(epsilon)));
  expect(actual.z).toBeCloseTo(expected.z, Math.abs(Math.log10(epsilon)));
}

describe("Hopf fibration math", () => {
  const basePoints: BasePoint[] = [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
    basePointFromAngles(0.42, 1.3),
    basePointFromAngles(-0.66, 4.1),
  ];

  it("representativeForBasePoint returns points on S^3", () => {
    for (const point of basePoints) {
      const representative = representativeForBasePoint(point.x, point.y, point.z);
      const norm = absSquared(representative.z1) + absSquared(representative.z2);
      expect(norm).toBeCloseTo(1, 10);
    }
  });

  it("hopfMap sends representatives back to their base points", () => {
    for (const point of basePoints) {
      const representative = representativeForBasePoint(point.x, point.y, point.z);
      const actual = hopfMap(representative.z1, representative.z2);
      expectBasePointClose(actual, point, 1e-8);
    }
  });

  it("points along the same generated fiber have the same Hopf image", () => {
    const basePoint = basePointFromAngles(0.31, 2.2);
    const fiber = generateFiber(basePoint, 80);

    for (const point of fiber) {
      const actual = hopfMap({ re: point.x, im: point.y }, { re: point.z, im: point.w });
      expectBasePointClose(actual, basePoint, 1e-8);
    }
  });

  it("stereographic projection returns finite values away from the projection pole", () => {
    const projected = stereographicProject({ x: 0.3, y: -0.4, z: 0.5, w: 0.2 }, 1.7);

    expect(Number.isFinite(projected.x)).toBe(true);
    expect(Number.isFinite(projected.y)).toBe(true);
    expect(Number.isFinite(projected.z)).toBe(true);
  });

  it("generated fiber curve has the requested number of samples", () => {
    const curve = generateFiberCurve(basePointFromAngles(-0.2, 0.8), 123, 1.4);
    expect(curve).toHaveLength(123);
  });
});
