import React, { Component } from "react"
import "./ChatHeader.css"

class ChatHeader extends Component {
    render() {
        return (
            <div className="ChatHeader">
                <img src={require(`../../../image/${this.props.game.imageName}`)} alt="game icon"/>
            </div>
        )
    }
}

export default ChatHeader