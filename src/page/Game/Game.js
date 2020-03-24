import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby />
                <Chat />
            </div>
        )
    }
}

export default Game