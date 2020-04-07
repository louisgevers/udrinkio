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
        .add({name: 'token', url: require('../../../image/dealertoken.png')})
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
            this.initPlayerSprites()
            this.initOtherPlayerSprites()
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

    initPlayerSprites = () => {
        this.playerContainer = new Pixi.Container()
        const dealerName = new Pixi.Text(this.gameState.users.get(this.gameState.dealer))
        dealerName.resolution = 2
        dealerName.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '18px',
            fill: this.props.session.game.secondaryColor,
            fontWeight: 'bold'
        }
        const dealerText = new Pixi.Text(' is the dealer.')
        dealerText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '18px',
            fill: '#eeeeee'
        }
        dealerText.resolution = 2
        
        dealerText.x = dealerName.width

        this.playerContainer.data = {
            dealerName: dealerName
        }
        this.playerContainer.addChild(dealerName)
        this.playerContainer.addChild(dealerText)
        this.app.stage.addChild(this.playerContainer)
        this.positionPlayerSprites()
        this.updatePlayerSprites()
    }

    initOtherPlayerSprites = () => {
        this.otherPlayerContainers = []
        for (var i = 0; i < this.props.session.game.maxPlayers - 1; i++) {
            const container = new Pixi.Container()

            const userName = new Pixi.Text(i)
            userName.resolution = 2
            userName.style = {
                fontFamily: '\'Open Sans\', sans-serif',
                fontSize: '16px',
                fill: this.props.session.game.secondaryColor,
                fontWeight: 'bold'
            }

            const dealerToken = new Sprite(resources['token'].texture)
            dealerToken.width = 50
            dealerToken.y = userName.height + 5
            dealerToken.height = dealerToken.width

            const assignDealerButton = new Button('ASSIGN DEALER', '#ff0000')
            assignDealerButton.y = userName.height + 10

            const userOrder = new Pixi.Text(i)
            userOrder.resolution = 2
            userOrder.style = {
                fontFamily: '\'Open Sans\', sans-serif',
                fontSize: '12px',
                fill: '#eeeeee'
            }
            userOrder.y = userName.height + 10

            container.addChild(userName)
            container.addChild(userOrder)
            container.addChild(dealerToken)
            container.addChild(assignDealerButton)

            container.data = {
                userName: userName,
                userOrder: userOrder,
                dealerToken: dealerToken,
                assignDealerButton: assignDealerButton,
                height: container.height
            }

            this.otherPlayerContainers.push(container)
            this.app.stage.addChild(container)
        }
        this.updateOtherPlayerSprites()
        this.positionOtherPlayerSprites()
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

    positionPlayerSprites = () => {
        this.playerContainer.x = this.app.renderer.width / 2 - this.playerContainer.width / 2
        this.playerContainer.y = this.app.renderer.height - this.playerContainer.height - 40
    }

    positionOtherPlayerSprites = () => {
        this.otherPlayerContainers.forEach((container) => {
            const userName = container.data.userName
            const dealerToken = container.data.dealerToken
            const assignDealerButton = container.data.assignDealerButton
            const userOrder = container.data.userOrder
            userName.x = container.width / 2 - userName.width / 2
            dealerToken.x = container.width / 2 - dealerToken.width / 2
            assignDealerButton.x = container.width / 2 - assignDealerButton.width / 2
            userOrder.x = container.width / 2 - userOrder.width / 2
        })

        const n = this.otherPlayerContainers.length
        const offset = 20
        this.positionLeftToPlayer(this.otherPlayerContainers[0], offset)
        this.positionLeft(this.otherPlayerContainers, 1, 3, offset)
        this.positionTop(this.otherPlayerContainers, 3, n - 3, offset)
        this.positionRight(this.otherPlayerContainers, n - 3, n - 1, offset)
        this.positionRightToPlayer(this.otherPlayerContainers[n - 1], offset)
    }

    reposition = () => {
        this.positionTableSprites()
        this.positionDealerSprites()
        this.positionPlayerSprites()
        this.positionOtherPlayerSprites()
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

    updatePlayerSprites = () => {
        if (this.gameState.dealer === this.props.session.userId) {
            this.playerContainer.visible = false
        } else {
            this.playerContainer.data.dealerName.text = this.gameState.users.get(this.gameState.dealer)
            this.playerContainer.visible = true
        }
    }

    updateOtherPlayerSprites = () => {
        const playerIndex = this.gameState.order.indexOf(this.props.session.userId)
        var i = playerIndex + 1
        var counter = 0;
        for (i; i < this.gameState.order.length; i++) {
            const userId = this.gameState.order[i]
            const userName = this.gameState.users.get(userId)
            this.otherPlayerContainers[counter].data.userName.text = userName
            if (this.gameState.dealer === userId) {
                this.otherPlayerContainers[counter].data.dealerToken.visible = true
            } else {
                this.otherPlayerContainers[counter].data.dealerToken.visible = false
            }
            this.otherPlayerContainers[counter].data.userOrder.text = this.getOrderNumber(userId)
            counter += 1
        }
        for (i = 0; i < playerIndex; i++) {
            const userId = this.gameState.order[i]
            const userName = this.gameState.users.get(userId)
            this.otherPlayerContainers[counter].data.userName.text = userName
            if (this.gameState.dealer === userId) {
                this.otherPlayerContainers[counter].data.dealerToken.visible = true
            } else {
                this.otherPlayerContainers[counter].data.dealerToken.visible = false
            }
            this.otherPlayerContainers[counter].data.userOrder.text = this.getOrderNumber(userId)
            counter += 1
        }

        this.otherPlayerContainers.forEach((container, i) => {
            if (i < this.gameState.order.length - 1) {
                if (this.gameState.dealer === this.props.session.userId && this.gameState.currentCard === 'b') {
                    container.data.assignDealerButton.visible = true
                } else {
                    container.data.assignDealerButton.visible = false
                }
            } else {
                container.visible = false
            }
        })
    }

    // # HELPER METHODS #

    positionLeftToPlayer = (container, offset) => {
        container.x = this.app.renderer.width / 4 - container.width / 2
        container.y = this.app.renderer.height - container.data.height - offset
    }

    positionRightToPlayer = (container, offset) => {
        container.x = 3 * this.app.renderer.width / 4 - container.width / 2
        container.y = this.app.renderer.height - container.data.height - offset
    }

    positionLeft = (containers, startIndex, stopIndex, offset) => {
        const n = stopIndex - startIndex
        for (var i = startIndex; i < stopIndex; i++) {
            const container = containers[i]
            container.x = offset
            container.y = (stopIndex - i) * (this.app.renderer.height / (n + 1)) + container.width / 2
            container.rotation = - Math.PI / 2
        }
    }

    positionRight = (containers, startIndex, stopIndex, offset) => {
        const n = stopIndex - startIndex
        for (var i = startIndex; i < stopIndex; i++) {
            const container = containers[i]
            container.x = this.app.renderer.width - offset
            container.y =  (n - (stopIndex - i) + 1) * (this.app.renderer.height / (n + 1)) - container.width / 2
            container.rotation = Math.PI / 2
        }
    }

    positionTop = (containers, startIndex, stopIndex, offset) => {
        const n = stopIndex - startIndex
        for (var i = startIndex; i < stopIndex; i++) {
            const container = containers[i]
            container.y = offset
            container.x = (n - (stopIndex - i) + 1) * (this.app.renderer.width / (n + 1)) - container.width / 2
        }
    }

    getOrderNumber = (userId) => {
        const dealerIndex = this.gameState.order.indexOf(this.gameState.dealer)
        const userIndex = this.gameState.order.indexOf(userId)
        return userIndex > dealerIndex ? userIndex - dealerIndex : this.gameState.order.length - dealerIndex + userIndex
    }

}

export default FTheDealerGame