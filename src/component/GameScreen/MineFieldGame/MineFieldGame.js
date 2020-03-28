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
        this.onNewGameState(this.props.gameState)
    }

    componentDidMount = () => {
        // pixi.js
        this.app = new Application({resizeTo: this.gameCanvas, backgroundColor: this.getHexadecimalColor(this.props.game.primaryColor)})
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        this.setup()
        // socket.io
        // this.props.socket.on('minefield.drawnCard', this.onNewGameState)
        // this.props.socket.on('game.userDisconnected', this.onNewGameState)
    }

    componentWillUnmount = () => {
        // socket.io
        // this.props.socket.removeListener('minefield.drawnCard', this.onNewGameState)
        // this.props.socket.removeListener('game.userDisconnected', this.onNewGameState)
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
        this.gameState = gameState
        this.updateCardSprites()
        if (this.isUsersTurn()) {
            alert('Your turn to play! Pick a card.')
        }
    }

    onCardClicked = (i, j, cardName) => {
        if (this.isUsersTurn()) {
            if (cardName === 'b') {
                // this.props.socket.emit('minefield.drawCard', {row: i, column: j})
            } else {
                alert('This card is already taken')
            }
        } else {
            alert('Not your turn yet')
        }
    }

    isUsersTurn = () => {
        return this.props.userGameId === this.gameState.playingUser.userId
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
        this.gameState.table.forEach((row, i) => {
            const spriteRow = []
            row.forEach((cardName, j) => {
                const card = new Sprite(resources[cardName].texture)
                card.interactive = true
                card.data = {
                    name: cardName
                }
                card.on('click', () => this.onCardClicked(i, j, card.data.name))
                this.app.stage.addChild(card)
                spriteRow.push(card)
            })
            this.spriteTable.push(spriteRow)
        })
        this.resizeCardSprites()
    }

    resizeCardSprites = () => {
        const n = this.gameState.table.length
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
        if (typeof this.spriteTable !== 'undefined') {
            this.gameState.table.forEach((row, i) => {
                row.forEach((cardName, j) => {
                    this.spriteTable[i][j].texture = resources[cardName].texture
                    this.spriteTable[i][j].data.name = cardName
                })
            })
        }
    }

    getHexadecimalColor = (stringColor) => {
        return parseInt(stringColor.replace('#', '0x'))
    }

}

export default MineFieldGame