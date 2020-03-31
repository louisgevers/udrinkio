const deck = require('./deck.js')

module.exports = class MineField {

    constructor(gridSize, users) {
        this.n = gridSize > 7 ? 7 : gridSize
        this.deck = deck.createDeck()
        this.queue = new Queue()
        users.forEach((user, key) => {
            this.queue.enqueue({userId: key, username: user})
        })
        this.state = {
            table: this.generateTable(this.n),
            users: users,
            playingUser: this.queue.peek()
        }
        this.counter = this.n ** 2
    }

    generateTable = (n) => {
        const table = []
        for (var i = 0; i < n; i++) {
            const row = []
            for (var j = 0; j < n; j++) {
                row.push('b')
            }
            table.push(row)
        }
        return table
    }

    drawCard = (row, column) => {
        if (typeof row === 'number' && typeof column === 'number' && row < this.n && column < this.n) {
            if (this.state.table[row][column] === 'b') {
                const card = this.deck.pop()
                this.state.table[row][column] = card
                this.counter -= 1
                return true
            } else {
                return false
            }
        }
    }

    isOver = () => {
        return this.counter <= 0
    }

    isTurn = (user) => {
        return user.userId === this.queue.peek().userId
    }

    nextTurn = () => {
        this.queue.enqueue(this.queue.dequeue())
        this.state.playingUser = this.queue.peek()
    }

    connect = (user) => {
        this.queue.enqueue(user)
        this.state.users.set(user.userId, user.username)
    }

    disconnect = (userId) => {
        this.queue.remove((user) => {return user.userId === userId})
        this.state.users.delete(userId)
        this.state.playingUser = this.queue.peek()
    }

    generateState = () => {
        return {
            table: this.state.table,
            users: JSON.stringify(Array.from(this.state.users)),
            playingUser: this.state.playingUser
        }
    }

}

class Queue {
    
    constructor() {
        this.items = [];
    }

    enqueue = (item) => {
        this.items.push(item)
    }

    dequeue = () => {
        if (this.isEmpty()) {
            return '<queue.empty>'
        } else {
            return this.items.shift()
        }
    }

    peek = () => {
        if (this.isEmpty()) {
            return '<queue.empty>'
        } else {
            return this.items[0]
        }
    }

    remove = (filter) => {
        this.items = this.items.filter((user) => {return !filter(user)})
    }

    isEmpty = () => {
        return this.items.length === 0
    }

}