import React, { Component } from 'react'
import './MineFieldGame.css'

import Card from '../Card/Card.js'
import CardBack from '../CardBack/CardBack.js'

class MineFieldGame extends Component {

    constructor(props) {
        super(props)
        this.state = this.props.gameState
    }

    render() {
        return (
            <div className='MineFieldGame game-component'>
                <div className='card-table' style={{display: 'grid', gridTemplateColumns: `repeat(${this.state.table.length}, 1fr)`}}>
                    {this.state.table.map((row, i) => {
                        return row.map((cardId, j) => this.createCard(cardId, i, j))
                    })}
                </div>
            </div>
        )
    }

    componentWillMount = () => {
        this.props.socket.on('minefield.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
    }

    componentWillUnmount = () => {
        this.props.socket.removeListener('minefield.drawnCard', this.onNewGameState)
        this.props.socket.removeListener('game.userDisconnected', this.onNewGameState)
    }

    createCard = (cardId, i, j) => {
        if (cardId === 'b') {
            return <CardBack game={this.props.game} onClick={() => this.onCardClick(i, j)} />
        } else {
            return <Card cardId={cardId} />
        }
    }

    onCardClick = (i, j) => {
        const data = {row: i, column: j}
        this.props.socket.emit('minefield.drawCard', data)
    }

    onNewGameState = (gameState) => {
        this.setState(gameState)
    }
}

export default MineFieldGame