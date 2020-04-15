import React, { Component } from "react"
import "./Cover.css"

import EntryPoint from "./EntryPoint/EntryPoint"
import InstagramPlug from "./InstagramPlug/InstagramPlug"

class Cover extends Component {
    render() {
        return (
            <div className="Cover">
                <EntryPoint onJoinParty={(code) => this.props.onJoinParty(code)} />
                <InstagramPlug />
            </div>
        )
    }
}

export default Cover