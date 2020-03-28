import React, { Component } from 'react'
import './GameSettingsPrompt.css'

import Prompt from '../Prompt/Prompt.js'

class GameSettingsPrompt extends Component {

    render() {
        return (
            <div className='GameSettingsPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={`${this.props.game.name} SETTINGS`} onClose={this.props.onClose}>
                    {this.generateSettings(this.props.game.settings)}
                </Prompt>
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