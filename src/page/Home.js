import React, { Component } from "react"
import "./Home.css"

import Cover from '../component/Cover/Cover.js'
import GamesPanel from '../component/GamesPanel/GamesPanel.js'
import UsernamePrompt from "../component/UsernamePrompt/UsernamePrompt"

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            prompt: false,
            game: null
        }

        this.onCreateParty = (game) => {
            this.setState({
                prompt: true,
                game: game
            })
        }

        this.onPromptClose = () => {
            this.setState({
                prompt: false,
                game: this.state.game
            })
        }
    }

    render() {
        return (
            <div className="Home">
                <Cover/>
                <GamesPanel onCreateParty={this.onCreateParty}/>
                {this.state.prompt && <UsernamePrompt game={this.state.game} onClose={this.onPromptClose} onStart={this.props.onPartyCreated}/>}
            </div>
        )
    }
}

export default Home