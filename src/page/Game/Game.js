import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby game={this.props.game} roomId={this.props.roomId} users={this.props.users} isHost={this.props.isHost} onHomeClick={this.props.onHomeClick} />
                <Chat />
            </div>
        )
    }
}

export default Game