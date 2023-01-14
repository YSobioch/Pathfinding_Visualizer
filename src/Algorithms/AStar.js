export function aStar(grid, start, target) {
    const visitedNodesInOrder = [];
    start.distance = 0;
    start.distanceFromStart = 0;
    const unvisitedNodes = getAllNodes(grid);
    while(!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.distance === Infinity) {
            visitedNodesInOrder.push(null);
            return visitedNodesInOrder
        }
        if(closestNode.isWall === true) continue;
        closestNode.visited = true;
        visitedNodesInOrder.push(closestNode)
        if(closestNode === target) {
            return visitedNodesInOrder;
        } 
        updateNeighbors(closestNode, grid, start, target);
    }
}

function getDistance(nodeOne, nodeTwo) {
    let colDistance = Math.abs(nodeOne.col - nodeTwo.col);
    let rowDistance = Math.abs(nodeOne.row - nodeTwo.row);
    return colDistance + rowDistance;
}

export function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid, start, target) {
    const neighbors = getNeighbors(node, grid);
    for(const neighbor of neighbors) {
        if(neighbor.visited === true) continue;
        if(neighbor.isWall === true) continue;
        neighbor.distance = getDistance(neighbor, target);
        neighbor.distanceFromStart = getDistance(neighbor, start);
        neighbor.previousNode = closestNodeToStart(neighbor, node, grid);
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if(row > 0 && grid[col][row-1] !== undefined) neighbors.push(grid[col][row-1]);
    if(row < grid.length - 1 && grid[col][row + 1] !== undefined) neighbors.push(grid[col][row + 1]);
    if(col > 0 && grid[col - 1][row] !== undefined) neighbors.push(grid[col - 1][row]);
    if(col < grid.length - 1 && grid[col + 1][row] !== undefined) neighbors.push(grid[col + 1][row]);
    return neighbors;
}

function closestNodeToStart(node, previous, grid) {
    const neighbors = getNeighbors(node, grid);
    let previousNode = previous;
    for(const neighbor of neighbors) {
        if(!neighbor.visited) continue;
        if(neighbor.distanceFromStart < previousNode.distanceFromStart) previousNode = neighbor;
    }

    return previousNode;
}

function getAllNodes(grid) {
    const nodes = [];
    for(const row of grid) {
        for(const node of row) {
            node.isPath = false;
            nodes.push(node);
        }
    }
    return nodes
}
