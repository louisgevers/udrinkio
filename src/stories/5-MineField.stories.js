import React from 'react';
import MineFieldGame from '../component/GameScreen/MineFieldGame/MineFieldGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'MineFieldGame',
    component: MineFieldGame
}

export const Simple = () => (
    <div style={{height: '100vh'}}>
        <style dangerouslySetInnerHTML={{__html: `
            .game-component { height: 100% }
        `}} />
        <MineFieldGame gameState={state} session={session} socket={socket} />
    </div>
)

const users = new Map()
users.set(0, 'Louis')
users.set(1, 'Tutur')
users.set(2, 'Panda')

const playingUser = 0

const state = {
    table: [['1s', 'b', 'qh'], ['8h', 'b', '8c'], ['7c', '8c', 'b']],
    users: JSON.stringify(Array.from(users)),
    playingUser: {userId: playingUser, username: users.get(playingUser)},
    order: [1, 0, 2],
    lastCard: {row: 1, column: 2}
}

const session = {
    game: {
        "id": "minefield",
        "name": "MINE FIELD",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "minefield.png",
        "primaryColor": "#333333",
        "primaryDark": "#111111",
        "secondaryColor": "#FC0F3B"
    },
    userId: 1
}