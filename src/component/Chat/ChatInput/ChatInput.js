import React, { Component } from "react"
import "./ChatInput.css"

class ChatInput extends Component {
    render() {
        return (
            <div className="ChatInput">
                <textarea className="chat-input" placeholder="Write a message..." maxLength="200" rows="1"/>
                <button className="chat-send-button">
                    <span class="material-icons">send</span>
                </button>
            </div>
        )
    }
}

export default ChatInput