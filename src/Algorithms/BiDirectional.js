class Node {
    constructor(col, row) {
        this.visitedByStartNodes = false;
        this.visitedByEndNodes = false;
        this.pathConnectingNode = null;
        this.previousNode = null;
        this.isWall = false;
        this.col = col;
        this.row = row;
    }
}

export function biDirectional(start, end, grid) {
    const startNode = [new Node(start.col, start.row)];
    const endNode = [new Node(end.col, end.row)];
    startNode[0].visitedByStartNodes = true;
    endNode[0].visitedByEndNodes = true;
    let table = getAllNodes(startNode, endNode, grid);
    const visitedNodesInOrder = [];
    while(startNode.length || endNode.length) {
        const nodeA = startNode.shift();
        const nodeB = endNode.shift();
        
        if(nodeA !== undefined) {
            nodeA.visitedByStartNodes = true;
            grid[nodeA.col][nodeA.row].visited = true;
            grid[nodeA.col][nodeA.row].distance = -1;
            visitedNodesInOrder.push(grid[nodeA.col][nodeA.row]);
            if(nodeA.visitedByEndNodes) {
                visitedNodesInOrder[0].previousNode = null;
                visitedNodesInOrder[1].previousNode = null;
                return visitedNodesInOrder;
            }
            const neighborsA = updateNeighbors(nodeA, table);
            for(let neighbor of neighborsA) {
                if(grid[neighbor.col][neighbor.row].visited) continue;
                if(grid[neighbor.col][neighbor.row].previousNode === null) {
                    grid[neighbor.col][neighbor.row].previousNode = grid[nodeA.col][nodeA.row];
                }
            }
            startNode.push(...neighborsA);
        }
        
        if(nodeB !== undefined) {
            nodeB.visitedByEndNodes = true;
            grid[nodeB.col][nodeB.row].visited = true;
            grid[nodeA.col][nodeA.row].distance = Infinity;
            visitedNodesInOrder.push(grid[nodeB.col][nodeB.row]);
            if(nodeB.visitedByStartNodes) {
                visitedNodesInOrder[0].previousNode = null;
                visitedNodesInOrder[1].previousNode = null;
                return visitedNodesInOrder;
            }
            const neighborsB = updateNeighbors(nodeB, table);
            for(let neighbor of neighborsB) {
                if(grid[neighbor.col][neighbor.row].visited) continue;
                if(grid[neighbor.col][neighbor.row].previousNode === null) {
                    grid[neighbor.col][neighbor.row].previousNode = grid[nodeB.col][nodeB.row];
                }
            }
            endNode.push(...neighborsB);    
        }
    }
    return visitedNodesInOrder
}

function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    const validNeighbors = []
    for(const neighbor of neighbors) {
        if(neighbor.visitedByStartNodes && node.visitedByStartNodes) continue;
        if(neighbor.visitedByEndNodes && node.visitedByEndNodes) continue;
        if((neighbor.visitedByEndNodes && node.visitedByStartNodes) || 
            (neighbor.visitedByStartNodes && node.visitedByEndNodes)) {
                neighbor.pathConnectingNode = node;
                validNeighbors.push(neighbor);
                continue;
            }
        if(neighbor.isWall) continue;
        if(neighbor.previousNode === null) neighbor.previousNode = node;
        neighbor.visitedByStartNodes = node.visitedByStartNodes;
        neighbor.visitedByEndNodes = node.visitedByEndNodes
        validNeighbors.push(neighbor);
    }
    return validNeighbors
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

function getAllNodes(start, end, grid) {
    const table = [];
    for(let i = 0; i < grid.length; i++) {
        const col = [];
        for(let j = 0; j < grid[0].length; j++) {
            if(i === start.col && j === start.row) {
                col.push(start);
            } else if(i === end.col && j === end.row) {
                col.push(end);
            } else if(grid[i][j].isWall) {
                let newNode = new Node(i, j);
                newNode.isWall = true;
                col.push(newNode);
            } else {
                col.push(new Node(i, j))
            }
        }
        table.push(col);
    }
    return table;
}

















/*export function biDirectional(grid, start, target) {
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

*/