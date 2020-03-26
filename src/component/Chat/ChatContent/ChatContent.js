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
                <div className="chat-wrapper">
                    {this.state.chatMessages.map((chatMessage, index) => {
                        if (chatMessage.type === "chat") {
                            return <ChatMessage 
                                key={index}
                                messageType={chatMessage.isSender ? 'own' : 'other'} 
                                username={chatMessage.isSender ? 'You' : chatMessage.username} 
                                message={chatMessage.message} 
                            />
                        } else if (chatMessage.type === "info") {
                            return <span className="InfoMessage">{chatMessage.message}</span>
                        } else {
                            return <span>{chatMessage}</span>
                        }
                        
                    })}
                </div>
            </div>
        )
    }

    componentWillUnmount = () => {
        this.socket.removeListener('chat.receivedMessage', this.receivedMessageFn)
        this.socket.removeListener('chat.userJoined', this.userJoinedFn)
        this.socket.removeListener('chat.userDisconnected', this.userDisconnectedFn)
        this.socket.removeListener('chat.userRemoved', this.userRemovedFn)
    }

    componentWillMount = () => {
        this.socket = this.props.socket
        this.socket.on('chat.receivedMessage', this.receivedMessageFn)
        this.socket.on('chat.userJoined', this.userJoinedFn)
        this.socket.on('chat.userDisconnected', this.userDisconnectedFn)
        this.socket.on('chat.userRemoved', this.userRemovedFn)
    }

    receivedMessageFn = (chatMessage) => {
        chatMessage.type = "chat"
        this.addMessage(chatMessage)
    }

    userJoinedFn = (username) => {
        const chatMessage = {
            type: "info",
            message: `${username} joined the room`
        }
        this.addMessage(chatMessage)
    }

    userDisconnectedFn = (username) => {
        const chatMessage = {
            type: "info",
            message: `${username} disconnected`
        }
        this.addMessage(chatMessage)
    }

    userRemovedFn = (data) => {
        const chatMessage = {
            type: "info",
            message: `${data.host} removed ${data.username}`
        }
        this.addMessage(chatMessage)
    }

    addMessage = (chatMessage) => {
        this.state.chatMessages.push(chatMessage)
        this.setState({
            chatMessages: this.state.chatMessages
        })
        var element = document.querySelector(".ChatContent .chat-wrapper");
        element.scrollTop = element.scrollHeight;
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