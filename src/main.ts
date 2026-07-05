import "./style.css";
import { HopfScene } from "./render/scene";
import { createControls } from "./ui/controls";
import { initialState, type AppState } from "./ui/state";

const canvas = document.querySelector<HTMLCanvasElement>("#scene");
const controls = document.querySelector<HTMLElement>("#controls");

if (!canvas || !controls) {
  throw new Error("Missing required DOM elements.");
}

let state: AppState = { ...initialState };
const scene = new HopfScene(canvas, state);

createControls(
  controls,
  state,
  (nextState) => {
    state = { ...nextState };
    scene.updateState(state);
  },
  () => scene.resetCamera(),
);

scene.start();
