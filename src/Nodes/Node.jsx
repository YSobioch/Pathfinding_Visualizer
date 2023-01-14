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
        const {start, end, visited, isWall, isPath} = this.props
        let className = 'node';
        if(start) className = 'node start';
        if(end) className = 'node end';
        if(visited && !start && !end && !isPath) className = 'node visited';
        if(isWall) className = 'node wall';
        if(isPath) className = 'node path';
        return (
        <div className={className}>
        </div>
        )
    }
}
