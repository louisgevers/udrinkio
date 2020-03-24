import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"

const placeholderGame = {
    "id": "pyramid",
    "name": "PYRAMID",
    "minPlayers": 2,
    "maxPlayers": 8,
    "imageName": "pyramid.png",
    "primaryColor": "#6D534B",
    "secondaryColor": "#EEB711"
}

const placeholderRoomId = 593023

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby game={placeholderGame} roomId={placeholderRoomId} />
                <Chat />
            </div>
        )
    }
}

export default Game