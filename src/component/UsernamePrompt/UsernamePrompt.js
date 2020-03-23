import React, { Component } from "react"
import "./UsernamePrompt.css"
import UsernameInput from "./UsernameInput/UsernameInput"

class UsernamePrompt extends Component {

    constructor(props) {
        super(props)
        this.handleClick = (e) => {
            if (e.target.className === "UsernamePrompt") {
                this.props.onClose()
            }
        }
        this.username = ""
        this.setUsername = (name) => {
            this.username = name
        }
        this.backgroundStyle = {backgroundColor: this.props.game.primaryColor}
        this.textStyle = {color: this.props.game.secondaryColor}
        this.buttonStyle = {backgroundColor: this.props.game.secondaryColor}
    }

    render() {
        return (
            <div className="UsernamePrompt" onClick={this.handleClick}>
                <div className="prompt-container">
                    <div style={this.backgroundStyle} className="prompt-header">
                        <button className="prompt-cancel-button" id="username-prompt-cancel-button" onClick={this.props.onClose}>
                            <span className="material-icons">close</span>
                        </button>
                        <h2 style={this.textStyle}>{this.props.game.name}</h2>
                    </div>
                    <div className="prompt-body">
                        <span>Username</span>
                        <UsernameInput inputStyle={this.textStyle} onNameChange={this.setUsername} />
                        <button className="prompt-create-button" id="username-prompt-create-button" style={this.buttonStyle} onClick={() => this.props.onStart(this.props.game, this.username)}>Start party</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UsernamePrompt