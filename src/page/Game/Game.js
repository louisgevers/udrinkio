import React, { Component } from "react"
import "./Game.css"
import Lobby from "../../component/Lobby/Lobby"
import Chat from "../../component/Chat/Chat"
import GameScreen from "../../component/GameScreen/GameScreen"
import GameSettingsPrompt from "../../component/GameSettingsPrompt/GameSettingsPrompt"
import GameOverPrompt from "../../component/GameOverPrompt/GameOverPrompt"
import InfoBox from "../../component/InfoBox/InfoBox"
import EntryInfoPrompt from "../../component/EntryInfoPrompt/EntryInfoPrompt"

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            play: false,
            settingsPrompt: false,
            gameState: null,
            gameOverPrompt: false,
            entryInfo: true
        }
    }

    render() {
        return (
            <div className="Game">
                {this.props.session.userId !== null && this.state.entryInfo && <EntryInfoPrompt game={this.props.session.game} onClose={this.onEntryInfoClose} />}
                {(this.state.settingsPrompt && <GameSettingsPrompt game={this.props.session.game} onOptionChosen={this.onOptionChosen} onClose={() => this.setState({settingsPrompt: false})} />)}
                {(this.state.gameOverPrompt && <GameOverPrompt game={this.props.session.game} onPlayAgain={this.playAgain} onHome={this.props.onHomeClick} />)}
                <div className='game-screens'>
                    {(this.state.play ? 
                    <GameScreen session={this.props.session} gameState={this.state.gameState} socket={this.props.socket} analytics={this.props.analytics} />
                    : 
                    <Lobby session={this.props.session} socket={this.props.socket} onStartClick={this.startGame} analytics={this.props.analytics} />
                    )}
                    <Chat game={this.props.session.game} username={this.props.session.username} socket={this.props.socket} analytics={this.props.analytics} />
                </div> 
                <InfoBox infoComponent={this.props.session.game.infoComponent} />
                <button className="home-button" onClick={this.props.onHomeClick}>{this.state.play ? 'Quit game' : 'Home'}</button>
            </div>
        )
    }

    componentDidMount() {
        this.socket = this.props.socket
        this.socket.on('game.started', (gameState) => {
            this.setState({
                play: true,
                gameState: gameState,
                gameOverPrompt: false
            })
        })
        this.socket.on('game.isOver', () => {
            this.setState({
                gameOverPrompt: true,
                play: false
            })
        })
    }

    componentWillUnmount() {
        this.socket.off('game.started')
        this.socket.off('game.isOver')
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

    onEntryInfoClose = () => {
        this.setState({
            entryInfo: false
        })
    }

    startGame = () => {
        this.setState({
            settingsPrompt: true
        })
    }

    playAgain = () => {
        this.setState({
            gameOverPrompt: false,
            gameState: null,
            play: false
        })
        this.socket.emit('game.playAgain')
    }
}

export default Game