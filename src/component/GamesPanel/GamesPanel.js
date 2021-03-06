import React, { Component } from "react"
import "./GamesPanel.css"

import GameTile from "./GameTile/GameTile"

import games from "../../data/games.json"

class GamesPanel extends Component {
    render() {
        return (
            <div className="GamesPanel">
                {games.filter((game) => {return !game.comingSoon}).map(game => {
                    return <GameTile key={game.name} game={game} onCreateParty={() => this.props.onCreateParty(game)} />
                })}
                {games.filter((game) => {return game.comingSoon}).map(game => {
                    return <GameTile key={game.name} game={game} onCreateParty={() => this.props.onCreateParty(game)} />
                })}
            </div>
        )
    }
}

export default GamesPanel