import React, { Component } from "react"
import "./ChatContent.css"

class ChatContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chatMessages: []
        }
    }

    render() {
        return (
            <div className="ChatContent">
                {this.state.chatMessages.map((chatMessage, index) => {
                    return <ChatMessage 
                        key={index}
                        messageType={chatMessage.userId === this.props.roomUserId ? 'own' : 'other'} 
                        username={chatMessage.userId === this.props.roomUserId ? 'You' : chatMessage.username} 
                        message={chatMessage.message} 
                    />
                })}
            </div>
        )
    }
}

class ChatMessage extends Component {
    render() {
        return (
            <div className={`ChatMessage ${this.props.messageType}`}>
                <span className='chat-username'>{this.props.username}</span>
                <span className='chat-message'>{this.props.message}</span>
            </div>
        )
    }
}

export default ChatContent