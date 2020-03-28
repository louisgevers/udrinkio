import React, { Component } from "react"
import "./UsernamePrompt.css"
import UsernameInput from "./UsernameInput/UsernameInput"
import Prompt from "../Prompt/Prompt"

class UsernamePrompt extends Component {

    constructor(props) {
        super(props)
        this.username = ""
        this.setUsername = (name) => {
            this.username = name
        }
        this.textStyle = {color: this.props.game.secondaryColor}
        this.buttonStyle = {backgroundColor: this.props.game.secondaryColor}
    }

    render() {
        return (
            <div className="UsernamePrompt" onClick={this.handleClick}>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={this.props.game.name} onClose={this.props.onClose}>
                    <span>Username</span>
                    <UsernameInput inputStyle={this.textStyle} onNameChange={this.setUsername} />
                    <button className="prompt-create-button" id="username-prompt-create-button" style={this.buttonStyle} onClick={() => this.props.onStart(this.username)}>Start party</button>
                </Prompt>
            </div>
        )
    }
}

export default UsernamePrompt