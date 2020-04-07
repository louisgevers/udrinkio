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
            this.initDealerSprites()
            this.setupSockets()
            window.addEventListener('resize', this.reposition)
        })
    }

    cleanup = () => {
        window.removeEventListener('resize', this.reposition)
        loader.reset()
    }

    // ### RENDER METHODS ###

    // # INITIALIZATION #

    initTableSprites = () => {
        this.tableSprites = []
        this.cardContainers = []
        for (var column = 0; column < 13; column++) {
            const container = new Pixi.Container()
            this.cardContainers.push(container)
            const cardSprites = []
            for (var row = 0; row < 4; row++) {
                const sprite = new Sprite(resources['b'].texture)
                cardSprites.push(sprite)
                container.addChild(sprite)
            }
            this.tableSprites.push(cardSprites)
            this.app.stage.addChild(container)
        }
        this.positionTableSprites()
        this.updateTableSprites()
    }

    initDealerSprites = () => {
        this.dealerContainer = new Pixi.Container()

        const dealerText = new Pixi.Text('You are the dealer')
        dealerText.resolution = 2
        dealerText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '14px',
            fill: '#eeeeee'
        }

        const deckSprite = new Sprite(resources['b'].texture)
        const currentCardSprite = new Sprite(resources['b'].texture)
        
        const nextCardButton = new Button('NEXT CARD', this.props.session.game.secondaryColor)
        const showCardButton = new Button('SHOW CARD', this.props.session.game.secondaryColor)
        const undoCardButton = new Button('UNDO', this.props.session.game.primaryDark)

        this.dealerContainer.data = {
            dealerText: dealerText,
            deck: deckSprite,
            currentCard: currentCardSprite,
            nextCardButton: nextCardButton,
            showCardButton: showCardButton,
            undoCardButton: undoCardButton
        }

        this.dealerContainer.addChild(dealerText)
        this.dealerContainer.addChild(deckSprite)
        this.dealerContainer.addChild(currentCardSprite)
        this.dealerContainer.addChild(nextCardButton)
        this.dealerContainer.addChild(showCardButton)
        this.dealerContainer.addChild(undoCardButton)

        this.app.stage.addChild(this.dealerContainer)
        this.positionDealerSprites()
        this.updateDealerSprites()
    }
    
    // # POSITIONING #

    positionTableSprites = () => {
        const n = this.cardContainers.length
        this.tableSprites.forEach((column) => {
            column.forEach((sprite, j) => {
                // Scaling
                const scale = (0.7 * this.app.renderer.width) / sprite.width / n
                sprite.width = scale * sprite.width
                sprite.height = scale * sprite.height
                // Positioning
                sprite.y = j * (0.3 * sprite.height)
            })
        })
        const spritesHeight = this.tableSprites[0][0].height + (this.tableSprites[0].length - 1) * 0.3 * this.tableSprites[0][0].height
        this.cardContainers.forEach((container, i) => {
            const centerOffsetX = (this.app.renderer.width - n * container.width) / 2
            container.x = i * container.width + centerOffsetX
            container.y = this.app.renderer.height / 2 - spritesHeight / 2
        })
    }

    positionDealerSprites = () => {
        const dealerText = this.dealerContainer.data.dealerText
        // CARDS
        const deck = this.dealerContainer.data.deck
        const currentCard = this.dealerContainer.data.currentCard
        // Scaling
        const scale = (0.2 * this.app.renderer.height) / deck.height
        deck.height = scale * deck.height
        deck.width = scale * deck.width
        currentCard.height = deck.height
        currentCard.width = deck.width
        // Positioning
        currentCard.y = dealerText.height + 10
        deck.y = currentCard.x + 0.3 * currentCard.height

        // BUTTONS
        const nextCardButton = this.dealerContainer.data.nextCardButton
        const showCardButton = this.dealerContainer.data.showCardButton
        const undoCardButton = this.dealerContainer.data.undoCardButton
        // Positioning
        nextCardButton.x = deck.width
        nextCardButton.y = dealerText.height + 10
        undoCardButton.x = nextCardButton.x
        undoCardButton.y = nextCardButton.y + nextCardButton.height
        showCardButton.x = nextCardButton.x
        showCardButton.y = nextCardButton.y
        
        // CONTAINER
        this.dealerContainer.x = this.app.renderer.width / 2 - this.dealerContainer.width / 2
        this.dealerContainer.y = this.app.renderer.height - this.dealerContainer.height - 10
    }

    reposition = () => {
        this.positionTableSprites()
        this.positionDealerSprites()
    }

    // # UPDATING #

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

    updateDealerSprites = () => {
        if (this.gameState.dealer === this.props.session.userId) {
            this.dealerContainer.visible = true
            const nextButton = this.dealerContainer.data.nextCardButton
            const showButton = this.dealerContainer.data.showCardButton
            const undoButton = this.dealerContainer.data.undoCardButton
            const currentCard = this.dealerContainer.data.currentCard
            if (this.gameState.currentCard !== 'b') {
                nextButton.visible = false
                undoButton.visible = false
                showButton.visible = true
                currentCard.texture = resources[this.gameState.currentCard].texture
                currentCard.visible = true
            } else {
                nextButton.visible = true
                undoButton.visible = true
                showButton.visible = false
                currentCard.visible = false
            }
        } else {
            this.dealerContainer.visible = false
        }
    }

}

export default FTheDealerGame