import React, { Component } from "react"
import "./Chat.css"

import ChatHeader from "./ChatHeader/ChatHeader"
import ChatContent from "./ChatContent/ChatContent"
import ChatInput from "./ChatInput/ChatInput"

class Chat extends Component {
    render() {
        return (
            <div className="Chat">
                <ChatHeader />
                <ChatContent />
                <ChatInput />
            </div>
        )
    }
}

export default Chat