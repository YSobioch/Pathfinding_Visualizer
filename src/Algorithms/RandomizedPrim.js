class Walls {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.isWall = true;
        this.visited = false;
        this.isEnd = false;
    }
}

export function randomizedPrim(startCol, startRow, endCol, endRow) {
    const grid = generateGrid(endCol, endRow); 
    const uncheckedWalls = [grid[startCol][startRow]];

    while(uncheckedWalls.length) {
        const currentWall = getRandomWall(uncheckedWalls);
        const unvisitedNeighbors = getNeighbors(currentWall, grid, false); 
        const allNeighbors = getNeighbors(currentWall, grid, true);
        if(canBePath(allNeighbors)) {
            currentWall.isWall = false;
            for(const neighbor of unvisitedNeighbors) {
                uncheckedWalls.push(neighbor);
            }
        }
        currentWall.visited = true;
    }

    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[0].length; j++) {
            let node = grid[i][j];
            if(node.isWall) {
                node = 0;
            } else {
                node = 1;
            }
            grid[i][j] = node;
        }
    }

    return grid;
}

//This function takes in the current node and returns
//the neighbors adjacent to it on the grid in an array
//if visitedNodes is false, then it only returns the unvisitedNodes,
//if visitedNodes is true, then it returns all the in-bounds neighbors
function getNeighbors(currentWall, grid, visitedNodes) {
    const col = currentWall.col;
    const row = currentWall.row;
    const tempNeighbors = [];
    const neighbors = [];
    if(col + 1 < grid.length) tempNeighbors.push(grid[col + 1][row]);
    if(col - 1 >= 0) tempNeighbors.push(grid[col - 1][row]);
    if(row + 1 < grid[0].length) tempNeighbors.push(grid[col][row + 1]);
    if(row - 1 >= 0) tempNeighbors.push(grid[col][row - 1]);

    if(!visitedNodes) {
    for(const neighbor of tempNeighbors) {
        if(!neighbor.visited) {
            neighbors.push(neighbor);
        }
    }
    return neighbors;
    }
    return tempNeighbors;
}


//this function returns a boolean of whether the wall can be a path or not
function canBePath(neighbors) {
    let validNeighbors = 0;
    for(const neighbor of neighbors) {
        if(neighbor.isEnd) return true;
        if(!neighbor.isWall) {
            validNeighbors++;
            console.log(validNeighbors)
        }
    }
    return validNeighbors <= 1;
}

//gets a random wall from the unchecked walls array, cuts it out, and returns it.
function getRandomWall(uncheckedWalls) {
    const randomWallIndex = Math.floor(Math.random() * uncheckedWalls.length);
    const wall = uncheckedWalls[randomWallIndex];
    uncheckedWalls.splice(randomWallIndex, 1);
    return wall;
}

//creates the grid of walls while keeping track of the end node in the pathvisualizer
function generateGrid(endCol, endRow) {
    const grid = [];
    for(let i = 0; i < 50; i++) {
        const col = []
        for(let j = 0; j < 20; j++) {
            const wall = new Walls(i, j);
            if(i === endCol && j === endRow) wall.isEnd = true;
            col.push(wall);
        }
        grid.push(col);
    }
    return grid;
}