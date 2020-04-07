import React from 'react';
import FTheDealerGame from '../component/GameScreen/FTheDealerGame/FTheDealerGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'FTheDealerGame',
    component: FTheDealerGame
}

export const Simple = () => <FTheDealerGame gameState={state} socket={socket} session={session} />

const state = {
    table: [['1s'],[],['3h','3c','3s','3d'],[],[],[],['7c'],[],[],[],[],[],['kd','ks']],
    dealer: 0,
    currentCard: 'qh'
}

const session = {
    game: {
        "id": "fthedealer",
        "name": "F*CK THE DEALER",
        "minPlayers": 2,
        "maxPlayers": 12,
        "imageName": "fthedealer.png",
        "primaryColor": "#006B38",
        "primaryDark": "#095e36",
        "secondaryColor": "#101820"
    },
    userId: 0,
    host: 0
}