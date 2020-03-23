import React, { Component } from "react"
import "./UsernamePrompt.css"
import UsernameInput from "./UsernameInput/UsernameInput"

class UsernamePrompt extends Component {

    constructor(props) {
        super(props)
        this.handleClick = (e) => {
            if (e.target.className == "UsernamePrompt") {
                this.props.onClose()
            }
        }
    }

    render() {
        return (
            <div className="UsernamePrompt" onClick={this.handleClick}>
                <div className="prompt-container">
                    <div className="prompt-header">
                        <button className="prompt-cancel-button" id="username-prompt-cancel-button" onClick={this.props.onClose}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <div className="prompt-body">
                        <span>Username</span>
                        <UsernameInput />
                        <button className="prompt-create-button" id="username-prompt-create-button">Start party</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UsernamePrompt