import React, { Component } from 'react'
import './MineFieldGame.css'

import Card from '../Card/Card.js'
import CardBack from '../CardBack/CardBack.js'

class MineFieldGame extends Component {

    constructor(props) {
        super(props)
        this.state = this.props.gameState
    }

    render() {
        return (
            <div className='MineFieldGame game-component'>
                <div className='card-table' style={{display: 'grid', gridTemplateColumns: `repeat(${this.state.table.length}, 1fr)`}}>
                    {this.state.table.map((row) => {
                        return row.map((cardId) => this.createCard(cardId))
                    })}
                </div>
            </div>
        )
    }

    createCard = (cardId) => {
        if (cardId === 'b') {
            return <CardBack game={this.props.game} />
        } else {
            return <Card cardId={cardId} />
        }
    }
}

export default MineFieldGame