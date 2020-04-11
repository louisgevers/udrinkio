import React, { Component } from 'react'
import './PyramidGame.css'

import ProgressBar from '../../ProgressBar/ProgressBar.js'
import PyramidCardsPrompt from './PyramidCardsPrompt/PyramidCardsPrompt.js'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'
import Button from '../../../graphics/Button'

Pixi.utils.skipHello()

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    resources = loader.resources,
    Sprite = Pixi.Sprite;

class PyramidGame extends Component {

    constructor(props) {
        super(props)
        this.gameState = this.props.gameState
        this.gameState.hands = new Map(JSON.parse(this.gameState.hands))
        this.gameState.users = new Map(JSON.parse(this.gameState.users))
        this.state = {
            progress: 0,
            timer: 0,
            hand: null
        }
        this.host = this.props.session.host
        this.timeOuts = new Map()
    }

    // ### COMPONENT METHODS ###

    componentDidMount = () => {
        // pixi.js
        this.app = new Application({ autoResize: true, resolution: devicePixelRatio, backgroundColor: parseInt(this.props.session.game.primaryColor.replace('#', '0x')) })
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        const parent = this.app.view.parentNode
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
        this.setup()
    }

    componentWillUnmount = () => {
        // socket.io
        this.props.socket.off('pyramid.newCard')
        this.props.socket.off('pyramid.playerCard')
        this.props.socket.off('pyramid.assignedCards')
        this.props.socket.off('game.userDisconnected')
        this.props.socket.off('game.userJoined')
        this.props.socket.off('room.userDisconnected', this.updateHost)
        // pixi.js
        this.cleanup()
        this.app.stop()
    }

    render = () => {
        return (
            <div className='PyramidGame'>
                {this.state.progress < 100 && <ProgressBar progress={this.state.progress} color={this.props.session.game.secondaryColor} description={'loading assets...'} />}
                {this.state.timer > 0 && <PyramidCardsPrompt game={this.props.session.game} hand={this.state.hand} time={this.state.timer} onCloseNow={() => { this.setState({ timer: 0, hand: null }) }} />}
                <div ref={(divCanvas) => { this.gameCanvas = divCanvas }} className='game-component' />
            </div>
        )
    }

    // ### SOCKET.IO METHODS ###

    setupSockets = () => {
        this.props.socket.emit('pyramid.getCards')
        this.props.socket.on('pyramid.newCard', (gameState) => {
            this.newGameState(gameState)
            this.updatePyramid()
            this.updateHostButtons()
        })
        this.props.socket.on('pyramid.playerCard', (gameState) => {
            this.newGameState(gameState)
            this.updatePlayerCards()
            this.updateOtherPlayerCards()
        })
        this.props.socket.on('game.userDisconnected', this.updateUsers)
        this.props.socket.on('game.userJoined', this.updateUsers)
        this.props.socket.on('room.userDisconnected', this.updateHost)
        this.props.socket.on('pyramid.assignedCards', this.showCardsPrompt)
    }

    showCardsPrompt = (hand) => {
        this.setState({
            timer: 30,
            hand: hand
        })
        const intervalId = window.setInterval(() => {
            const timer = this.state.timer - 1
            if (timer <= 0) {
                this.setState({
                    timer: 0,
                    hand: null
                })
                window.clearInterval(intervalId)
            } else {
                this.setState({
                    timer: timer
                })
            }
        }, 1000)
    }

    updateUsers = (gameState) => {
        this.newGameState(gameState)
        this.updateOtherPlayerCards()
        this.positionOtherPlayerCards()
    }

    updateHost = (data) => {
        this.host = data.host
        this.updatePlayerCards()
    }

    onNextCardClick = () => {
        this.props.socket.emit('pyramid.nextCard')
    }

    onUndoCardClick = () => {
        this.props.socket.emit('pyramid.undoCard')
    }

    onEndGameClick = () => {
        this.props.socket.emit('pyramid.end')
    }

    onPlayerCardClick = (index, isVisible) => {
        if (isVisible) {
            this.props.socket.emit('pyramid.hideCard', index)
            if (this.timeOuts.has(index)) {
                const timeout = this.timeOuts.get(index)
                window.clearTimeout(timeout)
                this.timeOuts.delete(index)
            }
        } else {
            this.props.socket.emit('pyramid.showCard', index)
            const timeout = window.setTimeout(() => { this.props.socket.emit('pyramid.hideCard', index) }, 5000)
            this.timeOuts.set(index, timeout)
        }
    }

    newGameState = (gameState) => {
        this.gameState = gameState
        this.gameState.hands = new Map(JSON.parse(this.gameState.hands))
        this.gameState.users = new Map(JSON.parse(this.gameState.users))
    }

    // ### PIXI.JS METHODS ###

    setup = () => {
        this.app.renderer.plugins.interaction.autoPreventDefault = false
        this.app.renderer.view.style['touch-action'] = 'auto'
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
            this.initPlayerCards()
            this.initOtherPlayerCards()
            this.setupSockets()
            window.addEventListener('resize', this.resize)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.resize)
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

