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
                        <li>If you want to <b>SUPPORT</b> us, follow us and <b>SHARE</b> your moments with your friends on <b>INSTAGRAM</b> <a href='https://www.instagram.com/udrink.io/' target='_blank' rel='noopener noreferrer'>@udrink.io</a>!</li>
                        <li><i>Udrink.io</i> is a social game, video call your friends and share some music!</li>
                        <li>You can disconnect and reconnect at any time, even during the game. Your friends can therefore join the game later on using the link shown in the browser.</li>
                        <li>If you encounter an issue of want to make a suggestion, contact us at <a href='mailto:udrink.io@gmail.com'>udrink.io@gmail.com</a> or on <b>INSTAGRAM</b> <a href='https://www.instagram.com/udrink.io/' target='_blank' rel='noopener noreferrer'>@udrink.io</a></li>
                    </ul>
                </Prompt>
            </div>
        )
    }
}

export default EntryInfoPrompt