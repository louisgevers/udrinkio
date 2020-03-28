const deck = require('./deck.js')

module.exports = class MineField {

    constructor(n, users) {
        this.turn = 0
        this.state = {
            table: this.generateTable(n),
            users: users,
            playingUser: users[this.turn]
        }
        this.deck = deck.createDeck()
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
        const card = this.deck.pop()
        this.state.table[row][column] = card
    }

    isTurn = (user) => {
        return user.userId === this.state.playingUser.userId
    }

    nextTurn = () => {
        this.turn = (this.turn + 1) % this.state.users.length
        this.state.playingUser = this.state.users[this.turn]
    }

    disconnect = (user) => {
        const index = this.state.users.indexOf(user)
        if (index > -1) {
            this.state.users.splice(index, 1);
        }
        this.turn %= this.state.users.length
        this.state.playingUser = this.state.users[this.turn]
    }

}