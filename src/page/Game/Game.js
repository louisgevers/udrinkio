import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"
import GameScreen from "../../component/GameScreen/GameScreen"
import GameSettingsPrompt from "../../component/GameSettingsPrompt/GameSettingsPrompt"

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            play: false,
            settingsPrompt: false,
            gameState: null
        }
        this.initializeSocket()
    }

    render() {
        return (
            <div className="Game">
                {(this.state.settingsPrompt && <GameSettingsPrompt game={this.props.game} onOptionChosen={this.onOptionChosen} />)}
                {(this.state.play ? 
                <GameScreen game={this.props.game} isHost={this.props.isHost} gameState={this.state.gameState} />
                : 
                <Lobby game={this.props.game} roomId={this.props.roomId} socket={this.props.socket} users={this.props.users} isHost={this.props.isHost} onHomeClick={this.props.onHomeClick} onStartClick={this.startGame} />
                )}
                <Chat game={this.props.game} socket={this.props.socket} />
            </div>
        )
    }

    initializeSocket = () => {
        this.socket = this.props.socket
        this.socket.on('game.started', (gameState) => {
            this.setState({
                play: true,
                gameState: gameState
            })
        })
    }

    onOptionChosen = (name, value) => {
        const data = {
            name: name,
            value: value
        }
        this.socket.emit('game.start', data)
        this.setState({
            settingsPrompt: false
        })
    }

    startGame = () => {
        this.setState({
            settingsPrompt: true
        })
    }
}

export default Game