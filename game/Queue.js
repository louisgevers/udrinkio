module.exports = class Queue {
    
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
        this.items = this.items.filter((item) => {return !filter(item)})
    }

    isEmpty = () => {
        return this.items.length === 0
    }

}