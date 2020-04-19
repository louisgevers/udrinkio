import React, { Component } from 'react'
import './MineFieldGame.css'

import ProgressBar from '../../ProgressBar/ProgressBar'
import Button from '../../../graphics/Button'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'

import ReactGA from 'react-ga'

Pixi.utils.skipHello()

const Application = Pixi.Application,
    loader = Pixi.Loader.shared,
    Sprite = Pixi.Sprite;

class MineFieldGame extends Component {

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
        this.app = new Application({ autoResize: true, backgroundColor: this.getHexadecimalColor(this.props.session.game.primaryColor)})
        this.gameCanvas.appendChild(this.app.view)
        this.app.start()
        const parent = this.app.view.parentNode
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
        this.setup()
    }

    componentWillUnmount = () => {
        // socket.io
        this.props.socket.removeListener('minefield.drawnCard', this.onNewGameState)
        this.props.socket.removeListener('game.userDisconnected', this.onNewGameState)
        this.props.socket.removeListener('game.userJoined', this.onNewGameState)
        // pixi.js
        this.cleanUp()
        this.app.stop()
    }

    render() {
        return (
            <div className='MineFieldGame'>
                {this.state.progress < 100 && <ProgressBar progress={this.state.progress} color={this.props.session.game.secondaryColor} description={'loading assets...'} />}
                <div ref={(divCanvas) => {this.gameCanvas = divCanvas}} className='game-component' />
            </div>
        )
    }

    // ### GOOGLE ANALYTICS

    analyticsEvent = (action) => {
        if (this.props.analytics) {
            ReactGA.event({
                category: 'Game',
                action: action,
                label: 'Mine Field'
            })
        }
    }

    // ### LOGIC METHODS ###

    onNewGameState = (gameState) => {
        this.gameState = gameState
        this.gameState.users = new Map(JSON.parse(gameState.users))
        this.updatePlayerSprite()
        this.updateCardSprites()
        this.updateHighlightSprites()
        this.updateEndGameButton()
    }

    onEndGameClicked = () => {
        this.props.socket.emit('minefield.end')
        this.analyticsEvent('Requested end of Mine Field game')
    }

    onCardClicked = (i, j) => {
        if (this.isUsersTurn()) {
            this.props.socket.emit('minefield.drawCard', {row: i, column: j})
            this.analyticsEvent('Drew Mine Field card')
        } else {
            alert('Not your turn yet')
        }
    }

    gameIsFinished = () => {
        for (var i = 0; i < this.gameState.table.length; i++) {
            for (var j = 0; j < this.gameState.table[i].length; j++) {
                if (this.gameState.table[i][j] === 'b') {
                    return false
                }
            }
        }
        return true
    }

    isUsersTurn = () => {
        return this.gameState.playingUser.userId === this.props.session.userId
    }

    // ### SOCKET.IO METHODS ###

    setupSockets = () => {
        this.props.socket.on('minefield.drawnCard', this.onNewGameState)
        this.props.socket.on('game.userDisconnected', this.onNewGameState)
        this.props.socket.on('game.userJoined', this.onNewGameState)
    }

    // ### PIXI.JS METHODS ###

    setup = () => {
        this.app.renderer.plugins.interaction.autoPreventDefault = false
        this.app.renderer.view.style['touch-action'] = 'auto'
        // Add card sprites
        loader
        .add(cardFiles.map((fileName) => {
            return {name: fileName.substring(0, fileName.length - 4), url: require(`../../../image/cards/${fileName}`)}
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
            this.initPlayerSprite()
            this.initCardSprites()
            this.initHighlightSprites()
            this.initEndGameButton()
            this.setupSockets()
            window.addEventListener('resize', this.resize)
        })
    }

    cleanUp = () => {
        window.removeEventListener('resize', this.resizeCardSprites)
        loader.reset()
    }

    resize = () => {
        const parent = this.app.view.parentNode
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
        this.positionPlayerSprite()
        this.positionCardSprites()
        this.updateHighlightSprites()
        this.positionEndGameButton()
    }

    // ### RENDER METHODS ###

    // # INITIALIZATION #

    initPlayerSprite = () => {
        this.playerSprite = new Pixi.Container()

        const playerName = new Pixi.Text()
        const isPlaying = new Pixi.Text()

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

        this.playerSprite.addChild(playerName)
        this.playerSprite.addChild(isPlaying)

        this.app.stage.addChild(this.playerSprite)
        this.updatePlayerSprite()
    }

    initCardSprites = () => {
        this.cardSprites = new Pixi.Container()
        this.cardSprites.data = {
            table: []
        }
        this.gameState.table.forEach((row, i) => {
            const spriteRow = []
            row.forEach((_, j) => {
                const sprite = new Sprite(loader.resources['b'].text)
                sprite.on('pointertap', () => {
                    this.onCardClicked(i, j)
                })
                spriteRow.push(sprite)
                this.cardSprites.addChild(sprite)
            })
            this.cardSprites.data.table.push(spriteRow)
        })
        this.app.stage.addChild(this.cardSprites)
        this.updateCardSprites()
    }

    initHighlightSprites = () => {
        this.highlightSprites = new Pixi.Container()
        this.app.stage.addChild(this.highlightSprites)
        this.updateHighlightSprites()
    }

    initEndGameButton = () => {
        this.endGameButton = new Button('END GAME', '#ff0000')
        this.endGameButton.on('pointertap', this.onEndGameClicked)
        this.app.stage.addChild(this.endGameButton)
        this.updateEndGameButton()
    }

    // # UPDATING #

    updatePlayerSprite = () => {
        const playerName = this.playerSprite.children[0]
        const isPlaying = this.playerSprite.children[1]

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
        this.positionPlayerSprite()
    }

    updateCardSprites = () => {
        this.gameState.table.forEach((row, i) => {
            row.forEach((cardName, j) => {
                const sprite = this.cardSprites.data.table[i][j]
                sprite.texture = loader.resources[cardName].texture
                if (cardName === 'b') {
                    sprite.interactive = true
                    sprite.buttonMode = true
                } else {
                    sprite.interactive = false
                    sprite.buttonMode = false
                }
                // if (cardName !== 'b' && (i !== this.gameState.lastCard.row || j !== this.gameState.lastCard.column)) {
                //     sprite.tint = 0xAAAAAA
                // }
            })
        })
        this.positionCardSprites()
    }

    updateHighlightSprites = () => {
        this.highlightSprites.removeChildren()
        var lastHighlight = null
        this.cardSprites.data.table.forEach((row, i) => {
            row.forEach((card, j) => {
                if (i === this.gameState.lastCard.row && j === this.gameState.lastCard.column) {
                    const highlight = new Pixi.Graphics()
                    highlight.lineStyle(5, 0xFFFF00)
                    highlight.drawRect(card.x, card.y, card.width, card.height)
                    highlight.endFill()
                    lastHighlight = highlight
                } else if (this.isMultiplierCard(i, j)) {
                    const highlight = new Pixi.Graphics()
                    highlight.lineStyle(5, 0xFF0000)
                    highlight.drawRect(card.x, card.y, card.width, card.height)
                    highlight.endFill()
                    this.highlightSprites.addChild(highlight)
                }
            })
        })
        if (lastHighlight !== null) {
            this.highlightSprites.addChild(lastHighlight)
        }
        this.highlightSprites.x = this.cardSprites.x
        this.highlightSprites.y = this.cardSprites.y
    }

    updateEndGameButton = () => {
        if (this.gameIsFinished()) {
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

    // # POSITIONING #

    positionPlayerSprite = () => {
        // Children
        const playerName = this.playerSprite.children[0]
        const isPlaying = this.playerSprite.children[1]
        playerName.x = 0
        isPlaying.x = playerName.width
        isPlaying.y = playerName.height - isPlaying.height
        // Container
        this.playerSprite.x = this.app.renderer.width / 2 - this.playerSprite.width / 2
        this.playerSprite.y = 50
    }

    positionCardSprites = () => {
        // Children
        const n = this.cardSprites.data.table.length
        this.cardSprites.data.table.forEach((row, i) => {
            row.forEach((sprite, j) => {
                // Scaling
                const scale = 0.8 * Math.min((this.app.renderer.height - this.playerSprite.height - this.playerSprite.y) / sprite.height, this.app.renderer.width / sprite.width) / n
                sprite.height = scale * sprite.height
                sprite.width = scale * sprite.width
                // Positioning
                sprite.x = j * sprite.width
                sprite.y = i * sprite.height
            })
        })
        // Container
        this.cardSprites.x = this.app.renderer.width / 2 - this.cardSprites.width / 2
        this.cardSprites.y = this.app.renderer.height / 2 - this.cardSprites.height / 2 + this.playerSprite.y
    }

    positionEndGameButton = () => {
        this.endGameButton.x = this.app.renderer.width / 2 - this.endGameButton.width / 2
        this.endGameButton.y = this.playerSprite.y + this.playerSprite.height + 10
    }

    // ### HELPER METHODS ###

    getHexadecimalColor = (stringColor) => {
        return parseInt(stringColor.replace('#', '0x'))
    }

    isMultiplierCard = (i, j) => {
        if (this.gameState.lastCard.row < 0 || this.gameState.lastCard.column < 0) {
            return false
        }
        const card = this.gameState.table[i][j]
        const lastCard = this.gameState.table[this.gameState.lastCard.row][this.gameState.lastCard.column]
        return (i === this.gameState.lastCard.row || j === this.gameState.lastCard.column) && lastCard.substring(0, lastCard.length - 1) === card.substring(0, card.length - 1)
    }

}

export default MineFieldGame