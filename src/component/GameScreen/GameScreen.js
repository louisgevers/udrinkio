import React, { Component } from 'react'
import './GameScreen.css'
import MineFieldGame from './MineFieldGame/MineFieldGame'
import KingCupGame from './KingCupGame/KingCupGame'
import PyramidGame from './PyramidGame/PyramidGame'
import FTheDealerGame from './FTheDealerGame/FTheDealerGame'

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
            return <MineFieldGame session={this.props.session} gameState={this.props.gameState} socket={this.props.socket} analytics={this.props.analytics} />
        } else if (game.id === 'kingcup') {
            return <KingCupGame session={this.props.session} gameState={this.props.gameState} socket={this.props.socket} analytics={this.props.analytics} />
        } else if (game.id === 'pyramid') {
            return <PyramidGame session={this.props.session} gameState={this.props.gameState} socket={this.props.socket} analytics={this.props.analytics} />
        } else if (game.id === 'fthedealer') {
            return <FTheDealerGame session={this.props.session} gameState={this.props.gameState} socket={this.props.socket} analytics={this.props.analytics} />
        } else {
            return <span>{`Game ${game.name} not implemented`}</span>
        }
    }
}

export default GameScreen