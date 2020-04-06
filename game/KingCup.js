const deck = require('./deck.js')
const Queue = require('./Queue.js')

module.exports = class KingCup {

    constructor(cardFamiliesAmount, users) {
        this.queue = new Queue()
        users.forEach((user, key) => {
            this.queue.enqueue({userId: key, username: user})
        })
        this.playingUser = this.queue.peek()
        this.deck = deck.createDeck()
        this.table = this.generateTable(cardFamiliesAmount)
        this.bottleStack = []
        this.counter = this.table.length
        this.lastCard = null
        this.waitForStack = false
    }

    // ### GLOBAL GAME METHODS ###

    connect(user) {
        this.queue.enqueue(user)
    }

    disconnect(userId) {
        if (this.playingUser.userId === userId && this.waitForStack) {
            this.waitForStack = false
        }
        this.queue.remove((user) => { return user.userId === userId })
        this.playingUser = this.queue.peek()
    }

    generateState() {
        return {
            table: this.table,
            playingUser: this.playingUser,
            bottleStack: this.bottleStack,
            lastCard: this.lastCard
        }
    }

    // ### GAME LOGIC METHODS ###

    drawCard(index) {
        if (typeof index === 'number' && index < this.table.length && !this.waitForStack) {
            if (this.table[index] === 'b') {
                const card = this.deck.pop()
                this.table[index] = card
                this.lastCard = card
                this.counter -= 1
                this.waitForStack = true
                return true
            } else {
                return false
            }
        }
    }

    addCardOnBottleStack() {
        this.bottleStack.push(this.lastCard)
        const falls = Math.random() < this.bottleStack.length / this.table.length
        if (falls) {
            this.bottleStack = []
        }
        this.waitForStack = false
        return falls
    }

    nextTurn() {
        this.queue.enqueue(this.queue.dequeue())
        this.playingUser = this.queue.peek()
    }

    isTurn(user) {
        return user.userId === this.queue.peek().userId
    }

    isOver() {
        return this.counter <= 0
    }

    // ### GAME SETUP METHODS ###

    generateTable(cardFamiliesAmount) {
        const n = cardFamiliesAmount > 4 ? 4 : cardFamiliesAmount < 1 ? 1 : cardFamiliesAmount
        const table = []
        for (var i = 0; i < n * 13; i++) {
            table.push('b')
        }
        if (n === 1) {
            this.deck = this.deck.filter((cardName) => {
                return cardName.indexOf('h') > -1
            })
        } else if (n === 2) {
            this.deck = this.deck.filter((cardName) => {
                return (cardName.indexOf('h') > -1 || cardName.indexOf('s') > -1)
            })
        } else if (n === 3) {
            this.deck = this.deck.filter((cardName) => {
                return (cardName.indexOf('c') < 0)
            })
        }
        return table
    }

}