import * as THREE from "three";
import type { BasePoint } from "../math/hopf";
import { colorForBasePoint } from "./materials";

export function createBaseSphere(selectedBasePoint: BasePoint): THREE.Group {
  const group = new THREE.Group();
  group.name = "base-sphere";
  group.position.set(-3.3, -2.05, 0);
  group.scale.setScalar(0.72);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x9db3c9,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  group.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

  const markerGeometry = new THREE.SphereGeometry(0.07, 18, 12);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: colorForBasePoint(selectedBasePoint) });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(selectedBasePoint.x, selectedBasePoint.z, selectedBasePoint.y);
  group.add(marker);

  const axes = new THREE.AxesHelper(1.35);
  group.add(axes);

  return group;
}
