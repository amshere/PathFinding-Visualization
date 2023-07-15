import { GenerateMaze } from "./Algorithms/RecursiveBackTack.js";
import { Node } from "./node.js";
import * as gridFunc from "./grid.js";

const selectedAlgorithms = localStorage.getItem("algorithms").split(",");

const gridMaze = JSON.parse(localStorage.getItem("grid"));

const convertJsonToNode = (json) => {
  const node = new Node(json.row, json.col, json.width, json.total_rows);
  node.start = json.start;
  node.end = json.end;
  node.wall = json.wall;
  return node;
};

//initialize the grid
const initializeGrid = () => {
  const gridNodes = gridMaze.map((d) => d.map(convertJsonToNode));
  for (let index in selectedAlgorithms) {
    const grid = document.querySelector("#grid" + selectedAlgorithms[index]);
    const ctx = grid.getContext("2d");
    const gridLayer = document.getElementById(
      "grid-layer" + selectedAlgorithms[index]
    );
    const width = 1000;
    const rows = 50;
    const selectAlgorithm = document.querySelector(".algorithm");
    const context = gridLayer.getContext("2d");
    gridLayer.width = width;
    gridLayer.height = width / 2;
    grid.width = width;
    grid.height = width / 2;
    const cellList = gridFunc.getCellList(rows, width);
    gridFunc.drawGrid(context, cellList);
    gridFunc.drawGridLines(context, rows, width);

    // find walls
    const walls = gridNodes.flatMap((d) => d).filter((d) => d.wall);
    //  find start
    const start = gridNodes.flatMap((d) => d).find((d) => d.start);
    const end = gridNodes.flatMap((d) => d).find((d) => d.end);
    console.log({ start });
    console.log({ walls });

    //  draw walls
    walls.forEach((node) => {
      gridFunc.drawWallNode(context, cellList, node.row, node.col);
    });

    // draw start and end
    start.setStart(context);
    end.setEnd(context);
  }
};

window.addEventListener("load", () => {
  initializeGrid();
});
