import React, { Component } from "react"
import "./ChatInput.css"

import ReactGA from 'react-ga'

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
                    <span className="material-icons">send</span>
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
        // only if message is not empty or not full of spaces
        if (message.length > 0 && message.replace(/\s/g, '').length > 0) {
            input.value = ''
            this.socket.emit('chat.sendMessage', {message: message})
            if (this.props.analytics) {
                ReactGA.event({
                    category: 'Chat',
                    action: 'Sent a message'
                })
            }
        }
    }
}

export default ChatInput