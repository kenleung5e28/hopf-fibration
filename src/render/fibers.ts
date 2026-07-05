import * as THREE from "three";
import { basePointFromAngles, generateFiberCurve, type BasePoint } from "../math/hopf";
import { makeFiberMaterial } from "./materials";

export interface FiberRenderOptions {
  selectedBasePoint: BasePoint;
  fiberCount: number;
  curveResolution: number;
  projectionScale: number;
}

export function createFibers(options: FiberRenderOptions): THREE.Group {
  const group = new THREE.Group();
  group.name = "hopf-fibers";

  for (let i = 0; i < options.fiberCount; i += 1) {
    const z = 1 - (2 * (i + 0.5)) / options.fiberCount;
    const latitude = Math.asin(z);
    const longitude = i * Math.PI * (3 - Math.sqrt(5));
    const basePoint = basePointFromAngles(latitude, longitude);
    const line = createFiberLine(basePoint, options.curveResolution, options.projectionScale, false);
    group.add(line);
  }

  const highlighted = createFiberLine(
    options.selectedBasePoint,
    options.curveResolution,
    options.projectionScale,
    true,
  );
  highlighted.name = "selected-fiber";
  group.add(highlighted);

  return group;
}

function createFiberLine(
  basePoint: BasePoint,
  sampleCount: number,
  projectionScale: number,
  highlighted: boolean,
): THREE.LineLoop {
  const curve = generateFiberCurve(basePoint, sampleCount, projectionScale);
  const vertices = new Float32Array(curve.length * 3);

  for (let i = 0; i < curve.length; i += 1) {
    const point = curve[i];
    vertices[i * 3] = point.x;
    vertices[i * 3 + 1] = point.y;
    vertices[i * 3 + 2] = point.z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeBoundingSphere();

  return new THREE.LineLoop(geometry, makeFiberMaterial(basePoint, highlighted));
}

export function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh | THREE.Line;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}
