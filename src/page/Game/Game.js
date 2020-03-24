import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"

const placeholderUsers = {
    host: 1,
    users: ["Arthur", "Louis", "Panda", "Kakker", "Olivier"]
}

const placeHolderIsHost = true

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby game={this.props.game} roomId={this.props.roomId} users={placeholderUsers} isHost={placeHolderIsHost} />
                <Chat />
            </div>
        )
    }
}

export default Game