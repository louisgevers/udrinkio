import React from 'react';
import PyramidGame from '../component/GameScreen/PyramidGame/PyramidGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'PyramidGame',
    component: PyramidGame
}

export const Simple = () => <PyramidGame gameState={state} socket={socket} session={session} />;

// UserID -> cards
const cardsMap = new Map()
cardsMap.set(0, ['b', 'b', 'b', 'b'])
cardsMap.set(1, ['b', 'b', 'b', 'b'])
cardsMap.set(2, ['b', 'b', 'b', 'b'])
cardsMap.set(3, ['b', 'b', 'b', 'b'])
cardsMap.set(4, ['b', 'b', 'b', 'b'])
cardsMap.set(5, ['b', 'b', 'b', 'b'])

const usersMap = new Map()
usersMap.set(0, 'Louis')
usersMap.set(1, 'Arthur')
usersMap.set(2, 'Panda')
usersMap.set(3, 'Eliott')
usersMap.set(4, 'Alex')
usersMap.set(5, 'Doddo')


const state = {
    pyramid: ['qh','b','b','b','b','b', 'b', 'b', 'b', 'b'],
    hands: cardsMap,
    users: usersMap
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
    },
    userId: 0
}