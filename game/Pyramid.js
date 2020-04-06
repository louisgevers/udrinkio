const deck = require('./deck.js')

module.exports = class Pyramid {

    constructor(size, users) {
        this.deck = deck.createDeck()
        this.users = new Map()
        users.forEach((username, userId) => {
            this.users.set(userId, username)
        })
        this.pyramid = this.generatePyramid(size)
        this.visiblePyramid = this.pyramid.map((_) => { return 'b' })
        this.possibleHands = this.generatePossibleHands()
        this.hands = this.generateHands()
        this.visibleHands = this.generateVisibleHands()
        this.pyramidIndex = 0
    }

    // ### GLOBAL GAME METHODS ###

    connect = (user) => {
        if (this.possibleHands.length > 0) {
            const hand = this.possibleHands.pop()
            this.hands.set(user.userId, hand)
            this.visibleHands.set(user.userId, hand.map((_) => { return 'b' }))
            this.users.set(user.userId, user.username)
        }
    }

    disconnect = (userId) => {
        this.possibleHands.push(this.hands.get(userId))
        this.hands.delete(userId)
        this.visibleHands.delete(userId)
        this.users.delete(userId)
    }

    generateState = () => {
        return {
            pyramid: this.visiblePyramid,
            hands: JSON.stringify(Array.from(this.visibleHands)),
            users: JSON.stringify(Array.from(this.users))
        }
    }

    // ### GAME LOGIC METHODS ###

    nextPyramidCard = () => {
        if (this.pyramidIndex < this.pyramid.length) {
            this.visiblePyramid[this.pyramidIndex] = this.pyramid[this.pyramidIndex]
            this.pyramidIndex += 1
        }
    }

    undoPyramidCard = () => {
        if (this.pyramidIndex >= this.pyramid.length) {
            this.pyramidIndex = this.pyramid.length - 1
        }
        if (this.pyramidIndex > -1) {
            this.visiblePyramid[this.pyramidIndex] = 'b'
            this.pyramidIndex -= 1
        }
    }

    showCard = (userId, index) => {
        const hand = this.hands.get(userId)
        if (typeof hand !== 'undefined' && index > -1 && index < hand.length) {
            this.visibleHands.get(userId)[index] = hand[index]
        }
    }

    hideCard = (userId, index) => {
        const hand = this.hands.get(userId)
        if (typeof hand !== 'undefined' && index > -1 && index < hand.length) {
            this.visibleHands.get(userId)[index] = 'b'
        }
    }

    // ### GAME SETUP LOGIC ###

    generatePyramid = (size) => {
        const pyramid = []
        const n = size > 7 ? 7 : size < 3 ? 3 : size
        for (var i = n; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                pyramid.push(this.deck.pop())
            }
        }
        return pyramid
    }

    generatePossibleHands = () => {
        const hands = []
        for (var i = 0; i < 6; i++) {
            const hand = []
            for (var j = 0; j < 4; j++) {
                hand.push(this.deck.pop())
            }
            hands.push(hand)
        }
        return hands
    }

    generateHands = () => {
        const hands = new Map()
        this.users.forEach((username, userId) => {
            if (this.possibleHands.length > 0) {
                hands.set(userId, this.possibleHands.pop())
            }
        })
        return hands
    }

    generateVisibleHands = () => {
        const hands = new Map()
        this.hands.forEach((hand, userId) => {
            hands.set(userId, hand.map((_) => { return 'b' }))
        })
        return hands
    }

}