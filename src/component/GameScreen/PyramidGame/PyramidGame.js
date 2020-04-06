import React, { Component } from 'react'
import './PyramidGame.css'

import ProgressBar from '../../ProgressBar/ProgressBar.js'

import cardFiles from '../../../data/cards.json'
import * as Pixi from 'pixi.js'
import Button from '../../../graphics/Button'

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
            this.initPlayerCards()
            this.initOtherPlayerCards()
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

    initPlayerCards = () => {
        this.playerCardsContainer = new Pixi.Container()
        this.playerCardsContainer.data = {
            cards: []
        }
        this.gameState.hands.get(this.props.session.userId).forEach((cardName) => {
            const sprite = new Sprite(resources[cardName].texture)
            // TODO onclick
            this.playerCardsContainer.data.cards.push(sprite)
            this.playerCardsContainer.addChild(sprite)
        })
        const instructionText = new Pixi.Text('Click a card to reveal it to everyone')
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

        const hostText = new Pixi.Text(`Host ${this.gameState.users.get(this.props.session.host)} controls the pyramid`)
        hostText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '18px',
            fill: '#ffffff',
            fontWeight: 'normal'
        }
        hostText.resolution = 2
        this.playerCardsContainer.data.hostText = hostText
        this.playerCardsContainer.addChild(hostText)

        if (this.props.session.host === this.props.session.userId) {
            hostText.visible = false
        } else {
            nextButton.visible = false
            undoButton.visible = false
        }

        this.playerCardsContainer.data.text = instructionText
        this.playerCardsContainer.addChild(instructionText)
        this.app.stage.addChild(this.playerCardsContainer)
        this.positionPlayerCards()
    }

    initOtherPlayerCards = () => {
        this.otherPlayersHands = []
        this.gameState.hands.forEach((cards, userId) => {
            if (userId !== this.props.session.userId) {
                const container = new Pixi.Container()
                container.data = {
                    cards: []
                }
                cards.forEach((cardName) => {
                    const sprite = new Sprite(resources[cardName].texture)
                    container.data.cards.push(sprite)
                    container.addChild(sprite)
                })
                const playerName = new Pixi.Text(this.gameState.users.get(userId))
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
        })
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

        const hostText = this.playerCardsContainer.data.hostText
        hostText.x = this.playerCardsContainer.width / 2 - hostText.width / 2

        const instructionText = this.playerCardsContainer.data.text
        instructionText.y = buttonHeight + cardHeight + 2 * gap
        instructionText.x = this.playerCardsContainer.width / 2 - instructionText.width / 2
        this.playerCardsContainer.x = this.app.renderer.width / 2 - this.playerCardsContainer.width / 2
        this.playerCardsContainer.y = this.app.renderer.height - this.playerCardsContainer.height - 20
    }

    positionOtherPlayerCards = () => {
        const n = this.otherPlayersHands.length
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
}

export default PyramidGame