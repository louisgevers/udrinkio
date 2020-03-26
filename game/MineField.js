const deck = require('./deck.js')

module.exports = class MineField {

    constructor(n) {
        this.state = {
            table: this.generateTable(n)
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

}