import React, { Component } from 'react'
import './FTheDealerGame.css'

import ProgressBar from '../../ProgressBar/ProgressBar.js'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'
import Button from '../../../graphics/Button'

Pixi.utils.skipHello()

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class FTheDealerGame extends Component {

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
            <div className='FTheDealerGame'>
                {this.state.progress < 100 && <ProgressBar progress={this.state.progress} color={this.props.session.game.secondaryColor} description={'loading assets...'} />}
                <div ref={(divCanvas) => { this.gameCanvas = divCanvas }} className='game-component' />
            </div>
        )
    }

    // ### SOCKET.IO METHODS ###

    setupSockets = () => {

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
            this.initTableSprites()
            this.setupSockets()
            window.addEventListener('resize', this.reposition)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.reposition)
        loader.reset()
    }

    // ### RENDER METHODS ###

    initTableSprites = () => {
        this.tableSprites = []
        this.cardContainers = []
        for (var column = 0; column < 13; column++) {
            const container = new Pixi.Container()
            this.cardContainers.push(container)
            const cardSprites = []
            for (var row = 0; row < 4; row++) {
                const sprite = new Pixi.Sprite(resources['b'].texture)
                cardSprites.push(sprite)
                container.addChild(sprite)
            }
            this.tableSprites.push(cardSprites)
            this.app.stage.addChild(container)
        }
        this.positionTableSprites()
        this.updateTableSprites()
    }

    positionTableSprites = () => {
        const n = this.cardContainers.length
        this.tableSprites.forEach((column) => {
            column.forEach((sprite, j) => {
                // Scaling
                const scale = (0.6 * this.app.renderer.width) / sprite.width / n
                sprite.width = scale * sprite.width
                sprite.height = scale * sprite.height
                // Positioning
                sprite.y = j * (0.3 * sprite.height)
            })
        })
        this.cardContainers.forEach((container, i) => {
            const centerOffsetX = (this.app.renderer.width - n * container.width) / 2
            container.x = i * container.width + centerOffsetX
            container.y = this.app.renderer.height / 2 - container.height / 2
        })
    }

    updateTableSprites = () => {
        const table = this.gameState.table
        this.tableSprites.forEach((column, i) => {
            column.forEach((sprite, j) => {
                if (i < table.length && j < table[i].length) {
                    sprite.visible = true
                    sprite.texture = resources[table[i][j]].texture
                } else {
                    sprite.visible = false
                }
            })
        })
    }

    reposition = () => {
        this.positionTableSprites()
    }

}

export default FTheDealerGame