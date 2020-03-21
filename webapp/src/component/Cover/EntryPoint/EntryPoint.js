import React, { Component } from "react"
import "./EntryPoint.css"

import Logo from "../Logo/Logo.js"
import CodeInput from "../CodeInput/CodeInput.js"

class EntryPoint extends Component {
    render() {
        return (
            <div className="EntryPoint">
                <Logo />
                <p>Play and drink with your far away friends</p>
                <div className="join-room-fields">
                    <CodeInput />
                    <button className="join-room-button" type="submit">Join party</button>
                </div>
                <span className="or-join-create">or</span>
            </div>
        )
    }
}

export default EntryPoint