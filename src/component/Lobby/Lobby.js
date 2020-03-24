import React, { Component } from "react"
import "./Lobby.css"

class Lobby extends Component {
    render() {
        return (
            <div className="Lobby" style={{backgroundColor: this.props.game.primaryColor}}>
                <div className="header">
                    <h1 style={{color: this.props.game.secondaryColor}}>{this.props.game.name}</h1>
                    <span className="room-code-title">ROOM CODE</span>
                    <span className="room-code-holder">{this.props.roomId}</span>
                    <button className="copy-code-button" style={{backgroundColor: this.props.game.secondaryColor}}>copy code</button>
                </div>
                <div className="players">
                    <span className="players-title" style={{color: this.props.game.secondaryColor}}>Players</span>
                    <span className="players-amount">{`${this.props.game.minPlayers} - ${this.props.game.maxPlayers} players`}</span>
                    {/* TODO userlist */}
                </div>
                <button type="submit" className="start-game-button" style={{backgroundColor: this.props.game.secondaryColor}}>Start game</button>
            </div>
        )
    }
}

export default Lobby