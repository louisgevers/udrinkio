import React, { Component } from "react"
import "./UsernameInput.css"

class UsernameInput extends Component {
    constructor(props) {
        super(props)
        this.randomName = () => {
            const firstName = names1[Math.floor(Math.random() * names1.length)]
            const secondName = names2[Math.floor(Math.random() * names2.length)]
            return firstName + secondName
        }
        this.setRandomName = () => {
            const input = document.getElementById("username-prompt-input")
            input.value = ""
            document.getElementById("username-prompt-input").placeholder = this.randomName()
        }
    }
    
    render() {
        return (
            <div className="UsernameInput">
                <input type="text" placeholder={this.randomName()} className="username-input" id="username-prompt-input" style={this.props.inputStyle} autoComplete="off" autoCorrect="off" spellCheck="false" />
                <button className="random-button" onClick={this.setRandomName}>
                    <span className="material-icons">sync</span>
                </button>
            </div>
        )
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