    initPlayerCards = () => {
        this.playerCardsContainer = new Pixi.Container()
        this.playerCardsContainer.data = {
            cards: []
        }
        this.gameState.hands.get(this.props.session.userId).forEach((cardName, index) => {
            const sprite = new Sprite(resources[cardName].texture)
            sprite.interactive = true
            sprite.buttonMode = true
            sprite.data = {
                index: index,
                cardName: cardName
            }
            sprite.on('pointertap', () => this.onPlayerCardClick(sprite.data.index, sprite.data.cardName !== 'b'))
            this.playerCardsContainer.data.cards.push(sprite)
            this.playerCardsContainer.addChild(sprite)
        })
        const instructionText = new Pixi.Text('Click a card to show or hide it (visible to everyone)')
        instructionText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '14px',
            fill: '#eeeeee',
            fontWeight: 'normal'
        }
        instructionText.resolution = 2

        const nextButton = new Button('NEXT', this.props.session.game.secondaryColor)
        this.playerCardsContainer.data.nextButton = nextButton
        this.playerCardsContainer.addChild(nextButton)
        const undoButton = new Button('UNDO', this.props.session.game.primaryDark)
        this.playerCardsContainer.data.undoButton = undoButton
        this.playerCardsContainer.addChild(undoButton)
        nextButton.on('pointertap', this.onNextCardClick)
        undoButton.on('pointertap', this.onUndoCardClick)

        const endButton = new Button('END GAME', '#ff0000')
        this.playerCardsContainer.data.endButton = endButton
        this.playerCardsContainer.addChild(endButton)
        endButton.on('pointertap', this.onEndGameClick)

