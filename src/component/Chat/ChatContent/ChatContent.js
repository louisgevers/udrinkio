import React, { Component } from "react"
import "./ChatContent.css"

class ChatContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chatMessages: []
        }
        this.initializeSocket()
    }

    render() {
        return (
            <div className="ChatContent">
                <div className="chat-wrapper">
                    {this.state.chatMessages.map((chatMessage, index) => {
                        return <ChatMessage 
                            key={index}
                            messageType={chatMessage.isSender ? 'own' : 'other'} 
                            username={chatMessage.isSender ? 'You' : chatMessage.username} 
                            message={chatMessage.message} 
                        />
                    })}
                </div>
            </div>
        )
    }

    initializeSocket = () => {
        this.socket = this.props.socket
        this.socket.on('chat.receivedMessage', (chatMessage) => {
            this.state.chatMessages.push(chatMessage)
            this.setState({
                chatMessages: this.state.chatMessages
            })
            var element = document.querySelector(".ChatContent .chat-wrapper");
            element.scrollTop = element.scrollHeight;
        })
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