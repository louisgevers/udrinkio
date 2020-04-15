import React, { Component } from 'react'
import './KingCupGame.css'

import KingCupCardPrompt from './KingCupCardPrompt/KingCupCardPrompt.js'
import Button from '../../../graphics/Button'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'
import ProgressBar from '../../ProgressBar/ProgressBar'

Pixi.utils.skipHello()

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
        this.app = new Application({ autoResize: true, backgroundColor: parseInt(this.props.session.game.primaryColor.replace('#', '0x')) })
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        const parent = this.app.view.parentNode
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
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
                {this.state.lastCard !== null && this.state.showCard && <KingCupCardPrompt game={this.props.session.game} card={this.state.lastCard} onStackClick={this.onStackCard} isTurn={this.isUsersTurn()} order={this.gameState.order} /> }
            </div>
        )
    }

    // ### LOGIC METHODS ###

    onNewGameState = (gameState) => {
        this.gameState = gameState
        this.updatePlayerTurn()
        this.updateCards()
        this.updateStack()
        this.updateEndGameButton()
    }

    onCardClicked = (index) => {
        if (this.isUsersTurn()) {
            this.props.socket.emit('kingcup.drawCard', {index: index})
        } else {
            alert('Not your turn yet')
        }
    }

    onCardDrawn = (gameState) => {
        this.setState({
            lastCard: gameState.lastCard,
            showCard: true
        })
    }

    onStackCard = () => {
        this.props.socket.emit('kingcup.stackCard')
    }

    onEndGameClicked = () => {
        this.props.socket.emit('kingcup.end')
    }

    isUsersTurn = () => {
        return this.gameState.playingUser.userId === this.props.session.userId
    }

    gameIsFinished = () => {
        for (var i = 0; i < this.gameState.table.length; i++) {
            if (this.gameState.table[i] === 'b') {
                return false
            }
        }
        return true
    }

    // ### SOCKET.IO METHODS ###

    setupSockets = () => {
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

    // ### PIXI.JS METHODS

    setup = () => {
        this.app.renderer.plugins.interaction.autoPreventDefault = false
        this.app.renderer.view.style['touch-action'] = 'auto'
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
            this.initPlayerTurn()
            this.initBottle()
            this.initCards()
            this.initStack()
            this.initEndGameButton()
            this.setupSockets()
            window.addEventListener('resize', this.resize)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.resize)
        loader.reset()
    }

    resize = () => {
        const parent = this.app.view.parentNode
        this.positionPlayerTurn()
        this.positionBottle()
        this.positionCards()
        this.positionStack()
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
    }

    // ### RENDER METHODS ###

    // # INITIALIZATION #

    initPlayerTurn = () => {
        this.playerTurnContainer = new Pixi.Container()

        const playerName = new Pixi.Text()
        const isPlaying = new Pixi.Text(' is playing.')

        const fontSize = 24
        playerName.resolution = 2
        isPlaying.resolution = 2
        playerName.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: `${fontSize}px`,
            fill: this.props.session.game.secondaryColor,
            fontWeight: 'bold'
        }
        isPlaying.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: `${fontSize}px`,
            fill: '#ffffff'
        }

        this.playerTurnContainer.addChild(playerName)
        this.playerTurnContainer.addChild(isPlaying)

        this.app.stage.addChild(this.playerTurnContainer)
        this.updatePlayerTurn()
    }

    initBottle = () => {
        this.bottleSprite = new Sprite(resources['bottle'].texture)
        this.bottleSprite.anchor.set(0.5, 0.5)
        this.positionBottle()
    }

    initCards = () => {
        this.cardSpritesContainer = new Pixi.Container()
        const n = this.gameState.table.length
        for (var i = 0; i < n; i++) {
            const sprite = new Sprite(resources['b'].texture)
            sprite.data = {
                index: i
            }
            sprite.on('pointertap', () => this.onCardClicked(sprite.data.index))
            this.cardSpritesContainer.addChild(sprite)
        }
        this.app.stage.addChild(this.cardSpritesContainer)
        this.app.stage.addChild(this.bottleSprite)
        this.updateCards()
    }

    initStack = () => {
        this.stackSpritesContainer = new Pixi.Container()
        const n = this.gameState.table.length
        for (var i = 0; i < n; i++) {
            const sprite = new Sprite(resources['b'].texture)
            this.stackSpritesContainer.addChild(sprite)
            sprite.anchor.set(0.5, 0.5)
            const angle = (10 * Math.PI / 180) * (Math.random() * 2 - 1)
            sprite.rotation = angle
        }
        this.app.stage.addChild(this.stackSpritesContainer)
        this.updateStack()
    }

    initEndGameButton = () => {
        this.endGameButton = new Button('END GAME', '#ff0000')
        this.endGameButton.on('pointertap', this.onEndGameClicked)
        this.app.stage.addChild(this.endGameButton)
        this.updateEndGameButton()
    }

    // # POSITIONING #

    positionPlayerTurn = () => {
        // Children
        const playerName = this.playerTurnContainer.children[0]
        const isPlaying = this.playerTurnContainer.children[1]
        playerName.x = 0
        isPlaying.x = playerName.width
        isPlaying.y = playerName.height - isPlaying.height
        // Container
        this.playerTurnContainer.x = this.app.renderer.width / 2 - this.playerTurnContainer.width / 2
        this.playerTurnContainer.y = 50
    }

    positionBottle = () => {
        // Scaling
        const scale = 0.2 * Math.min(this.app.renderer.height, this.app.renderer.width) / this.bottleSprite.height
        this.bottleSprite.height = scale * this.bottleSprite.height
        this.bottleSprite.width = scale * this.bottleSprite.width
        // Positioning
        this.bottleSprite.x = this.app.renderer.width / 2
        this.bottleSprite.y = this.app.renderer.height / 2 + this.playerTurnContainer.y
    }

    positionCards = () => {
        const n = this.cardSpritesContainer.children.length
        this.cardSpritesContainer.children.forEach((sprite, i) => {
            // Scaling
            const scale = 0.3 * Math.min(this.app.renderer.height, this.app.renderer.width) / sprite.height
            sprite.height = scale * sprite.height
            sprite.width = scale* sprite.width
            // Positioning
            const r = this.bottleSprite.height * 1.2
            const centerX = this.bottleSprite.x
            const centerY = this.bottleSprite.y
            const pointX = centerX - sprite.width / 2
            const pointY = centerY - sprite.width / 2 - r

            const angle = (360 / n * i) * Math.PI / 180
            const rotatedX = Math.cos(angle) * (pointX - centerX) - Math.sin(angle) * (pointY - centerY) + centerX
            const rotatedY = Math.sin(angle) * (pointX - centerX) + Math.cos(angle) * (pointY - centerY) + centerY

            sprite.x = rotatedX
            sprite.y = rotatedY
            sprite.rotation = angle
        })
    }

    positionStack = () => {
        this.stackSpritesContainer.children.forEach((sprite) => {
            // Scaling
            const scale = 0.35 * Math.min(this.app.renderer.height, this.app.renderer.width) / sprite.height
            sprite.height = scale * sprite.height
            sprite.width = scale * sprite.width
            // Positioning
            sprite.x = this.bottleSprite.x
            sprite.y = this.bottleSprite.y
        })
    }

    positionEndGameButton = () => {
        this.endGameButton.x = this.bottleSprite.x - this.endGameButton.width / 2
        this.endGameButton.y = this.bottleSprite.y - this.endGameButton.height / 2
    }

    // # UPDATING #

    updatePlayerTurn = () => {
        const playerName = this.playerTurnContainer.children[0]
        const isPlaying = this.playerTurnContainer.children[1]
        if (this.gameIsFinished()) {
            playerName.text = ''
            isPlaying.text = 'Game finished'
        } else {
            if (this.isUsersTurn()) {
                playerName.text = 'Your turn!'
                isPlaying.text = ''
            } else {
                playerName.text = this.gameState.playingUser.username
                isPlaying.text = ' is playing...'
            }
        }
        
        this.positionPlayerTurn()
    }

    updateCards = () => {
        this.gameState.table.forEach((card, i) => {
            const sprite = this.cardSpritesContainer.children[i]
            if (card === 'b') {
                sprite.visible = true
                sprite.interactive = true
                sprite.buttonMode = true
            } else {
                sprite.visible = false
                sprite.interactive = false
                sprite.buttonMode = false
            }
        })
        this.positionCards()
    }

    updateStack = () => {
        this.stackSpritesContainer.children.forEach((sprite, i) => {
            if (i < this.gameState.bottleStack.length) {
                sprite.visible = true;
                sprite.texture = resources[this.gameState.bottleStack[i]].texture
            } else {
                sprite.visible = false
            }
        })
        this.positionStack()
    }

    updateEndGameButton = () => {
        if (this.props.session.userId === this.props.session.host && this.gameIsFinished()) {
            this.endGameButton.visible = true
            this.endGameButton.interactive = true
            this.endGameButton.buttonMode = true
        } else {
            this.endGameButton.visible = false
            this.endGameButton.interactive = false
            this.endGameButton.buttonMode = false
        }
        this.positionEndGameButton()
    }

}

export default KingCupGame