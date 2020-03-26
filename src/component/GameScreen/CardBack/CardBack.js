import React, { Component } from 'react'
import './CardBack.css'

class CardBack extends Component {
    render() {
        return (
            <div className="CardBack">
                <div className='card-wrapper'>
                    <div className='card-content'>
                        <div className='card-outline'>
                            <div className='card-color' style={{backgroundColor: this.props.game.primaryColor}}>
                                <img src={require(`../../../image/${this.props.game.imageName}`)} alt={`${this.props.cardId}.svg`} />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default CardBack