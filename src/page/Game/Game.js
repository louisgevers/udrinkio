import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"
import GameScreen from "../../component/GameScreen/GameScreen"

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            play: false
        }
        this.initializeSocket()
    }

    render() {
        return (
            <div className="Game">
                {(this.state.play ? 
                <GameScreen game={this.props.game} />
                : 
                <Lobby game={this.props.game} roomId={this.props.roomId} socket={this.props.socket} users={this.props.users} isHost={this.props.isHost} onHomeClick={this.props.onHomeClick} onStartClick={this.startGame} />
                )}
                <Chat game={this.props.game} socket={this.props.socket} />
            </div>
        )
    }

    initializeSocket = () => {
        this.socket = this.props.socket
        this.socket.on('game.started', () => {
            this.setState({
                play: true
            })
        })
    }

    startGame = () => {
        this.socket.emit('game.start')
    }
}

export default Game