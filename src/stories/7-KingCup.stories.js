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
    table: ['b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b'],
    playingUser: {userId: 0, username: 'louis'},
    bottleStack: [],
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
    }
}