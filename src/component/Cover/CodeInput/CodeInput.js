import React, { Component } from "react"
import "./CodeInput.css"

class CodeInput extends Component {
    render() {
        return (
            <div className="CodeInput">
                <span className="create-room-input-wrapper">
                    <span className="domain">udrink.io/</span>
                    <input type="text" placeholder="room code" className="create-room-input" />
                </span>
            </div>
        )
    }
}

export default CodeInput