        const hostText = new Pixi.Text(`${this.gameState.users.get(this.host)} controls the pyramid`)
        hostText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '18px',
            fill: '#ffffff',
            fontWeight: 'normal'
        }
        hostText.resolution = 2
        this.playerCardsContainer.data.hostText = hostText
        this.playerCardsContainer.addChild(hostText)

        if (this.host === this.props.session.userId) {
            hostText.visible = false
            if (this.gameState.pyramid[this.gameState.pyramid.length - 1] !== 'b') {
                nextButton.visible = false
            } else {
                endButton.visible = false
            }
        } else {
            nextButton.visible = false
            undoButton.visible = false
            endButton.visible = false
        }

        this.playerCardsContainer.data.text = instructionText
        this.playerCardsContainer.addChild(instructionText)
        this.app.stage.addChild(this.playerCardsContainer)
        this.positionPlayerCards()
    }

    initOtherPlayerCards = () => {
        this.otherPlayersHands = []
        const handsSize = this.gameState.hands.get(this.props.session.userId).length
        for (var i = 0; i < this.props.session.game.maxPlayers - 1; i++) {
            const container = new Pixi.Container()
            container.data = {
                cards: []
            }
            for (var j = 0; j < handsSize; j++) {
                const sprite = new Sprite(resources['b'].texture)
                container.data.cards.push(sprite)
                container.addChild(sprite)
            }
            const playerName = new Pixi.Text('')
            playerName.style = {
                fontFamily: '\'Open Sans\', sans-serif',
                fontSize: '18px',
                fill: this.props.session.game.secondaryColor,
                fontWeight: 'normal'
            }
            playerName.resolution = 2
            container.data.text = playerName
            container.addChild(playerName)
            this.otherPlayersHands.push(container)
            this.app.stage.addChild(container)
        }
        this.updateOtherPlayerCards()
        this.positionOtherPlayerCards()
    }

    positionPyramid = () => {
        this.pyramidSprites.forEach((sprite) => {
            // Rotating
            sprite.rotation = Math.PI/2
            // Scaling
            const scale = (0.65 * Math.min(this.app.renderer.height, this.app.renderer.width)) / sprite.height / this.pyramidSize
            sprite.height = scale * sprite.height
            sprite.width = scale * sprite.width
            // Positioning
            const centerOffsetX = (this.app.renderer.width - this.pyramidSize * sprite.height) / 2 + sprite.height
            const centerOffsetY =  -20 + (this.app.renderer.height - this.pyramidSize * sprite.width) / 2
            const pyramidOffsetY = (this.pyramidSize - 1 - sprite.data.row) * (sprite.width) / 2
            sprite.x = sprite.data.row * sprite.height + centerOffsetX
            sprite.y = (this.pyramidSize - 1 - sprite.data.column) * sprite.width + centerOffsetY - pyramidOffsetY
        })
    }

    positionPlayerCards = () => {
        const nextButton = this.playerCardsContainer.data.nextButton
        const undoButton = this.playerCardsContainer.data.undoButton
        const endButton = this.playerCardsContainer.data.endButton
        const buttonHeight = nextButton.height
        var cardHeight = 0
        const gap = 10
        this.playerCardsContainer.data.cards.forEach((sprite, i) => {
            // Scaling
            const scale = (0.15 * this.app.renderer.height) / sprite.height
            sprite.height = scale * sprite.height
            sprite.width = scale * sprite.width
            cardHeight = sprite.height
            // Positioning
            sprite.x = i * sprite.width
            sprite.y = buttonHeight + gap
        })

        undoButton.x = this.playerCardsContainer.width / 2 - undoButton.width / 2 - nextButton.width / 2
        nextButton.x = this.playerCardsContainer.width / 2 - nextButton.width / 2 + undoButton.width / 2
        endButton.x = nextButton.x + nextButton.width

        const hostText = this.playerCardsContainer.data.hostText
        hostText.x = this.playerCardsContainer.width / 2 - hostText.width / 2

        const instructionText = this.playerCardsContainer.data.text
        instructionText.y = buttonHeight + cardHeight + 2 * gap
        instructionText.x = this.playerCardsContainer.width / 2 - instructionText.width / 2
        this.playerCardsContainer.x = this.app.renderer.width / 2 - this.playerCardsContainer.width / 2
        this.playerCardsContainer.y = this.app.renderer.height - this.playerCardsContainer.height - 20
    }

    positionOtherPlayerCards = () => {
        const n = this.gameState.hands.size - 1
        this.otherPlayersHands.forEach((container, i) => {
            // ITEMS
            var cardHeight = 0
            container.data.cards.forEach((sprite, j) => {
                // Scaling
                const scale = (0.1 * Math.min(this.app.renderer.height, this.app.renderer.width)) / sprite.height
                sprite.height = scale * sprite.height
                sprite.width = scale * sprite.width
                cardHeight = sprite.height
                // Positioning
                sprite.x = j * sprite.width
            })
            const playerName = container.data.text
            playerName.x = container.width / 2 - playerName.width / 2
            playerName.y = cardHeight + 10
            // CONTAINER
            if (i < 3) {
                const gap = 30
                const centerOffsetX = (this.app.renderer.width - Math.min(3, n) * (container.width) - (Math.min(3, n) - 1) * gap) / 2
                container.x = i * (container.width + gap) + centerOffsetX
                container.y = 10
            } else if (i === 4) {
                container.rotation = 3 * Math.PI / 2
                container.x = 10
                container.y = container.width / 2 + this.app.renderer.height / 2
            } else {
                container.rotation = Math.PI / 2
                container.x = this.app.renderer.width - 10
                container.y = this.app.renderer.height / 2 - container.width / 2
            }
        })

    }

    reposition = () => {
        this.positionPyramid()
        this.positionPlayerCards()
        this.positionOtherPlayerCards()
    }

    resize = () => {
        const parent = this.app.view.parentNode
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
        this.reposition()
    }

    updatePyramid = () => {
        this.gameState.pyramid.forEach((cardName, i) => {
            this.pyramidSprites[i].texture = resources[cardName].texture
        })
    }

    updatePlayerCards = () => {
        this.gameState.hands.get(this.props.session.userId).forEach((cardName, i) => {
            const sprite = this.playerCardsContainer.data.cards[i]
            sprite.texture = resources[cardName].texture
            sprite.data.cardName = cardName
        })

        const hostText = this.playerCardsContainer.data.hostText
        hostText.text = `${this.gameState.users.get(this.host)} controls the pyramid`
        const nextButton = this.playerCardsContainer.data.nextButton
        const undoButton = this.playerCardsContainer.data.undoButton
        const endButton = this.playerCardsContainer.data.endButton
        if (this.host === this.props.session.userId) {
            hostText.visible = false
            if (this.gameState.pyramid[this.gameState.pyramid.length - 1] !== 'b') {
                nextButton.visible = false
                undoButton.visible = true
                endButton.visible = true
            } else {
                nextButton.visible = true
                undoButton.visible = true
                endButton.visible = false
            }        
        } else {
            hostText.visible = true
            nextButton.visible = false
            undoButton.visible = false
            endButton.visible = false
        }
    }

    updateHostButtons = () => {
        const nextButton = this.playerCardsContainer.data.nextButton
        const undoButton = this.playerCardsContainer.data.undoButton
        const endButton = this.playerCardsContainer.data.endButton
        if (this.host === this.props.session.userId) {
            if (this.gameState.pyramid[this.gameState.pyramid.length - 1] !== 'b') {
                nextButton.visible = false
                undoButton.visible = true
                endButton.visible = true
            } else {
                endButton.visible = false
                nextButton.visible = true
                undoButton.visible = true
            }
        }
        
    }

    updateOtherPlayerCards = () => {
        var counter = 0
        this.gameState.hands.forEach((cards, userId) => {
            if (userId !== this.props.session.userId) {
                const container = this.otherPlayersHands[counter]
                container.visible = true
                cards.forEach((cardName, i) => {
                    container.data.cards[i].texture = resources[cardName].texture
                })
                container.data.text.text = this.gameState.users.get(userId)
                counter += 1
            }  
        })
        for (var i = counter; i < this.otherPlayersHands.length; i++) {
            this.otherPlayersHands[i].visible = false
        }
    }
}

export default PyramidGame