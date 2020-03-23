import React, { Component } from "react"
import "./Home.css"

import Cover from '../component/Cover/Cover.js'
import GamesPanel from '../component/GamesPanel/GamesPanel.js'
import UsernamePrompt from "../component/UsernamePrompt/UsernamePrompt"

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            prompt: false
        }

        this.onCreateParty = (game) => {
            this.setState({
                prompt: true
            })
        }

        this.onPromptClose = () => {
            this.setState({
                prompt: false
            })
        }
    }

    render() {
        return (
            <div className="Home">
                <Cover/>
                <GamesPanel onCreateParty={this.onCreateParty}/>
                {this.state.prompt && <UsernamePrompt onClose={this.onPromptClose}/>}
            </div>
        )
    }
}

export default Home