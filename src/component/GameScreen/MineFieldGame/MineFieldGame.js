import React, { Component } from 'react'
import './MineFieldGame.css'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class MineFieldGame extends Component {

    constructor(props) {
        super(props)
        this.state = this.props.gameState
    }

    componentDidMount = () => {
        // socket.io
        this.props.socket.on('minefield.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
        // pixi.js
        this.app = new Application({resizeTo: this.gameCanvas, backgroundColor: this.getHexadecimalColor(this.props.game.primaryColor)})
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        this.setup()
    }

    componentWillUnmount = () => {
        // socket.io
        this.props.socket.removeListener('minefield.drawnCard', this.onNewGameState)
        this.props.socket.removeListener('game.userDisconnected', this.onNewGameState)
        // pixi.js
        this.cleanUp()
        this.app.stop()
    }

    render() {
        return (
            <div ref={(divCanvas) => {this.gameCanvas = divCanvas}} className='MineFieldGame game-component' />
        )
    }

    onNewGameState = (gameState) => {
        this.setState(gameState)
        this.updateCardSprites()
    }

    onCardClicked = (i, j) => {
        this.props.socket.emit('minefield.drawCard', {row: i, column: j})
    }

    // ###################
    // ###   PIXI.JS   ###
    // ###################

    setup = () => {
        // Add card sprites
        this.spriteTable = []
        loader
        .add(cardFiles.map((fileName) => {
            return {name: fileName.substring(0, fileName.length - 4), url: require(`../../../image/cards/${fileName}`)}
        }))
        .load(this.initCardSprites)
        window.addEventListener('resize', this.resizeCardSprites)
    }

    cleanUp = () => {
        this.spriteTable.forEach((row) => {
            row.forEach((cardSprite) => {
                cardSprite.destroy(true)
            })
        })
        loader.reset()
        window.removeEventListener('resize', this.resizeCardSprites)
    }

    initCardSprites = () => {
        this.state.table.forEach((row, i) => {
            const spriteRow = []
            row.forEach((cardName, j) => {
                const card = new Sprite(resources[cardName].texture)
                card.interactive = true
                card.on('click', () => this.onCardClicked(i, j))
                this.app.stage.addChild(card)
                spriteRow.push(card)
            })
            this.spriteTable.push(spriteRow)
        })
        this.resizeCardSprites()
    }

    resizeCardSprites = () => {
        const n = this.state.table.length
        const gap = 3
        this.spriteTable.forEach((row, i) => {
            row.forEach((card, j) => {
                const scale = (0.8 * this.app.renderer.height / n) / card.height
                card.width = scale * card.width
                card.height = scale * card.height
                const centerOffsetY = (this.app.renderer.height - (n * card.height + (n - 1) * gap)) / 2
                const centerOffsetX = (this.app.renderer.width - (n * card.width + (n - 1) * gap)) / 2
                card.y = i * (card.height + gap) + centerOffsetY
                card.x = j * (card.width + gap) + centerOffsetX
            })
        })
    }

    updateCardSprites = () => {
        this.state.table.forEach((row, i) => {
            row.forEach((cardName, j) => {
                this.spriteTable[i][j].texture = resources[cardName].texture
            })
        })
    }

    getHexadecimalColor = (stringColor) => {
        return parseInt(stringColor.replace('#', '0x'))
    }

}

export default MineFieldGame