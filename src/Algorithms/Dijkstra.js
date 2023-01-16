export function dijkstra(grid, start, target) {
    const visitedNodesInOrder = [];
    start.distance = 0;
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
        updateNeighbors(closestNode, grid);
    }
}

export function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    for(const neighbor of neighbors) {
        if(neighbor.visited === true) continue;
        if(neighbor.isWall === true) continue;
        neighbor.distance = node.distance + 1
        neighbor.previousNode = node
    }
}

export function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if(row > 0 && grid[col][row-1] !== undefined) neighbors.push(grid[col][row-1]);
    if(row < grid.length - 1 && grid[col][row + 1] !== undefined) neighbors.push(grid[col][row + 1]);
    if(col > 0 && grid[col - 1][row] !== undefined) neighbors.push(grid[col - 1][row]);
    if(col < grid.length - 1 && grid[col + 1][row] !== undefined) neighbors.push(grid[col + 1][row]);
    return neighbors;
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