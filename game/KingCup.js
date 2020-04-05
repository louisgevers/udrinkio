const deck = require('./deck.js')
const Queue = require('./Queue.js')

module.exports = class KingCup {

    constructor(users) {
        this.queue = new Queue()
        users.forEach((user, key) => {
            this.queue.enqueue({userId: key, username: user})
        })
        this.playingUser = this.queue.peek()
        this.deck = deck.createDeck()
        this.table = this.generateTable()
        this.bottleStack = []
        this.counter = 52
        this.lastCard = null
    }

    // ### GLOBAL GAME METHODS ###

    connect(user) {
        this.queue.enqueue(user)
    }

    disconnect(userId) {
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
        if (typeof index === 'number' && index < this.table.length) {
            if (this.table[index] === 'b') {
                const card = this.deck.pop()
                this.addCardOnBottleStack(card)
                this.table[index] = card
                this.lastCard = card
                this.counter -= 1
                return true
            } else {
                return false
            }
        }
    }

    addCardOnBottleStack(card) {
        this.bottleStack.push(card)
        const falls = Math.random() < this.bottleStack.length / this.table.length
        if (falls) {
            this.bottleStack = []
        }
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

    generateTable() {
        const table = []
        for (var i = 0; i < 52; i++) {
            table.push('b')
        }
        return table
    }

}