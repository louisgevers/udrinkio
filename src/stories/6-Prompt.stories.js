import React from 'react';
import Prompt from '../component/Prompt/Prompt.js';
import UsernameInput from '../component/UsernamePrompt/UsernameInput/UsernameInput.js'

export default {
    title: 'Prompt',
    component: Prompt
}

export const UsernamePrompt = () => <Prompt primaryColor={state.game.primaryColor} secondaryColor={state.game.secondaryColor} title={state.game.name}>
    <span>Username</span>
    <UsernameInput onNameChange={() => {}} />
    <button className="prompt-create-button" style={{backgroundColor: state.game.secondaryColor}}>Start party</button>
</Prompt>;

const state = {
    table: [['b', 'b', 'b'], ['b', 'b', 'b'], ['b', '8c', '5h']],
    game: {
        "id": "minefield",
        "name": "MINE FIELD",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "minefield.png",
        "primaryColor": "#333333",
        "primaryDark": "#111111",
        "secondaryColor": "#FC0F3B"
    }
}