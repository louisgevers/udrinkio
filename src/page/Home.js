import React, { Component } from "react"
import "./Home.css"

import Cover from '../component/Cover/Cover.js'
import GamesPanel from '../component/GamesPanel/GamesPanel.js'

class Home extends Component {
    render() {
        return (
            <div className="Home">
                <Cover/>
                <GamesPanel />
            </div>
        )
    }
}

export default Home