import React, { Component } from 'react'
import Node from './Node';
import { dijkstra, sortNodesByDistance } from '../Algorithms/Dijkstra';
import { aStar } from '../Algorithms/AStar';
import { randomizedPrim } from '../Algorithms/RandomizedPrim';

import './Visualizer.css'
import Button from 'react-bootstrap/Button';


const startCol = 9;
const startRow = 9;
const endCol = 40;
const endRow = 9;
export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes : [[]],
            mouseIsPressed: false,
        }
    }

    //these methods handle the mouse being held down to allow 
    //the user to click and drag walls into place.
    //-------------------------------------------------------------------------------------------------------
    mouseDownHelper(node) {
        this.changeWall(node);
        this.setState({...this.state, mouseIsPressed : true,})
    }

    mouseEnterHelper(node) {
        if(this.state.mouseIsPressed) this.changeWall(node);
    }

    mouseUpHelper() {
        this.setState({...this.state, mouseIsPressed : false,});
    }

    changeWall(node) {
        const newNodes = [...this.state.nodes];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newNodes[node.col][node.row] = newNode;
        this.setState({nodes: newNodes})
    }
    //--------------------------------------------------------------------------------------------------------
    
    //generates the nodes that will be used in the graph in data
    componentDidMount() {
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
                    visited: false,
                    isWall: false,
                    isPath: false,
                    previousNode: null,
                }
                col.push(currentNode)
            }
            table.push(col);
        }
        this.setState({nodes : table})
    }

    //animates the algorithm by looping through the visited nodes in order
    animateAlgorithm(visitedNodes){
        for(let node of visitedNodes){
            if(node === null) break;
            node.visited = false;
        }

        for(let i = 0; i < visitedNodes.length; i++) {
            setTimeout(() => {
                const node = visitedNodes[i];
                if(node === null) return;
                const newNodes = [...this.state.nodes];
                const newNode = {
                ...node,
                visited: true,
            };
            newNodes[node.col][node.row] = newNode;
            this.setState({nodes: newNodes});
            if(i === visitedNodes.length - 1) {
                this.animatePath(node);
            }
            }, 10 * i)
        }
    }

    //this section animates the path between the start and the finish
    animatePath(node) {
        let finalNode = node;
        let pathNodes = [];
        while(finalNode !== null) {
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
            this.setState({nodes: newNodes});
            }, 20 * j)
        }
    }

    //uses the djikstra algorithm to generate visitedNodes, and then animates them
    visualizeDijkstra() {
        const nodes = this.state.nodes
        const startNode = nodes[startCol][startRow];
        const endNode = nodes[endCol][endRow];
        const visitedNodesInOrder = dijkstra(nodes, startNode, endNode);
        this.animateAlgorithm(visitedNodesInOrder);
    }

    visualizeAStar() {
        const nodes = this.state.nodes
        const startNode = nodes[startCol][startRow];
        const endNode = nodes[endCol][endRow];
        const visitedNodesInOrder = aStar(nodes, startNode, endNode);
        this.animateAlgorithm(visitedNodesInOrder);
    }

    //uses the randomized prim algorithm to generate a random maze
    createMaze() {
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

    

    render() {
        const nodes = this.state.nodes;
        
        return (
        <>
        <Button onClick={() => this.visualizeDijkstra()}>Dijkstra</Button>
        <Button onClick={() => this.visualizeAStar()}>A*</Button>
        <Button onClick={() => this.createMaze()}>Generate Maze</Button>
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
                                    end={node.isEnd}
                                    visited={node.visited}
                                    distance={node.distance}
                                    isWall={node.isWall}
                                    isPath={node.isPath}
                                />
                            </div>
                        )
                    })}
                </div>
            )})}
        </div>
        </>
    )
  }
}