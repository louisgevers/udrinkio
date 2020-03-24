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
    "primaryDark": "#5C4944",
    "secondaryColor": "#EEB711"
}

const placeholderUsers = {
    host: 1,
    users: ["Arthur", "Louis", "Panda", "Kakker", "Olivier"]
}

const placeHolderIsHost = true

const placeholderRoomId = 593023

class Game extends Component {
    render() {
        return (
            <div className="Game">
                <Lobby game={placeholderGame} roomId={placeholderRoomId} users={placeholderUsers} isHost={placeHolderIsHost} />
                <Chat />
            </div>
        )
    }
}

export default Game