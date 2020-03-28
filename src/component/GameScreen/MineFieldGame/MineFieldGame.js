import React, { Component } from 'react'
import './MineFieldGame.css'

import Card from '../Card/Card.js'
import CardBack from '../CardBack/CardBack.js'
import * as Pixi from 'pixi.js'

class MineFieldGame extends Component {

    constructor(props) {
        super(props)
        this.state = this.props.gameState
        // this.gameCanvas = React.createRef()
    }

    componentWillMount = () => {
        this.props.socket.on('minefield.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
    }

    componentDidMount = () => {
        this.app = new Pixi.Application({resizeTo: this.gameCanvas})
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
    }

    componentWillUnmount = () => {
        this.app.stop()
        this.props.socket.removeListener('minefield.drawnCard', this.onNewGameState)
        this.props.socket.removeListener('game.userDisconnected', this.onNewGameState)
    }

    render() {
        return (
            <div ref={(divCanvas) => {this.gameCanvas = divCanvas}} className='MineFieldGame game-component' />
        )
    }

    onNewGameState = (gameState) => {
        this.setState(gameState)
    }

    // createCard = (cardId, i, j) => {
    //     if (cardId === 'b') {
    //         return <CardBack game={this.props.game} onClick={() => this.onCardClick(i, j)} />
    //     } else {
    //         return <Card cardId={cardId} />
    //     }
    // }

    // onCardClick = (i, j) => {
    //     const data = {row: i, column: j}
    //     this.props.socket.emit('minefield.drawCard', data)
    // }
}

export default MineFieldGame