import React from 'react';
import PyramidGame from '../component/GameScreen/PyramidGame/PyramidGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'PyramidGame',
    component: PyramidGame
}

export const Simple = () => <PyramidGame gameState={state} socket={socket} session={session} />;

const state = {
    pyramid: ['qh','b','b','b','b','b', 'b', 'b', 'b', 'b']
}

const session = {
    game: {
        "id": "pyramid",
        "name": "PYRAMID",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "pyramid.png",
        "primaryColor": "#6D534B",
        "primaryDark": "#5C4944",
        "secondaryColor": "#EEB711",
        "settings": [],
        "comingSoon": true
    }
}