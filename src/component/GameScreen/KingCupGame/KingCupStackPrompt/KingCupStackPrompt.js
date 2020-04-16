import React, { Component } from 'react'
import './KingCupStackPrompt.css'

import Prompt from '../../../Prompt/Prompt'

class KingCupStackPrompt extends Component {
    render = () => {
        return (
            <div className='KingCupStackPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} onClose={this.props.onClose} title={'STACK FELL'}>
                    <div className='prompt-content'>
                        <p><b style={{color: this.props.game.secondaryColor}}>{this.props.username}</b> let the stack fall and has to drink!</p>
                        <span className='timer'>This box will automatically close in {this.props.timer} seconds</span>
                    </div>
                </Prompt>
            </div>
        )
    }
}

export default KingCupStackPrompt