import React, { Component } from "react"
import "./ChatInput.css"

class ChatInput extends Component {

    constructor(props) {
        super(props)
        this.socket = this.props.socket
    }

    render() {
        return (
            <div className="ChatInput">
                <input className="chat-input" placeholder="Write a message..." maxLength="200" onKeyDown={this.onInputKeyDown}/>
                <button className="chat-send-button" onClick={this.sendMessage}>
                    <span class="material-icons">send</span>
                </button>
            </div>
        )
    }

    onInputKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.sendMessage()
            return false
        } else {
            return true
        }
    }

    sendMessage = () => {
        const input = document.querySelector('.ChatInput .chat-input')
        const message = input.value
        input.value = ''
        this.socket.emit('chat.sendMessage', message)
    }
}

export default ChatInput