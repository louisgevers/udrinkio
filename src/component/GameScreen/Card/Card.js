import React, { Component } from 'react'
import './Card.css'

class Card extends Component {
    render() {
        return (
            <div className="Card">
                <img src={require(`../../../image/cards/${this.props.cardId}.svg`)} alt={`${this.props.cardId}.svg`} />
            </div>
        )
    }
}

export default Card