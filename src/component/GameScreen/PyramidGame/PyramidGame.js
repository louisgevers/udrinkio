import React, { Component } from 'react'
import './PyramidGame.css'

import ProgressBar from '../../ProgressBar/ProgressBar.js'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class PyramidGame extends Component {

    constructor(props) {
        super(props)
        this.gameState = this.props.gameState
        this.state = {
            progress: 0
        }
    }

    // ### COMPONENT METHODS ###

    componentDidMount = () => {
        // pixi.js
        this.app = new Application({ resizeTo: this.gameCanvas, backgroundColor: parseInt(this.props.session.game.primaryColor.replace('#', '0x')) })
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        this.setup()
    }

    componentWillUnmount = () => {
        // pixi.js
        this.cleanup()
        this.app.stop()
    }

    render = () => {
        return (
            <div className='PyramidGame'>
                {this.state.progress < 100 && <ProgressBar progress={this.state.progress} color={this.props.session.game.secondaryColor} description={'loading assets...'} />}
                <div ref={(divCanvas) => { this.gameCanvas = divCanvas }} className='game-component' />
            </div>
        )
    }

    // ### PIXI.JS METHODS ###

    setup = () => {
        loader
        .add(cardFiles.map((fileName) => {
            return { name: fileName.substring(0, fileName.length - 4), url: require(`../../../image/cards/${fileName}`)}
        }))
        .on('progress', (loader, resource) => {
            this.setState({
                progress: loader.progress
            })
        })
        .load(() => { 
            this.setState({
                progress: 100
            })
            // TODO
            window.addEventListener('resize', this.reposition)
        })
    }

    // ### RENDER METHODS ###

    reposition = () => {
        // TODO
    }

    cleanup = () => {
        window.removeEventListener('resize', this.reposition)
        loader.reset()
    }
}

export default PyramidGame