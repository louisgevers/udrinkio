import React, { Component } from 'react'
import './MineFieldGame.css'

import Card from '../Card/Card.js'
import CardBack from '../CardBack/CardBack.js'

class MineFieldGame extends Component {

    constructor(props) {
        super(props)
        // TODO this is used for storybook
        this.state = this.props.state
    }

    render() {
        return (
            <div className='MineFieldGame game-component'>
                <div className='card-table'>
                    {this.state.table.map((row) => {
                        return <div className='card-row'>
                            {row.map((cardId) => this.createCard(cardId))}
                        </div>
                    })}
                </div>
            </div>
        )
    }

    createCard = (cardId) => {
        if (cardId === 'b') {
            return <CardBack game={this.state.game} />
        } else {
            return <Card cardId={cardId} />
        }
    }
}

export default MineFieldGame