import React, { Component } from 'react'
import './Node.css'

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wall: this.props.isWall
        }
    }

    render() {
        const {start, end, visited, isWall, isPath, current, direction} = this.props
        let className = 'node';
        if(start && !current) {
            className = 'node start';
            if(visited) className = 'node start visited';
            if(isPath) className = 'node start path'; 
        } else if(end && !current) {
            className = `node end`;
            if(visited) className = 'node end visited';
            if(isPath) className = 'node end path'; 
        } else if(current) {
            className = `node current ${direction}`;
            if(visited) className = 'node current visited';
            if(isPath) className = `node current ${direction} leader`;
        } else {
            if(visited) className = `node visited`;
            if(isPath) className = `node path`;
            if(isWall) className = 'node wall';
        }
        return (
        <div className={className}>
        </div>
        )
    }
}
