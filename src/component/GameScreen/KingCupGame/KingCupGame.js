import React, { Component } from 'react'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class KingCupGame extends Component {

    constructor(props) {
        super(props)
        this.gameState = this.props.gameState
    }

    // ### COMPONENT METHODS ###

    componentDidMount = () => {
        // pixi.js
        this.app = new Application({ resizeTo: this.gameCanvas, backgroundColor: parseInt(this.props.session.game.primaryColor.replace('#', '0x')) })
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
    }

    componentWillUnmount = () => {
        // pixi.js
        this.app.stop()
    }

    render = () => {
        return (
            <div ref={(divCanvas => { this.gameCanvas = divCanvas })} className='KingCupGame game-component' />
        )
    }

}

export default KingCupGame