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
            this.initPyramid()
            window.addEventListener('resize', this.reposition)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.reposition)
        loader.reset()
    }

    // ### RENDER METHODS ###

    initPyramid = () => {
        this.pyramidSprites = []
        var row = 0
        var column = 0
        this.gameState.pyramid.forEach((cardName) => {
            const sprite = new Sprite(resources[cardName].texture)
            column += 1
            if (column > row) {
                column = 0
                row += 1
            }
            this.pyramidSprites.push(sprite)
            this.app.stage.addChild(sprite)
        })
        this.pyramidSize = row
        // Correct order of array displayed
        row -= 1
        column = 0
        this.pyramidSprites.forEach((sprite) => {
            sprite.data = {
                row: row,
                column: column
            }
            column += 1
            if (column > row) {
                column = 0
                row -= 1
            }
        })
        this.positionPyramid()
    }

    positionPyramid = () => {
        this.pyramidSprites.forEach((sprite) => {
            // Rotating
            sprite.rotation = Math.PI/2
            // Scaling
            const scale = (0.8 * this.app.renderer.height) / sprite.height / this.pyramidSize
            sprite.height = scale * sprite.height
            sprite.width = scale * sprite.width
            // Positioning
            const centerOffsetX = (this.app.renderer.width - this.pyramidSize * sprite.height) / 2 + sprite.height
            const centerOffsetY = (this.app.renderer.height - this.pyramidSize * sprite.width) / 2
            const pyramidOffsetY = (this.pyramidSize - 1 - sprite.data.row) * (sprite.width) / 2
            sprite.x = sprite.data.row * sprite.height + centerOffsetX
            sprite.y = (this.pyramidSize - 1 - sprite.data.column) * sprite.width + centerOffsetY - pyramidOffsetY
        })
    }

    reposition = () => {
        this.positionPyramid()
    }
}

export default PyramidGame