import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby game={this.props.game} roomId={this.props.roomId} socket={this.props.socket} users={this.props.users} isHost={this.props.isHost} onHomeClick={this.props.onHomeClick} />
                <Chat game={this.props.game} socket={this.props.socket} />
            </div>
        )
    }
}

export default Game