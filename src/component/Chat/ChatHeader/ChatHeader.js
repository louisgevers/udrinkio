import React, { Component } from "react"
import "./ChatHeader.css"

class ChatHeader extends Component {
    render() {
        return (
            <div className="ChatHeader">
                <div className='game-picture'>
                    <img src={require(`../../../image/${this.props.game.imageName}`)} alt="game icon"/>
                </div>
                <div className='username-container'>
                    <span className='username-title'>Username: </span>
                    <span className='username'>{typeof this.props.username !== 'undefined' && this.props.username}</span>
                </div>
            </div>
        )
    }
}

export default ChatHeader