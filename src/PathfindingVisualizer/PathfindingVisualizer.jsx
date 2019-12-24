import React, { Component } from 'react'
import Node from './Node/Node'
import './PathfindingVisualizer.css';

import { dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra'

const START_NODE_ROW = 0
const START_NODE_COL = 0	
const FINISH_NODE_ROW = 19
const FINISH_NODE_COL = 49

export default class PathfindingVisualizer extends Component {
	constructor() {
		super();
		this.state = {
			grid: [],
			isMousePressed: false			
		}
	}

	componentDidMount() {
		var grid = getInitialisedGrid() 
		this.setState({ grid })
	}

	handleMouseDown = (row, col)=> {
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col)
		this.setState({
			grid: newGrid,
			isMousePressed: true
		})
	}

	handleMouseEnter = (row, col) => {
		if (!this.state.isMousePressed)
			return
		const newGrid = getNewGridWithWallToggled(this.state.grid, row ,col)
		this.setState({
			grid: newGrid
		})
	}

	handleMouseUp = ()=> {
		this.setState({ isMousePressed: false})
	}

	animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

	visualizeDijkstra= ()=> {
		const visitedNodesInOrder = dijkstra(this.state.grid, this.state.grid[START_NODE_ROW][START_NODE_COL], this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder)
	}

	render () {
		const { grid, isMousePressed } = this.state

		return(
			<div>
				<button onClick={this.visualizeDijkstra}>
					Dijkstra Algorithm Visualizer 
				</button>
				<div className='grid'>
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
								{row.map((node, nodeIdx)=> {
									const { row, col, isStart, isFinish, isWall} = node
									return (
										<Node
											key={nodeIdx}
											col={col}
											row={row}
											isStart={isStart}
											isFinish={isFinish}
											isWall={isWall}
											mouseIsPressed={isMousePressed}
											onMouseDown={() => this.handleMouseDown(row,col)}
											onMouseUp={() => this.handleMouseUp()}
											onMouseEnter={() => this.handleMouseEnter(row, col)}>
										</Node>
										)
								})}
							</div>
							)
					})}
				</div>
			</div>
			)
	}
}

const getInitialisedGrid = ()=> {
	let grid = []
	for (let row=0; row<20; row++) {
		let currentCol = []
		for (let col=0; col<50; col++)
			currentCol.push(createNode(row, col))
		grid.push(currentCol)
	}
	return grid
}

const createNode = (row, col)=> {
	return {
		row, 
		col,
		isStart: row === START_NODE_ROW && col === START_NODE_COL,
		isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
		distance: Infinity,
	    isVisited: false,
	    isWall: false,
	    previousNode: null,
	}
}

const getNewGridWithWallToggled = (grid, row, col)=> {
	const newGrid = grid.slice()
	const node = newGrid[row][col]
	const newNode = node
	newNode.isWall = !node.isWall
	newGrid[row][col] = newNode
	return newGrid
}