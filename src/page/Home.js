import React, { Component } from "react"
import "./Home.css"

import Cover from '../component/Cover/Cover.js'
import GamesPanel from '../component/GamesPanel/GamesPanel.js'
import UsernamePrompt from "../component/UsernamePrompt/UsernamePrompt"

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            createPrompt: false,
            joinPrompt: false,
            game: null
        }

        this.onCreateParty = (game) => {
            this.setState({
                createPrompt: true,
                game: game
            })
        }

        this.onJoinParty = (game) => {
            this.setState({
                joinPrompt: true,
                game: game
            })
        }

        this.onPromptClose = () => {
            this.setState({
                createPrompt: false,
                joinPrompt: false,
                game: null
            })
        }
    }

    render() {
        return (
            <div className="Home">
                <Cover onJoinParty={(code) => this.props.onJoinParty(code)}/>
                <GamesPanel onCreateParty={this.onCreateParty}/>
                {this.state.createPrompt && <UsernamePrompt game={this.state.game} onClose={this.onPromptClose} onStart={(username) => this.props.onPartyCreated(this.state.game, username)}/>}
                {this.state.joinPrompt && <UsernamePrompt game={this.state.game} onClose={this.onPromptClose} onStart={this.props.onPartyJoined}/>}
            </div>
        )
    }
}

export default Home