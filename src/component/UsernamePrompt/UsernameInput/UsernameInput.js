import React, { Component } from "react"
import "./UsernameInput.css"

class UsernameInput extends Component {
    constructor(props) {
        super(props)
        this.randomName = () => {
            const firstName = names1[Math.floor(Math.random() * names1.length)]
            const secondName = names2[Math.floor(Math.random() * names2.length)]
            return `${firstName} ${secondName}`
        }
        this.setRandomName = () => {
            this.input.value = ""
            const name = this.randomName()
            document.getElementById("username-prompt-input").placeholder = name
            this.props.onNameChange(name)
        }
        this.updateName = () => {
            if (this.input.value.length === 0) {
                this.props.onNameChange(this.input.placeholder)
            } else {
                this.props.onNameChange(this.input.value)
            }
        }
    }
    
    render() {
        return (
            <div className="UsernameInput">
                <input ref={(input) => this.input = input} type="text" maxLength='20' onInput={this.updateName} className="username-input" id="username-prompt-input" style={this.props.textStyle} autoComplete="off" autoCorrect="off" spellCheck="false" />
                <button className="random-button" onClick={this.setRandomName}>
                    <span className="material-icons">sync</span>
                </button>
            </div>
        )
    }

    componentDidMount() {
        this.setRandomName()
        this.input.focus()
    }
}

const names1 = [
    "Heavy",
    "Extreme",
    "Cool",
    "Lazy",
    "Lame",
    "Nerdy",
    "Wine",
    "Beer",
    "Cursed",
    "Annoying",
    "Problematic",
    "Party",
    "Hopeless",
    "Incredible",
    "Thirsty"
]

const names2 = [
    "Drinker",
    "Sipper",
    "Expert",
    "Alcoholic",
    "Taster",
    "Fanatic",
    "Screamer",
    "Pooper",
    "Flirt",
    "Stalker",
    "Addict",
    "Dancer",
    "Prophet",
    "Failure"
]

export default UsernameInput