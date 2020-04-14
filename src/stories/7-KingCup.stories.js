import React from 'react';
import KingCupGame from '../component/GameScreen/KingCupGame/KingCupGame.js';
import MockedSocket from 'socket.io-mock';

const socket = new MockedSocket();

export default {
    title: 'KingCupGame',
    component: KingCupGame
}

export const Simple = () => (
    <div style={{height: '100vh'}}>
        <style dangerouslySetInnerHTML={{__html: `
            .game-component { height: 100% }
        `}} />
        <KingCupGame gameState={state} socket={socket} session={session} />
    </div>
)

const state = {
    table: ['b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','jc','3h','5s','6s','b','7h','b','b','b','qh','1c','5s','b','b','b','b','b','b','b','b','b','b','b'],
    playingUser: {userId: 0, username: 'louis'},
    bottleStack: ['qh', '1s', '3c'],
    lastCard: null
}

const session = {
    game: { "id": "kingcup",
        "name": "KING CUP",
        "minPlayers": 2,
        "maxPlayers": 12,
        "imageName": "king-cup.png",
        "primaryColor": "#FC0F3B",
        "primaryDark": "#C01A38",
        "secondaryColor": "#3FA2BE"
    },
    userId: 1
}