import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { basePointFromAngles } from "../math/hopf";
import type { AppState } from "../ui/state";
import { createBaseSphere } from "./baseSphere";
import { createFibers, disposeObject3D } from "./fibers";

export class HopfScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private fiberGroup: THREE.Group | null = null;
  private baseSphereGroup: THREE.Group | null = null;
  private axesHelper: THREE.AxesHelper | null = null;
  private animationFrame = 0;
  private phase = 0;
  private state: AppState;

  constructor(canvas: HTMLCanvasElement, initialState: AppState) {
    this.state = { ...initialState };
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x101317, 1);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;

    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    this.resetCamera();
    this.rebuild();
    this.resize();

    window.addEventListener("resize", () => this.resize());
  }

  start(): void {
    const animate = () => {
      this.animationFrame = requestAnimationFrame(animate);
      this.controls.update();

      if (this.state.animatePhase && this.fiberGroup) {
        this.phase += 0.01;
        this.fiberGroup.rotation.y = this.phase;
        this.fiberGroup.rotation.x = Math.sin(this.phase * 0.7) * 0.08;
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  dispose(): void {
    cancelAnimationFrame(this.animationFrame);
    this.controls.dispose();
    if (this.fiberGroup) {
      disposeObject3D(this.fiberGroup);
    }
    if (this.baseSphereGroup) {
      disposeObject3D(this.baseSphereGroup);
    }
    if (this.axesHelper) {
      this.axesHelper.dispose();
    }
    this.renderer.dispose();
  }

  updateState(nextState: AppState): void {
    const shouldRebuildGeometry =
      nextState.latitude !== this.state.latitude ||
      nextState.longitude !== this.state.longitude ||
      nextState.fiberCount !== this.state.fiberCount ||
      nextState.curveResolution !== this.state.curveResolution ||
      nextState.projectionScale !== this.state.projectionScale ||
      nextState.showBaseSphere !== this.state.showBaseSphere ||
      nextState.showAxes !== this.state.showAxes;

    this.state = { ...nextState };

    if (shouldRebuildGeometry) {
      this.rebuild();
    }
  }

  resetCamera(): void {
    this.camera.position.set(4.2, 3.1, 5.2);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private rebuild(): void {
    const selectedBasePoint = basePointFromAngles(this.state.latitude, this.state.longitude);

    if (this.fiberGroup) {
      this.scene.remove(this.fiberGroup);
      disposeObject3D(this.fiberGroup);
    }
    this.fiberGroup = createFibers({
      selectedBasePoint,
      fiberCount: this.state.fiberCount,
      curveResolution: this.state.curveResolution,
      projectionScale: this.state.projectionScale,
    });
    this.scene.add(this.fiberGroup);

    if (this.baseSphereGroup) {
      this.scene.remove(this.baseSphereGroup);
      disposeObject3D(this.baseSphereGroup);
      this.baseSphereGroup = null;
    }
    if (this.state.showBaseSphere) {
      this.baseSphereGroup = createBaseSphere(selectedBasePoint);
      this.scene.add(this.baseSphereGroup);
    }

    if (this.axesHelper) {
      this.scene.remove(this.axesHelper);
      this.axesHelper.dispose();
      this.axesHelper = null;
    }
    if (this.state.showAxes) {
      this.axesHelper = new THREE.AxesHelper(2.25);
      this.scene.add(this.axesHelper);
    }
  }

  private resize(): void {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
