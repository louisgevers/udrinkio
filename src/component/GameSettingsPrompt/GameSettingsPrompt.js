import React, { Component } from 'react'
import './GameSettingsPrompt.css'

class GameSettingsPrompt extends Component {

    render() {
        return (
            <div className='GameSettingsPrompt'>
                {this.generateSettings(this.props.game.settings)}
            </div>
        )
    }

    generateSettings = (settings) => {
        return settings.map((setting) => {
            return <div key={setting.name} className='setting-section'>
                <span>{setting.name}</span>
                {setting.options.map((option) => {
                    return <button key={option.value} onClick={() => this.props.onOptionChosen(setting.name, option.value)}>{option.display}</button>
                })}
            </div>
        })
    }
}

export default GameSettingsPrompt