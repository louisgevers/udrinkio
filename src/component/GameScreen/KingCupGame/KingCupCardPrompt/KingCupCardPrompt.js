import React, { Component } from 'react'
import './KingCupCardPrompt.css'

import Prompt from '../../../Prompt/Prompt.js'
import rules from '../../../../data/kingcup.json'

class KingCupCardPrompt extends Component {
    render = () => {
        return (
            <div className='KingCupCardPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={'NEW CARD'} >
                    <div className='prompt-content' style={{display: 'grid', gridTemplateColumns: `${this.hasOrder() ? '1fr 30%' : '1fr'}`}}>
                        <div className='card'>
                            <img src={require(`../../../../image/cards/${this.props.card}.svg`)} alt={`${this.props.card} card`}></img>
                            <span className='card-name'>{rules[this.props.card.slice(0, -1)].name}</span>
                            <span className='card-description'>{rules[this.props.card.slice(0, -1)].description}</span>
                            {this.props.isTurn && <span className='ready-description'>When ready, stack the card on the bottle...</span>}
                            {this.props.isTurn ? 
                                <button style={{backgroundColor: this.props.game.secondaryColor}} onClick={this.props.onStackClick}>STACK</button>
                                : <button disabled>Waiting for player to stack...</button>
                            }
                        </div>
                        {this.hasOrder() && 
                        <div className='order'>
                            <h2>Order</h2>
                            <ol>
                                {this.props.order.map((user) => {
                                    return <li key={user.userId}>{user.username}</li>
                                })}
                            </ol>
                            <p>Repeat the order until someone fails</p>
                        </div>}
                    </div>
                    
                </Prompt>
            </div>
        )
    }

    hasOrder = () => {
        return  typeof this.props.order !== 'undefined' && rules[this.props.card.slice(0, -1)].order
    }
}

export default KingCupCardPrompt