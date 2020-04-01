import React, { Component } from 'react'
import './GameScreen.css'
import MineFieldGame from './MineFieldGame/MineFieldGame'

class GameScreen extends Component {
    render() {
        return (
            <div className='GameScreen'>
                {this.getGameComponent(this.props.session.game)}
            </div>
        )
    }

    getGameComponent = (game) => {
        if (game.id === 'minefield') {
            return <MineFieldGame session={this.props.session} gameState={this.props.gameState} socket={this.props.socket }/>
        } else {
            return <span>{`Game ${game.name} not implemented`}</span>
        }
    }
}

export default GameScreen