export function biDirectional(grid, start, target) {
    const visitedNodesInOrder = [];
    start.distance = 0;
    start.distanceFromStart = 1;
    target.distance = 0;
    target.distanceFromStart = 0;
    const unvisitedNodes = [start, target];
    while(!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall === true) continue;
        visitedNodesInOrder.push(closestNode)
        if(closestNode.visited) {
            alignPath(visitedNodesInOrder);
            return visitedNodesInOrder;
        } 
        closestNode.visited = true;
        updateNeighbors(closestNode, grid, unvisitedNodes, visitedNodesInOrder);
    }
}

export function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid, unvisitedNodes, visitedNodesInOrder) {
    const neighbors = getNeighbors(node, grid);
    for(const neighbor of neighbors) {
        if(neighbor.distanceFromStart === node.distanceFromStart) continue;
        if(neighbor.isWall) continue;
        if(neighbor.previousNode === null) {
            console.log('made it here')
            neighbor.distance = node.distance + 1
            neighbor.distanceFromStart = node.distanceFromStart;
            neighbor.previousNode = node;
            unvisitedNodes.push(neighbor)
        } else {
            neighbor.visited = true;
            unvisitedNodes = [neighbor];
        }
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

function alignPath(nodes) {
    let nodeOne = nodes.pop();
    let nodeTwo = nodes.pop();
    let tempNode = nodeOne.previousNode;
    while(tempNode !== null) {
        nodeOne.previousNode = nodeTwo;
        nodeTwo = nodeOne;
        nodeOne = tempNode;
        tempNode = tempNode.previousNode;
    }

}