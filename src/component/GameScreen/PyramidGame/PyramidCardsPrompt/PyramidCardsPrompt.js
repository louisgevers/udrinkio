import React, { Component } from 'react'
import './PyramidCardsPrompt.css'

import Prompt from '../../../Prompt/Prompt.js'

class PyramidCardsPrompt extends Component {
    render = () => {
        return (
            <div className='PyramidCardsPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={'YOUR CARDS'}>
                    <div className='prompt-content'>
                        <div className='prompt-cards' style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${this.props.hand.length}, 1fr)`,
                            gridGap: '10px'
                        }}>
                            {this.props.hand.map((cardName, index) => {
                                return <img key={index} src={require(`../../../../image/cards/${cardName}.png`)} alt={`${cardName} card`} />
                            })}
                        </div>
                        <span className='description'><b>These are your cards for the game.</b><br/>Remember them and their order well to avoid making mistakes.<br/>After the dialog closes the only way to see your cards is by revealing them to everyone else.</span>
                        <span className='auto-info'>{`This dialog will automatically close in ${this.props.time} second(s)`}</span>
                        <button className='close-now-button' style={{backgroundColor: this.props.game.secondaryColor}} onClick={this.props.onCloseNow}>Close now</button>
                    </div>
                </Prompt>
            </div>
        )
    }
}

export default PyramidCardsPrompt