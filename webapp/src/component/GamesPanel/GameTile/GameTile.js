import React, { Component } from "react"
import "./GameTile.css"

class GameTile extends Component {

    tileStyle = {backgroundColor: this.props.game.primaryColor}

    headerStyle = {color: this.props.game.secondaryColor}

    buttonStyle = {
        backgroundColor: this.props.game.secondaryColor,
        color: "white",
    }

    render() {
        return (
            <div className="GameTile" style={this.tileStyle}>
                <div className="game-title">
                    <h2 style={this.headerStyle}>{this.props.game.name}</h2>
                    <span>Players {this.props.game.minPlayers} - {this.props.game.maxPlayers}</span>
                </div>
                <img src={require(`../../../image/${this.props.game.imageName}`)} alt={`${this.props.game.name} icon`}/>
                <button className="create-party-button" type="submit" data-color={this.props.game.secondaryColor}>Create party</button>
            </div>
        )
    }

    componentDidMount() {
        const buttons = document.querySelectorAll(".GameTile .create-party-button")
        buttons.forEach(button => {
            button.style.backgroundColor = button.dataset.color
            button.style.color = "white"
            button.addEventListener('mousedown', e => {
                button.style.backgroundColor = "#222222"
                button.style.color = button.dataset.color
            })
            window.addEventListener('mouseup', e => {
                button.style.backgroundColor = button.dataset.color
                button.style.color = "white"
            })
            
        })
    }
}

export default GameTile