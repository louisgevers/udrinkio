import React, { Component } from "react"
import "./Lobby.css"
import UserList from "./UserList/UserList"

class Lobby extends Component {

    isUserMissing = (game, users) => {
        return users.users.length < game.minPlayers
    }

    render() {
        return (
            <div className="Lobby" style={{backgroundColor: this.props.game.primaryColor}}>
                <div className="header">
                    <h1 style={{color: this.props.game.secondaryColor}}>{this.props.game.name}</h1>
                    <span className="room-code-title">ROOM CODE</span>
                    <span className="room-code-holder">{this.props.roomId}</span>
                    <p className="code-description" style={{color: "#CCCCCC"}}>Share this code with your friends or share them the link <br/><b>http://www.udrink.io/{this.props.roomId}</b></p>
                    {/* <button className="copy-code-button" onClick={this.copyRoomCode} style={{backgroundColor: this.props.game.secondaryColor}}>copy code</button> */}
                </div>
                <div className="players">
                    <span className="players-title" style={{color: this.props.game.secondaryColor}}>Players</span>
                    <span className="players-amount">{`${this.props.game.minPlayers} - ${this.props.game.maxPlayers} players`}</span>
                    <UserList users={this.props.users} isHost={this.props.isHost} isUserMissing={this.isUserMissing(this.props.game, this.props.users)} color={this.props.game.primaryDark} />
                </div>
                {!this.props.isHost || this.isUserMissing(this.props.game, this.props.users) ?
                <button disabled className="start-game-button inactive" style={{backgroundColor: this.props.game.primaryDark}}>Start game</button>
                : <button type="submit" className="start-game-button" style={{backgroundColor: this.props.game.secondaryColor}}>Start game</button>}
            </div>
        )
    }
}

export default Lobby