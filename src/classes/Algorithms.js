import { popup } from "../components/popup.js";
import { randomColor } from "../utils/Colors.js";
import {
  colorizeNode,
  getSelectedNode,
  hideGraphAreaTwo,
  highlightEdge,
  highlightNode,
  resetColors,
  resetGraph,
  resetGraphAreaTwo,
  selectNode,
  showGraphAreaTwo,
  unselectNodes,
  updateDistance,
} from "../utils/Dom.js";
import { graph } from "./Settings.js";

const distanceAlgorithm = async () => {
  const startNode = getSelectedNode();
  if (!startNode) {
    document.body.appendChild(
      popup("Veuillez selectionner un sommet de départ !", "#dc143c")
    );
  } else {
    document.querySelector("#graph-area").classList.add("animation");
    const startNodeId = +startNode.getAttribute("data-id");

    const queue = [];
    const distances = {};
    const visited = new Set();

    for (const node of graph.nodes) {
      distances[node.id] = Infinity;
      updateDistance(node.id, distances[node.id]);
    }

    distances[startNodeId] = 0;
    updateDistance(startNodeId, distances[startNodeId]);
    queue.push(startNodeId);
    visited.add(startNodeId);
    highlightNode(startNodeId);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    while (queue.length > 0) {
      const current = queue.shift();
      selectNode(current);
      await new Promise((resolve) => setTimeout(resolve, 800));

      for (const neighbor of graph.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);

          highlightEdge(current, neighbor);
          await new Promise((resolve) => setTimeout(resolve, 800));

          highlightNode(neighbor);
          distances[neighbor] = distances[current] + 1;
          updateDistance(neighbor, distances[neighbor]);
          await new Promise((resolve) => setTimeout(resolve, 1600));
          queue.push(neighbor);
        }
      }
      unselectNodes();
    }
  }
};

// return all the reached nodes from a DFS traversal
const DFS = (graph, start) => {
  const visited = new Set();
  const reached = new Set();

  const dfsHelper = (node) => {
    if (visited.has(node)) return;
    visited.add(node);
    reached.add(node);

    for (const neighbor of graph.getNeighbors(node)) {
      dfsHelper(neighbor); // No need to check visited again
    }
  };

  dfsHelper(start); // Start the recursive DFS from the initial node
  return [...reached]; // Convert the Set to an array only when returning
};

const isConnected = (graph) => {
  const n = graph.order();
  if (n) {
    const startingNode = graph.getRandomNode();
    const reachedNodes = DFS(graph, startingNode);
    if (reachedNodes.length === n) return true;
  }
  return false;
};

const isTree = (graph) => {
  return isConnected(graph) && graph.size() == graph.order() - 1;
};

const transitiveClosure = () => {
  resetGraphAreaTwo();
  showGraphAreaTwo();
  const clonned = graph.clone("graph-area-two");
  for (const node of clonned.nodes) {
    const reachedNodes = DFS(clonned, node.id);
    for (const reachedNode of reachedNodes) {
      if (node.id !== reachedNode) clonned.addEdge(node.id, reachedNode, true);
    }
  }
};

const coloringWelshPowell = () => {
  resetColors();
  for (const node of graph.nodes) node.color = undefined;
  const nodes = graph.nodes.sort((u, v) =>
    graph.nodeDegree(u.id) > graph.nodeDegree(v.id) ? -1 : 1
  );
  let k;
  while (true) {
    for (let i = 0; i < nodes.length; i++) {
      k = randomColor();
      const u = nodes[i];
      if (!u.color) {
        u.color = k;
        colorizeNode(u.id, u.color);
        for (let j = 0; j < nodes.length; j++) {
          const v = nodes[j];
          if (
            !v.color &&
            !graph
              .getNeighborsNodes(v.id)
              .some((neighbor) => neighbor.color === k)
          ) {
            v.color = k;
            colorizeNode(v.id, v.color);
          }
        }
      }
    }
    if (nodes.every((node) => node.color)) break;
  }
};

const reset = () => {
  resetGraph();
  resetColors();
  hideGraphAreaTwo();
};

export {
  distanceAlgorithm,
  isConnected,
  isTree,
  transitiveClosure,
  coloringWelshPowell,
  reset,
};
