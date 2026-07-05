import * as THREE from "three";
import type { BasePoint } from "../math/hopf";

export function colorForBasePoint(point: BasePoint): THREE.Color {
  const hue = (Math.atan2(point.y, point.x) / (Math.PI * 2) + 1) % 1;
  const lightness = 0.48 + 0.18 * (point.z + 1) * 0.5;
  const color = new THREE.Color();
  color.setHSL(hue, 0.78, lightness);
  return color;
}

export function makeFiberMaterial(point: BasePoint, highlighted = false): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: colorForBasePoint(point),
    linewidth: highlighted ? 4 : 2,
    transparent: true,
    opacity: highlighted ? 1 : 0.72,
  });
}
