import React, { Component } from "react"
import "./Cover.css"

import EntryPoint from "./EntryPoint/EntryPoint"

class Cover extends Component {
    render() {
        return (
            <div className="Cover">
                <EntryPoint />
            </div>
        )
    }
}

export default Cover