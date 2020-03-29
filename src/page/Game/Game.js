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
    }

    render() {
        return (
            <div className="Game">
                {(this.state.settingsPrompt && <GameSettingsPrompt game={this.props.session.game} onOptionChosen={this.onOptionChosen} onClose={() => this.setState({settingsPrompt: false})} />)}
                {(this.state.play ? 
                <GameScreen session={this.props.session} gameState={this.state.gameState} socket={this.props.socket} />
                : 
                <Lobby session={this.props.session} socket={this.props.socket} onHomeClick={this.props.onHomeClick} onStartClick={this.startGame} />
                )}
                <Chat game={this.props.session.game} socket={this.props.socket} />
            </div>
        )
    }

    componentDidMount() {
        this.socket = this.props.socket
        this.socket.on('game.started', (gameState) => {
            gameState.users = new Map(JSON.parse(gameState.users))
            this.setState({
                play: true,
                gameState: gameState
            })
        })
    }

    componentWillUnmount() {
        this.socket.off('game.started')
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