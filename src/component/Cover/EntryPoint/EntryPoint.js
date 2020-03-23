import React, { Component } from "react"
import "./EntryPoint.css"

import Logo from "../Logo/Logo.js"
import CodeInput from "../CodeInput/CodeInput.js"

class EntryPoint extends Component {
    
    constructor(props) {
        super(props)
        this.roomCode = ''
        this.getRoomCode = (code) => {
            this.roomCode = code
        }
    }

    render() {
        return (
            <div className="EntryPoint">
                <Logo />
                <p>Play and drink with your far away friends</p>
                <div className="join-room-fields">
                    <CodeInput getRoomCode={this.getRoomCode} />
                    <button className="join-room-button" type="submit" onClick={() => this.props.onJoinParty(this.roomCode)}>Join party</button>
                </div>
                <span className="or-join-create">or</span>
            </div>
        )
    }
}

export default EntryPoint