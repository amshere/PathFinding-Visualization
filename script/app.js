import { GenerateMaze } from "./Algorithms/RecursiveBackTack.js";
import { Node } from "./node.js";
import * as gridFunc from "./grid.js";

const isPathFindingPage = window.location.pathname.includes("pathFinding")

const selectedAlgorithms = [];

window.addEventListener("load", () => {

    const grid = document.querySelector("#grid");
    const ctx = grid.getContext("2d");
    const width = 1000;
    const rows = 50;
    const gridLayer = document.querySelector("#grid-layer");
    const visualizeBtn = document.querySelector(".visualizeBtn");
    const enableVisualizeBtn = () => {
      visualizeBtn.disabled = false;
      
    };
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
    gridFunc.drawGrid(ctx, cellList, rows, width);
    gridFunc.drawGridLines(context, rows, width);
    let drawWall = false;
    let removeWall = false;
    let drawStart = false;
    let drawEnd = false;
    let startNode = null;
    let endNode = null;
    visualizeBtn.disabled = true;
    let [sNode, eNode] = gridFunc.pickRandStartAndEnd(ctx, cellList);
    startNode = sNode;
    endNode = eNode;
    drawStart = true;
    drawEnd = true;

    const enableBtnAndGrid = () => {
      selectAlgorithm.disabled = false;
      visualizeBtn.disabled = false;
      grid.style.pointerEvents = "all";
    };
    grid.addEventListener("click", (e) => {
      let [row, col] = gridFunc.getCellPos(e.offsetX, e.offsetY, width, rows);
      let selectedNode = cellList[row][col];
      if (e.button == 0) {
        if (
          selectedNode.getisNotVisited() &&
          !selectedNode.getisWall() &&
          !drawStart
        ) {
          selectedNode.setStart(ctx);
          startNode = selectedNode;
          drawStart = true;
        } else if (
          selectedNode.getisNotVisited() &&
          !selectedNode.getisWall() &&
          !drawEnd
        ) {
          selectedNode.setEnd(ctx);
          endNode = selectedNode;
          drawEnd = true;
        } else if (selectedNode.getisStart()) {
          drawStart = false;
          startNode = null;
          selectedNode.setNotVisited(ctx);
        } else if (selectedNode.getisEnd()) {
          drawEnd = false;
          endNode = null;
          selectedNode.setNotVisited(ctx);
        }
      }
    });
    grid.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
          drawWall = true;
        }
        if (e.button == 1) {
          removeWall = true;
        }
      });
      grid.addEventListener("mousemove", (e) => {
        let [row, col] = gridFunc.getCellPos(e.offsetX, e.offsetY, width, rows);
        try {
          if (drawWall) {
            gridFunc.drawWallNode(ctx, cellList, row, col);
          }
          if (removeWall) {
            gridFunc.drawNotVisitedNode(ctx, cellList, row, col);
          }
        } catch {
          drawWall = false;
          removeWall = false;
        }
      });
      grid.addEventListener("mouseout", () => {
        drawWall = false;
        removeWall = false;
      });
      grid.addEventListener("mouseup", () => {
        drawWall = false;
        removeWall = false;
      });

      //select algorithms
      const algorithmCheckboxes = document.querySelectorAll(".algorithm-checkbox");
      
      
      algorithmCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          console.log({selectedAlgorithms})
          if (checkbox.checked) {
            enableVisualizeBtn();
            selectedAlgorithms.push(checkbox.value);
          } else {
            const index = selectedAlgorithms.indexOf(checkbox.value);
            
            if (index > -1) {
              selectedAlgorithms.splice(index, 1);
            }
            if( selectedAlgorithms.length == 0)
            {
              visualizeBtn.disabled=true;
            }
          }
        });
      });
      
      visualizeBtn.addEventListener("click", (e) => {
        if (startNode !== null && endNode !== null) {
          if (selectedAlgorithms.length > 0) {
            //disableButtonAndGrid();
            // console.log("i'm here");
            enableVisualizeBtn();
           
          } else {
            messageBox.textContent = "At least one algorithm must be selected for visualization";
            messageBox.style.color = "red";
          }
        } else {
          messageBox.textContent = "Start Node and End Node need to be selected";
          messageBox.style.color = "red";
        }
      });
      visualizeBtn.addEventListener("click", (e) => {
        if (startNode !== null && endNode !== null) {
          localStorage.setItem("grid",  JSON.stringify(cellList)) //normal start and end point
          localStorage.setItem("algorithms", selectedAlgorithms)
          window.location.pathname = "/pathFinding.html"
          
          disableButtonAndGrid();
        } else {
          messageBox.textContent = "Start Node and End Node needs to be selected";
          messageBox.style.color = "red";
        }

        //here algorithms
        
      });

      const disableButtonAndGrid = () => {
        visualizeBtn.disabled = true;
        clearPathBtn.disabled = true;
        resetGridBtn.disabled = true;
        generateMazeBtn.disabled = true;
        selectAlgorithm.disabled = true;
        grid.style.pointerEvents = "none";
      };
     
      
      const enableAll = () => {
        visualizeBtn.disabled = false;
        clearPathBtn.disabled = false;
        resetGridBtn.disabled = false;
        generateMazeBtn.disabled = false;
        selectAlgorithm.disabled = false;
        grid.style.pointerEvents = "all";
      };
     
      resetGridBtn.addEventListener("click", () => {
        enableBtnAndGrid();
        cellList.forEach((row) => {
          row.forEach((cell) => {
            cell.setNotVisited(ctx);
            cell.resetNode();
          });
        });
        let [sNode, eNode] = gridFunc.pickRandStartAndEnd(ctx, cellList);
        startNode = sNode;
        endNode = eNode;
        drawStart = true;
        drawEnd = true;
      });
      let list = [];
      generateMazeBtn.addEventListener("click", () => {
        if (startNode != null && endNode != null) {
          startNode.setNotVisited(ctx);
          startNode.resetNode();
          startNode = null;
          drawStart = false;
          endNode.setNotVisited(ctx);
          endNode.resetNode();
          endNode = null;
          drawEnd = false;
        }
        disableButtonAndGrid();
        cellList.forEach((row) => {
          row.forEach((cell) => {
            cell.setNotVisited(ctx);
            cell.resetNode();
          });
        });

        GenerateMaze(ctx, cellList, list).then((val) => {
          if(selectedAlgorithms.includes("BFS"))
          {
            localStorage.setItem("grid-bfs",  JSON.stringify(cellList))

          }
          if(selectedAlgorithms.includes("DFS"))
          {
            localStorage.setItem("grid-dfs",  JSON.stringify(cellList))

          }
          if(selectedAlgorithms.includes("Astar"))
          {
            localStorage.setItem("grid-Astar",  JSON.stringify(cellList))
          }
          if(selectedAlgorithms.includes("Dijkstra"))
          {
            localStorage.setItem("grid-dijkstra",  JSON.stringify(cellList))
          }
          console.log({cellList, list})
          if (val) {
            visualizeBtn.disabled = false;
            selectAlgorithm.disabled = false;
            generateMazeBtn.disabled = false;
            grid.style.pointerEvents = "all";
            let [sNode, eNode] = gridFunc.pickRandStartAndEnd(ctx, cellList);
            startNode = sNode;
            endNode = eNode;
            drawStart = true;
            drawEnd = true;
          }
        });
      });
      clearPathBtn.addEventListener("click", () => {
        if (cellList.length == 0) {
          return;
        }
        enableBtnAndGrid();
        cellList.forEach((row) => {
          row.forEach((cell) => {
            if (cell.getisDiscovered() || cell.getisVisited()) {
              cell.setNotVisited(ctx);
              cell.resetNode();
            }
            if (cell.getisStart()) {
              cell.resetNode();
            }
            if (cell.getisEnd()) {
              cell.resetNode();
            }
          });
        });
      });
});


