import React, { Component } from "react"
import "./Home.css"

import Cover from '../../component/Cover/Cover.js'
import GamesPanel from '../../component/GamesPanel/GamesPanel.js'
import UsernamePrompt from "../../component/UsernamePrompt/UsernamePrompt"

class Home extends Component {
    render() {
        return (
            <div className="Home">
                <Cover onJoinParty={(code) => this.props.onJoinParty(code)}/>
                <GamesPanel onCreateParty={this.props.onCreateParty}/>
            </div>
        )
    }
}

export default Home