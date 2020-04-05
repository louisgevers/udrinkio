import React, { Component } from 'react'
import './KingCupCardPrompt.css'

import Prompt from '../../../Prompt/Prompt.js'
import rules from '../../../../data/kingcup.json'

class KingCupCardPrompt extends Component {
    render = () => {
        return (
            <div className='KingCupCardPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={'NEW CARD'} >
                    <div className='prompt-content'>
                        <img src={require(`../../../../image/cards/${this.props.card}.svg`)} alt={`${this.props.card} card`}></img>
                        <span className='card-name'>{rules[this.props.card.charAt(0)].name}</span>
                        <span className='card-description'>{rules[this.props.card.charAt(0)].description}</span>
                        {this.props.isTurn && <span className='ready-description'>When ready, stack the card on the bottle...</span>}
                        {this.props.isTurn ? 
                            <button style={{backgroundColor: this.props.game.secondaryColor}} onClick={this.props.onStackClick}>STACK</button>
                            : <button disabled>Waiting for player to stack...</button>
                        }
                    </div>
                </Prompt>
            </div>
        )
    }
}

export default KingCupCardPrompt