import React, { Component } from 'react'
import './EntryInfoPrompt.css'

import Prompt from '../Prompt/Prompt'

class EntryInfoPrompt extends Component {
    render = () => {
        return (
            <div className='EntryInfoPrompt'>
                <Prompt primaryColor={this.props.game.primaryColor} secondaryColor={this.props.game.secondaryColor} title={`Before you start`}>
                    <p><b>Agree to the following terms to close this window:</b></p>
                    <ul>
                        <li>Every player is over the legal drinking age</li>
                        <li>Every player will drink responsibly</li>
                    </ul>
                    <button onClick={this.props.onClose} style={{backgroundColor: this.props.game.secondaryColor}}>I AGREE</button>
                    <p><b>Suggestions</b></p>
                    <ul>
                        <li><i>Udrink.io</i> is a social game, video call your friends and share some music!</li>
                        <li><i>Udrink.io</i> is built for PCs and tablets. We do not recommend playing on a mobile device due to small screen size.</li>
                        <li><i>Udrink.io</i> works best on Microsoft Edge, but other browsers are widely supported.</li>
                        <li>You can disconnect and reconnect at any time, even during the game. Your late friends can therefore join the game later on.</li>
                        <li>If you encounter an issue, please let us know. Refreshing the page (F5) might help in the meantime.</li>
                    </ul>
                </Prompt>
            </div>
        )
    }
}

export default EntryInfoPrompt