import React, { Component } from 'react'
import './KingCupGame.css'

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
        this.setup()
    }

    componentWillUnmount = () => {
        // socket.io
        this.props.socket.on('kingcup.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
        // pixi.js
        this.cleanup()
        this.app.stop()
    }

    render = () => {
        return (
            <div ref={(divCanvas => { this.gameCanvas = divCanvas })} className='KingCupGame game-component' />
        )
    }

    // ### PIXI.JS METHODS ###

    setup = () => {
        this.spriteTable = []
        loader
        .add(cardFiles.map((fileName) => {
            return { name: fileName.substring(0, fileName.length - 4), url: require(`../../../image/cards/${fileName}`)}
        }))
        .load(this.initCardSprites)
        window.addEventListener('resize', this.positionCards)
    }

    cardsAreSetup = () => {
        // socket.io
        this.props.socket.on('kingcup.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
    }

    cleanup = () => {
        window.removeEventListener('resize', this.positionCards)
        loader.reset()
    }

    // ### GAMESTATE METHODS ###

    onNewGameState = (gameState) => {
        this.gameState = gameState
        this.updateCardSprites()
    }

    onCardClicked = (index, cardName) => {
        if (this.isUsersTurn()) {
            this.props.socket.emit('kingcup.drawCard', {index: index})
        } else {
            alert('Not your turn yet')
        }
    }

    isUsersTurn = () => {
        return this.gameState.playingUser.userId === this.props.session.userId
    }

    // ### RENDER METHODS ###

    initCardSprites = () => {
        this.gameState.table.forEach((cardName, index) => {
            const card = new Sprite(resources[cardName].texture)
            card.interactive = true
            card.data = {
                name: cardName
            }
            card.on('pointertap', () => this.onCardClicked(index, card.data.name))
            this.spriteTable.push(card)
            this.app.stage.addChild(card)
        })
        this.positionCards()
        this.cardsAreSetup()
    }

    positionCards = () => {
        const n = this.spriteTable.length
        this.spriteTable.forEach((cardSprite, i) => {
            const scale = (0.3 * this.app.renderer.height) / cardSprite.height
            cardSprite.width = scale * cardSprite.width
            cardSprite.height = scale * cardSprite.height

            const r =  cardSprite.height
            const centerX = this.app.renderer.width / 2
            const centerY = this.app.renderer.height / 2
            const pointX = centerX - cardSprite.width / 2
            const pointY = centerY - cardSprite.width / 2 - r

            const angle = (360 / n * i) * Math.PI / 180
            const rotatedX = Math.cos(angle) * (pointX - centerX) - Math.sin(angle) * (pointY - centerY) + centerX
            const rotatedY = Math.sin(angle) * (pointX - centerX) + Math.cos(angle) * (pointY - centerY) + centerY

            cardSprite.x = rotatedX
            cardSprite.y = rotatedY
            cardSprite.rotation = angle
        })
    }

    updateCardSprites = () => {
        if (typeof this.spriteTable !== 'undefined') {
            this.gameState.table.forEach((cardName, index) => {
                if (cardName !== 'b') {
                    this.spriteTable[index].texture = null
                } else {
                    this.spriteTable[index].texture = resources[cardName].texture
                }
                this.spriteTable[index].data.name = cardName
            })
        }
    }

}

export default KingCupGame