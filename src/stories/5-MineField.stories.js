import React from 'react';
import MineFieldGame from '../component/GameScreen/MineFieldGame/MineFieldGame.js';

export default {
    title: 'MineFieldGame',
    component: MineFieldGame
}

export const Simple = () => <MineFieldGame state={state} />;

const state = {
    table: [['kc', '1s', 'kc'], ['qs', '4h', '6h'], ['1c', '8c', '5h']],
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