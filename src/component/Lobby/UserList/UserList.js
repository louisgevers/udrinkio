import React, { Component } from "react"
import "./UserList.css"

import crownIcon from "../../../image/crown.png"

class UserList extends Component {

    getHost = (users) => {
        console.log(users)
        return users.users[users.host]
    }

    getOtherUsers = (users) => {
        return users.users.filter((_, index) => {
            return index !== users.host
        })
    }

    render() {
        return (
            <div className="UserList">
                <HostUser username={this.getHost(this.props.users).username} />
                {this.getOtherUsers(this.props.users).map((user) => {
                    return <OtherUser key={user.userId} user={user} isHost={this.props.isHost} color={this.props.color} onRemoveUser={this.props.onRemoveUser}/>
                })}
                {this.props.isUserMissing && <MissingUser color={this.props.color} />}
            </div>
        )
    }
}

class HostUser extends Component {
    render() {
        return (
            <div className="HostUser">
                <img src={crownIcon} alt="crown icon" />
                <span className="item-username">{this.props.username}</span>
            </div>
        )
    }
}

class OtherUser extends Component {
    render() {
        return (
            <div className="OtherUser" style={{backgroundColor: this.props.color}}>
                {this.props.isHost && 
                    <button className="remove-user-button" onClick={() => this.props.onRemoveUser(this.props.user.userId)}>
                        <span className="material-icons">close</span>
                    </button>
                }
                <span className="item-username">{this.props.user.username}</span>
            </div>
        )
    }
}

class MissingUser extends Component {
    render() {
        return (
            <div className="MissingUser" style={{backgroundColor: this.props.color}}>
                <span className="waiting-players">Waiting for players...</span>
            </div>
        )
    }
}

export default UserList