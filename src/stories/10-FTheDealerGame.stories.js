import React from 'react';
import FTheDealerGame from '../component/GameScreen/FTheDealerGame/FTheDealerGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'FTheDealerGame',
    component: FTheDealerGame
}

export const Simple = () => <FTheDealerGame gameState={state} socket={socket} session={session} />

const users = new Map()
users.set(0, 'Louis')
users.set(1, 'Arthur')
users.set(2, 'William')
users.set(3, 'Elvis')
users.set(4, 'Panda')
users.set(5, 'Kakker')
users.set(6, 'Alex')
users.set(7, 'Knut')
users.set(8, 'Doddo')
users.set(9, 'Niel')
users.set(10, 'Merlin')
users.set(11, 'Loriss')


const state = {
    table: [['1s'],[],['3h','3c','3s','3d'],[],[],[],['7c'],[],[],[],[],[],['kd','ks']],
    dealer: 11,
    currentCard: '1c',
    users: users,
    order: [4,3,2,1,0,5,6,7,11,10,9,8]
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
    userId: 8,
    host: 0
}