if (isPathFindingPage){
  window.addEventListener("load", ()=> {

    const gridMaze = localStorage.getItem("grid")

    if (gridMaze == null) {
      // TODO: provide a default maze (can have a start and end point only) 
      return 
    }
    if(selectedAlgorithms.includes("BFS"))
    {
      document.getElementById("BfsGridDiv").classList.remove("d-none")
      const gridBFS = document.querySelector("#gridBFS");
      const gridLayerBFS = document.querySelector("#grid-layerBFS");
    }
    if(selectedAlgorithms.includes("DFS"))
    {
      const gridDFS = document.querySelector("#gridDFS");
      const gridLayerDFS = document.querySelector("#grid-layerDFS");
    }
    if(selectedAlgorithms.includes("Astar"))
    {
      const gridAstar = document.querySelector("#gridAstar");
      const gridLayerAstar = document.querySelector("#grid-layerAstar");
    }
    if(selectedAlgorithms.includes("Dijkstra"))
    {
      const gridBFS = document.querySelector("#griDijkstra");
      const gridLayerBFS = document.querySelector("#grid-layerDijkstra");
    }

    const MAZE = JSON.parse(gridMaze)
    
    // const gridDFS = document.querySelector("#gridDFS");
    // const gridAstar = document.querySelector("#gridAstar");
    // const gridDijkstra = document.querySelector("#gridDijkstra");
    
    // const gridLayerDFS = document.querySelector("#grid-layerDFS");
    // const gridLayerAstar = document.querySelector("#grid-layerAstar");
    // const gridLayerDijkstra = document.querySelector("#grid-layerDijkstra");
    
    //  TODO 
    //  1. get div reference, canvas reference ==>   function(ctx,ref) =>  draw
    // var canvasbfs = document.getElementById('grid-layerBFS');
    // var divbfs = document.getElementById('algoBFS');
    //  2. data =>  render into the grids ==>   needs a function(maze, ctx) =>  output 
    //  3. add the algorithms  

  })
}