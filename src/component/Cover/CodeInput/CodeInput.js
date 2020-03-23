import React, { Component } from "react"
import "./CodeInput.css"

class CodeInput extends Component {
    
    constructor(props) {
        super(props)
        this.setRoomCode = () => {
            this.props.getRoomCode(this.input.value)
        }
    }

    render() {
        return (
            <div className="CodeInput">
                <span className="create-room-input-wrapper">
                    <span className="domain">udrink.io/</span>
                    <input ref={(input) => this.input = input} type="text" placeholder="room code" className="create-room-input" onInput={this.setRoomCode} />
                </span>
            </div>
        )
    }
}

export default CodeInput