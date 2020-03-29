import React, { Component } from "react"
import "./Lobby.css"
import UserList from "./UserList/UserList"

class Lobby extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: this.props.session.users,
            host: this.props.session.host
        }
    }

    isUserMissing = (game, users) => {
        return users.size < game.minPlayers
    }

    render() {
        return (
            <div className="Lobby" style={{backgroundColor: this.props.session.game.primaryColor}}>
                <button className="lobby-home-button" onClick={this.props.onHomeClick}>Home</button>
                <div className="header">
                    <h1 style={{color: this.props.session.game.secondaryColor}}>{this.props.session.game.name}</h1>
                    <span className="room-code-title">ROOM CODE</span>
                    <span className="room-code-holder">{this.props.session.roomId}</span>
                    <p className="code-description" style={{color: "#CCCCCC"}}>Share this code with your friends or share them the link <br/><b>http://www.udrink.io/{this.props.session.roomId}</b></p>
                </div>
                <div className="players">
                    <span className="players-title" style={{color: this.props.session.game.secondaryColor}}>Players</span>
                    <span className="players-amount">{`${this.props.session.game.minPlayers} - ${this.props.session.game.maxPlayers} players`}</span>
                    {(typeof this.state.users !== 'undefined' && <UserList users={this.state.users} host={this.state.host} isHost={this.props.session.userId === this.state.host} onRemoveUser={this.removeUser} isUserMissing={this.isUserMissing(this.props.session.game, this.state.users)} color={this.props.session.game.primaryDark} />)}
                </div>
                {typeof this.state.users !== 'undefined' && ((this.props.session.userId !== this.state.host) || this.isUserMissing(this.props.session.game, this.state.users)) ?
                <button disabled className="start-game-button inactive" style={{backgroundColor: this.props.session.game.primaryDark}}>Start game</button>
                : <button type="submit" className="start-game-button" style={{backgroundColor: this.props.session.game.secondaryColor}} onClick={this.props.onStartClick}>Start game</button>}
            </div>
        )
    }

    componentDidMount() {
        this.socket = this.props.socket
        this.socket.on('room.userJoined', (users) => {
            this.setState({users: new Map(JSON.parse(users))})
        })
        this.socket.on('room.userDisconnected', (users) => {
            this.setState({users: new Map(JSON.parse(users))})
        })
    }

    componentWillUnmount() {
        this.socket.off('room.userJoined')
        this.socket.off('room.userDisconnected')
    }

    removeUser = (userId) => {
        this.socket.emit('room.removeUser', {userId: userId})
    }
}

export default Lobby