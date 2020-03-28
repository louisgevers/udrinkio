import React from 'react';
import MineFieldGame from '../component/GameScreen/MineFieldGame/MineFieldGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'MineFieldGame',
    component: MineFieldGame
}

export const Simple = () => <MineFieldGame gameState={state} socket={socket} game={state.game} />;

const state = {
    table: [['1s', '1c', 'qh'], ['ks', 'jh', '8c'], ['7c', '8c', '5h']],
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