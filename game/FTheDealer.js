const deck = require('./deck.js')
const Queue = require('./Queue.js')

const tableMap = new Map()

for (var i = 1; i <= 10; i++) {
    tableMap.set(i.toString(), i - 1)
}
tableMap.set('j', 10)
tableMap.set('q', 11)
tableMap.set('k', 12)

module.exports = class FTheDealer {

    constructor(cardFamiliesAmount, users) {
        this.cardsAmount = cardFamiliesAmount > 4 ? 4 : cardFamiliesAmount < 1 ? 1 : cardFamiliesAmount
        this.deck = deck.createDeck()
        this.filterDeck(this.cardsAmount)
        this.queue = new Queue()
        users.forEach((_, userId) => {
            this.queue.enqueue(userId)
        })
        // TODO CHECK IF REF WORKS
        this.users = users
        this.table = this.generateTable()
        this.dealer = this.queue.peek()
        this.currentCard = 'b'
        this.lastCardIndex = -1
    }

    // ### GLOBAL GAME METHODS ###

    connect = (user) => {
        this.queue.enqueue(user.userId)
    }

    disconnect = (userId) => {
        this.queue.remove((id) => { return id === userId })
        if (this.dealer === userId) {
            this.dealer = this.queue.peek()
        }
    }

    generateState = () => {
        return {
            table: this.table,
            cardsAmount: this.cardsAmount,
            dealer: this.dealer,
            currentCard: this.currentCard,
            users: JSON.stringify(Array.from(this.users)),
            order: this.queue.items
        }
    }

    // ### GAME LOGIC METHODS ###

    nextCard = (userId) => {
        if (userId === this.dealer && this.currentCard === 'b' && this.deck.length > 0) {
            this.currentCard = this.deck.pop()
        }
    }

    showCard = (userId) => {
        if (userId === this.dealer && this.currentCard !== 'b') {
            this.lastCardIndex = tableMap.get(this.currentCard.charAt(0))
            this.table[this.lastCardIndex].push(this.currentCard)
            this.currentCard = 'b'
        }
    }

    undoShowCard = (userId) => {
        if (userId === this.dealer && this.lastCardIndex > -1) {
            this.currentCard = this.table[this.lastCardIndex].pop()
            this.lastCardIndex = -1
        }
    }

    assignDealer = (userId, newDealerId) => {
        if (userId === this.dealer && this.users.has(newDealerId)) {
            this.dealer = newDealerId
        }
    }

    // ### GAME SETUP METHODS ###

    filterDeck = (n) => {
        if (n === 1) {
            this.deck = this.deck.filter((cardName) => {
                return cardName.indexOf('h') > -1
            })
        } else if (n === 2) {
            this.deck = this.deck.filter((cardName) => {
                return cardName.indexOf('h') > -1 || cardName.indexOf('s') > -1
            })
        } else if (n === 3) {
            this.deck =this.deck.filter((cardName) => {
                return cardName.indexOf('c') < 0
            })
        }
    }

    generateTable = () => {
        const table = []
        for (var i = 0; i < 13; i++) {
            table.push([])
        }
        return table
    }

}