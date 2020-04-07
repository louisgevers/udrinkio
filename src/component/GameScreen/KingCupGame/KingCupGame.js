import React, { Component } from 'react'
import './KingCupGame.css'

import KingCupCardPrompt from './KingCupCardPrompt/KingCupCardPrompt.js'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'
import ProgressBar from '../../ProgressBar/ProgressBar'

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class KingCupGame extends Component {

    constructor(props) {
        super(props)
        this.gameState = this.props.gameState
        this.state = {
            lastCard: this.props.gameState.lastCard,
            showCard: false,
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
        // socket.io
        this.props.socket.off('kingcup.towerStands')
        this.props.socket.off('kingcup.towerFell')
        this.props.socket.off('kingcup.drawnCard')
        this.props.socket.off('game.userDisconnected')
        this.props.socket.off('game.userJoined')
        // pixi.js
        this.cleanup()
        this.app.stop()
    }

    render = () => {
        return (
            <div className='KingCupGame'>
                {this.state.progress < 100 && <ProgressBar progress={this.state.progress} color={this.props.session.game.secondaryColor} description={'loading assets...'} />}
                <div ref={(divCanvas => { this.gameCanvas = divCanvas })} className='game-component' />
                {this.state.lastCard !== null && this.state.showCard && <KingCupCardPrompt game={this.props.session.game} card={this.state.lastCard} onStackClick={this.onStackCard} isTurn={this.isUsersTurn()} /> }
            </div>
        )
    }

    // ### PIXI.JS METHODS ###

    setup = () => {
        this.spriteTable = []
        this.spriteBottleStack = []
        loader
        .add(cardFiles.map((fileName) => {
            return { name: fileName.substring(0, fileName.length - 4), url: require(`../../../image/cards/${fileName}`)}
        }))
        .add({name: 'bottle', url: require('../../../image/bottle.png')})
        .on('progress', (loader, resource) => {
            this.setState({
                progress: loader.progress
            })
        })
        .load(() => { 
            this.setState({
                progress: 100
            })
            this.initBottleSprite()
            this.initCardSprites()
            window.addEventListener('resize', this.reposition)
        })
        this.initUserDisplay()
    }

    cardsAreSetup = () => {
        this.onNewGameState(this.props.gameState)
        // socket.io
        this.props.socket.on('kingcup.drawnCard', (gameState) => { 
            this.onNewGameState(gameState)
            this.onCardDrawn(gameState)
        })
        this.props.socket.on('kingcup.towerFell', (gameState) => {
            this.onNewGameState(gameState)
            this.setState({
                showCard: false
            })
            alert('STACK FELL!')
        })
        this.props.socket.on('kingcup.towerStands', (gameState) => {
            this.onNewGameState(gameState)
            this.setState({
                showCard: false
            })
        })
        this.props.socket.on('game.userDisconnected', (gameState) => {
            this.onNewGameState(gameState)
            this.setState({
                showCard: false
            })
        })
        this.props.socket.on('game.userJoined', (gameState) => {
            this.onNewGameState(gameState)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.reposition)
        loader.reset()
    }

    // ### GAMESTATE METHODS ###

    onNewGameState = (gameState) => {
        this.gameState = gameState
        this.updateCardSprites()
        this.updateUserDisplay()
    }

    onCardDrawn = (gameState) => {
        this.setState({
            lastCard: gameState.lastCard,
            showCard: true
        })
    }

    onCardClicked = (index, cardName) => {
        if (this.isUsersTurn()) {
            if (cardName === 'b') {
                this.props.socket.emit('kingcup.drawCard', {index: index})
            }
        } else {
            alert('Not your turn yet')
        }
    }

    onStackCard = () => {
        this.props.socket.emit('kingcup.stackCard')
    }

    isUsersTurn = () => {
        return this.gameState.playingUser.userId === this.props.session.userId
    }

    // ### RENDER METHODS ###

    initCardSprites = () => {
        this.gameState.table.forEach((cardName, index) => {
            const texture = cardName === 'b' ? resources[cardName].texture : null
            const card = new Sprite(texture)
            card.interactive = true
            card.buttonMode = true
            card.data = {
                name: cardName
            }
            card.on('pointertap', () => this.onCardClicked(index, card.data.name))
            this.spriteTable.push(card)
            this.app.stage.addChild(card)
        })
        this.app.stage.addChild(this.bottleSprite)
        for (var i = 0; i < this.gameState.table.length; i++) {
            const card = new Sprite(resources['b'].texture)
            card.visible = false
            this.spriteBottleStack.push(card)
            this.app.stage.addChild(card)
        }
        this.gameState.bottleStack.forEach((cardName, index) => {
            this.spriteBottleStack[index].texture = resources[cardName].texture
        })
        this.updateCardSprites()
        this.positionCards()
        this.cardsAreSetup()
    }

    initUserDisplay = () => {
        this.userDisplay = new Pixi.Text()
        this.isPlayingDisplay = new Pixi.Text()
        this.userDisplay.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fill: this.props.session.game.secondaryColor,
            fontWeight: 'bold'
        }
        this.isPlayingDisplay.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fill: 'white'
        }
        this.userDisplay.y = 50
        this.isPlayingDisplay.y = 50
        this.app.stage.addChild(this.userDisplay)
        this.app.stage.addChild(this.isPlayingDisplay)
    }

    initBottleSprite = () => {
        this.bottleSprite = new Sprite(resources['bottle'].texture)

        const scale = (0.25 * this.app.renderer.height) / this.bottleSprite.height
        this.bottleSprite.height = scale * this.bottleSprite.height
        this.bottleSprite.width = scale * this.bottleSprite.width

        const centerOffset = 50
        this.bottleSprite.x = this.app.renderer.width / 2 - this.bottleSprite.width / 2
        this.bottleSprite.y = this.app.renderer.height / 2 - this.bottleSprite.height / 2 + centerOffset
    }

    reposition = () => {
        this.positionCards()
        this.positionBottle()
    }

    positionCards = () => {
        const n = this.spriteTable.length
        const centerOffset = 50
        this.spriteTable.forEach((cardSprite, i) => {
            const scale = (0.3 * this.app.renderer.height) / cardSprite.height
            cardSprite.width = scale * cardSprite.width
            cardSprite.height = scale * cardSprite.height

            const r =  cardSprite.height
            const centerX = this.app.renderer.width / 2
            const centerY = this.app.renderer.height / 2 + centerOffset
            const pointX = centerX - cardSprite.width / 2
            const pointY = centerY - cardSprite.width / 2 - r

            const angle = (360 / n * i) * Math.PI / 180
            const rotatedX = Math.cos(angle) * (pointX - centerX) - Math.sin(angle) * (pointY - centerY) + centerX
            const rotatedY = Math.sin(angle) * (pointX - centerX) + Math.cos(angle) * (pointY - centerY) + centerY

            cardSprite.x = rotatedX
            cardSprite.y = rotatedY
            cardSprite.rotation = angle
        })
        this.spriteBottleStack.forEach((cardSprite) => {
            const scale = (0.4 * this.app.renderer.height) / cardSprite.height
            cardSprite.width = scale * cardSprite.width
            cardSprite.height = scale * cardSprite.height
            cardSprite.anchor.set(0.5, 0.5)
            cardSprite.x = this.app.renderer.width / 2
            cardSprite.y = this.app.renderer.height / 2 + centerOffset
            const angle = (10 * Math.PI / 180) * (Math.random() * 2 - 1)
            cardSprite.rotation = angle
        })
    }

    positionBottle = () => {
        this.bottleSprite.x = this.app.renderer.width / 2 - this.bottleSprite.width / 2
        this.bottleSprite.y = this.app.renderer.height / 2 - this.bottleSprite.height / 2
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
        if (typeof this.spriteBottleStack !== 'undefined') {
            this.gameState.bottleStack.forEach((cardName, index) => {
                this.spriteBottleStack[index].texture = resources[cardName].texture
                this.spriteBottleStack[index].visible = true
            })
            for (var i = this.gameState.bottleStack.length; i < this.spriteBottleStack.length; i++) {
                this.spriteBottleStack[i].visible = false
            }
        }
    }

    updateUserDisplay = () => {
        if (this.isUsersTurn()) {
            this.userDisplay.text = 'Your turn!'
            this.isPlayingDisplay.text = ''
        } else {
            const username = this.gameState.playingUser.username
            this.userDisplay.text = `${username}`
            this.isPlayingDisplay.text = ' is playing...'
        }
        this.userDisplay.x = (this.app.renderer.width / 2) - (this.userDisplay.width / 2) - (this.isPlayingDisplay.width / 2)
        this.isPlayingDisplay.x = (this.app.renderer.width / 2) - (this.isPlayingDisplay.width / 2) + (this.userDisplay.width / 2)
    }

}

export default KingCupGame