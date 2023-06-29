import { GenerateMaze } from "./Algorithms/RecursiveBackTack.js";
import { Node } from "./node.js";
import * as gridFunc from "./grid.js";

const isPathFindingPage = window.location.pathname.includes("pathFinding")

const selectedAlgorithms = localStorage.getItem("algorithms").split(",");

const gridMaze = JSON.parse(localStorage.getItem("grid"));


//initialize the grid
const initializeGrid =()=>{
    //console.log(gridMaze);
    for(let index in selectedAlgorithms){
        const grid = document.querySelector("#grid"+selectedAlgorithms[index]);
        const ctx = grid.getContext("2d")
        const gridLayer = document.getElementById("grid-layer"+selectedAlgorithms[index])
        const width = 1000;
        const rows = 50;
        const selectAlgorithm = document.querySelector(".algorithm");
        const clearPathBtn = document.querySelector(".clearPath");
        const resetGridBtn = document.querySelector(".resetGrid");
        const generateMazeBtn = document.querySelector(".generateMaze");
        const messageBox = document.querySelector(".message");
        const context = gridLayer.getContext("2d");
        gridLayer.width = width;
        gridLayer.height = width / 2;
        grid.width = width;
        grid.height = width / 2;
        const cellList = gridFunc.getCellList(rows, width);
        gridFunc.drawGrid(ctx, grid, rows, width);
        gridFunc.drawGridLines(ctx, rows, width);
        let drawWall = false;
        let removeWall = false;
        let drawStart = false;
        let drawEnd = false;
        let startNode = null;
        let endNode = null;
        // visualizeBtn.disabled = true;
        let [sNode, eNode] = gridFunc.pickRandStartAndEnd(ctx, cellList);
        startNode = sNode;
        endNode = eNode;
        drawStart = true;
        drawEnd = true;
        const enableBtnAndGrid = () => {
            selectAlgorithm.disabled = true;
            visualizeBtn.disabled = true;
            grid.style.pointerEvents = "all";
          };
    }
}

window.addEventListener("load", ()=>{
    initializeGrid()
})

