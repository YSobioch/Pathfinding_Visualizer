import React, { Component } from 'react'
import Node from './Node';
import { dijkstra, getNeighbors } from '../Algorithms/Dijkstra';
import { aStar, getDistance } from '../Algorithms/AStar';
import { biDirectional } from '../Algorithms/BiDirectional';
import { randomizedPrim } from '../Algorithms/RandomizedPrim';

import './Visualizer.css'
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const startCol = 9;
const startRow = 9;
const endCol = 40;
const endRow = 9;
const COLUMNS = 50;
const ROWS = 20;
export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes : [[]],
            walls : [[]],
            addWalls : false,
            mouseIsPressed: false,
            nodesChecked : 0,
            numberOfNodes : COLUMNS * ROWS,
        }
    }

    //these methods handle the mouse being held down to allow 
    //the user to click and drag walls into place.
    //-------------------------------------------------------------------------------------------------------
    mouseDownHelper(node) {
        this.setState({ mouseIsPressed : true,})
        this.changeWall(node);
    }

    mouseEnterHelper(node) {
        if(this.state.mouseIsPressed) this.changeWall(node);
    }

    mouseUpHelper() {
        this.setState({ mouseIsPressed : false,});
    }

    changeWall(node) {
        if(this.state.addWalls) {
        const newNodes = [...this.state.nodes];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newNodes[node.col][node.row] = newNode;
        this.setState({nodes : newNodes, walls : newNodes})
        }
    }
    //--------------------------------------------------------------------------------------------------------
    
    //generates the nodes that will be used in the graph in data
    componentDidMount() {
        let table = this.createClearBoard();
        this.setState({nodes : table, walls : table})
    }

    //animates the algorithm by looping through the visited nodes in order
    animateAlgorithm(visitedNodes, binary = false){
        for(let node of visitedNodes){
            if(node === null) break;
            node.visited = false;
        }

        let count = 0;
        for(let i = 0; i < visitedNodes.length; i++) {
            setTimeout(() => {
                const node = visitedNodes[i];
                if(node === null) return;
                const newNodes = [...this.state.nodes];
                const newNode = {
                ...node,
                visited: true,
            };
            count++;
            newNodes[node.col][node.row] = newNode;
            this.setState({nodes: newNodes, nodesChecked : count});
            if(i === visitedNodes.length - 1) {
                binary ? this.animateBinaryPath(node) : this.animatePath(node);
            }
            }, 10 * i)
        }
    }

    //this section animates the path between the start and the finish
    animatePath(node) {
        let finalNode = node;
        let pathNodes = [];
        while(finalNode !== null) {
            finalNode.direction = 'right'
            finalNode.current = true;
            if(finalNode.previousNode !== null) {
                let previousNode = finalNode.previousNode;
                if(previousNode.row === finalNode.row + 1) finalNode.direction = 'up';
                if(previousNode.row === finalNode.row - 1) finalNode.direction = 'down';
                if(previousNode.col === finalNode.col + 1) finalNode.direction = 'left';
                if(previousNode.col === finalNode.col - 1) finalNode.direction = 'right';
            }
            pathNodes.unshift(finalNode);
            finalNode = finalNode.previousNode;
        }

        for(let j = pathNodes.length - 1; j >= 0; j--) {
            setTimeout(() => {
                node = pathNodes[j];
                const newNodes = [...this.state.nodes];
                const newNode = {
                ...node,
                isPath: true,
                };
            newNodes[node.col][node.row] = newNode;
            if(node.previousNode !== null) {
                const lastNode = newNode.previousNode;
                lastNode.current = false;
                lastNode.isPath = true;
                newNodes[lastNode.col][lastNode.row] = lastNode;
            }
            this.setState({nodes: newNodes});
            }, 35 * j)
            
        }
    }

    animateBinaryPath(node) {
        let finalNode = node;
        let previous = node.previousNode;
        let middleNode = node;
        let neigbors = getNeighbors(finalNode, this.state.nodes);
        let pathNodes = [];
        for(let neighbor of neigbors) {
            if(!neighbor.visited) continue;
            let distance = getDistance(neighbor.previousNode, previous);
            if(distance > 2) finalNode = neighbor;
        }
        while(middleNode !== null) {
            pathNodes.unshift(middleNode);
            middleNode = middleNode.previousNode;
        }
        while(finalNode !== null) {
            pathNodes.push(finalNode);
            finalNode = finalNode.previousNode
        }
        for(let j = pathNodes.length - 1; j >= 0; j--) {
            setTimeout(() => {
                node = pathNodes[j];
                const newNodes = [...this.state.nodes];
                const newNode = {
                ...node,
                isPath: true,
            };
            newNodes[node.col][node.row] = newNode;
            this.setState({nodes: newNodes});
            }, 35 * j)
        }
        
    }

    //uses the djikstra algorithm to generate visitedNodes, and then animates them
    visualizeDijkstra() {
        const nodes = this.resetBoardWithWalls();
        const startNode = nodes[startCol][startRow];
        const endNode = nodes[endCol][endRow];
        const visitedNodesInOrder = dijkstra(nodes, startNode, endNode);
        this.animateAlgorithm(visitedNodesInOrder);
    }

    visualizeAStar() {
        const nodes = this.resetBoardWithWalls();
        const startNode = nodes[startCol][startRow];
        const endNode = nodes[endCol][endRow];
        const visitedNodesInOrder = aStar(nodes, startNode, endNode);
        this.animateAlgorithm(visitedNodesInOrder);
    }

    visualizeBiDirection() {
        const nodes = this.resetBoardWithWalls();
        const startNode = nodes[startCol][startRow];
        const endNode = nodes[endCol][endRow];
        const visitedNodesInOrder = biDirectional(startNode, endNode, nodes);
        this.animateAlgorithm(visitedNodesInOrder, true);
    }

    //uses the randomized prim algorithm to generate a random maze
    createMaze() {
        this.createClearBoard(true);
        let wallGrid = randomizedPrim(startCol, startRow, endCol, endRow);
        for(let i = 0; i < wallGrid.length; i++) {
            for(let j = 0; j < wallGrid[0].length; j++) {
                setTimeout(() => {
                    if(wallGrid[i][j] === 1 || this.state.nodes[i][j].isEnd) {
                    } else {
                    const node = this.state.nodes[i][j];
                    const newNodes = [...this.state.nodes];
                    const newNode = {
                    ...node,
                    isWall: true,
                    };
                    newNodes[node.col][node.row] = newNode;
                    this.setState({nodes: newNodes});
                }}, 10 * i)
            }
        }
    }

    createClearBoard(visualizeReset = false){
        let table = [];
        for(let i = 0; i < 50; i++) {
            let col = []
            for(let j = 0; j < 20; j++) {
                let currentNode = {
                    col: i,
                    row: j,
                    isStart: i === startCol && j === startRow,
                    isEnd: i === endCol && j === endRow,
                    distance: Infinity,
                    distanceFromStart: Infinity,
                    current: i === startCol && j === startRow,
                    direction: 'right',
                    visited: false,
                    isWall: false,
                    isPath: false,
                    previousNode: null,
                }
                col.push(currentNode)
            }
            table.push(col);
        }

        if(visualizeReset) this.setState({nodes : table, walls : table});
        this.setState({nodesChecked : 0})
        return table;
    }

    resetBoardWithWalls() {
        let table = this.createClearBoard();
        let walls = this.state.walls;
        for(let i = 0; i < table.length; i++) {
            for(let j = 0; j < table[0].length; j++) {
                if(walls[i][j].isWall) table[i][j].isWall = true;
            }
        }
        this.setState({nodes : table})
        return table;
    }

    

    render() {
        const nodes = this.state.nodes;
        
        return (
        <>
        <h1 className='headings'>Pathfinding Visualizer</h1>
        <div className='controlPanel'>
            <Row className="justify-content-md-center">
                <Col xs lg="1" className='controlCol'><div className='button' onClick={() => this.visualizeDijkstra()}>Dijkstra</div></Col>
                <Col xs lg="1" className='controlCol'><div className='button' onClick={() => this.visualizeAStar()}>A*</div></Col>
                <Col xs lg="1" className='controlCol lastCol'><div className='button' onClick={() => this.visualizeBiDirection()}>Bi-Directional</div></Col>
                <Col xs lg='2'></Col>
                <Col xs lg="1" className='controlCol'><div className='button' onClick={() => this.createMaze()}>Generate Maze</div></Col>
                <Col xs lg="1" className='controlCol'><div className='button' onClick={() => this.createClearBoard(true)}>Clear Board</div></Col>
                <Col xs lg="1" className={this.state.addWalls ? 'controlColPressed lastCol' : 'controlCol lastCol'}>
                    <div className='button' onClick={() => this.setState({addWalls : !this.state.addWalls, mouseIsPressed : false})} >Add Walls</div>
                </Col>
            </Row>
        </div>
        <br></br>
        <div className='Holder'>
            {nodes.map((row, index) => {
                return (
                <div className='Col' key={index}>
                    {row.map((node, indexTwo) => {
                        return (
                            <div className='Row' key={indexTwo} 
                                onMouseDown={() => this.mouseDownHelper(node)}
                                onMouseEnter={() => this.mouseEnterHelper(node)}
                                onMouseUp={() => this.mouseUpHelper()}>
                                <Node 
                                    col={node.col}
                                    row={node.row}
                                    start={node.isStart} 
                                    current={node.current}
                                    end={node.isEnd}
                                    visited={node.visited}
                                    distance={node.distance}
                                    direction={node.direction}
                                    isWall={node.isWall}
                                    isPath={node.isPath}
                                />
                            </div>
                        )
                    })}
                </div>
            )})}
        </div>
        <h1 className='headings'>Nodes checked <span><h1>{this.state.nodesChecked} / {this.state.numberOfNodes}</h1></span></h1> 
        </>
    )
  }
}