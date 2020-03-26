import React from 'react';
import MineFieldGame from '../component/GameScreen/MineFieldGame/MineFieldGame.js';

export default {
    title: 'MineFieldGame',
    component: MineFieldGame
}

export const Simple = () => <MineFieldGame state={state} />;

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