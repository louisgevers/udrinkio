import React, { Component } from 'react'
import './GameScreen.css'
import MineFieldGame from './MineFieldGame/MineFieldGame'

class GameScreen extends Component {
    render() {
        return (
            <div className='GameScreen'>
                {this.getGameComponent(this.props.game)}
            </div>
        )
    }

    getGameComponent = (game) => {
        if (game.id === 'minefield') {
            return <MineFieldGame game={game} gameState={this.props.gameState} />
        } else {
            return <span>{`Game ${game.name} not implemented`}</span>
        }
    }
}

export default GameScreen