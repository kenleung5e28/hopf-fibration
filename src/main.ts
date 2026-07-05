import "./style.css";
import { HopfScene } from "./render/scene";
import { createControls } from "./ui/controls";
import { initialState, type AppState } from "./ui/state";

const canvas = document.querySelector<HTMLCanvasElement>("#scene");
const controls = document.querySelector<HTMLElement>("#controls");
const panelToggles = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-panel-toggle]"),
);

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

function setActiveMobilePanel(panelId: string | null): void {
  document.body.dataset.mobilePanel = panelId ?? "";

  panelToggles.forEach((button) => {
    const target = button.dataset.panelToggle;
    button.setAttribute("aria-expanded", String(target === panelId));
  });
}

panelToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.panelToggle ?? null;
    const isOpen = document.body.dataset.mobilePanel === target;
    setActiveMobilePanel(isOpen ? null : target);
  });
});

window.matchMedia("(min-width: 701px)").addEventListener("change", (event) => {
  if (event.matches) {
    setActiveMobilePanel(null);
  }
});

scene.start();
