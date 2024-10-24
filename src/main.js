import {
  coloringWelshPowell,
  distanceAlgorithm,
  reset,
  transitiveClosure,
} from "./classes/Algorithms.js";
import { Button } from "./components/Button.js";
import { ButtonsArea } from "./components/ButtonsArea.js";
import { GraphArea } from "./components/GraphArea.js";
import { GraphInfosArea } from "./components/GraphInfosArea.js";

const BODY = document.body;

(() => {
  const container = document.createElement("div");
  container.setAttribute("id", "main-area");
  container.appendChild(GraphArea("graph-area"));
  container.appendChild(GraphArea("graph-area-two"));

  const btnsArea = ButtonsArea();
  btnsArea.appendChild(Button("Calcul distance", "#abf43c", distanceAlgorithm));
  btnsArea.appendChild(
    Button("Fermeture Transitive", "#10fdc0", transitiveClosure)
  );
  btnsArea.appendChild(
    Button("Coloration Welsh et Powell", "#fe32df", coloringWelshPowell)
  );
  btnsArea.appendChild(Button("reset", "#ff2020", reset));

  BODY.appendChild(GraphInfosArea());
  BODY.appendChild(container);
  BODY.appendChild(btnsArea);
})();
