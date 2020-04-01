import React, { Component } from 'react'
import './GameOverPrompt.css'

import Prompt from '../Prompt/Prompt.js'

class GameOverPrompt extends Component {

    render() {
        return (
            <div className='GameOverPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={`GAME OVER`}>
                    <div className='game-over-buttons'>
                        <button onClick={() => this.props.onPlayAgain()} style={{backgroundColor: this.props.game.secondaryColor}}>PLAY AGAIN</button>
                        <button onClick={() => this.props.onHome()} style={{backgroundColor: this.props.game.secondaryColor}}>HOME</button>
                    </div>
                </Prompt>
            </div>
        )
    }

}

export default GameOverPrompt