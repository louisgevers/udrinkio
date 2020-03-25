import React from 'react';
import Chat from '../component/Chat/Chat.js'

export default {
    title: 'Chat',
    component: Chat
}

export const Empty = () => <Chat game={game} />;

// DATA

const game = {
    "id": "kingcup",
    "name": "KING CUP",
    "minPlayers": 2,
    "maxPlayers": 8,
    "imageName": "king-cup.png",
    "primaryColor": "#FC0F3B",
    "primaryDark": "#C01A38",
    "secondaryColor": "#3FA2BE"
}