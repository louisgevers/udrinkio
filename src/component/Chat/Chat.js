import React, { Component } from "react"
import "./Chat.css"

import ChatHeader from "./ChatHeader/ChatHeader"
import ChatContent from "./ChatContent/ChatContent"
import ChatInput from "./ChatInput/ChatInput"

class Chat extends Component {
    render() {
        return (
            <div className="Chat">
                <ChatHeader game={this.props.game} />
                <ChatContent socket={this.props.socket} />
                <ChatInput socket={this.props.socket} />
            </div>
        )
    }
}

export default Chat