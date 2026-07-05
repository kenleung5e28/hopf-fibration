import type { AppState } from "./state";

type StateKey = keyof AppState;

interface SliderConfig {
  key: StateKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

interface CheckboxConfig {
  key: StateKey;
  label: string;
}

const sliderConfigs: SliderConfig[] = [
  {
    key: "latitude",
    label: "Latitude",
    min: -90,
    max: 90,
    step: 1,
    format: (value) => `${Math.round((value * 180) / Math.PI)} deg`,
  },
  {
    key: "longitude",
    label: "Longitude",
    min: 0,
    max: 360,
    step: 1,
    format: (value) => `${Math.round((value * 180) / Math.PI)} deg`,
  },
  {
    key: "fiberCount",
    label: "Number of fibers",
    min: 4,
    max: 64,
    step: 1,
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: "curveResolution",
    label: "Curve resolution",
    min: 48,
    max: 360,
    step: 4,
    format: (value) => `${Math.round(value)} samples`,
  },
  {
    key: "projectionScale",
    label: "Projection scale",
    min: 0.55,
    max: 3,
    step: 0.05,
    format: (value) => value.toFixed(2),
  },
];

const checkboxConfigs: CheckboxConfig[] = [
  { key: "showBaseSphere", label: "Show base sphere" },
  { key: "showAxes", label: "Show axes" },
  { key: "animatePhase", label: "Animate phase" },
];

export function createControls(
  container: HTMLElement,
  state: AppState,
  onChange: (nextState: AppState) => void,
  onResetCamera: () => void,
): void {
  container.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Controls";
  container.append(title);

  const emit = () => onChange({ ...state });

  for (const config of sliderConfigs) {
    const group = document.createElement("div");
    group.className = "control-group";

    const row = document.createElement("div");
    row.className = "control-row";

    const label = document.createElement("label");
    label.textContent = config.label;

    const value = document.createElement("span");
    value.className = "control-value";

    const input = document.createElement("input");
    input.type = "range";
    input.min = String(config.min);
    input.max = String(config.max);
    input.step = String(config.step);

    const readValue = () => {
      const raw = Number(input.value);
      return config.key === "latitude" || config.key === "longitude"
        ? (raw * Math.PI) / 180
        : raw;
    };

    const writeValue = () => {
      const current = state[config.key] as number;
      input.value = String(
        config.key === "latitude" || config.key === "longitude"
          ? Math.round((current * 180) / Math.PI)
          : current,
      );
      value.textContent = config.format(current);
    };

    input.addEventListener("input", () => {
      (state[config.key] as number) = readValue();
      value.textContent = config.format(state[config.key] as number);
      emit();
    });

    writeValue();
    row.append(label, value);
    group.append(row, input);
    container.append(group);
  }

  for (const config of checkboxConfigs) {
    const label = document.createElement("label");
    label.className = "checkbox-row";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state[config.key] as boolean;
    input.addEventListener("change", () => {
      (state[config.key] as boolean) = input.checked;
      emit();
    });

    const text = document.createElement("span");
    text.textContent = config.label;
    label.append(input, text);
    container.append(label);
  }

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Reset camera";
  resetButton.addEventListener("click", onResetCamera);
  container.append(resetButton);
}
